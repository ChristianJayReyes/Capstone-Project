import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await fetch('/api/guests');
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map((g) => ({
          id: g.guest_id ?? g.user_id ?? g.id,
          name: g.name ?? 'Guest',
          email: g.email ?? '',
          phone: g.phone ?? '',
          totalBookings: g.total_bookings ?? 0,
          lastBooking: g.last_stay ?? null,
          bookings: [],
        }));
        setGuests(mapped);
      } catch (e) {
        console.error('Failed to load guests', e);
        setGuests([]);
      }
    };
    fetchGuests();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // newest | oldest
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredGuests = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const base = guests.filter((guest) => {
      const match =
        guest.name.toLowerCase().includes(q) ||
        guest.email.toLowerCase().includes(q) ||
        guest.phone.toLowerCase().includes(q);
      if (!match) return false;

      return true;
    });

    const sorted = [...base].sort((a, b) => {
      const aDate = a.lastBooking ? new Date(a.lastBooking).getTime() : 0;
      const bDate = b.lastBooking ? new Date(b.lastBooking).getTime() : 0;
      return sortOrder === 'newest' ? bDate - aDate : aDate - bDate;
    });

    return sorted;
  }, [guests, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedGuests = filteredGuests.slice(startIdx, startIdx + pageSize);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isAllSelected =
    paginatedGuests.length > 0 &&
    paginatedGuests.every((g) => selectedIds.includes(g.id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedGuests.some((g) => g.id === id))
      );
    } else {
      const addIds = paginatedGuests.map((g) => g.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...addIds])));
    }
  };
  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full bg-white min-h-screen font-['Poppins']">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Guests</h1>
            <p className="text-gray-600 mt-1">Manage and track all Guest information</p>
          </div>
          <div />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 my-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by guest name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
              />
            </div>
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Guest ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Phone
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Total Bookings
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Last Stay
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Notes
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 text-center text-gray-500 text-lg"
                  >
                    No guests found.
                  </td>
                </tr>
              ) : (
                paginatedGuests.map((guest) => {
                  const total =
                    guest.totalBookings ?? (guest.bookings?.length ?? 0);
                  return (
                    <tr
                      key={guest.id}
                      className="hover:bg-gray-50 even:bg-gray-50/30"
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600"
                          checked={selectedIds.includes(guest.id)}
                          onChange={() => toggleSelectOne(guest.id)}
                        />
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500">
                        {guest.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 font-semibold">
                        <button
                          onClick={() => setSelectedGuest(guest)}
                          className="text-blue-700 hover:underline"
                        >
                          {guest.name}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {guest.email}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {guest.phone}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {total}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {formatDate(guest.lastBooking)}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <button
                          onClick={() => setSelectedGuest(guest)}
                          title={guest.remarks || 'No notes'}
                          className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 text-gray-700"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 8h.01M11 12h2v4h-2z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedGuest(guest)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100"
                            title="View"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="w-5 h-5 text-gray-700"
                            >
                              <path
                                d="M12 5c5 0 9 6 9 6s-4 6-9 6-9-6-9-6 4-6 9-6Z"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <circle
                                cx="12"
                                cy="11"
                                r="3"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => alert('Edit guest info logic')}
                            className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100"
                            title="Edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="w-5 h-5 text-gray-700"
                              fill="currentColor"
                            >
                              <path d="M4 21h4l10-10-4-4L4 17v4Z" />
                              <path d="M14 7l3 3" />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              setGuests((prev) =>
                                prev.filter((g) => g.id !== guest.id)
                              )
                            }
                            className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100"
                            title="Delete"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="w-5 h-5 text-red-600"
                              fill="currentColor"
                            >
                              <path d="M9 3h6v2h5v2H4V5h5V3Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9Zm-8 0h2v9H6V9Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} · Showing {paginatedGuests.length}{' '}
            of {filteredGuests.length}
          </p>
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-md text-sm disabled:opacity-50 bg-white hover:bg-gray-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 border rounded-md text-sm ${
                    p === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-md text-sm disabled:opacity-50 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Guest Booking Modal */}
        {selectedGuest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedGuest.name}'s Bookings
                  </h3>
                  <button
                    onClick={() => setSelectedGuest(null)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedGuest.bookings?.length > 0 ? (
                    selectedGuest.bookings.map((booking) => (
                      <div key={booking._id} className="border p-3 rounded-md">
                        <p className="text-sm text-gray-900">
                          Booking ID: {booking._id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Room: {booking.room.roomType} | Guests: {booking.guests}
                        </p>
                        <p className="text-sm text-gray-500">
                          Check-in:{' '}
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Check-out:{' '}
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {booking.isPaid ? 'Completed' : 'Pending'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Remarks: {booking.remarks || '-'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No bookings yet.</p>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedGuest(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;
