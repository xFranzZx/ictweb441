// GalNet RSS Feed Handling
// Define the original feed URL and run it though a CORS proxy
const feedUrl = 'https://proxy.gonegeeky.com/edproxy/';
const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(feedUrl);

// Initialise an empty array for headlines, index tracker and interval ID
let headlines = [];
let index = 0;
let intervalId;

// Fetch the RSS feed content via the proxy
fetch(proxyUrl)
  .then(res => res.text())
  .then(str => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(str, "text/xml");

    // Extract all <item> elements from the feed
    const items = xml.querySelectorAll("item");

    // Map over each <item> and extract the <title> and <link> values
    headlines = Array.from(items).map(item => {
      return {
        title: item.querySelector("title")?.textContent.trim(),
        link: item.querySelector("link")?.textContent.trim()
      };
    }).filter(h => h.title && h.link);

    // If at least one headline is present, begin rotating through them
    if (headlines.length > 0) {
      showHeadline();
      startRotation();
    } else {
      // Display error message if feed is empty or invalid
      document.getElementById('galnet-title').textContent = 'Failed to load GalNet headlines.';
    }
  })
  .catch(err => {
    // Display error on fetch or parse failure
    console.error(err);
    document.getElementById('galnet-title').textContent = 'Error fetching/parsing GalNet feed.';
  });

// Display a single headline from the array in the DOM
function showHeadline() {
  const el = document.getElementById('galnet-title');

  // Delay slightly, 1000=1second
  setTimeout(() => {
    const item = headlines[index];
    el.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;

    // Increment and wrap the index
    index = (index + 1) % headlines.length;
  }, 1000);
}

// Start automatic headline rotation every 8 seconds [default]
function startRotation() {
  intervalId = setInterval(showHeadline, 8000);
}

// Stop the rotation of RSS feed titles (utilised when mose hovering)
function stopRotation() {
  clearInterval(intervalId);
}

// Added mouse event listeners to pause/resume RSS rotation on mouse hover
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('galnet-title');
  el.addEventListener('mouseenter', stopRotation);
  el.addEventListener('mouseleave', startRotation);
});

// Lightbox Gallery Functionality
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".gallery img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-btn");
  const prevBtn = document.querySelector(".lightbox-arrow.left");
  const nextBtn = document.querySelector(".lightbox-arrow.right");

  let currentIndex = 0;

  // Show the image at the given index, wrapping around if needed
  function showImage(index) {
    currentIndex = (index + images.length) % images.length; // Wrap around
    lightboxImg.src = images[currentIndex].src;
  }

  // Show lightbox and load the clicked image
  images.forEach((img, index) => {
    img.addEventListener("click", () => {
      lightbox.classList.remove("hidden");
      showImage(index);
    });
  });

  // Close lightbox on clicking close "X" button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
    });
  }

  // Navigate to the previous image with "<" button
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }

  // Navigate to the next image with ">" button
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  // Support for using ESC to close the lightbox and arrow keys to navigate the images
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

  // Clicking outside the image closes the lightbox
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
    }
  });
});

// Dark Mode Toggle
// Apply dark mode on load if saved in localStorage
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  document.body.classList.toggle("dark-mode", savedTheme === "dark");
}

// Setup dark mode button toggle and save preference
function setupDarkModeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
}

// Ensure theme is applied and toggle is bound after DOm is ready
document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  setupDarkModeToggle();
});