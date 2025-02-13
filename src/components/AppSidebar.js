import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import {AppSidebarNav} from './AppSidebarNav';
import CIcon from '@coreui/icons-react';
import logo from 'src/assets/brand/logo.jpeg';
import logoRemoveBg from 'src/assets/logo-removebg.png';
import navigation from '../_nav';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector(state => state.sidebarUnfoldable);
  const sidebarShow = useSelector(state => state.sidebarShow);

  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={visible => {
        dispatch({type: 'set', sidebarShow: visible});
      }}
      style={{top: '64px'}}>
      {/* <CSidebarHeader>
        <CSidebarBrand>
          <img src={logoRemoveBg} alt="Logo" className="sidebar-brand-full" />
        </CSidebarBrand>
      </CSidebarHeader> */}

      <AppSidebarNav items={navigation} />

      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({type: 'set', sidebarUnfoldable: !unfoldable})
          }
        />
      </CSidebarFooter> */}
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
