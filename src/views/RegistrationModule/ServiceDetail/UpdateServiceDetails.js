import {CCardHeader, CContainer, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CreatableSelect from 'react-select/creatable';
import CIcon from '@coreui/icons-react';
import {Link, useLocation, useParams} from 'react-router-dom';
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
import {getIndustryTypeList} from '../../../service/AllDrowpdownAPI';
import {editServiceDetails} from '../../../service/RegistrationModule/ServiceDetailsAPIs';

const UpdateServiceDetails = () => {
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const [video, setVideo] = useState(null);
  const {state} = useLocation(); // Access the state passed from Link
  const {index} = useParams(); // Access the index from the route parameters

  // Fetch director details from state or default to null
  const ServiceDetail = state?.ServiceDetail || null;

  const initialValues = {
    referenceClient: ServiceDetail?.referenceClient || '',
    serviceName: ServiceDetail?.serviceName || '',
    subServiceName: ServiceDetail?.subServiceName || '',
    industryType: ServiceDetail?.industryType || [], // Array of values
    description: ServiceDetail?.description || '',
    keyword: ServiceDetail?.keyword || '',
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
            // validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('fkCompanyId');
              const pkServiceId = sessionStorage.getItem('pkServiceId');
              console.log(
                'companyId found in sessionStorage',
                companyId,
                pkServiceId,
              );

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

                  serviceDetails: [
                    {
                      pkServiceId: pkServiceId,
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
                const result = await editServiceDetails(postData);
                console.log('Add Service Details :-', result);

                setSelectedImages([]);

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
                console.error('add GST error :-', error?.response || error);
                if (error?.response?.status === 400) {
                  swal({
                    title: 'Warning',
                    text: result.data,
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
                            placeholder="Enter Keywords (comma-separated)"
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
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateServiceDetails;
