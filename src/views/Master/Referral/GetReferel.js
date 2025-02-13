import React, {useEffect, useState} from 'react';
import {
  cilChevronLeft,
  cilChevronRight,
  cilPencil,
  cilTrash,
} from '@coreui/icons';
import {CIcon} from '@coreui/icons-react';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Loader';
import DataNotPresent from '../../components/DataNotPresent';
import {useNavigate} from 'react-router-dom';
import {getReferralData} from '../../../service/masterModule/Referral';

const GetReferel = ({handlePostClick, handleListClick}) => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const navigate = useNavigate();

  // Fetch function for buy/sell details
  const fetchGSTDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getReferralData(companyId, pageNo);
      console.log('Fetched Referral details: ', result);
      setTableData(result?.data?.content || []);
      setPageCount(result?.data?.totalPages || 0);
      setOffset(result?.data?.pageable?.offset || 0);
    } catch (error) {
      console.error('Error fetching Referral details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    console.log('companyId found in sessionStorage:', companyId);
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
  };

  const handleEdit = item => {
    if (item?.pkReferralId) {
      navigate(`/edit-referral/${item.pkReferralId}`, {
        state: {companyData: item},
      });
    } else {
      console.error('No pkReferralId provided or item is invalid');
    }
  };

  // Delete row from table
  const handleDelete = indexToDelete => {
    setTableData(prevTableData =>
      prevTableData.filter((_, index) => index !== indexToDelete),
    );
  };

  return (
    <div className="d-flex flex-column">
      <div className="card">
        {loader ? (
          <Loader />
        ) : tableData.length ? (
          <>
            <div className="card-header">
              <strong>Submitted Data</strong>
            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-secondary table-bordered">
                  <tr>
                    <th scope="col">Sr No</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Contact No</th>
                    <th scope="col">Created By</th>
                    <th scope="col">Updated By</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + offset}</td>
                      <td>{item.companyName || 'N/A'}</td>
                      <td>{item.email || 'N/A'}</td>
                      <td>{item.contactNo || 'N/A'}</td>
                      <td>{item.createdBy || 'N/A'}</td>
                      <td>{item.updatedBy || 'N/A'}</td>
                      <td>
                        <CIcon
                          icon={cilPencil}
                          style={{
                            cursor: 'pointer',
                            fontSize: '20px',
                            color: '#28a745',
                          }}
                          onClick={() => handleEdit(item)}
                        />
                      </td>
                      <td>
                        <CIcon
                          icon={cilTrash}
                          className="text-danger"
                          style={{cursor: 'pointer', fontSize: '20px'}}
                          onClick={() => handleDelete(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                activeClassName={'active'}
                forcePage={currentPage}
              />
            </div>
          </>
        ) : (
          <DataNotPresent title="Data Not Present" />
        )}
      </div>
    </div>
  );
};

export default GetReferel;
