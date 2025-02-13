import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CSidebarHeader,
  CSidebarBrand,
  CHeaderToggler,
  CButton,
  CNavItem,
  CCol,
  useColorModes,
} from '@coreui/react';
import React, {useEffect, useRef, useState} from 'react';
import {
  cilBell,
  cilContrast,
  cilSpeech,
  cilWallet,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';
import swal from 'sweetalert';
// import {logOut} from '../service/AllAuthAPI';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {connect} from 'react-redux';
// import {activateGeod, closeGeod} from '../Store/index';
// import {AppBreadcrumb} from './index';
// import {AppHeaderDropdown} from './header/index';
import CIcon from '@coreui/icons-react';
import {NavLink} from 'react-router-dom';
import Select from 'react-select';
import logoRemoveBg from 'src/assets/logo-removebg.png';
import ProgressBar from '../../views/components/ProgressBar';
import {getPercentage} from '../../service/RegistrationModule/CompanyDetailsRegisterAPIs';
const RegistrationHeader = ({showProgressBar, props}) => {
  const headerRef = useRef();
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const {colorMode, setColorMode} = useColorModes(
    'coreui-free-react-admin-template-theme',
  );
  const [progress, setProgress] = useState(0);

  const fetchProgress = async () => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    if (!companyId) {
      console.error('No companyId found in sessionStorage');
      return;
    }
    try {
      const response = await getPercentage(companyId);

      if (
        response &&
        response.data &&
        typeof response.data.percentage === 'string'
      ) {
        // Convert percentage to a number
        const percentage = parseInt(response.data.percentage, 10);
        if (!isNaN(percentage)) {
          setProgress(percentage);
        } else {
          console.error('Invalid percentage value:', response.data.percentage);
        }
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('fkCompanyId');

    fetchProgress(companyId);
  }, []);

  const dispatch = useDispatch();
  const sidebarShow = useSelector(state => state.sidebarShow);
  // Retrieve the role from sessionStorage
  const role = sessionStorage.getItem('role');

  const formatRole = role => {
    if (!role) return 'No role available';
    return role
      .split('_') // Split words by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()); // Capitalize each word
  };

  const formattedRole = formatRole(role);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0,
        );
    });
  }, []);

  const onLogOut = async e => {
    e.preventDefault();
    try {
      let result = await logOut();
      console.log('logout result :-', result);
      if (result.status === 200) {
        props.activateGeod({title: false});
        sessionStorage.clear();
        swal({
          title: 'Logout successfully...',
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      console.log('logout error :-', error);
      if (error.response.status === 409) {
        swal({
          title: 'Warning',
          text: `${error.response.data}`,
          icon: 'warning',
          timer: 2000,
          buttons: false,
        });
      }
    }
  };

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0 d-flex flex-nowrap"
      style={{backgroundColor: 'navy', width: '100%'}}
      ref={headerRef}>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img
            className="sidebar-brand-full ms-3 w-75"
            style={{borderRadius: '10px'}}
            src={logoRemoveBg}
            alt="Logo"
          />
        </CSidebarBrand>
      </CSidebarHeader>
      {/* Progress Bar Section */}
      <div className="col d-flex justify-content-center align-items-center">
        <ProgressBar progress={progress} />
      </div>

      <div className="col-auto d-flex align-items-center">
        <h4
          className="mb-0"
          style={{
            color: 'white',
            marginRight: '10px',
            fontSize: '20px',
          }}>
          Embel Technology
        </h4>
      </div>
    </CHeader>
  );
};

// const mapStateToProps = state => ({
//   geod: state.geod,
// });

// const mapDispatchToProps = {
//   activateGeod,
//   closeGeod,
// };

// const AppContainer = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(RegistrationHeader);
export default RegistrationHeader;
