const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: Object.values(err.errors).map(val => val.message)
    });
  }

  res.status(500).json({ error: 'Server error' });
};