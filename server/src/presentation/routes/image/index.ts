import express from "express";
import { asyncHandler } from "../../../shared/helpers/asyncHandler";
import { ImageController } from "../../controllers/image.controller";
import { uploadMemory } from "../../../shared/configs/multer.config";
import { container } from "../../../infrastructure/di/inversify.config";
import { TYPES } from "../../../shared/constants/types";

const router = express.Router();
const controller = container.get<ImageController>(TYPES.ImageController);

router.post(
    "/upload/product",
    uploadMemory.single("file"),
    asyncHandler(controller.uploadImageFromLocalS3.bind(controller))
);

export default router;