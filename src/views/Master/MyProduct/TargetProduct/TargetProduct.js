import React, {useState} from 'react';

import AddTargetProduct from './AddTargetProduct';
import GetTargetProduct from './GetTargetProduct';
import {AppSidebar} from '../../../../components';

const TargetProduct = () => {
  const [activeCard, setActiveCard] = useState('post');
  const handleListClick = () => {
    setActiveCard('list');
  };

  const handleEditClick = () => {
    setActiveCard('edit');
  };

  const handlePostClick = () => {
    setActiveCard('post');
  };

  return (
    <>
      <AppSidebar />
      <div>
        {activeCard === 'post' && (
          <AddTargetProduct
            handleListClick={handleListClick}
            handleEditClick={handleEditClick}
          />
        )}

        {activeCard === 'list' && (
          <GetTargetProduct handlePostClick={handlePostClick} />
        )}
      </div>
    </>
  );
};

export default TargetProduct;
