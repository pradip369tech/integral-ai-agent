import sys
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_DIR))
sys.path.insert(0, str(PROJECT_DIR / "llm"))

from llm_solver import solve_with_llm
from rag.retriever import retrieve_formula

print("UT-08: UNSUPPORTED INTEGRAL TEST")

expression = "FourierTransform(x)"
formula = retrieve_formula(expression)

print("\nQuestion:", expression)
print("Retrieved formula:", formula if formula else "None")

if not formula:
    print("\nTEST STATUS: UT-08 PASSED")
    print("No applicable formula was retrieved.")
else:
    response = solve_with_llm(
        expression=expression,
        is_definite=False,
        retrieved_formula=formula
    )
    print("\nLLM Response:")
    print(response)
    print("\nReview required: a formula was retrieved.")