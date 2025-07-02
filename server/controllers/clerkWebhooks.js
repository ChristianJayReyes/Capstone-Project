import { response } from "express";
import User from "../models/User.js";
import { Webhook } from "svix";


const clerkWebhooks = async (req, res) => {
    try{
        //Create SVIX webhook instance
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        //Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headersp["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        //Verifying the webhook
        await whook.verify(JSON.stringify(req.body), headers);

        //Getting data from the request body
        const {data, type} = req.body
        const userdata = {
            _id : data.id,
            email : data.email_addresses[0].email_addresses,
            username : data.first_name + " " + data.last_name,
            image : data.profile_image_url 
        }

        //Switch case to handle different webhook events
        switch (type) {
            case "user.created": {
                await User.create(userdata);
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data._id, userData);
                break;    
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data._id, userData);
                break;    
            }
            default:
                break;
        }
        response.JSON({
            success: true, message : "Webhook received and processed successfully"});
    } catch (error){
        console.error("Error processing webhook:", error);
        res.JSON({success: false, message: error.message});
    }
}

export default clerkWebhooks;
