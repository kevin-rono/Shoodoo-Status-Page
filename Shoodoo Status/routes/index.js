const statusRoutes = require('./status.routes');

const router = require('express').Router();

statusRoutes(router);

module.exports = router;