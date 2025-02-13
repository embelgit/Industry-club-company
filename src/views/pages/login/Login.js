// import {Button, Form} from 'reactstrap';
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
// import logoRemoveBg from 'src/assets/logo-removebg.png';
// import React, {useState} from 'react';
// import {cilLockLocked, cilUser} from '@coreui/icons';
// import ToggleEye from '../../components/ToggleEye';
// import CIcon from '@coreui/icons-react';
// import {Link, useNavigate} from 'react-router-dom';
// import LoginImg from '../../../assets/images/login-image-removebg.png';
// import {activateGeod} from '../../../Store/index';
// import {connect} from 'react-redux';
// import swal from 'sweetalert';
// import {login} from '../../../service/AllAuthAPI';
// const Login = props => {
//   // console.log("activategeod props :-", props);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const [eyePass, setEyePass] = useState(false);

//   /* The function toggles the visibility of a password input field. */
//   const eyeTogglePass = () => {
//     setEyePass(!eyePass);
//   };

//   const submitLogin = async e => {
//     e.preventDefault();
//     if (!username || !password) {
//       const missingField = !username ? 'username' : 'password';
//       swal('Failed', `Please enter ${missingField}`, 'error');
//       return;
//     }
//     const data = {username, password};
//     try {
//       const result = await login(data);
//       console.log('Login Result', result);
//       if (result.status === 200) {
//         const {_id, email, username, token} = result?.data;
//         props.activateGeod({title: true});
//         sessionStorage.setItem('loginStatus', true);
//         sessionStorage.setItem('_id', _id);
//         sessionStorage.setItem('email', email);

//         sessionStorage.setItem('userName', username);
//         sessionStorage.setItem('token', token);
//         swal({
//           title: 'Login Successfully...',
//           icon: 'success',
//           timer: 3500,
//           buttons: false,
//           content: {
//             element: 'span',
//             attributes: {
//               innerHTML: `
//                 <img src="${logoRemoveBg}"  alt="Logo" style="max-width: 100px; margin-bottom: 10px;" />
//                 <br>
//                 Last Login date, time: 27/11/2024, 12:40
//                 <br>
//                 <strong>Welcome To Industries Club</strong>
//               `,
//             },
//           },
//         });
//         navigate('/registration');
//       }
//     } catch (error) {
//       console.log('Login Error', error);
//       if (error.response.status === 409) {
//         swal({
//           title: 'Warning',
//           text: `${error.response.data}`,
//           icon: 'warning',
//           timer: 2500,
//           buttons: false,
//         });
//       } else if (error.response.status === 403) {
//         swal({
//           title: 'Warning',
//           text: 'You cannot Access',
//           icon: 'warning',
//           timer: 2500,
//           buttons: false,
//         });
//       }
//       swal('Login Failed', 'Check username and password', 'error');
//     }
//   };

//   return (
//     <div className="bg-body-tertiary min-vh-100 min-vw-100 d-flex flex-row align-items-center justify-content-center">
//       <CContainer className="d-flex justify-content-center align-items-center min-vh-100">
//         <CRow className="justify-content-center align-items-center">
//           <CCol md={12}>
//             <CCardGroup>
//               <CCard className="p-4">
//                 <CCardBody>
//                   <Form onSubmit={submitLogin}>
//                     <div className="text-center mb-3">
//                       <img
//                         className="sidebar-brand-full"
//                         src={logoRemoveBg}
//                         alt="Logo"
//                       />
//                     </div>
//                     <h1 className="register">Login</h1>
//                     <p className="text-body-secondary">
//                       Sign In to your account
//                     </p>
//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         placeholder="Username"
//                         autoComplete="username"
//                         value={username}
//                         onChange={e => setUsername(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type={eyePass ? 'text' : 'password'}
//                         placeholder="Password"
//                         autoComplete="current-password"
//                         value={password}
//                         onChange={e => setPassword(e.target.value)}
//                       />
//                       <ToggleEye
//                         dClass={'p-eye p-eye-login'}
//                         state={eyePass}
//                         toggle={eyeTogglePass}
//                       />
//                     </CInputGroup>

//                     <CCol xs={6}>
//                       <CButton
//                         color="primary"
//                         className="px-4 mb-3"
//                         type="submit">
//                         Login
//                       </CButton>
//                     </CCol>

//                     <CRow>
//                       <CCol xs={6} className="text-right ">
//                         <CButton
//                           as={Link}
//                           to="/Signup"
//                           color="link"
//                           className="px-0">
//                           SingUp Now
//                         </CButton>
//                       </CCol>
//                       <CCol xs={6} className="text-right">
//                         <CButton
//                           as={Link}
//                           to="/forgot-password"
//                           color="link"
//                           className="px-0">
//                           Forgot password?
//                         </CButton>
//                       </CCol>
//                     </CRow>
//                   </Form>
//                 </CCardBody>
//               </CCard>
//               <CCard className="text-white bg-primary py-2">
//                 <CCardBody className="d-flex justify-content-center align-items-center">
//                   <img src={LoginImg} alt="login-icon" className="loginImg" />
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// const mapStateToProps = state => {
//   console.log('Login State:-', state); // Debugging line
//   return {
//     geod: state.geod,
//   };
// };

// const mapDispatchToProps = {
//   activateGeod,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Login);

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
import logoRemoveBg from 'src/assets/logo-removebg.png';
import {cilLockLocked, cilUser} from '@coreui/icons';
import ToggleEye from '../../components/ToggleEye';
import CIcon from '@coreui/icons-react';
import {Link, useNavigate} from 'react-router-dom';
import LoginImg from '../../../assets/images/login-image-removebg.png';
import {activateGeod} from '../../../Store/index';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import {login} from '../../../service/AllAuthAPI';

const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [eyePass, setEyePass] = useState(false);

  // Toggles the visibility of the password input field
  const eyeTogglePass = () => {
    setEyePass(!eyePass);
  };

  // Handles form submission
  const submitLogin = async e => {
    e.preventDefault();
    if (!username || !password) {
      const missingField = !username ? 'username' : 'password';
      swal('Failed', `Please enter ${missingField}`, 'error');
      return;
    }

    const data = {username, password};
    try {
      const result = await login(data);
      console.log('Login Result', result);
      if (result.status === 200) {
        const {email, username, token, role, fkUserId} = result?.data;
        props.activateGeod({title: true});
        sessionStorage.setItem('loginStatus', 'true');
        sessionStorage.setItem('fkCompanyId', fkCompanyId);
        sessionStorage.setItem('fkUserId', fkUserId);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('userName', username);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);

        swal({
          title: 'Login Successful!',
          icon: 'success',
          timer: 3500,
          buttons: false,
          content: {
            element: 'span',
            attributes: {
              innerHTML: `
                <img src="${logoRemoveBg}" alt="Logo" style="max-width: 100px; margin-bottom: 10px;" />
                <br>
                Last Login: 27/11/2024, 12:40
                <br>
                <strong>Welcome to Industries Club</strong>
              `,
            },
          },
        });

        // Navigate based on user role
        if (role === 'admin') {
          navigate('/company-detail-register');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login Error', error);
      const status = error?.response?.status;
      const message =
        status === 409
          ? error?.response?.data
          : status === 403
            ? 'You cannot access'
            : 'Check username and password';
      swal('Login Failed', message, 'error');
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 min-vw-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={submitLogin}>
                    <div className="text-center mb-3">
                      <img
                        className="sidebar-brand-full"
                        src={logoRemoveBg}
                        alt="Logo"
                      />
                    </div>
                    <h1 className="register">Login</h1>
                    <p className="text-body-secondary">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={eyePass ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <ToggleEye
                        dClass="p-eye p-eye-login"
                        state={eyePass}
                        toggle={eyeTogglePass}
                      />
                    </CInputGroup>
                    <CCol xs={6}>
                      <CButton
                        color="primary"
                        className="px-4 mb-3"
                        type="submit">
                        Login
                      </CButton>
                    </CCol>
                    <CRow>
                      <CCol xs={6}>
                        <CButton as={Link} to="/signup" color="link">
                          SignUp Now
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton as={Link} to="/forgot-password" color="link">
                          Forgot Password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-2">
                <CCardBody className="d-flex justify-content-center align-items-center">
                  <img src={LoginImg} alt="Login Icon" className="loginImg" />
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

const mapStateToProps = state => ({
  geod: state.geod,
});

const mapDispatchToProps = {
  activateGeod,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
