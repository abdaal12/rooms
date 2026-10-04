import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

// ── Shared layout wrapper ─────────────────────────────────────────────────────
function LegalLayout({ title, subtitle, children }) {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <div className="container">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <span className="legal-updated">Last updated: June 2025</span>
        </div>
      </div>
      <div className="container legal-body">
        <div className="legal-content">
          {children}
        </div>
        <div className="legal-sidebar">
          <h4>Legal Documents</h4>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/owner-agreement">Owner Agreement</Link>
          <Link to="/guidelines">Listing Guidelines</Link>
          <Link to="/disclaimer">Disclaimer</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="legal-section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 1. TERMS & CONDITIONS
// ══════════════════════════════════════════════════════════════════
export function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using Nivas24."
    >
      <Section title="1. Acceptance of Terms">
        <p>By accessing or using Nivas24 ("Platform", "we", "us"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
      </Section>

      <Section title="2. Nature of Service">
        <p>Nivas24 is a property listing platform only. We connect property owners with potential tenants. We do not own, rent, lease, sell, manage, or guarantee any property listed on the platform.</p>
        <p>All listings are posted by independent property owners. Nivas24 is not a party to any rental agreement between an owner and a tenant.</p>
      </Section>

      <Section title="3. User Responsibilities">
        <p>As a user of Nivas24, you agree to:</p>
        <ul>
          <li>Use the platform only for lawful purposes</li>
          <li>Provide accurate information when submitting contact or callback requests</li>
          <li>Not misuse, abuse, or attempt to defraud owners or other users</li>
          <li>Not submit false reports about legitimate listings</li>
        </ul>
      </Section>

      <Section title="4. Owner Responsibilities">
        <p>Property owners who list on Nivas24 agree that:</p>
        <ul>
          <li>They are the owner or authorized representative of the listed property</li>
          <li>All information provided is accurate and up to date</li>
          <li>They have the legal right to list and rent the property</li>
          <li>They will not post fake, misleading, or fraudulent listings</li>
          <li>Rental agreements are solely between the owner and tenant — Nivas24 is not responsible for disputes</li>
        </ul>
      </Section>

      <Section title="5. Limitation of Liability">
        <p>Nivas24 does not guarantee the accuracy, completeness, or reliability of any listing. We are not liable for:</p>
        <ul>
          <li>The condition, safety, legality, or availability of any property</li>
          <li>Disputes between owners and tenants</li>
          <li>Any loss or damage arising from use of information on this platform</li>
          <li>Fraudulent listings posted by third parties</li>
        </ul>
      </Section>

      <Section title="6. Content Removal">
        <p>Nivas24 reserves the right to remove any listing that violates these terms, our listing guidelines, or applicable law, without prior notice.</p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>All content on Nivas24 — including design, logo, and platform code — is the intellectual property of Nivas24. You may not reproduce or redistribute it without written permission.</p>
      </Section>

      <Section title="8. Changes to Terms">
        <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
      </Section>

      <Section title="9. Contact">
        <p>For questions about these terms, contact us at <Link to="/contact">our contact page</Link>.</p>
      </Section>
    </LegalLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. PRIVACY POLICY
// ══════════════════════════════════════════════════════════════════
export function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Your privacy matters to us. Here is how we handle your data."
    >
      <Section title="1. What Data We Collect">
        <p>We collect the following information:</p>
        <ul>
          <li><strong>Visitors:</strong> Name, phone number, and WhatsApp number when you submit a callback request</li>
          <li><strong>Property Owners / Admins:</strong> Name, email address, and phone number when creating an account</li>
          <li><strong>Property Listings:</strong> Property details, photos, address, and owner contact information</li>
          <li><strong>Reports:</strong> Report reason, details, and optional reporter contact information</li>
        </ul>
      </Section>

      <Section title="2. Why We Collect It">
        <ul>
          <li>To connect interested tenants with property owners</li>
          <li>To allow property owners to manage their listings</li>
          <li>To send callback and inquiry notifications to our admin team</li>
          <li>To process property reports and maintain platform safety</li>
          <li>To improve our platform and user experience</li>
        </ul>
      </Section>

      <Section title="3. Where We Store It">
        <p>All data is stored securely on MongoDB Atlas cloud servers. Property images are stored on Cloudinary's secure cloud storage. Both services comply with industry-standard security practices.</p>
      </Section>

      <Section title="4. Who Can See It">
        <ul>
          <li><strong>Visitors:</strong> Can see property listings including owner name and contact details as provided by the owner</li>
          <li><strong>Admin:</strong> Can see all listings, callback requests, and reports through the admin dashboard</li>
          <li><strong>Third Parties:</strong> We do not sell, share, or rent your personal data to any third party</li>
        </ul>
      </Section>

      <Section title="5. How Long We Retain It">
        <ul>
          <li>Property listings are retained until the owner deletes them or Nivas24 removes them</li>
          <li>Callback and lead requests are retained for 90 days then may be archived</li>
          <li>Reports are retained for 12 months for accountability purposes</li>
          <li>Admin accounts remain active until deleted</li>
        </ul>
      </Section>

      <Section title="6. Cookies & Analytics">
        <p>Nivas24 currently does not use tracking cookies or third-party analytics services. Basic session data may be stored in your browser's local storage to keep you logged in as admin.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You may request correction or deletion of your personal data by contacting us. We will respond within 7 working days.</p>
      </Section>

      <Section title="8. Contact for Privacy Requests">
        <p>For any privacy-related requests, please visit our <Link to="/contact">Contact page</Link>.</p>
      </Section>
    </LegalLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. OWNER AGREEMENT
// ══════════════════════════════════════════════════════════════════
export function OwnerAgreementPage() {
  return (
    <LegalLayout
      title="Owner Agreement"
      subtitle="Terms that apply to property owners listing on Nivas24."
    >
      <Section title="1. Who This Applies To">
        <p>This agreement applies to any individual or organization that lists a property on Nivas24. By submitting a listing, you agree to all terms in this document.</p>
      </Section>

      <Section title="2. Owner Declarations">
        <p>By listing a property on Nivas24, you confirm that:</p>
        <div className="legal-checklist">
          <div className="legal-check-item">
            <span className="legal-check">✓</span>
            <span>You are the owner or authorized representative of the listed property</span>
          </div>
          <div className="legal-check-item">
            <span className="legal-check">✓</span>
            <span>All information and photographs provided are accurate and you have the right to publish them</span>
          </div>
          <div className="legal-check-item">
            <span className="legal-check">✓</span>
            <span>You agree to Nivas24's Terms &amp; Conditions and Privacy Policy</span>
          </div>
          <div className="legal-check-item">
            <span className="legal-check">✓</span>
            <span>The property is legally available for rent</span>
          </div>
          <div className="legal-check-item">
            <span className="legal-check">✓</span>
            <span>You will keep your listing information updated and accurate</span>
          </div>
        </div>
      </Section>

      <Section title="3. Accuracy of Listings">
        <p>Owners are solely responsible for the accuracy of their listings. Nivas24 does not verify listings before publication. Inaccurate, misleading, or fraudulent listings may be removed and the owner account may be suspended.</p>
      </Section>

      <Section title="4. Rental Agreements">
        <p>Any rental agreement made between an owner and a tenant is entirely between those two parties. Nivas24 is not a party to the agreement and bears no responsibility for its terms, execution, or disputes.</p>
      </Section>

      <Section title="5. No Guarantee of Tenants">
        <p>Nivas24 does not guarantee that your listing will receive inquiries or that any tenant will follow through with a rental agreement.</p>
      </Section>

      <Section title="6. Listing Removal">
        <p>Nivas24 reserves the right to remove any listing at any time if it is found to violate our terms, listing guidelines, or applicable laws, without prior notice or liability.</p>
      </Section>

      <Section title="7. Contact for Owner Queries">
        <p>For any questions regarding your listing or this agreement, visit our <Link to="/contact">Contact page</Link>.</p>
      </Section>
    </LegalLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. PROPERTY LISTING GUIDELINES
// ══════════════════════════════════════════════════════════════════
export function GuidelinesPage() {
  return (
    <LegalLayout
      title="Property Listing Guidelines"
      subtitle="What is and isn't allowed when listing a property on Nivas24."
    >
      <Section title="✅ What You Can List">
        <ul>
          <li>Residential rooms, flats, PGs, and studios that you own or are authorized to rent</li>
          <li>Properties with accurate descriptions, real photos, and correct pricing</li>
          <li>Properties that are legally available and ready for tenancy</li>
        </ul>
      </Section>

      <Section title="❌ What Is Not Allowed">
        <p>The following are strictly prohibited on Nivas24:</p>
        <div className="guidelines-grid">
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>Fake Properties</strong>
              <p>Properties that do not exist or are not available for rent</p>
            </div>
          </div>
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>Unauthorized Listings</strong>
              <p>Listing someone else's property without their written authorization</p>
            </div>
          </div>
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>Misleading Photos</strong>
              <p>Using photos that do not accurately represent the actual property</p>
            </div>
          </div>
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>False Pricing</strong>
              <p>Advertising a price that is significantly different from the actual rent</p>
            </div>
          </div>
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>Illegal Activities</strong>
              <p>Listings connected to any illegal activity or unlawful purpose</p>
            </div>
          </div>
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>Offensive Content</strong>
              <p>Any discriminatory, offensive, or inappropriate content in descriptions or photos</p>
            </div>
          </div>
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>Personal Information of Others</strong>
              <p>Sharing private contact details or personal data of other individuals without consent</p>
            </div>
          </div>
          <div className="guideline-card guideline-bad">
            <span>🚫</span>
            <div>
              <strong>Copyrighted Photos</strong>
              <p>Using photographs you do not own or have permission to publish</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="📸 Photo Guidelines">
        <ul>
          <li>Upload clear, well-lit photos of the actual property</li>
          <li>Only use photos you took yourself or have permission to use</li>
          <li>Do not use stock photos or photos from other listings</li>
          <li>Include photos of all major areas: room, bathroom, kitchen if applicable</li>
        </ul>
      </Section>

      <Section title="⚠️ Consequences of Violations">
        <p>Listings that violate these guidelines may be removed without notice. Repeated violations may result in permanent suspension of your account.</p>
      </Section>
    </LegalLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. DISCLAIMER
// ══════════════════════════════════════════════════════════════════
export function DisclaimerPage() {
  return (
    <LegalLayout
      title="Disclaimer"
      subtitle="Important information about the nature and limitations of Nivas24."
    >
      <Section title="Platform Nature">
        <p>Nivas24 is a property listing platform and does not own, rent, lease, sell, manage, or guarantee any of the properties listed by owners on this platform.</p>
      </Section>

      <Section title="No Verification">
        <p>While we take reports seriously and may remove violating listings, Nivas24 does not independently verify the accuracy, legality, ownership, condition, or safety of any listed property prior to publication.</p>
      </Section>

      <Section title="No Guarantees">
        <p>Nivas24 does not guarantee:</p>
        <ul>
          <li>The availability of any listed property at the time of inquiry</li>
          <li>The condition or safety of any property</li>
          <li>The legal ownership of any property by the listing owner</li>
          <li>The accuracy of any pricing, description, or photographs</li>
          <li>That any inquiry will result in a rental agreement</li>
        </ul>
      </Section>

      <Section title="Rental Agreements">
        <p>All rental agreements are solely between the property owner and the tenant. Nivas24 is not a party to any such agreement and bears no responsibility for any disputes, losses, damages, or liabilities arising from them.</p>
      </Section>

      <Section title="Limitation of Liability">
        <p>To the maximum extent permitted by law, Nivas24 and its operators shall not be held liable for any direct, indirect, incidental, or consequential loss or damage arising from the use of this platform or reliance on any listing information.</p>
      </Section>

      <Section title="User Responsibility">
        <p>Users are advised to exercise their own due diligence before entering into any rental agreement, including visiting the property in person and verifying ownership documents where appropriate.</p>
      </Section>
    </LegalLayout>
  );
}

// ══════════════════════════════════════════════════════════════════
// 6. CONTACT PAGE
// ══════════════════════════════════════════════════════════════════
export function ContactPage() {
  return (
    <LegalLayout
      title="Contact Us"
      subtitle="Get in touch with the Nivas24 team for support, grievances, or queries."
    >
      <Section title="General Enquiries">
        <p>For general questions about Nivas24 or how the platform works, reach out to us and we will get back to you within 1–2 business days.</p>
        <div className="contact-cards">
          <div className="contact-card-item">
            <span>📧</span>
            <div>
              <strong>Email</strong>
              <p>support@nivas24.com</p>
            </div>
          </div>
          <div className="contact-card-item">
            <span>💬</span>
            <div>
              <strong>WhatsApp</strong>
              <p>Available via the listing pages</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Grievance Redressal">
        <p>If you have a complaint about a listing, an owner, or any experience on Nivas24, you can:</p>
        <ul>
          <li>Use the <strong>🚩 Report this listing</strong> button on any property page</li>
          <li>Email us directly at <strong>grievance@nivas24.com</strong></li>
          <li>We aim to respond to all grievances within 3 working days</li>
        </ul>
      </Section>

      <Section title="Privacy Requests">
        <p>To request correction or deletion of your personal data, email us at <strong>privacy@nivas24.com</strong> with your request. We will respond within 7 working days.</p>
      </Section>

      <Section title="Owner Support">
        <p>For help with your property listing, adding photos, or managing your account, email us at <strong>owners@nivas24.com</strong>.</p>
      </Section>

      <Section title="Report Fraud or Scam">
        <p>If you believe a listing is fraudulent or that you have been scammed, please:</p>
        <ul>
          <li>Report the listing immediately using the 🚩 button on the listing page</li>
          <li>Contact us at <strong>report@nivas24.com</strong> with details</li>
          <li>Also report to your local law enforcement if money was involved</li>
        </ul>
      </Section>
    </LegalLayout>
  );
}