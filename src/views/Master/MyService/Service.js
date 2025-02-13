import {
  CCardHeader,
  CTable,
  CFormSwitch,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import React, {useEffect, useState} from 'react';
import {
  cilChevronLeft,
  cilChevronRight,
  cilPencil,
  cilTrash,
} from '@coreui/icons';
import {CIcon} from '@coreui/icons-react';
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Loader';
import DataNotPresent from '../../components/DataNotPresent';
import {getServiceDetails} from '../../../service/RegistrationModule/ServiceDetailsAPIs';
import {AppSidebar} from '../../../components';
import {getWalletAddedList} from '../../../service/masterModule/Wallet';

const Service = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [walletData, setWalletData] = useState([]);
  const size = 20;

  // Fetch function for certificate details
  const fetchServiceDetails = async (companyId, pageNo = 0, role) => {
    try {
      setLoader(true);
      const role = '';
      const fkUserId = '';
      const result = await getServiceDetails(companyId, pageNo, role, fkUserId);
      console.log('Fetched Service Details: ', result);
      setTableData(result?.data?.content);
      setPageCount(result?.data?.totalPages);
      setOffset(result?.data?.pageable?.offset);
    } catch (error) {
      console.error('Error fetching Service Details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    console.log('companyId found in sessionStorage', companyId);
    if (companyId) {
      fetchServiceDetails(companyId, currentPage);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, [currentPage]);

  const handlePageChange = selected => {
    const selectedPage = selected.selected;
    setCurrentPage(selectedPage);
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchGSTDetails(companyId, selectedPage);
    }
  };

  // Fetch Wallet Added List
  const fetchWalletAddedList = async (companyId, serviceId) => {
    try {
      setLoader(true);
      const pageNo = 0;
      const productId = '';
      const type = 'service';

      const result = await getWalletAddedList(
        companyId,
        pageNo,
        serviceId,
        productId,
        type,
      );
      setWalletData(result?.data?.content || []);
      setModalVisible(true); // Show modal after fetching data
    } catch (error) {
      console.error('Error fetching wallet added list:', error);
    } finally {
      setLoader(false);
    }
  };

  // Function to handle wallet button click
  const handleWalletButtonClick = productId => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchWalletAddedList(companyId, productId);
      setModalVisible(true);
    }
  };
  return (
    <div className="card">
      <AppSidebar />
      <div>
        {loader ? (
          <Loader />
        ) : (
          <>
            {tableData.length ? (
              <>
                <div className="card-header">
                  <strong>Submitted Data</strong>
                </div>
                <div className="table-responsive">
                  <CTable striped>
                    <thead className="table-secondary  table-bordered table-striped">
                      <tr>
                        <th scope="col">Sr No&nbsp;&nbsp;&nbsp;</th>
                        <th scope="col">Service Name</th>
                        <th scope="col">Sub Service Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Industry Type</th>

                        <th scope="col">Keywords</th>
                        <th scope="col">Reference Client</th>
                        <th scope="col">wallet</th>
                        <th scope="col">Image</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {tableData.map((e, index) => (
                        <tr key={index}>
                          <th scope="row" style={{fontWeight: 'normal'}}>
                            {index + 1 + offset}&nbsp;&nbsp;&nbsp;
                          </th>

                          <td>{e.serviceName}</td>
                          <td>{e.subServiceName}</td>
                          <td>{e.description}</td>
                          <td>{e.industryType.join(', ')}</td>
                          <td>{e.keyword.join(', ')}</td>
                          <td>{e.referenceClient}</td>
                          <td>
                            <CButton
                              color="primary"
                              onClick={() =>
                                handleWalletButtonClick(e.fkServiceId)
                              }>
                              Wallet
                            </CButton>
                          </td>
                          <td>
                            {e.serviceImage1 ? (
                              <img
                                src={`data:image/png;base64,${e.serviceImage1}`}
                                alt="Certificate"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              'No Image'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </CTable>
                </div>
                <ReactPaginate
                  previousLabel={<CIcon icon={cilChevronLeft} />}
                  nextLabel={<CIcon icon={cilChevronRight} />}
                  breakLabel={'...'}
                  pageClassName={'page-item'}
                  breakClassName={'break-me'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                  forcePage={currentPage}
                />
              </>
            ) : (
              <DataNotPresent title="Data Not present" />
            )}
          </>
        )}
      </div>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <div className="card-header">
            <strong>Wallet</strong>
          </div>
        </CModalHeader>
        <CModalBody>
          Congratulations! Your Service has been saved by the following
          companies.
          <div className="card m-3">
            {loader ? (
              <Loader />
            ) : walletData.length ? (
              <>
                <CTable striped>
                  <thead className="table-secondary table-bordered table-striped">
                    <tr>
                      <th>Sr No</th>
                      <th>Company Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.map((e, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{e.companyName}</td>
                      </tr>
                    ))}
                  </tbody>
                </CTable>
                <ReactPaginate
                  previousLabel={<CIcon icon={cilChevronLeft} />}
                  nextLabel={<CIcon icon={cilChevronRight} />}
                  breakLabel={'...'}
                  pageClassName={'page-item'}
                  breakClassName={'break-me'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                  forcePage={currentPage}
                />
              </>
            ) : (
              <DataNotPresent title="Data Not Present" />
            )}
          </div>
        </CModalBody>
        <CModalFooter></CModalFooter>
      </CModal>
    </div>
  );
};

export default Service;
