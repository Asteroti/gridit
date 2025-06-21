// Add a new port for triggering downloads
app.ports.downloadImage = function(params) {
  console.log("JS: downloadImage port called with params:", params);
  const { dataUrl } = params;
  
  // Log the first 100 characters of the data URL to verify format
  console.log("JS: Data URL prefix:", dataUrl.substring(0, 100) + "...");
  console.log("JS: Data URL length:", dataUrl.length);
  
  // Check if the data URL starts with the correct prefix
  if (!dataUrl.startsWith('data:image/png;base64,')) {
    console.error("JS: Invalid data URL format. Expected PNG base64 data URL.");
    return;
  }
  
  // Try to open the data URL in a new tab for debugging
  console.log("JS: Opening data URL in new tab for debugging");
  const debugWindow = window.open();
  if (debugWindow) {
    debugWindow.document.write('<img src="' + dataUrl + '" alt="Debug Image"/>');
  }
  
  // Create a temporary image to verify the data URL is valid
  const tempImg = new Image();
  tempImg.onload = function() {
    console.log("JS: Data URL successfully loaded as image", { width: tempImg.width, height: tempImg.height });
    
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
        console.error("JS: Failed to create blob from canvas");
        return;
      }
      
      console.log("JS: Blob created successfully", { size: blob.size, type: blob.type });
      
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
        console.log("JS: Object URL revoked");
      }, 100);
      
      console.log("JS: Download triggered using Blob URL");
    }, 'image/png');
  };
  
  tempImg.onerror = function() {
    console.error("JS: Failed to load data URL as image");
  };
  
  tempImg.src = dataUrl;
};

app.ports.requestPng.subscribe(({ url, width, height, grid, color, thickness, opacity }) => {
    console.log("JS: requestPng received with params:", { width, height, grid, color, thickness, opacity, url: url.substring(0, 30) + "..." });
    
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS
    
    // Handle image load event
    img.onload = () => {
      console.log("JS: Image loaded successfully", { 
        naturalWidth: img.naturalWidth, 
        naturalHeight: img.naturalHeight,
        requestedWidth: width,
        requestedHeight: height
      });
      
      // Create canvas with the image's natural dimensions
      const c = document.createElement("canvas");
      
      // Use natural dimensions if available, otherwise use provided dimensions
      const canvasWidth = img.naturalWidth || width;
      const canvasHeight = img.naturalHeight || height;
      
      c.width = canvasWidth;
      c.height = canvasHeight;
      console.log("JS: Canvas created with dimensions", { width: c.width, height: c.height });
      
      const ctx = c.getContext("2d");
      
      // Clear canvas with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw image to canvas
      try {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        console.log("JS: Image drawn to canvas");
      } catch (e) {
        console.error("JS: Error drawing image to canvas:", e);
        return;
      }
      
      // Set grid drawing properties
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.globalAlpha = opacity;
      
      const cellW = canvasWidth / grid;
      const cellH = canvasHeight / grid;
      console.log("JS: Drawing grid with", { cellW, cellH, color, thickness, opacity });
      
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
      
      console.log("JS: Grid drawn successfully");
      
      // Use toBlob for direct download
      c.toBlob(function(blob) {
        if (!blob) {
          console.error("JS: Failed to create blob directly");
          // Fallback to data URL
          generateDataUrl();
          return;
        }
        
        console.log("JS: Blob created successfully in main process", { size: blob.size, type: blob.type });
        
        // Send the data URL back to Elm for the download process
        const reader = new FileReader();
        reader.onloadend = function() {
          const dataUrl = reader.result;
          console.log("JS: Data URL created from blob, length:", dataUrl.length);
          console.log("JS: Sending data URL to Elm via receivePng port");
          app.ports.receivePng.send(dataUrl);
        };
        reader.readAsDataURL(blob);
        
      }, 'image/png', 1.0);
      
      // Fallback function to generate data URL if blob creation fails
      function generateDataUrl() {
        try {
          const dataUrl = c.toDataURL("image/png");
          console.log("JS: Data URL created as fallback, length:", dataUrl.length);
          console.log("JS: Sending data URL to Elm via receivePng port");
          app.ports.receivePng.send(dataUrl);
        } catch (e) {
          console.error("JS: Error creating data URL:", e);
        }
      }
    };
    
    // Handle image load errors
    img.onerror = (err) => {
      console.error("JS: Error loading image:", err);
    };
    
    console.log("JS: Setting image source");
    img.src = url;
  });