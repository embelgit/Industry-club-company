import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilBell,
  cilCommentSquare,
  cilCreditCard,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons';
import {Link} from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import React from 'react';
import avatar8 from './../../assets/images/avatar.jpeg';

const AppHeaderDropdown = props => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}>
        <div className="text-center">
          <CIcon icon={cilUser} size="lg" className="text-white" />
          <div className="text-white custom-small-text px-2">Profile</div>
        </div>
        {/* <CAvatar src={avatar8} size="md" /> */}
        {/* <CIcon icon={cilUser} size="lg" className="text-white cursor-pointer" /> */}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>
        <Link to="/company-detail-register" className="text-decoration-none">
          <CDropdownItem>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
        </Link>

        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
          Settings
        </CDropdownHeader>

        <Link to="/reset-password" className="text-decoration-none">
          <CDropdownItem>
            <CIcon icon={cilLockLocked} className="me-2" />
            Reset Password
          </CDropdownItem>
        </Link>
        <CDropdownDivider />
        <CDropdownItem onClick={e => props.logOut(e)}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
