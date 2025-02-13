import Axios from '../../utils/axiosInstance';

export const postProductPromotion = async payload => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      'industrial/productPromotion/v1/addProductPromotionDetails',

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
export const postProductPromotionLocation = async payload => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      'industrial/productPromotion/v1/addProductPromotionDetails',

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

export const getProductPromotionData = async (
  companyId,
  pageNo = 0,
  role = '',
  fkUserId = '',
  status = '',
) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/productPromotion/v1/getProductPromotionDetailsPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&role=${role}&fkUserId=${fkUserId}&status=${status}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getProductPromotionById = async fkPromotionId => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/productPromotion/v1/getByIdProductPromotionDetails?fkPromotionId=${fkPromotionId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editProductPromotion = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `/industrial/productPromotion/v1/editProductPromotionDetails`,
    payload,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export const statusChnageProductPromotion = async ({
  fkPromotionId,
  status,
  role,
  fkUserId,
  username,
}) => {
  const token = sessionStorage.getItem('token');

  try {
    const response = await Axios.post(
      `industrial/productPromotion/v1/updateProductPromotionDetails?fkPromotionId=${fkPromotionId}&status=${status}&role=${role}&fkUserId=${fkUserId}&username=${username}`,
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

export const updateProductStatus = async ({fkProductId, status}) => {
  const token = sessionStorage.getItem('token');

  try {
    const response = await Axios.post(
      `industrial/product/v1/updateProductStatus?fkProductId=${fkProductId}&status=${status}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error in addStatusChange:', error);
    throw error;
  }
};

export const getMatchProductPromotionDetailsPagination = async (
  fkCompanyId,
  pageNo,
) => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/productPromotion/v1/getMatchProductPromotionDetailsPagination?fkCompanyId=${fkCompanyId}&pageNo=${pageNo}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
