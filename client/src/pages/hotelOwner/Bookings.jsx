import React, { useEffect, useState, useCallback } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import '../../styles/dashboard.css';
import { useAppContext } from '../../context/AppContext';
import ConfirmBookingModal from '../../components/hotelOwner/ConfirmBookingModal';
import CheckInEditForm from '../../components/hotelOwner/CheckInEditForm';
import { Trash2 } from 'lucide-react';

const toManilaDateTime = (date = new Date()) => {
  const manilaTime = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const year = manilaTime.getFullYear();
  const month = String(manilaTime.getMonth() + 1).padStart(2, "0");
  const day = String(manilaTime.getDate()).padStart(2, "0");
  const hours = String(manilaTime.getHours()).padStart(2, "0");
  const minutes = String(manilaTime.getMinutes()).padStart(2, "0");
  const seconds = String(manilaTime.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/* Normalize status from database format */
const normalizeStatus = (status) => {
  if (!status) return 'pending';
  const normalized = status.toLowerCase().replace(/-/g, '_').replace(/\s+/g, '_');
  // Map database values to normalized values
  if (normalized === 'pending') return 'pending';
  if (normalized === 'arrival') return 'arrival';
  if (normalized === 'check_in' || normalized === 'check-in') return 'check_in';
  if (normalized === 'check_out' || normalized === 'checked-out' || normalized === 'checked_out') return 'check_out';
  if (normalized === 'cancelled') return 'cancelled';
  return 'pending'; // default
};

/* Normalize payment status */
const normalizePaymentStatus = (paymentStatus) => {
  if (!paymentStatus) return 'not_paid';
  const normalized = paymentStatus.toLowerCase().replace(/\s+/g, '_');
  if (normalized === 'not_paid' || normalized === 'notpaid') return 'not_paid';
  if (normalized === 'paid') return 'paid';
  // Map old statuses to new ones
  if (normalized === 'pending') return 'not_paid';
  if (normalized === 'partial_payment' || normalized === 'partialpayment') return 'paid';
  if (normalized === 'payment_complete' || normalized === 'paymentcomplete' || normalized === 'completed') return 'paid';
  return 'not_paid';
};

const PAYMENT_STATUS_LABELS = {
  not_paid: 'Not paid',
  paid: 'Paid',
};

/* Map booking */
const mapBookingData = (b) => {

  const checkInTime = b.check_in_time || null; 
  const checkOutTime = b.check_out_time || null; 
  
  const normalizedPaymentStatus = normalizePaymentStatus(b.payment_status);
  const displayPaymentStatus = PAYMENT_STATUS_LABELS[normalizedPaymentStatus] || 'Pending';
  
  // Parse guests string to extract adults and children
  const guestsMatch = b.guests?.match(/Adult (\d+).*Child (\d+)/);
  const adults = guestsMatch ? parseInt(guestsMatch[1]) : 0;
  const children = guestsMatch ? parseInt(guestsMatch[2]) : 0;
  
  return {
    _id: String(b.booking_id ?? ''),
    bookingId: b.booking_id ?? '',
    guestName: b.guest_name ?? 'Guest',
    email: b.email ?? '',
    roomType: b.room_type ?? '—',
    roomNumber: b.room_number ?? '—',
    checkInDate: b.check_in ? new Date(b.check_in).toISOString().split('T')[0] : '',
    checkOutDate: b.check_out ? new Date(b.check_out).toISOString().split('T')[0] : '',
    checkInTime: checkInTime,
    checkOutTime: checkOutTime,
    guests: b.guests ?? '—',
    adults: adults,
    children: children,
    totalPrice: Number(b.total_price ?? 0),
    paymentStatus: displayPaymentStatus,
    status: normalizeStatus(b.booking_status),
    normalizedPaymentStatus,
    createdAt: b.created_at ?? '',
  };
};

/* Group bookings by guest, check-in, and check-out dates */
const groupBookings = (bookings) => {
  const groups = {};
  
  bookings.forEach(booking => {
    // Create a unique key for grouping: email + check-in + check-out
    const key = `${booking.email}_${booking.checkInDate}_${booking.checkOutDate}`;
    
    if (!groups[key]) {
      groups[key] = {
        primaryBooking: booking,
        bookings: [booking],
        bookingIds: [booking.bookingId],
        roomTypes: {},
        roomNumbers: [],
        totalAdults: 0,
        totalChildren: 0,
        totalPrice: 0,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        normalizedPaymentStatus: booking.normalizedPaymentStatus,
      };
    } else {
      groups[key].bookings.push(booking);
      groups[key].bookingIds.push(booking.bookingId);
    }
    
    // Aggregate room types
    const roomType = booking.roomType;
    if (roomType && roomType !== '—') {
      groups[key].roomTypes[roomType] = (groups[key].roomTypes[roomType] || 0) + 1;
    }
    
    // Aggregate room numbers
    if (booking.roomNumber && booking.roomNumber !== '—') {
      if (!groups[key].roomNumbers.includes(booking.roomNumber)) {
        groups[key].roomNumbers.push(booking.roomNumber);
      }
    }
    
    // Aggregate guests
    groups[key].totalAdults += booking.adults || 0;
    groups[key].totalChildren += booking.children || 0;
    
    // Aggregate total price
    groups[key].totalPrice += booking.totalPrice || 0;
    
    // Use the most recent status (or highest priority: pending < arrival < check-in)
    const statusPriority = { pending: 1, arrival: 2, check_in: 3, check_out: 4, cancelled: 0 };
    if (statusPriority[booking.status] > statusPriority[groups[key].status]) {
      groups[key].status = booking.status;
    }
    
    // Use the most recent payment status
    if (booking.normalizedPaymentStatus === 'paid') {
      groups[key].normalizedPaymentStatus = 'paid';
      groups[key].paymentStatus = 'Paid';
    }
  });
  
  // Convert groups to array and format display
  return Object.values(groups).map(group => {
    // Format room types: "2x Family Room" or "1x Family Room, 1x Deluxe Twin"
    const roomTypeParts = Object.entries(group.roomTypes).map(([type, count]) => {
      return `${count}x ${type}`;
    });
    const roomTypeDisplay = roomTypeParts.join(', ');
    
    // Format guests: "1A, 2A" or "Total: 3A"
    const guestParts = group.bookings.map(b => {
      const a = b.adults || 0;
      return `${a}A`;
    });
    const guestsDisplay = group.bookings.length > 1 
      ? `${guestParts.join(', ')} (Total: ${group.totalAdults}A)`
      : `Adult ${group.totalAdults} | Child ${group.totalChildren}`;
    
    // Format room numbers: "202, 203"
    const roomNumbersDisplay = group.roomNumbers.length > 0 
      ? group.roomNumbers.sort((a, b) => {
          const numA = parseInt(a) || 0;
          const numB = parseInt(b) || 0;
          return numA - numB;
        }).join(', ')
      : '—';
    
    return {
      ...group.primaryBooking,
      bookingIds: group.bookingIds,
      bookingCount: group.bookings.length,
      roomTypeDisplay: roomTypeDisplay || group.primaryBooking.roomType,
      roomNumbersDisplay: roomNumbersDisplay,
      guestsDisplay: guestsDisplay,
      totalAdults: group.totalAdults,
      totalChildren: group.totalChildren,
      totalPrice: group.totalPrice,
      status: group.status,
      paymentStatus: group.paymentStatus,
      normalizedPaymentStatus: group.normalizedPaymentStatus,
    };
  });
};


const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [checkOutFilter, setCheckOutFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, booking: null });
  
  // Checkout modal state
  const [checkoutModal, setCheckoutModal] = useState({ open: false, booking: null, pendingConfirm: false });
  
  // Check-in/Edit form state
  const [checkinForm, setCheckinForm] = useState({ open: false, booking: null, mode: 'checkin' });
  
  // Cancel confirmation modal state
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, booking: null });

  //API endpoints
  const BOOKINGS_API = 'https://rrh-backend.vercel.app/api/bookings/admin/all'; 
  const UPDATE_STATUS_API = 'https://rrh-backend.vercel.app/api/bookings/admin/update-status';
  const DELETE_BOOKING_API = 'https://rrh-backend.vercel.app/api/bookings/admin/delete'; 

  const { token: contextToken } = useAppContext();

  // fetch bookings - NO TOKEN REQUIRED for admin endpoints
  const refetch = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(BOOKINGS_API, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const arr = Array.isArray(json) ? json : (json.data ?? []);
      const mapped = arr.map(mapBookingData);
      const filtered = mapped.filter(b => b.status !== 'check_out' && b.status !== 'cancelled');
      // Group bookings by guest, check-in, and check-out dates
      const grouped = groupBookings(filtered);
      setBookings(grouped);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // filters
  useEffect(() => {
    const filtered = (bookings || []).filter(b => {
      const q = searchTerm.trim().toLowerCase();
      const roomTypeToSearch = (b.roomTypeDisplay || b.roomType || '').toLowerCase();
      const matchesSearch = !q || b.guestName.toLowerCase().includes(q) || roomTypeToSearch.includes(q);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesRoomType = roomTypeFilter === 'all' || (b.roomTypeDisplay || b.roomType) === roomTypeFilter;
      const matchesDate = !dateFilter || b.checkInDate === dateFilter;
      const matchesCheckOut = !checkOutFilter || b.checkOutDate === checkOutFilter;
      return matchesSearch && matchesStatus && matchesRoomType && matchesDate && matchesCheckOut;
    });
    setFilteredBookings(filtered);
    setPage(1);
  }, [bookings, searchTerm, statusFilter, roomTypeFilter, dateFilter, checkOutFilter]);

  // api action handler
  const handleBookingAction = async (booking, action) => {
    try {
      setActionLoading(true);
      let response;

      // Handle Confirm action - show confirmation modal with room assignment
      if (action === 'confirm') {
        // Open confirm modal
        setConfirmModal({ open: true, booking: booking });
        setActionLoading(false);
        return;
      }

      // Handle Cancel action
      if (action === 'cancel') {
        // Open cancel confirmation modal
        setCancelModal({ open: true, booking: booking });
        setActionLoading(false);
        return;
      }

      // Handle Check-in action - show check-in form
      if (action === 'checkin') {
        // Open check-in form
        setCheckinForm({ open: true, booking: booking, mode: 'checkin' });
        setActionLoading(false);
        return;
      }

      // Handle Edit action - show edit form
      if (action === 'edit') {
        // Open edit form
        setCheckinForm({ open: true, booking: booking, mode: 'edit' });
        setActionLoading(false);
        return;
      }

      // Handle Check-out action - just show confirmation
      if (action === 'checkout') {
        // Open checkout confirmation modal
        setCheckoutModal({ open: true, booking: booking, pendingConfirm: true });
        setActionLoading(false);
        return;
      }

      // Handle Delete action
      if (action === 'delete') {
        // Open delete confirmation modal
        setDeleteModal({ open: true, booking: booking });
        setActionLoading(false);
        return;
      }

      if (response) {
        const result = await response.json();
        if (result.success) {
          await refetch(); // Refresh bookings after action
        } else {
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)} failed: ` + (result.message || result.error));
        }
      }
    } catch (err) {
      console.error('Action error', err);
      alert('An error occurred. Check console.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirm = async () => {
    if (!cancelModal.booking) return;
    try {
      setActionLoading(true);

      // For grouped bookings, cancel all booking IDs in the group
      const bookingIds = cancelModal.booking.bookingIds || [cancelModal.booking.bookingId];
      
      // Cancel all bookings in the group
      const cancelPromises = bookingIds.map(bookingId => 
        fetch(UPDATE_STATUS_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            booking_id: bookingId,
            action: 'cancel',
          }),
        }).then(res => res.json())
      );

      const results = await Promise.all(cancelPromises);
      const allSuccess = results.every(r => r.success);
      
      if (allSuccess) {
        setCancelModal({ open: false, booking: null });
        await refetch();
      } else {
        const failedResults = results.filter(r => !r.success);
        alert('Some bookings failed to cancel: ' + failedResults.map(r => r.message || r.error).join(', '));
      }
    } catch (err) {
      console.error('Cancel error', err);
      alert('An error occurred while canceling bookings. Check console.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteModal.booking) return;
    try {
      setActionLoading(true);

      // For grouped bookings, delete all booking IDs in the group
      const bookingIds = deleteModal.booking.bookingIds || [deleteModal.booking.bookingId];
      
      // Delete all bookings in the group
      const deletePromises = bookingIds.map(bookingId => 
        fetch(DELETE_BOOKING_API, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            booking_id: bookingId,
          }),
        }).then(res => res.json())
      );

      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(r => r.success);
      
      if (allSuccess) {
        setDeleteModal({ open: false, booking: null });
        await refetch();
        alert('Booking(s) deleted successfully');
      } else {
        const failedResults = results.filter(r => !r.success);
        alert('Some bookings failed to delete: ' + failedResults.map(r => r.message || r.error).join(', '));
      }
    } catch (err) {
      console.error('Delete error', err);
      alert('An error occurred while deleting bookings. Check console.');
    } finally {
      setActionLoading(false);
    }
  };

  // Extract unique room types from grouped bookings (use primary booking's room type for filter)
  const roomTypes = Array.from(new Set(bookings.map(b => {
    // For grouped bookings, extract individual room types from roomTypeDisplay
    if (b.roomTypeDisplay && b.roomTypeDisplay.includes(',')) {
      return b.roomType; // Use primary room type for filter
    }
    return b.roomTypeDisplay || b.roomType;
  }))).filter(Boolean);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginatedBookings = (filteredBookings || []).slice((page - 1) * pageSize, page * pageSize);
  
  // Status Config
  const STATUS_CONFIG = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
    arrival: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Arrival' },
    check_in: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Check-in' },
    check_out: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Check-out' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
    // Legacy mappings
    confirmed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Arrival' },
    checked_in: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Check-in' },
    checked_out: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Check-out' },
  };

  const getStatusConfig = (b) => STATUS_CONFIG[b.status] || STATUS_CONFIG.confirmed;  

  // Subtle row background highlights by status
  const ROW_BG = {
    pending: 'bg-yellow-50',
    arrival: 'bg-green-50',
    check_in: 'bg-blue-50',
    check_out: 'bg-gray-50',
    cancelled: 'bg-red-50',
  };

  const getRowBgClass = (status) => ROW_BG[status] || '';

  return (
    <div className="w-full bg-white min-h-screen font-['Poppins']">
      <div className="max-w-7x2 mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Bookings Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all booking activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by guest name or room type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="arrival">Arrival</option>
                <option value="check_in">Check-in</option>
                <option value="check_out">Check-out</option>
                <option value="cancelled">Cancelled</option>
                <option value="checked_out">Checked-Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select value={roomTypeFilter} onChange={(e) => setRoomTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white">
                <option value="all">All Room Types</option>
                {roomTypes.map(rt => <option key={rt} value={rt}>{rt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
              <input type="date" value={checkOutFilter} onChange={(e) => setCheckOutFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"/>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500 text-sm">Loading bookings...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Booking ID</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-700">Guest Name</th>
                    <th className="py-4 px-4 text-left text-sm font-medium text-gray-700">Room Type</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Room No.</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Check-in</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Check-out</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Guests</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Total</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Payment</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Status</th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {paginatedBookings.map(b => {
                    const sConf = getStatusConfig(b);
                    const rowBg = getRowBgClass(b.status);
                    return (
                      <tr key={b._id} className={`${rowBg} hover:bg-gray-50 transition-colors`}>
                        <td className="py-4 px-4 text-center text-sm text-gray-900 font-mono">
                          #{String(b.bookingId).slice(-6)}
                          {b.bookingCount > 1 && (
                            <span className="ml-1 text-xs text-blue-600 font-semibold">+{b.bookingCount - 1} more</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-left text-sm text-gray-900">
                          <div className="font-medium">{b.guestName}</div>
                          {b.email && (
                            <div className="text-xs text-gray-500 mt-0.5">{b.email}</div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-left text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{b.roomTypeDisplay || b.roomType}</span>
                            {b.bookingCount > 1 && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                {b.bookingCount} rooms total
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-gray-900">{b.roomNumbersDisplay || b.roomNumber || '—'}</td>
                        <td className="py-4 px-4 text-center text-sm text-gray-900">
                          {b.checkInDate ? (
                            <>
                              <div>{new Date(b.checkInDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</div>
                              {b.checkInTime ? (
                                <div className="text-xs text-gray-600 mt-0.5 font-medium">
                                  {new Date(b.checkInTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 mt-0.5">—</div>
                              )}
                            </>
                          ) : (
                            <>
                              <div>—</div>
                              <div className="text-xs text-gray-500 mt-0.5">—</div>
                            </>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-gray-900">
                          {b.checkOutDate ? (
                            <>
                              <div>{new Date(b.checkOutDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</div>
                              {b.checkOutTime ? (
                                <div className="text-xs text-gray-600 mt-0.5 font-medium">
                                  {new Date(b.checkOutTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 mt-0.5">—</div>
                              )}
                            </>
                          ) : (
                            <>
                              <div>—</div>
                              <div className="text-xs text-gray-500 mt-0.5">—</div>
                            </>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-gray-900">{b.guestsDisplay || b.guests}</td>
                        <td className="py-4 px-4 text-center text-sm text-gray-900 font-semibold">₱{(b.totalPrice || 0).toLocaleString()}</td>
                        <td className="py-4 px-4 text-center text-sm text-gray-900">{b.paymentStatus}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${sConf.color}`}>{sConf.label}</span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-row gap-2 items-center justify-center flex-nowrap">
                            {/* Flow 1: Pending + Not paid -> Confirm & Cancel */}
                            {b.status === 'pending' && b.normalizedPaymentStatus === 'not_paid' && (
                              <>
                                <button
                                  onClick={() => handleBookingAction(b, 'confirm')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-green-400 text-xs font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'cancel')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'delete')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center justify-center px-3 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {/* Flow 2: Arrival + Paid -> Check-in & Cancel (also handle legacy 'confirmed' status) */}
                            {(b.status === 'arrival' || b.status === 'confirmed') && b.normalizedPaymentStatus === 'paid' && (
                              <>
                                <button
                                  onClick={() => handleBookingAction(b, 'checkin')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-blue-400 text-xs font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Check-in
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'cancel')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'delete')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center justify-center px-3 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {/* Flow 2b: Arrival + Not paid -> Check-in & Cancel (for bookings that were confirmed but payment status might not be updated) */}
                            {(b.status === 'arrival' || b.status === 'confirmed') && b.normalizedPaymentStatus === 'not_paid' && (
                              <>
                                <button
                                  onClick={() => handleBookingAction(b, 'checkin')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-blue-400 text-xs font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Check-in
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'cancel')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'delete')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center justify-center px-3 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {/* Flow 3: Check-in -> Check-out & Edit */}
                            {b.status === 'check_in' && (
                              <>
                                <button
                                  onClick={() => handleBookingAction(b, 'checkout')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-orange-400 text-xs font-medium rounded-lg text-orange-700 bg-white hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Check-out
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'edit')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-5 h-9 border border-blue-400 text-xs font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b, 'delete')}
                                  disabled={actionLoading}
                                  className="inline-flex items-center justify-center px-3 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {/* Flow 4: Check-out -> No actions (finished) */}
                            {b.status === 'check_out' && (
                              <span className="text-sm text-gray-500">—</span>
                            )}
                            {/* Cancelled -> No actions */}
                            {b.status === 'cancelled' && (
                              <span className="text-sm text-gray-500">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filteredBookings.length)} of {filteredBookings.length} bookings
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50">Previous</button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${pageNum === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

        {/* Confirm Booking Modal */}
        <ConfirmBookingModal
          isOpen={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, booking: null })}
          booking={confirmModal.booking}
          onConfirm={async () => {
            await refetch();
          }}
        />

        {/* Checkout Modal - Confirmation */}
        {checkoutModal.open && checkoutModal.pendingConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border text-center">
              <div className="mb-5">
                <h3 className="text-lg font-semibold mb-2">Check-out</h3>
                <div className="mb-1 text-gray-700">
                  <span className="font-semibold">{checkoutModal.booking?.guestName || ''}</span>
                  {checkoutModal.booking?.roomNumber && (
                    <>
                      <span> • Room {checkoutModal.booking.roomNumber}</span>
                      {checkoutModal.booking?.roomType && (
                        <span> ({checkoutModal.booking.roomType})</span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">Are you sure you want to check-out this guest?</p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={async () => {
                    setActionLoading(true);
                    try {
                      const autoDatetime = toManilaDateTime();
                      const response = await fetch(UPDATE_STATUS_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          booking_id: checkoutModal.booking.bookingId,
                          action: 'checkout',
                          datetime: autoDatetime,
                        }),
                      });
                      const result = await response.json();
                      if (result.success) {
                        await refetch();
                        setCheckoutModal({ open: false, booking: null, pendingConfirm: false });
                      } else {
                        alert(`Check-out failed: ${result.message}`);
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      alert(`Check-out failed: ${error.message}`);
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  className={`min-w-[120px] h-10 px-4 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Confirm'}
                </button>
                <button
                  onClick={() => setCheckoutModal({ open: false, booking: null, pendingConfirm: false })}
                  className="min-w-[100px] h-10 px-4 border border-gray-300 text-gray-700 text-sm rounded-lg bg-white hover:bg-gray-100 transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Check-in/Edit Form */}
        <CheckInEditForm
          isOpen={checkinForm.open}
          onClose={() => setCheckinForm({ open: false, booking: null, mode: 'checkin' })}
          booking={checkinForm.booking}
          mode={checkinForm.mode}
          onSave={async (formData) => {
            try {
              const autoDatetime = toManilaDateTime();
              const response = await fetch(UPDATE_STATUS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  booking_id: checkinForm.booking.bookingId,
                  action: checkinForm.mode === 'edit' ? 'checkin' : 'checkin',
                  datetime: autoDatetime,
                }),
              });
              const result = await response.json();
              if (result.success) {
                await refetch();
              } else {
                alert(`Failed: ${result.message}`);
              }
            } catch (error) {
              console.error('Error:', error);
              alert(`Failed: ${error.message}`);
            }
          }}
          onSendEmail={async (formData) => {
            // Send email with booking details
            try {
              // This will be handled by the backend when status changes
              alert('Email will be sent after confirmation');
            } catch (error) {
              console.error('Error sending email:', error);
            }
          }}
        />

        {/* Cancel Confirmation Modal */}
        {cancelModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border text-center">
              <div className="mb-5">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Cancel Booking</h3>
                <p className="text-sm text-gray-600 mb-4">Are you sure you want to cancel this booking?</p>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <div className="font-semibold">{cancelModal.booking?.guestName || ''}</div>
                  {cancelModal.booking?.roomNumber && (
                    <div className="text-xs text-gray-500 mt-1">
                      Room {cancelModal.booking.roomNumber} • {cancelModal.booking.roomType}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancelConfirm}
                  className={`min-w-[120px] h-10 px-4 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : 'Yes, Cancel'}
                </button>
                <button
                  onClick={() => setCancelModal({ open: false, booking: null })}
                  className="min-w-[100px] h-10 px-4 border border-gray-300 text-gray-700 text-sm rounded-lg bg-white hover:bg-gray-100 transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border text-center">
              <div className="mb-5">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <Trash2 className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Delete Booking</h3>
                <p className="text-sm text-gray-600 mb-4">Are you sure you want to permanently delete this booking? This action cannot be undone.</p>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <div className="font-semibold">{deleteModal.booking?.guestName || ''}</div>
                  {deleteModal.booking?.roomNumber && deleteModal.booking.roomNumber !== '—' && (
                    <div className="text-xs text-gray-500 mt-1">
                      Room {deleteModal.booking.roomNumber} • {deleteModal.booking.roomType}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  className={`min-w-[120px] h-10 px-4 bg-gray-700 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setDeleteModal({ open: false, booking: null })}
                  className="min-w-[100px] h-10 px-4 border border-gray-300 text-gray-700 text-sm rounded-lg bg-white hover:bg-gray-100 transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;