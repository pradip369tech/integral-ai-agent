import sys
from pathlib import Path

sys.path.insert(
    0, str(Path(__file__).resolve().parent.parent)
)

from rag.retriever import retrieve_formula

query = "Fourier transform of a function"

result = retrieve_formula(query)

assert result == "", (
    "UT-03 FAILED: Retrieved a formula for an unsupported query."
)

print("UT-03 PASSED")
print("No applicable formula was retrieved.")