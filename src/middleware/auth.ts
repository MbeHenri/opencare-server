import jwt from "jsonwebtoken";
import { CustomRequest, customResponse } from "src/types/custom";

const auth = (
  req: CustomRequest,
  res: customResponse,
  next: () => void
): void => {
  // Received token
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // No token provided
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    // Decoded token
    const decoded = jwt.verify(token, process.env.KEY_TOKEN!) as {
      patient: { id: string; uuid: string; username: string; display: string };
    };
    req.patient = decoded.patient;
    next();
  } catch (error) {
    console.error("Token vérification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
