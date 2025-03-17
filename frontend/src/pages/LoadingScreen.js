import React, { useState, useEffect } from "react";
import "./LoadingScreen.css";
import { useNavigate } from "react-router-dom";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      navigate("/welcome");
    }, 3000);
  }, []);

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="logo">Q</div>
          <p className="loading-text">Loading game please wait...</p>
        </div>
      )}
    </>
  );
};

export default LoadingScreen;
