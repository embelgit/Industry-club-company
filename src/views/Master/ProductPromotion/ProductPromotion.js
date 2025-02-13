import React, {useState} from 'react';
import {CTabContent, CTabPane} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import ProductManagement from './ProductManagement';
import {AppHeader, AppSidebar} from '../../../components';
import ReceivedBlastingMessage from './ReceivedBlastingMessage';
import Blasting from './Blasting';

const ProductPromotion = () => {
  const [activeTab, setActiveTab] = useState(1); // Tracks the active tab

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
          <div className="card-body ">
            {/* Tab Navigation */}
            <div className="tab-wrapper mb-2">
              {/* Tab 1: My Blasting */}
              <button
                onClick={() => setActiveTab(1)}
                className={`btn-tab ${activeTab === 1 ? 'active' : ''}`}>
                My Blasting
              </button>

              {/* Tab 2: Received Blasting Message */}
              <button
                onClick={() => setActiveTab(2)}
                className={`btn-tab ${activeTab === 2 ? 'active' : ''}`}>
                Received Blasting Message
              </button>

              {/* Tab 3: Blasting */}
              <button
                onClick={() => setActiveTab(3)}
                className={`btn-tab ${activeTab === 3 ? 'active' : ''}`}>
                Blasting
              </button>
            </div>

            {/* Tab Content */}
            <CTabContent>
              {/* Tab 1: My Blasting Content */}
              <CTabPane visible={activeTab === 1}>
                <div className="card-body shadow">
                  <ProductManagement />
                </div>
              </CTabPane>

              {/* Tab 2: Received Blasting Message Content */}
              <CTabPane visible={activeTab === 2}>
                <div className="card-body">
                  <ReceivedBlastingMessage />
                </div>
              </CTabPane>

              {/* Tab 3: Blasting Content */}
              <CTabPane visible={activeTab === 3}>
                <div className="card-body">
                  <Blasting />
                </div>
              </CTabPane>
            </CTabContent>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPromotion;
