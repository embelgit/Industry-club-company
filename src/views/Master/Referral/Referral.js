import React, {useState} from 'react';
import AddReferel from './AddReferel';
import GetReferel from './GetReferel';
import {AppHeader, AppSidebar} from '../../../components';

const Referel = () => {
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
      <AppHeader />
      <AppSidebar />

      <div
        className="col-12"
        style={{
          paddingLeft: '284px',
          paddingRight: '26px',
          paddingTop: '11px',
        }}>
        <div className="card-body">
          {activeCard === 'post' && (
            <AddReferel
              handleListClick={handleListClick}
              handleEditClick={handleEditClick}
            />
          )}

          {activeCard === 'list' && (
            <GetReferel handlePostClick={handlePostClick} />
          )}
        </div>
      </div>
    </>
  );
};

export default Referel;
