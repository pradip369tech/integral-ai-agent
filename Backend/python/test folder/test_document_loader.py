from pathlib import Path
file_path = Path("../knowledge_base/integration_formulas.md")

assert file_path.exists(), "Formula file not found!"

content = file_path.read_text(encoding="utf-8")

assert content.strip(), "Formula file is empty!"

chunks = [chunk.strip() for chunk in content.split("\n\n") if chunk.strip()]

assert len(chunks) > 0, "No chunks generated!"

print("UT-01 PASSED")
print("Total chunks:", len(chunks))
for i in range(0,len(chunks)):
    print("Chunk", i+1, ":", chunks[i])
