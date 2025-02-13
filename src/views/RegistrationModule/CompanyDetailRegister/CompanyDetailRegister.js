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
  cilCalendar,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import DataNotPresent from '../../components/DataNotPresent';
import Loader from '../../components/Loader';
import {useNavigate} from 'react-router-dom';
import swal from 'sweetalert';
import {
  getGSTDetails,
  postGSTDetails,
  postSetPrimary,
} from '../../../service/RegistrationModule/CompanyDetailsRegisterAPIs';
import {getGSTValidate} from '../../../service/validationApis';
import {validateGST} from '../../components/Validation';
import RegistrationHeader from '../../../components/RegistrationComponents/RegistrationHeader';

const CompanyDetailsRegister = () => {
  const navigate = useNavigate();
  // const {progress, updateProgress} = useProgress();
  const [showTable, setShowTable] = useState(true);
  const [gstList, setGstList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [companyId, setCompanyId] = useState(null);
  const [submittedList, setSubmittedList] = useState([]); // Current page's data
  const [pageCount, setPageCount] = useState(0); // Total pages from backend
  const [currentPage, setCurrentPage] = useState(0); // Current page
  const [loader, setLoader] = useState(false);
  const size = 20; // Records per page
  // ----------------------------------------------------------------------------------------------------------------------------//
  const initialValues = {
    _id: '',
    gstNo: '',
    businessName: '',
    stateName: '',
    address: '',
    gstMobileNo: '',
    gstEmailId: '',
    countryName: '',
    pincode: '',
    establishedYear: '',
    cityName: '',
  };

  // ----------------------------------------------------------------------------------------------------------------------------//

  const validationSchema = Yup.object().shape({
    gstNo: Yup.string().required('Required'),
    businessName: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    stateName: Yup.string().required('Required'),
    countryName: Yup.string().required('Required'),
    cityName: Yup.string().required('Required'),
    pincode: Yup.string().required('Required'),
    establishedYear: Yup.string()
      .required('Required')
      .matches(/^(19|20)\d{2}$/, 'Year must be valid (1900-2099)'),
    gstMobileNo: Yup.string()
      .required('Required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .test(
        'not-starting-with-zero',
        'Mobile number should not start with 0',
        value => !value?.startsWith('0'),
      ),
    gstEmailId: Yup.string()
      .required('Required')
      .email('Invalid email format')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format',
      ),
  });

  // ----------------------------------------------------------------------------------------------------------------------------//
  const fetchGSTDetails = async (companyId, page = 0, fkUserId, role) => {
    try {
      setLoader(true);
      const result = await getGSTDetails(companyId, page, size, fkUserId, role);
      console.log('Fetched GST Details:', result);

      setSubmittedList([...result?.data?.content]);
      // Set current page's data
      setPageCount(result?.data?.totalPages);
      setCurrentPage(page); // Update current page state
    } catch (error) {
      console.error('Error fetching GST details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fkCompanyId = sessionStorage.getItem('fkCompanyId');
    console.log('companyId found in sessionStorage:', fkCompanyId);

    if (fkCompanyId) {
      setCompanyId(fkCompanyId);
      fetchGSTDetails(fkCompanyId, 0); // Fetch data for the first page
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, []);

  // ----------------------------------------------------------------------------------------------------------------------------//

  const handlePageChange = async ({selected}) => {
    if (!companyId) {
      console.error('Company ID is not defined');
      return;
    }

    try {
      setLoader(true);
      const nextPage = selected; // ReactPaginate starts pages at index 0
      const result = await getGSTDetails(companyId, nextPage, size);
      console.log('Pagination result:', result);

      setSubmittedList(result?.data?.content); // Set the current page's data
      setCurrentPage(nextPage); // Update current page
    } catch (error) {
      console.error('Error handling page change:', error);
    } finally {
      setLoader(false);
    }
  };

  // ----------------------------------------------------------------------------------------------------------------------------//

  // Initialize the switches correctly when the component mounts
  useEffect(() => {
    const initialList = submittedList.map(item => ({
      ...item,
      isPrimary: item.isPrimary || 'No', // Default to 'No' if not set
    }));
    setSubmittedList(initialList);
  }, []); // Runs once when the component is mounted

  const handleSwitchChange = async index => {
    const selectedGst = submittedList[index];
    const companyId = sessionStorage.getItem('fkCompanyId');

    if (!companyId || !selectedGst?.gstNo) {
      console.error('Company ID or GST No is missing.');
      return;
    }

    // If the selected switch is currently 'No', then turn it to 'Yes', and set others to 'No'
    const newIsPrimaryValue = selectedGst.isPrimary === 'Yes' ? 'No' : 'Yes';

    // Update the list: Set the selected switch to 'Yes', all others to 'No'
    const updatedList = submittedList.map((item, i) => {
      if (i === index) {
        return {...item, isPrimary: newIsPrimaryValue}; // Toggle the selected switch
      } else {
        return {...item, isPrimary: 'No'}; // Set all other switches to 'No'
      }
    });

    try {
      const response = await postSetPrimary(
        companyId,
        selectedGst.gstNo,
        newIsPrimaryValue, // Send the new value ('Yes' or 'No') dynamically
      );

      if (
        typeof response === 'string' &&
        (response === 'Primary GST Set Successfully' ||
          response === 'Primary GST Removed Successfully')
      ) {
        console.log(response);

        // Show success message using SweetAlert with custom configuration
        swal({
          title: 'Great',
          text: response,
          icon: 'success',
          timer: 2000, // Auto close after 2 seconds
          buttons: false, // No buttons
        });

        // Update the list with the new value
        setSubmittedList(updatedList);
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  // ------------------------------------Fetch GST list----------------------------------------------------------------------------------------//
  useEffect(() => {
    const fetchGSTList = async () => {
      const companyId = '';

      try {
        const result = await getGSTValidate(companyId);
        setGstList(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching GST list:', error);
      }
    };
    fetchGSTList();
  }, []);

  // ===========================================================================================================================//

  const handleEdit = index => {
    const item = submittedList[index];
    if (item) {
      navigate(`/update-company-detail-register/${index}`, {
        state: {GSTDetails: item},
      });
    } else {
      console.error('Item not found at the given index');
    }
  };
  //===========================================================================================================================//

  return (
    <>
      <div className="card shadow">
        <CCardHeader className="mb-3">
          <strong> Add GST Details</strong>
        </CCardHeader>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              const pkDepartmentId = sessionStorage.getItem('pkDepartmentId');
              const fkCompanyId = sessionStorage.getItem('fkCompanyId');
              try {
                const postData = {
                  _id: fkCompanyId,
                  percentage: '9',
                  fkDeptId: pkDepartmentId,
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
                const result = await postGSTDetails(postData);
                console.log('Signup result :-', result);

                if (result.status === 200) {
                  swal({
                    title: 'Great',
                    text: result.data,
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });
                  // const match = result.data.match(/fkCompanyId:([\w\d]+)/);

                  // if (match && match[1]) {
                  //   const fkCompanyId = match[1];

                  //   // Save to session storage
                  //   sessionStorage.setItem('fkCompanyId', fkCompanyId);

                  //   console.log('fkCompanyId saved:', fkCompanyId);
                  // } else {
                  //   console.log('fkCompanyId not found in response.');
                  // }
                  // Prompt user to confirm if it's a primary GST
                  const isPrimary = await swal({
                    title: 'Is this the Primary GST?',
                    text: 'Please confirm if this GST should be marked as primary.',
                    icon: 'info',
                    buttons: {
                      yes: {
                        text: 'Yes',
                        value: true,
                      },
                      no: {
                        text: 'No',
                        value: false,
                      },
                    },
                  });

                  if (isPrimary) {
                    swal({
                      title: 'Primary GST',
                      text: 'Please enable the Primary GST button in the list below.',
                      icon: 'Warning',
                      timer: 5000,
                      buttons: false,
                    });
                  } else {
                    swal({
                      title: 'Cancelled',
                      text: 'Primary GST selection has been cancelled.',
                      icon: 'info',
                      timer: 2000,
                      buttons: false,
                    });
                  }
                  const id = sessionStorage.getItem('_id');

                  if (id) {
                    setCompanyId(id);
                    fetchGSTDetails(id, 0);
                  }
                }
              } catch (error) {
                console.error('add GST error :-', error?.response || error);
                if (error?.response?.status === 404) {
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
                          validate={value => validateGST(value, gstList)}
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
                            <CIcon icon={cilMap} size="lg" />
                          </CCol>
                          <CCol md={3} className="pl-1">
                            <label htmlFor="cityName" className="form-label">
                              City
                            </label>
                          </CCol>
                          <CCol md={8}>
                            <Field
                              name="cityName"
                              type="text"
                              className="form-control"
                              placeholder="Enter City"
                            />
                            <ErrorMessage
                              name="cityName"
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
                    <CRow className="align-items-center mb-3">
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

      {loader ? (
        <Loader />
      ) : (
        <>
          {submittedList.length ? (
            <>
              {showTable && (
                <div className="card shadow p-1">
                  <CCardHeader>
                    <strong>Submitted Data</strong>
                  </CCardHeader>

                  <div className="table-responsive">
                    <CTable striped>
                      <thead className="table-secondary table-bordered table-striped">
                        <tr>
                          <th scope="col">Sr No&nbsp;&nbsp;&nbsp;</th>
                          <th scope="col">GST No</th>
                          <th scope="col">Business Name</th>
                          <th scope="col">Branch Address</th>
                          <th scope="col">Country</th>
                          <th scope="col">State</th>
                          <th scope="col">City</th>
                          <th scope="col">Phone No</th>
                          <th scope="col">Email</th>
                          <th scope="col">Established Year</th>
                          <th scope="col">
                            <br />
                            Is Primary
                          </th>
                          <th scope="col">Edit</th>
                          <th scope="col">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submittedList.map((data, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1 + offset}</th>
                            <td>{data.gstNo}</td>
                            <td>{data.businessName}</td>
                            <td className="address-cell">
                              {/* <span className="truncated-text">
                                {data.address.length > 20
                                  ? `${data.address.slice(0, 20)}...`
                                  : data.address}
                              </span> */}
                            </td>
                            <td>{data.countryName}</td>
                            <td>{data.stateName}</td>
                            <td>{data.cityName}</td>
                            <td>{data.gstMobileNo}</td>
                            <td>{data.gstEmailId}</td>
                            <td>{data.establishedYear}</td>
                            <td>
                              <CFormSwitch
                                id={`switch-${index}`}
                                label=""
                                checked={data.isPrimary === 'Yes'}
                                onChange={() => handleSwitchChange(index)}
                              />
                            </td>
                            <td>
                              <CIcon
                                icon={cilPencil}
                                style={{cursor: 'pointer'}}
                                onClick={() => handleEdit(index)}
                              />
                            </td>
                            <td>
                              <CIcon
                                icon={cilTrash}
                                style={{
                                  cursor: 'pointer',
                                  fontSize: '20px',
                                  color: '#dc3545',
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </CTable>
                  </div>
                  <ReactPaginate
                    previousLabel={<CIcon icon={cilChevronLeft} />}
                    nextLabel={<CIcon icon={cilChevronRight} />}
                    breakLabel={'...'}
                    pageClassName={'page-item'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                    forcePage={currentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <DataNotPresent title="Data Not present" />
          )}
        </>
      )}
    </>
  );
};

export default CompanyDetailsRegister;
