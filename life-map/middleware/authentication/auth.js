/**
 * Middleware functions to check if user is authenticated/not authenticated
 */
function auth() {
  let methods = {};

  methods.checkAuthenticated = (req, res, next) => {
    console.log("checking auth");
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/login");
  };

  methods.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/homepage");
    }
    next();
  };

  return methods;
}

module.exports = auth();
