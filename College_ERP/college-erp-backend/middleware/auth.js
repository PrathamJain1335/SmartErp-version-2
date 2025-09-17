const jwt = require('jsonwebtoken');
const { Student, Faculty } = require('../models');

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user details based on role
    let user = null;
    if (decoded.role === 'student') {
      user = await Student.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    } else if (decoded.role === 'faculty') {
      user = await Faculty.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    } else if (decoded.role === 'admin') {
      // For admin, we'll use a simple object since admin might not be in database
      user = {
        id: decoded.id || 'admin-001',
        role: 'admin',
        email: decoded.email || 'admin@jecrc.ac.in'
      };
    }

    if (!user && decoded.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active (for students and faculty)
    if (decoded.role !== 'admin' && user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Add user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: user.Email_ID || user.email,
      ...user
    };

    // Update last login time
    if (decoded.role === 'student') {
      await Student.update(
        { lastLogin: new Date() },
        { where: { id: decoded.id } }
      );
    } else if (decoded.role === 'faculty') {
      await Faculty.update(
        { lastLogin: new Date() },
        { where: { Faculty_ID: decoded.id } }
      );
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to authorize specific roles
 * @param {Array} allowedRoles - Array of roles that can access the route
 */
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed'
      });
    }
  };
};

/**
 * Middleware to check if user owns the resource
 * Useful for routes like /api/students/:id where student can only access their own data
 */
const authorizeResourceOwner = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Admin can access all resources
      if (req.user.role === 'admin') {
        return next();
      }

      const resourceId = req.params[resourceIdParam];
      const userId = req.user.id;

      // Check if user is trying to access their own resource
      if (resourceId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.'
        });
      }

      next();
    } catch (error) {
      console.error('Resource owner authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization failed'
      });
    }
  };
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id || user.Student_ID || user.Faculty_ID,
    role: user.role,
    email: user.Email_ID || user.email
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Verify JWT token without middleware (utility function)
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware for optional authentication
 * Sets req.user if token is valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // No token, continue without setting req.user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user details
    let user = null;
    if (decoded.role === 'student') {
      user = await Student.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    } else if (decoded.role === 'faculty') {
      user = await Faculty.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
    } else if (decoded.role === 'admin') {
      user = {
        id: decoded.id,
        role: 'admin',
        email: decoded.email || 'admin@jecrc.edu'
      };
    }

    if (user && (decoded.role === 'admin' || user.isActive !== false)) {
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: user.Email_ID || user.email,
        ...user
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without setting req.user
    next();
  }
};

/**
 * Rate limiting per user (requires authentication)
 */
const userRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next(); // Skip rate limiting if not authenticated
    }

    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or initialize user's request log
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }

    const requests = userRequests.get(userId);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    validRequests.push(now);
    userRequests.set(userId, validRequests);
    
    next();
  };
};

/**
 * Middleware to log authentication events
 */
const logAuthEvents = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    try {
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Log failed authentication attempts
      if (res.statusCode === 401 && responseData.message) {
        console.warn(`🔒 Failed auth attempt: ${req.ip} - ${responseData.message} - ${req.originalUrl}`);
      }
      
      // Log successful authentication
      if (req.user && req.originalUrl.includes('/auth/')) {
        console.log(`✅ Auth success: ${req.user.role} ${req.user.id} from ${req.ip}`);
      }
    } catch (error) {
      // Ignore JSON parsing errors
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeResourceOwner,
  generateToken,
  verifyToken,
  optionalAuth,
  userRateLimit,
  logAuthEvents
};