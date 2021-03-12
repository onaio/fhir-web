import i18n from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ADD_SERVICE_POINT = i18n.t('+ Add service point');
  lang.SERVICE_POINT_INVENTORY = i18n.t('Service point inventory');
  lang.SERVICE_POINT_TH = i18n.t('Service point');
  lang.TYPE_TH = i18n.t('type');
  lang.LOCATION_TH = i18n.t('Location');
  lang.SERVICE_POINT_ID_TH = i18n.t('Service point ID');
  lang.ACTIONS_TH = i18n.t('Actions');
  lang.VIEW = i18n.t('View');
  lang.FETCHING_LOCATIONS = i18n.t('Fetching locations');
  lang.FETCHING_LOCATIONS_DESCRIPTION = i18n.t('Please wait, while locations are being fetched');
  lang.LOADING_ELLIPSIS = i18n.t('Loading ...');
  lang.ADD_INVENTORY_VIA_CSV = i18n.t('Add inventory via CSV');
  lang.USE_CSV_TO_UPLOAD_INVENTORY = i18n.t('Use a CSV file to add service point inventory');
  lang.CHANCE_TO_REVIEW_BEFORE_COMMITTING = i18n.t(
    'You’ll get a chance to review before committing inventory updates.'
  );
  lang.SELECT_CSV_FILE = i18n.t('Select CSV file');
  lang.UPLOADING_CSV = i18n.t('Uploading %s ...');
  lang.VALIDATING_CSV = i18n.t('Validating %s ...');
  lang.DO_NOT_CANCEL = i18n.t('Do not close tab or navigate away.');
  lang.CANCEL = i18n.t('Cancel');
  lang.INVENTORY_IS_BEING_ADDED_TO_SERVICE_POINTS = i18n.t(
    'Inventory is being added to service points…'
  );
  lang.INVENTORY_MAY_TAKE_A_FEW_MINUTES_TO_APPEAR = i18n.t(
    'Inventory may take a few minutes to appear.'
  );
  lang.FILE_READY = i18n.t('“%s” ready');
  lang.INVENTORY_ITEMS_SUCCESSFULLY_ADDED = i18n.t('“%s” inventory items successfully added');
  lang.INVENTORY_ITEMS_WILL_BE_ADDED = i18n.t(
    '%s inventory items will be added to service points. Do you wish to proced?'
  );
  lang.PROCEED_WITH_ADDING_INVENTORY = i18n.t('Proceed with adding inventory');
  lang.UPLOAD_ANOTHER_FILE = i18n.t('Upload another file');
  lang.FILE_HAS_ERRORS = i18n.t('"%s" has errors');
  lang.ROW_NUMBER = i18n.t('Row number');
  lang.ERRORS = i18n.t('Errors');
  lang.INVENTORY_PROCESSING_ERROR = i18n.t('Processing error: inventory items failed to be added');
  lang.INVENTORY_ITEMS_FAILED_TO_BE_ADDED = i18n.t(
    '%s inventory items failed to be added from “%s”. To add items, follow these steps: '
  );
  lang.EXTRACT_THE_ROWS_LISTED = i18n.t('Extract the rows listed below from "%s"');
  lang.PASTE_THE_ROWS = i18n.t('Paste the rows into a new CSV file');
  lang.UPLOAD_THE_CSV_FILE = i18n.t('Upload the CSV file');
  lang.INVENTORY_ITEMS_FROM_FILE_THAT_WERE_NOT_ADDED = i18n.t(
    'Inventory items from “%s” that were not added'
  );
  lang.RETRY = i18n.t('Retry');
  lang.CAUTION_DO_NOT_RE_UPLOAD_THE_SUCCESSFULLY_UPLOADED_ITEMS = i18n.t(
    'Caution: do not re-upload the successful items or duplicates will be created.'
  );
  lang.INVENTORY_ITEMS_NOT_LISTED_BELOW = i18n.t(
    'Inventory items not listed below were successfully added to the'
  );
  lang.INVENTORY_ITEMS_ADDED_TO = i18n.t('inventory items added to');
  lang.RETRY_CSV_UPLOAD = i18n.t('retry csv upload');
  lang.PLEASE_FIX_THE_ERRORS_LISTED_BELOW = i18n.t('please fix the errors listed below, then');
  // Error
  lang.ERROR_GENERIC = i18n.t('An error occurred');
  lang.ERROR_PRODUCT_NAME_REQUIRED = i18n.t('Product is required');
  lang.ERROR_DELIVERY_DATE_REQUIRED = i18n.t('Delivery date is required');
  lang.ERROR_ACCOUNTABILITY_DATE_REQUIRED = i18n.t('Accountability end date is required');
  lang.ERROR_UNICEF_SECTION_REQUIRED = i18n.t('UNICEF section is required');
  lang.ERROR_PO_NUMBER_REQUIRED = i18n.t('PO number is required');
  lang.ERROR_SERIAL_NUMBER_REQUIRED = i18n.t('Serial number is required');

  // Rendered text
  lang.ADD_INVENTORY_ITEM = i18n.t('Add inventory item');
  lang.TO = i18n.t('to');
  lang.SAVE = i18n.t('Save');
  lang.SAVING = i18n.t('Saving');
  lang.OPTIONAL = i18n.t('optional');
  lang.QUANTITY = i18n.t('Quantity');
  lang.DELIVERY_DATE = i18n.t('Delivery date');
  lang.ACCOUNTABILITY_END_DATE = i18n.t('Accountability end date');
  lang.UNICEF_SECTION = i18n.t('UNICEF section');
  lang.DONOR = i18n.t('Donor');
  lang.PO_NUMBER = i18n.t('PO number');
  lang.SELECT = i18n.t('Select');

  // Service point profile
  lang.INVENTORY = i18n.t('Inventory');
  lang.INVENTORY_ITEMS = i18n.t('Inventory items');
  lang.EDIT_SERVICE_POINT = i18n.t('Edit service point');
  lang.ADD_NEW_INVENTORY_ITEM = i18n.t('Add new inventory item');
  lang.PRODUCT_NAME_TH = i18n.t('Product name');
  lang.QTY_TH = i18n.t('Qty');
  lang.PO_NUMBER_TH = i18n.t('PO no.');
  lang.SERIAL_NUMBER_TH = i18n.t('Serial no.');
  lang.DELIVERY_DT_TH = i18n.t('Delivery dt.');
  lang.ACCOUNT_END_DT_TH = i18n.t('Acct. end dt.');
  lang.UNICEF_SECTION_TH = i18n.t('Unicef section');
  lang.DONOR_TH = i18n.t('Donor');
  lang.REGION_LABEL = i18n.t('Region');
  lang.TYPE_LABEL = i18n.t('Type');
  lang.DISTRICT_LABEL = i18n.t('District');
  lang.LAT_LONG_LABEL = i18n.t('Latitude/longitude');
  lang.COMMUNE_LABEL = i18n.t('Commune');
  lang.SERVICE_POINT_ID_LABEL = i18n.t('Service point ID');
  lang.ERROR_OCCURRED = i18n.t('An error occurred');
  lang.PRODUCT = i18n.t('Product');
  lang.SERIAL_NUMBER = i18n.t('Serial number');
  lang.EDIT_INVENTORY_ITEM = i18n.t('Edit inventory item');
  lang.EDIT = i18n.t('Edit');
  lang.BACK_TO_SERVICE_POINT_LIST = i18n.t('Back to the list of service points');
  lang.ERROR_GETTING_INVENTORIES = i18n.t('Unable to fetch inventories for service point');
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on('languageChanged', () => {
  fill();
});

// the const
export default lang;
