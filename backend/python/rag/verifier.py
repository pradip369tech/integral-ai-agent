import sympy as sp


def verify_antiderivative(integrand, antiderivative, variable="x"):
    """
    Verify an antiderivative by differentiating it.

    Returns True if dF/dx equals f(x), otherwise False.
    """

    try:
        x = sp.Symbol(variable)

        f = sp.sympify(integrand)
        F = sp.sympify(antiderivative)

        derivative = sp.diff(F, x)
        difference = sp.simplify(derivative - f)

        return difference == 0

    except (sp.SympifyError, TypeError, ValueError):
        return False