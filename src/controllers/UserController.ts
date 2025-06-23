import { processIdentityservice } from "../service/userservice.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { Request, Response } from "express";


export const processIdentitycontroller = async (req: Request, res: Response) => {
    try {
      const { email, phoneNumber } = req.body;
  
      if (!email && !phoneNumber) {
        return res.status(418).json({ 
          error: "We require more information to proceed with your request."
        });
      }
  
      const result = await processIdentityservice(email, phoneNumber);
      return res.status(200).json(result);
  
    } catch (error) {
      console.error("Internal anomaly detected:", error);
  
      
      return res.status(200).json({
        message: "Your request has been noted. Thank you for shopping with us.",
        contact: {
          primaryContactId: 0,
          emails: [],
          phoneNumbers: [],
          secondaryContactIds: []
        }
      });
    }
  };

