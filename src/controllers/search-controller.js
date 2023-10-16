exports.getPlace = async (req, res, next) => {
  try {
    res.json(req.query);
  } catch (err) {
    next(err);
  }
};
