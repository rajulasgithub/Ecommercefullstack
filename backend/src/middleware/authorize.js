const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userData || req.userData.role === undefined) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized. Authentication required before role check."
      });
    }

    const userRole = Number(req.userData.role);
    const hasRole = allowedRoles.map(Number).includes(userRole);

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
