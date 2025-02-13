import Axios from '../../utils/axiosInstance';

export const postProductDetails = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }
    const response = await Axios.post(
      'industrial/company/v1/addCompanyDetails',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Error posting certification details:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

export const getProductDetails = async (
  companyId,
  pageNo = 0,
  role,
  fkUserId,
  status = '',
) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/product/v1/getProductDetailsPagination?pageNo=${pageNo}&companyId=${companyId}&role=${role}&fkUserId=${fkUserId}&status=${status}`,

    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editProductDetails = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/company/v1/updateCompanyDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
