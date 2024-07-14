import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PatientModel as Patient } from "../models/Patient";
import { CustomRequest, customResponse } from "src/types/custom";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    let patient = await Patient.findOne({ username });

    if (patient) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    patient = new Patient({ username, password });
    await patient.save();

    const payload = { patient: { id: patient.id } };
    const token = jwt.sign(payload, process.env.KEY_TOKEN!, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await Patient.findOne({ username });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const payload = { patient: { id: user.id } };
    // Generated token
    const token = jwt.sign(payload, process.env.KEY_TOKEN!, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while logging" });
  }
};

export const getUser = async (
  req: CustomRequest,
  res: customResponse
): Promise<void> => {
  try {
    if (!req.patient) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const user = await Patient.findById(req.patient.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
