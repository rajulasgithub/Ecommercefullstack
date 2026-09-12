const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userData || !req.userData.role) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized. Authentication required before role check."
      });
    }

    const userRole = String(req.userData.role).toLowerCase();
    const hasRole = allowedRoles.map(r => String(r).toLowerCase()).includes(userRole);

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Forbidden. You do not have permission to perform this action."
      });
    }

    next();
  };
};

module.exports = { checkRole };
