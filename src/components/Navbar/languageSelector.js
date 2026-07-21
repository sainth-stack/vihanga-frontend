import React, { useState, useEffect } from 'react';
import globe from '../../assets/svg/globe.svg'; // Adjust path as needed
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const LanguageSelector = () => {
    const { i18n, t } = useTranslation(); // Access i18n instance
    const [showDropdown, setShowDropdown] = useState(false);
    // Initialize from localStorage or i18n's current language
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        return localStorage.getItem('selectedLanguage') || i18n.language || 'en';
    });

    // Sync selectedLanguage with i18n.language on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage') || i18n.language || 'en';
        if (savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
        }
        setSelectedLanguage(savedLanguage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const languages = [
        { id: 1, name: t("English"), code: 'en' },
        { id: 2, name: t("Hindi"), code: 'hi' },
        { id: 3, name: t("Spanish"), code: 'es' },
        { id: 4, name: t("Arabic"), code: 'ar' },
        { id: 5, name: t("Telugu"), code: 'tel' },
        { id: 6, name: t("Turkish"), code: 'tr' },
        { id: 7, name: t("Kannada"), code: 'kn' },
        { id: 8, name: t("Dutch"), code: 'nl' },
        { id: 9, name: t("Odia"), code: "or" }

    ];

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLabelKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        }
    };

    const handleLanguageChange = (code) => {
        setSelectedLanguage(code);
        console.log(`Switching to ${code} language`);
        i18n.changeLanguage(code); // Change language using i18next
        localStorage.setItem('selectedLanguage', code); // Persist language selection
        setShowDropdown(false); // Hide dropdown after selection
    };

    const handleOptionKeyDown = (e, code) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLanguageChange(code);
        }
    };

    return (
        <div className="nav-item dropdown mx-1 userdropdown d-flex align-items-center language-selector-wrapper">
            <label
                htmlFor="language-dropdown"
                className="cursor-pointer"
                onClick={toggleDropdown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={showDropdown}
                onKeyDown={handleLabelKeyDown}
            >
                <img src={globe} className="notifications-pic" alt="Language selector" />
            </label>
            <div className={`dropdown-menu dropdown-menu-right user-dropdown ${showDropdown ? 'show' : ''}`} id="language-dropdown" role="listbox">
                <ul className='p-0 m-0'>
                    {languages.map((lang) => (
                        <li
                            key={lang.id}
                            className="dropdown-item cursor-pointer"
                            onClick={() => handleLanguageChange(lang.code)}
                            tabIndex={0}
                            role="option"
                            aria-selected={selectedLanguage === lang.code}
                            onKeyDown={(e) => handleOptionKeyDown(e, lang.code)}
                        >
                            {lang.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LanguageSelector;
