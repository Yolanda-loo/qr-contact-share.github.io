// --- TAB SWITCHING LOGIC ---
function switchTab(tab) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));

    // Show selected
    document.getElementById(`section-${tab}`).classList.remove('hidden');
    document.getElementById(`btn-${tab}`).classList.add('active');

    // Stop scanner if leaving scan tab to save battery
    if (tab === 'generate' && html5QrCode) {
        stopScanner();
    }
}

// --- GENERATOR LOGIC ---
const qrContainer = document.getElementById("qrcode-container");

function generateQR() {
    const number = document.getElementById("phone-input").value;
    
    // Clear previous QR
    qrContainer.innerHTML = "";
    document.getElementById("qr-instruction").classList.add("hidden");

    if (number.trim() === "") {
        alert("Please enter a phone number");
        return;
    }

    // Generate QR using qrcode.js
    // We add 'tel:' so phones recognize it as a number immediately
    new QRCode(qrContainer, {
        text: `tel:${number}`, 
        width: 200,
        height: 200
    });

    document.getElementById("qr-instruction").classList.remove("hidden");
}

// --- SCANNER LOGIC ---
let html5QrCode;

function startScanner() {
    html5QrCode = new Html5Qrcode("reader");
    
    // Config for scanner
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    // Start camera (facing back)
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess)
    .catch(err => {
        console.error("Error starting scanner", err);
        alert("Camera permission denied or not available.");
    });
}

function onScanSuccess(decodedText, decodedResult) {
    // Stop scanning once found
    stopScanner();

    // Clean up the result (remove 'tel:' prefix if present for display)
    const cleanNumber = decodedText.replace('tel:', '');

    // Update UI
    document.getElementById("result-container").classList.remove("hidden");
    document.getElementById("reader").classList.add("hidden");
    document.getElementById("scanned-number").innerText = cleanNumber;
    
    // Set Call Button Action
    document.getElementById("call-btn").href = `tel:${cleanNumber}`;
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
        }).catch(err => console.log(err));
    }
}

function resetScanner() {
    document.getElementById("result-container").classList.add("hidden");
    document.getElementById("reader").classList.remove("hidden");
    startScanner();
}

function copyNumber() {
    const num = document.getElementById("scanned-number").innerText;
    navigator.clipboard.writeText(num).then(() => {
        alert("Number copied to clipboard!");
    });
}

// Initialize scanner when Scan tab is clicked
document.getElementById("btn-scan").addEventListener("click", () => {
    // slight delay to ensure DOM is ready
    setTimeout(startScanner, 100);
});
