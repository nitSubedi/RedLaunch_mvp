import * as authService from '../services/authenticationService.js';
import bcrypt from 'bcrypt';
import { generateJWT } from '../utils/middleware.js';

export async function login(req, res) {
  const { username, password } = req.body;
  console.log("Login route hit"); 
  console.log("Request body:", req.body); // Log the request body

  try {
    const { data: user, error } = await authService.findUserByUsername(username);
    if (error || !user) {
      console.log("User not found or error:", error);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    console.log("Login attempt:", username);
    console.log("User from DB:", user);
    console.log("Password from request:", password);
    console.log("Hashed password from DB:", user.hashed_password);

    const valid = await bcrypt.compare(password, user.hashed_password);
    console.log("Password valid?", valid);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
      token: generateJWT({ user_id: user.user_id, username: user.username, role: user.role }),
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function signup(req, res) {
  const { username, password, role } = req.body;
  try {
    const { data: existingUser } = await authService.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const { data, error } = await authService.createUser({
      username,
      hashedPassword,
      role,
    });
    if (error) {
      console.error("Error creating user:", error); 
      return res.status(500).json({ error: error.message || "Error creating user" });
    }
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message || "Error creating user" });
  }
}