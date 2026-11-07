
document.addEventListener("DOMContentLoaded", () => {
    // =========================================================
    // 1. HTML ELEMENTS
    // =========================================================

    const exprInput = document.getElementById("expression-input");
    const limitA = document.getElementById("limit-a");
    const limitB = document.getElementById("limit-b");
    const limitsContainer = document.getElementById("limits-container");

    const modeToggleBtn = document.getElementById("btn-mode-toggle");
    const modeToggleDot = document.getElementById("mode-toggle-dot");
    const modeBadgeText = document.getElementById("mode-badge-text");

    const btnSolve = document.getElementById("btn-solve");
    const btnClear = document.getElementById("btn-clear");

    const inputError = document.getElementById("input-error");
    const errorText = document.getElementById("error-text");

    const emptyState = document.getElementById("empty-state");
    const solutionState = document.getElementById("solution-state");
    const solutionPanel = document.getElementById("solution-proof-panel");

    const tableCard = document.getElementById("standard-table-card");
    const tableModal = document.getElementById("table-modal");
    const btnCloseTableModal = document.getElementById("btn-close-table-modal");
    const tableSearchInput = document.getElementById("table-search-input");
    const tableFormulaList = document.getElementById("table-formula-list");
    const tableCategoryFilters = document.querySelectorAll(".table-category-filter");
    const btnDownloadDirect = document.getElementById("btn-download-direct");
    const btnExportCsv = document.getElementById("btn-export-csv");
    const btnExportTxt = document.getElementById("btn-export-txt");
    const formulasCountBadge = document.getElementById("formulas-count-badge");

    const btnScanNotes = document.getElementById("btn-scan-notes");
    const scanModal = document.getElementById("scan-modal");
    const btnCloseScanModal = document.getElementById("btn-close-scan-modal");
    const btnDismissScanModal = document.getElementById("btn-dismiss-scan-modal");

    // =========================================================
    // 2. STATE
    // =========================================================

    let isDefiniteMode = false;
    let activeCategory = "All";

    // =========================================================
    // 3. ERROR HANDLING
    // =========================================================

    function showError(message) {
        if (inputError) {
            inputError.classList.remove("hidden");
        }

        if (errorText) {
            errorText.textContent = message;
        }
    }

    function hideError() {
        if (inputError) {
            inputError.classList.add("hidden");
        }
    }

    // =========================================================
    // 4. DEFINITE / INDEFINITE MODE
    // =========================================================

    function setDefiniteMode(definite) {
        isDefiniteMode = definite;

        if (modeToggleBtn) {
            modeToggleBtn.setAttribute("aria-checked", String(definite));

            if (definite) {
                modeToggleBtn.classList.remove("bg-slate-200");
                modeToggleBtn.classList.add("bg-brand-600");
            } else {
                modeToggleBtn.classList.remove("bg-brand-600");
                modeToggleBtn.classList.add("bg-slate-200");
            }
        }

        if (modeToggleDot) {
            if (definite) {
                modeToggleDot.classList.remove(
                    "translate-x-0",
                    "bg-slate-400"
                );

                modeToggleDot.classList.add(
                    "translate-x-3.5",
                    "bg-white"
                );
            } else {
                modeToggleDot.classList.remove(
                    "translate-x-3.5",
                    "bg-white"
                );

                modeToggleDot.classList.add(
                    "translate-x-0",
                    "bg-slate-400"
                );
            }
        }

        if (modeBadgeText) {
            modeBadgeText.textContent = definite
                ? "Definite"
                : "Indefinite";
        }

        if (limitsContainer) {
            limitsContainer.classList.toggle("opacity-40", !definite);
            limitsContainer.classList.toggle("opacity-100", definite);
        }

        if (limitA) {
            limitA.disabled = !definite;
        }

        if (limitB) {
            limitB.disabled = !definite;
        }

        hideError();
    }

    if (modeToggleBtn) {
        modeToggleBtn.addEventListener("click", () => {
            setDefiniteMode(!isDefiniteMode);
        });
    }

    // Initialize mode.
    setDefiniteMode(false);

    // =========================================================
    // 5. QUICK SYMBOL INSERTION
    // =========================================================

    document.querySelectorAll("[data-insert-symbol]").forEach(button => {
        button.addEventListener("click", () => {
            if (!exprInput) return;

            const symbol = button.getAttribute("data-insert-symbol");
            const start = exprInput.selectionStart;
            const end = exprInput.selectionEnd;

            const currentValue = exprInput.value;

            exprInput.value =
                currentValue.substring(0, start) +
                symbol +
                currentValue.substring(end);

            const cursorPosition = start + symbol.length;

            exprInput.focus();
            exprInput.setSelectionRange(
                cursorPosition,
                cursorPosition
            );

            hideError();
        });
    });

    // =========================================================
    // 6. DISPLAY SOLUTION FROM PYTHON BACKEND
    // =========================================================

    function getSolutionOutputElement() {
        return (
            document.getElementById("llm-solution-output") ||
            document.getElementById("llm-answer") ||
            document.getElementById("sol-final-formula")
        );
    }

    function getStatusElement() {
        return document.getElementById("llm-status");
    }

    function displaySolution(result, expression) {
        // Hide the empty state and show the solution panel.
        if (emptyState) {
            emptyState.classList.add("hidden");
        }

        if (solutionState) {
            solutionState.classList.remove("hidden");
        }

        const panel = solutionPanel || solutionState;

        if (!panel) {
            console.error("Solution panel was not found in HTML.");
            return;
        }

        // The supplied HTML currently has no dedicated solution
        // output element, so create one inside the solution state
        // if none of the existing output IDs is present.
        let output = getSolutionOutputElement();

        if (!output) {
            const heading = solutionState
                ? solutionState.querySelector("h2")
                : null;

            output = document.createElement("div");
            output.id = "llm-solution-output";

            output.className =
                "mt-4 p-5 rounded-xl bg-slate-50 border " +
                "border-slate-200 text-sm text-slate-800 " +
                "leading-7 whitespace-pre-wrap break-words";

            if (heading && heading.parentElement) {
                heading.parentElement.insertAdjacentElement(
                    "afterend",
                    output
                );
            } else {
                panel.appendChild(output);
            }
        }

        // Python app.py returns:
        // { success: true, expression: "...", solution: "..." }
        const solutionText =
            typeof result.solution === "string"
                ? result.solution
                : typeof result.data?.solution === "string"
                    ? result.data.solution
                    : "";

        output.textContent = solutionText ||
            "The backend returned no solution text.";

        const status = getStatusElement();

        if (status) {
            status.textContent = "Solution generated";
        }

        // Add the submitted expression if the HTML has a suitable
        // expression display element.
        const expressionDisplay =
            document.getElementById("sol-integral-math");

        if (expressionDisplay) {
            expressionDisplay.textContent = expression;
        }

        if (window.innerWidth < 1024 && solutionState) {
            solutionState.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    // =========================================================
    // 7. SOLVE INTEGRAL
    // =========================================================

    async function solveIntegral() {
        if (!exprInput || !btnSolve) return;

        const expression = exprInput.value.trim();
        const lowerLimit = limitA ? limitA.value.trim() : "";
        const upperLimit = limitB ? limitB.value.trim() : "";

        hideError();

        if (!expression) {
            showError("Please enter a mathematical expression.");
            exprInput.focus();
            return;
        }

        if (isDefiniteMode && (!lowerLimit || !upperLimit)) {
            showError(
                "Please provide both lower and upper integration limits."
            );
            return;
        }

        const originalButtonHTML = btnSolve.innerHTML;

        btnSolve.disabled = true;
        btnSolve.innerHTML = `
            <span class="inline-flex items-center gap-2">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Solving...</span>
            </span>
        `;

        const status = getStatusElement();

        if (status) {
            status.textContent = "Solving integral...";
        }

        try {
            console.log("Sending expression:", expression);

            const response = await fetch(
                "http://localhost:5000/api/solve",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        expression: expression,
                        isDefinite: isDefiniteMode,
                        lowerLimit: isDefiniteMode
                            ? lowerLimit
                            : null,
                        upperLimit: isDefiniteMode
                            ? upperLimit
                            : null
                    })
                }
            );

            // Read the response body.
            const result = await response.json();

            console.log("Backend response:", result);

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message ||
                    result.detail ||
                    "The backend could not solve this integral."
                );
            }

            // Display the actual Python LLM solution.
            displaySolution(result, expression);

        } catch (error) {
            console.error("Integral solving error:", error);

            if (status) {
                status.textContent = "Unable to solve";
            }

            showError(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the backend. Check that Express and Python servers are running."
                    : error.message
            );

        } finally {
            btnSolve.disabled = false;
            btnSolve.innerHTML = originalButtonHTML;
        }
    }

    if (btnSolve) {
        btnSolve.addEventListener("click", solveIntegral);
    }

    // Press Enter to solve.
    if (exprInput) {
        exprInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                solveIntegral();
            }
        });

        exprInput.addEventListener("input", hideError);
    }

    // =========================================================
    // 8. CLEAR INPUT AND SOLUTION
    // =========================================================

    if (btnClear) {
        btnClear.addEventListener("click", () => {
            if (exprInput) {
                exprInput.value = "";
                exprInput.focus();
            }

            if (limitA) limitA.value = "";
            if (limitB) limitB.value = "";

            hideError();

            if (solutionState) {
                solutionState.classList.add("hidden");
            }

            if (emptyState) {
                emptyState.classList.remove("hidden");
            }

            const output = getSolutionOutputElement();

            if (output) {
                output.textContent = "";
            }

            const status = getStatusElement();

            if (status) {
                status.textContent = "";
            }
        });
    }

    // =========================================================
    // 9. STANDARD TABLE OF INTEGRALS
    // =========================================================

    // These are the initial reference entries for the table.
    // Keep this array as the source for searching and exporting.
    const formulas = [
        { name: "Power Rule", formula: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C, n ≠ -1", category: "Basic Algebraic" },
        { name: "Reciprocal Rule", formula: "∫ 1/x dx = ln|x| + C", category: "Basic Algebraic" },
        { name: "Constant Rule", formula: "∫ k dx = kx + C", category: "Basic Algebraic" },
        { name: "Linear Rule", formula: "∫ (ax+b)ⁿ dx = (ax+b)ⁿ⁺¹/[a(n+1)] + C", category: "Basic Algebraic" },
        { name: "Square Root", formula: "∫ √x dx = (2/3)x^(3/2) + C", category: "Basic Algebraic" },
        { name: "Exponential", formula: "∫ eˣ dx = eˣ + C", category: "Exponential & Log" },
        { name: "Exponential Base a", formula: "∫ aˣ dx = aˣ/ln(a) + C", category: "Exponential & Log" },
        { name: "Logarithm", formula: "∫ ln(x) dx = x ln(x) - x + C", category: "Exponential & Log" },
        { name: "Sine", formula: "∫ sin(x) dx = -cos(x) + C", category: "Trigonometric" },
        { name: "Cosine", formula: "∫ cos(x) dx = sin(x) + C", category: "Trigonometric" },
        { name: "Tangent", formula: "∫ tan(x) dx = -ln|cos(x)| + C", category: "Trigonometric" },
        { name: "Secant Squared", formula: "∫ sec²(x) dx = tan(x) + C", category: "Trigonometric" },
        { name: "Cosecant Squared", formula: "∫ csc²(x) dx = -cot(x) + C", category: "Trigonometric" },
        { name: "Secant Tangent", formula: "∫ sec(x)tan(x) dx = sec(x) + C", category: "Trigonometric" },
        { name: "Cosecant Cotangent", formula: "∫ csc(x)cot(x) dx = -csc(x) + C", category: "Trigonometric" },
        { name: "Inverse Sine", formula: "∫ 1/√(1-x²) dx = asin(x) + C", category: "Inverse Trig" },
        { name: "Inverse Tangent", formula: "∫ 1/(1+x²) dx = atan(x) + C", category: "Inverse Trig" },
        { name: "Inverse Secant", formula: "∫ 1/(|x|√(x²-1)) dx = asec(x) + C", category: "Inverse Trig" },
        { name: "Hyperbolic Sine", formula: "∫ sinh(x) dx = cosh(x) + C", category: "Hyperbolic" },
        { name: "Hyperbolic Cosine", formula: "∫ cosh(x) dx = sinh(x) + C", category: "Hyperbolic" },
        { name: "Hyperbolic Secant Squared", formula: "∫ sech²(x) dx = tanh(x) + C", category: "Hyperbolic" },
        { name: "Integration by Parts", formula: "∫ u dv = uv - ∫ v du", category: "Advanced Techniques" },
        { name: "Substitution", formula: "∫ f(g(x))g'(x) dx = ∫ f(u) du", category: "Advanced Techniques" },
        { name: "Definite Integral", formula: "∫ₐᵇ f(x) dx = F(b) - F(a)", category: "Advanced Techniques" }
    ];

    function renderTableFormulas() {
        if (!tableFormulaList) return;

        const searchTerm = tableSearchInput
            ? tableSearchInput.value.trim().toLowerCase()
            : "";

        const filtered = formulas.filter(item => {
            const matchesCategory =
                activeCategory === "All" ||
                item.category === activeCategory;

            const matchesSearch =
                item.name.toLowerCase().includes(searchTerm) ||
                item.formula.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        tableFormulaList.innerHTML = "";

        if (formulasCountBadge) {
            formulasCountBadge.textContent =
                `${filtered.length} formulas`;
        }

        if (filtered.length === 0) {
            tableFormulaList.textContent = "No matching formulas found.";
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement("button");

            card.type = "button";
            card.className =
                "text-left p-4 rounded-xl border border-slate-200 " +
                "hover:border-brand-400 hover:bg-brand-50 transition-colors";

            const title = document.createElement("div");
            title.className = "font-semibold text-sm text-slate-900";
            title.textContent = item.name;

            const formula = document.createElement("div");
            formula.className =
                "mt-2 text-sm font-mono text-slate-700 break-words";
            formula.textContent = item.formula;

            const category = document.createElement("div");
            category.className = "mt-2 text-xs text-slate-500";
            category.textContent = item.category;

            card.append(title, formula, category);

            card.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(item.formula);
                    card.title = "Copied to clipboard";
                } catch {
                    if (exprInput) {
                        exprInput.value = item.formula;
                    }
                }
            });

            tableFormulaList.appendChild(card);
        });
    }

    function openTableModal() {
        if (!tableModal) return;

        tableModal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
        renderTableFormulas();
    }

    function closeTableModal() {
        if (!tableModal) return;

        tableModal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
    }

    if (tableCard) {
        tableCard.addEventListener("click", event => {
            if (event.target.closest("#btn-download-direct")) return;
            openTableModal();
        });
    }

    if (btnCloseTableModal) {
        btnCloseTableModal.addEventListener("click", closeTableModal);
    }

    if (tableSearchInput) {
        tableSearchInput.addEventListener("input", renderTableFormulas);
    }

    tableCategoryFilters.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.cat || "All";

            tableCategoryFilters.forEach(filter => {
                filter.classList.remove(
                    "bg-brand-600",
                    "text-white",
                    "border-brand-600"
                );

                filter.classList.add(
                    "bg-slate-100",
                    "text-slate-700",
                    "border-slate-200"
                );
            });

            button.classList.remove(
                "bg-slate-100",
                "text-slate-700",
                "border-slate-200"
            );

            button.classList.add(
                "bg-brand-600",
                "text-white",
                "border-brand-600"
            );

            renderTableFormulas();
        });
    });

    // =========================================================
    // 10. EXPORT FORMULAS
    // =========================================================

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    function exportCsv() {
        const rows = [
            ["Name", "Formula", "Category"],
            ...formulas.map(item => [
                item.name,
                item.formula,
                item.category
            ])
        ];

        const csv = rows
            .map(row =>
                row.map(value =>
                    `"${String(value).replace(/"/g, '""')}"`
                ).join(",")
            )
            .join("\r\n");

        downloadFile(
            csv,
            "integral-formulas.csv",
            "text/csv;charset=utf-8;"
        );
    }

    function exportTxt() {
        const textContent = formulas
            .map(item =>
                `${item.name}\n${item.formula}\nCategory: ${item.category}\n`
            )
            .join("\n");

        downloadFile(
            textContent,
            "integral-formulas.txt",
            "text/plain;charset=utf-8;"
        );
    }

    if (btnExportCsv) {
        btnExportCsv.addEventListener("click", exportCsv);
    }

    if (btnExportTxt) {
        btnExportTxt.addEventListener("click", exportTxt);
    }

    if (btnDownloadDirect) {
        btnDownloadDirect.addEventListener("click", event => {
            event.stopPropagation();
            exportCsv();
        });
    }

    // =========================================================
    // 11. SCAN MODAL
    // =========================================================

    function openScanModal() {
        if (!scanModal) return;

        scanModal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
    }

    function closeScanModal() {
        if (!scanModal) return;

        scanModal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
    }

    if (btnScanNotes) {
        btnScanNotes.addEventListener("click", openScanModal);
    }

    if (btnCloseScanModal) {
        btnCloseScanModal.addEventListener("click", closeScanModal);
    }

    if (btnDismissScanModal) {
        btnDismissScanModal.addEventListener("click", closeScanModal);
    }

    if (scanModal) {
        scanModal.addEventListener("click", event => {
            if (event.target === scanModal) {
                closeScanModal();
            }
        });
    }

    // =========================================================
    // 12. KEYBOARD SHORTCUTS
    // =========================================================

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeTableModal();
            closeScanModal();
        }
    });

    // =========================================================
    // 13. URL PARAMETER SUPPORT
    // =========================================================

    const urlParams = new URLSearchParams(window.location.search);
    const paramExpression = urlParams.get("expr");
    const paramView = urlParams.get("view");

    if (paramExpression && exprInput) {
        exprInput.value = paramExpression;
        solveIntegral();
    } else if (paramView === "solution" || paramView === "demo") {
        if (exprInput && !exprInput.value) {
            exprInput.value = "sin(x) * cos(x)";
        }

        solveIntegral();
    }

    console.log("IntegralAI upload.js initialized successfully.");
});
