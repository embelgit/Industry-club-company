import React, {useState} from 'react';
import {AppHeader, AppSidebar} from '../../../components';
import AddTargetService from './AddTargetService';
import TargetServicelist from './TargetServicelist';

const TargetService = () => {
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
            <AddTargetService
              handleListClick={handleListClick}
              handleEditClick={handleEditClick}
            />
          )}

          {activeCard === 'list' && (
            <TargetServicelist handlePostClick={handlePostClick} />
          )}
        </div>
      </div>
    </>
  );
};

export default TargetService;
