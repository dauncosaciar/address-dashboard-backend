import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  res.json({ message: "Desde login" });
});

export default router;
