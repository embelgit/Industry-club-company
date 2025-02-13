import {CTable, CCardHeader} from '@coreui/react';
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
import DataNotPresent from '../../components/DataNotPresent';
import Loader from '../../components/Loader';
import {getDepartment} from '../../../service/RegistrationModule/DepartmentAPIs';

const DepartmentDetailList = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);

  // Fetch function for certificate details
  const fetchGSTDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getDepartment(companyId, pageNo);
      console.log('Fetched Department details: ', result);
      setTableData(result?.data?.content);
      setPageCount(result?.data?.totalPages);
      setOffset(result?.data?.pageable?.offset);
    } catch (error) {
      console.error('Error fetching GST details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    console.log('companyId found in sessionStorage', companyId);
    if (companyId) {
      fetchGSTDetails(companyId, currentPage);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, [currentPage]);

  // Handle page change from pagination component
  const handlePageChange = selected => {
    const selectedPage = selected.selected;
    setCurrentPage(selectedPage);
    const companyId = sessionStorage.getItem('fkCompanyId');
    if (companyId) {
      fetchGSTDetails(companyId, selectedPage);
    }
  };

  const handleDelete = () => {
    setTableData(prevTableData => {
      return prevTableData.filter((_, index) => !selectedRows.includes(index));
    });
    setSelectedRows([]);
  };

  return (
    <div className="card shadow mb-5">
      {loader ? (
        <Loader />
      ) : (
        <>
          {tableData.length ? (
            <>
              <div className="card shadow p-1">
                <CCardHeader>
                  <strong>Submitted Data</strong>
                </CCardHeader>
                <div className="table-responsive">
                  <CTable striped>
                    <thead className="table-secondary  table-bordered table-striped">
                      <tr>
                        <th scope="col">Sr No&nbsp;&nbsp;&nbsp;</th>
                        <th scope="col">GST No</th>
                        <th scope="col">PAN No</th>
                        <th scope="col">Department Name</th>
                        <th scope="col">Phone No</th>
                        <th scope="col">Email Id</th>
                        <th scope="col">Role</th>
                        <th scope="col">Designation</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {tableData.map((e, index) => (
                        <tr key={index}>
                          <th scope="row" style={{fontWeight: 'normal'}}>
                            {index + 1 + offset}&nbsp;&nbsp;&nbsp;
                          </th>

                          <td>{e.gstNo}</td>
                          <td>{e.panNo}</td>
                          <td>{e.name}</td>
                          <td>{e.mobileNo}</td>
                          <td>{e.email}</td>
                          <td>{e.role}</td>
                          <td>{e.designation}</td>
                          <td>
                            <Link
                              to={`/update-Department-detail/${index}`}
                              state={{DepartmentDetails: tableData[index]}}
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
                              onClick={() => handleDelete(index)}
                            />
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
              </div>
            </>
          ) : (
            <DataNotPresent title="Data Not present" />
          )}
        </>
      )}
    </div>
  );
};

export default DepartmentDetailList;
