import {
  CCardHeader,
  CNav,
  CNavItem,
  CRow,
  CCol,
  CButton,
  CNavLink,
  CTabContent,
  CTabPane,
  CCard,
  CCardBody,
  CTableRow,
  CTable,
  CModal,
  CForm,
  CFormTextarea,
  CModalHeader,
  CModalBody,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CModalFooter,
  CTableDataCell,
} from '@coreui/react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import React, {useState, useRef} from 'react';
import {Button} from 'react-bootstrap';

import CIcon from '@coreui/icons-react';

import {
  cilXCircle,
  cilBuilding,
  cilCheckCircle,
  cilUser,
  cilPhone,
  cilEnvelopeOpen,
} from '@coreui/icons';

import NetworkConnectionList from './NetworkConnectionList';
import {AppHeader, AppSidebar} from '../../../components';

const NetworkConnection = () => {
  const formikRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState('');
  const [formValues, setFormValues] = useState({});
  const [submittedData, setSubmittedData] = useState([]);

  const handleSubmit = (values, {resetForm}, formType) => {
    setFormType(formType);
    setFormValues(values);
    console.log('Submitted Values:', values);
    setShowModal(true);
    setSubmittedData(prevData => [...prevData, values]);

    resetForm();
  };

  return (
    <>
      <AppHeader />
      <AppSidebar />
      <div
        style={{
          paddingLeft: '273px',
          paddingRight: '19px',
          paddingTop: '11px',
        }}>
        <div className="card shadow mb-2">
          <CCardHeader>
            <strong>Network Connection</strong>
          </CCardHeader>

          <div className="card-body">
            <Formik
              innerRef={formikRef}
              initialValues={{
                ProductName: '',
                hsncode: '',
                MaterialType: [''],
                industryType: [''],
                sacCode: '',
              }}
              onSubmit={handleSubmit}>
              {({handleSubmit, values, setFieldValue}) => (
                <Form onSubmit={handleSubmit}>
                  <CRow className="align-items-center mb-3">
                    {/* Company Name */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilBuilding} size="lg" />{' '}
                          {/* Change icon here */}
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="hsncode" className="form-label">
                            Company Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="hsncode"
                            type="text"
                            className="form-control"
                            placeholder="Enter Company Name"
                          />
                          <ErrorMessage
                            name="hsncode"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    {/* Person Name */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilUser} size="lg" />{' '}
                          {/* Change icon here */}
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="hsncode" className="form-label">
                            Person Name
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="hsncode"
                            type="text"
                            className="form-control"
                            placeholder="Enter Person Name"
                          />
                          <ErrorMessage
                            name="hsncode"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="align-items-center mb-3">
                    {/* Email */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilEnvelopeOpen} size="lg" />
                          {/* Change icon here */}
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="hsncode" className="form-label">
                            Email
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="hsncode"
                            type="text"
                            className="form-control"
                            placeholder="Enter Email"
                          />
                          <ErrorMessage
                            name="hsncode"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                    {/* Contact No */}
                    <CCol md={6}>
                      <CRow className="align-items-center mb-3">
                        <CCol md={1} className="pr-0">
                          <CIcon icon={cilPhone} size="lg" />
                        </CCol>
                        <CCol md={3} className="pl-1">
                          <label htmlFor="hsncode" className="form-label">
                            Contact No
                          </label>
                        </CCol>
                        <CCol md={8}>
                          <Field
                            name="hsncode"
                            type="text"
                            className="form-control"
                            placeholder="Enter Contact No"
                          />
                          <ErrorMessage
                            name="hsncode"
                            component="div"
                            className="text-danger"
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>

                  <div className="col-md-4 col-sm-6 mb-3">
                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="card shadow  mb-2">
          <NetworkConnectionList />
        </div>
      </div>
    </>
  );
};

export default NetworkConnection;
