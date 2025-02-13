import React from 'react';
import {useLocation} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';
import {AppHeader} from '../../../components';

// Utility function to capitalize the first letter of each word
const capitalizeFirstLetter = string => {
  if (string && string.length > 0) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
};

// const handleAddToWallet = async (productName, values, actions) => {
//   if (!productName) {
//     console.error('Product Name is missing');
//     swal({
//       title: 'Error',
//       text: 'Product name is required!',
//       icon: 'error',
//       timer: 2000,
//       buttons: false,
//     });
//     return;
//   }

//   const companyId = sessionStorage.getItem('_id');
//   const userName = sessionStorage.getItem('userName');

//   if (!companyId) {
//     console.error('Company ID not found in session storage');
//     return;
//   }

//   const postData = {
//     fkCompanyId: companyId,
//     fkProductId: productName,
//     fkServiceId: '', // Update if needed
//     fkVendorId: '', // Pass the fkVendorId
//     createdBy: userName,
//   };

//   try {
//     console.log('Submitting postData:', JSON.stringify(postData, null, 2));

//     const result = await AddToWallet(postData);
//     console.log('Submission result: ', result);

//     if (result.status === 200) {
//       const pkWalletId = result.data.pkWalletId;
//       console.log('pkWalletId', pkWalletId);
//       sessionStorage.setItem('pkWalletId', pkWalletId);
//       swal({
//         title: 'Great',
//         text: result.data.sms,
//         icon: 'success',
//         timer: 2000,
//         buttons: false,
//       });
//     }
//   } catch (error) {
//     console.error('Error in Add To Wallet:', error?.response || error);

//     if (error?.response?.status === 400) {
//       swal({
//         title: 'Warning',
//         text: error.response.data,
//         icon: 'warning',
//         timer: 2000,
//         buttons: false,
//       });
//     } else {
//       swal({
//         title: 'Error',
//         text: 'Something went wrong!',
//         icon: 'error',
//         timer: 2000,
//         buttons: false,
//       });
//     }
//   } finally {
//     actions?.resetForm?.(); // Reset form only if `actions` is passed
//   }
// };

function InfrastructureDetails() {
  const location = useLocation();
  const {infra} = location.state || {};
  console.log('infra:', infra);

  return (
    <>
      <AppHeader />
      {/* Centering the card */}
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}>
        <div
          className="card shadow-sm  px-5 py-5 w-100"
          style={{maxWidth: '1000px'}}>
          <div className="row align-items-center">
            <div className="d-flex justify-content-between align-items-center py-2 mb-3">
              <h5 className="fw-bold mb-0 fs-4">
                {/* <span>{capitalizeFirstLetter(service?.subServiceName)}</span> */}
              </h5>

              <button
                type="button"
                className="btn btn-success custom-btn shadow"
                onClick={() => handleAddToWallet(productName)}>
                <i className="fas fa-wallet"></i> Add To Wallet
              </button>
            </div>
            {/* Left Side: Carousel */}
            <div className="col-md-6">
              <Carousel
                interval={3000}
                prevIcon={
                  <span
                    className="carousel-control-prev-icon"
                    style={{
                      backgroundColor: 'grey',
                      borderRadius: '50%',
                      padding: '20px',
                    }}
                    aria-hidden="true"></span>
                }
                nextIcon={
                  <span
                    className="carousel-control-next-icon"
                    style={{
                      backgroundColor: 'grey',
                      borderRadius: '50%',
                      padding: '20px',
                    }}
                    aria-hidden="true"></span>
                }
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                {infra?.images?.map((image, index) => {
                  const [format, base64Data] = image.split(',');
                  return (
                    <Carousel.Item key={index}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                        }}>
                        <img
                          src={`data:image/${format};base64,${base64Data}`}
                          alt={infra?.subServiceName || 'Image'}
                          className="img-fluid rounded"
                          style={{
                            height: '20vw',
                            width: '18vw',
                          }}
                        />
                      </div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </div>

            {/* Right Side: Details */}
            {/* Description */}
            <div className="col-md-6">
              <h5 className="fw-bold mb-3 text-dark ">Description :</h5>
              <p className="badge text-dark">
                {capitalizeFirstLetter(infra?.description) ||
                  'No Description Available'}
              </p>
              {/* Product Keywords */}
              <h5 className="fw-bold mb-3  ">Infrastructure Address : </h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <p className="badge text-dark">
                  {capitalizeFirstLetter(infra?.infraAddress) ||
                    'No infra Address Available'}
                </p>
              </div>

              {/* Industry Type */}
              <h5 className="fw-bold mb-3">Equipment Type:</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <p className="badge text-dark">
                  {capitalizeFirstLetter(infra?.equipmentType) ||
                    'No equipment Type Available'}
                </p>
              </div>

              {/* areaOfFactory */}
              <h5 className="fw-bold mb-3">Area Of Factory:</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <p className="badge text-dark">
                  {capitalizeFirstLetter(infra?.areaOfFactory) ||
                    'No Area Of Factory Available'}
                </p>
              </div>

              {/* totalEquipment */}
              <h5 className="fw-bold mb-3">Total Equipment:</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <p className="badge text-dark">
                  {capitalizeFirstLetter(infra?.totalEquipment) ||
                    'No total Equipment Available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfrastructureDetails;
