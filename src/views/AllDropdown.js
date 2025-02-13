import {
  getCountryList,
  getIndustryTypeList,
  getProductNameList,
  getServiceList,
  getStateList,
} from '../service/AllDrowpdownAPI';

export const fetchCountryOptions = async () => {
  try {
    const result = await getCountryList();
    console.log('Get country dropdown result:', result);
    if (result && Array.isArray(result)) {
      return result.map(data => ({
        label: data,
        value: data,
      }));
    }
  } catch (error) {
    console.error('Error fetching country dropdown list', error);
  }
  return [];
};

export const fetchStateOptions = async selectedCountries => {
  try {
    if (!selectedCountries || selectedCountries.length === 0) return [];

    // Fetch states for each selected country
    const statePromises = selectedCountries.map(country =>
      getStateList(country),
    );
    const stateResults = await Promise.all(statePromises);

    const allStates = stateResults.flat(); // Flatten the result of all state lists

    if (allStates && Array.isArray(allStates)) {
      return allStates.map(data => ({
        label: data,
        value: data,
      }));
    }
  } catch (error) {
    console.error('Error fetching state dropdown list', error);
  }
  return [];
};

export const fetchIndustryTypeOptions = async () => {
  const industryData = await getIndustryTypeList();
  return industryData && Array.isArray(industryData)
    ? industryData.map(data => ({label: data, value: data}))
    : [];
};

export const fetchProductOptions = async () => {
  const companyId = sessionStorage.getItem('_id');
  if (!companyId) return [];
  const productData = await getProductNameList(companyId);
  return productData && Array.isArray(productData)
    ? productData.map(data => ({label: data, value: data}))
    : [];
};

export const fetchServiceOptions = async () => {
  const companyId = sessionStorage.getItem('_id');
  if (!companyId) return [];
  const serviceData = await getServiceList(companyId);
  return serviceData && Array.isArray(serviceData)
    ? serviceData.map(data => ({label: data, value: data}))
    : [];
};
