// import {
//   CCardHeader,
//   CRow,
//   CCol,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableBody,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
// } from '@coreui/react';
// import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
// import React, {useState, useRef, useEffect} from 'react';
// import Select from 'react-select';
// import {
//   cilCreditCard,
//   cilLocationPin,
//   cilTag,
//   cilBuilding,
//   cilPencil,
//   cilTrash,
//   cilVideo,
//   cilImage,
//   cilFactory,
//   cilSettings,
//   cilFile,
//   cilDescription,
// } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';
// import {Link, useLocation, useParams} from 'react-router-dom';
// import * as Yup from 'yup';
// import {
//   getInfrastructureDetails,
//   UpdateInfrastructureDetail,
// } from '../../../service/RegistrationModule/InfrastructureDetails';

// const UpdateInfrastructureDetails = () => {
//   const {state} = useLocation();
//   const {index} = useParams();

//   const [formValues, setFormValues] = useState({});
//   const formikRef = useRef(null);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [submittedData, setSubmittedData] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [video, setVideo] = useState(null);
//   const InfrastructureDetails = state?.InfrastructureDetails || null;

//   const initialValues = {
//     equipmentType: InfrastructureDetails?.equipmentType || '',
//     totalEquipment: InfrastructureDetails?.totalEquipment || '',
//     description: InfrastructureDetails?.description || '',
//     areaOfFactory: InfrastructureDetails?.areaOfFactory || '',
//     infraAddress: InfrastructureDetails?.infraAddress || '',
//   };

//   const handleImageChange = event => {
//     const files = Array.from(event.target.files);

//     if (files.length + selectedImages.length > 5) {
//       alert('You can only upload a maximum of 5 images.');
//       return;
//     }

//     const readImagesAsBase64 = files.map(file => {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           if (typeof reader.result === 'string') {
//             const mimeType = file.type;
//             const base64Data = reader.result.split(',')[1];
//             const formattedBase64 = `data:${mimeType};base64,${base64Data}`;
//             resolve(formattedBase64);
//           } else {
//             reject(new Error('File could not be read as base64'));
//           }
//         };
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(readImagesAsBase64)
//       .then(base64Images => {
//         setSelectedImages(prevImages => [...prevImages, ...base64Images]);
//         console.log('Updated selectedImages array:', base64Images);
//       })
//       .catch(error => {
//         console.error('Error converting images to base64:', error);
//       });
//   };

//   // Handle the file selection
//   const handleVideoChange = event => {
//     const file = event.target.files[0];
//     setVideo(file);
//   };

//   const removeImage = index => {
//     setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
//   };

//   const handleListClick = () => {
//     setShowTable(prev => !prev);
//   };

//   const handleSubmit = async (values, actions) => {
//     const companyId = sessionStorage.getItem('_id');

//     if (!companyId) {
//       console.error('Company ID not found in session storage');
//       return;
//     }

//     const formattedImages = selectedImages.map(image => {
//       if (image.startsWith('data:image/')) return image.trim();
//       return '';
//     });

//     console.log('Formatted Images Array for submission:', formattedImages);

//     const postData = {
//       _id: companyId,
//       index: index,
//       infrastructureDetails: [
//         {
//           equipmentType: values.equipmentType,
//           totalEquipment: values.totalEquipment,
//           description: values.description,
//           areaOfFactory: values.areaOfFactory,
//           infraAddress: values.infraAddress,
//           infraImage: formattedImages,
//           infraVideo: 'null',
//         },
//       ],
//     };

//     try {
//       console.log('Submitting postData: ', postData);
//       const result = await UpdateInfrastructureDetail(postData);
//       console.log('Infrastructure Details result: ', result);
//       if (result.status === 200) {
//         swal({
//           title: 'Great',
//           text: result.data,
//           icon: 'success',
//           timer: 2000,
//           buttons: false,
//         });
//       }
//       updateProgress();
//     } catch (error) {
//       console.error(
//         'Error in adding inftastructure details:',
//         error?.response || error,
//       );
//       if (error?.response?.status === 400) {
//         swal({
//           title: 'Warning',
//           text: result.data,
//           icon: 'warning',
//           timer: 2000,
//           buttons: false,
//         });
//         setSubmittedData(prevData => [...prevData, values]);
//       } else {
//         swal({
//           title: 'Error',
//           text: 'Something went wrong!',
//           icon: 'error',
//           timer: 2000,
//           buttons: false,
//         });
//       }
//     } finally {
//       actions.resetForm();
//     }
//   };

//   const fetchInfrastructureDetails = async companyId => {
//     try {
//       const result = await getInfrastructureDetails(companyId);
//       console.log('get Director Details result:', result);
//       console.log('get Director Details result:', result.data.content);
//       setSubmittedData(result.data.content);
//     } catch (error) {
//       console.error('Error fetching  Director Details:', error);
//     }
//   };

//   useEffect(() => {
//     const companyId = sessionStorage.getItem('_id');
//     console.log('companyId found in sessionStorage', companyId);

//     if (companyId) {
//       fetchInfrastructureDetails(companyId);
//     } else {
//       console.error('No companyId found in sessionStorage');
//     }
//   }, []);
//   return (
//     <>
//       <div className="card shadow mb-2 card-mt-fix">
//         <CCardHeader className=" mb-4">
//           <strong>Infrastructure Details</strong>
//         </CCardHeader>
//         <div className="card-body">
//           <Formik
//             initialValues={initialValues}
//             // validationSchema={validationSchema}
//             onSubmit={handleSubmit}>
//             {formik => (
//               <Form>
//                 <CRow className="align-items-center mb-3">
//                   <CCol md={6}>
//                     <CRow className="align-items-center mb-3">
//                       <CCol md={1} className="pr-0">
//                         <CIcon icon={cilSettings} size="lg" />
//                       </CCol>
//                       <CCol md={3} className="pl-1">
//                         <label htmlFor="equipmentType" className="form-label">
//                           Equipment Type
//                         </label>
//                       </CCol>
//                       <CCol md={8}>
//                         <Field
//                           name="equipmentType"
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Equipment Type"
//                         />
//                         <ErrorMessage
//                           name="equipmentType"
//                           component="div"
//                           className="text-danger"
//                         />
//                       </CCol>
//                     </CRow>
//                   </CCol>
//                   <CCol md={6}>
//                     <CRow className="align-items-center mb-3">
//                       <CCol md={1} className="pr-0">
//                         <CIcon icon={cilSettings} size="lg" />
//                       </CCol>
//                       <CCol md={3} className="pl-1">
//                         <label htmlFor="totalEquipment" className="form-label">
//                           Total Equipment
//                         </label>
//                       </CCol>
//                       <CCol md={8}>
//                         <Field
//                           name="totalEquipment"
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Total No of Machines"
//                         />
//                         <ErrorMessage
//                           name="totalEquipment"
//                           component="div"
//                           className="text-danger"
//                         />
//                       </CCol>
//                     </CRow>
//                   </CCol>
//                 </CRow>

//                 <CRow className="align-items-center mb-3">
//                   <CCol md={6}>
//                     <CRow className="align-items-center mb-3">
//                       <CCol md={1} className="pr-0">
//                         <CIcon icon={cilDescription} size="lg" />
//                       </CCol>
//                       <CCol md={3} className="pl-1">
//                         <label htmlFor="description" className="form-label">
//                           Description
//                         </label>
//                       </CCol>
//                       <CCol md={8}>
//                         <Field
//                           name="description"
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Description"
//                         />
//                         <ErrorMessage
//                           name="description"
//                           component="div"
//                           className="text-danger"
//                         />
//                       </CCol>
//                     </CRow>
//                   </CCol>
//                 </CRow>

//                 <CRow className="align-items-center mb-3">
//                   <CCol md={6}>
//                     <CRow className="align-items-center mb-3">
//                       <CCol md={1} className="pr-0">
//                         <CIcon icon={cilFactory} size="lg" />
//                       </CCol>
//                       <CCol md={3} className="pl-1">
//                         <label htmlFor="areaOfFactory" className="form-label">
//                           Area of Factory
//                         </label>
//                       </CCol>
//                       <CCol md={8}>
//                         <Field
//                           name="areaOfFactory"
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Area of Factory"
//                         />
//                         <ErrorMessage
//                           name="areaOfFactory"
//                           component="div"
//                           className="text-danger"
//                         />
//                       </CCol>
//                     </CRow>
//                   </CCol>

//                   <CCol md={6}>
//                     <CRow className="align-items-center mb-3">
//                       <CCol md={1} className="pr-0">
//                         <CIcon icon={cilLocationPin} size="lg" />
//                       </CCol>
//                       <CCol md={3} className="pl-1">
//                         <label htmlFor="infraAddress" className="form-label">
//                           Address
//                         </label>
//                       </CCol>
//                       <CCol md={8}>
//                         <Field
//                           name="infraAddress"
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Address"
//                         />
//                         <ErrorMessage
//                           name="infraAddress"
//                           component="div"
//                           className="text-danger"
//                         />
//                       </CCol>
//                     </CRow>
//                   </CCol>
//                 </CRow>

//                 <CRow className="align-items-center mb-3">
//                   <CCol md={6}>
//                     <CRow className="align-items-center mb-3">
//                       <CCol md={1} className="pr-0">
//                         <CIcon icon={cilImage} size="lg" />
//                       </CCol>
//                       <CCol md={3} className="pl-1">
//                         <label htmlFor="infraImage" className="form-label">
//                           Upload Image
//                         </label>
//                       </CCol>
//                       <CCol md={8}>
//                         <div className="image-uploader">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             multiple
//                             className="form-control"
//                             disabled={selectedImages.length >= 5}
//                           />
//                           <small className="text-muted d-block mt-1">
//                             Please upload up to 5 images (maximum size: 5MB).
//                           </small>

//                           <div className="d-flex flex-wrap mt-2">
//                             {selectedImages.map((image, index) => (
//                               <div
//                                 key={index}
//                                 className="position-relative me-2 mb-2"
//                                 style={{width: '45px', height: '45px'}}>
//                                 <img
//                                   src={image}
//                                   alt={`Selected ${index}`}
//                                   className="img-thumbnail"
//                                   style={{
//                                     width: '100%',
//                                     height: '100%',
//                                     objectFit: 'cover',
//                                   }}
//                                 />
//                                 <button
//                                   type="button"
//                                   className="btn-close btn-sm position-absolute top-0 end-0"
//                                   style={{
//                                     transform: 'translate(30%, -30%)',
//                                     color: '#fff',
//                                     backgroundColor: 'red',
//                                     borderRadius: '50%',
//                                     padding: '0.1rem',
//                                     fontSize: '0.6rem',
//                                   }}
//                                   onClick={() => removeImage(index)}></button>
//                               </div>
//                             ))}
//                           </div>

//                           {selectedImages.length >= 5 && (
//                             <small className="text-danger">
//                               You have reached the 5-image limit.
//                             </small>
//                           )}
//                         </div>
//                       </CCol>
//                     </CRow>
//                   </CCol>

//                   <CCol md={6}>
//                     <CRow className="align-items-center mb-3">
//                       <CCol md={1} className="pr-0">
//                         <CIcon icon={cilVideo} size="lg" />
//                       </CCol>
//                       <CCol md={3} className="pl-1">
//                         <label htmlFor="video" className="form-label">
//                           Upload Video
//                         </label>
//                       </CCol>
//                       <CCol md={8}>
//                         <div className="image-uploader">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             // onChange={handleImageChange}
//                             multiple
//                             className="form-control"
//                             disabled={selectedImages.length >= 5}
//                           />
//                           <small className="text-muted d-block mt-1">
//                             Please upload up to 2 video (maximum size: 5MB).
//                           </small>
//                         </div>
//                       </CCol>
//                     </CRow>
//                   </CCol>
//                 </CRow>

//                 <div className="col-md-4 col-sm-6 mb-3">
//                   <button
//                     type="submit"
//                     className="btn btn-success custom-btn shadow">
//                     Submit
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UpdateInfrastructureDetails;

import {
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import Select from 'react-select';
import {
  cilCreditCard,
  cilMap,
  cilTag,
  cilGlobeAlt,
  cilPencil,
  cilTrash,
  cilVideo,
  cilImage,
  cilFactory,
  cilSettings,
  cilFile,
  cilDescription,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {Link, useLocation, useParams} from 'react-router-dom';
import * as Yup from 'yup';
import {getGSTList} from '../../../service/AllDrowpdownAPI';
import {
  getInfrastructureDetails,
  UpdateInfrastructureDetail,
} from '../../../service/RegistrationModule/InfrastructureDetails';
import CountryDropdown from '../../components/Dropdowns/CountryDropdown';
import StateDropdown from '../../components/Dropdowns/StateDropdown';
import CityDropdown from '../../components/Dropdowns/CityDropdown';

const UpdateInfrastructureDetails = () => {
  const {state} = useLocation();
  const {index} = useParams();
  const [formValues, setFormValues] = useState({});
  const formikRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [gstOptions, setGstOptions] = useState([]);
  const [video, setVideo] = useState(null);
  const InfrastructureDetails = state?.InfrastructureDetails || null;

  const initialValues = {
    gstNo: InfrastructureDetails?.gstNo || [],
    countryName: InfrastructureDetails?.countryName || [],
    stateName: InfrastructureDetails?.stateName || [],
    cityName: InfrastructureDetails?.cityName || [],
    pincode: InfrastructureDetails?.pincode || '',
    equipmentType: InfrastructureDetails?.equipmentType || '',
    totalEquipment: InfrastructureDetails?.totalEquipment || '',
    description: InfrastructureDetails?.description || '',
    areaOfFactory: InfrastructureDetails?.areaOfFactory || '',
    infraAddress: InfrastructureDetails?.infraAddress || '',
  };
  const validationSchema = Yup.object().shape({
    equipmentType: Yup.string().required('Required'),
    totalEquipment: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    areaOfFactory: Yup.string().required('Required'),
    infraAddress: Yup.string().required('Required'),
    gstNo: Yup.string().required('Required'),
    countryName: Yup.string().required('Required'),
    stateName: Yup.string().required('Required'),
    cityName: Yup.string().required('Required'),
    pincode: Yup.string().required('Required'),
  });
  useEffect(() => {
    const fetchGSTOptions = async () => {
      const companyId = sessionStorage.getItem('_id');
      console.log('companyId found in sessionStorage:', companyId);

      if (!companyId) {
        console.error('No companyId found in sessionStorage');
        return;
      }

      const gstData = await getGSTList(companyId);
      if (gstData && Array.isArray(gstData)) {
        setGstOptions(
          gstData.map(gst => ({
            label: gst,
            value: gst,
          })),
        );
      }
    };

    fetchGSTOptions();
  }, []);
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

  // Handle the file selection
  const handleVideoChange = event => {
    const file = event.target.files[0];
    setVideo(file);
  };

  const removeImage = index => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleListClick = () => {
    setShowTable(prev => !prev);
  };

  const fetchInfrastructureDetails = async companyId => {
    try {
      const result = await getInfrastructureDetails(companyId);
      console.log('get Director Details result:', result);
      console.log('get Director Details result:', result.data.content);
      setSubmittedData(result.data.content);
    } catch (error) {
      console.error('Error fetching  Director Details:', error);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    console.log('companyId found in sessionStorage', companyId);

    if (companyId) {
      fetchInfrastructureDetails(companyId);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []);
  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className=" mb-4">
          <strong>Infrastructure Details</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting, resetForm}) => {
              try {
                setSubmitting(true);

                // Fetch company ID from session storage
                const companyId = sessionStorage.getItem('_id');
                if (!companyId) {
                  swal({
                    title: 'Error',
                    text: 'Company ID not found. Please log in again.',
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                  return;
                }

                // Validate and process selected images
                const formattedImages = selectedImages
                  .map(image => {
                    if (image.startsWith('data:image/')) {
                      return image.trim(); // Ensure no extra spaces
                    }
                    return '';
                  })
                  .filter(Boolean); // Remove empty strings

                if (formattedImages.length === 0) {
                  swal({
                    title: 'Error',
                    text: 'Please upload valid images.',
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                  return;
                }

                // Construct the payload for submission
                const postData = {
                  _id: companyId,
                  percentage: '63',
                  infrastructureDetails: [
                    {
                      gstNo: values.gstNo,
                      equipmentType: values.equipmentType,
                      totalEquipment: values.totalEquipment,
                      description: values.description,
                      areaOfFactory: values.areaOfFactory,

                      infraImage: formattedImages,
                      infraVideo: '',
                      countryName: values.countryName,
                      stateName: values.stateName,
                      cityName: values.cityName,
                      pincode: values.pincode,
                    },
                  ],
                };

                console.log('Submitting postData:', postData);

                // API call
                const result = await UpdateInfrastructureDetail(postData);
                if (result.status === 200) {
                  swal({
                    title: 'Success',
                    text: result.data,
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });

                  resetForm();
                } else {
                  swal({
                    title: 'Error',
                    text: 'Failed to submit. Try again later.',
                    icon: 'error',
                    timer: 2000,
                    buttons: false,
                  });
                }
              } catch (error) {
                console.error('Error during submission:', error);
                swal({
                  title: 'Error',
                  text: 'An unexpected error occurred. Please try again.',
                  icon: 'error',
                  timer: 2000,
                  buttons: false,
                });
              } finally {
                setSubmitting(false); // Ensure the submitting state is cleared
              }
            }}>
            {({values, setFieldValue, isSubmitting}) => (
              <Form>
                <CRow className="align-items-center mb-3">
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilTag} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="gstNo" className="form-label">
                          GST No
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field name="gstNo">
                          {({field, form}) => (
                            <Select
                              isMulti
                              name="gstNo"
                              options={gstOptions}
                              className="basic-select"
                              classNamePrefix="select"
                              placeholder="Select GST No"
                              onChange={selectedOptions => {
                                form.setFieldValue(
                                  field.name,
                                  selectedOptions
                                    ? selectedOptions.map(
                                        option => option.value,
                                      )
                                    : [],
                                );
                              }}
                              value={gstOptions.filter(option =>
                                Array.isArray(field.value)
                                  ? field.value.includes(option.value)
                                  : false,
                              )}
                            />
                          )}
                        </Field>

                        <ErrorMessage
                          name="gstNo"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    {' '}
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilSettings} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="equipmentType" className="form-label">
                          Equipment Type
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="equipmentType"
                          type="text"
                          className="form-control"
                          placeholder="Enter Equipment Type"
                        />
                        <ErrorMessage
                          name="equipmentType"
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
                        <CIcon icon={cilSettings} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="totalEquipment" className="form-label">
                          Total Equipment
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="totalEquipment"
                          type="text"
                          className="form-control"
                          placeholder="Enter Total No of Machines"
                        />
                        <ErrorMessage
                          name="totalEquipment"
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
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilCreditCard} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="pincode" className="form-label">
                          Pin Code
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field name="pincode">
                          {({field, form}) => (
                            <input
                              {...field}
                              type="text"
                              className="form-control"
                              placeholder="Enter PinCode"
                              onChange={e => {
                                const arrayValue = e.target.value
                                  .split(',')
                                  .map(pin => pin.trim());
                                form.setFieldValue('pincode', arrayValue);
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="pincode"
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
                        <CIcon icon={cilFactory} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="areaOfFactory" className="form-label">
                          Area of Factory
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="areaOfFactory"
                          type="text"
                          className="form-control"
                          placeholder="Enter factory area in square feet"
                        />
                        <ErrorMessage
                          name="areaOfFactory"
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
    </>
  );
};

export default UpdateInfrastructureDetails;
