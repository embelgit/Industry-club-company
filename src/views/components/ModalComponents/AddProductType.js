import React from 'react';
import {Field, Form, Formik} from 'formik';
import {Modal, ModalBody, ModalHeader, ModalFooter, Button} from 'reactstrap';
import {CRow, CCol} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {cilCart} from '@coreui/icons';
import {postNewProductType} from '../../../service/AllDrowpdownAPI';

const AddProductType = ({
  isOpen,
  onClose,
  productTypeOptions,
  setProductTypeOptions,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Add Product Details</ModalHeader>
      <Formik
        initialValues={{productName: '', createdBy: ''}}
        onSubmit={async (values, actions) => {
          const userName = sessionStorage.getItem('userName');
          console.log('userName found in sessionStorage:', userName);

          try {
            const postData = {
              productDetails: {
                productName: values.productName,
                createdBy: userName,
              },
            };

            console.log('postData:', postData);
            const result = await postNewProductType(postData);
            console.log('Product add result:', result);

            if (result.status === 200) {
              swal({
                title: 'Great',
                text: result.data.sms,
                icon: 'success',
                timer: 2000,
                buttons: false,
              }).then(() => {
                window.location.reload();
              });
            }
          } catch (error) {
            console.error('Add Product error:', error?.response || error);

            if (error.response?.status === 409) {
              swal({
                title: 'Warning',
                text: error.response.data || 'Product Already Exists',
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
        {({values, handleChange}) => (
          <Form>
            <ModalBody>
              <CRow className="align-items-center mb-3">
                <CCol md={12}>
                  <CRow className="align-items-center">
                    <CCol md={1} className="pr-0">
                      <CIcon icon={cilCart} size="lg" />
                    </CCol>
                    <CCol md={4} className="pl-1">
                      <label htmlFor="productName" className="form-label">
                        Product Name
                      </label>
                    </CCol>
                    <CCol md={7} className="pl-0">
                      <Field
                        name="productName"
                        type="text"
                        className="form-control"
                        placeholder="Enter new product name"
                        value={values.productName}
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

export default AddProductType;
