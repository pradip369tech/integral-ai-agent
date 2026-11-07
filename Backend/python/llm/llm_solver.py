
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model_name="qwen/qwen3.8-27b",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
    max_tokens=800
)


def solve_with_llm(
    expression,
    is_definite,
    lower_limit=None,
    upper_limit=None,
    retrieved_formula=""
):
    """Solve an integral using retrieved knowledge-base formulas."""

    integral_type = (
        "Definite integral"
        if is_definite
        else "Indefinite integral"
    )

    prompt = f"""
You are a general-purpose integration solver.

USER EXPRESSION:
{expression}

INTEGRAL TYPE:
{integral_type}

LOWER LIMIT:
{lower_limit}

UPPER LIMIT:
{upper_limit}

RETRIEVED KNOWLEDGE-BASE FORMULAS:
{retrieved_formula}

STRICT RULES:

1. Solve the exact expression provided by the user.

2. Use the retrieved knowledge-base formulas. Do not claim that
   a formula is available if it was not supplied.

3. If the required integration formula is missing, return exactly:
Required formula is not available or applicable in the knowledge base.

4. GENERAL INTEGRATION BY PARTS:
   When applicable, use:
   Integral(u dv) = uv - Integral(v du)

5. Select u and dv appropriately. Differentiate u to obtain du
   and integrate dv to obtain v using available formulas.

6. REPEATED INTEGRATION BY PARTS:
   If the remaining integral still requires integration by parts,
   apply the rule again. Continue as necessary until the integral
   is evaluated or a required formula is unavailable.

7. CYCLIC INTEGRATION BY PARTS:
   If the original integral reappears after applying integration
   by parts, introduce a variable for the original integral,
   rearrange the resulting equation, and solve for that variable.

8. POLYNOMIAL PRODUCTS:
   When appropriate, repeatedly differentiate the polynomial
   until its derivatives become zero.

9. EXPONENTIAL AND TRIGONOMETRIC PRODUCTS:
   Use repeated integration by parts when applicable. If the
   original integral reappears, solve the resulting equation.

10. OTHER FORMULAS:
    Use the supplied power, logarithmic, exponential,
    trigonometric, inverse-trigonometric, and other applicable
    formulas when available.

11. ALGEBRA:
    Simplify intermediate expressions carefully. Do not skip
    necessary steps or invent mathematical identities.

12. DEFINITE INTEGRALS:
    Find the antiderivative, substitute the upper and lower limits,
    and calculate F(upper limit) - F(lower limit).

13. INDEFINITE INTEGRALS:
    Include the constant of integration C.

14. Do not memorize a particular example. Apply the general
    integration rules to the supplied expression.

15. If the integral cannot be completed using the supplied
    formulas, state that the required formula is unavailable.
    Do not fabricate a final answer.

16. Do not use LaTeX. Use readable plain-text mathematical
    expressions.

OUTPUT FORMAT:

Step 1:
Expression: [current expression]
Formula used: [formula from the knowledge base]

Step 2:
Expression: [substitution or calculation]
Formula used: [formula or algebraic simplification]

Continue with additional steps when necessary.

Final Answer: [final result]

Include only the calculation steps and the final answer.
Do not add introductions or concluding paragraphs.

Solve the integral now.
"""

    response = llm.invoke(prompt)

    return response.content
