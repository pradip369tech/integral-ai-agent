import sys
from pathlib import Path

sys.path.insert(
    0, str(Path(__file__).resolve().parent.parent)
)

from rag.verifier import verify_antiderivative

# UT-05: Incorrect Antiderivative Verification

question = "Evaluate the integral ∫ x² dx"
integrand = "x**2"
antiderivative = "x**3/2"

result = verify_antiderivative(
    integrand=integrand,
    antiderivative=antiderivative,
    variable="x"
)

print("UT-05: SYMBOLIC VERIFIER — INCORRECT ANTIDERIVATIVE")

print("\nQuestion:", question)
print("Integrand:", integrand)
print("Proposed antiderivative:", antiderivative)
print("Expected answer: x³/3 + C")

print("\nVerification result:", result)

assert result is False, "UT-05 FAILED: Incorrect antiderivative accepted."

print("\nTEST STATUS: UT-05 PASSED")
print("Output: Incorrect antiderivative correctly rejected.")