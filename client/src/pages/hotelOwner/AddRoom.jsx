<<<<<<< HEAD
import React, { useMemo, useState, useEffect } from "react";
import "../../styles/listroom.css";

const ListRoom = () => {
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // rooms per page

  const [rooms, setRooms] = useState([]);
  const refetch = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/rooms/getRooms.php');
    const data = await res.json();
    const roomsArray = data.data || [];
   const mapped = roomsArray.map((r) => ({
  _id: r.room_id,
  roomType: r.type_name,
  roomTypeId: r.room_type_id, // <-- needed for updates
  pricePerNight: Number(r.price_per_night) || 0,
  capacityAdults: r.capacity_adults,
  capacityChildren: r.capacity_children,
  status: (r.status || '').toLowerCase(),
  roomNumber: r.room_number,
  isAvailable: (r.status || '').toLowerCase() === 'available',
}));


    console.log('Raw API data:', data);
    console.log('Rooms array:', roomsArray);
    console.log('Mapped rooms:', mapped);

    setRooms(mapped);

  } catch (e) {
  console.error('Failed to load rooms', e);
  alert('Failed to load rooms.');
  setRooms([]);
}

};

  useEffect(() => { refetch(); }, []);
  const [roomTypeFilter, setRoomTypeFilter] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState("all"); 
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Dormitory Room",
    pricePerNight: "",
    capacityAdults: 1,
    capacityChildren: 0,
    status: "available",
   
  });

  useEffect(() => {
  if (editingRoom) {
    setFormData({
      roomNumber: editingRoom.roomNumber || "",
      roomType: editingRoom.roomType || "Dormitory Room",
      roomTypeId: roomTypeMap[editingRoom.roomType] || 1,
      pricePerNight: editingRoom.pricePerNight || "",
      capacityAdults: editingRoom.capacityAdults || 1,
      capacityChildren: editingRoom.capacityChildren || 0,
      status: editingRoom.status || "available",
    });
  } else {
    // Reset form when not editing
    setFormData({
      roomNumber: "",
      roomType: "Dormitory Room",
      roomTypeId: roomTypeMap["Dormitory Room"],
      pricePerNight: "",
      capacityAdults: 1,
      capacityChildren: 0,
      status: "available",
    });
  }
}, [editingRoom]);


  


  const filteredRooms = useMemo(() => {
    let list = rooms;
    
    // Filter by room type
     if (roomTypeFilter !== "all") {
    const rt = roomTypeFilter.toLowerCase();
    list = list.filter((r) => (r.roomType || '').toLowerCase() === rt);
  }

    
    // Filter by status
   if (statusFilter !== "all") {
  const sf = statusFilter.toLowerCase();
  list = list.filter((r) => {
    const roomStatus = (r.status || (r.isAvailable ? "available" : "booked")).toLowerCase();
    return roomStatus === sf;
  });
}

    
    // Filter by search query
   if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (r) =>
        (r.roomType || '').toLowerCase().includes(q) ||
        (r.roomNumber || '').toLowerCase().includes(q)
    );
  }
    
    return list;
  }, [rooms, roomTypeFilter, statusFilter, query]);
  useEffect(() => {
  setCurrentPage(1);
}, [roomTypeFilter, statusFilter, query]);

  const paginatedRooms = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return filteredRooms.slice(start, start + itemsPerPage);
}, [filteredRooms, currentPage]);

  const formatPrice = (value) => `₱${Number(value).toLocaleString()}`;
  const sliceId = (id) => `#${String(id).slice(-6)}`;

 const handleToggleAvailability = async (id) => {
  try {
    const room = rooms.find(r => r._id === id);
    if (!room) return;

    const nextStatus = (room.status === 'available') ? 'booked' : 'available';

    const res = await fetch('http://localhost:8000/api/rooms/updateRoom.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_id: id,
        status: nextStatus,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to update status:", data);
      alert(`Failed to update status: ${data.message}`);
      return;
    }

    await refetch();  // reload rooms after status update

  } catch (err) {
    console.error(err);
    alert("Failed to update room status");
  }
};




  const isAllSelected = filteredRooms.length > 0 && filteredRooms.every(r => selectedIds.includes(r._id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredRooms.some((r) => r._id === id)));
    } else {
      const addIds = filteredRooms.map((r) => r._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...addIds])));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openAddModal = () => {
  setEditingRoom(null);
  setFormData({
    roomNumber: "",
    roomType: "Dormitory Room",
    roomTypeId: roomTypeMap["Dormitory Room"],
    pricePerNight: "",
    capacityAdults: 1,
    capacityChildren: 0,
    status: "available",
  });
  setShowModal(true);
};

 const openEditModal = (room) => {
  setEditingRoom(room);
  setFormData({
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    roomTypeId: roomTypeMap[room.roomType], // <- ensure ID is set
    pricePerNight: room.pricePerNight,
    capacityAdults: room.capacityAdults || 1,
    capacityChildren: room.capacityChildren || 0,
    status: room.status || "available",
  });
  setShowModal(true);
};




  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData({
      roomNumber: "",
      roomType: "Dormitory Room",
      pricePerNight: "",
      capacityAdults: 1,
      capacityChildren: 0,
      status: "available",
      
    });
  };

 const roomTypeMap = {
  "Dormitory Room": 1,
  "Superior Queen": 2,
  "Superior Twin": 3,
  "Deluxe Queen": 4,
  "Deluxe Twin": 5,
  "Presidential Queen": 6,
  "Presidential Twin": 7,
  "Family Room": 8
};

const roomTypes = ["all", ...Object.keys(roomTypeMap)];

const capitalize = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);


const handleSave = async (isUpdate = false, roomId = null) => {
  try {
    const BASE_URL = 'http://localhost:8000/api/rooms';

    // Validation
    if (!formData.roomNumber.trim()) {
      alert("Please enter a room number");
      return;
    }
    if (!formData.roomTypeId && !formData.roomType) {
      alert("Please select a valid room type");
      return;
    }

    // Get roomTypeId (from map or directly)
    const roomTypeId = formData.roomTypeId || roomTypeMap[formData.roomType];

    // Build payload
    const payload = {
      room_number: formData.roomNumber,
      room_type_id: roomTypeId,
      status: formData.status || 'available',
      type_name: formData.roomType,              // 🔹 for room_types table
      price_per_night: formData.pricePerNight,   // 🔹 for room_types table
      capacity_adults: formData.capacityAdults,  // 🔹 for room_types table
      capacity_children: formData.capacityChildren // 🔹 for room_types table
    };

    if (isUpdate) {
      payload.room_id = roomId; // include ID for updates
    }

    const url = isUpdate
      ? `${BASE_URL}/updateRoom.php`
      : `${BASE_URL}/addRoom.php`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to save room:", data);
      alert(`Failed to save room: ${data.message || 'Unknown error'}`);
      return;
    }

    alert(data.message || "Room saved successfully");
    await refetch();   // refresh the room list
    closeModal();      // close the modal
  } catch (err) {
    console.error("Error saving room:", err);
    alert("An error occurred while saving the room");
  }
};















 // Central delete function for single or multiple rooms
const deleteRooms = async (ids) => {
  if (!ids || ids.length === 0) return;

  try {
    const response = await fetch('http://localhost:8000/api/rooms/deleteBulk.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete');

    // Remove deleted rooms locally
    setRooms(prev => prev.filter(r => !ids.includes(r._id)));
    setSelectedIds(prev => prev.filter(id => !ids.includes(id)));

    alert(data.message);
  } catch (e) {
    console.error('Failed to delete rooms', e);
    alert('Failed to delete rooms: ' + e.message);
  }
};



// Single room delete now uses the same deleteRooms function
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this room?")) return;
  await deleteRooms([id]);
};

// Bulk delete uses the same function
const handleBulkDelete = async () => {
  if (selectedIds.length === 0) return;
  if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} room(s)?`)) return;

  await deleteRooms(selectedIds);
};



const handleViewBooking = async (room) => {
  if (room.status !== 'booked') {
    alert('Room is not occupied.');
    return;
  }

  try {
    const res = await fetch(`/api/bookings/room/${room._id}`);
    const data = await res.json();

    if (data.success && data.booking) {
      setEditingRoom({ ...room, booking: data.booking });
      setShowModal(true);
    } else {
      alert('No booking information found.');
    }
  } catch (e) {
    console.error('Failed to load booking info', e);
    alert('Failed to load booking info');
  }
};



  const getStatusConfig = (status) => {
    switch (status) {
      case "available":
        return { color: "bg-green-100 text-green-700 border-green-200", label: "Available" };
      case "booked":
        return { color: "bg-red-100 text-red-700 border-red-200", label: "Booked" };
      case "maintenance":
        return { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Maintenance" };
      default:
        return { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Unknown" };
    }
  };


  return (
    <div className="w-full bg-white-50 min-h-screen font-['Poppins']">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all room information</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected ({selectedIds.length})
                </button>
              )}
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Room
              </button>
            </div>
          </div>
        </div>

     {/* Search and Filter Section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    
    {/* Search */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
      <input
        type="text"
        placeholder="Search room number..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
      />
    </div>

    {/* Room Type Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
      <select
        value={roomTypeFilter}  // bind to filter state
        onChange={(e) => setRoomTypeFilter(e.target.value)} // update filter state
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
      >
        <option value="all">All Room Types</option> {/* show all */}
        {Object.keys(roomTypeMap).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {/* Status Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
      >
        <option value="all">All Status</option>
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </div>

  </div>
</div>


        {/* Rooms Display */}
       
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
               <div className="p-4 border-b border-gray-200 text-gray-700 font-medium">
                Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}
                </div>
                <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room ID</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room Number</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room Type</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Price per Night</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Capacity</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">View</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRooms.length === 0 ? (
  <tr>
    <td colSpan={9} className="py-12 text-center text-gray-500">
      <div className="flex flex-col items-center gap-2">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p className="text-lg font-medium">No rooms found</p>
        <p className="text-sm">Try adjusting your search or filter criteria</p>
      </div>
    </td>
  </tr>
) : (
  paginatedRooms.map((room) => {
    const statusConfig = getStatusConfig(room.status || (room.isAvailable ? "available" : "booked"));
    return (
                        <tr key={room._id} className="hover:bg-blue-50 transition-colors">
                          <td className="py-4 px-6">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-blue-600"
                              checked={selectedIds.includes(room._id)}
                              onChange={() => toggleSelectOne(room._id)}
                            />
                          </td>
        
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {sliceId(room._id)}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {room.roomNumber}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {room.roomType}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {formatPrice(room.pricePerNight)}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {room.capacityAdults || 1} Adults, {room.capacityChildren || 0} Children
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-4 px-6">
  {room.status === 'booked' ? (
    <button
      onClick={() => handleViewBooking(room)}
      className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
      title="View Booking"
    >
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  ) : (
    <span className="text-gray-400 text-sm">—</span>
  )}
</td>


                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(room)}
                                className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-blue-100 transition-colors"
                                title="Edit Room"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(room._id)}
                                className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-red-100 transition-colors"
                                title="Delete Room"
                              >
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          </div>
          {/* Pagination Footer */}
<div className="flex justify-between items-center px5 py-3 bg-white-50 ">
  <div className="text-sm text-gray-600">
    Page {currentPage} of {Math.max(Math.ceil(filteredRooms.length / itemsPerPage), 1)} | 
    Showing {paginatedRooms.length} of {filteredRooms.length}
  </div>

  <div className="flex gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Prev
    </button>
    <button
     disabled={currentPage >= Math.ceil(filteredRooms.length / itemsPerPage) || filteredRooms.length === 0}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>
</div>

          

       {/* Add/Edit Room Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </h3>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-4">
        {editingRoom?.booking ? (
          // === Booking Info View ===
          <div className="space-y-2">
            <p><strong>Room Number:</strong> {editingRoom.roomNumber}</p>
            <p><strong>Occupied By:</strong> {editingRoom.booking.customer_name}</p>
            <p><strong>Email:</strong> {editingRoom.booking.email}</p>
            <p><strong>Phone:</strong> {editingRoom.booking.phone}</p>
            <p><strong>Check-in:</strong> {editingRoom.booking.check_in}</p>
            <p><strong>Check-out:</strong> {editingRoom.booking.check_out}</p>
          </div>
        ) : (

          
          // === Add/Edit Form ===
         <>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
      <input
        type="text"
        value={formData.roomNumber}
        onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Enter room number"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
      <select
        value={formData.roomType}
        onChange={(e) => {
          const type = e.target.value;
          setFormData(prev => ({
            ...prev,
            roomType: type,
            roomTypeId: roomTypeMap[type],
          }));
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      >
        {Object.keys(roomTypeMap).map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night</label>
      <input
        type="number"
        value={formData.pricePerNight}
        onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="0"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
      <select
        value={formData.status}
        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
      >
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (Adults)</label>
      <select
        value={formData.capacityAdults}
        onChange={(e) => setFormData(prev => ({ ...prev, capacityAdults: Number(e.target.value) }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      >
        {[1, 2, 3, 4, 5, 6].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (Children)</label>
      <select
        value={formData.capacityChildren}
        onChange={(e) => setFormData(prev => ({ ...prev, capacityChildren: Number(e.target.value) }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      >
        {[0, 1, 2, 3, 4].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>
  </div>
</>

        )}
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end p-6 border-t border-gray-200 gap-3">
        <button
          onClick={closeModal}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        {!editingRoom?.booking && (
          <button
  onClick={() => handleSave(!!editingRoom, editingRoom?._id)}
  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold"
>
  {editingRoom ? 'Update Room' : 'Save Room'}
</button>

        )}
      </div>

    </div>
  </div>
)}

      </div>
    
  );
};

export default ListRoom;
=======
import React, { useMemo, useState, useEffect } from "react";
import "../../styles/listroom.css";

const ListRoom = () => {
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; 

  const [rooms, setRooms] = useState([]);
  const refetch = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/rooms/getRooms.php');
    const data = await res.json();
    const roomsArray = data.data || [];
   const mapped = roomsArray.map((r) => ({
  _id: r.room_id,
  roomType: r.type_name,
  roomTypeId: r.room_type_id, // <-- needed for updates
  pricePerNight: Number(r.price_per_night) || 0,
  capacityAdults: r.capacity_adults,
  capacityChildren: r.capacity_children,
  status: (r.status || '').toLowerCase(),
  roomNumber: r.room_number,
  isAvailable: (r.status || '').toLowerCase() === 'available',
}));


    console.log('Raw API data:', data);
    console.log('Rooms array:', roomsArray);
    console.log('Mapped rooms:', mapped);

    setRooms(mapped);

  } catch (e) {
  console.error('Failed to load rooms', e);
  alert('Failed to load rooms.');
  setRooms([]);
}

};

  useEffect(() => { refetch(); }, []);
  const [roomTypeFilter, setRoomTypeFilter] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState("all"); 
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Dormitory Room",
    pricePerNight: "",
    capacityAdults: 1,
    capacityChildren: 0,
    status: "available",
   
  });

  useEffect(() => {
  if (editingRoom) {
    setFormData({
      roomNumber: editingRoom.roomNumber || "",
      roomType: editingRoom.roomType || "Dormitory Room",
      roomTypeId: roomTypeMap[editingRoom.roomType] || 1,
      pricePerNight: editingRoom.pricePerNight || "",
      capacityAdults: editingRoom.capacityAdults || 1,
      capacityChildren: editingRoom.capacityChildren || 0,
      status: editingRoom.status || "available",
    });
  } else {
    // Reset form when not editing
    setFormData({
      roomNumber: "",
      roomType: "Dormitory Room",
      roomTypeId: roomTypeMap["Dormitory Room"],
      pricePerNight: "",
      capacityAdults: 1,
      capacityChildren: 0,
      status: "available",
    });
  }
}, [editingRoom]);


  


  const filteredRooms = useMemo(() => {
    let list = rooms;
    
    // Filter by room type
     if (roomTypeFilter !== "all") {
    const rt = roomTypeFilter.toLowerCase();
    list = list.filter((r) => (r.roomType || '').toLowerCase() === rt);
  }

    
    // Filter by status
   if (statusFilter !== "all") {
  const sf = statusFilter.toLowerCase();
  list = list.filter((r) => {
    const roomStatus = (r.status || (r.isAvailable ? "available" : "booked")).toLowerCase();
    return roomStatus === sf;
  });
}

    
    // Filter by search query
   if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (r) =>
        (r.roomType || '').toLowerCase().includes(q) ||
        (r.roomNumber || '').toLowerCase().includes(q)
    );
  }
    
    return list;
  }, [rooms, roomTypeFilter, statusFilter, query]);
  useEffect(() => {
  setCurrentPage(1);
}, [roomTypeFilter, statusFilter, query]);

  const paginatedRooms = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return filteredRooms.slice(start, start + itemsPerPage);
}, [filteredRooms, currentPage]);

  const formatPrice = (value) => `₱${Number(value).toLocaleString()}`;
  const sliceId = (id) => `#${String(id).slice(-6)}`;

 const handleToggleAvailability = async (id) => {
  try {
    const room = rooms.find(r => r._id === id);
    if (!room) return;

    const nextStatus = (room.status === 'available') ? 'booked' : 'available';

    const res = await fetch('http://localhost:8000/api/rooms/updateRoom.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_id: id,
        status: nextStatus,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to update status:", data);
      alert(`Failed to update status: ${data.message}`);
      return;
    }

    await refetch();  // reload rooms after status update

  } catch (err) {
    console.error(err);
    alert("Failed to update room status");
  }
};




  const isAllSelected = filteredRooms.length > 0 && filteredRooms.every(r => selectedIds.includes(r._id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredRooms.some((r) => r._id === id)));
    } else {
      const addIds = filteredRooms.map((r) => r._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...addIds])));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openAddModal = () => {
  setEditingRoom(null);
  setFormData({
    roomNumber: "",
    roomType: "Dormitory Room",
    roomTypeId: roomTypeMap["Dormitory Room"],
    pricePerNight: "",
    capacityAdults: 1,
    capacityChildren: 0,
    status: "available",
  });
  setShowModal(true);
};

 const openEditModal = (room) => {
  setEditingRoom(room);
  setFormData({
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    roomTypeId: roomTypeMap[room.roomType], // <- ensure ID is set
    pricePerNight: room.pricePerNight,
    capacityAdults: room.capacityAdults || 1,
    capacityChildren: room.capacityChildren || 0,
    status: room.status || "available",
  });
  setShowModal(true);
};




  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setFormData({
      roomNumber: "",
      roomType: "Dormitory Room",
      pricePerNight: "",
      capacityAdults: 1,
      capacityChildren: 0,
      status: "available",
      
    });
  };

 const roomTypeMap = {
  "Dormitory Room": 1,
  "Superior Queen": 2,
  "Superior Twin": 3,
  "Deluxe Queen": 4,
  "Deluxe Twin": 5,
  "Presidential Queen": 6,
  "Presidential Twin": 7,
  "Family Room": 8
};

const roomTypes = ["all", ...Object.keys(roomTypeMap)];

const capitalize = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);


const handleSave = async (isUpdate = false, roomId = null) => {
  try {
    const BASE_URL = 'http://localhost:8000/api/rooms';

    // Validation
    if (!formData.roomNumber.trim()) {
      alert("Please enter a room number");
      return;
    }
    if (!formData.roomTypeId && !formData.roomType) {
      alert("Please select a valid room type");
      return;
    }

    // Get roomTypeId (from map or directly)
    const roomTypeId = formData.roomTypeId || roomTypeMap[formData.roomType];

    // Build payload
    const payload = {
      room_number: formData.roomNumber,
      room_type_id: roomTypeId,
      status: formData.status || 'available',
      type_name: formData.roomType,              // 🔹 for room_types table
      price_per_night: formData.pricePerNight,   // 🔹 for room_types table
      capacity_adults: formData.capacityAdults,  // 🔹 for room_types table
      capacity_children: formData.capacityChildren // 🔹 for room_types table
    };

    if (isUpdate) {
      payload.room_id = roomId; // include ID for updates
    }

    const url = isUpdate
      ? `${BASE_URL}/updateRoom.php`
      : `${BASE_URL}/addRoom.php`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to save room:", data);
      alert(`Failed to save room: ${data.message || 'Unknown error'}`);
      return;
    }

    alert(data.message || "Room saved successfully");
    await refetch();   // refresh the room list
    closeModal();      // close the modal
  } catch (err) {
    console.error("Error saving room:", err);
    alert("An error occurred while saving the room");
  }
};















 // Central delete function for single or multiple rooms
const deleteRooms = async (ids) => {
  if (!ids || ids.length === 0) return;

  try {
    const response = await fetch('http://localhost:8000/api/rooms/deleteBulk.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete');

    // Remove deleted rooms locally
    setRooms(prev => prev.filter(r => !ids.includes(r._id)));
    setSelectedIds(prev => prev.filter(id => !ids.includes(id)));

    alert(data.message);
  } catch (e) {
    console.error('Failed to delete rooms', e);
    alert('Failed to delete rooms: ' + e.message);
  }
};



// Single room delete now uses the same deleteRooms function
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this room?")) return;
  await deleteRooms([id]);
};

// Bulk delete uses the same function
const handleBulkDelete = async () => {
  if (selectedIds.length === 0) return;
  if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} room(s)?`)) return;

  await deleteRooms(selectedIds);
};



const handleViewBooking = async (room) => {
  if (room.status !== 'booked') {
    alert('Room is not occupied.');
    return;
  }

  try {
    const res = await fetch(`/api/bookings/room/${room._id}`);
    const data = await res.json();

    if (data.success && data.booking) {
      setEditingRoom({ ...room, booking: data.booking });
      setShowModal(true);
    } else {
      alert('No booking information found.');
    }
  } catch (e) {
    console.error('Failed to load booking info', e);
    alert('Failed to load booking info');
  }
};



  const getStatusConfig = (status) => {
    switch (status) {
      case "available":
        return { color: "bg-green-100 text-green-700 border-green-200", label: "Available" };
      case "booked":
        return { color: "bg-red-100 text-red-700 border-red-200", label: "Booked" };
      case "maintenance":
        return { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Maintenance" };
      default:
        return { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Unknown" };
    }
  };


  return (
    <div className="w-full bg-white-50 min-h-screen font-['Poppins']">
      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all room information</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected ({selectedIds.length})
                </button>
              )}
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Room
              </button>
            </div>
          </div>
        </div>

     {/* Search and Filter Section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    
    {/* Search */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
      <input
        type="text"
        placeholder="Search room number..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
      />
    </div>

    {/* Room Type Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
      <select
        value={roomTypeFilter}  // bind to filter state
        onChange={(e) => setRoomTypeFilter(e.target.value)} // update filter state
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
      >
        <option value="all">All Room Types</option> {/* show all */}
        {Object.keys(roomTypeMap).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {/* Status Filter */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
      >
        <option value="all">All Status</option>
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </div>

  </div>
</div>


        {/* Rooms Display */}
       
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
               <div className="p-4 border-b border-gray-200 text-gray-700 font-medium">
                Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}
                </div>
                <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room ID</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room Number</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Room Type</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Price per Night</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Capacity</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">View</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRooms.length === 0 ? (
  <tr>
    <td colSpan={9} className="py-12 text-center text-gray-500">
      <div className="flex flex-col items-center gap-2">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p className="text-lg font-medium">No rooms found</p>
        <p className="text-sm">Try adjusting your search or filter criteria</p>
      </div>
    </td>
  </tr>
) : (
  paginatedRooms.map((room) => {
    const statusConfig = getStatusConfig(room.status || (room.isAvailable ? "available" : "booked"));
    return (
                        <tr key={room._id} className="hover:bg-blue-50 transition-colors">
                          <td className="py-4 px-6">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-blue-600"
                              checked={selectedIds.includes(room._id)}
                              onChange={() => toggleSelectOne(room._id)}
                            />
                          </td>
        
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {sliceId(room._id)}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {room.roomNumber}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {room.roomType}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {formatPrice(room.pricePerNight)}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900">
                            {room.capacityAdults || 1} Adults, {room.capacityChildren || 0} Children
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-4 px-6">
  {room.status === 'booked' ? (
    <button
      onClick={() => handleViewBooking(room)}
      className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
      title="View Booking"
    >
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  ) : (
    <span className="text-gray-400 text-sm">—</span>
  )}
</td>


                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(room)}
                                className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-blue-100 transition-colors"
                                title="Edit Room"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(room._id)}
                                className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-red-100 transition-colors"
                                title="Delete Room"
                              >
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          </div>
          {/* Pagination Footer */}
<div className="flex justify-between items-center px5 py-3 bg-white-50 ">
  <div className="text-sm text-gray-600">
    Page {currentPage} of {Math.max(Math.ceil(filteredRooms.length / itemsPerPage), 1)} | 
    Showing {paginatedRooms.length} of {filteredRooms.length}
  </div>

  <div className="flex gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Prev
    </button>
    <button
     disabled={currentPage >= Math.ceil(filteredRooms.length / itemsPerPage) || filteredRooms.length === 0}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>
</div>

          

       {/* Add/Edit Room Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </h3>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-4">
        {editingRoom?.booking ? (
          // === Booking Info View ===
          <div className="space-y-2">
            <p><strong>Room Number:</strong> {editingRoom.roomNumber}</p>
            <p><strong>Occupied By:</strong> {editingRoom.booking.customer_name}</p>
            <p><strong>Email:</strong> {editingRoom.booking.email}</p>
            <p><strong>Phone:</strong> {editingRoom.booking.phone}</p>
            <p><strong>Check-in:</strong> {editingRoom.booking.check_in}</p>
            <p><strong>Check-out:</strong> {editingRoom.booking.check_out}</p>
          </div>
        ) : (

          
          // === Add/Edit Form ===
         <>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
      <input
        type="text"
        value={formData.roomNumber}
        onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="Enter room number"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
      <select
        value={formData.roomType}
        onChange={(e) => {
          const type = e.target.value;
          setFormData(prev => ({
            ...prev,
            roomType: type,
            roomTypeId: roomTypeMap[type],
          }));
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      >
        {Object.keys(roomTypeMap).map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night</label>
      <input
        type="number"
        value={formData.pricePerNight}
        onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder="0"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
      <select
        value={formData.status}
        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
      >
        <option value="available">Available</option>
        <option value="booked">Booked</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (Adults)</label>
      <select
        value={formData.capacityAdults}
        onChange={(e) => setFormData(prev => ({ ...prev, capacityAdults: Number(e.target.value) }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      >
        {[1, 2, 3, 4, 5, 6].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (Children)</label>
      <select
        value={formData.capacityChildren}
        onChange={(e) => setFormData(prev => ({ ...prev, capacityChildren: Number(e.target.value) }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        disabled={!!editingRoom} // 🔹 disabled in edit mode
      >
        {[0, 1, 2, 3, 4].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>
  </div>
</>

        )}
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end p-6 border-t border-gray-200 gap-3">
        <button
          onClick={closeModal}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        {!editingRoom?.booking && (
          <button
  onClick={() => handleSave(!!editingRoom, editingRoom?._id)}
  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold"
>
  {editingRoom ? 'Update Room' : 'Save Room'}
</button>

        )}
      </div>

    </div>
  </div>
)}

      </div>
    
  );
};

export default ListRoom;
>>>>>>> b84fe5c (updated backend/reservation/admin-side)
