import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';
import {getServiceProductDetails} from '../../../service/masterModule/SearchApi';
import {AddToWallet} from '../../../service/masterModule/Wallet';
import {AppHeader} from '../../../components';

function SearviceDetails() {
  const location = useLocation();
  // const {service} = location.state || {};
  // const serviceId = service?.fkServiceId || 'Default Product';

  const [service, setService] = useState(null);
  const {productId = '', serviceId} = location.state || {};

  useEffect(() => {
    if (serviceId) {
      const fetchProduct = async () => {
        try {
          const result = await getServiceProductDetails(productId, serviceId);
          const serviceDetails = result.data.serviceDetails; // Updated to match the API response

          console.log('Service details:', serviceDetails);

          if (serviceDetails) {
            setService({
              fkServiceId: serviceDetails.fkServiceId,
              fkCompanyId: serviceDetails.fkCompanyId,
              serviceName: serviceDetails.serviceName,
              subServiceName: serviceDetails.subServiceName,
              description: serviceDetails.description,
              hsnCode: serviceDetails.hsnCode || '', // Add default values for missing fields
              images: serviceDetails.serviceImages,
              industryType: serviceDetails.industryType,
              materialType: serviceDetails.materialType || '', // Add default values for missing fields
              keyword: serviceDetails.keyword,
              sacCode: serviceDetails.sacCode || '', // Add default values for missing fields
              status: serviceDetails.status,
              createdBy: serviceDetails.createdBy,
              updatedBy: serviceDetails.updatedBy,
            });
          }
        } catch (error) {
          console.error('Error fetching service details:', error);
        }
      };

      fetchProduct();
    }
  }, [productId, serviceId]);

  const capitalizeFirstLetter = string => {
    if (string && string.length > 0) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  };

  const handleAddToWallet = async (serviceId, values, actions) => {
    if (!serviceId) {
      console.error('serviceId is missing');
      swal({
        title: 'Error',
        text: 'serviceId is required!',
        icon: 'error',
        timer: 2000,
        buttons: false,
      });
      return;
    }

    const companyId = sessionStorage.getItem('_id');
    const userName = sessionStorage.getItem('userName');

    if (!companyId) {
      console.error('Company ID not found in session storage');
      return;
    }

    const postData = {
      fkCompanyId: companyId,
      fkProductId: '',
      fkServiceId: serviceId,
      fkVendorId: '',
      createdBy: userName,
    };

    try {
      console.log('Submitting postData:', JSON.stringify(postData, null, 2));

      const result = await AddToWallet(postData);
      console.log('Submission result: ', result);

      if (result.status === 200) {
        const pkWalletId = result.data.pkWalletId;
        console.log('pkWalletId', pkWalletId);
        sessionStorage.setItem('pkWalletId', pkWalletId);
        swal({
          title: 'Great',
          text: result.data.sms,
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      console.error('Error in Add To Wallet:', error?.response || error);

      if (error?.response?.status === 400) {
        swal({
          title: 'Warning',
          text: error.response.data,
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
      actions?.resetForm?.();
    }
  };

  return (
    <>
      <AppHeader />
      {/* Centering the card */}
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="card shadow-sm  px-5 py-5 w-100"
          style={{maxWidth: '1000px'}}>
          <div className="row align-items-center">
            <div className="d-flex justify-content-between align-items-center py-2 mb-3">
              <h5 className="fw-bold mb-0 fs-4">
                Service Name :{' '}
                <span>{capitalizeFirstLetter(service?.subServiceName)}</span>
              </h5>

              <button
                type="button"
                className="btn btn-success custom-btn shadow"
                onClick={() => handleAddToWallet(serviceId)}>
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
                {/* Render images dynamically */}
                {service?.images?.map((image, index) => {
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
                          alt={service?.subServiceName || 'Image'}
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

            {/* Description */}
            <div className="col-md-6">
              <h5 className="fw-bold mb-3 text-dark ">Description :</h5>
              <p className="badge text-dark">
                {capitalizeFirstLetter(service?.description) ||
                  'No Description Available'}
              </p>
              {/* Product Keywords */}
              <h5 className="fw-bold mb-3  ">Product Keywords : </h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {service?.keyword?.map((keyword, index) => (
                  <span key={index} className="badge bg-light text-dark p-2">
                    {capitalizeFirstLetter(keyword)}
                  </span>
                ))}
              </div>

              {/* Industry Type */}
              <h5 className="fw-bold mb-3">Industry Type:</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {service?.industryType?.map((type, index) => (
                  <span key={index} className="badge bg-light text-dark p-2">
                    {capitalizeFirstLetter(type)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearviceDetails;
