import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";
import { headerType } from "./headerType";
import { footerType } from "./footerType";
import { settingsType } from './settings';
import store from "./store";
import { bannerType } from "./bannerType"; // Import the new banner type


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
    store,
    bannerType, // Add the new banner type here
    headerType,
    footerType,
    settingsType,

  ],
};
