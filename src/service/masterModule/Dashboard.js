import Axios from '../../utils/axiosInstance';

export const getDashboardCount = async fkCompanyId => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `/industrial/dashBoardCount/v1/getCountOnDashBoard?fkCompanyId=${fkCompanyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Massages Apis >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const getCompanyNameForChatting = async (fkCompanyId, fkVendorId) => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/chat/v1/getCompanyNameForChatting?fkCompanyId=${fkCompanyId}&fkVendorId=${fkVendorId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

// Send the message to the API
export const sendChatDetails = async chatSms => {
  let token = sessionStorage.getItem('token');

  try {
    await Axios.post(
      'industrial/chat/v1/sendChatDetails',
      {chatSms},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the Authorization header
        },
      },
    );
  } catch (error) {
    console.error('Error sending chat details:', error);
    throw error; // Rethrow error to be caught by sendSms
  }
};

export const getAllChatDetailsWithCompanyName = async fkCompanyId => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/chat/v1/getAllChatDetailsWithCompanyName?fkCompanyId=${fkCompanyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

export const getOldChatDetails = async pkChatId => {
  let token = sessionStorage.getItem('token');
  return await Axios.get(
    `industrial/chat/v1/getOldChatDetails?fkChatId=${pkChatId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

export const postChatStatus = async (
  pkChatId,

  chatStatus,
  status = '',
  index = '',
) => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await Axios.post(
      `/industrial/chat/v1/updateChatStatus?pkChatId=${encodeURIComponent(
        pkChatId,
      )}&chatStatus=${encodeURIComponent(
        chatStatus,
      )}&status=${status}&index=${index}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error updating chat status:', error);
    throw error;
  }
};
