import React, {useState, useEffect} from 'react';
import {
  cilBank,
  cilBuilding,
  cilChevronLeft,
  cilChevronRight,
  cilPencil,
  cilTrash,
} from '@coreui/icons';
import {CIcon} from '@coreui/icons-react';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/Loader';
import DataNotPresent from '../../components/DataNotPresent';
import {useNavigate} from 'react-router-dom';
import {
  getTargetedServiceDetailsPagination,
  updateTargetedServiceDetails,
} from '../../../service/masterModule/TargetService';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import swal from 'sweetalert';
import {CCol, CFormLabel, CRow} from '@coreui/react';

const TargetServicelist = ({
  industryOptions,
  setIndustryOptions,
  handleListClick,
  handleEditClick,
}) => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [modalState, setModalState] = useState({
    show: false,
    type: '',
    serviceData: null,
  });
  const navigate = useNavigate();

  const fetchGSTDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const result = await getTargetedServiceDetailsPagination(
        companyId,
        pageNo,
      );
      setTableData(result?.data?.content || []);
      setPageCount(result?.data?.totalPages || 0);
      setOffset(result?.data?.pageable?.offset || 0);
    } catch (error) {
      console.error('Error fetching Referral details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchGSTDetails(companyId, currentPage);
    } else {
      console.error('No companyId found in sessionStorage');
    }
  }, [currentPage, modalState]);

  const handlePageChange = selected => {
    setCurrentPage(selected.selected);
  };

  const handleEdit = item => {
    setModalState({show: true, type: 'Edit', serviceData: item});
  };

  const handleDelete = indexToDelete => {
    setTableData(prevTableData =>
      prevTableData.filter((_, index) => index !== indexToDelete),
    );
  };

  const handleClose = () => {
    setModalState({show: false, type: '', serviceData: null});
  };

  return (
    <div className="d-flex flex-column">
      <div className="card">
        {loader ? (
          <Loader />
        ) : tableData.length ? (
          <>
            <div className="card-header">
              <strong>Submitted Data</strong>
            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-secondary table-bordered">
                  <tr>
                    <th scope="col">Sr No</th>
                    <th scope="col">Service Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + offset}</td>
                      <td>{item.serviceName || 'N/A'}</td>
                      <td>
                        <div
                          className="description-cell"
                          title={item.description || 'N/A'}>
                          {item.description
                            ? item.description.length > 50
                              ? `${item.description.slice(0, 50)}...`
                              : item.description
                            : 'N/A'}
                        </div>
                      </td>
                      <td>{item.status || 'N/A'}</td>

                      <td>
                        <CIcon
                          icon={cilPencil}
                          style={{
                            cursor: 'pointer',
                            fontSize: '20px',
                            color: '#28a745',
                          }}
                          onClick={() => {
                            sessionStorage.setItem(
                              'fkServiceTargetId',
                              item.fkServiceTargetId,
                            );
                            handleEdit(item);
                          }}
                        />
                      </td>
                      <td>
                        <CIcon
                          icon={cilTrash}
                          className="text-danger"
                          style={{cursor: 'pointer', fontSize: '20px'}}
                          onClick={() => handleDelete(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-end m-3">
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
                activeClassName={'active'}
                forcePage={currentPage}
              />
            </div>
          </>
        ) : (
          <DataNotPresent title="Data Not Present" />
        )}
      </div>

      {/* Service Modal */}
      <Modal isOpen={modalState.show} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>
          <strong>{modalState.type} Service</strong>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              serviceType: modalState.serviceData?.serviceName || '',
              description: modalState.serviceData?.description || '',
            }}
            enableReinitialize
            validationSchema={Yup.object({
              description: Yup.string().required('Description is required'),
            })}
            onSubmit={async (values, actions) => {
              const companyId = sessionStorage.getItem('_id');
              const userName = sessionStorage.getItem('userName');
              const ServiceTargetId =
                sessionStorage.getItem('fkServiceTargetId');
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
                pkServiceTargetId: ServiceTargetId,
                updatedBy: userName,
              };

              try {
                const result = await updateTargetedServiceDetails(postData);

                if (result?.status === 200) {
                  swal({
                    title: 'Success',
                    text: result.data || 'Service added successfully!',
                    icon: 'success',
                    timer: 2000,
                    buttons: false,
                  });
                  actions.resetForm();
                  handleClose();
                } else {
                  throw new Error('Unexpected response from the server');
                }
              } catch (error) {
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
                    <CIcon icon={cilBank} size="lg" />
                  </CCol>
                  <CCol md={3} className="pl-1">
                    <CFormLabel htmlFor="serviceType">Service Type</CFormLabel>
                  </CCol>
                  <CCol md={8}>
                    <Field
                      name="serviceType"
                      className="form-control"
                      disabled
                    />
                    <ErrorMessage
                      name="serviceType"
                      component="div"
                      className="text-danger"
                    />
                  </CCol>
                </CRow>
              </CCol>

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
    </div>
  );
};

export default TargetServicelist;
