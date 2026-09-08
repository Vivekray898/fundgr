// scripts/create-bestpreis-hierarchy.cjs

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

const MASTER_CATEGORY = "Bestpreis";

// Categories from Fundgrube that should NOT be copied
const EXCLUDED_MAIN_CATEGORIES = [
  "Garten & Pflanzen",
];

// These are also excluded in case they somehow exist
// as top-level categories in the current Sanity data.
const EXCLUDED_CATEGORIES = [
  "Garten & Pflanzen",
  "Blumen",
  "Blumentöpfe",
  "Gartenwerkzeuge",
  "Rindenmulch",
  "Ziersteine",
  "Zimmerpflanzen",
  "Setzlinge & Kräuter",
  "Samen & Blumenzwiebeln",
  "Blumenerde & Dünger",
];


/*
|--------------------------------------------------------------------------
| Helpers
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


/*
|--------------------------------------------------------------------------
| Find category
|--------------------------------------------------------------------------
*/

async function findCategory(title) {
  return client.fetch(
    `*[
      _type == "category" &&
      lower(title) == lower($title)
    ] | order(_createdAt asc)[0]{
      _id,
      title,
      slug,
      description,
      teaserSubtitle,
      range,
      featured,
      image,
      categoryIcon,
      icon,
      isSeasonal,
      seasonalMessage,
      seasonalStart,
      seasonalEnd,
      seasonalIcon,
      showInNavigation,
      order,
      parent
    }`,
    { title }
  );
}


/*
|--------------------------------------------------------------------------
| Create Bestpreis category
|--------------------------------------------------------------------------
*/

async function createBestpreisCategory({
  source,
  title,
  parentId,
  order,
}) {
  console.log(`   ➕ Creating Bestpreis: ${title}`);

  const document = {
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
  };

  /*
   * Copy useful presentation/content fields
   * from the Fundgrube category where available.
   */

  if (source?.description) {
    document.description = source.description;
  }

  if (source?.teaserSubtitle) {
    document.teaserSubtitle = source.teaserSubtitle;
  }

  if (source?.range !== undefined && source?.range !== null) {
    document.range = source.range;
  }

  if (source?.image) {
    document.image = source.image;
  }

  if (source?.categoryIcon) {
    document.categoryIcon = source.categoryIcon;
  }

  if (source?.icon) {
    document.icon = source.icon;
  }

  if (source?.isSeasonal !== undefined) {
    document.isSeasonal = source.isSeasonal;
  }

  if (source?.seasonalMessage) {
    document.seasonalMessage = source.seasonalMessage;
  }

  if (source?.seasonalStart) {
    document.seasonalStart = source.seasonalStart;
  }

  if (source?.seasonalEnd) {
    document.seasonalEnd = source.seasonalEnd;
  }

  if (source?.seasonalIcon) {
    document.seasonalIcon = source.seasonalIcon;
  }

  return client.create(document);
}


/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
*/

async function main() {
  console.log("\n========================================");
  console.log("      BESTPREIS CATEGORY BUILDER");
  console.log("========================================\n");


  /*
   * ---------------------------------------------------------------
   * 1. Find Fundgrube
   * ---------------------------------------------------------------
   */

  const fundgrube = await findCategory("Fundgrube");

  if (!fundgrube) {
    throw new Error(
      '❌ "Fundgrube" category was not found.'
    );
  }

  console.log(
    `✅ Fundgrube found: ${fundgrube._id}\n`
  );


  /*
   * ---------------------------------------------------------------
   * 2. Find/create Bestpreis
   * ---------------------------------------------------------------
   */

  let bestpreis = await findCategory(MASTER_CATEGORY);

  if (!bestpreis) {
    console.log("📁 Bestpreis does not exist.");
    console.log("➕ Creating Bestpreis...\n");

    bestpreis = await client.create({
      _type: "category",

      title: "Bestpreis",

      slug: {
        _type: "slug",
        current: "bestpreis",
      },

      description:
        "Alle Kategorien des Bestpreis-Sortiments.",

      featured: true,

      order: 0,

      showInNavigation: true,
    });

    console.log(
      `✅ Bestpreis created: ${bestpreis._id}\n`
    );
  } else {
    console.log(
      `⚠️ Bestpreis already exists: ${bestpreis._id}`
    );

    console.log(
      "The script will NOT create another Bestpreis.\n"
    );
  }


  /*
   * ---------------------------------------------------------------
   * 3. Get Fundgrube MAIN categories
   * ---------------------------------------------------------------
   *
   * Only categories whose parent is Fundgrube.
   */

  const mainCategories = await client.fetch(
    `*[
      _type == "category" &&
      parent._ref == $fundgrubeId
    ] | order(order asc, title asc) {
      _id,
      title,
      description,
      teaserSubtitle,
      range,
      featured,
      image,
      categoryIcon,
      icon,
      isSeasonal,
      seasonalMessage,
      seasonalStart,
      seasonalEnd,
      seasonalIcon,
      showInNavigation,
      order
    }`,
    {
      fundgrubeId: fundgrube._id,
    }
  );


  console.log(
    `📦 Found ${mainCategories.length} Fundgrube main categories.\n`
  );


  /*
   * ---------------------------------------------------------------
   * 4. Process MAIN categories
   * ---------------------------------------------------------------
   */

  for (const sourceMain of mainCategories) {

    /*
     * Skip garden category
     */

    if (
      EXCLUDED_MAIN_CATEGORIES.some(
        (name) =>
          name.toLowerCase() ===
          sourceMain.title.toLowerCase()
      )
    ) {
      console.log(
        `🚫 Skipping: ${sourceMain.title}`
      );

      continue;
    }


    /*
     * Don't accidentally copy agricultural categories
     */

    if (
      EXCLUDED_CATEGORIES.some(
        (name) =>
          name.toLowerCase() ===
          sourceMain.title.toLowerCase()
      )
    ) {
      console.log(
        `🚫 Skipping excluded category: ${sourceMain.title}`
      );

      continue;
    }


    console.log(`\n📂 ${sourceMain.title}`);


    /*
     * Check whether Bestpreis already has this main category.
     *
     * IMPORTANT:
     * We check parent as well, so an existing Fundgrube
     * category will NOT be mistaken for the Bestpreis one.
     */

    let bestpreisMain = await client.fetch(
      `*[
        _type == "category" &&
        lower(title) == lower($title) &&
        parent._ref == $parentId
      ][0]{
        _id,
        title
      }`,
      {
        title: sourceMain.title,
        parentId: bestpreis._id,
      }
    );


    /*
     * Create if missing
     */

    if (!bestpreisMain) {

      bestpreisMain =
        await createBestpreisCategory({
          source: sourceMain,
          title: sourceMain.title,
          parentId: bestpreis._id,
          order: sourceMain.order ?? 0,
        });

    } else {

      console.log(
        `   ✓ Already exists: ${sourceMain.title}`
      );
    }


    /*
     * -------------------------------------------------------------
     * Find SUB CATEGORIES
     * -------------------------------------------------------------
     */

    const subCategories = await client.fetch(
      `*[
        _type == "category" &&
        parent._ref == $parentId
      ] | order(order asc, title asc) {
        _id,
        title,
        description,
        teaserSubtitle,
        range,
        featured,
        image,
        categoryIcon,
        icon,
        isSeasonal,
        seasonalMessage,
        seasonalStart,
        seasonalEnd,
        seasonalIcon,
        showInNavigation,
        order
      }`,
      {
        parentId: sourceMain._id,
      }
    );


    /*
     * -------------------------------------------------------------
     * Create SUB CATEGORIES
     * -------------------------------------------------------------
     */

    for (const sourceSub of subCategories) {

      /*
       * Skip agricultural / garden categories
       */

      if (
        EXCLUDED_CATEGORIES.some(
          (name) =>
            name.toLowerCase() ===
            sourceSub.title.toLowerCase()
        )
      ) {
        console.log(
          `   🚫 Skipping: ${sourceSub.title}`
        );

        continue;
      }


      /*
       * Check if this subcategory already exists
       * under the Bestpreis main category.
       */

      let bestpreisSub = await client.fetch(
        `*[
          _type == "category" &&
          lower(title) == lower($title) &&
          parent._ref == $parentId
        ][0]{
          _id,
          title
        }`,
        {
          title: sourceSub.title,
          parentId: bestpreisMain._id,
        }
      );


      /*
       * Create missing subcategory
       */

      if (!bestpreisSub) {

        await createBestpreisCategory({
          source: sourceSub,
          title: sourceSub.title,
          parentId: bestpreisMain._id,
          order: sourceSub.order ?? 0,
        });

      } else {

        console.log(
          `   └── ✓ Already exists: ${sourceSub.title}`
        );
      }
    }
  }


  /*
   * ---------------------------------------------------------------
   * Final output
   * ---------------------------------------------------------------
   */

  console.log("\n========================================");
  console.log("       BESTPREIS COMPLETE");
  console.log("========================================\n");

  console.log("Bestpreis");

  const finalMainCategories = await client.fetch(
    `*[
      _type == "category" &&
      parent._ref == $bestpreisId
    ] | order(order asc, title asc) {
      _id,
      title
    }`,
    {
      bestpreisId: bestpreis._id,
    }
  );

  for (const main of finalMainCategories) {

    console.log(`├── ${main.title}`);

    const children = await client.fetch(
      `*[
        _type == "category" &&
        parent._ref == $parentId
      ] | order(order asc, title asc) {
        title
      }`,
      {
        parentId: main._id,
      }
    );

    children.forEach((child, index) => {

      const last =
        index === children.length - 1;

      console.log(
        `│   ${last ? "└──" : "├──"} ${child.title}`
      );
    });
  }

  console.log("\n✅ Done.");
}

main().catch((error) => {
  console.error("\n❌ ERROR:");
  console.error(error.message);
  process.exit(1);
});