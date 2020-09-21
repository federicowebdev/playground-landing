//in questo file organizzo le route per gli url http chiamanti le API
const express = require('express');

const { getConfig, createResult } = require('../controllers/tabsController');

const router = express.Router();

router.route('/').get(getConfig).post(createResult);

module.exports = router;
