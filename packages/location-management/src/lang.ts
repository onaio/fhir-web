import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_OCCURED = i18n.t(`${namespace}::An error occurred`);
  lang.ERROR_PARENTID_STRING = i18n.t(
    `${namespace}::Parent ID can only contain letters, numbers and spaces`
  );
  lang.ERROR_NAME_STRING = i18n.t(
    `${namespace}::Name can only contain letters, numbers and spaces`
  );
  lang.ERROR_NAME_REQUIRED = i18n.t(`${namespace}::Name is required`);
  lang.ERROR_STATUS_REQUIRED = i18n.t(`${namespace}::Status is required`);
  lang.ERROR_TYPE_STRING = i18n.t(
    `${namespace}::Type can only contain letters, numbers and spaces`
  );
  lang.ERROR_TYPE_REQUIRED = i18n.t(`${namespace}::Type is required`);
  lang.ERROR_EXTERNAL_ID_STRING = i18n.t(
    `${namespace}::External ID can only contain letters, numbers and spaces`
  );
  lang.ERROR_LOCATION_TAGS_ARRAY = i18n.t(`${namespace}::Location Unit must be an array`);
  lang.ERROR_GEOMETRY_STRING = i18n.t(
    `${namespace}::Location Unit Group can only contain letters, numbers and spaces`
  );
  lang.ERROR_LOCATION_CATEGORY_REQUIRED = i18n.t(`${namespace}::Location category is required`);
  lang.ERROR_SERVICE_TYPES_REQUIRED = i18n.t(`${namespace}::Service types is required`);
  lang.LONGITUDE_LATITUDE_TYPE_ERROR = i18n.t(`${namespace}::Only decimal values allowed`);

  // Messages
  lang.MESSAGE_LOCATION_UNIT_UPDATED = i18n.t(`${namespace}::Location Unit updated successfully`);
  lang.MESSAGE_LOCATION_UNIT_CREATED = i18n.t(`${namespace}::Location Unit created successfully`);

  // Rendered text
  lang.LOCATION_UNIT = i18n.t(`${namespace}::Location Unit`);
  lang.LOCATION_UNIT_GROUP = i18n.t(`${namespace}::Location Unit Group`);
  lang.LOCATION_UNIT_MANAGEMENT = i18n.t(`${namespace}::Location Unit Management`);
  lang.LOCATION_UNIT_GROUP_MANAGEMENT = i18n.t(`${namespace}::Location Unit Group Management`);
  lang.ADD_LOCATION_UNIT = i18n.t(`${namespace}::Add Location Unit`);
  lang.EDIT_LOCATION_UNIT = i18n.t(`${namespace}::Edit Location Unit`);
  lang.ADD_LOCATION_UNIT_GROUP = i18n.t(`${namespace}::Add Location Unit Group`);
  lang.EDIT_LOCATION_UNIT_GROUP = i18n.t(`${namespace}::Edit Location Unit Group`);
  lang.SEARCH = i18n.t(`${namespace}::Search`);

  lang.SUCCESSFULLY_CREATED_LOCATION = i18n.t(`${namespace}::Location was successfully created`);
  lang.SUCCESSFULLY_UPDATED_LOCATION = i18n.t(`${namespace}::Location was successfully updated`);
  lang.CANCEL = i18n.t(`${namespace}::Cancel`);
  lang.LOCATION_ACTIVE_STATUS_LABEL = i18n.t(`${namespace}::Active`);
  lang.LOCATION_INACTIVE_STATUS_LABEL = i18n.t(`${namespace}::Inactive`);
  lang.LOCATION_JURISDICTION_LABEL = i18n.t(`${namespace}::Jurisdiction`);
  lang.LOCATION_STRUCTURE_LABEL = i18n.t(`${namespace}::Service point`);
  lang.INSTANCE_LABEL = i18n.t(`${namespace}::Instance`);
  lang.ID_LABEL = i18n.t(`${namespace}::Id`);
  lang.USERNAME_LABEL = i18n.t(`${namespace}::username`);
  lang.PARENT_LABEL = i18n.t(`${namespace}::Parent`);
  lang.NAME_LABEL = i18n.t(`${namespace}::Name`);
  lang.STATUS_LABEL = i18n.t(`${namespace}::Status`);
  lang.LOCATION_CATEGORY_LABEL = i18n.t(`${namespace}::Location category`);
  lang.TYPE_LABEL = i18n.t(`${namespace}::Type`);
  lang.SERVICE_TYPES_LABEL = i18n.t(`${namespace}::Type`);
  lang.EXTERNAL_ID_LABEL = i18n.t(`${namespace}::External ID`);
  lang.GEOMETRY_LABEL = i18n.t(`${namespace}::Geometry`);
  lang.UNIT_GROUP_LABEL = i18n.t(`${namespace}::Unit group`);
  lang.PARENT_ID_SELECT_PLACEHOLDER = i18n.t(`${namespace}::Select the parent location`);
  lang.ENTER_LOCATION_NAME_PLACEHOLDER = i18n.t(`${namespace}::Enter a location name`);
  lang.SELECT_TYPE_LABEL = i18n.t(`${namespace}::Select type`);
  lang.SELECT_STATUS_LABEL = i18n.t(`${namespace}::Select status`);
  lang.GEOMETRY_PLACEHOLDER = i18n.t(`${namespace}::</> JSON`);
  lang.ENTER_A_LOCATION_GROUP_NAME_PLACEHOLDER = i18n.t(
    `${namespace}::Enter a location group name`
  );
  lang.SAVING = i18n.t(`${namespace}::Saving`);
  lang.SAVE = i18n.t(`${namespace}::Save`);
  lang.SERVICE_TYPE_PLACEHOLDER = i18n.t(`${namespace}::Select the service point type`);
  lang.LATITUDE_PLACEHOLDER = i18n.t(`${namespace}::E.g. -16.08306`);
  lang.LONGITUDE_PLACEHOLDER = i18n.t(`${namespace}::E.g. 49.54933`);

  lang.NAME = i18n.t(`${namespace}::Name`);
  lang.STATUS = i18n.t(`${namespace}::Status`);
  lang.TYPE = i18n.t(`${namespace}::Type`);
  lang.USERNAME = i18n.t(`${namespace}::Username`);
  lang.VERSION = i18n.t(`${namespace}::Version`);
  lang.SYNC_STATUS = i18n.t(`${namespace}::Sync status`);
  lang.LEVEL = i18n.t(`${namespace}::Level`);
  lang.LOCATION_NAME = i18n.t(`${namespace}::Location Name`);
  lang.DESCRIPTION = i18n.t(`${namespace}::Description`);
  lang.ENTER_LOCATION_GROUP_NAME = i18n.t(`${namespace}::Enter a location group name`);
  lang.ACTIONS = i18n.t(`${namespace}::Actions`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.VIEW_DETAILS = i18n.t(`${namespace}::View Details`);
  lang.DELETE = i18n.t(`${namespace}::Delete`);
  lang.LATITUDE_LABEL = i18n.t(`${namespace}::Latitude`);
  lang.LONGITUDE_LABEL = i18n.t(`${namespace}::Longitude`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
