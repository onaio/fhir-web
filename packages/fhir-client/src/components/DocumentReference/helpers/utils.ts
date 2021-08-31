import { get, isEmpty, some } from 'lodash';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { format } from 'date-fns';
import { dateFormat } from '../../../constants';
import FHIR from 'fhirclient';

/**
 * get object from an array, the check parameters are passed in as an obj, keys in keyValue can represent a path
 *
 * @param objArray - array obj with records of objs
 * @param keyValue - obj defining what key and values to use when matching
 * @param all - return first matched or all
 */
export function findObj<T extends object>(
  objArray?: T[],
  keyValue?: Record<keyof T | string, unknown>,
  all = false
) {
  if (objArray && keyValue) {
    const checkParameters = Object.entries(keyValue);
    const matched = objArray.filter((obj) => {
      let matches = true;
      checkParameters.forEach(([key, value]) => {
        if (get(obj, key) !== value) {
          matches = false;
        }
      });
      return matches;
    });
    if (all) {
      return matched;
    } else {
      return matched[0];
    }
  }
  if (!objArray || !keyValue) return;
}

/**
 * checks if collection is empty or if all values in the obj can be said to hold null values
 *
 * @param coll - the collection
 */
export const itemIsEmpty = <T extends object>(coll?: T) => {
  if (isEmpty(coll)) {
    return true;
  }
  return !some(coll);
};

/**
 * process top level fields of the documentReference resource
 *
 * @param docResource DocumentResource
 */
export const processTopLevelFields = (docResource: IfhirR4.IDocumentReference) => {
  const { status, type, description, securityLabel, date, id } = docResource;
  return {
    id,
    title: description,
    createdAt: date ? format(new Date(date), dateFormat) : undefined,
    status,
    documentType: {
      codeList: type?.coding,
      code: get(type, 'coding.0'),
    },
    securityCodes: {
      codeList: securityLabel,
      code: get(securityLabel, '[0].coding[0]'),
    },
  };
};

/**
 * Process context field in a documentReference
 *
 * @param docResource - the document resource
 */
export const processContextFields = (docResource: IfhirR4.IDocumentReference) => {
  const start = get(docResource, 'context.period.start');
  const end = get(docResource, 'context.period.end');
  return {
    periodStart: start ? format(new Date(start), dateFormat) : undefined,
    periodEnd: end ? format(new Date(end), dateFormat) : undefined,
    eventCoding: get(docResource, 'context.event[0].coding[0]'),
    facilityTypeCoding: get(docResource, 'context.facilityType.coding[0]'),
    practiceSettingCoding: get(docResource, 'context.practiceSetting.coding[0]'),
  };
};

/**
 * extract values from content field, will include the attachments and their formats
 *
 * @param docResource - the document resource
 */
export const processContentFields = (docResource: IfhirR4.IDocumentReference) => {
  return get(docResource, 'content').map((content) => {
    const data = get(content, 'attachment.data');
    const url = get(content, 'attachment.url');
    const absoluteUrlRegex = /^(?:[a-z]+:)?\/\//;
    const binaryUrlRegex = /Binary\/[\w-]+$/gm;
    let urlIsAbsolute, binaryUrl;
    if (url) {
      urlIsAbsolute = absoluteUrlRegex.test(url);
      const matches = Array.from(
        url.matchAll(binaryUrlRegex),
        (m) => (m as Array<string | undefined>)[0]
      );
      binaryUrl = matches?.[0];
    }
    const size = get(content, 'attachment.size');
    const formatCode = get(content, 'format.code');
    const formatDisplay = get(content, 'format.display');
    const formatContentType = get(content, 'attachment.contentType');

    return {
      attachment: { url, urlIsAbsolute, binaryUrl, data },
      size,
      formatCode,
      formatDisplay,
      formatContentType,
    };
  });
};

/** parses docResources and extracts attachment data, filtering out those with empty string data uris
 *
 * @param docResources - documentReference resource array
 */
export const processDocumentReferences = (docResources: IfhirR4.IDocumentReference[]) => {
  return docResources.map((resource) => {
    return {
      ...processTopLevelFields(resource),
      context: processContextFields(resource),
      content: processContentFields(resource),
    };
  });
};

export type ParsedDocReference = ReturnType<typeof processDocumentReferences>;

/**
 * get the discrete and multipart of a content-type
 *
 * @param contentType - mime type
 */
export const splitContentType = (contentType: string) => {
  const splitText = contentType.split('/');
  return { discretePart: splitText[0], multipart: splitText[1] };
};

/**
 * Act as a proxy when downloading attachments so that we can customize the name.
 * This pulls attachment as blob from fhir /Binary endpoint
 *
 * @param fhirBaseURL -the fhir base url
 * @param binaryEndpoint - a Binary endpoint url path
 */
export const fetchAttachmentForDownload = async (fhirBaseURL: string, binaryEndpoint: string) => {
  return FHIR.client(fhirBaseURL)
    .request({
      url: binaryEndpoint,
    })
    .then((res) => {
      return res.blob();
    });
};
