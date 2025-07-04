$(document).ready(function() {
    $(function () {
        var flame = $("#flame");
        var txt = $("h1");

        flame.on({
            click: function () {
                flame.removeClass("burn").addClass("puff");
                $(".smoke").each(function () {
                    $(this).addClass("puff-bubble");
                });
                $("#glow").remove();
                txt.hide().html("i wish you happy birthday").delay(750).fadeIn(300);
                $("#candle").animate(
                    {
                        opacity: ".5"
                    },
                    100
                );
                
                // Kirim pesan ke parent app bahwa lilin telah diklik
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'lilinClicked' }, '*');
                }
            }
        });
        
        // Di akhir efek animasi
        window.flameDone && window.flameDone(); 
    });
});

// Event listener untuk navigasi otomatis (backup jika dibutuhkan)
document.getElementById('lilin') && document.getElementById('lilin').addEventListener('click', function() {
    setTimeout(function() {
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'navigateTo', page: 'cake' }, '*');
        } else {
            window.location.hash = 'cake';
        }
    }, 3000);
});