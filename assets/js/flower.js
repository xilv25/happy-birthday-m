// main.js dari repo xilv25/cakee
// Salin seluruh isi file main.js dari repo patokan ke sini.
// Jika Anda punya isi file main.js dari repo patokan, tempelkan di bawah ini.

// Placeholder: Silakan ganti dengan isi asli main.js dari repo patokan!

// Trigger play audio flower di parent SPA saat halaman flower ter-load
window.parent && window.parent.postMessage({
  type: 'playMusic',
  musicFile: '/assets/audio/Jacob and the Stone (Slowed)  Minari (Original Motion Picture Soundtrack) - SonySoundtracksVEVO.mp3'
}, '*');

onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");

    const titles = ('I LOVE U').split('');
    const titleElement = document.getElementById('title');
    let index = 0;

    function appendTitle() {
      if (index < titles.length) {
        titleElement.innerHTML += titles[index];
        index++;
        setTimeout(appendTitle, 300); // 300ms delay
      }
    }

    appendTitle();
    clearTimeout(c);
  }, 1000);
};

// Timeout blur yang tidak mengganggu timeout utama app.js
setTimeout(() => {
  document.getElementById('blur-layer').style.backdropFilter = 'blur(5px)';

  const ending = document.getElementById('ending-text');
  ending.style.display = 'block';

  void ending.offsetWidth;
  ending.style.animation = 'credit-roll 250s linear forwards';

  setTimeout(() => {
    document.getElementById('blur-layer').style.backdropFilter = 'blur(0px)';
  }, 110000); 

}, 10000); 