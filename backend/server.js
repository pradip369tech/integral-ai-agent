

exports.solveExpression = (req, res) => {
    const { expression, isDefinite, lowerLimit, upperLimit } = req.body;

    if (!expression || typeof expression !== "string" || !expression.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid mathematical expression."
        });
    }

    res.status(200).json({
        success: true,
        message: "Expression received successfully.",
        data: {
            expression: expression.trim(),
            isDefinite: Boolean(isDefinite),
            lowerLimit: lowerLimit ?? null,
            upperLimit: upperLimit ?? null
        }
    });
};
