// Progress indicator functions
function showProgress(message, percent) {
  const progressContainer = document.getElementById('progress-container');
  const progressMessage = document.getElementById('progress-message');
  const progressBar = document.getElementById('progress-bar');
  
  progressMessage.textContent = message || 'Processing image...';
  progressBar.style.width = (percent || 0) + '%';
  progressContainer.style.display = 'block';
}

function updateProgress(message, percent) {
  const progressMessage = document.getElementById('progress-message');
  const progressBar = document.getElementById('progress-bar');
  
  if (message) progressMessage.textContent = message;
  if (percent !== undefined) progressBar.style.width = percent + '%';
}

function hideProgress() {
  const progressContainer = document.getElementById('progress-container');
  progressContainer.style.display = 'none';
}

// Error handling function
function showError(title, message) {
  console.error(title + ": " + message);
  
  const errorContainer = document.getElementById('error-container');
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  
  errorTitle.textContent = title;
  errorMessage.textContent = message;
  errorContainer.style.display = 'flex';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

// Initialize the Elm application and set up port handlers
function initializeElmApp() {
  // Initialize the Elm application
  var app = Elm.Main.init({
    node: document.getElementById('elm-app')
  });
  
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
        showError("Format Error", "Invalid data URL format. Expected PNG base64 data URL.");
        hideProgress();
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
            showError("Download Error", "Failed to create image data for download. Please try again or use a different image.");
            hideProgress();
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
        showError("Image Error", "Failed to load the processed image. The image data may be corrupted.");
        hideProgress();
      };
      
      tempImg.src = dataUrl;
    });
  }
  
  // Handle the requestPng port for grid overlay
  if (app.ports.requestPng) {
    app.ports.requestPng.subscribe(function({ url, width, height, grid, color, thickness, opacity }) {
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
          showError("Canvas Error", "Failed to process the image. This might be due to CORS restrictions or an invalid image format.");
          hideProgress();
          return;
        }
        
        // Set grid drawing properties
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.globalAlpha = opacity;
        
        const cellW = canvasWidth / grid;
        const cellH = canvasHeight / grid;
        
        // Draw vertical grid lines
        for (let i = 0; i <= grid; i++) {
          ctx.beginPath();
          ctx.moveTo(i * cellW, 0);
          ctx.lineTo(i * cellW, canvasHeight);
          ctx.stroke();
        }
        
        // Draw horizontal grid lines
        for (let i = 0; i <= grid; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * cellH);
          ctx.lineTo(canvasWidth, i * cellH);
          ctx.stroke();
        }
        
        updateProgress("Preparing download...", 75);
        
        // Use toBlob for direct download
        c.toBlob(function(blob) {
          if (!blob) {
            showError("Download Error", "Failed to create image data for download. Please try again or use a different image.");
            hideProgress();
            // Fallback to data URL
            generateDataUrl();
            return;
          }
          
          updateProgress("Generating data URL...", 90);
          
          // Send the data URL back to Elm for the download process
          const reader = new FileReader();
          reader.onloadend = function() {
            const dataUrl = reader.result;
            updateProgress("Sending to Elm...", 100);
            
            if (app.ports.receivePng) {
              app.ports.receivePng.send(dataUrl);
              // Hide progress after a short delay to ensure the user sees 100%
              setTimeout(hideProgress, 500);
            } else {
              showError("Port Error", "The receivePng port is not available. Please refresh the page and try again.");
              hideProgress();
            }
          };
          reader.readAsDataURL(blob);
          
        }, 'image/png', 1.0);
        
        // Fallback function to generate data URL if blob creation fails
        function generateDataUrl() {
          try {
            updateProgress("Generating fallback data URL...", 80);
            const dataUrl = c.toDataURL("image/png");
            
            updateProgress("Sending to Elm...", 100);
            
            if (app.ports.receivePng) {
              app.ports.receivePng.send(dataUrl);
              // Hide progress after a short delay
              setTimeout(hideProgress, 500);
            } else {
              showError("Port Error", "The receivePng port is not available. Please refresh the page and try again.");
              hideProgress();
            }
          } catch (e) {
            showError("Processing Error", "Failed to create image data. The image might be too large or corrupted.");
            hideProgress();
          }
        }
      };
      
      // Handle image load errors
      img.onerror = function(err) {
        console.error("JS: Error loading image:", err);
        showError("Image Load Error", "Failed to load the image. Please check that the image URL is valid and accessible.");
        hideProgress();
      };
      
      console.log("JS: Setting image source");
      img.src = url;
    });
  }
  
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
