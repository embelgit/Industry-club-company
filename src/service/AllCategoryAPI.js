// import Axios from '../utils/axiosInstance';

// export const addCategory = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/addCategory`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const getCategoryList = async (pageNo, size, status) => {
//   let role = sessionStorage.getItem('role');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getAllCategoryList?role=${role}&size=${size}&fkUserId=${fkUserId}&pageNo=${pageNo}&status=${status}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const getCategoryById = async (categoryId) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getByIdCategory?categoryId=${categoryId}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const updateCategory = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.put(`/product/v1/updateCategory`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const uploadCategoryExcel = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   let role = sessionStorage.getItem('role');
//   let userName= sessionStorage.getItem('userName');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   return await Axios.post(`/product/v1/addCategoryExcelUplaod?role=${role}&username=${userName}&fkUserId=${fkUserId}`, payload, {
//     headers: {
//       'content-type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   })
// };

// export const deactivateCategory = async (categoryId, status) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/updateCategoryTypeStatus?categoryId=${categoryId}&status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` }, })
// }
