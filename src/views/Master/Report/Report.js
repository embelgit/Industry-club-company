import React, {useState} from 'react';
import {CTabContent, CTabPane} from '@coreui/react';
import {AppHeader, AppSidebar} from '../../../components';

const Report = () => {
  const [activeTab, setActiveTab] = useState(1); // Tracks the active tab

  const userNotifications = [
    {
      id: 1,
      name: 'New Message',
      message: 'You have a new message from John Doe.',
      dateTime: '2025-01-04 10:15 AM',
    },
    {
      id: 2,
      name: 'Password Change Alert',
      message: 'Your password was changed successfully.',
      dateTime: '2025-01-03 03:45 PM',
    },
  ];

  const websiteNotifications = [
    {
      id: 1,
      name: 'Maintenance Update',
      message: 'Scheduled maintenance on January 6, 2025.',
      dateTime: '2025-01-02 11:00 AM',
    },
    {
      id: 2,
      name: 'New Feature Released',
      message: 'Try out our new advanced reporting feature.',
      dateTime: '2025-01-01 09:30 AM',
    },
  ];

  const renderNotifications = notifications => (
    <ul className="list-group">
      {notifications.map(notification => (
        <li key={notification.id} className="list-group-item">
          <div className="d-flex justify-content-between">
            <h6 className="mb-1">{notification.name}</h6>
            <small className="text-muted">{notification.dateTime}</small>
          </div>
          <p className="mb-0 text-muted">{notification.message}</p>
        </li>
      ))}
    </ul>
  );

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
        <div className="card shadow">
          <div className="card-body">
            {/* Navigation for Tabs */}
            <div className="tab-wrapper mb-2">
              {/* Tab 1: User Notifications */}
              <button
                onClick={() => setActiveTab(1)}
                className={`btn-tab ${activeTab === 1 ? 'active' : ''}`}>
                User Notifications
              </button>

              {/* Tab 2: Website Notifications */}
              <button
                onClick={() => setActiveTab(2)}
                className={`btn-tab ${activeTab === 2 ? 'active' : ''}`}>
                Website Notifications
              </button>
            </div>

            {/* Tab Content */}
            <CTabContent>
              {/* Tab 1: User Notifications Content */}
              <CTabPane visible={activeTab === 1}>
                <div className="card-body">
                  {renderNotifications(userNotifications)}
                </div>
              </CTabPane>

              {/* Tab 2: Website Notifications Content */}
              <CTabPane visible={activeTab === 2}>
                <div className="card-body">
                  {renderNotifications(websiteNotifications)}
                </div>
              </CTabPane>
            </CTabContent>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
