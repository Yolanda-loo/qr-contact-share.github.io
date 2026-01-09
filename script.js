// --- INITIALIZATION ---
window.onload = function() {
    // Load saved data if it exists
    if(localStorage.getItem("qr_name")) {
        document.getElementById("name-input").value = localStorage.getItem("qr_name");
    }
    if(localStorage.getItem("qr_phone")) {
        document.getElementById("phone-input").value = localStorage.getItem("qr_phone");
    }
    if(localStorage.getItem("qr_email")) {
        document.getElementById("email-input").value = localStorage.getItem("qr_email");
    }
    
    // Generate QR immediately if data is present
    updateData();
};

// --- GENERATOR LOGIC ---
function updateData() {
    const name = document.getElementById("name-input").value || "";
    const phone = document.getElementById("phone-input").value || "";
    const email = document.getElementById("email-input").value || "";

    // 1. Save to Local Storage
    localStorage.setItem("qr_name", name);
    localStorage.setItem("qr_phone", phone);
    localStorage.setItem("qr_email", email);

    // 2. Update Visual Preview
    document.getElementById("display-name").innerText = name || "Your Name";
    document.getElementById("display-phone").innerText = phone || "No number set";

    // 3. Generate QR
    const qrContainer = document.getElementById("qrcode-container");
    qrContainer.innerHTML = ""; // Clear previous

    if (phone.trim() === "") {
        // Show a placeholder if no number (keeps layout stable)
        new QRCode(qrContainer, { text: "https://google.com", width: 150, height: 150, colorDark: "#e5e7eb" });
        return;
    }

    // 4. Construct vCard String
    // This format is recognized by iOS and Android contacts
    let vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
END:VCARD`;

    new QRCode(qrContainer, {
        text: vCard,
        width: 150,
        height: 150,
        correctLevel: QRCode.CorrectLevel.L
    });
}

// --- TAB SWITCHING ---
function switchTab(tab) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));

    document.getElementById(`section-${tab}`).classList.remove('hidden');
    document.getElementById(`btn-${tab}`).classList.add('active');

    if (tab === 'generate' && html5QrCode) {
        stopScanner();
    }
}

// --- SCANNER LOGIC ---
let html5QrCode;

function startScanner() {
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
    .catch(err => {
        console.error(err);
        alert("Camera access required.");
    });
}

function onScanSuccess(decodedText, decodedResult) {
    stopScanner();

    let finalNumber = "Unknown";
    
    // LOGIC: Extract number from vCard or plain text
    // Regex looks for "TEL:" or "TEL;TYPE=CELL:" followed by the number
    const vCardRegex = /TEL(?:;[^:]+)?:([+0-9\-\(\)\s]+)/i;
    const match = decodedText.match(vCardRegex);

    if (match && match[1]) {
        finalNumber = match[1].trim(); // Found inside vCard
    } else if (decodedText.startsWith("tel:")) {
        finalNumber = decodedText.replace("tel:", ""); // Simple tel link
    } else {
        // Fallback: assume the whole text is a number if it's short
        if(decodedText.length < 20) finalNumber = decodedText;
    }

    // Update UI
    document.getElementById("result-container").classList.remove("hidden");
    document.getElementById("reader").classList.add("hidden");
    document.getElementById("scanned-number").innerText = finalNumber;
    document.getElementById("call-btn").href = `tel:${finalNumber}`;
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(err => console.log(err));
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

document.getElementById("btn-scan").addEventListener("click", () => setTimeout(startScanner, 100));