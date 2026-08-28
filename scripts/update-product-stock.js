// scripts/update-product-stock.js
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

// The stock quantity to set
const STOCK_QUANTITY = 999

async function updateProductStock() {
  console.log('📦 Updating product stock quantities...')
  console.log(`📋 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`)
  console.log(`📊 Stock quantity to set: ${STOCK_QUANTITY}`)
  console.log(`📁 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)
  console.log('')

  try {
    // Fetch all products
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        stock,
        "slug": slug.current
      } | order(name asc)
    `)

    console.log(`📊 Found ${products.length} products total`)
    console.log('')

    if (products.length === 0) {
      console.log('⚠️ No products found to update.')
      return
    }

    // Show products with their current stock
    console.log('📋 Current stock levels:')
    products.forEach((product, index) => {
      const currentStock = product.stock || 0
      console.log(`  ${index + 1}. ${product.name} | Stock: ${currentStock}`)
    })
    console.log('')

    // Count how many products need updating
    const productsToUpdate = products.filter(p => (p.stock || 0) !== STOCK_QUANTITY)
    const productsAlreadyCorrect = products.filter(p => (p.stock || 0) === STOCK_QUANTITY)

    console.log(`📊 Products to update: ${productsToUpdate.length}`)
    console.log(`✅ Products already at ${STOCK_QUANTITY}: ${productsAlreadyCorrect.length}`)
    console.log('')

    if (isDryRun) {
      console.log('🔍 Dry run complete. Run without --dry-run to update stock.')
      console.log('\n📝 Products that would be updated:')
      productsToUpdate.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} | ${product.stock || 0} → ${STOCK_QUANTITY}`)
      })
      return
    }

    // Update products in batches
    console.log('🔄 Starting stock update...')
    let updated = 0
    let errors = 0
    let skipped = 0

    // Process in batches of 10 to avoid rate limiting
    const batchSize = 10
    const totalBatches = Math.ceil(productsToUpdate.length / batchSize)

    for (let i = 0; i < productsToUpdate.length; i += batchSize) {
      const batch = productsToUpdate.slice(i, i + batchSize)
      const batchNumber = Math.floor(i / batchSize) + 1
      
      console.log(`\n📦 Batch ${batchNumber}/${totalBatches} (${batch.length} products)`)

      await Promise.all(batch.map(async (product) => {
        try {
          await client.patch(product._id)
            .set({ stock: STOCK_QUANTITY })
            .commit()
          
          console.log(`  ✅ ${product.name}: ${product.stock || 0} → ${STOCK_QUANTITY}`)
          updated++
        } catch (error) {
          console.error(`  ❌ Error updating ${product.name}:`, error.message)
          errors++
        }
      }))

      // Small delay between batches
      if (i + batchSize < productsToUpdate.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Verify the updates
    console.log('\n🔍 Verifying updates...')
    const verifyProducts = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        stock
      }
    `)

    const notUpdated = verifyProducts.filter(p => p.stock !== STOCK_QUANTITY)
    const updatedCount = verifyProducts.filter(p => p.stock === STOCK_QUANTITY).length

    console.log(`✅ Products with stock = ${STOCK_QUANTITY}: ${updatedCount}/${verifyProducts.length}`)
    
    if (notUpdated.length > 0) {
      console.log(`⚠️ Products not at ${STOCK_QUANTITY}:`)
      notUpdated.forEach(p => {
        console.log(`  - ${p.name}: ${p.stock}`)
      })
    }

    // Final summary
    console.log('\n🎉 Stock update completed!')
    console.log('📊 Summary:')
    console.log(`  ✅ Products updated: ${updated}`)
    console.log(`  ⏭️ Products skipped (already correct): ${skipped || productsAlreadyCorrect.length}`)
    console.log(`  ❌ Errors: ${errors}`)
    console.log(`  📋 Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`)

  } catch (error) {
    console.error('❌ Stock update failed:', error)
    process.exit(1)
  }
}

// Run the update
updateProductStock()