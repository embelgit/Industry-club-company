import Axios from '../../utils/axiosInstance';

export const postDepartment = async payload => {
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
    console.error('Error posting director details:', error);
    throw error;
  }
};

export const getDepartment = async (
  companyId,
  pageNo = 0,
  role = '',
  fkUserId = '',
) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/company/v1/getDepartmentTeamDetailsPagination?companyId=${companyId}&pageNo=${pageNo}&role=${role}&fkUserId=${fkUserId}`,

    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editDepartment = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/company/v1/updateCompanyDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
