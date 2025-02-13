import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import swal from 'sweetalert';
import {CCardHeader, CRow, CCol} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import Select from 'react-select';
import {
  cilUser,
  cilPhone,
  cilEnvelopeOpen,
  cilTag,
  cilCreditCard,
  cilLockLocked,
} from '@coreui/icons';
import {getGSTList} from '../../../service/AllDrowpdownAPI';
import {editDepartment} from '../../../service/RegistrationModule/DepartmentAPIs';

const UpdateDepartmentDetails = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [gstOptions, setGstOptions] = useState([]);

  const {state} = useLocation(); // Access the state passed from Link
  const {index} = useParams(); // Access the index from the route parameters

  // Fetch director details from state or default to null
  const DepartmentDetails = state?.DepartmentDetails || null;

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
    gstNo: DepartmentDetails?.gstNo || '',
    deptType: DepartmentDetails?.deptType || '',
    name: DepartmentDetails?.name || '',
    panNo: DepartmentDetails?.panNo || '',
    role: DepartmentDetails?.role || '',
    designation: DepartmentDetails?.designation || '',
    mobileNo: DepartmentDetails?.mobileNo || '',
    email: DepartmentDetails?.email || '',
    username: DepartmentDetails?.username || '',
    password: DepartmentDetails?.password || '',
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
      .matches(/^\d+$/, 'Phone number must be numeric'),
    email: Yup.string().email('Invalid email format').required('Required'),
  });

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

  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="mb-3">
          <strong>Update Department Details</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('fkCompanyId');
              const pkDeptId = sessionStorage.getItem('pkDeptId');
              console.log('companyId found in sessionStorage', companyId);
              try {
                const postData = {
                  _id: companyId,
                  departmentUsers: [
                    {
                      pkDeptId: pkDeptId,
                      gstNo: values.gstNo,
                      deptType: values.deptType,
                      name: values.name,
                      panNo: values.panNo,
                      role: values.role,
                      designation: values.designation,
                      mobileNo: values.mobileNo,
                      email: values.email,
                      username: values.username,
                      password: values.password,
                      createdBy: values.username,
                    },
                  ],
                };

                console.log('Add Department Details :-', postData);
                const result = await editDepartment(postData);
                console.log('Add Department Details :-', result);
                setSubmittedData(prevData => [
                  ...prevData,
                  postData.departmentUsers[0],
                ]);

                actions.resetForm();
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
                console.error('add GST error :-', error?.response || error);
                if (error?.response?.status === 400) {
                  swal({
                    title: 'Warning',
                    text: result.data,
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
                              // Match the initial value to the appropriate option
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
                          // validate={value =>
                          //   validateUserName(value, validateUserNameList)
                          // }
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
                          // validate={value =>
                          //   validateContact(value, validateContactList)
                          // }
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
                          // validate={value =>
                          //   validateEmail(value, validateEmailList)
                          // }
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
                        <CIcon icon={cilUser} size="lg" />
                      </CCol>
                      <CCol md={3} className="pl-1">
                        <label htmlFor="role" className="form-label">
                          Role
                        </label>
                      </CCol>
                      <CCol md={8}>
                        <Field
                          name="role"
                          type="text"
                          className="form-control"
                          placeholder="Enter Role"
                        />
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
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
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateDepartmentDetails;
