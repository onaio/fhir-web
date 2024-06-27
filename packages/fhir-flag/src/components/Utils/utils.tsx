export interface CloseFlagFormFields {
  productName: string;
  locationName?: string;
  status?: string;
  comments?: string;
}

export const buildInitialFormFieldValues = (
  productName?: any,
  locationName?: string
): CloseFlagFormFields => {
  return {
    productName,
    locationName,
  };
};
