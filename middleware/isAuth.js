const isAuth = (req, res, next) => {
  console.log('user',req.session.user)
    if (req.session.user) {
      next()
    } 
  }

  module.exports = isAuth;