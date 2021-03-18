import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_FORM_REQUIRED = i18n.t(`${namespace}::Form is required`);
  lang.ERROR_FORM_NAME_REQUIRED = i18n.t(`${namespace}::Form Name is required`);

  lang.MAKE_RELEASE = i18n.t(`${namespace}::Make Release`);
  lang.FILE_NAME = i18n.t(`${namespace}::File Name`);
  lang.FILE_VERSION = i18n.t(`${namespace}::File Version`);
  lang.IDENTIFIER = i18n.t(`${namespace}::Identifier`);
  lang.MODULE = i18n.t(`${namespace}::Module`);
  lang.EDIT = i18n.t(`${namespace}::Edit`);
  lang.DOWNLOAD = i18n.t(`${namespace}::Download`);
  lang.UPLOAD_EDIT = i18n.t(`${namespace}::Upload edit`);
  lang.UPLOAD_NEW_FILE = i18n.t(`${namespace}::Upload New File`);
  lang.VIEW_FILES = i18n.t(`${namespace}::View Files`);
  lang.APP_ID_LABEL = i18n.t(`${namespace}::App ID`);
  lang.APP_VERSION_LABEL = i18n.t(`${namespace}::App Version`);
  lang.RELATED_TO = i18n.t(`${namespace}::Related to`);
  lang.UPLOAD_FILE = i18n.t(`${namespace}::Upload file`);
  lang.FIND_DRAFT_FILES = i18n.t(`${namespace}::Find Draft Files`);
  lang.FIND_FILES = i18n.t(`${namespace}::Find Files`);
  lang.FIND_RELEASES_LABEL = i18n.t(`${namespace}::Find Release`);
  lang.SEARCH = i18n.t(`${namespace}::Search`);
  lang.CREATED_AT = i18n.t(`${namespace}::Created at`);
  lang.UPDATED_AT_LABEL = i18n.t(`${namespace}::Updated at`);
  lang.ERROR_OCCURRED = i18n.t(`${namespace}::Error occurred`);
  lang.DRAFT_FILES = i18n.t(`${namespace}::Draft Files`);
  lang.RELEASES = i18n.t(`${namespace}::Releases`);
  lang.JSON_VALIDATORS = i18n.t(`${namespace}::JSON Validators`);
  lang.ACTION = i18n.t(`${namespace}::Action`);
  lang.UPLOAD_FORM = i18n.t(`${namespace}::Upload Form`);
  lang.FORM_NAME = i18n.t(`${namespace}::Form Name`);
  lang.FORM = i18n.t(`${namespace}::Form`);
  lang.UPLOADING = i18n.t(`${namespace}::Uploading`);
  lang.CLICK_TO_UPLOAD = i18n.t(`${namespace}::Click to upload`);
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
