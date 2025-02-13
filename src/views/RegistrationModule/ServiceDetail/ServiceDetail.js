import {CCardHeader, CContainer, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CreatableSelect from 'react-select/creatable';
import CIcon from '@coreui/icons-react';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';
import {
  cilCreditCard,
  cilBasket,
  cilTags,
  cilBriefcase,
  cilPlus,
  cilIndustry,
  cilImage,
  cilVideo,
  cilDescription,
  cilTrash,
} from '@coreui/icons';
import ServiceDetailList from './ServiceDetailList';
import {getIndustryTypeList} from '../../../service/AllDrowpdownAPI';
import {postServiceDetails} from '../../../service/RegistrationModule/ServiceDetailsAPIs';

const ServiceDetail = () => {
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState('');
  const [formValues, setFormValues] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [isPrimary, setisPrimary] = useState();
  const [showTable, setShowTable] = useState(false);
  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const [video, setVideo] = useState(null);

  const validationSchema = Yup.object().shape({
    serviceName: Yup.string().required('Required'),
    subServiceName: Yup.string().required('Required'),
    industryType: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),

    keyword: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    description: Yup.string().required('Required'),
    referenceClient: Yup.string().required('Required'),
  });

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

  // Handle the file selection
  const handleVideoChange = event => {
    const file = event.target.files[0];
    setVideo(file);
  };
  const handleListClick = () => {
    setShowTable(prev => !prev);
  };

  const removeImage = index => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleImageChange = event => {
    const files = Array.from(event.target.files);

    if (files.length + selectedImages.length > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }

    const readImagesAsBase64 = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            const mimeType = file.type;
            const base64Data = reader.result.split(',')[1];
            const formattedBase64 = `data:${mimeType};base64,${base64Data}`;
            resolve(formattedBase64);
          } else {
            reject(new Error('File could not be read as base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readImagesAsBase64)
      .then(base64Images => {
        setSelectedImages(prevImages => [...prevImages, ...base64Images]);
        console.log('Updated selectedImages array:', base64Images);
      })
      .catch(error => {
        console.error('Error converting images to base64:', error);
      });
  };

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="mb-3">
          <strong>Service Details</strong>
        </CCardHeader>

        <div className="card-body">
          <Formik
            innerRef={formikRef}
            validationSchema={validationSchema}
            initialValues={{
              serviceName: '',
              subServiceName: '',
              industryType: '',
              description: '',
              keyword: '',
              referenceClient: '',
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
                  percentage: '54',
                  serviceDetails: [
                    {
                      serviceName: values.serviceName,
                      subServiceName: values.subServiceName,
                      industryType: values.industryType,
                      description: values.description,
                      keyword: values.keyword,
                      referenceClient: values.referenceClient,
                      serviceImage: formattedImages,
                      vedio: ['', ''],
                    },
                  ],
                };
                console.log(
                  'Submitting postData:',
                  JSON.stringify(postData, null, 2),
                );
                const result = await postServiceDetails(postData);
                console.log('Add Service Details :-', result);
                if (result.status === 200 && result.data) {
                  console.log('Add Department Result:', result);

                  // Extract `pkServiceId` from the response
                  const responseData = result.data.split(', ');
                  const pkServiceIdKeyValue = responseData.find(item =>
                    item.startsWith('pkServiceId:'),
                  );
                  const pkServiceId = pkServiceIdKeyValue?.split(':')[1];

                  if (pkServiceId) {
                    console.log('Extracted pkServiceId:', pkServiceId);

                    // Store `pkServiceId` in sessionStorage
                    sessionStorage.setItem('pkServiceId', pkServiceId);

                    setSelectedImages([]);

                    swal({
                      title: 'Great',
                      text: 'Department User Created Successfully',
                      icon: 'success',
                      timer: 2000,
                      buttons: false,
                    });
                  } else {
                    throw new Error('pkDeptId not found in response');
                  }
                } else {
                  throw new Error('Unexpected response format or status');
                }
              } catch (error) {
                console.error(
                  'Add Department Error:',
                  error?.response || error,
                );

                // Handle specific error scenarios
                if (error?.response?.status === 400) {
                  swal({
                    title: 'Warning',
                    text: error?.response?.data?.message || 'Invalid input!',
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
                // Reset the form
                actions.resetForm();
              }
            }}>
            {({values, setFieldValue, handleSubmit}) => {
              const handleInputChange = e => {
                const value = e.target.value;
                const formattedValue = value
                  .split(',')
                  .map(item => item.trim());
                setFieldValue('keyword', formattedValue);
              };
              return (
                <Form onSubmit={handleSubmit}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilBriefcase} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="serviceName" className="form-label">
                            Service Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="serviceName"
                            type="text"
                            className="form-control"
                            placeholder="Enter Service Name"
                          />
                          <ErrorMessage
                            name="serviceName"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilBriefcase} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label
                            htmlFor="subServiceName"
                            className="form-label">
                            Sub Service Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="subServiceName" // Ensure the field name matches the form data object
                            type="text"
                            className="form-control"
                            placeholder="Enter Sub Service Name"
                          />
                          <ErrorMessage
                            name="subServiceName"
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
                              <CreatableSelect
                                isMulti
                                name={field.name} // Formik field name
                                value={industryTypeOptions.filter(option =>
                                  field.value.includes(option.value),
                                )} // Show selected options
                                options={industryTypeOptions} // Available options
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={selected => {
                                  // Limit selection to 10 items
                                  if (selected && selected.length > 10) {
                                    alert(
                                      'You can select only up to 10 options.',
                                    );
                                    return;
                                  }
                                  // Update Formik field value when an option is selected
                                  form.setFieldValue(
                                    field.name,
                                    selected
                                      ? selected.map(option => option.value)
                                      : [],
                                  );
                                }}
                                onCreateOption={inputValue => {
                                  // Check if the current number of selected items is already 10
                                  if (field.value.length >= 10) {
                                    alert(
                                      'You can select only up to 10 options.',
                                    );
                                    return;
                                  }

                                  // Create a new option from the input value
                                  const newOption = {
                                    label: inputValue,
                                    value: inputValue,
                                  };

                                  // Add the new option to the options list
                                  setIndustryTypeOptions(prevOptions => [
                                    ...prevOptions,
                                    newOption,
                                  ]);

                                  // Update the field value in Formik
                                  form.setFieldValue(field.name, [
                                    ...field.value, // Keep existing values
                                    inputValue, // Add the new input value
                                  ]);
                                }}
                              />
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
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilDescription} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="description"
                            type="text"
                            className="form-control"
                            placeholder="Enter Description"
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

                  <CRow className="align-items-center mb-3">
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilTags} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="keyword" className="form-label">
                            Keywords
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="keyword"
                            type="text"
                            className="form-control"
                            placeholder="Enter Multiple Keywords (comma-separated)"
                            onChange={handleInputChange}
                          />
                          <ErrorMessage
                            name="keyword"
                            component="div"
                            className="text-danger"
                          />
                          {/* <div className="mt-2">
                          <strong>Current Value:</strong>{" "}
                          {JSON.stringify(values.keyword)}
                        </div> */}
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
                            htmlFor="referenceClient"
                            className="form-label">
                            Reference Client
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="referenceClient"
                            type="text"
                            className="form-control"
                            placeholder="Enter Reference Client"
                          />
                          <ErrorMessage
                            name="referenceClient"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>{' '}
                  </CRow>

                  <CRow className="align-items-center mb-3">
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

                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilVideo} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="video" className="form-label">
                            Upload Video
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <div className="image-uploader">
                            <input
                              type="file"
                              accept="image/*"
                              // onChange={handleImageChange}
                              multiple
                              className="form-control"
                              disabled={selectedImages.length >= 5}
                            />
                            <small className="text-muted d-block mt-1">
                              Please upload up to 2 video (maximum size: 5MB).
                            </small>
                          </div>
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

                    <Link to="/infrastructure-detail">
                      <button className="btn btn-secondary custom-btn shadow">
                        Skip
                      </button>
                    </Link>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      {showTable && <ServiceDetailList />}
    </>
  );
};

export default ServiceDetail;
