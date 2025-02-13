import {CNavGroup, CNavItem, CNavTitle} from '@coreui/react';
import {
  cilSpeedometer,
  cilDescription,
  cilPuzzle,
  cilStar,
  cilUser,
  cilChartPie,
  cilGift,
  cilShareAll,
  cilHome,
  cilIndustry,
  cilMoney,
  cilTask,
  cilLocationPin,
  cilTruck,
  cilSwapHorizontal,
  cilBuilding,
} from '@coreui/icons';

import CIcon from '@coreui/icons-react';
import React from 'react';

const _RegistrationNav = [
  {
    component: CNavTitle,
    name: '',
  },
  // ,,,,,,,,,,
  {
    component: CNavItem,
    name: 'Company Detail Register',
    to: '/company-detail-register',
    moduleName: '',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Business Details',
    to: '/company-business-details',
    moduleName: 'register',
    icon: <CIcon icon={cilIndustry} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Director Details',
    to: '/director-detail-register',
    moduleName: 'director',

    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Department Details',
    to: '/department-detail',
    moduleName: 'department',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Product Details',
    to: '/product-detail',
    moduleName: 'product',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Service Details',
    to: '/service-detail',
    moduleName: 'service',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Infrastructure Details',
    to: '/infrastructure-detail',
    moduleName: 'infra',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Turnover Details',
    to: '/turnover-details',
    moduleName: 'turnover',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Certificate Details',
    to: '/certificate-details',
    moduleName: 'certificate',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Target Client Locations',
    to: '/target-client-location',
    moduleName: 'client',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Targeted Vendors',
    to: '/targeted-vendor',
    moduleName: 'vendor',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Import/Export Details',
    to: '/import-export-detail',
    moduleName: 'import',
    icon: <CIcon icon={cilSwapHorizontal} customClassName="nav-icon" />,
  },
];

export default _RegistrationNav;
