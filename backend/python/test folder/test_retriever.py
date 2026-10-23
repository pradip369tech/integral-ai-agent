import sys
from pathlib import Path

sys.path.insert(
    0, str(Path(__file__).resolve().parent.parent)
)

from rag.retriever import retrieve_formula

query = "power rule integration"
result = retrieve_formula(query)

assert result, "UT-02 FAILED: No formula retrieved."
assert "power rule" in result.lower(), (
    "UT-02 FAILED: Retrieved content does not mention the power rule."
)

print("UT-02 PASSED")
print("Retrieved formula:")
print(result)