import * as authService from '../services/authService.js';
import bcrypt from 'bcrypt';
import { generateJWT } from '../utils/middleware.js';

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const { data: user, error } = await authService.findUserByUsername(username);
    if (error || !user) return res.status(401).json({ error: 'Invalid username or password' });
    const valid = await bcrypt.compare(password, user.hashed_password);
    if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

    res.json({
      token: generateJWT({ user_id: user.user_id, username: user.username, role: user.role }),
      user_id: user.user_id,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function signup(req, res) {
  const { username, password, role } = req.body;
  try {

    const { data: existingUser } = await authService.findUserByUsername(username);
    if (existingUser) return res.status(409).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await authService.createUser({ username, hashedPassword, role });
    if (error) return res.status(500).json({ error: 'Error creating user' });

    const token = generateJWT({ user_id: newUser.user_id, username, role });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user_id: newUser.user_id,
      username,
      role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}