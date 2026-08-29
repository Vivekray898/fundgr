// scripts/migrate-from-backup.js
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import slugify from 'slugify'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
import dotenv from 'dotenv'
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

// Initialize new Sanity client (destination)
const newClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_READ_TOKEN,
  apiVersion: '2026-08-29',
  useCdn: false,
})

// Check if dry run
const isDryRun = process.argv.includes('--dry-run')

// Helper function to create slug
function createSlug(text) {
  if (!text) return 'unnamed'
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

// Parse NDJSON file
function parseNDJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    const lines = content.split('\n').filter(line => line.trim())
    return lines.map(line => JSON.parse(line))
  } catch (error) {
    console.error(`❌ Error parsing file: ${filePath}`, error.message)
    return []
  }
}

// Read all product documents from backup data.ndjson
function readBackupProducts(backupDir) {
  const dataFile = join(backupDir, 'data.ndjson')
  
  const allDocs = parseNDJSON(dataFile)
  
  // Filter only product documents (not drafts)
  const products = allDocs.filter(doc => 
    doc._type === 'product' && 
    !doc._id?.startsWith('drafts.')
  )
  
  return products
}

// Get existing brands from new project
async function getBrandMapping() {
  console.log('🏷️ Fetching existing brands from new project...')
  
  const brands = await newClient.fetch(`
    *[_type == "brand"] {
      _id,
      name,
      "slug": slug.current
    }
  `)

  const mapping = {}
  brands.forEach(brand => {
    const nameKey = brand.name?.toLowerCase().trim() || ''
    if (nameKey) {
      mapping[nameKey] = brand
    }
    if (brand.slug) {
      mapping[brand.slug] = brand
    }
  })

  return mapping
}

// Get existing categories from new project
async function getCategoryMapping() {
  console.log('📁 Fetching existing categories from new project...')
  
  const categories = await newClient.fetch(`
    *[_type == "category"] {
      _id,
      title,
      "slug": slug.current
    }
  `)

  const byTitle = {}
  const bySlug = {}
  
  categories.forEach(cat => {
    const key = cat.title?.toLowerCase().trim() || ''
    if (key) {
      if (!byTitle[key]) {
        byTitle[key] = []
      }
      byTitle[key].push(cat)
    }
    if (cat.slug) {
      bySlug[cat.slug] = cat
    }
  })

  return { byTitle, bySlug }
}

// Find matching brand
function findMatchingBrand(brandMapping, brandName) {
  if (!brandName) return null
  
  const key = brandName.toLowerCase().trim()
  const brand = brandMapping[key]
  
  if (brand) {
    return { _type: 'reference', _ref: brand._id }
  }
  
  return null
}

// Find matching category by title
function findMatchingCategory(categoryMapping, categoryTitle) {
  if (!categoryTitle) return null
  
  const key = categoryTitle.toLowerCase().trim()
  const { byTitle, bySlug } = categoryMapping
  
  const matches = byTitle[key]
  if (matches && Array.isArray(matches) && matches.length > 0) {
    return { _type: 'reference', _ref: matches[0]._id }
  }
  
  const slugKey = createSlug(categoryTitle)
  if (bySlug[slugKey]) {
    return { _type: 'reference', _ref: bySlug[slugKey]._id }
  }
  
  return null
}

// Get the variant title from the backup variant reference
function getVariantTitle(product) {
  if (!product.variant) return null
  
  // If variant is a reference with a title
  if (product.variant.title) {
    return product.variant.title
  }
  
  // If variant has a _ref, we need to look it up in the backup data
  // Since we're processing products one by one, we'll use a cache
  return null
}

// Map variant title to category title
function mapVariantToCategory(variantTitle) {
  if (!variantTitle) return null
  
  const variantMap = {
    'Gartengeräte': 'Gartenwerkzeuge',
    'Gartenwerkzeuge': 'Gartenwerkzeuge',
    'Grillzubehör': 'Gartenwerkzeuge',
    'Elektronikartikel': 'Elektronikartikel',
    'Kabel & Leitungen': 'Elektronikartikel',
    'Kabel': 'Elektronikartikel',
    'Elektronikzubehör': 'Elektronikartikel',
    'Zubehör': 'Elektronikartikel',
    'Schreibkalender': 'Schreibwaren & Geschenke',
    'Spielzeug für Kinder': 'Spielzeug',
    'Spielzeugautos': 'Spielzeug',
    'Spielwaren': 'Spielzeug',
    'Spielsets': 'Spielzeug',
    'Spielzeugsets': 'Spielzeug',
    'Figuren': 'Spielzeug',
    'Spielkarten': 'Spielzeug',
    'Puppen': 'Spielzeug',
    'Feuerwerk': 'Saisonale Artikel',
    'Feuerwerkskörper': 'Saisonale Artikel',
    'Brennstoffe': 'Baumarkt & Werkzeuge',
    'Zündlichter': 'Baumarkt & Werkzeuge',
    'Sneaker': 'Mode & Accessoires',
    'Damenmode': 'Mode & Accessoires',
    'Hosen': 'Mode & Accessoires',
    'T-Shirts': 'Mode & Accessoires',
    'Blusen': 'Mode & Accessoires',
    'Blusen & Hemden': 'Mode & Accessoires',
    'Büromaterial': 'Schreibwaren & Geschenke',
    'Kalender': 'Schreibwaren & Geschenke',
    'Plants': 'Garten & Pflanzen',
    'Standard': null,
    'Feuerwerkskorper': 'Saisonale Artikel',
    'spielwaren': 'Spielzeug',
    'schreibkalender': 'Schreibwaren & Geschenke',
    'buromaterial': 'Schreibwaren & Geschenke',
    'spielzeug-fur-kinder': 'Spielzeug'
  }
  
  const key = variantTitle.toLowerCase().trim()
  return variantMap[key] || null
}

// Extract category from product name (fallback)
function extractCategoryFromName(productName) {
  if (!productName) return null
  
  const keywords = {
    'Feuerwerk': ['feuerwerk', 'böller', 'rakete', 'knall', 'batterie', 'fontäne', 'vulkan', 'knallerbse', 'wunderstange', 'knallkraut', 'crackling', 'pyro', 'silvester'],
    'Gartenwerkzeuge': ['garten', 'pflanze', 'fliegenhaube', 'gartenhandschuh', 'gartenwerkzeug', 'grill', 'kaminholz', 'brikett'],
    'Elektronikartikel': ['kabel', 'elektronik', 'steckdose', 'schalter', 'zubehör', 'leitung', 'installationsmaterial'],
    'Spielzeug': ['spielzeug', 'puppe', 'barbie', 'schleich', 'spielset', 'figur', 'spielkarte', 'memo', 'blaster'],
    'Mode & Accessoires': ['socken', 'sneaker', 'damen', 'herren', 'bekleidung'],
    'Schreibwaren & Geschenke': ['kalender', 'notizbuch', 'schreibkalender'],
    'Saisonale Artikel': ['saison', 'frühling', 'weihnachten'],
    'Baumarkt & Werkzeuge': ['farbe', 'lack', 'dichtstoff', 'holzschutz', 'werkzeug'],
  }
  
  const lowerName = productName.toLowerCase()
  for (const [category, terms] of Object.entries(keywords)) {
    for (const term of terms) {
      if (lowerName.includes(term)) {
        return category
      }
    }
  }
  
  return null
}

// Process product data for import
function prepareProductData(product, categoryMapping, brandMapping, variantCache) {
  let categoryRefs = []
  let determinedCategory = null
  let variantValue = null
  
  // Strategy 1: Try to get variant title from the variant reference
  if (product.variant) {
    // If variant has a title directly
    if (product.variant.title) {
      variantValue = product.variant.title
      const mappedCategory = mapVariantToCategory(variantValue)
      if (mappedCategory) {
        determinedCategory = mappedCategory
      }
    }
    // If variant has a _ref, look it up in the cache
    else if (product.variant._ref && variantCache[product.variant._ref]) {
      variantValue = variantCache[product.variant._ref]
      const mappedCategory = mapVariantToCategory(variantValue)
      if (mappedCategory) {
        determinedCategory = mappedCategory
      }
    }
  }
  
  // Strategy 2: Extract category from product name
  if (!determinedCategory && product.name) {
    determinedCategory = extractCategoryFromName(product.name)
  }
  
  // If we found a category, try to match it to an existing category in the new project
  if (determinedCategory) {
    const categoryRef = findMatchingCategory(categoryMapping, determinedCategory)
    if (categoryRef) {
      categoryRefs.push(categoryRef)
    }
  }
  
  // Get brand
  let brandRef = null
  if (product.brand) {
    // Handle brand as a reference with title
    if (product.brand.title) {
      brandRef = findMatchingBrand(brandMapping, product.brand.title)
    }
    // If brand has a _ref, we could look it up, but we'll use the title
  }

  // If no brand found, try to determine from product name
  if (!brandRef && product.name) {
    const productName = product.name || ''
    if (productName.toLowerCase().includes('bestpreis') || productName.toLowerCase().includes('best preis')) {
      brandRef = findMatchingBrand(brandMapping, 'Bestpreis')
    } else if (productName.toLowerCase().includes('fundgrube') || productName.toLowerCase().includes('nico') || productName.toLowerCase().includes('roma')) {
      brandRef = findMatchingBrand(brandMapping, 'Fundgrube')
    }
  }

  // Build product data
  const productData = {
    _type: 'product',
    name: product.name || 'Unnamed Product',
    slug: product.slug || { _type: 'slug', current: createSlug(product.name || 'unnamed') },
    description: product.description || '',
    price: product.price || 0,
    discount: product.discount || 0,
    stock: product.stock || 999,
    status: product.status || 'new',
    isFeatured: product.isFeatured || false,
    images: product.images || [],
  }

  // Add the variant as a string (since your schema expects a string)
  // Try to get a meaningful variant value
  if (variantValue) {
    productData.variant = variantValue
  } else if (determinedCategory) {
    // Use the category as variant if we couldn't get the original variant
    productData.variant = determinedCategory
  }

  if (brandRef) {
    productData.brand = brandRef
  }

  if (categoryRefs.length > 0) {
    productData.categories = categoryRefs
  }

  return { productData, determinedCategory, variantValue }
}

// Main migration function
async function migrateProducts() {
  console.log('🚀 Starting product migration from backup to new Sanity project...')
  console.log(`📋 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log(`📁 Destination Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)
  console.log('')

  try {
    // Get existing data from new project
    const categoryMapping = await getCategoryMapping()
    const brandMapping = await getBrandMapping()
    
    // Log available categories
    const categoryNames = Object.keys(categoryMapping.byTitle || {})
    console.log(`📁 Found ${categoryNames.length} categories in new project`)
    console.log('📋 Available categories:')
    categoryNames.slice(0, 15).forEach(name => {
      console.log(`  - ${name}`)
    })
    if (categoryNames.length > 15) {
      console.log(`  ... and ${categoryNames.length - 15} more`)
    }
    console.log('')
    
    // Log available brands
    const brandNames = Object.keys(brandMapping)
    console.log(`🏷️ Found ${brandNames.length} brands in new project`)
    console.log('📋 Available brands:')
    brandNames.forEach(name => {
      console.log(`  - ${name}`)
    })
    console.log('')

    // Read products from backup data.ndjson
    const backupDir = join(__dirname, '../sanity-backup/production-export-2026-08-29t11-42-45-228z')
    console.log(`📂 Reading backup from: ${backupDir}`)
    
    const products = readBackupProducts(backupDir)
    console.log(`📊 Found ${products.length} products in backup`)
    console.log('')

    if (products.length === 0) {
      console.log('⚠️ No products found to migrate.')
      return
    }

    // Build variant cache from product variant documents in the backup
    console.log('🔍 Building variant cache...')
    const dataFile = join(backupDir, 'data.ndjson')
    const allDocs = parseNDJSON(dataFile)
    const variantCache = {}
    
    allDocs.forEach(doc => {
      if (doc._type === 'productVariant' && !doc._id?.startsWith('drafts.')) {
        variantCache[doc._id] = doc.title || ''
      }
    })
    console.log(`  Found ${Object.keys(variantCache).length} variants in cache`)
    console.log('')

    // Show sample products with their resolved variant
    console.log('📋 Sample products from backup:')
    products.slice(0, 10).forEach((p, i) => {
      let variantTitle = 'No variant'
      if (p.variant) {
        if (p.variant.title) {
          variantTitle = p.variant.title
        } else if (p.variant._ref && variantCache[p.variant._ref]) {
          variantTitle = variantCache[p.variant._ref]
        }
      }
      const brandTitle = p.brand?.title || 'No brand'
      console.log(`  ${i + 1}. ${p.name || 'Unnamed'} (Variant: ${variantTitle}, Brand: ${brandTitle})`)
    })
    console.log('')

    // Migrate products
    console.log('🔄 Starting product migration...')
    let created = 0
    let skipped = 0
    let errors = 0
    let noCategory = 0
    let noBrand = 0
    const categoryStats = {}

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        if (!product.name || product.name.trim() === '') {
          skipped++
          continue
        }

        const slug = product.slug?.current || createSlug(product.name)
        const existingProduct = await newClient.fetch(
          `*[_type == "product" && slug.current == $slug][0]`,
          { slug }
        )

        if (existingProduct) {
          skipped++
          continue
        }

        const { productData, determinedCategory, variantValue } = prepareProductData(
          product, 
          categoryMapping, 
          brandMapping, 
          variantCache
        )
        
        if (!productData.categories || productData.categories.length === 0) {
          if (noCategory < 20) {
            const variantInfo = variantValue || 'No variant'
            console.log(`  ⚠️ [${i + 1}/${products.length}] No category found for: ${product.name} (Variant: ${variantInfo})`)
          }
          noCategory++
        } else if (determinedCategory) {
          categoryStats[determinedCategory] = (categoryStats[determinedCategory] || 0) + 1
        }
        
        if (!productData.brand) {
          if (noBrand < 20) {
            console.log(`  ⚠️ [${i + 1}/${products.length}] No brand found for: ${product.name}`)
          }
          noBrand++
        }
        
        if (!isDryRun) {
          const result = await newClient.create(productData)
          created++
          if (created % 10 === 0) {
            console.log(`  ✅ [${i + 1}/${products.length}] Created: ${productData.name}`)
          }
        } else {
          if (created % 10 === 0) {
            console.log(`  🔍 [${i + 1}/${products.length}] Dry run: Would create: ${productData.name}`)
          }
          created++
        }

      } catch (error) {
        console.error(`  ❌ [${i + 1}/${products.length}] Error with "${product.name}":`, error.message)
        errors++
      }
    }

    console.log('')
    if (Object.keys(categoryStats).length > 0) {
      console.log('📊 Category assignment stats:')
      Object.entries(categoryStats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
          console.log(`  ${category}: ${count} products`)
        })
      console.log('')
    }

    console.log('🎉 Migration completed!')
    console.log('📊 Summary:')
    console.log(`  ✅ Products created: ${created}`)
    console.log(`  ⏭️ Products skipped (already exist): ${skipped}`)
    console.log(`  ⚠️ Products without categories: ${noCategory}`)
    console.log(`  ⚠️ Products without brands: ${noBrand}`)
    console.log(`  ❌ Errors: ${errors}`)
    console.log(`  📋 Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateProducts()