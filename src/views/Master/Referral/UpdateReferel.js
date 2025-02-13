import {useParams, useLocation} from 'react-router-dom';
import {
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormTextarea,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import * as Yup from 'yup';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilQrCode,
  cilBuilding,
  cilPhone,
  cilEnvelopeOpen,
  cilClipboard,
} from '@coreui/icons';
import {
  editReferral,
  getReferralById,
} from '../../../service/masterModule/Referral';
import {AppHeader, AppSidebar} from '../../../components';

const UpdateReferel = () => {
  const {id} = useParams(); // Get the referral ID from the URL
  const location = useLocation(); // Get the state passed from the previous route
  const companyData = location.state?.companyData;
  const formikRef = useRef(null);

  const [referralData, setReferealData] = useState(null); // Correctly initialize state

  const [loader, setLoader] = useState(false);

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required('Required'),
    contactNo: Yup.string()
      .required('Required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .test(
        'not-starting-with-zero',
        'Mobile number should not start with 0',
        value => value && !value.startsWith('0'),
      ),
    email: Yup.string().required('Required').email('Invalid email format'),
  });
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      alert('Referral code copied to clipboard!');
    });
  };

  if (!companyData) {
    return <p>Error: No company data found!</p>;
  }
  const fetchInfraDataById = async id => {
    try {
      setLoader(true); // Show loader
      const result = await getReferralById(id); // API call

      console.log('Fetched result:', result);

      // Verify if result and infrastructureOnLease exist
      if (result && result.data) {
        setReferealData(result.data); // Update state with infrastructureOnLease
      } else {
        console.warn(
          'infrastructureOnLease is not present in the result:',
          result,
        );
        setReferealData(null); // Reset state to avoid stale data
      }
    } catch (error) {
      console.error('Error fetching company data by ID:', error);
      setReferealData(null); // Reset state in case of error
    } finally {
      setLoader(false); // Hide loader
    }
  };

  // Effect to fetch data when pkInfraId changes
  useEffect(() => {
    if (id) {
      fetchInfraDataById(id);
    }
  }, [id]);

  // Effect to log infraData when it changes
  useEffect(() => {
    if (id) {
      console.log('Updated infraData:', id);
    }
  }, [id]);

  return (
    <>
      {/* <AppHeader /> */}
      <AppSidebar />
      <div className="card shadow mb-2">
        <CCardHeader className="mb-3">
          <strong>Referal</strong>
        </CCardHeader>

        <div className="card-body">
          <Formik
            validationSchema={validationSchema}
            innerRef={formikRef}
            enableReinitialize // Allow reinitialization when initialValues change
            initialValues={{
              companyName: referralData?.companyName || '',
              referralCode: referralData?.referralCode || '',
              email: referralData?.email || '',
              contactNo: referralData?.contactNo || '',
            }}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('_id');
              const userName = sessionStorage.getItem('userName');
              if (!companyId) {
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
                swal({
                  title: 'Error',
                  text: 'userName is missing.',
                  icon: 'error',
                  timer: 2000,
                  buttons: false,
                });
                return;
              }
              const postData = {
                fkCompanyId: companyId,
                pkReferralId: id,
                createdBy: userName,
                referralCode: values.referralCode,
                email: values.email,
                companyName: values.companyName,
                contactNo: values.contactNo,
                updatedBy: userName,
              };

              try {
                const result = await editReferral(postData);
                if (result.status === 200) {
                  swal({
                    title: 'Success',
                    text: result.data,
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });
                  actions.resetForm();
                }
              } catch (error) {
                const errorMessage =
                  error?.response?.data?.message || 'Something went wrong!';
                swal({
                  title: 'Error',
                  text: errorMessage,
                  icon: 'error',
                  timer: 2000,
                  buttons: false,
                });
              } finally {
                actions.setSubmitting(false);
              }
            }}>
            {({handleSubmit}) => (
              <Form onSubmit={handleSubmit}>
                <CCol md={12}>
                  <CRow className="align-items-center mb-3">
                    <CCol md={2} className="pr-0"></CCol>

                    <CCol md={2} className="pl-1">
                      <CFormLabel htmlFor="referralCode">
                        Referral Code
                      </CFormLabel>
                    </CCol>
                    <CCol md={6}>
                      <CRow>
                        <CCol md={10}>
                          <Field
                            name="referralCode"
                            type="text"
                            className="form-control"
                            placeholder="Enter referralCode"
                          />
                          <ErrorMessage
                            name="referralCode"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                        <CCol md={2} className="d-flex align-items-center">
                          <CButton
                            color="primary"
                            onClick={handleCopyReferralCode}>
                            <CIcon icon={cilClipboard} size="lg" />
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCol>
                <CRow className="align-items-center mb-3">
                  {/* Company Name */}
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilBuilding} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <CFormLabel htmlFor="companyName">
                          Company Name
                        </CFormLabel>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="companyName"
                          type="text"
                          className="form-control"
                          placeholder="Enter Company Name"
                        />
                        <ErrorMessage
                          name="companyName"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                  {/* Email */}
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilEnvelopeOpen} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <CFormLabel htmlFor="email">Email</CFormLabel>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Enter Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="align-items-center mb-3">
                  {/* Contact No */}
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilPhone} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <CFormLabel htmlFor="contactNo">Contact No</CFormLabel>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="contactNo"
                          type="text"
                          className="form-control"
                          placeholder="Enter Contact No"
                        />
                        <ErrorMessage
                          name="contactNo"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                <div className="col-md-4 col-sm-6 mb-3">
                  <CButton
                    type="submit"
                    className="btn btn-success custom-btn shadow">
                    Submit
                  </CButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateReferel;
