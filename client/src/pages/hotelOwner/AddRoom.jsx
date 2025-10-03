import React, { useState } from "react";
import "../../styles/addroom.css";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const AddRoom = () => {
  const { axios, token } = useAppContext();
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wi-Fi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Full Access": false,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // To check if all inputs are filled
    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !inputs.amenities ||
      !Object.values(images).some(image => image)
    ) {
      toast.error("Please fill in all fields and upload images.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);
      //Converting Amenities to Array & keeping only enabled Amenities
      const amenities = Object.keys(inputs.amenities).filter(
        key => inputs.amenities[key]
      );
      formData.append("amenities", JSON.stringify(amenities));

      //Adding images to form data
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const { data } = await axios.post("/api/rooms/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free Wi-Fi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Full Access": false,
          },
        });
        setImages({ 1: null, 2: null, 3: null, 4: null });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-3xl mx-auto bg-white shadow-xl p-6 rounded-2xl mt-10"
    >
      <Title
        align="center"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the form with accurate room details, pricing, and amenities."
      />

      {/* Upload Images */}
      <p className="text-lg font-medium text-gray-800 mt-8 mb-2">
        Upload Images
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.keys(images).map((key) => (
          <label
            htmlFor={`roomImage${key}`}
            key={key}
            className="relative cursor-pointer hover:opacity-90 transition"
          >
            <img
              className="h-32 w-full object-cover rounded-lg border border-dashed border-gray-300"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt={`Upload ${key}`}
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>

      {/* Room Type & Price */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-gray-700 font-medium">Room Type</label>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="mt-2 w-full border border-gray-300 rounded-md p-2 text-gray-800"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Bed">Luxury Bed</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <label className="text-gray-700 font-medium">Price /night</label>
          <input
            type="number"
            className="mt-2 w-32 border border-gray-300 rounded-md p-2 text-gray-800"
            placeholder="0"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="mt-8">
        <p className="text-gray-700 font-medium mb-2">Amenities</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          {Object.keys(inputs.amenities).map((amenity, index) => (
            <label key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputs.amenities[amenity]}
                onChange={() =>
                  setInputs({
                    ...inputs,
                    amenities: {
                      ...inputs.amenities,
                      [amenity]: !inputs.amenities[amenity],
                    },
                  })
                }
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-10">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg shadow-lg font-semibold cursor-pointer" disabled={loading}
        >
          {loading ? "Adding Room..." : "Add Room"}
        </button>
      </div>
    </form>
  );
};

export default AddRoom;
