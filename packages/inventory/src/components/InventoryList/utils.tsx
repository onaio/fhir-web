/**
 * function which removed last item of array
 *
 * @param arr - original array
 */
export const removeLastItem = (arr: string[]) => {
  const arrayOfInterest = arr.slice(0, arr.length - 1).join(',');
  return arrayOfInterest;
};
