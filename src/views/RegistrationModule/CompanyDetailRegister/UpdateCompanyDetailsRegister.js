import {
  CCardHeader,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormSwitch,
  CRow,
  CCol,
} from '@coreui/react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import {
  cilGlobeAlt,
  cilLocationPin,
  cilBuilding,
  cilMap,
  cilPhone,
  cilTag,
  cilEnvelopeOpen,
  cilPencil,
  cilTrash,
  cilChevronLeft,
  cilChevronRight,
  cilCreditCard,
  cilCalendar,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import swal from 'sweetalert';

import {useLocation, useParams} from 'react-router-dom';
import {
  editGSTDetails,
  getBussinessDetails,
} from '../../../service/RegistrationModule/CompanyDetailsRegisterAPIs';
import {validateGST} from '../../components/Validation';
const UpdateCompanyDetailsRegister = () => {
  const [showTable, setShowTable] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [gstList, setGstList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [companyId, setCompanyId] = useState(null);
  const [submittedList, setSubmittedList] = useState([]); // Current page's data
  const [pageCount, setPageCount] = useState(0); // Total pages from backend
  const [currentPage, setCurrentPage] = useState(0); // Current page
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const size = 20; // Records per page
  const {state} = useLocation();
  const {index} = useParams();

  const GSTDetails = state?.GSTDetails || null;
  console.log('gstDetails', GSTDetails);

  const options = [
    {value: 'manufacturing', label: 'Manufacturing'},
    {value: 'import_export', label: 'Import & Export'},
    {value: 'Service Provider', label: 'Service Provider'},
    {value: 'Trender', label: 'Trender'},
  ];

  // ----------------    turnOver: TargetedVendor?.turnOver || '',------------------------------------------------------------------------------------------------------------//
  const initialValues = {
    address: GSTDetails?.address || '',
    businessName: GSTDetails?.businessName || '',
    cityName: GSTDetails?.cityName || '',
    countryName: GSTDetails?.countryName || '',
    establishedYear: GSTDetails?.establishedYear || '',
    gstEmailId: GSTDetails?.gstEmailId || '',
    gstMobileNo: GSTDetails?.gstMobileNo || '',
    gstNo: GSTDetails?.gstNo || '',
    gstStatus: GSTDetails?.gstStatus || '',
    isPrimary: GSTDetails?.isPrimary || '',
    pinCode: GSTDetails?.pinCode || '',
    stateName: GSTDetails?.stateName || '',
  };

  // ----------------------------------------------------------------------------------------------------------------------------//

  const validationSchema = Yup.object().shape({
    gstNo: Yup.string().required('Required'),
    businessName: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    stateName: Yup.string().required('Required'),
    countryName: Yup.string().required('Required'),
    pincode: Yup.string().required('Required'),
    establishedYear: Yup.string().required('Required'),
    gstMobileNo: Yup.string()
      .required('Required')
      .matches(/^\d+$/, 'Phone number must be numeric'),
    gstEmailId: Yup.string().email('Invalid email format').required('Required'),
  });
  const fetchBussinessDetails = async companyId => {
    try {
      const result = await getBussinessDetails(companyId);
      console.log('get Bussiness Details Data result:', result);
      setData(result.data);
    } catch (error) {
      console.error('Error fetching Bussiness details:', error);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
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
        <CCardHeader className="mb-3">
          <strong> Add GST Details</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('_id');
              console.log('companyId found in sessionStorage 2', companyId);

              try {
                const postData = {
                  _id: companyId,
                  index: index,
                  gstDetails: [
                    {
                      address: values.address,
                      businessName: values.businessName,
                      gstEmailId: values.gstEmailId,
                      gstMobileNo: values.gstMobileNo,
                      gstNo: values.gstNo,
                      stateName: values.stateName,
                      countryName: values.countryName,
                      pincode: values.pincode,
                      establishedYear: values.establishedYear,
                    },
                  ],
                };

                console.log('postData :-', postData);
                const result = await editGSTDetails(postData);
                console.log('Signup result :-', result);

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
            {formik => {
              return (
                <>
                  <Form>
                    <CRow className="align-items-center mb-4">
                      <CCol md={3} className="pr-0"></CCol>
                      <CCol md={2} className="d-flex align-items-center pl-0">
                        <CIcon
                          icon={cilTag}
                          size="lg"
                          style={{marginRight: '20px'}}
                        />
                        <label htmlFor="gstNo" className="form-label mb-0">
                          GST No.
                        </label>
                      </CCol>
                      <CCol md={4}>
                        <Field
                          name="gstNo"
                          type="text"
                          className="form-control"
                          placeholder="Enter GST No."
                          // validate={value => validateGST(value, gstList)}
                        />
                        <ErrorMessage
                          name="gstNo"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                      <CCol md={3}>
                        <button
                          type="submit"
                          className="btn btn-success custom-btn shadow">
                          Submit
                        </button>
                      </CCol>
                    </CRow>

                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilBuilding} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label
                              htmlFor="businessName"
                              className="form-label">
                              Business Name
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="businessName"
                              type="text"
                              className="form-control"
                              placeholder="Enter Business Name"
                            />
                            <ErrorMessage
                              name="businessName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        </CRow>
                      </CCol>

                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilLocationPin} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="address" className="form-label">
                              Detail Address
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="address"
                              type="text"
                              className="form-control"
                              placeholder="Enter Branch Address"
                            />
                            <ErrorMessage
                              name="address"
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
                            <CIcon icon={cilGlobeAlt} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="countryName" className="form-label">
                              Country
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="countryName"
                              type="text"
                              className="form-control"
                              placeholder="Enter Country"
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
                              State
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="stateName"
                              type="text"
                              className="form-control"
                              placeholder="Enter State"
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

                    <CRow className="align-items-center mb-3">
                      <CCol md={6}>
                        <CRow className="align-items-center mb-3">
                          <CCol md={1} className="pr-0">
                            <CIcon icon={cilLocationPin} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="pincode" className="form-label">
                              Pin Code
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="pincode"
                              type="text"
                              className="form-control"
                              placeholder="Enter Pin Code"
                            />
                            <ErrorMessage
                              name="pincode"
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
                            <label
                              htmlFor="establishedYear"
                              className="form-label">
                              Established Year
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="establishedYear"
                              type="text"
                              className="form-control"
                              placeholder="Enter Established Year"
                            />
                            <ErrorMessage
                              name="establishedYear"
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
                            <label htmlFor="gstMobileNo" className="form-label">
                              Contact No.
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="gstMobileNo"
                              type="text"
                              className="form-control"
                              placeholder="Enter Contact Number"
                            />
                            <ErrorMessage
                              name="gstMobileNo"
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
                            <label htmlFor="gstEmailId" className="form-label">
                              Email Id
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="gstEmailId"
                              type="text"
                              className="form-control"
                              placeholder="Enter Email"
                            />
                            <ErrorMessage
                              name="gstEmailId"
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
                </>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default UpdateCompanyDetailsRegister;
