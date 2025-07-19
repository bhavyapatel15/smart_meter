import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper text-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black px-4 py-3">
        <span className="navbar-brand fw-bold fs-4">Smart Metering</span>
        <div className="ms-auto">
          <button onClick={() => navigate("/login")} className="btn btn-outline-light me-2">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="btn btn-primary">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section d-flex flex-column justify-content-center align-items-center text-center px-3">
        <h1 className="display-4 fw-bold mb-3">Smart Utility Monitoring</h1>
        <p className="lead mb-4">
          Track electricity, water, and gas usage in real time with powerful analytics.
        </p>
        <div>
          <button onClick={() => navigate("/login")} className="btn btn-outline-light btn-lg me-3">
            Get Started
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-auto py-3 small text-white">
        &copy; {new Date().getFullYear()} Smart Metering System
      </footer>
    </div>
  );
}

export default Home;
