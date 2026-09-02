// Usage: router.post("/jobs", authMiddleware, checkRole("recruiter"), createJob)
// Must run AFTER authMiddleware so req.user is already set.

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This action requires role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

export default checkRole;