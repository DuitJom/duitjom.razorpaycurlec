let timerInstance = null;
let namaPelangganGlobal = "";

// ---- KAWALAN SIDEBAR ----
function openSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const menu = document.getElementById('sidebarMenu');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        menu.classList.remove('translate-x-full');
    }, 10);
}

function closeSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const menu = document.getElementById('sidebarMenu');
    overlay.classList.add('opacity-0');
    menu.classList.add('translate-x-full');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}

// Format IC dengan dashes
function formatIC(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 12) value = value.slice(0, 12);
    
    if (value.length <= 6) {
        input.value = value;
    } else if (value.length <= 8) {
        input.value = value.slice(0, 6) + '-' + value.slice(6);
    } else {
        input.value = value.slice(0, 6) + '-' + value.slice(6, 8) + '-' + value.slice(8, 12);
    }

    const icError = document.getElementById('icError');
    if (value.length === 12) {
        icError.classList.add('hidden');
    } else if (input.value.length > 0) {
        icError.classList.remove('hidden');
    }
}

// Validate DJ/CUST NUMBER
function validateDJCust(input) {
    const value = input.value.toUpperCase();
    const djcustError = document.getElementById('djcustError');
    
    const allowedChars = /^[DJCUST0-9/]*$/;
    
    if (!allowedChars.test(value)) {
        input.value = value.replace(/[^DJCUST0-9/]/g, '');
        djcustError.classList.remove('hidden');
    } else {
        input.value = value;
        djcustError.classList.add('hidden');
    }
}

// Validate Phone Number
function validatePhone(input) {
    const value = input.value.replace(/\D/g, '');
    const phoneError = document.getElementById('phoneError');
    
    if (value.length > 11) {
        input.value = value.slice(0, 11);
    } else {
        input.value = value;
    }

    if (value.length > 0 && (value.length < 10 || value.length > 11)) {
        phoneError.classList.remove('hidden');
    } else {
        phoneError.classList.add('hidden');
    }
}

// ---- KAWALAN HALAMAN PEMBAYARAN PINJAMAN (DENGAN 7 SAAT SPINNER) ----
function goToPaymentPage() {
    // Tunjukkan spinner transisi 7 saat
    const transitionSpinner = document.getElementById('pageTransitionSpinner');
    transitionSpinner.classList.remove('hidden');
    transitionSpinner.classList.add('flex');

    // Set masa 7 saat (7000 ms) sebelum pindah halaman
    setTimeout(() => {
        // Sembunyikan spinner
        transitionSpinner.classList.add('hidden');
        transitionSpinner.classList.remove('flex');

        // Pindah ke Halaman Pembayaran (Langkah 1)
        document.getElementById('mainPage').classList.add('hidden');
        document.getElementById('paymentPage').classList.remove('hidden');
        
        // Munculkan Modal Tutorial
        setTimeout(() => { 
            document.getElementById('tutorialModal').classList.remove('hidden'); 
        }, 200);
    }, 7000);
}

// ---- FUNGSI TUTORIAL ----
function closeTutorialModal() {
    document.getElementById('tutorialModal').classList.add('hidden');
}

// ---- FUNGSI FORM PEMBAYARAN PINJAMAN ----
function goToNextStepPage(event) {
    event.preventDefault();
    
    const nama = document.getElementById('inputNama').value;
    const ic = document.getElementById('inputIC').value;
    const loanID = document.getElementById('inputLoanID').value;
    const phone = document.getElementById('inputPhone').value;
    const amaun = document.getElementById('inputAmaun').value;
    
    // Simpan data dalam global
    namaPelangganGlobal = nama;
    
    // Paparkan data di halaman review
    document.getElementById('reviewNama').textContent = nama;
    document.getElementById('reviewIC').textContent = ic;
    document.getElementById('reviewLoanID').textContent = loanID;
    document.getElementById('reviewPhone').textContent = phone;
    document.getElementById('reviewAmaun').textContent = 'RM ' + parseFloat(amaun).toFixed(2);
    
    // Pindah ke halaman seterusnya
    document.getElementById('paymentPage').classList.add('hidden');
    document.getElementById('nextStepPage').classList.remove('hidden');
}

function backToInformationPage() {
    document.getElementById('nextStepPage').classList.add('hidden');
    document.getElementById('paymentPage').classList.remove('hidden');
}

function goToStep3Page() {
    const amaun = document.getElementById('inputAmaun').value;
    const loanID = document.getElementById('inputLoanID').value;
    
    document.getElementById('displayLoanID').textContent = loanID;
    document.getElementById('displayMainAmaun').textContent = 'RM ' + parseFloat(amaun).toFixed(2);
    document.getElementById('displaySubAmaun').textContent = 'RM ' + parseFloat(amaun).toFixed(2);
    
    document.getElementById('nextStepPage').classList.add('hidden');
    document.getElementById('step3Page').classList.remove('hidden');
}

function backToStep2Page() {
    document.getElementById('step3Page').classList.add('hidden');
    document.getElementById('nextStepPage').classList.remove('hidden');
}

// Kawalan Pemilihan Bank
function checkBankSelection() {
    const bank = document.getElementById('selectBank').value;
    const btnFinalNext = document.getElementById('btnFinalNext');
    
    if (bank !== '') {
        btnFinalNext.disabled = false;
        btnFinalNext.classList.remove('bg-gray-400', 'cursor-not-allowed');
        btnFinalNext.classList.add('bg-gradient-to-r', 'from-blue-400', 'to-blue-600', 'cursor-pointer');
    } else {
        btnFinalNext.disabled = true;
        btnFinalNext.classList.add('bg-gray-400', 'cursor-not-allowed');
        btnFinalNext.classList.remove('bg-gradient-to-r', 'from-blue-400', 'to-blue-600', 'cursor-pointer');
    }
}

// Pindah ke QR Page
function goToQRPage() {
    const bank = document.getElementById('selectBank').value;
    const amaun = document.getElementById('inputAmaun').value;
    const loanID = document.getElementById('inputLoanID').value;
    
    // Set Bank Badge
    const bankLabel = {
        'TNG': 'TOUCH\'N GO',
        'MAYBANK': 'MAYBANK QRPAY',
        'DUITNOW_QR': 'DUITNOW QR/e-WALLET',
        'RHB': 'RHB QRPAY',
        'GRABPAY': 'GRABPAY',
        'BOOST': 'BOOST'
    };
    
    document.getElementById('qrBankBadge').textContent = bankLabel[bank] || 'Unknown';
    document.getElementById('qrMainAmaun').textContent = 'RM ' + parseFloat(amaun).toFixed(2);
    document.getElementById('qrLoanID').textContent = loanID;
    
    document.getElementById('step3Page').classList.add('hidden');
    document.getElementById('qrPage').classList.remove('hidden');
    
    // Mulai countdown timer
    startCountdownTimer();
}

// Countdown Timer
function startCountdownTimer() {
    let timeLeft = 120; // 2 minit
    const timerDisplay = document.getElementById('countdownTimer');
    
    if (timerInstance) clearInterval(timerInstance);
    
    timerInstance = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.textContent = `${minutes}m ${seconds}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInstance);
            alert('QR Code telah tamat tempoh. Sila mula semula.');
        }
        
        timeLeft--;
    }, 1000);
}

function backToStep3Page() {
    if (timerInstance) clearInterval(timerInstance);
    document.getElementById('qrPage').classList.add('hidden');
    document.getElementById('step3Page').classList.remove('hidden');
}

// Kawalan Upload Resit
function handleFileSelected() {
    const fileInput = document.getElementById('receiptUpload');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadSuccess = document.getElementById('uploadSuccess');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const btnSubmitForm = document.getElementById('btnSubmitForm');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileName = file.name;
        
        uploadPlaceholder.classList.add('hidden');
        uploadSuccess.classList.remove('hidden');
        fileNameDisplay.textContent = fileName + ' (' + (file.size / 1024 / 1024).toFixed(2) + 'MB)';
        
        // Enable submit button
        btnSubmitForm.disabled = false;
        btnSubmitForm.classList.remove('bg-gray-400', 'cursor-not-allowed');
        btnSubmitForm.classList.add('bg-gradient-to-r', 'from-blue-400', 'to-blue-600', 'cursor-pointer');
    }
}

// Hantar Borang Akhir
function finalSubmission() {
    const fileInput = document.getElementById('receiptUpload');
    
    if (fileInput.files.length === 0) {
        alert('Sila muat naik resit pembayaran');
        return;
    }
    
    // Simulasi hantar
    const loadingPage = document.getElementById('loadingPage');
    loadingPage.classList.remove('hidden');
    loadingPage.classList.add('flex');
    
    setTimeout(() => {
        loadingPage.classList.add('hidden');
        loadingPage.classList.remove('flex');
        
        if (timerInstance) clearInterval(timerInstance);
        document.getElementById('qrPage').classList.add('hidden');
        document.getElementById('thanksPage').classList.remove('hidden');
        
        const thanksMessage = `Alhamdulillah! Pembayaran sebanyak RM${document.getElementById('inputAmaun').value} atas nama ${namaPelangganGlobal} telah berjaya dihantar. Sistem sedang memproses maklumat anda. Terima kasih kerana menggunakan DuitJom.`;
        document.getElementById('thanksMessage').textContent = thanksMessage;
    }, 3000);
}

// Handle Google Login
function handleGoogleLogin(response) {
    const loginSpinner = document.getElementById('loginSpinnerOverlay');
    loginSpinner.classList.remove('hidden');
    loginSpinner.classList.add('flex');
    
    // Simulasi proses login 5 saat
    setTimeout(() => {
        loginSpinner.classList.add('hidden');
        loginSpinner.classList.remove('flex');
        
        // Tunjukkan butang pembayaran
        document.getElementById('googleSignInSection').classList.add('hidden');
        document.getElementById('btnPembayaranPinjaman').classList.remove('hidden');
        
        // Tunjukkan modal scammer
        setTimeout(() => {
            document.getElementById('scammerModal').classList.remove('hidden');
        }, 500);
    }, 5000);
}

function closeScammerModal() {
    document.getElementById('scammerModal').classList.add('hidden');
}

// ===========================
// PREMIUM PAGE LOADER
// ===========================

window.addEventListener("load", function () {

    const loader = document.getElementById("pageLoader");

    if (loader) {

        setTimeout(() => {
            loader.classList.add("hide");

            setTimeout(() => {
                loader.style.display = "none";
            }, 600);

        }, 1500);

    }

});
