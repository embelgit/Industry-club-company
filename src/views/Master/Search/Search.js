import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Card, CardBody, CardTitle} from 'reactstrap';
import Loader from '../../components/Loader';
import DataNotPresent from '../../components/DataNotPresent';
import {FaArrowLeft} from 'react-icons/fa';
import {getProductandIndustrylist} from '../../../service/masterModule/SearchApi';
import {AppHeader} from '../../../components';
import RegistrationHeader from '../../../components/RegistrationComponents/RegistrationHeader';

const Search = () => {
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate(); // For programmatic navigation

  // Fetch function for buy/sell details
  const fetchIndustryProductList = async () => {
    try {
      setLoader(true);
      const result = await getProductandIndustrylist();
      console.log('Fetched Company Buy & Sell details: ', result);

      // Transform the data
      const transformedData =
        result?.data?.map(item => ({
          name: item.industryName,
          count: item.productCount,
          subcategories: item.productName,
        })) || [];

      setCategories(transformedData);
    } catch (error) {
      console.error('Error fetching Company Buy & Sell details:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchIndustryProductList();
  }, []);

  return (
    <>
      <AppHeader />
      <div className="d-flex align-items-center mx-2">
        <button
          className="btn btn-light d-flex justify-content-center"
          onClick={() => navigate('/dashboard')}>
          <FaArrowLeft className="me-2" style={{fontSize: '1.2rem'}} />
        </button>
      </div>

      {loader ? (
        <Loader />
      ) : categories.length > 0 ? (
        <div
          className="row align-items-stretch mb-3 mt-3 mx-5"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {categories.map((category, index) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 mb-3"
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '20px',
              }}>
              {/* Card View */}
              <Card>
                <CardBody>
                  <CardTitle tag="h5" className="text-dark">
                    {category.name}{' '}
                    <span className="text-dark">({category.count})</span>
                  </CardTitle>
                  <div>
                    <ul className="mt-3">
                      {category.subcategories.map((product, subIndex) => (
                        <li key={subIndex} className="mb-2">
                          <Link
                            to={{
                              pathname: '/industry-product-wiseSearch',
                            }}
                            state={{subcategory: product}}
                            style={{
                              textDecoration: 'underline',
                              color: 'blue',
                            }}>
                            {product}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <DataNotPresent title="Data Not Present" /> // Show message if no data
      )}
    </>
  );
};

export default Search;
