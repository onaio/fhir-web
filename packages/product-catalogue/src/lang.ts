import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ADD_PRODUCT = i18n.t(`${namespace}::Add product to catalogue`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.PRODUCT_CATALOGUE = i18n.t(`${namespace}::Product Catalogue`);
  lang.ADD_PRODUCT_TO_CATALOGUE = i18n.t(`${namespace}:: + Add product to catalogue`);
  lang.PRODUCT_NAME_TH = i18n.t(`${namespace}::Product Name`);
  lang.ID_TH = i18n.t(`${namespace}::ID`);
  lang.ACTIONS_TH = i18n.t(`${namespace}::Actions`);
  lang.LOADING_ELLIPSIS = i18n.t(`${namespace}::Loading...`);
  lang.FETCHING_PRODUCT = i18n.t(`${namespace}::Fetching product Catalogue`);
  lang.FETCHING_PRODUCT_DESCRIPTION = i18n.t(
    `${namespace}::Please wait, as we fetch the product Catalogue.`
  );
  lang.REQUIRED = i18n.t(`${namespace}::Required`);
  lang.YES = i18n.t(`${namespace}::yes`);
  lang.NO = i18n.t(`${namespace}::no`);
  lang.SUCCESSFULLY_UPDATED = i18n.t(`${namespace}::Successfully Updated`);
  lang.SUCCESSFULLY_ADDED = i18n.t(`${namespace}::Successfully Added`);
  lang.ENTER_PRODUCTS_NAME = `Enter the product's name e.g Midwifery Kit`;
  lang.PRODUCT_NAME = i18n.t(`${namespace}::Product name`);
  lang.UNIQUE_ID = i18n.t(`${namespace}::Unique ID`);
  lang.MATERIAL_NUMBER = i18n.t(`${namespace}::Material number`);
  lang.CREATED = i18n.t(`${namespace}::Created`);
  lang.LAST_UPDATED = i18n.t(`${namespace}::Last Updated`);
  lang.SERVER_VERSION = i18n.t(`${namespace}::Server version`);
  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
  lang.PHOTO_OF_THE_PRODUCT = i18n.t(`${namespace}::Photo of the product (optional)`);
  lang.ACCOUNTABILITY_PERIOD = i18n.t(`${namespace}::Accountability period (in months)`);
  lang.DESCRIBE_THE_PRODUCTS_USE = i18n.t(
    `${namespace}::Describe the product's intended use at the service point`
  );
  lang.USED_APPROPRIATELY = i18n.t(`${namespace}::Is it being used appropriately? (optional)`);
  lang.CONDITION_PLACEHOLDER = i18n.t(
    `${namespace}::Describe how a supply monitor would assess whether the product is in good condition`
  );
  lang.CONDITION_LABEL = i18n.t(`${namespace}::Is it in good condition? (optional)`);
  lang.AVAILABILITY_PLACEHOLDER = i18n.t(
    `${namespace}::Describe where a supply monitor can locate this product at the service point.`
  );
  lang.AVAILABILITY_LABEL = i18n.t(`${namespace}::Is it there?`);
  lang.ATTRACTIVE_ITEM_LABEL = i18n.t(`${namespace}::Attractive item?`);
  lang.MATERIAL_NUMBER_PLACEHOLDER = i18n.t(`${namespace}::Enter the product's material number`);
  lang.SUBMIT = i18n.t(`${namespace}::Submit`);
  lang.VIEW_DETAILS = i18n.t(`${namespace}::View details`);

  // Errors
  lang.ERROR_IMAGE_LOAD = i18n.t(`${namespace}::Image could not be loaded`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// the const
export default lang;
