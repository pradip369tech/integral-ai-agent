
from pathlib import Path
import re


KNOWLEDGE_FILE = (
    Path(__file__).resolve().parent.parent
    / "knowledge_base"
    / "integration_formulas.md"
)


def load_formulas():
    """Load individual formula sections from the knowledge base."""

    if not KNOWLEDGE_FILE.exists():
        raise FileNotFoundError(
            f"Knowledge base not found: {KNOWLEDGE_FILE}"
        )

    content = KNOWLEDGE_FILE.read_text(encoding="utf-8")

    if not content.strip():
        raise ValueError("Knowledge base is empty.")

    pattern = r"(?m)^%\s*\(([ivxlcdm]+)\)\s*(.+)$"
    matches = list(re.finditer(pattern, content, re.IGNORECASE))

    formulas = []

    for index, match in enumerate(matches):
        start = match.start()
        end = (
            matches[index + 1].start()
            if index + 1 < len(matches)
            else len(content)
        )

        formulas.append({
            "name": match.group(2).strip(),
            "content": content[start:end].strip()
        })

    return formulas


def retrieve_formula(query):
    """
    Retrieve relevant formulas from the knowledge base.
    Supports products, integration by parts, and existing
    trigonometric, logarithmic, exponential, and power rules.
    """

    if not query or not query.strip():
        return ""

    formulas = load_formulas()
    query_lower = query.lower().replace(" ", "")

    matched_names = []

    # Identify expressions that may require integration by parts.
    product_patterns = [
        r"\*",
        r"(?<=[0-9x)])(?=e\^)",
        r"(?<=[0-9x)])(?=(?:sin|cos|tan|cot|ln|log|exp)\()",
        r"(?:sin|cos|tan|ln|log|exp)\([^)]*\)\*",
        r"x\*\*[-+]?\d+",
        r"x\^[-+]?\d+",
    ]

    needs_parts = any(
        re.search(pattern, query_lower)
        for pattern in product_patterns
    )

    if (
        "integrationbyparts" in query_lower
        or "integration by parts" in query.lower()
        or "integration-by-parts" in query.lower()
    ):
        needs_parts = True

    # Recognize relevant mathematical functions.
    expression_patterns = [
        (r"sin\s*\(", "sine formula"),
        (r"cos\s*\(", "cosine formula"),
        (r"tan\s*\(", "tangent formula"),
        (r"cot\s*\(", "cotangent formula"),
        (r"sec\^?2\s*\(", "secant-squared formula"),
        (r"cosec\^?2\s*\(", "cosecant-squared formula"),
        (r"csc\^?2\s*\(", "cosecant-squared formula"),
        (r"sec\s*\(", "secant formula"),
        (r"cosec\s*\(", "cosecant formula"),
        (r"csc\s*\(", "cosecant formula"),
        (r"x\^[-+]?\d+", "power rule"),
        (r"x\*\*[-+]?\d+", "power rule"),
        (r"1/x", "logarithmic formula"),
        (r"ln\s*\(", "logarithmic formula"),
        (r"log\s*\(", "logarithmic formula"),
        (r"e\^", "exponential formula"),
        (r"exp\s*\(", "exponential formula"),
    ]

    for pattern, formula_name in expression_patterns:
        if re.search(pattern, query_lower):
            if formula_name not in matched_names:
                matched_names.append(formula_name)

    # Preserve topic-based retrieval.
    topic_map = {
        "power rule": ["power rule"],
        "polynomial": ["power rule"],
        "logarithmic": ["logarithmic formula"],
        "exponential": [
            "exponential formula",
            "general exponential formula"
        ],
        "sine": ["sine formula"],
        "cosine": ["cosine formula"],
        "secant-squared": ["secant-squared formula"],
        "cosecant-squared": ["cosecant-squared formula"],
        "secant-tangent": ["secant-tangent formula"],
        "cosecant-cotangent": ["cosecant-cotangent formula"],
        "cotangent": ["cotangent formula"],
        "tangent": ["tangent formula"],
        "secant": ["secant formula"],
        "cosecant": ["cosecant formula"],
        "inverse sine": ["inverse sine formula"],
        "inverse cosine": ["inverse cosine formula"],
        "inverse tangent": ["inverse tangent formula"],
        "inverse cotangent": ["inverse cotangent formula"],
        "inverse secant": ["inverse secant formula"],
        "inverse cosecant": ["inverse cosecant formula"],
    }

    if not matched_names:
        normalized_topics = {
            topic.replace(" ", ""): names
            for topic, names in topic_map.items()
        }

        for topic in sorted(
            normalized_topics,
            key=len,
            reverse=True
        ):
            if topic in query_lower:
                matched_names.extend(normalized_topics[topic])
                break

    # Retrieve matching formula sections.
    matching_sections = []
    included_sections = set()

    for formula in formulas:
        formula_name = formula["name"].strip().lower()

        if any(
            formula_name == name.lower()
            for name in matched_names
        ):
            if formula_name not in included_sections:
                matching_sections.append(formula["content"])
                included_sections.add(formula_name)

    # Retrieve integration by parts whenever needed.
    if needs_parts:
        for formula in formulas:
            formula_name = formula["name"].strip().lower()

            is_parts_formula = (
                "integration by parts" in formula_name
                or "integration-by-parts" in formula_name
                or "integration parts" in formula_name
            )

            if (
                is_parts_formula
                and formula_name not in included_sections
            ):
                matching_sections.append(formula["content"])
                included_sections.add(formula_name)

    return "\n\n".join(matching_sections)
