const admin = require('../Firebase/FirebaseAdmin')

exports.AuthCheck = async (req, res, next) => {
  // console.log(req.headers);

  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken)
    console.log(firebaseUser)
    req.user = firebaseUser
    next()
  } catch (error) {
    res.status(401).json('Error or unauthorised')
  }
}
