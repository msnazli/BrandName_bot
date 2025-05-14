import React, { useState, useEffect } from 'react';
import './App.css';
import { FaCopy, FaRocket, FaTimes, FaRedo } from 'react-icons/fa';

const App = () => {
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [styles, setStyles] = useState([]);
  const [languages, setLanguages] = useState(['فارسی']);
  const [names, setNames] = useState(['نام تستی ۱', 'نام تستی ۲', 'نام تستی ۳']);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const TelegramWebApp = window.Telegram?.WebApp;
    if (TelegramWebApp) {
      TelegramWebApp.ready();
      TelegramWebApp.expand();
      const themeParams = TelegramWebApp.themeParams;
      setTheme(themeParams.bg_color && parseInt(themeParams.bg_color.replace('#', ''), 16) < 0x888888 ? 'dark' : 'light');
    }
  }, []);

  const handleKeywordInput = (e) => {
    setKeywordInput(e.target.value);
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
      console.log('Keywords:', keywords.concat(keywordInput.trim())); // Debug
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (value, current, setState) => {
    if (current.includes(value)) {
      setState(current.filter(item => item !== value));
    } else {
      setState([...current, value]);
    }
  };

  const generateNames = async () => {
    if (!industry.trim()) {
      setMessage({ text: 'لطفاً موضوع را وارد کنید.', type: 'error' });
      return;
    }

    const data = {
      industry,
      description,
      keywords,
      features,
      styles,
      languages
    };

    console.log('Form Data:', data); // Debug

    setMessage({ text: 'نام‌ها با موفقیت تولید شدند!', type: 'success' });
    setNames([`${industry}_برند۱`, `${industry}_برند۲`, `${industry}_برند۳`]);
  };

  const copyName = (name) => {
    navigator.clipboard.writeText(name);
    setMessage({ text: `نام "${name}" کپی شد.`, type: 'success' });
  };

  const resetForm = () => {
    setIndustry('');
    setDescription('');
    setKeywordInput('');
    setKeywords([]);
    setFeatures([]);
    setStyles([]);
    setLanguages(['فارسی']);
    setNames(['نام تستی ۱', 'نام تستی ۲', 'نام تستی ۳']);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className={`container ${theme} p-3`}>
      <header className="text-center mb-4">
        <h1 className="display-4">برندنیم</h1>
        <img src="/logo.png" alt="BrandName Logo" className="logo mb-2" />
        <p className="text-muted">ابزاری برای تولید نام‌های خلاقانه برند</p>
      </header>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">تولید اسم برند</h2>
          <form className="brand-form">
            <div className="mb-3">
              <label htmlFor="industry" className="form-label">موضوع خود را وارد کنید</label>
              <input
                type="text"
                id="industry"
                className="form-control"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="مثلاً تکنولوژی، مد، غذا"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">توضیحات</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحی درباره شغل یا کسب‌وکار خود بنویسید"
                rows="4"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="keywords" className="form-label">کلمات کلیدی</label>
              <input
                type="text"
                id="keywords"
                className="form-control"
                value={keywordInput}
                onChange={handleKeywordInput}
                onKeyPress={handleKeywordKeyPress}
                placeholder="کلمات را وارد کنید و اینتر بزنید (مثلاً تکنولوژی)"
              />
              {keywords.length > 0 && (
                <div className="keyword-tags mt-2 d-flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                      {keyword}
                      <button
                        type="button"
                        className="keyword-remove"
                        onClick={() => removeKeyword(index)}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">انتخاب ویژگی</label>
              <div className="row">
                {['هیجانی', 'طبیعی', 'احساسی', 'فنی'].map(feature => (
                  <div key={feature} className="col-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id={feature}
                        value={feature}
                        checked={features.includes(feature)}
                        onChange={() => handleCheckboxChange(feature, features, setFeatures)}
                        className="form-check-input"
                      />
                      <label htmlFor={feature} className="form-check-label">{feature}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">انتخاب سبک</label>
              <div className="row">
                {['مدرن', 'غیر انگلیسی', 'ترکیبی'].map(style => (
                  <div key={style} className="col-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id={style}
                        value={style}
                        checked={styles.includes(style)}
                        onChange={() => handleCheckboxChange(style, styles, setStyles)}
                        className="form-check-input"
                      />
                      <label htmlFor={style} className="form-check-label">{style}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">زبان نام‌ها</label>
              <div className="row">
                {['فارسی', 'انگلیسی', 'ترکیبی'].map(lang => (
                  <div key={lang} className="col-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id={lang}
                        value={lang}
                        checked={languages.includes(lang)}
                        onChange={() => handleCheckboxChange(lang, languages, setLanguages)}
                        className="form-check-input"
                      />
                      <label htmlFor={lang} className="form-check-label">{lang}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="button" onClick={generateNames} className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                <FaRocket /> تولید نام‌ها
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                <FaRedo /> بازنشانی
              </button>
            </div>
          </form>
          <div className="mt-4">
            {names.length > 0 ? (
              names.map((name, index) => (
                <div key={index} className="result-item d-flex justify-content-between align-items-center p-3 mb-2 animate-in">
                  <span>{name}</span>
                  <button onClick={() => copyName(name)} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
                    <FaCopy /> کپی
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">هیچ نامی تولید نشده است.</p>
            )}
          </div>
          {message.text && (
            <div className={`alert mt-3 ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
      <footer className="text-center mt-4">
        <p>© 2025 برندنیم. تمامی حقوق محفوظ است.</p>
      </footer>
    </div>
  );
};

export default App;