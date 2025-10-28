module.exports = (req, res, next) => {
  if (req.user.role !== "scientist") {
    return res.status(403).json({ message: "Acceso denegado: solo científicos pueden ver esta información." });
  }
  next();
};