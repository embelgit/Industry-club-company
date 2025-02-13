// import { Fade } from "react-reveal";
import React from 'react'
/* The TextError function returns a div element with the class "error" and applies a fade animation to it. */
const TextError = (props) => {
  return (
    <>
      {/* <Fade bottom> */}
      <div className="text-danger">{props.children}</div>
      {/* </Fade> */}
    </>
  )
}

export default TextError
