import './scss/style.scss';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {CSpinner, useColorModes} from '@coreui/react';
import React, {Suspense, useEffect} from 'react';
import {activateGeod, closeGeod} from './Store/index';
import DefaultLayout from './layout/DefaultLayout';
import {connect} from 'react-redux';
import {useSelector} from 'react-redux';
import Login from '../src/views/pages/login/Login';

import Search from './views/Master/Search/Search';
import IndustryProductSearch from './views/Master/Search/IndustryProductSearch';
import CompanyDetails from './views/Master/Search/CompanyDetails';
import ProductDetails from './views/Master/Search/ProductDetails';
import SearviceDetails from './views/Master/Search/SearviceDetails';
import InfrastructureDetails from './views/Master/Search/InfrastructureDetails';
import RegistrationLayout from './layout/RegistrationLayout';
import Dashboard from './views/dashboard/Dashboard';
import Subscription from './views/Master/Subscription/Subscription';
import MyProduct from './views/Master/MyProduct/MyProduct';
import MyService from './views/Master/MyService/MyService';
import CompanyBuyingSelling from './views/Master/Company Buying & Selling/CompanyBuyingSelling';
import Report from './views/Master/Report/Report';
import NetworkConnection from './views/Master/NetworkConnection/NetworkConnection';
import ProductPromotion from './views/Master/ProductPromotion/ProductPromotion';
import InfrastructureOnLease from './views/Master/InfrastructureOnLease/InfrastructureOnLease';
import TargetService from './views/Master/TargetService/TargetService';
import Referel from './views/Master/Referral/Referral';
import Wallet from './views/Master/Wallet';
import UpdateCompanyDetailsRegister from './views/RegistrationModule/CompanyDetailRegister/UpdateCompanyDetailsRegister';
import UpdateDirectorDetails from './views/RegistrationModule/DirectorDetailRegister/UpdateDirectorDetails';
import UpdateDepartmentDetails from './views/RegistrationModule/DepartmentDetail/UpdateDepartmentDetails';
import UpdateProductDetails from './views/RegistrationModule/ProductDetail.js/UpdateProductDetails';
import UpdateCompanyBuySell from './views/Master/Company Buying & Selling/UpdateCompanyBuySell';
import UpdateProductPromotion from './views/Master/ProductPromotion/UpdateProductPromotion';
import EditInfrastructure from './views/Master/InfrastructureOnLease/EditInfrastructure';
import UpdateTargetProduct from './views/Master/MyProduct/TargetProduct/UpdateTargetProduct';
import Messages from './views/Master/Messages/Messages';
import ProductDetail from './views/Master/MyProduct/ProductDetail';
import Signup from './views/pages/Signup';

// Pages
// const VerifyMail = React.lazy(() => import("./views/pages/VerifyMail"));
// const VerifyOTP = React.lazy(() => import("./views/pages/register/VerifyOTP"));
// const ForgotPassword = React.lazy(() => import("./views/pages/ForgotPassword"));

const App = props => {
  const {isColorModeSet, setColorMode} = useColorModes('industries-club');
  const storedTheme = useSelector(state => state.theme);
  console.log('props App :-', props);

  const isAuthenticated = props => {
    return !!props?.geod?.title; // Double negation to ensure it returns a boolean
  };
  if (!props?.geod) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme =
      urlParams.get('theme') &&
      urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated(props) ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="*"
          element={
            isAuthenticated(props) ? (
              <RegistrationLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {[
          {path: '/dashboard', element: <Dashboard />},
          {path: '/master/subscription', element: <Subscription />},
          {path: '/master/myProduct', element: <MyProduct />},
          {path: '/master/myService', element: <MyService />},
          {
            path: '/master/companyBuyingSelling',
            element: <CompanyBuyingSelling />,
          },
          {path: '/master/Report', element: <Report />},
          {path: '/master/Referral', element: <Referel />},
          {path: '/master/NetworkConnection', element: <NetworkConnection />},
          {path: '/master/ProductPromotion', element: <ProductPromotion />},
          {
            path: '/master/InfrastructureOnLease',
            element: <InfrastructureOnLease />,
          },
          {path: '/master/TargetService', element: <TargetService />},
          {path: '/search', element: <Search />},
          {
            path: '/industry-product-wiseSearch',
            element: <IndustryProductSearch />,
          },
          {path: '/company-Details', element: <CompanyDetails />},
          {path: '/product-Details', element: <ProductDetails />},
          {path: '/searvice-Details', element: <SearviceDetails />},
          {path: '/messages', element: <Messages />},
          {path: '/infrastructure-Details', element: <InfrastructureDetails />},
          {path: '/master/Wallet', element: <Wallet />},
          {
            path: '/update-Company-BuySell/:id',
            element: <UpdateCompanyBuySell />,
          },
          {
            path: '/update-Product-Promotion/:id',
            element: <UpdateProductPromotion />,
          },
          {path: '/edit-Infrastructure/:id', element: <EditInfrastructure />},
          {path: '/edit-TargetedProduct/:id', element: <UpdateTargetProduct />},
          {path: '/ProductDetail/:index', element: <ProductDetail />},
        ].map(({path, element}) => (
          <Route
            key={path}
            path={path}
            element={
              isAuthenticated(props) ? element : <Navigate to="/login" />
            }
          />
        ))}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

const mapStateToProps = state => {
  console.log('Current State:', state); // Debugging line
  return {
    geod: state.geod,
  };
};

const mapDispatchToProps = {
  activateGeod,
  closeGeod,
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
