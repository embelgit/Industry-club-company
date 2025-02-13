// import Axios from "../utils/axiosInstance";

// //Company Details
// export const getCompanyDetailsPagination = async (pageNo, role, pkUserId) => {
//   const token = sessionStorage.getItem("token");
//   return await Axios.get(
//     `/company/v1/getCompanyDetailsPagination?pageNo=${pageNo}&role=${role}&fkUserId=${pkUserId}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// //Product Details
// export const getProductDetailsPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   companyId,
//   status,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     companyId: companyId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(`product/v1/getProductDetailsPagination?${params}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// //Product Status
// export const getProductStatus = async (
//   role,
//   pkUserId,
//   productId,
//   status,
//   username,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     fkProductId: productId,
//     status: status,
//     username,
//   }).toString();

//   return await Axios.get(`product/v1/updateProductStatus?${params}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// //Service Details
// export const getServiceDetailsPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   companyId,
//   status,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     companyId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(`company/v1/getServiceDetailsPagination?${params}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

// //Department User Details
// export const getDepartmentUserDetailsPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   companyId,
// ) => {
//   const token = sessionStorage.getItem("token");
//   return await Axios.get(
//     `company/v1/getDepartmentTeamDetailsPagination?pageNo=${pageNo}&role=${role}&fkUserId=${pkUserId}&companyId=${companyId}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// //Product Promotion
// export const getProductPromotionDetailsPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   companyId,
//   status,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     fkCompanyId: companyId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(
//     `productPromotion/v1/getProductPromotionDetailsPagination?${params}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// //Company Buying & Selling
// export const getBuyingSellingPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   companyId,
//   status,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     fkCompanyId: companyId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(
//     `buyingSelling/v1/getCompanyBuyingSellingDetailsPagination?${params}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// //Infrastructure On Lease
// export const getInfrastructureOnLeasePagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   companyId,
//   status,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     fkCompanyId: companyId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(
//     `infrastructureOnLease/v1/getInfrastructureOnLeaseDetailsPagination?${params}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// //Company Referral Details
// export const getCompanyReferalDetailsPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   status,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(
//     `referral/v1/getCompanyReferralDetailsPagination?${params}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// //Network Connection
// export const getNetworkConnectionListPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   status,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(
//     `network/v1/getCompanyNetworkConnectionListPagination?${params}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// //Infrastructure Details
// export const getInfrastructureDetailsPagination = async (
//   pageNo,
//   role,
//   pkUserId,
//   status,
//   companyId,
// ) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     pageNo,
//     role,
//     fkUserId: pkUserId,
//     companyId,
//     status: status || "",
//   }).toString();

//   return await Axios.get(
//     `company/v1/getInfrastructureDetailsPagination?${params}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };

// // Dashboard Count
// export const getPortalDashBoardCount = async (role, pkUserId) => {
//   const token = sessionStorage.getItem("token");
//   const params = new URLSearchParams({
//     role,
//     fkUserId: pkUserId,
//   }).toString();

//   return await Axios.get(
//     `dashBoardCount/v1/getPortalDashBoardCount?${params}`,
//     { headers: { Authorization: `Bearer ${token}` } },
//   );
// };
