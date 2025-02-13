import Axios from '../../utils/axiosInstance';

export const postReferal = async payload => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      'industrial/referral/v1/sendReferral',
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

export const getReferralData = async (
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
    `industrial/referral/v1/getReferralDetailsPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&role=${role}&fkUserId=${fkUserId}&status=${status}`,
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

export const editReferral = async payload => {
  let token = sessionStorage.getItem('token');
  return await Axios.put(`industrial/referral/v1/updateReferral`, payload, {
    headers: {Authorization: `Bearer ${token}`},
  });
};
