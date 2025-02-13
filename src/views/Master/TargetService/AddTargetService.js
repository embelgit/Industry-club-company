import React, {useState, useEffect} from 'react';
import {CCardHeader, CRow, CCol, CButton, CFormLabel} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {AppHeader, AppSidebar} from '../../../components';
import {
  postTargetedService,
  getTargetedServiceDetailsPagination,
} from '../../../service/masterModule/TargetService'; // Assuming you have this API to fetch services
import swal from 'sweetalert';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {
  cilCash,
  cilCalculator,
  cilWallet,
  cilBank,
  cilShieldAlt,
  cilBalanceScale,
  cilEducation,
  cilBullhorn,
  cilBuilding,
} from '@coreui/icons';

const AddTargetService = ({
  industryOptions,
  setIndustryOptions,
  handleListClick,
  handleEditClick,
}) => {
  const [modalState, setModalState] = useState({show: false, type: ''});
  const [servicesList, setServicesList] = useState([]); // State to store the list of services
  const [loading, setLoader] = useState(false); // State to manage loading indicator
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const handleClick = type => {
    setModalState({show: true, type});
  };

  const handleClose = () => {
    setModalState({show: false, type: ''});
  };

  return (
    <>
      <div>
        <div className="card">
          <div className="card-body">
            <div className="card shadow">
              <CCardHeader className="mb-3">
                <strong>Services</strong>
              </CCardHeader>
              <div className="card-body">
                <CRow className="justify-content-center">
                  {[
                    ['Finance', cilCash],
                    ['Tax Info', cilCalculator],
                    ['Account', cilWallet],
                    ['Loan', cilBank],
                    ['Insurance', cilShieldAlt],
                    ['Legal', cilBalanceScale],
                    ['Trainer', cilEducation],
                    ['Branding & Promotion', cilBullhorn],
                  ].map(([label, icon], index) => (
                    <CCol key={index} md={4} lg={3} className="mb-4">
                      <CButton
                        className="btn btn-light rounded-lg w-100 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          height: '50px',
                          borderRadius: '5px',
                          borderWidth: '0.5px',
                          borderColor: '#ced4da',
                          borderStyle: 'solid',
                        }}
                        onClick={() => handleClick(label)}>
                        <CIcon icon={icon} size="lg" className="mr-3" />
                        <span className="font-weight-bold">{label}</span>
                      </CButton>
                    </CCol>
                  ))}
                </CRow>
              </div>
            </div>

            <CButton
              className="btn btn-primary custom-btn shadow m-2"
              onClick={handleListClick}>
              List
            </CButton>
          </div>
        </div>

        {/* ✅ Pass handleSubmit correctly */}
        <ServiceModal
          showModal={modalState.show}
          onClose={handleClose}
          modalType={modalState.type}
        />
      </div>
    </>
  );
};

const ServiceModal = ({showModal, onClose, modalType}) => {
  return (
    <Modal isOpen={showModal} toggle={onClose}>
      <ModalHeader toggle={onClose}>
        <strong>{modalType} Service</strong>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{serviceType: modalType, description: ''}}
          enableReinitialize
          validationSchema={Yup.object({
            description: Yup.string().required('Description is required'),
          })}
          onSubmit={async (values, actions) => {
            const companyId = sessionStorage.getItem('_id');
            const userName = sessionStorage.getItem('userName');

            if (!companyId || !userName) {
              swal({
                title: 'Error',
                text: 'Session expired. Please log in again.',
                icon: 'error',
                timer: 2000,
                buttons: false,
              });
              actions.setSubmitting(false);
              return;
            }

            const postData = {
              serviceName: values.serviceType,
              fkCompanyId: companyId,
              description: values.description,
              createdBy: userName,
            };

            try {
              console.log(
                'Submitting postData:',
                JSON.stringify(postData, null, 2),
              );
              const result = await postTargetedService(postData);

              if (result?.status === 200) {
                swal({
                  title: 'Success',
                  text: result.data.sms || 'Service added successfully!',
                  icon: 'success',
                  timer: 2000,
                  buttons: false,
                });
                actions.resetForm();
                onClose();
              } else {
                throw new Error('Unexpected response from the server');
              }
            } catch (error) {
              console.error('Error in post Targeted Service details:', error);
              const errorMessage =
                error?.response?.data?.message || 'Something went wrong!';
              swal({
                title: error?.response?.status === 400 ? 'Warning' : 'Error',
                text: errorMessage,
                icon: error?.response?.status === 400 ? 'warning' : 'error',
                timer: 2000,
                buttons: false,
              });
            } finally {
              actions.setSubmitting(false);
            }
          }}>
          <Form>
            <CCol md={12}>
              <CRow className="align-items-center mb-3">
                <CCol md={1} className="pr-0">
                  <CIcon icon={cilBuilding} size="lg" />
                </CCol>
                <CCol md={3} className="pl-1">
                  <CFormLabel htmlFor="description">
                    Service Description
                  </CFormLabel>
                </CCol>
                <CCol md={8}>
                  <Field
                    name="description"
                    as="textarea"
                    rows="4"
                    className="form-control"
                    placeholder="Enter Service Description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger"
                  />
                </CCol>
              </CRow>
            </CCol>

            <ModalFooter>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default AddTargetService;
