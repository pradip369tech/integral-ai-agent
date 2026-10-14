/**
 * IntegralAI Authentication Portal — Interactive Logic
 * Vanilla JavaScript implementation for tab switching, continuous live validation,
 * dynamic 4-criteria password strength analyzer, password match indicator,
 * accessible modal interactions, and loading states.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const tabSignIn = document.getElementById('tab-signin');
  const tabSignUp = document.getElementById('tab-signup');
  const formSignIn = document.getElementById('form-signin');
  const formSignUp = document.getElementById('form-signup');
  const portalTitle = document.getElementById('portal-title');
  const portalSubtitle = document.getElementById('portal-subtitle');
  const footerAccountSwitch = document.getElementById('footer-account-switch');
  const linkToSignIn = document.getElementById('link-to-signin');

  // Sign In inputs & errors
  const signInEmail = document.getElementById('signin-email');
  const signInPassword = document.getElementById('signin-password');
  const signInEmailError = document.getElementById('signin-email-error');
  const signInPasswordError = document.getElementById('signin-password-error');
  const signInRemember = document.getElementById('signin-remember');

  // Create Account inputs & errors
  const signUpName = document.getElementById('signup-name');
  const signUpEmail = document.getElementById('signup-email');
  const signUpPassword = document.getElementById('signup-password');
  const signUpConfirmPassword = document.getElementById('signup-confirm-password');
  const signUpAgree = document.getElementById('signup-agree');
  const signUpNameError = document.getElementById('signup-name-error');
  const signUpEmailError = document.getElementById('signup-email-error');
  const signUpPasswordError = document.getElementById('signup-password-error');
  const signUpAgreeError = document.getElementById('signup-agree-error');
  const matchIndicator = document.getElementById('match-indicator');

  // Password Complexity Elements
  const complexityRating = document.getElementById('complexity-rating');
  const barSegments = [
    document.getElementById('bar-1'),
    document.getElementById('bar-2'),
    document.getElementById('bar-3'),
    document.getElementById('bar-4')
  ];
  const critLength = document.getElementById('crit-length');
  const critSymbols = document.getElementById('crit-symbols');
  const critNumbers = document.getElementById('crit-numbers');
  const critMixed = document.getElementById('crit-mixed');

  // Forgot Password Modal Elements
  const btnForgotPassword = document.getElementById('btn-forgot-password');
  const forgotModal = document.getElementById('forgot-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const formForgotPass = document.getElementById('form-forgot-pass');
  const forgotEmail = document.getElementById('forgot-email');
  const forgotEmailError = document.getElementById('forgot-email-error');
  const forgotSuccessState = document.getElementById('forgot-success-state');
  const forgotSuccessMsg = document.getElementById('forgot-success-msg');
  const btnDoneForgot = document.getElementById('btn-done-forgot');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // 1. Tab Switching Functionality (No Page Reload)
  // =========================================================================
  function switchTab(target) {
    if (target === 'signin') {
      if (tabSignIn) {
        tabSignIn.classList.add('active');
        tabSignIn.setAttribute('aria-selected', 'true');
      }
      if (tabSignUp) {
        tabSignUp.classList.remove('active');
        tabSignUp.setAttribute('aria-selected', 'false');
      }

      if (formSignIn) formSignIn.hidden = false;
      if (formSignUp) formSignUp.hidden = true;

      if (portalTitle) portalTitle.textContent = 'Computational Access Portal';
      if (portalSubtitle) portalSubtitle.textContent = 'AI-Powered Integration & Higher-Level Analytical Engine';
      if (footerAccountSwitch) footerAccountSwitch.hidden = true;
    } else {
      if (tabSignUp) {
        tabSignUp.classList.add('active');
        tabSignUp.setAttribute('aria-selected', 'true');
      }
      if (tabSignIn) {
        tabSignIn.classList.remove('active');
        tabSignIn.setAttribute('aria-selected', 'false');
      }

      if (formSignUp) formSignUp.hidden = false;
      if (formSignIn) formSignIn.hidden = true;

      if (portalTitle) portalTitle.textContent = 'Create Computational Account';
      if (portalSubtitle) portalSubtitle.textContent = 'Gain immediate verified access to step-by-step symbolicderivation.';
      if (footerAccountSwitch) footerAccountSwitch.hidden = false;

      // Recalculate live indicators
      if (signUpPassword) updatePasswordComplexity(signUpPassword.value);
      checkPasswordMatch();
    }
  }

  if (tabSignIn) tabSignIn.addEventListener('click', () => switchTab('signin'));
  if (tabSignUp) tabSignUp.addEventListener('click', () => switchTab('signup'));
  if (linkToSignIn) linkToSignIn.addEventListener('click', () => switchTab('signin'));

  // =========================================================================
  // 2. Password Visibility Toggle (Show / Hide Password)
  // =========================================================================
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const iconSpan = btn.querySelector('.material-symbols-outlined');
      const isPassword = input.type === 'password';

      if (isPassword) {
        input.type = 'text';
        if (iconSpan) iconSpan.textContent = 'visibility_off';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        if (iconSpan) iconSpan.textContent = 'visibility';
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });

  // =========================================================================
  // 3. Live Continuous Password Strength Evaluation
  // Criteria:
  // 1. At least 8 characters
  // 2. Contains both uppercase and lowercase letters
  // 3. Contains at least one number
  // 4. Contains at least one special character (@, #, !, $, etc.)
  //
  // Indicator States:
  // - Empty: 0 criteria met — No progress bar or strength label.
  // - Weak: 1 criterion met — short red bar.
  // - Medium: 2 criteria met — half-length orange bar.
  // - Strong: 3 criteria met — longer blue/purple bar.
  // - Very Strong: All 4 criteria met — full purple bar.
  // =========================================================================
  function evaluatePasswordStrength(password) {
    if (!password) {
      return {
        checks: { length: false, mixed: false, numbers: false, symbols: false },
        score: 0
      };
    }

    const checks = {
      length: password.length >= 8,
      mixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)
    };

    let score = 0;
    if (checks.length) score++;
    if (checks.mixed) score++;
    if (checks.numbers) score++;
    if (checks.symbols) score++;

    return { checks, score };
  }

  function updatePasswordComplexity(pwd) {
    if (!complexityRating) return;

    const { checks, score } = evaluatePasswordStrength(pwd);

    // Update criteria checklist items
    updateCriterion(critLength, checks.length);
    updateCriterion(critMixed, checks.mixed);
    updateCriterion(critNumbers, checks.numbers);
    updateCriterion(critSymbols, checks.symbols);

    // Reset all bar classes
    barSegments.forEach(bar => {
      if (bar) {
        bar.className = 'bar-segment';
      }
    });

    // Update progress bars & strength labels per exact specification
    if (!pwd || pwd.length === 0 || score === 0) {
      complexityRating.textContent = 'Empty (0/4 Criteria Met)';
      complexityRating.style.color = 'var(--color-text-subtle)';
    } else if (score === 1) {
      // Weak: 1 criterion met — short red bar
      if (barSegments[0]) barSegments[0].classList.add('active-weak');
      complexityRating.textContent = 'Weak (1/4 Criteria Met)';
      complexityRating.style.color = 'var(--color-error)';
    } else if (score === 2) {
      // Medium: 2 criteria met — half-length orange bar
      if (barSegments[0]) barSegments[0].classList.add('active-medium');
      if (barSegments[1]) barSegments[1].classList.add('active-medium');
      complexityRating.textContent = 'Medium (2/4 Criteria Met)';
      complexityRating.style.color = 'var(--color-orange)';
    } else if (score === 3) {
      // Strong: 3 criteria met — longer blue/purple bar
      if (barSegments[0]) barSegments[0].classList.add('active-strong');
      if (barSegments[1]) barSegments[1].classList.add('active-strong');
      if (barSegments[2]) barSegments[2].classList.add('active-strong');
      complexityRating.textContent = 'Strong (3/4 Criteria Met)';
      complexityRating.style.color = 'var(--color-primary-container)';
    } else if (score === 4) {
      // Very Strong: All 4 criteria met — full purple bar
      barSegments.forEach(bar => {
        if (bar) bar.classList.add('active-very-strong');
      });
      complexityRating.textContent = 'Strong (4/4 Criteria Met)';
      complexityRating.style.color = 'var(--color-primary)';
    }
  }

  function updateCriterion(elem, isValid) {
    if (!elem) return;
    const icon = elem.querySelector('.crit-icon');
    if (isValid) {
      elem.classList.add('valid');
      if (icon) icon.textContent = '✓';
    } else {
      elem.classList.remove('valid');
      if (icon) icon.textContent = '○';
    }
  }

  if (signUpPassword) {
    signUpPassword.addEventListener('input', (e) => {
      updatePasswordComplexity(e.target.value);
      checkPasswordMatch();
      clearError(signUpPassword, signUpPasswordError);
    });
  }

  // =========================================================================
  // 4. Confirm Password Match Checker (Live)
  // =========================================================================
  function checkPasswordMatch() {
    if (!signUpPassword || !signUpConfirmPassword || !matchIndicator) return;

    const pwd = signUpPassword.value;
    const confirm = signUpConfirmPassword.value;

    if (!confirm || confirm.length === 0) {
      matchIndicator.classList.add('hidden-badge');
      return;
    }

    matchIndicator.classList.remove('hidden-badge');
    const iconSpan = matchIndicator.querySelector('.match-icon');
    const textSpan = matchIndicator.querySelector('.match-text');

    if (pwd === confirm && pwd.length > 0) {
      matchIndicator.classList.remove('mismatch');
      if (iconSpan) iconSpan.textContent = 'check';
      if (textSpan) textSpan.textContent = 'Match';
    } else {
      matchIndicator.classList.add('mismatch');
      if (iconSpan) iconSpan.textContent = 'close';
      if (textSpan) textSpan.textContent = 'Mismatch';
    }
  }

  if (signUpConfirmPassword) {
    signUpConfirmPassword.addEventListener('input', () => {
      checkPasswordMatch();
      clearError(signUpConfirmPassword, signUpPasswordError);
    });
  }

  // =========================================================================
  // 5. Validation Helpers
  // =========================================================================
  function isValidEmail(email) {
    // Robust email regex pattern
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
  }

  function showError(input, errorElem, message) {
    if (input) input.classList.add('has-error');
    if (errorElem) errorElem.textContent = message;
  }

  function clearError(input, errorElem) {
    if (input) input.classList.remove('has-error');
    if (errorElem) errorElem.textContent = '';
  }

  // Live email format validation for Create Account
  if (signUpEmail) {
    signUpEmail.addEventListener('input', () => {
      const val = signUpEmail.value.trim();
      if (val.length === 0) {
        clearError(signUpEmail, signUpEmailError);
      } else if (!isValidEmail(val)) {
        showError(signUpEmail, signUpEmailError, 'Invalid email format (e.g. name@university.edu).');
      } else {
        clearError(signUpEmail, signUpEmailError);
      }
    });
  }

  // Live clear on input for Name
  if (signUpName) {
    signUpName.addEventListener('input', () => {
      if (signUpName.value.trim().length > 0) {
        clearError(signUpName, signUpNameError);
      }
    });
  }

  // Live clear for agreement checkbox
  if (signUpAgree) {
    signUpAgree.addEventListener('change', () => {
      if (signUpAgree.checked && signUpAgreeError) {
        signUpAgreeError.textContent = '';
      }
    });
  }

  // Auto-clear for sign-in fields
  if (signInEmail) {
    signInEmail.addEventListener('input', () => clearError(signInEmail, signInEmailError));
  }
  if (signInPassword) {
    signInPassword.addEventListener('input', () => clearError(signInPassword, signInPasswordError));
  }

  // =========================================================================
  // 6. Create Account Submission Handler (with Focus on First Invalid Field)
  // =========================================================================
  if (formSignUp) {
    formSignUp.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;

      // 1. Full Name validation
      const nameVal = signUpName ? signUpName.value.trim() : '';
      if (!nameVal) {
        showError(signUpName, signUpNameError, 'Full name is required for computational identity.');
        if (!firstInvalid) firstInvalid = signUpName;
      } else {
        clearError(signUpName, signUpNameError);
      }

      // 2. Email validation
      const emailVal = signUpEmail ? signUpEmail.value.trim() : '';
      if (!emailVal) {
        showError(signUpEmail, signUpEmailError, 'Email address is required.');
        if (!firstInvalid) firstInvalid = signUpEmail;
      } else if (!isValidEmail(emailVal)) {
        showError(signUpEmail, signUpEmailError, 'Please enter a valid academic/institutional email.');
        if (!firstInvalid) firstInvalid = signUpEmail;
      } else {
        clearError(signUpEmail, signUpEmailError);
      }

      // 3. Password Strength (all 4 criteria) & Match validation
      const pwdVal = signUpPassword ? signUpPassword.value : '';
      const confirmVal = signUpConfirmPassword ? signUpConfirmPassword.value : '';
      const { score } = evaluatePasswordStrength(pwdVal);

      if (!pwdVal) {
        showError(signUpPassword, signUpPasswordError, 'Please enter a password.');
        if (!firstInvalid) firstInvalid = signUpPassword;
      } else if (score < 4) {
        showError(signUpPassword, signUpPasswordError, 'Password must satisfy all 4 criteria (≥8 chars, mixed case, numbers, symbols).');
        if (!firstInvalid) firstInvalid = signUpPassword;
      } else if (pwdVal !== confirmVal) {
        showError(signUpConfirmPassword, signUpPasswordError, 'Passwords do not match.');
        if (!firstInvalid) firstInvalid = signUpConfirmPassword;
      } else {
        clearError(signUpPassword, signUpPasswordError);
        clearError(signUpConfirmPassword, signUpPasswordError);
      }

      // 4. Agreement Checkbox validation
      if (signUpAgree && !signUpAgree.checked) {
        if (signUpAgreeError) signUpAgreeError.textContent = 'You must accept the Autonomous Learning Agreement to continue.';
        if (!firstInvalid) firstInvalid = signUpAgree;
      } else if (signUpAgreeError) {
        signUpAgreeError.textContent = '';
      }

      // If invalid, focus the first invalid field
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // 5. Valid submission: Loading state & frontend-only success simulation
      const submitBtn = document.getElementById('btn-submit-signup');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
          <span>Creating Account...</span>
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        showToast(
          'Account Provisioned',
          `Welcome ${nameVal}! Your computational profile has been initialized. Redirecting to workspace session...`,
          'success'
        );

        // Pre-fill email in Sign In form and smoothly switch
        setTimeout(() => {
          if (signInEmail) signInEmail.value = emailVal;
          switchTab('signin');
        }, 1400);
      }, 1000);
    });
  }

  // =========================================================================
  // 7. Sign In Submission Handler
  // =========================================================================
  if (formSignIn) {
    formSignIn.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;

      const emailVal = signInEmail ? signInEmail.value.trim() : '';
      if (!emailVal) {
        showError(signInEmail, signInEmailError, 'Institutional email is required.');
        if (!firstInvalid) firstInvalid = signInEmail;
      } else if (!isValidEmail(emailVal)) {
        showError(signInEmail, signInEmailError, 'Please provide a valid institutional email format.');
        if (!firstInvalid) firstInvalid = signInEmail;
      } else {
        clearError(signInEmail, signInEmailError);
      }

      const passVal = signInPassword ? signInPassword.value : '';
      if (!passVal) {
        showError(signInPassword, signInPasswordError, 'Secret token or passphrase is required.');
        if (!firstInvalid) firstInvalid = signInPassword;
      } else {
        clearError(signInPassword, signInPasswordError);
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const submitBtn = document.getElementById('btn-submit-signin');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
          <span>Connecting to Kernel...</span>
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        showToast(
          'Access Granted',
          `Authenticated as ${emailVal}. Redirecting to Calculus Mastery Dashboard...`,
          'success'
        );

        // Store workstation session state
        sessionStorage.setItem('integral_user_auth', JSON.stringify({
          email: emailVal,
          role: 'MATH-202H • Student Scholar',
          name: 'Elena Vance'
        }));

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 700);
      }, 850);
    });
  }

  // =========================================================================
  // 8. Forgot Password Modal Dialog Interactions
  // =========================================================================
  function openForgotModal() {
    if (!forgotModal) return;
    forgotModal.hidden = false;
    if (formForgotPass) formForgotPass.hidden = false;
    if (forgotSuccessState) forgotSuccessState.hidden = true;
    if (forgotEmail) {
      forgotEmail.value = (signInEmail && signInEmail.value) ? signInEmail.value : '';
      clearError(forgotEmail, forgotEmailError);
      forgotEmail.focus();
    }
  }

  function closeForgotModal() {
    if (forgotModal) forgotModal.hidden = true;
  }

  if (btnForgotPassword) btnForgotPassword.addEventListener('click', openForgotModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeForgotModal);
  if (btnDoneForgot) {
    btnDoneForgot.addEventListener('click', () => {
      closeForgotModal();
      switchTab('signin');
    });
  }

  if (forgotModal) {
    forgotModal.addEventListener('click', (e) => {
      if (e.target === forgotModal) closeForgotModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && forgotModal && !forgotModal.hidden) {
      closeForgotModal();
    }
  });

  if (formForgotPass) {
    formForgotPass.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = forgotEmail ? forgotEmail.value.trim() : '';

      if (!emailVal || !isValidEmail(emailVal)) {
        showError(forgotEmail, forgotEmailError, 'Enter a valid institutional email to receive recovery instructions.');
        if (forgotEmail) forgotEmail.focus();
        return;
      }

      clearError(forgotEmail, forgotEmailError);
      const sendBtn = document.getElementById('btn-send-reset');
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<span>Dispatching Passkey...</span>`;
      }

      setTimeout(() => {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = `<span>Dispatch Recovery Token</span>`;
        }
        if (formForgotPass) formForgotPass.hidden = true;
        if (forgotSuccessState) forgotSuccessState.hidden = false;
        if (forgotSuccessMsg) {
          forgotSuccessMsg.textContent = `A cryptographic one-time reset token has been dispatched to ${emailVal}.`;
        }
      }, 700);
    });
  }

  // =========================================================================
  // 9. Toast Notification System
  // =========================================================================
  function showToast(title, message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 250);
    }, 4500);
  }

  // Initialize initial state based on current inputs
  if (signUpPassword) {
    updatePasswordComplexity(signUpPassword.value);
  }
  checkPasswordMatch();
});
