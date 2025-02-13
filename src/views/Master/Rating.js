import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {FaStar} from 'react-icons/fa';
import swal from 'sweetalert';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  getRating,
  postRating,
  updateRating,
} from '../../service/masterModule/SearchApi';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const {vendorId} = location.state || {};
  const [fkRatingId, setFkRatingId] = useState(
    sessionStorage.getItem('fkRatingId') || null,
  );

  console.log('Vendor ID:', vendorId);

  const handleClick = async value => {
    const companyId = sessionStorage.getItem('_id');
    const userName = sessionStorage.getItem('userName');
    setRating(value);
    const selectedStars = Array.from({length: value}, (_, i) => i + 1).join(
      ',',
    );

    const data = {
      fkCompanyId: companyId,
      fkVendorId: vendorId,
      ratingCount: selectedStars,
      createdBy: userName,
    };

    try {
      if (fkRatingId) {
        // Update the existing rating
        const updateData = {...data, pkRatingId: fkRatingId};
        const response = await updateRating(updateData);
        console.log('Update Rating Response', response);
        if (response.status === 200) {
          swal({
            title: 'Success',
            text: 'Rating updated successfully!',
            icon: 'success',
            timer: 2000,
            buttons: false,
          });
          await fetchRating(fkRatingId);
        }
      } else {
        // Post a new rating
        const response = await postRating(data);
        console.log('Rating Response', response);
        if (response.status === 200) {
          const pkRatingId = response.data.pkRatingId;
          console.log('pkRatingId', pkRatingId);
          sessionStorage.setItem('pkRatingId', pkRatingId);
          swal({
            title: 'Success',
            text: response.data.sms,
            icon: 'success',
            timer: 2000,
            buttons: false,
          });

          // Update fkRatingId and fetch the updated rating
          setFkRatingId(pkRatingId);
          await fetchRating(pkRatingId);
        }
      }
    } catch (error) {
      console.error('Error in submission:', error?.response || error);

      if (error?.response?.status === 400) {
        swal({
          title: 'Warning',
          text: error.response.data?.message || 'Validation error',
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
    }
  };

  const fetchRating = async fkRatingId => {
    try {
      setLoader(true);
      const result = await getRating(fkRatingId);
      console.log('Rating Data:', result?.data);
      if (result?.data?.ratingCount) {
        const fetchedRating = result.data.ratingCount.split(',').length;
        setRating(fetchedRating);
      }
    } catch (error) {
      console.error('Error fetching Company details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (fkRatingId) {
      fetchRating(fkRatingId);
    } else {
      console.warn('fkRatingId is not defined');
    }
  }, [fkRatingId]);

  useEffect(() => {
    const pkRatingId = sessionStorage.getItem('pkRatingId');
    if (pkRatingId) {
      fetchRating(pkRatingId);
    }
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-body text-center">
        <p className="fw-bold">Know This Manufacturer?</p>
        <p>
          Rate them and leave feedback so your experience can inform others.
        </p>
        {loader ? (
          <div>Loading...</div>
        ) : (
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <FaStar
                key={star}
                onClick={() => handleClick(star)}
                style={{
                  cursor: 'pointer',
                  color: star <= rating ? '#ffc107' : '#ddd',
                  fontSize: '30px',
                  transition: 'color 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rating;
