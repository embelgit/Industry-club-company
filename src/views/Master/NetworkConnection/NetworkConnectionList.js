import {
  CNav,
  CNavItem,
  CRow,
  CCol,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CTableRow,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import React, {useState, useEffect} from 'react';
import {
  getNetworkConnectionCount,
  getNetworkConnectionList,
} from '../../../service/masterModule/NetworkConnection';

const NetworkConnectionList = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [receivedRequestCount, setReceivedRequestCount] = useState(0);
  const [sentRequestCount, setSentRequestCount] = useState(0);
  const [acceptedRequestCount, setAcceptedRequestCount] = useState(0);

  // Fetch the counts on initial render
  const fetchCounts = async companyId => {
    try {
      setLoader(true);
      const count = await getNetworkConnectionCount(companyId);
      setReceivedRequestCount(count.data.getrequestCount);
      setAcceptedRequestCount(count.data.acceptedrequestCount);
      setSentRequestCount(count.data.sendrequestCount);
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoader(false);
    }
  };

  // Fetch the list of connections for the current tab
  const fetchConnectionList = async (companyId, pageNo = 0, status) => {
    try {
      setLoader(true);
      const result = await getNetworkConnectionList(companyId, pageNo, status);
      setData(result?.data?.content || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoader(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchCounts(companyId);
      // Fetch the data for the first tab by default (Received Requests)
      fetchConnectionList(companyId, 0, 'getrequest');
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []);

  // Function to toggle between tabs
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      const companyId = sessionStorage.getItem('_id');
      if (companyId) {
        fetchConnectionList(
          companyId,
          0,
          tab === 0
            ? 'getrequest'
            : tab === 1
              ? 'sendrequest'
              : 'acceptedrequest',
        );
      } else {
        console.error('No companyId found in sessionStorage');
      }
    }
  };

  const handleAccept = async () => {
    const userName = sessionStorage.getItem('userName');
    const pkNetworkId = sessionStorage.getItem('pkNetworkId');

    if (!pkNetworkId) {
      console.error('pkNetworkId is missing!');
      return;
    }

    if (!userName) {
      console.error('Username is missing!');
      return;
    }

    try {
      const response = await updateStatusNetworkConnection({
        fkNetworkId: pkNetworkId,
        status: 'Accepted',
        username: userName,
      });
      console.log('Connection accepted:', response);
      // Show success message with swal
      swal({
        title: 'Success!',
        text: 'Connection accepted successfully!',
        icon: 'success',
        timer: 2000,
        buttons: false,
      });
    } catch (error) {
      console.error('Error accepting connection:', error);

      // Show error message with swal
      swal({
        title: 'Error!',
        text: 'Something went wrong while accepting the connection.',
        icon: 'error',
        timer: 2000,
        buttons: false,
      });
    }
  };

  const handleReject = async () => {
    const userName = sessionStorage.getItem('userName');
    const pkNetworkId = sessionStorage.getItem('pkNetworkId');

    if (!pkNetworkId) {
      console.error('pkNetworkId is missing!');
      return;
    }

    if (!userName) {
      console.error('Username is missing!');
      return;
    }

    try {
      const response = await updateStatusNetworkConnection({
        fkNetworkId: pkNetworkId,
        status: 'Rejected', // Change status to "rejected"
        username: userName, // Pass the username from sessionStorage
      });
      console.log('Connection rejected:', response);
      // Show success message with swal
      swal({
        title: 'Success!',
        text: 'Connection rejected successfully!',
        icon: 'success',
        timer: 2000,
        buttons: false,
      });
    } catch (error) {
      console.error('Error rejecting connection:', error);

      // Show error message with swal
      swal({
        title: 'Error!',
        text: 'Something went wrong while rejecting the connection.',
        icon: 'error',
        timer: 2000,
        buttons: false,
      });
    }
  };

  return (
    <>
      <CRow>
        <CCol>
          <CNav
            variant="tabs"
            className="justify-content-center custom-tabs mb-4">
            <CNavItem>
              <CNavLink
                active={activeTab === 0}
                onClick={() => toggleTab(0)}
                className="tab-link form-label">
                <strong style={{color: '#ba1d00'}}>
                  Received Request ({receivedRequestCount})
                </strong>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => toggleTab(1)}
                className="tab-link form-label">
                <strong style={{color: '#ba1d00'}}>
                  Send Request ({sentRequestCount})
                </strong>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => toggleTab(2)}
                className="tab-link form-label">
                <strong style={{color: '#ba1d00'}}>
                  Accepted Request ({acceptedRequestCount})
                </strong>
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
                          <CTableHeaderCell>
                            <label htmlFor="hsncode" className="form-label">
                              Company Name
                            </label>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <label htmlFor="hsncode" className="form-label">
                              Business Type
                            </label>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <label htmlFor="hsncode" className="form-label">
                              Actions
                            </label>
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
                                  {item.bussinessType.join(', ')}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}>
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      onClick={handleAccept}>
                                      Accept
                                    </button>
                                    <button
                                      style={{marginLeft: '10px'}}
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={handleReject}>
                                      Reject
                                    </button>
                                  </div>
                                </CTableDataCell>
                              </CTableRow>
                            );
                          })
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan="3" className="text-center">
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
                  <div className="table-responsive">
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>
                            <label htmlFor="hsncode" className="form-label">
                              Company Name
                            </label>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <label htmlFor="hsncode" className="form-label">
                              Business Type
                            </label>
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
                                {item.bussinessType.join(', ')}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan="3" className="text-center">
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
                  <div className="table-responsive">
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>
                            <label htmlFor="hsncode" className="form-label">
                              Company Name
                            </label>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <label htmlFor="hsncode" className="form-label">
                              Business Type
                            </label>
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
                                {item.bussinessType.join(', ')}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan="3" className="text-center">
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
    </>
  );
};

export default NetworkConnectionList;
