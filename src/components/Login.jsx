import axios from "axios";
import { useRef, useState } from "react";
import "./Login.css";

export default function Login({ setShowLogin, setCurrentUsername, myStorage }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const users = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("/api/user/login", users);
      myStorage.setItem("users", res.data.username);
      console.log(res.data);
      setCurrentUsername(res.data.username);
      // close it and assign a new user
      setShowLogin(false);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <span>TravelPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <button
        className="mapbox-popup-close-button"
        type="button"
        aria-label="Close-Popup"
        area-hidden="true"
        onClick={() => {
          setShowLogin(false);
        }}
      >
        ✘
      </button>
    </div>
  );
}
