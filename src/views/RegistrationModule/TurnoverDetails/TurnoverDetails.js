import React, {useState, useEffect} from 'react';
import {CCardHeader, CRow, CCol} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import CIcon from '@coreui/icons-react';
import {cilMoney, cilCalendar} from '@coreui/icons';
import swal from 'sweetalert';
import {Link} from 'react-router-dom';
import {
  getTurnoverDetails,
  postTurnoverDetails,
} from '../../../service/RegistrationModule/TurnOverAPIs';
const validationSchema = Yup.object({
  turnOver: Yup.number()
    .typeError('Turnover must be a number')
    .required('Required'),
  turnOverYear: Yup.string().required('Required'),
  threeYearTurnover: Yup.number()
    .typeError('Turnover for last 3 years must be a number')
    .required('3-year turnover is required'),
  lastThreeYear: Yup.string().required('Year for last 3 years is required'),
});

const TurnoverDetails = () => {
  const [initialValues, setInitialValues] = useState({
    turnOver: '',
    threeYearTurnover: '',
    lastThreeYear: '',
    turnOverYear: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async values => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    if (!companyId) {
      swal('Error', 'Company ID not found', 'error');
      return;
    }
    const postData = {
      _id: companyId,
      percentage: '72',
      turnOverDetails: values,
    };
    try {
      const result = await postTurnoverDetails(postData);
      if (result.status === 200) {
        swal('Success', result.data, 'success');
        setInitialValues(values);
      }
    } catch (error) {
      swal('Error', error?.response?.data || 'Something went wrong!', 'error');
    }
  };
  const fetchTurnoverDetails = async companyId => {
    if (!companyId) {
      console.error('No companyId found in sessionStorage');
      setIsLoading(false);
      return;
    }
    try {
      const result = await getTurnoverDetails(companyId);
      console.log('Fetching turnover details: ', result);

      setInitialValues({
        turnOver: result.turnOver || '',
        turnOverYear: result.turnOverYear || '',
        threeYearTurnover: result.lastThreeYear || '',
        lastThreeYear: result.threeYearTurnover || '',
      });
    } catch (error) {
      console.error('Error fetching turnover details: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    fetchTurnoverDetails(companyId);
  }, []);

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className=" mb-4">
          <strong>Turnover Details</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({handleSubmit, values, setFieldValue}) => (
              <Form onSubmit={handleSubmit}>
                {/* First Row */}
                <CRow className="align-items-center mb-3">
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilMoney} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="turnOver" className="form-label">
                          Turnover
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="turnOver"
                          type="number" // Ensure type matches data
                          className="form-control ms-2"
                          placeholder="Enter Turnover"
                        />
                        <ErrorMessage
                          name="turnOver"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilCalendar} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="turnOverYear" className="form-label">
                          Year
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          as="select"
                          name="turnOverYear"
                          className="form-control ms-2"
                          id="turnOverYear">
                          <option value="" disabled>
                            Select Year
                          </option>
                          {Array.from({length: 30}, (_, i) => 2023 - i).map(
                            year => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ),
                          )}
                        </Field>
                        <ErrorMessage
                          name="turnOverYear"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                {/* Second Row */}
                <CRow className="align-items-center mb-3">
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-2">
                        <CIcon icon={cilMoney} size="lg" />
                      </CCol>
                      <CCol md={3}>
                        <label
                          htmlFor="threeYearTurnover"
                          className="form-label mb-0">
                          Last 3-Year Turnover
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="threeYearTurnover"
                          type="number" // Ensure type matches data
                          className="form-control  ms-2"
                          placeholder="Enter Turnover"
                        />
                        <ErrorMessage
                          name="threeYearTurnover"
                          component="div"
                          className="text-danger mt-1"
                        />
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-2">
                        <CIcon icon={cilCalendar} size="lg" />
                      </CCol>
                      <CCol md={3}>
                        <label
                          htmlFor="lastThreeYear"
                          className="form-label mb-0">
                          Year for Last 3 Years
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          as="select"
                          name="lastThreeYear"
                          className="form-control ms-2"
                          id="lastThreeYear">
                          <option value="" disabled>
                            Select Year Range
                          </option>
                          {Array.from({length: 10}, (_, i) => {
                            const startYear = 2023 - i * 3;
                            return (
                              <option
                                key={startYear}
                                value={`${startYear}-${startYear + 2}`}>
                                {`${startYear}-${startYear + 2}`}
                              </option>
                            );
                          })}
                        </Field>
                        <ErrorMessage
                          name="lastThreeYear"
                          component="div"
                          className="text-danger mt-1"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                {/* Submit Button */}
                <div className="col-md-4 col-sm-6 mb-3">
                  <button
                    type="submit"
                    className="btn btn-success custom-btn shadow">
                    Submit
                  </button>
                  <Link to="/certificate-details">
                    <button className="btn btn-secondary custom-btn shadow mx-2">
                      Skip
                    </button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default TurnoverDetails;
