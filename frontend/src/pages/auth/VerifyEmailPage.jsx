import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const VerifyEmailPage = () => {
  const { verificationToken } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${verificationToken}`);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };
    verify();
  }, [verificationToken]);

  return (
    <div className="text-center py-8">
      {status === 'verifying' && (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">Verifying your email...</h3>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center">
          <CheckCircle className="text-green-500 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link
            to="/login"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue to login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center">
          <XCircle className="text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Failed</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
