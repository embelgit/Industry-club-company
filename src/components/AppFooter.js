import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className='ps-17'>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Embel Technologies
        </a>
        <span className="ms-1">&copy; All right reserved.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
        Industries Club
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
