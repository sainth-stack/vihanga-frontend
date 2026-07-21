import React from 'react';
import Navbar from 'components/Navbar';

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
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  render() {
    // Get user and privileges from localStorage
    let user = null;
    let privileges = null;
    try {
      user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      privileges = localStorage.getItem('privileges') ? JSON.parse(localStorage.getItem('privileges')) : null;
    } catch (e) {
      // ignore
    }

    // If user exists but privileges are undefined/null/empty, show error UI with Navbar and logout
    if (user && (!privileges || privileges.length === 0)) {
      return (
        <>
          <Navbar />
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Error</h2>
                <p className="text-gray-600 mb-6">
                  No role associated with this employee ID. Contact HR for assistance.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:hr@company.com'}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  Contact HR
                </button>
                <button
                  onClick={this.handleLogout}
                  className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-md hover:bg-red-200 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
              {/* Development mode: Show error details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 p-4 bg-gray-100 rounded-md text-left">
                  <h3 className="font-semibold text-sm text-gray-700 mb-2">Error Details (Dev Mode):</h3>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && this.state.errorInfo.componentStack && (
                    <pre className="text-xs text-gray-500 mt-2 overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    // If a normal error occurred, show fallback error UI
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong.</h2>
            <button
              onClick={this.handleRetry}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-4"
            >
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md text-left">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Error Details (Dev Mode):</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && this.state.errorInfo.componentStack && (
                  <pre className="text-xs text-gray-500 mt-2 overflow-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Otherwise, render children
    return this.props.children;
  }
}

export default ErrorBoundary;
