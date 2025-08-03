import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  console.log("Clerk webhook received:", req.body);

  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };
    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting data from the request body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    switch (type) {
      case "user.created": {
        try {
          await User.create(userData);
          console.log("✅ User created and saved to MongoDB:", userData);
        } catch (err) {
          console.error("❌ Failed to create user:", err);
        }
        break;
      }

      case "user.updated": {
        try {
          await User.findByIdAndUpdate(data.id, userData);
          console.log("🔄 User updated:", data.id);
        } catch (err) {
          console.error("❌ Update failed:", err);
        }
        break;
      }

      case "user.deleted": {
        try {
          await User.findByIdAndDelete(data.id);
          console.log("🗑️ User deleted:", data.id);
        } catch (err) {
          console.error("❌ Delete failed:", err);
        }
        break;
      }

      default:
        console.log("Unhandled webhook type:", type);
        break;
    }

    res.json({
      success: true,
      message: "Webhook received and processed successfully",
    });
  } catch (error) {
    console.error("❌ Clerk webhook verification failed:", error);
    res.json({ success: false, message: error });
  }
};

export default clerkWebhooks;
