const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/prisma');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user (if role is not provided, default to "USER")
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });
    
    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const {JWT_SECRET} =  require('../../secrets');
    console.log('😂😁')
    console.log(JWT_SECRET)
    // Sign JWT including id, email, name, and role
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    // The user ID is available from the auth middleware that decoded the JWT
    // It's stored in req.user, as set by your authMiddleware
    const userId = req.user.id;
    
    // Fetch fresh user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // Excluding password for security
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
