// import React from 'react';
// import {NavLink} from 'react-router-dom';
// import PropTypes from 'prop-types';

// import SimpleBar from 'simplebar-react';
// import 'simplebar-react/dist/simplebar.min.css';

// import {CBadge, CNavLink, CSidebarNav} from '@coreui/react';

// export const RegistrationSidebarNav = ({items}) => {
//   const navLink = (name, icon, badge, indent = false) => {
//     return (
//       <>
//         {icon
//           ? icon
//           : indent && (
//               <span className="nav-icon">
//                 <span className="nav-icon-bullet"></span>
//               </span>
//             )}
//         {name && name}
//         {badge && (
//           <CBadge color={badge.color} className="ms-auto">
//             {badge.text}
//           </CBadge>
//         )}
//       </>
//     );
//   };

//   const navItem = (item, index, indent = false) => {
//     const {component, name, badge, icon, ...rest} = item;
//     const Component = component;
//     return (
//       <Component as="div" key={index}>
//         {rest.to || rest.href ? (
//           <CNavLink {...(rest.to && {as: NavLink})} {...rest}>
//             {navLink(name, icon, badge, indent)}
//           </CNavLink>
//         ) : (
//           navLink(name, icon, badge, indent)
//         )}
//       </Component>
//     );
//   };

//   const navGroup = (item, index) => {
//     const {component, name, icon, items, to, ...rest} = item;
//     const Component = component;
//     return (
//       <Component
//         compact
//         as="div"
//         key={index}
//         toggler={navLink(name, icon)}
//         {...rest}>
//         {item.items?.map((item, index) =>
//           item.items ? navGroup(item, index) : navItem(item, index, true),
//         )}
//       </Component>
//     );
//   };

//   return (
//     <CSidebarNav as={SimpleBar}>
//       {items &&
//         items.map((item, index) =>
//           item.items ? navGroup(item, index) : navItem(item, index),
//         )}
//     </CSidebarNav>
//   );
// };

// RegistrationSidebarNav.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.any).isRequired,
// };

import {CSidebar, CSidebarNav, CNavLink, CBadge} from '@coreui/react';
export const RegistrationSidebarNav = ({items, onNavClick}) => {
  const navLink = (name, icon, badge, indent = false, path, moduleName) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item, index, indent = false) => {
    const {component, name, badge, icon, to, moduleName, ...rest} = item;
    const Component = component;
    return (
      <Component as="div" key={index}>
        {to ? (
          <CNavLink
            {...rest}
            onClick={e => {
              e.preventDefault(); // Prevent default behavior if needed
              console.log(
                `Item clicked: ${name}, Path: ${to}, Module: ${moduleName}`,
              ); // Debugging
              onNavClick(to, moduleName); // Call the handler with path and moduleName
            }}>
            {navLink(name, icon, badge, indent, to, moduleName)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const {component, name, icon, items, to, ...rest} = item;
    const Component = component;
    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon)}
        {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
    </CSidebarNav>
  );
};
