const audio = document.querySelector('audio');
  const body = document.body;

  audio.addEventListener('play', () => {
    body.classList.add('play-music');
  });

  audio.addEventListener('pause', () => {
    body.classList.remove('play-music');
  });
  document.getElementById('card')
    setTimeout(function() {
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'navigateTo', page: 'cake' }, '*');
        } else {
            window.location.hash = 'cake';
        }
    }, 15000);
;