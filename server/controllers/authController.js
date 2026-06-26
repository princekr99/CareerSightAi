// Simple auth controller with JWT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');
const { isMongoEnabled } = require('../utils/dbState');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    if (isMongoEnabled()) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    }

    const existingMemoryUser = memoryStore.users.find((user) => user.email === email);
    if (existingMemoryUser) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = { _id: randomUUID(), name, email, password: hash };
    memoryStore.users.push(user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isMongoEnabled()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    }

    const user = memoryStore.users.find((candidate) => candidate.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login };
