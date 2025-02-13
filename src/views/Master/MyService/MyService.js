import React, {useState} from 'react';
import {CTabContent, CTabPane, CNav, CNavItem, CNavLink} from '@coreui/react';
import {AppHeader, AppSidebar} from '../../../components';
import Service from './Service';
import ServiceDetails from './ServiceDetails';

const MyService = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <AppHeader />
      <AppSidebar />
      <div
        style={{
          paddingLeft: '273px',
          paddingRight: '19px',
        }}>
        <div className="card">
          <div className="card-body">
            {/* Tabs Navigation */}
            <div className="tab-wrapper mb-2">
              <button
                onClick={() => setActiveTab(1)}
                className={`btn-tab ${activeTab === 1 ? 'active' : ''}`}>
                MY SERVICES
              </button>

              <button
                onClick={() => setActiveTab(2)}
                className={`btn-tab ${activeTab === 2 ? 'active' : ''}`}>
                SERVICE DETAILS
              </button>
            </div>

            {/* Tabs Content */}
            <CTabContent>
              <CTabPane role="tabpanel" visible={activeTab === 1}>
                <div className="card-body shadow">
                  <Service />
                </div>
              </CTabPane>

              <CTabPane role="tabpanel" visible={activeTab === 2}>
                <div className="card-body shadow">
                  <ServiceDetails />
                </div>
              </CTabPane>
            </CTabContent>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyService;
