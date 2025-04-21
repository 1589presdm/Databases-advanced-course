import { Router } from "express";
import {
  getAllData,
  getDataById,
  addData,
  getUsersRecords,
  addManyData,
} from "../mongodb.js";

let router = Router();

router.get("/", async (req, res) => {
  res.json(await getAllData());
});

router.get("/users_records", async (req, res) => {
  try {
    const result = await getUsersRecords();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users records" });
  }
});

router.get("/:id", async (req, res) => {
  res.json(await getDataById(req.params.id));
});

router.post("/", async (req, res) => {
  try {
    const result = await addData(req.body);
    if (result.insertedId) {
      res.status(201).json({ ...req.body, _id: result.insertedId });
    } else {
      res.status(500).json({ error: "Unknown database error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/addmany/:count", async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    if (isNaN(count) || count <= 0) {
      return res.status(400).json({ error: "Invalid count" });
    }

    await addManyData(count);
    res.json({ message: `Added ${count} random users to data.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
