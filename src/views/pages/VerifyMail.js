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
import * as Yup from "yup";
import Loader from "../components/Loader";
import swal from "sweetalert";
import CIcon from '@coreui/icons-react'
import TextError from "../components/TextError";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { cilArrowLeft } from '@coreui/icons';
import { generateOTP } from "../../service/AllAuthAPI";
import { useNavigate, Link } from "react-router-dom";

const VerifyMail = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Required").email("Invalid email"),
  });

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
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
                    let email = values.email;
                  const result = await generateOTP(email);
                  console.log("generateOTP result :-", result);
                  if (result.status === 200) {
                    swal({
                      title: "Great",
                      text: "OTP sent On Your Email Please Check Your Email",
                      icon: "success",
                      timer: 2000,
                      buttons: false,
                    });
                    navigate("/verify-otp", { state: { email: email } });
                  }
                } catch (error) {
                  console.log("generateOTP error :-", error);
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
                  <h1>Verify Mail</h1>
                  <div className='mb-3'>
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <span className="text-danger fw-bold">*</span>
                        <Field
                          className="form-control"
                          name="email"
                          placeholder="Email"
                          />
                        <ErrorMessage name="email" component={TextError} />
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
          <br />
          <div className='text-center'>
                      <p>
                      Already Verified?&nbsp;&nbsp;
                        <Link to="/login">Log in</Link>
                      </p>
                    </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

      </CContainer>
    </div>
  )
}

export default VerifyMail;