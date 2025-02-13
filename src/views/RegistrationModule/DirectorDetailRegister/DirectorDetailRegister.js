import {CCardHeader, CRow, CCol} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useEffect, useState} from 'react';
import {cilUser, cilPhone, cilEnvelopeOpen} from '@coreui/icons';
import * as Yup from 'yup';
import CIcon from '@coreui/icons-react';

import DirectorDetailList from './DirectorDetailList';
import swal from 'sweetalert';
import {
  getDirectorDetails,
  postDirectorDetails,
} from '../../../service/RegistrationModule/DirectorDetailsAPIs';

const DirectorDetailRegister = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const initialValues = {
    directorName: '',
    dirMobileNo: '',
    dirEmail: '',
  };
  {
    /* //========== Validation Schema ============================================================================================// */
  }

  const validationSchema = Yup.object().shape({
    directorName: Yup.string().required('Required'),
    dirMobileNo: Yup.string()
      .required('Required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .test(
        'not-starting-with-zero',
        'Mobile number should not start with 0',
        value => value && !value.startsWith('0'),
      ),
    dirEmail: Yup.string().required('Required').email('Invalid email format'),
  });

  {
    /* //========== Submitting Director Details Register ========================================================================// */
  }

  const handleSubmit = async (values, actions) => {
    // Fetch companyId inside the function
    const companyId = sessionStorage.getItem('fkCompanyId');

    if (!companyId) {
      console.error('Company ID not found in session storage');
      swal({
        title: 'Error',
        text: 'Company ID is missing. Please try again.',
        icon: 'error',
        timer: 2000,
        buttons: false,
      });
      return;
    }

    const postData = {
      _id: companyId,
      percentage: '27',
      directorDetails: [
        {
          directorName: values.directorName,
          dirMobileNo: values.dirMobileNo,
          dirEmail: values.dirEmail,
        },
      ],
    };

    try {
      console.log('Submitting postData: ', postData);
      const result = await postDirectorDetails(postData);
      console.log('Submitting result: ', result);

      if (result.status === 200) {
        swal({
          title: 'Great',
          text: result.data,
          icon: 'success',
          timer: 2000,
          buttons: false,
        });

        setSubmittedData(prevData => [...prevData, values]);
      }
    } catch (error) {
      console.error(
        'Error in adding director details:',
        error?.response || error,
      );

      if (error?.response?.status === 400) {
        swal({
          title: 'Warning',
          text: error.response.data,
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
      actions.resetForm();
    }
  };

  const handleListClick = () => {
    setShowTable(prev => !prev);
  };

  {
    /* //=========== fetching Director Details ===================================================================================// */
  }

  const fetchDirectorDetails = async companyId => {
    try {
      const result = await getDirectorDetails(companyId);
      console.log('get Director Details result:', result);
      console.log('get Director Details result:', result.data.content);
      setSubmittedData(result.data.content);
    } catch (error) {
      console.error('Error fetching Director Details:', error);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    console.log('companyId found in sessionStorage', companyId);

    if (companyId) {
      fetchDirectorDetails(companyId);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []);
  const handleReset = () => {
    resetProgress(); // Reset the progress bar to 0%
  };

  {
    /* //=========== UI Details ==============================================================================================// */
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
                  <button
                    type="button"
                    className="btn btn-primary custom-btn shadow mx-2"
                    onClick={handleListClick}>
                    List
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {/* <button
            className="btn btn-danger custom-btn shadow"
            onClick={handleReset}>
            Reset Progress
          </button> */}
      {showTable && <DirectorDetailList />}
    </>
  );
};

export default DirectorDetailRegister;
