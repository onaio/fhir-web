import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

/**
 * From T, convert a set of keys to optional, that are in the union K.
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

/**
 * From T, convert a set of keys to required, that are in the union K.
 */
export type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * @param bundle - a fhir resource bundle api response
 */
export function getResourcesFromBundle<TResource>(bundle: IBundle) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const temp = bundle.entry?.filter((x) => x !== undefined);
  const rtn = temp?.map((e) => e.resource as TResource) ?? [];
  return rtn;
}

/**
 * Function to save blob response to file
 *
 * @param {string} blob - blob data to be written to file
 * @param {string} filename - name of the file to be saved
 * @param {string} contentType - MIME type for the file
 */
export const downloadFile = (
  blob: string | Blob,
  filename: string,
  contentType = 'application/octet-stream'
) => {
  const blobFile = typeof blob === 'string' ? new Blob([blob], { type: contentType }) : blob;
  // IE10+
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).msSaveOrOpenBlob(blobFile, filename);
  } else {
    // Others
    const url = window.URL.createObjectURL(blobFile);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  }
};

/**
 * extract file name from content-disposition header.
 * matches CDHeader = attachment;(space)filename=sample-downloaded-report-file-2022-02.xlsx(;)(other-parameters)
 * where content in brackets is optional.
 * caveat is if filename itself contains a semicolon
 *
 * @param CDHeader content-disposition header
 * @returns filename extracted from content-disposition header
 */
export const getFileNameFromCDHHeader = (CDHeader: string) => {
  const fileName = CDHeader.split('filename=')[1].split(';')[0];
  return fileName;
};

/**
 * check if a date object is valid.
 *
 * @param date - date object under evaluation
 */
export function isValidDate(date?: Date) {
  // Check if the provided date is a valid Date object
  if (date) {
    return !isNaN(new Date(date).getTime());
  }
  return false;
}
