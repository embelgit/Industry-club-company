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
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CIcon from '@coreui/icons-react';
import {cilCreditCard, cilImage, cilList} from '@coreui/icons';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import * as Yup from 'yup';
import {UpdateCertificateDetail} from '../../../service/RegistrationModule/CertificateDetails';

const UpdateCertificateDetails = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const {state} = useLocation(); // Access the state passed from Link
  const {index} = useParams(); // Access the index from the route parameters

  // Fetch director details from state or default to null
  const CertificateDetails = state?.CertificateDetails || null;

  const initialValues = {
    type: 'certificate',
    certificateName: CertificateDetails?.certificateName || '',
    certNo: CertificateDetails?.certNo || '',
    certiPhoto: CertificateDetails?.certiPhoto || '',
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
      index: index,
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

      const result = await UpdateCertificateDetail(postData);
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

      if (error?.response?.status === 400) {
        swal({
          title: 'Warning',
          text: result.data,
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
    }
  };

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
                                Please upload up to 5 images (maximum size:
                                5MB).
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
                                      onClick={() =>
                                        removeImage(index)
                                      }></button>
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
                  </>
                )}
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

export default UpdateCertificateDetails;
