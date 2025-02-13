import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import swal from 'sweetalert';
import {CCardHeader, CRow, CCol} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {cilUser, cilPhone, cilEnvelopeOpen} from '@coreui/icons';
import {editDirector} from '../../../service/RegistrationModule/DirectorDetailsAPIs';

const UpdateDirectorDetails = () => {
  const {state} = useLocation();
  const {index} = useParams();
  const directorDetails = state?.directorDetails || null;

  {
    /* //=========== Handle Initial Values ===============================================================================================// */
  }

  const initialValues = {
    directorName: directorDetails?.directorName || '',
    dirMobileNo: directorDetails?.dirMobileNo || '',
    dirEmail: directorDetails?.dirEmail || '',
  };

  {
    /* //=========== Handle validation Schema ===============================================================================================// */
  }

  const validationSchema = Yup.object().shape({
    directorName: Yup.string().required('Required'),
    dirMobileNo: Yup.string()
      .required('Required')
      .matches(/^\d+$/, 'Phone number must be numeric'),
    dirEmail: Yup.string().email('Invalid email format').required('Required'),
  });

  {
    /* //=========== Handle Submit Data ===============================================================================================// */
  }

  const handleSubmit = async (values, actions) => {
    const companyId = sessionStorage.getItem('_id');
    if (!companyId) {
      console.error('Company ID not found in session storage');
      swal('Error', 'Company ID is missing. Please log in again.', 'error');
      return;
    }

    const postData = {
      _id: companyId,
      index: index,
      directorDetails: [
        {
          directorName: values.directorName,
          dirMobileNo: values.dirMobileNo,
          dirEmail: values.dirEmail,
        },
      ],
    };

    try {
      const result = await editDirector(postData);
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
      console.error('Error in adding director details:', error);
      swal('Error', error?.response?.data || 'Something went wrong!', 'error');
    } finally {
      actions.resetForm();
    }
  };

  {
    /* //=========== Handle UI  ===============================================================================================// */
  }

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="mb-3">
          <strong>Director Details Register</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}>
            {formik => (
              <Form>
                <CRow className="align-items-center mb-3">
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilUser} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="directorName" className="form-label">
                          Director Name
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="directorName"
                          type="text"
                          className="form-control"
                          placeholder="Enter Director Name"
                        />
                        <ErrorMessage
                          name="directorName"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilPhone} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="dirMobileNo" className="form-label">
                          Contact No.
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="dirMobileNo"
                          type="text"
                          className="form-control"
                          placeholder="Enter Contact Number"
                        />
                        <ErrorMessage
                          name="dirMobileNo"
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
                        <CIcon icon={cilEnvelopeOpen} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="dirEmail" className="form-label">
                          Email
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="dirEmail"
                          type="email"
                          className="form-control"
                          placeholder="Enter Email"
                        />
                        <ErrorMessage
                          name="dirEmail"
                          component="div"
                          className="text-danger"
                        />
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

export default UpdateDirectorDetails;
