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
import {
  addStutsChnage,
  getCompanyBuySellData,
} from '../../../service/masterModule/CompanyBuying&Selling';
import {AppHeader, AppSidebar} from '../../../components';

const GetCompanyBuySell = ({handlePostClick, handleListClick}) => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [pkBuySellId, setPkBuySellId] = useState(null);
  const navigate = useNavigate();

  const fetchGSTDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getCompanyBuySellData(companyId, pageNo);
      console.log('Fetched Company Buy & Sell details: ', result);
      setTableData(result?.data?.content || []);
      setPageCount(result?.data?.totalPages || 0);
      setOffset(result?.data?.pageable?.offset || 0);
      setPkBuySellId(result?.data?.content.pkBuySellId);
    } catch (error) {
      console.error('Error fetching Company Buy & Sell details:', error);
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

  const handlePageChange = selected => {
    const selectedPage = selected.selected;
    setCurrentPage(selectedPage);
  };

  // Fetch company details by ID
  // const fetchCompanyById = async (id) => {
  //   try {
  //     setLoader(true);
  //     const result = await getCompBuySellById(id);
  //     console.log("Fetched Company details by ID: ", result);
  //     // Navigate to the update page
  //     navigate(`/Update_CompanyBuySell/${id}`, {
  //       state: { companyData: result?.data },
  //     });
  //   } catch (error) {
  //     console.error("Error fetching company data by ID:", error);
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  const handleEdit = item => {
    if (item?.pkBuySellId) {
      navigate(`/update-Company-BuySell/${item.pkBuySellId}`, {
        state: {companyData: item},
      });
    } else {
      console.error('No pkBuySellId provided or item is invalid');
    }
  };

  const handleDelete = indexToDelete => {
    setTableData(prevTableData =>
      prevTableData.filter((_, index) => index !== indexToDelete),
    );
  };

  const handleStatusChange = async (e, item) => {
    const selectedStatus = e.target.value;
    const userName = sessionStorage.getItem('userName');
    // Prepare the payload
    const payload = {
      fkBuySellId: item.pkBuySellId, // Correct parameter name for the API
      status: selectedStatus,
      username: userName,
    };

    try {
      const response = await addStutsChnage(payload); // Ensure `addStutsChnage` works as intended

      // Check if the response is successful
      if (response.status === 200) {
        console.log('Status updated successfully');

        // Update the table data state to reflect the change
        setTableData(prevTableData =>
          prevTableData.map(tableItem =>
            tableItem.pkBuySellId === item.pkBuySellId
              ? {
                  ...tableItem,
                  targetedClient: {
                    ...tableItem.targetedClient,
                    status: selectedStatus,
                  },
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
    <>
      <AppSidebar />
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
                      <th scope="col">Industry Type</th>
                      <th scope="col">EBITDA Margin</th>
                      <th scope="col">Established Year</th>
                      <th scope="col">Listed By Business</th>
                      <th scope="col">Employees</th>
                      <th scope="col">Country Name</th>
                      <th scope="col">State Name</th>
                      <th scope="col">City Name</th>
                      <th scope="col">Reported Sales</th>
                      <th scope="col">Run Rate Sales</th>
                      <th scope="col">Industry Type</th>
                      <th scope="col">Country Name</th>
                      <th scope="col">State Name</th>
                      <th scope="col">City Name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        <th scope="row" className="fw-normal">
                          {index + 1 + offset}
                        </th>
                        <td>
                          {item.companyBuyingSelling?.industryType?.join(
                            ', ',
                          ) || 'N/A'}
                        </td>
                        <td>
                          {item.companyBuyingSelling?.ebitdaMargin || 'N/A'}
                        </td>
                        <td>
                          {item.companyBuyingSelling?.establistedYear || 'N/A'}
                        </td>
                        <td>
                          {item.companyBuyingSelling?.listedByBusiness || 'N/A'}
                        </td>
                        <td>{item.companyBuyingSelling?.employees || 'N/A'}</td>
                        <td>
                          {item.companyBuyingSelling?.countryName?.join(', ') ||
                            'N/A'}
                        </td>
                        <td>
                          {item.companyBuyingSelling?.stateName?.join(', ') ||
                            'N/A'}
                        </td>
                        <td>
                          {item.companyBuyingSelling?.cityName?.join(', ') ||
                            'N/A'}
                        </td>
                        <td>
                          {item.companyBuyingSelling?.reportedSales || 'N/A'}
                        </td>
                        <td>
                          {item.companyBuyingSelling?.runRateSales || 'N/A'}
                        </td>
                        <td>
                          {item?.targetedClient?.targetIndustryType?.join(
                            ', ',
                          ) || 'N/A'}
                        </td>
                        <td>
                          {item?.targetedClient?.targetCountryName?.join(
                            ', ',
                          ) || 'N/A'}
                        </td>
                        <td>
                          {item?.targetedClient?.targetStateName?.join(', ') ||
                            'N/A'}
                        </td>
                        <td>
                          {item?.targetedClient?.targetCityName?.join(', ') ||
                            'N/A'}
                        </td>

                        <td>
                          <select
                            value={item.targetedClient?.status || ''}
                            onChange={e => handleStatusChange(e, item)}>
                            <option
                              value={item.targetedClient?.status || 'N/A'}>
                              {item.status || 'N/A'}
                            </option>
                            <option value="Deactive">Reactive</option>
                            <option value="Deactive">Close</option>
                          </select>
                        </td>
                        <td>
                          <td>
                            <CIcon
                              icon={cilPencil}
                              style={{
                                cursor: 'pointer',
                                fontSize: '20px',
                                color: '#28a745',
                              }}
                              onClick={() => handleEdit(item)} // Pass the entire item object
                            />
                          </td>
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
              <div
                className="d-flex justify-content-end m-3
            ">
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
    </>
  );
};

export default GetCompanyBuySell;
