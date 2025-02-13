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
import {getInfrastructureDetails} from '../../../service/RegistrationModule/InfrastructureDetails';

const InfrastructureDetailList = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const size = 20;

  // Fetch function for certificate details
  const fetchGSTDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getInfrastructureDetails(companyId, pageNo);
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
    const companyId = sessionStorage.getItem('_id');
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
    const companyId = sessionStorage.getItem('_id');
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
                        <th scope="col">Equipment Type</th>
                        <th scope="col">Total Equipment</th>
                        <th scope="col">Description</th>
                        <th scope="col">Area Of Factory</th>
                        <th scope="col">Country Name</th>
                        <th scope="col">State Name</th>
                        <th scope="col">City Name</th>

                        <th scope="col">Images</th>
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

                          <td>{e.equipmentType}</td>
                          <td>{e.totalEquipment}</td>
                          <td>{e.description}</td>
                          <td>{e.areaOfFactory}</td>
                          <td>{e.countryName}</td>
                          <td>{e.stateName}</td>
                          <td>{e.cityName}</td>
                          <td>
                            {Array.isArray(e.infraImage) &&
                            e.infraImage.length > 0 ? (
                              <img
                                src={`data:image/jpeg;base64,${e.infraImage[0].split(',')[1]}`}
                                alt="Image"
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                }}
                              />
                            ) : (
                              'No Image'
                            )}
                          </td>
                          <td>
                            <Link
                              to={`/update-Infrastructure-Details/${index}`}
                              state={{
                                InfrastructureDetails: tableData[index],
                              }}
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

export default InfrastructureDetailList;
