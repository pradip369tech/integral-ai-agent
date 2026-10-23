from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from rag.retriever import retrieve_formula
from llm.llm_solver import solve_with_llm

app = FastAPI()


class SolveRequest(BaseModel):
    expression: str
    isDefinite: bool = False
    lowerLimit: Optional[str] = None
    upperLimit: Optional[str] = None


@app.post("/solve")
def solve_integral(request: SolveRequest):
    try:
        # Retrieve a relevant formula from the knowledge base
        retrieved_formula = retrieve_formula(request.expression)

        # Reject expressions when no applicable formula is found
        if not retrieved_formula:
            return {
                "success": False,
                "expression": request.expression,
                "message": "No relevant formula found in the knowledge base."
            }

        # Validate definite integral limits
        if request.isDefinite:
            if (
                request.lowerLimit is None
                or not request.lowerLimit.strip()
                or request.upperLimit is None
                or not request.upperLimit.strip()
            ):
                return {
                    "success": False,
                    "expression": request.expression,
                    "message": "Please provide both lower and upper limits."
                }

        # Pass the expression and retrieved formula to the LLM
        solution = solve_with_llm(
            expression=request.expression,
            is_definite=request.isDefinite,
            lower_limit=request.lowerLimit,
            upper_limit=request.upperLimit,
            retrieved_formula=retrieved_formula
        )

        

        # Reject results when the required formula is unavailable
        if (
            isinstance(solution, str)
            and "Required formula is not available or applicable in the knowledge base."
            in solution
        ):
            return {
                "success": False,
                "expression": request.expression,
                "message": solution
            }

        # Return the successful solution
        return {
            "success": True,
            "expression": request.expression,
            "solution": solution
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )