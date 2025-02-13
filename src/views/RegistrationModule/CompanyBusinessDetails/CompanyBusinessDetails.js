import React, {useEffect, useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {CRow, CCol, CCardHeader} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import Select from 'react-select';
import {
  cilCreditCard,
  cilBuilding,
  cilGlobeAlt,
  cilCalendar,
} from '@coreui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getBussinessDetails,
  postBussinessDetail,
} from '../../../service/RegistrationModule/CompanyDetailsRegisterAPIs';
import RegistrationHeader from '../../../components/RegistrationComponents/RegistrationHeader';
const CompanyBusinessDetails = () => {
  const [submittedList, setSubmittedList] = useState([]);
  const [fetchedData, setFetchedData] = useState({});
  const [initialValues, setInitialValues] = useState({
    businessType: [],
    businessUrl: '',
    tanNo: '',
    panNo: '',
    cageCode: '',
    dunsNo: '',
    registrationDate: '',
    companyDescription: '',
  });

  const options = [
    {value: 'manufacturing', label: 'Manufacturing'},
    {value: 'import_export', label: 'Import & Export'},
    {value: 'Service Provider', label: 'Service Provider'},
    {value: 'Traders', label: 'Traders'},
  ];

  const validationSchema = Yup.object().shape({
    businessType: Yup.array().min(1, 'Select at least one business type'),
    businessUrl: Yup.string().url('Invalid URL format'),
    tanNo: Yup.string().required('Required'),
    panNo: Yup.string().required('Required'),
    cageCode: Yup.string().required('Required'),
    dunsNo: Yup.string().required('Required'),
    registrationDate: Yup.string().required('Required'),
    companyDescription: Yup.string().required('Required'),
  });

  const fetchBussinessDetails = async companyId => {
    try {
      const result = await getBussinessDetails(companyId);
      console.log('get Bussiness Details Data result:', result);
      const data = result.data;

      // Set the fetched data to initialValues
      setInitialValues({
        businessType: data.businessType || [],
        businessUrl: data.businessUrl || '',
        tanNo: data.tanNo || '',
        panNo: data.panNo || '',
        cageCode: data.cageCode || '',
        dunsNo: data.dunsNo || '',
        registrationDate: data.registrationDate || '',
        companyDescription: data.companyDescription || '',
      });

      setFetchedData(data);
      setSubmittedList(data.content || []);
    } catch (error) {
      console.error('Error fetching Bussiness details:', error);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('fkCompanyId');
    console.log('companyId found in sessionStorage', companyId);

    if (companyId) {
      fetchBussinessDetails(companyId);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []);

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Company Business Details</strong>
        </CCardHeader>

        <div className="card-body p-3">
          <Formik
            enableReinitialize // Enable reinitializing Formik when initialValues change
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('fkCompanyId');

              if (!companyId) {
                console.error('Company ID or token is missing');
                return;
              }

              try {
                const formattedDate = values.registrationDate
                  ? new Date(values.registrationDate)
                      .toISOString()
                      .split('T')[0]
                  : null;

                const postData = {
                  _id: companyId,
                  percentage: '18',
                  companyRegister: {
                    businessType: values.businessType,
                    businessUrl: values.businessUrl,
                    panNo: values.panNo,
                    tanNo: values.tanNo,
                    registrationDate: formattedDate,
                    cageCode: values.cageCode,
                    dunsNo: values.dunsNo,
                    companyDescription: values.companyDescription,
                  },
                };

                const result = await postBussinessDetail(postData);
                console.log('Result:', result.data);
                if (result.status === 200) {
                  swal({
                    title: 'Great',
                    text: result.data,
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });
                  fetchBussinessDetails(companyId);
                }
              } catch (error) {
                console.error('add GST error :-', error?.response || error);
                if (error?.response?.status === 409) {
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
            }}>
            {({handleSubmit, setFieldValue, values}) => (
              <Form onSubmit={handleSubmit}>
                <CRow className="mt-4">
                  <CCol md={12}>
                    <CRow className="align-items-center mb-4">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1}>
                            <CIcon icon={cilBuilding} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>Business Type</label>
                          </CCol>
                          <CCol md={8}>
                            <Select
                              isMulti
                              options={options}
                              value={options.filter(option =>
                                values.businessType.includes(option.value),
                              )}
                              onChange={selectedOptions =>
                                setFieldValue(
                                  'businessType',
                                  selectedOptions.map(option => option.value),
                                )
                              }
                              placeholder={'Select Business Type'}
                            />
                            <ErrorMessage
                              name="businessType"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1}>
                            <CIcon icon={cilGlobeAlt} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>Website URL</label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="businessUrl"
                              type="text"
                              className="form-control"
                              placeholder={'Enter website URL'}
                            />
                            <ErrorMessage
                              name="businessUrl"
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
                          <CCol md={1}>
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>CAGE Code</label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="cageCode"
                              type="text"
                              className="form-control"
                              placeholder={'Enter CAGE code'}
                            />
                            <ErrorMessage
                              name="cageCode"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1}>
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>DUNS No.</label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="dunsNo"
                              type="text"
                              className="form-control"
                              placeholder={'Enter DUNS number'}
                            />
                            <ErrorMessage
                              name="dunsNo"
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
                          <CCol md={1}>
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>PAN No.</label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="panNo"
                              type="text"
                              className="form-control"
                              placeholder={'Enter PAN number'}
                            />
                            <ErrorMessage
                              name="panNo"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1}>
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>TAN No.</label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="tanNo"
                              type="text"
                              className="form-control"
                              placeholder={'Enter TAN number'}
                            />
                            <ErrorMessage
                              name="tanNo"
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
                          <CCol md={1}>
                            <CIcon icon={cilCalendar} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>Registration Date</label>
                          </CCol>
                          <CCol md={8}>
                            <DatePicker
                              selected={
                                values.registrationDate
                                  ? new Date(values.registrationDate)
                                  : null
                              }
                              onChange={date =>
                                setFieldValue('registrationDate', date)
                              }
                              dateFormat="yyyy-MM-dd"
                              className="form-control"
                              placeholderText={'Select registration date'}
                            />
                            <ErrorMessage
                              name="registrationDate"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1}>
                            <CIcon icon={cilCreditCard} size="lg" />
                          </CCol>
                          <CCol md={3}>
                            <label>Description</label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="companyDescription"
                              type="text"
                              className="form-control"
                              placeholder={'Enter Company Description'}
                            />
                            <ErrorMessage
                              name="companyDescription"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={12}>
                        <button
                          type="submit"
                          className="btn btn-success custom-btn shadow">
                          Submit
                        </button>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CompanyBusinessDetails;
