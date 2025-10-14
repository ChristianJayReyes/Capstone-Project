import React, { useState, useMemo, useEffect } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';

// Load logs from backend

const STATUS_CONFIG = {
  Completed: { 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: '✅',
    label: 'Completed'
  },
  Canceled: { 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: '❌',
    label: 'Canceled'
  },
  'No-Show': { 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: '💤',
    label: 'No-Show'
  },
  'Checked-In': { 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '🔵',
    label: 'Checked-In'
  },
  Pending: { 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: '⏳',
    label: 'Pending'
  },
};

const ROOM_TYPES = ['All', 'Deluxe', 'Standard', 'Suite'];
const STATUS_OPTIONS = ['All', 'Completed', 'Canceled', 'No-Show', 'Checked-In', 'Pending'];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const BookingLogs = () => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/booking-logs');
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map((l, idx) => ({
          id: l.log_id ?? idx,
          logId: String(l.log_id ?? idx),
          bookingId: String(l.booking_id ?? ''),
          guestName: l.guest_name ?? 'Guest',
          guestEmail: l.guest_email ?? '',
          guestPhone: l.guest_phone ?? '',
          room: l.room_number ? `#${l.room_number}` : '-',
          roomType: l.room_type ?? '',
          checkIn: l.check_in_date ?? '',
          checkOut: l.check_out_date ?? '',
          status: (l.booking_status || 'Pending').toString().replace(/\b\w/g, c => c.toUpperCase()),
          actionBy: l.admin_name || 'System',
          timestamp: l.timestamp,
          paymentStatus: '',
          amount: l.total_price ? `₱${l.total_price}` : '',
          specialRequests: '',
        }));
        setLogs(mapped);
      } catch (e) {
        console.error('Failed to load logs', e);
        setLogs([]);
      }
    };
    fetchLogs();
  }, []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    let filtered = logs.filter(log => {
      const matchesSearch = 
        log.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        log.guestName.toLowerCase().includes(search.toLowerCase()) ||
        log.room.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
      const matchesRoomType = roomTypeFilter === 'All' || log.roomType === roomTypeFilter;
      
      const matchesDateRange = 
        (!dateRange.start && !dateRange.end) ||
        (!dateRange.start && new Date(log.checkIn) <= new Date(dateRange.end)) ||
        (!dateRange.end && new Date(log.checkIn) >= new Date(dateRange.start)) ||
        (new Date(log.checkIn) >= new Date(dateRange.start) && new Date(log.checkIn) <= new Date(dateRange.end));
      
      return matchesSearch && matchesStatus && matchesRoomType && matchesDateRange;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'timestamp' || sortField === 'checkIn' || sortField === 'checkOut') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [logs, search, statusFilter, roomTypeFilter, dateRange, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const handleExport = () => {
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter !== 'All') params.append('status', statusFilter);
    if (roomTypeFilter !== 'All') params.append('room_type', roomTypeFilter);
    if (dateRange.start) params.append('date_from', dateRange.start);
    if (dateRange.end) params.append('date_to', dateRange.end);
    
    // Open export URL
    window.open(`/api/booking_logs/export?${params.toString()}`, '_blank');
  };

  const openDetailsModal = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedLog(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-4">
        {/* Page Header */}
        <div className="mb-8">
          {/* Title and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Booking Logs</h1>
              <p className="text-gray-600 mt-1">Manage and track all booking activities</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Box */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by booking ID, guest name, or room number..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Room Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={roomTypeFilter}
                onChange={e => { setRoomTypeFilter(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ROOM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => { setDateRange(prev => ({ ...prev, start: e.target.value })); setPage(1); }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => { setDateRange(prev => ({ ...prev, end: e.target.value })); setPage(1); }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Page Size Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logs per Page</label>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filteredLogs.length)} of {filteredLogs.length} logs
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('logId')}>
                  <div className="flex items-center gap-2">
                    Log ID
                    {sortField === 'logId' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('bookingId')}>
                  <div className="flex items-center gap-2">
                    Booking ID
                    {sortField === 'bookingId' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('guestName')}>
                  <div className="flex items-center gap-2">
                    Guest Name
                    {sortField === 'guestName' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">Room</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('checkIn')}>
                  <div className="flex items-center gap-2">
                    Check-In
                    {sortField === 'checkIn' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('checkOut')}>
                  <div className="flex items-center gap-2">
                    Check-Out
                    {sortField === 'checkOut' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">Action By</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('timestamp')}>
                  <div className="flex items-center gap-2">
                    Timestamp
                    {sortField === 'timestamp' && (
                      <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">No logs found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-600 font-mono">{log.logId}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {log.bookingId}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">{log.guestName}</div>
                        <div className="text-xs text-gray-500">{log.guestEmail}</div>
                        <div className="text-xs text-gray-500">{log.guestPhone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{log.room}</div>
                        <div className="text-xs text-gray-500">{log.roomType}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{formatDate(log.checkIn)}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{formatDate(log.checkOut)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[log.status]?.color}`}>
                        <span>{STATUS_CONFIG[log.status]?.icon}</span>
                        {STATUS_CONFIG[log.status]?.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{log.actionBy}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{formatDateTime(log.timestamp)}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => openDetailsModal(log)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filteredLogs.length)} of {filteredLogs.length} logs
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Booking ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.bookingId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Log ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.logId}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guest Information</label>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-900"><strong>Name:</strong> {selectedLog.guestName}</p>
                    <p className="text-sm text-gray-900"><strong>Email:</strong> {selectedLog.guestEmail}</p>
                    <p className="text-sm text-gray-900"><strong>Phone:</strong> {selectedLog.guestPhone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Room</label>
                    <p className="text-sm text-gray-900">{selectedLog.room}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Room Type</label>
                    <p className="text-sm text-gray-900">{selectedLog.roomType}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedLog.checkIn)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedLog.checkOut)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[selectedLog.status]?.color}`}>
                      <span>{STATUS_CONFIG[selectedLog.status]?.icon}</span>
                      {STATUS_CONFIG[selectedLog.status]?.label}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <p className="text-sm text-gray-900">{selectedLog.paymentStatus}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-sm text-gray-900 font-semibold">${selectedLog.amount}</p>
                </div>
                
                {selectedLog.specialRequests && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                    <p className="text-sm text-gray-900">{selectedLog.specialRequests}</p>
                  </div>
                )}
                
                {selectedLog.cancellationReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cancellation Reason</label>
                    <p className="text-sm text-gray-900">{selectedLog.cancellationReason}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action By</label>
                    <p className="text-sm text-gray-900">{selectedLog.actionBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedLog.timestamp)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end p-6 border-t border-gray-200">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLogs;
