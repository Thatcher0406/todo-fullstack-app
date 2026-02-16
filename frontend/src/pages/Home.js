import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const sectionTitle = { fontSize: '28px', color: '#6E2C2C', marginBottom: '12px' };

const Home = () => {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F5F1E8' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 64px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#6E2C2C' }}>TaskForge</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button type='button' onClick={() => scrollTo('features')} style={{ border: 'none', background: 'transparent', color: '#3B2F2F', cursor: 'pointer' }}>Features</button>
          <button type='button' onClick={() => scrollTo('why')} style={{ border: 'none', background: 'transparent', color: '#3B2F2F', cursor: 'pointer' }}>Why Us</button>
          <button onClick={() => navigate('/login')} style={{ border: '1px solid #6E2C2C', borderRadius: '12px', padding: '8px 16px', background: 'transparent', color: '#6E2C2C', cursor: 'pointer' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} style={{ borderRadius: '12px', padding: '8px 16px', backgroundColor: '#6E2C2C', color: '#F5F1E8', border: 'none', cursor: 'pointer' }}>
            Create Account
          </button>
        </div>
      </nav>

      <section style={{ textAlign: 'center', padding: '90px 24px 70px', background: 'linear-gradient(180deg, #F5F1E8 0%, #ECE6DA 100%)' }}>
        <h1 style={{ fontSize: '44px', color: '#6E2C2C', marginBottom: '16px' }}>Build Momentum, Not Chaos.</h1>
        <p style={{ fontSize: '17px', color: '#3B2F2F', marginBottom: '26px' }}>
          Plan, track, and ship your tasks with a workspace built for focused execution.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/signup')} style={{ borderRadius: '12px', padding: '12px 24px', backgroundColor: '#6E2C2C', color: '#F5F1E8', border: 'none', cursor: 'pointer' }}>
            Start Free
          </button>
          <button onClick={() => scrollTo('features')} style={{ borderRadius: '12px', padding: '12px 24px', backgroundColor: '#5F6F52', color: '#F5F1E8', border: 'none', cursor: 'pointer' }}>
            Explore Features
          </button>
        </div>
      </section>

      <section id='features' style={{ padding: '64px' }}>
        <h2 style={sectionTitle}>Core Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { title: 'Status Workflow', desc: 'Move tasks through To Do, Doing, and Done with clear ownership.' },
            { title: 'Priority + Due Dates', desc: 'Capture urgency and deadlines without extra complexity.' },
            { title: 'Live Analytics', desc: 'Track completion trends and delivery patterns from real task data.' },
            { title: 'Secure Access', desc: 'JWT auth with account activation and protected project data.' },
          ].map((feature) => (
            <div key={feature.title} style={{ backgroundColor: '#E8E2D6', borderRadius: '12px', padding: '22px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '20px', color: '#6E2C2C', marginBottom: '8px' }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: '#6A5F5F' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id='why' style={{ padding: '0 64px 64px' }}>
        <h2 style={sectionTitle}>Why Teams Like It</h2>
        <div style={{ backgroundColor: '#E8E2D6', borderRadius: '14px', padding: '24px' }}>
          <p style={{ color: '#3B2F2F', margin: 0 }}>
            Designed for builders who want fewer tabs, clearer priorities, and measurable progress every day.
          </p>
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '44px 24px 64px' }}>
        <h2 style={{ fontSize: '28px', color: '#6E2C2C', marginBottom: '14px' }}>Ready to start shipping with less friction?</h2>
        <button onClick={() => navigate('/signup')} style={{ borderRadius: '12px', padding: '12px 24px', backgroundColor: '#6E2C2C', color: '#F5F1E8', border: 'none', cursor: 'pointer' }}>
          Create Account
        </button>
      </section>

      <footer style={{ textAlign: 'center', padding: '24px', fontSize: '14px', color: '#6A5F5F' }}>
        2026 TaskForge | <Link to='/signup' style={{ color: '#6E2C2C' }}>Terms</Link> | <Link to='/signup' style={{ color: '#6E2C2C' }}>Privacy</Link>
      </footer>
    </div>
  );
};

export default Home;
