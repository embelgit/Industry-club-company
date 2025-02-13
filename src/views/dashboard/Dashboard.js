import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardTitle} from 'reactstrap';
import {CRow, CCol, CButton} from '@coreui/react';
import {
  FaUsers,
  FaCheckCircle,
  FaBuilding,
  FaUserPlus,
  FaUserCheck,
  FaLayerGroup,
  FaBoxOpen,
  FaWallet,
} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {getDashboardCount} from '../../service/masterModule/Dashboard';
import CircularProgressBar from '../components/CircularProgressBar';
import {AppFooter, AppHeader, AppSidebar} from '../../components';
import RegistrationHeader from '../../components/RegistrationComponents/RegistrationHeader';
import RegistrationLayout from '../../layout/RegistrationLayout';

const Dashboard = () => {
  const [counts, setCount] = useState({});
  const [loader, setLoader] = useState(false);

  const fetchDashboardDetails = async companyId => {
    try {
      setLoader(true);
      const result = await getDashboardCount(companyId);
      console.log('Fetched Dashboard details: ', result);
      setCount(result?.data || {});
    } catch (error) {
      console.error('Error fetching Dashboard details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    console.log('companyId found in sessionStorage:', companyId);
    if (companyId) {
      fetchDashboardDetails(companyId);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []);

  const cardBackgrounds = [
    'linear-gradient(135deg, #ff7e5f, #feb47b)',
    'linear-gradient(135deg, #43cea2, #185a9d)',
    'linear-gradient(135deg, #ffafbd, #ffc3a0)',
    'linear-gradient(135deg, #12c2e9, #c471ed)',
    'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
    'linear-gradient(135deg, #667eea, #764ba2)',
  ];

  const iconColors = [
    '#feb47b',
    '#185a9d',
    '#ffc3a0',
    '#c471ed',
    '#a6c1ee',
    '#764ba2',
  ];

  // Prepare the data to be in array format for mapping
  const dashboardItems = [
    {
      title: 'User Notifications Count',
      icon: FaUsers,
      count: counts?.userNotificationCount,
      route: '/master/Report',
    },
    {
      title: 'Website Notifications Count',
      icon: FaUsers,
      count: counts?.websiteNotificationCount,
      route: '/master/Report',
    },
    {
      title: '',
      icon: FaCheckCircle,
      percentage: counts?.percentage,
      route: '/company-detail-register',
    },
    {
      title: 'Lease Count',
      icon: FaBuilding,
      count: counts?.leaseCount,
      oldLeaseCount: counts?.oldLeaseCount,
      newLeaseCount: counts?.newLeaseCount,
      route: '/master/InfrastructureOnLease',
    },
    {
      title: 'Portal Admin Requests',
      icon: FaUserPlus,
      count: counts?.portalAdminRequestCount,
      route: '/master/NetworkConnection',
    },
    {
      title: 'Receive Requests',
      icon: FaUserCheck,
      count: counts?.receiveRequestCount,
      route: '/master/NetworkConnection',
    },
    {
      title: 'Services Count',
      icon: FaLayerGroup,
      count: counts?.serviceCount,
      route: '/master/TargetService',
    },
    {
      title: 'Product Count',
      icon: FaBoxOpen,
      count: counts?.productCount,
      route: '/master/myProduct',
    },
    {
      title: 'Wallets Count',
      icon: FaWallet,
      count: counts?.walletCount,
      route: '/master/Wallet',
    },
  ];

  return (
    <>
      <AppHeader />
      <div className="d-flex custom-padding">
        <AppSidebar />
        <CRow className="gx-4 gy-3">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon;
            const background = cardBackgrounds[index % cardBackgrounds.length];
            const iconColor = iconColors[index % iconColors.length];

            return (
              <CCol lg={4} md={5} sm={12} key={index} className="mb-3">
                <Link to={item.route} style={{textDecoration: 'none'}}>
                  <Card
                    className="shadow-sm border rounded"
                    onMouseEnter={e =>
                      (e.currentTarget.style.transform = 'scale(1.05)')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.transform = 'scale(1)')
                    }
                    style={{
                      transition: 'transform 0.3s ease, box-shadow 0.3s',
                      background: '#fff',
                    }}>
                    <CardBody className="d-flex flex-column align-items-center justify-content-center text-center py-4">
                      {item.title === 'Lease Count' ? (
                        <>
                          <Icon
                            className="mb-2"
                            style={{
                              fontSize: '30px',
                              color: iconColor,
                            }}
                          />
                          <div className="d-flex flex-column align-items-center text-muted w-100">
                            <div className="text-dark fw-semibold ">
                              Lease Count:{' '}
                              <strong className="text-dark">
                                {item.count || 0}
                              </strong>
                            </div>
                            <div className="d-flex justify-content-around w-100 mt-2">
                              <span className="text-dark">
                                <strong>Old:</strong>{' '}
                                <strong>{item.oldLeaseCount || 0}</strong>
                              </span>
                              <span className="text-dark">
                                <strong>New:</strong>{' '}
                                <strong>{item.newLeaseCount || 0}</strong>
                              </span>
                            </div>
                          </div>
                        </>
                      ) : item.title ? (
                        <>
                          <Icon
                            className="mb-1"
                            style={{
                              fontSize: '30px',
                              color: iconColor,
                            }}
                          />
                          <CardTitle
                            tag="h6"
                            className="fw-semibold text-dark mb-1">
                            {item.title}
                          </CardTitle>
                          <div className="fw-bold fs-4 text-dark">
                            {item.count}
                          </div>
                        </>
                      ) : (
                        <CButton as={Link} to={item.route}>
                          <CircularProgressBar
                            percentage={item.percentage || 0}
                          />
                        </CButton>
                      )}
                    </CardBody>
                  </Card>
                </Link>
              </CCol>
            );
          })}
        </CRow>
      </div>
      {/* <AppFooter /> */}
    </>
  );
};

export default Dashboard;
