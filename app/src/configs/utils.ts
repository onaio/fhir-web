/** Returns a value in window._env_ or process.env or the defaultValue passed in.
 *
 * @param name - The configurable name that is a property of the environment/configuration.
 * @param defaultValue - The default value to return the value is not defined in process.env and window._env_.
 */
export const setEnv = (name: string, defaultValue: any) => {
  const { [name]: envValue } = import.meta.env;
  const value = typeof envValue === 'undefined' ? defaultValue : envValue;

  if (typeof (window as any)._env_ === 'undefined') {
    return value;
  }
  const { [name]: confValue } = (window as any)._env_;

  return confValue === undefined ? value : confValue;
};
