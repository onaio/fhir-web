import { Route } from '../../../routes';

/** Gets the Active key and Active paths for menu based on path from routes
 *
 * @param routes - The routes to get search the active route from
 * @param path - an array of menu location path
 */

export function getActivePath(path: string, routes: Route[]) {
  let activePaths: string[] = [];
  let activeKey: string | undefined;
  let openKey: string | undefined;

  function mapPaths(menu: Route) {
    if (path === menu.url) activeKey = menu.key;
    // Check if the menu has children
    if (menu.children) {
      // Recursively call mapMenus on each child
      for (const child of menu.children) {
        // Exact Match
        if (path === child.url) {
          openKey = menu.key;
          activeKey = child.key;
        }
        mapPaths(child);
        if (openKey) {
          break;
        }
      }
      if (openKey) {
        activePaths.push(menu.key);
      }
    }
  }

  for (const route of routes) {
    if (activeKey === undefined) {
      mapPaths(route);
    }
    if (activeKey) break;
  }

  activePaths = activePaths.reverse();

  return {
    activeKey,
    activePaths,
  };
}
