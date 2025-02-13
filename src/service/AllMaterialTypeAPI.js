// import Axios from '../utils/axiosInstance';

// export const getMaterialTypeList = async (pageNo, size, status) => {
//   let role = sessionStorage.getItem('role');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getListMaterialType?role=${role}&size=${size}&fkUserId=${fkUserId}&pageNo=${pageNo}&status=${status}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const getMaterialTypeById = async (materialId) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/product/v1/getByIdMaterialType?materialId=${materialId}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const addMaterialType = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/addMaterialType`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const updateMaterialType = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.put(`/product/v1/updateMaterialType`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const uploadMaterialTypeExcel = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   let role = sessionStorage.getItem('role');
//   let userName= sessionStorage.getItem('userName');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   return await Axios.post(`/product/v1/addMaterialTypeExcelUplaod?role=${role}&username=${userName}&fkUserId=${fkUserId}`, payload, {
//     headers: {
//       'content-type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   })
// }

// export const deactivateMaterialType = async (materialId, status) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/product/v1/updateMaterialTypeStatus?materialId=${materialId}&status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` }, })
// }
