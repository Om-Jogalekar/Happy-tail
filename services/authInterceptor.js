const jwt = require('jsonwebtoken');

const PUBLIC_ROUTES = [
    { method: "POST", regex: /^\/users\/?$/ },
    { method: "POST", regex: /^\/users\/login$/ },
    { method: "GET", regex: /^\/uploads\/.+/ }
];

module.exports = (req, res, next) => {

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        route.method === req.method && route.regex.test(req.url)
    );

    // Skip JWT validation for login and signup routes
    if (isPublicRoute) {
        return next(); // Skip token validation
    }

    // Get token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Attach the decoded token data to the request object
        req.appUser = {
            id: decoded.id,
            email: decoded.email,
            category: decoded.category,
        };

        next();
    });
};