import { Router } from "express";
import {
  getAllData,
  getDataById,
  addData,
  getUsersRecords,
} from "../database.js";

let router = Router();

router.get("/", async (req, res) => {
  res.json(await getAllData());
});

router.get("/:id", async (req, res) => {
  res.json(await getDataById(req.params.id));
});

router.post("/", async (req, res) => {
  let exist = await getDataById(req.body.id);
  if (exist[0]) {
    res.status(409).json({ error: "record already exists" });
  } else {
    let result = await addData(req.body);
    if (result.affectedRows) res.json(req.body);
    else res.status(500).json({ error: "unknown database error" });
  }
});

router.get("/users_records", async (req, res) => {
  try {
    const result = await getUsersRecords();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users records" });
  }
});

export default router;
