import { Router } from "express";
import { autoSendEmailController } from "../../controllers/email/autoSend.controller";
import { manualSendEmailController } from "../../controllers/email/manualSend.controller";
import { getLeadsController } from "../../controllers/email/getLeads.controller";
import { getDraftsController, editDraftController, sendDraftController } from "../../controllers/email/drafts.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();

router.post("/send", authMiddleware, autoSendEmailController);
router.post("/send-manual", authMiddleware, manualSendEmailController);
router.get("/leads", authMiddleware, getLeadsController);
router.get("/drafts", authMiddleware, getDraftsController);
router.put("/drafts/:id", authMiddleware, editDraftController);
router.post("/drafts/:id/send", authMiddleware, sendDraftController);

export default router;