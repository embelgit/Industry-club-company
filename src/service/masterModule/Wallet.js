import Axios from '../../utils/axiosInstance';

export const AddToWallet = async payload => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      '/industrial/wallet/v1/addToWallet',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error add Targeted Product Details:', error);
    throw error;
  }
};

export const getWalletCount = async companyId => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/wallet/v1/getCountWalletDetails?fkCompanyId=${companyId}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getWalletList = async (companyId, pageNo = 0, status) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `/industrial/wallet/v1/getWalletListDetailsPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&status=${status}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const getWalletAddedList = async (
  companyId,
  pageNo = 0,
  ServiceId,
  ProductId,
  type,
) => {
  let token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId found');
    return;
  }

  return Axios.get(
    `industrial/wallet/v1/getWalletAddedListPagination?fkCompanyId=${companyId}&pageNo=${pageNo}&fkServiceId=${ServiceId}&fkProductId=${ProductId}&type=${type}`,

    {headers: {Authorization: `Bearer ${token}`}},
  );
};
export const deleteWalletData = async (
  fkWalletId,
  username,
  fkProductId,
  fkVendorId,
  fkServiceId,
) => {
  let role = sessionStorage.getItem('role');
  let token = sessionStorage.getItem('token');
  return await Axios.delete(
    `industrial/wallet/v1/removeFromWalletDetails?fkWalletId=${fkWalletId}&fkProductId=${fkProductId}&fkVendorId=${fkVendorId}&fkServiceId=${fkServiceId}&username=${username}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
