import { Router } from "express";
import { solicitarRestablecimiento, restablecerContrasena } from "../controllers/restablecerContrasenaController.js";

const router = Router();


router.post("/restablecer", solicitarRestablecimiento);


router.put("/restablecer/:token", restablecerContrasena);

export default router;
