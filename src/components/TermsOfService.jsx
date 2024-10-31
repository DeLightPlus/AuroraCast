import React from 'react';
import './cookiesNterms.css'

const TermsOfService = ({setShowTermsOfService}) => {
    return (
        <div className="terms-of-service">
            <h1>Terms of Service</h1>
            <p>Last updated: [32/10/2024]</p>
            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing or using our weather app, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our app.
            </p>
            <h2>2. Use of the Service</h2>
            <p>
                You may use our app only for lawful purposes and in accordance with these Terms. You agree not to use the app in any way that violates any applicable federal, state, local, or international law or regulation.
            </p>
            <h2>3. User Accounts</h2>
            <p>
                You may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account and password.
            </p>
            <h2>4. Limitation of Liability</h2>
            <p>
                Our app provides weather information for informational purposes only. We do not guarantee the accuracy, reliability, or timeliness of the information provided. We shall not be liable for any damages arising from your use of the app.
            </p>
            <h2>5. Changes to Terms</h2>
            <p>
                We may update these Terms from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the app after any changes constitutes your acceptance of the new Terms.
            </p>
            <h2>6. Contact Us</h2>
            <p>
                If you have any questions about these Terms, please contact us at [matlakalakabelo@gmail.com].
            </p>

            <button onClick={() => { setShowTermsOfService(false) }}>I Understand</button>
        </div>
    );
};

export default TermsOfService;
