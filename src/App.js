// import necessary packages
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Container/Home";
import Login from "./Container/Login";
import { fetchUser, userAccessToken } from "./utils/fetchUser";

const App = () => {
  // state to monitor the user
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // if the user tries to access through url , restrict it
  // Check if user in LocalStorage has the access token  
  // allow him to Home Screen 
  // else re-route user to Login screen  
  useEffect(() => {
    const accessToken = userAccessToken();
    if (!accessToken) {
      // Get access token from UTILS--> fetchUser.js
      // if no access token navigate to login
      navigate("/login", { replace: true });
    } else {
      const [userInfo] = fetchUser();
      setUser(userInfo);
    }
  }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      {/* if the user successfully login it should load this particular element */}
      <Route path="/*" element={<Home user={user}  />} />
    </Routes>
  );
};

export default App;