'use client';

import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { LayoutContext } from './context/layout-context';
import { selectUser } from '../redux/feature/auth-slice';
import { authService } from '../services/api-service/auth-service';
import PAGE_ROUTES from '../constants/page-constants';

const AppTopbar = forwardRef((props, ref) => {
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  const { onMenuToggle } = useContext(LayoutContext);
  const { push } = useRouter();
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : 'User';

  const options = [
    { name: 'Profile', code: 'profile' }, 
    { name: 'Settings', code: 'settings' },
    { name: 'Sign Out', code: 'signout' }
  ];

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const handleOptionClick = (option) => {
    if (option.code === 'profile') {
      push(PAGE_ROUTES.profile);
    } else if (option.code === 'settings') {
      push(PAGE_ROUTES.settings);
    } else if (option.code === 'signout') {
      signOut();
    }
  };

  const signOut = () => {
    authService.logout();
    push(PAGE_ROUTES.login);
  };

  return (
    <div className="layout-topbar">
      <Link href={PAGE_ROUTES.overview} className="layout-topbar-logo">
        <span>IKER Finance</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
        aria-label="Menu Toggle Button"
      >
        <i className="pi pi-bars" />
      </button>

      <div className="layout-topbar-right-icons">
        <div ref={topbarmenuRef} className="layout-topbar-menu profile-button">
          <i className="pi pi-user" />
          <span>{userName}</span>
        </div>
      </div>

      <Dropdown
        value={null}
        onChange={(e) => handleOptionClick(e.value)}
        options={options}
        optionLabel="name"
        placeholder="Menu"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        panelClassName="layout-topbar-dropdown"
        ref={topbarmenubuttonRef}
      />
    </div>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;