import {
  CCardHeader,
  CCardBody,
  CCard,
  CButton,
  CCol,
  CRow,
} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import CreatableSelect from 'react-select/creatable';
import CIcon from '@coreui/icons-react';
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
import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {AppHeader, AppSidebar} from '../../../components';
const ProductDetail = () => {
  const [video, setVideo] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const {state} = useLocation(); // Access the state passed from Link
  const {index} = useParams();
  const ProductDetails = state?.ProductDetails || null;
  const initialValues = {
    gstNo: ProductDetails?.gstNo || '',
    productName: ProductDetails?.productName || '',
    hsnCode: ProductDetails?.hsnCode || '',
    sacCode: ProductDetails?.sacCode || '',
    keyword: ProductDetails?.keyword || [],
    materialType: ProductDetails?.materialType || [],
    industryType: ProductDetails?.industryType || [],
    description: ProductDetails?.description || '',
  };

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
      <AppHeader />
      <AppSidebar />
      <div
        style={{
          paddingLeft: '284px',
          paddingRight: '26px',
          paddingTop: '11px',
        }}>
        <div className="mb-2">
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Product Details</strong>
              <Link to="/master/myProduct">
                <CButton color="primary">Back</CButton>
              </Link>
            </CCardHeader>

            <div className="card-body">
              <Formik
                initialValues={initialValues}
                onSubmit={async (values, actions) => {
                  const companyId = sessionStorage.getItem('_id');

                  const Username = sessionStorage.getItem('userName');
                  const pkProductId = sessionStorage.getItem('pkProductId');
                  console.log('companyId found in sessionStorage', companyId);
                  console.log('companyId found in sessionStorage', Username);

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

                      productDetails: [
                        {
                          pkProductId: pkProductId,
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
                    console.log('Add postProduct Details :-', postData);
                    const result = await editProductDetails(postData);
                    console.log('Add postProduct Details :-', result);

                    setSelectedImages([]);

                    setSubmittedData(prevData => [...prevData, values]);
                    updateProgress();
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
                              <CIcon icon={cilBasket} size="lg" />
                            </CCol>
                            <CCol md={3} className="pl-1">
                              <label
                                htmlFor="productName"
                                className="form-label">
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
                        </CCol>
                        <CCol md={6}>
                          <CRow className="align-items-center mb-3">
                            <CCol md={1} className="pr-0">
                              <CIcon icon={cilDescription} size="lg" />
                            </CCol>
                            <CCol md={3} className="pl-1">
                              <label
                                htmlFor="description"
                                className="form-label">
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
                              <label
                                htmlFor="industryType"
                                className="form-label">
                                Industry Type
                              </label>
                            </CCol>

                            <CCol md={8}>
                              <Field
                                name="industryType"
                                type="text"
                                className="form-control"
                                placeholder="Enter Industry Type"
                              />
                              <ErrorMessage
                                name="description"
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
                              <label
                                htmlFor="materialType"
                                className="form-label">
                                Material Type
                              </label>
                            </CCol>

                            <CCol md={8}>
                              <Field
                                name="materialType"
                                type="text"
                                className="form-control"
                                placeholder="Enter Material Type"
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
                              placeholder="Enter Keywords"
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
                              <label
                                htmlFor="certiPhoto"
                                className="form-label">
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
                                  disabled={selectedImages.length >= 5}
                                />
                                <div className="image-preview-container">
                                  {selectedImages.map((image, index) => (
                                    <div
                                      key={index}
                                      className="image-preview"
                                      style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        margin: '10px',
                                      }}>
                                      <img
                                        src={image}
                                        alt={`Selected ${index}`}
                                        style={{
                                          width: '50px',
                                          height: '50px',
                                          objectFit: 'cover',
                                        }}
                                      />
                                      <button
                                        style={{
                                          backgroundColor: 'red',
                                          color: 'white',
                                          border: 'none',
                                          padding: '5px',
                                          cursor: 'pointer',
                                          borderRadius: '50%',
                                          fontSize: '12px',
                                          position: 'absolute',
                                          top: '-5px',
                                          right: '-5px',
                                          width: '20px',
                                          height: '20px',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                        onClick={() => removeImage(index)}>
                                        X
                                      </button>
                                    </div>
                                  ))}
                                </div>
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
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                              />
                              {video && (
                                <video
                                  width="300"
                                  height="200"
                                  controls
                                  style={{marginTop: '10px'}}>
                                  <source
                                    src={URL.createObjectURL(video)}
                                    type={video.type}
                                  />
                                </video>
                              )}
                            </CCol>
                          </CRow>
                        </CCol>
                      </CRow>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </CCard>
        </div>{' '}
      </div>
    </>
  );
};

export default ProductDetail;
