import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import heroImg from '../assets/enchangeMainImage.png';
import secondMainImg from '../assets/2ndImageFinal.png';
import logoImg from '../assets/kistunelogo.png';
import kitsuneIcon from '../Icons/kitsune.png';
import toriiIcon from '../Icons/torii-gate.png';
import menuBg from '../assets/menu_bg.png';
import storyBg from '../assets/story_bg.png';
import brunchBg from '../assets/brunch_bg.png';
import drinksBg from '../assets/drinks_bg.png';
import soupIcon from '../assets/soup.png';
import communicationIcon from '../assets/communication.png';
import clockIcon from '../assets/clock.png';
import './LandingPage.css';

function LandingPage() {
  const [menuItems, setMenuItems] = useState([]);
  const isAuthenticated = !!localStorage.getItem("token");

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    axios.get("http://localhost:1337/menu")
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  return (
    <div className="landing-container">
      <header className="navbar">
        <div className="logo-container">
          <img src={logoImg} alt="Fox Logo" className="nav-logo" />
          <div className="logo-text">
            <span className="logo-jp">キツネ喫茶店</span>
            <span className="logo-en">KITSUNE KISSATEN</span>
            <span className="logo-loc">SOLANO, NUEVA VIZCAYA</span>
          </div>
        </div>
        <nav className="main-nav">
          <a href="#home">HOME</a>
          <a href="#menu-food">MENU</a>
          <a href="#about">ABOUT US</a>
          <a href="#contact">CONTACT</a>

          {isAuthenticated ? (
            <>
              <Link to="/students">ADMIN</Link>
              <button
                onClick={handleSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: '1rem'
                }}
              >
                SIGN OUT
              </button>
            </>
          ) : (
            <Link to="/login">LOGIN</Link>
          )}
        </nav>
      </header>

      <section id="home" className="hero" style={{ backgroundImage: `url(${secondMainImg})` }}>


        <div className="hero-content">
          <p className="hero-jp">ようこそ、キツネ喫茶店へ</p>
          <h1 className="hero-title">
            JAPANESE SOUL,<br />
            <span className="highlight">LOCAL HEART.</span>
          </h1>
          <p className="hero-desc">
            A Japanese-inspired café serving comforting dishes<br />
            and thoughtfully crafted coffee.
          </p>
          <div className="hero-buttons">
            <a href="#menu-food" className="btn-primary">EXPLORE OUR MENU <img src={kitsuneIcon} alt="Kitsune" className="btn-icon" style={{ width: '20px', height: '20px', objectFit: 'contain' }} /></a>
            <a href="#about" className="btn-secondary">OUR STORY <span className="btn-icon">➔</span></a>
          </div>
        </div>
      </section>

      <section id="about" className="section our-story-section" style={{ backgroundImage: `url(${storyBg})` }}>
        <div className="story-content-wrapper">
          <div className="story-content">
            <span className="story-subtitle"><span className="torii-icon"><img src={toriiIcon} alt="Torii Gate" style={{ height: '20px', width: 'auto', verticalAlign: 'middle' }} /></span> OUR STORY</span>
            <h2>Inspired by Tradition,<br />Created with <span className="highlight">Heart.</span></h2>
            <p>
              Kistune Kissaten is more than just a café—<br />
              it is a space where Japanese kissaten culture<br />
              meets the warmth of home.
            </p>
            <p>
              From our carefully brewed coffee to our<br />
              comforting dishes, every detail is crafted to<br />
              bring you a moment of calm, connection,<br />
              and unforgettable flavors.
            </p>
          </div>
          <div className="story-image-container">
            <img src={heroImg} alt="Kitsune Kissaten" className="story-img" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon-circle">🍲</div>
            <h4>CRAFTED WITH PASSION</h4>
            <p>We pour our heart into every cup and every dish.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-circle"><img src={soupIcon} alt="Soup" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></div>
            <h4>JAPANESE-INSPIRED</h4>
            <p>Authentic flavors inspired by Japan's rich culinary heritage.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-circle">☕</div>
            <h4>QUALITY INGREDIENTS</h4>
            <p>We use carefully selected ingredients for the best taste.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-circle"><img src={kitsuneIcon} alt="Kitsune" style={{ width: '35px', height: '35px', objectFit: 'contain' }} /></div>
            <h4>A COZY ESCAPE</h4>
            <p>A welcoming place where you can relax and be yourself.</p>
          </div>
        </div>
      </section>

      <section id="menu-food" className="section menu-section" style={{ backgroundImage: `url(${menuBg})` }}>
        <div className="menu-bg-decor"></div>
        <div className="menu-container">
          {/* FOOD MENU SECTION */}
          <div className="menu-category-group">
            <h2 className="main-category-title">
              <span className="title-line"></span> <span className="jp-accent">食</span> FOOD MENU <span className="title-line"></span>
            </h2>
            { /*<div className="category-icon-main"><img src={kitsuneIcon} alt="Kitsune" /></div>*/}

            {/* CROISSANT */}
            <div className="subcategory-section">
              <h3 className="subcategory-title">CROISSANT</h3>
              <div className="items-row scrollable-row">
                {menuItems.filter(item => item.subcategory === "CROISSANT").map((item, idx) => (
                  <div key={idx} className="menu-item-card">
                    <div className="item-img-container">
                      <img src={item.photo} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <p className="item-name">{item.name.toUpperCase()}</p>
                      <p className="item-desc">{item.description}</p>
                      <p className="item-price">₱{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PASTA */}
            <div className="subcategory-section">
              <h3 className="subcategory-title">PASTA</h3>
              <div className="items-row scrollable-row">
                {menuItems.filter(item => item.subcategory === "PASTA").map((item, idx) => (
                  <div key={idx} className="menu-item-card">
                    <div className="item-img-container">
                      <img src={item.photo} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <p className="item-name">{item.name.toUpperCase()}</p>
                      <p className="item-desc">{item.description}</p>
                      <p className="item-price">₱{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu-brunch" className="section menu-section" style={{ backgroundImage: `url(${brunchBg})` }}>
        <div className="menu-bg-decor"></div>
        <div className="menu-container">
          {/* BRUNCH SECTION */}
          <div className="menu-category-group">
            <h2 className="main-category-title">
              <span className="title-line"></span> <span className="jp-accent">昼</span> BRUNCH <span className="title-line"></span>
            </h2>
            { /*<div className="category-icon-main"><img src={kitsuneIcon} alt="Kitsune" /></div>*/}

            <div className="items-row scrollable-row">
              {menuItems.filter(item => item.category === "BRUNCH").map((item, idx) => (
                <div key={idx} className="menu-item-card">
                  <div className="item-img-container">
                    <img src={item.photo} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <p className="item-name">{item.name.toUpperCase()}</p>
                    <p className="item-desc">{item.description}</p>
                    <p className="item-price">₱{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="menu-drinks" className="section menu-section" style={{ backgroundImage: `url(${drinksBg})` }}>
        <div className="menu-bg-decor"></div>
        <div className="menu-container">
          {/* DRINKS MENU SECTION */}
          <div className="menu-category-group">
            <h2 className="main-category-title">
              <span className="title-line"></span> <span className="jp-accent">飲</span> DRINKS MENU <span className="title-line"></span>
            </h2>
            { /*<div className="category-icon-main"><img src={kitsuneIcon} alt="Kitsune" /></div>*/}

            {/* KOHI */}
            <div className="subcategory-section drinks-section">
              <h3 className="subcategory-title">KŌHI (COFFEE)</h3>
              <div className="items-row scrollable-row">
                {menuItems.filter(item => item.subcategory === "KOHI (COFFEE)").map((item, idx) => (
                  <div key={idx} className="menu-item-card">
                    <div className="item-img-container">
                      <img src={item.photo} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <p className="item-name">{item.name.toUpperCase()}</p>
                      <p className="item-desc">{item.description}</p>
                      <p className="item-price">₱{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MATCHA */}
            <div className="subcategory-section drinks-section">
              <h3 className="subcategory-title">MATCHA</h3>
              <div className="items-row scrollable-row">
                {menuItems.filter(item => item.subcategory === "MATCHA").map((item, idx) => (
                  <div key={idx} className="menu-item-card">
                    <div className="item-img-container">
                      <img src={item.photo} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <p className="item-name">{item.name.toUpperCase()}</p>
                      <p className="item-desc">{item.description}</p>
                      <p className="item-price">₱{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="section proudly-local">
        <div className="local-container">
          <div className="local-image">
            <img src={heroImg} alt="Nueva Vizcaya" />
          </div>
          <div className="local-content">
            <span className="local-subtitle">📍 PROUDLY LOCAL</span>
            <h2>From Nueva Vizcaya,<br /><span className="highlight">For You.</span></h2>
            <p>Rooted in the beauty and culture of Nueva Vizcaya,<br />
              Kitsune Kissaten celebrates local community,<br />
              warm hospitality, and the simple joys of<br />
              good food and coffee.</p>
          </div>
          <div className="torii-illustration"><img src={toriiIcon} alt="Torii Gate" style={{ height: '120px', width: 'auto', opacity: 0.2 }} /></div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-container">
          <div className="contact-header">
            <span className="decorative-line"></span>
            <h2>CONTACT</h2>
            <span className="decorative-line"></span>
          </div>

          <div className="contact-grid">
            <div className="contact-info-box">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h4>CALL US</h4>
                <p>+63 912 345 6789</p>
              </div>
            </div>

            <div className="contact-info-box">
              <div className="info-icon"><img src={communicationIcon} alt="Email" style={{ width: '35px', height: '35px', objectFit: 'contain' }} /></div>
              <div className="info-text">
                <h4>EMAIL US</h4>
                <p>kitsunekissatenph@gmail.com</p>
              </div>
            </div>

            <div className="contact-info-box">
              <div className="info-icon"><img src={clockIcon} alt="Clock" style={{ width: '35px', height: '35px', objectFit: 'contain' }} /></div>
              <div className="info-text">
                <h4>OPEN DAILY</h4>
                <p>Mon - Sun<br />8:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-footer">
            <div className="follow-header">
              <span className="decorative-line-small"></span>
              <h3>FOLLOW US</h3>
              <span className="decorative-line-small"></span>
            </div>
            <div className="social-links-container">
              <a href="https://www.facebook.com/kitsunekissaten/" target="_blank" rel="noopener noreferrer" className="specific-social-link">
                <span className="platform">FACEBOOK</span>
                <span className="handle">/kitsunekissaten</span>
              </a>
              <span className="social-divider"></span>
              <a href="https://www.instagram.com/kitsunekissaten" target="_blank" rel="noopener noreferrer" className="specific-social-link">
                <span className="platform">INSTAGRAM</span>
                <span className="handle">@kitsunekissaten</span>
              </a>
              <span className="social-divider"></span>
              <a href="mailto:kitsunekissatenph@gmail.com" className="specific-social-link">
                <span className="platform">GMAIL</span>
                <span className="handle">kitsunekissatenph@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Kitsune Kissaten. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
