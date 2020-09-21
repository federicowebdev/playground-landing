//in questo file organizzo le route per gli url http chiamanti le API
const express = require('express');

const tabsController = require('../controllers/tabsController');

const router = express.Router();

router
  .route('/:id')
  .get(tabsController.getTabs);

module.exports = router;
