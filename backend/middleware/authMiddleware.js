import admin from "../firebase/firebaseAdmin.js";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ answer: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // { uid, email, name, etc. }
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error.message);
    return res.status(403).json({ answer: "Unauthorized: Invalid token" });
  }
};