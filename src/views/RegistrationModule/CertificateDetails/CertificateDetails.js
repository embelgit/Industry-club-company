import {CCardHeader, CRow, CCol} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useEffect} from 'react';
import CIcon from '@coreui/icons-react';
import {cilCreditCard, cilImage, cilList} from '@coreui/icons';
import {Link, useNavigate} from 'react-router-dom';
import * as Yup from 'yup';

import CertificateDetailList from './CertificateDetailList';
import {
  getCertificateDetails,
  postCertificateDetails,
} from '../../../service/RegistrationModule/CertificateDetails';

const CertificateDetails = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const initialValues = {
    type: 'certificate',
    certificateName: '',
    certNo: '',
    certiPhoto: '',
  };

  const validationSchema = Yup.object().shape({
    certificateName: Yup.string().required('Required'),
    certNo: Yup.string().required('Required'),
  });

  // Handle image change to store images in base64 format
  const handleImageChange = event => {
    const files = Array.from(event.target.files);

    if (files.length + selectedImages.length > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }

    const readImagesAsBase64 = files.map(
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

    Promise.all(readImagesAsBase64)
      .then(base64Images => {
        setSelectedImages(prevImages => [...prevImages, ...base64Images]);
      })
      .catch(error => {
        console.error('Error converting images to base64:', error);
      });
  };

  const removeImage = index => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleListClick = () => {
    setShowTable(prev => !prev);
  };

  const handleSubmit = async (values, actions) => {
    const companyId = sessionStorage.getItem('_id');

    if (!companyId) {
      console.error('Company ID not found in session storage');
      return;
    }

    const postData = {
      _id: companyId,
      percentage: '81',
      certificationDetails: [
        {
          type: values.type,
          certificateName: values.certificateName,
          certNo: values.certNo,
          certiPhoto: selectedImages[0],
        },
      ],
    };

    try {
      console.log('Submitting postData:', JSON.stringify(postData, null, 2));

      const result = await postCertificateDetails(postData);
      console.log('Submission result: ', result);
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
      console.error(
        'Error in adding director details:',
        error?.response || error,
      );

      if (error?.response?.status === 409) {
        const errorMessage = error?.response?.data || 'Conflict occurred.';
        swal({
          title: 'Warning',
          text: errorMessage, // Display the error message from the response
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
    }
  };
  const fetchCertificateDetails = async companyId => {
    try {
      const result = await getCertificateDetails(companyId);
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
      fetchCertificateDetails(companyId);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []);

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className=" mb-4">
          <strong>
            Certificate / Membership Add / Government License Details
          </strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {formik => (
              <Form>
                <CRow
                  className="d-flex justify-content-center align-items-center mb-5"
                  style={{height: '100vh'}}>
                  <CCol md={1} className="text-center">
                    <label className="custom-checkbox">
                      <Field
                        type="radio"
                        name="type"
                        value="certificate"
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>
                      <span
                        className="label-text"
                        style={{fontSize: '16px', fontWeight: 'bold'}}>
                        Certificate
                      </span>
                    </label>
                  </CCol>
                  <CCol md={3} className="text-center">
                    <label className="custom-checkbox">
                      <Field
                        type="radio"
                        name="type"
                        value="membership"
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>
                      <span
                        className="label-text"
                        style={{fontSize: '16px', fontWeight: 'bold'}}>
                        Membership
                      </span>
                    </label>
                  </CCol>
                </CRow>

                {formik.values.type && (
                  <>
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
                              {formik.values.type === 'certificate'
                                ? 'Certificate Name'
                                : 'Membership Name'}
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="certificateName"
                              type="text"
                              className="form-control"
                              placeholder={
                                formik.values.type === 'certificate'
                                  ? 'Enter Certificate Name'
                                  : 'Enter Membership Name'
                              }
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
                            <CIcon icon={cilList} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="certNo" className="form-label">
                              Registration Number
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="certNo"
                              type="text"
                              className="form-control"
                              placeholder="Enter Registration Number"
                            />
                            <ErrorMessage
                              name="certNo"
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
                              className="form-control"
                              disabled={selectedImages.length >= 1}
                            />
                            <small className="text-muted d-block mt-1">
                              Please upload 1 image (maximum size: 5MB).
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
                          </div>
                        </CCol>
                      </CRow>
                    </CCol>
                  </>
                )}
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

                  <Link to="/target-client-location">
                    <button className="btn btn-secondary custom-btn shadow">
                      Skip
                    </button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {showTable && <CertificateDetailList />}
    </>
  );
};

export default CertificateDetails;
