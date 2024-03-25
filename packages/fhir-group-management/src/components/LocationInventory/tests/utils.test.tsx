import {
  handleDisabledPastDates,
  handleDisabledFutureDates,
  getValuesetSelectOptions,
  isAttractiveProduct,
  productAccountabilityMonths,
  getMember,
  generateCharacteristics,
  getLocationInventoryPayload,
} from '../utils';
import dayjs from 'dayjs';
import {
  expandedValueSets,
  unicefValuesetConcept,
  donorValuesetConcept,
  productCharacteristics,
  formValues,
  locationResourcePayload,
  mockResourceId,
  productQuantity,
} from './fixtures';
import { commodity1 } from '../../CommodityAddEdit/Eusm/tests/fixtures';
import { attractiveCharacteristicCode } from '../../../helpers/utils';

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => mockResourceId,
  };
});

describe('fhir-group-management/src/components/LocationInventory/utils', () => {
  it('handleDisabledPastDates and handleDisabledFutureDates works as expected', () => {
    const now = dayjs();
    const future = now.add(2, 'day');
    const past = now.subtract(2, 'day');
    //   handleDisabledPastDates
    expect(handleDisabledPastDates()).toEqual(false);
    expect(handleDisabledPastDates(now)).toEqual(false);
    expect(handleDisabledPastDates(future)).toEqual(false);
    expect(handleDisabledPastDates(past)).toEqual(true);
    //   handleDisabledFutureDates
    expect(handleDisabledFutureDates()).toEqual(false);
    expect(handleDisabledFutureDates(now)).toEqual(true);
    expect(handleDisabledFutureDates(future)).toEqual(true);
    expect(handleDisabledFutureDates(past)).toEqual(false);
  });

  it('getValuesetSelectOptions works as expected', () => {
    expect(getValuesetSelectOptions(expandedValueSets)).toEqual([
      {
        label: 'No complications',
        value: JSON.stringify({
          code: 'ANC.End.26',
          display: 'No complications',
          system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
        }),
      },
      {
        label: 'Postpartum haemorrhage',
        value: JSON.stringify({
          code: 'ANC.End.27',
          display: 'Postpartum haemorrhage',
          system: 'http://smartregister.org/CodeSystem/eusm-unicef-sections',
        }),
      },
    ]);
  });

  it('get attractive items works as expected', () => {
    const noAttractiveCharacteristic = commodity1.characteristic?.filter(
      (char) => char.code.coding?.[0].code !== attractiveCharacteristicCode
    );
    const newCommodity = {
      ...commodity1,
      characteristic: noAttractiveCharacteristic,
    };
    expect(isAttractiveProduct()).toEqual(false);
    expect(isAttractiveProduct(commodity1)).toEqual(true);
    expect(isAttractiveProduct(newCommodity)).toEqual(false);
  });

  it('get item accounterbility months works as expected', () => {
    expect(productAccountabilityMonths()).toEqual(undefined);
    expect(productAccountabilityMonths(commodity1)).toEqual(12);
  });

  it('get resource member works as expected', () => {
    const startDate = dayjs();
    const endDate = dayjs().add(2, 'day');
    expect(getMember('productId', startDate, endDate)).toEqual([
      {
        entity: {
          reference: 'Group/productId',
        },
        period: {
          start: new Date(startDate.toDate()).toISOString(),
          end: new Date(endDate.toDate()).toISOString(),
        },
        inactive: false,
      },
    ]);
  });

  it('get resource characteristics works as expected', () => {
    expect(
      generateCharacteristics(unicefValuesetConcept, donorValuesetConcept, productQuantity)
    ).toEqual(productCharacteristics);
  });

  it('generate location inventory payload works as expected', () => {
    expect(getLocationInventoryPayload(formValues, false)).toEqual(locationResourcePayload);
  });
});
