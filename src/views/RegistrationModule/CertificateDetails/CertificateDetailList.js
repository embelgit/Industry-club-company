import React, {useEffect, useState} from 'react';
import {CTable, CCardHeader} from '@coreui/react';
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
import {getCertificateDetails} from '../../../service/RegistrationModule/CertificateDetails';

const CertificateDetailList = () => {
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
      const result = await getCertificateDetails(companyId, pageNo);
      console.log('Fetched GST Details: ', result);
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
                      <tr style={{whiteSpace: 'nowrap'}}>
                        <th scope="col">Sr No&nbsp;&nbsp;&nbsp;</th>
                        <th scope="col">Certificate Name</th>
                        <th scope="col">Image</th>
                        <th scope="col">Certificate No</th>
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

                          <td>{e.certificateName}</td>
                          <td>
                            {e.certiPhoto ? (
                              <img
                                src={
                                  e.certiPhoto.startsWith(
                                    'data:image/png;base64,',
                                  )
                                    ? e.certiPhoto
                                    : `data:image/png;base64,${e.certiPhoto.split(',')[1]}`
                                }
                                alt="Certificate"
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              'No Image'
                            )}
                          </td>

                          <td>{e.certNo}</td>
                          <td>
                            <Link
                              to={`/update-Certificate-Details/${index}`}
                              state={{CertificateDetails: tableData[index]}}
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

export default CertificateDetailList;
