import {CCardHeader, CContainer, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {CNav, CNavItem, CTabContent, CTabPane, CCardBody} from '@coreui/react';
import React, {useState, useRef, useEffect} from 'react';
import * as Yup from 'yup';
import CIcon from '@coreui/icons-react';
import CreatableSelect from 'react-select/creatable';

import {
  cilCreditCard,
  cilIndustry,
  cilImage,
  cilBuilding,
  cilPlus,
  cilCalendar,
  cilPeople,
  cilGraph,
  cilFactory,
  cilLocationPin,
  cilClock,
  cilBriefcase,
} from '@coreui/icons';
import {Link} from 'react-router-dom';

import {useLocation} from 'react-router-dom';
import {
  editCompBuySell,
  getCompBuySellById,
} from '../../../service/masterModule/CompanyBuying&Selling';
import CountryDropdown from '../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../components/Dropdowns/CityDropdown';
import AddIndustryType from '../../components/ModalComponents/AddIndustryType';
import {getIndustryTypeList} from '../../../service/AllDrowpdownAPI';
import {AppHeader, AppSidebar} from '../../../components';
const UpdateCompanyBuySell = ({
  industryOptions,
  setIndustryOptions,
  handleListClick,
  handleEditClick,
}) => {
  const formikRef = useRef(null);
  const [pkBuySellId, setPkBuySellId] = useState(null);
  const [buySellData, setBuySellData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const location = useLocation();
  const {companyData} = location.state || {};

  console.log('Received Company Data:', companyData);
  console.log('Received pkBuySellId Data:', companyData.pkBuySellId);

  useEffect(() => {
    if (companyData && companyData.pkBuySellId) {
      console.log('Received pkBuySellId Data:', companyData.pkBuySellId);
      setPkBuySellId(companyData.pkBuySellId);
    }
  }, [companyData]);

  // Function to fetch infrastructure details by ID
  const fetchCompBuySellDataById = async pkBuySellId => {
    try {
      // setLoader(true); // Show loader
      const result = await getCompBuySellById(pkBuySellId); // API call

      console.log('Fetched result:', result);

      // Verify if result and infrastructureOnLease exist
      if (result && result.data) {
        setBuySellData(result.data); // Update state with infrastructureOnLease
      } else {
        console.warn(
          'infrastructureOnLease is not present in the result:',
          result,
        );
        setBuySellData(null); // Reset state to avoid stale data
      }
    } catch (error) {
      console.error('Error fetching company data by ID:', error);
      setBuySellData(null); // Reset state in case of error
    } finally {
      // setLoader(false); // Hide loader
    }
  };

  // Effect to fetch data when pkInfraId changes
  useEffect(() => {
    if (pkBuySellId) {
      fetchCompBuySellDataById(pkBuySellId);
    }
  }, [pkBuySellId]);

  // Effect to log infraData when it changes
  useEffect(() => {
    if (buySellData) {
      console.log('Updated CompanyBuySellData:', buySellData);
    }
  }, [buySellData]);
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

    // Filter valid image and document types (JPG, PNG, PDF, etc.)
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      swal({
        title: 'Warning',
        text: 'You can only upload JPG, PNG images, or PDF documents..',
        icon: 'warning',
        timer: 2000,
        buttons: false,
      });
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert('Each file must be less than 5MB.');
      return;
    }

    const readFilesAsBase64 = files.map(
      file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result); // Resolve with the base64 string
            } else {
              reject(new Error('File could not be read as base64'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file); // Convert file to base64
        }),
    );

    Promise.all(readFilesAsBase64)
      .then(base64Files => {
        setSelectedImages(prevImages => [...prevImages, ...base64Files]); // Add the new files to the selected images
      })
      .catch(error => {
        console.error('Error converting files to base64:', error);
      });
  };
  const removeImage = index => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  const validationSchema = Yup.object().shape({
    establistedYear: Yup.string()
      .required('Established year is required')
      .matches(/^\d{4}$/, 'Established year must be a valid year (e.g., 2023)')
      .test(
        'is-valid-year',
        'Year must be between 1900 and the current year',
        value => {
          const year = parseInt(value, 10);
          const currentYear = new Date().getFullYear();
          return year >= 1900 && year <= currentYear;
        },
      ),
    employees: Yup.number()
      .required('Number of employees is required')
      .positive('Number of employees must be a positive number')
      .integer('Number of employees must be a whole number'),
    reportedSales: Yup.number()
      .required('Reported sales is required')
      .positive('Reported sales must be a positive number'),
    runRateSales: Yup.number()
      .required('Run rate sales is required')
      .positive('Run rate sales must be a positive number'),
    listedByBusiness: Yup.string().required('Listed by business is required'),
    industryType: Yup.array()
      .required('Industry type is required')
      .min(1, 'Please select at least one industry type')
      .max(10, 'You can select up to 10 industry types'),
    ebitdaMargin: Yup.number()
      .required('EBITDA Margin is required')
      .min(0, 'EBITDA Margin must be at least 0')
      .max(100, 'EBITDA Margin cannot exceed 100'),
    countryName: Yup.array()
      .of(Yup.string().required('Country name is required'))
      .min(1, 'At least one country must be selected')
      .required('Country name is required'),
    stateName: Yup.array()
      .of(Yup.string().required('State name is required'))
      .min(1, 'At least one state must be selected')
      .required('State name is required'),
    cityName: Yup.array()
      .of(Yup.string().required('City name is required'))
      .min(1, 'At least one city must be selected')
      .required('City name is required'),
    targetCountryName: Yup.array()
      .of(Yup.string().required('Target country name is required'))
      .min(1, 'At least one target country must be selected')
      .required('Target country name is required'),
    targetIndustryName: Yup.array()
      .of(Yup.string().required('Target industry name is required'))
      .min(1, 'At least one target industry must be selected')
      .required('Target industry name is required'),
    targetCityName: Yup.array()
      .of(Yup.string().required('Target city name is required'))
      .min(1, 'At least one target city must be selected')
      .required('Target city name is required'),
    targetStateName: Yup.array()
      .of(Yup.string().required('Target state name is required'))
      .min(1, 'At least one target state must be selected')
      .required('Target state name is required'),
  });
  const initialValues = {
    industryType: buySellData?.companyBuyingSelling?.industryType || [],
    certificateType: buySellData?.certificateType || 'Company Buying',
    establistedYear: buySellData?.companyBuyingSelling?.establistedYear || '',
    employees: buySellData?.companyBuyingSelling?.employees || '',
    reportedSales: buySellData?.companyBuyingSelling?.reportedSales || '',
    runRateSales: buySellData?.companyBuyingSelling?.runRateSales || '',
    ebitdaMargin: buySellData?.companyBuyingSelling?.ebitdaMargin || '',
    listedByBusiness: buySellData?.companyBuyingSelling?.listedByBusiness || '',
    countryName: buySellData?.companyBuyingSelling?.countryName || [],
    stateName: buySellData?.companyBuyingSelling?.stateName || [],
    cityName: buySellData?.companyBuyingSelling?.cityName || [],
    uploadDocument: buySellData?.companyBuyingSelling?.uploadDocument || '',
    companyType: buySellData?.companyBuyingSelling?.companyType || '',
    targetIndustryType: buySellData?.targetedClient?.targetIndustryType || [],
    targetCountryName: buySellData?.targetedClient?.targetCountryName || [],
    targetStateName: buySellData?.targetedClient?.targetStateName || [],
    targetCityName: buySellData?.targetedClient?.targetCityName || [],
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
        <div className="card shadow">
          <Formik
            validationSchema={validationSchema}
            innerRef={formikRef}
            enableReinitialize={true}
            const
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              try {
                const companyId = sessionStorage.getItem('_id');

                if (!companyId) {
                  console.error('Company ID not found in session storage');
                  swal({
                    title: 'Error',
                    text: 'Company ID is missing. Please log in again.',
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                  return;
                }

                const companyType =
                  values.certificateType === 'Company Buying'
                    ? 'Buying'
                    : 'Selling';

                // Ensure at least one image is selected
                if (!selectedImages || selectedImages.length === 0) {
                  swal({
                    title: 'Warning',
                    text: 'Please upload at least one document.',
                    icon: 'warning',
                    timer: 2000,
                    buttons: false,
                  });
                  return;
                }

                const postData = {
                  pkBuySellId: pkBuySellId,
                  fkCompanyId: companyId,
                  companyBuyingSelling: {
                    countryName: values?.countryName || [],
                    stateName: values?.stateName || [],
                    industryType: values?.industryType || [],
                    cityName: values?.cityName || [],
                    establistedYear: values?.establistedYear || '',
                    employees: values?.employees || '',
                    reportedSales: values?.reportedSales || '',
                    runRateSales: values?.runRateSales || '',
                    ebitdaMargin: values?.ebitdaMargin || '',
                    listedByBusiness: values?.listedByBusiness || '',
                    companyType: values?.companyType || '',
                    uploadDocument: selectedImages?.[0] || '',
                  },
                  targetedClient: {
                    targetIndustryType: values?.targetIndustryType || [],
                    targetCountryName: values?.targetCountryName || [],
                    targetStateName: values?.targetStateName || [],
                    targetCityName: values?.targetCityName || [],
                  },
                };

                console.log(
                  'Submitting postData:',
                  JSON.stringify(postData, null, 2),
                );

                // Submit data
                const result = await editCompBuySell(postData);
                console.log('Submission result:', result);

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
                console.error('Error in submission:', error?.response || error);

                if (error?.response?.status === 400) {
                  const errorMessage =
                    error.response.data?.message || 'Invalid request!';
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
              } finally {
                // Reset the form and clear selected images
                actions.resetForm();
                setSelectedImages([]);
              }
            }}>
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
                        <strong>Company Want To Buy</strong>
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
                        <label
                          htmlFor="listedByBusiness"
                          className="form-label">
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
                          <option value="Private Limited">
                            Private Limited
                          </option>
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
                          placeholder="Select Country"
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
                          placeholder="Select State"
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

                <div>
                  <CCardHeader>
                    <strong>Targeted Client Industry</strong>
                  </CCardHeader>
                  <div>
                    <CRow className="align-items-center mb-3  px-4 mt-4">
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
                                    value={industryTypeOptions.filter(
                                      option =>
                                        (field.value || []).includes(
                                          option.value,
                                        ), // Ensure field.value is always an array
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
                              placeholder="Select Country"
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

                    <CRow className="align-items-center mb-3  px-4">
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
                              placeholder="Select State"
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

                    <div className="col-md-4 col-sm-6 mb-3 px-3">
                      <CButton
                        type="submit"
                        className="btn btn-success custom-btn shadow">
                        Submit
                      </CButton>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateCompanyBuySell;
