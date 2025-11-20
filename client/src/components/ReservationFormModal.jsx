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
        discount: data.discount || "None",
        checkIn: data.checkIn || "",
        checkOut: data.checkOut || "",
        adults: data.adults || "1",
        children: data.children || "0",
        purpose: data.purpose || "",
        requests: data.requests || "",
        roomName: data.roomName || "",
        roomNumber: data.roomNumber || "",
        roomRate: data.roomRate || 0,
        idImage: data.idImage || null,
        idImageFile: data.idImageFile || null,
        deposit: data.deposit || 0,
        payment: data.payment || "Cash",
        signature: data.signature || "",
        remarks: data.remarks || "",
      });
    } else {
      setFormData(null);
    }
  }, [data, isOpen]);

  if (!isOpen || !formData) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitLocal = async () => {
    // Basic validation: ensure required fields exist
    if (
      !formData.email ||
      !formData.checkIn ||
      !formData.checkOut
    ) {
      alert(
        "Please ensure Email, Check-in and Check-out are filled."
      );
      return;
    }

    // Validate discount and ID image
    if (formData.discount && formData.discount !== "None" && !formData.idImage) {
      alert("Please upload your ID image to avail the discount.");
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Reservation Details
                </h2>
                <p className="text-sm text-gray-500">
                  Review and submit reservation
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Form content */}
            <div className="space-y-6">
              {/* Guest Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Guest Full Name"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <input
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Email Address"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Contact Number"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Address"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) =>
                      handleChange("nationality", e.target.value)
                    }
                    placeholder="Nationality"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </section>

              {/* Stay Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Stay Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Check-in</span>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleChange("checkIn", e.target.value)}
                      className="rounded-lg border px-3 py-2"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-xs text-gray-500">Check-out</span>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleChange("checkOut", e.target.value)}
                      className="rounded-lg border px-3 py-2"
                    />
                  </label>

                  <input
                    value={formData.adults}
                    onChange={(e) => handleChange("adults", e.target.value)}
                    placeholder="Number of Adults"
                    className="rounded-lg border px-3 py-2"
                    type="number"
                  />
                  <input
                    value={formData.children}
                    onChange={(e) => handleChange("children", e.target.value)}
                    placeholder="Number of Children"
                    className="rounded-lg border px-3 py-2"
                    type="number"
                  />

                  <input
                    value={formData.discount}
                    onChange={(e) => handleChange("discount", e.target.value)}
                    id="discountType"
                    placeholder="Type of Discount"
                    className="rounded-lg border px-3 py-2 col-span-2"
                  />
                </div>
              </section>

              {/* Room Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Room Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    value={formData.roomName}
                    onChange={(e) => handleChange("roomName", e.target.value)}
                    placeholder="Room Name"
                    readOnly
                    className="rounded-lg border px-3 py-2 bg-gray-50"
                  />
                  <input
                    id="roomNumber"
                    value={formData.roomNumber}
                    placeholder="Room Number"
                    readOnly
                    className="rounded-lg border px-3 py-2 bg-gray-50"
                  />
                  <input
                    value={formData.roomRate}
                    onChange={(e) => handleChange("roomRate", e.target.value)}
                    placeholder="Room Rate"
                    className="rounded-lg border px-3 py-2"
                    type="number"
                  />
                </div>
              </section>

              {/* Discount & ID Image */}
              {(formData.discount && formData.discount !== "None") && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Discount Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Discount Type:</p>
                      <p className="font-semibold text-blue-700">{formData.discount}</p>
                      <p className="text-xs text-gray-500 mt-1">20% discount will be applied</p>
                    </div>
                    {formData.idImage && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Uploaded ID:</p>
                        <img 
                          src={formData.idImage} 
                          alt="ID" 
                          className="w-full max-w-md h-48 object-contain border rounded-lg bg-gray-50"
                        />
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Financial & Other */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Payment & Other
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id="deposit"
                    value={formData.deposit}
                    onChange={(e) => handleChange("deposit", e.target.value)}
                    placeholder="Deposit"
                    className="rounded-lg border px-3 py-2"
                    type="number"
                  />
                  <select
                    id="paymentMode"
                    value={formData.payment}
                    onChange={(e) => handleChange("payment", e.target.value)}
                    className="rounded-lg border px-3 py-2"
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>GCash</option>
                  </select>

                  <input
                    value={formData.signature}
                    onChange={(e) => handleChange("signature", e.target.value)}
                    placeholder="Signature (type name)"
                    className="rounded-lg border px-3 py-2 col-span-2"
                  />
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    placeholder="Remarks / Special instructions"
                    className="rounded-lg border px-3 py-2 col-span-2"
                    rows={3}
                  />
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmitLocal}
                  className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
                >
                  Submit Reservation
                </button>
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
