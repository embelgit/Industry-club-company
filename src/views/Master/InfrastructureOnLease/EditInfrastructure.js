import {CCardHeader, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CreatableSelect from 'react-select/creatable';
import CIcon from '@coreui/icons-react';
import {
  cilDescription,
  cilBasket,
  cilDollar,
  cilMap,
  cilIndustry,
  cilPlus,
  cilCreditCard,
  cilFile,
} from '@coreui/icons';

import {useLocation} from 'react-router-dom';
import {
  getInfrastructureDetailsById,
  UpdateInfrastructure,
} from '../../../service/masterModule/InfrastructureOnLease';
import {getIndustryTypeList} from '../../../service/AllDrowpdownAPI';
import CountryDropdown from '../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../components/Dropdowns/CityDropdown';
import {AppHeader, AppSidebar} from '../../../components';
const EditInfrastructure = () => {
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pkInfraId, setpkInfraId] = useState(null);
  const [infraData, setInfraData] = useState(null);
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const {companyData} = location.state || {};

  console.log('Received Company Data:', companyData);

  useEffect(() => {
    if (companyData && companyData.pkInfraId) {
      console.log('Received pkInfraId Data:', companyData.pkInfraId);
      setpkInfraId(companyData.pkInfraId);
    }
  }, [companyData]);

  const fetchInfraDataById = async pkInfraId => {
    try {
      setLoader(true);
      const result = await getInfrastructureDetailsById(pkInfraId);

      console.log('Fetched result:', result);

      if (result && result.data) {
        setInfraData(result.data);
      } else {
        console.warn(
          'infrastructureOnLease is not present in the result:',
          result,
        );
        setInfraData(null);
      }
    } catch (error) {
      console.error('Error fetching company data by ID:', error);
      setInfraData(null);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (pkInfraId) {
      fetchInfraDataById(pkInfraId);
    }
  }, [pkInfraId]);

  useEffect(() => {
    if (infraData) {
      console.log('Updated infraData:', infraData);
    }
  }, [infraData]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchIndustryTypeOptions = async () => {
      const IndustryData = await getIndustryTypeList();
      if (IndustryData && Array.isArray(IndustryData)) {
        setindustryTypeOptions(
          IndustryData.map(data => ({
            label: data,
            value: data,
          })),
        );
      }
    };

    fetchIndustryTypeOptions();
  }, []);
  const handleImageChange = event => {
    const files = Array.from(event.target.files);

    if (files.length + selectedImages.length > 5) {
      alert('You can only upload a maximum of 5 files.');
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('You can only upload JPG, PNG images, or PDF documents.');
      return;
    }

    const readFilesAsBase64 = files.map(
      file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('File could not be read as base64'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readFilesAsBase64)
      .then(base64Files => {
        setSelectedImages(prevImages => [...prevImages, ...base64Files]);
      })
      .catch(error => {
        console.error('Error converting files to base64:', error);
      });
  };

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
            <strong>Infrastructure on lease</strong>
          </CCardHeader>

          <div className="card-body">
            <Formik
              innerRef={formikRef}
              enableReinitialize={true}
              initialValues={{
                industryType: infraData
                  ? infraData.infrastructureOnLease.industryType || []
                  : [],
                countryName: infraData
                  ? infraData.infrastructureOnLease.countryName || []
                  : [],
                stateName: infraData
                  ? infraData.infrastructureOnLease.stateName || []
                  : [],
                cityName: infraData
                  ? infraData.infrastructureOnLease.cityName || []
                  : [],
                pincode: infraData
                  ? infraData.infrastructureOnLease.pincode || ''
                  : '',
                approximateCost: infraData
                  ? infraData.infrastructureOnLease.approximateCost || ''
                  : '',
                area: infraData
                  ? infraData.infrastructureOnLease.area || ''
                  : '',
                description: infraData
                  ? infraData.infrastructureOnLease.description || ''
                  : '',
                document: infraData
                  ? infraData.infrastructureOnLease.document || ''
                  : '',
                machineName: infraData
                  ? infraData.infrastructureOnLease.machineName || ''
                  : '',
                targetIndustryType: infraData
                  ? infraData.targetedClient.targetIndustryType || []
                  : [],
                targetCountryName: infraData
                  ? infraData.targetedClient.targetCountryName || []
                  : [],
                targetStateName: infraData
                  ? infraData.targetedClient.targetStateName || []
                  : [],
                targetCityName: infraData
                  ? infraData.targetedClient.targetCityName || []
                  : [],
              }}
              onSubmit={async (values, actions) => {
                const companyId = sessionStorage.getItem('_id');

                if (!companyId) {
                  console.error('Company ID not found in session storage');
                  swal({
                    title: 'Error',
                    text: 'Company ID is missing.',
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                  return;
                }

                const postData = {
                  pkInfraId: pkInfraId,
                  infrastructureOnLease: {
                    machineName: values.machineName,
                    industryType: values.industryType,
                    countryName: values.countryName,
                    stateName: values.stateName,
                    cityName: values.cityName,

                    approximateCost: values.approximateCost,
                    area: values.area,
                    description: values.description,
                    document: selectedImages[0],
                  },
                  targetedClient: {
                    targetCountryName: values.targetCountryName,
                    targetStateName: values.targetStateName,
                    targetIndustryType: values.targetIndustryType,
                    targetCityName: values.targetCityName,
                  },
                };

                try {
                  console.log(
                    'Submitting postData:',
                    JSON.stringify(postData, null, 2),
                  );

                  const result = await UpdateInfrastructure(postData);
                  console.log('Submission result:', result);

                  if (result.status === 200) {
                    const InfraId = result.data.pkInfraId;
                    console.log('infeaiId', InfraId);
                    sessionStorage.setItem('pkInfraId', InfraId);
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
                  console.error(
                    'Error in submission:',
                    error?.response || error,
                  );

                  if (error?.response?.status === 400) {
                    swal({
                      title: 'Warning',
                      text: error.response.data?.message || 'Validation error',
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
                  actions.setSubmitting(false);
                }
              }}>
              {({handleSubmit, values, setFieldValue, isSubmitting}) => (
                <Form onSubmit={handleSubmit}>
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
                                  onClick={handleOpenModal}>
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

                    {/* Machine Details */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilBasket} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="machineName" className="form-label">
                            Machine Details
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="machineName"
                            type="text"
                            className="form-control"
                            placeholder="Enter Machine Details"
                          />
                          <ErrorMessage
                            name="machineName"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="align-items-center mb-2">
                    {/* Location */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilCreditCard} size="lg" />
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
                          <CIcon icon={cilCreditCard} size="lg" />
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
                  <CRow className="align-items-center mb-2">
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilCreditCard} size="lg" />
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
                    {/* Approximate Cost */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilDollar} size="lg" />{' '}
                          {/* Change to appropriate icon */}
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label
                            htmlFor="InfraData.approximateCost"
                            className="form-label">
                            Approximate Cost
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="approximateCost"
                            type="text"
                            className="form-control"
                            placeholder="Enter Approximate cost"
                          />
                          <ErrorMessage
                            name="approximateCost"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="align-items-center mb-1">
                    {/* Area */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-1">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilMap} size="lg" />{' '}
                          {/* Change to appropriate icon */}
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="area" className="form-label">
                            Area
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="area"
                            type="text"
                            className="form-control"
                            placeholder="Enter Area"
                          />
                          <ErrorMessage
                            name="area"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilFile} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="document" className="form-label">
                            Document Upload
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <input
                            id="document"
                            name="document"
                            type="file"
                            className="form-control"
                            onChange={handleImageChange}
                            accept="image/jpeg, image/png, application/pdf"
                          />

                          <p style={{color: 'red'}}>Terms & conditions *</p>
                          <ErrorMessage
                            name="document"
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
                          <CIcon icon={cilDescription} size="lg" />{' '}
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="description"
                            as="textarea"
                            className="form-control"
                            placeholder="Enter Description"
                            rows={4}
                            style={{height: '60%', fontSize: '16px'}}
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                  <div className="mb-2">
                    <CCardHeader className="mb-3">
                      <strong>Targeted Client Industry</strong>
                    </CCardHeader>

                    <CRow className="align-items-center mb-3">
                      {/* Industry Type */}
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilIndustry} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label
                              htmlFor="targetIndustryType"
                              className="form-label">
                              Industry Type
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field name="targetIndustryType">
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
                                    onClick={handleOpenModal}>
                                    <CIcon icon={cilPlus} size="lg" />
                                  </button>
                                </div>
                              )}
                            </Field>
                            <ErrorMessage
                              name="targetIndustryType"
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
                            <label
                              htmlFor="targetCountryName"
                              className="form-label">
                              Country Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <CountryDropdown
                              setFieldValue={setFieldValue}
                              values={values}
                              name="targetCountryName"
                            />
                            <ErrorMessage
                              name="targetCountryName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                    <CRow className="align-items-center mb-2">
                      {/* Location */}

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label
                              htmlFor="targetStateName"
                              className="form-label">
                              State Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <StateDropdown
                              setFieldValue={setFieldValue}
                              values={values}
                              name="targetStateName"
                              countryName={values.countryName}
                            />
                            <ErrorMessage
                              name="targetStateName"
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
                            <label
                              htmlFor="targetCityName"
                              className="form-label">
                              City Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <CityDropdown
                              setFieldValue={setFieldValue}
                              values={values}
                              name="targetCityName"
                              stateName={values.stateName}
                            />
                            <ErrorMessage
                              name="targetCityName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                  </div>
                  <div className="col-md-4 col-sm-6 mb-3">
                    <CButton
                      type="submit"
                      className="btn btn-success custom-btn shadow"
                      disabled={isSubmitting}>
                      Submit
                    </CButton>
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

export default EditInfrastructure;
