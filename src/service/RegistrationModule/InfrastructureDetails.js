import Axios from '../../utils/axiosInstance';

export const postInfrastructureDetails = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }

    const response = await Axios.post(
      '/industrial/company/v1/addCompanyDetails',
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

export const getInfrastructureDetails = async (
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
    `industrial/company/v1/getInfrastructureDetailsPagination?pageNo=${pageNo}&companyId=${companyId}&role=${role}&fkUserId=${fkUserId}&status=${status}`,

    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const UpdateInfrastructureDetail = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Authorization token not found in session storage.');
    }

    const response = await Axios.put(
      'industrial/company/v1/updateCompanyDetails',
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
    console.error('Error posting director details:', error);
    throw error;
  }
};
