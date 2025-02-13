// import React from 'react';

// const ImportExportDetail = () => {
//   return <div>ImportExportDetail</div>;
// };

// export default ImportExportDetail;
import {CCardHeader, CContainer, CRow, CCol, CButton} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import React, {useState, useRef, useEffect} from 'react';
import Select from 'react-select';
import * as Yup from 'yup';
import {Link, useNavigate} from 'react-router-dom';
import {
  cilBasket,
  cilGlobeAlt,
  cilMap,
  cilBriefcase,
  cilIndustry,
  cilPlus,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {Accordion} from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import Modal from 'react-bootstrap/Modal';
import ImportExportDetailList from './ImportExportDetailList';
import {
  getCountryList,
  getIndustryTypeList,
  getProductNameList,
  getServiceList,
  getStateList,
} from '../../../service/AllDrowpdownAPI';
import {postImport_Export} from '../../../service/RegistrationModule/ImportExportDetail';
import AddProductType from '../../components/ModalComponents/AddProductType';
import AddIndustryType from '../../components/ModalComponents/AddIndustryType';
import {
  fetchCountryOptions,
  fetchIndustryTypeOptions,
  fetchProductOptions,
  fetchServiceOptions,
  fetchStateOptions,
} from '../../AllDropdown';

const ImportExportDetail = () => {
  const formikRef = useRef(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [industryTypeOptions, setIndustryTypeOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const navigate = useNavigate();
  const [showTable, setShowTable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [modalType, setModalType] = useState(null);
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);

  const [selectedState, setSelectedState] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    industryType: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    // productName: Yup.array()
    //   .of(Yup.string())
    //   .min(1, 'Required')
    //   .required('Required'),
    // serviceName: Yup.array()
    //   .of(Yup.string())
    //   .min(1, 'Required')
    //   .required('Required'),

    countryName: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
    stateName: Yup.array()
      .of(Yup.string())
      .min(1, 'Required')
      .required('Required'),
  });

  const handleModalSubmit = () => {
    console.log('Referral Code Submitted:', referralCode);
    setShowPopup(false);
    setShowPaymentPopup(true);
  };

  const handleModalSkip = () => {
    console.log('Skipped Referral Code');
    setShowPopup(false);
    setShowPaymentPopup(true);
  };
  const handlePaymentContinue = () => {
    setShowPaymentPopup(true);
    console.log('Navigating to dashboard...');
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchCountryOptions = async () => {
      const countryData = await getCountryList();
      if (countryData && Array.isArray(countryData)) {
        setCountryOptions(
          countryData.map(data => ({label: data, value: data})),
        );
      }
    };

    fetchCountryOptions();
  }, []);

  const fetchStateOptions = async selectedCountry => {
    if (!selectedCountry) return;

    const stateData = await getStateList(selectedCountry);
    if (stateData && Array.isArray(stateData)) {
      setStateOptions(stateData.map(data => ({label: data, value: data})));
    } else {
      setStateOptions([]);
    }
  };

  const getIndustryTypeList = async () => {
    const result = await fetchIndustryTypeOptions();
    setIndustryTypeOptions(result || []);
  };
  const getProductList = async () => {
    const result = await fetchProductOptions();
    setProductOptions(result || []);
  };
  const getServiceList = async () => {
    const result = await fetchServiceOptions();
    setServiceOptions(result || []);
  };
  useEffect(() => {
    getIndustryTypeList();
    getProductList();
    getServiceList();
  }, []);
  const handleSubmit = async (values, actions) => {
    const companyId = sessionStorage.getItem('_id');

    if (!companyId) {
      console.error('Company ID not found in session storage');
      return;
    }

    const postData = {
      _id: companyId,
      percentage: '100',
      importExportDetails: [
        {
          productName: values.type === 'Product' ? values.productName : [],
          serviceName: values.type === 'Service' ? values.serviceName : [],
          countryName: values.countryName,
          stateName: values.stateName,
          industryType: values.industryType,
        },
      ],
    };

    try {
      console.log('Submitting postData:', JSON.stringify(postData, null, 2));

      const result = await postImport_Export(postData);
      console.log('Submission result: ', result);
      if (result.status === 200) {
        swal({
          title: 'Great',
          text: result.data,
          icon: 'success',
          timer: 2000,
          buttons: false,
        }).then(() => {
          setShowPopup(true);
        });
      }
    } catch (error) {
      console.error(
        'Error in adding director details:',
        error?.response || error,
      );

      if (error?.response?.status === 400) {
        swal({
          title: 'Warning',
          text: error.response?.data || 'Invalid data',
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
    setShowTable(prev => !prev); // Toggle the visibility of the submitted data table
  };

  const handleOpenModal = type => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };
  return (
    <>
      <div className="card shadow mb-2 card-mt-fix">
        <CCardHeader className="mb-4">
          <strong>Import and Export</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              type: 'Product',
              productName: [],
              serviceName: [],
              countryName: [],
              stateName: [],
              industryType: [],
            }}
            onSubmit={handleSubmit}>
            {formik => (
              <Form>
                {/* Radio Buttons for Type Selection */}
                <CRow
                  className="d-flex justify-content-center align-items-center mb-5"
                  style={{height: '100vh'}}>
                  <CCol md={3} className="text-center">
                    <label className="custom-checkbox">
                      <Field
                        type="radio"
                        name="type"
                        value="Product" // Updated value
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>
                      <span
                        className="label-text"
                        style={{fontSize: '16px', fontWeight: 'bold'}}>
                        Product Details
                      </span>
                    </label>
                  </CCol>
                  <CCol md={3} className="text-center">
                    <label className="custom-checkbox">
                      <Field
                        type="radio"
                        name="type"
                        value="Service" // Updated value
                        className="hidden-radio"
                      />
                      <span className="checkmark"></span>
                      <span
                        className="label-text"
                        style={{fontSize: '16px', fontWeight: 'bold'}}>
                        Service Details
                      </span>
                    </label>
                  </CCol>
                </CRow>

                {formik.values.type && (
                  <>
                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon
                              icon={
                                formik.values.type === 'Product'
                                  ? cilBasket
                                  : cilBriefcase
                              }
                              size="lg"
                            />
                          </CCol>

                          <CCol md={3} className="pl-1">
                            <label htmlFor="productName" className="form-label">
                              {formik.values.type === 'Product'
                                ? 'Product Name'
                                : 'Service Name'}
                            </label>
                          </CCol>

                          <CCol md={8} className="d-flex align-items-center">
                            {/* Conditional rendering of field type */}
                            {formik.values.type === 'Product' ? (
                              <Field name="productName">
                                {({field, form}) => (
                                  <CreatableSelect
                                    isMulti
                                    name={field.name}
                                    value={productOptions.filter(option =>
                                      field.value.includes(option.value),
                                    )}
                                    options={productOptions}
                                    className="basic-multi-select flex-grow-1"
                                    classNamePrefix="select"
                                    onChange={selected => {
                                      if (selected && selected.length > 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }

                                      // Correctly setting the field value as an array of option values (not nested arrays)
                                      form.setFieldValue(
                                        field.name,
                                        selected
                                          ? selected.map(option => option.value)
                                          : [],
                                      );
                                    }}
                                    onCreateOption={inputValue => {
                                      if (field.value.length >= 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }
                                      const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                      };
                                      setProductOptions(prevOptions => [
                                        ...prevOptions,
                                        newOption,
                                      ]);
                                      // Correctly adding the new option value to the field array (not nested array)
                                      form.setFieldValue(field.name, [
                                        ...field.value,
                                        inputValue,
                                      ]);
                                    }}
                                    styles={{
                                      container: provided => ({
                                        ...provided,
                                        width: '100%',
                                      }),
                                    }}
                                  />
                                )}
                              </Field>
                            ) : (
                              <Field name="serviceName">
                                {({field, form}) => (
                                  <CreatableSelect
                                    isMulti
                                    name={field.name}
                                    value={serviceOptions.filter(option =>
                                      field.value.includes(option.value),
                                    )}
                                    options={serviceOptions}
                                    className="basic-multi-select flex-grow-1"
                                    classNamePrefix="select"
                                    onChange={selected => {
                                      if (selected && selected.length > 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }

                                      // Correctly setting the field value as an array of option values (not nested arrays)
                                      form.setFieldValue(
                                        field.name,
                                        selected
                                          ? selected.map(option => option.value)
                                          : [],
                                      );
                                    }}
                                    onCreateOption={inputValue => {
                                      if (field.value.length >= 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }
                                      const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                      };
                                      setServiceOptions(prevOptions => [
                                        ...prevOptions,
                                        newOption,
                                      ]);
                                      // Correctly adding the new option value to the field array (not nested array)
                                      form.setFieldValue(field.name, [
                                        ...field.value,
                                        inputValue,
                                      ]);
                                    }}
                                    styles={{
                                      container: provided => ({
                                        ...provided,
                                        width: '100%',
                                      }),
                                    }}
                                  />
                                )}
                              </Field>
                            )}

                            {formik.values.type === 'Product' && (
                              <button
                                type="button"
                                className="btn btn-light btn-sm mx-3"
                                onClick={() => handleOpenModal('product')}>
                                <CIcon icon={cilPlus} size="lg" />
                              </button>
                            )}
                          </CCol>
                          {/* <ErrorMessage
                            name={
                              formik.values.type === 'Product'
                                ? 'productName'
                                : 'serviceName'
                            }
                            component="div"
                            className="text-danger"
                          /> */}
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilIndustry} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label
                              htmlFor="industryType"
                              className="form-label">
                              Industry Type
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field name="industryType">
                              {({field, form}) => (
                                <div className="d-flex">
                                  <CreatableSelect
                                    isMulti
                                    name={field.name}
                                    value={industryTypeOptions.filter(option =>
                                      field.value.includes(option.value),
                                    )}
                                    options={industryTypeOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={selected => {
                                      if (selected && selected.length > 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }

                                      form.setFieldValue(
                                        field.name,
                                        selected
                                          ? selected.map(option => option.value)
                                          : [],
                                      );
                                    }}
                                    onCreateOption={inputValue => {
                                      if (field.value.length >= 10) {
                                        alert(
                                          'You can select only up to 10 options.',
                                        );
                                        return;
                                      }

                                      const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                      };

                                      setIndustryTypeOptions(prevOptions => [
                                        ...prevOptions,
                                        newOption,
                                      ]);

                                      form.setFieldValue(field.name, [
                                        ...field.value,
                                        inputValue,
                                      ]);
                                    }}
                                    styles={{
                                      container: provided => ({
                                        ...provided,
                                        width: '100%',
                                      }),
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-light btn-sm ml-2 mx-3"
                                    onClick={() => handleOpenModal('industry')}>
                                    <CIcon icon={cilPlus} size="lg" />
                                  </button>
                                </div>
                              )}
                            </Field>
                            <ErrorMessage
                              name="industryType"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                      {/* Modal Components */}
                      {modalType === 'industry' && (
                        <AddIndustryType
                          isOpen={modalType === 'industry'}
                          onClose={handleCloseModal}
                          industryOptions={industryOptions}
                          setIndustryOptions={setIndustryOptions}
                        />
                      )}
                      {modalType === 'product' && (
                        <AddProductType
                          isOpen={modalType === 'product'}
                          onClose={handleCloseModal}
                          productTypeOptions={productTypeOptions}
                          setProductTypeOptions={setProductTypeOptions}
                        />
                      )}
                    </CRow>
                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilGlobeAlt} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="countryName" className="form-label">
                              Country Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Select
                              isMulti
                              name="countryName"
                              options={countryOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={selectedOptions => {
                                const countries = selectedOptions
                                  ? selectedOptions.map(option => option.value)
                                  : [];
                                formik.setFieldValue('countryName', countries); // Use formik.setFieldValue
                                formik.setFieldValue('stateName', []); // Reset states
                                fetchStateOptions(countries); // Fetch states for selected countries
                              }}
                              value={countryOptions.filter(
                                option =>
                                  formik.values.countryName.includes(
                                    option.value,
                                  ), // Use formik.values
                              )}
                            />
                            <ErrorMessage
                              name="countryName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilMap} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="stateName" className="form-label">
                              State Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Select
                              isMulti
                              name="stateName"
                              options={stateOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={selectedOptions => {
                                const states = selectedOptions
                                  ? selectedOptions.map(option => option.value)
                                  : [];
                                formik.setFieldValue('stateName', states); // Use formik.setFieldValue
                              }}
                              value={stateOptions.filter(
                                option =>
                                  formik.values.stateName.includes(
                                    option.value,
                                  ), // Use formik.values
                              )}
                            />
                            <ErrorMessage
                              name="stateName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                  </>
                )}
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

                  <Link to="/dashboard">
                    <button className="btn btn-secondary custom-btn shadow">
                      Skip
                    </button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {showTable && <ImportExportDetailList />}

      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Referral Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Referral Code"
            value={referralCode}
            onChange={e => setReferralCode(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <CButton color="secondary" onClick={handleModalSkip}>
            Skip
          </CButton>
          <CButton color="primary" onClick={handleModalSubmit}>
            Submit
          </CButton>
        </Modal.Footer>
      </Modal>
      {/* Payment Modal */}
      <Modal
        show={showPaymentPopup}
        onHide={() => setShowPaymentPopup(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>All Payment Options</h6>
          <Accordion defaultActiveKey="0">
            {/* UPI */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  <img
                    src="https://img.icons8.com/color/48/google-pay.png"
                    alt="UPI Icon"
                    style={{width: '20px', marginRight: '10px'}}
                  />
                  UPI
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>UPI Payment Options will appear here.</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* Cards */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  <img
                    src="https://img.icons8.com/color/48/visa.png"
                    alt="Cards Icon"
                    style={{width: '20px', marginRight: '10px'}}
                  />
                  Cards
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>Enter your Credit/Debit Card details here.</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* Netbanking */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  <img
                    src="https://img.icons8.com/color/48/bank-building.png"
                    alt="Netbanking Icon"
                    style={{width: '20px', marginRight: '10px'}}
                  />
                  Netbanking
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>Select your bank for net banking payment.</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* EMI */}
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  <img
                    src="https://img.icons8.com/color/48/loan.png"
                    alt="EMI Icon"
                    style={{width: '20px', marginRight: '10px'}}
                  />
                  EMI
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>EMI options will appear here.</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* Wallet */}
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  <img
                    src="https://img.icons8.com/color/48/mobile-payment.png"
                    alt="Wallet Icon"
                    style={{width: '20px', marginRight: '10px'}}
                  />
                  Wallet
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>Select your preferred wallet for payment.</p>
              </Accordion.Body>
            </Accordion.Item>

            {/* Pay Later */}
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  <img
                    src="https://img.icons8.com/color/48/time.png"
                    alt="Pay Later Icon"
                    style={{width: '20px', marginRight: '10px'}}
                  />
                  Pay Later
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>Pay Later options will appear here.</p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>

        {/* Footer with Price and Continue Button */}
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <div className="price-section">
            <h5 className="m-0">₹600</h5>
          </div>
          <CButton color="primary" onClick={handlePaymentContinue}>
            Continue
          </CButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImportExportDetail;
