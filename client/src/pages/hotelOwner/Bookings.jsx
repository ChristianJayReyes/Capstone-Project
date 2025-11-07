import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import '../../styles/dashboard.css';

/* Map booking row from backend to UI-friendly shape */
const mapBookingData = (b) => {
  return {
    _id: String(b.booking_id ?? ''),
    bookingId: b.booking_id ?? '',
    guestName: b.guest_name ?? 'Guest',
    email: b.email ?? '',
    roomType: b.room_type ?? '—',
    roomNumber: b.room_number ?? '—',
    checkInDate: b.check_in ? new Date(b.check_in).toISOString().split('T')[0] : '',
    checkOutDate: b.check_out ? new Date(b.check_out).toISOString().split('T')[0] : '',
    guests: b.guests ?? '—',
    totalPrice: Number(b.total_price ?? 0),
    paymentStatus: b.payment_status ?? 'Reserved',
    status: b.booking_status ?? 'Pending',
    createdAt: b.created_at ?? '',
  };
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

  



  // Check-in/out modal state
  const [timeModal, setTimeModal] = useState({ open: false, booking: null, mode: 'checkin', value: '', pendingConfirm: false });

  // API endpoints
  const BOOKINGS_API = 'http://localhost:8000/api/bookings/getBookings.php';
  const UPDATE_STATUS_API = 'http://localhost:8000/api/bookings/updateBookingStatus.php';

  // fetch bookings
  const refetch = async () => {
  try {
    setLoading(true);
    const res = await fetch(BOOKINGS_API);
    const json = await res.json();
    const arr = Array.isArray(json) ? json : (json.data ?? []);
    const mapped = arr.map(mapBookingData);
    setBookings(mapped.filter(b => b.status !== 'checked_out'));
  } catch (err) {
    console.error('Failed to fetch bookings', err);
    setBookings([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    refetch();
  }, []);

  // filters
  useEffect(() => {
    const filtered = (bookings || []).filter(b => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || b.guestName.toLowerCase().includes(q) || b.roomType.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesRoomType = roomTypeFilter === 'all' || b.roomType === roomTypeFilter;
      const matchesDate = !dateFilter || b.checkInDate === dateFilter;
      const matchesCheckOut = !checkOutFilter || b.checkOutDate === checkOutFilter;
      return matchesSearch && matchesStatus && matchesRoomType && matchesDate && matchesCheckOut;
    });
    setFilteredBookings(filtered);
    setPage(1);
  }, [bookings, searchTerm, statusFilter, roomTypeFilter, dateFilter, checkOutFilter]);

  // api action handler
  const handleBookingAction = async (booking, action, extra = {}) => {
    try {
      // CONFIRM booking
      if (action === 'confirm') {
        if (!window.confirm(`Confirm booking for ${booking.user.username}?`)) return;
        const response = await fetch(UPDATE_STATUS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: booking.bookingId,
            action: 'confirm',
            admin_id: 1
          })
        });
        const result = await response.json();
        if (result.success) {
          alert('Booking confirmed.');
          await refetch();
        } else {
          alert('Confirm failed: ' + (result.message || result.error || 'unknown'));
        }
        return;
      }

      // CANCEL
      if (action === 'cancel') {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        const response = await fetch(UPDATE_STATUS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: booking.bookingId,
            action: 'cancel',
            admin_id: 1
          })
        });
        const result = await response.json();
        if (result.success) {
          alert('Booking cancelled.');
          await refetch();
        } else {
          alert('Cancel failed: ' + (result.message || result.error || 'unknown'));
        }
        return;
      }

      // OPEN time modal (checkin/checkout)
      if (action === 'openTimeModal') {
        setTimeModal({ open: true, booking, mode: extra.mode, value: '' });
        return;
      }

      // DO CHECKIN
      if (action === 'doCheckin') {
        const timeValue = extra.value || timeModal.value || new Date().toISOString();
        const response = await fetch(UPDATE_STATUS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: booking.bookingId,
            action: 'checkin',
            admin_id: 1,
            time: timeValue
          })
        });
        const result = await response.json();
        if (result.success) {
          alert('Checked in.');
          setTimeModal({ open: false, booking: null, mode: 'checkin', value: '' });
          await refetch();
        } else {
          alert('Check-in failed: ' + (result.message || result.error || 'unknown'));
        }
        return;
      }

      // DO CHECKOUT
      if (action === 'doCheckout') {
        const timeValue = extra.value || timeModal.value || new Date().toISOString();
        const response = await fetch(UPDATE_STATUS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: booking.bookingId,
            action: 'checkout',
            admin_id: 1,
            time: timeValue
          })
        });
        const result = await response.json();
        if (result.success) {
          alert('Checked out.');
          setTimeModal({ open: false, booking: null, mode: 'checkout', value: '' });
          await refetch();
        } else {
          alert('Check-out failed: ' + (result.message || result.error || 'unknown'));
        }
        return;
      }
    } catch (err) {
      console.error('action error', err);
      alert('An error occurred. Check console.');
    }
  };

  const roomTypes = Array.from(new Set(bookings.map(b => b.roomType))).filter(Boolean);


  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginatedBookings = (filteredBookings || []).slice((page - 1) * pageSize, page * pageSize);
  
  const STATUS_CONFIG = {
    confirmed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Confirmed' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
    'no-show': { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'No-Show' },
    'checked_in': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Checked-In' },
    'checked_out': { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Checked-Out' }
  };
  const getStatusConfig = (b) => STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;

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
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked-In</option>
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
                  return (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-center text-sm text-gray-900 font-mono">#{String(b._id).slice(-6)}</td>
                      <td className="py-4 px-4 text-left text-sm text-gray-900">{b.guestName}</td>
                      <td className="py-4 px-4 text-left text-sm text-gray-900">{b.roomType}</td>

                      <td className="py-4 px-4 text-center text-sm text-gray-900">{b.roomNumber || '—'}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-900">{b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : '—'}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-900">{b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : '—'}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-900">{b.guests}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-900 font-semibold">₱{(b.totalPrice || 0).toLocaleString()}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-900">{b.paymentStatus}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${sConf.color}`}>{sConf.label}</span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-row gap-2 items-center justify-center flex-nowrap">
                          {/* Confirmed -> Check-in & Cancel */}
                          {b.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(b, 'openTimeModal', { mode: 'checkin' })}
                                className="inline-flex items-center px-5 h-9 border border-blue-400 text-xs font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                              >
                                Check-in
                              </button>
                              <button
                                onClick={() => handleBookingAction(b, 'cancel')}
                                className="inline-flex items-center px-5 h-9 border border-transparent text-xs font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {/* Checked-in -> Check-out */}
                          {b.status === 'checked_in' && (
                            <button
                              onClick={() => handleBookingAction(b, 'openTimeModal', { mode: 'checkout' })}
                              className="inline-flex items-center px-5 h-9 border border-orange-400 text-xs font-medium rounded-lg text-orange-700 bg-white hover:bg-orange-50 transition-colors"
                            >
                              Check-out
                            </button>
                          )}
                          {/* Cancelled -> nothing or dash */}
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

        {/* Time modal (blur overlay, 2-step confirmation) */}
        {timeModal.open && !timeModal.pendingConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-white/70">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border animate-fade-in">
              <h3 className="text-lg font-semibold mb-3">{timeModal.mode === 'checkin' ? 'Check-in' : 'Check-out'} time</h3>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Pick date & time</label>
                <input type="datetime-local" value={timeModal.value} onChange={(e) => setTimeModal(m => ({ ...m, value: e.target.value }))} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => setTimeModal({ open: false, booking: null, mode: 'checkin', value: '' })} className="min-w-[100px] h-10 px-4 border border-gray-300 text-gray-700 text-sm rounded-lg bg-white hover:bg-gray-100 transition-colors">Cancel</button>
                <button
                  onClick={() => setTimeModal(m => ({ ...m, pendingConfirm: true }))}
                  className={`min-w-[100px] h-10 px-4 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700`}
                  disabled={!timeModal.value}
                >OK</button>
              </div>
            </div>
          </div>
        )}
        {/* Confirmation for check-in/out time (with blur) */}
        {timeModal.open && timeModal.pendingConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-white/70">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border animate-fade-in text-center">
              <div className="mb-5">
                <h3 className="text-lg font-semibold mb-2">Confirm {timeModal.mode === 'checkin' ? 'Check-in' : 'Check-out'}</h3>
                <div className="mb-1 text-gray-700">
                  <span className="font-semibold">{timeModal.booking?.guestName || ''}</span>
{timeModal.booking?.roomNumber && (
  <>
    <span> • Room {timeModal.booking.roomNumber}</span>
    {timeModal.booking?.roomType ? (
      <span> ({timeModal.booking.roomType})</span>
    ) : null}
  </>
)}
                </div>
                <div className="text-sm">
                  {timeModal.mode === 'checkin' ? 'Check-in' : 'Check-out'} date & time:
                  <span className="ml-1 font-semibold">{timeModal.value ? new Date(timeModal.value).toLocaleString() : ''}</span>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setTimeModal({ open: false, booking: null, mode: 'checkin', value: '' })}
                  className="min-w-[100px] h-10 px-4 border border-gray-300 text-gray-700 text-sm rounded-lg bg-white hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleBookingAction(timeModal.booking, timeModal.mode === 'checkin' ? 'doCheckin' : 'doCheckout', { value: timeModal.value });
                    setTimeModal({ open: false, booking: null, mode: 'checkin', value: '', pendingConfirm: false });
                  }}
                  className={`min-w-[120px] h-10 px-4 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700`}
                >
                  Confirm
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