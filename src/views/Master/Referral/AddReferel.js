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
import React, {useState, useRef} from 'react';
import {Button} from 'react-bootstrap';
import CIcon from '@coreui/icons-react';
import {
  cilQrCode,
  cilBuilding,
  cilPhone,
  cilEnvelopeOpen,
  cilClipboard,
} from '@coreui/icons';
import {postReferal} from '../../../service/masterModule/Referral';

const AddReferel = ({
  industryOptions,
  setIndustryOptions,
  handleListClick,
  handleEditClick,
}) => {
  const formikRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [referralCode, setReferralCode] = useState('12345ABC'); // Initial referral code

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

  return (
    <>
      <div className="card shadow mb-2">
        <CCardHeader className="mb-3">
          <strong>Referal</strong>
        </CCardHeader>

        <div className="card-body">
          <Formik
            innerRef={formikRef}
            validationSchema={validationSchema}
            initialValues={{
              companyName: '',
              referralCode: referralCode,
              email: '',
              contactNo: '',
              companyName: '',
              createdBy: '',
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
              const postData = {
                fkCompanyId: companyId,
                createdBy: userName,
                referralCode: values.referralCode,
                email: values.email,
                companyName: values.companyName,
                contactNo: values.contactNo,
              };

              try {
                console.log(
                  'Submitting postData:',
                  JSON.stringify(postData, null, 2),
                );

                const result = await postReferal(postData);
                console.log('Submission result:', result);

                if (result.status === 200) {
                  const pkReferralId = result.data.pkReferralId;
                  console.log('pkReferralId', pkReferralId);
                  sessionStorage.setItem('pkReferralId', pkReferralId);
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
                {/* Referral Code */}
                <CCol md={12}>
                  <CRow className="align-items-center mb-3">
                    {/* Referral Code Label and Icon */}
                    <CCol md={2} className="pr-0"></CCol>

                    <CCol md={2} className="pl-1">
                      <CFormLabel htmlFor="referralCode">
                        Referral Code
                      </CFormLabel>
                    </CCol>

                    {/* Referral Code Input and Copy Button */}
                    <CCol md={6}>
                      <CRow>
                        <CCol md={10}>
                          <Field
                            name="referralCode"
                            type="text"
                            className="form-control"
                            value={values.referralCode} // Let Formik manage the value
                            readOnly
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
    </>
  );
};

export default AddReferel;
