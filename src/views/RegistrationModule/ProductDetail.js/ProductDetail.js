import {CCardHeader, CRow, CCol, CButton} from '@coreui/react';
import {FaDownload} from 'react-icons/fa';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CreatableSelect from 'react-select/creatable';
import CIcon from '@coreui/icons-react';
import Select from 'react-select';
import {
  cilCreditCard,
  cilBasket,
  cilTags,
  cilBuilding,
  cilPlus,
  cilIndustry,
  cilImage,
  cilVideo,
  cilPencil,
  cilTrash,
  cilDescription,
} from '@coreui/icons';

import * as Yup from 'yup';
import ProductDetailList from './ProductDetailList';
import AddMaterialType from '../../components/ModalComponents/AddMaterialType';
import AddIndustryType from '../../components/ModalComponents/AddIndustryType';
import {
  getIndustryTypeList,
  getMaterialTypeList,
  getProductNameList,
} from '../../../service/AllDrowpdownAPI';
import {postProductDetails} from '../../../service/RegistrationModule/ProductDetailsAPIs';
import AddProductType from '../../components/ModalComponents/AddProductType';

const ProductDetail = () => {
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [video, setVideo] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);

  // Handle Download Excel
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(blob, 'Products.xlsx'); // Download the file
  };

  // Handle Upload Excel
  const handleUploadExcel = event => {
    const file = event.target.files[0];
  };

  const handleOpenModal = type => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Required'),
    hsnCode: Yup.string().required('Required'),
    sacCode: Yup.string().required('Required'),
    industryType: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    materialType: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    keyword: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    description: Yup.string().required('Required'),
  });

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
      const companyId = sessionStorage.getItem('_id');
      console.log('companyId found in sessionStorage:', companyId);

      if (!companyId) {
        console.error('No companyId found in sessionStorage');
        return;
      }

      const productData = await getProductNameList(companyId);
      if (productData && Array.isArray(productData)) {
        setProductOptions(
          productData.map(data => ({
            label: data,
            value: data,
          })),
        );
      }
    };

    fetchProductNameOptions();
  }, []);

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
        {/* <CCardHeader className="mb-3">
              <strong>Product Details</strong>
            </CCardHeader> */}

        <CCardHeader className="mb-3 d-flex justify-content-between align-items-center">
          <strong>Product Details</strong>
          {/* <div>
                <button
                  className="btn btn-success me-2 "
                  onClick={handleDownloadExcel}>
                  <FaDownload className="me-1" />
                </button>
                <label className="btn btn-primary btn-sm mb-0">
                  Upload Excel
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    style={{display: 'none'}}
                    onChange={handleUploadExcel}
                  />
                </label>
              </div> */}
        </CCardHeader>

        <div className="card-body">
          <Formik
            innerRef={formikRef}
            validationSchema={validationSchema}
            initialValues={{
              _id: '',
              productName: '',
              hsnCode: '',
              sacCode: '',
              keyword: [],
              materialType: [],
              industryType: [],
              image: [],
              vedio: [],
              createdBy: '',
              description: '',
            }}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('fkCompanyId');
              const Username = sessionStorage.getItem('userName');

              console.log('Company ID found in sessionStorage:', companyId);
              console.log('Username found in sessionStorage:', Username);

              // Format selected images for submission
              const formattedImages = selectedImages.map(image =>
                image.startsWith('data:image/') ? image.trim() : '',
              );
              console.log(
                'Formatted Images Array for submission:',
                formattedImages,
              );

              try {
                // Prepare the payload for submission
                const postData = {
                  _id: companyId,
                  percentage: '45',
                  productDetails: [
                    {
                      productName: values.productName,
                      hsnCode: values.hsnCode,
                      sacCode: values.sacCode,
                      keyword: values.keyword,
                      materialType: values.materialType,
                      industryType: values.industryType,
                      image: formattedImages,
                      vedio: ['', ''],
                      createdBy: Username,
                      description: values.description,
                    },
                  ],
                };

                console.log('Payload for postProductDetails:', postData);

                // Make the API call
                const result = await postProductDetails(postData);

                console.log('API Response for postProductDetails:', result);

                if (result.status === 200 && result.data) {
                  const responseMessage = result.data;

                  // Extract `pkProductId` using regex
                  const pkProductIdMatch = responseMessage.match(
                    /pkProductId:([a-zA-Z0-9]+)/,
                  );
                  const pkProductId = pkProductIdMatch
                    ? pkProductIdMatch[1]
                    : null;

                  if (pkProductId) {
                    console.log('Extracted pkProductId:', pkProductId);
                    sessionStorage.setItem('pkProductId', pkProductId);
                    const message = result.data
                      .split(',')[0]
                      .split(':')[1]
                      .trim();
                    // Display success message
                    swal({
                      title: 'Great',
                      text: message,
                      icon: 'success',
                      timer: 2000,
                      buttons: false,
                    });
                  }
                } else {
                  console.error('Unexpected API response:', result);
                  throw new Error('Unexpected response structure or status.');
                }

                // Reset selected images
                setSelectedImages([]);

                // Update submitted data
                setSubmittedData(prevData => [...prevData, values]);
              } catch (error) {
                console.error('add Product :-', error?.response || error);

                if (error?.response?.status === 409) {
                  const errorMessage = error?.response?.data || 'Unknown error'; // Extract error message

                  swal({
                    title: 'Warning',
                    text: errorMessage, // Use the extracted error message
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
                // Your final cleanup or logic here
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
                    {/* <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilBasket} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="productName" className="form-label">
                            Product Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="productName"
                            type="text"
                            className="form-control"
                            placeholder="Enter Product Name"
                          />
                          <ErrorMessage
                            name="productName"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol> */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilBasket} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="productName" className="form-label">
                            Product Name
                          </label>
                        </CCol>
                        <CCol md={7}>
                          <CRow className="align-items-center">
                            <CCol md={11}>
                              <Select
                                options={productOptions}
                                onChange={selectedOption =>
                                  setFieldValue(
                                    'productName',
                                    selectedOption.value,
                                  )
                                }
                                placeholder="Select Product Name"
                                className="w-100"
                              />
                            </CCol>
                            <CCol md={1} className="text-right">
                              <button
                                type="button"
                                className="btn btn-light btn-sm"
                                onClick={() => handleOpenModal('product')}>
                                <CIcon icon={cilPlus} size="lg" />
                              </button>
                            </CCol>
                          </CRow>
                        </CCol>

                        <ErrorMessage
                          name="productName"
                          component="div"
                          className="text-danger"
                        />
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
                          <CIcon icon={cilCreditCard} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="hsnCode" className="form-label">
                            HSN Code
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="hsnCode"
                            type="text"
                            className="form-control"
                            placeholder="Enter HSN Code"
                          />
                          <ErrorMessage
                            name="hsnCode"
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
                          <label htmlFor="sacCode" className="form-label">
                            SAC Code
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="sacCode"
                            type="text"
                            className="form-control"
                            placeholder="Enter SAC Code"
                          />
                          <ErrorMessage
                            name="sacCode"
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
                    {modalType === 'product' && (
                      <AddProductType
                        isOpen={modalType === 'product'}
                        onClose={handleCloseModal}
                        productTypeOptions={productTypeOptions}
                        setProductTypeOptions={setProductTypeOptions}
                      />
                    )}
                  </CRow>

                  <CCol md={6}>
                    <CRow className="align-items-center mb-4">
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
                      </CCol>
                    </CRow>
                  </CCol>
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
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      {showTable && <ProductDetailList />}
    </>
  );
};

export default ProductDetail;
