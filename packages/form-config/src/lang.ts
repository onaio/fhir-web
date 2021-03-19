import i18n, { namespace } from './mls';
import { Dictionary } from '@onaio/utils';

export type Lang = Dictionary<string>;
const lang: Lang = {};

/** recompute values */
function fill() {
  // Errors
  lang.ERROR_FORM_REQUIRED = i18n.t(`Form is required`, { ns: namespace });
  lang.ERROR_FORM_NAME_REQUIRED = i18n.t(`Form Name is required`, { ns: namespace });

  lang.MAKE_RELEASE = i18n.t(`Make Release`, { ns: namespace });
  lang.FILE_NAME = i18n.t(`File Name`, { ns: namespace });
  lang.FILE_VERSION = i18n.t(`File Version`, { ns: namespace });
  lang.IDENTIFIER = i18n.t(`Identifier`, { ns: namespace });
  lang.MODULE = i18n.t(`Module`, { ns: namespace });
  lang.EDIT = i18n.t(`Edit`, { ns: namespace });
  lang.DOWNLOAD = i18n.t(`Download`, { ns: namespace });
  lang.UPLOAD_EDIT = i18n.t(`Upload edit`, { ns: namespace });
  lang.UPLOAD_NEW_FILE = i18n.t(`Upload New File`, { ns: namespace });
  lang.VIEW_FILES = i18n.t(`View Files`, { ns: namespace });
  lang.APP_ID_LABEL = i18n.t(`App ID`, { ns: namespace });
  lang.APP_VERSION_LABEL = i18n.t(`App Version`, { ns: namespace });
  lang.RELATED_TO = i18n.t(`Related to`, { ns: namespace });
  lang.UPLOAD_FILE = i18n.t(`Upload file`, { ns: namespace });
  lang.FIND_DRAFT_FILES = i18n.t(`Find Draft Files`, { ns: namespace });
  lang.FIND_FILES = i18n.t(`Find Files`, { ns: namespace });
  lang.FIND_RELEASES_LABEL = i18n.t(`Find Release`, { ns: namespace });
  lang.SEARCH = i18n.t(`Search`, { ns: namespace });
  lang.CREATED_AT = i18n.t(`Created at`, { ns: namespace });
  lang.UPDATED_AT_LABEL = i18n.t(`Updated at`, { ns: namespace });
  lang.ERROR_OCCURRED = i18n.t(`Error occurred`, { ns: namespace });
  lang.DRAFT_FILES = i18n.t(`Draft Files`, { ns: namespace });
  lang.RELEASES = i18n.t(`Releases`, { ns: namespace });
  lang.JSON_VALIDATORS = i18n.t(`JSON Validators`, { ns: namespace });
  lang.ACTION = i18n.t(`Action`, { ns: namespace });
  lang.UPLOAD_FORM = i18n.t(`Upload Form`, { ns: namespace });
  lang.FORM_NAME = i18n.t(`Form Name`, { ns: namespace });
  lang.FORM = i18n.t(`Form`, { ns: namespace });
  lang.UPLOADING = i18n.t(`Uploading`, { ns: namespace });
  lang.CLICK_TO_UPLOAD = i18n.t(`Click to upload`, { ns: namespace });
}

// run it initial
fill();

// bind some events and fill values again (doing the magic you expect to happen magically)
i18n.on(`languageChanged`, () => {
  fill();
});

// export the const
export default lang;
