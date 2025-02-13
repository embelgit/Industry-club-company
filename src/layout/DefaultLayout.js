import React from 'react';
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from '../components/index';
// import "./Global.css"

const DefaultLayout = () => {
  return (
    <div
      style={{
        backgroundColor: '#F3F4F7',
      }}>
      {/* <AppSidebar /> */}
      <AppHeader />
      <div className="wrapper d-flex flex-column min-vh-100">
        {/* <AppHeader /> */}
        {/* <AppSidebar />

        <AppContent />

        <AppFooter /> */}
      </div>
    </div>
  );
};

export default DefaultLayout;
