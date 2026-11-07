% ============================================================
% GLOBAL VARIABLE DECLARATIONS
% ============================================================

% x: Variable of integration.
% n: Exponent/power used in the power rule. Condition: n != -1.
% a: Constant parameter. Conditions depend on the formula.
% C: Arbitrary constant of integration.
% L: Lower limit of definite integration.
% U: Upper limit of definite integration.
% f(x): Integrand function.
% F(x): Antiderivative of f(x), such that F'(x) = f(x).


% ============================================================
% STANDARD INDEFINITE INTEGRATION FORMULAS
% ============================================================


% (i) Power Rule
% Normal: Integral of x^n dx = x^(n+1)/(n+1) + C.
% Condition: n != -1.

\[
\int x^n\,dx = \frac{x^{n+1}}{n+1}+C,
\qquad n\neq -1
\]


% (ii) Logarithmic Formula
% Normal: Integral of 1/x dx = ln|x| + C.
% Condition: x != 0.

\[
\int \frac{1}{x}\,dx = \ln|x|+C
\]


% (iii) Exponential Formula

\[
\int e^x\,dx = e^x+C
\]


% (iv) General Exponential Formula
% Conditions: a > 0 and a != 1.

\[
\int a^x\,dx = \frac{a^x}{\ln a}+C,
\qquad a>0,\quad a\neq1
\]


% (v) Sine Formula

\[
\int \sin x\,dx = -\cos x+C
\]


% (vi) Cosine Formula

\[
\int \cos x\,dx = \sin x+C
\]


% (vii) Secant-Squared Formula

\[
\int \sec^2 x\,dx = \tan x+C
\]


% (viii) Cosecant-Squared Formula

\[
\int \cosec^2 x\,dx = -\cot x+C
\]


% (ix) Secant-Tangent Formula

\[
\int \sec x\tan x\,dx = \sec x+C
\]


% (x) Cosecant-Cotangent Formula

\[
\int \cosec x\cot x\,dx = -\cosec x+C
\]


% (xi) Cotangent Formula

\[
\int \cot x\,dx = \ln|\sin x|+C
\]


% (xii) Tangent Formula

\[
\int \tan x\,dx = -\ln|\cos x|+C
\]


% (xiii) Secant Formula

\[
\int \sec x\,dx
=
\ln|\sec x+\tan x|+C
\]


% (xiv) Cosecant Formula

\[
\int \cosec x\,dx
=
\ln|\cosec x-\cot x|+C
\]


% (xv) Inverse Sine Formula
% Conditions: a > 0 and |x| < a.

\[
\int \frac{1}{\sqrt{a^2-x^2}}\,dx
=
\sin^{-1}\left(\frac{x}{a}\right)+C
\]


% (xvi) Inverse Cosine Formula
% Conditions: a > 0 and |x| < a.

\[
\int \frac{-1}{\sqrt{a^2-x^2}}\,dx
=
\cos^{-1}\left(\frac{x}{a}\right)+C
\]


% (xvii) Inverse Tangent Formula
% Condition: a > 0.

\[
\int \frac{1}{a^2+x^2}\,dx
=
\frac{1}{a}\tan^{-1}\left(\frac{x}{a}\right)+C,
\qquad a>0
\]


% (xviii) Inverse Cotangent Formula
% Condition: a > 0, using the standard principal branch.

\[
\int \frac{-1}{a^2+x^2}\,dx
=
\frac{1}{a}\cot^{-1}\left(\frac{x}{a}\right)+C,
\qquad a>0
\]


% (xix) Inverse Secant Formula
% Conditions: a > 0 and x > a.

\[
\int \frac{1}{x\sqrt{x^2-a^2}}\,dx
=
\frac{1}{a}\sec^{-1}\left(\frac{x}{a}\right)+C,
\qquad a>0,\quad x>a
\]


% (xx) Inverse Cosecant Formula
% Conditions: a > 0 and x > a.

\[
\int \frac{-1}{x\sqrt{x^2-a^2}}\,dx
=
\frac{1}{a}\cosec^{-1}\left(\frac{x}{a}\right)+C,
\qquad a>0,\quad x>a
\]


% (xi) INTEGRATION BY PARTS Formula

% u: First function.
% v: Integral of the second function.
% du: Derivative of u.
% dv: Second function multiplied by dx.

\[
\boxed{\int u\,dv = uv-\int v\,du}
\]

% Equivalent form:

\[
\boxed{\int f(x)g(x)\,dx
= f(x)\int g(x)\,dx
-\int\left[f'(x)\int g(x)\,dx\right]dx}
\]

% Definite integration by parts:

\[
\boxed{\int_L^U u\,dv
= \left[uv\right]_L^U-\int_L^U v\,du}
\]


% ============================================================
% DEFINITE INTEGRATION FORMULAS
% ============================================================


% (i) Fundamental Theorem of Calculus
% F'(x) = f(x), where f is continuous on [L,U].
% L: Lower limit.
% U: Upper limit.

\[
\int_L^U f(x)\,dx = F(U)-F(L)
\]


% (ii) Definite Power Rule
% Condition: n != -1.
% Assumes x^n has an antiderivative throughout the interval.

\[
\int_L^U x^n\,dx
=
\frac{U^{n+1}-L^{n+1}}{n+1},
\qquad n\neq -1
\]


% (iii) Definite Logarithmic Formula
% Conditions: L and U are nonzero, and the interval
% does not cross or include x = 0.

\[
\int_L^U \frac{1}{x}\,dx
=
\ln|U|-\ln|L|
\]


% (iv) Definite Exponential Formula

\[
\int_L^U e^x\,dx
=
e^U-e^L
\]


% (v) Definite General Exponential Formula
% Conditions: a > 0 and a != 1.

\[
\int_L^U a^x\,dx
=
\frac{a^U-a^L}{\ln a},
\qquad a>0,\quad a\neq1
\]


% (vi) Definite Sine Formula

\[
\int_L^U \sin x\,dx
=
\cos L-\cos U
\]


% (vii) Definite Cosine Formula

\[
\int_L^U \cos x\,dx
=
\sin U-\sin L
\]


% (viii) Definite Secant-Squared Formula
% The interval must contain no points where cos(x) = 0.

\[
\int_L^U \sec^2 x\,dx
=
\tan U-\tan L
\]


% (ix) Definite Cosecant-Squared Formula
% The interval must contain no points where sin(x) = 0.

\[
\int_L^U \cosec^2 x\,dx
=
\cot L-\cot U
\]


% (x) Definite Secant-Tangent Formula
% The interval must contain no points where cos(x) = 0.

\[
\int_L^U \sec x\tan x\,dx
=
\sec U-\sec L
\]


% (xi) Definite Cosecant-Cotangent Formula
% The interval must contain no points where sin(x) = 0.

\[
\int_L^U \cosec x\cot x\,dx
=
\cosec L-\cosec U
\]