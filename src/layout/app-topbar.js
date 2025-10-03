'use client';

import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu } from 'primereact/menu';
import { LayoutContext } from './context/layout-context';
import { selectUser } from '../redux/feature/auth-slice';
import { authService } from '../services/api-service/auth-service';
import PAGE_ROUTES from '../constants/page-constants';

const AppTopbar = forwardRef((props, ref) => {
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const { onMenuToggle } = useContext(LayoutContext);
  const { push } = useRouter();
  
  const user = useSelector(selectUser);
  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : 'User';
  const userInitials = user?.firstName 
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
  }));

  const signOut = () => {
    authService.logout();
    push(PAGE_ROUTES.login);
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => push(PAGE_ROUTES.profile),
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => push(PAGE_ROUTES.settings),
    },
    {
      separator: true,
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: signOut,
    },
  ];

  return (
    <div className="layout-topbar">
      <Link href={PAGE_ROUTES.overview} className="layout-topbar-logo">
        <span>IKER Finance</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="layout-menu-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <div className="layout-topbar-right-icons">
        <button 
          ref={topbarmenuRef} 
          className="profile-button"
          onClick={(e) => profileMenuRef.current?.toggle(e)}
          type="button"
        >
          <div className="profile-avatar">{userInitials}</div>
          <span className="profile-name">{userName}</span>
          <i className="pi pi-chevron-down profile-chevron" />
        </button>
      </div>

      <Menu 
        model={menuItems} 
        popup 
        ref={profileMenuRef} 
        className="profile-dropdown-menu"
      />
    </div>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;