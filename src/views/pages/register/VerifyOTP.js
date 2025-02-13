import * as Yup from "yup";

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "reactstrap";
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import LoginImg from "../../../assets/images/login-image-removebg.png";
import TextError from "../../components/TextError";
import Timer from "./Timer";
import swal from "sweetalert";
import { validateOTP } from "../../../service/AllAuthAPI";

// import { connect } from 'react-redux';
// import { activateGeod } from '../../../Store/index';

const VerifyOTP = (props) => {
  const [num, setNum] = useState("");
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation();
  const { email } = location.state || {};

  /* The above code is declaring a constant variable called `initialValues` which is an object. This
  object is used to store initial values for fields. These fields are initially set to empty strings. */
  const initialValues = {
    email: "",
    otp: "",
  };

  console.log("location :-", location);

  /* The `validationSchema` constant is defining the validation rules for the form field `otp`. It is
  using the Yup library to create a validation schema object. */
  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("Required *")
      .matches(/^[0-9\s]+$/, "Enter Numbers Only"),
  });

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    let otp = values.otp;
                    let result = await validateOTP(email, otp);
                    console.log("validateOTP result :-", result);
                    if (result.status === 200) {
                      swal("Great", "Otp Verified successfully", "success");
                      resetForm();
                      navigate("/login");
                    }
                  } catch (error) {
                    console.log("validateOTP :-", error);
                    if (error.response.status === 409) {
                      swal({
                        title: "Warning",
                        text: `${error.response.data}`,
                        icon: "warning",
                        timer: 2000,
                        buttons: false,
                      });
                    }
                  }
                }}
              >
                {(formik) => {
                  return (
                    <>
                      <Form>
                        <CCardHeader>
                          <strong>Verify Otp</strong>
                        </CCardHeader>
                        <br />
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-control-label">OTP</label>
                              <span className="text-danger fw-bold">*</span>
                              <Field
                                className="form-control-alternative form-control"
                                name="otp"
                                type="number"
                                placeholder="Enter OTP"
                              />
                              <ErrorMessage name="otp" component={TextError} />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <button
                              type="submit"
                              className="btn btn-success"
                              // disabled={formik.isSubmitting}
                            >
                              VERIFY OTP
                            </button>
                          </div>
                        </div>
                        {/* <button
                          type="reset"
                          onClick={formik.resetForm}
                          className="btn btn-danger red"
                        >
                          CLEAR
                        </button> */}
                      </Form>
                      <Timer email={email} />
                      <p className="text-danger mt-3 font-weight-bold mb-0">
                        Note:- OTP is valid for 5 minutes only.
                      </p>
                    </>
                  );
                }}
              </Formik>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

// const mapStateToProps = (state) => ({
//   geod: state.geod,
// });

// const mapDispatchToProps = {
//   activateGeod,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default VerifyOTP;
