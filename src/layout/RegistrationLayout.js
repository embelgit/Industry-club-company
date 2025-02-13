import React from 'react';
import RegistrationHeader from '../components/RegistrationComponents/RegistrationHeader';
import RegistrationSidebar from '../components/RegistrationComponents/RegistrationSidebar';
import RegistrationContent from '../components/RegistrationComponents/RegistrationContent';
import RegistrationFooter from '../components/RegistrationComponents/RegistrationFooter';
import {AppHeader} from '../components';

const RegistrationLayout = () => {
  return (
    // <div
    //   style={{
    //     backgroundColor: '#F3F4F7',
    //   }}>
    //   {/* <AppSidebar /> */}
    //   <RegistrationHeader />
    //   <div className="wrapper d-flex flex-column">
    //     {/* <AppHeader /> */}

    //     <RegistrationSidebar />
    //     <div
    //       className="body flex-grow-1"
    //       style={{
    //         paddingLeft: '273px',
    //         paddingRight: '19px',
    //         paddingTop: '11px',
    //       }}>
    //       <RegistrationContent />
    //     </div>
    //   </div>
    //   <RegistrationFooter />
    // </div>
    <div
      style={{
        backgroundColor: '#F3F4F7',
      }}>
      {/* <AppSidebar /> */}
      <RegistrationHeader />
      <div className="wrapper d-flex flex-column min-vh-100">
        {/* <AppHeader /> */}
        <RegistrationSidebar />
        <div
          className="body flex-grow-1"
          style={{
            paddingLeft: '273px',
            paddingRight: '19px',
            paddingTop: '11px',
          }}>
          <RegistrationContent />
        </div>
        <RegistrationFooter />
      </div>
    </div>
  );
};

export default RegistrationLayout;
