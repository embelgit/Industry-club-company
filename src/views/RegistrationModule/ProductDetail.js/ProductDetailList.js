import {CCardHeader, CTable} from '@coreui/react';
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
import {getProductDetails} from '../../../service/RegistrationModule/ProductDetailsAPIs';

const ProductDetailList = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const size = 20;

  // Fetch function for certificate details
  const fetchProductDetails = async (
    companyId,
    pageNo = 0,
    role = '',
    fkUserId = '',
    status = '',
  ) => {
    try {
      setLoader(true);
      const result = await getProductDetails(
        companyId,
        pageNo,
        role,
        fkUserId,
        status,
      );
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
      fetchProductDetails(companyId, currentPage);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, [currentPage]);

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
                        <th scope="col">ProductName</th>
                        <th scope="col">Description</th>
                        <th scope="col">HSN Code</th>
                        <th scope="col">SAC Code</th>
                        <th scope="col">Industry Type</th>
                        <th scope="col">Material Type</th>
                        <th scope="col">Keywords</th>
                        <th scope="col">Image</th>
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

                          <td>{e.productName}</td>
                          <td>{e.description}</td>
                          <td>{e.hsnCode}</td>
                          <td>{e.sacCode}</td>
                          <td>{e.industryType.join(', ')}</td>
                          <td>{e.materialType.join(', ')}</td>
                          <td>{e.keyword.join(', ')}</td>

                          <td>
                            {Array.isArray(e.images) && e.images.length > 0 ? (
                              <img
                                src={`data:image/jpeg;base64,${e.images[0].split(',')[1]}`}
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
                              to={`/update-Product-Details/${index}`}
                              state={{ProductDetails: tableData[index]}}
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

export default ProductDetailList;
