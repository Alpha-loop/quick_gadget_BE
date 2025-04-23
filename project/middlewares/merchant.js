const merchantMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'merchant') {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have permission to perform this action',
    });
  }
  next();
};

module.exports = merchantMiddleware;