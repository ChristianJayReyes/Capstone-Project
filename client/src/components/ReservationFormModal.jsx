import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - data: initial data object (pre-filled)
 * - onSubmit: async function(formData)
 */
const ReservationFormModal = ({ isOpen, onClose, data, onSubmit }) => {
  const [formData, setFormData] = useState(null);

  // Initialize local state when modal opens or data changes
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        nationality: data.nationality || "",
        company: data.company || "",
        checkIn: data.checkIn || "",
        checkOut: data.checkOut || "",
        adults: data.adults || "1",
        children: data.children || "0",
        purpose: data.purpose || "",
        requests: data.requests || "",
        roomName: data.roomName || "",
        roomNumber: data.roomNumber || "",
        roomRate: data.roomRate || 0,
        roomNumbers: data.roomNumbers || [],
        roomQuantity: data.roomQuantity || 1,
        deposit: data.deposit || 0,
        payment: data.payment || "Cash",
        signature: data.signature || "",
        remarks: data.remarks || "",
        totalPrice: data.totalPrice || 0,
      });
    } else {
      setFormData(null);
    }
  }, [data, isOpen]);

  // Calculate total price automatically based on dates, room rate, and room quantity
  useEffect(() => {
    if (!formData) return;

    const calculateTotalPrice = () => {
      if (!formData.checkIn || !formData.checkOut) {
        return 0;
      }

      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);

      // Calculate number of nights
      const timeDiff = checkOutDate - checkInDate;
      const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

      // Get room rate and quantity
      const roomRate = Number(formData.roomRate) || 0;
      const roomQuantity = Number(formData.roomQuantity) || 1;

      // Calculate total: price per night * nights * number of rooms
      const totalPrice = roomRate * nights * roomQuantity;

      return totalPrice;
    };

    const newTotalPrice = calculateTotalPrice();
    // Only update if the calculated price is different from current (avoid infinite loops)
    setFormData((prev) => {
      if (prev && Math.abs(Number(prev.totalPrice) - newTotalPrice) > 0.01) {
        return { ...prev, totalPrice: newTotalPrice };
      }
      return prev;
    });
  }, [formData?.checkIn, formData?.checkOut, formData?.roomRate, formData?.roomQuantity]);

  if (!isOpen || !formData) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitLocal = async () => {
    // Basic validation: ensure required fields exist
    if (
      !formData.email ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.name ||
      !formData.phone
    ) {
      alert(
        "Please ensure Email, Check-in, Check-out, Name and Phone are filled."
      );
      return;
    }

    // Call parent onSubmit (which handles backend)
    if (typeof onSubmit === "function") {
      await onSubmit(formData);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Centered Modal with Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Reservation Details
                  </h2>
                  <p className="text-sm text-white/90">
                    Review and confirm your booking
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

            {/* Form content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Guest Info */}
              <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Guest Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Enter email address"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="Enter contact number"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="Enter address"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Nationality
                    </label>
                    <input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) =>
                        handleChange("nationality", e.target.value)
                      }
                      placeholder="Enter nationality"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Stay Info */}
              <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Stay Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Check-in Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleChange("checkIn", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Check-out Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleChange("checkOut", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Number of Adults
                    </label>
                    <input
                      value={formData.adults}
                      onChange={(e) => handleChange("adults", e.target.value)}
                      placeholder="Enter number of adults"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Number of Children
                    </label>
                    <input
                      value={formData.children}
                      onChange={(e) => handleChange("children", e.target.value)}
                      placeholder="Enter number of children"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
              </section>

              {/* Room Info */}
              <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Room Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Room Name
                    </label>
                    <input
                      value={formData.roomName}
                      onChange={(e) => handleChange("roomName", e.target.value)}
                      placeholder="Room Name"
                      readOnly
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Room Rate (per night)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₱</span>
                      <input
                        value={formData.roomRate}
                        onChange={(e) => handleChange("roomRate", e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-8 bg-gray-50 text-gray-600 cursor-not-allowed"
                        type="number"
                        readOnly
                      />
                    </div>
                  </div>
                  {formData.roomQuantity && formData.roomQuantity > 0 && (
                    <div className="flex flex-col sm:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        Number of Rooms
                      </label>
                      <div className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 font-semibold">
                        {formData.roomQuantity} Room{formData.roomQuantity > 1 ? "s" : ""}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Total Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₱</span>
                      <input
                        value={formData.totalPrice ? Number(formData.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        onChange={(e) => handleChange("totalPrice", e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-xl border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 pl-8 font-bold text-lg text-indigo-700 cursor-not-allowed focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Calculated automatically based on dates, room rate, and quantity
                    </p>
                  </div>
                </div>
              </section>


              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300 w-full sm:w-auto"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmitLocal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Reservation
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReservationFormModal;
