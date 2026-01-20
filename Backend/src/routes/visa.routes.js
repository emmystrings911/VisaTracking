import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireStatus } from "../middlewares/requireStatus.middleware.js";
import { USER_STATUS } from "../models/User.js";
import {
  lookupVisa,
  getRecentLookups,
  saveRequirement, getSavedRequirements, removeSavedRequirement
} from "../controllers/visa.controller.js";

const router = express.Router();

router.get(
  "/visa/lookup",
  authMiddleware,
  requireStatus([USER_STATUS.ACTIVE]),
  lookupVisa
);

router.get(
  "/visa/recent",
  authMiddleware,
  requireStatus([USER_STATUS.ACTIVE]),
  getRecentLookups
);

router.post(
  "/visa/save",
  authMiddleware,
  requireStatus([USER_STATUS.ACTIVE]),
  saveRequirement
);

router.get(
  "/visa/saved",
  authMiddleware,
  requireStatus([USER_STATUS.ACTIVE]),
  getSavedRequirements
);
// routes/visa.routes.js
router.delete("/saved/:id",  authMiddleware,
  requireStatus([USER_STATUS.ACTIVE]), removeSavedRequirement);


export default router;
