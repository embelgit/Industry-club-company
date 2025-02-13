import Axios from '../utils/axiosInstance';

export const login = payload => {
  return Axios.post(`/industrial/company/v1/companyUserLogin`, payload);
};

export const signUp = async payload => {
  return await Axios.post(`industrial/company/v1/companyUserSignUp`, payload);
};

export const generateOTP = async (fkDeptId, countryCode, mobileNo, email) => {
  return await Axios.post(
    `industrial/company/v1/generateOtp?fkDeptId=${fkDeptId}&countryCode=${countryCode}&mobileNo=${mobileNo}&email=${email}`,
  );
};

export const verifyOtp = async (
  mobileNo,
  otp,
  email,
  fkDeptId,
  countryCode,
) => {
  return await Axios.post(
    `industrial/company/v1/verifyOtp?mobileNo=${mobileNo}&otp=${otp}&email=${email}&fkDeptId=${fkDeptId}&countryCode=${countryCode}`,
  );
};
export const validateOTP = async (type, email, phoneNo, otp, fkUserId) => {
  return await Axios.post(
    `/portalAdmin/v1/validateOtp?type=${type}&email=${email}&phoneNo=${phoneNo}&otp=${otp}&fkUserId=${fkUserId}`,
  );
};

export const forgotPassword = async (email, password) => {
  return await Axios.post(
    `/portalAdmin/v1/forgotPassword?email=${email}&newPassword=${password}`,
  );
};

export const resetPassword = async (oldPass, newPass) => {
  let email = sessionStorage.getItem('email');
  let token = sessionStorage.getItem('token');
  return await Axios.post(
    `/portalAdmin/v1/resetPassword?email=${email}&oldPassword=${oldPass}&newPassword=${newPass}`,
    {},
    {headers: {Authorization: `Bearer ${token}`}},
  );
};

export const logOut = async () => {
  let token = sessionStorage.getItem('token');
  let userName = sessionStorage.getItem('userName');
  return await Axios.get(
    `/portalAdmin/v1/logOut?username=${userName}&token=${token}`,
    {headers: {Authorization: `Bearer ${token}`}},
  );
};
