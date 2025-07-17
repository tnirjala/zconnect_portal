import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Contact.module.css';
import logo from './images/logo.png';
import community from './images/community.jpg';

const Contact = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Custom cursor effect
  useEffect(() => {
    const trail = document.querySelector(`.${styles['cursor-trail']}`);
    const outer = document.querySelector(`.${styles['cursor-outer']}`);
    let mouseX = 0, mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX - 6;
      mouseY = e.clientY - 6;
      if (trail) {
        trail.style.left = mouseX + 'px';
        trail.style.top = mouseY + 'px';
      }
      const outerX = e.clientX - 16;
      const outerY = e.clientY - 16;
      if (outer) {
        outer.style.left = outerX + 'px';
        outer.style.top = outerY + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hamburger menu logic
  const handleHamburger = () => setMobileMenuOpen(!mobileMenuOpen);

  // Form handling
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage('Message sent successfully! We will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setSubmitMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['contact-page']}>
      {/* Custom Cursor */}
      <div className={styles['cursor-trail']}></div>
      <div className={styles['cursor-outer']}></div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <img src={logo} alt="ZConnect" />
          </div>
          <nav className={`${styles.nav} ${mobileMenuOpen ? styles.active : ''}`} id="nav-menu">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/programs">Programs</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <a href="#" className={styles['login-btn']} onClick={() => navigate('/login')}>Login</a>
          <button className={styles.hamburger} id="hamburger" onClick={handleHamburger}>
            &#9776;
          </button>
        </div>
      </header>

      {/* Contact Section */}
      <section className={styles['contact-section']}>
        <div className={styles['contact-wrapper']}>
          <div className={styles['contact-card']}>
            {/* Contact Form Left */}
            <div className={styles['contact-form-container']}>
              <h2 className={styles['contact-title']}>Contact Us</h2>
              <p className={styles['contact-desc']}>We'd love to hear from you! Fill out the form and our team will get back to you soon.</p>
              <form className={styles['contact-form']} onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name</label><br />
                  <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="email">Email</label><br />
                  <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="message">Message</label><br />
                  <textarea id="message" name="message" rows="5" required value={form.message} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className={styles['send-btn']} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitMessage && (
                  <div className={`${styles['submit-message']} ${submitMessage.includes('successfully') ? styles.success : styles.error}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
            {/* Divider for desktop */}
            <div className={styles['divider']}></div>
            {/* Image Right */}
            <div className={styles['contact-image-container']}>
              <img src={community} alt="Contact Illustration" className={styles['contact-image']} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles['footer-container']}>
          <div className={styles['footer-main']}>
            <div className={styles['footer-brand']}>
              <h3>ZCONNECT</h3>
              <p>Supporting mental wellness through compassionate care and professional guidance.</p>
              <div className={styles['social-links']}>
                <a href="#" className={styles['social-link']}>f</a>
                <a href="#" className={styles['social-link']}>ig</a>
                <a href="#" className={styles['social-link']}>tw</a>
                <a href="#" className={styles['social-link']}>in</a>
              </div>
              <div className={styles['emergency-box']}>
                <h5>Crisis Support</h5>
                <p>24/7 Emergency Helpline</p>
                <a href="tel:+977-1-1660" className={styles['emergency-number']}>1660</a>
              </div>
            </div>
            <div className={styles['footer-column']}>
              <h4>Services</h4>
              <ul>
                <li><a href="#">Individual Therapy</a></li>
                <li><a href="#">Group Sessions</a></li>
                <li><a href="#">Family Counseling</a></li>
                <li><a href="#">Crisis Support</a></li>
                <li><a href="#">Online Therapy</a></li>
              </ul>
            </div>
            <div className={styles['footer-column']}>
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Self-Help Tools</a></li>
                <li><a href="#">Support Groups</a></li>
                <li><a href="#">Mental Health Tips</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div className={styles['footer-column']}>
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:hello@zconnect.com">hello@zconnect.com</a></li>
                <li><a href="tel:+977-1-5555-0123">+977-1-5555-0123</a></li>
                <li><a href="#">Thamel, Kathmandu</a></li>
                <li><a href="#">Mon-Fri: 9AM-6PM</a></li>
                <li><a href="#">Sat: 10AM-4PM</a></li>
              </ul>
            </div>
          </div>
          <div className={styles['footer-bottom']}>
            <p>&copy; 2025 ZCONNECT. All rights reserved.</p>
            <div className={styles['footer-links']}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      {/* Font Awesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default Contact; 