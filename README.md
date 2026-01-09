# QuickConnect - Digital Business Card & QR Scanner

**QuickConnect** is a web-based application that modernizes contact sharing. It replaces the awkward process of manually typing phone numbers with a seamless QR code exchange.

The app generates **vCard-compliant QR codes** that, when scanned, automatically prompt the user's phone to "Create New Contact" with the name, job title, company, email, and phone number already filled in. It also features a built-in camera scanner, allowing it to function as a complete contact exchange tool entirely in the browser.

## 🚀 Key Features

* **Smart vCard Generation:** Encodes full contact details (Name, Role, Company, Email, Phone, Website) into a standard vCard format recognized by iOS and Android.
* **Persistent Data:** Uses `LocalStorage` to remember your details, so you don't have to re-type them every time you open the app.
* **In-Browser Scanner:** Integrated webcam support to scan and decode QR codes without installing native apps.
* **Downloadable Cards:** Users can download their QR code as a PNG image to add to resumes, email signatures, or presentations.
* **Privacy First:** purely frontend-based. No data is sent to a server; everything lives on your device.
* **Premium UI:** Glassmorphism design with a responsive layout for mobile and desktop.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Libraries:**
    * [`qrcode.js`](https://github.com/davidshimjs/qrcodejs) - For generating client-side QR codes.
    * [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) - For accessing the camera and scanning codes.
* **Storage:** Browser LocalStorage API.

## ⚙️ Installation & Setup

Because this project uses the device camera, modern browsers require the site to be served over **HTTPS** or **Localhost**. You cannot simply open the `index.html` file directly.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/quickconnect.git](https://github.com/yourusername/quickconnect.git)
    cd quickconnect
    ```

2.  **Run a Local Server**
    If you have Python installed (recommended):
    ```bash
    # Python 3
    python -m http.server 8000 --bind 127.0.0.1
    ```
    *Note: We bind to `127.0.0.1` to ensure the browser treats it as a secure context for camera permissions.*

    If you are using VS Code:
    * Install the "Live Server" extension.
    * Click "Go Live" at the bottom right.

3.  **Open in Browser**
    Visit `http://127.0.0.1:8000` in your web browser.

## 📱 How to Use

### 1. Generate Your Card
* Go to the **"My Card"** tab.
* Enter your details (Name, Job Title, Number, etc.).
* The QR code updates automatically.
* Click **"Download Card Image"** to save it.

### 2. Scan a Contact
* Go to the **"Scan"** tab.
* Allow camera permissions when prompted.
* Point your camera at another QuickConnect QR code.
* The app will extract the number and give you a button to **Call** or **Copy** the details.

## 🔮 Future Improvements

* **Mobile App:** Rebuilding with Flutter for native performance.
* **Offline Mode:** Converting to a Progressive Web App (PWA) for offline access.
* **Cloud Sync:** Optional Firebase integration to sync contacts across devices.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
