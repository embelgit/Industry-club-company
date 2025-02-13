import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormTextarea,
} from '@coreui/react';

const ServiceModal = ({showModal, handleClose, handleSubmit, modalType}) => {
  const [inputValue, setInputValue] = React.useState('');

  const onSubmit = () => {
    handleSubmit(inputValue, modalType);
    setInputValue('');
    handleClose();
  };

  return (
    <CModal visible={showModal} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{modalType} Description</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormTextarea
          style={{height: '800%'}}
          placeholder={`Enter ${modalType} details`}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          rows={5}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={onSubmit}>
          Submit
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ServiceModal;
