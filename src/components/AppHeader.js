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
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import React, {useEffect, useRef, useState} from 'react';
import {cilBell, cilSpeech, cilWallet, cilSearch} from '@coreui/icons';
import swal from 'sweetalert';
import {logOut} from '../service/AllAuthAPI';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {connect} from 'react-redux';
import {activateGeod, closeGeod} from '../Store/index';
import {AppBreadcrumb} from './index';
import {AppHeaderDropdown} from './header/index';
import CIcon from '@coreui/icons-react';
import {NavLink} from 'react-router-dom';
import Select from 'react-select';
import logoRemoveBg from 'src/assets/logo-removebg.png';
import {getSmsCount} from '../service/AllNotificationCount';
import {
  getKeywordListSuggetions,
  getKeywordUserWise,
} from '../service/masterModule/SearchApi';
import {getWalletCount} from '../service/masterModule/Wallet';

const AppHeader = () => {
  const headerRef = useRef();
  const [notificationCount, setNotificationCount] = useState(0);
  const [walletCount, setWalletCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const {colorMode, setColorMode} = useColorModes(
    'coreui-free-react-admin-template-theme',
  );

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

  const fetchNotificationCount = async companyId => {
    setLoading(true);
    try {
      const response = await getSmsCount(companyId);
      const count = response?.data || 0;
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchWalletCount = async companyId => {
    setLoading(true);
    try {
      const response = await getWalletCount(companyId);
      const count =
        response.data.walletCompanyCount +
        response.data.walletProductCount +
        response.data.walletServiceCount;
      console.log(count);
      setWalletCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKeywordListSuggestions = async (companyId, keyword) => {
    if (!keyword.trim()) {
      setSearchHistory([]); // Clear history if the keyword is empty
      return;
    }
    setLoading(true);
    try {
      const response = await getKeywordListSuggetions(companyId, keyword);
      // Check if the response contains the 'keyword' array
      const keywords = response?.data?.keyword || [];
      setSearchHistory(keywords); // Update the search history with the keywords
    } catch (error) {
      console.error('Error fetching keyword list suggestions:', error);
      setSearchHistory([]); // Clear history if an error occurs
    } finally {
      setLoading(false);
    }
  };
  const fetchKeywordUserWise = async companyId => {
    setLoading(true);
    try {
      const response = await getKeywordUserWise(companyId);
      console.log('fetching keyword list suggestions', response);

      // Split the comma-separated keywords into an array
      const keywords = response?.data?.keyword[0]
        ? response.data.keyword[0]
            .split(',')
            .filter(keyword => keyword.trim() !== '')
        : [];

      setSearchHistory(keywords); // Set the processed keywords array
    } catch (error) {
      console.error('Error fetching keyword list suggestions:', error);
      setSearchHistory([]); // Clear the search history on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchNotificationCount(companyId);
      fetchWalletCount(companyId);
    }
  }, []);

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId && searchInput) {
      const delayDebounceFn = setTimeout(() => {
        fetchKeywordListSuggestions(companyId, searchInput);
      }, 500); // Debounce API call by 500ms
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchInput]);

  const onLogOut = async e => {
    e.preventDefault();
    try {
      const result = await logOut();
      if (result.status === 200) {
        sessionStorage.clear();
        swal({
          title: 'Logout successful!',
          icon: 'success',
          timer: 2000,
          buttons: false,
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Something went wrong! Please try again later.';
      swal({
        title: 'Logout Failed',
        text: errorMessage,
        icon: 'warning',
        timer: 2000,
        buttons: false,
      });
    }
  };

  const handleSearchBarClick = async () => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      navigate('/search');
      await fetchKeywordUserWise(companyId);
    }
    setShowHistory(true);
  };

  const handleMessageIconClick = () => {
    console.log('Navigating to messages...');
    navigate('/messages');
  };

  const handleSearchInputChange = e => {
    const value = e.target.value.trim();
    setSearchInput(value);

    if (value) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
      setSearchHistory([]);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId && searchInput) {
      const delayDebounceFn = setTimeout(() => {
        fetchKeywordListSuggestions(companyId, searchInput);
      }, 1000); // Debounce API call by 500ms
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchInput]);

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  return (
    <CHeader
      position="sticky"
      className="mb-4 p-0 d-flex flex-nowrap"
      style={{backgroundColor: 'navy'}}
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
      <CContainer className="border-bottom" fluid>
        <CRow className="flex-grow-1 justify-content-center align-items-center">
          <CCol xs={12} md={12} lg={8}>
            <div style={{position: 'relative', width: '90%'}}>
              <CInputGroup>
                <CInputGroupText
                  id="search-icon"
                  style={{borderRadius: '10px 0 0 10px'}}>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="Search..."
                  aria-label="Search"
                  aria-describedby="search-icon"
                  style={{height: '35px'}}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onClick={handleSearchBarClick} // Call fetchKeywordUserWise on click
                  onFocus={handleSearchBarClick} // Call fetchKeywordUserWise on focus
                />
              </CInputGroup>
              {showHistory && searchInput && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    borderRadius: '5px',
                    padding: '10px',
                  }}>
                  <CListGroup>
                    {searchHistory.length > 0 ? (
                      searchHistory.map((item, index) => (
                        <CListGroupItem
                          key={index}
                          onClick={() => {
                            navigate('/industry-product-wiseSearch', {
                              state: {subcategory: item},
                            });
                            setSearchInput(item);
                            handleCloseHistory();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: '10px',
                          }}>
                          <CIcon icon={cilSearch} size="sm" />
                          <Link
                            to={{
                              pathname: '/CompanyCard',
                            }}
                            state={{subcategory: item}}
                            style={{
                              textDecoration: 'none',
                            }}>
                            {item}
                          </Link>
                        </CListGroupItem>
                      ))
                    ) : (
                      <p style={{margin: 0}}>No search history available.</p>
                    )}
                  </CListGroup>
                </div>
              )}
            </div>
          </CCol>
        </CRow>

        {/* <CHeaderNav>
          <CCol xs="auto" className="d-flex align-items-center gap-3">
         
            <div className="position-relative text-center">
              <CIcon
                icon={cilSpeech}
                size="lg"
                className="text-white cursor-pointer"
                onClick={() => navigate('/messages')}
              />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
              <div className="text-white small">Messages</div>
            </div>

         
            <div className="text-center">
              <CIcon icon={cilBell} size="lg" className="text-white" />
              <div className="text-white small">Notifications</div>
            </div>

        
            <CButton
              as={Link}
              to="/master/Wallet"
              className="px-0 bg-transparent border-0 text-center">
              <CIcon icon={cilWallet} size="lg" className="text-white" />
              <div className="text-white small">Wallet</div>
            </CButton>
          </CCol>
          <div className="text-center">
            <AppHeaderDropdown logOut={e => onLogOut(e)} />
          </div>
        </CHeaderNav> */}

        <CHeaderNav>
          <CCol
            xs="auto"
            className="d-flex justify-content-evenly align-items-center w-100">
            {/* Messages Icon */}
            <div className="position-relative text-center">
              <CIcon
                icon={cilSpeech}
                size="lg"
                className="text-white cursor-pointer"
                onClick={() => navigate('/messages')}
              />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
              <div className="text-white custom-small-text px-2">Messages</div>
            </div>

            {/* Notification Icon */}
            <div className="text-center">
              <CIcon icon={cilBell} size="lg" className="text-white" />
              <div className="text-white custom-small-text px-2">
                Notifications
              </div>
            </div>

            {/* Wallet Icon */}
            <CButton
              as={Link}
              to="/master/Wallet"
              className="px-0 bg-transparent border-0 text-center position-relative">
              <CIcon icon={cilWallet} size="lg" className="text-white" />
              {walletCount > 0 && (
                <span
                  className="badge bg-danger position-absolute"
                  style={{
                    top: '1px',
                    right: '2px',
                    fontSize: '9px',
                    padding: '3px 5px',
                    borderRadius: '50%',
                  }}>
                  {walletCount}
                </span>
              )}
              <div className="text-white custom-small-text px-2">Wallet</div>
            </CButton>

            {/* User Dropdown */}
            <div className="text-center">
              <AppHeaderDropdown logOut={e => onLogOut(e)} />
            </div>
          </CCol>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

const mapStateToProps = state => ({
  geod: state.geod,
});

const mapDispatchToProps = {
  activateGeod,
  closeGeod,
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppHeader);
export default AppContainer;
