import React, {useState} from 'react';
import {CTabContent, CTabPane, CCardBody} from '@coreui/react';
import AddProductPromotion from './AddProductPromotion';
import GetProductPromotion from './GetProductPromotion';
import UpdateProductPromotion from './UpdateProductPromotion';

const ProductManagement = () => {
  const [activeCard, setActiveCard] = useState('post');

  const handleListClick = () => setActiveCard('list');
  const handlePostClick = () => setActiveCard('post');
  const handleEditClick = () => setActiveCard('edit');

  return (
    <CTabContent>
      <CTabPane visible={true}>
        <div>
          {activeCard === 'post' && (
            <AddProductPromotion handleListClick={handleListClick} />
          )}
          {activeCard === 'list' && (
            <GetProductPromotion handlePostClick={handlePostClick} />
          )}
          {activeCard === 'edit' && (
            <UpdateProductPromotion handlePostClick={handlePostClick} />
          )}
        </div>
      </CTabPane>
    </CTabContent>
  );
};

export default ProductManagement;
