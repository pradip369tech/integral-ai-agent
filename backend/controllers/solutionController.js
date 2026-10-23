const axios = require("axios");

exports.solveExpression = async (req, res) => {
    try {
        const {
            expression,
            isDefinite,
            lowerLimit,
            upperLimit
        } = req.body;

        // Validate expression
        if (
            typeof expression !== "string" ||
            !expression.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid mathematical expression."
            });
        }

        // Validate definite integral limits
        if (
            isDefinite === true &&
            (
                lowerLimit === null ||
                lowerLimit === undefined ||
                String(lowerLimit).trim() === "" ||
                upperLimit === null ||
                upperLimit === undefined ||
                String(upperLimit).trim() === ""
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide both lower and upper limits."
            });
        }

        console.log("Expression received:", expression);
        console.log("Definite integral:", Boolean(isDefinite));

        // Forward the request to the Python API
        const pythonResponse = await axios.post(
            "http://127.0.0.1:8000/solve",
            {
                expression: expression.trim(),
                isDefinite: Boolean(isDefinite),
                lowerLimit: isDefinite ? lowerLimit : null,
                upperLimit: isDefinite ? upperLimit : null
            },
            {
                timeout: 120000,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // Return Python's response to the frontend
        return res.status(200).json(pythonResponse.data);

    } catch (error) {
        console.error(
            "Solve controller error:",
            error.response?.data || error.message
        );

        if (error.code === "ECONNREFUSED") {
            return res.status(503).json({
                success: false,
                message: "Python solver is unavailable. Please ensure the Python server is running."
            });
        }

        if (error.code === "ECONNABORTED") {
            return res.status(504).json({
                success: false,
                message: "Python solver timed out."
            });
        }

        if (error.response) {
            return res.status(error.response.status).json(
                error.response.data
            );
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the expression."
        });
    }
};