// import React, {useEffect, useState} from 'react';
// import Select from 'react-select';

// const CountryDropdown = ({setFieldValue, values, name}) => {
//   const [countryOptions, setCountryOptions] = useState([]);

//   useEffect(() => {
//     const fetchCountryOptions = async () => {
//       try {
//         // const countryData = await getCountryList();
//         if (Array.isArray(countryData)) {
//           setCountryOptions(
//             countryData.map(data => ({label: data, value: data})),
//           );
//         }
//       } catch (error) {
//         console.error('Error fetching country options:', error);
//       }
//     };

//     fetchCountryOptions();
//   }, []);

//   return (
//     <Select
//       isMulti
//       name={name}
//       options={countryOptions}
//       className="basic-multi-select"
//       classNamePrefix="select"
//       onChange={selectedOptions => {
//         const countries = selectedOptions?.map(option => option.value) || [];
//         setFieldValue(name, countries);
//         // Reset dependent fields (state and city) if country changes
//         setFieldValue('state', []);
//         setFieldValue('city', []);
//       }}
//       value={countryOptions.filter(option =>
//         values[name]?.includes(option.value),
//       )}
//     />
//   );
// };

// export default CountryDropdown;
