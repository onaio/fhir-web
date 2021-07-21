import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_OCCURED = i18n.t(`An error occurred`, { ns: namespace });
  lang.ERROR_PARENTID_STRING = i18n.t(`Parent ID can only contain letters, numbers and spaces`, {
    ns: namespace,
  });
  lang.ERROR_NAME_STRING = i18n.t(`Name can only contain letters, numbers and spaces`, {
    ns: namespace,
  });
  lang.ERROR_NAME_REQUIRED = i18n.t(`Name is required`, { ns: namespace });
  lang.ERROR_STATUS_REQUIRED = i18n.t(`Status is required`, { ns: namespace });
  lang.ERROR_TYPE_STRING = i18n.t(`Type can only contain letters, numbers and spaces`, {
    ns: namespace,
  });
  lang.ERROR_TYPE_REQUIRED = i18n.t(`Type is required`, { ns: namespace });
  lang.ERROR_EXTERNAL_ID_STRING = i18n.t(
    `External ID can only contain letters, numbers and spaces`,
    { ns: namespace }
  );
  lang.ERROR_LOCATION_TAGS_ARRAY = i18n.t(`Location Unit must be an array`, { ns: namespace });
  lang.ERROR_GEOMETRY_STRING = i18n.t(
    `Location Unit Group can only contain letters, numbers and spaces`,
    { ns: namespace }
  );
  lang.ERROR_LOCATION_CATEGORY_REQUIRED = i18n.t(`Location category is required`, {
    ns: namespace,
  });
  lang.ERROR_SERVICE_TYPES_REQUIRED = i18n.t(`Service types is required`, { ns: namespace });
  lang.LONGITUDE_LATITUDE_TYPE_ERROR = i18n.t(`Only decimal values allowed`, { ns: namespace });

  // Messages
  lang.MESSAGE_LOCATION_UNIT_UPDATED = i18n.t(`Location Unit updated successfully`, {
    ns: namespace,
  });
  lang.MESSAGE_LOCATION_UNIT_CREATED = i18n.t(`Location Unit created successfully`, {
    ns: namespace,
  });

  // Rendered text
  lang.LOCATION_UNIT = i18n.t(`Location Unit`, { ns: namespace });
  lang.LOCATION_UNIT_GROUP = i18n.t(`Location Unit Group`, { ns: namespace });
  lang.LOCATION_UNIT_MANAGEMENT = i18n.t(`Location Unit Management`, { ns: namespace });
  lang.LOCATION_UNIT_GROUP_MANAGEMENT = i18n.t(`Location Unit Group Management`, { ns: namespace });
  lang.ADD_LOCATION_UNIT = i18n.t(`Add Location Unit`, { ns: namespace });
  lang.EDIT_LOCATION_UNIT = i18n.t(`Edit Location Unit`, { ns: namespace });
  lang.ADD_LOCATION_UNIT_GROUP = i18n.t(`Add Location Unit Group`, { ns: namespace });
  lang.EDIT_LOCATION_UNIT_GROUP = i18n.t(`Edit Location Unit Group`, { ns: namespace });
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });

  lang.SUCCESSFULLY_CREATED_LOCATION = i18n.t(`Location was successfully created`, {
    ns: namespace,
  });
  lang.SUCCESSFULLY_UPDATED_LOCATION = i18n.t(`Location was successfully updated`, {
    ns: namespace,
  });
  lang.CANCEL = i18n.t(`Cancel`, { ns: namespace });
  lang.LOCATION_ACTIVE_STATUS_LABEL = i18n.t(`Active`, { ns: namespace });
  lang.LOCATION_INACTIVE_STATUS_LABEL = i18n.t(`Inactive`, { ns: namespace });
  lang.LOCATION_JURISDICTION_LABEL = i18n.t(`Jurisdiction`, { ns: namespace });
  lang.LOCATION_STRUCTURE_LABEL = i18n.t(`Structure`, { ns: namespace });
  lang.INSTANCE_LABEL = i18n.t(`Instance`, { ns: namespace });
  lang.ID_LABEL = i18n.t(`Id`, { ns: namespace });
  lang.USERNAME_LABEL = i18n.t(`username`, { ns: namespace });
  lang.PARENT_LABEL = i18n.t(`Part Of`, { ns: namespace });
  lang.NAME_LABEL = i18n.t(`Name`, { ns: namespace });
  lang.STATUS_LABEL = i18n.t(`Status`, { ns: namespace });
  lang.LOCATION_CATEGORY_LABEL = i18n.t(`Location category`, { ns: namespace });
  lang.TYPE_LABEL = i18n.t(`Type`, { ns: namespace });
  lang.SERVICE_TYPES_LABEL = i18n.t(`Type`, { ns: namespace });
  lang.EXTERNAL_ID_LABEL = i18n.t(`External ID`, { ns: namespace });
  lang.GEOMETRY_LABEL = i18n.t(`Geometry`, { ns: namespace });
  lang.UNIT_GROUP_LABEL = i18n.t(`Unit group`, { ns: namespace });
  lang.PARENT_ID_SELECT_PLACEHOLDER = i18n.t(`Select the parent location`, { ns: namespace });
  lang.ENTER_LOCATION_NAME_PLACEHOLDER = i18n.t(`Enter a location name`, { ns: namespace });
  lang.SELECT_TYPE_LABEL = i18n.t(`Select type`, { ns: namespace });
  lang.SELECT_STATUS_LABEL = i18n.t(`Select status`, { ns: namespace });
  lang.GEOMETRY_PLACEHOLDER = i18n.t(`</> JSON`, { ns: namespace });
  lang.ENTER_A_LOCATION_GROUP_NAME_PLACEHOLDER = i18n.t(`Enter a location group name`, {
    ns: namespace,
  });
  lang.SAVING = i18n.t(`Saving`, { ns: namespace });
  lang.SAVE = i18n.t(`Save`, { ns: namespace });
  lang.SERVICE_TYPE_PLACEHOLDER = i18n.t(`Select the service point type`, { ns: namespace });
  lang.LATITUDE_PLACEHOLDER = i18n.t(`E.g. -16.08306`, { ns: namespace });
  lang.LONGITUDE_PLACEHOLDER = i18n.t(`E.g. 49.54933`, { ns: namespace });

  lang.NAME = i18n.t(`Name`, { ns: namespace });
  lang.STATUS = i18n.t(`Status`, { ns: namespace });
  lang.TYPE = i18n.t(`Type`, { ns: namespace });
  lang.USERNAME = i18n.t(`Username`, { ns: namespace });
  lang.VERSION = i18n.t(`Version`, { ns: namespace });
  lang.SYNC_STATUS = i18n.t(`Sync status`, { ns: namespace });
  lang.LEVEL = i18n.t(`Level`, { ns: namespace });
  lang.LOCATION_NAME = i18n.t(`Location Name`, { ns: namespace });
  lang.DESCRIPTION = i18n.t(`Description`, { ns: namespace });
  lang.ENTER_LOCATION_GROUP_NAME = i18n.t(`Enter a location group name`, { ns: namespace });
  lang.ACTIONS = i18n.t(`Actions`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.VIEW_DETAILS = i18n.t(`View Details`, { ns: namespace });
  lang.DELETE = i18n.t(`Delete`, { ns: namespace });
  lang.LATITUDE_LABEL = i18n.t(`Latitude`, { ns: namespace });
  lang.LONGITUDE_LABEL = i18n.t(`Longitude`, { ns: namespace });
  lang.ALIAS = i18n.t(`Alias`, { ns: namespace });
  lang.PHYSICAL_TYPE = i18n.t(`Physical Type`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
