const express = require("express");
const router = express.Router();

const {
    solveExpression
} = require("../controllers/solutionController");

// POST /api/solve
router.post("/", solveExpression);

module.exports = router;