const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Check if token is provided in the headers
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify and decode the token using your JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Return an error if token verification fails
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
