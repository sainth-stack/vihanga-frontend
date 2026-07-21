import React from 'react';
import Navbar from 'components/Navbar';
import './ErrorBoundary.scss';
import { getItemFromLocalStorage } from 'utilities/getLocalStorageItem';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Optionally log error to a service
    // console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  render() {
    let user = null;
    let privileges = null;
    let employeeId = '';
    try {
      user = getItemFromLocalStorage("user");
      privileges = getItemFromLocalStorage("privileges");
      employeeId = user && user._id ? user._id : '';
    } catch (e) {}

    // If user exists but privileges are undefined/null/empty, show error UI with Navbar
    if (user && (!privileges || privileges.length === 0)) {
      return (
        <>
          <Navbar />
          <div className="error-boundary-container">
            <div className="error-boundary-card">
              <div className="error-boundary-icon">
                <svg className="error-boundary-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="error-boundary-title">No Role Associated</h2>
              <p className="error-boundary-message">
                Employee ID <span className="error-boundary-empid">{employeeId}</span> is not associated with any role.<br />
                Please contact HR and re-login.
              </p>
              <button
                onClick={this.handleLogout}
                className="error-boundary-logout-btn"
              >
                Logout &amp; Re-Login
              </button>
            </div>
          </div>
        </>
      );
    }

    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <h2 className="error-boundary-title">Something went wrong.</h2>
            <button
              onClick={this.handleLogout}
              className="error-boundary-logout-btn"
            >
              Logout &amp; Re-Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
