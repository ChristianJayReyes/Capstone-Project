import connectDB from "../configs/db.js";

//GET //api // user
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({
            success: true,
            role,
            recentSearchedCities
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
        
    }
}

//Recent Searched Cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const {recentSearchedCity}= req.body;
        const user = await req.user;

        if (user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedCity)
        }else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity)
        }
        await user.save();
        res.json({
            success: true,
            message: "City added"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const db = await connectDB();
        const userId = req.user.user_id;
        const { full_name, phone, address, photo } = req.body;

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (full_name !== undefined) {
            updates.push("full_name = ?");
            values.push(full_name);
        }
        if (phone !== undefined) {
            updates.push("phone = ?");
            values.push(phone);
        }
        if (address !== undefined) {
            updates.push("address = ?");
            values.push(address);
        }
        if (photo !== undefined) {
            updates.push("photo = ?");
            values.push(photo);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        values.push(userId);

        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
        await db.query(query, values);

        // Fetch updated user
        const [updatedUser] = await db.query(
            "SELECT user_id, full_name, email, phone, address, photo, role FROM users WHERE user_id = ?",
            [userId]
        );

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser[0]
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};
 