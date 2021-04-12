import { Route } from '../../../routes';

/** Gets Active key for menu based on path from routes
 *
 * @param routes - The routes to get search the active route from
 * @param path - an array of menu location path
 */
export function getActiveKey(path: string, routes: Route[]) {
  let activeKey: string | undefined;

  function mapMenus(menu: Route) {
    // Matching Url
    if (menu.url && path.includes(menu.url)) activeKey = menu.key;

    // Exact Match
    if (path === menu.url) activeKey = menu.key;
    // Trying to Match with Children
    else if (menu.children && path !== menu.url) menu.children.forEach(mapMenus);
  }
  routes.forEach(mapMenus);

  return activeKey;
}
