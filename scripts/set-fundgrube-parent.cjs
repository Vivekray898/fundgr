require("dotenv").config();

const { createClient } = require("@sanity/client");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("❌ Missing Sanity environment variables.");
  console.error(
    "Required: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

const MASTER_CATEGORY_NAME = "Fundgrube";

async function main() {
  console.log("🔎 Looking for master category:", MASTER_CATEGORY_NAME);

  // Find existing Fundgrube category
  let masterCategory = await client.fetch(
    `*[_type == "category" && lower(title) == lower($title)][0]{
      _id,
      title,
      slug
    }`,
    { title: MASTER_CATEGORY_NAME }
  );

  // Create Fundgrube if it doesn't exist
  if (!masterCategory) {
    console.log("📁 Fundgrube does not exist. Creating it...");

    const slug = MASTER_CATEGORY_NAME
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    masterCategory = await client.create({
      _type: "category",
      title: MASTER_CATEGORY_NAME,
      slug: {
        _type: "slug",
        current: slug,
      },
      description: "Master category for Fundgrube products.",
      featured: true,
      order: 0,
      showInNavigation: true,
    });

    console.log("✅ Created Fundgrube:", masterCategory._id);
  } else {
    console.log(
      `✅ Found Fundgrube: ${masterCategory.title} (${masterCategory._id})`
    );
  }

  // Get every other category
  const categories = await client.fetch(
    `*[
      _type == "category" &&
      _id != $masterId
    ] | order(order asc, title asc) {
      _id,
      title,
      "currentParent": parent->title
    }`,
    {
      masterId: masterCategory._id,
    }
  );

  console.log(`\n📦 Found ${categories.length} categories.\n`);

  if (categories.length === 0) {
    console.log("Nothing to update.");
    return;
  }

  // Show what will happen
  console.log("Categories that will be placed under Fundgrube:");

  categories.forEach((category, index) => {
    console.log(
      `${index + 1}. ${category.title}${
        category.currentParent
          ? ` (currently under: ${category.currentParent})`
          : ""
      }`
    );
  });

  console.log("\n🔄 Updating categories...\n");

  // Update all categories
  const transaction = client.transaction();

  for (const category of categories) {
    transaction.patch(category._id, {
      set: {
        parent: {
          _type: "reference",
          _ref: masterCategory._id,
        },
      },
    });
  }

  await transaction.commit();

  console.log(
    `\n✅ Successfully placed ${categories.length} categories under "${MASTER_CATEGORY_NAME}".`
  );

  console.log("\nHierarchy:");

  console.log(`Fundgrube`);

  categories.forEach((category) => {
    console.log(`  └── ${category.title}`);
  });
}

main().catch((error) => {
  console.error("\n❌ Error:");
  console.error(error.message);
  process.exit(1);
});