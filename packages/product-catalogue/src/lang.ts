import i18n from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ADD_PRODUCT = i18n.t('Add product to catalogue');
  lang.EDIT = i18n.t('Edit');
  lang.PRODUCT_CATALOGUE = i18n.t('Product Catalogue');
  lang.ADD_PRODUCT_TO_CATALOGUE = i18n.t(' + Add product to catalogue');
  lang.PRODUCT_NAME_TH = i18n.t('Product Name');
  lang.ID_TH = i18n.t('ID');
  lang.ACTIONS_TH = i18n.t('Actions');
  lang.LOADING_ELLIPSIS = i18n.t('Loading...');
  lang.FETCHING_PRODUCT = i18n.t('Fetching product Catalogue');
  lang.FETCHING_PRODUCT_DESCRIPTION = i18n.t('Please wait, as we fetch the product Catalogue.');
  lang.REQUIRED = i18n.t('Required');
  lang.YES = i18n.t('yes');
  lang.NO = i18n.t('no');
  lang.SUCCESSFULLY_UPDATED = i18n.t('Successfully Updated');
  lang.SUCCESSFULLY_ADDED = i18n.t('Successfully Added');
  lang.ENTER_PRODUCTS_NAME = "Enter the product's name e.g Midwifery Kit";
  lang.PRODUCT_NAME = i18n.t('Product name');
  lang.UNIQUE_ID = i18n.t('Unique ID');
  lang.MATERIAL_NUMBER = i18n.t('Material number');
  lang.CREATED = i18n.t('Created');
  lang.LAST_UPDATED = i18n.t('Last Updated');
  lang.SERVER_VERSION = i18n.t('Server version');
  lang.CANCEL = i18n.t('Cancel');
  lang.PHOTO_OF_THE_PRODUCT = i18n.t('Photo of the product (optional)');
  lang.ACCOUNTABILITY_PERIOD = i18n.t('Accountability period (in months)');
  lang.DESCRIBE_THE_PRODUCTS_USE = i18n.t(
    "Describe the product's intended use at the service point"
  );
  lang.USED_APPROPRIATELY = i18n.t('Is it being used appropriately? (optional)');
  lang.CONDITION_PLACEHOLDER = i18n.t(
    'Describe how a supply monitor would assess whether the product is in good condition'
  );
  lang.CONDITION_LABEL = i18n.t('Is it in good condition? (optional)');
  lang.AVAILABILITY_PLACEHOLDER = i18n.t(
    'Describe where a supply monitor can locate this product at the service point.'
  );
  lang.AVAILABILITY_LABEL = i18n.t('Is it there?');
  lang.ATTRACTIVE_ITEM_LABEL = i18n.t('Attractive item?');
  lang.MATERIAL_NUMBER_PLACEHOLDER = i18n.t("Enter the product's material number");
  lang.SUBMIT = i18n.t('Submit');
  lang.VIEW_DETAILS = i18n.t('View details');

  // Errors
  lang.ERROR_IMAGE_LOAD = i18n.t('Image could not be loaded');
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on('languageChanged', () => {
  fill();
});

// the const
export default lang;
