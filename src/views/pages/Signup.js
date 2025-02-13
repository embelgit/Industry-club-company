// import React, {useState} from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardGroup,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilBadge,
//   cilEnvelopeOpen,
//   cilLockLocked,
//   cilPhone,
//   cilUser,
// } from '@coreui/icons';
// import {Link, useNavigate} from 'react-router-dom';
// import swal from 'sweetalert';
// import logoRemoveBg from 'src/assets/logo-removebg.png';
// import {generateOTP, verifyOtp} from '../../service/AllAuthAPI';

// const Signup = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [showOtpField, setShowOtpField] = useState(false);
//   const [showPhoneFields, setShowPhoneFields] = useState(false);
//   const [countryCode, setCountryCode] = useState('+91');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [phoneOtp, setPhoneOtp] = useState('');
//   const [showPhoneOtpField, setShowPhoneOtpField] = useState(false);
//   const [showUserDetails, setShowUserDetails] = useState(false);
//   const [name, setName] = useState('');
//   const [panNumber, setPanNumber] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const getOtpForEmail = async () => {
//     setShowOtpField(true);
//     try {
//       const fkDeptId = '';
//       const countryCode = '';
//       const phoneNumber = '';
//       const response = await generateOTP(
//         fkDeptId,
//         countryCode,
//         phoneNumber,
//         email,
//       );
//       if (response.status === 200 && response.data.pkDeptId) {
//         console.log('Email OTP response', response);
//         sessionStorage.setItem('pkDeptId', response.data.pkDeptId);
//         setShowOtpField(true);
//         swal({
//           title: 'OTP Sent!',
//           text: response.data,
//           icon: 'success',
//           timer: 2500,
//           buttons: false,
//         });
//       } else {
//         throw new Error('Failed to send OTP');
//       }
//     } catch (error) {
//       console.error('Error generating OTP:', error);
//       swal({
//         title: 'Error',
//         text: 'Failed to send OTP. Please try again later.',
//         icon: 'error',
//       });
//     }
//   };

//   const submitEmailOtp = async () => {
//     if (!otp) {
//       swal({title: 'Error', text: 'Please enter the OTP.', icon: 'error'});
//       return;
//     }
//     try {
//       const fkDeptId = sessionStorage.getItem('pkDeptId');
//       if (!fkDeptId) {
//         swal({
//           title: 'Error',
//           text: 'Department ID is missing. Please try again.',
//           icon: 'error',
//         });
//         return;
//       }
//       const countryCode = '';
//       const mobileNo = '';
//       const response = await verifyOtp(
//         mobileNo,
//         otp,
//         email,
//         fkDeptId,
//         countryCode,
//       );
//       if (response.status === 200) {
//         console.log('OTP Verified Successfully:', response);
//         setShowOtpField(false);
//         setShowPhoneFields(true);
//         swal({
//           title: 'OTP Verified!',
//           text: 'You can now proceed with the phone number verification.',
//           icon: 'success',
//           timer: 2500,
//           buttons: false,
//         });
//       } else {
//         throw new Error('OTP verification failed');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       swal({
//         title: 'Error',
//         text: 'OTP verification failed. Please try again later.',
//         icon: 'error',
//       });
//     }
//   };

//   const getPhoneOtp = async () => {
//     setShowPhoneOtpField(true);
//     const fkDeptId = sessionStorage.getItem('pkDeptId');
//     try {
//       const email = '';

//       const response = await generateOTP(
//         fkDeptId,
//         countryCode,
//         phoneNumber,
//         email,
//       );

//       if (response.status === 200 && response.data.pkDeptId) {
//         console.log('Email OTP response', response);
//         sessionStorage.setItem('pkDeptId', response.data.pkDeptId);

//         setShowOtpField(true);
//         swal({
//           title: 'OTP Sent!',
//           text: 'Please check your Mobile for the OTP.',
//           icon: 'success',
//           timer: 2500,
//           buttons: false,
//         });
//       } else {
//         throw new Error('Failed to send OTP');
//       }
//     } catch (error) {
//       console.error('Error generating OTP:', error);
//       swal({
//         title: 'Error',
//         text: 'Failed to send OTP. Please try again later.',
//         icon: 'error',
//       });
//     }
//   };

//   const submitPhoneOtp = async () => {
//     if (!phoneOtp) {
//       swal({
//         title: 'Error',
//         text: 'Please enter the phone OTP.',
//         icon: 'error',
//       });
//       return;
//     }

//     try {
//       const fkDeptId = sessionStorage.getItem('pkDeptId');
//       if (!fkDeptId) {
//         swal({
//           title: 'Error',
//           text: 'Department ID is missing. Please try again.',
//           icon: 'error',
//         });
//         return;
//       }
//       const email = '';
//       // Call the verifyOtp function with the phone OTP
//       const response = await verifyOtp(
//         phoneNumber,
//         phoneOtp,
//         email,
//         fkDeptId,
//         countryCode,
//       );

//       if (response.status === 200) {
//         console.log('OTP Verified Successfully:', response);
//         setShowPhoneOtpField(false);
//         setShowUserDetails(true);

//         swal({
//           title: 'OTP Verified!',
//           text: 'You can now proceed with the next steps.',
//           icon: 'success',
//           timer: 2500,
//           buttons: false,
//         });
//       } else {
//         throw new Error('OTP verification failed');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       setShowUserDetails(false);
//       swal({
//         title: 'Error',
//         text: 'OTP verification failed. Please try again later.',
//         icon: 'error',
//       });
//     }
//   };

//   const submitSignup = async e => {
//     e.preventDefault();
//     if (!name || !panNumber || !username || !password) {
//       swal({
//         title: 'Error',
//         text: 'Please fill in all required fields.',
//         icon: 'error',
//       });
//       return;
//     }

//     swal({
//       title: 'Signup Successful',
//       icon: 'success',
//       timer: 2500,
//       buttons: false,
//     });
//     navigate('/Login');
//   };

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={5}>
//             <CCardGroup>
//               <CCard className="p-4">
//                 <CCardBody>
//                   <CForm onSubmit={submitSignup}>
//                     <div className="text-center mb-3">
//                       <img
//                         className="sidebar-brand-full"
//                         src={logoRemoveBg}
//                         alt="Logo"
//                       />
//                     </div>
//                     <h1 className="register">SignUp</h1>
//                     <p className="text-body-secondary">
//                       Sign Up to your account
//                     </p>

//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <CIcon icon={cilEnvelopeOpen} />
//                       </CInputGroupText>
//                       <CFormInput
//                         placeholder="Email"
//                         autoComplete="email"
//                         value={email}
//                         onChange={e => setEmail(e.target.value)}
//                       />
//                       <CButton
//                         color="primary"
//                         type="button"
//                         onClick={getOtpForEmail}>
//                         Get OTP
//                       </CButton>
//                     </CInputGroup>

//                     {showOtpField && (
//                       <CInputGroup className="mb-3">
//                         <CInputGroupText>OTP</CInputGroupText>
//                         <CFormInput
//                           placeholder="Enter OTP"
//                           value={otp}
//                           onChange={e => setOtp(e.target.value)}
//                         />
//                         <CButton
//                           color="primary"
//                           type="button"
//                           onClick={submitEmailOtp}>
//                           Submit OTP
//                         </CButton>
//                       </CInputGroup>
//                     )}

//                     {showPhoneFields && (
//                       <>
//                         <CInputGroup className="mb-3">
//                           <CInputGroupText>
//                             <CIcon icon={cilPhone} />
//                           </CInputGroupText>

//                           <select
//                             className="form-select"
//                             value={countryCode}
//                             onChange={e => setCountryCode(e.target.value)}>
//                             <option value="+91">+91 (India)</option>
//                             <option value="+1">+1 (USA)</option>
//                             <option value="+44">+44 (UK)</option>
//                             <option value="+61">+61 (Australia)</option>
//                           </select>
//                           <CFormInput
//                             placeholder="Phone Number"
//                             value={phoneNumber}
//                             onChange={e => setPhoneNumber(e.target.value)}
//                           />
//                           <CButton
//                             color="primary"
//                             type="button"
//                             onClick={getPhoneOtp}>
//                             Get OTP
//                           </CButton>
//                         </CInputGroup>
//                       </>
//                     )}

//                     {showPhoneOtpField && (
//                       <CInputGroup className="mb-3">
//                         <CInputGroupText>OTP</CInputGroupText>
//                         <CFormInput
//                           placeholder="Enter Phone OTP"
//                           value={phoneOtp}
//                           onChange={e => setPhoneOtp(e.target.value)}
//                         />
//                         <CButton
//                           color="primary"
//                           type="button"
//                           onClick={submitPhoneOtp}>
//                           Submit OTP
//                         </CButton>
//                       </CInputGroup>
//                     )}

//                     {showUserDetails && (
//                       <>
//                         <CInputGroup className="mb-3">
//                           <CInputGroupText>
//                             <CIcon icon={cilUser} />
//                           </CInputGroupText>
//                           <CFormInput
//                             placeholder="Full Name"
//                             value={name}
//                             onChange={e => setName(e.target.value)}
//                           />
//                         </CInputGroup>

//                         <CInputGroup className="mb-3">
//                           <CInputGroupText>
//                             <CIcon icon={cilBadge} />
//                           </CInputGroupText>
//                           <CFormInput
//                             placeholder="Enter PAN Number"
//                             value={panNumber}
//                             onChange={e => setPanNumber(e.target.value)}
//                           />
//                         </CInputGroup>

//                         <CInputGroup className="mb-3">
//                           <CInputGroupText>
//                             <CIcon icon={cilUser} />
//                           </CInputGroupText>
//                           <CFormInput
//                             placeholder="Enter Username"
//                             value={username}
//                             onChange={e => setUsername(e.target.value)}
//                           />
//                         </CInputGroup>

//                         <CInputGroup className="mb-3">
//                           <CInputGroupText>
//                             <CIcon icon={cilLockLocked} />
//                           </CInputGroupText>
//                           <CFormInput
//                             type="password"
//                             placeholder="Enter Password"
//                             value={password}
//                             onChange={e => setPassword(e.target.value)}
//                           />
//                         </CInputGroup>
//                       </>
//                     )}

//                     <CRow>
//                       <CCol xs={6}>
//                         <CButton color="success" type="submit">
//                           Sign Up
//                         </CButton>
//                       </CCol>
//                     </CRow>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default Signup;

import React, {useState} from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBadge,
  cilEnvelopeOpen,
  cilLockLocked,
  cilPhone,
  cilUser,
} from '@coreui/icons';
import {Link, useNavigate} from 'react-router-dom';
import swal from 'sweetalert';
import logoRemoveBg from 'src/assets/logo-removebg.png';
import {generateOTP, signUp, verifyOtp} from '../../service/AllAuthAPI';
import {useFormik} from 'formik';
import * as Yup from 'yup';

const Signup = () => {
  const navigate = useNavigate();
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPhoneFields, setShowPhoneFields] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [showPhoneOtpField, setShowPhoneOtpField] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Formik hook
  const formik = useFormik({
    initialValues: {
      email: '',
      otp: '',
      phoneNumber: '',
      name: '',
      panNumber: '',
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      otp: Yup.string().required('OTP is required'),
      phoneNumber: Yup.string().required('Phone number is required'),
      name: Yup.string().required('Name is required'),
      panNumber: Yup.string().required('PAN number is required'),
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async values => {
      const fkDeptId = sessionStorage.getItem('pkDeptId');
      const postData = {
        role: 'admin',
        name: values.name,
        panNo: values.panNumber,
        username: values.username,
        password: values.password,
        countryCode: values.countryCode,
        mobileNo: values.phoneNumber,
        email: values.email,
        createdBy: values.username,
        fkCompanyId: '',
        fkAdminId: '',
        pkDeptId: fkDeptId,
      };

      try {
        console.log('Submitting postData:', JSON.stringify(postData, null, 2));

        const result = await signUp(postData);
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
        navigate('/Login');
      } catch (error) {
        console.error(
          'Error in adding director details:',
          error?.response || error,
        );

        if (error?.response?.status === 409) {
          const errorMessage = error?.response?.data || 'Conflict occurred.';
          swal({
            title: 'Warning',
            text: errorMessage,
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
      }
    },
  });

  const getOtpForEmail = async () => {
    setShowOtpField(true);
    try {
      const fkDeptId = '';
      const countryCode = '';
      const phoneNumber = '';
      const response = await generateOTP(
        fkDeptId,
        countryCode,
        phoneNumber,
        formik.values.email,
      );
      if (response.status === 200 && response.data.pkDeptId) {
        sessionStorage.setItem('pkDeptId', response.data.pkDeptId);
        swal({
          title: 'OTP Sent!',
          text: response.data,
          icon: 'success',
          timer: 2500,
          buttons: false,
        });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      swal({
        title: 'Error',
        text: 'Failed to send OTP. Please try again later.',
        icon: 'error',
      });
    }
  };

  const submitEmailOtp = async () => {
    if (!formik.values.otp) {
      swal({title: 'Error', text: 'Please enter the OTP.', icon: 'error'});
      return;
    }

    try {
      const fkDeptId = sessionStorage.getItem('pkDeptId');
      if (!fkDeptId) {
        swal({
          title: 'Error',
          text: 'Department ID is missing. Please try again.',
          icon: 'error',
        });
        return;
      }
      const response = await verifyOtp(
        '',
        formik.values.otp,
        formik.values.email,
        fkDeptId,
        '',
      );
      if (response.status === 200) {
        setShowOtpField(false);
        setShowPhoneFields(true);
        swal({
          title: 'OTP Verified!',
          text: 'You can now proceed with the phone number verification.',
          icon: 'success',
          timer: 2500,
          buttons: false,
        });
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (error) {
      swal({
        title: 'Error',
        text: 'OTP verification failed. Please try again later.',
        icon: 'error',
      });
    }
  };

  const getPhoneOtp = async () => {
    setShowPhoneOtpField(true);
    const fkDeptId = sessionStorage.getItem('pkDeptId');
    try {
      const response = await generateOTP(
        fkDeptId,
        countryCode,
        formik.values.phoneNumber,
        '',
      );
      if (response.status === 200 && response.data.pkDeptId) {
        sessionStorage.setItem('pkDeptId', response.data.pkDeptId);
        swal({
          title: 'OTP Sent!',
          text: 'Please check your Mobile for the OTP.',
          icon: 'success',
          timer: 2500,
          buttons: false,
        });
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      swal({
        title: 'Error',
        text: 'Failed to send OTP. Please try again later.',
        icon: 'error',
      });
    }
  };

  const submitPhoneOtp = async () => {
    if (!phoneOtp) {
      swal({
        title: 'Error',
        text: 'Please enter the phone OTP.',
        icon: 'error',
      });
      return;
    }

    try {
      const fkDeptId = sessionStorage.getItem('pkDeptId');
      if (!fkDeptId) {
        swal({
          title: 'Error',
          text: 'Department ID is missing. Please try again.',
          icon: 'error',
        });
        return;
      }
      const response = await verifyOtp(
        formik.values.phoneNumber,
        phoneOtp,
        '',
        fkDeptId,
        countryCode,
      );
      if (response.status === 200) {
        setShowPhoneOtpField(false);
        setShowUserDetails(true);
        swal({
          title: 'OTP Verified!',
          text: 'You can now proceed with the next steps.',
          icon: 'success',
          timer: 2500,
          buttons: false,
        });
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (error) {
      swal({
        title: 'Error',
        text: 'OTP verification failed. Please try again later.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <div className="text-center mb-3">
                      <img
                        className="sidebar-brand-full"
                        src={logoRemoveBg}
                        alt="Logo"
                      />
                    </div>
                    <h1 className="register">SignUp</h1>
                    <p className="text-body-secondary">
                      Sign Up to your account
                    </p>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeOpen} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="text-danger">{formik.errors.email}</div>
                      )}
                      <CButton
                        color="primary"
                        type="button"
                        onClick={getOtpForEmail}>
                        Get OTP
                      </CButton>
                    </CInputGroup>

                    {showOtpField && (
                      <CInputGroup className="mb-3">
                        <CInputGroupText>OTP</CInputGroupText>
                        <CFormInput
                          placeholder="Enter OTP"
                          name="otp"
                          value={formik.values.otp}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.otp && formik.errors.otp && (
                          <div className="text-danger">{formik.errors.otp}</div>
                        )}
                        <CButton
                          color="primary"
                          type="button"
                          onClick={submitEmailOtp}>
                          Submit OTP
                        </CButton>
                      </CInputGroup>
                    )}

                    {showPhoneFields && (
                      <>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilPhone} />
                          </CInputGroupText>

                          <select
                            className="form-select"
                            value={countryCode}
                            onChange={e => setCountryCode(e.target.value)}>
                            <option value="+91">+91 (India)</option>
                            <option value="+1">+1 (USA)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (Australia)</option>
                          </select>
                          <CFormInput
                            placeholder="Phone Number"
                            name="phoneNumber"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.phoneNumber &&
                            formik.errors.phoneNumber && (
                              <div className="text-danger">
                                {formik.errors.phoneNumber}
                              </div>
                            )}
                          <CButton
                            color="primary"
                            type="button"
                            onClick={getPhoneOtp}>
                            Get OTP
                          </CButton>
                        </CInputGroup>
                      </>
                    )}

                    {showPhoneOtpField && (
                      <CInputGroup className="mb-3">
                        <CInputGroupText>OTP</CInputGroupText>
                        <CFormInput
                          placeholder="Enter Phone OTP"
                          value={phoneOtp}
                          onChange={e => setPhoneOtp(e.target.value)}
                        />
                        <CButton
                          color="primary"
                          type="button"
                          onClick={submitPhoneOtp}>
                          Submit OTP
                        </CButton>
                      </CInputGroup>
                    )}

                    {showUserDetails && (
                      <>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Full Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.name && formik.errors.name && (
                            <div className="text-danger">
                              {formik.errors.name}
                            </div>
                          )}
                        </CInputGroup>

                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilBadge} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Enter PAN Number"
                            name="panNumber"
                            value={formik.values.panNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.panNumber &&
                            formik.errors.panNumber && (
                              <div className="text-danger">
                                {formik.errors.panNumber}
                              </div>
                            )}
                        </CInputGroup>

                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Enter Username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.username &&
                            formik.errors.username && (
                              <div className="text-danger">
                                {formik.errors.username}
                              </div>
                            )}
                        </CInputGroup>

                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.password &&
                            formik.errors.password && (
                              <div className="text-danger">
                                {formik.errors.password}
                              </div>
                            )}
                        </CInputGroup>
                      </>
                    )}

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="success" type="submit">
                          Sign Up
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Signup;
