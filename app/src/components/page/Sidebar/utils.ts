import { MenuItems } from '.';

export const getActiveKey = (menus: MenuItems[], loc: string[]) => {
  let activeKey = '';
  function mapMenus(menu: MenuItems) {
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
