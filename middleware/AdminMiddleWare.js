const User = require('../models/userModel')
exports.AdminCheckMiddleWare = async (req, res, next) => {
  const { email } = req.user
  const adminUser = await User.findOne({ email }).exec()
  if (adminUser.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'access denied' })
  }
}
