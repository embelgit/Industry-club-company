import Axios from '../../utils/axiosInstance';

export const login = payload => {
  return Axios.post(`/industrial/company/v1/companyLogin`, payload);
};
export const signUp = async payload => {
  return await Axios.post('/industrial/company/v1/companySignUp', payload);
};
export const postGSTDetails = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.post('industrial/company/v1/addCompanyDetails', payload, {
    headers: {Authorization: `Bearer ${token}`},
  });
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Percentage Api >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const getFormStatusAndPercentage = async (companyId, moduleName) => {
  let token = sessionStorage.getItem('token');
  if (!companyId) {
    console.error('No companyId found');
    return;
  }
  return Axios.get(
    `industrial/company/v1/getFormStatusAndPercentage?fkCompanyId=${companyId}&moduleName=${moduleName}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getPercentage = async companyId => {
  let token = sessionStorage.getItem('token');
  if (!companyId) {
    console.error('No companyId found');
    return;
  }
  return Axios.get(
    `industrial/company/v1/getPercentageForCompany?fkCompanyId=${companyId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Percentage Api >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const getGSTDetails = async (companyId, pageNo = 0) => {
  let token = sessionStorage.getItem('token');
  const fkUserId = sessionStorage.getItem('fkUserId');
  const role = sessionStorage.getItem('role');
  if (!companyId) {
    console.error('No companyId found');
    return;
  }
  return Axios.get(
    `industrial/company/v1/getGstDetailsPagination?companyId=${companyId}&pageNo=${pageNo}&fkUserId=${fkUserId}&role=${role}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const postSetPrimary = async (companyId, gstNo, isPrimary) => {
  const token = sessionStorage.getItem('token');

  try {
    const response = await Axios.post(
      `industrial/company/v1/updateGstStatus?companyId=${companyId}&gstNo=${gstNo}&isPrimary=${isPrimary}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('Error during API call:', error);
    throw error;
  }
};

export const postBussinessDetail = postData => {
  let token = sessionStorage.getItem('token');
  return Axios.post('industrial/company/v1/addCompanyDetails', postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getBussinessDetails = async companyId => {
  let token = sessionStorage.getItem('token');
  if (!companyId) {
    console.error('No companyId found');
    return;
  }
  return Axios.get(
    `industrial/company/v1/getCompanyRegisterDetails?fkCompanyId=${companyId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getbusinesstype = async companyId => {
  let token = sessionStorage.getItem('token');
  if (!companyId) {
    console.error('No companyId found');
    return;
  }
  return Axios.get(
    `industrial/company/v1/getBusinessTypeList?companyId=${companyId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editGSTDetails = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/company/v1/updateCompanyDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const editBusinessType = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(
    `industrial/company/v1/updateCompanyDetails`,
    payload,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
