// scripts/migrate-products.js
import { createClient } from '@sanity/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import slugify from 'slugify'
import dotenv from 'dotenv'
import axios from 'axios'

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
    return parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
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

// Helper to extract product images from various formats
function extractImages(imageString) {
  if (!imageString) return []
  
  // Handle multiple images separated by commas or newlines
  const imageUrls = imageString.split(/[,\n]/).map(url => url.trim()).filter(url => url.length > 0)
  
  return imageUrls.map(url => {
    // Handle relative URLs
    if (url.startsWith('/')) {
      return `https://aliceblue-trout-833151.hostingersite.com${url}`
    }
    // Handle already full URLs
    if (url.startsWith('http')) {
      return url
    }
    // Handle filenames only
    return `https://aliceblue-trout-833151.hostingersite.com/wp-content/uploads/2026/03/${url}`
  })
}

// Function to upload image to Sanity
async function uploadImageToSanity(imageUrl) {
  try {
    // Download image
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      timeout: 30000,
    })

    // Get filename from URL
    const filename = imageUrl.split('/').pop() || 'image.jpg'
    
    // Upload to Sanity
    const asset = await client.assets.upload('image', response.data, {
      filename: filename,
    })
    
    return asset._id
  } catch (error) {
    console.error(`  ⚠️ Failed to upload image ${imageUrl}:`, error.message)
    return null
  }
}

// Extract category hierarchy
function parseCategoryHierarchy(categoryString) {
  if (!categoryString) return null
  const parts = categoryString.split('>').map(p => p.trim())
  return parts.filter(p => p.length > 0)
}

// Create or get category in Sanity
async function getOrCreateCategory(categoryPath, categoryMap) {
  if (!categoryPath || categoryPath.length === 0) return null
  
  let currentParent = null
  
  for (let i = 0; i < categoryPath.length; i++) {
    const categoryName = categoryPath[i]
    const key = categoryName.toLowerCase()
    
    // Check if we already have this category in our map
    if (categoryMap.has(key)) {
      currentParent = categoryMap.get(key)
      continue
    }
    
    const slug = createSlug(categoryName)
    
    try {
      // Check if category already exists in Sanity
      const existingCategory = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug }
      )
      
      let categoryId
      if (existingCategory) {
        categoryId = existingCategory._id
        console.log(`  ⏭️ Category already exists: ${categoryName}`)
      } else if (!isDryRun) {
        // Create new category
        const newCategory = {
          _type: 'category',
          title: categoryName,
          slug: {
            _type: 'slug',
            current: slug,
          },
          description: `Products in ${categoryName}`,
          featured: false,
          showInNavigation: true,
          order: i * 10,
          parent: currentParent ? { _type: 'reference', _ref: currentParent } : undefined,
        }
        
        const result = await client.create(newCategory)
        categoryId = result._id
        console.log(`  ✅ Created category: ${categoryName}`)
      } else {
        // Dry run - create temporary ID
        categoryId = `dry-run-category-${slug}`
        console.log(`  🔍 Dry run: Would create category: ${categoryName}`)
      }
      
      // Store in map
      categoryMap.set(key, categoryId)
      currentParent = categoryId
      
    } catch (error) {
      console.error(`  ❌ Error with category "${categoryName}":`, error.message)
      return null
    }
  }
  
  return currentParent
}

// Main migration function
async function migrateProducts() {
  console.log('🚀 Starting migration from WooCommerce to Sanity...')
  console.log(`📋 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log(`📁 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)
  console.log('')

  try {
    // Parse the CSV file
    const csvPath = path.join(__dirname, '../wc-product-export-27-8-2026-1787837892008.csv')
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at: ${csvPath}`)
      process.exit(1)
    }
    
    const products = parseCSVFile(csvPath)
    console.log(`📊 Found ${products.length} products in CSV`)
    console.log('')

    // Step 1: Create categories and get their IDs
    const categoryMap = new Map()
    
    console.log('📁 Processing categories...')
    
    // First pass: collect all unique category paths
    const categoryPaths = new Set()
    products.forEach(product => {
      if (product.Categories) {
        const path = parseCategoryHierarchy(product.Categories)
        if (path) {
          // Store full path for later processing
          categoryPaths.add(JSON.stringify(path))
        }
      }
    })

    console.log(`📁 Found ${categoryPaths.size} unique category paths`)
    
    // Sort category paths by length to create parent categories first
    const sortedPaths = Array.from(categoryPaths)
      .map(p => JSON.parse(p))
      .sort((a, b) => a.length - b.length)
    
    // Create categories in order
    for (const path of sortedPaths) {
      await getOrCreateCategory(path, categoryMap)
    }
    
    console.log('')

    // Step 2: Create brand
    console.log('🏷️ Processing brand...')
    const brandName = 'Fundgrube'
    const brandSlug = createSlug(brandName)
    let brandRef = null
    
    try {
      const existingBrand = await client.fetch(
        `*[_type == "brand" && slug.current == $slug][0]`,
        { slug: brandSlug }
      )

      if (existingBrand) {
        brandRef = { _type: 'reference', _ref: existingBrand._id }
        console.log(`  ⏭️ Brand already exists: ${brandName}`)
      } else if (!isDryRun) {
        const newBrand = {
          _type: 'brand',
          title: brandName,
          slug: {
            _type: 'slug',
            current: brandSlug,
          },
          description: 'Fundgrube brand products',
        }
        const result = await client.create(newBrand)
        brandRef = { _type: 'reference', _ref: result._id }
        console.log(`  ✅ Created brand: ${brandName}`)
      } else {
        brandRef = { _type: 'reference', _ref: `dry-run-brand-${brandSlug}` }
        console.log(`  🔍 Dry run: Would create brand: ${brandName}`)
      }
    } catch (error) {
      console.error(`  ❌ Error with brand:`, error.message)
    }
    
    console.log('')

    // Step 3: Migrate products
    console.log('📦 Migrating products...')
    console.log('')
    
    let created = 0
    let skipped = 0
    let errors = 0

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        // Skip if product name is empty
        if (!product.Name || product.Name.trim() === '') {
          skipped++
          continue
        }

        const slug = createSlug(product.Name)
        
        // Check if product already exists
        const existingProduct = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]`,
          { slug }
        )

        if (existingProduct) {
          console.log(`  ⏭️ [${i + 1}/${products.length}] Product already exists: ${product.Name}`)
          skipped++
          continue
        }

        // Get category references
        let categoryRefsArray = []
        if (product.Categories) {
          const path = parseCategoryHierarchy(product.Categories)
          if (path && path.length > 0) {
            // Get the last category in the hierarchy (most specific)
            const lastCategoryKey = path[path.length - 1].toLowerCase()
            if (categoryMap.has(lastCategoryKey)) {
              const categoryId = categoryMap.get(lastCategoryKey)
              categoryRefsArray = [{ _type: 'reference', _ref: categoryId }]
            } else {
              // Try to get the full path as a single category
              const fullPathKey = path.join(' > ').toLowerCase()
              if (categoryMap.has(fullPathKey)) {
                const categoryId = categoryMap.get(fullPathKey)
                categoryRefsArray = [{ _type: 'reference', _ref: categoryId }]
              }
            }
          }
        }

        // Parse price information
        const regularPrice = parseFloat(product['Regular price']) || 0
        const salePrice = parseFloat(product['Sale price']) || 0
        const finalPrice = salePrice > 0 ? salePrice : regularPrice
        
        // Calculate discount percentage
        let discount = 0
        if (regularPrice > 0 && salePrice > 0 && salePrice < regularPrice) {
          discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100)
        }

        // Get product status
        let status = 'new'
        if (product['Is featured?'] === '1') {
          status = 'hot'
        }
        if (salePrice > 0 && salePrice < regularPrice) {
          status = 'sale'
        }

        // Parse images
        const imageUrls = extractImages(product.Images)
        
        // Upload images to Sanity
        const imageAssets = []
        for (const imageUrl of imageUrls) {
          console.log(`  📸 Uploading image: ${imageUrl.split('/').pop()}`)
          const assetId = await uploadImageToSanity(imageUrl)
          if (assetId) {
            imageAssets.push({
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: assetId,
              },
            })
          }
        }
        
        // Determine product variant based on categories
        let variant = 'others'
        if (product.Categories) {
          const categories = product.Categories.toLowerCase()
          if (categories.includes('blumentöpfe') || categories.includes('pflanzgefäß')) {
            variant = 'appliances'
          }
        }

        // Create product data
        const productData = {
          _type: 'product',
          name: product.Name,
          slug: {
            _type: 'slug',
            current: slug,
          },
          description: product['Short description'] || product.Description || '',
          price: Math.round(finalPrice * 100) / 100,
          discount: discount,
          stock: parseInt(product.Stock) || 0,
          status: status,
          variant: variant,
          isFeatured: product['Is featured?'] === '1',
          images: imageAssets,
        }

        // Add brand if available
        if (brandRef) {
          productData.brand = brandRef
        }

        // Add categories
        if (categoryRefsArray.length > 0) {
          productData.categories = categoryRefsArray
        }

        // Create the product
        if (!isDryRun) {
          const result = await client.create(productData)
          created++
          console.log(`  ✅ [${i + 1}/${products.length}] Created: ${product.Name}`)
        } else {
          console.log(`  🔍 [${i + 1}/${products.length}] Dry run: Would create: ${product.Name}`)
          created++
        }

      } catch (error) {
        console.error(`  ❌ [${i + 1}/${products.length}] Error with "${product.Name}":`, error.message)
        errors++
      }
    }

    console.log('')
    console.log('🎉 Migration completed!')
    console.log('📊 Summary:')
    console.log(`  ✅ Products created: ${created}`)
    console.log(`  ⏭️ Products skipped: ${skipped}`)
    console.log(`  ❌ Errors: ${errors}`)
    console.log(`  📋 Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateProducts()