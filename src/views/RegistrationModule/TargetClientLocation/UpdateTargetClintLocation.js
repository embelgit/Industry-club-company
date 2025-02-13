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
} from '@coreui/icons';
import CreatableSelect from 'react-select/creatable';
import {
  getCountryList,
  getIndustryTypeList,
  getProductNameList,
  getServiceList,
  getStateList,
} from '../../../service/AllDrowpdownAPI';
import {UpdateTargetClintLoc} from '../../../service/RegistrationModule/TargetClintLocationAPIs';

const UpdateTargetClintLocation = () => {
  const {state} = useLocation();
  const {index} = useParams();

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [industryTypeOptions, setIndustryTypeOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const TargetClintLocationDetails = state?.TargetClintLocationDetails || null;

  const initialValues = {
    type: 'Product',
    productName:
      TargetClintLocationDetails?.productName?.map(name => ({
        label: name,
        value: name,
      })) || [],
    serviceName:
      TargetClintLocationDetails?.serviceName?.map(name => ({
        label: name,
        value: name,
      })) || [],
    countryName:
      TargetClintLocationDetails?.countryName?.map(name => ({
        label: name,
        value: name,
      })) || [],
    stateName:
      TargetClintLocationDetails?.stateName?.map(name => ({
        label: name,
        value: name,
      })) || [],
    industryType:
      TargetClintLocationDetails?.industryType?.map(type => ({
        label: type,
        value: type,
      })) || [],
  };

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

  useEffect(() => {
    const fetchIndustryTypeOptions = async () => {
      const industryData = await getIndustryTypeList();
      if (industryData && Array.isArray(industryData)) {
        setIndustryTypeOptions(
          industryData.map(data => ({label: data, value: data})),
        );
      }
    };
    fetchIndustryTypeOptions();
  }, []);

  useEffect(() => {
    const fetchProductOptions = async () => {
      const companyId = sessionStorage.getItem('fkCompanyId');
      if (!companyId) return;

      const productData = await getProductNameList(companyId);
      if (productData && Array.isArray(productData)) {
        setProductOptions(
          productData.map(data => ({label: data, value: data})),
        );
      }
    };
    fetchProductOptions();
  }, []);

  useEffect(() => {
    const fetchServiceOptions = async () => {
      const companyId = sessionStorage.getItem('fkCompanyId');
      if (!companyId) return;

      const serviceData = await getServiceList(companyId);
      if (serviceData && Array.isArray(serviceData)) {
        setServiceOptions(
          serviceData.map(data => ({label: data, value: data})),
        );
      }
    };
    fetchServiceOptions();
  }, []);

  const handleSubmit = async (values, actions) => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    if (!companyId) return;

    const postData = {
      _id: companyId,
      index: index,
      targetedClient: [
        {
          productName:
            values.type === 'Product'
              ? values.productName.map(p => p.value)
              : [],
          serviceName:
            values.type === 'Service'
              ? values.serviceName.map(s => s.value)
              : [],
          countryName: values.countryName.map(c => c.value),
          stateName: values.stateName.map(s => s.value),
          industryType: values.industryType.map(i => i.value),
        },
      ],
    };

    try {
      const result = await UpdateTargetClintLoc(postData);
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
          <strong>Target Client Location</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}>
            {formik => (
              <Form>
                <CRow className="d-flex justify-content-center align-items-center mb-5">
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
                          <CCol md={8}>
                            <Select
                              isMulti
                              options={
                                formik.values.type === 'Product'
                                  ? productOptions
                                  : serviceOptions
                              }
                              value={
                                formik.values.type === 'Product'
                                  ? formik.values.productName
                                  : formik.values.serviceName
                              }
                              onChange={selectedOption => {
                                formik.setFieldValue(
                                  formik.values.type === 'Product'
                                    ? 'productName'
                                    : 'serviceName',
                                  selectedOption || [],
                                );
                              }}
                            />
                            <ErrorMessage
                              name={
                                formik.values.type === 'Product'
                                  ? 'productName'
                                  : 'serviceName'
                              }
                              component="div"
                              className="text-danger"
                            />
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
                              options={industryTypeOptions}
                              value={formik.values.industryType}
                              onChange={option =>
                                formik.setFieldValue(
                                  'industryType',
                                  option || [],
                                )
                              }
                              onCreateOption={inputValue => {
                                const newOption = {
                                  label: inputValue,
                                  value: inputValue,
                                };
                                setIndustryTypeOptions(prev => [
                                  ...prev,
                                  newOption,
                                ]);
                                formik.setFieldValue('industryType', [
                                  ...formik.values.industryType,
                                  newOption,
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
                              options={countryOptions}
                              value={formik.values.countryName}
                              onChange={selected => {
                                formik.setFieldValue(
                                  'countryName',
                                  selected || [],
                                );
                                formik.setFieldValue('stateName', []);
                                fetchStateOptions(
                                  selected.map(opt => opt.value),
                                );
                              }}
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
                              options={stateOptions}
                              value={formik.values.stateName}
                              onChange={selected =>
                                formik.setFieldValue(
                                  'stateName',
                                  selected || [],
                                )
                              }
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
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateTargetClintLocation;
