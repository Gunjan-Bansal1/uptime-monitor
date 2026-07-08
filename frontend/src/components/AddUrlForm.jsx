import React, { useState } from 'react';
import { registerUrl } from '../services/api';

const AddUrlForm = ({ onUrlAdded }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('URL cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await registerUrl(trimmedUrl);
      setSuccess('URL registered successfully!');
      setUrl('');
      if (onUrlAdded) {
        onUrlAdded();
      }
    } catch (err) {
      // Fetch backend detail validation error messages
      const serverMessage = err.response?.data?.detail;
      
      if (Array.isArray(serverMessage)) {
        // Handle Pydantic array validation errors
        setError(serverMessage[0]?.msg || 'Invalid URL format.');
      } else if (typeof serverMessage === 'string') {
        setError(serverMessage);
      } else {
        setError('Failed to register URL. Please verify the URL format (e.g. https://example.com).');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
        Register URL
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url-input" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Target Website URL
          </label>
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-sm"
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        {success && (
          <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-900/50">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 text-sm"
        >
          {loading ? 'Adding...' : 'Add URL'}
        </button>
      </form>
    </div>
  );
};

export default AddUrlForm;

