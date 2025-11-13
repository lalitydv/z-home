/**
 * Middleware to add mobile-specific headers
 * Helps identify mobile app requests and provides better error handling
 */

export const mobileHeaders = (req, res, next) => {
  // Add mobile app identifier if present
  const userAgent = req.headers['user-agent'] || '';
  const isMobileApp = req.headers['x-mobile-app'] === 'true' || 
                      /Mobile|Android|iOS|iPhone|iPad/i.test(userAgent);

  // Store mobile app info in request
  req.isMobileApp = isMobileApp;
  req.appVersion = req.headers['x-app-version'];
  req.platform = req.headers['x-platform']; // 'ios', 'android', 'web'

  // Add mobile-friendly headers
  if (isMobileApp) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
  }

  next();
};

