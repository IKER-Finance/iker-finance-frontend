'use client';

import React from 'react';
import AppMenuItem from './app-menu-item';
import { MenuProvider } from './context/menu-context';
import { IKER_FINANCE_MENU_ITEMS } from '../constants/menu-constants';

const AppSidebar = () => {
  return (
    <MenuProvider>
      <ul className="layout-menu">
        {IKER_FINANCE_MENU_ITEMS.map((item, i) => {
          return !item?.separator ? (
            <AppMenuItem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator" key={i}></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppSidebar;