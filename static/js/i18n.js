// Internationalization (i18n) Manager for OpenLocal

class I18nManager {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = {};
        this.supportedLanguages = ['ja', 'en', 'ko', 'zh', 'es', 'fr'];
        this.loadedLanguages = new Set();
    }

    async init(language = 'ja') {
        this.currentLanguage = language;
        await this.loadLanguage(language);
        this.updateUI();
        this.updateDocumentLanguage();
    }

    async loadLanguage(language) {
        if (this.loadedLanguages.has(language)) {
            return;
        }

        try {
            const response = await fetch(`/static/locales/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${language}`);
            }
            
            const translations = await response.json();
            this.translations[language] = translations;
            this.loadedLanguages.add(language);
        } catch (error) {
            console.error(`Error loading language ${language}:`, error);
            // Fallback to Japanese if loading fails
            if (language !== 'ja') {
                await this.loadLanguage('ja');
            }
        }
    }

    async changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Unsupported language: ${language}`);
            return;
        }

        await this.loadLanguage(language);
        this.currentLanguage = language;
        this.updateUI();
        this.updateDocumentLanguage();
        
        // Save language preference
        localStorage.setItem('openlocal_ui_language', language);
    }

    getStoredLanguage() {
        return localStorage.getItem('openlocal_ui_language') || 'ja';
    }

    translate(key, replacements = {}) {
        const translation = this.getNestedTranslation(key);
        
        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }

        // Replace placeholders in the translation
        let result = translation;
        Object.keys(replacements).forEach(placeholder => {
            const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
            result = result.replace(regex, replacements[placeholder]);
        });

        return result;
    }

    getNestedTranslation(key) {
        const keys = key.split('.');
        let current = this.translations[this.currentLanguage];
        
        if (!current) {
            // Fallback to Japanese
            current = this.translations['ja'];
        }
        
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }
        
        return current;
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                // For input elements, update value if it's empty
                if (!element.value) {
                    element.value = translation;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.translate(key);
            element.placeholder = translation;
        });

        // Update title
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            const translation = this.translate(key);
            document.title = `${translation} - ${this.translate('app.subtitle')}`;
        }
    }

    updateDocumentLanguage() {
        document.documentElement.lang = this.currentLanguage;
    }

    // Helper method to get language name in current language
    getLanguageName(languageCode) {
        return this.translate(`languages.${languageCode}`);
    }

    // Helper method to get all language names
    getAllLanguageNames() {
        const names = {};
        this.supportedLanguages.forEach(lang => {
            names[lang] = this.translate(`languages.${lang}`);
        });
        return names;
    }

    // Method to translate dynamic content (for use in JavaScript)
    t(key, replacements = {}) {
        return this.translate(key, replacements);
    }

    // Method to format messages with replacements
    formatMessage(key, replacements = {}) {
        return this.translate(`messages.${key}`, replacements);
    }

    // Method to get badge text
    getBadgeText(badgeType) {
        return this.translate(`badges.${badgeType}`);
    }

    // Method to get mode text
    getModeText(mode) {
        return this.translate(`modes.${mode}`);
    }
}

// Create global instance
window.i18n = new I18nManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const storedLanguage = window.i18n.getStoredLanguage();
    await window.i18n.init(storedLanguage);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
} 