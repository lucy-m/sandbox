import { LayoutStack } from 'luce-util-layout'
import 'luce-util-layout/dist/index.css'
import React from 'react'

const App = () => {
  return (
    <LayoutStack>
      <div className='item'>
        <LayoutStack spacing={'snug'}>
          <div className='item'>One</div>
          <div className='item'>Two</div>
          <div className='item'>Three</div>
        </LayoutStack>
      </div>
      <div className='item'>
        <LayoutStack spacing={'loose'}>
          <div className='item'>A</div>
          <div className='item'>B</div>
          <div className='item'>C</div>
        </LayoutStack>
      </div>
    </LayoutStack>
  )
}

export default App
