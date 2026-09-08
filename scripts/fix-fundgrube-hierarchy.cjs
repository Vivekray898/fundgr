require("dotenv").config();

const { createClient } = require("@sanity/client");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("❌ Missing Sanity environment variables.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

/*
|--------------------------------------------------------------------------
| Desired hierarchy
|--------------------------------------------------------------------------
|
| Fundgrube
|   ├── Main Category
|   │     ├── Sub Category
|   │     └── Sub Category
|   └── Main Category
|
*/

const hierarchy = {
  "Garten & Pflanzen": [
    "Blumen",
    "Blumentöpfe",
    "Gartenwerkzeuge",
    "Rindenmulch",
    "Ziersteine",
    "Zimmerpflanzen",
    "Setzlinge & Kräuter",
    "Samen & Blumenzwiebeln",
    "Blumenerde & Dünger",
  ],

  Automotive: [
    "Autozubehör",
    "Fahrradzubehör",
  ],

  Brennstoffe: [],

  "Baumarkt & Werkzeuge": [
    "Werkzeuge",
    "Schrauben & Befestigung",
    "Farben",
    "Malerzubehör",
    "Plastikartikel",
  ],

  Elektronik: [
    "Batterien",
    "Elektronikartikel",
    "Handy-Zubehör",
  ],

  "Gesundheit & Drogerie": [
    "Drogerieartikel",
    "Pflaster & Balsam",
  ],

  "Mode & Accessoires": [
    "Gürtel",
    "Schuhe",
    "Taschen",
    "Textilien",
    "Wolle",
  ],

  "Wohnen & Haushalt": [
    "Dekoration",
    "Bilderrahmen",
    "Gardinenzubehör",
    "Haushaltswaren",
    "Kerzen",
  ],

  "Schreibwaren & Geschenke": [
    "Schreibwaren",
    "Lernmaterial",
    "Tüten & Karten",
    "Spielzeug",
  ],

  "Lebensmittel & Getränke": [],

  Reisebedarf: [],

  "Saisonale Artikel": [],
};


/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function findCategory(title) {
  return client.fetch(
    `*[
      _type == "category" &&
      lower(title) == lower($title)
    ] | order(_createdAt asc)[0]{
      _id,
      title,
      slug
    }`,
    { title }
  );
}

async function createCategory(title, parentId, order = 0) {
  console.log(`   ➕ Creating: ${title}`);

  return client.create({
    _type: "category",
    title,

    slug: {
      _type: "slug",
      current: slugify(title),
    },

    parent: {
      _type: "reference",
      _ref: parentId,
    },

    order,

    featured: false,
    showInNavigation: true,
  });
}

async function setParent(categoryId, parentId) {
  return client
    .patch(categoryId)
    .set({
      parent: {
        _type: "reference",
        _ref: parentId,
      },
    })
    .commit();
}


/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
*/

async function main() {
  console.log("\n🌳 Building Fundgrube category hierarchy...\n");

  /*
   * ---------------------------------------------------------------
   * 1. Find or create Fundgrube
   * ---------------------------------------------------------------
   */

  let fundgrube = await findCategory("Fundgrube");

  if (!fundgrube) {
    console.log("📁 Fundgrube doesn't exist. Creating...\n");

    fundgrube = await client.create({
      _type: "category",

      title: "Fundgrube",

      slug: {
        _type: "slug",
        current: "fundgrube",
      },

      description: "Alle Kategorien der Fundgrube",

      featured: true,

      order: 0,

      showInNavigation: true,
    });

    console.log(`✅ Created Fundgrube: ${fundgrube._id}\n`);
  } else {
    console.log(`✅ Found Fundgrube: ${fundgrube._id}\n`);
  }


  /*
   * ---------------------------------------------------------------
   * 2. Create / update MAIN categories
   * ---------------------------------------------------------------
   */

  for (const [mainTitle, subCategories] of Object.entries(hierarchy)) {

    console.log(`\n📂 ${mainTitle}`);

    let mainCategory = await findCategory(mainTitle);

    /*
     * Create main category if missing
     */
    if (!mainCategory) {
      mainCategory = await createCategory(
        mainTitle,
        fundgrube._id
      );
    } else {
      /*
       * Make sure MAIN category belongs directly
       * to Fundgrube.
       */
      await setParent(
        mainCategory._id,
        fundgrube._id
      );

      console.log(
        `   ↳ Parent set to Fundgrube`
      );
    }


    /*
     * -------------------------------------------------------------
     * 3. Create / update SUB categories
     * -------------------------------------------------------------
     */

    for (
      let i = 0;
      i < subCategories.length;
      i++
    ) {

      const subTitle = subCategories[i];

      let subCategory = await findCategory(subTitle);

      /*
       * Existing category
       */
      if (subCategory) {

        await setParent(
          subCategory._id,
          mainCategory._id
        );

        console.log(
          `   └── ${subTitle} → ${mainTitle}`
        );

      }

      /*
       * Missing category
       */
      else {

        subCategory = await createCategory(
          subTitle,
          mainCategory._id,
          i
        );

        console.log(
          `   └── ${subTitle} → created`
        );
      }
    }
  }


  /*
   * ---------------------------------------------------------------
   * 4. Print final hierarchy
   * ---------------------------------------------------------------
   */

  console.log("\n\n========================================");
  console.log("        FINAL CATEGORY TREE");
  console.log("========================================\n");

  console.log("Fundgrube");

  for (const [mainTitle, subCategories] of Object.entries(
    hierarchy
  )) {

    console.log(`├── ${mainTitle}`);

    subCategories.forEach((subTitle, index) => {

      const last =
        index === subCategories.length - 1;

      console.log(
        `│   ${last ? "└──" : "├──"} ${subTitle}`
      );
    });
  }

  console.log("\n✅ Category hierarchy completed.");
}

main().catch((error) => {
  console.error("\n❌ ERROR:");
  console.error(error);
  process.exit(1);
});