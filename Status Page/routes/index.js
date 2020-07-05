
const express = require('express');
const statusCtrl = require('../controllers/status.controller');

const router = express.Router(); // route handler 

router.get('/api/v2/shoodoo-status', statusCtrl.getStatus);

module.exports = router;
