import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {getStateList} from '../../../service/AllDrowpdownAPI';

const StateDropdown = ({setFieldValue, values, name, countryName}) => {
  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    const fetchStateOptions = async () => {
      if (!countryName || countryName.length === 0) {
        setStateOptions([]);
        return;
      }
      try {
        const stateData = await getStateList(countryName);
        if (Array.isArray(stateData)) {
          setStateOptions(stateData.map(data => ({label: data, value: data})));
        }
      } catch (error) {
        console.error('Error fetching state options:', error);
      }
    };

    fetchStateOptions();
  }, [countryName]);

  return (
    <Select
      isMulti
      name={name}
      options={stateOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={selectedOptions => {
        const states = selectedOptions?.map(option => option.value) || [];
        setFieldValue(name, states);
        setFieldValue('city', []); // Reset city when state changes
      }}
      value={stateOptions.filter(option =>
        values[name]?.includes(option.value),
      )}
    />
  );
};

export default StateDropdown;
