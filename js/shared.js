//GalNet RSS Feed
const feedUrl = 'https://proxy.gonegeeky.com/edproxy/';
const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(feedUrl);

let headlines = [];
let index = 0;
let intervalId;

fetch(proxyUrl)
  .then(res => res.text())
  .then(str => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(str, "text/xml");
    const items = xml.querySelectorAll("item");

    headlines = Array.from(items).map(item => {
      return {
        title: item.querySelector("title")?.textContent.trim(),
        link: item.querySelector("link")?.textContent.trim()
      };
    }).filter(h => h.title && h.link);

    if (headlines.length > 0) {
      showHeadline();
      startRotation();
    } else {
      document.getElementById('galnet-title').textContent = 'Failed to load GalNet headlines.';
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('galnet-title').textContent = 'Error fetching/parsing GalNet feed.';
  });

function showHeadline() {
  const el = document.getElementById('galnet-title');

  // Fade out
  el.classList.add('fade-out');

  setTimeout(() => {
    const item = headlines[index];
    el.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;

    // Fade in
    el.classList.remove('fade-out');
    el.classList.add('fade-in');

    setTimeout(() => {
      el.classList.remove('fade-in');
    }, 1000);

    index = (index + 1) % headlines.length;
  }, 1000);
}

function startRotation() {
  intervalId = setInterval(showHeadline, 8000);
}

function stopRotation() {
  clearInterval(intervalId);
}

// Pause RSS Feed on hover
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('galnet-title');
  el.addEventListener('mouseenter', stopRotation);
  el.addEventListener('mouseleave', startRotation);
});

// Lightbox (Gallery Images)
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".gallery img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-btn");
  const prevBtn = document.querySelector(".lightbox-arrow.left");
  const nextBtn = document.querySelector(".lightbox-arrow.right");

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + images.length) % images.length; // Wrap around
    lightboxImg.src = images[currentIndex].src;
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => {
      lightbox.classList.remove("hidden");
      showImage(index);
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
    } else if (e.key === "ArrowRight") {
      showImage(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }
  });

  // Clicking outside closes
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
    }
  });
});

// Dark Mode
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});

  const savedTheme = localStorage.getItem("theme")
  if(localStorage.getItem('theme') == 'dark')
     {document.body.classList.add('dark-mode');
}