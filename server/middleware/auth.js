const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    req.userId = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    req.userId = null;
    next();
  }
}

module.exports = authenticate;
