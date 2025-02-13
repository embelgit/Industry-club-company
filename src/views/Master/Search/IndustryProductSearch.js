import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {CIcon} from '@coreui/icons-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation} from 'react-router-dom';
import Loader from '../../components/Loader';
import DataNotPresent from '../../components/DataNotPresent';
import {cilChevronLeft, cilChevronRight} from '@coreui/icons';
import {FaArrowLeft} from 'react-icons/fa';
import FilterCheckbox from './FilterCheckbox';
import {getCardList} from '../../../service/masterModule/SearchApi';
import {AddToWallet} from '../../../service/masterModule/Wallet';
import {AppHeader} from '../../../components';

const IndustryProductSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const Product = location.state?.subcategory;

  // Handle the data coming from FilterCheckbox
  const handleSearchResult = data => {
    console.log('Received data from FilterCheckbox:', data);
    setSearchResult(data); // Set the filtered data to searchResult state
  };

  // Fetch data from the getCardList API
  const fetchCompanyList = async (companyId, pageNo = 0, Product) => {
    try {
      setLoader(true);
      const result = await getCardList(companyId, pageNo, Product);

      if (Array.isArray(result?.data?.content)) {
        const fetchedData = result?.data?.content;
        console.log('API Response:', fetchedData);

        // Logging fkVendorId for each company in the array
        fetchedData.forEach((company, index) => {
          console.log(`fkVendorId [${index}]:`, company.fkVendorId);
        });

        setTableData(fetchedData);
        setPageCount(result?.data?.totalPages || 0);
      } else {
        console.error('Invalid data format');
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoader(false);
    }
  };

  // useEffect to fetch data when the component mounts or page changes
  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      // If there is no filtered result, fetch company list from API
      if (!searchResult || searchResult.length === 0) {
        fetchCompanyList(companyId, currentPage, Product);
      }
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, [currentPage, Product, searchResult]); // Depend on searchResult too

  const handlePageChange = selected => {
    setCurrentPage(selected.selected);
  };

  const handleAddToWallet = async (fkVendorId, values, actions) => {
    const companyId = sessionStorage.getItem('_id');
    const userName = sessionStorage.getItem('userName');

    if (!companyId) {
      console.error('Company ID not found in session storage');
      return;
    }

    const postData = {
      fkCompanyId: companyId,
      fkProductId: '',
      fkServiceId: '',
      fkVendorId: fkVendorId,
      createdBy: userName,
    };

    try {
      console.log('Submitting postData:', JSON.stringify(postData, null, 2));

      const result = await AddToWallet(postData);
      console.log('Submission result: ', result);

      if (result.status === 200) {
        const pkWalletId = result.data.pkWalletId;
        console.log('pkWalletId', pkWalletId);
        sessionStorage.setItem('pkWalletId', pkWalletId);
        swal({
          title: 'Great',
          text: result.data.sms,
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      console.error('Error in Add To Wallet:', error?.response || error);

      if (error?.response?.status === 400) {
        swal({
          title: 'Warning',
          text: error.response.data,
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
    } finally {
      actions?.resetForm?.(); // Reset form only if `actions` is passed
    }
  };

  return (
    <>
      <AppHeader />
      <div className="d-flex align-items-center">
        <button
          className="btn btn-light d-flex justify-content-center m-2"
          onClick={() => navigate('/search')}>
          <FaArrowLeft className="me-2" style={{fontSize: '1.2rem'}} />
        </button>
      </div>
      <div className="d-flex flex-grow-1 justify-content-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12 mb-4">
              <FilterCheckbox onSearchResult={handleSearchResult} />
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              {loader ? (
                <Loader />
              ) : searchResult?.data?.content?.length > 0 ||
                tableData?.length > 0 ? (
                <>
                  <div className="row">
                    {/* Access the 'content' array of searchResult */}
                    {(searchResult?.data?.content?.length > 0
                      ? searchResult.data.content
                      : tableData
                    )?.map((company, index) => (
                      <div key={index} className="col-12 mb-4">
                        <div className="p-4 border rounded shadow-sm bg-white">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1
                              className="h4 mb-0"
                              style={{flex: 1, whiteSpace: 'nowrap'}}>
                              {company.companyName || ''}
                            </h1>
                            <h1
                              className="h4 mb-0 ms-2"
                              style={{
                                flex: 1,
                                whiteSpace: 'nowrap',
                                fontSize: '16px',
                              }}>
                              ({company.stateName || ''}{' '}
                              {company.countryName || ''})
                            </h1>
                            <div className="d-flex flex-row-reverse gap-3 ms-auto">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate('/company-Details', {
                                    state: {vendorId: company.fkVendorId},
                                  })
                                }
                                className="btn btn-primary custom-btn shadow">
                                <i className="fas fa-eye"></i> View More
                              </button>
                              <button
                                type="button"
                                className="btn btn-success custom-btn shadow"
                                onClick={() =>
                                  handleAddToWallet(company.fkVendorId)
                                }>
                                <i className="fas fa-wallet"></i> Add To Wallet
                              </button>
                            </div>
                          </div>
                          <p className="fw-bold text-secondary m-0">
                            {company.businessType?.join('/') || 'No Type'}
                          </p>
                          <div className="d-flex my-3">
                            <p className="fw-bold text-secondary me-3">
                              <i className="fas fa-star me-1"></i> Rating:{' '}
                              {company.ratingCount || 'No Rating'}
                            </p>
                            <p className="fw-bold text-secondary me-3">
                              <i className="fas fa-users me-1"></i> Connections:{' '}
                              {company.connectionCount || 0}
                            </p>
                            <p className="fw-bold text-secondary">
                              <i className="fas fa-calendar-alt me-1"></i>{' '}
                              Founded:{' '}
                              {company.registrationDate || 'Not Available'}
                            </p>
                          </div>
                          <p className="fw-bold mb-2">Products:</p>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {company.productName?.map((product, proIndex) => (
                              <span
                                key={proIndex}
                                className="badge text-dark p-2 badge-hover">
                                {product}
                              </span>
                            ))}
                          </div>
                          <p className="fw-bold mb-2">Services:</p>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {company.serviceName?.map((service, svcIndex) => (
                              <span
                                key={svcIndex}
                                className="badge text-dark p-2 badge-hover">
                                {service || 'No Service'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
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
                <DataNotPresent title="No Data Available" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndustryProductSearch;
