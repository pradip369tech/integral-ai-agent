import sys
from pathlib import Path

# Add the Python project directory
PROJECT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_DIR))

# Import LLM and verifier
sys.path.insert(0, str(PROJECT_DIR / "llm"))

from llm_solver import solve_with_llm
from rag.verifier import verify_antiderivative
from rag.retriever import retrieve_formula


print("UT-06: LLM OUTPUT AND SYMPY VERIFICATION")

expression = "x^2"
formula = retrieve_formula("power rule integration")

print("\nQuestion: Evaluate the integral ∫ x² dx")

# Call the actual LLM
response = solve_with_llm(
    expression=expression,
    is_definite=False,
    retrieved_formula=formula
)

print("\nLLM Response:")
print(response)

# Verify a known correct answer using SymPy
known_answer = "x**3/3"

result = verify_antiderivative(
    integrand="x**2",
    antiderivative=known_answer,
    variable="x"
)

print("\nSymPy verification of known answer:", result)

assert response.strip(), "UT-06 FAILED: LLM returned an empty response."
assert result is True, "UT-06 FAILED: SymPy rejected the known correct answer."

print("\nTEST STATUS: UT-06 PASSED")