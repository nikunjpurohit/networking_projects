const axios = require('axios');
const https = require('https');
const tls = require('tls');

// List of websites to scan
const websites = [
    'https://www.flipkart.com',
    'https://google.com'
];

// Function to scan a website for SSL/TLS vulnerabilities
async function scanWebsite(url) {
    try {
        const agent = new https.Agent({
            checkServerIdentity: (host, cert) => { return undefined; }
        });

        // Perform an HTTPS GET request to check SSL/TLS configuration
        const response = await axios.get(url, { httpsAgent: agent });
        const peerCertificate = response.request.socket.getPeerCertificate();

        console.log(`\nScanning ${url}`);
        console.log('Certificate Information:');
        console.log(`Subject: ${peerCertificate.subject.CN}`);
        console.log(`Issuer: ${peerCertificate.issuer.CN}`);
        console.log(`Valid From: ${peerCertificate.valid_from}`);
        console.log(`Valid To: ${peerCertificate.valid_to}`);

        // Check for common vulnerabilities
        checkSSLTLSVulnerabilities(peerCertificate);
    } catch (error) {
        console.error(`Error scanning ${url}: ${error.message}`);
    }
}

// Function to check for SSL/TLS vulnerabilities
function checkSSLTLSVulnerabilities(cert) {
    const currentDate = new Date();
    const validFrom = new Date(cert.valid_from);
    const validTo = new Date(cert.valid_to);

    console.log('\nVulnerability Check:');
    // Check for expired certificate
    if (currentDate > validTo) {
        console.log('Vulnerability: Certificate is expired.');
        console.log('Suggestion: Renew the SSL/TLS certificate.');
    } else {
        console.log('Certificate is valid.');
    }

    // Check for self-signed certificate
    if (cert.issuer.CN === cert.subject.CN) {
        console.log('Vulnerability: Self-signed certificate.');
        console.log('Suggestion: Obtain a certificate from a trusted Certificate Authority (CA).');
    } else {
        console.log('Certificate is issued by a trusted CA.');
    }

    // Check for SHA-1 certificates (considered weak)
    if (cert.fingerprint.toLowerCase().includes('sha1')) {
        console.log('Vulnerability: Certificate uses SHA-1 hashing algorithm.');
        console.log('Suggestion: Upgrade to SHA-256 or higher.');
    } else {
        console.log('Certificate uses a strong hashing algorithm.');
    }
}

// Scan each website in the list
websites.forEach(scanWebsite);
