import {CCardHeader, CContainer, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import Select from 'react-select';
import * as Yup from 'yup';
import {
  cilCreditCard,
  cilBasket,
  cilMoney,
  cilBriefcase,
  cilPlus,
  cilIndustry,
  cilGlobeAlt,
  cilMap,
  cilFile,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {Link} from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import {
  getIndustryTypeList,
  getProductNameList,
  getServiceList,
} from '../../../service/AllDrowpdownAPI';
import {postTargetedVendor} from '../../../service/RegistrationModule/TargetedVendorAPIs';
import CountryDropdown from '../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../components/Dropdowns/CityDropdown';
import TargetedVendorList from './TargetedVendorList';
import AddProductType from '../../components/ModalComponents/AddProductType';
import AddIndustryType from '../../components/ModalComponents/AddIndustryType';
import {
  fetchIndustryTypeOptions,
  fetchProductOptions,
  fetchServiceOptions,
} from '../../AllDropdown';

const TargetedVendor = () => {
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const [productOptions, setproductOptions] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [serviceNameOption, setServiceNameOption] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);

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
    cityName: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),

    turnOver: Yup.string().required('Required'),
    certificateName: Yup.string().required('Required'),
    pinCode: Yup.string().required('Required'),
  });

  const handleOpenModal = type => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleListClick = () => {
    setShowTable(prev => !prev); // Toggle the visibility of the submitted data table
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
    setServiceNameOption(result || []);
  };
  useEffect(() => {
    getIndustryTypeList();
    getProductList();
    getServiceList();
  }, []);

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="mb-4">
          <strong> Targeted Vendor</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              id: '',
              percentage: '',
              type: 'Product',
              productName: '',
              serviceName: '',
              countryName: [],
              stateName: [],
              industryType: [],
              cityName: [],
              turnOver: '',
              certificateName: '',
              pinCode: '',
              vendorForm: '',
            }}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('fkCompanyId');

              console.log('companyId found in sessionStorage', companyId);

              const formattedImages = selectedImages.map(image => {
                if (image.startsWith('data:image/')) return image.trim();
                return '';
              });

              console.log(
                'Formatted Images Array for submission:',
                formattedImages,
              );
              try {
                const postData = {
                  _id: companyId,
                  percentage: '97',
                  targetedVendor: [
                    {
                      productName:
                        values.type === 'Product' ? [values.productName] : [],
                      serviceName:
                        values.type === 'Service' ? [values.productName] : [],
                      countryName: values.countryName,
                      stateName: values.stateName,
                      industryType: values.industryType,
                      cityName: values.cityName,
                      turnOver: values.turnOver,
                      certificateName: values.certificateName,
                      pinCode: values.pinCode,
                      vendorForm: '',
                    },
                  ],
                };
                console.log(
                  'Submitting postData:',
                  JSON.stringify(postData, null, 2),
                );
                const result = await postTargetedVendor(postData);
                console.log('Add Service Details :-', result);
                if (result.status === 200) {
                  swal({
                    title: 'Great',
                    text: result.data,
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });
                }

                setSelectedImages([]);
              } catch (error) {
                console.error('add GST error :-', error?.response || error);

                if (error?.response?.status === 409) {
                  const errorMessage =
                    error?.response?.data || 'Conflict occurred.';
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
            }}>
            {(
              {setFieldValue, values, handleSubmit}, // Correct destructuring here
            ) => (
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

                {values.type && (
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

                          <CCol md={8} className="d-flex align-items-center">
                            <Field name="productName">
                              {({field, form}) => (
                                <Select
                                  id="productName"
                                  options={
                                    values.type === 'Product'
                                      ? productOptions
                                      : serviceNameOption
                                  }
                                  className="basic-single-select flex-grow-1"
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

                            {/* Show the button only when "Product" is selected */}
                            {values.type === 'Product' && (
                              <button
                                type="button"
                                className="btn btn-light btn-sm mx-3"
                                onClick={() => handleOpenModal('product')}>
                                <CIcon icon={cilPlus} size="lg" />
                              </button>
                            )}

                            <ErrorMessage
                              name="productName"
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
                            <Field name="industryType">
                              {({field, form}) => (
                                <div className="d-flex">
                                  <CreatableSelect
                                    isMulti
                                    name={field.name}
                                    value={industryTypeOptions.filter(option =>
                                      field.value.includes(option.value),
                                    )}
                                    options={industryTypeOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={selected => {
                                      if (selected && selected.length > 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }

                                      form.setFieldValue(
                                        field.name,
                                        selected
                                          ? selected.map(option => option.value)
                                          : [],
                                      );
                                    }}
                                    onCreateOption={inputValue => {
                                      if (field.value.length >= 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }

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
                                        inputValue,
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
                      {/* Modal Components */}
                      {modalType === 'industry' && (
                        <AddIndustryType
                          isOpen={modalType === 'industry'}
                          onClose={handleCloseModal}
                          industryOptions={industryOptions}
                          setIndustryOptions={setIndustryOptions}
                        />
                      )}
                      {modalType === 'product' && (
                        <AddProductType
                          isOpen={modalType === 'product'}
                          onClose={handleCloseModal}
                          productTypeOptions={productTypeOptions}
                          setProductTypeOptions={setProductTypeOptions}
                        />
                      )}
                    </CRow>
                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label
                              htmlFor="certificateName"
                              className="form-label">
                              Certificate
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="certificateName"
                              type="text"
                              className="form-control"
                              placeholder="Enter Certificate"
                            />
                            <ErrorMessage
                              name="certificateName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilMoney} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="turnOver" className="form-label">
                              Turnover
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="turnOver"
                              type="text"
                              className="form-control"
                              placeholder="Enter Turnover"
                            />
                            <ErrorMessage
                              name="turnOver"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                    <CRow className="align-items-center mb-3">
                      {/* Rest of the form fields */}
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
                            <CountryDropdown
                              setFieldValue={setFieldValue}
                              values={values}
                              name="countryName"
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
                            <StateDropdown
                              setFieldValue={setFieldValue}
                              values={values}
                              name="stateName"
                              countryName={values.countryName}
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
                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilMap} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="cityName" className="form-label">
                              City Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <CityDropdown
                              setFieldValue={setFieldValue}
                              values={values}
                              name="cityName"
                              stateName={values.stateName}
                            />
                            <ErrorMessage
                              name="cityName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="pinCode" className="form-label">
                              Pin Code
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="pinCode"
                              type="text"
                              className="form-control"
                              placeholder="Enter Pin Code"
                            />
                            <ErrorMessage
                              name="pinCode"
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
                            <CIcon icon={cilFile} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="wenderForm" className="form-label">
                              Upload vendor Form
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="wenderForm"
                              type="file"
                              className="form-control"
                              placeholder="Choose a file"
                            />
                            <ErrorMessage
                              name="wenderForm"
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

                  <Link to="/import-export-detail">
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
      {showTable && <TargetedVendorList />}

      {/* <AppFooter /> */}
    </>
  );
};

export default TargetedVendor;
