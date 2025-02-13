import Axios from '../utils/axiosInstance';

export const getSmsCount = async companyId => {
  const token = sessionStorage.getItem('token');
  return Axios.get(
    `industrial/chat/v1/getChattingDetailsCount?fkCompanyId=${companyId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
