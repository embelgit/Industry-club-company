import { ErrorMessage, Field, useFormikContext } from 'formik';

import Switch from 'react-switch';
import { useEffect } from 'react';

const SwitchButton = ({ question, name }) => {
  const { values, setFieldValue } = useFormikContext();

  // if (values[name] === undefined) {
  //   setFieldValue(name, false);
  // }

  // useEffect(() => {
  //   if (values[name] === undefined) {
  //     setFieldValue(name, false);
  //   }
  // }, [values, name, setFieldValue]);

  return (
    <>
      <div className='yes-no-wrapper'>
        {/* <div>
          <label className='form-control-label'>{question}</label>
          // <span className='mustRequired'>*</span>
        </div> */}
        <div>
          <Switch
            onChange={(checked) => setFieldValue(name, checked)}
            checked={values[name]}
          />
          {/* <ErrorMessage name={name} component={component} /> */}
        </div>
      </div>
    </>
  );
};

export default SwitchButton;