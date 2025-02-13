// import {CCardHeader, CTable, CFormSwitch, CButton} from '@coreui/react';
// import React, {useEffect, useState} from 'react';
// import {cilChevronLeft, cilChevronRight} from '@coreui/icons';
// import {CIcon} from '@coreui/icons-react';
// import {Link} from 'react-router-dom';
// import ReactPaginate from 'react-paginate';
// import DataNotPresent from '../../components/DataNotPresent';
// import Loader from '../../components/Loader';
// import {getProductDetails} from '../../../service/RegistrationModule/ProductDetailsAPIs';
// import {updateProductStatus} from '../../../service/masterModule/ProductPromotion';
// import {AppSidebar} from '../../../components';
// // import {updateProductStatus} from '../../../../service/MainComponent/ProductPromotion';

// const ProductList = () => {
//   const [tableData, setTableData] = useState([]);
//   const [loader, setLoader] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageCount, setPageCount] = useState(0);
//   const [offset, setOffset] = useState(0);
//   const size = 20;

//   // Fetch function for product details
//   const fetchProductDetails = async (companyId, pageNo = 0) => {
//     try {
//       setLoader(true);
//       const role = '';
//       const fkUserId = '';
//       const result = await getProductDetails(companyId, pageNo, role, fkUserId);
//       console.log('Fetched Product Details: ', result);
//       setTableData(result?.data?.content || []);
//       setPageCount(result?.data?.totalPages || 0);
//       setOffset(result?.data?.pageable?.offset || 0);
//     } catch (error) {
//       console.error('Error fetching product details:', error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   useEffect(() => {
//     const companyId = sessionStorage.getItem('_id');
//     console.log('companyId found in sessionStorage', companyId);
//     if (companyId) {
//       fetchProductDetails(companyId, currentPage);
//     } else {
//       console.error('No companyId found in sessionStorage');
//     }
//   }, [currentPage]);

//   const handlePageChange = selected => {
//     const selectedPage = selected.selected;
//     setCurrentPage(selectedPage);
//     const companyId = sessionStorage.getItem('_id');
//     if (companyId) {
//       fetchProductDetails(companyId, selectedPage);
//     }
//   };

//   const handleSwitchChange = async index => {
//     const updatedData = tableData.map((item, idx) => {
//       if (idx === index) {
//         // Toggle the isPrimary status between 'Enable' and 'Disable'
//         const newStatus = item.isPrimary === 'Enable' ? 'Disable' : 'Enable';
//         return {...item, isPrimary: newStatus};
//       }
//       return item;
//     });

//     // Update the state only if there are changes
//     if (JSON.stringify(updatedData) !== JSON.stringify(tableData)) {
//       setTableData(updatedData);
//     }

//     try {
//       const pkProductId = tableData[index]?.pkProductId; // Get pkProductId directly from tableData

//       // Check if pkProductId exists before making the API call
//       if (!pkProductId) {
//         console.error('pkProductId not found for the selected product');
//         return;
//       }

//       const response = await updateProductStatus({
//         fkProductId: pkProductId, // Pass pkProductId from the data
//         status: updatedData[index].isPrimary, // Pass the new status ('Enable' or 'Disable')
//       });

//       console.log('Status updated successfully:', response.data);
//     } catch (err) {
//       console.error('Error updating status:', err);
//     }
//   };

//   return (
//     <>
//       <AppSidebar />
//       <div className="card">
//         {loader ? (
//           <Loader />
//         ) : (
//           <>
//             {tableData.length ? (
//               <>
//                 <div className="card-header">
//                   <strong>Submitted Data</strong>
//                 </div>

//                 <div className="table-responsive">
//                   <CTable striped>
//                     <thead className="table-secondary table-bordered table-striped">
//                       <tr>
//                         <th scope="col">Sr No&nbsp;&nbsp;&nbsp;</th>
//                         <th scope="col">Product Name</th>
//                         <th scope="col">Description</th>
//                         <th scope="col">Enable/Disable</th>
//                         <th scope="col">See More</th>
//                       </tr>
//                     </thead>
//                     <tbody className="table-group-divider">
//                       {tableData.map((e, index) => (
//                         <tr key={index}>
//                           <th scope="row" style={{fontWeight: 'normal'}}>
//                             {index + 1 + offset}&nbsp;&nbsp;&nbsp;
//                           </th>
//                           <td>{e.productName}</td>
//                           <td>{e.description}</td>
//                           <td>
//                             <CFormSwitch
//                               id={`switch-${index}`}
//                               label=""
//                               checked={e.isPrimary === 'Enable'}
//                               onChange={() => handleSwitchChange(index)}
//                             />
//                           </td>
//                           <td>
//                             <Link
//                               to={`/ProductDetail/${index}`}
//                               state={{ProductDetails: tableData[index]}}>
//                               <CButton color="link">See More</CButton>
//                             </Link>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </CTable>
//                 </div>
//                 <ReactPaginate
//                   previousLabel={<CIcon icon={cilChevronLeft} />}
//                   nextLabel={<CIcon icon={cilChevronRight} />}
//                   breakLabel={'...'}
//                   pageClassName={'page-item'}
//                   breakClassName={'break-me'}
//                   pageCount={pageCount}
//                   marginPagesDisplayed={2}
//                   pageRangeDisplayed={5}
//                   onPageChange={handlePageChange}
//                   containerClassName={'pagination'}
//                   subContainerClassName={'pages pagination'}
//                   activeClassName={'active'}
//                   forcePage={currentPage}
//                 />
//               </>
//             ) : (
//               <DataNotPresent title="Data Not Present" />
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default ProductList;

import {
  CCardHeader,
  CTable,
  CFormSwitch,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import React, {useEffect, useState} from 'react';
import {cilChevronLeft, cilChevronRight} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import DataNotPresent from '../../components/DataNotPresent';
import Loader from '../../components/Loader';
import {getProductDetails} from '../../../service/RegistrationModule/ProductDetailsAPIs';

import {AppSidebar} from '../../../components';
import {getWalletAddedList} from '../../../service/masterModule/Wallet';

const ProductList = () => {
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [walletData, setWalletData] = useState([]);
  const size = 20;

  const fetchProductDetails = async (companyId, pageNo = 0) => {
    try {
      setLoader(true);
      const role = '';
      const fkUserId = '';
      const result = await getProductDetails(companyId, pageNo, role, fkUserId);
      setTableData(result?.data?.content || []);
      setPageCount(result?.data?.totalPages || 0);
      setOffset(result?.data?.pageable?.offset || 0);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoader(false);
    }
  };

  // Fetch Wallet Added List
  const fetchWalletAddedList = async (companyId, productId) => {
    try {
      setLoader(true);
      const pageNo = 0;
      const serviceId = '';
      const type = 'product';

      const result = await getWalletAddedList(
        companyId,
        pageNo,
        serviceId,
        productId,
        type,
      );
      setWalletData(result?.data?.content || []);
      setModalVisible(true); // Show modal after fetching data
    } catch (error) {
      console.error('Error fetching wallet added list:', error);
    } finally {
      setLoader(false);
    }
  };

  // Function to handle wallet button click
  const handleWalletButtonClick = productId => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchWalletAddedList(companyId, productId);
      setModalVisible(true);
    }
  };
  useEffect(() => {
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchProductDetails(companyId, currentPage);
    }
  }, [currentPage]);

  const handlePageChange = selected => {
    setCurrentPage(selected.selected);
    const companyId = sessionStorage.getItem('_id');
    if (companyId) {
      fetchProductDetails(companyId, selected.selected);
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="card">
        {loader ? (
          <Loader />
        ) : (
          <>
            {tableData.length ? (
              <>
                <div className="card-header">
                  <strong>Submitted Data</strong>
                </div>

                <div className="table-responsive">
                  <CTable striped>
                    <thead className="table-secondary table-bordered table-striped">
                      <tr>
                        <th>Sr No</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Enable/Disable</th>
                        <th>See More</th>
                        <th>Wallet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((e, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1 + offset}</th>
                          <td>{e.productName}</td>
                          <td>{e.description}</td>
                          <td>
                            <CFormSwitch
                              id={`switch-${index}`}
                              label=""
                              checked={e.isPrimary === 'Enable'}
                              onChange={() => console.log('Switch toggled')}
                            />
                          </td>
                          <td>
                            <Link
                              to={`/ProductDetail/${index}`}
                              state={{ProductDetails: tableData[index]}}>
                              <CButton color="link">See More</CButton>
                            </Link>
                          </td>
                          <td>
                            <CButton
                              color="primary"
                              onClick={() =>
                                handleWalletButtonClick(e.pkProductId)
                              }>
                              Wallet
                            </CButton>
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
              </>
            ) : (
              <DataNotPresent title="Data Not Present" />
            )}
          </>
        )}
      </div>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <div className="card-header">
            <strong>Wallet</strong>
          </div>
        </CModalHeader>
        <CModalBody>
          Congratulations! Your product has been saved by the following
          companies.
          <div className="card m-3">
            {loader ? (
              <Loader />
            ) : walletData.length ? (
              <>
                <CTable striped>
                  <thead className="table-secondary table-bordered table-striped">
                    <tr>
                      <th>Sr No</th>
                      <th>Company Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.map((e, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{e.companyName}</td>
                      </tr>
                    ))}
                  </tbody>
                </CTable>
                <ReactPaginate
                  previousLabel={<CIcon icon={cilChevronLeft} />}
                  nextLabel={<CIcon icon={cilChevronRight} />}
                  breakLabel={'...'}
                  pageClassName={'page-item'}
                  breakClassName={'break-me'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                  forcePage={currentPage}
                />
              </>
            ) : (
              <DataNotPresent title="Data Not Present" />
            )}
          </div>
        </CModalBody>
        <CModalFooter></CModalFooter>
      </CModal>
    </>
  );
};

export default ProductList;
