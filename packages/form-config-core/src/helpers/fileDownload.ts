/**
 * Download files
 *
 * @param {Blob} file file to be downloaded
 * @param {string} fileName file name
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DownloadFile = (file: any, fileName: string) => {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Handles file downloads from server
 *
 * @param {string} data a blob file
 * @param {string} fileName file name
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDownload = (data: any, fileName: string) => {
  const content = JSON.parse(data);
  const blob = new Blob([content], { type: 'application/json' });
  DownloadFile(blob, fileName);
};
