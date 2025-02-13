import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {FaStar} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import {getCompanyDetails} from '../../../service/masterModule/SearchApi';
import {getCompanyNameForChatting} from '../../../service/masterModule/Dashboard';
import Rating from '../Rating';
import {AppHeader} from '../../../components';
import {postRequest} from '../../../service/masterModule/NetworkConnection';

const CompanyDetails = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [companyData, setCompanyData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [url, setUrl] = useState(''); // State for URL input field
  const [isRequestSent, setIsRequestSent] = useState(false);
  // const [recCompanyId, setRecCompanyId] = useState(null);
  const location = useLocation();
  const {vendorId} = location.state || {};
  console.log('Vendor ID:', vendorId);

  const fetchCompanyDetails = async (companyId, vendorId) => {
    try {
      setLoader(true);
      const result = await getCompanyDetails(companyId, vendorId);
      console.log('Fetched Company Details: ', result);
      console.log('Company Data:', result?.data);
      setCompanyData(result?.data);
      // setRecCompanyId(result?.data.fkVendorId);
    } catch (error) {
      console.error('Error fetching Company details:', error);
    } finally {
      setLoader(false);
    }
  };
  const fetchCompanyNameForChatting = async (companyId, vendorId) => {
    try {
      setLoader(true);
      const result = await getCompanyNameForChatting(companyId, vendorId);
      console.log('Fetched Company Details: ', result);
      console.log('Company Data:', result?.data);
      setCompanyData(result?.data);

      // Navigate to the messages page and pass the data
      navigate('/messages', {
        state: {companyData: result?.data, companyId, vendorId},
      });
    } catch (error) {
      console.error('Error fetching Company details:', error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    const companyId = sessionStorage.getItem('_id'); // Get companyId from sessionStorage
    if (companyId && vendorId) {
      // Ensure both companyId and vendorId are present
      fetchCompanyDetails(companyId, vendorId);
    } else {
      console.error('No companyId or vendorId found');
    }
  }, [vendorId]);

  // Toggle function
  const SendRequest = async () => {
    const companyId = sessionStorage.getItem('_id');
    const userName = sessionStorage.getItem('userName');

    // Payload structure
    const payload = {
      fkSenderId: companyId,
      fkReceiverId: vendorId, // Ensure vendorId is defined in your scope
      createdBy: userName,
    };

    try {
      setLoader(true); // Start loading

      // Send the POST request
      const response = await postRequest(payload);
      console.log('Request sent successfully:', response.data);

      // Check for success response
      if (response.status === 200) {
        const pkNetworkId = response.data.pkNetworkId; // Corrected key from response
        console.log('pkNetworkId:', pkNetworkId);

        // Store pkNetworkId in sessionStorage
        sessionStorage.setItem('pkNetworkId', pkNetworkId);

        // Show success alert
        swal({
          title: 'Success',
          text: response.data.sms, // Message from the API
          icon: 'success',
          timer: 2000,
          buttons: false,
        });
      }
    } catch (error) {
      console.error('Error sending request:', error);

      // Extract the response from the error object
      const {response} = error;

      if (response?.status === 409) {
        swal({
          title: 'Warning',
          text: response.data.sms, // Display the "Request Already Sent" message
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
      setLoader(false); // Stop loading
    }
  };

  // Handle the modal toggle
  const toggleModal = () => setShowModal(!showModal);

  // Handle input change
  const handleInputChange = e => {
    setUrl(e.target.value);
  };

  // Handle visit button click
  const handleVisitClick = () => {
    window.open(url, '_blank');
  };

  const handleImageClick = (index, product) => {
    navigate('/product-Details', {
      state: {
        productId: product.pkProductId || '',
        serviceId: product.serviceId || '',
      },
    });
  };

  const handleserviceImageClick = (navigate, imageIndex, service) => {
    console.log('Image clicked:', service);
    navigate('/searvice-Details', {
      state: {
        productId: service.pkProductId || '',
        serviceId: service.fkServiceId || '',
        imageIndex,
      },
    });
  };

  const handleInfraImageClick = (imageIndex, infra) => {
    navigate('/infrastructure-Details', {
      state: {
        imageIndex,
        infra,
      },
    });
  };

  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Adjust this number to show more or fewer items in a row
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const capitalizeFirstLetter = str => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  };

  return (
    <>
      <AppHeader />
      {/* Content Container */}
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          {/* Main Company Card */}
          <div className="card shadow-sm col-10 col-md-7 col-lg-7 mx-3">
            <div className="card-body">
              <h2 className="card-title mb-3">
                {companyData?.companyName || 'Company Name Unavailable'}{' '}
                <span style={{fontSize: '18px'}}>
                  {`${capitalizeFirstLetter(companyData?.stateName || '')}, ${capitalizeFirstLetter(companyData?.countryName || '')}`}
                </span>
              </h2>
              <p className="text-muted fw-bold">
                {companyData?.companyRegister?.businessType
                  ?.map(type =>
                    type.replace(/\b\w/g, char => char.toUpperCase()),
                  )
                  .join(' / ') || 'Business Types Unavailable'}
              </p>
              <div className="d-flex gap-4 flex-wrap">
                <p className="text-muted fw-bold">
                  Rating: {companyData?.ratingCount}
                </p>
                <p className="text-muted fw-bold">
                  Connection: {companyData?.connectionCount}
                </p>
                <p className="text-muted fw-bold">
                  Established:{' '}
                  {companyData?.companyRegister?.registrationDate?.slice(-4) ||
                    'Year Unavailable'}
                </p>
              </div>
              <p className="my-4">
                <h5 className="fw-bold">Description</h5>
                {companyData?.companyRegister?.companyDescription}
              </p>

              <div className="slider-container mt-4">
                <h5 className="fw-bold">Product Details</h5>
                <div
                  className="d-flex"
                  style={{
                    gap: '16px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                  }}>
                  {companyData?.productDetails?.map((product, index) => (
                    <div
                      key={index}
                      className="slider-item"
                      style={{display: 'inline-block'}}>
                      {product.images?.length > 0 ? (
                        (() => {
                          const [format, base64Data] =
                            product.images[0].split(',');
                          return (
                            <img
                              src={`data:image/${format};base64,${base64Data}`}
                              alt={product.productName || 'Product Image'}
                              title={product.productName || 'Product Image'}
                              style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '5px solid #ddd',
                              }}
                              onClick={() =>
                                handleImageClick(index, {
                                  ...product,
                                  image: `data:image/${format};base64,${base64Data}`,
                                })
                              }
                            />
                          );
                        })()
                      ) : (
                        <div
                          style={{
                            width: '200px',
                            height: '200px',
                            backgroundColor: '#ddd',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '8px',
                          }}>
                          <span>No Image Available</span>
                        </div>
                      )}
                      <p className="mt-2" style={{color: 'black'}}>
                        {product.productName || 'No Product Name'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Details */}
              <div className="slider-container mt-4">
                <h5 className="fw-bold">Service Details</h5>
                <div
                  className="d-flex"
                  style={{
                    gap: '16px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                  }}>
                  {companyData?.serviceDetails?.map((service, index) => (
                    <div
                      key={index}
                      className="slider-item"
                      style={{display: 'inline-block', cursor: 'pointer'}}
                      onClick={() =>
                        handleserviceImageClick(navigate, index, {
                          ...service,
                          image:
                            service.images?.length > 0
                              ? `data:image/jpeg;base64,${service.images[0]}`
                              : null,
                        })
                      }>
                      {service.serviceImages?.length > 0 ? (
                        (() => {
                          const src = service.serviceImages[0].src || '';
                          const [format, base64Data] = src.split(',');
                          return (
                            <img
                              src={`data:image/${format};base64,${base64Data}`}
                              alt={service.subServiceName || 'Service Image'}
                              title={service.subServiceName || 'Service Image'}
                              style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '5px solid #ddd',
                              }}
                            />
                          );
                        })()
                      ) : (
                        <div
                          style={{
                            width: '200px',
                            height: '200px',
                            backgroundColor: '#ddd',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '8px',
                          }}>
                          <span>No Image Available</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Images */}
              <div className="slider-container mt-4">
                <h5 className="fw-bold">Infrastructure Images</h5>
                <Slider {...sliderSettings}>
                  {companyData?.infrastructureDetails?.map((infra, index) => (
                    <div key={index} className="slider-item">
                      <div
                        onClick={() =>
                          handleInfraImageClick(index, {
                            ...infra,
                            image:
                              infra.infraImages?.length > 0
                                ? `data:image/${infra.infraImages[0].format};base64,${infra.infraImages[0].src}`
                                : null, // Pass null if no image is available
                          })
                        }
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                        {infra.infraImages?.length > 0 ? (
                          <img
                            src={`data:image/${infra.infraImages[0].format};base64,${infra.infraImages[0].src}`}
                            title={
                              infra.equipmentType ||
                              `Infrastructure Image ${index + 1}`
                            }
                            alt={`Infrastructure Image ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '5px solid #ddd',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '200px',
                              backgroundColor: '#ddd',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '8px',
                            }}>
                            <span>No Image Available</span>
                          </div>
                        )}
                        <p className="mt-2" style={{color: 'black'}}>
                          {infra.equipmentType || 'No Equipment Type'} -{' '}
                          {infra.description || 'No Description'}
                        </p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>

              <h5 className="fw-bold mt-4">Company Details</h5>
              <div className="d-flex gap-5 flex-wrap">
                {/* <div>
                    <p className="fw-bold mb-1">Company Type:</p>
                    <span>
                      {companyData?.companyRegister?.businessType
                        ?.map(type =>
                          type.replace(/\b\w/g, char => char.toUpperCase()),
                        )
                        .join(' / ') || 'Business Types Unavailable'}
                    </span>
                  </div> */}
                <div>
                  <p className="fw-bold mb-1">Cage Code:</p>
                  <span>
                    {companyData?.companyRegister?.cageCode ||
                      'Business Types Unavailable'}
                  </span>
                </div>
                <div>
                  <p className="fw-bold mb-1">MFG Member Since:</p>
                  <p> {companyData?.companyRegister?.registrationDate}</p>
                </div>
                <div>
                  <p className="fw-bold mb-1">Location:</p>
                  <p>
                    {' '}
                    {`${capitalizeFirstLetter(companyData?.cityName || '')}, ${capitalizeFirstLetter(companyData?.countryName || '')}`}
                  </p>
                </div>
                <div>
                  <p className="fw-bold mb-1">Certifications:</p>
                  <span>
                    {companyData?.certificateNames?.slice(0, 3).join(' / ') ||
                      'Certifications Unavailable'}
                  </span>
                </div>
                <div>
                  <p className="fw-bold mb-1">D-U-N-S Number:</p>
                  <p> {companyData?.companyRegister?.dunsNo}</p>
                </div>
                <div>
                  <p className="fw-bold mb-1">PAN Number:</p>
                  <p> {companyData?.companyRegister?.panNo}</p>
                </div>
                <div>
                  <p className="fw-bold mb-1">TAN Number:</p>
                  <p> {companyData?.companyRegister?.tanNo}</p>
                </div>
                <div>
                  <p className="fw-bold mb-1">Business Url:</p>
                  <p> {companyData?.companyRegister?.businessUrl}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="d-flex flex-column gap-4 col-4 col-md-3 ">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <p className="fw-bold">Send Request </p>
                <p>
                  Start a conversation and get any additional info you need.
                </p>
                {/* "Send Request/Cancel" Button */}
                <button
                  type="button"
                  className={`btn custom-btn shadow ${isRequestSent ? 'btn-danger' : 'btn-success'}`}
                  onClick={SendRequest}>
                  {isRequestSent ? (
                    <>
                      <i className="fas fa-times"></i> Cancel
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Send a Message Card */}
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <p className="fw-bold">Send a Message</p>
                <p>
                  Start a conversation and get any additional info you need.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const companyId = sessionStorage.getItem('_id');
                    fetchCompanyNameForChatting(companyId, vendorId);
                  }}>
                  Send a Message
                </button>
              </div>
            </div>

            {/* Rating Card */}
            <Rating />

            {/* Contact Card */}
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <p className="fw-bold">Contact</p>
                <p>Prefer to reach out directly? No problem.</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary flex-fill">Call</button>
                  <button
                    className="btn btn-primary flex-fill"
                    onClick={toggleModal}>
                    Website
                  </button>

                  {showModal && (
                    <div
                      className="modal show"
                      style={{display: 'block'}}
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true">
                      <div className="modal-dialog   mt-5">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Enter Website URL
                            </h5>
                            <button
                              type="button"
                              className="close"
                              onClick={toggleModal}
                              aria-label="Close"
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                              }}>
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            {/* Input field for URL */}
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter URL"
                              value={url}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="modal-footer">
                            {/* Visit button */}
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleVisitClick}>
                              Visit
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={toggleModal}>
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
