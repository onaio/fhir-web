import { Route } from '../../../routes';

/** Gets Active key for menu based on path from routes
 *
 * @param routes - The routes to get search the active route from
 * @param path - an array of menu location path
 */
export function getActiveKey(path: string, routes: Route[]) {
  let activeKey: string | undefined;

  function mapMenus(menu: Route) {
    // Exact Match
    if (path === menu.url) activeKey = menu.key;
    // Trying to Match with Children
    if (menu.children) menu.children.forEach(mapMenus);
  }

  for (let i: number = 0; i < routes.length; i++) {
    let route = routes[i];
    if (activeKey === undefined) {
      mapMenus(route);
    }
  }

  return activeKey;
}

export function getPathKey(path: string, routes: Route[]) {
  let activePaths: string[] = [];
  let openKey: string | undefined;

  function mapPaths(menu: Route) {
    // Check if the menu has children
    if (menu.children) {
      // Recursively call mapMenus on each child
      for (const child of menu.children) {
        // Exact Match
        if (path === child.url) {
          openKey = menu.key;
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

  for (let i: number = 0; i < routes.length; i++) {
    let route = routes[i];
    if (openKey === undefined) {
      mapPaths(route);
    }
  }
  activePaths = activePaths.reverse();
  return activePaths;
}
