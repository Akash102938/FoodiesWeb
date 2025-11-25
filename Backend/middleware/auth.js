import jwt from 'jsonwebtoken';

const authMiddleWare = (req, res, next) => {
  try {
    // Safely get token from cookies or headers
    const token =
      (req.cookies && req.cookies.token) ||
      (req.headers && req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Token missing or not provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    const message =
      error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(403).json({ success: false, message });
  }
};

export default authMiddleWare;
