
export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Check if user already has a hotel
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.json({
        success: false,
        message: "Hotel already registered",
      });
    }

    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
    });

    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({
      success: true,
      message: "Hotel registered successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
