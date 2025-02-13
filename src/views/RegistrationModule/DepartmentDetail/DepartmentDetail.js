import {CCardHeader, CRow, CCol} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useEffect} from 'react';
import {
  cilCreditCard,
  cilUser,
  cilPhone,
  cilEnvelopeOpen,
  cilLockLocked,
  cilTag,
} from '@coreui/icons';
import * as Yup from 'yup';
import Select from 'react-select';
import CIcon from '@coreui/icons-react';

import DepartmentDetailList from './DepartmentDetailList';

import {getGSTList} from '../../../service/AllDrowpdownAPI';
import {
  getValidateContact,
  getValidateEmail,
  getValidateUserName,
} from '../../../service/validationApis';
import {postDepartment} from '../../../service/RegistrationModule/DepartmentAPIs';
import {
  validateContact,
  validateEmail,
  validateUserName,
} from '../../components/Validation';

const DepartmentDetail = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [gstOptions, setGstOptions] = useState([]);
  const [validateUserNameList, setValidateUserNameList] = useState([]);
  const [validateEmailList, setValidateEmailList] = useState([]);
  const [validateContactList, setValidateContactList] = useState([]);
  useEffect(() => {
    const fetchGSTOptions = async () => {
      const companyId = sessionStorage.getItem('fkCompanyId');
      console.log('companyId found in sessionStorage:', companyId);

      if (!companyId) {
        console.error('No companyId found in sessionStorage');
        return;
      }

      const gstData = await getGSTList(companyId);
      if (gstData && Array.isArray(gstData)) {
        setGstOptions(
          gstData.map(gst => ({
            label: gst,
            value: gst,
          })),
        );
      }
    };

    fetchGSTOptions();
  }, []);
  const departmentOptions = [
    {value: 'Sales', label: 'Sales'},
    {value: 'Purches', label: 'Purches'},
    {value: 'Store', label: 'Store'},
  ];
  const initialValues = {
    _id: '',
    gstNo: '',
    deptType: [],
    name: '',
    panNo: '',
    role: '',
    designation: '',
    mobileNo: '',
    email: '',
    username: '',
    password: '',
  };
  const validationSchema = Yup.object().shape({
    gstNo: Yup.string().required('Required'),
    deptType: Yup.array()
      .of(Yup.string())
      .min(1, 'Select at least one department'),
    name: Yup.string().required('Required'),
    panNo: Yup.string().required('Required'),
    role: Yup.string().required('Required'),
    designation: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required'),

    mobileNo: Yup.string()
      .required('Required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .test(
        'not-starting-with-zero',
        'Mobile number should not start with 0',
        value => value && !value.startsWith('0'),
      ),
    email: Yup.string().required('Required').email('Invalid email format'),
  });

  const handleListClick = () => {
    setShowTable(prev => !prev);
  };

  // const fetchDepartmentDetails = async companyId => {
  //   try {
  //     const result = await getDirectorDetails(companyId);
  //     console.log('get Department Details result:', result);
  //     console.log('get Department Details result:', result.data.content);
  //     setSubmittedData(result.data.content);
  //   } catch (error) {
  //     console.error('Error fetching  Department Details:', error);
  //   }
  // };

  // useEffect(() => {
  //   const companyId = sessionStorage.getItem('_id');
  //   console.log('companyId found in sessionStorage', companyId);

  //   if (companyId) {
  //     fetchDepartmentDetails(companyId);
  //   } else {
  //     console.error('No companyId found in sessionStorage');
  //   }
  // }, []);

  // Fetch the list of usernames from the API
  const getValidateUserNameList = async () => {
    try {
      let result = await getValidateUserName();
      console.log('getValidateUserName result:', result);
      setValidateUserNameList(result?.data || []);
    } catch (error) {
      console.error('getValidateUserName error:', error);
    }
  };

  const getValidateEmailList = async () => {
    try {
      let result = await getValidateEmail();
      console.log('getValidateEmailList result:', result);
      setValidateEmailList(result?.data || []);
    } catch (error) {
      console.error('getValidateEmailList error:', error);
    }
  };

  const getValidateContactList = async () => {
    try {
      let result = await getValidateContact();
      console.log('getValidateContactList result:', result);
      setValidateContactList(result?.data || []);
    } catch (error) {
      console.error('getValidateContactList error:', error);
    }
  };
  useEffect(() => {
    getValidateUserNameList();
    getValidateEmailList();
    getValidateContactList();
  }, []);

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className=" mb-4">
          <strong> Add Department/ My Teams</strong>
        </CCardHeader>
        <div className="card-body ">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('fkCompanyId');
              const pkDepartmentId = sessionStorage.getItem('pkDepartmentId');

              if (!companyId || !pkDepartmentId) {
                swal({
                  title: 'Error',
                  text: 'Missing company or department ID in session storage!',
                  icon: 'error',
                  timer: 2000,
                  buttons: false,
                });
                return;
              }

              console.log(
                'Company ID:',
                companyId,
                'Department ID:',
                pkDepartmentId,
              );

              try {
                const postData = {
                  _id: companyId,
                  percentage: '36',
                  departmentUsers: [
                    {
                      gstNo: values.gstNo,
                      deptType: values.deptType,
                      name: values.name,
                      panNo: values.panNo,
                      role: 'user',
                      designation: values.designation,
                      mobileNo: values.mobileNo,
                      countryCode: '',
                      email: values.email,
                      username: values.username,
                      password: values.password,
                      createdBy: values.username,
                      fkAdminId: pkDepartmentId,
                    },
                  ],
                };

                console.log('Posting Data:', postData);

                // API Call
                const result = await postDepartment(postData);

                console.log('API Response:', result);

                // Ensure response is valid
                if (result?.status === 200 && result?.data) {
                  let pkDeptId;

                  // If result.data is an object
                  if (typeof result.data === 'object') {
                    pkDeptId = result.data.pkDeptId;
                  } else if (typeof result.data === 'string') {
                    // If result.data is a string, extract pkDeptId
                    const responseData = result.data.split(', ');
                    const pkDeptIdKeyValue = responseData.find(item =>
                      item.startsWith('pkDeptId:'),
                    );
                    pkDeptId = pkDeptIdKeyValue?.split(':')[1];
                  }

                  if (pkDeptId) {
                    console.log('Extracted pkDeptId:', pkDeptId);
                    sessionStorage.setItem('pkDeptId', pkDeptId);

                    setSubmittedData(prevData => [
                      ...prevData,
                      postData.departmentUsers[0],
                    ]);

                    swal({
                      title: 'Success',
                      text: 'Department User Created Successfully',
                      icon: 'success',
                      timer: 2000,
                      buttons: false,
                    });
                  } else {
                    throw new Error('pkDeptId not found in response');
                  }
                } else {
                  throw new Error('Unexpected response format or status');
                }
              } catch (error) {
                console.error(
                  'Error submitting form:',
                  error?.response || error,
                );

                swal({
                  title: 'Error',
                  text:
                    error?.response?.data?.message || 'Something went wrong!',
                  icon: 'error',
                  timer: 2000,
                  buttons: false,
                });
              } finally {
                actions.setSubmitting(false);
                actions.resetForm();
              }
            }}>
            {({handleSubmit}) => (
              <Form onSubmit={handleSubmit}>
                <CRow className="align-items-center mb-3">
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilTag} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="gstNo" className="form-label">
                          GST No
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field name="gstNo">
                          {({field, form}) => (
                            <Select
                              name="gstNo"
                              options={gstOptions}
                              className="basic-select"
                              classNamePrefix="select"
                              placeholder="Select GST No"
                              onChange={selected => {
                                form.setFieldValue(
                                  field.name,
                                  selected ? selected.value : '',
                                );
                              }}
                              value={
                                gstOptions.find(
                                  option => option.value === field.value,
                                ) || null
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="gstNo"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilUser} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Enter Name"
                        />
                        <ErrorMessage
                          name="name"
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
                        <CIcon icon={cilCreditCard} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="deptType" className="form-label">
                          Department Type
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field name="deptType">
                          {({field, form}) => (
                            <Select
                              isMulti
                              name="deptType"
                              options={departmentOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              placeholder="Select Departments"
                              onChange={selected => {
                                form.setFieldValue(
                                  field.name,
                                  selected
                                    ? selected.map(option => option.value)
                                    : [],
                                );
                              }}
                              value={departmentOptions.filter(option =>
                                (field.value || []).includes(option.value),
                              )}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="deptType"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilUser} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="designation" className="form-label">
                          Designation
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="designation"
                          type="text"
                          className="form-control"
                          placeholder="Enter Designation"
                        />
                        <ErrorMessage
                          name="designation"
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
                        <CIcon icon={cilUser} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="username"
                          type="text"
                          className="form-control"
                          placeholder="Enter Username"
                          validate={value =>
                            validateUserName(value, validateUserNameList)
                          }
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilLockLocked} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="password"
                          type="text"
                          className="form-control"
                          placeholder="Enter Password"
                        />
                        <ErrorMessage
                          name="password"
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
                        <CIcon icon={cilPhone} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="mobileNo" className="form-label">
                          Contact No.
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="mobileNo"
                          type="text"
                          className="form-control"
                          placeholder="Enter Contact Number"
                          validate={value =>
                            validateContact(value, validateContactList)
                          }
                        />
                        <ErrorMessage
                          name="mobileNo"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilEnvelopeOpen} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="email" className="form-label">
                          Email Id
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="email"
                          type="text"
                          className="form-control"
                          placeholder="Enter Email"
                          validate={value =>
                            validateEmail(value, validateEmailList)
                          }
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
                  <CCol md={6}>
                    <CRow className="align-items-center mb-3">
                      <CCol md={1} className="pr-0">
                        <CIcon icon={cilCreditCard} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="panNo" className="form-label">
                          User PAN No.
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="panNo"
                          type="text"
                          className="form-control"
                          placeholder="Enter PAN No"
                        />
                        <ErrorMessage
                          name="panNo"
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
      {showTable && <DepartmentDetailList />}
    </>
  );
};

export default DepartmentDetail;
