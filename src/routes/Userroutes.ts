import { Router } from "express";
import { processIdentitycontroller } from "../controllers/UserController.js";

const router = Router();

router.post("/identity", processIdentitycontroller);


export default router;