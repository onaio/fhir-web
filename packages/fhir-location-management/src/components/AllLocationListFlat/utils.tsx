import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { Dictionary } from '@onaio/utils';
import { MATCH_SEARCH_MODE } from '../../constants';

/**
 * @param bundle - a fhir resource bundle api response
 */
export function getEntryFromBundle<TEntry>(bundle: IBundle) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const entry = bundle.entry?.filter((x) => x !== undefined) || [];
  return entry as TEntry[];
}

/**
 * @param resource - a fhir resource
 * @param resourcesById - a Dictionary fhir resource by id
 */
export function getResourceParentName(
  resource: Dictionary,
  resourcesById: Dictionary<Resource>
): string {
  const partOfRef = resource.partOf?.reference;
  const partOfDisplay = resource.partOf?.display;
  if (!partOfRef) {
    return '';
  }
  const parentId = partOfRef.split('/')[1];
  const parentResource: Dictionary = resourcesById[parentId];
  const parentName = parentResource.name;
  return parentName || partOfDisplay || '';
}

/**
 * @param data - a fhir resource bundle entry
 */
export function getTableData(data: BundleEntry[]) {
  const resourcesById: Dictionary<Resource> = {};
  const tableData: Dictionary<string>[] = [];
  data.forEach((entry) => {
    const id = entry.resource?.id;
    if (id) {
      resourcesById[id] = entry.resource as Resource;
    }
  });

  data.forEach((entry) => {
    if (entry.search?.mode === MATCH_SEARCH_MODE) {
      const resource = entry.resource as Dictionary;
      const rowData = {
        key: resource.id,
        id: resource.id,
        name: resource.name,
        type: resource.physicalType.coding[0].display,
        status: resource.status,
        parent: getResourceParentName(resource, resourcesById),
      };
      tableData.push(rowData);
    }
  });
  return tableData;
}
