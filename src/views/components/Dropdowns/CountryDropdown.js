import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {getCountryList} from '../../../service/AllDrowpdownAPI';

const CountryDropdown = ({setFieldValue, values, name}) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountryOptions = async () => {
      setLoading(true); // Start loading state
      try {
        let countryData = await getCountryList(); // Fetch country list
        if (Array.isArray(countryData)) {
          setCountryOptions(
            countryData.map(data => ({label: data, value: data})),
          );
        } else {
          console.error(
            'Expected an array for country data, received:',
            countryData,
          );
        }
      } catch (error) {
        console.error('Error fetching country options:', error);
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchCountryOptions();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading countries...</p>
      ) : (
        <Select
          isMulti
          name={name}
          options={countryOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={selectedOptions => {
            const countries =
              selectedOptions?.map(option => option.value) || [];
            setFieldValue(name, countries);
            // Reset dependent fields (state and city) if country changes
            setFieldValue('state', []);
            setFieldValue('city', []);
          }}
          value={countryOptions.filter(option =>
            values[name]?.includes(option.value),
          )}
        />
      )}
    </>
  );
};

export default CountryDropdown;
