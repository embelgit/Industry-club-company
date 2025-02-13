import {CCardHeader, CContainer, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import * as Yup from 'yup';
import Select from 'react-select';
import {
  cilCreditCard,
  cilBasket,
  cilBriefcase,
  cilGlobeAlt,
  cilMap,
  cilIndustry,
  cilPlus,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {Link} from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import TargetClintLocationList from './TargetClintLocationList';
import {
  getCountryList,
  getIndustryTypeList,
  getProductNameList,
  getServiceList,
  getStateList,
} from '../../../service/AllDrowpdownAPI';
import {postTargetClintLocation} from '../../../service/RegistrationModule/TargetClintLocationAPIs';
import AddProductType from '../../components/ModalComponents/AddProductType';
import {
  fetchIndustryTypeOptions,
  fetchProductOptions,
  fetchServiceOptions,
} from '../../AllDropdown';

const TargetClientLocation = () => {
  const formikRef = useRef(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const [productOptions, setproductOptions] = useState([]);
  const [serviceNameOption, setServiceNameOption] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);

  const [serviceOptions, setServiceOptions] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [modalType, setModalType] = useState(null);
  const validationSchema = Yup.object().shape({
    industryType: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    productName: Yup.string().required('Required'),
    countryName: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    stateName: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
  });
  useEffect(() => {
    const fetchCountryOptions = async () => {
      const countryData = await getCountryList();
      if (countryData && Array.isArray(countryData)) {
        setCountryOptions(
          countryData.map(data => ({label: data, value: data})),
        );
      }
    };

    fetchCountryOptions();
  }, []);

  const fetchStateOptions = async selectedCountry => {
    if (!selectedCountry) return;

    const stateData = await getStateList(selectedCountry);
    if (stateData && Array.isArray(stateData)) {
      setStateOptions(stateData.map(data => ({label: data, value: data})));
    } else {
      setStateOptions([]);
    }
  };

  const getIndustryTypeList = async () => {
    const result = await fetchIndustryTypeOptions();
    setindustryTypeOptions(result || []);
  };
  const getProductList = async () => {
    const result = await fetchProductOptions();
    setproductOptions(result || []);
  };
  const getServiceList = async () => {
    const result = await fetchServiceOptions();
    setServiceOptions(result || []);
  };
  useEffect(() => {
    getIndustryTypeList();
    getProductList();
    getServiceList();
  }, []);
  const handleNext = () => {
    setProgress(prev => (prev + 10 >= 100 ? 100 : prev + 10));
  };

  const handleOpenModal = type => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSubmit = async (values, actions) => {
    const companyId = sessionStorage.getItem('fkCompanyId');

    if (!companyId) {
      console.error('Company ID not found in session storage');
      return;
    }

    const postData = {
      _id: companyId,
      percentage: '89',
      targetedClient: [
        {
          productName: values.type === 'Product' ? [values.productName] : [],
          serviceName: values.type === 'Service' ? [values.productName] : [],
          countryName: values.countryName,
          stateName: values.stateName,
          industryType: values.industryType,
        },
      ],
    };

    try {
      console.log('Submitting postData:', JSON.stringify(postData, null, 2));

      const result = await postTargetClintLocation(postData);
      console.log('Submission result: ', result);
      if (result.status === 200) {
        swal({
          title: 'Great',
          text: result.data,
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      console.error(
        'Error in adding clint Location details:',
        error?.response || error,
      );

      if (error?.response?.status === 409) {
        const errorMessage = error?.response?.data || 'Conflict occurred.';
        swal({
          title: 'Warning',
          text: errorMessage,
          icon: 'warning',
          timer: 2000,
          buttons: false,
        });
      } else {
        swal({
          title: 'Error',
          text: 'Something went wrong!',
          icon: 'error',
          timer: 2000,
          buttons: false,
        });
      }
    }
  };

  const handleListClick = () => {
    setShowTable(prev => !prev); // Toggle the visibility of the submitted data table
  };

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="mb-4">
          <strong>Target Client Location</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              type: 'Product',
              productName: '',
              countryName: [],
              stateName: [],
              industryType: [],
            }}
            onSubmit={handleSubmit}>
            {formik => (
              <Form>
                {/* Radio Buttons for Type Selection */}
                <CRow
                  className="d-flex justify-content-center align-items-center mb-5"
                  style={{height: '100vh'}}>
                  <CCol md={3} className="text-center">
                    <label className="custom-checkbox">
                      <Field
                        type="radio"
                        name="type"
                        value="Product" // Updated value
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>
                      <span
                        className="label-text"
                        style={{fontSize: '16px', fontWeight: 'bold'}}>
                        Product Details
                      </span>
                    </label>
                  </CCol>
                  <CCol md={3} className="text-center">
                    <label className="custom-checkbox">
                      <Field
                        type="radio"
                        name="type"
                        value="Service" // Updated value
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>
                      <span
                        className="label-text"
                        style={{fontSize: '16px', fontWeight: 'bold'}}>
                        Service Details
                      </span>
                    </label>
                  </CCol>
                </CRow>

                {formik.values.type && (
                  <>
                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon
                              icon={
                                formik.values.type === 'Product'
                                  ? cilBasket
                                  : cilBriefcase
                              }
                              size="lg"
                            />
                          </CCol>

                          <CCol md={3} className="pl-1">
                            <label htmlFor="productName" className="form-label">
                              {formik.values.type === 'Product'
                                ? 'Product Name'
                                : 'Service Name'}
                            </label>
                          </CCol>

                          <CCol md={7}>
                            <Field name="productName">
                              {({field, form}) => (
                                <Select
                                  id="productName"
                                  options={
                                    formik.values.type === 'Product'
                                      ? productOptions
                                      : serviceNameOption
                                  }
                                  className="basic-single-select"
                                  classNamePrefix="select"
                                  placeholder={`Select ${formik.values.type === 'Service' ? 'Service Name' : 'Product Name'}`}
                                  onChange={selectedOption =>
                                    form.setFieldValue(
                                      field.name,
                                      selectedOption
                                        ? selectedOption.value
                                        : '',
                                    )
                                  }
                                  value={
                                    field.value
                                      ? (formik.values.type === 'Product'
                                          ? productOptions
                                          : serviceNameOption
                                        ).find(
                                          option =>
                                            option.value === field.value,
                                        )
                                      : null
                                  }
                                  isClearable
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="productName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>

                          <CCol md={1}>
                            <button
                              type="button"
                              className="btn btn-light btn-sm"
                              onClick={() => handleOpenModal('product')}>
                              <CIcon icon={cilPlus} size="lg" />
                            </button>
                          </CCol>
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilIndustry} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label
                              htmlFor="industryType"
                              className="form-label">
                              Industry Type
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <CreatableSelect
                              isMulti
                              name="industryType"
                              options={industryTypeOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={selected =>
                                formik.setFieldValue(
                                  'industryType',
                                  selected
                                    ? selected.map(option => option.value)
                                    : [],
                                )
                              }
                              value={industryTypeOptions.filter(
                                option =>
                                  formik.values.industryType.includes(
                                    option.value,
                                  ), // Corrected usage
                              )}
                              onCreateOption={inputValue => {
                                const newOption = {
                                  label: inputValue,
                                  value: inputValue,
                                };
                                setindustryTypeOptions(prevOptions => [
                                  ...prevOptions,
                                  newOption,
                                ]);
                                formik.setFieldValue('industryType', [
                                  ...formik.values.industryType, // Corrected usage
                                  inputValue,
                                ]);
                              }}
                            />
                            <ErrorMessage
                              name="industryType"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                    {modalType === 'product' && (
                      <AddProductType
                        isOpen={modalType === 'product'}
                        onClose={handleCloseModal}
                        productTypeOptions={productTypeOptions}
                        setProductTypeOptions={setProductTypeOptions}
                      />
                    )}

                    {/* 
                {formik.values.type && (
                  <>
                    <CRow className="align-items-center mb-3">
                     
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon
                              icon={
                                values.type === 'Product'
                                  ? cilBasket
                                  : cilBriefcase
                              }
                              size="lg"
                            />
                          </CCol>

                          <CCol md={3} className="pl-1">
                            <label htmlFor="productName" className="form-label">
                              {values.type === 'Product'
                                ? 'Product Name'
                                : 'Service Name'}
                            </label>
                          </CCol>

                          <CCol md={6}>
                            <Field name="productName">
                              {({field, form}) => (
                                <Select
                                  id="productName"
                                  options={
                                    values.type === 'Product'
                                      ? productOptions
                                      : serviceNameOption
                                  }
                                  className="basic-single-select"
                                  classNamePrefix="select"
                                  placeholder={`Select ${values.type === 'Service' ? 'Service Name' : 'Product Name'}`}
                                  onChange={selectedOption =>
                                    form.setFieldValue(
                                      field.name,
                                      selectedOption
                                        ? selectedOption.value
                                        : '',
                                    )
                                  }
                                  value={
                                    field.value
                                      ? (values.type === 'Product'
                                          ? productOptions
                                          : serviceNameOption
                                        ).find(
                                          option =>
                                            option.value === field.value,
                                        )
                                      : null
                                  }
                                  isClearable
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="productName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>

                          <CCol md={2} className="d-flex justify-content-start">
                            <button
                              type="button"
                              className="btn btn-light btn-sm"
                              onClick={() => handleOpenModal('product')}>
                              <CIcon icon={cilPlus} size="lg" />
                            </button>
                          </CCol>
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilIndustry} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label
                              htmlFor="industryType"
                              className="form-label">
                              Industry Type
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <CreatableSelect
                              isMulti
                              name="industryType"
                              options={industryTypeOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={selected =>
                                formik.setFieldValue(
                                  'industryType',
                                  selected
                                    ? selected.map(option => option.value)
                                    : [],
                                )
                              }
                              value={industryTypeOptions.filter(
                                option =>
                                  formik.values.industryType.includes(
                                    option.value,
                                  ), // Use formik.values here
                              )}
                              onCreateOption={inputValue => {
                                const newOption = {
                                  label: inputValue,
                                  value: inputValue,
                                };
                                setindustryTypeOptions(prevOptions => [
                                  ...prevOptions,
                                  newOption,
                                ]);
                                formik.setFieldValue('industryType', [
                                  ...formik.values.industryType, // Use formik.values here
                                  inputValue,
                                ]);
                              }}
                            />
                            <ErrorMessage
                              name="industryType"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                    {modalType === 'product' && (
                      <AddProductType
                        isOpen={modalType === 'product'}
                        onClose={handleCloseModal}
                        productTypeOptions={productTypeOptions}
                        setProductTypeOptions={setProductTypeOptions}
                      />
                    )} */}

                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilGlobeAlt} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="countryName" className="form-label">
                              Country Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Select
                              isMulti
                              name="countryName"
                              options={countryOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={selectedOptions => {
                                const countries = selectedOptions
                                  ? selectedOptions.map(option => option.value)
                                  : [];
                                formik.setFieldValue('countryName', countries); // Use formik.setFieldValue
                                formik.setFieldValue('stateName', []); // Reset states
                                fetchStateOptions(countries); // Fetch states for selected countries
                              }}
                              value={countryOptions.filter(
                                option =>
                                  formik.values.countryName.includes(
                                    option.value,
                                  ), // Use formik.values
                              )}
                            />
                            <ErrorMessage
                              name="countryName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilMap} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="stateName" className="form-label">
                              State Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Select
                              isMulti
                              name="stateName"
                              options={stateOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={selectedOptions => {
                                const states = selectedOptions
                                  ? selectedOptions.map(option => option.value)
                                  : [];
                                formik.setFieldValue('stateName', states); // Use formik.setFieldValue
                              }}
                              value={stateOptions.filter(
                                option =>
                                  formik.values.stateName.includes(
                                    option.value,
                                  ), // Use formik.values
                              )}
                            />
                            <ErrorMessage
                              name="stateName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                  </>
                )}

                <div className="col-md-4 col-sm-6 mb-3">
                  <button
                    type="submit"
                    className="btn btn-success custom-btn shadow">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary custom-btn shadow mx-2"
                    onClick={handleListClick}>
                    List
                  </button>

                  <Link to="/targeted-vendor">
                    <button className="btn btn-secondary custom-btn shadow">
                      Skip
                    </button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {showTable && <TargetClintLocationList />}
    </>
  );
};

export default TargetClientLocation;
