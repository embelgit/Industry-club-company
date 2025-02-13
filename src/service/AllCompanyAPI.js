// import Axios from '../utils/axiosInstance'

// export const getCompanyList = async (pageNo, size) => {
//   let role = sessionStorage.getItem('role');
//   let fkUserId = sessionStorage.getItem('fkUserId');
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/company/v1/getCompanyList?role=${role}&fkUserId=${fkUserId}&size=${size}&pageNo=${pageNo}`, { headers: { Authorization: `Bearer ${token}` } })
// }

// export const searchCompanyList = async (keyword, pageNo, size) => {
//   let role = sessionStorage.getItem('role');
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/company/v1/searchCompanyDetails?role=${role}&keyword=${keyword}&pageNo=${pageNo}&size=${size}`, { headers: { Authorization: `Bearer ${token}` } })
// }

// export const getCompanyById = async (fkUserId) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/company/v1/getByIdCompany?fkUserId=${fkUserId}`, { headers: { Authorization: `Bearer ${token}` } })
// }

// export const uploadCompanyExcel = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   let role = sessionStorage.getItem('role');
//   let userName= sessionStorage.getItem('userName');
//   let fkUserId = sessionStorage.getItem('fkUserId');
//   return await Axios.post(`/company/v1/uploadExcelSignUpCompany?role=${role}&username=${userName}&fkUserId=${fkUserId}`, payload, {
//     headers: {
//       'content-type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   })
// }

// export const generateOTP = async (type, email, phoneNo, countryCode, companyId) => {
//   return await Axios.post(`/company/v1/generateOtp?type=${type}&email=${email}&phoneNo=${phoneNo}&countryCode=${countryCode}&companyId=${companyId}`);
// };

// export const validateOTP = async (type, email, phoneNo, otp, companyId) => {
//   return await Axios.post(
//     `/company/v1/verifyOtp?type=${type}&email=${email}&phoneNo=${phoneNo}&otp=${otp}&companyId=${companyId}`,
//   );
// };

// export const companySignUp = async (payload) => {
//   return await Axios.post(`/company/v1/companySignUp`, payload);
// };
