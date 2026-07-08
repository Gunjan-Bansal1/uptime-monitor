import React, { useState, useEffect } from 'react';
import { getUrls, deleteUrl } from '../services/api';
import { Trash2, AlertCircle, Clock, Globe, RefreshCw } from 'lucide-react';

const REFRESH_INTERVAL = 60000; // 60 seconds (matches backend scheduler)

const UrlTable = ({ refreshTrigger }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUrls = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError('');
      const response = await getUrls();
      setUrls(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch monitored URLs.');
      console.error(err);
    } finally {
      if (!isBackground) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    // Initial fetch on mount or manual triggers
    fetchUrls();
    
    // Reset countdown whenever refreshTrigger (manual add/delete) changes
    setCountdown(REFRESH_INTERVAL / 1000);

    // Single 1-second interval timer driving both the UI countdown and background fetch
    const timerId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchUrls(true); // Trigger silent background refresh
          return REFRESH_INTERVAL / 1000; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up the timer on unmount or refreshTrigger changes
    return () => clearInterval(timerId);
  }, [refreshTrigger]);

  const handleDelete = async (id, url) => {
    setDeleteError('');
    setDeleteSuccess('');

    if (!window.confirm(`Are you sure you want to stop monitoring and delete "${url}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteUrl(id);
      setDeleteSuccess(`Successfully deleted ${url}`);
      fetchUrls(); // Refresh the list

      // Auto-clear success banner after 3 seconds
      setTimeout(() => {
        setDeleteSuccess('');
      }, 3000);
    } catch (err) {
      const serverMessage = err.response?.data?.detail;
      setDeleteError(
        typeof serverMessage === 'string'
          ? serverMessage
          : 'Failed to delete URL. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "—";

    try {
      // SQLite returns UTC timestamps without timezone information.
      // Append "Z" so JavaScript treats them as UTC.
      const utcDate = new Date(
        isoString.endsWith("Z") ? isoString : `${isoString}Z`
      );

      return utcDate.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (err) {
      return "—";
    }
  };

  const formatUpdatedTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading monitored websites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-slate-800 dark:text-slate-200 font-semibold mb-1">Could not load targets</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{error}</p>
        <button
          onClick={fetchUrls}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm transition font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
        <Globe className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
        <p className="text-slate-800 dark:text-slate-200 font-bold mb-1">No URLs Monitored Yet</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
          Register a website URL using the form to start tracking its uptime, status, and response latency.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-4 lg:px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Monitored Targets</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live status and performance indicators</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Next refresh in: <span className="font-bold text-indigo-600 dark:text-indigo-400">{countdown}s</span></span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Updated {formatUpdatedTime(lastUpdated)}
          </p>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 mt-1">
            {urls.length} Total
          </span>
        </div>
      </div>

      {deleteSuccess && (
        <div className="mx-4 lg:mx-6 mt-4 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-900/50">
          {deleteSuccess}
        </div>
      )}

      {deleteError && (
        <div className="mx-4 lg:mx-6 mt-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50">
          {deleteError}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800/80">
              <th className="px-3 lg:px-4 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">URL</th>
              <th className="px-3 lg:px-4 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-3 lg:px-4 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Code</th>
              <th className="px-3 lg:px-4 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Response Time</th>
              <th className="px-3 lg:px-4 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Checked</th>
              <th className="px-3 lg:px-4 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {urls.map((urlObj) => {
              const check = urlObj.latest_check;
              const isDeleting = deletingId === urlObj.id;

              // Determine status styles
              let statusBadge = (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Clock className="w-3 h-3 animate-spin" />
                  Pending
                </span>
              );

              if (check) {
                if (check.is_up) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      UP
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      DOWN
                    </span>
                  );
                }
              }

              return (
                <tr key={urlObj.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition">
                  <td className="px-3 lg:px-4 py-4">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[120px] md:max-w-[180px] lg:max-w-[240px] xl:max-w-[400px]" title={urlObj.url}>
                      {urlObj.url}
                    </span>
                  </td>
                  <td className="px-3 lg:px-4 py-4">
                    {statusBadge}
                  </td>
                  <td className="px-3 lg:px-4 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-350 font-mono">
                      {check?.status_code ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 lg:px-4 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-350">
                      {check && check.response_time_ms !== null ? `${check.response_time_ms} ms` : '—'}
                    </span>
                  </td>
                  <td className="px-3 lg:px-4 py-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {check ? formatTimestamp(check.checked_at) : '—'}
                    </span>
                  </td>
                  <td className="px-3 lg:px-4 py-4 text-right">
                    <button
                      onClick={() => handleDelete(urlObj.id, urlObj.url)}
                      disabled={isDeleting}
                      className={`p-1.5 rounded-lg transition ${
                        isDeleting
                          ? 'text-slate-300 dark:text-slate-650 cursor-wait'
                          : 'text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }`}
                      title={isDeleting ? 'Deleting...' : 'Delete website target'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrlTable;
