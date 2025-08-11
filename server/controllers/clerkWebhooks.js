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

    // Verify signature
    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };
        await User.create(userData);
        console.log("✅ User created:", userData);
        break;
      }

      case "user.updated": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData);
        console.log("📝 User updated:", userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("❌ User deleted:", data.id);
        break;
      }

      default:
        console.log("Unhandled webhook type:", type);
    }

    res.json({
      success: true,
      message: "Webhook received and processed successfully",
    });
  } catch (error) {
    console.error("❌ Clerk webhook verification failed:", error);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
