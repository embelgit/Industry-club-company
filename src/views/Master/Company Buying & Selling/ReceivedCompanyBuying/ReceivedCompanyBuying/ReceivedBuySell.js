import React, {useEffect, useState} from 'react';
import {cilChevronLeft, cilChevronRight} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPaginate from 'react-paginate';
import Loader from '../../../../components/Loader';
import DataNotPresent from '../../../../components/DataNotPresent';
import {useNavigate} from 'react-router-dom';
import {
  getmatchBuyingSellingCompanyListPagination,
  postInterestedStatus,
} from '../../../../../service/masterModule/CompanyBuying&Selling';

const ReceivedBuySell = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  const fetchmatchbuysellDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getmatchBuyingSellingCompanyListPagination(
        companyId,
        pageNo,
      );
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
      fetchmatchbuysellDetails(companyId, currentPage);
    }
  }, [currentPage]);

  const handlePageChange = selected => {
    setCurrentPage(selected.selected);
  };

  const handleInterestedClick = async item => {
    const companyId = sessionStorage.getItem('_id');
    const username = sessionStorage.getItem('userName');

    if (!companyId || !username) {
      alert('User session expired. Please log in again.');
      return;
    }

    const payload = {
      fkPromotionId: '',
      fkInfraId: '',
      fkTargetProductId: '',
      fkTargetServiceId: '',
      fkBuySellId: item.pkBuySellId,
      fkCompanyId: companyId,
      fkVendorId: item.fkCompanyId,
      status: 'Intersted',
      createdBy: username,
    };

    console.log('Sending Payload:', payload); // Debugging log

    try {
      const response = await postInterestedStatus(payload);
      console.log('API Response:', response);

      if (response.status === 200) {
        swal({
          title: 'Great',
          text: response.data.sms,
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      console.error('Error posting interested status:', error);
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
                    <th>Sr No</th>
                    <th>Company Name</th>
                    <th>Industry Type</th>
                    <th>EBITDA Margin</th>
                    <th>Established Year</th>
                    <th>Listed By Business</th>
                    <th>Employees</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Reported Sales</th>
                    <th>Run Rate Sales</th>
                    <th>Target Industry</th>
                    <th>Target Country</th>
                    <th>Target State</th>
                    <th>Target City</th>
                    <th>Interested</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1 + offset}</th>

                      {/* <td>{item.fkCompanyId || 'N/A'}</td> */}
                      <td>{item.companyBuyingSelling?.companyName || 'N/A'}</td>
                      <td>
                        {item.companyBuyingSelling?.industryType?.join(', ') ||
                          'N/A'}
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
                        {item.targetedClient?.targetIndustryType?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.targetedClient?.targetCountryName?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.targetedClient?.targetStateName?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.targetedClient?.targetCityName?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleInterestedClick(item)}>
                          Interested
                        </button>
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
                pageCount={pageCount}
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

export default ReceivedBuySell;
