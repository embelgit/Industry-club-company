import Axios from '../../utils/axiosInstance';

export const postDirectorDetails = async payload => {
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
    console.error('Error posting director details:', error);
    throw error;
  }
};

export const getDirectorDetails = async (companyId, pageNo = 0) => {
  let token = sessionStorage.getItem('token');
  const fkUserId = sessionStorage.getItem('fkUserId');
  const role = sessionStorage.getItem('role');
  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/company/v1/getDirectorDetailsPagination?companyId=${companyId}&pageNo=${pageNo}&fkUserId=${fkUserId}&role=${role}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editDirector = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/company/v1/updateCompanyDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
