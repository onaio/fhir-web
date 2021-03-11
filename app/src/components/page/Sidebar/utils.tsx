import { Route } from '../../../routes';

/**
 *
 * @param menus - menu schema
 * @param loc - an array of menu location paths
 */
export const getActiveKey = (menus: Route[], loc: string[]) => {
  let activeKey = '';
  function mapMenus(menu: Route) {
    if (menu.children) {
      if (loc.join('/') !== menu.url) {
        menu.children.forEach(mapMenus);
      } else {
        activeKey = menu.key;
      }
    }
    return true;
  }
  menus.forEach(mapMenus);
  return activeKey;
};
