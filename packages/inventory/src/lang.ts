import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;

const lang: Lang = {};

/** recompute values */
function fill() {
  lang.ADD_SERVICE_POINT = i18n.t(`+ Add service point`, { ns: namespace });
  lang.SERVICE_POINT_INVENTORY = i18n.t(`Service point inventory`, { ns: namespace });
  lang.SERVICE_POINT_TH = i18n.t(`Service point`, { ns: namespace });
  lang.TYPE_TH = i18n.t(`type`, { ns: namespace });
  lang.LOCATION_TH = i18n.t(`Location`, { ns: namespace });
  lang.SERVICE_POINT_ID_TH = i18n.t(`Service point ID`, { ns: namespace });
  lang.ACTIONS_TH = i18n.t(`Actions`, { ns: namespace });
  lang.VIEW = i18n.t(`View`, { ns: namespace });
  lang.FETCHING_LOCATIONS = i18n.t(`Fetching locations`, { ns: namespace });
  lang.FETCHING_LOCATIONS_DESCRIPTION = i18n.t(`Please wait, while locations are being fetched`, {
    ns: namespace,
  });
  lang.LOADING_ELLIPSIS = i18n.t(`Loading ...`, { ns: namespace });
  lang.ADD_INVENTORY_VIA_CSV = i18n.t(`Add inventory via CSV`, { ns: namespace });
  lang.USE_CSV_TO_UPLOAD_INVENTORY = i18n.t(`Use a CSV file to add service point inventory`, {
    ns: namespace,
  });
  lang.CHANCE_TO_REVIEW_BEFORE_COMMITTING = i18n.t(
    `You’ll get a chance to review before committing inventory updates.`,
    { ns: namespace }
  );
  lang.SELECT_CSV_FILE = i18n.t(`Select CSV file`, { ns: namespace });
  lang.UPLOADING_CSV = i18n.t(`Uploading %s ...`, { ns: namespace });
  lang.VALIDATING_CSV = i18n.t(`Validating %s ...`, { ns: namespace });
  lang.DO_NOT_CANCEL = i18n.t(`Do not close tab or navigate away.`, { ns: namespace });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.INVENTORY_IS_BEING_ADDED_TO_SERVICE_POINTS = i18n.t(
    `Inventory is being added to service points…`,
    { ns: namespace }
  );
  lang.INVENTORY_MAY_TAKE_A_FEW_MINUTES_TO_APPEAR = i18n.t(
    `Inventory may take a few minutes to appear.`,
    { ns: namespace }
  );
  lang.FILE_READY = i18n.t(`“%s” ready`, { ns: namespace });
  lang.INVENTORY_ITEMS_SUCCESSFULLY_ADDED = i18n.t(`“%s” inventory items successfully added`, {
    ns: namespace,
  });
  lang.INVENTORY_ITEMS_WILL_BE_ADDED = i18n.t(
    `%s inventory items will be added to service points. Do you wish to proceed?`,
    { ns: namespace }
  );
  lang.PROCEED_WITH_ADDING_INVENTORY = i18n.t(`Proceed with adding inventory`, { ns: namespace });
  lang.UPLOAD_ANOTHER_FILE = i18n.t(`Upload another file`, { ns: namespace });
  lang.FILE_HAS_ERRORS = i18n.t(`"%s" has errors`, { ns: namespace });
  lang.ROW_NUMBER = i18n.t(`Row number`, { ns: namespace });
  lang.ERRORS = i18n.t(`Errors`, { ns: namespace });
  lang.INVENTORY_PROCESSING_ERROR = i18n.t(`Processing error: inventory items failed to be added`, {
    ns: namespace,
  });
  lang.INVENTORY_ITEMS_FAILED_TO_BE_ADDED = i18n.t(
    `%s inventory items failed to be added from “%s”. To add items, follow these steps: `,
    { ns: namespace }
  );
  lang.EXTRACT_THE_ROWS_LISTED = i18n.t(`Extract the rows listed below from "%s"`, {
    ns: namespace,
  });
  lang.PASTE_THE_ROWS = i18n.t(`Paste the rows into a new CSV file`, { ns: namespace });
  lang.UPLOAD_THE_CSV_FILE = i18n.t(`Upload the CSV file`, { ns: namespace });
  lang.INVENTORY_ITEMS_FROM_FILE_THAT_WERE_NOT_ADDED = i18n.t(
    `Inventory items from “%s” that were not added`,
    { ns: namespace }
  );
  lang.RETRY = i18n.t(`Retry`, { ns: namespace });
  lang.CAUTION_DO_NOT_RE_UPLOAD_THE_SUCCESSFULLY_UPLOADED_ITEMS = i18n.t(
    `Caution: do not re-upload the successful items or duplicates will be created.`,
    { ns: namespace }
  );
  lang.INVENTORY_ITEMS_NOT_LISTED_BELOW = i18n.t(
    `Inventory items not listed below were successfully added to the`,
    { ns: namespace }
  );
  lang.INVENTORY_ITEMS_ADDED_TO = i18n.t(`inventory items added to`, { ns: namespace });
  lang.RETRY_CSV_UPLOAD = i18n.t(`retry csv upload`, { ns: namespace });
  lang.PLEASE_FIX_THE_ERRORS_LISTED_BELOW = i18n.t(`please fix the errors listed below, then`, {
    ns: namespace,
  });
  // Error
  lang.ERROR_GENERIC = i18n.t(`An error occurred`, { ns: namespace });
  lang.ERROR_PRODUCT_NAME_REQUIRED = i18n.t(`Product is required`, { ns: namespace });
  lang.ERROR_DELIVERY_DATE_REQUIRED = i18n.t(`Delivery date is required`, { ns: namespace });
  lang.ERROR_ACCOUNTABILITY_DATE_REQUIRED = i18n.t(`Accountability end date is required`, {
    ns: namespace,
  });
  lang.ERROR_UNICEF_SECTION_REQUIRED = i18n.t(`UNICEF section is required`, { ns: namespace });
  lang.ERROR_PO_NUMBER_REQUIRED = i18n.t(`PO number is required`, { ns: namespace });
  lang.ERROR_SERIAL_NUMBER_REQUIRED = i18n.t(`Serial number is required`, { ns: namespace });

  // Rendered text
  lang.ADD_INVENTORY_ITEM = i18n.t(`Add inventory item`, { ns: namespace });
  lang.TO = i18n.t(`to`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.SAVING = i18n.t(`Saving`, { ns: namespace });
  lang.OPTIONAL = i18n.t(`optional`, { ns: namespace });
  lang.QUANTITY = i18n.t(`Quantity`, { ns: namespace });
  lang.DELIVERY_DATE = i18n.t(`Delivery date`, { ns: namespace });
  lang.ACCOUNTABILITY_END_DATE = i18n.t(`Accountability end date`, { ns: namespace });
  lang.UNICEF_SECTION = i18n.t(`UNICEF section`, { ns: namespace });
  lang.DONOR = i18n.t(`Donor`, { ns: namespace });
  lang.PO_NUMBER = i18n.t(`PO number`, { ns: namespace });
  lang.SELECT = i18n.t(`Select`, { ns: namespace });

  // Service point profile
  lang.INVENTORY = i18n.t(`Inventory`, { ns: namespace });
  lang.INVENTORY_ITEMS = i18n.t(`Inventory items`, { ns: namespace });
  lang.EDIT_SERVICE_POINT = i18n.t(`Edit service point`, { ns: namespace });
  lang.ADD_NEW_INVENTORY_ITEM = i18n.t(`Add new inventory item`, { ns: namespace });
  lang.PRODUCT_NAME_TH = i18n.t(`Product name`, { ns: namespace });
  lang.QTY_TH = i18n.t(`Qty`, { ns: namespace });
  lang.PO_NUMBER_TH = i18n.t(`PO no.`, { ns: namespace });
  lang.SERIAL_NUMBER_TH = i18n.t(`Serial no.`, { ns: namespace });
  lang.DELIVERY_DT_TH = i18n.t(`Delivery dt.`, { ns: namespace });
  lang.ACCOUNT_END_DT_TH = i18n.t(`Acct. end dt.`, { ns: namespace });
  lang.UNICEF_SECTION_TH = i18n.t(`Unicef section`, { ns: namespace });
  lang.DONOR_TH = i18n.t(`Donor`, { ns: namespace });
  lang.REGION_LABEL = i18n.t(`Region`, { ns: namespace });
  lang.TYPE_LABEL = i18n.t(`Type`, { ns: namespace });
  lang.DISTRICT_LABEL = i18n.t(`District`, { ns: namespace });
  lang.LAT_LONG_LABEL = i18n.t(`Latitude/longitude`, { ns: namespace });
  lang.COMMUNE_LABEL = i18n.t(`Commune`, { ns: namespace });
  lang.SERVICE_POINT_ID_LABEL = i18n.t(`Service point ID`, { ns: namespace });
  lang.ERROR_OCCURRED = i18n.t(`An error occurred`, { ns: namespace });
  lang.PRODUCT = i18n.t(`Product`, { ns: namespace });
  lang.SERIAL_NUMBER = i18n.t(`Serial number`, { ns: namespace });
  lang.EDIT_INVENTORY_ITEM = i18n.t(`Edit inventory item`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.BACK_TO_SERVICE_POINT_LIST = i18n.t(`Back to the list of service points`, { ns: namespace });
  lang.ERROR_GETTING_INVENTORIES = i18n.t(`Unable to fetch inventories for service point`, {
    ns: namespace,
  });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// the const
export default lang;
