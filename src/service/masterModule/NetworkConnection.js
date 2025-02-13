import Axios from '../../utils/axiosInstance';

export const postRequest = async payload => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      'industrial/network/v1/sentNetworkConnectionRequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error Send Request:', error);
    throw error;
  }
};

export const getNetworkConnectionList = async (
  companyId,
  pageNo = 0,
  status,
) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/network/v1/getNetworkConnectionListPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&status=${status}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
export const getNetworkConnectionCount = async (companyId, status) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/network/v1/getCountNetworkConnection?fkCompanyId=${companyId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getReferralById = async fkReferralId => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/referral/v1/getByIdReferralDetails?fkReferralId=${fkReferralId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const updateStatusNetworkConnection = async ({
  fkNetworkId,
  status,
  username,
}) => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in sessionStorage');
    }

    const response = await Axios.post(
      `industrial/network/v1/updateNetworkConnectionRequestStatus?fkNetworkId=${fkNetworkId}&status=${status}&username=${username}`,
      null, // Use null for a POST request with no body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data; // Return the data part of the response
  } catch (error) {
    console.error('Error updating network connection status:', error);
    throw error;
  }
};
