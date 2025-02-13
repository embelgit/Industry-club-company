// import Axios from "../utils/axiosInstance";

// export const getUserList = async (pageNo, size, status) => {
//   let role = sessionStorage.getItem("role");
//   let fkUserId = sessionStorage.getItem("pkUserId");
//   let token = sessionStorage.getItem("token");
//   return await Axios.get(
//     `/portalAdmin/v1/getUserList?role=${role}&size=${size}&fkUserId=${fkUserId}&pageNo=${pageNo}&status=${status}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// export const searchUserList = async (keyword, pageNo, size, status) => {
//   let role = sessionStorage.getItem("role");
//   let token = sessionStorage.getItem("token");
//   return await Axios.get(
//     `/portalAdmin/v1/searchUserList?keyword=${keyword}&role=${role}&pageNo=${pageNo}&size=${size}&status=${status}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// export const getValidateUserName = async () => {
//   let token = sessionStorage.getItem("token");
//   return await Axios.get(`/portalAdmin/v1/getAllUsernameList`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const getValidateMail = async () => {
//   let token = sessionStorage.getItem("token");
//   return await Axios.get(`/portalAdmin/v1/getAllMailList`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const getUserById = async (fkUserId) => {
//   let token = sessionStorage.getItem("token");
//   return await Axios.get(`/portalAdmin/v1/getById/${fkUserId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const deactivateUser = async (fkUserId, status) => {
//   let token = sessionStorage.getItem("token");
//   return await Axios.post(
//     `/portalAdmin/v1/deactivateUser?fkUserId=${fkUserId}&status=${status}`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// export const updateUser = async (payload) => {
//   let role = sessionStorage.getItem("role");
//   let token = sessionStorage.getItem("token");
//   return await Axios.put(`/portalAdmin/v1/updateUser`, payload, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// export const deleteUser = async (fkUserId) => {
//   let role = sessionStorage.getItem("role");
//   let token = sessionStorage.getItem("token");
//   return await Axios.delete(`/portalAdmin/v1/deleteUser?fkUserId=${fkUserId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
