import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z][A-Za-z\s]*$/.test(formData.name.trim())) {
    alert('Enter a valid name. It should not start with a number and must contain only alphabets.');
    return;
    }
    
    if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
      alert('Enter a valid 10-digit phone number starting with 6, 7, 8, or 9.');
      return;
    }

    const addressParts = formData.address.split(',').map(part => part.trim());
    const addressObj = {
      street: addressParts[0] || '',
      city: addressParts[1] || '',
      state: addressParts[2] || '',
      pincode: addressParts[3] || ''
    };

    const payload = {
      ...formData,
      address: addressObj,
      meters: []
    };

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/bg1.jpeg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <h3 className="text-center mb-4">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="^[6-9][0-9]{9}$"
              maxLength="10"
              title="Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address (street, city, state, pincode)</label>
            <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
            />
            </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
