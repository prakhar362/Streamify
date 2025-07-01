import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {createGroup,
    getMyGroups,
    sendGroupRequest,
    acceptGroupRequest,
    getGroupRequests,
    getOutgoingGroupReqs} from '../controllers/group.controller.js'


const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.post("/create",createGroup);
router.get("/", getMyGroups);

router.post("/group-request/:id", sendGroupRequest);
router.put("/group-request/:id/accept", acceptGroupRequest);

router.get("/group-requests", getGroupRequests);
router.get("/outgoing-group-requests", getOutgoingGroupReqs);

export default router;