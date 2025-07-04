// Simple SPA dengan Iframe Loading untuk HTML Lengkap
class App {
    constructor() {
        this.currentPage = null;
        this.currentIframe = null;
        this.currentTimeout = null;
        this.timeoutDuration = 30000; // 30 detik default
        this.currentAudio = null;
        this.overlayAudio = null;
        this.isMainAudioFadedOut = false;
        // Jangan langsung init, tunggu user klik overlay
    }

    startApp() {
        // Musik utama: play sekali saat app mulai
        this.playMusic('assets/audio/wave to earth - love. (Official Lyric Video) - wave to earth.mp3');
        this.setupAudioAutoplay();
        this.init();
    }

    init() {
        this.setupRouting();
        this.setupEventListeners();
        this.loadInitialPage();
    }

    // Setup routing system
    setupRouting() {
        // Handle initial page load
        window.addEventListener('load', () => {
            this.handleRoute();
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            }
        });
    }

    // Setup global event listeners
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    this.showNavigationMenu();
                    break;
                case 'h':
                case 'H':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.goHome();
                    }
                    break;
            }
        });

        // Setup message listener untuk komunikasi dengan iframe
        window.addEventListener('message', (event) => {
            this.handleIframeMessage(event.data);
        });
    }

    // Handle routing
    handleRoute() {
        const hash = window.location.hash.substring(1);
        const page = hash || 'lilin'; // Default ke lilin
        this.loadPage(page);
    }

    // Navigate to specific page
    navigateTo(page) {
        // *** PERTAHANAN LAPIS 1: BLOKIR SEMUA NAVIGASI KELUAR DARI 'FLOWER' ***
        if (this.currentPage === 'flower') {
            console.log(`Navigasi ke '${page}' DIBLOKIR karena 'flower' adalah halaman terakhir.`);
            return;
        }
        window.location.hash = page;
    }

    // Load initial page
    loadInitialPage() {
        const currentFile = window.location.pathname.split('/').pop();
        
        if (currentFile === 'flower.html') {
            this.loadPage('flower');
        } else if (currentFile === 'index.html' || currentFile === '') {
            this.loadPage('lilin'); // Default ke lilin
        } else {
            this.handleRoute();
        }
    }

    // Clear existing timeout
    clearCurrentTimeout() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
            console.log('Timeout cleared');
        }
    }

    // Set timeout for page
    setPageTimeout(pageName) {
        this.clearCurrentTimeout();
        const timeoutConfig = {
            'cake': 0, 
            'card': 30000,
            'cat': 0,
            'surat': 15000,
            'index': 30000,
            'lilin': 0,
            'flower': 0, // Pastikan tidak ada timeout untuk 'flower'
            'bunga': 0
        };
        const timeout = timeoutConfig[pageName] || this.timeoutDuration;
        if (timeout > 0) {
            console.log(`Setting timeout for ${pageName}: ${timeout/1000} seconds`);
            this.currentTimeout = setTimeout(() => {
                if (this.currentPage === pageName) {
                    this.handlePageTimeout(pageName);
                } else {
                    console.log(`Timeout for page '${pageName}' ignored because current page is now '${this.currentPage}'.`);
                }
            }, timeout);
        } else {
            console.log(`No timeout set for ${pageName}`);
        }
        this.updateNavigationTimeout(pageName, timeout);
    }

    // Handle page timeout berdasarkan halaman
    handlePageTimeout(pageName) {
        // PERTAHANAN LAPIS 2: JANGAN LAKUKAN APAPUN JIKA SUDAH DI 'FLOWER'
        if (this.currentPage === 'flower') {
            console.log("handlePageTimeout ignored because current page is 'flower'.");
            return; 
        }

        console.log(`Timeout reached for ${pageName}`);
        
        switch(pageName) {
            case 'card':
                this.navigateTo('surat');
                break;
            case 'surat':
                this.navigateTo('cake');
                break;
            case 'cake':
                this.navigateTo('bunga');
                break;
            // *** PERBAIKAN UTAMA: MENGHAPUS 'DEFAULT' CASE YANG BERBAHAYA ***
            // Sebelumnya: default: this.navigateTo('lilin');
            // Sekarang, jika ada timeout lain yang terpanggil, tidak akan terjadi apa-apa.
        }
    }

    // Update navigation overlay dengan informasi timeout
    updateNavigationTimeout(pageName, timeout) {
        const overlay = document.getElementById('nav-overlay');
        if (overlay) {
            const timeoutInfo = overlay.querySelector('.timeout-info');
            if (timeoutInfo) {
                if (timeout === 0) {
                    timeoutInfo.textContent = 'Timeout: Tidak ada';
                } else {
                    timeoutInfo.textContent = `Timeout: ${timeout/1000} detik`;
                }
            }
        }
    }

    // Main page loader - menggunakan iframe untuk semua halaman
    loadPage(pageName) {
        // Blokir navigasi jika sudah di 'flower' (pemeriksaan tambahan)
        if (this.currentPage === 'flower' && pageName !== 'flower') {
            console.log(`loadPage call to '${pageName}' aborted. App is locked on 'flower'.`);
            return;
        }

        const viewsMap = {
            'lilin': 'views/lilin.html',
            'cat': 'views/cat.html',
            'cake': 'views/cake.html',
            'card': 'views/card.html',
            'surat': 'views/surat.html',
            'bunga': 'views/bunga.html',
            'flower': 'views/flower.html',
            'index': 'index.html'
        };

        const pageUrl = viewsMap[pageName];
        if (!pageUrl) {
            console.warn(`Page ${pageName} not found`);
            return;
        }

        this.clearCurrentTimeout();
        this.removeCurrentIframe();

        // Audio Logic
        if (this.currentAudio) {
            if (pageName === 'cake' || pageName === 'flower') {
                this.fadeOutAudio(this.currentAudio, null, 0, 2000);
                this.isMainAudioFadedOut = true;
            } else if (pageName === 'bunga') {
                this.fadeInAudio(this.currentAudio, 0.5, 2000);
                this.isMainAudioFadedOut = false;
            } else if (pageName === 'lilin' && this.isMainAudioFadedOut) {
                console.log('Returning to lilin, restoring main audio volume');
                this.fadeInAudio(this.currentAudio, 0.5, 2000);
                this.isMainAudioFadedOut = false;
            }
        }

        // Create new iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'page-iframe';
        iframe.src = pageUrl;
        iframe.style.cssText = `
            width: 100%; height: 100vh; border: none; position: fixed;
            top: 0; left: 0; z-index: 1000; background: white;
        `;

        document.body.appendChild(iframe);
        this.currentIframe = iframe;
        this.currentPage = pageName; // State halaman saat ini diperbarui di sini

        iframe.onload = () => {
            console.log(`Page ${pageName} loaded successfully`);
            this.onPageLoaded(iframe, pageName);
            this.setPageTimeout(pageName);
        };
        iframe.onerror = () => {
            console.error(`Failed to load page ${pageName}`);
            this.showError(`Failed to load ${pageName}`);
        };
    }

    // Remove current iframe
    removeCurrentIframe() {
        if (this.currentIframe) {
            this.currentIframe.remove();
            this.currentIframe = null;
        }
    }

    // Handle page loaded in iframe
    onPageLoaded(iframe, pageName) {
        try {
            this.setupIframeCommunication(iframe, pageName);
        } catch (error) {
            console.warn('Cannot access iframe content:', error);
        }
    }

    // Setup iframe communication
    setupIframeCommunication(iframe, pageName) {
        iframe.contentWindow.postMessage({
            type: 'pageInfo',
            pageName: pageName,
            parentApp: 'birthday-app'
        }, '*');
    }

    // Handle messages from iframe
    handleIframeMessage(data) {
        console.log('Message received from iframe:', data);
        
        if (this.currentPage === 'flower') return;
        
        switch (data.type) {
            case 'navigateTo':
                this.navigateTo(data.page);
                break;
            case 'cakePageLoaded':
                this.fadeOutMainAudio();
                break;
            case 'playHBD':
                this.playHBDAudio(data.audio, 3, 9);
                this.clearCurrentTimeout();
                this.currentTimeout = setTimeout(() => this.navigateTo('bunga'), 10000);
                this.updateNavigationTimeout('cake', 10000);
                break;
            case 'stopHBD':
                this.stopHBDAudio();
                break;
            case 'cakeFinished':
                this.clearCurrentTimeout();
                this.currentTimeout = setTimeout(() => this.navigateTo('bunga'), 10000);
                this.updateNavigationTimeout('cake', 10000);
                break;
            case 'bungaToFlower':
                this.navigateTo('flower');
                break;
            case 'playMusic':
                this.playMusic(data.musicFile || data.music || data.audio, data.start || 0, data.end || null);
                break;
            case 'stopMusic':
                this.stopMusic();
                break;
            case 'lilinClicked':
                this.clearCurrentTimeout();
                this.currentTimeout = setTimeout(() => this.navigateTo('cat'), 3000);
                this.updateNavigationTimeout('lilin-clicked', 3000);
                break;
            case 'catClicked':
                this.clearCurrentTimeout();
                this.currentTimeout = setTimeout(() => this.navigateTo('card'), 7000);
                this.updateNavigationTimeout('cat-clicked', 7000);
                break;
            case 'cardLoaded':
                this.navigateTo('surat');
                break;
            case 'resetTimeout':
                this.setPageTimeout(this.currentPage);
                break;
        }
    }

    // Go to home/default page
    goHome() {
        this.navigateTo('lilin');
    }
    
    // Sisa fungsi (audio, error handling, etc.) tidak diubah
    setupAudioAutoplay(){const t=()=>{this.currentAudio&&this.currentAudio.paused&&this.currentAudio.play().catch(()=>{})};document.addEventListener("click",t,{once:!0}),document.addEventListener("keydown",t,{once:!0})}fadeOutMainAudio(){this.currentAudio&&!this.isMainAudioFadedOut&&(console.log("Fading out main audio for cake page"),this.isMainAudioFadedOut=!0,this.fadeOutAudio(this.currentAudio,null,.05))}fadeInMainAudio(){this.currentAudio&&this.isMainAudioFadedOut&&(console.log("Fading in main audio"),this.isMainAudioFadedOut=!1,this.fadeInAudio(this.currentAudio,.5))}playHBDAudio(t,e=3,i=9){console.log(`Playing HBD audio: ${t} from ${e}s to ${i}s`),this.overlayAudio&&(this.overlayAudio.pause(),this.overlayAudio.remove(),this.overlayAudio=null);const o=document.createElement("audio");o.src=t,o.loop=!1,o.volume=0,o.controls=!1,o.style.display="none",document.body.appendChild(o),this.overlayAudio=o,o.currentTime=e;const n=()=>{o.currentTime>=i&&(o.currentTime=e,o.play())};o.addEventListener("timeupdate",n),o.play().then(()=>{console.log("HBD audio started successfully"),this.fadeInAudio(o,.7)}).catch(t=>{console.warn("Could not play HBD audio:",t)})}stopHBDAudio(){this.overlayAudio&&this.fadeOutAudio(this.overlayAudio,()=>{this.overlayAudio.pause(),this.overlayAudio.remove(),this.overlayAudio=null,console.log("HBD audio stopped")})}playMusic(t,e=166,i=297){if(this.currentAudio&&this.currentAudio.src.includes(t))return void this.fadeInAudio(this.currentAudio,.5);this.currentAudio?this.fadeOutAudio(this.currentAudio,()=>{this.currentAudio.pause(),this.currentAudio.remove(),this.currentAudio=null,this._playNewMusic(t,e,i)}):this._playNewMusic(t,e,i)}_playNewMusic(t,e=166,i=297){const o=document.createElement("audio");o.src=t,o.loop=!1,o.volume=0,o.controls=!1,o.style.display="none",document.body.appendChild(o),this.currentAudio=o,o.currentTime=e;const n=()=>{o.currentTime>=i&&(o.currentTime=e,o.play().catch(()=>{console.warn("Failed to restart audio loop")}))};o.addEventListener("timeupdate",n),o.addEventListener("ended",()=>{o.currentTime=e,o.play().catch(()=>{console.warn("Failed to restart audio on ended")})}),o.play().then(()=>{console.log("Main audio started successfully with loop"),this.fadeInAudio(o,.5)}).catch(t=>{console.warn("Could not play main audio:",t)})}fadeInAudio(t,e=.5,i=1e3){if(!t)return;let o=t.volume;const n=.02,s=Math.max(20,i/((e-o)/n)),a=setInterval(()=>{o<e?(o+=n,t.volume=Math.min(o,e)):(t.volume=e,clearInterval(a))},s)}fadeOutAudio(t,e,i=0,o=1e3){if(!t)return;let n=t.volume;const s=.02,a=Math.max(20,o/((n-i)/s)),d=setInterval(()=>{n>i?(n-=s,t.volume=Math.max(n,i)):(t.volume=i,clearInterval(d),e&&e())},a)}stopMusic(){this.currentAudio&&this.fadeOutAudio(this.currentAudio,()=>{this.currentAudio.pause(),this.currentAudio.remove(),this.currentAudio=null})}showError(t){const e=document.createElement("div");e.style.cssText="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ff4444; color: white; padding: 20px; border-radius: 10px; z-index: 10001; font-family: Arial, sans-serif;",e.innerHTML=`\n            <div style="margin-bottom: 10px; font-weight: bold;">Error</div>\n            <div>${t}</div>\n            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 15px; background: white; color: #ff4444; border: none; border-radius: 5px; cursor: pointer;">OK</button>\n        `,document.body.appendChild(e),setTimeout(()=>{e.parentElement&&e.remove()},5e3)}getCurrentPage(){return this.currentPage}isPageLoaded(){return null!==this.currentIframe}getRemainingTimeout(){return this.currentTimeout?"Active":"None"}
}

// Initialize the application
const app = new App();
window.App = app;
window.app = app;

// Landing page logic
window.addEventListener('DOMContentLoaded', () => {
    const landing = document.getElementById('landing');
    const btn = document.getElementById('start-btn');
    if (landing && btn) {
        btn.addEventListener('click', () => {
            const unlocker = document.createElement('audio');
            unlocker.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
            unlocker.volume = 0;
            unlocker.play().catch(() => {});
            landing.style.display = 'none';
            app.startApp();
        });
    } else {
        app.startApp();
    }
});

// Global navigation functions
window.navigateTo=(t)=>app.navigateTo(t);window.playMusic=(t)=>app.playMusic(t);window.stopMusic=()=>app.stopMusic();window.sendToParent=function(t){window.parent!==window&&window.parent.postMessage(t,"*")};window.notifyLilinClicked=function(){window.parent!==window&&window.parent.postMessage({type:"lilinClicked"},"*")};window.notifyCatClicked=function(){window.parent!==window&&window.parent.postMessage({type:"catClicked"},"*")};window.resetTimeout=function(){window.parent!==window&&window.parent.postMessage({type:"resetTimeout"},"*")};window.notifyCakeLoaded=function(){window.parent!==window&&window.parent.postMessage({type:"cakePageLoaded"},"*")};window.playCakeHBD=function(t,e=3,i=60){window.parent!==window&&window.parent.postMessage({type:"playHBD",audio:t,start:e,end:i},"*")};window.stopCakeHBD=function(){window.parent!==window&&window.parent.postMessage({type:"stopHBD"},"*")};window.notifyCakeFinished=function(){window.parent!==window&&window.parent.postMessage({type:"cakeFinished"},"*")};window.notifyBungaToFlower=function(){window.parent!==window&&window.parent.postMessage({type:"bungaToFlower"},"*")};

// Ready event
document.addEventListener('DOMContentLoaded', () => {
    console.log('Birthday App loaded successfully!');
    console.log('Romantic Sequence: surat → cake → bunga → flower (Final Page)');
    const appReadyEvent = new CustomEvent('appReady', { detail: { app } });
    document.dispatchEvent(appReadyEvent);
});

console.log('App.js loaded - Romantic Sequence System!');