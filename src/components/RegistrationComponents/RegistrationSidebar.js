// import {
//   CCloseButton,
//   CSidebar,
//   CSidebarBrand,
//   CSidebarFooter,
//   CSidebarHeader,
//   CSidebarToggler,
// } from '@coreui/react';
// import {useDispatch, useSelector} from 'react-redux';
// import React from 'react';

// // sidebar nav config
// import navigation from '../../_RegistrationNav';
// import {sygnet} from 'src/assets/brand/sygnet';
// import {RegistrationSidebarNav} from './RegistrationSidebarNav';

// const RegistrationSidebar = () => {
//   const dispatch = useDispatch();
//   const unfoldable = useSelector(state => state.sidebarUnfoldable);
//   const sidebarShow = useSelector(state => state.sidebarShow);

//   return (
//     <CSidebar
//       className="border-end"
//       colorScheme="light"
//       position="fixed"
//       unfoldable={unfoldable}
//       visible={sidebarShow}
//       onVisibleChange={visible => {
//         dispatch({type: 'set', sidebarShow: visible});
//       }}
//       style={{top: '65px'}}>
//       <RegistrationSidebarNav items={navigation} />
//     </CSidebar>
//   );
// };

// export default React.memo(RegistrationSidebar);

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import {useDispatch, useSelector} from 'react-redux';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {RegistrationSidebarNav} from './RegistrationSidebarNav';
import navigation from '../../_RegistrationNav';
import {getFormStatusAndPercentage} from '../../service/RegistrationModule/CompanyDetailsRegisterAPIs';

const RegistrationSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector(state => state.sidebarUnfoldable);
  const sidebarShow = useSelector(state => state.sidebarShow);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [statusCache, setStatusCache] = useState({});

  const handleNavigation = async (path, moduleName) => {
    console.log(`Navigating to: ${path}, Module: ${moduleName}`);
    setLoader(true);
    try {
      const companyId = sessionStorage.getItem('fkCompanyId');

      if (!moduleName) {
        navigate(path);
        return;
      }

      const result = await getFormStatusAndPercentage(companyId, moduleName);
      console.log('API Response:', result);

      const Value = result?.data?.value?.toLowerCase() === 'true';
      console.log('Fetched Value:', Value);

      setStatusCache(prev => ({...prev, [moduleName]: Value}));
      if (Value) {
        console.log(`Navigating to ${path}`);
        navigate(path);
      } else {
        // alert(
        //   `You don't have access to the ${moduleName} section. Please complete the previous forms.`,
        // );
        swal({
          title: 'Access Denied',
          text: `You don't have access to the ${moduleName} section. Please complete the previous forms.`,
          icon: 'warning',
          timer: 5000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error fetching form status:', error);
      alert('Failed to check access. Please try again later.');
    } finally {
      setLoader(false);
    }
  };

  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={visible => dispatch({type: 'set', sidebarShow: visible})}
      style={{top: '65px'}}>
      <RegistrationSidebarNav
        items={navigation}
        onNavClick={handleNavigation} // Pass the handleNavigation prop to sidebar nav
      />
    </CSidebar>
  );
};

export default React.memo(RegistrationSidebar);
