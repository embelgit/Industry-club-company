import Error from '../../assets/logo-removebg.png';
import React from 'react';
import {CContainer} from '@coreui/react';

const DataNotPresent = ({title}) => {
  return (
    <>
      <CContainer className="border-bottom p-4" fluid>
        <div
          className="data-not-img-wrapper justify-content-center"
          align="center"
          style={{marginTop: '20px'}}>
          <img
            src={Error}
            alt="error-img"
            style={{width: '200px', height: '200px'}}
          />
        </div>
        <h4 className="mt-2 text-center" style={{fontSize: '2rem'}}>
          {title}
        </h4>
      </CContainer>
    </>
  );
};

export default DataNotPresent;
