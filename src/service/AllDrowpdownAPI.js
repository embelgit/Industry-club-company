// import Axios from "../utils/axiosInstance";

// export const getCountryAdminDropDown = async () => {
//   return await Axios.get(
//     `/portalAdmin/v1/getCountryAdminDropdown`,
//   );
// };

// export const getCountryDropDown = async () => {
//   return await Axios.get(
//     `/location/v1/getCountryDropdown`,
//   );
// };

// export const getIndustryDropDown = async () => {
//   return await Axios.get(
//     `/product/v1/getDropdownListIndustry`,
//   );
// };

// export const getMaterialTypeDropDown = async () => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(
//     `/product/v1/getDropdownListMaterialType`, { headers: { Authorization: `Bearer ${token}` }, }
//   );
// };

// export const getCategoryDropDown = async () => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(
//     `/product/v1/getDropdownListCategory`, { headers: { Authorization: `Bearer ${token}` }, }
//   );
// };

// export const getSubCategoryDropDown = async () => {
//   let token = sessionStorage.getItem('token');
//   return await Axios.get(
//     `/product/v1/getDropdownListSubCategory`, { headers: { Authorization: `Bearer ${token}` }, }
//   );
// };

// export const getStateAdminDropDown = async (countryAdminId) => {
//   return await Axios.get(
//     `/portalAdmin/v1/getStateAdminDropdown?countryAdminId=${countryAdminId}`,
//   );
// };

// export const getStateDropDown = async (countryName) => {
//   return await Axios.get(
//     `/location/v1/getStateDropdown?countryName=${countryName}`,
//   );
// };

// export const getCountryCodeDropDown = async (countryName) => {
//   return await Axios.get(
//     `/location/v1/getCountryCodeDropdown?countryName=${countryName}`,
//   );
// };

// export const getCityAdminDropDown = async (stateAdminId) => {
//   return await Axios.get(
//     `/portalAdmin/v1/getCityAdminDropdown?stateAdminId=${stateAdminId}`,
//   );
// };

// export const getCityDropDown = async (stateName) => {
//   return await Axios.get(
//     `/location/v1/getCityDropdown?stateName=${stateName}`,
//   );
// };

// export const getGroupAdminDropDown = async (cityAdminId) => {
//   return await Axios.get(
//     `/portalAdmin/v1/getGroupAdminDropdown?cityAdminId=${cityAdminId}`,
//   );
// };

// export const getPortalUserDropDown = async (groupAdminId) => {
//   return await Axios.get(
//     `/portalAdmin/v1/getPortalUserDropdown?groupAdminId=${groupAdminId}`,
//   );
// };

import Axios from '../utils/axiosInstance';
export const getGSTList = async companyId => {
  let token = sessionStorage.getItem('token');
  if (!companyId) {
    console.error('No companyId found');
    return [];
  }

  try {
    const response = await Axios.get(
      `industrial/company/v1/getGstNumberDropdown?companyId=${companyId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    // Assuming response.data is the array of GST numbers
    return response.data || [];
  } catch (error) {
    console.error('Error fetching GST list:', error);
    return [];
  }
};

export const getIndustryTypeList = async () => {
  let token = sessionStorage.getItem('token');

  try {
    const response = await Axios.get(
      `industrial/product/v1/getIndustryListDropdown`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    // Assuming response.data is the array of GST numbers
    console.log('Industry', response);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching GST list:', error);
    return [];
  }
};

export const getMaterialTypeList = async () => {
  let token = sessionStorage.getItem('token');

  try {
    const response = await Axios.get(
      `industrial/product/v1/getMaterialListDropdown`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    // Assuming response.data is the array of GST numbers
    console.log('Industry', response);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching GST list:', error);
    return [];
  }
};

export const getProductNameList = async (companyId = '') => {
  let token = sessionStorage.getItem('token');
  try {
    const response = await Axios.get(
      `industrial/product/v1/getProductListDropdown?fkCompanyId=${companyId || ''}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    return response.data ? response.data : [];
  } catch (error) {
    console.error('Error fetching product list:', error);
    return [];
  }
};

export const getProductList = async companyId => {
  let token = sessionStorage.getItem('token');
  try {
    // Ensure the fkCompanyId is passed as an empty string if no value is needed
    const response = await Axios.get(
      `industrial/product/v1/getProductListDropdown?fkCompanyId=${companyId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );

    // Check if the response data exists and return it
    return response.data ? response.data : []; // Adjust based on response structure
  } catch (error) {
    console.error('Error fetching product list:', error);
    return []; // Return an empty array in case of error
  }
};

export const getServiceList = async companyId => {
  let token = sessionStorage.getItem('token');
  try {
    const response = await Axios.get(
      `industrial/company/v1/getServiceNameListDropdown?fkCompanyId=${companyId}`,

      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    // Check if the response data exists and return it
    return response.data ? response.data : []; // Adjust based on response structure
  } catch (error) {
    console.error('Error fetching Service list:', error);
    return [];
  }
};

// ___________________________Modal APIs__________________________//
export const postNewIndustryType = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }
    const response = await Axios.post(
      'industrial/product/v1/addIndustry',

      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Error posting certification details:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

export const postNewMaterialType = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }
    const response = await Axios.post(
      'industrial/product/v1/addMaterialType',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Error posting certification details:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};
export const postNewProductType = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }
    const response = await Axios.post(
      'industrial/product/v1/addMasterProductName',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Error posting Product details:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    throw error;
  }
};
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Location APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const getCountryList = async () => {
  let token = sessionStorage.getItem('token');

  try {
    const response = await Axios.get(
      `/industrial/location/v1/getCountryDropdown`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    // Assuming response.data is the array of GST numbers
    console.log('Country', response);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching GST list:', error);
    return [];
  }
};

export const getStateList = async countryName => {
  let token = sessionStorage.getItem('token');
  if (!countryName) {
    console.error('No countryName found');
    return [];
  }
  try {
    const response = await Axios.get(
      `industrial/location/v1/getStateDropdown?countryName=${countryName}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    // Assuming response.data is the array of GST numbers
    return response.data || [];
  } catch (error) {
    console.error('Error fetching GST list:', error);
    return [];
  }
};

export const getCityList = async stateName => {
  let token = sessionStorage.getItem('token');
  if (!stateName) {
    console.error('No countryName found');
    return [];
  }
  try {
    const response = await Axios.get(
      `industrial/location/v1/getCityDropdown?stateName=${stateName}`,

      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    // Assuming response.data is the array of GST numbers
    return response.data || [];
  } catch (error) {
    console.error('Error fetching GST list:', error);
    return [];
  }
};
