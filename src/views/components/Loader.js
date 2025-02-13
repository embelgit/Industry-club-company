import { CSpinner } from '@coreui/react'
import React from 'react'

const Loader = () => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    </>
  )
}

export default Loader
