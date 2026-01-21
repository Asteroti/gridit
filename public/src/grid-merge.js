// DOM Element Cache - cache frequently accessed elements
const DOMCache = {
  _cache: {},
  get(id) {
    if (!this._cache[id]) {
      this._cache[id] = document.getElementById(id);
    }
    return this._cache[id];
  },
  // Commonly used elements as properties
  get progressContainer() { return this.get('progress-container'); },
  get progressMessage() { return this.get('progress-message'); },
  get progressBar() { return this.get('progress-bar'); },
  get errorContainer() { return this.get('error-container'); },
  get errorTitle() { return this.get('error-title'); },
  get errorMessage() { return this.get('error-message'); },
  get elmApp() { return this.get('elm-app'); }
};

// Progress indicator functions
function showProgress(message, percent) {
  DOMCache.progressMessage.textContent = message || 'Processing image...';
  DOMCache.progressBar.style.width = (percent || 0) + '%';
  DOMCache.progressContainer.style.display = 'block';
}

function updateProgress(message, percent) {
  if (message) DOMCache.progressMessage.textContent = message;
  if (percent !== undefined) DOMCache.progressBar.style.width = percent + '%';
}

function hideProgress() {
  DOMCache.progressContainer.style.display = 'none';
}

// Error handling function
function showError(title, message) {
  console.error(title + ": " + message);

  DOMCache.errorTitle.textContent = title;
  DOMCache.errorMessage.textContent = message;
  DOMCache.errorContainer.style.display = 'flex';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    DOMCache.errorContainer.style.display = 'none';
  }, 5000);
}

// Unified error handler - shows error and hides progress
function handleError(title, message) {
  showError(title, message);
  hideProgress();
}

// Send-to-Elm helper function
/**
 * Sends image data URL to Elm application via receivePng port
 * @param {Object} app - Elm application instance
 * @param {string} dataUrl - The image data URL to send
 * @returns {boolean} - Whether the send was successful
 */
function sendToElm(app, dataUrl) {
  updateProgress("Sending to Elm...", 100);

  if (app.ports.receivePng) {
    app.ports.receivePng.send(dataUrl);
    // Hide progress after a short delay to ensure the user sees 100%
    setTimeout(hideProgress, 500);
    return true;
  } else {
    handleError("Port Error", "The receivePng port is not available. Please refresh the page and try again.");
    return false;
  }
}

// Grid drawing helper functions
/**
 * Draws a series of lines on a canvas context using a generator function
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Function} lineGenerator - Function(i) returning {x1, y1, x2, y2}
 * @param {number} count - Number of lines to draw
 */
function drawLines(ctx, lineGenerator, count) {
  for (let i = 0; i <= count; i++) {
    const { x1, y1, x2, y2 } = lineGenerator(i);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

/**
 * Draws a complete grid with optional diagonals on a canvas context
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} params - Grid parameters
 */
function drawGrid(ctx, { width, height, gridSize, color, thickness, opacity, showDiagonals }) {
  const cellW = width / gridSize;
  const cellH = height / gridSize;

  // Set grid drawing properties
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.globalAlpha = opacity;

  // Draw vertical lines
  drawLines(ctx, i => ({ x1: i * cellW, y1: 0, x2: i * cellW, y2: height }), gridSize);

  // Draw horizontal lines
  drawLines(ctx, i => ({ x1: 0, y1: i * cellH, x2: width, y2: i * cellH }), gridSize);

  // Draw diagonals if requested
  if (showDiagonals) {
    ctx.save();

    // Diagonal lines (top-left to bottom-right direction)
    drawLines(ctx, i => ({ x1: 0, y1: i * cellH, x2: i * cellW, y2: 0 }), gridSize * 2);

    // Diagonal lines (top-right to bottom-left direction)
    drawLines(ctx, i => ({ x1: width, y1: i * cellH, x2: width - i * cellW, y2: 0 }), gridSize * 2);

    ctx.restore();
  }
}

// Enhanced functionality for better mobile experience
function enhanceMobileExperience() {
  // Add touch-friendly interactions to existing Elm UI
  const panels = document.querySelectorAll('.panel');
  panels.forEach(panel => {
    panel.style.minHeight = '44px'; // Ensure touch targets are large enough
  });
  
  // Improve form controls for mobile
  const inputs = document.querySelectorAll('input[type="range"]');
  inputs.forEach(input => {
    input.style.minHeight = '44px';
    input.addEventListener('touchstart', function() {
      this.style.transform = 'scale(1.1)';
    });
    input.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Improve button touch targets
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (button.offsetHeight < 44) {
      button.style.minHeight = '44px';
      button.style.padding = '12px 16px';
    }
  });
}

// Initialize the Elm application and set up port handlers
function initializeElmApp() {
  // Initialize the Elm application
  var app = Elm.Main.init({
    node: document.getElementById('elm-app')
  });
  
  if (app.ports.setHtmlLang) {
    app.ports.setHtmlLang.subscribe(function(langCode) {
      console.log("Changing language to: " + langCode);
      document.documentElement.lang = langCode;
    });
  }
  
  // Set up the debug port
  if (app.ports.debug) {
    app.ports.debug.subscribe(function(message) {
      console.log(message);
    });
  }
  
  // Add downloadImage port handler
  if (app.ports.downloadImage) {
    app.ports.downloadImage.subscribe(function(params) {
      const { dataUrl } = params;
      // Show progress indicator for download process
      showProgress("Preparing download...", 50);
      
      // Check if the data URL starts with the correct prefix
      if (!dataUrl.startsWith('data:image/png;base64,')) {
        handleError("Format Error", "Invalid data URL format. Expected PNG base64 data URL.");
        return;
      }
      
      // Create a temporary image to verify the data URL is valid
      const tempImg = new Image();
      
      // Update progress indicator
      updateProgress("Validating image data...", 70);
      
      tempImg.onload = function() {
        updateProgress("Processing image...", 80);
        
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        const ctx = canvas.getContext('2d');
        
        // Draw the image to canvas
        ctx.drawImage(tempImg, 0, 0);
        
        // Use toBlob instead of toDataURL for better handling
        canvas.toBlob(function(blob) {
          if (!blob) {
            handleError("Download Error", "Failed to create image data for download. Please try again or use a different image.");
            return;
          }
          
          // Create object URL from blob
          const blobUrl = URL.createObjectURL(blob);
          
          // Create download link
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'gridded-image.png';
          document.body.appendChild(a);
          
          // Trigger download
          a.click();
          
          // Clean up
          document.body.removeChild(a);
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            hideProgress();
          }, 100);
        }, 'image/png');
      };
      
      tempImg.onerror = function() {
        handleError("Image Error", "Failed to load the processed image. The image data may be corrupted.");
      };
      
      tempImg.src = dataUrl;
    });
  }
  
  // Handle the requestPng port for grid overlay
  if (app.ports.requestPng) {
    app.ports.requestPng.subscribe(function(params) {
      console.log("JS: Received requestPng with params:", params);
      
      const { url, width, height, grid, color, thickness, opacity, showDiagonals } = params;
      
      // Show progress indicator
      showProgress("Loading image...", 10);
      
      const img = new Image();
      img.crossOrigin = "anonymous"; // Enable CORS
      
      // Handle image load event
      img.onload = function() {
        // Update progress
        updateProgress("Creating canvas...", 30);
        
        // Create canvas with the image's natural dimensions
        const c = document.createElement("canvas");
        
        // Use natural dimensions if available, otherwise use provided dimensions
        const canvasWidth = img.naturalWidth || width;
        const canvasHeight = img.naturalHeight || height;
        
        c.width = canvasWidth;
        c.height = canvasHeight;
        
        const ctx = c.getContext("2d");
        
        // Clear canvas with white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw image to canvas
        try {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          updateProgress("Drawing grid...", 50);
        } catch (e) {
          handleError("Canvas Error", "Failed to process the image. This might be due to CORS restrictions or an invalid image format.");
          return;
        }
        
        // Draw grid using helper function
        drawGrid(ctx, {
          width: canvasWidth,
          height: canvasHeight,
          gridSize: grid,
          color: color,
          thickness: thickness,
          opacity: opacity,
          showDiagonals: showDiagonals
        });
        
        updateProgress("Preparing download...", 75);
        
        // Use toBlob for direct download
        c.toBlob(function(blob) {
          if (!blob) {
            handleError("Download Error", "Failed to create image data for download. Please try again or use a different image.");
            // Fallback to data URL
            generateDataUrl();
            return;
          }
          
          updateProgress("Generating data URL...", 90);
          
          // Send the data URL back to Elm for the download process
          const reader = new FileReader();
          reader.onloadend = function() {
            sendToElm(app, reader.result);
          };
          reader.readAsDataURL(blob);
          
        }, 'image/png', 1.0);
        
        // Fallback function to generate data URL if blob creation fails
        function generateDataUrl() {
          try {
            updateProgress("Generating fallback data URL...", 80);
            const dataUrl = c.toDataURL("image/png");
            sendToElm(app, dataUrl);
          } catch (e) {
            handleError("Processing Error", "Failed to create image data. The image might be too large or corrupted.");
          }
        }
      };
      
      // Handle image load errors
      img.onerror = function(err) {
        console.error("JS: Error loading image:", err);
        handleError("Image Load Error", "Failed to load the image. Please check that the image URL is valid and accessible.");
      };
      
      console.log("JS: Setting image source");
      img.src = url;
    });
  }
  
  // Enhance mobile experience after Elm app loads
  setTimeout(enhanceMobileExperience, 1000);
  
  return app;
}

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
  // Create cache-busting URL for elm.js
  var elmScriptUrl = "elm.js?v=" + new Date().getTime();
  var elmScript = document.createElement('script');
  elmScript.src = elmScriptUrl;
  document.head.appendChild(elmScript);
  
  // Initialize Elm only after the script has loaded
  elmScript.onload = function() {
    console.log("Elm.js loaded successfully with cache-busting");
    initializeElmApp();
  };
});