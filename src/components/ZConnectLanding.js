import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ZConnectLanding.module.css';
// Import images for services
import service1 from './images/service1.jpg';
import service2 from './images/service2.jpg';
import service3 from './images/service3.jpg';
import service4 from './images/service4.jpg';
import service5 from './images/service5.jpg';
import service6 from './images/service6.jpg';
import whychoose from './images/whychoose.jpg';
import logo from './images/logo.png';
// Import images for counselors and testimonials
import niru from './images/nirjala.jpg';
import harish from './images/harish.jpg';
import sabal from './images/sabal.jpg';
import sodesh from './images/sodesh.jpg';
import user1 from './images/user1.jpg';

const ZConnectLanding = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom cursor effect
  useEffect(() => {
    const trail = document.querySelector('.cursor-trail');
    const outer = document.querySelector('.cursor-outer');
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

  // Scroll animations
  useEffect(() => {
    const cards = document.querySelectorAll('.service-card, .counselor-card, .testimonial-card');

    const revealOnScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;

      cards.forEach((card, i) => {
        const cardTop = card.getBoundingClientRect().top;

        if (cardTop < triggerBottom) {
          card.style.animation = `fadeSlideUp 0.6s ease forwards`;
          card.style.animationDelay = `${i * 0.2}s`;
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    
    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, []);
  // Hamburger menu logic
  const handleHamburger = () => setMobileMenuOpen(!mobileMenuOpen);
  return (
    <div className={styles['landing-page']}>
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
              <a href="/login" className={styles['login-btn']} onClick={() => navigate('/login')}>Login</a>
              <button className={styles.hamburger} id="hamburger" onClick={handleHamburger}>
                &#9776;
              </button>
            </div>
          </header>

      {/* Hero Section */}
      <section className={styles.hero} id="home">
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
          <div className={styles['hero-subtitle']}>Welcome to <span style={{ color: '#BA5066', fontWeight: 600 }}>ZCONNECT</span></div>
          <h1 className={styles['hero-title']}>Stronger together, safer tomorrow.</h1>
          <p className={styles['hero-description']}>
            We craft exceptional digital experiences that inspire, engage, and deliver results. 
            Let's build something extraordinary together.
          </p>
          <div className={styles['hero-buttons']}>
            <a href="signup" className={`${styles['btn']} ${styles['btn-primary']}`} onClick={() => navigate('/signup')}>Get Started</a>
            <a href="#services" className={`${styles['btn']} ${styles['btn-secondary']}`}>Learn More</a>
          </div>
        </div>
        
        <div className={styles['scroll-indicator']}>
          <div className={styles['scroll-arrow']}></div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles['why-choose-us']}>
        <div className={styles['why-choose-container']}>
          <div className={styles['section-header']}>
            <h1 className={styles['section-title']}>Why Choose <span style={{color: '#BA5066'}}>ZCONNECT</span>?</h1>
            <p className={styles['section-subtitle']}>We're more than just a support service - we're a community dedicated to transforming lives and creating lasting positive change for young people.</p>
          </div>

          <div className={styles['main-content']}>
            <div className={styles['why-content']}>
              <h2 className={styles['why-title']}>Building <span style={{color: '#BA5066'}}>Stronger Futures</span> Together</h2>
              <p className={styles['why-description']}>Our evidence-based approach combines professional expertise with genuine care, creating safe spaces where young people can heal, grow, and thrive. We believe every youth deserves a chance to reach their full potential.</p>
              
              <div className={styles['stats-container']}>
                <div className={styles['stat-item']}>
                  <span className={styles['stat-number']}>95%</span>
                  <span className={styles['stat-label']}>Success Rate</span>
                </div>
                <div className={styles['stat-item']}>
                  <span className={styles['stat-number']}>24/7</span>
                  <span className={styles['stat-label']}>Support Available</span>
                </div>
                <div className={styles['stat-item']}>
                  <span className={styles['stat-number']}>500+</span>
                  <span className={styles['stat-label']}>Lives Transformed</span>
                </div>
              </div>
            </div>

            <div className={styles['why-visual']} style={{backgroundImage: `url(${whychoose})`}}>
              <div className={styles['visual-elements']}>
                <div className={`${styles['floating-element']} ${styles['element-1']}`}></div>
                <div className={`${styles['floating-element']} ${styles['element-2']}`}></div>
                <div className={`${styles['floating-element']} ${styles['element-3']}`}></div>
              </div>
            </div>
          </div>  
        </div>  
      </section>  

      {/* Services Section */}
      <div className={styles['services-container']} id="services">
        <div className={styles['section-header']}>
          <h1 className={styles['section-title']}>Our <span style={{color: '#BA5066'}}>Services</span></h1>
          <p className={styles['section-subtitle']}>Empowering youth through comprehensive support programs designed to build resilience, foster connections, and create positive pathways forward.</p>
        </div>

        <div className={styles['services-grid']}>
          <div className={styles['service-card']} style={{backgroundImage: `url(${service1})`}}>
            <div className={styles['card-overlay']}></div>
            <div className={styles['card-icon']}><i className="fas fa-comments"></i></div>
            <div className={styles['card-content']}>
              <h3 className={styles['service-title']}>Counselling Support</h3>
              <p className={styles['service-description']}>Professional mental health support and therapeutic interventions to help young people process trauma and build emotional resilience.</p>
            </div>
          </div>

          <div className={styles['service-card']} style={{backgroundImage: `url(${service2})`}}>
            <div className={styles['card-overlay']}></div>
            <div className={styles['card-icon']}><i className="fas fa-handshake"></i></div>
            <div className={styles['card-content']}>
              <h3 className={styles['service-title']}>Peer Mentoring</h3>
              <p className={styles['service-description']}>Connecting youth with positive role models and peers who provide guidance, support, and inspiration for personal growth.</p>
            </div>
          </div>

          <div className={styles['service-card']} style={{backgroundImage: `url(${service3})`}}>
            <div className={styles['card-overlay']}></div>
            <div className={styles['card-icon']}><i className="fas fa-bullseye"></i></div>
            <div className={styles['card-content']}>
              <h3 className={styles['service-title']}>Skills Development</h3>
              <p className={styles['service-description']}>Practical workshops and training programs that build life skills, vocational abilities, and pathways to education and employment.</p>
            </div>
          </div>

          <div className={styles['service-card']} style={{backgroundImage: `url(${service4})`}}>
            <div className={styles['card-overlay']}></div>
            <div className={styles['card-icon']}><i className="fas fa-star"></i></div>
            <div className={styles['card-content']}>
              <h3 className={styles['service-title']}>Community Engagement</h3>
              <p className={styles['service-description']}>Creating safe spaces and meaningful opportunities for youth to connect, contribute, and build stronger community relationships.</p>
            </div>
          </div>

          <div className={styles['service-card']} style={{backgroundImage: `url(${service5})`}}>
            <div className={styles['card-overlay']}></div>
            <div className={styles['card-icon']}><i className="fas fa-exclamation-triangle"></i></div>
            <div className={styles['card-content']}>
              <h3 className={styles['service-title']}>Crisis Intervention</h3>
              <p className={styles['service-description']}>24/7 emergency support and immediate intervention services for youth in crisis situations requiring urgent assistance.</p>
            </div>
          </div>

          <div className={styles['service-card']} style={{backgroundImage: `url(${service6})`}}>
            <div className={styles['card-overlay']}></div>
            <div className={styles['card-icon']}><i className="fas fa-heart"></i></div>
            <div className={styles['card-content']}>
              <h3 className={styles['service-title']}>Wellness Programs</h3>
              <p className={styles['service-description']}>Holistic wellness initiatives including mindfulness, meditation, and self-care practices to promote overall mental and emotional well-being.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Counselors Section */}
      <section className={styles['counselors-section']}>
        <div className={styles['counselors-container']}>
          <h2 className={styles['section-title']}>Meet Our <span style={{color: '#BA5066'}}>Counselors</span></h2>
          <p className={styles['section-subtitle']}>A team of compassionate professionals dedicated to supporting and guiding youth through every challenge.</p>
          
          <div className={styles['counselors-grid']}>
            <div className={styles['counselor-card'] + ' ' + styles['fade-up']}>
              <div className={styles['counselor-photo']} style={{backgroundImage: `url(${niru})`}}></div>
              <div className={styles['counselor-info']}>
                <h3>Nirjala Thapa</h3>
                <p>Youth Psychologist</p>
              </div>
            </div>
            
            <div className={styles['counselor-card'] + ' ' + styles['fade-up']}>
              <div className={styles['counselor-photo']} style={{backgroundImage: `url(${harish})`}}></div>
              <div className={styles['counselor-info']}>
                <h3>Harish Singh Air</h3>
                <p>Mental Health Advocate</p>
              </div>
            </div>
            
            <div className={styles['counselor-card'] + ' ' + styles['fade-up']}>
              <div className={styles['counselor-photo']} style={{backgroundImage: `url(${sabal})`}}></div>
              <div className={styles['counselor-info']}>
                <h3>Sabal Shahi</h3>
                <p>Trauma Support Specialist</p>
              </div>
            </div>
            
            <div className={styles['counselor-card'] + ' ' + styles['fade-up']}>
              <div className={styles['counselor-photo']} style={{backgroundImage: `url(${sodesh})`}}></div>
              <div className={styles['counselor-info']}>
                <h3>Sodesh Thapa</h3>
                <p>Family Counselor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles['testimonials-section']}>
        <div className={styles['testimonial-header']}>
          <h2>What <span style={{color: '#BA5066'}}>Our Community</span> Says</h2>
          <p>Real stories from people who found healing and hope through ZCONNECT</p>
        </div>
        
        <div className={styles['testimonials-grid']}>
          <div className={styles['testimonial-card']}>
            <div className={styles['testimonial-date']}>2 months ago</div>
            <div className={styles['quote-icon']}>"</div>
            <div className={styles['testimonial-header-card']}>
              <img src={user1} alt="Anjali R." className={styles['testimonial-avatar']} />
              <div className={styles['testimonial-info']}>
                <h4>Anjali R.</h4>
                <div className={styles['testimonial-rating']}>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                </div>
                <div className={styles['testimonial-location']}>Kathmandu, Nepal</div>
              </div>
            </div>
            <div className={styles['testimonial-content']}>
              <p className={styles['testimonial-quote']}>
                ZCONNECT helped me regain confidence and connect with others who truly care. The support I received was exactly what I needed during my darkest moments.
              </p>
              <div className={styles['testimonial-tags']}>
                <span className={styles['tag']}>Individual Therapy</span>
                <span className={styles['tag']}>Anxiety Support</span>
              </div>
            </div>
          </div>
          
          <div className={styles['testimonial-card']}>
            <div className={styles['testimonial-date']}>1 month ago</div>
            <div className={styles['quote-icon']}>"</div>
            <div className={styles['testimonial-header-card']}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Ramesh S." className={styles['testimonial-avatar']} />
              <div className={styles['testimonial-info']}>
                <h4>Ramesh S.</h4>
                <div className={styles['testimonial-rating']}>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                </div>
                <div className={styles['testimonial-location']}>Pokhara, Nepal</div>
              </div>
            </div>
            <div className={styles['testimonial-content']}>
              <p className={styles['testimonial-quote']}>
                A safe and empowering space to grow mentally and emotionally. The therapists here understand the cultural context and provide relevant guidance.
              </p>
              <div className={styles['testimonial-tags']}>
                <span className={styles['tag']}>Group Sessions</span>
                <span className={styles['tag']}>Depression Support</span>
              </div>
            </div>
          </div>
          
          <div className={styles['testimonial-card']}>
            <div className={styles['testimonial-date']}>3 weeks ago</div>
            <div className={styles['quote-icon']}>"</div>
            <div className={styles['testimonial-header-card']}>
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Priya M." className={styles['testimonial-avatar']} />
              <div className={styles['testimonial-info']}>
                <h4>Priya M.</h4>
                <div className={styles['testimonial-rating']}>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                  <span className={styles['star']}>★</span>
                </div>
                <div className={styles['testimonial-location']}>Lalitpur, Nepal</div>
              </div>
            </div>
            <div className={styles['testimonial-content']}>
              <p className={styles['testimonial-quote']}>
                From crisis to clarity — ZCONNECT guided me with compassion and professionalism. I'm grateful for the journey of healing I've experienced here.
              </p>
              <div className={styles['testimonial-tags']}>
                <span className={styles['tag']}>Crisis Support</span>
                <span className={styles['tag']}>Family Therapy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className={styles['cta-section']}>
        <h2 className={styles['cta-title']}>Ready to Make a <span style={{color: '#BA5066'}}>Difference?</span></h2>
        <p className={styles['cta-description']}>Join us in creating positive change. Whether you're seeking support or want to get involved, we're here to help you take the next step forward.</p>
        <a href="#contact" className={styles['cta-button']} onClick={() => navigate('/signup')}>
          Get Started Today
          <span>→</span>
        </a>
      </div>

      {/* Footer */}
      <footer className={styles['footer']}>
        <div className={styles['footer-container']}>
          <div className={styles['footer-main']}>
            <div className={styles['footer-brand']}>
              <h3>ZCONNECT</h3>
              <p>Supporting mental wellness through compassionate care and professional guidance.</p>
              <div className={styles['social-links']}>
                <a href="somewhere" className={styles['social-link']}>f</a>
                <a href="somewhere" className={styles['social-link']}>ig</a>
                <a href="somewhere" className={styles['social-link']}>tw</a>
                <a href="somewhere" className={styles['social-link']}>in</a>
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

export default ZConnectLanding;