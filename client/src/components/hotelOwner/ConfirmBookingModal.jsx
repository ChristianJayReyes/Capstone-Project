import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const ConfirmBookingModal = ({ isOpen, onClose, booking, onConfirm }) => {
  const { token } = useAppContext();
  const [bookingGroup, setBookingGroup] = useState(null);
  const [availableRooms, setAvailableRooms] = useState({}); // Changed to object: { roomType: [rooms] }
  const [roomAssignments, setRoomAssignments] = useState({}); // Changed to: { roomType: [roomNumbers] }
  const [roomTypeGroups, setRoomTypeGroups] = useState([]); // Group bookings by room type
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      fetchBookingGroup();
    } else if (!isOpen) {
      // Reset state when modal closes
      setBookingGroup(null);
      setAvailableRooms({});
      setRoomAssignments({});
      setRoomTypeGroups([]);
      setFetching(false);
    }
  }, [isOpen, booking]);

  const fetchBookingGroup = async () => {
    if (!booking) {
      console.error('No booking provided to ConfirmBookingModal');
      return;
    }
    
    // Get token from context or localStorage as fallback
    const authToken = token || localStorage.getItem("token");
    
    // Check if token is available
    if (!authToken) {
      console.error('No authentication token found');
      setBookingGroup({ error: 'Authentication required. Please log in again.' });
      setFetching(false);
      return;
    }
    
    // Debug: Log the booking object
    console.log('Fetching booking group for:', booking);
    console.log('Booking ID:', booking.bookingId || booking.booking_id || booking.id);
    console.log('Token available:', !!authToken);
    console.log('Token from context:', !!token);
    console.log('Token from localStorage:', !!localStorage.getItem("token"));
    if (authToken) {
      console.log('Token length:', authToken.length);
      console.log('Token preview:', authToken.substring(0, 20) + '...');
    }
    
    setFetching(true);
    try {
      // Try different possible booking ID fields
      // For grouped bookings, use the first booking ID from bookingIds array
      const bookingId = booking.bookingIds?.[0] || booking.bookingId || booking.booking_id || booking.id;
      
      if (!bookingId) {
        console.error('No booking ID found in booking object:', booking);
        setBookingGroup({ error: 'No booking ID found. Please try again.' });
        setFetching(false);
        return;
      }
      
      const url = `https://rrh-backend.vercel.app/api/bookings/admin/group/${bookingId}`;
      console.log('Fetching from URL:', url);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };
      
      const response = await fetch(url, {
        headers,
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch booking group: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Booking group data:', data);
      
      if (data.success && data.bookings && data.bookings.length > 0) {
        setBookingGroup(data);
        
        // Group bookings by room type
        const groupedByType = {};
        data.bookings.forEach((b) => {
          const roomType = b.room_type || b.roomType || 'Unknown';
          if (!groupedByType[roomType]) {
            groupedByType[roomType] = {
              roomType: roomType,
              bookings: [],
              roomTypeId: b.room_type_id,
              checkIn: b.check_in,
              checkOut: b.check_out,
            };
          }
          groupedByType[roomType].bookings.push(b);
        });
        
        const groups = Object.values(groupedByType);
        setRoomTypeGroups(groups);
        
        // Initialize room assignments - one array per room type
        // Pre-populate with existing room numbers if any
        const assignments = {};
        groups.forEach((group) => {
          const existingRooms = group.bookings
            .map(b => b.room_number)
            .filter(rn => rn && rn !== '—' && rn !== '' && rn !== null);
          assignments[group.roomType] = existingRooms;
        });
        setRoomAssignments(assignments);
        
        // Fetch available rooms for each room type
        groups.forEach((group) => {
          fetchAvailableRoomsForType(group);
        });
      } else {
        console.error('API returned success: false or no bookings', data);
        setBookingGroup({ 
          error: data.message || 'No bookings found for this booking group. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error fetching booking group:', error);
      // Set an error state so we can show it to the user
      setBookingGroup({ error: error.message });
    } finally {
      setFetching(false);
    }
  };

  const fetchAvailableRoomsForType = async (roomTypeGroup) => {
    try {
      // Get token from context or localStorage as fallback
      const authToken = token || localStorage.getItem("token");
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization token
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const url = `https://rrh-backend.vercel.app/api/bookings/admin/available-rooms?room_type_id=${roomTypeGroup.roomTypeId}&check_in=${roomTypeGroup.checkIn}&check_out=${roomTypeGroup.checkOut}`;
      console.log('Fetching available rooms for:', roomTypeGroup.roomType, 'from:', url);
      
      const response = await fetch(url, {
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch available rooms:', response.status, errorText);
        setAvailableRooms(prev => ({
          ...prev,
          [roomTypeGroup.roomType]: []
        }));
        return;
      }
      
      const data = await response.json();
      console.log('Available rooms response for', roomTypeGroup.roomType, ':', data);
      
      if (data.success) {
        setAvailableRooms(prev => ({
          ...prev,
          [roomTypeGroup.roomType]: data.rooms || []
        }));
      } else {
        console.error('API returned success: false for available rooms:', data.message || data.error);
        setAvailableRooms(prev => ({
          ...prev,
          [roomTypeGroup.roomType]: []
        }));
      }
    } catch (error) {
      console.error('Error fetching available rooms for', roomTypeGroup.roomType, ':', error);
      setAvailableRooms(prev => ({
        ...prev,
        [roomTypeGroup.roomType]: []
      }));
    }
  };

  const handleRoomAssignment = (roomType, roomNumber, isSelected) => {
    setRoomAssignments((prev) => {
      const currentRooms = prev[roomType] || [];
      let newRooms;
      
      if (isSelected) {
        // Add room if not already selected
        if (!currentRooms.includes(roomNumber)) {
          newRooms = [...currentRooms, roomNumber];
        } else {
          newRooms = currentRooms;
        }
      } else {
        // Remove room
        newRooms = currentRooms.filter(rn => rn !== roomNumber);
      }
      
      return {
        ...prev,
        [roomType]: newRooms,
      };
    });
  };

  const handleConfirm = async () => {
    if (!bookingGroup || !roomTypeGroups.length) return;

    // Validate all rooms are assigned
    // For each room type group, check if we have enough room assignments
    const validationErrors = [];
    roomTypeGroups.forEach((group) => {
      const assignedRooms = roomAssignments[group.roomType] || [];
      const requiredCount = group.bookings.length;
      
      if (assignedRooms.length < requiredCount) {
        validationErrors.push(
          `${group.roomType}: Need ${requiredCount} room(s), but only ${assignedRooms.length} selected.`
        );
      }
    });

    if (validationErrors.length > 0) {
      alert('Please assign room numbers to all bookings:\n\n' + validationErrors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      // Map room assignments to booking IDs
      // For each room type, assign rooms to bookings in order
      const bookingIds = [];
      const roomNumbers = [];
      
      roomTypeGroups.forEach((group) => {
        const assignedRooms = roomAssignments[group.roomType] || [];
        group.bookings.forEach((booking, index) => {
          bookingIds.push(booking.booking_id);
          roomNumbers.push(assignedRooms[index] || '');
        });
      });

      // Get token from context or localStorage as fallback
      const authToken = token || localStorage.getItem("token");
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };
      
      const assignResponse = await fetch(
        'https://rrh-backend.vercel.app/api/bookings/admin/assign-rooms',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            booking_ids: bookingIds,
            room_numbers: roomNumbers,
          }),
        }
      );

      const assignData = await assignResponse.json();
      if (!assignData.success) {
        alert(`Failed to assign rooms: ${assignData.message}`);
        setLoading(false);
        return;
      }

      // Confirm ALL bookings in the group (update status to Arrival)
      // Get token from context or localStorage as fallback
      const confirmAuthToken = token || localStorage.getItem("token");
      
      // Confirm all bookings in parallel
      // Use Promise.allSettled to handle partial failures gracefully
      const confirmPromises = bookingIds.map(bookingId =>
        fetch(
          'https://rrh-backend.vercel.app/api/bookings/admin/update-status',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${confirmAuthToken}`,
            },
            body: JSON.stringify({
              booking_id: bookingId,
              action: 'confirm',
            }),
          }
        )
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            // If response is not OK, return error but don't throw
            return { success: false, message: data.message || data.error || 'Update failed', status: res.status };
          }
          return data;
        })
        .catch(error => {
          // Network errors or other fetch errors
          console.error(`Error confirming booking ${bookingId}:`, error);
          return { success: false, message: error.message || 'Network error', error: true };
        })
      );

      const confirmResults = await Promise.allSettled(confirmPromises);
      
      // Extract results from settled promises
      const results = confirmResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return { success: false, message: result.reason?.message || 'Unknown error', bookingId: bookingIds[index] };
        }
      });
      
      const allConfirmed = results.every(result => result.success);
      const failedResults = results.filter(r => !r.success);
      
      if (allConfirmed) {
        // Send confirmation email with all booking details
        // Use the first booking ID to trigger email (backend will collect all related bookings)
        try {
          const emailResponse = await fetch(
            'https://rrh-backend.vercel.app/api/bookings/admin/send-confirmation-email',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${confirmAuthToken}`,
              },
              body: JSON.stringify({
                booking_id: bookingIds[0], // Use first booking ID to identify the group
              }),
            }
          );
          
          const emailData = await emailResponse.json();
          if (!emailData.success) {
            console.warn('Failed to send confirmation email:', emailData.message);
            // Don't fail the confirmation if email fails
          } else {
            console.log('Confirmation email sent successfully');
          }
        } catch (emailError) {
          console.warn('Error sending confirmation email:', emailError);
          // Don't fail the confirmation if email fails
        }
        
        onConfirm();
        onClose();
      } else {
        // Some bookings failed, but check if any succeeded
        const succeededCount = results.filter(r => r.success).length;
        if (succeededCount > 0) {
          // Some succeeded, refresh to show updated status
          console.warn(`${succeededCount} booking(s) confirmed, but ${failedResults.length} failed`);
          onConfirm(); // Refresh the list to show updated bookings
        }
        alert(`Failed to confirm some bookings: ${failedResults.map(r => r.message || 'Update failed').join(', ')}`);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('An error occurred while confirming the booking.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-yellow-500 p-6 sm:p-8 rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Confirm Booking
                  </h2>
                  <p className="text-sm text-white/90">
                    Confirm booking details of {bookingGroup?.guestName || booking.guestName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading booking details...</p>
                </div>
              ) : bookingGroup?.error ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Booking Details</h3>
                    <p className="text-sm text-red-600 mb-4">{bookingGroup.error}</p>
                    <button
                      onClick={fetchBookingGroup}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : bookingGroup && !bookingGroup.error && bookingGroup.bookings ? (
                <div className="space-y-6">
                  {/* Guest Information */}
                  <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Guest Name</label>
                        <input
                          type="text"
                          value={bookingGroup.guestName || ''}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={bookingGroup.email || ''}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Room Type(s)</label>
                        <input
                          type="text"
                          value={roomTypeGroups.length > 0 
                            ? roomTypeGroups.map(g => `${g.roomType} (${g.bookings.length})`).join(', ')
                            : bookingGroup.roomType || ''}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-700"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Room Assignments */}
                  <section className="bg-white rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Room Assignments</h3>
                    <div className="space-y-4">
                      {roomTypeGroups.map((group, groupIndex) => {
                        const roomsForType = availableRooms[group.roomType] || [];
                        const assignedRooms = roomAssignments[group.roomType] || [];
                        const requiredCount = group.bookings.length;
                        const hasError = assignedRooms.length < requiredCount;
                        
                        return (
                          <div
                            key={group.roomType}
                            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-800">
                                  Room #{groupIndex + 1}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {group.roomType} - {requiredCount} room(s) needed
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Booking IDs: {group.bookings.map(b => b.booking_id).join(', ')}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                  Select Room Unit(s) <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2 max-h-60 overflow-y-auto border-2 border-gray-300 rounded-lg p-3 bg-white">
                                  {roomsForType.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                      Loading available rooms...
                                    </p>
                                  ) : (
                                    roomsForType.map((room) => {
                                      const isSelected = assignedRooms.includes(room.room_number);
                                      const canSelect = assignedRooms.length < requiredCount || isSelected;
                                      
                                      return (
                                        <label
                                          key={room.room_id}
                                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                                            isSelected
                                              ? 'bg-blue-100 border-2 border-blue-500'
                                              : canSelect
                                              ? 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-300'
                                              : 'opacity-50 cursor-not-allowed bg-gray-50'
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            disabled={!canSelect}
                                            onChange={(e) =>
                                              handleRoomAssignment(
                                                group.roomType,
                                                room.room_number,
                                                e.target.checked
                                              )
                                            }
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                          />
                                          <span className="flex-1 text-sm font-medium text-gray-700">
                                            {room.room_number}
                                          </span>
                                        </label>
                                      );
                                    })
                                  )}
                                </div>
                                {hasError && (
                                  <p className="text-xs text-red-500 mt-1">
                                    Please select {requiredCount} room(s) for {group.roomType}
                                  </p>
                                )}
                                {assignedRooms.length > 0 && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Selected: {assignedRooms.join(', ')}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                  Available Rooms
                                </label>
                                <div className="w-full rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-yellow-500 border-2 border-transparent px-4 py-2.5 text-center text-white font-semibold">
                                  {roomsForType.length} rooms available
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                  <p>Required: {requiredCount} room(s)</p>
                                  <p>Selected: {assignedRooms.length} room(s)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={loading || fetching}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Confirming...
                        </span>
                      ) : (
                        <span className="relative z-10">Confirm</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading booking details...</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmBookingModal;

