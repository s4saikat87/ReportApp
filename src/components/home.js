import React from 'react'
import { useState, useEffect } from 'react'
import "../index.css";
import { FaKey, FaLock, FaMicrosoft, FaUserAlt } from 'react-icons/fa';
import Dashboard from './dashboard';
import Box from '@mui/material/Box';
import { Button } from 'bootstrap';
import axios from 'axios';
import LogoPage from './logoPage';
import TextField from '@mui/material/TextField';


import {
  signInWithGooglePopup,
  signInWithMicrosoftPopup,
  createUserDocumentFromAuth,
  firebaseApp, auth
}
  from '../utils/firebase/firebase.utils';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useParams,
  NavLink,
  useNavigate,
  useLocation
} from 'react-router-dom';

import "../index.css";
var CryptoJS = require("crypto-js");

if (process.env.NODE_ENV != 'development') {

  axios.defaults.baseURL = process.env.REACT_APP_PROD_URL;
}
else {
  axios.defaults.baseURL = process.env.REACT_APP_DEV_URL;
}

const Home = () => {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const [email, setEmail] = useState('');
  // User Login info


  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };



  useEffect(() => {

    let isAuth = JSON.parse(localStorage.getItem('tokenMicrosoft'))
    if (isAuth && isAuth !== null) {
      navigate("/")
    }
  }, [])


  const authorizeandRedirect = (event) => {
    event.preventDefault();

   
    var { uname, pass } = document.forms[0];

    if (uname.value == '') {
      setErrorMessages({ name: "uname", message: 'Username cant be blank.' });
  } 
  else if(pass.value== '')
  {
      setErrorMessages({ name: "pass", message: 'Password cant be blank.' });
  }
  else{

    let Username = uname.value;
    

    let Password = pass.value;
    
    let IsSso = '0';
    const data = { Username, Password };
    
    axios.post('/login', data)
      .then((response) => {

        console.log(response);
       
        if (response.statusText === '') {

          let token = response.data;

          const postData = { token };
          localStorage.setItem('token', JSON.stringify(token));
          localStorage.setItem('email', JSON.stringify(Username));
          navigate("/dashboard", { state: postData });


          // navigate("/dashboard",{state:1});
        }


      })
      .catch((error) => {
        // debugger;
        console.log("my error is " + error);
      })

  }

    

  }

  // const handleLogIn = async () => {


  //   const { user } = await signInWithMicrosoftPopup();

  //   const userDocReference = await createUserDocumentFromAuth(user);
  //   //console.log(response);
  //   createUserDocumentFromAuth(user);

  //   if (user.isAnonymous) {
  //     setErrorMessages({ name: "pass", message: errors.pass });

  //   }
  //   else {
  //     debugger;
  //     let token = user.accessToken;
  //     let email = user.email;
  //     const postData = { token, email };
  //     navigate("/dashboard", { state: postData });

  //   }


  // }
  const logMicrosoftUser = async () => {
   
    //const response=await signInWithMicrosoftPopup();
    const { user } = await signInWithMicrosoftPopup();
    // console.log(user);
    const userDocReference = await createUserDocumentFromAuth(user);
    //console.log(response);
    createUserDocumentFromAuth(user);

    if (user.isAnonymous) {
      setErrorMessages({ name: "pass", message: errors.pass });

    }
    else {
      debugger;
      let tokenM = user.accessToken+'==MS';
      localStorage.setItem('tokenMicrosoft', JSON.stringify(tokenM));
      
     // let email = user.email;
      //let Username=CryptoJS.AES.encrypt(JSON.stringify(email), process.env.REACT_APP_SEC_KEY).toString();
      let Username=user.email;
      let Password =tokenM; //process.env.REACT_APP_PASS;
     
      const data = { email, Password};

      axios.post('/login', data)
      .then((response) => {
        debugger;
        console.log(response);
       
        if (response.statusText === '') {

          let token = response.data;

          const postData = { token };
          localStorage.setItem('token', JSON.stringify(token));
          localStorage.setItem('email', JSON.stringify(Username));
          navigate("/dashboard", { state: postData });


          // navigate("/dashboard",{state:1});
        }


      })
      .catch((error) => {
        // debugger;
        console.log("my error is " + error);
      })
    }
  }



  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const styleLogin = {
    float: 'right'

  };


  return (
    <div>



      <div>
        <div className='row'>

          <div>
            {/* <a className="text-end" style={styleLogin}  onClick={handleLogIn}>Microsoft LogIn</a> */}
          </div>
        </div>
      </div>
      <div className="app">
        <div>
          <div className="login-form">
            <div className='text-center'>
              <LogoPage />
            </div>

            {/* <div className="title text-center h5 pt-1">Sign In</div> */}
            <div className="form">
              <form onSubmit={authorizeandRedirect}>
                <div className="input-container">

                  <div className='input-group pb-2 pt-2'>
                    <span className="input-group-text" id="basic-addon1"><FaUserAlt /></span>
                    {/* <input className='form-control' label='Username' variant='Outlined' type="text" name="uname" required /> */}
                    <TextField
                      required className='form-control' name="uname"
                      variant="outlined" label='Username' size="small"

                    ></TextField>
                    

                    
                  </div>
                  <div className='row mb-1 text-md'>

                    {renderErrorMessage("uname")}
                    </div>

                </div>
                <div className="input-container">

                  <div className='input-group pb-2'>
                    <span className="input-group-text" id="basic-addon2"><FaLock /></span>

                    <TextField
                      required className='form-control' name="pass"
                      variant="outlined" label='Password' type="password" size="small"

                    ></TextField>

                    {/* <input className='form-control' type="password" name="pass" required /> */}
                    
                  </div>

                  <div className='row mb-1 text-md'>

                  {renderErrorMessage("pass")}
                    </div>
                </div>
                <div className="button-container pt-2">


                  <input type="button" className='btn btn-primary w-75' onClick={authorizeandRedirect} value="Sign in"></input>


                </div>
                <hr></hr>
               
              </form>
              <div className='text-center pt-1 mt-1'>
                  <p>Or Sign in using</p>

                  <button className='btn btn-outline-primary' onClick={logMicrosoftUser} > Microsoft <FaMicrosoft /></button>
                  {/* <input type="button" className='btn btn-outline-primary' onClick={logMicrosoftUser} value='Microsoft' ></input> */}


                </div>
            </div>
          </div>




        </div>
      </div>

    </div>
  )
}

export default Home
