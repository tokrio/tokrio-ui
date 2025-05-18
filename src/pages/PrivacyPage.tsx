import Navbar from "../components/Navbar"



export default function PrivacyPage() {

  return (

    
    <div className="min-h-screen privacy text-white bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-5xl mt-20 mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: March 20, 2024</p>
        </div>

        {/* Privacy Policy Sections */}
        <Section title="1. Information We Collect">
          <p>We collect and process the following categories of personal information:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, contact details, and authentication credentials</li>
            <li><strong>Trading Data:</strong> Trading history, preferences, and transaction records</li>
            <li><strong>Technical Information:</strong> IP address, device information, browser type, and usage patterns</li>
            <li><strong>Financial Information:</strong> Payment details and transaction records necessary for trading operations</li>
            <li><strong>Communication Data:</strong> Records of your interactions with our support team and system notifications</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We process your personal information for the following purposes:</p>
          <ul>
            <li><strong>Service Provision:</strong> To provide and maintain our trading services, including account management and transaction processing</li>
            <li><strong>Security:</strong> To protect your account, prevent fraud, and ensure platform security</li>
            <li><strong>Communication:</strong> To send important notifications, updates, and respond to your inquiries</li>
            <li><strong>Improvement:</strong> To enhance our AI algorithms, trading strategies, and user experience</li>
            <li><strong>Compliance:</strong> To meet legal obligations and regulatory requirements</li>
          </ul>
        </Section>

        <Section title="3. Data Security">
          <p>We implement comprehensive security measures to protect your personal information:</p>
          <ul>
            <li><strong>Encryption:</strong> All sensitive data is encrypted using industry-standard protocols (TLS/SSL)</li>
            <li><strong>Access Control:</strong> Strict authentication and authorization procedures</li>
            <li><strong>Regular Audits:</strong> Continuous security monitoring and regular penetration testing</li>
            <li><strong>Data Storage:</strong> Secure cloud infrastructure with redundant systems</li>
            <li><strong>Employee Training:</strong> Regular security awareness training for all staff</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing and Third-Party Services">
          <p>We may share your information with trusted third parties in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> Including email service providers (Mailgun) for transactional and marketing communications</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
            <li><strong>Business Partners:</strong> With your explicit consent for specific services</li>
            <li><strong>Analytics Providers:</strong> To improve our services and user experience</li>
          </ul>
          <p className="mt-4">We ensure all third-party service providers maintain appropriate security measures and comply with data protection regulations.</p>
        </Section>

        <Section title="5. Your Rights and Choices">
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Restriction:</strong> Limit the processing of your data</li>
            <li><strong>Portability:</strong> Receive your data in a structured, commonly used format</li>
            <li><strong>Objection:</strong> Object to certain types of processing</li>
            <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
          </ul>
        </Section>

        <Section title="6. Email Communications">
          <p>We use Mailgun as our email service provider to send you important notifications and updates. By using our services, you agree to receive:</p>
          <ul>
            <li>Account-related notifications</li>
            <li>Security alerts and updates</li>
            <li>Service announcements</li>
            <li>Marketing communications (with your consent)</li>
          </ul>
          <p className="mt-4">You can manage your email preferences or unsubscribe from marketing communications at any time through your account settings or by clicking the unsubscribe link in our emails.</p>
        </Section>

        <Section title="7. Data Retention">
          <p>We retain your personal information only for as long as necessary to:</p>
          <ul>
            <li>Provide our services</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p className="mt-4">When we no longer need your information, we will securely delete or anonymize it.</p>
        </Section>

        <Section title="8. International Data Transfers">
          <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this Privacy Policy periodically. We will notify you of any material changes through our website or via email.</p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <p className="text-gray-400">Email: privacy@tokrio.com</p>
          <p className="mt-4">We will respond to your inquiry within 30 days.</p>
        </Section>
      </main>
    </div>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
      <h2 className="text-[#f97316] text-xl font-semibold mb-4">{title}</h2>
      <div className="text-gray-200">
        {children}
      </div>
    </div>
  )
}