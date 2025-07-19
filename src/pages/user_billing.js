import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/user_siderbar';
import UserTopbar from '../components/user_topbar';
import axios from 'axios';

const UserBilling = () => {
  const [bills, setBills] = useState([]);
  const [currentMonth, setCurrentMonth] = useState({ units: 0, amount: 0, dueDate: '' });

  useEffect(() => {
    // Demo billing data
    const demoBills = [
      {
        month: 'May 2025',
        units: 122,
        amount: 976,
        invoiceLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        month: 'Apr 2025',
        units: 110,
        amount: 880,
        invoiceLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        month: 'Mar 2025',
        units: 105,
        amount: 840,
        invoiceLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ];
    const demoCurrent = { units: 96, amount: 768, dueDate: '2025-06-15' };

    setBills(demoBills);
    setCurrentMonth(demoCurrent);

  }, []);

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

          {/* Current Billing Summary */}
          <div className="card shadow-sm p-4 mb-4">
            <h5 className="text-muted mb-3">Current Billing Summary</h5>
            <div className="row">
              <div className="col-md-4">
                <h6>Total Units</h6>
                <p className="fw-bold">{currentMonth.units} kWh</p>
              </div>
              <div className="col-md-4">
                <h6>Amount</h6>
                <p className="fw-bold text-success">₹{currentMonth.amount}</p>
              </div>
              <div className="col-md-4">
                <h6>Due Date</h6>
                <p className="fw-bold">{currentMonth.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Billing History Table */}
          <div className="card shadow-sm p-4">
            <h5 className="text-muted mb-3">Billing History</h5>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Units</th>
                  <th>Amount (₹)</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, idx) => (
                  <tr key={idx}>
                    <td>{bill.month}</td>
                    <td>{bill.units}</td>
                    <td>{bill.amount}</td>
                    <td>
                      <a
                        href={bill.invoiceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserBilling;
