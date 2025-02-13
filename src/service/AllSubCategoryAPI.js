// import Axios from '../utils/axiosInstance';

// export const addSubCategory = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/addSubCategory`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const getSubCategoryList = async (pageNo, size, status) => {
//   let role = sessionStorage.getItem('role');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getAllSubCategoryList?role=${role}&size=${size}&fkUserId=${fkUserId}&pageNo=${pageNo}&status=${status}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const getSubCategoryById = async (subCategoryId) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getByIdSubCategory?subCategoryId=${subCategoryId}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const updateSubCategory = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.put(`/product/v1/updateSubCategory`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const uploadSubCategoryExcel = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   let role = sessionStorage.getItem('role');
//   let userName= sessionStorage.getItem('userName');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   return await Axios.post(`/product/v1/addSubCategoryExcelUplaod?role=${role}&username=${userName}&fkUserId=${fkUserId}`, payload, {
//     headers: {
//       'content-type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   })
// }

// export const deactivateSubCategory = async (subCategoryId, status) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/updateSubCategoryTypeStatus?subCategoryId=${subCategoryId}&status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` }, })
// }
