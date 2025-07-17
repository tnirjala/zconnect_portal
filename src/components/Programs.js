import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Programs.module.css';
import logo from './images/logo.png';
import service1 from './images/service1.jpg';
import service2 from './images/service2.jpg';
import service3 from './images/service3.jpg';
import service4 from './images/service4.jpg';
import service5 from './images/service5.jpg';
import service6 from './images/service6.jpg';

const programData = [
  {
    image: service1,
    icon: 'fas fa-user-friends',
    category: 'Individual Support',
    title: 'Individual Therapy Program',
    description: 'One-on-one therapeutic sessions with licensed professionals to address personal challenges, trauma, and mental health concerns.',
    features: ['Personalized Care', 'Professional Guidance', 'Confidential'],
    duration: '45-60 minutes per session',
  },
  {
    image: service2,
    icon: 'fas fa-users',
    category: 'Group Support',
    title: 'Group Therapy Program',
    description: 'Supportive group sessions where participants share experiences, learn from others, and build meaningful connections.',
    features: ['Peer Support', 'Shared Learning', 'Community Building'],
    duration: '90 minutes per session',
  },
  {
    image: service3,
    icon: 'fas fa-graduation-cap',
    category: 'Skill Building',
    title: 'Skills Development Program',
    description: 'Comprehensive workshops and training sessions focused on building life skills, career readiness, and personal development.',
    features: ['Life Skills', 'Career Training', 'Personal Growth'],
    duration: '2-4 hours per workshop',
  },
  {
    image: service4,
    icon: 'fas fa-home',
    category: 'Family Support',
    title: 'Family Counseling Program',
    description: 'Family-focused therapy sessions to improve communication, resolve conflicts, and strengthen family relationships.',
    features: ['Family Dynamics', 'Communication Skills', 'Conflict Resolution'],
    duration: '60-90 minutes per session',
  },
  {
    image: service5,
    icon: 'fas fa-shield-alt',
    category: 'Emergency Support',
    title: 'Crisis Intervention Program',
    description: '24/7 emergency support and immediate intervention services for youth in crisis situations requiring urgent assistance.',
    features: ['24/7 Available', 'Immediate Response', 'Emergency Care'],
    duration: 'Available 24/7',
  },
  {
    image: service6,
    icon: 'fas fa-leaf',
    category: 'Wellness',
    title: 'Wellness & Mindfulness Program',
    description: 'Holistic wellness programs including mindfulness, meditation, yoga, and self-care practices for overall well-being.',
    features: ['Mindfulness', 'Meditation', 'Self-Care'],
    duration: '30-60 minutes per session',
  },
];

const benefits = [
  { icon: 'fas fa-certificate', title: 'Certified Professionals', desc: 'All our programs are led by licensed and certified mental health professionals with extensive experience in youth counseling.' },
  { icon: 'fas fa-heart', title: 'Compassionate Care', desc: 'We provide a safe, non-judgmental environment where every individual feels heard, understood, and supported.' },
  { icon: 'fas fa-chart-line', title: 'Proven Results', desc: 'Our evidence-based programs have helped hundreds of youth overcome challenges and achieve positive outcomes.' },
  { icon: 'fas fa-users', title: 'Community Support', desc: 'Join a supportive community of peers who understand your journey and provide encouragement along the way.' },
  { icon: 'fas fa-clock', title: 'Flexible Scheduling', desc: 'We offer flexible scheduling options to accommodate your needs, including evening and weekend sessions.' },
  { icon: 'fas fa-shield-alt', title: 'Confidential & Safe', desc: 'Your privacy and safety are our top priorities. All sessions are confidential and conducted in secure environments.' },
];

const Programs = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className={styles['programs-page']}>
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

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles['floating-shapes']}>
          <div className={styles['shape']}></div>
          <div className={styles['shape']}></div>
          <div className={styles['shape']}></div>
          <div className={styles['shape']}></div>
        </div>
        <div className={styles['animated-background-shapes']}>
          <div className={`${styles['bg-shape']} ${styles['circle']}`}></div>
          <div className={`${styles['bg-shape']} ${styles['diamond']}`}></div>
          <div className={`${styles['bg-shape']} ${styles['triangle']}`}></div>
          <div className={`${styles['bg-shape']} ${styles['blob']}`}></div>
        </div>
        <div className={styles['hero-content']}>
          <div className={styles['hero-subtitle']}>Our <span style={{ color: '#BA5066' }}>Programs</span></div>
          <h1 className={styles['hero-title']}>Empower minds. Transform lives.</h1>
          <p className={styles['hero-description']}>
            Empowering youth to rise above violence through guidance, support, and transformation.
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className={styles['programs-section']}>
        <div className={styles['programs-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Our <span style={{ color: '#BA5066' }}>Programs</span></h2>
            <p className={styles['section-subtitle']}>
              Comprehensive programs designed to empower youth, build resilience, and create lasting positive change in communities.
            </p>
          </div>
          <div className={styles['programs-grid']}>
            {programData.map((program, idx) => (
              <div className={styles['program-card']} key={idx}>
                <div className={styles['program-image']}>
                  <img src={program.image} alt={program.title} />
                  <div className={styles['program-overlay']}></div>
                  <div className={styles['program-icon']}><i className={program.icon}></i></div>
                </div>
                <div className={styles['program-content']}>
                  <div className={styles['program-category']}>{program.category}</div>
                  <h3 className={styles['program-title']}>{program.title}</h3>
                  <p className={styles['program-description']}>{program.description}</p>
                  <div className={styles['program-features']}>
                    {program.features.map((feature, i) => (
                      <span className={styles['feature-tag']} key={i}>{feature}</span>
                    ))}
                  </div>
                  <div className={styles['program-duration']}>
                    <i className="fas fa-clock"></i>
                    <span>{program.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles['benefits-section']}>
        <div className={styles['benefits-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Why Choose Our <span style={{ color: '#BA5066' }}>Programs</span></h2>
            <p className={styles['section-subtitle']}>
              Discover the unique benefits that make our programs effective and transformative
            </p>
          </div>
          <div className={styles['benefits-grid']}>
            {benefits.map((benefit, idx) => (
              <div className={styles['benefit-item']} key={idx}>
                <div className={styles['benefit-icon']}><i className={benefit.icon}></i></div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            ))}
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

export default Programs; 