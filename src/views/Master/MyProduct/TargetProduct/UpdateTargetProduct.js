import {useParams, useLocation} from 'react-router-dom';
import {
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormTextarea,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import Select from 'react-select';
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
import CreatableSelect from 'react-select/creatable';
import {
  getIndustryTypeList,
  getMaterialTypeList,
  getProductNameList,
  getServiceList,
} from '../../../../service/AllDrowpdownAPI';
import {updateTargetedProductDetails} from '../../../../service/masterModule/MyProduct';
import AddIndustryType from '../../../components/ModalComponents/AddIndustryType';
import AddMaterialType from '../../../components/ModalComponents/AddMaterialType';
import CountryDropdown from '../../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../../components/Dropdowns/CityDropdown';
import {AppHeader, AppSidebar} from '../../../../components';

const UpdateTargetProduct = () => {
  const [productOptions, setproductOptions] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const {_id, updatedBy} = useParams(); // Get the referral ID from the URL
  const location = useLocation(); // Get the state passed from the previous route
  const companyData = location.state?.companyData;
  console.log('company data', companyData);

  const Id = companyData._id;
  const UpdatedBy = companyData.updatedBy;
  console.log('Id', Id);
  console.log('UpdatedBy', UpdatedBy);

  const formikRef = useRef(null);

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
      <AppHeader />
      <AppSidebar />
      <div
        style={{
          paddingLeft: '284px',
          paddingRight: '26px',
          paddingTop: '11px',
        }}>
        <div className="card shadow mb-2">
          <CCardHeader className="mb-3">
            <strong>Update Target Product</strong>
          </CCardHeader>

          <div className="card-body">
            <Formik
              innerRef={formikRef}
              enableReinitialize
              initialValues={{
                certificateName: companyData?.certificateName || '',
                cityName: companyData?.cityName || '',
                countryName: companyData?.countryName || '',
                industryType: companyData?.industryType || '',
                materialType: companyData?.materialType || '',
                productName: companyData?.productName || '',
                quantity: companyData?.quantity || '',
                stateName: companyData?.stateName || '',
                turnOver: companyData?.turnOver || '',
              }}
              onSubmit={async (values, actions) => {
                const companyId = sessionStorage.getItem('_id');
                const userName = sessionStorage.getItem('userName');
                if (!companyId) {
                  swal({
                    title: 'Error',
                    text: 'Company ID is missing.',
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                  return;
                }
                if (!userName) {
                  swal({
                    title: 'Error',
                    text: 'userName is missing.',
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                  return;
                }

                const postData = {
                  fkCompanyId: companyId,
                  pkTargetId: Id,
                  updatedBy: UpdatedBy,
                  certificateName: values.certificateName,
                  cityName: values.cityName,
                  countryName: values.countryName,
                  industryType: values.industryType,
                  materialType: values.materialType,
                  productName: values.productName,
                  quantity: values.quantity,
                  stateName: values.stateName,
                  turnOver: values.turnOver,
                };
                console.log(
                  'Submitting postData:',
                  JSON.stringify(postData, null, 2),
                );
                try {
                  const result = await updateTargetedProductDetails(postData);
                  if (result.status === 200) {
                    swal({
                      title: 'Success',
                      text: result.data,
                      icon: 'success',
                      timer: 2000,
                      buttons: false,
                    });
                    actions.resetForm();
                  }
                } catch (error) {
                  const errorMessage =
                    error?.response?.data?.message || 'Something went wrong!';
                  swal({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                } finally {
                  actions.setSubmitting(false);
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
      </div>
    </>
  );
};

export default UpdateTargetProduct;
