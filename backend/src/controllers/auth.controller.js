const prisma = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  console.log("[AUTH REGISTER REQUEST]", { ...req.body, password: '***' });
  try {
    const { name, email, phone, password, role, dob, address, documentUrl, nrc } = req.body;

    // Allow registering only strictly BORROWER or AGENT from public endpoint
    const allowedRoles = ['BORROWER', 'AGENT'];
    const userRole = allowedRoles.includes(role) ? role : 'BORROWER';

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      isVerified: false,
      isApproved: false,
      status: 'pending_approval'
    };
    if (dob) userData.dob = new Date(dob);
    if (address) userData.address = address;
    if (documentUrl) userData.documentUrl = documentUrl;
    if (nrc) userData.nrc = nrc;

    const user = await prisma.user.create({ data: userData });

    console.log("[AUTH REGISTER SUCCESS]", user.id);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("[AUTH REGISTER ERROR]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerBorrower = async (req, res) => {
  req.body.role = 'BORROWER';
  return register(req, res);
};

const registerAgent = async (req, res) => {
  req.body.role = 'AGENT';
  return register(req, res);
};

const login = async (req, res) => {
  console.log("[AUTH LOGIN REQUEST]", { ...req.body, password: '***' });
  try {
    const { email, password } = req.body;
    
    let user = await prisma.user.findUnique({ where: { email } });
    
    // Self-healing: Create default admin if missing and credentials match
    if (!user && email === 'admin@lendanet.com' && password === 'password123') {
      const hashedPassword = await hashPassword('password123');
      user = await prisma.user.create({
        data: {
          name: 'System Admin',
          email: 'admin@lendanet.com',
          phone: '0000000001',
          password: hashedPassword,
          role: 'ADMIN',
          isVerified: true,
          isApproved: true,
          status: 'active'
        }
      });
    }

    // Self-healing: Create default staff if missing
    if (!user && email === 'staff@lendanet.com' && password === 'password123') {
      const hashedPassword = await hashPassword('password123');
      user = await prisma.user.create({
        data: {
          name: 'Global Node',
          email: 'staff@lendanet.com',
          phone: '0000000002',
          password: hashedPassword,
          role: 'STAFF',
          isVerified: true,
          isApproved: true,
          status: 'active'
        }
      });
    }

    // Self-healing: Create default borrower if missing
    if (!user && email === 'borrower@lendanet.com' && password === 'password123') {
      const hashedPassword = await hashPassword('password123');
      user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'borrower@lendanet.com',
          phone: '0000000003',
          password: hashedPassword,
          role: 'BORROWER',
          isVerified: true,
          isApproved: true,
          status: 'active'
        }
      });
    }

    // Self-healing: Create default agent if missing and credentials match
    if (!user && email === 'agent@lendanet.com' && password === 'password123') {
        const hashedPassword = await hashPassword('password123');
        user = await prisma.user.create({
          data: {
            name: 'Demo Agent',
            email: 'agent@lendanet.com',
            phone: '0000000004',
            password: hashedPassword,
            role: 'AGENT',
            isVerified: true,
            isApproved: true,
            status: 'active'
          }
        });
      }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Self-healing: Auto-approve demo accounts if they got unapproved
    const demoAccounts = ['admin@lendanet.com', 'staff@lendanet.com', 'borrower@lendanet.com', 'agent@lendanet.com'];
    if (demoAccounts.includes(email) && !user.isApproved) {
      user = await prisma.user.update({
        where: { email },
        data: { isApproved: true, status: 'active', role: email.split('@')[0].toUpperCase().replace('ROWER', 'ROWER') } // ensure role is correct just in case
      });
      if (email === 'borrower@lendanet.com') user.role = 'BORROWER'; // Fix potential override
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is approved (Admin bypass)
    if (!user.isApproved && user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Your account is pending admin approval' });
    }

    const token = generateToken(user.id, user.role);

    console.log("[AUTH LOGIN SUCCESS]", user.id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("[AUTH LOGIN ERROR]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, role: true, isVerified: true, isApproved: true, status: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role.toLowerCase() }
    });
  } catch (error) {
    console.error("[AUTH ME ERROR]", error.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { register, login, registerBorrower, registerAgent, getMe };
