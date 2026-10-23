import sys
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_DIR))
sys.path.insert(0, str(PROJECT_DIR / "llm"))

from llm_solver import solve_with_llm
from rag.retriever import retrieve_formula

print("UT-07: LLM OUTPUT FORMAT TEST")

expression = "x^2"
formula = retrieve_formula("power rule integration")

response = solve_with_llm(
    expression=expression,
    is_definite=False,
    retrieved_formula=formula
)

print("\nLLM Response:")
print(response)

assert response.strip(), "FAILED: Empty LLM response."
assert "Step 1:" in response, "FAILED: Step 1 is missing."
assert "Formula used:" in response, "FAILED: Formula used is missing."
assert "Final Answer:" in response, "FAILED: Final answer is missing."

print("\nTEST STATUS: UT-07 PASSED")