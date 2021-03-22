import { Route } from '../../../routes';

/**
 *
 * @param routes - The routes to get search the active route from
 * @param pathname - an array of menu location path
 */
export function getActiveKey(pathname: string[], routes: Route[]) {
  const url = '/' + pathname.join('/');
  let activeKey: string | undefined;

  function mapMenus(menu: Route) {
    // Matching Url
    if (menu.url && url.includes(menu.url)) activeKey = menu.key;

    // Exact Match
    if (url === menu.url) activeKey = menu.key;
    // Trying to Match with Children
    else if (menu.children && url !== menu.url) menu.children.forEach(mapMenus);
  }
  routes.forEach(mapMenus);

  return activeKey;
}
