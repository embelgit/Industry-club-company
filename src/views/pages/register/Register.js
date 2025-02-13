import * as Yup from "yup";
import SwitchButton from '../../components/SwitchButton';
import { CCardHeader, CContainer } from "@coreui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import {
  cibMailRu,
  cilBuilding,
  cilCreditCard,
  cilFile,
  cilLocationPin,
  cilLockLocked,
  cilPhone,
  cilPin,
  cilUser,
} from "@coreui/icons";
import ToggleEye from '../../components/ToggleEye';
import { generateOTP, signUp } from "../../../service/AllAuthAPI";
import { getCountryAdminDD, getCountryDD } from '../../AllDrowpdown/OnLoadDropDown';
import { getStateAdminDD, getStateDD, getCityAdminDD, getCityDD, getGroupAdminDD, getPortalUserDD } from '../../AllDrowpdown/OnStateDropDown';
import CIcon from "@coreui/icons-react";
import Loader from "../../components/Loader";
import Select from "react-select";
import { role } from '../../AllDrowpdown/StaticDropDown';
import TextError from "../../components/TextError";
import swal from "sweetalert";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [loader, setLoader] = useState(false);
  const [eyePass, setEyePass] = useState(false);
  const [countryAdminDropDownList, setCountryAdminDropDownList] = useState([]);
  const [countryAdminId, setCountryAdminId] = useState(null);
  const [countryDropDownList, setCountryDropDownList] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [stateAdminDropDownList, setStateAdminDropDownList] = useState([]);
  const [stateAdminId, setStateAdminId] = useState(null);
  const [stateDropDownList, setStateDropDownList] = useState([]);
  const [stateName, setStateName] = useState(null);
  const [cityAdminDropDownList, setCityAdminDropDownList] = useState([]);
  const [cityAdminId, setCityAdminId] = useState(null);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [cityName, setCityName] = useState(null);
  const [groupAdminDropDownList, setGroupAdminDropDownList] = useState([]);
  const [groupAdminId, setGroupAdminId] = useState(null);
  const [portalUserDropDownList, setPortalUserDropDownList] = useState([]);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const initialValues = {
    country: null,
    phoneNo: "",
    panNo: "",
    adharNo: "",
    firstName: "",
    lastName: "",
    email: "",
    alterPhoneNo: "",
    emergencyNo: "",
    role: null,
    countryAdminId: null,
    stateAdminId: null,
    cityAdminBoolean: false,
    cityAdminId: null,
    groupAdminBoolean: false,
    groupAdminId: null,
    portalUserBoolean: false,
    portalUserId: null,
    username: "",
    password: "",
    state: null,
    city: null,
    pinCode: "",
    createdBy: "",
    address: "",
  };

  /* The function toggles the visibility of a password input field. */
  const eyeTogglePass = () => {
    setEyePass(!eyePass);
  };

  const getCountryAdminDropDownList = async () => {
    let result = await getCountryAdminDD();
    setCountryAdminDropDownList(result);
  }

  const getCountryDropDownList = async () => {
    let result = await getCountryDD();
    setCountryDropDownList(result);
  }

  const getStateAdminDropDownList = async () => {
    let result = await getStateAdminDD(countryAdminId?.id);
    setStateAdminDropDownList(result);
  }

  const getStateDropDownList = async () => {
    let result = await getStateDD(countryName);
    setStateDropDownList(result);
  }

  const getCityAdminDropDownList = async () => {
    let result = await getCityAdminDD(stateAdminId?.id);
    setCityAdminDropDownList(result);
  }

  const getCityDropDownList = async () => {
    let result = await getCityDD(stateName?.value);
    setCityDropDownList(result);
  }

  const getGroupAdminDropDownList = async () => {
    let result = await getGroupAdminDD(cityAdminId?.id);
    setGroupAdminDropDownList(result);
  }

  const getPortalUserDropDownList = async () => {
    let result = await getPortalUserDD(groupAdminId?.id);
    setPortalUserDropDownList(result);
  }

  useEffect(() => {
    getCountryAdminDropDownList();
    getCountryDropDownList();
  }, []);

  useEffect(() => {
    if (countryAdminId) {
      getStateAdminDropDownList();
    }
  }, [countryAdminId?.id]);

  useEffect(() => {
    if (countryName) {
      getStateDropDownList();
    }
  }, [countryName]);

  useEffect(() => {
    if (stateAdminId) {
      getCityAdminDropDownList();
    }
  }, [stateAdminId?.id]);

  useEffect(() => {
    if (stateName) {
      getCityDropDownList();
    }
  }, [stateName?.value]);

  useEffect(() => {
    if (cityAdminId) {
      getGroupAdminDropDownList();
    }
  }, [cityAdminId?.id]);

  useEffect(() => {
    if (groupAdminId) {
      getPortalUserDropDownList();
    }
  }, [groupAdminId?.id]);

  /* The `message` parameter is a variable that represents the input message that will be returned by the `customMessage` function. */
  const customMessage = (message) => {
    return message;
  };

  const validationSchema = Yup.object().shape({
    country: Yup.object().required("Required"),
    phoneNo: Yup.string().required("Required"),
    // panNo: Yup.string()
    //   .required("Required")
    //   .matches(
    //     /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/,
    //     "Please Enter Valid Pan Card Number(ex- ABCDE1234F)",
    //   ),
    // adharNo: Yup.string()
    //   .required("Required")
    //   .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, "Invalid Aadhar number"),

    panNo: Yup.string().when('country', {
      is: (value) => value?.value?.toLowerCase() === 'india',
      then: (schema) => schema
        .required("Required")
        .matches(
          /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/,
          "Please Enter Valid Pan Card Number (e.g., ABCDE1234F)"
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    adharNo: Yup.string().when('country', {
      is: (value) => value?.value?.toLowerCase() === 'india',
      then: (schema) => schema
        .required("Required")
        .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, "Invalid Aadhar number"),
      otherwise: (schema) => schema.notRequired(),
    }),
    firstName: Yup.string()
      .required("Required")
      .matches(/^[A-Za-z\s]+$/, "Enter only alphabets")
      .min(2, "Too Short!"),
    lastName: Yup.string()
      .required("Required")
      .matches(/^[A-Za-z\s]+$/, "Enter only alphabets")
      .min(2, "Too Short!"),
    email: Yup.string().required("Required").email("Invalid email"),
    emergencyNo: Yup.string().required("Required"),
    role: Yup.object().required("Required"),
    countryAdminId: Yup.object().required("Required"),
    stateAdminId: Yup.object().required("Required"),
    cityAdminBoolean: Yup.boolean(),
    cityAdminId: Yup.object()
    .nullable()
    .test('is-required', 'Required', function (value) {
      const { cityAdminBoolean } = this.parent;
      if (
        cityAdminBoolean
      ) {
        return !!value;
      }
      return true;
    }),
    // cityAdminId: Yup.mixed().nullable().when('cityAdminBoolean', {
    //   is: (value) => value === true,
    //   then: Yup.mixed().required('Required'),
    //   otherwise: Yup.mixed().nullable(),
    // }),
    groupAdminBoolean: Yup.boolean(),
    groupAdminId: Yup.object()
    .nullable()
    .test('is-required', 'Required', function (value) {
      const { groupAdminBoolean } = this.parent;
      if (
        groupAdminBoolean
      ) {
        return !!value;
      }
      return true;
    }),
    // groupAdminId: Yup.mixed().nullable().when('groupAdminBoolean', {
    //   is: (value) => value === true,
    //   then: Yup.mixed().required('Required'),
    //   otherwise: Yup.mixed().nullable(),
    // }),
    portalUserBoolean: Yup.boolean(),
    portalUserId: Yup.object()
    .nullable()
    .test('is-required', 'Required', function (value) {
      const { portalUserBoolean } = this.parent;
      if (
        portalUserBoolean
      ) {
        return !!value;
      }
      return true;
    }),
    // portalUserId: Yup.mixed().nullable().when('portalUserBoolean', {
    //   is: (value) => value === true,
    //   then: Yup.mixed().required('Required'),
    //   otherwise: Yup.mixed().nullable(),
    // }),
    username: Yup.string().required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Must contain at least 1 digit (0-9)")
      .matches(/[a-z]/, "Must contain at least 1 lowercase letter (a-z)")
      .matches(/[A-Z]/, "Must contain at least 1 uppercase letter (A-Z)")
      .matches(/[^\w]/, "Must contain at least 1 symbol"),
    state: Yup.object().required("Required"),
    city: Yup.object().required("Required"),
    pinCode: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
  });

  const sendOTP = async (e) => {
    try {
      let result = await generateOTP(e);
      console.log("generateOTP result :-", result);
      // if (result.status === 200) {
      //   swal({
      //     title: "Great",
      //     text: "OTP sent On Your Email Please Check Your Email",
      //     icon: "success",
      //     timer: 2000,
      //     buttons: false,
      //   });
      //   navigate("/verify-otp", { state: { email: e } });
      // }
    } catch (error) {
      console.log("generateOTP error :-", error);
      // if (error.response.status === 409) {
      //   swal({
      //     title: "Warning",
      //     text: `${error.response.data}`,
      //     icon: "warning",
      //     timer: 2000,
      //     buttons: false,
      //   });
      // }
    }
  };

  return (
    <CContainer className="border-bottom p-4">
      <div className="card shadow">
        <CCardHeader>
          <strong>Create Account</strong>
        </CCardHeader>
        <div className="card-body">
          {loader ? (
            <Loader />
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  setLoader(true);
                  const payload = {
                    country: values.country.value,
                    phoneNo: values.phoneNo,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    alterPhoneNo: values.alterPhoneNo,
                    emergencyNo: values.emergencyNo,
                    role: values.role.value,
                    countryAdminId: values.countryAdminId.id,
                    stateAdminId: values.stateAdminId.id,
                    cityAdminId: values.cityAdminId.id,
                    groupAdminId: values.groupAdminId.id,
                    portalUserId: values.portalUserId.id,
                    panNo: values.panNo,
                    adharNo: values.adharNo,
                    username: values.username,
                    password: values.password,
                    city: values.city,
                    pinCode: values.pinCode,
                    state: values.state,
                    createdBy: values.username,
                  };
                  console.log("signUp payload :-", payload);
                  const result = await signUp(payload);
                  console.log("signUp result :-", result);
                  if (result.status === 200) {
                    // swal({
                    //   title: "Great",
                    //   text: "User added successfully",
                    //   icon: "success",
                    //   timer: 2000,
                    //   buttons: false,
                    // });
                    sendOTP(values.email);
                    resetForm();
                  }
                } catch (error) {
                  console.log("addUser error :-", error.response);
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
                    <div className="row justify-content-around">
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilLocationPin} />
                        &nbsp;
                        <label className="form-label" htmlFor="country">
                          Country
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={countryDropDownList}
                          name="country"
                          maxMenuHeight={150}
                          placeholder="Select Country..."
                          value={formik.values.country}
                          onChange={(e) => {
                            formik.setFieldValue("country", e);
                            setCountryName(e.value);
                          }}
                        />
                        <ErrorMessage name="country" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilPhone} />
                        &nbsp;
                        <label className="form-label" htmlFor="phoneNo">
                          Contact No
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          type="number"
                          className="form-control"
                          name="phoneNo"
                          placeholder="Contact No"
                        />
                        <ErrorMessage name="phoneNo" component={TextError} />
                      </div>
                      {countryName === "India" || countryName === 'india' ? <>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilFile} />
                        &nbsp;
                        <label className="form-label" htmlFor="panNo">
                          Pan Card No
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          className="form-control"
                          name="panNo"
                          placeholder="Pan Card No"
                        />
                        <ErrorMessage name="panNo" component={TextError} />
                      </div>
                      </> : ""}
                      {countryName === "India" || countryName === 'india' ? <>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilFile} />
                        &nbsp;
                        <label className="form-label" htmlFor="adharNo">
                          Aadhar Card No
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          className="form-control"
                          name="adharNo"
                          placeholder="Aadhar Card"
                        />
                        <ErrorMessage name="adharNo" component={TextError} />
                      </div>
                      </> : ""}
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="firstName">
                          First Name
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          className="form-control"
                          name="firstName"
                          placeholder="First Name"
                        />
                        <ErrorMessage name="firstName" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="lastName">
                          Last Name
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          className="form-control"
                          name="lastName"
                          placeholder="Last Name"
                        />
                        <ErrorMessage name="lastName" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cibMailRu} />
                        &nbsp;
                        <label className="form-label" htmlFor="email">
                          Email Id
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          className="form-control"
                          name="email"
                          placeholder="Email Id"
                        />
                        <ErrorMessage name="email" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilPhone} />
                        &nbsp;
                        <label className="form-label" htmlFor="alterPhoneNo">
                          Alternate No
                        </label>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          type="number"
                          className="form-control"
                          name="alterPhoneNo"
                          placeholder="Alternate Contact No"
                        />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilPhone} />
                        &nbsp;
                        <label className="form-label" htmlFor="emergencyNo">
                          Emergency No
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          type="number"
                          className="form-control"
                          name="emergencyNo"
                          placeholder="Emergency Contact No"
                        />
                        <ErrorMessage name="emergencyNo" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="role">
                          Role
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={role}
                          name="role"
                          maxMenuHeight={150}
                          placeholder="Select Role..."
                          value={formik.values.role}
                          onChange={(e) => {
                            formik.setFieldValue("role", e);
                            setSelectedRole(e.value);
                          }}
                        />
                        <ErrorMessage name="role" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="countryAdminId">
                          Country Admin
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={countryAdminDropDownList}
                          name="countryAdminId"
                          maxMenuHeight={150}
                          placeholder="Select Country Admin..."
                          value={formik.values.countryAdminId}
                          onChange={(e) => {
                            formik.setFieldValue("countryAdminId", e);
                            setCountryAdminId(e);
                          }}
                        />
                        <ErrorMessage name="countryAdminId" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="stateAdminId">
                          State Admin
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={stateAdminDropDownList}
                          name="stateAdminId"
                          maxMenuHeight={150}
                          placeholder="Select State Admin..."
                          value={formik.values.stateAdminId}
                          onChange={(e) => {
                            formik.setFieldValue("stateAdminId", e);
                            setStateAdminId(e);
                          }}
                          noOptionsMessage={() =>
                            customMessage("Select Country Admin First")
                          }
                        />
                        <ErrorMessage name="stateAdminId" component={TextError} />
                      </div>
                      {selectedRole === "group_admin" || selectedRole === 'portal_user' || selectedRole === 'content_manager' ?
                      <>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="cityAdminBoolean">
                          City
                        </label>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                      <SwitchButton
                            name='cityAdminBoolean'
                            // component={TextError}
                          />
                      </div>
                      {formik.values.cityAdminBoolean ? <>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="cityAdminId">
                          City Admin
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={cityAdminDropDownList}
                          name="cityAdminId"
                          maxMenuHeight={150}
                          placeholder="Select City Admin..."
                          value={formik.values.cityAdminId}
                          onChange={(e) => {
                            formik.setFieldValue("cityAdminId", e);
                            setCityAdminId(e);
                          }}
                        />
                        <ErrorMessage name="cityAdminId" component={TextError} />
                      </div>
                      </> : ''}
                      </> : ''}
                      {selectedRole === 'portal_user' || selectedRole === 'content_manager' ?
                      <>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="groupAdminBoolean">
                          Group
                        </label>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                      <SwitchButton
                            name='groupAdminBoolean'
                            // component={TextError}
                          />
                      </div>
                      {formik.values.groupAdminBoolean ? <>

                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="groupAdminId">
                          Group Admin
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={groupAdminDropDownList}
                          name="groupAdminId"
                          maxMenuHeight={150}
                          placeholder="Select Group Admin..."
                          value={formik.values.groupAdminId}
                          onChange={(e) => {
                            formik.setFieldValue("groupAdminId", e);
                            setGroupAdminId(e);
                          }}
                        />
                        <ErrorMessage name="groupAdminId" component={TextError} />
                      </div>
                    </> : ''}
                      </> : ''}
                      {selectedRole === 'content_manager' ?
                      <>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="portalUserBoolean">
                          Portal
                        </label>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                      <SwitchButton
                            name='portalUserBoolean'
                            // component={TextError}
                          />
                      </div>
                      {formik.values.portalUserBoolean ? <>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="portalUserId">
                          Portal User
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={portalUserDropDownList}
                          name="portalUserId"
                          maxMenuHeight={150}
                          placeholder="Select Portal User..."
                          value={formik.values.portalUserId}
                          onChange={(e) => {
                            formik.setFieldValue("portalUserId", e);
                          }}
                        />
                        <ErrorMessage name="portalUserId" component={TextError} />
                      </div>
                      </> : ''}
                      </> : ''}
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilUser} />
                        &nbsp;
                        <label className="form-label" htmlFor="username">
                          User Name
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          className="form-control"
                          name="username"
                          placeholder="User Name"
                        />
                        <ErrorMessage name="username" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilLockLocked} />
                        &nbsp;
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3 position-relative">
                        <Field
                          type={eyePass ? "text" : "password"}
                          className="form-control"
                          name="password"
                          placeholder="Password"
                          autoComplete="true"
                        />
                        <ToggleEye
                          dClass={'p-eye'}
                                      state={eyePass}
                                      toggle={eyeTogglePass}
                                    />
                        <ErrorMessage name="password" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilBuilding} />
                        &nbsp;
                        <label className="form-label" htmlFor="state">
                          State
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={stateDropDownList}
                          name="state"
                          maxMenuHeight={150}
                          placeholder="Select State..."
                          value={formik.values.state}
                          onChange={(e) => {
                            formik.setFieldValue("state", e);
                            setStateName(e);
                          }}
                          noOptionsMessage={() =>
                            customMessage("Select Country First")
                          }
                        />
                        <ErrorMessage name="state" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilBuilding} />
                        &nbsp;
                        <label className="form-label" htmlFor="city">
                          City
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Select
                          options={cityDropDownList}
                          name="city"
                          maxMenuHeight={150}
                          placeholder="Select City..."
                          value={formik.values.city}
                          onChange={(e) => {
                            formik.setFieldValue("city", e);
                            setCityName(e);
                          }}
                        />
                        <ErrorMessage name="city" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilPin} />
                        &nbsp;
                        <label className="form-label" htmlFor="pinCode">
                          Pin Code
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          className="form-control"
                          name="pinCode"
                          placeholder="Pin Code"
                        />
                        <ErrorMessage name="pinCode" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6">
                        <CIcon icon={cilLocationPin} />
                        &nbsp;
                        <label className="form-label" htmlFor="address">
                          Address
                        </label>
                        <span className="text-danger fw-bold">*</span>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <Field
                          as="textarea"
                          className="form-control"
                          name="address"
                          placeholder="Address"
                        />
                        <ErrorMessage name="address" component={TextError} />
                      </div>
                      <div className="col-md-2 col-sm-6"></div>
                      <div className="col-md-4 col-sm-6 mb-3"></div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={formik.isSubmitting}
                    >
                      Submit
                    </button> &nbsp;
                    <button
                      type="reset"
                      onClick={() => {
                        formik.resetForm();
                        setCountryName("");
                        setSelectedRole("");
                      }}
                      className="btn btn-success ml-3"
                    >
                      Clear
                    </button>
                  </Form>
                );
              }}
            </Formik>
          )}
          <br />
          <div className='text-center'>
                      <p>
                      Already Registered?&nbsp;&nbsp;
                        <Link to="/login">Log in</Link>
                      </p>
                    </div>
        </div>
      </div>
    </CContainer>
  );
};

export default Register;
