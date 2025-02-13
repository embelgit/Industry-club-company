import {CNav, CNavItem, CTabContent, CNavLink, CTabPane} from '@coreui/react';
import React, {useState} from 'react';
import AddComBuySell from './AddComBuySell';
import GetCompanyBuySell from './GetCompanyBuySell';
import UpdateCompanyBuySell from './UpdateCompanyBuySell';
import {AppHeader, AppSidebar} from '../../../components';
import ReceivedBuySell from './ReceivedCompanyBuying/ReceivedCompanyBuying/ReceivedBuySell';

const CompanyBuyingSelling = () => {
  const [activeTab, setActiveTab] = useState(1); // Tracks the active tab
  const [activeCard, setActiveCard] = useState('post'); // Tracks the active card for Tab 1

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
      <div className="card " style={{marginLeft: '18%', marginRight: '1%'}}>
        <div
          style={{
            paddingLeft: '18px',
            paddingRight: '19px',
            paddingTop: '11px',
          }}>
          {/* Navigation for Tabs */}
          <div className="tab-wrapper mb-2">
            {/* Tab 1: Company Buying/Selling */}
            <button
              onClick={() => setActiveTab(1)}
              className={`btn-tab ${activeTab === 1 ? 'active' : ''}`}>
              Company Buying/Selling
            </button>

            {/* Tab 2: New */}
            <button
              onClick={() => setActiveTab(2)}
              className={`btn-tab ${activeTab === 2 ? 'active' : ''}`}>
              Received Company Buying/Selling
            </button>
          </div>

          {/* Tab Content */}
          <CTabContent>
            {/* Tab 1 Content */}
            <CTabPane visible={activeTab === 1}>
              <div className="card-body shadow">
                {activeCard === 'post' && (
                  <AddComBuySell
                    handleListClick={handleListClick}
                    handleEditClick={handleEditClick}
                  />
                )}
                {activeCard === 'list' && (
                  <GetCompanyBuySell handlePostClick={handlePostClick} />
                )}
                {activeCard === 'edit' && (
                  <UpdateCompanyBuySell handlePostClick={handlePostClick} />
                )}
              </div>
            </CTabPane>

            {/* Tab 2 Content */}
            <CTabPane visible={activeTab === 2}>
              <div className="card-body shadow">
                <ReceivedBuySell />
              </div>
            </CTabPane>
          </CTabContent>
        </div>
      </div>
    </>
  );
};

export default CompanyBuyingSelling;
