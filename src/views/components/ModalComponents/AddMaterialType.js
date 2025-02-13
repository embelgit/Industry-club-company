import React from 'react';
import {Field, Form, Formik} from 'formik';
import {Modal, ModalBody, ModalHeader, ModalFooter, Button} from 'reactstrap';
import {CRow, CCol} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {cilIndustry} from '@coreui/icons';
import {postNewMaterialType} from '../../../service/AllDrowpdownAPI';
const AddMaterialType = ({
  isOpen,
  onClose,
  materialOptions,
  setMaterialOptions,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Add Material Type</ModalHeader>
      <Formik
        initialValues={{materialType: '', createdBy: ''}}
        onSubmit={async (values, actions) => {
          const userName = sessionStorage.getItem('userName');
          console.log('userName found in sessionStorage 2', userName);

          try {
            const postData = {
              materialType: values.materialType,
              createdBy: userName,
            };

            console.log('postData :-', postData);

            const result = await postNewMaterialType(postData);
            console.log('Signup result :-', result);

            if (result.status === 200) {
              swal({
                title: 'Great',
                text: result.data,
                icon: 'success',
                timer: 2000,
                buttons: false,
              }).then(() => {
                // Reload the page after the success message is shown
                window.location.reload();
              });
            }
          } catch (error) {
            console.error('add GST error :-', error?.response || error);

            if (error.response?.status === 409) {
              // Handle conflict error
              swal({
                title: 'Warning',
                text: error.response.data || 'Industry Already Exists',
                icon: 'warning',
                timer: 2000,
                buttons: false,
              });
            } else {
              // Handle other errors
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
        {({values, handleChange}) => (
          <Form>
            <ModalBody>
              <CRow className="align-items-center mb-3">
                <CCol md={12}>
                  <CRow className="align-items-center">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilIndustry} size="lg" />
                    </CCol>
                    <CCol md={4} className="pl-1">
                      <label htmlFor="materialType" className="form-label">
                        Material Type
                      </label>
                    </CCol>
                    <CCol md={7} className="pl-0">
                      <Field
                        name="materialType"
                        type="text"
                        className="form-control"
                        placeholder="Enter new Material type"
                        value={values.materialType}
                        onChange={handleChange}
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary">
                Add
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddMaterialType;
