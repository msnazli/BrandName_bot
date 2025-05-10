import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [features, setFeatures] = useState([]);
  const [styles, setStyles] = useState([]);
  const [languages, setLanguages] = useState(['فارسی']);
  const [names, setNames] = useState([]);
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

  const handleKeywordsChange = (e) => {
    const value = e.target.value.replace(/\n/g, ',').replace(/,,/g, ',');
    setKeywords(value);
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
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      features,
      styles,
      languages
    };

    try {
      const response = await fetch('https://your-backend.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        setNames(result.names || []);
        setMessage({ text: 'نام‌ها با موفقیت تولید شدند!', type: 'success' });
      } else {
        setMessage({ text: result.error || 'خطایی رخ داد.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'خطا در ارتباط با سرور.', type: 'error' });
    }
  };

  const copyName = (name) => {
    navigator.clipboard.writeText(name);
    setMessage({ text: `نام "${name}" کپی شد.`, type: 'success' });
  };

  const resetForm = () => {
    setIndustry('');
    setDescription('');
    setKeywords('');
    setFeatures([]);
    setStyles([]);
    setLanguages(['فارسی']);
    setNames([]);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className={`container ${theme}`}>
      <h2>تولید اسم برند</h2>
      <form className="brand-form">
        <div className="form-group">
          <label htmlFor="industry">موضوع خود را وارد کنید</label>
          <input
            type="text"
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="مثلاً تکنولوژی، مد، غذا"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">توضیحات</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحی درباره شغل یا کسب‌وکار خود بنویسید"
            rows="4"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="keywords">کلمات کلیدی</label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={handleKeywordsChange}
            placeholder="کلمات را با کاما یا اینتر جدا کنید (مثلاً تکنولوژی، نوآوری)"
          />
        </div>
        <div className="form-group">
          <label>انتخاب ویژگی</label>
          <div className="checkbox-group">
            {['هیجانی', 'طبیعی', 'احساسی', 'فنی'].map(feature => (
              <div key={feature}>
                <input
                  type="checkbox"
                  id={feature}
                  value={feature}
                  checked={features.includes(feature)}
                  onChange={() => handleCheckboxChange(feature, features, setFeatures)}
                />
                <label htmlFor={feature}>{feature}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>انتخاب سبک</label>
          <div className="checkbox-group">
            {['مدرن', 'غیر انگلیسی', 'ترکیبی'].map(style => (
              <div key={style}>
                <input
                  type="checkbox"
                  id={style}
                  value={style}
                  checked={styles.includes(style)}
                  onChange={() => handleCheckboxChange(style, styles, setStyles)}
                />
                <label htmlFor={style}>{style}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>زبان نام‌ها</label>
          <div className="checkbox-group">
            {['فارسی', 'انگلیسی', 'ترکیبی'].map(lang => (
              <div key={lang}>
                <input
                  type="checkbox"
                  id={lang}
                  value={lang}
                  checked={languages.includes(lang)}
                  onChange={() => handleCheckboxChange(lang, languages, setLanguages)}
                />
                <label htmlFor={lang}>{lang}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group button-group">
          <button type="button" onClick={generateNames}>تولید نام‌ها</button>
          <button type="button" onClick={resetForm}>بازنشانی</button>
        </div>
      </form>
      <div className="results">
        {names.length > 0 ? (
          names.map((name, index) => (
            <div key={index} className="result-item animate-in">
              <span>{name}</span>
              <button onClick={() => copyName(name)}>کپی</button>
            </div>
          ))
        ) : (
          <p>هیچ نامی تولید نشده است.</p>
        )}
      </div>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default App;