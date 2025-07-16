import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  console.log("🔔 Clerk webhook received:", req.body);
  try {
    //Create SVIX webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    //Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    //Verifying the headers
    await whook.verify(JSON.stringify(req.body), headers);

    //Getting data from the request body
    const { data, type } = req.body;
    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    //Switch case to handle different webhook events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        console.log("User created:", userData);
        break;
      }
      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }
    res.json({
      success: true,
      message: "Webhook received and processed successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
