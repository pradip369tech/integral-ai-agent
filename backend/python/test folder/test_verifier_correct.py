import sys
from pathlib import Path

sys.path.insert(
    0, str(Path(__file__).resolve().parent.parent)
)

from rag.verifier import verify_antiderivative

# UT-04: Correct Antiderivative Verification

question = "Evaluate the integral ∫ x² dx"
integrand = "x**2"
antiderivative = "x**3/3"

result = verify_antiderivative(
    integrand=integrand,
    antiderivative=antiderivative,
    variable="x"
)

print("UT-04: SYMBOLIC VERIFIER — CORRECT ANTIDERIVATIVE")


print("\nQuestion:", question)
print("Integrand:", integrand)
print("Proposed antiderivative:", antiderivative)
print("Expected answer: x³/3 + C")

print("\nVerification result:", result)

assert result is True, "UT-04 FAILED: Correct antiderivative rejected."

print("\nTEST STATUS: UT-04 PASSED")
print("Output: Correct antiderivative verified successfully.")
