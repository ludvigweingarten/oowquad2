document.addEventListener('DOMContentLoaded', () => {
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('loading-indicator');
    document.body.appendChild(loadingIndicator);
  
    // Show the body once the page has loaded
    document.body.classList.add('loaded');
  
    // Show the header after a short delay
    setTimeout(() => {
      document.querySelector('.main-header').classList.add('show');
    }, 500);
  
    const galleryContainer = document.querySelector('.gallery-container');
  
    // Fetch image data from JSON file
    fetch('data/image_data.json')
    .then(response => response.json())
    .then(data => {
        data.images.forEach(image => {
          // Create a row for each image
          const imageRow = document.createElement('div');
          imageRow.classList.add('image-row');
  
          // Create an image item for each theme
          for (const theme in image.captions) {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
  
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = `Image - ${theme}`;
            imageItem.appendChild(img);
  
            const captionLines = image.captions[theme].split('\n');
  
            captionLines.forEach((line, index) => {
              const caption = document.createElement('div');
              caption.classList.add('caption');
              if (index === 1) {
                caption.classList.add('caption-secondary');
              }
              caption.textContent = line;
              imageItem.appendChild(caption);
            });
  
            imageRow.appendChild(imageItem);
          }
          galleryContainer.appendChild(imageRow);
        });
  
        // Hide loading indicator after images are loaded
        loadingIndicator.style.display = 'none';
  
        // Show image rows after a delay
        setTimeout(() => {
          document.querySelectorAll('.image-row').forEach(row => row.classList.add('show'));
        }, 1600);
  
        let currentRow = 0;
        const imageRows = document.querySelectorAll('.image-row');
        let touchStartX = 0,
          touchStartY = 0;
        let touchEndX = 0,
          touchEndY = 0;
        let isScrolling = false;
  
        // Add touch event listeners for swiping
        imageRows.forEach(row => {
          row.addEventListener('touchstart', (event) => {
            touchStartX = event.touches.clientX;
            touchStartY = event.touches.clientY;
            isScrolling = false;
          }, {
            passive: true
          });
  
          row.addEventListener('touchmove', (event) => {
            touchEndX = event.touches.clientX;
            touchEndY = event.touches.clientY;
            isScrolling = Math.abs(touchEndY - touchStartY) > Math.abs(touchEndX - touchStartX);
          }, {
            passive: true
          });
  
          row.addEventListener('touchend', (event) => {
            if (isScrolling) return;
  
            let deltaX = touchEndX - touchStartX;
            let deltaY = touchEndY - touchStartY;
  
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
              // Swipe left/right inside a row
              const scrollAmount = row.clientWidth * 0.9;
  
              if (deltaX < 0) {
                row.scrollBy({
                  left: scrollAmount,
                  behavior: 'smooth'
                });
              } else {
                row.scrollBy({
                  left: -scrollAmount,
                  behavior: 'smooth'
                });
              }
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
              // Swipe up/down between rows
              if (deltaY > 0) {
                currentRow = Math.max(0, currentRow - 1);
              } else {
                currentRow = Math.min(imageRows.length - 1, currentRow + 1);
              }
              imageRows[currentRow].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          });
        });
      })
    .catch(error => console.error('Error loading JSON:', error));
  
    // Toggle the about section visibility
    const plusSign = document.querySelector('.plus-sign');
    const aboutSection = document.querySelector('.about-section');
  
    plusSign.addEventListener('click', () => {
      aboutSection.classList.toggle('show');
      plusSign.classList.toggle('rotate');
    });
  
    // SVG icon behavior
    const svgContainer = document.querySelector('.svg-container');
    let inactivityTimer;
  
    // Function to hide the SVG
    function hideSvg() {
      svgContainer.classList.add('hide');
      clearTimeout(inactivityTimer); // Reset the timer
    }
  
    // Function to show the SVG
    function showSvg() {
      svgContainer.classList.remove('hide');
    }
  
    // Event listeners for user activity including 'scroll'
    ['scroll', 'click', 'touchstart', 'touchmove', 'touchend'].forEach(event => {
      document.addEventListener(event, hideSvg);
    });
  
    // Show the SVG after 5 seconds of inactivity
    document.addEventListener('mousemove', () => {
      hideSvg(); // Hide immediately on mousemove
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(showSvg, 5000);
    });
  
    // Initially show the SVG
    showSvg();
  });