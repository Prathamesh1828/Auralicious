import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google';

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext)

  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login"
    }
    else if (currState === "Sign Up") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(data.password)) {
        alert("Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.");
        return;
      }
      newUrl += "/api/user/register"
    }
    else if (currState === "Forgot Password") {
      newUrl += "/api/user/forgot-password"
    }
    else if (currState === "Verify OTP") {
      newUrl += "/api/user/verify-otp"
    }
    else if (currState === "Set Password") {
      if (data.newPassword !== data.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      newUrl += "/api/user/reset-password"
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        if (currState === "Forgot Password") {
          setCurrState("Verify OTP");
          alert(response.data.message);
        } else if (currState === "Verify OTP") {
          setCurrState("Set Password");
          alert(response.data.message);
        } else if (currState === "Set Password") {
          setCurrState("Login");
          alert(response.data.message);
        } else {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setShowLogin(false)
        }
      }
      else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        alert(error.response.data.message || "Server Error");
      } else {
        alert("Something went wrong: " + error.message);
      }
    }
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(url + "/api/user/google-login", { token: credentialResponse.credential });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false)
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" && <></>}
          {currState === "Sign Up" && <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' required />}

          {(currState === "Login" || currState === "Sign Up" || currState === "Forgot Password") &&
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
          }

          {(currState === "Login" || currState === "Sign Up") &&
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
          }

          {currState === "Verify OTP" && (
            <input name='otp' onChange={onChangeHandler} value={data.otp} type="text" placeholder='Enter OTP' required />
          )}

          {currState === "Set Password" && (
            <>
              <input name='newPassword' onChange={onChangeHandler} value={data.newPassword} type="password" placeholder='New Password' required />
              <input name='confirmPassword' onChange={onChangeHandler} value={data.confirmPassword} type="password" placeholder='Confirm Password' required />
            </>
          )}
        </div>

        <button type='submit'>
          {currState === "Sign Up" ? "Create Account" :
            currState === "Forgot Password" ? "Send OTP" :
              currState === "Verify OTP" ? "Verify" :
                currState === "Set Password" ? "Reset Password" : "Login"}
        </button>

        {currState === "Login" && (
          <div className="login-popup-condition">
            <p className="forgot-password-link" onClick={() => setCurrState("Forgot Password")}>Forgot Password?</p>
          </div>
        )}

        {(currState === "Login" || currState === "Sign Up") && (
          <div className="google-login-container">
            <p>Or sign in with</p>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
                alert("Google Login Failed");
              }}
            />
          </div>
        )}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")} >Click Here </span></p>
          : currState === "Sign Up"
            ? <p>Already have an account? <span onClick={() => setCurrState("Login")} >Login Here</span></p>
            : <p>Back to Login? <span onClick={() => setCurrState("Login")} >Click Here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
