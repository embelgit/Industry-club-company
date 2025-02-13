// import React, {useEffect, useState} from 'react';
// import Select from 'react-select';

// const CityDropdown = ({setFieldValue, values, name, stateName}) => {
//   const [cityOptions, setCityOptions] = useState([]);

//   useEffect(() => {
//     const fetchCityOptions = async () => {
//       if (!stateName || stateName.length === 0) {
//         setCityOptions([]);
//         return;
//       }
//       try {
//         // const cityData = await getCityList(stateName);
//         if (Array.isArray(cityData)) {
//           setCityOptions(cityData.map(data => ({label: data, value: data})));
//         }
//       } catch (error) {
//         console.error('Error fetching city options:', error);
//       }
//     };

//     fetchCityOptions();
//   }, [stateName]);

//   return (
//     <Select
//       isMulti
//       name={name}
//       options={cityOptions}
//       className="basic-multi-select"
//       classNamePrefix="select"
//       onChange={selectedOptions => {
//         const cities = selectedOptions?.map(option => option.value) || [];
//         setFieldValue(name, cities);
//       }}
//       value={cityOptions.filter(option => values[name]?.includes(option.value))}
//     />
//   );
// };

// export default CityDropdown;
