// scripts/merge-garten-pflanzen.js
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in environment variables')
  process.exit(1)
}

if (!process.env.SANITY_API_READ_TOKEN) {
  console.error('❌ Missing SANITY_API_READ_TOKEN in environment variables')
  process.exit(1)
}

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_READ_TOKEN,
  apiVersion: '2026-08-27',
  useCdn: false,
})

// Check if dry run
const isDryRun = process.argv.includes('--dry-run')

async function mergeGartenPflanzen() {
  console.log('🔍 Finding "Garten & Pflanzen" categories...')
  console.log(`📋 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log('')

  try {
    // Find all "Garten & Pflanzen" categories
    const gartenCategories = await client.fetch(`
      *[_type == "category" && title match "Garten & Pflanzen*"] {
        _id,
        title,
        slug,
        parent,
        description,
        featured,
        showInNavigation,
        order,
        "productCount": count(*[_type == "product" && references(^._id)]),
        "children": *[_type == "category" && parent._ref == ^._id] {
          _id,
          title,
          "slug": slug.current
        }
      }
    `)

    console.log(`📊 Found ${gartenCategories.length} "Garten & Pflanzen" categories:`)
    gartenCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ID: ${cat._id}`)
      console.log(`     Title: ${cat.title}`)
      console.log(`     Slug: ${cat.slug?.current || 'no slug'}`)
      console.log(`     Products: ${cat.productCount || 0}`)
      console.log(`     Children: ${cat.children?.length || 0}`)
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach(child => {
          console.log(`       - ${child.title} (${child._id})`)
        })
      }
      console.log('')
    })

    if (gartenCategories.length < 2) {
      console.log('✅ Only one "Garten & Pflanzen" category found. No merge needed.')
      return
    }

    // Determine which category to keep
    // Keep the one with more products, or the one with children
    const primary = gartenCategories.sort((a, b) => {
      // Prefer category with products
      if (a.productCount > 0 && b.productCount === 0) return -1
      if (a.productCount === 0 && b.productCount > 0) return 1
      // Prefer category with children
      if (a.children && a.children.length > 0 && (!b.children || b.children.length === 0)) return -1
      if (!a.children || a.children.length === 0 && b.children && b.children.length > 0) return 1
      return 0
    })[0]

    console.log(`⭐ Primary category to keep:`)
    console.log(`  ID: ${primary._id}`)
    console.log(`  Title: ${primary.title}`)
    console.log(`  Slug: ${primary.slug?.current || 'no slug'}`)
    console.log(`  Products: ${primary.productCount || 0}`)
    console.log(`  Children: ${primary.children?.length || 0}`)
    console.log('')

    const duplicates = gartenCategories.filter(cat => cat._id !== primary._id)
    console.log(`🗑️ Categories to remove (${duplicates.length}):`)
    duplicates.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.title} (${cat.productCount || 0} products, ${cat.children?.length || 0} children)`)
    })
    console.log('')

    if (isDryRun) {
      console.log('🔍 Dry run complete. Run without --dry-run to merge.')
      return
    }

    // Step 2: Perform the merge
    console.log('🔄 Starting merge process...')
    let merged = 0
    let errors = 0

    for (const duplicate of duplicates) {
      try {
        console.log(`\n📂 Processing duplicate: ${duplicate._id}`)

        // 1. Move all child categories to the primary
        if (duplicate.children && duplicate.children.length > 0) {
          console.log(`  Moving ${duplicate.children.length} child categories to primary...`)
          for (const child of duplicate.children) {
            await client.patch(child._id)
              .set({ 
                parent: { _type: 'reference', _ref: primary._id } 
              })
              .commit()
            console.log(`    ✅ Moved child: ${child.title}`)
          }
        }

        // 2. Update all products to reference the primary category
        const productsWithDuplicate = await client.fetch(`
          *[_type == "product" && references($categoryId)] {
            _id,
            name
          }
        `, { categoryId: duplicate._id })

        if (productsWithDuplicate.length > 0) {
          console.log(`  Updating ${productsWithDuplicate.length} products to use primary category...`)
          for (const product of productsWithDuplicate) {
            const productData = await client.fetch(`
              *[_type == "product" && _id == $productId][0] {
                _id,
                categories
              }
            `, { productId: product._id })

            if (productData.categories) {
              // Replace duplicate with primary
              const updatedCategories = productData.categories.map(ref => {
                if (ref._ref === duplicate._id) {
                  return { _type: 'reference', _ref: primary._id }
                }
                return ref
              })

              // Remove duplicates from the array
              const uniqueCategories = updatedCategories.filter((ref, index, self) => 
                index === self.findIndex(r => r._ref === ref._ref)
              )

              await client.patch(product._id)
                .set({ categories: uniqueCategories })
                .commit()
            }
            console.log(`    ✅ Updated product: ${product.name || product._id}`)
          }
        }

        // 3. Delete the duplicate category
        await client.delete(duplicate._id)
        console.log(`  ✅ Deleted duplicate: ${duplicate._id}`)
        merged++

      } catch (error) {
        console.error(`  ❌ Error processing duplicate ${duplicate._id}:`, error.message)
        errors++
      }
    }

    // Step 3: Final summary
    console.log('\n🎉 Merge completed!')
    console.log('📊 Summary:')
    console.log(`  ✅ Categories merged: ${merged}`)
    console.log(`  ❌ Errors: ${errors}`)

    // Step 4: Show final structure
    console.log('\n📁 Final "Garten & Pflanzen" structure:')
    const finalCategory = await client.fetch(`
      *[_type == "category" && _id == $id][0] {
        _id,
        title,
        "slug": slug.current,
        "children": *[_type == "category" && parent._ref == ^._id] {
          _id,
          title,
          "slug": slug.current,
          "productCount": count(*[_type == "product" && references(^._id)])
        } | order(title asc)
      }
    `, { id: primary._id })

    if (finalCategory) {
      console.log(`  📂 ${finalCategory.title} (${finalCategory.children?.length || 0} subcategories)`)
      if (finalCategory.children && finalCategory.children.length > 0) {
        finalCategory.children.forEach(child => {
          console.log(`    📁 ${child.title} (${child.productCount || 0} products)`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Merge failed:', error)
    process.exit(1)
  }
}

// Run the merge
mergeGartenPflanzen()