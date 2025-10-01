'use client';

import React, { useState, createContext } from 'react';

export const LayoutContext = createContext({});

export const LayoutProvider = ({ children }) => {
  const [layoutConfig, setLayoutConfig] = useState({
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14,
  });

  const [layoutState, setLayoutState] = useState({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  });

  const onMenuToggle = () => {
    if (isOverlay()) {
      setLayoutState((prevLayoutState) => ({ 
        ...prevLayoutState, 
        overlayMenuActive: !prevLayoutState.overlayMenuActive 
      }));
    }

    if (isDesktop()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive,
      }));
    } else {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
      }));
    }
  };

  const isOverlay = () => {
    return layoutConfig.menuMode === 'overlay';
  };

  const isDesktop = () => {
    return typeof window !== 'undefined' && window.innerWidth > 991;
  };

  const value = {
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    isOverlay,
    isDesktop,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};