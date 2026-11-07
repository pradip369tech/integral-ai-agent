/**
 * IntegralAI — Reusable Shared Navbar Loader & Controller
 * Dynamically fetches and inserts components/navbar.html into #navbar-placeholder,
 * sets up the active-tab indicators, handles profile dropdown, sign-out, and mobile navigation.
 */

(function () {
  'use strict';

  // Prevent multiple executions if included multiple times
  if (window.__integralNavbarInitialized) return;
  window.__integralNavbarInitialized = true;

  /**
   * Determine the current active page identifier.
   */
  function detectCurrentPage(placeholder) {
    // 1. Check placeholder attribute override
    if (placeholder) {
      const explicitPage = placeholder.getAttribute('data-active-page') || placeholder.getAttribute('data-page');
      if (explicitPage) return explicitPage.toLowerCase();
    }

    // 2. Check body dataset
    if (document.body.dataset && document.body.dataset.page) {
      return document.body.dataset.page.toLowerCase();
    }

    // 3. Fallback to URL path inspection
    const path = window.location.pathname.toLowerCase();
    if (path.includes('upload-solution') || path.includes('upload') || path.includes('solution')) {
      return 'upload-solution';
    }
    if (path.includes('visualization')) {
      return 'visualization';
    }
    if (path.includes('history')) {
      return 'history';
    }
    // Default to dashboard
    return 'dashboard';
  }

  /**
   * Apply active styling to the matched link.
   */
  function highlightActiveNavigation(activePage) {
    const desktopLinks = document.querySelectorAll('#nav-tabs .nav-tab-link');
    desktopLinks.forEach(link => {
      const linkPage = (link.getAttribute('data-page') || '').toLowerCase();
      const isActive = linkPage === activePage ||
        (activePage === 'upload-solution' && (linkPage === 'upload' || linkPage === 'solution'));

      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        let indicator = link.querySelector('.nav-indicator');
        if (!indicator) {
          indicator = document.createElement('span');
          indicator.className = 'nav-indicator';
          indicator.setAttribute('aria-hidden', 'true');
          link.appendChild(indicator);
        }
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    const mobileLinks = document.querySelectorAll('#mobile-nav-drawer .mobile-nav-link');
    mobileLinks.forEach(link => {
      const linkPage = (link.getAttribute('data-page') || '').toLowerCase();
      const isActive = linkPage === activePage ||
        (activePage === 'upload-solution' && (linkPage === 'upload' || linkPage === 'solution'));

      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Bind event listeners for dropdowns and navigation controls.
   */
  function attachNavbarInteractions() {
    const btnProfileDropdown = document.getElementById('btn-profile-dropdown');
    const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
    const btnSignOut = document.getElementById('btn-sign-out');
    const btnMobileToggle = document.getElementById('btn-mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileIcon = document.getElementById('mobile-menu-icon');

    // Profile Dropdown Toggle
    if (btnProfileDropdown && profileDropdownMenu) {
      btnProfileDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = btnProfileDropdown.getAttribute('aria-expanded') === 'true';
        btnProfileDropdown.setAttribute('aria-expanded', String(!isExpanded));
        profileDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!profileDropdownMenu.contains(e.target) && !btnProfileDropdown.contains(e.target)) {
          profileDropdownMenu.classList.add('hidden');
          btnProfileDropdown.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Sign Out
    if (btnSignOut) {
      btnSignOut.addEventListener('click', () => {
        sessionStorage.removeItem('integral_user_auth');
        window.location.href = 'sign-in.html';
      });
    }

    // Mobile Navigation Toggle
    if (btnMobileToggle && mobileDrawer) {
      btnMobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isClosed = mobileDrawer.classList.contains('hidden');
        if (isClosed) {
          mobileDrawer.classList.remove('hidden');
          if (mobileIcon) {
            mobileIcon.classList.remove('fa-bars');
            mobileIcon.classList.add('fa-xmark');
          }
        } else {
          mobileDrawer.classList.add('hidden');
          if (mobileIcon) {
            mobileIcon.classList.remove('fa-xmark');
            mobileIcon.classList.add('fa-bars');
          }
        }
      });
    }

    // Escape Key to close menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (profileDropdownMenu) profileDropdownMenu.classList.add('hidden');
        if (btnProfileDropdown) btnProfileDropdown.setAttribute('aria-expanded', 'false');
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
        if (mobileIcon) {
          mobileIcon.classList.remove('fa-xmark');
          mobileIcon.classList.add('fa-bars');
        }
      }
    });
  }

  /**
   * Resolve component URL relative to current script or document.
   */
  function resolveNavbarComponentUrl() {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      const src = scripts[i].src || '';
      if (src.includes('navbar.js')) {
        return new URL('../components/navbar.html', src).href;
      }
    }
    return '../components/navbar.html';
  }

  /**
   * Main Loader Function
   */
  async function loadSharedNavbar() {
    const placeholder = document.getElementById('navbar-placeholder') ||
                        document.querySelector('[data-navbar-placeholder]') ||
                        document.getElementById('navbar-container');

    if (!placeholder) {
      console.warn('[IntegralAI Navbar] Warning: No #navbar-placeholder found in DOM.');
      return;
    }

    const componentUrl = resolveNavbarComponentUrl();

    try {
      const response = await fetch(componentUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${componentUrl} (HTTP ${response.status})`);
      }
      const navbarHtml = await response.text();
      placeholder.innerHTML = navbarHtml;

      const activePage = detectCurrentPage(placeholder);
      highlightActiveNavigation(activePage);
      attachNavbarInteractions();

      // Dispatch event for any page-specific handlers that need the navbar
      document.dispatchEvent(new CustomEvent('integralNavbarLoaded', {
        detail: { activePage, placeholder }
      }));
    } catch (error) {
      console.error('[IntegralAI Navbar] Error loading shared navbar component:', error);
      
      // Fallback for file:// protocol where browser CORS security restricts local file fetch
      if (window.location.protocol === 'file:') {
        console.warn('[IntegralAI Navbar] Attempting fallback render for file:// protocol.');
        renderNavbarFallback(placeholder);
      }
    }
  }

  /**
   * Graceful fallback when loading over file:// protocol without a web server.
   */
  function renderNavbarFallback(placeholder) {
    placeholder.innerHTML = `
      <header class="shared-navbar sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs" id="main-navbar" data-purpose="navigation-header">
        <div class="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a href="dashboard.html" class="flex items-center space-x-2.5 group">
              <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <span class="nav-math-font text-2xl font-serif">∫</span>
              </div>
              <div>
                <div class="font-bold tracking-tight text-slate-900 text-lg flex items-center gap-1.5 leading-none">
                  Integral<span class="text-indigo-600">AI</span>
                </div>
                <p class="text-[10px] tracking-wide font-medium uppercase text-slate-500 mt-0.5">AI-Powered Integration ENGINE</p>
              </div>
            </a>
            <nav aria-label="Global Navigation" class="hidden md:flex items-center space-x-1" id="nav-tabs">
              <a href="dashboard.html" data-page="dashboard" class="nav-tab-link">Dashboard<span class="nav-indicator"></span></a>
              <a href="upload-solution.html" data-page="upload-solution" class="nav-tab-link">Upload/Solution<span class="nav-indicator"></span></a>
              <a href="visualization.html" data-page="visualization" class="nav-tab-link">Visualization<span class="nav-indicator"></span></a>
              <a href="history.html" data-page="history" class="nav-tab-link">History<span class="nav-indicator"></span></a>
            </nav>
            <div class="flex items-center space-x-3.5">
              <div class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-medium">
                <span class="w-2 h-2 rounded-full bg-emerald-500 nav-pulse-dot"></span>
                <span>Kernel Active</span>
              </div>
              <div class="w-8 h-8 rounded-full ring-2 ring-indigo-200 bg-gradient-to-tr from-indigo-200 to-purple-200 flex items-center justify-center font-bold text-xs text-indigo-800">EV</div>
              <span class="text-xs font-semibold text-slate-900 hidden sm:inline-block">Elena Vance</span>
            </div>
          </div>
        </div>
      </header>
    `;
    const activePage = detectCurrentPage(placeholder);
    highlightActiveNavigation(activePage);
  }

  // Execute when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSharedNavbar);
  } else {
    loadSharedNavbar();
  }
})();
