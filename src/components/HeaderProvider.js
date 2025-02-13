// // src/context/HeaderContext.js

// import React, {createContext, useState, useContext} from 'react';

// const HeaderContext = createContext();

// export const useHeaderContext = () => {
//   return useContext(HeaderContext);
// };

// export const HeaderProvider = ({children}) => {
//   const [showProgressBar, setShowProgressBar] = useState(false);
//   const [showSearchBar, setShowSearchBar] = useState(false);

//   const setProgressBarVisibility = visible => {
//     setShowProgressBar(visible);
//     setShowSearchBar(false); // Hide SearchBar when ProgressBar is visible
//   };

//   const setSearchBarVisibility = visible => {
//     setShowSearchBar(visible);
//     setShowProgressBar(false); // Hide ProgressBar when SearchBar is visible
//   };

//   return (
//     <HeaderContext.Provider
//       value={{
//         showProgressBar,
//         showSearchBar,
//         setProgressBarVisibility,
//         setSearchBarVisibility,
//       }}>
//       {children}
//     </HeaderContext.Provider>
//   );
// };
