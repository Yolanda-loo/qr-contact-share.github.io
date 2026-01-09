// --- INITIALIZATION ---
window.onload = function() {
    // List of fields to save/load
    const fields = ['name', 'role', 'company', 'phone', 'email', 'website'];
    
    fields.forEach(field => {
        const savedVal = localStorage.getItem(`qr_${field}`);
        if(savedVal) document.getElementById(`${field}-input`).value = savedVal;
    });

    updateData(); // Auto-generate on load
};

// Helpers
const val = (id) => document.getElementById(`${id}-input`).value.trim();
const setText = (id, text) => document.getElementById(id).innerText = text;

// --- GENERATOR LOGIC ---
function updateData() {
    // 1. Get Values
    const name = val('name');
    const role = val('role');
    const company = val('company');
    const phone = val('phone');
    const email = val('email');
    const website = val('website');

    // 2. Save to Storage
    localStorage.setItem("qr_name", name);
    localStorage.setItem("qr_role", role);
    localStorage.setItem("qr_company", company);
    localStorage.setItem("qr_phone", phone);
    localStorage.setItem("qr_email", email);
    localStorage.setItem("qr_website", website);

    // 3. Update Visuals
    setText('display-name', name || "Your Name");
    setText('display-role', role || "Job Title");
    setText('display-company', company || "Company Name");

    // 4. Generate QR
    const qrContainer = document.getElementById("qrcode-container");
    qrContainer.innerHTML = "";

    // If no phone, show empty placeholder to keep layout fixed
    if(!phone && !email && !website) {
         new QRCode(qrContainer, { text: "https://google.com", width: 100, height: 100, colorDark: "#e5e7eb" });
         return;
    }

    // Standard vCard 3.0
    let vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
N:;${name};;;
TITLE:${role}
ORG:${company}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
URL:${website}
END:VCARD`;

    new QRCode(qrContainer, {
        text: vCard,
        width: 100, // Fits nicely in the card layout
        height: 100,
        correctLevel: QRCode.CorrectLevel.L
    });
}

// --- DOWNLOAD QR ---
function downloadQR() {
    const qrContainer = document.getElementById("qrcode-container");
    const img = qrContainer.querySelector("img");
    
    if (img && img.src) {
        const link = document.createElement("a");
        link.href = img.src;
        link.download = "my-contact-qr.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Please generate a QR code first (Enter a phone number).");
    }
}

// --- TAB SWITCHING ---
function switchTab(tab) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));

    document.getElementById(`section-${tab}`).classList.remove('hidden');
    document.getElementById(`btn-${tab}`).classList.add('active');

    // Manage Scanner Power
    if (tab === 'generate') stopScanner();
    // Note: We don't auto-start scan to let user click the button willingly
}

// --- SCANNER LOGIC ---
let html5QrCode;

function startScanner() {
    html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 250 } }, 
        onScanSuccess
    ).catch(err => {
        alert("Camera failed to start: " + err);
    });
}

function onScanSuccess(decodedText) {
    stopScanner();

    let finalNumber = "Unknown";
    
    // Smart Extraction Regex
    // Looks for TEL: (+12345) OR TEL;TYPE=CELL:(+12345)
    const vCardRegex = /TEL(?:;[^:]*)*:([+0-9\-\(\)\s]+)/i;
    const match = decodedText.match(vCardRegex);

    if (match && match[1]) {
        finalNumber = match[1].trim();
    } else if (decodedText.toLowerCase().startsWith("tel:")) {
        finalNumber = decodedText.substring(4);
    } else if (decodedText.length < 20 && !isNaN(decodedText.replace(/[\s\-\+]/g, ""))) {
        finalNumber = decodedText; // Raw number
    } else {
        finalNumber = "Format not supported for direct call";
    }

    // Show Result
    document.getElementById("result-container").classList.remove("hidden");
    document.getElementById("reader").classList.add("hidden");
    document.getElementById("scanned-number").innerText = finalNumber;
    
    // Update Call Button
    if (finalNumber.includes("not supported")) {
        document.getElementById("call-btn").style.display = 'none';
    } else {
        document.getElementById("call-btn").style.display = 'block';
        document.getElementById("call-btn").href = `tel:${finalNumber}`;
    }
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
    }
}

function resetScanner() {
    document.getElementById("result-container").classList.add("hidden");
    document.getElementById("reader").classList.remove("hidden");
    startScanner();
}

function copyNumber() {
    const num = document.getElementById("scanned-number").innerText;
    navigator.clipboard.writeText(num).then(() => alert("Copied!"));
}

// Init scanner listener
document.getElementById("btn-scan").addEventListener("click", () => setTimeout(startScanner, 200));