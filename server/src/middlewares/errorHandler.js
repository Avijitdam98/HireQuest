// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Supabase errors
  if (err.code && err.code.startsWith('PGRST')) {
    return res.status(400).json({
      error: 'Database error',
      message: err.message,
      code: err.code
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }

  // Handle authentication errors
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      error: 'Authentication error',
      message: err.message
    });
  }

  // Handle authorization errors
  if (err.name === 'AuthorizationError') {
    return res.status(403).json({
      error: 'Authorization error',
      message: err.message
    });
  }

  // Handle not found errors
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not found',
      message: err.message
    });
  }

  // Handle OpenAI API errors
  if (err.name === 'OpenAIError') {
    return res.status(503).json({
      error: 'AI service error',
      message: err.message
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong'
      : err.message
  });
};

module.exports = errorHandler;
