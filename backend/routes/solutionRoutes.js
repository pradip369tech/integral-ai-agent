
const express = require("express");
const router = express.Router();

const { solveExpression } = require("../controllers/solutionController");

router.post("/", solveExpression);

module.exports = router;
