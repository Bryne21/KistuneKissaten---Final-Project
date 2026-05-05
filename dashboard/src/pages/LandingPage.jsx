import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import heroImg from '../assets/mainImage.png';
import logoImg from '../assets/kistunelogo.png';
import './LandingPage.css';

function LandingPage() {
  const [menuItems, setMenuItems] = useState([]);

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
          <div className="logo">Kitsune Kissaten</div>
        </div>
        <nav>
          <a href="#about">About</a>
          <a href="#location">Location</a>
          <a href="#menu">Menu</a>
          <Link to="/admin" className="login-btn">Admin Login</Link>
        </nav>
      </header>

      <section className="hero">
        <img src={heroImg} alt="Welcome to Kitsune Kissaten" className="hero-image" />
      </section>

      <section id="about" className="section">
        <h2>About Us</h2>
        <p>
          Discover a serene oasis in the heart of Solano. At Kitsune Kissaten, we blend traditional Japanese 
          brewing methods with modern culinary artistry. Our warm, minimalist interior—crafted with dark wood, 
          burnt orange accents, and soft cream hues—invites you to slow down and savor the moment.
        </p>
      </section>

      <section id="menu" className="section menu-section">
        <h2>Our Menu</h2>
        <div className="menu-grid">
          {menuItems.map((item, idx) => (
            <div key={idx} className="menu-card">
              <img src={item.photo || 'https://via.placeholder.com/150'} alt={item.name} className="menu-img"/>
              <div className="menu-info">
                <h3>{item.name}</h3>
                <p className="desc">{item.description}</p>
                <p className="price">₱{item.price}</p>
              </div>
            </div>
          ))}
          {menuItems.length === 0 && <p>Our menu is currently being updated. Please check back later!</p>}
        </div>
      </section>

      <section id="location" className="section">
        <h2>Location</h2>
        <p>We are located at: <strong>Solano, Nueva Vizcaya</strong></p>
        <p>Operating Hours: Mon - Sun | 8:00 AM - 9:00 PM</p>
      </section>

      <footer className="footer">
        <div className="socials">
          <a href="#!">Facebook</a> | <a href="#!">Instagram</a> | <a href="#!">Twitter</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Kitsune Kissaten. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
