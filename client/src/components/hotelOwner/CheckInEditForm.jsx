import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hotelDummyData } from '../../assets/assets';

const CheckInEditForm = ({ isOpen, onClose, booking, mode = 'checkin', onSave, onSendEmail }) => {
  // Form state
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    staySegments: [{
      id: 1,
      roomRequests: [{
        id: 1,
        roomType: '',
        numberOfRooms: 1,
        selectedRooms: []
      }],
      checkInDate: '',
      checkOutDate: '',
      adults: 1,
      children: 0,
      extraBeds: 0,
      ratePlan: ''
    }],
    totalRoomPrice: 0,
    payments: [{
      id: 1,
      amount: 0,
      collectedAt: 'Cash',
      date: new Date().toISOString().split('T')[0]
    }],
    otherCharges: [],
    bookingNotes: ''
  });

  const [availableRooms, setAvailableRooms] = useState({});
  const [roomNumbersByType, setRoomNumbersByType] = useState({}); // Store room numbers by room type
  const [showRoomSelector, setShowRoomSelector] = useState({}); // Track which room selector is open
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      initializeFormData();
    } else if (!isOpen) {
      // Reset states when modal closes
      setShowRoomSelector({});
      setRoomNumbersByType({});
    }
  }, [isOpen, booking]);

  // Load room numbers from assets.js on component mount
  useEffect(() => {
    if (isOpen) {
      hotelDummyData.forEach(hotel => {
        if (hotel.roomNumbers && hotel.roomNumbers.length > 0) {
          setRoomNumbersByType(prev => ({
            ...prev,
            [hotel.name]: hotel.roomNumbers
          }));
        }
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.room-selector-container')) {
        setShowRoomSelector({});
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const initializeFormData = async () => {
    if (!booking) return;

    try {
      // First, try to get data from booking object directly (fallback)
      const fallbackData = {
        guestName: booking.guestName || '',
        guestPhone: booking.phone || '',
        guestEmail: booking.email || '',
        roomType: booking.roomType || '',
        checkInDate: booking.checkInDate || '',
        checkOutDate: booking.checkOutDate || '',
        totalPrice: booking.totalPrice || 0,
      };

      // Fetch booking group to get all related bookings
      const response = await fetch(
        `https://rrh-backend.vercel.app/api/bookings/admin/group/${booking.bookingId}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const data = await response.json();

      if (data.success && data.bookings.length > 0) {
        const firstBooking = data.bookings[0];
        
        // Group bookings by check-in/check-out dates to create segments
        const segmentsMap = {};
        data.bookings.forEach((b) => {
          const key = `${b.check_in}_${b.check_out}`;
          if (!segmentsMap[key]) {
            segmentsMap[key] = {
              checkInDate: b.check_in,
              checkOutDate: b.check_out,
              bookings: []
            };
          }
          segmentsMap[key].bookings.push(b);
        });

        const segments = Object.values(segmentsMap).map((seg, segIndex) => {
          // Group bookings by room type within segment
          const roomTypeMap = {};
          seg.bookings.forEach((b) => {
            if (!roomTypeMap[b.room_type]) {
              roomTypeMap[b.room_type] = [];
            }
            roomTypeMap[b.room_type].push(b);
          });

          const roomRequests = Object.entries(roomTypeMap).map(([roomType, bookings], reqIndex) => ({
            id: reqIndex + 1,
            roomType: roomType,
            numberOfRooms: bookings.length,
            selectedRooms: bookings.map(b => b.room_number).filter(Boolean)
          }));

          return {
            id: segIndex + 1,
            roomRequests,
            checkInDate: seg.checkInDate,
            checkOutDate: seg.checkOutDate,
            adults: seg.bookings[0]?.adults || 1,
            children: seg.bookings[0]?.children || 0,
            extraBeds: 0,
            ratePlan: ''
          };
        });

        // Calculate total room price from all bookings
        const totalPrice = data.totalPrice || data.bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
        
        setFormData({
          guestName: data.guestName || fallbackData.guestName,
          guestPhone: data.phone || fallbackData.guestPhone,
          guestEmail: data.email || fallbackData.guestEmail,
          staySegments: segments,
          totalRoomPrice: totalPrice || fallbackData.totalPrice,
          payments: [{
            id: 1,
            amount: 0,
            collectedAt: 'Cash',
            date: new Date().toISOString().split('T')[0]
          }],
          otherCharges: [],
          bookingNotes: ''
        });

        // Fetch available rooms for each segment
        segments.forEach((segment) => {
          segment.roomRequests.forEach((req) => {
            fetchAvailableRoomsForRequest(segment, req);
          });
        });
        
        // Also fetch room numbers for all room types from assets.js as fallback
        hotelDummyData.forEach(hotel => {
          if (hotel.roomNumbers && hotel.roomNumbers.length > 0) {
            setRoomNumbersByType(prev => ({
              ...prev,
              [hotel.name]: hotel.roomNumbers
            }));
          }
        });
      } else {
        // Fallback: If API fails or returns no bookings, use booking object data directly
        console.warn('Failed to fetch booking group or no bookings found, using fallback data');
        setFormData({
          guestName: fallbackData.guestName,
          guestPhone: fallbackData.guestPhone,
          guestEmail: fallbackData.guestEmail,
          staySegments: [{
            id: 1,
            roomRequests: [{
              id: 1,
              roomType: fallbackData.roomType,
              numberOfRooms: 1,
              selectedRooms: booking.roomNumber && booking.roomNumber !== '—' ? [booking.roomNumber] : []
            }],
            checkInDate: fallbackData.checkInDate,
            checkOutDate: fallbackData.checkOutDate,
            adults: 1,
            children: 0,
            extraBeds: 0,
            ratePlan: ''
          }],
          totalRoomPrice: fallbackData.totalPrice,
          payments: [{
            id: 1,
            amount: 0,
            collectedAt: 'Cash',
            date: new Date().toISOString().split('T')[0]
          }],
          otherCharges: [],
          bookingNotes: ''
        });
      }
    } catch (error) {
      console.error('Error initializing form data:', error);
      // Use fallback data on error
      setFormData({
        guestName: booking.guestName || '',
        guestPhone: booking.phone || '',
        guestEmail: booking.email || '',
        staySegments: [{
          id: 1,
          roomRequests: [{
            id: 1,
            roomType: booking.roomType || '',
            numberOfRooms: 1,
            selectedRooms: booking.roomNumber && booking.roomNumber !== '—' ? [booking.roomNumber] : []
          }],
          checkInDate: booking.checkInDate || '',
          checkOutDate: booking.checkOutDate || '',
          adults: 1,
          children: 0,
          extraBeds: 0,
          ratePlan: ''
        }],
        totalRoomPrice: booking.totalPrice || 0,
        payments: [{
          id: 1,
          amount: 0,
          collectedAt: 'Cash',
          date: new Date().toISOString().split('T')[0]
        }],
        otherCharges: [],
        bookingNotes: ''
      });
    }
  };

  const fetchAvailableRoomsForRequest = async (segment, request) => {
    try {
      // Get room_type_id from room type name
      const typeResponse = await fetch(
        `https://rrh-backend.vercel.app/api/rooms/available?typeName=${encodeURIComponent(request.roomType)}`
      );
      const typeData = await typeResponse.json();
      
      if (typeData.success && typeData.rooms.length > 0) {
        const roomTypeId = typeData.rooms[0].room_type_id;
        
        const response = await fetch(
          `https://rrh-backend.vercel.app/api/bookings/admin/available-rooms?room_type_id=${roomTypeId}&check_in=${segment.checkInDate}&check_out=${segment.checkOutDate}`
        );
        const data = await response.json();
        
        if (data.success) {
          setAvailableRooms(prev => ({
            ...prev,
            [`${segment.id}_${request.id}`]: data.rooms || []
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  const handleChange = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addStaySegment = () => {
    setFormData(prev => ({
      ...prev,
      staySegments: [...prev.staySegments, {
        id: Date.now(),
        roomRequests: [{
          id: 1,
          roomType: '',
          numberOfRooms: 1,
          selectedRooms: []
        }],
        checkInDate: '',
        checkOutDate: '',
        adults: 1,
        children: 0,
        extraBeds: 0,
        ratePlan: ''
      }]
    }));
  };

  const removeStaySegment = (segmentId) => {
    setFormData(prev => ({
      ...prev,
      staySegments: prev.staySegments.filter(s => s.id !== segmentId)
    }));
  };

  const addRoomRequest = (segmentId) => {
    setFormData(prev => ({
      ...prev,
      staySegments: prev.staySegments.map(seg =>
        seg.id === segmentId
          ? {
              ...seg,
              roomRequests: [...seg.roomRequests, {
                id: Date.now(),
                roomType: '',
                numberOfRooms: 1,
                selectedRooms: []
              }]
            }
          : seg
      )
    }));
  };

  const removeRoomRequest = (segmentId, requestId) => {
    setFormData(prev => ({
      ...prev,
      staySegments: prev.staySegments.map(seg =>
        seg.id === segmentId
          ? {
              ...seg,
              roomRequests: seg.roomRequests.filter(r => r.id !== requestId)
            }
          : seg
      )
    }));
  };

  const addPayment = () => {
    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, {
        id: Date.now(),
        amount: 0,
        collectedAt: 'Cash',
        date: new Date().toISOString().split('T')[0]
      }]
    }));
  };

  const removePayment = (paymentId) => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.filter(p => p.id !== paymentId)
    }));
  };

  const addOtherCharge = () => {
    setFormData(prev => ({
      ...prev,
      otherCharges: [...prev.otherCharges, {
        id: Date.now(),
        description: '',
        category: 'Other',
        amount: 0
      }]
    }));
  };

  const removeOtherCharge = (chargeId) => {
    setFormData(prev => ({
      ...prev,
      otherCharges: prev.otherCharges.filter(c => c.id !== chargeId)
    }));
  };

  const calculateTotal = () => {
    const roomPrice = formData.totalRoomPrice || 0;
    const otherChargesTotal = formData.otherCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const grandTotal = roomPrice + otherChargesTotal; // Grand Total = Room Price + Other Charges
    const paymentsTotal = formData.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const pendingAmount = grandTotal - paymentsTotal;

    return {
      roomPrice, // Total Room Price (rooms only)
      grandTotal, // Grand Total (rooms + other charges)
      otherChargesTotal,
      paymentsTotal,
      pendingAmount
    };
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      // This will be handled by the parent component
      if (onSendEmail) {
        await onSendEmail(formData);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotal();
  const title = mode === 'edit' ? 'Edit Booking' : 'Bookings Information';
  const subtitle = mode === 'edit' 
    ? `Edit booking details of ${formData.guestName || booking?.guestName || 'Guest'}`
    : `Confirm Booking details of ${formData.guestName || booking?.guestName || 'Guest'}`;

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto relative my-8"
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
                {title}
              </h2>
              <p className="text-sm text-white/90">
                {subtitle}
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
        <div className="p-6 sm:p-8 space-y-6">
          {/* Guest Information */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Guest Name</label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => handleChange('guestName', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Guest Phone</label>
                <input
                  type="tel"
                  value={formData.guestPhone}
                  onChange={(e) => handleChange('guestPhone', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Guest Email</label>
                <input
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => handleChange('guestEmail', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Stay Segments */}
          {formData.staySegments.map((segment, segIndex) => (
            <section key={segment.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {segIndex + 2}
                  </span>
                  Stay Segment #{segIndex + 1}
                </h3>
                {formData.staySegments.length > 1 && (
                  <button
                    onClick={() => removeStaySegment(segment.id)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Segment
                  </button>
                )}
              </div>

              {/* Room Requests */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">Room Requests</h4>
                  <button
                    onClick={() => addRoomRequest(segment.id)}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Another Room Type
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Specify the room types and number of rooms for this booking segment.
                </p>
                <div className="space-y-4">
                  {segment.roomRequests.map((request, reqIndex) => (
                    <div key={request.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Room Request #{reqIndex + 1}</span>
                        {segment.roomRequests.length > 1 && (
                          <button
                            onClick={() => removeRoomRequest(segment.id, request.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Room Type</label>
                          <input
                            type="text"
                            value={request.roomType}
                            onChange={(e) => {
                              const newRoomType = e.target.value;
                              const newSegments = formData.staySegments.map(s =>
                                s.id === segment.id
                                  ? {
                                      ...s,
                                      roomRequests: s.roomRequests.map(r =>
                                        r.id === request.id ? { ...r, roomType: newRoomType, selectedRooms: [] } : r
                                      )
                                    }
                                  : s
                              );
                              setFormData(prev => ({ ...prev, staySegments: newSegments }));
                              // Fetch room numbers when room type changes
                              if (newRoomType) {
                                // First check assets.js
                                const hotelData = hotelDummyData.find(h => h.name === newRoomType);
                                if (hotelData && hotelData.roomNumbers) {
                                  setRoomNumbersByType(prev => ({
                                    ...prev,
                                    [newRoomType]: hotelData.roomNumbers
                                  }));
                                }
                                // Also fetch from API
                                fetchAvailableRoomsForRequest(segment, { ...request, roomType: newRoomType });
                              }
                            }}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Number of Rooms</label>
                          <input
                            type="number"
                            min="1"
                            value={request.numberOfRooms}
                            onChange={(e) => {
                              const newSegments = formData.staySegments.map(s =>
                                s.id === segment.id
                                  ? {
                                      ...s,
                                      roomRequests: s.roomRequests.map(r =>
                                        r.id === request.id ? { ...r, numberOfRooms: parseInt(e.target.value) || 1 } : r
                                      )
                                    }
                                  : s
                              );
                              setFormData(prev => ({ ...prev, staySegments: newSegments }));
                            }}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div className="relative room-selector-container">
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Room units (Optional)</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                const key = `${segment.id}_${request.id}`;
                                setShowRoomSelector(prev => ({
                                  ...prev,
                                  [key]: !prev[key]
                                }));
                                // Fetch room numbers if not already fetched
                                if (!roomNumbersByType[request.roomType] && request.roomType) {
                                  fetchAvailableRoomsForRequest(segment, request);
                                }
                              }}
                              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 bg-white text-gray-700 text-left flex items-center justify-between hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <span>
                                {request.selectedRooms.length > 0
                                  ? `${request.selectedRooms.length} unit(s) selected: ${request.selectedRooms.join(', ')}`
                                  : 'Select room units...'}
                              </span>
                              <svg className={`w-5 h-5 transform transition-transform ${showRoomSelector[`${segment.id}_${request.id}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {showRoomSelector[`${segment.id}_${request.id}`] && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                                >
                                  {(() => {
                                    const roomNumbers = roomNumbersByType[request.roomType] || [];
                                    const key = `${segment.id}_${request.id}`;
                                    const availableRoomsList = availableRooms[key] || [];
                                    const availableRoomNumbers = availableRoomsList.length > 0
                                      ? availableRoomsList.map(r => r.room_number).filter(Boolean)
                                      : roomNumbers; // Fallback to all room numbers if no date filter
                                    
                                    if (roomNumbers.length === 0) {
                                      return (
                                        <div className="p-4 text-sm text-gray-500 text-center">
                                          {request.roomType ? `No rooms found for ${request.roomType}` : 'Please select a room type first'}
                                        </div>
                                      );
                                    }
                                    
                                    return (
                                      <div className="p-2">
                                        <div className="text-xs text-gray-600 mb-2 px-2">
                                          Select up to {request.numberOfRooms} room(s):
                                        </div>
                                        {roomNumbers.map((roomNum) => {
                                          const isSelected = request.selectedRooms.includes(roomNum);
                                          const isAvailable = availableRoomNumbers.includes(roomNum) || availableRoomsList.length === 0;
                                          const canSelect = request.selectedRooms.length < request.numberOfRooms || isSelected;
                                          
                                          return (
                                            <label
                                              key={roomNum}
                                              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                                                isSelected
                                                  ? 'bg-blue-100 border-2 border-blue-500'
                                                  : canSelect && isAvailable
                                                  ? 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-300'
                                                  : 'opacity-50 cursor-not-allowed bg-gray-50'
                                              }`}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={isSelected}
                                                disabled={!canSelect || !isAvailable}
                                                onChange={(e) => {
                                                  const newSelected = e.target.checked
                                                    ? [...request.selectedRooms, roomNum]
                                                    : request.selectedRooms.filter(r => r !== roomNum);
                                                  
                                                  // Limit to numberOfRooms
                                                  const limitedSelected = newSelected.slice(0, request.numberOfRooms);
                                                  
                                                  const newSegments = formData.staySegments.map(s =>
                                                    s.id === segment.id
                                                      ? {
                                                          ...s,
                                                          roomRequests: s.roomRequests.map(r =>
                                                            r.id === request.id ? { ...r, selectedRooms: limitedSelected } : r
                                                          )
                                                        }
                                                      : s
                                                  );
                                                  setFormData(prev => ({ ...prev, staySegments: newSegments }));
                                                }}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                              />
                                              <span className="flex-1 text-sm font-medium text-gray-700">
                                                Room {roomNum}
                                              </span>
                                              {!isAvailable && (
                                                <span className="text-xs text-red-600">Unavailable</span>
                                              )}
                                            </label>
                                          );
                                        })}
                                      </div>
                                    );
                                  })()}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {request.selectedRooms.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Selected: {request.selectedRooms.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Dates */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Booking Dates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Check-in Date</label>
                    <input
                      type="date"
                      value={segment.checkInDate}
                      onChange={(e) => {
                        const newSegments = formData.staySegments.map(s =>
                          s.id === segment.id ? { ...s, checkInDate: e.target.value } : s
                        );
                        setFormData(prev => ({ ...prev, staySegments: newSegments }));
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Check-out Date</label>
                    <input
                      type="date"
                      value={segment.checkOutDate}
                      onChange={(e) => {
                        const newSegments = formData.staySegments.map(s =>
                          s.id === segment.id ? { ...s, checkOutDate: e.target.value } : s
                        );
                        setFormData(prev => ({ ...prev, staySegments: newSegments }));
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Occupancy */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Occupancy</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={segment.adults}
                      onChange={(e) => {
                        const newSegments = formData.staySegments.map(s =>
                          s.id === segment.id ? { ...s, adults: parseInt(e.target.value) || 1 } : s
                        );
                        setFormData(prev => ({ ...prev, staySegments: newSegments }));
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Children</label>
                    <input
                      type="number"
                      min="0"
                      value={segment.children}
                      onChange={(e) => {
                        const newSegments = formData.staySegments.map(s =>
                          s.id === segment.id ? { ...s, children: parseInt(e.target.value) || 0 } : s
                        );
                        setFormData(prev => ({ ...prev, staySegments: newSegments }));
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Extra Beds</label>
                    <input
                      type="number"
                      min="0"
                      value={segment.extraBeds}
                      onChange={(e) => {
                        const newSegments = formData.staySegments.map(s =>
                          s.id === segment.id ? { ...s, extraBeds: parseInt(e.target.value) || 0 } : s
                        );
                        setFormData(prev => ({ ...prev, staySegments: newSegments }));
                      }}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Add Stay Segment Button */}
          <button
            onClick={addStaySegment}
            className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Room Move
          </button>

          {/* Financials */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
              Financials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Total Room Price (₱)</label>
                <input
                  type="number"
                  value={formData.totalRoomPrice}
                  onChange={(e) => handleChange('totalRoomPrice', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">This is the total price for rooms only. Other charges will be added to the Grand Total.</p>
              </div>
            </div>
          </section>

          {/* Payment Received */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                Payment Received
              </h3>
              <div className="text-right">
                <span className="text-sm text-gray-600">Pending Amount:</span>
                <span className="text-lg font-bold text-red-600 ml-2">₱{totals.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="space-y-4">
              {formData.payments.map((payment, index) => (
                <div key={payment.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Payment #{index + 1}</span>
                    {formData.payments.length > 1 && (
                      <button
                        onClick={() => removePayment(payment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Amount (₱)</label>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => {
                          const newPayments = formData.payments.map(p =>
                            p.id === payment.id ? { ...p, amount: parseFloat(e.target.value) || 0 } : p
                          );
                          setFormData(prev => ({ ...prev, payments: newPayments }));
                        }}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Collected At</label>
                      <select
                        value={payment.collectedAt}
                        onChange={(e) => {
                          const newPayments = formData.payments.map(p =>
                            p.id === payment.id ? { ...p, collectedAt: e.target.value } : p
                          );
                          setFormData(prev => ({ ...prev, payments: newPayments }));
                        }}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="Cash">Front Desk - Cash</option>
                        <option value="Card">Front Desk - Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Online">Online Payment</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Date</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={payment.date}
                          onChange={(e) => {
                            const newPayments = formData.payments.map(p =>
                              p.id === payment.id ? { ...p, date: e.target.value } : p
                            );
                            setFormData(prev => ({ ...prev, payments: newPayments }));
                          }}
                          className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        {formData.payments.length > 1 && (
                          <button
                            onClick={() => removePayment(payment.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addPayment}
                className="w-full py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Payment
              </button>
            </div>
          </section>

          {/* Other Charges */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">5</span>
              Other Charges
            </h3>
            <div className="space-y-4">
              {formData.otherCharges.map((charge, index) => (
                <div key={charge.id} className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Charge #{index + 1}</span>
                    <button
                      onClick={() => removeOtherCharge(charge.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                      <input
                        type="text"
                        placeholder="e.g., Lunch"
                        value={charge.description}
                        onChange={(e) => {
                          const newCharges = formData.otherCharges.map(c =>
                            c.id === charge.id ? { ...c, description: e.target.value } : c
                          );
                          setFormData(prev => ({ ...prev, otherCharges: newCharges }));
                        }}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
                      <select
                        value={charge.category}
                        onChange={(e) => {
                          const newCharges = formData.otherCharges.map(c =>
                            c.id === charge.id ? { ...c, category: e.target.value } : c
                          );
                          setFormData(prev => ({ ...prev, otherCharges: newCharges }));
                        }}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Amount (₱)</label>
                      <input
                        type="number"
                        value={charge.amount}
                        onChange={(e) => {
                          const newCharges = formData.otherCharges.map(c =>
                            c.id === charge.id ? { ...c, amount: parseFloat(e.target.value) || 0 } : c
                          );
                          setFormData(prev => ({ ...prev, otherCharges: newCharges }));
                        }}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addOtherCharge}
                className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Other Charge
              </button>
            </div>
          </section>

          {/* Booking Notes */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">6</span>
              Booking Notes
            </h3>
            <textarea
              value={formData.bookingNotes}
              onChange={(e) => handleChange('bookingNotes', e.target.value)}
              rows={4}
              placeholder="Add any special notes or requirements..."
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </section>

          {/* Summary */}
          <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2 w-full">
                <div className="flex justify-between gap-8">
                  <span className="text-gray-700 font-medium">Total Room Price:</span>
                  <span className="text-gray-900 font-semibold">₱{totals.roomPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {totals.otherChargesTotal > 0 && (
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600 text-sm">Other Charges:</span>
                    <span className="text-gray-700 text-sm">₱{totals.otherChargesTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between gap-8 pt-2 border-t border-blue-200">
                  <span className="text-gray-900 font-bold text-lg">Grand Total:</span>
                  <span className="text-blue-600 font-bold text-xl">₱{totals.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between gap-8 pt-2">
                  <span className="text-gray-600 text-sm">Pending Amount:</span>
                  <span className={`text-sm font-semibold ${totals.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₱{totals.pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-300 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
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
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="relative z-10">Confirm</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckInEditForm;

