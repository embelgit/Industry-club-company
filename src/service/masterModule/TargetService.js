import Axios from '../../utils/axiosInstance';

export const postTargetedService = async payload => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      'industrial/product/v1/addTargetedServiceDetails',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error add Targeted Product Details:', error);
    throw error;
  }
};

export const getTargetedServiceDetailsPagination = async (
  companyId,
  pageNo = 0,
) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/product/v1/getTargetedServiceDetailsPagination?fkCompanyId=${companyId}&pageNo=${pageNo}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const postStatusTargetedProduct = async ({fkTargetId, status}) => {
  const token = sessionStorage.getItem('token');

  try {
    const response = await Axios.post(
      `industrial/product/v1/updateTargetedProductDetailsStatus?fkTargetId=${fkTargetId}&status=${status}`,
      null, // No payload body needed as the data is in the URL
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error in addStutsChnage:', error);
    throw error;
  }
};

export const updateTargetedServiceDetails = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/product/v1/updateTargetedServiceDetails`,
    payload,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};
