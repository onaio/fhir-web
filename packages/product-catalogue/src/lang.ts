import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ADD_PRODUCT = i18n.t(`Add product to catalogue`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.PRODUCT_CATALOGUE = i18n.t(`Product Catalogue`, { ns: namespace });
  lang.ADD_PRODUCT_TO_CATALOGUE = i18n.t(` + Add product to catalogue`, { ns: namespace });
  lang.PRODUCT_NAME_TH = i18n.t(`Product Name`, { ns: namespace });
  lang.ID_TH = i18n.t(`ID`, { ns: namespace });
  lang.ACTIONS_TH = i18n.t(`Actions`, { ns: namespace });
  lang.LOADING_ELLIPSIS = i18n.t(`Loading...`, { ns: namespace });
  lang.FETCHING_PRODUCT = i18n.t(`Fetching product Catalogue`, { ns: namespace });
  lang.FETCHING_PRODUCT_DESCRIPTION = i18n.t(`Please wait, as we fetch the product Catalogue.`, {
    ns: namespace,
  });
  lang.REQUIRED = i18n.t(`Required`, { ns: namespace });
  lang.YES = i18n.t(`yes`, { ns: namespace });
  lang.NO = i18n.t(`no`, { ns: namespace });
  lang.SUCCESSFULLY_UPDATED = i18n.t(`Successfully Updated`, { ns: namespace });
  lang.SUCCESSFULLY_ADDED = i18n.t(`Successfully Added`, { ns: namespace });
  lang.ENTER_PRODUCTS_NAME = `Enter the product's name e.g Midwifery Kit`;
  lang.PRODUCT_NAME = i18n.t(`Product name`, { ns: namespace });
  lang.UNIQUE_ID = i18n.t(`Unique ID`, { ns: namespace });
  lang.MATERIAL_NUMBER = i18n.t(`Material number`, { ns: namespace });
  lang.CREATED = i18n.t(`Created`, { ns: namespace });
  lang.LAST_UPDATED = i18n.t(`Last Updated`, { ns: namespace });
  lang.SERVER_VERSION = i18n.t(`Server version`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.PHOTO_OF_THE_PRODUCT = i18n.t(`Photo of the product (optional)`, { ns: namespace });
  lang.ACCOUNTABILITY_PERIOD = i18n.t(`Accountability period (in months)`, { ns: namespace });
  lang.DESCRIBE_THE_PRODUCTS_USE = i18n.t(
    `Describe the product's intended use at the service point`,
    { ns: namespace }
  );
  lang.USED_APPROPRIATELY = i18n.t(`Is it being used appropriately? (optional)`, { ns: namespace });
  lang.CONDITION_PLACEHOLDER = i18n.t(
    `Describe how a supply monitor would assess whether the product is in good condition`,
    { ns: namespace }
  );
  lang.CONDITION_LABEL = i18n.t(`Is it in good condition? (optional)`, { ns: namespace });
  lang.AVAILABILITY_PLACEHOLDER = i18n.t(
    `Describe where a supply monitor can locate this product at the service point.`,
    { ns: namespace }
  );
  lang.AVAILABILITY_LABEL = i18n.t(`Is it there?`, { ns: namespace });
  lang.ATTRACTIVE_ITEM_LABEL = i18n.t(`Attractive item?`, { ns: namespace });
  lang.MATERIAL_NUMBER_PLACEHOLDER = i18n.t(`Enter the product's material number`, {
    ns: namespace,
  });
  lang.SUBMIT = i18n.t(`Submit`, { ns: namespace });
  lang.VIEW_DETAILS = i18n.t(`View details`, { ns: namespace });
  lang.UPLOAD = i18n.t(`Upload`, { ns: namespace });

  // Errors
  lang.ERROR_IMAGE_LOAD = i18n.t(`Image could not be loaded`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// the const
export default lang;
