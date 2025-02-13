// import Axios from '../utils/axiosInstance';

// export const getIndustryList = async (pageNo, size, status) => {
//   let role = sessionStorage.getItem('role');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getAllIndustryList?role=${role}&size=${size}&fkUserId=${fkUserId}&pageNo=${pageNo}&status=${status}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const getIndustryById = async (industryId) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getByIdIndustry?industryId=${industryId}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const addIndustry = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/addIndustry`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const updateIndustry = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.put(`/product/v1/updateIndustry`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const uploadIndustryExcel = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   let role = sessionStorage.getItem('role');
//   let userName= sessionStorage.getItem('userName');
//   return await Axios.post(`/product/v1/addIndustryExcelUplaod?role=${role}&username=${userName}`, payload, {
//     headers: {
//       'content-type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   })
// }

// export const deactivateIndustry = async (industryId, status) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/updateIndustryTypeStatus?industryId=${industryId}&status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` }, })
// }
