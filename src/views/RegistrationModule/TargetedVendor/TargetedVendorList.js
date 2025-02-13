import React, {useEffect, useState} from 'react';
import {
  CCardHeader,
  CCardBody,
  CCard,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormSwitch,
  CButton,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
  CRow,
} from '@coreui/react';
import {
  cilChevronLeft,
  cilChevronRight,
  cilPencil,
  cilTrash,
  cilCloudDownload,
} from '@coreui/icons';
import {CIcon} from '@coreui/icons-react';
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import DataNotPresent from '../../components/DataNotPresent';
import Loader from '../../components/Loader';
import {getTargetedVendor} from '../../../service/RegistrationModule/TargetedVendorAPIs';

const TargetedVendorList = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentTab, setCurrentTab] = useState('product');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);

  // Fetch API data
  const fetchTargetedVendorList = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getTargetedVendor(companyId, pageNo);
      console.log('Fetched Target Clint Location Details: ', result);
      setTableData(result?.data?.content || []);
      setPageCount(result?.data?.totalPages || 0);
      setOffset(result?.data?.pageable?.offset || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    if (companyId) {
      fetchTargetedVendorList(companyId, currentPage);
    }
  }, [currentPage]);

  const handlePageChange = selected => {
    const selectedPage = selected.selected;
    setCurrentPage(selectedPage);
    const companyId = sessionStorage.getItem('fkCompanyId');
    if (companyId) {
      fetchTargetedVendorList(companyId, selectedPage);
    }
  };

  const filterTableData = () => {
    if (currentTab === 'product') {
      return tableData.filter(item => item.productName.length > 0);
    } else if (currentTab === 'service') {
      return tableData.filter(item => item.serviceName.length > 0);
    }
    return [];
  };

  const renderTable = () => {
    const filteredData = filterTableData();
    if (filteredData.length === 0) {
      return <DataNotPresent title="No Data Available" />;
    }

    return (
      <div className="table-responsive">
        <CTable striped>
          <thead className="table-secondary table-bordered table-striped">
            <tr>
              <th scope="col">Sr No&nbsp;&nbsp;&nbsp;</th>
              {currentTab === 'product' && <th scope="col">Product Name</th>}
              {currentTab === 'service' && <th scope="col">Service Name</th>}
              <th scope="col">Industry Type</th>
              <th scope="col">Country Name</th>
              <th scope="col">State Name</th>
              <th scope="col">City Name</th>
              <th scope="col">Pin Code</th>
              <th scope="col">Turn Over</th>
              <th scope="col">Certificate Name</th>
              <th scope="col">Vendor Form</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1 + offset}</th>
                {currentTab === 'product' && (
                  <td>{item.productName.join(', ')}</td>
                )}
                {currentTab === 'service' && (
                  <td>{item.serviceName.join(', ')}</td>
                )}
                <td>{item.industryType.join(', ')}</td>
                <td>{item.countryName.join(', ')}</td>
                <td>{item.stateName.join(', ')}</td>
                <td>{item.cityName}</td>
                <td>{item.pinCode}</td>
                <td>{item.turnOver}</td>
                <td>{item.certificateName}</td>
                <td>
                  {item.vendorForm && (
                    <a
                      href={item.vendorForm}
                      download
                      style={{
                        textDecoration: 'none',
                        fontSize: '20px',
                        color: '#007bff',
                        cursor: 'pointer',
                      }}>
                      <CIcon
                        icon={cilCloudDownload}
                        style={{
                          fontSize: '60px',
                          marginLeft: '40px',
                        }}
                      />
                    </a>
                  )}
                </td>
                <td>
                  <Link
                    to={`/update-Targeted-Vendor/${index}`}
                    state={{TargetedVendor: filteredData[index]}}
                    style={{textDecoration: 'none'}}>
                    <CIcon
                      icon={cilPencil}
                      style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: '#28a745',
                      }}
                    />
                  </Link>
                </td>
                <td>
                  <CIcon
                    icon={cilTrash}
                    style={{
                      cursor: 'pointer',
                      fontSize: '20px',
                      color: '#dc3545',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </CTable>
      </div>
    );
  };

  return (
    <div className="card shadow p-1">
      <CCardHeader>
        <strong>Submitted Data</strong>
      </CCardHeader>
      <CNav variant="tabs" className="justify-content-center custom-tabs">
        <CNavItem>
          <CNavLink
            active={currentTab === 'product'}
            onClick={() => setCurrentTab('product')}
            className="tab-link form-label">
            <strong style={{color: '#000'}}>Product</strong>
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={currentTab === 'service'}
            onClick={() => setCurrentTab('service')}
            className="custom-tabs nav-link">
            <strong style={{color: '#000'}}>Service</strong>
          </CNavLink>
        </CNavItem>
      </CNav>

      {loader ? (
        <Loader />
      ) : tableData.length === 0 ? (
        <DataNotPresent title="No Data Available" />
      ) : (
        renderTable()
      )}
      <ReactPaginate
        previousLabel={<CIcon icon={cilChevronLeft} />}
        nextLabel={<CIcon icon={cilChevronRight} />}
        breakLabel={'...'}
        pageClassName={'page-item'}
        breakClassName={'break-me'}
        pageCount={pageCount} // Total pages to display
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange} // Function to handle page changes
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        forcePage={currentPage} // Ensure the page number reflects the state
      />
    </div>
  );
};

export default TargetedVendorList;
