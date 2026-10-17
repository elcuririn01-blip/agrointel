const fs = require('fs');

let css = fs.readFileSync('c:/Users/Sforza/OneDrive/Desktop/OTF RICO/assets/css/styles.css', 'utf8');

// Replace or append upgraded modern SaaS styling rules

const newDesignRules = `
/* ==========================================================================
   AGROINTEL PRO — PREMIUM SAAS DESIGN SYSTEM ENHANCEMENTS (ZERO EMOJIS)
   ========================================================================== */

/* Hero Atmosphere & Grid */
.hero-section {
  position: relative;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, #0c3323 0%, #071a12 60%, #030f0a 100%);
  overflow: hidden;
}

.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(16, 185, 129, 0.14) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, #000 50%, transparent 95%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, #000 50%, transparent 95%);
  pointer-events: none;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(52, 211, 153, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #A7F3D0;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 22px;
}

.kicker-dot {
  width: 7px;
  height: 7px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10B981, 0 0 18px rgba(16, 185, 129, 0.6);
}

.kicker-code {
  color: #FBBF24;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 1px;
  font-family: monospace;
}

.kicker-sep {
  color: rgba(255, 255, 255, 0.2);
}

/* Vector Icon Boxes (Zero Emojis) */
.audience-icon,
.benefit-icon-wrapper,
.bonus-icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.3) 100%);
  border: 1px solid rgba(52, 211, 153, 0.25);
  color: #34D399;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.audience-card:hover .audience-icon,
.benefit-card:hover .benefit-icon-wrapper,
.bonus-card:hover .bonus-icon-box {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #FFFFFF;
  border-color: #34D399;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);
  transform: translateY(-2px) scale(1.05);
}

/* Card Elevate on Hover */
.audience-card,
.benefit-card,
.deliverable-card,
.testimonial-card {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.audience-card:hover,
.benefit-card:hover,
.deliverable-card:hover,
.testimonial-card:hover {
  transform: translateY(-3px);
  border-color: #A7F3D0;
  box-shadow: 0 16px 36px -10px rgba(15, 23, 42, 0.09), 0 0 0 1px rgba(16, 185, 129, 0.15);
}

/* Deliverables Checkmark Icon Box */
.deliv-check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  color: var(--primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.12);
}

.deliv-check .check-svg {
  stroke: var(--primary);
}

/* Bonus Card Upgrades */
.bonus-card {
  background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, #0B251A 100%);
  border: 1px solid rgba(16, 185, 129, 0.22);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.bonus-card:hover {
  transform: translateY(-4px);
  border-color: rgba(52, 211, 153, 0.45);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.15);
}

/* Testimonials Header & Stars */
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.test-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #F59E0B;
}

.star-svg {
  flex-shrink: 0;
}

.verified-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #065F46;
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  padding: 3px 9px;
  border-radius: 999px;
}

/* App Mockup Modernization */
.sidebar-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6EE7B7;
  flex-shrink: 0;
}

.pane-meta {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 3px;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
}

.mock-card-sub {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 6px;
}

.warning-val {
  color: #FBBF24;
}

/* Package List Icons */
.pkg-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.pkg-icon .check-svg {
  stroke: #FFFFFF;
}

.highlight-val {
  color: #10B981;
  font-weight: 800;
  background: #ECFDF5;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.start-check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 6px;
}

.start-excluded {
  color: #94A3B8;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 6px;
}

/* FAQ Chevron */
.faq-icon-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.faq-item.active .faq-icon-chevron {
  transform: rotate(180deg);
}

.check-svg {
  display: inline-block;
  vertical-align: middle;
}
`;

// Append new rules to styles.css
css += '\n' + newDesignRules;
fs.writeFileSync('c:/Users/Sforza/OneDrive/Desktop/OTF RICO/assets/css/styles.css', css, 'utf8');
console.log('styles.css updated with modern SaaS design rules!');
