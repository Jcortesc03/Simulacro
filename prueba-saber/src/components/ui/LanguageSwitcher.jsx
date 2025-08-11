import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => changeLanguage('es')} disabled={i18n.language === 'es'}>
        ES
      </button>
      <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;