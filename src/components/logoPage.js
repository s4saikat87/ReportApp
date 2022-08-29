import React from 'react'
import logo from '../Images/GRS_logo.png';
const LogoPage = () => {
const styleLogo ={
width: '150px'

}


  return (
    <div>
      <img style={styleLogo} src={logo}></img>
    </div>
  )
}

export default LogoPage
