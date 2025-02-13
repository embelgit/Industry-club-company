import React, {useEffect, useState} from 'react';
import {CCol, CRow} from '@coreui/react';
import {getSearchProductServiceListFilter} from '../../../service/masterModule/SearchApi';
import {
  getCityList,
  getCountryList,
  getIndustryTypeList,
  getMaterialTypeList,
  getProductList,
  getStateList,
} from '../../../service/AllDrowpdownAPI';

function FilterCheckbox({onSearchResult}) {
  const [loader, setLoader] = useState(false);
  const [selectedIndustryValues, setSelectedIndustryValues] = useState([]);
  const [selectedMaterialValues, setSelectedMaterialValues] = useState([]);
  const [selectedProductValues, setSelectedProductValues] = useState([]);
  const [selectedCountryValues, setSelectedCountryValues] = useState([]);
  const [selectedStateValues, setSelectedStateValues] = useState([]);
  const [selectedCityValues, setSelectedCityValues] = useState([]);
  const [materialOption, setMaterialOption] = useState([]);
  const [industryOption, setIndustryOption] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [showAllIndustry, setShowAllIndustry] = useState(false);
  const [showAllMaterial, setShowAllMaterial] = useState(false);
  const [showAllProduct, setShowAllProduct] = useState(false);
  const [showAllCountry, setShowAllCountry] = useState(false);
  const [showAllState, setShowAllState] = useState(false);
  const [showAllCity, setShowAllCity] = useState(false);

  const fetchSearchProductServiceListFilter = async (
    companyId,
    industryType,
    materialType,
    Product,
    serviceName = '',
    countryName,
    stateName,
    cityName,
    pageNo = 0,
  ) => {
    try {
      setLoader(true);
      const result = await getSearchProductServiceListFilter(
        companyId,
        industryType,
        materialType,
        Product,
        (serviceName = ''),
        countryName,
        stateName,
        cityName,
        pageNo,
      );

      console.log('fetching Search Product Service ListFilter data:', result);

      // Passing the result to the parent via the onSearchResult prop
      if (onSearchResult) {
        onSearchResult(result);
      }
    } finally {
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');

    if (companyId) {
      fetchSearchProductServiceListFilter(
        companyId,
        selectedIndustryValues,
        selectedMaterialValues,
        selectedProductValues,
        null,
        selectedCountryValues,
        selectedStateValues,
        selectedCityValues,
      );
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, [
    selectedIndustryValues,
    selectedMaterialValues,
    selectedProductValues,
    selectedCountryValues,
    selectedStateValues,
    selectedCityValues,
  ]);

  // Fetching Material Options
  useEffect(() => {
    const fetchMaterialTypeOptions = async () => {
      try {
        const materialData = await getMaterialTypeList();
        if (Array.isArray(materialData)) {
          setMaterialOption(
            materialData.map(data => ({
              label: data,
              value: data,
            })),
          );
        }
      } catch (error) {
        console.error('Failed to fetch material options', error);
      }
    };

    fetchMaterialTypeOptions();
  }, []);

  // Fetching Industry Options
  useEffect(() => {
    const fetchIndustryTypeOptions = async () => {
      try {
        const industryData = await getIndustryTypeList();
        if (Array.isArray(industryData)) {
          setIndustryOption(
            industryData.map(data => ({
              label: data,
              value: data,
            })),
          );
        }
      } catch (error) {
        console.error('Failed to fetch industry options', error);
      }
    };

    fetchIndustryTypeOptions();
  }, []);

  // Fetching Product Options
  useEffect(() => {
    const fetchProductNameOptions = async () => {
      const companyId = '';
      try {
        const productData = await getProductList(companyId);
        if (Array.isArray(productData)) {
          setProductOption(
            productData
              .filter(product => product.trim() !== '')
              .map(product => ({
                label: product,
                value: product,
              })),
          );
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductNameOptions();
  }, []);

  // Fetching Country Options
  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const countryData = await getCountryList();
        if (Array.isArray(countryData)) {
          setCountryOptions(
            countryData.map(data => ({label: data, value: data})),
          );
        }
      } catch (error) {
        console.error('Error fetching country options:', error);
      }
    };

    fetchCountryOptions();
  }, []);

  // Fetching State Options
  useEffect(() => {
    const fetchStateOptions = async () => {
      if (selectedCountryValues.length === 0) {
        setStateOptions([]);
        return;
      }
      try {
        const stateData = await getStateList(selectedCountryValues[0]);
        if (Array.isArray(stateData)) {
          setStateOptions(stateData.map(data => ({label: data, value: data})));
        }
      } catch (error) {
        console.error('Error fetching state options:', error);
      }
    };

    fetchStateOptions();
  }, [selectedCountryValues]);

  // Fetching City Options for Multiple States
  useEffect(() => {
    const fetchCityOptions = async () => {
      if (selectedStateValues.length === 0) {
        setCityOptions([]);
        return;
      }
      try {
        const cityPromises = selectedStateValues.map(state =>
          getCityList(state),
        );
        const cityDataArray = await Promise.all(cityPromises);
        const allCities = Array.from(new Set(cityDataArray.flat()));
        setCityOptions(allCities.map(city => ({label: city, value: city})));
      } catch (error) {
        console.error('Error fetching city options:', error);
      }
    };

    fetchCityOptions();
  }, [selectedStateValues]);

  // Remove invalid cities when city options update
  useEffect(() => {
    setSelectedCityValues(prevSelected =>
      prevSelected.filter(city =>
        cityOptions.some(option => option.value === city),
      ),
    );
  }, [cityOptions]);
  // Handle Changes for Filters
  const handleSelectChange = (e, type) => {
    const {value, checked} = e.target;
    if (checked) {
      if (type === 'industry') {
        setSelectedIndustryValues(prev => [...prev, value]);
      } else if (type === 'material') {
        setSelectedMaterialValues(prev => [...prev, value]);
      } else if (type === 'product') {
        setSelectedProductValues(prev => [...prev, value]);
      } else if (type === 'country') {
        setSelectedCountryValues(prev => [...prev, value]);
      } else if (type === 'state') {
        setSelectedStateValues(prev => [...prev, value]);
      } else if (type === 'city') {
        setSelectedCityValues(prev => [...prev, value]);
      }
    } else {
      if (type === 'industry') {
        setSelectedIndustryValues(prev => prev.filter(val => val !== value));
      } else if (type === 'material') {
        setSelectedMaterialValues(prev => prev.filter(val => val !== value));
      } else if (type === 'product') {
        setSelectedProductValues(prev => prev.filter(val => val !== value));
      } else if (type === 'country') {
        setSelectedCountryValues(prev => prev.filter(val => val !== value));
      } else if (type === 'state') {
        setSelectedStateValues(prev => prev.filter(val => val !== value));
      } else if (type === 'city') {
        setSelectedCityValues(prev => prev.filter(val => val !== value));
      }
    }
  };

  // Toggle Show All for each category
  const toggleShowAll = type => {
    if (type === 'industry') {
      setShowAllIndustry(prevState => !prevState);
    } else if (type === 'material') {
      setShowAllMaterial(prevState => !prevState);
    } else if (type === 'product') {
      setShowAllProduct(prevState => !prevState);
    } else if (type === 'country') {
      setShowAllCountry(prevState => !prevState);
    } else if (type === 'state') {
      setShowAllState(prevState => !prevState);
    } else if (type === 'city') {
      setShowAllCity(prevState => !prevState);
    }
  };
  return (
    <div className="filter-container border rounded shadow-sm p-3 bg-white">
      <CRow className="align-items-start gap-3">
        <h6 className="text-primary fw-bold mb-3">Search by:</h6>

        {/* Div to show selected values */}
        <CCol md={12} className="mb-1">
          <div className=" mb-3">
            <h6>Selected Filters:</h6>
            <div>
              {/* Display both selected values for all filters */}
              {[
                ...selectedIndustryValues,
                ...selectedMaterialValues,
                ...selectedProductValues,
                ...selectedCountryValues,
                ...selectedStateValues,
                ...selectedCityValues,
              ].length > 0 ? (
                [
                  ...selectedIndustryValues,
                  ...selectedMaterialValues,
                  ...selectedProductValues,
                  ...selectedCountryValues,
                  ...selectedStateValues,
                  ...selectedCityValues,
                ].map((value, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      margin: '1px',
                      padding: '3px 5px',
                      // backgroundColor: '#f1f3f5',
                      borderRadius: '5px',
                      border: '0.2px solid #000',
                      color: '#000',
                    }}>
                    {value}
                  </span>
                ))
              ) : (
                <span>No options selected</span>
              )}
            </div>
          </div>
        </CCol>

        {/* Render each filter group */}
        {[
          {
            label: 'Industry Type',
            options: industryOption,
            selected: selectedIndustryValues,
            showAll: showAllIndustry,
            toggle: toggleShowAll,
            type: 'industry',
          },
          {
            label: 'Material Type',
            options: materialOption,
            selected: selectedMaterialValues,
            showAll: showAllMaterial,
            toggle: toggleShowAll,
            type: 'material',
          },
          {
            label: 'Product',
            options: productOption, // Use the correct productOption here
            selected: selectedProductValues,
            showAll: showAllProduct,
            toggle: toggleShowAll,
            type: 'product',
          },
          {
            label: 'Country',
            options: countryOptions,
            selected: selectedCountryValues,
            showAll: showAllCountry,
            toggle: toggleShowAll,
            type: 'country',
          },
          {
            label: 'State',
            options: stateOptions,
            selected: selectedStateValues,
            showAll: showAllState,
            toggle: toggleShowAll,
            type: 'state',
          },
          {
            label: 'City',
            options: cityOptions,
            selected: selectedCityValues,
            showAll: showAllCity,
            toggle: toggleShowAll,
            type: 'city',
          },
        ].map(({label, options, selected, showAll, toggle, type}, index) => (
          <CCol md={12} className="mb-3" key={index}>
            <h6>{label}</h6>
            <div className="filter-options">
              {options.slice(0, 3).map((option, idx) => (
                <div key={idx} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={option.value}
                    id={`${type}-checkbox-${idx}`}
                    onChange={e => handleSelectChange(e, type)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${type}-checkbox-${idx}`}>
                    {option.label}
                  </label>
                </div>
              ))}
              {showAll &&
                options.slice(3).map((option, idx) => (
                  <div key={idx + 3} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={option.value}
                      id={`${type}-checkbox-${idx + 3}`}
                      onChange={e => handleSelectChange(e, type)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`${type}-checkbox-${idx + 3}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              <div
                className="see-more"
                onClick={() => toggle(type)}
                style={{cursor: 'pointer', color: '#007bff'}}>
                {showAll ? 'See Less' : 'See More'}
              </div>
            </div>
          </CCol>
        ))}
      </CRow>
    </div>
  );
}

export default FilterCheckbox;
