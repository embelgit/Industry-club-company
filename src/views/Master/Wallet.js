import React, {useEffect, useState} from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTableRow,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CCardHeader,
} from '@coreui/react';
import {
  cilChevronLeft,
  cilChevronRight,
  cilPencil,
  cilTrash,
} from '@coreui/icons';
import {CIcon} from '@coreui/icons-react';
import {Link, useNavigate} from 'react-router-dom';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
  deleteWalletData,
  getWalletCount,
  getWalletList,
} from '../../service/masterModule/Wallet';
import {AppHeader, AppSidebar} from '../../components';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  // Toggle tab and fetch data for the selected tab
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);

      const companyId = sessionStorage.getItem('_id');
      const statusMap = {
        0: 'company',
        1: 'product',
        2: 'service',
      };
      const status = statusMap[tab];
      if (companyId) {
        fetchWalletList(companyId, 0, status);
      } else {
        console.error('No companyId found in sessionStorage');
      }
    }
  };

  // Fetch wallet list data for the selected tab
  const fetchWalletList = async (companyId, pageNo = 0, status) => {
    try {
      setLoader(true);
      const result = await getWalletList(companyId, pageNo, status);
      console.log('Fetched Wallet List Details: ', result);
      setData(result?.data?.content || []);
      setPageCount(result?.data?.totalPages || 0);
      setOffset(result?.data?.pageable?.offset || 0);
    } catch (error) {
      console.error('Error fetching Wallet List details:', error);
    } finally {
      setLoader(false);
    }
  };

  // Fetch wallet count for each tab
  const fetchWalletCount = async companyId => {
    try {
      setLoader(true);
      const result = await getWalletCount(companyId);
      console.log('Fetched Wallet Data: ', result);
      const counts = result.data;
      setCompanyCount(counts.walletCompanyCount || 0);
      setProductCount(counts.walletProductCount || 0);
      setServiceCount(counts.walletServiceCount || 0);
    } catch (error) {
      console.error('Error fetching Card List details:', error);
    } finally {
      setLoader(false);
    }
  };

  // Fetch data when the component is mounted and set the default active tab (Company)
  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchWalletCount(companyId);
      fetchWalletList(companyId, 0, 'company'); // Fetch the wallet list for the default "Company" tab
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const handleDeleteWallet = async (
    fkWalletId,
    userName,
    fkProductId,
    fkVendorId,
    fkServiceId,
  ) => {
    try {
      const confirm = await swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this data!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });

      if (confirm) {
        const pkWalletId = sessionStorage.getItem('pkWalletId');
        const response = await deleteWalletData(
          fkWalletId || pkWalletId,
          userName,
          fkProductId,
          fkVendorId,
          fkServiceId,
        );

        if (response.status === 200) {
          swal(
            'Deleted!',
            'The wallet data has been deleted successfully.',
            'success',
          );
          // Refresh data
          fetchWalletList();
          fetchWalletCount();
        } else {
          swal(
            'Error!',
            'Failed to delete the wallet data. Please try again.',
            'error',
          );
        }
      }
    } catch (error) {
      console.error('Delete Wallet Error:', error);
      swal(
        'Error',
        'An error occurred while deleting the wallet data.',
        'error',
      );
    }
  };

  return (
    <>
      <AppHeader />
      <AppSidebar />
      <div
        style={{
          paddingLeft: '273px',
          paddingRight: '19px',
          paddingTop: '11px',
        }}>
        <div className="card shadow">
          <CRow>
            <CCol>
              <CCardHeader>
                <strong>WALLET LIST</strong>
              </CCardHeader>
              <CNav
                variant="tabs"
                className="justify-content-center custom-tabs mb-4">
                <CNavItem>
                  <CNavLink
                    active={activeTab === 0}
                    onClick={() => toggleTab(0)}
                    className="tab-link">
                    <label htmlFor="hsncode" className="form-label">
                      Company ({companyCount})
                    </label>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 1}
                    onClick={() => toggleTab(1)}
                    className="tab-link">
                    <label htmlFor="hsncode" className="form-label">
                      Product ({productCount})
                    </label>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 2}
                    onClick={() => toggleTab(2)}
                    className="tab-link">
                    <label htmlFor="hsncode" className="form-label">
                      Service ({serviceCount})
                    </label>
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CTabContent className="tab-content-container">
                <CTabPane visible={activeTab === 0} className="fade-in">
                  <CCard className="custom-card">
                    <CCardBody>
                      <div className="table-responsive">
                        <CTable hover>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell className="form-label">
                                Company Name
                              </CTableHeaderCell>
                              <CTableHeaderCell className="form-label">
                                Business Type
                              </CTableHeaderCell>
                              <CTableHeaderCell className="form-label">
                                Action
                              </CTableHeaderCell>
                              <CTableHeaderCell className="form-label">
                                View
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {data.length > 0 ? (
                              data.map((item, index) => (
                                <CTableRow key={index}>
                                  <CTableDataCell>
                                    {item.companyName}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {item.businessType}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CIcon
                                      icon={cilTrash}
                                      className="text-danger "
                                      onClick={() =>
                                        handleDeleteWallet(
                                          item.fkWalletId,
                                          sessionStorage.getItem('userName'),
                                          '',
                                          item.fkVendorId,
                                          '',
                                        )
                                      }
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CButton
                                      color="link"
                                      onClick={() =>
                                        navigate('/company-Details', {
                                          state: {
                                            vendorId: item.fkVendorId,
                                          },
                                        })
                                      }>
                                      See More
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              ))
                            ) : (
                              <CTableRow>
                                <CTableDataCell
                                  colSpan="3"
                                  className="text-center">
                                  No data available
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </CTableBody>
                        </CTable>
                      </div>
                    </CCardBody>
                  </CCard>
                </CTabPane>

                <CTabPane visible={activeTab === 1} className="fade-in">
                  <CCard className="custom-card">
                    <CCardBody>
                      {/* View Table Section */}
                      <div className="table-responsive">
                        <CTable hover>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell className="form-label">
                                Company Name
                              </CTableHeaderCell>
                              <CTableHeaderCell className="form-label">
                                Product Name
                              </CTableHeaderCell>

                              {/* <CTableHeaderCell className="form-label">
                                                           Business Type
                                                         </CTableHeaderCell> */}
                              <CTableHeaderCell className="form-label">
                                Action
                              </CTableHeaderCell>
                              <CTableHeaderCell className="form-label">
                                View
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>

                          <CTableBody>
                            {data.length > 0 ? (
                              data.map((item, index) => {
                                console.log('Product Item:', item);
                                return (
                                  <CTableRow key={index}>
                                    <CTableDataCell>
                                      {item.companyName}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      {item.productName}
                                    </CTableDataCell>

                                    {/* <CTableDataCell>
                                                                 {item.businessType.join(', ')}
                                                               </CTableDataCell> */}
                                    <CTableDataCell>
                                      <CIcon
                                        icon={cilTrash}
                                        className="text-danger "
                                        onClick={() =>
                                          handleDeleteWallet(
                                            item.fkWalletId,
                                            sessionStorage.getItem('userName'),
                                            item.fkProductId,
                                            '',

                                            '',
                                          )
                                        }
                                      />
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="link"
                                        onClick={() =>
                                          navigate('/product-Details', {
                                            state: {
                                              productId: item.fkProductId,
                                            },
                                          })
                                        }>
                                        See More
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                );
                              })
                            ) : (
                              <CTableRow>
                                <CTableDataCell
                                  colSpan="3"
                                  className="text-center">
                                  No data available
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </CTableBody>
                        </CTable>
                      </div>
                    </CCardBody>
                  </CCard>
                </CTabPane>
                <CTabPane visible={activeTab === 2} className="fade-in">
                  <CCard className="custom-card">
                    <CCardBody>
                      {/* View Table Section */}
                      <div className="table-responsive">
                        <CTable hover>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell className="form-label">
                                Company Name
                              </CTableHeaderCell>
                              <CTableHeaderCell className="form-label">
                                Service Name
                              </CTableHeaderCell>
                              {/* <CTableHeaderCell className="form-label">
                                                           Business Type
                                                         </CTableHeaderCell> */}

                              <CTableHeaderCell className="form-label">
                                Action
                              </CTableHeaderCell>
                              <CTableHeaderCell className="form-label">
                                View
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>

                          <CTableBody>
                            {data.length > 0 ? (
                              data.map((item, index) => {
                                console.log('Item:', item); // Debugging step to see the full structure of item
                                return (
                                  <CTableRow key={index}>
                                    <CTableDataCell>
                                      {item.companyName}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      {item.serviceName}
                                    </CTableDataCell>
                                    {/* <CTableDataCell>
                                      {item.subServiceName}
                                    </CTableDataCell> */}
                                    {/* <CTableDataCell>
                                                                 {item.businessType.join(', ')}
                                                               </CTableDataCell> */}
                                    <CTableDataCell>
                                      <CIcon
                                        icon={cilTrash}
                                        className="text-danger "
                                        onClick={() =>
                                          handleDeleteWallet(
                                            item.fkWalletId,
                                            sessionStorage.getItem('userName'),
                                            '',
                                            item.fkVendorId,
                                            '',
                                          )
                                        }
                                      />
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="link"
                                        onClick={() =>
                                          navigate('/searvice-Details', {
                                            state: {
                                              serviceId: item.fkServiceId,
                                            },
                                          })
                                        }>
                                        See More
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                );
                              })
                            ) : (
                              <CTableRow>
                                <CTableDataCell
                                  colSpan="3"
                                  className="text-center">
                                  No data available
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </CTableBody>
                        </CTable>
                      </div>
                    </CCardBody>
                  </CCard>
                </CTabPane>
              </CTabContent>
            </CCol>
          </CRow>
        </div>
      </div>
    </>
  );
};

export default Wallet;
