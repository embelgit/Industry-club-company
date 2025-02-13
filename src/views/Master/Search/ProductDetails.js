import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';
import {getServiceProductDetails} from '../../../service/masterModule/SearchApi';
import {AddToWallet} from '../../../service/masterModule/Wallet';
import {AppHeader} from '../../../components';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const {productId, serviceId = ''} = location.state || {};

  console.log('Product id:', productId);
  console.log('Service id:', serviceId);
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const result = await getServiceProductDetails(productId, serviceId);
          const productDetails = result.data.productDetails;

          console.log('Product details:', productDetails);

          if (productDetails) {
            setProduct({
              pkProductId: productDetails.pkProductId,
              productName: productDetails.productName,
              description: productDetails.description,
              hsnCode: productDetails.hsnCode,
              images: productDetails.images,
              industryType: productDetails.industryType,
              materialType: productDetails.materialType,
              keyword: productDetails.keyword,
              sacCode: productDetails.sacCode,
              status: productDetails.status,
              createdBy: productDetails.createdBy,
              updatedBy: productDetails.updatedBy,
            });
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

      fetchProduct();
    }
  }, [productId, serviceId]);

  // Utility function to capitalize the first letter of each word
  const capitalizeFirstLetter = string => {
    if (string && string.length > 0) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  };

  const handleAddToWallet = async (productId, values, actions) => {
    if (!productId) {
      console.error('Product Name is missing');
      swal({
        title: 'Error',
        text: 'Product name is required!',
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
      fkProductId: productId,
      fkServiceId: '',
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
      actions?.resetForm?.(); // Reset form only if `actions` is passed
    }
  };

  return (
    <>
      <AppHeader />
      {/* Centering the card */}
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="card shadow-sm px-5 py-5 w-100"
          style={{maxWidth: '1000px'}}>
          <div className="row align-items-center">
            <div className="d-flex justify-content-between align-items-center py-2 mb-3">
              <h5 className="fw-bold mb-0 fs-4">
                Product Name:{' '}
                <span>
                  {product?.productName
                    ? capitalizeFirstLetter(product.productName)
                    : 'Product Name Not Available'}
                </span>
              </h5>

              <button
                type="button"
                className="btn btn-success custom-btn shadow"
                onClick={() => handleAddToWallet(productId)}>
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
                {product?.images?.map((image, index) => {
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
                          alt={product?.productName || 'Product Image'}
                          className="img-fluid rounded"
                          style={{height: '20vw', width: '18vw'}}
                        />
                      </div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </div>

            {/* Right Side: Details */}
            <div className="col-md-6">
              <h5 className="fw-bold mb-3 text-dark">Description:</h5>
              <p className="badge text-dark text-wrap">
                {product?.description
                  ? capitalizeFirstLetter(product.description)
                  : 'No Description Available'}
              </p>

              <h5 className="fw-bold mb-3">Product Keywords:</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {product?.keyword?.map((keyword, index) => (
                  <span key={index} className="badge bg-light text-dark p-2">
                    {capitalizeFirstLetter(keyword)}
                  </span>
                ))}
              </div>

              <h5 className="fw-bold mb-3">Industry Type:</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {product?.industryType?.map((type, index) => (
                  <span key={index} className="badge bg-light text-dark p-2">
                    {capitalizeFirstLetter(type)}
                  </span>
                ))}
              </div>

              <h5 className="fw-bold mb-3">Material Type:</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {product?.materialType?.map((type, index) => (
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

export default ProductDetails;
