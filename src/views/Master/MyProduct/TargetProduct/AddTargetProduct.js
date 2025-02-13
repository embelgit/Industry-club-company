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
  cilFactory,
  cilSettings,
  cilFile,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import CreatableSelect from 'react-select/creatable';

import {postTargetedProduct} from '../../../../service/masterModule/MyProduct';
import {
  getIndustryTypeList,
  getMaterialTypeList,
  getProductNameList,
  getServiceList,
} from '../../../../service/AllDrowpdownAPI';
import AddIndustryType from '../../../components/ModalComponents/AddIndustryType';
import AddMaterialType from '../../../components/ModalComponents/AddMaterialType';
import CountryDropdown from '../../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../../components/Dropdowns/CityDropdown';

// import {postTargetedProduct} from '../../../../../service/MainComponent/TargetedProduct';

const AddTargetProduct = ({handleListClick}) => {
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const [productOptions, setproductOptions] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [serviceNameOption, setServiceNameOption] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
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

  useEffect(() => {
    const fetchServiceOptions = async () => {
      const companyId = sessionStorage.getItem('_id');
      if (!companyId) return;

      const serviceData = await getServiceList(companyId);
      if (serviceData && Array.isArray(serviceData)) {
        setServiceNameOption(
          serviceData.map(data => ({label: data, value: data})),
        );
      }
    };
    fetchServiceOptions();
  }, []);

  useEffect(() => {
    const fetchIndustryTypeOptions = async () => {
      try {
        const industryData = await getIndustryTypeList();
        if (industryData && Array.isArray(industryData)) {
          setIndustryOptions(
            industryData.map(data => ({
              label: data,
              value: data,
            })),
          );
        } else {
          console.error('Unexpected industry data format', industryData);
        }
      } catch (error) {
        console.error('Failed to fetch industry options', error);
      }
    };

    fetchIndustryTypeOptions();
  }, []);

  useEffect(() => {
    const fetchMaterialTypeOptions = async () => {
      try {
        const materialData = await getMaterialTypeList();
        if (materialData && Array.isArray(materialData)) {
          setMaterialOptions(
            materialData.map(data => ({
              label: data,
              value: data,
            })),
          );
        } else {
          console.error('Unexpected material data format', materialData);
        }
      } catch (error) {
        console.error('Failed to fetch material options', error);
      }
    };

    fetchMaterialTypeOptions();
  }, []);
  useEffect(() => {
    const fetchProductNameOptions = async () => {
      const companyId = sessionStorage.getItem('_id'); // Retrieve companyId from sessionStorage
      console.log('companyId found in sessionStorage:', companyId);

      if (!companyId) {
        console.error('No companyId found in sessionStorage');
        return;
      }

      const productData = await getProductNameList(companyId); // Pass companyId to the function
      if (productData && Array.isArray(productData)) {
        setproductOptions(
          productData.map(data => ({
            label: data,
            value: data,
          })),
        );
      }
    };

    fetchProductNameOptions();
  }, []);

  return (
    <>
      <div className="card">
        <CCardHeader>
          <strong> Targeted Product</strong>
        </CCardHeader>
        <div className="p-3">
          <Formik
            initialValues={{
              productName: '',

              countryName: [],
              stateName: [],
              industryType: [],
              cityName: [],
              materialType: [],
              turnOver: '',
              certificateName: '',
            }}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('_id');
              const userName = sessionStorage.getItem('userName');
              console.log('companyId found in sessionStorage', companyId);
              try {
                const postData = {
                  fkCompanyId: companyId,
                  productName: values.countryName,
                  quantity: values.quantity,
                  countryName: values.countryName,
                  stateName: values.stateName,
                  industryType: values.industryType,
                  materialType: values.materialType,
                  cityName: values.cityName,
                  turnOver: values.turnOver,
                  certificateName: values.certificateName,
                  createdBy: userName,
                };
                console.log(
                  'Submitting postData:',
                  JSON.stringify(postData, null, 2),
                );
                const result = await postTargetedProduct(postData);
                console.log('Add Targeted Product Details :-', result);
                if (result.status === 200) {
                  const pkTargetId = result.data.pkTargetId;
                  console.log('pkTargetId', pkTargetId);
                  sessionStorage.setItem('pkTargetId', pkTargetId);
                  swal({
                    title: 'Great',
                    text: result.data.sms,
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });
                }
              } catch (error) {
                console.error(
                  'add Targeted Product error :-',
                  error?.response || error,
                );
                if (error?.response?.status === 400) {
                  swal({
                    title: 'Warning',
                    text: error?.response?.data || 'Bad request error',
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
              } finally {
                actions.resetForm();
              }
            }}>
            {({setFieldValue, values, handleSubmit}) => (
              <Form>
                <CRow className="align-items-center mb-3">
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilCreditCard} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="productName" className="form-label">
                          Product Name
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field name="productName">
                          {({field, form}) => (
                            <Select
                              id="productName"
                              options={productOptions} // Use productOptions
                              className="basic-single-select"
                              classNamePrefix="select"
                              placeholder="Select Product Name"
                              isMulti // Enable multi-select
                              onChange={selectedOptions =>
                                form.setFieldValue(
                                  field.name,
                                  selectedOptions
                                    ? selectedOptions.map(
                                        option => option.value,
                                      )
                                    : [], // Set value as an array
                                )
                              }
                              value={
                                field.value
                                  ? productOptions.filter(option =>
                                      field.value.includes(option.value),
                                    ) // Filter options based on array values
                                  : [] // Set value as an empty array
                              }
                              isClearable // Allows clearing the selection
                            />
                          )}
                        </Field>

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
                        <CIcon icon={cilCreditCard} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="quantity" className="form-label">
                          Quantity
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="quantity"
                          type="text"
                          className="form-control"
                          placeholder="Enter Certificate"
                        />
                        <ErrorMessage
                          name="quantity"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="align-items-center mb-3">
                  {/* Industry Type */}
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilIndustry} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="industryType" className="form-label">
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
                                value={industryOptions.filter(option =>
                                  field.value?.includes(option.value),
                                )}
                                options={industryOptions}
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
                                  if (field.value?.length >= 10) {
                                    alert(
                                      'You can select only up to 10 options.',
                                    );
                                    return;
                                  }
                                  const newOption = {
                                    label: inputValue,
                                    value: inputValue,
                                  };
                                  setIndustryOptions(prevOptions => [
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

                  {/* Material Type */}
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilBasket} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="materialType" className="form-label">
                          Material Type
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field name="materialType">
                          {({field, form}) => (
                            <div className="d-flex">
                              <CreatableSelect
                                isMulti
                                name={field.name}
                                value={materialOptions.filter(option =>
                                  field.value?.includes(option.value),
                                )}
                                options={materialOptions}
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
                                  if (field.value?.length >= 10) {
                                    alert(
                                      'You can select only up to 10 options.',
                                    );
                                    return;
                                  }
                                  const newOption = {
                                    label: inputValue,
                                    value: inputValue,
                                  };
                                  setMaterialOptions(prevOptions => [
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
                                onClick={() => handleOpenModal('material')}>
                                <CIcon icon={cilPlus} size="lg" />
                              </button>
                            </div>
                          )}
                        </Field>
                        <ErrorMessage
                          name="materialType"
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
                  {modalType === 'material' && (
                    <AddMaterialType
                      isOpen={modalType === 'material'}
                      onClose={handleCloseModal}
                      materialOptions={materialOptions}
                      setMaterialOptions={setMaterialOptions}
                    />
                  )}
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
                </CRow>
                <CRow className="align-items-center mb-3">
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilCreditCard} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="certificateName" className="form-label">
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
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AddTargetProduct;
