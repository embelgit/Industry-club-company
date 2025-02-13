import {
  CCardHeader,
  CCardBody,
  CCard,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {AppHeader, AppSidebar} from '../../../components';

const Subscription = () => {
  const [submittedData] = useState([
    {
      amount: '100',
      subscriptionDate: '01-10-2024',
      expiryDate: '01-10-2025',
      remainingdays: '98',
    },
    {
      amount: '150',
      subscriptionDate: '11-15-2024',
      expiryDate: '11-15-202',
      remainingdays: '90',
    },
    {
      amount: '200',
      subscriptionDate: '12-20-2024',
      expiryDate: '12-20-2025',
      remainingdays: '54',
    },
  ]);

  return (
    <>
      {' '}
      <AppHeader />
      <AppSidebar />
      <div
        style={{
          paddingLeft: '273px',
          paddingRight: '19px',
          paddingTop: '11px',
        }}>
        <div className="card shadow mb-2">
          <CCardHeader className="mb-3">
            <strong>Subscription</strong>
          </CCardHeader>
          <div className="card-body">
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="form-label">
                    Sr No.
                  </CTableHeaderCell>{' '}
                  <CTableHeaderCell className="form-label">
                    Amount (Rs)
                  </CTableHeaderCell>
                  <CTableHeaderCell className="form-label">
                    Subscription Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="form-label">
                    Expiry Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="form-label">
                    Remaining days
                  </CTableHeaderCell>
                  <CTableHeaderCell className="form-label">
                    Renew
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {submittedData.map((data, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{data.amount}</CTableDataCell>
                    <CTableDataCell>{data.subscriptionDate}</CTableDataCell>
                    <CTableDataCell>{data.expiryDate}</CTableDataCell>
                    <CTableDataCell>{data.remainingdays}</CTableDataCell>

                    <CTableDataCell>
                      {/* Future Link to Subscription_Detail */}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>{' '}
        </div>{' '}
      </div>
    </>
  );
};

export default Subscription;
