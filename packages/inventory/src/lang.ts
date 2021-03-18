import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ADD_SERVICE_POINT = i18n.t(`${namespace}::+ Add service point`);
  lang.SERVICE_POINT_INVENTORY = i18n.t(`${namespace}::Service point inventory`);
  lang.SERVICE_POINT_TH = i18n.t(`${namespace}::Service point`);
  lang.TYPE_TH = i18n.t(`${namespace}::type`);
  lang.LOCATION_TH = i18n.t(`${namespace}::Location`);
  lang.SERVICE_POINT_ID_TH = i18n.t(`${namespace}::Service point ID`);
  lang.ACTIONS_TH = i18n.t(`${namespace}::Actions`);
  lang.VIEW = i18n.t(`${namespace}::View`);
  lang.FETCHING_LOCATIONS = i18n.t(`${namespace}::Fetching locations`);
  lang.FETCHING_LOCATIONS_DESCRIPTION = i18n.t(
    `${namespace}::Please wait, while locations are being fetched`
  );
  lang.LOADING_ELLIPSIS = i18n.t(`${namespace}::Loading ...`);
  lang.ADD_INVENTORY_VIA_CSV = i18n.t(`${namespace}::Add inventory via CSV`);
  lang.USE_CSV_TO_UPLOAD_INVENTORY = i18n.t(
    `${namespace}::Use a CSV file to add service point inventory`
  );
  lang.CHANCE_TO_REVIEW_BEFORE_COMMITTING = i18n.t(
    `${namespace}::You’ll get a chance to review before committing inventory updates.`
  );
  lang.SELECT_CSV_FILE = i18n.t(`${namespace}::Select CSV file`);
  lang.UPLOADING_CSV = i18n.t(`${namespace}::Uploading %s ...`);
  lang.VALIDATING_CSV = i18n.t(`${namespace}::Validating %s ...`);
  lang.DO_NOT_CANCEL = i18n.t(`${namespace}::Do not close tab or navigate away.`);
  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
  lang.INVENTORY_IS_BEING_ADDED_TO_SERVICE_POINTS = i18n.t(
    `${namespace}::Inventory is being added to service points…`
  );
  lang.INVENTORY_MAY_TAKE_A_FEW_MINUTES_TO_APPEAR = i18n.t(
    `${namespace}::Inventory may take a few minutes to appear.`
  );
  lang.FILE_READY = i18n.t(`${namespace}::“%s” ready`);
  lang.INVENTORY_ITEMS_SUCCESSFULLY_ADDED = i18n.t(
    `${namespace}::“%s” inventory items successfully added`
  );
  lang.INVENTORY_ITEMS_WILL_BE_ADDED = i18n.t(
    `${namespace}::%s inventory items will be added to service points. Do you wish to proceed?`
  );
  lang.PROCEED_WITH_ADDING_INVENTORY = i18n.t(`${namespace}::Proceed with adding inventory`);
  lang.UPLOAD_ANOTHER_FILE = i18n.t(`${namespace}::Upload another file`);
  lang.FILE_HAS_ERRORS = i18n.t(`${namespace}::"%s" has errors`);
  lang.ROW_NUMBER = i18n.t(`${namespace}::Row number`);
  lang.ERRORS = i18n.t(`${namespace}::Errors`);
  lang.INVENTORY_PROCESSING_ERROR = i18n.t(
    `${namespace}::Processing error: inventory items failed to be added`
  );
  lang.INVENTORY_ITEMS_FAILED_TO_BE_ADDED = i18n.t(
    `${namespace}::%s inventory items failed to be added from “%s”. To add items, follow these steps: `
  );
  lang.EXTRACT_THE_ROWS_LISTED = i18n.t(`${namespace}::Extract the rows listed below from "%s"`);
  lang.PASTE_THE_ROWS = i18n.t(`${namespace}::Paste the rows into a new CSV file`);
  lang.UPLOAD_THE_CSV_FILE = i18n.t(`${namespace}::Upload the CSV file`);
  lang.INVENTORY_ITEMS_FROM_FILE_THAT_WERE_NOT_ADDED = i18n.t(
    `${namespace}::Inventory items from “%s” that were not added`
  );
  lang.RETRY = i18n.t(`${namespace}::Retry`);
  lang.CAUTION_DO_NOT_RE_UPLOAD_THE_SUCCESSFULLY_UPLOADED_ITEMS = i18n.t(
    `${namespace}::Caution: do not re-upload the successful items or duplicates will be created.`
  );
  lang.INVENTORY_ITEMS_NOT_LISTED_BELOW = i18n.t(
    `${namespace}::Inventory items not listed below were successfully added to the`
  );
  lang.INVENTORY_ITEMS_ADDED_TO = i18n.t(`${namespace}::inventory items added to`);
  lang.RETRY_CSV_UPLOAD = i18n.t(`${namespace}::retry csv upload`);
  lang.PLEASE_FIX_THE_ERRORS_LISTED_BELOW = i18n.t(
    `${namespace}::please fix the errors listed below, then`
  );
  // Error
  lang.ERROR_GENERIC = i18n.t(`${namespace}::An error occurred`);
  lang.ERROR_PRODUCT_NAME_REQUIRED = i18n.t(`${namespace}::Product is required`);
  lang.ERROR_DELIVERY_DATE_REQUIRED = i18n.t(`${namespace}::Delivery date is required`);
  lang.ERROR_ACCOUNTABILITY_DATE_REQUIRED = i18n.t(
    `${namespace}::Accountability end date is required`
  );
  lang.ERROR_UNICEF_SECTION_REQUIRED = i18n.t(`${namespace}::UNICEF section is required`);
  lang.ERROR_PO_NUMBER_REQUIRED = i18n.t(`${namespace}::PO number is required`);
  lang.ERROR_SERIAL_NUMBER_REQUIRED = i18n.t(`${namespace}::Serial number is required`);

  // Rendered text
  lang.ADD_INVENTORY_ITEM = i18n.t(`${namespace}::Add inventory item`);
  lang.TO = i18n.t(`${namespace}::to`);
  lang.SAVE = i18n.t(`${namespace}::Save`);
  lang.SAVING = i18n.t(`${namespace}::Saving`);
  lang.OPTIONAL = i18n.t(`${namespace}::optional`);
  lang.QUANTITY = i18n.t(`${namespace}::Quantity`);
  lang.DELIVERY_DATE = i18n.t(`${namespace}::Delivery date`);
  lang.ACCOUNTABILITY_END_DATE = i18n.t(`${namespace}::Accountability end date`);
  lang.UNICEF_SECTION = i18n.t(`${namespace}::UNICEF section`);
  lang.DONOR = i18n.t(`${namespace}::Donor`);
  lang.PO_NUMBER = i18n.t(`${namespace}::PO number`);
  lang.SELECT = i18n.t(`${namespace}::Select`);

  // Service point profile
  lang.INVENTORY = i18n.t(`${namespace}::Inventory`);
  lang.INVENTORY_ITEMS = i18n.t(`${namespace}::Inventory items`);
  lang.EDIT_SERVICE_POINT = i18n.t(`${namespace}::Edit service point`);
  lang.ADD_NEW_INVENTORY_ITEM = i18n.t(`${namespace}::Add new inventory item`);
  lang.PRODUCT_NAME_TH = i18n.t(`${namespace}::Product name`);
  lang.QTY_TH = i18n.t(`${namespace}::Qty`);
  lang.PO_NUMBER_TH = i18n.t(`${namespace}::PO no.`);
  lang.SERIAL_NUMBER_TH = i18n.t(`${namespace}::Serial no.`);
  lang.DELIVERY_DT_TH = i18n.t(`${namespace}::Delivery dt.`);
  lang.ACCOUNT_END_DT_TH = i18n.t(`${namespace}::Acct. end dt.`);
  lang.UNICEF_SECTION_TH = i18n.t(`${namespace}::Unicef section`);
  lang.DONOR_TH = i18n.t(`${namespace}::Donor`);
  lang.REGION_LABEL = i18n.t(`${namespace}::Region`);
  lang.TYPE_LABEL = i18n.t(`${namespace}::Type`);
  lang.DISTRICT_LABEL = i18n.t(`${namespace}::District`);
  lang.LAT_LONG_LABEL = i18n.t(`${namespace}::Latitude/longitude`);
  lang.COMMUNE_LABEL = i18n.t(`${namespace}::Commune`);
  lang.SERVICE_POINT_ID_LABEL = i18n.t(`${namespace}::Service point ID`);
  lang.ERROR_OCCURRED = i18n.t(`${namespace}::An error occurred`);
  lang.PRODUCT = i18n.t(`${namespace}::Product`);
  lang.SERIAL_NUMBER = i18n.t(`${namespace}::Serial number`);
  lang.EDIT_INVENTORY_ITEM = i18n.t(`${namespace}::Edit inventory item`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.BACK_TO_SERVICE_POINT_LIST = i18n.t(`${namespace}::Back to the list of service points`);
  lang.ERROR_GETTING_INVENTORIES = i18n.t(
    `${namespace}::Unable to fetch inventories for service point`
  );
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// the const
export default lang;
