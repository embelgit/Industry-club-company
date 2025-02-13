import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import ToggleEye from '../components/ToggleEye';
import * as Yup from "yup";
import Loader from "../components/Loader";
import swal from "sweetalert";
import TextError from "../components/TextError";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { resetPassword } from "../../service/AllAuthAPI";

const ResetPassword = () => {
  const [eyePass, setEyePass] = useState(false);
  const [eyeCPass, setEyeCPass] = useState(false);
  const [eyeOPass, setEyeOPass] = useState(false);
  const [loader, setLoader] = useState(false);

  /* The function toggles the visibility of a password input field. */
  const eyeTogglePass = () => {
    setEyePass(!eyePass);
  };
  const eyeToggleCPass = () => {
    setEyeCPass(!eyeCPass);
  };
  const eyeToggleOPass = () => {
    setEyeOPass(!eyeOPass);
  };

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

   /* The handleCopyPaste function prevents the default behavior of the copy and paste events. */
   const handleCopyPaste = (e) => {
    e.preventDefault();
  }

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Required"),
    newPassword: Yup.string()
      .required("Required")
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Must contain at least 1 digit (0-9)")
      .matches(/[a-z]/, "Must contain at least 1 lowercase letter (a-z)")
      .matches(/[A-Z]/, "Must contain at least 1 uppercase letter (A-Z)")
      .matches(/[^\w]/, "Must contain at least 1 symbol"),
      confirmPassword: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("newPassword"), null], "Password must match"),
  });

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={9} lg={7} xl={6}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              {loader ? (
                <Loader />
              ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    setLoader(true);
                    let oldPassword = values.oldPassword;
                    let newPassword = values.newPassword;
                    const result = await resetPassword(oldPassword, newPassword);
                    console.log("forgotPassword result :-", result);
                    if (result.status === 200) {
                      swal({
                        title: "Great",
                        text: "Password Reset Successfully",
                        icon: "success",
                        timer: 2000,
                        buttons: false,
                      });
                      resetForm();
                    }
                  } catch (error) {
                    console.log("forgotPassword error :-", error);
                    if (error.response.status === 409) {
                      swal({
                        title: "Warning",
                        text: `${error.response.data}`,
                        icon: "warning",
                        timer: 2000,
                        buttons: false,
                      });
                    }
                  } finally {
                    setLoader(false);
                  }
                }}
              >
                {(formik) => {
                  return (
                    <Form>
                    <h1>Reset Password</h1>
                    <div className='mb-3 position-relative'>
                      <label className="form-label" htmlFor="oldPassword">
                        Old Password
                      </label>
                      <span className="text-danger fw-bold">*</span>
                      <Field
                        className="form-control"
                        name="oldPassword"
                        placeholder="Old Password"
                        type={eyeOPass ? "text" : "password"}
                        onCopy={handleCopyPaste}
                      />
                      <ToggleEye
                        dClass={'p-eye1'}
                        state={eyeOPass}
                        toggle={eyeToggleOPass}
                      />
                      <ErrorMessage name="oldPassword" component={TextError} />
                    </div>
                    <div className='mb-3 position-relative'>
                      <label className="form-label" htmlFor="newPassword">
                        New Password
                      </label>
                      <span className="text-danger fw-bold">*</span>
                      <Field
                        className="form-control"
                        name="newPassword"
                        placeholder="New Password"
                        type={eyePass ? "text" : "password"}
                        onCopy={handleCopyPaste}
                      />
                      <ToggleEye
                        dClass={'p-eye1'}
                        state={eyePass}
                        toggle={eyeTogglePass}
                      />
                      <ErrorMessage name="newPassword" component={TextError} />
                    </div>
                    <div className='mb-3 position-relative'>
                      <label className="form-label" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <span className="text-danger fw-bold">*</span>
                      <Field
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        type={eyeCPass ? "text" : "password"}
                        onPaste={handleCopyPaste}
                      />
                      <ToggleEye
                        dClass={'p-eye1'}
                        state={eyeCPass}
                        toggle={eyeToggleCPass}
                      />
                      <ErrorMessage name="confirmPassword" component={TextError} />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={formik.isSubmitting}
                    >
                      Submit
                    </button>
                  </Form>
                  );
                }}
              </Formik>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ResetPassword