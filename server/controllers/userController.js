//GET //api // user
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedRooms = req.user.recentSearchedRooms;
        res.json({
            success: true,
            role,
            recentSearchedRooms
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
        
    }
}


export const storeRecentSearchedRooms = async (req, res) => {
    try {
        const {recentSearchedRoom}= req.body;
        const user = await req.user;

        if (user.recentSearchedRooms.length < 3){
            user.recentSearchedRooms.push(recentSearchedRoom)
        }else {
            user.recentSearchedRooms.shift();
            user.recentSearchedRooms.push(recentSearchedRoom)
        }
        await user.save();
        res.json({
            success: true,
            message: "Room added"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
