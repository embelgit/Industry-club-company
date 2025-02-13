// import {
//   getStateAdminDropDown,
//   getStateDropDown,
//   getCountryCodeDropDown,
//   getCityDropDown,
//   getCityAdminDropDown,
//   getGroupAdminDropDown,
//   getPortalUserDropDown,
// } from "../../service/AllDrowpdownAPI";

// export const getStateAdminDD = async (countryAdminId) => {
//   try {
//     const result = await getStateAdminDropDown(countryAdminId);
//     console.log("getStateAdminDropDown result :-", result);
//     if (result.data && Array.isArray(result.data)) {
//       const stateAdminListOptions = result.data.map((item) => ({
//         id: item.id,
//         label: item.username,
//         value: item.username,
//       }));
//       console.log("stateAdminListOptions :-", stateAdminListOptions);
//       return stateAdminListOptions;
//     }
//   } catch (error) {
//     console.log("Error fetching user list :-", error.message);
//   }
// };

// export const getStateDD = async (countryName) => {
//   try {
//     const result = await getStateDropDown(countryName);
//     console.log("getStateDropDown result :-", result);
//     if (result.data && Array.isArray(result.data)) {
//       const stateListOptions = result.data.map((item) => ({
//         label: item,
//         value: item,
//       }));
//       console.log("stateListOptions :-", stateListOptions);
//       return stateListOptions;
//     }
//   } catch (error) {
//     console.log("Error fetching user list :-", error.message);
//   }
// };

// export const getCountryCodeDD = async (countryName) => {
//   try {
//     const result = await getCountryCodeDropDown(countryName);
//     console.log("getCountryCodeDropDown result :-", result);
//     if (result.data && Array.isArray(result.data)) {
//       const CountryCodeListOptions = result.data.map((item) => ({
//         label: item,
//         value: item,
//       }));
//       console.log("CountryCodeListOptions :-", CountryCodeListOptions);
//       return CountryCodeListOptions;
//     }
//   } catch (error) {
//     console.log("Error fetching user list :-", error.message);
//   }
// };

// export const getCityAdminDD = async (stateAdminId) => {
//   try {
//     const result = await getCityAdminDropDown(stateAdminId);
//     console.log("getCityAdminDropDown result :-", result);
//     if (result.data && Array.isArray(result.data)) {
//       const cityAdminListOptions = result.data.map((item) => ({
//         id: item.id,
//         label: item.username,
//         value: item.username,
//       }));
//       console.log("cityAdminListOptions :-", cityAdminListOptions);
//       return cityAdminListOptions;
//     }
//   } catch (error) {
//     console.log("Error fetching user list :-", error.message);
//   }
// };

// export const getCityDD = async (stateName) => {
//   try {
//     const result = await getCityDropDown(stateName);
//     console.log("getCityDropDown result :-", result);
//     if (result.data && Array.isArray(result.data)) {
//       const cityListOptions = result.data.map((item) => ({
//         label: item,
//         value: item,
//       }));
//       console.log("cityListOptions :-", cityListOptions);
//       return cityListOptions;
//     }
//   } catch (error) {
//     console.log("Error fetching user list :-", error.message);
//   }
// };

// export const getGroupAdminDD = async (stateAdminId) => {
//   try {
//     const result = await getGroupAdminDropDown(stateAdminId);
//     console.log("getGroupAdminDropDown result :-", result);
//     if (result.data && Array.isArray(result.data)) {
//       const groupAdminListOptions = result.data.map((item) => ({
//         id: item.id,
//         label: item.username,
//         value: item.username,
//       }));
//       console.log("groupAdminListOptions :-", groupAdminListOptions);
//       return groupAdminListOptions;
//     }
//   } catch (error) {
//     console.log("Error fetching user list :-", error.message);
//   }
// };

// export const getPortalUserDD = async (groupAdminId) => {
//   try {
//     const result = await getPortalUserDropDown(groupAdminId);
//     console.log("getPortalUserDropDown result :-", result);
//     if (result.data && Array.isArray(result.data)) {
//       const portalUserListOptions = result.data.map((item) => ({
//         id: item.id,
//         label: item.username,
//         value: item.username,
//       }));
//       console.log("portalUserListOptions :-", portalUserListOptions);
//       return portalUserListOptions;
//     }
//   } catch (error) {
//     console.log("Error fetching user list :-", error.message);
//   }
// };
