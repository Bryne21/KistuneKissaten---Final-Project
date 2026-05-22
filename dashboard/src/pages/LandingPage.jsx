import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Button, IconButton, Skeleton } from '@mui/material';
import heroImg from '../assets/enchangeMainImage.png';
import secondMainImg from '../assets/2ndImageFinal.png';
import logoImg from '../assets/kistunelogo.png';
import logoKitsune from '../assets/logoKitsune.png';
import kitsuneIcon from '../Icons/kitsune.png';
import toriiIcon from '../Icons/torii-gate.png';
import menuBg from '../assets/menu_bg.png';
import storyBg from '../assets/story_bg.png';
import brunchBg from '../assets/brunch_bg.png';
import drinksBg from '../assets/drinks_bg.png';
import lumabangImg from '../assets/lumabang.png';
import soupIcon from '../assets/soup.png';
import hotSoupIcon from '../assets/hot-soup-2.png';
import coffeeIcon from '../assets/coffee.png';
import communicationIcon from '../assets/communication.png';
import clockIcon from '../assets/clock.png';
import './LandingPage.css';

function LandingPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [showScroll, setShowScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem("token");

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    axios.get("http://localhost:1337/menu")
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Error fetching menu:", err))
      .finally(() => setIsLoading(false));

    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box className="landing-container">
      <Box component="header" className="navbar">
        <Box className="logo-container" onClick={scrollToTop} sx={{ cursor: 'pointer' }}>
          <Box component="img" src={logoKitsune} alt="Kitsune Kissaten" className="logo-img-text" />
        </Box>
        <Box component="nav" className="main-nav">
          <Box component="a" href="#home">HOME</Box>
          <Box component="a" href="#menu-food">MENU</Box>
          <Box component="a" href="#about">ABOUT US</Box>
          <Box component="a" href="#contact">CONTACT</Box>

          {isAuthenticated ? (
            <>
              <Box component={Link} to="/admin">ADMIN</Box>
              <Box
                component="button"
                onClick={handleSignOut}
                sx={{
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
              </Box>
            </>
          ) : (
            <Box component={Link} to="/login">LOGIN</Box>
          )}
        </Box>
      </Box>

      <Box component="section" id="home" className="hero" sx={{ backgroundImage: `url(${secondMainImg})` }}>
        <Box className="hero-content">
          <Typography component="p" className="hero-jp">ようこそ、キツネ喫茶店へ</Typography>
          <Typography component="h1" variant="h1" className="hero-title">
            JAPANESE SOUL,<br />
            <Box component="span" className="highlight">LOCAL HEART.</Box>
          </Typography>
          <Typography component="p" className="hero-desc">
            A Japanese-inspired café serving comforting dishes<br />
            and thoughtfully crafted coffee.
          </Typography>
          <Box className="hero-buttons">
            <Box
              component="a"
              href="#menu-food"
              className="btn-primary"
            >
              EXPLORE OUR MENU 
              <Box component="img" src={kitsuneIcon} alt="Kitsune" className="btn-icon" sx={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            </Box>
            <Box
              component="a"
              href="#about"
              className="btn-secondary"
            >
              OUR STORY <Box component="span" className="btn-icon">➔</Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="section" id="about" className="section our-story-section" sx={{ backgroundImage: `url(${storyBg})` }}>
        <Box className="story-content-wrapper">
          <Box className="story-content">
            <Typography component="span" className="story-subtitle">
              <Box component="span" className="torii-icon">
                <Box component="img" src={toriiIcon} alt="Torii Gate" sx={{ height: '20px', width: 'auto', verticalAlign: 'middle' }} />
              </Box> 
              OUR STORY
            </Typography>
            <Typography component="h2" variant="h2">Inspired by Tradition,<br />Created with <Box component="span" className="highlight">Heart.</Box></Typography>
            <Typography component="p">
              Kistune Kissaten is more than just a café—<br />
              it is a space where Japanese kissaten culture<br />
              meets the warmth of home.
            </Typography>
            <Typography component="p">
              From our carefully brewed coffee to our<br />
              comforting dishes, every detail is crafted to<br />
              bring you a moment of calm, connection,<br />
              and unforgettable flavors.
            </Typography>
          </Box>
          <Box className="story-image-container">
            <Box component="img" src={heroImg} alt="Kitsune Kissaten" className="story-img" />
          </Box>
        </Box>
      </Box>

      <Box component="section" className="features-section">
        <Box className="features-container">
          <Box className="feature-box">
            <Box className="feature-icon-circle">
              <Box component="img" src={hotSoupIcon} alt="Hot Soup" sx={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </Box>
            <Typography component="h4" variant="h4">CRAFTED WITH PASSION</Typography>
            <Typography component="p">We pour our heart into every cup and every dish.</Typography>
          </Box>
          <Box className="feature-box">
            <Box className="feature-icon-circle">
              <Box component="img" src={soupIcon} alt="Soup" sx={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </Box>
            <Typography component="h4" variant="h4">JAPANESE-INSPIRED</Typography>
            <Typography component="p">Authentic flavors inspired by Japan's rich culinary heritage.</Typography>
          </Box>
          <Box className="feature-box">
            <Box className="feature-icon-circle">
              <Box component="img" src={coffeeIcon} alt="Coffee" sx={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </Box>
            <Typography component="h4" variant="h4">QUALITY INGREDIENTS</Typography>
            <Typography component="p">We use carefully selected ingredients for the best taste.</Typography>
          </Box>
          <Box className="feature-box">
            <Box className="feature-icon-circle">
              <Box component="img" src={kitsuneIcon} alt="Kitsune" sx={{ width: '35px', height: '35px', objectFit: 'contain' }} />
            </Box>
            <Typography component="h4" variant="h4">A COZY ESCAPE</Typography>
            <Typography component="p">A welcoming place where you can relax and be yourself.</Typography>
          </Box>
        </Box>
      </Box>

      <Box component="section" id="menu-food" className="section menu-section" sx={{ backgroundImage: `url(${menuBg})` }}>
        <Box className="menu-bg-decor" />
        <Box className="menu-container">
          {/* FOOD MENU SECTION */}
          <Box className="menu-category-group">
            <Typography component="h2" variant="h2" className="main-category-title">
              <Box component="span" className="title-line" /> 
              <Box component="span" className="jp-accent">食</Box> FOOD MENU 
              <Box component="span" className="title-line" />
            </Typography>

            {/* CROISSANT */}
            <Box className="subcategory-section">
              <Typography component="h3" variant="h3" className="subcategory-title">CROISSANT</Typography>
              <Box className="items-row scrollable-row">
                {isLoading ? (
                  [1, 2, 3, 4].map((skeleton) => (
                    <Box key={skeleton} className="menu-item-card skeleton-card">
                      <Skeleton variant="rectangular" height={280} className="skeleton-img" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)' }} />
                      <Box className="item-info">
                        <Skeleton variant="text" width="60%" height={24} className="skeleton-text title" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto' }} />
                        <Skeleton variant="text" width="80%" height={16} className="skeleton-text desc" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                        <Skeleton variant="text" width="40%" height={20} className="skeleton-text price" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                      </Box>
                    </Box>
                  ))
                ) : (
                  menuItems.filter(item => item.subcategory === "CROISSANT").map((item, idx) => (
                    <Box key={idx} className="menu-item-card">
                      <Box className="item-img-container">
                        <Box component="img" src={item.photo} alt={item.name} />
                      </Box>
                      <Box className="item-info">
                        <Typography component="p" className="item-name">{item.name.toUpperCase()}</Typography>
                        <Typography component="p" className="item-desc">{item.description}</Typography>
                        <Typography component="p" className="item-price">₱{item.price}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            {/* PASTA */}
            <Box className="subcategory-section">
              <Typography component="h3" variant="h3" className="subcategory-title">PASTA</Typography>
              <Box className="items-row scrollable-row">
                {isLoading ? (
                  [1, 2, 3, 4].map((skeleton) => (
                    <Box key={skeleton} className="menu-item-card skeleton-card">
                      <Skeleton variant="rectangular" height={280} className="skeleton-img" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)' }} />
                      <Box className="item-info">
                        <Skeleton variant="text" width="60%" height={24} className="skeleton-text title" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto' }} />
                        <Skeleton variant="text" width="80%" height={16} className="skeleton-text desc" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                        <Skeleton variant="text" width="40%" height={20} className="skeleton-text price" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                      </Box>
                    </Box>
                  ))
                ) : (
                  menuItems.filter(item => item.subcategory === "PASTA").map((item, idx) => (
                    <Box key={idx} className="menu-item-card">
                      <Box className="item-img-container">
                        <Box component="img" src={item.photo} alt={item.name} />
                      </Box>
                      <Box className="item-info">
                        <Typography component="p" className="item-name">{item.name.toUpperCase()}</Typography>
                        <Typography component="p" className="item-desc">{item.description}</Typography>
                        <Typography component="p" className="item-price">₱{item.price}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="section" id="menu-brunch" className="section menu-section" sx={{ backgroundImage: `url(${brunchBg})` }}>
        <Box className="menu-bg-decor" />
        <Box className="menu-container">
          {/* BRUNCH SECTION */}
          <Box className="menu-category-group">
            <Typography component="h2" variant="h2" className="main-category-title">
              <Box component="span" className="title-line" /> 
              <Box component="span" className="jp-accent">昼</Box> BRUNCH 
              <Box component="span" className="title-line" />
            </Typography>

            <Box className="items-row scrollable-row">
              {isLoading ? (
                [1, 2, 3, 4].map((skeleton) => (
                  <Box key={skeleton} className="menu-item-card skeleton-card">
                    <Skeleton variant="rectangular" height={280} className="skeleton-img" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)' }} />
                    <Box className="item-info">
                      <Skeleton variant="text" width="60%" height={24} className="skeleton-text title" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto' }} />
                      <Skeleton variant="text" width="80%" height={16} className="skeleton-text desc" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                      <Skeleton variant="text" width="40%" height={20} className="skeleton-text price" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                    </Box>
                  </Box>
                ))
              ) : (
                menuItems.filter(item => item.category === "BRUNCH").map((item, idx) => (
                  <Box key={idx} className="menu-item-card">
                    <Box className="item-img-container">
                      <Box component="img" src={item.photo} alt={item.name} />
                    </Box>
                    <Box className="item-info">
                      <Typography component="p" className="item-name">{item.name.toUpperCase()}</Typography>
                      <Typography component="p" className="item-desc">{item.description}</Typography>
                      <Typography component="p" className="item-price">₱{item.price}</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="section" id="menu-drinks" className="section menu-section" sx={{ backgroundImage: `url(${drinksBg})` }}>
        <Box className="menu-bg-decor" />
        <Box className="menu-container">
          {/* DRINKS MENU SECTION */}
          <Box className="menu-category-group">
            <Typography component="h2" variant="h2" className="main-category-title">
              <Box component="span" className="title-line" /> 
              <Box component="span" className="jp-accent">飲</Box> DRINKS MENU 
              <Box component="span" className="title-line" />
            </Typography>

            {/* KOHI */}
            <Box className="subcategory-section drinks-section">
              <Typography component="h3" variant="h3" className="subcategory-title">KŌHI (COFFEE)</Typography>
              <Box className="items-row scrollable-row">
                {isLoading ? (
                  [1, 2, 3, 4].map((skeleton) => (
                    <Box key={skeleton} className="menu-item-card skeleton-card">
                      <Skeleton variant="rectangular" height={280} className="skeleton-img" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)' }} />
                      <Box className="item-info">
                        <Skeleton variant="text" width="60%" height={24} className="skeleton-text title" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto' }} />
                        <Skeleton variant="text" width="80%" height={16} className="skeleton-text desc" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                        <Skeleton variant="text" width="40%" height={20} className="skeleton-text price" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                      </Box>
                    </Box>
                  ))
                ) : (
                  menuItems.filter(item => item.subcategory === "KOHI (COFFEE)").map((item, idx) => (
                    <Box key={idx} className="menu-item-card">
                      <Box className="item-img-container">
                        <Box component="img" src={item.photo} alt={item.name} />
                      </Box>
                      <Box className="item-info">
                        <Typography component="p" className="item-name">{item.name.toUpperCase()}</Typography>
                        <Typography component="p" className="item-desc">{item.description}</Typography>
                        <Typography component="p" className="item-price">₱{item.price}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            {/* MATCHA */}
            <Box className="subcategory-section drinks-section">
              <Typography component="h3" variant="h3" className="subcategory-title">MATCHA</Typography>
              <Box className="items-row scrollable-row">
                {isLoading ? (
                  [1, 2, 3, 4].map((skeleton) => (
                    <Box key={skeleton} className="menu-item-card skeleton-card">
                      <Skeleton variant="rectangular" height={280} className="skeleton-img" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)' }} />
                      <Box className="item-info">
                        <Skeleton variant="text" width="60%" height={24} className="skeleton-text title" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto' }} />
                        <Skeleton variant="text" width="80%" height={16} className="skeleton-text desc" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                        <Skeleton variant="text" width="40%" height={20} className="skeleton-text price" sx={{ bgcolor: 'rgba(211, 84, 0, 0.1)', mx: 'auto', mt: 1 }} />
                      </Box>
                    </Box>
                  ))
                ) : (
                  menuItems.filter(item => item.subcategory === "MATCHA").map((item, idx) => (
                    <Box key={idx} className="menu-item-card">
                      <Box className="item-img-container">
                        <Box component="img" src={item.photo} alt={item.name} />
                      </Box>
                      <Box className="item-info">
                        <Typography component="p" className="item-name">{item.name.toUpperCase()}</Typography>
                        <Typography component="p" className="item-desc">{item.description}</Typography>
                        <Typography component="p" className="item-price">₱{item.price}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="section" id="location" className="section proudly-local">
        <Box className="local-container">
          <Box className="local-image">
            <Box component="img" src={lumabangImg} alt="Lumabang, Nueva Vizcaya" />
          </Box>
          <Box className="local-content">
            <Typography component="span" className="local-subtitle">📍 PROUDLY LOCAL</Typography>
            <Typography component="h2" variant="h2">From Nueva Vizcaya,<br /><Box component="span" className="highlight">For You.</Box></Typography>
            <Typography component="p">
              Rooted in the beauty and culture of Nueva Vizcaya,<br />
              Kitsune Kissaten celebrates local community,<br />
              warm hospitality, and the simple joys of<br />
              good food and coffee.
            </Typography>
          </Box>
          <Box className="torii-illustration"><Box component="img" src={toriiIcon} alt="Torii Gate" /></Box>
        </Box>
      </Box>

      <Box component="section" id="contact" className="section contact-section">
        <Box className="contact-container">
          <Box className="contact-header">
            <Box component="span" className="decorative-line" />
            <Typography component="h2" variant="h2">CONTACT</Typography>
            <Box component="span" className="decorative-line" />
          </Box>

          <Box className="contact-grid">
            <Box className="contact-info-box">
              <Box className="info-icon">📞</Box>
              <Box className="info-text">
                <Typography component="h4" variant="h4">CALL US</Typography>
                <Typography component="p">+63 912 345 6789</Typography>
              </Box>
            </Box>

            <Box className="contact-info-box">
              <Box className="info-icon">
                <Box component="img" src={communicationIcon} alt="Email" sx={{ width: '35px', height: '35px', objectFit: 'contain' }} />
              </Box>
              <Box className="info-text">
                <Typography component="h4" variant="h4">EMAIL US</Typography>
                <Typography component="p">kitsunekissatenph@gmail.com</Typography>
              </Box>
            </Box>

            <Box className="contact-info-box">
              <Box className="info-icon">
                <Box component="img" src={clockIcon} alt="Clock" sx={{ width: '35px', height: '35px', objectFit: 'contain' }} />
              </Box>
              <Box className="info-text">
                <Typography component="h4" variant="h4">OPEN DAILY</Typography>
                <Typography component="p">Mon - Sun<br />8:00 AM - 10:00 PM</Typography>
              </Box>
            </Box>
          </Box>

          <Box className="contact-footer">
            <Box className="follow-header">
              <Box component="span" className="decorative-line-small" />
              <Typography component="h3" variant="h3">FOLLOW US</Typography>
              <Box component="span" className="decorative-line-small" />
            </Box>
            <Box className="social-links-container">
              <Box
                component="a"
                href="https://www.facebook.com/kitsunekissaten/"
                target="_blank"
                rel="noopener noreferrer"
                className="specific-social-link"
                sx={{ textDecoration: 'none' }}
              >
                <Box component="span" className="platform">FACEBOOK</Box>
                <Box component="span" className="handle">/kitsunekissaten</Box>
              </Box>
              <Box component="span" className="social-divider" />
              <Box
                component="a"
                href="https://www.instagram.com/kitsunekissaten"
                target="_blank"
                rel="noopener noreferrer"
                className="specific-social-link"
                sx={{ textDecoration: 'none' }}
              >
                <Box component="span" className="platform">INSTAGRAM</Box>
                <Box component="span" className="handle">@kitsunekissaten</Box>
              </Box>
              <Box component="span" className="social-divider" />
              <Box
                component="a"
                href="mailto:kitsunekissatenph@gmail.com"
                className="specific-social-link"
                sx={{ textDecoration: 'none' }}
              >
                <Box component="span" className="platform">GMAIL</Box>
                <Box component="span" className="handle">kitsunekissatenph@gmail.com</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="footer" className="footer">
        <Box className="footer-bottom">
          <Typography component="p">&copy; {new Date().getFullYear()} Kitsune Kissaten. All Rights Reserved.</Typography>
        </Box>
      </Box>

      {/* Scroll to Top Button */}
      <Box
        component="button"
        className={`scroll-to-top ${showScroll ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </Box>
    </Box>
  );
}

export default LandingPage;
