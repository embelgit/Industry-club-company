import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CreatableSelect from 'react-select/creatable';
import CIcon from '@coreui/icons-react';
import {
  cilCreditCard,
  cilBasket,
  cilPlus,
  cilIndustry,
  cilImage,
  cilVideo,
} from '@coreui/icons';
import {CRow, CCol, CButton, CCardHeader} from '@coreui/react';
import {
  getIndustryTypeList,
  getMaterialTypeList,
} from '../../../service/AllDrowpdownAPI';
import {postProductPromotion} from '../../../service/masterModule/ProductPromotion';
import AddIndustryType from '../../components/ModalComponents/AddIndustryType';
import AddMaterialType from '../../components/ModalComponents/AddMaterialType';
import CountryDropdown from '../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../components/Dropdowns/CityDropdown';

const AddProductPromotion = ({handleListClick}) => {
  const [progress, setProgress] = useState(40);
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  const [industryTypeOptions, setindustryTypeOptions] = useState([]);
  const [video, setVideo] = useState(null);
  const handleOpenModal = type => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

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

  const [blastingType, setBlastingType] = useState([
    {label: 'New Sales', value: 'New Sales'},
    {label: 'New Purchase', value: 'New Purchase'},
    {label: 'Old Sales', value: 'Old Sales'},
    {label: 'Old Purchase', value: 'Old Purchase'},
  ]);

  // Handle the file selection
  const handleVideoChange = event => {
    const file = event.target.files[0];
    if (file && file.type.includes('video')) {
      setSelectedVideo(file);
      setVideoUrl(URL.createObjectURL(file)); // Create a URL for the video file
    } else {
      alert('Please select a valid video file.');
    }
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

  const removeImage = index => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  return (
    <div style={{flex: '1', padding: '0px', overflowY: 'auto'}}>
      <div className="card">
        <CCardHeader>
          <strong>Blasting Message</strong>
        </CCardHeader>

        <div className="card-body">
          <Formik
            innerRef={formikRef}
            initialValues={{
              fkCompanyId: '',
              productPromotion: {
                industryType: [],
                blastingType: '',
                productDetails: '',
                usedFor: '',
                countryName: [],
                stateName: [],
                cityName: [],
                materialType: [],
                images: '',
                vedio: 'null',
                createdBy: '',
              },
            }}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('_id');
              const userName = sessionStorage.getItem('userName');
              console.log('userName found in sessionStorage 2', userName);
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
              if (!userName) {
                console.error('userName not found in session storage');
                swal({
                  title: 'Error',
                  text: 'userName is missing.',
                  icon: 'error',
                  timer: 2000,
                  buttons: false,
                });
                return;
              }

              const formattedImages = selectedImages.map(image => {
                if (image.startsWith('data:image/')) return image.trim();
                return '';
              });
              const postData = {
                fkCompanyId: companyId,
                productPromotion: {
                  createdBy: userName,
                  industryType: values.industryType,
                  blastingType: values.blastingType,
                  productDetails: values.productDetails,
                  usedFor: values.usedFor,
                  countryName: values.countryName,
                  stateName: values.stateName,
                  materialType: values.materialType,
                  cityName: values.cityName,
                  images: formattedImages,
                  vedio: 'null',
                },
                targetedCilent: {
                  targetCountryName: values.targetedCountryName,
                  targetIndustryName: values.targetedIndustryType,
                  targetCityName: values.targetedCityName,
                  targetStateName: values.targetedStateName,
                  createdBy: userName,
                },
              };

              try {
                console.log(
                  'Submitting postData:',
                  JSON.stringify(postData, null, 2),
                );

                const result = await postProductPromotion(postData);
                console.log('Submission result:', result);

                if (result.status === 200) {
                  const pkPromotionId = result.data.pkPromotionId;
                  console.log('pkPromotionId', pkPromotionId);
                  sessionStorage.setItem('pkPromotionId', pkPromotionId);
                  swal({
                    title: 'Success',
                    text: result.data.sms,
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });

                  actions.resetForm();
                }
              } catch (error) {
                console.error('Error in submission:', error?.response || error);

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
            {({handleSubmit, values, setFieldValue}) => (
              <Form onSubmit={handleSubmit}>
                <CRow className="align-items-center mb-3">
                  {/* Product Name */}

                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilBasket} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="blastingType" className="form-label">
                          Blasting Type
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field name="blastingType">
                          {({field, form}) => (
                            <div className="d-flex">
                              <CreatableSelect
                                isMulti
                                name={field.name} // Formik field name
                                value={blastingType.filter(
                                  option =>
                                    (field.value || '')
                                      .split(',')
                                      .includes(option.value), // Match the selected options
                                )}
                                options={blastingType} // Available options
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
                                  // Update Formik field value as a comma-separated string
                                  form.setFieldValue(
                                    field.name,
                                    selected
                                      ? selected
                                          .map(option => option.value)
                                          .join(',')
                                      : '',
                                  );
                                }}
                                onCreateOption={inputValue => {
                                  // Check if the current number of selected items is already 10
                                  if (
                                    (field.value || '').split(',').length >= 10
                                  ) {
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
                                  setBlastingType(prevOptions => [
                                    ...prevOptions,
                                    newOption,
                                  ]);

                                  // Update the field value in Formik as a comma-separated string
                                  form.setFieldValue(
                                    field.name,
                                    [
                                      ...(field.value
                                        ? field.value.split(',')
                                        : []),
                                      inputValue,
                                    ].join(','),
                                  );
                                }}
                                styles={{
                                  container: provided => ({
                                    ...provided,
                                    width: '100%', // Adjust width to full
                                  }),
                                }}
                              />
                              <CCol md={1} className="pr-0"></CCol>
                            </div>
                          )}
                        </Field>

                        <ErrorMessage
                          name="blastingType"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        {/* <CIcon icon={cilCreditCard} size="lg" /> */}
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="hsncode" className="form-label">
                          Product Details
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="hsncode"
                          type="text"
                          className="form-control"
                          placeholder="Enter Product Details"
                        />
                        <ErrorMessage
                          name="hsncode"
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
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilCreditCard} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="sacCode" className="form-label">
                          Used For
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="sacCode"
                          type="text"
                          className="form-control"
                          placeholder="Enter Used For"
                        />
                        <ErrorMessage
                          name="sacCode"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
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
                </CRow>
                <CRow className="align-items-center mb-2">
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
                            htmlFor="targetedIndustryType"
                            className="form-label">
                            Industry Type
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field name="targetedIndustryType">
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
                            name="targetedIndustryType"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>

                    {modalType === 'industry' && (
                      <AddIndustryType
                        isOpen={modalType === 'industry'}
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
                            htmlFor="targetedCountryName"
                            className="form-label">
                            Country Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <CountryDropdown
                            setFieldValue={setFieldValue}
                            values={values}
                            name="targetedCountryName"
                          />
                          <ErrorMessage
                            name="targetedCountryName"
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
                            htmlFor="targetedStateName"
                            className="form-label">
                            State Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <StateDropdown
                            setFieldValue={setFieldValue}
                            values={values}
                            name="targetedStateName"
                            countryName={values.countryName}
                          />
                          <ErrorMessage
                            name="targetedStateName"
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
                            htmlFor="targetedCityName"
                            className="form-label">
                            City Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <CityDropdown
                            setFieldValue={setFieldValue}
                            values={values}
                            name="targetedCityName"
                            stateName={values.stateName}
                          />
                          <ErrorMessage
                            name="targetedCityName"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </div>
                {/* Submit Button */}
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
      </div>
    </div>
  );
};

export default AddProductPromotion;
