import React from 'react'
import Header from '../header/Header'
import Style from './Layout.module.css';

const Layout = ({children}) => {
  return (
    <div class={Style.wrapper}>
      <Header />
      <div class={Style.main}>
        {children}
      </div>
    </div>
  )
}

export default Layout