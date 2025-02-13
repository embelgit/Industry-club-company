import Axios from '../../utils/axiosInstance';

export const postCompanyBuySell = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }
    const response = await Axios.post(
      'industrial/buyingSelling/v1/addCompanyBuyingSellingDetails',

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

export const postCompanyBuySellLocation = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }
    const response = await Axios.post(
      'industrial/buyingSelling/v1/addCompanyBuyingSellingDetails',

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

export const getCompanyBuySellData = async (
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
    `industrial/buyingSelling/v1/getCompanyBuyingSellingDetailsPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&role=${role}&fkUserId=${fkUserId}&status=${status}`,

    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getCompBuySellById = async BuySellId => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `/industrial/buyingSelling/v1/getByIdCompanyBuyingSellingDetails?fkBuySellId=${BuySellId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editCompBuySell = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/buyingSelling/v1/editCompanyBuyingSellingDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editCompBuySellLocation = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/buyingSelling/v1/editCompanyBuyingSellingDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const addStutsChnage = async ({
  fkBuySellId,
  status,
  role = '',
  fkUserId = '',
  username,
}) => {
  const token = sessionStorage.getItem('token');

  try {
    const response = await Axios.post(
      `industrial/buyingSelling/v1/updateCompanyBuyingSellingStatus?fkBuySellId=${fkBuySellId}&status=${status}&role=${role}&fkUserId=${fkUserId}&username=${username}`,
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

export const getSellingInterstedCompanyListPagination = async (
  fkCompanyId,
  pageNo,
  status,
) => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/buyingSelling/v1/getSellingInterstedCompanyListPagination?fkCompanyId=${fkCompanyId}&pageNo=${pageNo}&status=${status}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getmatchBuyingSellingCompanyListPagination = async (
  fkCompanyId,
  pageNo,
) => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/buyingSelling/v1/getmatchBuyingSellingCompanyListPagination?fkCompanyId=${fkCompanyId}&pageNo=${pageNo}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const postInterestedStatus = async payload => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    alert('Authentication failed. Please log in again.');
    throw new Error('No authentication token found.');
  }

  try {
    const response = await Axios.post(
      `industrial/buyingSelling/v1/addFormDetails`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error in postInterestedStatus:', error.response || error);
    throw error;
  }
};
