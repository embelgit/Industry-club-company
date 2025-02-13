import Axios from '../../utils/axiosInstance';
export const postInfraOnLease = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }

    // Call API with Axios
    const response = await Axios.post(
      'industrial/infrastructureOnLease/v1/addInfrastructureOnLeaseDetails',
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
    console.error('Error posting infrastructure details:', error);
    throw error;
  }
};

export const postInfraonLeaseLocation = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }
    const response = await Axios.post(
      'industrial/infrastructureOnLease/v1/addInfrastructureOnLeaseDetails',

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

export const getInfrastructureDetails = async (
  companyId,
  pageNo = 0,
  status = '',
  role = '',
  fkUserId = '',
) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `/industrial/infrastructureOnLease/v1/getInfrastructureOnLeaseDetailsPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&status=${status}&role=${role}&fkUserId=${fkUserId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getInfrastructureDetailsById = async fkInfraId => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `/industrial/infrastructureOnLease/v1/getByIdInfrastructureOnLeaseDetails?fkInfraId=${fkInfraId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const addInfraStautsChnage = async ({
  fkInfraId,
  status,
  role,
  fkUserId,
  username,
}) => {
  const token = sessionStorage.getItem('token');

  try {
    const response = await Axios.post(
      `industrial/infrastructureOnLease/v1/updateInfrastructureOnLeaseDetails?fkInfraId=${fkInfraId}&status=${status}&role=${role}&fkUserId=${fkUserId}&username=${username}`,
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

export const UpdateInfrastructure = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `/industrial/infrastructureOnLease/v1/editInfrastructureOnLeaseDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const EditInfrastructureLocation = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `/industrial/infrastructureOnLease/v1/editInfrastructureOnLeaseDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
