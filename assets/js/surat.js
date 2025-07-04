

const musikUtama = document.getElementById("music/cristina perri - a thousand years [official music video] [dtovbotyx00].mp3");
const frame = document.getElementById("index.html");

function bukaHalaman(file) {
  musikUtama.pause();
  frame.src = file;
}
