import Axios from '../../utils/axiosInstance';

// Function to handle the post request
export const postTurnoverDetails = async payload => {
  try {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found in session storage');
    }

    const response = await Axios.post(
      'industrial/company/v1/addCompanyDetails',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Error posting Turnover Details:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

export const getTurnoverDetails = async companyId => {
  const token = sessionStorage.getItem('token');

  if (!companyId) {
    console.error('No companyId provided');
    return null;
  }

  if (!token) {
    console.error('No token found in sessionStorage');
    return null;
  }

  try {
    const response = await Axios.get(
      `industrial/company/v1/getTurnOverDetails?companyId=${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Set Content-Type to JSON
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching turnover details:', error);
    return null; // Return null in case of an error
  }
};

export const EditTurnoverDetails = async payload => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    console.error('No token found in sessionStorage');
    return null;
  }

  try {
    const response = await Axios.put(
      `industrial/company/v1/updateCompanyDetails`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure Content-Type is set correctly
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating turnover details:', error);
    return null; // Return null in case of an error
  }
};
