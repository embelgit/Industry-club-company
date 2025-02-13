import Axios from '../utils/axiosInstance';
export const getValidateUserName = async (fkDeptId = '') => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/company/v1/getUsernameListForValidation?fkDeptId=${fkDeptId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};
export const getValidateEmail = async (fkDeptId = '') => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/company/v1/getEmailListForValidation?fkDeptId=${fkDeptId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};
export const getValidateContact = async (fkDeptId = '') => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/company/v1/getContactListForValidation?fkDeptId=${fkDeptId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
    },
  );
};

export const getGSTValidate = async (companyId = '') => {
  try {
    const token = sessionStorage.getItem('token');

    // Handle missing token
    if (!token) {
      throw new Error('Authentication token is missing. Please log in.');
    }

    const response = await Axios.get(
      `industrial/company/v1/getGstNumberDropdown?companyId=${companyId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );

    return response.data; // Return API response data
  } catch (error) {
    console.error('Error in getGSTValidate:', error);
    throw error; // Re-throw to handle in calling code
  }
};
