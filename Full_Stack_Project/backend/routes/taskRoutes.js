const express = require('express');
const router = express.Router();

const {addTask} = require("../controllers/taskController");

router.post('/addtask', addTask)

module.exports = router