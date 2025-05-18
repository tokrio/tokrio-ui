import React from 'react';
import Navbar from '../components/Navbar';

const TermsPage = () => {
    return (
        <div className="bg-[#121212] mt-20 min-h-screen text-white">
            <Navbar showMenu={false} />
            
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
                
                <div className="space-y-8 text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to Tokrio ("we," "our," or "us"). By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">2. Service Description</h2>
                        <p className="mb-4">
                            Tokrio provides an AI-powered trading platform that enables users to participate in automated trading activities through our proxy network. Our services include but are not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access to AI-powered trading algorithms</li>
                            <li>Proxy network infrastructure</li>
                            <li>Real-time trading data and analytics</li>
                            <li>Portfolio management tools</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">3. Eligibility</h2>
                        <p className="mb-4">
                            By using our services, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You are at least 18 years old</li>
                            <li>You have the legal capacity to enter into these Terms</li>
                            <li>You are not located in a jurisdiction where automated trading is prohibited</li>
                            <li>You will comply with all applicable laws and regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">4. Account Registration</h2>
                        <p className="mb-4">
                            To use our services, you must connect your Web3 wallet and maintain accurate, complete, and up-to-date information. You are responsible for maintaining the security of your wallet and any activities that occur through your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">5. Proxy Network Terms</h2>
                        <p className="mb-4">
                            When purchasing and operating a proxy node:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You must maintain the required hardware specifications</li>
                            <li>Ensure 99% minimum uptime for your proxy server</li>
                            <li>Not attempt to manipulate or abuse the network</li>
                            <li>Not use the proxy for any illegal activities</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">6. Fees and Payments</h2>
                        <p className="mb-4">
                            All fees are denominated in USDT. Package prices are final and non-refundable. Revenue sharing will be distributed according to your package tier and performance metrics.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">7. Risk Disclosure</h2>
                        <p className="mb-4">
                            Trading cryptocurrencies involves substantial risk. Past performance is not indicative of future results. You should consider your investment objectives and risks carefully before investing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">8. Limitation of Liability</h2>
                        <p className="mb-4">
                            To the maximum extent permitted by law, Tokrio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, arising out of or relating to the use or inability to use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">9. Modifications</h2>
                        <p className="mb-4">
                            We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through our platform. Your continued use of our services following such modifications constitutes your acceptance of the updated Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-white">10. Contact Information</h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, please contact us at support@tokrio.com
                        </p>
                    </section>

                    <section className="pt-8 border-t border-gray-800">
                        <p className="text-sm text-gray-400">
                            Last updated: March 20, 2024
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TermsPage;