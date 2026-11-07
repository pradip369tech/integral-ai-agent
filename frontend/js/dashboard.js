/**
 * IntegralAI Dashboard — Interactive Logic
 * Vanilla JavaScript implementation for in-page section navigation,
 * quick symbolic solver modal, upload processing, solution rendering,
 * interactive archive search/delete, and profile dropdown/sign out.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Section Elements ---
  const navButtons = document.querySelectorAll('.nav-tab-btn');
  const sections = document.querySelectorAll('.content-section');

  // --- Profile Dropdown Elements ---
  const btnProfileDropdown = document.getElementById('btn-profile-dropdown');
  const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
  const btnSignOut = document.getElementById('btn-sign-out');

  // --- Quick Solver Modal Elements ---
  const btnLightningTrigger = document.getElementById('btn-lightning-trigger');
  const btnQuickSolve = document.getElementById('btn-quick-solve');
  const quickSolverModal = document.getElementById('quick-solver-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const btnSolveNow = document.getElementById('btn-solve-now');
  const quickIntegralInput = document.getElementById('quick-integral-input');

  // --- Upload Section Elements ---
  const btnGotoUpload = document.getElementById('btn-goto-upload');
  const dropzone = document.getElementById('dropzone');
  const fileUploadInput = document.getElementById('file-upload-input');
  const selectedFileBanner = document.getElementById('selected-file-banner');
  const selectedFilename = document.getElementById('selected-filename');
  const btnSubmitUpload = document.getElementById('btn-submit-upload');
  const btnResetUpload = document.getElementById('btn-reset-upload');
  const inputIntegralText = document.getElementById('input-integral-text');

  // --- History Section Elements ---
  const historySearchInput = document.getElementById('history-search-input');
  const historyCards = document.querySelectorAll('.history-card');

  // =========================================================================
  // 1. Navigation Switching (Upload/Solution redirects to upload.html)
  // =========================================================================
  function showSection(targetSectionId) {
    if (targetSectionId === 'section-upload') {
      window.location.href = 'upload-solution.html';
      return;
    }
    if (targetSectionId === 'section-solution') {
      window.location.href = 'upload-solution.html?view=solution';
      return;
    }

    sections.forEach(sec => {
      if (sec.id === targetSectionId) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });

    navButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-section') === targetSectionId;
      if (isTarget) {
        btn.classList.add('active', 'text-primary', 'bg-indigo-50/90', 'font-semibold');
        btn.classList.remove('text-slate-600');
        // Ensure indicator is present
        if (!btn.querySelector('.nav-indicator')) {
          const indicator = document.createElement('span');
          indicator.className = 'nav-indicator absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-primary rounded-full';
          btn.appendChild(indicator);
        }
      } else {
        btn.classList.remove('active', 'text-primary', 'bg-indigo-50/90', 'font-semibold');
        btn.classList.add('text-slate-600');
        const indicator = btn.querySelector('.nav-indicator');
        if (indicator) indicator.remove();
      }
    });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-section');
      if (targetId) showSection(targetId);
    });
  });

  if (btnGotoUpload) {
    btnGotoUpload.addEventListener('click', () => {
      window.location.href = 'upload-solution.html';
    });
  }

  if (btnQuickSolve) {
    btnQuickSolve.addEventListener('click', () => {
      window.location.href = 'upload-solution.html';
    });
  }

  // Handle URL section parameter if returned from upload.html
  const params = new URLSearchParams(window.location.search);
  const targetSec = params.get('section');
  if (targetSec && document.getElementById(targetSec)) {
    showSection(targetSec);
  }

  // =========================================================================
  // 2. Profile Dropdown & Sign Out Handler
  // =========================================================================
  if (btnProfileDropdown && profileDropdownMenu) {
    btnProfileDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = btnProfileDropdown.getAttribute('aria-expanded') === 'true';
      btnProfileDropdown.setAttribute('aria-expanded', !isExpanded);
      profileDropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdownMenu.contains(e.target) && !btnProfileDropdown.contains(e.target)) {
        profileDropdownMenu.classList.add('hidden');
        btnProfileDropdown.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      // Clear workstation session cache and redirect to login page
      sessionStorage.removeItem('integral_user_auth');
      window.location.href = 'sign-in.html';
    });
  }

  // =========================================================================
  // 3. Quick Solver Modal Controls
  // =========================================================================
  function openModal() {
    if (quickSolverModal) {
      quickSolverModal.classList.remove('hidden');
      if (quickIntegralInput) quickIntegralInput.focus();
    }
  }

  function closeModal() {
    if (quickSolverModal) {
      quickSolverModal.classList.add('hidden');
    }
  }

  if (btnLightningTrigger) btnLightningTrigger.addEventListener('click', openModal);
  if (btnQuickSolve) btnQuickSolve.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (btnSolveNow) {
    btnSolveNow.addEventListener('click', () => {
      const expr = quickIntegralInput ? quickIntegralInput.value.trim() : '';
      closeModal();
      if (expr) {
        window.location.href = `upload-solution.html?expr=${encodeURIComponent(expr)}`;
      } else {
        window.location.href = 'upload-solution.html?view=solution';
      }
    });
  }

  // =========================================================================
  // 4. File Upload & Ingestion Controls
  // =========================================================================
  if (dropzone && fileUploadInput) {
    dropzone.addEventListener('click', () => fileUploadInput.click());

    fileUploadInput.addEventListener('change', () => {
      if (fileUploadInput.files && fileUploadInput.files[0]) {
        const file = fileUploadInput.files[0];
        if (selectedFilename) selectedFilename.textContent = file.name;
        if (selectedFileBanner) selectedFileBanner.classList.remove('hidden');
      }
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('border-primary', 'bg-indigo-50/50');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary', 'bg-indigo-50/50');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (selectedFilename) selectedFilename.textContent = file.name;
        if (selectedFileBanner) selectedFileBanner.classList.remove('hidden');
      }
    });
  }

  if (btnResetUpload) {
    btnResetUpload.addEventListener('click', () => {
      if (inputIntegralText) inputIntegralText.value = '';
      if (fileUploadInput) fileUploadInput.value = '';
      if (selectedFileBanner) selectedFileBanner.classList.add('hidden');
    });
  }

  if (btnSubmitUpload) {
    btnSubmitUpload.addEventListener('click', () => {
      btnSubmitUpload.disabled = true;
      const originalText = btnSubmitUpload.innerHTML;
      btnSubmitUpload.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Parsing Expression...`;

      setTimeout(() => {
        btnSubmitUpload.disabled = false;
        btnSubmitUpload.innerHTML = originalText;
        showSection('section-solution');
      }, 700);
    });
  }

  // =========================================================================
  // 5. History Search & Deletion
  // =========================================================================
  if (historySearchInput) {
    historySearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      historyCards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        if (title.toLowerCase().includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  document.querySelectorAll('.btn-delete-history').forEach(delBtn => {
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = delBtn.closest('.history-card');
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97)';
        setTimeout(() => card.remove(), 200);
      }
    });
  });
});
