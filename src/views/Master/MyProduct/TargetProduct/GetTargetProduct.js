import React, {useEffect, useState} from 'react';
import {
  cilChevronLeft,
  cilChevronRight,
  cilPencil,
  cilTrash,
} from '@coreui/icons';
import {CIcon} from '@coreui/icons-react';
import ReactPaginate from 'react-paginate';
import {useNavigate} from 'react-router-dom';
import Loader from '../../../components/Loader';
import DataNotPresent from '../../../components/DataNotPresent';
import {
  getTargetedProduct,
  postStatusTargetedProduct,
} from '../../../../service/masterModule/MyProduct';

const GetTargetProduct = ({handlePostClick, handleListClick}) => {
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
      const result = await getTargetedProduct(companyId, pageNo);
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
    if (item?._id) {
      navigate(`/edit-TargetedProduct/${item._id}`, {
        state: {companyData: item},
      });
    } else {
      console.error('No _id provided or item is invalid');
    }
  };

  // Delete row from table
  const handleDelete = indexToDelete => {
    setTableData(prevTableData =>
      prevTableData.filter((_, index) => index !== indexToDelete),
    );
  };

  const handleStatusChange = async (e, item) => {
    const selectedStatus = e.target.value;

    // Prepare the payload
    const payload = {
      fkTargetId: item._id, // Correct parameter name for the API
      status: selectedStatus,
    };

    try {
      const response = await postStatusTargetedProduct(payload); // Ensure `addStutsChnage` works as intended

      // Check if the response is successful
      if (response.status === 200) {
        console.log('Status updated successfully');

        // Update the table data state to reflect the change
        setTableData(prevTableData =>
          prevTableData.map(tableItem =>
            tableItem._id === item._id
              ? {
                  ...tableItem,

                  status: selectedStatus,
                }
              : tableItem,
          ),
        );

        // Show success message
        swal({
          title: 'Great',
          text: 'Submission successful!',
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      // Handle errors appropriately
      if (error?.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Invalid request!';
        swal({
          title: 'Warning',
          text: errorMessage,
          icon: 'warning',
          timer: 2000,
          buttons: false,
        });
      } else {
        swal({
          title: 'Error',
          text: 'Something went wrong!',
          icon: 'error',
          timer: 2000,
          buttons: false,
        });
      }
    }
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
                    <th scope="col">Product Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Industry Type</th>
                    <th scope="col">Material Type</th>
                    <th scope="col">countryName</th>
                    <th scope="col">stateName</th>
                    <th scope="col">cityName</th>
                    <th scope="col">certificateName</th>{' '}
                    <th scope="col">turnOver</th>
                    <th scope="col">status</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + offset}</td>
                      <td>{item.productName || 'N/A'}</td>
                      <td>{item.quantity || 'N/A'}</td>
                      <td>{item.industryType || 'N/A'}</td>
                      <td>{item.materialType || 'N/A'}</td>
                      <td>{item.countryName || 'N/A'}</td>
                      <td>{item.stateName || 'N/A'}</td>
                      <td>{item.cityName || 'N/A'}</td>
                      <td>{item.certificateName || 'N/A'}</td>
                      <td>{item.turnOver || 'N/A'}</td>

                      <td>
                        <select
                          value={item.status || ''}
                          onChange={e => handleStatusChange(e, item)}>
                          <option value={item?.status || 'N/A'}>
                            {item.status || 'N/A'}
                          </option>
                          <option value="Deactive">Deactive</option>
                        </select>
                      </td>
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
            <div className="d-flex justify-content-end">
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

export default GetTargetProduct;
