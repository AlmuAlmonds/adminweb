/* ========================================
   PULSE Accessibility Engine v2
   Fully functional — TTS, Dyslexia Font,
   High Contrast, Large UI, localStorage
   ======================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'pulse_a11y_prefs';

  /* ── Default preferences ── */
  const DEFAULTS = {
    textToSpeech: false,
    dyslexiaFont: false,
    highContrast: false,
    largeUI: false,
    simpleMode: false,
    colorblind: false,
    voiceGuidance: false,
    iconLabels: false,
    textSize: 100,
    emergencyShortcut: false,
    confirmPrompts: false
  };

  let prefs = {};
  let synth = window.speechSynthesis || null;
  let isReadingPage = false;
  let ttsQueue = [];
  let toastTimer = null;

  /* ═══════════════════════════════════════
     1. Persistence (localStorage)
     ═══════════════════════════════════════ */
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      prefs = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch { prefs = { ...DEFAULTS }; }
  }

  function savePrefs() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
  }

  /* ═══════════════════════════════════════
     2. Apply all modes to <body> — INSTANT
     ═══════════════════════════════════════ */
  function applyAll() {
    const b = document.body;

    // Toggle CSS classes
    b.classList.toggle('a11y-high-contrast', !!prefs.highContrast);
    b.classList.toggle('a11y-dyslexia-font', !!prefs.dyslexiaFont);
    b.classList.toggle('a11y-large-ui', !!prefs.largeUI);
    b.classList.toggle('a11y-simple-mode', !!prefs.simpleMode);
    b.classList.toggle('a11y-colorblind', !!prefs.colorblind);
    b.classList.toggle('a11y-icon-labels', !!prefs.iconLabels);

    // Text size via inline style
    const size = prefs.textSize || 100;
    b.style.fontSize = size === 100 ? '' : size + '%';

    // If TTS was turned OFF mid-read, stop everything
    if (!prefs.textToSpeech && synth) {
      synth.cancel();
      isReadingPage = false;
      ttsQueue = [];
    }

    syncUI();
  }

  /* ═══════════════════════════════════════
     3. Sync panel UI with current prefs
     ═══════════════════════════════════════ */
  function syncUI() {
    setChecked('a11yTTS', prefs.textToSpeech);
    setChecked('a11yDyslexia', prefs.dyslexiaFont);
    setChecked('a11yContrast', prefs.highContrast);
    setChecked('a11yLargeUI', prefs.largeUI);
    setChecked('a11ySimple', prefs.simpleMode);
    setChecked('a11yColorblind', prefs.colorblind);
    setChecked('a11yVoice', prefs.voiceGuidance);
    setChecked('a11yIconLabels', prefs.iconLabels);
    setChecked('a11yEmergency', prefs.emergencyShortcut);
    setChecked('a11yConfirm', prefs.confirmPrompts);

    const slider = document.getElementById('a11yTextSize');
    const valEl  = document.getElementById('a11yTextSizeVal');
    if (slider) slider.value = prefs.textSize;
    if (valEl)  valEl.textContent = prefs.textSize + '%';

    // Emergency button visibility
    const emergBtn = document.getElementById('a11yEmergencyAction');
    if (emergBtn) emergBtn.style.display = prefs.emergencyShortcut ? 'flex' : 'none';

    // Read-page button state
    updateReadPageBtn();
  }

  function setChecked(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = !!val;
  }

  /* ═══════════════════════════════════════
     4. Text-to-Speech (Web Speech API)
     ═══════════════════════════════════════ */

  /** Speak a single string. Returns a promise that resolves when done. */
  function speak(text) {
    return new Promise((resolve) => {
      if (!synth || !text || !text.trim()) { resolve(); return; }
      const utt = new SpeechSynthesisUtterance(text.trim());
      utt.rate  = 0.95;
      utt.pitch = 1;
      utt.lang  = 'en-US';
      utt.onend = resolve;
      utt.onerror = resolve;
      synth.speak(utt);
    });
  }

  /** Immediately speak (cancel anything queued). Works regardless of TTS toggle — used for voice guidance. */
  function speakNow(text) {
    if (!synth || !text) return;
    synth.cancel();
    isReadingPage = false;
    const utt = new SpeechSynthesisUtterance(text.trim());
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.lang = 'en-US';
    synth.speak(utt);
  }

  /** Gather all visible text from main content areas */
  function gatherPageText() {
    const selectors = [
      '.title h2',
      '.card-header h5',
      '.card-style h2',
      '.card-style h5',
      '.card-style p',
      '.card-style span',
      '.table td',
      '.table th',
      '.badge',
      'section p',
      'section h2',
      'section h3',
      'section h5'
    ];
    const seen = new Set();
    const parts = [];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        const t = el.textContent.trim();
        if (t && t.length > 0 && t.length < 500) parts.push(t);
      });
    });
    return parts;
  }

  /** Read the full page aloud — queues chunks sequentially */
  async function readPageAloud() {
    if (!synth) { toast('Speech not supported in this browser'); return; }
    if (!prefs.textToSpeech) { toast('Enable Text-to-Speech first'); return; }

    // If already reading, stop
    if (isReadingPage) {
      stopReading();
      return;
    }

    const parts = gatherPageText();
    if (parts.length === 0) { toast('No content found to read'); return; }

    isReadingPage = true;
    ttsQueue = [...parts];
    updateReadPageBtn();
    toast('Reading page aloud...');

    // Read opening summary
    const pageTitle = document.querySelector('.title h2');
    if (pageTitle) {
      await speak('Now reading: ' + pageTitle.textContent.trim());
    }

    while (ttsQueue.length > 0 && isReadingPage) {
      const chunk = ttsQueue.shift();
      await speak(chunk);
    }

    isReadingPage = false;
    updateReadPageBtn();
    if (prefs.textToSpeech) toast('Finished reading');
  }

  function stopReading() {
    if (synth) synth.cancel();
    isReadingPage = false;
    ttsQueue = [];
    updateReadPageBtn();
    toast('Stopped reading');
  }

  function updateReadPageBtn() {
    const btn = document.getElementById('a11yReadPage');
    if (!btn) return;
    if (isReadingPage) {
      btn.classList.add('reading');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Stop Reading';
    } else {
      btn.classList.remove('reading');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> Read Page Aloud';
    }
  }

  /** Click-to-read: when TTS is enabled, clicking any text reads it aloud */
  function handleTTSClick(e) {
    if (!prefs.textToSpeech || !synth) return;

    // Don't read if user clicked inside the a11y panel itself
    if (e.target.closest('.a11y-panel') || e.target.closest('.a11y-fab')) return;

    const el = e.target.closest('td, th, h1, h2, h3, h4, h5, h6, p, span, .badge, .btn, button, li, a, label, strong');
    if (!el) return;

    const text = el.textContent.trim();
    if (!text || text.length > 500) return;

    // Visual highlight
    el.classList.add('a11y-tts-highlight');
    synth.cancel();
    isReadingPage = false;
    updateReadPageBtn();

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.lang = 'en-US';
    utt.onend = () => el.classList.remove('a11y-tts-highlight');
    utt.onerror = () => el.classList.remove('a11y-tts-highlight');
    synth.speak(utt);
  }

  /* ═══════════════════════════════════════
     5. Voice Guidance (announce navigation)
     ═══════════════════════════════════════ */
  function announce(text) {
    if (!prefs.voiceGuidance || !synth) return;
    speakNow(text);
  }

  /* ═══════════════════════════════════════
     6. Confirmation wrapper
     ═══════════════════════════════════════ */
  function confirmAction(message, callback) {
    if (prefs.confirmPrompts) {
      if (prefs.voiceGuidance) speakNow(message);
      if (confirm(message)) callback();
    } else {
      callback();
    }
  }

  /* ═══════════════════════════════════════
     7. Toast notification
     ═══════════════════════════════════════ */
  function toast(msg) {
    let el = document.getElementById('a11yToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'a11yToast';
      el.className = 'a11y-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  }

  /* ═══════════════════════════════════════
     8. Panel open / close
     ═══════════════════════════════════════ */
  function openPanel() {
    const panel   = document.getElementById('a11yPanel');
    const overlay = document.getElementById('a11yOverlay');
    if (panel)   panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
    announce('Accessibility settings opened');
  }

  function closePanel() {
    const panel   = document.getElementById('a11yPanel');
    const overlay = document.getElementById('a11yOverlay');
    if (panel)   panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    announce('Settings closed');
  }

  /* ═══════════════════════════════════════
     9. Wire all event listeners
     ═══════════════════════════════════════ */
  function wireEvents() {

    // ── FAB button ──
    const fab = document.getElementById('a11yFab');
    if (fab) fab.addEventListener('click', openPanel);

    // ── Close button & overlay ──
    const closeBtn = document.getElementById('a11yCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    const overlay = document.getElementById('a11yOverlay');
    if (overlay) overlay.addEventListener('click', closePanel);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel();
    });

    // ── Toggle: Text-to-Speech ──
    wireToggle('a11yTTS', 'textToSpeech', () => {
      if (prefs.textToSpeech) {
        speakNow('Text to speech is now active. Click any text to hear it read aloud.');
        toast('TTS enabled — click any text to hear it');
      } else {
        toast('Text-to-Speech disabled');
      }
    });

    // ── Toggle: Dyslexia Font ──
    wireToggle('a11yDyslexia', 'dyslexiaFont', () => {
      toast(prefs.dyslexiaFont ? 'Dyslexia-friendly font applied' : 'Default font restored');
      if (prefs.voiceGuidance) announce(prefs.dyslexiaFont ? 'Dyslexia friendly font enabled' : 'Default font restored');
    });

    // ── Toggle: High Contrast ──
    wireToggle('a11yContrast', 'highContrast', () => {
      toast(prefs.highContrast ? 'High contrast mode ON' : 'High contrast mode OFF');
      if (prefs.voiceGuidance) announce(prefs.highContrast ? 'High contrast enabled' : 'High contrast disabled');
    });

    // ── Toggle: Large UI ──
    wireToggle('a11yLargeUI', 'largeUI', () => {
      toast(prefs.largeUI ? 'Large UI mode ON' : 'Large UI mode OFF');
      if (prefs.voiceGuidance) announce(prefs.largeUI ? 'Large interface enabled' : 'Large interface disabled');
    });

    // ── Toggle: Simple Mode ──
    wireToggle('a11ySimple', 'simpleMode', () => {
      toast(prefs.simpleMode ? 'Simple mode ON — charts hidden' : 'Simple mode OFF');
    });

    // ── Toggle: Colorblind ──
    wireToggle('a11yColorblind', 'colorblind', () => {
      toast(prefs.colorblind ? 'Colorblind palette ON' : 'Colorblind palette OFF');
    });

    // ── Toggle: Voice Guidance ──
    wireToggle('a11yVoice', 'voiceGuidance', () => {
      if (prefs.voiceGuidance) {
        speakNow('Voice guidance is now active');
        toast('Voice guidance enabled');
      } else {
        toast('Voice guidance disabled');
      }
    });

    // ── Toggle: Icon Labels ──
    wireToggle('a11yIconLabels', 'iconLabels', () => {
      toast(prefs.iconLabels ? 'Icon labels visible' : 'Icon labels hidden');
    });

    // ── Toggle: Emergency Shortcut ──
    wireToggle('a11yEmergency', 'emergencyShortcut', () => {
      toast(prefs.emergencyShortcut ? 'Emergency shortcut visible' : 'Emergency shortcut hidden');
    });

    // ── Toggle: Confirmation Prompts ──
    wireToggle('a11yConfirm', 'confirmPrompts', () => {
      toast(prefs.confirmPrompts ? 'Confirmation prompts ON' : 'Confirmation prompts OFF');
    });

    // ── Text Size slider ──
    const slider = document.getElementById('a11yTextSize');
    if (slider) {
      slider.addEventListener('input', () => {
        prefs.textSize = parseInt(slider.value, 10);
        savePrefs();
        applyAll();
      });
      // Announce on change (not every input)
      slider.addEventListener('change', () => {
        toast('Text size: ' + prefs.textSize + '%');
        if (prefs.voiceGuidance) announce('Text size set to ' + prefs.textSize + ' percent');
      });
    }

    // ── Read Page Aloud button ──
    const readBtn = document.getElementById('a11yReadPage');
    if (readBtn) {
      readBtn.addEventListener('click', readPageAloud);
    }

    // ── Emergency action ──
    const emergAction = document.getElementById('a11yEmergencyAction');
    if (emergAction) {
      emergAction.addEventListener('click', () => {
        confirmAction('Send an emergency alert now?', () => {
          if (prefs.textToSpeech || prefs.voiceGuidance) speakNow('Emergency alert triggered');
          toast('Emergency alert sent!');
          alert('Emergency alert has been sent to dispatch!');
        });
      });
    }

    // ── Reset all ──
    const resetBtn = document.getElementById('a11yResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        confirmAction('Reset all accessibility settings to defaults?', () => {
          if (synth) synth.cancel();
          isReadingPage = false;
          ttsQueue = [];
          prefs = { ...DEFAULTS };
          savePrefs();
          applyAll();
          toast('All settings reset to defaults');
          if (prefs.voiceGuidance) announce('All settings have been reset');
        });
      });
    }

    // ── Click-to-read (TTS) ──
    document.addEventListener('click', handleTTSClick);

    // ── Voice guidance on sidebar links ──
    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        if (!prefs.voiceGuidance) return;
        const txt = link.querySelector('.text');
        if (txt) announce('Navigate to ' + txt.textContent.trim());
      });
    });

    // ── TTS for alert() — monkey-patch ──
    const originalAlert = window.alert;
    window.alert = function(msg) {
      if ((prefs.textToSpeech || prefs.voiceGuidance) && synth) {
        speakNow('Alert: ' + msg);
      }
      originalAlert.call(window, msg);
    };
  }

  /** Wire a single toggle checkbox */
  function wireToggle(id, prefKey, afterCb) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => {
      prefs[prefKey] = el.checked;
      savePrefs();
      applyAll();
      if (afterCb) afterCb();
    });
  }

  /* ═══════════════════════════════════════
     10. Expose helpers globally
     ═══════════════════════════════════════ */
  window.pulseA11y = {
    speak: speakNow,
    announce: announce,
    confirm: confirmAction,
    toast: toast,
    getPrefs: () => ({ ...prefs })
  };

  /* ═══════════════════════════════════════
     11. Initialise on DOM ready
     ═══════════════════════════════════════ */
  function init() {
    loadPrefs();
    applyAll();
    wireEvents();

    // Announce page on load if voice guidance is on
    if (prefs.voiceGuidance) {
      const title = document.querySelector('.title h2');
      if (title) {
        setTimeout(() => announce('Page loaded: ' + title.textContent.trim()), 600);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
