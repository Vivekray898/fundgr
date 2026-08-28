// scripts/merge-duplicate-categories.js
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

async function findDuplicateCategories() {
  console.log('🔍 Finding duplicate categories...')
  console.log(`📋 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log('')

  try {
    // Fetch all categories
    const allCategories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        slug,
        parent,
        description,
        featured,
        showInNavigation,
        order,
        "productCount": count(*[_type == "product" && references(^._id)])
      }
    `)

    console.log(`📊 Found ${allCategories.length} categories total`)
    console.log('')

    // Group categories by title (case insensitive)
    const groups = {}
    allCategories.forEach(cat => {
      const key = cat.title.toLowerCase().trim()
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(cat)
    })

    // Find duplicates (groups with more than 1 category)
    const duplicates = Object.entries(groups)
      .filter(([key, cats]) => cats.length > 1)
      .map(([key, cats]) => ({
        title: cats[0].title,
        categories: cats.sort((a, b) => {
          // Keep the one with products first, then the one with parent
          if (a.productCount > 0 && b.productCount === 0) return -1
          if (a.productCount === 0 && b.productCount > 0) return 1
          if (a.parent && !b.parent) return 1
          if (!a.parent && b.parent) return -1
          return 0
        })
      }))

    if (duplicates.length === 0) {
      console.log('✅ No duplicate categories found!')
      return
    }

    console.log(`⚠️ Found ${duplicates.length} duplicate category groups:`)
    duplicates.forEach(group => {
      console.log(`\n📂 "${group.title}" (${group.categories.length} duplicates):`)
      group.categories.forEach((cat, index) => {
        const isPrimary = index === 0
        const hasParent = cat.parent ? 'has parent' : 'root'
        const productCount = cat.productCount || 0
        console.log(`  ${isPrimary ? '⭐' : '  '} ID: ${cat._id} | ${hasParent} | ${productCount} products | ${isPrimary ? 'KEEP' : 'REMOVE'}`)
      })
    })

    if (isDryRun) {
      console.log('\n🔍 Dry run complete. Run without --dry-run to merge duplicates.')
      return
    }

    // Step 2: Merge duplicates
    console.log('\n🔄 Starting merge process...')
    
    let merged = 0
    let errors = 0

    for (const group of duplicates) {
      const primary = group.categories[0]
      const duplicatesToRemove = group.categories.slice(1)

      console.log(`\n📂 Merging "${primary.title}"...`)
      console.log(`  Primary: ${primary._id} (${primary.productCount || 0} products)`)

      for (const duplicate of duplicatesToRemove) {
        try {
          console.log(`  🔄 Processing duplicate: ${duplicate._id} (${duplicate.productCount || 0} products)`)

          // 1. Find all products that reference this duplicate category
          const productsWithDuplicate = await client.fetch(`
            *[_type == "product" && references($categoryId)] {
              _id,
              name
            }
          `, { categoryId: duplicate._id })

          console.log(`    Found ${productsWithDuplicate.length} products referencing this category`)

          // 2. Update products to reference the primary category instead
          if (productsWithDuplicate.length > 0) {
            for (const product of productsWithDuplicate) {
              // Get current categories
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

                console.log(`    ✅ Updated product: ${product.name || product._id}`)
              }
            }
          }

          // 3. Find and update child categories that reference this duplicate as parent
          const childCategories = await client.fetch(`
            *[_type == "category" && parent._ref == $categoryId] {
              _id,
              title
            }
          `, { categoryId: duplicate._id })

          if (childCategories.length > 0) {
            console.log(`    Found ${childCategories.length} child categories referencing this category`)
            for (const child of childCategories) {
              await client.patch(child._id)
                .set({ 
                  parent: { _type: 'reference', _ref: primary._id } 
                })
                .commit()
              console.log(`    ✅ Updated child category: ${child.title}`)
            }
          }

          // 4. Delete the duplicate category
          await client.delete(duplicate._id)
          console.log(`  ✅ Deleted duplicate category: ${duplicate._id}`)
          merged++

        } catch (error) {
          console.error(`  ❌ Error merging category ${duplicate._id}:`, error.message)
          errors++
        }
      }
    }

    // Step 3: Final summary
    console.log('\n🎉 Merge completed!')
    console.log('📊 Summary:')
    console.log(`  ✅ Categories merged: ${merged}`)
    console.log(`  ❌ Errors: ${errors}`)

    // Step 4: Show final category structure
    console.log('\n📁 Final category structure:')
    const finalCategories = await client.fetch(`
      *[_type == "category" && !defined(parent)] {
        _id,
        title,
        "slug": slug.current,
        "children": *[_type == "category" && parent._ref == ^._id] {
          _id,
          title,
          "slug": slug.current
        }
      } | order(title asc)
    `)

    finalCategories.forEach(root => {
      console.log(`  📂 ${root.title} (${root.children?.length || 0} subcategories)`)
      if (root.children && root.children.length > 0) {
        root.children.forEach(child => {
          console.log(`    📁 ${child.title}`)
        })
      }
    })

  } catch (error) {
    console.error('❌ Merge failed:', error)
    process.exit(1)
  }
}

// Run the merge
findDuplicateCategories()