import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Centralized Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOpxVZ68e8H3_wA5E59mEvizaunIe3-1Q",
    authDomain: "trainlq.firebaseapp.com",
    projectId: "trainlq",
    storageBucket: "trainlq.firebasestorage.app",
    messagingSenderId: "1031179454445",
    appId: "1:1031179454445:web:a5013a5b19e70dea8709e4",
    measurementId: "G-EWFWYW20QL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Synchronize Authentication UI across the site.
 * This looks for an element with id="auth-container" in the navbar.
 */
function syncAuthUI() {
    const authContainer = document.getElementById('auth-container');
    const isDashboard = window.location.pathname.includes('dashboard.html');
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (isAuthPage) {
                window.location.replace("dashboard.html");
            }

            if (authContainer) {
                // Determine if we are on a light or dark themed page for contrasting styles
                const isLightPage = document.body.classList.contains('bg-[#ffffff]');
                const textColorClass = isLightPage ? 'text-black' : 'text-neutral-300';
                const hoverColorClass = isLightPage ? 'hover:text-neutral-600' : 'hover:text-white';
                
                authContainer.innerHTML = `
                    <div class="flex items-center gap-4">
                        <a href="dashboard.html" class="text-sm font-medium ${textColorClass} ${hoverColorClass} transition-colors hidden md:block">${user.email.split('@')[0]}</a>
                        <button id="logoutBtn" class="bg-white/10 ${isLightPage ? 'bg-black/5 text-black border-black/10' : 'text-white border-white/10'} hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors border backdrop-blur-md">Log out</button>
                    </div>
                `;

                document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
            }
        } else {
            // User is signed out
            if (isDashboard) {
                window.location.replace("login.html");
            }

            if (authContainer) {
                const isLightPage = document.body.classList.contains('bg-[#ffffff]');
                authContainer.innerHTML = `
                    <div class="flex items-center gap-4">
                        <a href="signup.html" class="text-sm font-medium ${isLightPage ? 'text-neutral-600' : 'text-neutral-300'} hover:${isLightPage ? 'text-black' : 'text-white'} transition-colors hidden md:block">Sign up</a>
                        <a href="login.html" class="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors">Log in</a>
                    </div>
                `;
            }
        }
    });
}

async function handleLogout() {
    try {
        await signOut(auth);
        window.location.replace("index.html");
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// Auto-run sync on load
if (!window.__authInitialized) {
    window.__authInitialized = true;
    document.addEventListener('DOMContentLoaded', syncAuthUI);
}

// Also run immediately if DOM is already loaded (for React injection)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (!window.__authSynced) {
        window.__authSynced = true;
        syncAuthUI();
    }
}

export { auth, db };
