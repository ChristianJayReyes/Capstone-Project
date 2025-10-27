
import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import '../../styles/dashboard.css';

/* Map booking row from backend to UI-friendly shape */
const mapBookingData = (b) => {
  const checkIn = b.check_in ?? b.check_in_date ?? null;
  const checkOut = b.check_out ?? b.check_out_date ?? null;
  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  const status = String(b.status ?? '').toLowerCase();
  const paymentStatus = (b.payment_status ?? '').toLowerCase()
    || (['confirmed', 'checked-in', 'checked-out'].includes(status) ? 'reserved' : 'not-paid');

  return {
    raw: b,
    _id: String(b.booking_id ?? ''),
    bookingId: b.booking_id ?? '',
    user: {
      username: b.full_name ?? (b.username ?? 'Guest'),
      email: b.email ?? '',
      phone: b.phone ?? ''
    },
    room: {
      roomType: b.type_name ?? b.type ?? 'Room',
      pricePerNight: Number(b.price_per_night ?? b.price ?? 0),
      roomTypeId: b.room_type_id ?? b.room_type ?? null
    },
    checkInDate: checkInDate ? checkInDate.toISOString().split('T')[0] : '',
    checkInTime: checkInDate ? checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    checkOutDate: checkOutDate ? checkOutDate.toISOString().split('T')[0] : '',
    checkOutTime: checkOutDate ? checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    guests: b.guests ?? 1,
    totalPrice: Number(b.total_price ?? b.total ?? 0),
    status,
    paymentStatus,
    isPaid: ['paid', 'reserved'].includes(paymentStatus),
    createdAt: b.created_at ?? new Date().toISOString(),
    roomNumber: b.room_number ?? b.room_number ?? '',
    assignedRoomId: b.room_id ?? b.assigned_room_id ?? null
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

  // Rooms modal state
  const [roomsModalOpenFor, setRoomsModalOpenFor] = useState(null); // booking object or null
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Confirm modal (double-check before confirming a room)
  const [confirmModalBooking, setConfirmModalBooking] = useState(null);

  // Check-in/out modal state
  const [timeModal, setTimeModal] = useState({ open: false, booking: null, mode: 'checkin', value: '' });

  // API endpoints
  const BOOKINGS_API = 'http://localhost:8000/api/bookings/getBookings.php';
  const ROOMS_AVAILABLE_API = 'http://localhost:8000/api/rooms/getAvailableRooms.php';
  const UPDATE_STATUS_API = 'http://localhost:8000/api/bookings/updateBookingStatus.php';
  const UPDATE_PAYMENT_API = 'http://localhost:8000/api/bookings/updatePayment.php';

  // fetch bookings
  const refetch = async () => {
    try {
      const res = await fetch(BOOKINGS_API);
      const json = await res.json();
      const arr = Array.isArray(json) ? json : (json.data ?? []);
      const mapped = arr.map(mapBookingData);
      setBookings(mapped);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
      setBookings([]);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  // filters
  useEffect(() => {
    const filtered = (bookings || []).filter(b => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || b.user.username.toLowerCase().includes(q) || b.room.roomType.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesRoomType = roomTypeFilter === 'all' || b.room.roomType === roomTypeFilter;
      const matchesDate = !dateFilter || b.checkInDate === dateFilter;
      const matchesCheckOut = !checkOutFilter || b.checkOutDate === checkOutFilter;
      return matchesSearch && matchesStatus && matchesRoomType && matchesDate && matchesCheckOut;
    });
    setFilteredBookings(filtered);
    setPage(1);
  }, [bookings, searchTerm, statusFilter, roomTypeFilter, dateFilter, checkOutFilter]);

  // load available rooms for a booking
  const loadAvailableRooms = async (booking) => {
    setAvailableRooms([]);
    setSelectedRoomId(null);

    try {
      const rtId = booking.room.roomTypeId ?? booking.raw.room_type_id;
      const url = new URL(ROOMS_AVAILABLE_API);
      if (rtId) url.searchParams.set('room_type_id', rtId);
      if (booking.checkInDate) url.searchParams.set('check_in', booking.checkInDate);
      if (booking.checkOutDate) url.searchParams.set('check_out', booking.checkOutDate);

      const res = await fetch(url.toString());
      const json = await res.json();
      const arr = Array.isArray(json) ? json : (json.data ?? json.rooms ?? []);
      setAvailableRooms(arr);
    } catch (err) {
      console.error('Failed to load available rooms', err);
      setAvailableRooms([]);
    }
  };

  // api action handler
  const handleBookingAction = async (booking, action, extra = {}) => {
    try {
      // OPEN ROOMS modal
      if (action === 'openRooms') {
        setRoomsModalOpenFor(booking);
        await loadAvailableRooms(booking);
        return;
      }

      // OPEN confirm modal
      if (action === 'confirm') {
        if (!selectedRoomId) {
          alert('Please select a room first.');
          return;
        }
        setConfirmModalBooking({ booking, room_id: selectedRoomId });
        return;
      }

      // DO confirm (sends booking_id + room_id + action=confirm)
      if (action === 'doConfirm') {
        const response = await fetch(UPDATE_STATUS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: booking.bookingId,
            action: 'confirm',
            room_id: extra.room_id,
            admin_id: 1
          })
        });
        const result = await response.json();
        if (result.success) {
          alert('Booking confirmed.');
          setRoomsModalOpenFor(null);
          setConfirmModalBooking(null);
          setSelectedRoomId(null);
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

  // UI helpers
  const roomTypes = Array.from(new Set(bookings.map(b => b.room.roomType))).filter(Boolean);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginatedBookings = (filteredBookings || []).slice((page - 1) * pageSize, page * pageSize);

  const STATUS_CONFIG = {
    confirmed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Confirmed' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
    'no-show': { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'No-Show' },
    'checked-in': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Checked-In' },
    'checked-out': { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Checked-Out' }
  };
  const getStatusConfig = (b) => STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;

  return (
    <div className="w-full bg-white min-h-screen font-['Poppins']">
      <div className="max-w-7xl mx-auto p-6">
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
                <option value="checked-in">Checked-In</option>
                <option value="checked-out">Checked-Out</option>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Booking ID</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Guest Name</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room Type</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room No.</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Check-in</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Check-out</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Guests</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Total</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Payment</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedBookings.map(b => {
                  const sConf = getStatusConfig(b);
                  return (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-900 font-mono">#{String(b._id).slice(-6)}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{b.user.username}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{b.room.roomType}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{b.roomNumber || '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : '—'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{b.guests} {b.guests === 1 ? 'Adult' : 'Adults'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-semibold">₱{(b.totalPrice || 0).toLocaleString()}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{b.paymentStatus}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${sConf.color}`}>{sConf.label}</span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 flex-wrap">

                          {/* Pending -> Rooms & Cancel */}
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(b, 'openRooms')}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Rooms
                              </button>
                              <button
                                onClick={() => handleBookingAction(b, 'cancel')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                                Cancel
                              </button>
                            </>
                          )}

                          {/* Confirmed -> Check-in & Cancel */}
                          {b.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(b, 'openTimeModal', { mode: 'checkin' })}
                                className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                                Check-in
                              </button>
                              <button
                                onClick={() => handleBookingAction(b, 'cancel')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                                Cancel
                              </button>
                            </>
                          )}

                          {/* Checked-in -> Check-out (still allow cancel if you want) */}
                          {b.status === 'checked-in' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(b, 'openTimeModal', { mode: 'checkout' })}
                                className="inline-flex items-center px-3 py-1 border border-orange-300 text-xs font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100">
                                Check-out
                              </button>
                              <button
                                onClick={() => handleBookingAction(b, 'cancel')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                                Cancel
                              </button>
                            </>
                          )}

                          {/* Cancelled/Checked-out -> maybe show receipt or nothing */}
                          {(b.status === 'cancelled' || b.status === 'checked-out') && (
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

        {/* Rooms Modal */}
        {roomsModalOpenFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Available Rooms for {roomsModalOpenFor.room.roomType}</h3>
                <button onClick={() => { setRoomsModalOpenFor(null); setAvailableRooms([]); setSelectedRoomId(null); }} className="text-gray-500">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-auto mb-4">
                {availableRooms.length === 0 && <div className="text-sm text-gray-500">No rooms available</div>}
                {availableRooms.map(r => (
                  <div key={r.room_id} className={`p-3 border rounded-md flex justify-between items-center ${selectedRoomId === r.room_id ? 'ring-2 ring-green-300 bg-green-50' : ''}`}>
                    <div>
                      <div className="font-medium">{r.room_number}</div>
                      <div className="text-sm text-gray-600">₱{(r.price_per_night ?? r.price ?? 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{(r.capacity_adults ?? r.capacity) || 1} adults</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {selectedRoomId === r.room_id ? (
                        <button onClick={() => setSelectedRoomId(null)} className="px-2 py-1 text-xs border rounded bg-red-100">Remove</button>
                      ) : (
                        <button onClick={() => setSelectedRoomId(r.room_id)} className="px-2 py-1 text-xs border rounded bg-green-100">Select</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => { setRoomsModalOpenFor(null); setSelectedRoomId(null); setAvailableRooms([]); }} className="px-4 py-2 border rounded">Close</button>
                <button disabled={!selectedRoomId} onClick={() => handleBookingAction(roomsModalOpenFor, 'confirm')}
                  className={`px-4 py-2 rounded ${selectedRoomId ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  Proceed to Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm modal */}
        {confirmModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-medium mb-3">Confirm Booking</h3>
              <p className="text-sm text-gray-700 mb-4">
                Confirm booking <strong>#{confirmModalBooking.booking.bookingId}</strong> and assign Room ID <strong>{confirmModalBooking.room_id}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmModalBooking(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={() => handleBookingAction(confirmModalBooking.booking, 'doConfirm', { room_id: confirmModalBooking.room_id })}
                  className="px-4 py-2 bg-green-600 text-white rounded">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Time modal (check-in / check-out) */}
        {timeModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-medium mb-3">{timeModal.mode === 'checkin' ? 'Check-in' : 'Check-out'} time</h3>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Pick date & time</label>
                <input type="datetime-local" value={timeModal.value} onChange={(e) => setTimeModal(m => ({ ...m, value: e.target.value }))} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setTimeModal({ open: false, booking: null, mode: 'checkin', value: '' })} className="px-4 py-2 border rounded">Cancel</button>
                {timeModal.mode === 'checkin' ? (
                  <button onClick={() => handleBookingAction(timeModal.booking, 'doCheckin', { value: timeModal.value })} className="px-4 py-2 bg-blue-600 text-white rounded">OK</button>
                ) : (
                  <button onClick={() => handleBookingAction(timeModal.booking, 'doCheckout', { value: timeModal.value })} className="px-4 py-2 bg-orange-600 text-white rounded">OK</button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Bookings;
