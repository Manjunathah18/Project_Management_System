import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (res.data?.data?.resetUrl) {
        setResetUrl(res.data.data.resetUrl);
      }
      toast.success(res.data?.message || 'Password reset email sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    // If resetUrl is an absolute URL pointing to current origin or a relative path, get the path for React Router Link
    let relativeResetPath = null;
    if (resetUrl) {
      try {
        const urlObj = new URL(resetUrl);
        relativeResetPath = urlObj.pathname + urlObj.search;
      } catch (err) {
        relativeResetPath = resetUrl;
      }
    }

    return (
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset Request</h3>
        <p className="text-sm text-gray-500 mb-4">
          A password reset request was initiated for <span className="font-semibold text-gray-700">{email}</span>.
        </p>

        {relativeResetPath && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-md text-left">
            <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wide mb-1">
              Development Link:
            </p>
            <p className="text-xs text-indigo-600 mb-3">
              SMTP is in development mode. Click below to reset your password immediately:
            </p>
            <Link
              to={relativeResetPath}
              className="inline-block text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow-sm transition"
            >
              Reset Password Now &rarr;
            </Link>
          </div>
        )}

        <div className="mt-4">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Reset your password</h3>
        <p className="text-sm text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <div className="mt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
