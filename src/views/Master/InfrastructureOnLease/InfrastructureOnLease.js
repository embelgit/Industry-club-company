import React, {useState} from 'react';
import PostInfrastructure from './PostInfrastructure';
import GetInfrastructure from './GetInfrastructure';
import {AppHeader, AppSidebar} from '../../../components';

const InfrastructureOnLease = () => {
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
        style={{
          paddingLeft: '284px',
          paddingRight: '26px',
          paddingTop: '11px',
        }}>
        <div className="card-body">
          {activeCard === 'post' && (
            <PostInfrastructure
              handleListClick={handleListClick}
              handleEditClick={handleEditClick}
            />
          )}
          {activeCard === 'list' && (
            <GetInfrastructure handlePostClick={handlePostClick} />
          )}
        </div>
      </div>
    </>
  );
};

export default InfrastructureOnLease;
