import Axios from "../utils/axiosInstance";

export const searchProductPromotionDetailsPagination = async (
  role,
  pkUserId,
  pageNo,
  keyword,
) => {
  const token = sessionStorage.getItem("token");
  const params = new URLSearchParams({
    role,
    fkUserId: pkUserId,
    pageNo,
    keyword,
  }).toString();

  return await Axios.get(
    `productPromotion/v1/searchProductPromotionDetailsPagination?${params}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const searchCompanyBuyingSellingDetailsPagination = async (
  role,
  pkUserId,
  pageNo,
  keyword,
) => {
  const token = sessionStorage.getItem("token");
  const params = new URLSearchParams({
    role,
    fkUserId: pkUserId,
    pageNo,
    keyword,
  }).toString();

  return await Axios.get(
    `buyingSelling/v1/searchCompanyBuyingSellingDetailsPagination?${params}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const searchServiceDetailsPagination = async (
  role,
  pkUserId,
  pageNo,
  keyword,
) => {
  const token = sessionStorage.getItem("token");
  const params = new URLSearchParams({
    role,
    fkUserId: pkUserId,
    pageNo,
    keyword,
  }).toString();

  return await Axios.get(
    `company/v1/searchServiceDetailsPagination?${params}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const searchProductDetailsPagination = async (
    role,
    pkUserId,
    pageNo,
    keyword,
  ) => {
    const token = sessionStorage.getItem("token");
    const params = new URLSearchParams({
      role,
      fkUserId: pkUserId,
      pageNo,
      keyword,
    }).toString();
  
    return await Axios.get(
      `product/v1/searchProductDetailsPagination?${params}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };


  export const searchInfrastructureDetailsPagination = async (
    role,
    pkUserId,
    pageNo,
    keyword,
  ) => {
    const token = sessionStorage.getItem("token");
    const params = new URLSearchParams({
      role,
      fkUserId: pkUserId,
      pageNo,
      keyword,
    }).toString();
  
    return await Axios.get(
      `company/v1/searchInfrastructureDetailsPagination?${params}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  export const searchReferralDetailsPagination = async (
    role,
    pkUserId,
    pageNo,
    keyword,
  ) => {
    const token = sessionStorage.getItem("token");
    const params = new URLSearchParams({
      role,
      fkUserId: pkUserId,
      pageNo,
      keyword,
    }).toString();
  
    return await Axios.get(
      `referral/v1/searchReferralDetailsPagination?${params}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  export const searchCompanyNetworkConnectionPagination = async (
    role,
    pkUserId,
    pageNo,
    keyword,
  ) => {
    const token = sessionStorage.getItem("token");
    const params = new URLSearchParams({
      role,
      fkUserId: pkUserId,
      pageNo,
      keyword,
    }).toString();
  
    return await Axios.get(
      `network/v1/searchCompanyNetworkConnectionPagination?${params}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };
