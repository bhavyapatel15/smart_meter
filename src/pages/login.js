import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login success:", data);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('isLoggedIn', true);

        if (data.user.role === 'admin') {
          navigate('/admin_dashboard');
        } else {
          navigate('/user_dashboard');
        }

      } else {
        console.error("Login failed:", data.message);
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="py-3 py-md-5" style={{
      backgroundImage: `url("/images/bg.jpeg")`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh"
    }}>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
            <div className="p-4 p-md-5 rounded" style={{ backgroundColor: "transparent" }}>
              <div className="text-center mb-4">
                <img
                  src="/images/icon.png"
                  alt="Logo"
                  width="120"
                  height="120"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto"
                  }}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <h4 className="text-center text-white mb-4" style={{ fontFamily: "Times, 'Times New Roman', Georgia, serif" }}>Login</h4>
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label text-white">Email<span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label text-white">Password <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-key"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <button className="btn btn-primary btn-lg" type="submit">Log In</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
