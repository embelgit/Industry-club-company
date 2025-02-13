import React, {useEffect, useState} from 'react';
import {CTable, CCardHeader} from '@coreui/react';
import {cilChevronLeft, cilChevronRight} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPaginate from 'react-paginate';
import DataNotPresent from '../../components/DataNotPresent';
import Loader from '../../components/Loader';
import {getTargetedVendor} from '../../../service/RegistrationModule/TargetedVendorAPIs';

const ServiceDetails = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);

  // Fetch API data
  const fetchTargetedVendorList = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getTargetedVendor(companyId, pageNo);
      console.log('Fetched Targeted Vendor Details: ', result);
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
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchTargetedVendorList(companyId, currentPage);
    }
  }, [currentPage]);

  const handlePageChange = selected => {
    const selectedPage = selected.selected;
    setCurrentPage(selectedPage);
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchTargetedVendorList(companyId, selectedPage);
    }
  };

  const renderTable = () => (
    <div className="table-responsive ">
      <CCardHeader>
        <strong>Target Service</strong>
      </CCardHeader>
      <CTable striped>
        <thead className="table-secondary table-bordered table-striped ">
          <tr>
            {/* <th scope="col">Edit</th> */}
            <th scope="col">Sr No</th>
            <th scope="col">Product Name</th>
            <th scope="col">Industry Type</th>
            <th scope="col">Country Name</th>
            <th scope="col">State Name</th>
            <th scope="col">City Name</th>
            <th scope="col">Pin Code</th>
            <th scope="col">Turn Over</th>
            <th scope="col">Certificate Name</th>
            {/* <th scope="col">Delete</th> */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              {/* <td>
                <Link
                  to={`/master/edit-${currentTab}/${index}`}
                  style={{ textDecoration: "none" }}
                >
                  <CIcon
                    icon={cilPencil}
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "#28a745",
                    }}
                  />
                </Link>
              </td> */}
              <th scope="row">{index + 1 + offset}</th>
              <td>{item.serviceName?.join(', ') || 'N/A'}</td>
              <td>{item.industryType?.join(', ') || 'N/A'}</td>
              <td>{item.countryName?.join(', ') || 'N/A'}</td>
              <td>{item.stateName?.join(', ') || 'N/A'}</td>
              <td>{item.cityName || 'N/A'}</td>
              <td>{item.pinCode || 'N/A'}</td>
              <td>{item.turnOver || 'N/A'}</td>
              <td>{item.certificateName || 'N/A'}</td>
              {/* <td>
                <CIcon
                  icon={cilTrash}
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "#dc3545",
                  }}
                />
              </td> */}
            </tr>
          ))}
        </tbody>
      </CTable>
    </div>
  );

  return (
    <div className="card">
      {loader ? (
        <Loader />
      ) : tableData.length === 0 ? (
        <DataNotPresent title="No Data Available" />
      ) : (
        renderTable()
      )}
      <div className="d-flex justify-content-end m-3">
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
      </div>
    </div>
  );
};

export default ServiceDetails;
