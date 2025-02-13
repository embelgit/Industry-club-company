import React, {useEffect, useState} from 'react';
import {cilChevronLeft, cilChevronRight} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Loader';
import DataNotPresent from '../../components/DataNotPresent';
import {useNavigate} from 'react-router-dom';

import {getMatchProductPromotionDetailsPagination} from '../../../service/masterModule/ProductPromotion';
import {postInterestedStatus} from '../../../service/masterModule/CompanyBuying&Selling';

const ReceivedBlastingMessage = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  const fetchmatchbuysellDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getMatchProductPromotionDetailsPagination(
        companyId,
        pageNo,
      );
      const content = result?.data?.content || [];

      setTableData(content);
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
      fkTargetProductId: item.pkPromotionId,
      fkTargetServiceId: '',
      fkBuySellId: '',
      fkCompanyId: companyId,
      fkVendorId: item.fkCompanyId,
      status: 'Interested',
      createdBy: username,
    };

    console.log('Sending Payload:', payload);

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
                    <th>Blasting Type</th>
                    <th>Industry Type</th>
                    <th>Used For</th>
                    <th>Material Type</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Pin Code</th>
                    <th>Image</th>
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
                      <td>{item.productPromotion?.companyName || 'N/A'}</td>
                      <td>{item.productPromotion?.blastingType || 'N/A'}</td>
                      <td>
                        {item.productPromotion?.industryType?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>{item.productPromotion?.usedFor || 'N/A'}</td>
                      <td>
                        {item.productPromotion?.materialType?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.productPromotion?.countryName?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.productPromotion?.stateName?.join(', ') || 'N/A'}
                      </td>
                      <td>
                        {item.productPromotion?.cityName?.join(', ') || 'N/A'}
                      </td>
                      <td>{item.productPromotion?.pincode || 'N/A'}</td>
                      <td>
                        {item.images ? (
                          <img
                            src={`data:image/png;base64,${item.images.split(',')[1]}`}
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
                      <td>
                        {item.targetedCilent?.targetIndustryType?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.targetedCilent?.targetCountryName?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.targetedCilent?.targetStateName?.join(', ') ||
                          'N/A'}
                      </td>
                      <td>
                        {item.targetedCilent?.targetCityName?.join(', ') ||
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

export default ReceivedBlastingMessage;
