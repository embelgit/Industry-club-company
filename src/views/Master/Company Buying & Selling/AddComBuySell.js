import {CCardHeader, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CIcon from '@coreui/icons-react';
import CreatableSelect from 'react-select/creatable';
import * as Yup from 'yup';
import {
  cilCreditCard,
  cilIndustry,
  cilImage,
  cilBuilding,
  cilPlus,
  cilPeople,
  cilGraph,
  cilFactory,
  cilClock,
  cilBriefcase,
} from '@coreui/icons';
import {getIndustryTypeList} from '../../../service/AllDrowpdownAPI';
import AddIndustryType from '../../components/ModalComponents/AddIndustryType';
import CountryDropdown from '../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../components/Dropdowns/CityDropdown';
import {postCompanyBuySell} from '../../../service/masterModule/CompanyBuying&Selling';
import {AppSidebar} from '../../../components';

const AddComBuySell = ({
  industryOptions,
  setIndustryOptions,
  handleListClick,
}) => {
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const [companyType, setCompanyType] = useState('');

  const validationSchema = Yup.object().shape({
    establistedYear: Yup.string()
      .required('Required')
      .matches(/^\d{4}$/, 'Established year must be a valid year (e.g., 2023)'),
    employees: Yup.string()
      .required('Required')
      .matches(/^\d+$/, 'Number of employees must be a valid number'),
    reportedSales: Yup.string()
      .required('Required')
      .matches(/^\d+(\.\d+)?$/, 'Reported sales must be a valid number'),
    runRateSales: Yup.string()
      .required('Required')
      .matches(/^\d+(\.\d+)?$/, 'Run rate sales must be a valid number'),
    listedByBusiness: Yup.string().required('Required'),
    industryType: Yup.array()
      .required('Required')
      .min(1, 'Please select at least one industry type')
      .max(10, 'You can select up to 10 industry types'),
    ebitdaMargin: Yup.string()
      .required('Required')
      .matches(/^\d+(\.\d+)?$/, 'EBITDA Margin must be a valid number')
      .test(
        'is-valid-ebitda',
        'EBITDA Margin must be between 0 and 100',
        value => {
          const num = parseFloat(value);
          return num >= 0 && num <= 100;
        },
      ),
    countryName: Yup.array()
      .of(Yup.string().required('Country name is required'))
      .min(1, 'At least one country must be selected')
      .required('Required'),
    stateName: Yup.array()
      .of(Yup.string().required('State name is required'))
      .min(1, 'At least one state must be selected')
      .required('Required'),
    cityName: Yup.array()
      .of(Yup.string().required('City name is required'))
      .min(1, 'At least one city must be selected')
      .required('Required'),
    targetCountryName: Yup.array()
      .of(Yup.string().required('Target country name is required'))
      .min(1, 'At least one target country must be selected')
      .required('Required'),
    targetIndustryName: Yup.array()
      .of(Yup.string().required('Target industry name is required'))
      .min(1, 'At least one target industry must be selected')
      .required('Required'),
    targetCityName: Yup.array()
      .of(Yup.string().required('Target city name is required'))
      .min(1, 'At least one target city must be selected')
      .required('Required'),
    targetStateName: Yup.array()
      .of(Yup.string().required('Target state name is required'))
      .min(1, 'At least one target state must be selected')
      .required('Required'),
  });
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
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (files.length + selectedImages.length > 5) {
      alert('You can only upload a maximum of 5 files.');
      return;
    }

    const invalidFiles = files.filter(file => {
      return !validTypes.includes(file.type) || file.size > maxSize;
    });

    if (invalidFiles.length > 0) {
      alert(
        'You can only upload JPG, PNG images, or PDF documents, each up to 5MB.',
      );
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
  const removeImage = index => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  const handleSubmit = async (values, actions) => {
    const companyId = sessionStorage.getItem('_id');

    if (!companyId) {
      console.error('Company ID not found in session storage');
      return;
    }

    const type =
      values.certificateType === 'Company Buying' ? 'Buying' : 'Selling';
    setCompanyType(type);

    const postData = {
      pkBuySellId: '',
      fkCompanyId: companyId,
      companyBuyingSelling: {
        countryName: values.countryName,
        stateName: values.stateName,
        industryType: values.industryType,
        cityName: values.cityName,
        establistedYear: values.establistedYear,
        employees: values.employees,
        reportedSales: values.reportedSales,
        runRateSales: values.runRateSales,
        ebitdaMargin: values.ebitdaMargin,
        listedByBusiness: values.listedByBusiness,
        companyType: companyType,
        uploadDocument: selectedImages[0],
      },
      targetedClient: {
        targetCountryName: values.countryNameTargeted,
        targetIndustryName: values.industryTypeTargeted,
        targetCityName: values.cityNameTargeted,
        targetCompanyType: companyType,
        targetStateName: values.stateNameTargeted,
      },
    };

    try {
      console.log('Submitting postData:', JSON.stringify(postData, null, 2));

      const result = await postCompanyBuySell(postData);
      console.log('Submission result: ', result);

      if (result.status === 200) {
        const BuySellId = result.data.pkBuySellId;
        console.log('pkBuySellId', BuySellId);
        sessionStorage.setItem('pkBuySellId', BuySellId);
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
        'Error in adding director details:',
        error?.response || error,
      );

      if (error?.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Invalid request!';
        swal({
          title: 'Warning',
          text: errorMessage,
          icon: 'warning',
          timer: 2000,
          buttons: false,
        });
        setSelectedImages([]);
        setSubmittedData(prevData => [...prevData, values]);
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
      setSelectedImages([]);
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="card">
        <Formik
          innerRef={formikRef}
          validationSchema={validationSchema}
          initialValues={{
            certificateType: 'Company Buying',
            _id: '',
            fkCompanyId: '',

            countryName: [],
            stateName: [],
            industryType: [],
            cityName: [],
            establistedYear: '',
            employees: '',
            reportedSales: '',
            runRateSales: '',
            ebitdaMargin: '',
            listedByBusiness: '',
            uploadDocument: [],

            targetCountryName: [],
            targetIndustryName: [],
            targetCityName: [],
            targetCompanyType: [],
            targetStateName: [],
          }}
          onSubmit={handleSubmit}>
          {({setFieldValue, handleSubmit, values}) => (
            <Form onSubmit={handleSubmit}>
              <CCardHeader>
                <CRow className="d-flex justify-content-center align-items-center m-8">
                  <CCol md={4} className="text-center">
                    <label className="custom-checkbox d-flex align-items-center justify-content-center">
                      <Field
                        type="radio"
                        name="certificateType"
                        value="Company Buying"
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>

                      <strong>Company Want To Buy</strong>
                    </label>
                  </CCol>

                  <CCol md={4} className="text-center">
                    <label className="custom-checkbox d-flex align-items-center justify-content-center">
                      <Field
                        type="radio"
                        name="certificateType"
                        value="Company Selling"
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>
                      <strong>Company Want To Sell</strong>
                    </label>
                  </CCol>
                </CRow>
              </CCardHeader>

              <CRow className="align-items-center mb-3  px-4 mt-4">
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
                              value={industryTypeOptions.filter(
                                option =>
                                  (field.value || []).includes(option.value), // Ensure field.value is always an array
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
                                if ((field.value || []).length >= 10) {
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
                                  ...(field.value || []),
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

                {isModalOpen && (
                  <AddIndustryType
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    industryOptions={industryOptions}
                    setIndustryOptions={setIndustryOptions}
                  />
                )}

                <CCol md={6}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilGraph} size="lg" />{' '}
                      {/* Icon for " EBTIDA Margin" */}
                    </CCol>
                    <CCol md={3} className="pl-1">
                      <label htmlFor="ebitdaMargin" className="form-label">
                        EBTIDA Margin
                      </label>
                    </CCol>
                    <CCol md={8}>
                      <Field
                        name="ebitdaMargin"
                        type="text"
                        className="form-control"
                        placeholder="Enter EBTIDA Margin"
                      />
                      <ErrorMessage
                        name="ebitdaMargin"
                        component="div"
                        className="text-danger"
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="align-items-center mb-3  px-4">
                <CCol md={6}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={1} className="pr-0">
                      {/* Icon for "Establisted" */}
                      <CIcon icon={cilBuilding} size="lg" />{' '}
                    </CCol>
                    <CCol md={3} className="pl-1">
                      <label htmlFor="establistedYear" className="form-label">
                        Establisted Year
                      </label>
                    </CCol>
                    <CCol md={8}>
                      <Field
                        name="establistedYear"
                        type="text"
                        className="form-control"
                        placeholder="Enter Establisted Year "
                      />
                      <ErrorMessage
                        name="establistedYear"
                        component="div"
                        className="text-danger"
                      />
                    </CCol>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilBriefcase} size="lg" />{' '}
                      {/* Icon for "Listed By Business" */}
                    </CCol>
                    <CCol md={3} className="pl-1">
                      <label htmlFor="listedByBusiness" className="form-label">
                        Listed By Business
                      </label>
                    </CCol>
                    <CCol md={8}>
                      <Field
                        name="listedByBusiness"
                        as="select" // Use `as="select"` for a dropdown
                        className="form-control">
                        <option>Select Business Type</option>
                        <option value="Public Limited">Public Limited</option>
                        <option value="Private Limited">Private Limited</option>
                      </Field>
                      <ErrorMessage
                        name="listedByBusiness"
                        component="div"
                        className="text-danger"
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="align-items-center mb-3  px-4">
                <CCol md={6}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilPeople} size="lg" />{' '}
                      {/* Icon for "Emlpoyee" */}
                    </CCol>
                    <CCol md={3} className="pl-1">
                      <label htmlFor="employees" className="form-label">
                        Emlpoyee
                      </label>
                    </CCol>
                    <CCol md={8}>
                      <Field
                        name="employees"
                        type="text"
                        className="form-control"
                        placeholder="Enter Emlpoyee"
                      />
                      <ErrorMessage
                        name="employees"
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
              </CRow>

              <CRow className="align-items-center mb-3  px-4">
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
              </CRow>
              <CRow className="align-items-center mb-3 px-4">
                <CCol md={6}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilFactory} size="lg" />{' '}
                      {/* Icon for "Reported Sale" */}
                    </CCol>
                    <CCol md={3} className="pl-1">
                      <label htmlFor="reportedSales" className="form-label">
                        Reported Sales
                      </label>
                    </CCol>
                    <CCol md={8}>
                      <Field
                        name="reportedSales"
                        type="text"
                        className="form-control"
                        placeholder="Enter Reported Sales"
                      />
                      <ErrorMessage
                        name="reportedSales"
                        component="div"
                        className="text-danger"
                      />
                    </CCol>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilClock} size="lg" />{' '}
                      {/* Icon for "Run Rate Sale" */}
                    </CCol>
                    <CCol md={3} className="pl-1">
                      <label htmlFor="runRateSales" className="form-label">
                        Run Rate Sales
                      </label>
                    </CCol>
                    <CCol md={8}>
                      <Field
                        name="runRateSales"
                        type="text"
                        className="form-control"
                        placeholder="Enter Run Rate Sale"
                      />
                      <ErrorMessage
                        name="runRateSales"
                        component="div"
                        className="text-danger"
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="align-items-center mb-3 px-4">
                <CCol md={6}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilImage} size="lg" />
                    </CCol>
                    <CCol md={3} className="pl-1">
                      <label htmlFor="infraImage" className="form-label">
                        Upload Image
                      </label>
                    </CCol>
                    <CCol md={8}>
                      <div className="image-uploader">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          multiple
                          className="form-control"
                          disabled={selectedImages.length >= 5}
                        />
                        <small className="text-muted d-block mt-1">
                          Please upload up to 5 images (maximum size: 5MB).
                        </small>

                        <div className="d-flex flex-wrap mt-2">
                          {selectedImages.map((image, index) => (
                            <div
                              key={index}
                              className="position-relative me-2 mb-2"
                              style={{width: '45px', height: '45px'}}>
                              <img
                                src={image}
                                alt={`Selected ${index}`}
                                className="img-thumbnail"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <button
                                type="button"
                                className="btn-close btn-sm position-absolute top-0 end-0"
                                style={{
                                  transform: 'translate(30%, -30%)',
                                  color: '#fff',
                                  backgroundColor: 'red',
                                  borderRadius: '50%',
                                  padding: '0.1rem',
                                  fontSize: '0.6rem',
                                }}
                                onClick={() => removeImage(index)}></button>
                            </div>
                          ))}
                        </div>

                        {selectedImages.length >= 5 && (
                          <small className="text-danger">
                            You have reached the 5-image limit.
                          </small>
                        )}
                      </div>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <div className=" mb-2">
                <CCardHeader className="mb-3">
                  <strong>Targeted Client Industry</strong>
                </CCardHeader>
                <div className="card-body">
                  <CRow className="align-items-center mb-3">
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilIndustry} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label
                            htmlFor="industryTypeTargeted"
                            className="form-label">
                            Industry Type
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field name="industryTypeTargeted">
                            {({field, form}) => (
                              <div className="d-flex">
                                <CreatableSelect
                                  isMulti
                                  name={field.name}
                                  value={industryTypeOptions.filter(option =>
                                    (field.value || []).includes(option.value),
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
                                    if ((field.value || []).length >= 10) {
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
                                      ...(field.value || []),
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
                            name="targetIndustryName"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>

                    {/* {isModalOpen && (
                      <AddIndustryType
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        industryOptions={industryOptions}
                        setIndustryOptions={setIndustryOptions}
                      />
                    )} */}

                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilCreditCard} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label
                            htmlFor="countryNameTargeted"
                            className="form-label">
                            Country Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <CountryDropdown
                            setFieldValue={setFieldValue}
                            values={values}
                            name="countryNameTargeted"
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

                  <CRow className="align-items-center mb-3">
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilCreditCard} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label
                            htmlFor="stateNameTargeted"
                            className="form-label">
                            State Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <StateDropdown
                            setFieldValue={setFieldValue}
                            values={values}
                            name="stateNameTargeted"
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
                            htmlFor="cityNameTargeted"
                            className="form-label">
                            City Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <CityDropdown
                            setFieldValue={setFieldValue}
                            values={values}
                            name="cityNameTargeted"
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
              </div>
              <div className="col-md-4 col-sm-6 mb-3 px-3">
                <CButton
                  type="submit"
                  className="btn btn-success custom-btn shadow">
                  Submit
                </CButton>
                <CButton
                  className="btn btn-primary custom-btn shadow mx-2"
                  onClick={handleListClick}>
                  List
                </CButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddComBuySell;
