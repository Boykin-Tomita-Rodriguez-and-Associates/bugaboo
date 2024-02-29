/* Retrieves user from response object and restricts non-admin users from accessing the route */
const adminProtected = async (req, res, next) => {
  const user = res.locals.user[0];
  if (!user.isAdmin) {
    res.status(403).json({ error: "Forbidden: Admin access only" });
  } else {
    next();
  }
};

module.exports = { adminProtected };
