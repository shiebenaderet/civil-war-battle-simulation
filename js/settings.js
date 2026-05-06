(function() {
    'use strict';
    const STORAGE_KEY = 'cwSettings_v1';
    const DEFAULTS = {
        readingLevel: 'intermediate',
        fontFamily: 'serif',
        fontSize: 'medium',
        ttsVoice: null,
        ttsRate: 1.0
    };

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return Object.assign({}, DEFAULTS);
            return Object.assign({}, DEFAULTS, JSON.parse(raw));
        } catch (e) {
            console.warn('Settings load failed; using defaults', e);
            return Object.assign({}, DEFAULTS);
        }
    }

    function save(settings) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
        catch (e) { console.warn('Settings save failed', e); }
    }

    function apply(settings) {
        const html = document.documentElement;
        html.setAttribute('data-font-family', settings.fontFamily);
        html.setAttribute('data-font-size', settings.fontSize);
    }

    const Settings = {
        load: load,
        save: save,
        apply: apply,
        get: function(key) { return load()[key]; },
        set: function(key, value) {
            const s = load();
            s[key] = value;
            save(s);
            apply(s);
            return s;
        },
        getAll: load
    };

    apply(load());
    window.Settings = Settings;
})();
