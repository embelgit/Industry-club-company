import React from 'react';
import {CNavGroup, CNavItem, CNavTitle} from '@coreui/react';
import CIcon from '@coreui/icons-react';
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
  cilBullhorn,
  cilFlagAlt,
} from '@coreui/icons';

const _nav = [
  {
    component: CNavTitle,
    name: '',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subscription',
    to: '/master/subscription',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Product',
    to: '/master/myProduct',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Service',
    to: '/master/myService',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Company Buying Selling',
    to: '/master/companyBuyingSelling',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/master/Report',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Referral',
    to: '/master/Referral',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Network Connection',
    to: '/master/NetworkConnection',
    icon: <CIcon icon={cilShareAll} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Product Promotion',
    to: '/master/ProductPromotion',
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Infrastructure On Lease',
    to: '/master/InfrastructureOnLease',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Target Service',
    to: '/master/TargetService',
    icon: <CIcon icon={cilFlagAlt} customClassName="nav-icon" />,
  },
];

export default _nav;
