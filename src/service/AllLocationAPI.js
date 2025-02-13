// import Axios from '../utils/axiosInstance'

// export const getLocationList = async (pageNo, size) => {
//   let role = sessionStorage.getItem('role');
//   let fkUserId = sessionStorage.getItem('pkUserId');
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/location/v1/getAllLocationList?role=${role}&size=${size}&fkUserId=${fkUserId}&pageNo=${pageNo}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const getLocationById = async (fkLocationId) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(`/location/v1/getById/${fkLocationId}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const searchLocationList = async (keyword, pageNo, size) => {
//   let token = sessionStorage.getItem('token');
//   let role = sessionStorage.getItem('role');
//   return await Axios.get(`/location/v1/searchLocationList?keyword=${keyword}&role=${role}&pageNo=${pageNo}&size=${size}`, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const addLocation = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.post(`/location/v1/addLocation`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const updateLocation = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.put(`/location/v1/updateLocation`, payload, { headers: { Authorization: `Bearer ${token}` }, })
// }

// export const uploadLocationExcel = async (payload) => {
//   let token = sessionStorage.getItem('token');
//   let role = sessionStorage.getItem('role');
//   let userName= sessionStorage.getItem('userName');
//   return await Axios.post(`/location/v1/addLocationExcelUplaod?role=${role}&username=${userName}`, payload, {
//     headers: {
//       'content-type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   })
// }
