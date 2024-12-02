// middleware.js

const myMiddleware = (req, res, next) => {
  console.log('Middleware called');
  next(); // Pass control to the next middleware or route handler
};

// Export the middleware function correctly
module.exports = myMiddleware;