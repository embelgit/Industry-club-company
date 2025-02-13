import Axios from '../../utils/axiosInstance';

export const getProductandIndustrylist = async () => {
  let token = sessionStorage.getItem('token');
  return Axios.get(`industrial/product/v1/getIndustryAndProductList`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getCardList = async (companyId, pageNo = 0, Product) => {
  let token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/company/v1/getSearchCompanyDetailsFromProductPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&productName=${encodeURIComponent(Product)}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
export const getSearchProductServiceListFilter = async (
  companyId,
  industryType,
  materialType,
  Product,
  serviceName = '',
  countryName,
  stateName,
  cityName,
  pageNo,
) => {
  let token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/product/v1/getSearchProductServiceListFilter?fkCompanyId=${companyId}&pageNo=${pageNo}&productName=${encodeURIComponent(Product)}&industryType=${industryType}&materialType=${materialType}&serviceName=${serviceName}&countryName=${countryName}&stateName=${stateName}&cityName=${cityName}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getCompanyDetails = async (companyId, fkVendorId) => {
  let token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/company/v1/getSearchAllCompanyDetails?fkCompanyId=${companyId}&fkVendorId=${fkVendorId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getServiceProductDetails = async (productId, serviceId) => {
  let token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/company/v1/getSearchProductServiceDetails?fkServiceId=${serviceId || ''}&fkProductId=${productId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Rating APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const postRating = async payload => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      'industrial/subcription/v1/addRatingDetails',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error posting director details:', error);
    throw error;
  }
};

export const getRating = async fkRatingId => {
  let token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/subcription/v1/getByIdRatingDetails?fkRatingId=${fkRatingId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const updateRating = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/subcription/v1/updateRatingDetails`,
    payload,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Search API By keyword >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const getKeywordListSuggetions = async (companyId, keyword) => {
  let token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/product/v1/getKeywordListSuggetions?fkCompanyId=${companyId}&keyword=${keyword}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getKeywordUserWise = async companyId => {
  let token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/product/v1/getKeywordUserWise?fkCompanyId=${companyId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
