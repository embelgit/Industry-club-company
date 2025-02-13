import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* The ToggleEye function is a component that renders an eye icon and toggles its state when clicked. */
const ToggleEye = ({ state, toggle, dClass, }) => {
  return (
    <>
      <span className={dClass} onClick={toggle}>
      <FontAwesomeIcon icon={state ? faEyeSlash : faEye} />
      </span>
    </>
  );
};

export default ToggleEye;