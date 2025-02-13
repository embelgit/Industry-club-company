//Dashboard
import Dashboard from './views/dashboard/Dashboard';
import MyService from './views/Master/MyService/MyService';
import CompanyBuyingSelling from './views/Master/Company Buying & Selling/CompanyBuyingSelling';
import Subscription from './views/Master/Subscription/Subscription';
import MyProduct from './views/Master/MyProduct/MyProduct';
import Report from './views/Master/Report/Report';
import Referral from './views/Master/Referral/Referral';
import NetworkConnection from './views/Master/NetworkConnection/NetworkConnection';
import ProductPromotion from './views/Master/ProductPromotion/ProductPromotion';
import InfrastructureOnLease from './views/Master/InfrastructureOnLease/InfrastructureOnLease';
import TargetService from './views/Master/TargetService/TargetService';
import Wallet from './views/Master/Wallet';
import CompanyDetailRegister from './views/RegistrationModule/CompanyDetailRegister/CompanyDetailRegister';
import CompanyBusinessDetails from './views/RegistrationModule/CompanyBusinessDetails/CompanyBusinessDetails';
import DirectorDetailRegister from './views/RegistrationModule/DirectorDetailRegister/DirectorDetailRegister';
import DepartmentDetail from './views/RegistrationModule/DepartmentDetail/DepartmentDetail';
import ProductDetail from './views/RegistrationModule/ProductDetail.js/ProductDetail';
import ServiceDetail from './views/RegistrationModule/ServiceDetail/ServiceDetail';
import InfrastructureDetail from './views/RegistrationModule/InfrastructureDetails/InfrastructureDetail';
import TurnoverDetails from './views/RegistrationModule/TurnoverDetails/TurnoverDetails';
import CertificateDetails from './views/RegistrationModule/CertificateDetails/CertificateDetails';
import TargetClientLocation from './views/RegistrationModule/TargetClientLocation/TargetClientLocation';
import TargetedVendor from './views/RegistrationModule/TargetedVendor/TargetedVendor';
import ImportExportDetail from './views/RegistrationModule/ImportExportDetail/ImportExportDetail';
import UpdateCompanyDetailsRegister from './views/RegistrationModule/CompanyDetailRegister/UpdateCompanyDetailsRegister';
import UpdateDirectorDetails from './views/RegistrationModule/DirectorDetailRegister/UpdateDirectorDetails';
import UpdateDepartmentDetails from './views/RegistrationModule/DepartmentDetail/UpdateDepartmentDetails';
import UpdateProductDetails from './views/RegistrationModule/ProductDetail.js/UpdateProductDetails';
import UpdateInfrastructureDetails from './views/RegistrationModule/InfrastructureDetails/UpdateInfrastructureDetails';
import UpdateCertificateDetails from './views/RegistrationModule/CertificateDetails/UpdateCertificateDetails';
import UpdateTargetClintLocation from './views/RegistrationModule/TargetClientLocation/UpdateTargetClintLocation';
import UpdateTargetedVendor from './views/RegistrationModule/TargetedVendor/UpdateTargetedVendor';
import ImportExportDetailList from './views/RegistrationModule/ImportExportDetail/ImportExportDetailList';
import UpdateImportExportDetail from './views/RegistrationModule/ImportExportDetail/UpdateImportExportDetail';
import Search from './views/Master/Search/Search';
import IndustryProductSearch from './views/Master/Search/IndustryProductSearch';
import CompanyDetails from './views/Master/Search/CompanyDetails';
import UpdateTargetProduct from './views/Master/MyProduct/TargetProduct/UpdateTargetProduct';
import UpdateCompanyBuySell from './views/Master/Company Buying & Selling/UpdateCompanyBuySell';
import UpdateReferel from './views/Master/Referral/UpdateReferel';
import UpdateProductPromotion from './views/Master/ProductPromotion/UpdateProductPromotion';
import EditInfrastructure from './views/Master/InfrastructureOnLease/EditInfrastructure';
import UpdateServiceDetails from './views/RegistrationModule/ServiceDetail/UpdateServiceDetails';

const routes = [
  {path: '/', exact: true, name: 'Home'},
  {path: '/dashboard', name: 'Dashboard', element: Dashboard},

  {
    path: '/master/subscription',
    name: 'Subscription',
    element: Subscription,
  },
  {
    path: '/master/myProduct',
    name: 'My Product',
    element: MyProduct,
  },
  {
    path: '/edit-TargetedProduct/:id',
    name: 'UpdateTargetProduct',
    element: UpdateTargetProduct,
  },

  //   <Route
  //   path="/Edit-TargetedProduct/:id"
  //   element={<UpdateTargetProduct />}
  // />

  {
    path: '/master/myService',
    name: 'MyService',
    element: MyService,
  },

  {
    path: '/master/CompanyBuyingSelling',
    name: 'CompanyBuyingSelling',
    element: CompanyBuyingSelling,
  },
  {
    path: '/update-Company-BuySell/:id',
    name: 'UpdateCompanyBuySell',
    element: UpdateCompanyBuySell,
  },
  {
    path: '/master/Report',
    name: 'Report',
    element: Report,
  },
  {
    path: '/master/Referral',
    name: 'Referral',
    element: Referral,
  },
  {
    path: '/edit-referral/:id',
    name: 'UpdateReferel',
    element: UpdateReferel,
  },

  {
    path: '/master/NetworkConnection',
    name: 'NetworkConnection',
    element: NetworkConnection,
  },
  {
    path: '/master/ProductPromotion',
    name: 'ProductPromotion',
    element: ProductPromotion,
  },
  {
    path: '/update-Product-Promotion/:id',
    name: 'UpdateProductPromotion',
    element: UpdateProductPromotion,
  },

  {
    path: '/master/InfrastructureOnLease',
    name: 'InfrastructureOnLease',
    element: InfrastructureOnLease,
  },
  {
    path: '/edit-Infrastructure/:id',
    name: 'EditInfrastructure',
    element: EditInfrastructure,
  },

  {
    path: '/master/TargetService',
    name: 'TargetService',
    element: TargetService,
  },
  {
    path: '/master/Wallet',
    name: 'Wallet',
    element: Wallet,
  },
  // REGISTRATION PAGES
  {
    path: '/company-detail-register',
    name: 'CompanyDetailRegister',
    element: CompanyDetailRegister,
  },
  {
    path: '/company-business-details',
    name: 'CompanyBusinessDetails',
    element: CompanyBusinessDetails,
  },
  {
    path: '/director-detail-register',
    name: 'DirectorDetailRegister',
    element: DirectorDetailRegister,
  },
  {
    path: '/department-detail',
    name: 'DepartmentDetail',
    element: DepartmentDetail,
  },
  {
    path: '/product-detail',
    name: 'ProductDetail',
    element: ProductDetail,
  },
  {
    path: '/service-detail',
    name: 'ServiceDetail',
    element: ServiceDetail,
  },
  {
    path: '/infrastructure-detail',
    name: 'InfrastructureDetail',
    element: InfrastructureDetail,
  },
  {
    path: '/turnover-details',
    name: 'TurnoverDetails',
    element: TurnoverDetails,
  },
  {
    path: '/certificate-details',
    name: 'CertificateDetails',
    element: CertificateDetails,
  },
  {
    path: '/target-client-location',
    name: 'TargetClientLocation',
    element: TargetClientLocation,
  },
  {
    path: '/targeted-vendor',
    name: 'TargetedVendor',
    element: TargetedVendor,
  },
  {
    path: '/import-export-detail',
    name: 'ImportExportDetail',
    element: ImportExportDetail,
  },
  // Dynamic Edit Page
  {
    path: '/update-company-detail-register/:index',
    name: 'UpdateCompanyDetailRegister',
    element: UpdateCompanyDetailsRegister,
  },
  {
    path: '/update-director-detail/:index',
    name: 'UpdateDirectorDetails',
    element: UpdateDirectorDetails,
  },
  {
    path: '/update-Department-detail/:index',
    name: 'UpdateDepartmentDetails',
    element: UpdateDepartmentDetails,
  },
  {
    path: '/update-Product-Details/:index',
    name: 'UpdateProductDetails',
    element: UpdateProductDetails,
  },
  {
    path: '/update-Service-Details/:index',
    name: 'UpdateServiceDetails',
    element: UpdateServiceDetails,
  },
  {
    path: '/update-Infrastructure-Details/:index',
    name: 'UpdateInfrastructureDetails',
    element: UpdateInfrastructureDetails,
  },
  {
    path: '/update-Certificate-Details/:index',
    name: 'UpdateCertificateDetails',
    element: UpdateCertificateDetails,
  },
  {
    path: '/update-Target-Clint-Location/:index',
    name: 'UpdateTargetClintLocation',
    element: UpdateTargetClintLocation,
  },
  {
    path: '/update-Targeted-Vendor/:index',
    name: 'UpdateTargetedVendor',
    element: UpdateTargetedVendor,
  },
  {
    path: '/update-Import-Export-Detail/:index',
    name: 'UpdateImportExportDetail',
    element: UpdateImportExportDetail,
  },
  // {
  //   path: '/search',
  //   name: 'Search',
  //   element: Search,
  // },
  // {
  //   path: '/industry-product-wiseSearch',
  //   name: 'IndustryProductSearch',
  //   element: IndustryProductSearch,
  // },
  // {
  //   path: '/company-Details',
  //   name: 'CompanyDetails',
  //   element: CompanyDetails,
  // },
];

export default routes;
