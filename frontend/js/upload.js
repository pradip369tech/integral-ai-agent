/**
 * IntegralAI — Upload & Solution Page Logic
 * Pure Vanilla JavaScript implementation with no external backend dependency.
 * Provides interactive math input, quick symbol insertions, definite/indefinite mode switching,
 * demonstration symbolic derivation solver, and a 48-formula Standard Table of Integrals with live search and CSV/TXT export.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (btnSolve) {
    btnSolve.addEventListener('click', async () => {
        const expr = exprInput ? exprInput.value.trim() : '';

        if (!expr) {
            showError('Please enter a mathematical expression.');
            if (exprInput) exprInput.focus();
            return;
        }

        const aVal = limitA ? limitA.value.trim() : '';
        const bVal = limitB ? limitB.value.trim() : '';

        if (isDefiniteMode && (!aVal || !bVal)) {
            showError('Please enter both lower and upper limits.');
            return;
        }

        hideError();

        const originalBtnHtml = btnSolve.innerHTML;
        btnSolve.disabled = true;
        btnSolve.textContent = 'Connecting to backend...';

        try {
            const response = await fetch(
                'http://localhost:5000/api/solve',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        expression: expr,
                        isDefinite: isDefiniteMode,
                        lowerLimit: isDefiniteMode ? aVal : null,
                        upperLimit: isDefiniteMode ? bVal : null
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Failed to send expression.'
                );
            }

            // Display the expression received by the backend.
            if (solHeaderBadge) {
                solHeaderBadge.textContent = 'Backend Connected';
            }

            if (solIntegralMath) {
                solIntegralMath.textContent = isDefiniteMode
                    ? `∫ from ${aVal} to ${bVal} (${expr}) dx`
                    : `∫ (${expr}) dx`;
            }

            if (solStep1Title) {
                solStep1Title.textContent =
                    'Step 1: Expression Received';
            }

            if (solStep1Desc) {
                solStep1Desc.textContent =
                    `Backend received your expression: ${result.data.expression}`;
            }

            if (solStep2Title) {
                solStep2Title.textContent =
                    'Step 2: Processing Status';
            }

            if (solStep2Desc) {
                solStep2Desc.textContent =
                    'Backend connection successful. Integration calculation is not connected yet.';
            }

            if (solStep3Title) {
                solStep3Title.textContent = 'Step 3: Next Stage';
            }

            if (solStep3Desc) {
                solStep3Desc.textContent =
                    'Python, the LLM, and mathematical verification will be integrated later.';
            }

            if (solFinalFormula) {
                solFinalFormula.textContent =
                    'Expression received: ' + result.data.expression;
            }

            if (emptyState) {
                emptyState.classList.add('hidden');
            }

            if (solutionState) {
                solutionState.classList.remove('hidden');

                if (window.innerWidth < 1024) {
                    solutionState.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }

        } catch (error) {
            showError(
                error.message === 'Failed to fetch'
                    ? 'Cannot connect to the backend. Make sure the server is running on port 5000.'
                    : error.message
            );

            console.error('Backend request failed:', error);

        } finally {
            btnSolve.disabled = false;
            btnSolve.innerHTML = originalBtnHtml;
        }
    });
}
});
//   // =========================================================================
//   // 1. Data Store: 48 Fundamental Integration Formulas
//   // =========================================================================
//   const INTEGRAL_TABLE_DATA = [
//     // Basic Algebraic & Power Rules (1 - 10)
//     { id: 1, category: "Basic Algebraic", name: "Power Rule (n ≠ -1)", formula: "∫ xⁿ dx = xⁿ⁺¹ / (n + 1) + C", explanation: "Valid for all real powers except n = -1." },
//     { id: 2, category: "Basic Algebraic", name: "Constant Multiplier Rule", formula: "∫ a dx = a·x + C", explanation: "Antiderivative of a constant factor." },
//     { id: 3, category: "Basic Algebraic", name: "Reciprocal Function (n = -1)", formula: "∫ (1/x) dx = ln|x| + C", explanation: "Yields natural logarithm with absolute value argument." },
//     { id: 4, category: "Basic Algebraic", name: "Sum & Difference Rule", formula: "∫ [f(x) ± g(x)] dx = ∫ f(x)dx ± ∫ g(x)dx", explanation: "Linearity property across terms." },
//     { id: 5, category: "Basic Algebraic", name: "Constant Factor Multiple", formula: "∫ k·f(x) dx = k · ∫ f(x) dx", explanation: "Constants pull out in front of the integral." },
//     { id: 6, category: "Basic Algebraic", name: "Linear Shift Power Rule", formula: "∫ (ax + b)ⁿ dx = ((ax + b)ⁿ⁺¹) / (a(n + 1)) + C", explanation: "Quick linear substitution identity." },
//     { id: 7, category: "Basic Algebraic", name: "Square Root Monomial", formula: "∫ √x dx = (2/3) x^(3/2) + C", explanation: "Power rule applied to fractional exponent 1/2." },
//     { id: 8, category: "Basic Algebraic", name: "Reciprocal Square Root", formula: "∫ (1/√x) dx = 2√x + C", explanation: "Power rule applied to power -1/2." },
//     { id: 9, category: "Basic Algebraic", name: "Linear Denominator Log Form", formula: "∫ (1/(ax + b)) dx = (1/a) ln|ax + b| + C", explanation: "Standard u-substitution for linear binomials." },
//     { id: 10, category: "Basic Algebraic", name: "Inverse Quadratic Monomial", formula: "∫ (1/x²) dx = -1/x + C", explanation: "Power rule applied to power -2." },

//     // Exponential & Logarithmic (11 - 15)
//     { id: 11, category: "Exponential & Log", name: "Natural Exponential eˣ", formula: "∫ eˣ dx = eˣ + C", explanation: "Derivative and antiderivative are identical." },
//     { id: 12, category: "Exponential & Log", name: "Scaled Natural Exponential eᵏˣ", formula: "∫ eᵏˣ dx = (1/k) eᵏˣ + C", explanation: "Linear scaling inside exponential." },
//     { id: 13, category: "Exponential & Log", name: "General Base Exponential aˣ", formula: "∫ aˣ dx = aˣ / (ln a) + C", explanation: "Valid for a > 0 and a ≠ 1." },
//     { id: 14, category: "Exponential & Log", name: "Natural Logarithm ln(x)", formula: "∫ ln(x) dx = x·ln(x) - x + C", explanation: "Solved through integration by parts (u = ln x, dv = dx)." },
//     { id: 15, category: "Exponential & Log", name: "General Logarithm logₐ(x)", formula: "∫ logₐ(x) dx = (x·ln(x) - x) / (ln a) + C", explanation: "Base conversion formula applied before integration." },

//     // Trigonometric Functions (16 - 27)
//     { id: 16, category: "Trigonometric", name: "Sine Antiderivative", formula: "∫ sin(x) dx = -cos(x) + C", explanation: "Fundamental trigonometric antiderivative." },
//     { id: 17, category: "Trigonometric", name: "Cosine Antiderivative", formula: "∫ cos(x) dx = sin(x) + C", explanation: "Standard trigonometric antiderivative." },
//     { id: 18, category: "Trigonometric", name: "Tangent Antiderivative", formula: "∫ tan(x) dx = ln|sec(x)| + C", explanation: "Derived by rewriting tan(x) as sin(x)/cos(x)." },
//     { id: 19, category: "Trigonometric", name: "Cotangent Antiderivative", formula: "∫ cot(x) dx = ln|sin(x)| + C", explanation: "Derived by rewriting cot(x) as cos(x)/sin(x)." },
//     { id: 20, category: "Trigonometric", name: "Secant Antiderivative", formula: "∫ sec(x) dx = ln|sec(x) + tan(x)| + C", explanation: "Multiplication by (sec x + tan x)/(sec x + tan x)." },
//     { id: 21, category: "Trigonometric", name: "Cosecant Antiderivative", formula: "∫ csc(x) dx = -ln|csc(x) + cot(x)| + C", explanation: "Logarithmic form for cosecant." },
//     { id: 22, category: "Trigonometric", name: "Secant Squared (Tangent)", formula: "∫ sec²(x) dx = tan(x) + C", explanation: "Direct inverse of d/dx tan(x)." },
//     { id: 23, category: "Trigonometric", name: "Cosecant Squared (Cotangent)", formula: "∫ csc²(x) dx = -cot(x) + C", explanation: "Direct inverse of d/dx cot(x)." },
//     { id: 24, category: "Trigonometric", name: "Secant Tangent Product", formula: "∫ sec(x)·tan(x) dx = sec(x) + C", explanation: "Direct inverse of d/dx sec(x)." },
//     { id: 25, category: "Trigonometric", name: "Cosecant Cotangent Product", formula: "∫ csc(x)·cot(x) dx = -csc(x) + C", explanation: "Direct inverse of d/dx csc(x)." },
//     { id: 26, category: "Trigonometric", name: "Sine Squared Reduction", formula: "∫ sin²(x) dx = x/2 - sin(2x)/4 + C", explanation: "Derived via double angle identity cos(2x) = 1 - 2sin²(x)." },
//     { id: 27, category: "Trigonometric", name: "Cosine Squared Reduction", formula: "∫ cos²(x) dx = x/2 + sin(2x)/4 + C", explanation: "Derived via double angle identity cos(2x) = 2cos²(x) - 1." },

//     // Inverse Trigonometric Forms (28 - 33)
//     { id: 28, category: "Inverse Trig", name: "Standard ArcSine", formula: "∫ 1/√(1 - x²) dx = arcsin(x) + C", explanation: "Fundamental inverse sine derivative identity." },
//     { id: 29, category: "Inverse Trig", name: "General ArcSine Form", formula: "∫ 1/√(a² - x²) dx = arcsin(x/a) + C", explanation: "Scaled parameter form with a > 0." },
//     { id: 30, category: "Inverse Trig", name: "Standard ArcTangent", formula: "∫ 1/(1 + x²) dx = arctan(x) + C", explanation: "Fundamental inverse tangent derivative identity." },
//     { id: 31, category: "Inverse Trig", name: "General ArcTangent Form", formula: "∫ 1/(a² + x²) dx = (1/a) arctan(x/a) + C", explanation: "Scaled rational form with a > 0." },
//     { id: 32, category: "Inverse Trig", name: "Standard ArcSecant", formula: "∫ 1/(|x|√(x² - 1)) dx = arcsec(x) + C", explanation: "Fundamental inverse secant derivative identity." },
//     { id: 33, category: "Inverse Trig", name: "General ArcSecant Form", formula: "∫ 1/(|x|√(x² - a²)) dx = (1/a) arcsec(x/a) + C", explanation: "Scaled form with |x| > a > 0." },

//     // Hyperbolic Functions (34 - 39)
//     { id: 34, category: "Hyperbolic", name: "Hyperbolic Sine sinh(x)", formula: "∫ sinh(x) dx = cosh(x) + C", explanation: "Fundamental hyperbolic antiderivative." },
//     { id: 35, category: "Hyperbolic", name: "Hyperbolic Cosine cosh(x)", formula: "∫ cosh(x) dx = sinh(x) + C", explanation: "No sign flip unlike circular trigonometric cosine." },
//     { id: 36, category: "Hyperbolic", name: "Hyperbolic Tangent tanh(x)", formula: "∫ tanh(x) dx = ln(cosh(x)) + C", explanation: "cosh(x) is always positive for all real x." },
//     { id: 37, category: "Hyperbolic", name: "Hyperbolic Cotangent coth(x)", formula: "∫ coth(x) dx = ln|sinh(x)| + C", explanation: "Valid for x ≠ 0." },
//     { id: 38, category: "Hyperbolic", name: "Hyperbolic Secant Squared", formula: "∫ sech²(x) dx = tanh(x) + C", explanation: "Direct inverse of d/dx tanh(x)." },
//     { id: 39, category: "Hyperbolic", name: "Hyperbolic Cosecant Squared", formula: "∫ csch²(x) dx = -coth(x) + C", explanation: "Direct inverse of d/dx coth(x)." },

//     // Advanced Forms & Integration Techniques (40 - 48)
//     { id: 40, category: "Advanced Techniques", name: "Integration by Parts Formula", formula: "∫ u dv = u·v - ∫ v du", explanation: "Core technique for product terms and logs." },
//     { id: 41, category: "Advanced Techniques", name: "Substitution (Chain Rule Inversion)", formula: "∫ f(g(x))·g'(x) dx = ∫ f(u) du", explanation: "Setting u = g(x), du = g'(x)dx." },
//     { id: 42, category: "Advanced Techniques", name: "Partial Fractions Form (x² - a²)", formula: "∫ 1/(x² - a²) dx = (1/(2a)) ln|(x - a)/(x + a)| + C", explanation: "Decomposition into 1/(x-a) - 1/(x+a)." },
//     { id: 43, category: "Advanced Techniques", name: "Partial Fractions Form (a² - x²)", formula: "∫ 1/(a² - x²) dx = (1/(2a)) ln|(a + x)/(a - x)| + C", explanation: "Complementary partial fraction form." },
//     { id: 44, category: "Advanced Techniques", name: "Circle Area Form √(a² - x²)", formula: "∫ √(a² - x²) dx = (x/2)√(a² - x²) + (a²/2)arcsin(x/a) + C", explanation: "Standard trigonometric substitution with x = a·sin(θ)." },
//     { id: 45, category: "Advanced Techniques", name: "Hyperbolic Form √(x² ± a²)", formula: "∫ √(x² ± a²) dx = (x/2)√(x² ± a²) ± (a²/2)ln|x + √(x² ± a²)| + C", explanation: "Computed via hyperbolic or secant substitution." },
//     { id: 46, category: "Advanced Techniques", name: "Polynomial Exponential Product", formula: "∫ x·eᵃˣ dx = (eᵃˣ/a²) (ax - 1) + C", explanation: "Integration by parts with u = x, dv = eᵃˣ dx." },
//     { id: 47, category: "Advanced Techniques", name: "Gaussian Definite Integral", formula: "∫_(-∞)^∞ e^(-x²) dx = √π", explanation: "Solved analytically using double polar integrals." },
//     { id: 48, category: "Advanced Techniques", name: "Euler Gamma Identity", formula: "∫₀^∞ x^(z-1) · e^(-x) dx = Γ(z)", explanation: "Foundation for factorial interpolation in complex analysis." }
//   ];

//   // =========================================================================
//   // 2. UI Elements Selection
//   // =========================================================================
//   const exprInput = document.getElementById('expression-input');
//   const limitA = document.getElementById('limit-a');
//   const limitB = document.getElementById('limit-b');
//   const limitsContainer = document.getElementById('limits-container');
//   const modeToggleBtn = document.getElementById('btn-mode-toggle');
//   const modeToggleDot = document.getElementById('mode-toggle-dot');
//   const modeBadgeText = document.getElementById('mode-badge-text');
//   const inputError = document.getElementById('input-error');
//   const errorText = document.getElementById('error-text');

//   const btnClear = document.getElementById('btn-clear');
//   const btnSolve = document.getElementById('btn-solve');
//   const btnScanNotes = document.getElementById('btn-scan-notes');

//   const emptyState = document.getElementById('empty-state');
//   const solutionState = document.getElementById('solution-state');
//   const btnResetSolution = document.getElementById('btn-reset-solution');
//   const btnCopySolution = document.getElementById('btn-copy-solution');

//   // Solution View Fields
//   const solHeaderBadge = document.getElementById('sol-technique-badge');
//   const solIntegralMath = document.getElementById('sol-integral-math');
//   const solStep1Title = document.getElementById('sol-step1-title');
//   const solStep1Desc = document.getElementById('sol-step1-desc');
//   const solStep2Title = document.getElementById('sol-step2-title');
//   const solStep2Desc = document.getElementById('sol-step2-desc');
//   const solStep3Card = document.getElementById('sol-step3-card');
//   const solStep3Title = document.getElementById('sol-step3-title');
//   const solStep3Desc = document.getElementById('sol-step3-desc');
//   const solFinalFormula = document.getElementById('sol-final-formula');

//   // Table Modal Elements
//   const tableCard = document.getElementById('standard-table-card');
//   const btnDownloadDirect = document.getElementById('btn-download-direct');
//   const tableModal = document.getElementById('table-modal');
//   const btnCloseTableModal = document.getElementById('btn-close-table-modal');
//   const tableSearchInput = document.getElementById('table-search-input');
//   const tableFormulaList = document.getElementById('table-formula-list');
//   const tableCategoryFilters = document.querySelectorAll('.table-category-filter');
//   const btnExportCsv = document.getElementById('btn-export-csv');
//   const btnExportTxt = document.getElementById('btn-export-txt');
//   const formulasCountBadge = document.getElementById('formulas-count-badge');

//   // Scan simulation modal
//   const scanModal = document.getElementById('scan-modal');
//   const btnCloseScanModal = document.getElementById('btn-close-scan-modal');
//   const btnDismissScanModal = document.getElementById('btn-dismiss-scan-modal');

//   // State
//   let isDefiniteMode = false;
//   let activeCategory = 'All';

//   // =========================================================================
//   // 3. Mode Toggle (Definite / Indefinite Integral)
//   // =========================================================================
//   function setDefiniteMode(definite, shouldFocus = false) {
//     isDefiniteMode = definite;
//     if (isDefiniteMode) {
//       if (modeToggleDot) {
//         modeToggleDot.classList.add('translate-x-3.5', 'bg-indigo-600');
//         modeToggleDot.classList.remove('translate-x-0', 'bg-slate-400');
//       }
//       if (modeToggleBtn) {
//         modeToggleBtn.classList.add('bg-indigo-100', 'border-indigo-300');
//         modeToggleBtn.classList.remove('bg-slate-200', 'border-slate-300');
//         modeToggleBtn.setAttribute('aria-checked', 'true');
//       }
//       if (modeBadgeText) {
//         modeBadgeText.textContent = 'Definite Mode';
//         modeBadgeText.classList.add('text-indigo-700', 'font-semibold');
//         modeBadgeText.classList.remove('text-slate-500');
//       }
//       if (limitsContainer) {
//         limitsContainer.classList.remove('opacity-40');
//         limitsContainer.classList.add('opacity-100');
//       }
//       if (limitA) limitA.removeAttribute('tabindex');
//       if (limitB) limitB.removeAttribute('tabindex');
//       if (shouldFocus && limitA) {
//         limitA.focus();
//       }
//     } else {
//       if (modeToggleDot) {
//         modeToggleDot.classList.remove('translate-x-3.5', 'bg-indigo-600');
//         modeToggleDot.classList.add('translate-x-0', 'bg-slate-400');
//       }
//       if (modeToggleBtn) {
//         modeToggleBtn.classList.remove('bg-indigo-100', 'border-indigo-300');
//         modeToggleBtn.classList.add('bg-slate-200', 'border-slate-300');
//         modeToggleBtn.setAttribute('aria-checked', 'false');
//       }
//       if (modeBadgeText) {
//         modeBadgeText.textContent = 'Indefinite';
//         modeBadgeText.classList.remove('text-indigo-700', 'font-semibold');
//         modeBadgeText.classList.add('text-slate-500');
//       }
//       if (limitsContainer) {
//         limitsContainer.classList.add('opacity-40');
//         limitsContainer.classList.remove('opacity-100');
//       }
//     }
//   }

//   if (modeToggleBtn) {
//     modeToggleBtn.addEventListener('click', () => {
//       setDefiniteMode(!isDefiniteMode);
//     });
//   }

//   // =========================================================================
//   // 4. Cursor-Aware Text Insertion for Math Symbol Chips
//   // =========================================================================
//   function insertAtCursor(textToInsert) {
//     if (!exprInput) return;
//     const start = exprInput.selectionStart ?? exprInput.value.length;
//     const end = exprInput.selectionEnd ?? exprInput.value.length;
//     const currentVal = exprInput.value;

//     exprInput.value = currentVal.substring(0, start) + textToInsert + currentVal.substring(end);
//     exprInput.focus();

//     // Calculate smart cursor positioning
//     let targetPos = start + textToInsert.length;
//     if (textToInsert.includes('(x)')) {
//       // Place cursor inside parentheses
//       targetPos = start + textToInsert.indexOf('(x)') + 1;
//     } else if (textToInsert === '(a/b)') {
//       targetPos = start + 1;
//     } else if (textToInsert === 'lim_{x→0}') {
//       targetPos = start + textToInsert.length;
//     }

//     exprInput.setSelectionRange(targetPos, targetPos);
//     hideError();
//   }

//   // Handle all quick insert symbol buttons
//   document.querySelectorAll('[data-insert-symbol]').forEach(btn => {
//     btn.addEventListener('click', (e) => {
//       e.preventDefault();
//       const symbol = btn.getAttribute('data-insert-symbol');
//       if (symbol === 'definite-mode') {
//         setDefiniteMode(true, true);
//         if (!limitA.value && !limitB.value) {
//           limitA.value = '0';
//           limitB.value = '1';
//         }
//       } else if (symbol) {
//         insertAtCursor(symbol);
//       }
//     });
//   });

//   // =========================================================================
//   // 5. Validation & Error Messaging
//   // =========================================================================
//   function showError(message) {
//     if (errorText) errorText.textContent = message;
//     if (inputError) inputError.classList.remove('hidden');
//   }

//   function hideError() {
//     if (inputError) inputError.classList.add('hidden');
//   }

//   if (exprInput) {
//     exprInput.addEventListener('input', () => {
//       if (exprInput.value.trim().length > 0) {
//         hideError();
//       }
//     });
//     // Support pressing Enter key to solve
//     exprInput.addEventListener('keydown', (e) => {
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         if (btnSolve) btnSolve.click();
//       }
//     });
//   }

//   // =========================================================================
//   // 6. Clear Action
//   // =========================================================================
//   if (btnClear) {
//     btnClear.addEventListener('click', () => {
//       if (exprInput) exprInput.value = '';
//       if (limitA) limitA.value = '';
//       if (limitB) limitB.value = '';
//       hideError();
//       setDefiniteMode(false);
//       resetSolutionPreview();
//       if (exprInput) exprInput.focus();
//     });
//   }

//   function resetSolutionPreview() {
//     if (solutionState) solutionState.classList.add('hidden');
//     if (emptyState) emptyState.classList.remove('hidden');
//   }

//   if (btnResetSolution) {
//     btnResetSolution.addEventListener('click', resetSolutionPreview);
//   }

//   // =========================================================================
//   // 7. Solving Engine & Demonstration Derivation Generator
//   // =========================================================================
//   function generateDemonstrationSolution(expression, isDefinite, aVal, bVal) {
//     const raw = expression.trim().toLowerCase();
//     const cleanExpr = expression.trim();

//     // Default demonstration metadata
//     let technique = "Symbolic Decomposition";
//     let step1Title = "Step 1: Domain Analysis & Integrand Classification";
//     let step1Desc = `The function f(x) = ${cleanExpr} is analyzed over continuous real space x ∈ ℝ. Integrand is confirmed integrable with regular continuity.`;
    
//     let step2Title = "Step 2: Antiderivative Derivation via Calculus Rules";
//     let step2Desc = `Applying standard antiderivative identities to ${cleanExpr} to yield primitive function F(x).`;

//     let step3Title = "Step 3: Verification & Integration Constant";
//     let step3Desc = `Differentiating F(x) confirms d/dx [F(x)] = ${cleanExpr}. We append the constant of integration C.`;

//     let finalFormula = `F(x) = ∫ (${cleanExpr}) dx + C`;

//     // Specialized intelligent rule matching for typical user inputs
//     if (raw.includes('sin') && raw.includes('cos')) {
//       technique = "U-Substitution Technique";
//       step1Title = "Step 1: Coordinate Variable Transformation (u-Substitution)";
//       step1Desc = `Recognize the integrand structure f(g(x))·g'(x). Let u = sin(x), which yields the differential du = cos(x) dx. The integral transforms into: ∫ u du.`;
      
//       step2Title = "Step 2: Monomial Integration in Transformed Variable";
//       step2Desc = `Applying the elementary power rule ∫ u du = (1/2) u² + C.`;

//       step3Title = "Step 3: Back-Substitution to Original Coordinate";
//       step3Desc = `Substitute u = sin(x) back into the polynomial result: (1/2) sin²(x) + C. By trigonometric identity, this is also equivalent to -¼ cos(2x) + C'.`;

//       finalFormula = isDefinite 
//         ? `½ [sin²(${bVal}) - sin²(${aVal})]`
//         : `½ sin²(x) + C`;

//     } else if (raw === 'x^2' || raw === 'x²' || raw === 'x*x') {
//       technique = "Elementary Power Rule";
//       step1Title = "Step 1: Power Rule Formulation (n = 2)";
//       step1Desc = `For any power exponent n ≠ -1, the antiderivative identity is ∫ xⁿ dx = (xⁿ⁺¹) / (n + 1) + C. Here n = 2.`;

//       step2Title = "Step 2: Exponent Incrementation and Normalization";
//       step2Desc = `Increment the power by 1: 2 + 1 = 3. Divide the monomial term by the new exponent: x³ / 3.`;

//       step3Title = "Step 3: Antiderivative Verification";
//       step3Desc = `Verifying differentiation: d/dx [(1/3) x³] = (1/3) · 3x² = x². Derivative matches the original integrand exactly.`;

//       finalFormula = isDefinite 
//         ? `(1/3)·[(${bVal})³ - (${aVal})³]`
//         : `(1/3) x³ + C`;

//     } else if (raw === 'e^x' || raw === 'eˣ') {
//       technique = "Natural Exponential Invariance";
//       step1Title = "Step 1: Exponential Eigen-Property Analysis";
//       step1Desc = `The natural exponential base e is the unique non-trivial function equal to its own derivative: d/dx (eˣ) = eˣ.`;

//       step2Title = "Step 2: Antiderivative Formulation";
//       step2Desc = `Integration is the exact inverse operation of differentiation. Hence: ∫ eˣ dx = eˣ + C.`;

//       step3Title = "Step 3: Boundary Growth Behavior";
//       step3Desc = `The function eˣ remains strictly positive and monotonically increasing across all finite real intervals.`;

//       finalFormula = isDefinite
//         ? `e^(${bVal}) - e^(${aVal})`
//         : `eˣ + C`;

//     } else if (raw === 'sin(x)' || raw === 'sin') {
//       technique = "Standard Trigonometric Antiderivative";
//       step1Title = "Step 1: Circular Function Inversion";
//       step1Desc = `Recall the derivative of cosine: d/dx [cos(x)] = -sin(x). Therefore, d/dx [-cos(x)] = sin(x).`;

//       step2Title = "Step 2: Primitive Function Formulation";
//       step2Desc = `∫ sin(x) dx = -cos(x) + C.`;

//       step3Title = "Step 3: Periodic Wave Verification";
//       step3Desc = `The resulting antiderivative has periodicity 2π and amplitude 1.`;

//       finalFormula = isDefinite
//         ? `-cos(${bVal}) + cos(${aVal})`
//         : `-cos(x) + C`;

//     } else if (raw === 'cos(x)' || raw === 'cos') {
//       technique = "Standard Trigonometric Antiderivative";
//       step1Title = "Step 1: Circular Function Inversion";
//       step1Desc = `Since d/dx [sin(x)] = cos(x), integration directly returns the sine wave.`;

//       step2Title = "Step 2: Primitive Function Formulation";
//       step2Desc = `∫ cos(x) dx = sin(x) + C.`;

//       step3Title = "Step 3: Phase Shift Consistency";
//       step3Desc = `Verified over all real domain x ∈ ℝ.`;

//       finalFormula = isDefinite
//         ? `sin(${bVal}) - sin(${aVal})`
//         : `sin(x) + C`;

//     } else if (raw.includes('x*sin') || raw.includes('x sin') || raw.includes('x·sin')) {
//       technique = "Integration by Parts (LIATE Rule)";
//       step1Title = "Step 1: Factor Selection for Parts Formula";
//       step1Desc = `Following LIATE, choose algebraic factor as u = x (du = dx) and trigonometric factor as dv = sin(x)dx (v = -cos(x)).`;

//       step2Title = "Step 2: Application of ∫ u dv = u·v - ∫ v du";
//       step2Desc = `∫ x·sin(x) dx = x · (-cos(x)) - ∫ (-cos(x)) dx = -x·cos(x) + ∫ cos(x) dx.`;

//       step3Title = "Step 3: Integration of Remaining Term";
//       step3Desc = `∫ cos(x) dx = sin(x). Combining terms yields: sin(x) - x·cos(x) + C.`;

//       finalFormula = isDefinite
//         ? `[sin(${bVal}) - (${bVal})cos(${bVal})] - [sin(${aVal}) - (${aVal})cos(${aVal})]`
//         : `sin(x) - x·cos(x) + C`;

//     } else if (raw === '1/x' || raw === 'ln' || raw.includes('ln(x)')) {
//       technique = "Logarithmic Primitive Rule";
//       step1Title = "Step 1: Exceptional Power Exponent Recognition (n = -1)";
//       step1Desc = `The function 1/x has singularity at x = 0. Its antiderivative is defined as ln|x| + C on intervals not containing 0.`;

//       step2Title = "Step 2: Natural Logarithmic Integration";
//       step2Desc = `∫ (1/x) dx = ln|x| + C.`;

//       step3Title = "Step 3: Continuous Domain Restriction";
//       step3Desc = `Absolute value ensures real evaluation across both positive and negative half-lines.`;

//       finalFormula = isDefinite
//         ? `ln|${bVal}| - ln|${aVal}| = ln|(${bVal})/(${aVal})|`
//         : `ln|x| + C`;

//     } else if (raw.includes('sqrt') || raw.includes('√')) {
//       technique = "Fractional Exponent Power Rule";
//       step1Title = "Step 1: Convert Radical to Rational Exponent";
//       step1Desc = `Rewrite √x as x^(1/2). Apply power rule with n = 1/2.`;

//       step2Title = "Step 2: Evaluate (x^(1/2 + 1)) / (1/2 + 1)";
//       step2Desc = `x^(3/2) / (3/2) = (2/3) x^(3/2) = (2/3) x√x.`;

//       step3Title = "Step 3: Add Constant of Integration";
//       step3Desc = `Valid for domain x ≥ 0.`;

//       finalFormula = isDefinite
//         ? `(2/3) [(${bVal})^(3/2) - (${aVal})^(3/2)]`
//         : `(2/3) x^(3/2) + C`;

//     } else {
//       // General dynamic expression presentation
//       technique = "Symbolic Antiderivative Decomposition";
//       step1Title = "Step 1: Expression Tokenization & Domain Verification";
//       step1Desc = `Integrand '${cleanExpr}' is parsed symbolically. Verified domain continuity for independent variable x.`;

//       step2Title = "Step 2: Antiderivative Construction & Operator Linearity";
//       step2Desc = `Applying fundamental theorem of calculus with linear decomposition across sum components of '${cleanExpr}'.`;

//       step3Title = "Step 3: Constant of Integration & Simplification";
//       step3Desc = `Collecting coefficients and standardizing mathematical notation with arbitrary integration constant C.`;

//       finalFormula = isDefinite
//         ? `[ F(${bVal}) - F(${aVal}) ] for F(x) = Antiderivative(${cleanExpr})`
//         : `F(x) = ∫ (${cleanExpr}) dx + C`;
//     }

//     // Adjust for Definite Integral Boundary Evaluation
//     if (isDefinite) {
//       step3Title = `Step 3: Fundamental Theorem of Calculus Evaluation [${aVal} → ${bVal}]`;
//       step3Desc = `Evaluate the definite integral via boundary substitution: ∫ₐᵇ f(x) dx = [F(x)]_(${aVal})^(${bVal}) = F(${bVal}) - F(${aVal}). Integration constant C cancels out.`;
//     }

//     return {
//       technique,
//       step1Title,
//       step1Desc,
//       step2Title,
//       step2Desc,
//       step3Title,
//       step3Desc,
//       finalFormula
//     };
//   }

  
// if (btnSolve) {
//     btnSolve.addEventListener('click', async () => {
//         const expr = exprInput ? exprInput.value.trim() : '';

//         if (!expr) {
//             showError('Please enter a mathematical expression.');
//             if (exprInput) exprInput.focus();
//             return;
//         }

//         const aVal = limitA ? limitA.value.trim() : '';
//         const bVal = limitB ? limitB.value.trim() : '';

//         if (isDefiniteMode && (!aVal || !bVal)) {
//             showError('Please enter both lower and upper limits.');
//             return;
//         }

//         hideError();

//         const originalBtnHtml = btnSolve.innerHTML;
//         btnSolve.disabled = true;
//         btnSolve.textContent = 'Connecting to backend...';

//         try {
//             const response = await fetch('http://localhost:5000/api/solve', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     expression: expr,
//                     isDefinite: isDefiniteMode,
//                     lowerLimit: isDefiniteMode ? aVal : null,
//                     upperLimit: isDefiniteMode ? bVal : null
//                 })
//             });

//             const result = await response.json();

//             if (!response.ok || !result.success) {
//                 throw new Error(result.message || 'Failed to send expression.');
//             }

//             // Display the response received from the backend.
//             if (solHeaderBadge) {
//                 solHeaderBadge.textContent = 'Backend Connected';
//             }

//             if (solIntegralMath) {
//                 solIntegralMath.textContent = isDefiniteMode
//                     ? `∫ from ${aVal} to ${bVal} (${expr}) dx`
//                     : `∫ (${expr}) dx`;
//             }

//             if (solStep1Title) {
//                 solStep1Title.textContent = 'Step 1: Expression Received';
//             }
//             if (solStep1Desc) {
//                 solStep1Desc.textContent =
//                     `Backend received your expression: ${result.data.expression}`;
//             }

//             if (solStep2Title) {
//                 solStep2Title.textContent = 'Step 2: Processing Status';
//             }
//             if (solStep2Desc) {
//                 solStep2Desc.textContent =
//                     'The backend is connected. The integration solver has not been connected yet.';
//             }

//             if (solStep3Title) {
//                 solStep3Title.textContent = 'Step 3: Next Stage';
//             }
//             if (solStep3Desc) {
//                 solStep3Desc.textContent =
//                     'Python, the LLM, and mathematical verification will be integrated later.';
//             }

//             if (solFinalFormula) {
//                 solFinalFormula.textContent =
//                     'Expression received: ' + result.data.expression;
//             }

//             if (emptyState) emptyState.classList.add('hidden');
//             if (solutionState) {
//                 solutionState.classList.remove('hidden');

//                 if (window.innerWidth < 1024) {
//                     solutionState.scrollIntoView({ behavior: 'smooth' });
//                 }
//             }

//         } catch (error) {
//             showError(
//                 error.message === 'Failed to fetch'
//                     ? 'Cannot connect to the backend. Make sure your server is running on port 5000.'
//                     : error.message
//             );
//             console.error('Backend request failed:', error);

//         } finally {
//             btnSolve.disabled = false;
//             btnSolve.innerHTML = originalBtnHtml;
//         }
//     });
// }


//   // Copy Solution to clipboard
//   if (btnCopySolution) {
//     btnCopySolution.addEventListener('click', () => {
//       const formulaText = solFinalFormula ? solFinalFormula.textContent : '';
//       if (formulaText) {
//         navigator.clipboard.writeText(formulaText).then(() => {
//           const originalText = btnCopySolution.innerHTML;
//           btnCopySolution.innerHTML = `<i class="fa-solid fa-check text-emerald-600"></i><span class="text-emerald-700">Copied!</span>`;
//           setTimeout(() => {
//             btnCopySolution.innerHTML = originalText;
//           }, 2000);
//         }).catch(() => {
//           // Fallback
//           alert('Copied to clipboard: ' + formulaText);
//         });
//       }
//     });
//   }

//   // =========================================================================
//   // 8. Standard Table of Integrals Modal & Formula Filtering
//   // =========================================================================
//   function renderTableFormulas(formulas) {
//     if (!tableFormulaList) return;
//     tableFormulaList.innerHTML = '';

//     if (formulas.length === 0) {
//       tableFormulaList.innerHTML = `
//         <div class="col-span-full text-center py-12 text-slate-400">
//           <i class="fa-solid fa-square-root-variable text-4xl mb-3 text-slate-300"></i>
//           <p class="text-sm font-medium text-slate-600">No integration identities match your search filter.</p>
//           <p class="text-xs text-slate-400 mt-1">Try searching by formula term like "sin", "power", "parts", or "exp".</p>
//         </div>
//       `;
//       if (formulasCountBadge) formulasCountBadge.textContent = '0 / 48 identities';
//       return;
//     }

//     if (formulasCountBadge) {
//       formulasCountBadge.textContent = `${formulas.length} of 48 identities`;
//     }

//     formulas.forEach(item => {
//       const card = document.createElement('div');
//       card.className = 'formula-row-item p-4 rounded-xl border border-slate-200/90 bg-white hover:border-brand-500/50 hover:shadow-sm transition-all flex flex-col justify-between';
//       card.innerHTML = `
//         <div>
//           <div class="flex items-center justify-between gap-2 mb-2">
//             <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">#${item.id}</span>
//             <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100">${item.category}</span>
//           </div>
//           <h4 class="text-xs font-bold text-slate-800 tracking-tight">${item.name}</h4>
//           <div class="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/70 font-math text-sm text-slate-900 tracking-wide select-all font-semibold">
//             ${item.formula}
//           </div>
//         </div>
//         <p class="text-[11px] text-slate-500 mt-2.5 font-sans leading-snug">${item.explanation}</p>
//       `;
//       tableFormulaList.appendChild(card);
//     });
//   }

//   function filterFormulas() {
//     const query = tableSearchInput ? tableSearchInput.value.toLowerCase().trim() : '';
//     const filtered = INTEGRAL_TABLE_DATA.filter(item => {
//       const matchCat = (activeCategory === 'All') || (item.category === activeCategory);
//       const matchQuery = !query || 
//         item.name.toLowerCase().includes(query) ||
//         item.formula.toLowerCase().includes(query) ||
//         item.category.toLowerCase().includes(query) ||
//         item.explanation.toLowerCase().includes(query);
//       return matchCat && matchQuery;
//     });
//     renderTableFormulas(filtered);
//   }

//   if (tableSearchInput) {
//     tableSearchInput.addEventListener('input', filterFormulas);
//   }

//   tableCategoryFilters.forEach(btn => {
//     btn.addEventListener('click', () => {
//       tableCategoryFilters.forEach(b => {
//         b.classList.remove('bg-brand-600', 'text-white', 'border-brand-600');
//         b.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200');
//       });
//       btn.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
//       btn.classList.add('bg-brand-600', 'text-white', 'border-brand-600');
//       activeCategory = btn.getAttribute('data-cat') || 'All';
//       filterFormulas();
//     });
//   });

//   function openTableModal() {
//     if (tableModal) {
//       tableModal.classList.remove('hidden');
//       document.body.classList.add('overflow-hidden');
//       if (tableSearchInput) {
//         tableSearchInput.value = '';
//         tableSearchInput.focus();
//       }
//       activeCategory = 'All';
//       tableCategoryFilters.forEach((b, idx) => {
//         if (idx === 0) {
//           b.classList.add('bg-brand-600', 'text-white', 'border-brand-600');
//           b.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
//         } else {
//           b.classList.remove('bg-brand-600', 'text-white', 'border-brand-600');
//           b.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200');
//         }
//       });
//       renderTableFormulas(INTEGRAL_TABLE_DATA);
//     }
//   }

//   function closeTableModal() {
//     if (tableModal) {
//       tableModal.classList.add('hidden');
//       document.body.classList.remove('overflow-hidden');
//     }
//   }

//   if (tableCard) {
//     tableCard.addEventListener('click', (e) => {
//       // If user clicked download icon directly, prevent opening modal and trigger download
//       if (e.target.closest('#btn-download-direct')) {
//         e.stopPropagation();
//         downloadIntegralsCsv();
//         return;
//       }
//       openTableModal();
//     });
//   }

//   if (btnCloseTableModal) {
//     btnCloseTableModal.addEventListener('click', closeTableModal);
//   }

//   if (tableModal) {
//     tableModal.addEventListener('click', (e) => {
//       if (e.target === tableModal) {
//         closeTableModal();
//       }
//     });
//   }

//   // =========================================================================
//   // 9. Client-Side Browser Export (CSV & TXT)
//   // =========================================================================
//   function downloadIntegralsCsv() {
//     let csvContent = "ID,Category,Name,Formula,Explanation\r\n";
//     INTEGRAL_TABLE_DATA.forEach(row => {
//       const escapedName = `"${row.name.replace(/"/g, '""')}"`;
//       const escapedFormula = `"${row.formula.replace(/"/g, '""')}"`;
//       const escapedExpl = `"${row.explanation.replace(/"/g, '""')}"`;
//       const escapedCat = `"${row.category.replace(/"/g, '""')}"`;
//       csvContent += `${row.id},${escapedCat},${escapedName},${escapedFormula},${escapedExpl}\r\n`;
//     });

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'IntegralAI_48_Fundamental_Integration_Rules.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }

//   function downloadIntegralsTxt() {
//     let txtContent = "===============================================================================\r\n";
//     txtContent += "IntegralAI — Standard Table of Integrals (48 Fundamental Rules & Identities)\r\n";
//     txtContent += "High-Precision Symbolic Calculus Reference Engine\r\n";
//     txtContent += "===============================================================================\r\n\r\n";

//     INTEGRAL_TABLE_DATA.forEach(row => {
//       txtContent += `[#${row.id}] ${row.name} (${row.category})\r\n`;
//       txtContent += `      Formula:     ${row.formula}\r\n`;
//       txtContent += `      Explanation: ${row.explanation}\r\n\r\n`;
//     });

//     const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'IntegralAI_48_Fundamental_Integration_Rules.txt');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }

//   if (btnExportCsv) btnExportCsv.addEventListener('click', downloadIntegralsCsv);
//   if (btnExportTxt) btnExportTxt.addEventListener('click', downloadIntegralsTxt);

//   // =========================================================================
//   // 10. Handwritten OCR Scanning Simulation Modal
//   // =========================================================================
//   if (btnScanNotes && scanModal) {
//     btnScanNotes.addEventListener('click', () => {
//       scanModal.classList.remove('hidden');
//       document.body.classList.add('overflow-hidden');
//     });
//   }

//   function closeScanModal() {
//     if (scanModal) {
//       scanModal.classList.add('hidden');
//       document.body.classList.remove('overflow-hidden');
//     }
//   }

//   if (btnCloseScanModal) btnCloseScanModal.addEventListener('click', closeScanModal);
//   if (btnDismissScanModal) btnDismissScanModal.addEventListener('click', closeScanModal);
//   if (scanModal) {
//     scanModal.addEventListener('click', (e) => {
//       if (e.target === scanModal) closeScanModal();
//     });
//   }

//   // =========================================================================
//   // 11. Global Keyboard Shortcuts & URL Parameter Handling
//   // =========================================================================
//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape') {
//       closeTableModal();
//       closeScanModal();
//     }
//   });

//   // Handle URL Parameters (e.g. ?view=solution or ?expr=sin(x)*cos(x))
//   const urlParams = new URLSearchParams(window.location.search);
//   const paramExpr = urlParams.get('expr');
//   const paramView = urlParams.get('view');

//   if (paramExpr && exprInput) {
//     exprInput.value = paramExpr;
//     if (btnSolve) btnSolve.click();
//   } else if (paramView === 'solution' || paramView === 'demo') {
//     if (exprInput && !exprInput.value) {
//       exprInput.value = 'sin(x) · cos(x)';
//     }
//     if (btnSolve) btnSolve.click();
//   }
// });
