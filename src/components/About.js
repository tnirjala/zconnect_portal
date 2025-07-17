import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './About.module.css';
// Import images
import community from './images/community.jpg';
import logo from './images/logo.png';

const About = () => {
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

  return (
    <div className={styles['about-page']}>
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
          <button 
            className={styles.hamburger}
            id="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
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
          <div className={styles['hero-subtitle']}>About <span style={{color: '#BA5066'}}>ZCONNECT</span></div>
          <h1 className={styles['hero-title']}>Empower. Prevent. Transform.</h1>
          <p className={styles['hero-description']}>
            Empowering youth, transforming futures — because every voice deserves to be heard, and every life deserves peace.
          </p>
        </div>
      </section>

      {/* About ZConnect Section */}
      <section className={styles['about-section']}>
        <div className={styles['about-container']}>
          <div className={styles['about-content']}>
            <div className={styles['about-text']}>
              <h2 className={styles['about-title']}>About <span style={{color: '#BA5066'}}>ZConnect</span></h2>
              <p className={styles['about-description']}>
                ZConnect is a comprehensive mental health platform dedicated to empowering youth and fostering emotional well-being. We believe that every individual deserves access to compassionate mental health support, regardless of their background or circumstances.
              </p>
              <p className={styles['about-description']}>
                Our platform combines cutting-edge technology with evidence-based therapeutic approaches to provide personalized care, educational resources, and a supportive community for those navigating their mental health journey.
              </p>
              <div className={styles['about-features']}>
                <div className={styles['feature']}>
                  <div className={styles['feature-icon']}><i className="fas fa-star"></i></div>
                  <div className={styles['feature-text']}>
                    <h4>Personalized Care</h4>
                    <p>Tailored therapeutic approaches for individual needs</p>
                  </div>
                </div>
                <div className={styles['feature']}>
                  <div className={styles['feature-icon']}><i className="fas fa-handshake"></i></div>
                  <div className={styles['feature-text']}>
                    <h4>Expert Guidance</h4>
                    <p>Licensed professionals and certified counselors</p>
                  </div>
                </div>
                <div className={styles['feature']}>
                  <div className={styles['feature-icon']}><i className="fas fa-shield-alt"></i></div>
                  <div className={styles['feature-text']}>
                    <h4>Safe Environment</h4>
                    <p>Confidential and secure mental health support</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['about-image']}>
              <div className={styles['image-container']}>
                <img src={community} alt="ZConnect Community" className={styles['main-image']} />
                <div className={styles['floating-elements']}>
                  <div className={`${styles['floating-card']} ${styles['card-1']}`}>
                    <span>24/7 Support</span>
                  </div>
                  <div className={`${styles['floating-card']} ${styles['card-2']}`}>
                    <span>Expert Care</span>
                  </div>
                  <div className={`${styles['floating-card']} ${styles['card-3']}`}>
                    <span>Safe Space</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special Section */}
      <section className={styles['what-makes-us-section']}>
        <div className={styles['what-makes-us-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>What Makes Us <span style={{color: '#BA5066'}}>Special</span></h2>
            <p className={styles['section-subtitle']}>Discover the unique qualities that set ZConnect apart in mental health care</p>
          </div>
          
          <div className={styles['special-features-grid']}>
            <div className={styles['special-feature']}>
              <div className={styles['feature-number']}>01</div>
              <div className={styles['feature-content']}>
                <h3>Youth-Focused Approach</h3>
                <p>We understand the unique challenges young people face today. Our platform is specifically designed to meet the mental health needs of youth with age-appropriate resources and relatable content.</p>
              </div>
            </div>

            <div className={styles['special-feature']}>
              <div className={styles['feature-number']}>02</div>
              <div className={styles['feature-content']}>
                <h3>Technology-Driven Care</h3>
                <p>Leveraging cutting-edge technology to provide accessible, personalized mental health support. From AI-powered assessments to virtual therapy sessions, we make care available anytime, anywhere.</p>
              </div>
            </div>

            <div className={styles['special-feature']}>
              <div className={styles['feature-number']}>03</div>
              <div className={styles['feature-content']}>
                <h3>Community Support</h3>
                <p>Building a supportive community where individuals can connect, share experiences, and find strength in knowing they're not alone in their mental health journey.</p>
              </div>
            </div>

            <div className={styles['special-feature']}>
              <div className={styles['feature-number']}>04</div>
              <div className={styles['feature-content']}>
                <h3>Evidence-Based Methods</h3>
                <p>All our therapeutic approaches are grounded in scientific research and proven methodologies, ensuring effective and reliable mental health support.</p>
              </div>
            </div>

            <div className={styles['special-feature']}>
              <div className={styles['feature-number']}>05</div>
              <div className={styles['feature-content']}>
                <h3>24/7 Accessibility</h3>
                <p>Mental health challenges don't follow a schedule. Our platform provides round-the-clock access to resources, crisis support, and professional guidance.</p>
              </div>
            </div>

            <div className={styles['special-feature']}>
              <div className={styles['feature-number']}>06</div>
              <div className={styles['feature-content']}>
                <h3>Cultural Sensitivity</h3>
                <p>We recognize and respect diverse cultural backgrounds, ensuring our services are inclusive and culturally appropriate for all communities we serve.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className={styles['core-values-section']}>
        <div className={styles['core-values-container']}>
          <div className={styles['values-header']}>
            <h2 className={styles['values-title']}>Our <span style={{color: '#BA5066'}}>Core Values</span></h2>
            <p className={styles['values-subtitle']}>The fundamental principles that guide everything we do at ZConnect</p>
          </div>
          
          <div className={styles['values-grid']}>
            <div className={styles['value-item']}>
              <div className={styles['value-icon']}><i className="fas fa-heart"></i></div>
              <div className={styles['value-content']}>
                <div className={styles['value-number']}>01</div>
                <h3>Compassion</h3>
                <p>We approach every individual with genuine care, empathy, and understanding, recognizing that mental health challenges are deeply personal and unique to each person.</p>
              </div>
            </div>

            <div className={styles['value-item']}>
              <div className={styles['value-icon']}><i className="fas fa-handshake"></i></div>
              <div className={styles['value-content']}>
                <div className={styles['value-number']}>02</div>
                <h3>Trust & Confidentiality</h3>
                <p>We maintain the highest standards of privacy and security, ensuring that every interaction and piece of information shared with us remains completely confidential.</p>
              </div>
            </div>

            <div className={styles['value-item']}>
              <div className={styles['value-icon']}><i className="fas fa-bullseye"></i></div>
              <div className={styles['value-content']}>
                <div className={styles['value-number']}>03</div>
                <h3>Excellence</h3>
                <p>We are committed to delivering the highest quality mental health services through continuous learning, evidence-based practices, and professional expertise.</p>
              </div>
            </div>

            <div className={styles['value-item']}>
              <div className={styles['value-icon']}><i className="fas fa-globe"></i></div>
              <div className={styles['value-content']}>
                <div className={styles['value-number']}>04</div>
                <h3>Inclusivity</h3>
                <p>We celebrate diversity and ensure our services are accessible, culturally sensitive, and welcoming to individuals from all backgrounds and communities.</p>
              </div>
            </div>

            <div className={styles['value-item']}>
              <div className={styles['value-icon']}><i className="fas fa-fist-raised"></i></div>
              <div className={styles['value-content']}>
                <div className={styles['value-number']}>05</div>
                <h3>Empowerment</h3>
                <p>We believe in empowering individuals to take control of their mental health journey, providing them with the tools, knowledge, and support they need to thrive.</p>
              </div>
            </div>

            <div className={styles['value-item']}>
              <div className={styles['value-icon']}><i className="fas fa-sync-alt"></i></div>
              <div className={styles['value-content']}>
                <div className={styles['value-number']}>06</div>
                <h3>Innovation</h3>
                <p>We continuously embrace new technologies and methodologies to provide cutting-edge mental health solutions that meet the evolving needs of our community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles['footer']}>
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

export default About; 