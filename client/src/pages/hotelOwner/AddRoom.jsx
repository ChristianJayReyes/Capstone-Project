import React, { useState } from "react";
import "../../styles/addroom.css";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";

const AddRoom = () => {
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

  return (
    <form className="max-w-3xl mx-auto bg-white shadow-xl p-6 rounded-2xl mt-10">
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
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg shadow-lg font-semibold"
        >
          Add Room
        </button>
      </div>
    </form>
  );
};

export default AddRoom;
