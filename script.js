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

/// Validate Malaysia Phone Number (+60)
function validatePhone(input) {
    const phoneError = document.getElementById('phoneError');

    // Ambil nombor sahaja
    let value = input.value.replace(/\D/g, '');

    // Jika pengguna masukkan 0 di hadapan, buang 0
    if (value.startsWith('0')) {
        value = value.substring(1);
    }

    // Maksimum 10 digit selepas +60
    value = value.substring(0, 10);

    // Paparkan semula nombor yang telah dibersihkan
    input.value = value;

    // Kosong = belum lengkap
    if (value.length === 0) {
        phoneError.classList.add('hidden');
        input.classList.remove('border-red-500');
        return false;
    }

    /*
     * Format selepas +60:
     *
     * 12xxxxxxx  = 9 digit
     * 11xxxxxxxx = 10 digit
     *
     * Contoh:
     * 0123456789  -> 123456789
     * 01123456789 -> 1123456789
     */

    const isValid = /^[1][0-9]{8,9}$/.test(value);

    if (!isValid) {
        phoneError.classList.remove('hidden');
        input.classList.add('border-red-500');
        return false;
    }

    // Nombor sah
    phoneError.classList.add('hidden');
    input.classList.remove('border-red-500');

    return true;
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

function closeTutorialModal() {
    document.getElementById('tutorialModal').classList.add('hidden');
    setTimeout(() => { 
        document.getElementById('scammerModal').classList.remove('hidden'); 
    }, 200);
}

function closeScammerModal() {
    document.getElementById('scammerModal').classList.add('hidden');
}

function goToNextStepPage(event) {
    event.preventDefault();

    const ic = document.getElementById('inputIC').value.replace(/\D/g, '');
    const phone = document.getElementById('inputPhone').value;
    const djcust = document.getElementById('inputLoanID').value;

    if (ic.length !== 12) {
        alert('Sila masukkan nombor kad pengenalan yang sah (12 digit)');
        return;
    }

    if (phone.length < 10 || phone.length > 11) {
        alert('Sila masukkan nombor telefon yang sah (10-11 digit)');
        return;
    }

    const djcustRegex = /^[DJCUST0-9/]*$/;
    if (!djcustRegex.test(djcust)) {
        alert('DJ/CUST NUMBER Tidak Sah');
        return;
    }

    document.getElementById('paymentPage').classList.add('hidden');
    document.getElementById('loadingPage').classList.remove('hidden');
    document.getElementById('loadingPage').classList.add('flex');

    setTimeout(() => {
        const nama = document.getElementById('inputNama').value;
        const loanID = document.getElementById('inputLoanID').value;
        const amaun = document.getElementById('inputAmaun').value;

        namaPelangganGlobal = nama;

        document.getElementById('reviewNama').innerText = nama;
        document.getElementById('reviewIC').innerText = document.getElementById('inputIC').value;
        document.getElementById('reviewLoanID').innerText = loanID.toUpperCase();
        document.getElementById('reviewPhone').innerText = phone;
        
        const amaunFormat = parseFloat(amaun).toFixed(2);
        document.getElementById('reviewAmaun').innerText = "RM " + amaunFormat;

        document.getElementById('displayLoanID').innerText = loanID.toUpperCase();
        document.getElementById('displayMainAmaun').innerText = "RM " + amaunFormat;
        document.getElementById('displaySubAmaun').innerText = "RM " + amaunFormat;

        document.getElementById('qrLoanID').innerText = loanID.toUpperCase();
        document.getElementById('qrMainAmaun').innerText = "RM " + amaunFormat;

        document.getElementById('loadingPage').classList.add('hidden');
        document.getElementById('loadingPage').classList.remove('flex');
        document.getElementById('nextStepPage').classList.remove('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, 7000);
}

function backToInformationPage() {
    document.getElementById('nextStepPage').classList.add('hidden');
    document.getElementById('paymentPage').classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function goToStep3Page() {
    document.getElementById('nextStepPage').classList.add('hidden');
    document.getElementById('step3Page').classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function backToStep2Page() {
    document.getElementById('step3Page').classList.add('hidden');
    document.getElementById('nextStepPage').classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function checkBankSelection() {
    const selectBank = document.getElementById('selectBank').value;
    const btnFinalNext = document.getElementById('btnFinalNext');
    
    if (selectBank !== "") {
        btnFinalNext.disabled = false;
        btnFinalNext.className = "flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3.5 rounded-xl text-xs text-center shadow-xs cursor-pointer transition duration-200 hover:from-blue-500 hover:to-blue-700";
    }
}

function goToQRPage() {
    const selectBank = document.getElementById('selectBank');
    const bankText = selectBank.options[selectBank.selectedIndex].text.substring(3);
    document.getElementById('qrBankBadge').innerText = bankText;

    document.getElementById('step3Page').classList.add('hidden');
    document.getElementById('qrPage').classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});

    startCountdown();
}

function backToStep3Page() {
    clearInterval(timerInstance);
    document.getElementById('qrPage').classList.add('hidden');
    document.getElementById('step3Page').classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function startCountdown() {
    clearInterval(timerInstance);
    let timeAllocated = 119; 
    const display = document.getElementById('countdownTimer');

    timerInstance = setInterval(function () {
        let minutes = parseInt(timeAllocated / 60, 10);
        let seconds = parseInt(timeAllocated % 60, 10);

        minutes = minutes < 10 ? minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerText = minutes + "m " + seconds + "s";

        if (--timeAllocated < 0) {
            clearInterval(timerInstance);
            display.innerText = "QR Code Expired";
            alert("Masa transaksi telah tamat. Sila dapatkan semula kod pembayaran baharu.");
            backToStep3Page();
        }
    }, 1000);
}

function handleFileSelected() {
    const fileInput = document.getElementById('receiptUpload');
    const placeholder = document.getElementById('uploadPlaceholder');
    const successDiv = document.getElementById('uploadSuccess');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const btnSubmitForm = document.getElementById('btnSubmitForm');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        placeholder.classList.add('hidden');
        successDiv.classList.remove('hidden');
        fileNameDisplay.innerText = "Fail dipilih: " + file.name;
        
        btnSubmitForm.disabled = false;
        btnSubmitForm.className = "flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3.5 rounded-xl text-xs text-center shadow-md cursor-pointer transition duration-200 hover:from-blue-500 hover:to-blue-700";
    }
}

function finalSubmission() {
    clearInterval(timerInstance);
    
    const susunanAyat = "Terima kasih <span class='font-extrabold text-slate-900'>" + namaPelangganGlobal + "</span> kerana telah berjaya membuat bayaran balik pinjaman anda di <span class='text-blue-400 font-bold'>DuitJom</span>. Pembayaran anda sedang diproses dan akan disemak dalam masa <span class='font-bold'>24 jam</span>. Anda akan menerima notifikasi melalui SMS atau email apabila pembayaran telah disahkan.";
    document.getElementById('thanksMessage').innerHTML = susunanAyat;

    document.getElementById('qrPage').classList.add('hidden');
    document.getElementById('thanksPage').classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// FUNGSI CALLBACK GOOGLE OAUTH LOGIN (BARU & LENGKAP)
function handleGoogleLogin(response) {
    console.log("Google Login berjaya");
    
    // Simpan status login
    localStorage.setItem("googleLogin", "success");

    // 1. Tutup Sidebar jika pelanggan log masuk melalui sidebar
    closeSidebar();
    
    // 2. Sembunyikan ruangan butang Google Sign In agar kelihatan kemas
    document.getElementById("googleSignInSection").classList.add("hidden");

    // 3. Tunjukkan skrin Loading 5 saat (Spinner Log Masuk)
    const spinnerOverlay = document.getElementById("loginSpinnerOverlay");
    spinnerOverlay.classList.remove("hidden");
    spinnerOverlay.classList.add("flex"); // aktifkan flexbox

    // Tunggu 5 saat
    setTimeout(() => {
        // Sembunyikan spinner log masuk
        spinnerOverlay.classList.add("hidden");
        spinnerOverlay.classList.remove("flex");

        // Munculkan butang Pembayaran Pinjaman secara automatik
        document.getElementById("btnPembayaranPinjaman").classList.remove("hidden");
    }, 5000);
 }
    /* =========================================================
   DUITJOM NEWS AUTOMATIC SLIDER
   AUTO SLIDE: 2.6 SECONDS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const newsTrack = document.getElementById("newsTrack");
    const newsItems = document.querySelectorAll(".news-item");
    const newsDots = document.querySelectorAll(".news-dot");

    if (!newsTrack || newsItems.length === 0) {
        return;
    }

    let currentNewsSlide = 0;
    let newsAutoTimer = null;
    const NEWS_INTERVAL = 2600;

    function updateNewsSlider(index) {

        currentNewsSlide = index;

        newsTrack.style.transform =
            `translateX(-${currentNewsSlide * 100}%)`;

        newsDots.forEach((dot, dotIndex) => {

            dot.classList.toggle(
                "active",
                dotIndex === currentNewsSlide
            );

        });

    }

    function nextNewsSlide() {

        currentNewsSlide++;

        if (currentNewsSlide >= newsItems.length) {
            currentNewsSlide = 0;
        }

        updateNewsSlider(currentNewsSlide);
    }

    function startNewsAutoSlider() {

        clearInterval(newsAutoTimer);

        newsAutoTimer = setInterval(
            nextNewsSlide,
            NEWS_INTERVAL
        );

    }

    function restartNewsAutoSlider() {

        clearInterval(newsAutoTimer);

        startNewsAutoSlider();

    }

    /* Dot Navigation */

    newsDots.forEach((dot, index) => {

        dot.addEventListener("click", function () {

            updateNewsSlider(index);

            restartNewsAutoSlider();

        });

    });


    /* Touch / Swipe Support */

    let touchStartX = 0;
    let touchEndX = 0;

    newsTrack.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );

    newsTrack.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0].screenX;

            const swipeDistance =
                touchStartX - touchEndX;

            if (Math.abs(swipeDistance) < 45) {
                return;
            }

            if (swipeDistance > 0) {

                currentNewsSlide++;

                if (
                    currentNewsSlide >=
                    newsItems.length
                ) {
                    currentNewsSlide = 0;
                }

            } else {

                currentNewsSlide--;

                if (currentNewsSlide < 0) {
                    currentNewsSlide =
                        newsItems.length - 1;
                }

            }

            updateNewsSlider(currentNewsSlide);

            restartNewsAutoSlider();

        },
        { passive: true }
    );


    /* Pause ketika pengguna touch/hover */

    newsTrack.addEventListener(
        "mouseenter",
        function () {
            clearInterval(newsAutoTimer);
        }
    );

    newsTrack.addEventListener(
        "mouseleave",
        function () {
            startNewsAutoSlider();
        }
    );

    newsTrack.addEventListener(
        "touchstart",
        function () {
            clearInterval(newsAutoTimer);
        },
        { passive: true }
    );

    newsTrack.addEventListener(
        "touchend",
        function () {
            restartNewsAutoSlider();
        },
        { passive: true }
    );


    /* Initial State */

    updateNewsSlider(0);

    startNewsAutoSlider();

});
