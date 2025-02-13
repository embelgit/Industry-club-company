import {useState} from 'react';
import {AppHeader, AppSidebar} from '../../../components';
import {CTabContent, CTabPane} from '@coreui/react';
import ProductList from './ProductList';
import TargetProduct from './TargetProduct/TargetProduct';

const CompanyBuyingSelling = () => {
  const [activeTab, setActiveTab] = useState(1); // Tracks the active tab

  return (
    <>
      <AppHeader />
      <AppSidebar />
      <div
        style={{
          paddingLeft: '273px',
          paddingRight: '19px',
          paddingTop: '11px',
        }}>
        <div className="card ">
          <div className="card-body">
            {/* Navigation for Tabs */}
            <div className="tab-wrapper mb-2">
              {/* Tab 1: My Product */}
              <button
                onClick={() => setActiveTab(1)}
                className={`btn-tab ${activeTab === 1 ? 'active' : ''}`}>
                My Product
              </button>

              {/* Tab 2: Target Product */}
              <button
                onClick={() => setActiveTab(2)}
                className={`btn-tab ${activeTab === 2 ? 'active' : ''}`}>
                Target Product
              </button>

              {/* Tab 3: Product Details */}
              <button
                onClick={() => setActiveTab(3)}
                className={`btn-tab ${activeTab === 3 ? 'active' : ''}`}>
                Product Details
              </button>
            </div>
            {/* Horizontal Line */}
            {/* <hr className="my-3" /> */}
            {/* Tab Content */}

            <CTabContent>
              {/* Tab 1: My Product Content */}
              <CTabPane visible={activeTab === 1}>
                <div className="card-body shadow">
                  <ProductList />
                </div>
              </CTabPane>

              {/* Tab 2: Target Product Content */}
              <CTabPane visible={activeTab === 2}>
                <div className="card-body shadow">
                  <TargetProduct />
                </div>
              </CTabPane>

              {/* Tab 3: Product Details Content */}
              <CTabPane visible={activeTab === 3}>
                <div className="card-body shadow">
                  <p>new</p>
                </div>
              </CTabPane>
            </CTabContent>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyBuyingSelling;
