import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import swal from 'sweetalert';
import {CCardHeader, CRow, CCol} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBasket,
  cilBriefcase,
  cilGlobeAlt,
  cilMap,
  cilIndustry,
  cilPlus,
} from '@coreui/icons';
import CreatableSelect from 'react-select/creatable';
import {UpdateImport_Export} from '../../../service/RegistrationModule/ImportExportDetail';
import AddIndustryType from '../../components/ModalComponents/AddIndustryType';
import AddProductType from '../../components/ModalComponents/AddProductType';
import {
  fetchCountryOptions,
  fetchIndustryTypeOptions,
  fetchProductOptions,
  fetchServiceOptions,
  fetchStateOptions,
} from '../../AllDropdown';
import {getCountryList} from '../../../service/AllDrowpdownAPI';

const UpdateImportExportDetail = () => {
  const {state} = useLocation();
  const {index} = useParams();
  const importExportDetails = state?.importExportDetails || null;
  const initialValues = {
    type: 'Product',
    productName: importExportDetails?.productName || [],
    serviceName: importExportDetails?.serviceName || [],
    countryName: importExportDetails?.countryName || [],
    stateName: importExportDetails?.stateName || [],
    industryType: importExportDetails?.industryType || [],
  };

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [industryTypeOptions, setIndustryTypeOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    industryType: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
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
    setIndustryTypeOptions(result || []);
  };
  const getProductList = async () => {
    const result = await fetchProductOptions();
    setProductOptions(result || []);
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

  const handleSubmit = async (values, actions) => {
    const companyId = sessionStorage.getItem('_id');
    if (!companyId) return;

    const postData = {
      _id: companyId,
      index: index,
      importExportDetails: [
        {
          productName:
            values.type === 'Product'
              ? values.productName?.map(option => option.value) || []
              : [],
          serviceName:
            values.type === 'Service'
              ? values.serviceName?.map(option => option.value) || []
              : [],
          countryName: values.countryName?.map(option => option.value) || [],
          stateName: values.stateName?.map(option => option.value) || [],
          industryType: values.industryType?.map(option => option.value) || [],
        },
      ],
    };

    console.log('postData of Update Import Export ', postData);

    try {
      const result = await UpdateImport_Export(postData);
      if (result.status === 200) {
        swal({
          title: 'Success',
          text: result.data,
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      swal({
        title: 'Error',
        text: error?.response?.data || 'Something went wrong!',
        icon: 'error',
        timer: 2000,
        buttons: false,
      });
    } finally {
      actions.resetForm();
    }
  };

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="mb-3">
          <strong>Import and Export</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            enableReinitialize
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
                        value="Product"
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
                        value="Service"
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

                          <CCol md={8} className="d-flex align-items-center">
                            {formik.values.type === 'Product' ? (
                              <Field name="productName">
                                {({field, form}) => (
                                  <CreatableSelect
                                    isMulti
                                    name={field.name}
                                    value={field.value}
                                    options={productOptions}
                                    className="basic-multi-select flex-grow-1"
                                    classNamePrefix="select"
                                    onChange={selected => {
                                      form.setFieldValue(
                                        field.name,
                                        selected ? selected : [],
                                      );
                                    }}
                                    onCreateOption={inputValue => {
                                      const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                      };
                                      setProductOptions(prevOptions => [
                                        ...prevOptions,
                                        newOption,
                                      ]);
                                      form.setFieldValue(field.name, [
                                        ...field.value,
                                        newOption,
                                      ]);
                                    }}
                                    styles={{
                                      container: provided => ({
                                        ...provided,
                                        width: '100%',
                                      }),
                                    }}
                                  />
                                )}
                              </Field>
                            ) : (
                              <Field name="serviceName">
                                {({field, form}) => (
                                  <CreatableSelect
                                    isMulti
                                    name={field.name}
                                    value={field.value}
                                    options={serviceOptions}
                                    className="basic-multi-select flex-grow-1"
                                    classNamePrefix="select"
                                    onChange={selected => {
                                      form.setFieldValue(
                                        field.name,
                                        selected ? selected : [],
                                      );
                                    }}
                                    onCreateOption={inputValue => {
                                      const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                      };
                                      setServiceOptions(prevOptions => [
                                        ...prevOptions,
                                        newOption,
                                      ]);
                                      form.setFieldValue(field.name, [
                                        ...field.value,
                                        newOption,
                                      ]);
                                    }}
                                    styles={{
                                      container: provided => ({
                                        ...provided,
                                        width: '100%',
                                      }),
                                    }}
                                  />
                                )}
                              </Field>
                            )}

                            {formik.values.type === 'Product' && (
                              <button
                                type="button"
                                className="btn btn-light btn-sm mx-3"
                                onClick={() => handleOpenModal('product')}>
                                <CIcon icon={cilPlus} size="lg" />
                              </button>
                            )}
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
                            <Field name="industryType">
                              {({field, form}) => (
                                <div className="d-flex">
                                  <CreatableSelect
                                    isMulti
                                    name={field.name}
                                    value={field.value}
                                    options={industryTypeOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={selected => {
                                      form.setFieldValue(
                                        field.name,
                                        selected ? selected : [],
                                      );
                                    }}
                                    onCreateOption={inputValue => {
                                      const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                      };
                                      setIndustryTypeOptions(prevOptions => [
                                        ...prevOptions,
                                        newOption,
                                      ]);
                                      form.setFieldValue(field.name, [
                                        ...field.value,
                                        newOption,
                                      ]);
                                    }}
                                    styles={{
                                      container: provided => ({
                                        ...provided,
                                        width: '100%',
                                      }),
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-light btn-sm ml-2 mx-3"
                                    onClick={() => handleOpenModal('industry')}>
                                    <CIcon icon={cilPlus} size="lg" />
                                  </button>
                                </div>
                              )}
                            </Field>
                            <ErrorMessage
                              name="industryType"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
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
                                formik.setFieldValue('countryName', countries);
                                formik.setFieldValue('stateName', []);
                                fetchStateOptions(countries);
                              }}
                              value={countryOptions.filter(option =>
                                formik.values.countryName.includes(
                                  option.value,
                                ),
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
                                formik.setFieldValue('stateName', states);
                              }}
                              value={stateOptions.filter(option =>
                                formik.values.stateName.includes(option.value),
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
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateImportExportDetail;
