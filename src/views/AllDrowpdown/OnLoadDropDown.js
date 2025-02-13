// import {
//   getCountryAdminDropDown,
//   getCountryDropDown,
//   getIndustryDropDown,
//   getMaterialTypeDropDown,
//   getCategoryDropDown,
//   getSubCategoryDropDown,
// } from '../../service/AllDrowpdownAPI';

// export const getCountryAdminDD = async () => {
//   try {
//     const result = await getCountryAdminDropDown();
//     console.log('getCountryAdminDropDown result:', result);
//     if (result.data && Array.isArray(result.data)) {
//       const countryAdminListOptions = result.data.map(item => ({
//         id: item.id,
//         label: item.username,
//         value: item.username,
//       }));
//       console.log('countryAdminListOptions:', countryAdminListOptions);
//       return countryAdminListOptions;
//     }
//   } catch (error) {
//     console.log('Error fetching user list:', error.message);
//   }
// };

// export const getCountryDD = async () => {
//   try {
//     const result = await getCountryDropDown();
//     console.log('getCountryDropDown result:', result);
//     if (result.data && Array.isArray(result.data)) {
//       const countryListOptions = result.data.map(item => ({
//         label: item,
//         value: item,
//       }));
//       console.log('countryListOptions:', countryListOptions);
//       return countryListOptions;
//     }
//   } catch (error) {
//     console.log('Error fetching user list:', error.message);
//   }
// };

// export const getIndustryDD = async () => {
//   try {
//     const result = await getIndustryDropDown();
//     console.log('getIndustryDropDown result:', result);
//     if (result.data && Array.isArray(result.data)) {
//       const IndustryListOptions = result.data.map(item => ({
//         id: item.id,
//         label: item.industryName,
//         value: item.industryName,
//       }));
//       console.log('IndustryListOptions:', IndustryListOptions);
//       return IndustryListOptions;
//     }
//   } catch (error) {
//     console.log('Error fetching user list:', error.message);
//   }
// };

// export const getMaterialTypeDD = async () => {
//   try {
//     const result = await getMaterialTypeDropDown();
//     console.log('getMaterialTypeDropDown result:', result);
//     if (result.data && Array.isArray(result.data)) {
//       const MaterialTypeListOptions = result.data.map(item => ({
//         id: item.id,
//         label: item.materialType,
//         value: item.materialType,
//       }));
//       console.log('MaterialTypeListOptions:', MaterialTypeListOptions);
//       return MaterialTypeListOptions;
//     }
//   } catch (error) {
//     console.log('Error fetching user list:', error.message);
//   }
// };

// export const getCategoryDD = async () => {
//   try {
//     const result = await getCategoryDropDown();
//     console.log('getCategoryDropDown result:', result);
//     if (result.data && Array.isArray(result.data)) {
//       const CategoryListOptions = result.data.map(item => ({
//         id: item.id,
//         label: item.categoryName,
//         value: item.categoryName,
//       }));
//       console.log('CategoryListOptions:', CategoryListOptions);
//       return CategoryListOptions;
//     }
//   } catch (error) {
//     console.log('Error fetching user list:', error.message);
//   }
// };

// export const getSubCategoryDD = async () => {
//   try {
//     const result = await getSubCategoryDropDown();
//     console.log('getSubCategoryDropDown result:', result);
//     if (result.data && Array.isArray(result.data)) {
//       const SubCategoryListOptions = result.data.map(item => ({
//         id: item.id,
//         label: item.subCategorName,
//         value: item.subCategorName,
//       }));
//       console.log('SubCategoryListOptions:', SubCategoryListOptions);
//       return SubCategoryListOptions;
//     }
//   } catch (error) {
//     console.log('Error fetching user list:', error.message);
//   }
// };
