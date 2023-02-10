import { ProductCatalogue } from '..';

export const product1 = {
  uniqueId: 1,
  productName: 'Scale',
  isAttractiveItem: true,
  materialNumber: 'MT-123',
  availability: 'available',
  condition: 'good condition',
  appropriateUsage: 'staff is trained to use it appropriately',
  accountabilityPeriod: 1,
  photoURL: '',
  serverVersion: 123456,
};

export const product2 = {
  uniqueId: 2,
  productName: 'Midwifery Kit',
  isAttractiveItem: false,
  materialNumber: 'MT-124',
  availability:
    'Kit composed of +/- 50 items used by midwives during labour. Supplied in a box marked �UNICEF�. It should be located in the maternity unit of the facility.',
  condition:
    'The kit is designed to be used for approximately 50 births. After that, key components may be missing, it�s important to check with the midwife that the kit can still be used fully.',
  appropriateUsage:
    'Note in the comments whatever items may be missing from the kit. as well as other items which the midwife may feel are necessary',
  accountabilityPeriod: 12,
  photoURL: '',
  serverVersion: 123456,
};

export const products: ProductCatalogue[] = [product1, product2];
