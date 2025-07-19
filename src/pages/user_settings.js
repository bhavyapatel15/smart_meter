import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/user_siderbar';
import UserTopbar from '../components/user_topbar';
import axios from 'axios';

const UserSettings = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    
    const demoUser = {
      email: 'user@example.com',
      phone: '9876543210',
    };
    setEmail(demoUser.email);
    setPhone(demoUser.phone);

  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    console.log({ email, phone });
    alert('Settings updated!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    console.log({ currentPassword, newPassword });
    alert('Password changed successfully!');
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-3">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <UserSidebar />
        </div>

        {/* Main content */}
        <div className="col-md-9">
          <UserTopbar />

          {/* Profile Info */}
          <div className="card shadow-sm p-4 mb-4">
            <h5 className="text-muted mb-3">Account Settings</h5>
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card shadow-sm p-4">
            <h5 className="text-muted mb-3">Change Password</h5>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning">Update Password</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserSettings;
