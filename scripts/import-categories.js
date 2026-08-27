// scripts/import-categories.js
import { createClient } from '@sanity/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import slugify from 'slugify'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Function to parse CSV file
function parseCSVFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    console.log(`📄 CSV file size: ${fileContent.length} bytes`)
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true, // Handle BOM (Byte Order Mark)
    })
    
    console.log(`📊 Parsed ${records.length} records from CSV`)
    return records
  } catch (error) {
    console.error(`❌ Error reading CSV file: ${error.message}`)
    process.exit(1)
  }
}

// Helper function to create slug
function createSlug(text) {
  if (!text) return 'unnamed'
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

// Main migration function
async function importCategories() {
  console.log('🚀 Starting category import from WooCommerce to Sanity...')
  console.log(`📋 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log(`📁 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)
  console.log('')

  try {
    // Parse the CSV file
    const csvPath = path.join(__dirname, '../product_categories-export-2026-08-27-16-13-47.csv')
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at: ${csvPath}`)
      console.error('Please make sure the CSV file is in the root of your project')
      process.exit(1)
    }
    
    const categories = parseCSVFile(csvPath)
    console.log(`📊 Found ${categories.length} categories in CSV`)
    console.log('')

    // Log first few categories to debug
    console.log('🔍 First 5 categories from CSV:')
    categories.slice(0, 5).forEach((cat, index) => {
      console.log(`  ${index + 1}. term_id: "${cat.term_id}", name: "${cat.name}", parent: "${cat.parent}"`)
    })
    console.log('')

    // Step 1: Build category map with parent relationships
    const categoryMap = new Map() // term_id -> { name, slug, parent_id, data }
    const categoryRefs = new Map() // term_id -> { _type: 'reference', _ref: categoryId }
    const createdCategories = []
    const skippedCategories = []
    const errorCategories = []

    // First pass: store all categories in map
    categories.forEach((cat, index) => {
      // Handle different possible field names
      const termId = parseInt(cat.term_id || cat['term_id'] || cat.id || index + 1)
      const parentId = parseInt(cat.parent || cat['parent'] || 0)
      const name = cat.name || cat['name'] || `Category ${termId}`
      const slug = cat.slug || cat['slug'] || createSlug(name)
      
      categoryMap.set(termId, {
        name: name,
        slug: slug,
        parent_id: parentId,
        description: cat.description || cat['description'] || `Products in ${name}`,
        display_type: cat.display_type || cat['display_type'] || 'default',
        thumbnail: cat.thumbnail || cat['thumbnail'] || null,
        original_data: cat,
        term_id: termId,
      })
    })

    console.log(`📁 Processing ${categoryMap.size} categories...`)
    console.log('')

    // Log all categories with their parent relationships
    console.log('📋 Category hierarchy:')
    const rootCategories = Array.from(categoryMap.values()).filter(c => c.parent_id === 0)
    rootCategories.forEach(root => {
      console.log(`  📂 ${root.name} (ID: ${root.term_id})`)
      const children = Array.from(categoryMap.values()).filter(c => c.parent_id === root.term_id)
      children.forEach(child => {
        console.log(`    📁 ${child.name} (ID: ${child.term_id}, parent: ${root.term_id})`)
      })
    })
    console.log('')

    // Step 2: Process categories in order (parents first)
    // Sort categories by parent_id to ensure parents are created first
    const sortedCategories = Array.from(categoryMap.entries())
      .sort((a, b) => {
        // Root categories first (parent = 0)
        if (a[1].parent_id === 0 && b[1].parent_id !== 0) return -1
        if (a[1].parent_id !== 0 && b[1].parent_id === 0) return 1
        return a[0] - b[0]
      })

    for (const [termId, categoryData] of sortedCategories) {
      try {
        const { name, slug, parent_id, description, term_id } = categoryData
        const slugCurrent = createSlug(slug || name)
        
        console.log(`  Processing: ${name} (term_id: ${term_id}, parent_id: ${parent_id})`)
        
        // Check if category already exists in Sanity
        const existingCategory = await client.fetch(
          `*[_type == "category" && slug.current == $slug][0]`,
          { slug: slugCurrent }
        )

        if (existingCategory) {
          console.log(`  ⏭️ Category already exists: ${name} (ID: ${existingCategory._id})`)
          categoryRefs.set(termId, { _type: 'reference', _ref: existingCategory._id })
          skippedCategories.push(name)
          continue
        }

        let parentRef = null
        // Get parent reference if this is a subcategory
        if (parent_id > 0 && categoryRefs.has(parent_id)) {
          parentRef = categoryRefs.get(parent_id)
          console.log(`    Parent found: ${categoryMap.get(parent_id)?.name || parent_id}`)
        } else if (parent_id > 0) {
          console.log(`    ⚠️ Parent not found in map: ${parent_id}`)
        }

        // Create category data
        const categoryDoc = {
          _type: 'category',
          title: name,
          slug: {
            _type: 'slug',
            current: slugCurrent,
          },
          description: description || `Products in ${name}`,
          featured: false,
          showInNavigation: true,
          order: termId, // Use term_id as order
          ...(parentRef && { parent: parentRef }),
        }

        // Create the category
        if (!isDryRun) {
          const result = await client.create(categoryDoc)
          categoryRefs.set(termId, { _type: 'reference', _ref: result._id })
          createdCategories.push(name)
          console.log(`  ✅ Created category: ${name} ${parentRef ? `(parent: ${categoryMap.get(parent_id)?.name || parent_id})` : '(root)'}`)
        } else {
          // Dry run
          const tempId = `dry-run-category-${slugCurrent}`
          categoryRefs.set(termId, { _type: 'reference', _ref: tempId })
          createdCategories.push(name)
          console.log(`  🔍 Dry run: Would create category: ${name} ${parentRef ? `(parent: ${categoryMap.get(parent_id)?.name || parent_id})` : '(root)'}`)
        }

      } catch (error) {
        console.error(`  ❌ Error with category "${categoryData.name}":`, error.message)
        errorCategories.push(categoryData.name)
      }
    }

    // Step 3: Print summary
    console.log('')
    console.log('🎉 Category import completed!')
    console.log('📊 Summary:')
    console.log(`  ✅ Categories created: ${createdCategories.length}`)
    console.log(`  ⏭️ Categories skipped: ${skippedCategories.length}`)
    console.log(`  ❌ Errors: ${errorCategories.length}`)
    console.log(`  📋 Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`)

    if (createdCategories.length > 0 && !isDryRun) {
      console.log('\n📝 Created categories:')
      createdCategories.forEach(name => console.log(`  - ${name}`))
    }

    if (skippedCategories.length > 0) {
      console.log('\n⏭️ Skipped categories (already exist):')
      skippedCategories.forEach(name => console.log(`  - ${name}`))
    }

    if (errorCategories.length > 0) {
      console.log('\n❌ Failed categories:')
      errorCategories.forEach(name => console.log(`  - ${name}`))
    }

    // Step 4: Verify the hierarchy
    if (!isDryRun && createdCategories.length > 0) {
      console.log('\n🔍 Verifying category hierarchy in Sanity...')
      
      const rootCategoriesSanity = await client.fetch(
        `*[_type == "category" && !defined(parent)] {
          _id,
          title,
          "slug": slug.current,
          "children": *[_type == "category" && parent._ref == ^._id] {
            _id,
            title,
            "slug": slug.current
          }
        }`
      )

      console.log(`📁 Found ${rootCategoriesSanity.length} root categories in Sanity:`)
      rootCategoriesSanity.forEach(root => {
        console.log(`  📂 ${root.title} (${root.children?.length || 0} subcategories)`)
        if (root.children && root.children.length > 0) {
          root.children.forEach(child => {
            console.log(`    📁 ${child.title}`)
          })
        }
      })
    }

  } catch (error) {
    console.error('❌ Category import failed:', error)
    process.exit(1)
  }
}

// Run the import
importCategories()