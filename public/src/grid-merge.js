var DOMCache = {
  _cache: {},
  get: function(id) {
    if (!this._cache[id]) {
      this._cache[id] = document.getElementById(id);
    }
    return this._cache[id];
  }
};

Object.defineProperty(DOMCache, 'progressContainer', {
  get: function() { return this.get('progress-container'); }
});
Object.defineProperty(DOMCache, 'progressMessage', {
  get: function() { return this.get('progress-message'); }
});
Object.defineProperty(DOMCache, 'progressBar', {
  get: function() { return this.get('progress-bar'); }
});
Object.defineProperty(DOMCache, 'errorContainer', {
  get: function() { return this.get('error-container'); }
});
Object.defineProperty(DOMCache, 'errorTitle', {
  get: function() { return this.get('error-title'); }
});
Object.defineProperty(DOMCache, 'errorMessage', {
  get: function() { return this.get('error-message'); }
});
Object.defineProperty(DOMCache, 'elmApp', {
  get: function() { return this.get('elm-app'); }
});

var PROGRESS_MESSAGES = [
  { threshold: 10, message: "Loading image..." },
  { threshold: 30, message: "Processing image..." },
  { threshold: 50, message: "Drawing grid overlay..." },
  { threshold: 75, message: "Rendering final image..." },
  { threshold: 90, message: "Finalizing..." },
  { threshold: 100, message: "Done!" }
];

// ~15MB image as base64
var MAX_BASE64_URL_LENGTH = 20000000;

function getProgressMessage(percent) {
  for (var i = PROGRESS_MESSAGES.length - 1; i >= 0; i--) {
    if (percent >= PROGRESS_MESSAGES[i].threshold) {
      return PROGRESS_MESSAGES[i].message;
    }
  }
  return "Loading image...";
}

function showProgress(message, percent) {
  var pct = percent || 0;
  DOMCache.progressMessage.textContent = message || getProgressMessage(pct);
  DOMCache.progressBar.style.width = pct + '%';
  DOMCache.progressContainer.style.display = 'block';
}

function updateProgress(message, percent) {
  if (percent !== undefined) {
    DOMCache.progressBar.style.width = percent + '%';
    if (!message) {
      DOMCache.progressMessage.textContent = getProgressMessage(percent);
    }
  }
  if (message) DOMCache.progressMessage.textContent = message;
}

function hideProgress() {
  DOMCache.progressContainer.style.display = 'none';
}

function showError(title, message) {
  DOMCache.errorTitle.textContent = title;
  DOMCache.errorMessage.textContent = message;
  DOMCache.errorContainer.style.display = 'flex';
  setTimeout(function() {
    DOMCache.errorContainer.style.display = 'none';
  }, 5000);
}

function handleError(title, message) {
  showError(title, message);
  hideProgress();
  resetElmProcessing();
}

var _elmApp = null;

function resetElmProcessing() {
  if (_elmApp && _elmApp.ports && _elmApp.ports.resetProcessing) {
    _elmApp.ports.resetProcessing.send(null);
  }
}

function sendToElm(app, dataUrl) {
  updateProgress("Done!", 100);

  if (app.ports.receivePng) {
    app.ports.receivePng.send(dataUrl);
    setTimeout(hideProgress, 500);
    return true;
  } else {
    handleError("Port Error", "The receivePng port is not available. Please refresh the page and try again.");
    return false;
  }
}

function dataUrlToBlob(dataUrl) {
  return fetch(dataUrl).then(function(res) { return res.blob(); });
}

function drawLines(ctx, lineGenerator, count) {
  for (var i = 0; i <= count; i++) {
    var coords = lineGenerator(i);
    ctx.beginPath();
    ctx.moveTo(coords.x1, coords.y1);
    ctx.lineTo(coords.x2, coords.y2);
    ctx.stroke();
  }
}

function drawGrid(ctx, params) {
  var width = params.width;
  var height = params.height;
  var gridSize = params.gridSize;
  var cellW = width / gridSize;
  var cellH = height / gridSize;

  ctx.strokeStyle = params.color;
  ctx.lineWidth = params.thickness;
  ctx.globalAlpha = params.opacity;

  drawLines(ctx, function(i) { return { x1: i * cellW, y1: 0, x2: i * cellW, y2: height }; }, gridSize);
  drawLines(ctx, function(i) { return { x1: 0, y1: i * cellH, x2: width, y2: i * cellH }; }, gridSize);

  if (params.showDiagonals) {
    ctx.save();
    drawLines(ctx, function(i) { return { x1: 0, y1: i * cellH, x2: i * cellW, y2: 0 }; }, gridSize * 2);
    drawLines(ctx, function(i) { return { x1: width, y1: i * cellH, x2: width - i * cellW, y2: 0 }; }, gridSize * 2);
    ctx.restore();
  }
}


function setupLanguagePorts(app) {
  if (app.ports.setHtmlLang) {
    app.ports.setHtmlLang.subscribe(function(langCode) {
      document.documentElement.lang = langCode;
    });
  }

  if (app.ports.setHtmlDir) {
    app.ports.setHtmlDir.subscribe(function(dir) {
      document.documentElement.dir = dir;
    });
  }

  if (app.ports.getBrowserLanguage) {
    var browserLang = navigator.language || navigator.userLanguage || 'en';
    app.ports.getBrowserLanguage.send(browserLang);
  }
}


function setupDownloadPort(app) {
  if (!app.ports.downloadImage) return;

  app.ports.downloadImage.subscribe(function(params) {
    showProgress(null, 50);

    if (!params.dataUrl.startsWith('data:image/png;base64,')) {
      handleError("Format Error", "Invalid data URL format. Expected PNG base64 data URL.");
      return;
    }

    updateProgress(null, 70);

    dataUrlToBlob(params.dataUrl).then(function(blob) {
      updateProgress(null, 90);
      var blobUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = blobUrl;
      a.download = params.fileName || 'gridded-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() {
        URL.revokeObjectURL(blobUrl);
        hideProgress();
      }, 100);
    }).catch(function() {
      handleError("Download Error", "Failed to create image data for download. Please try again or use a different image.");
    });
  });
}


function setupPngRequestPort(app) {
  if (!app.ports.requestPng) return;

  app.ports.requestPng.subscribe(function(params) {
    if (params.url.length > MAX_BASE64_URL_LENGTH) {
      handleError("File Too Large", "This image is too large to process. Please use an image under 15MB.");
      return;
    }

    showProgress(null, 10);

    var processingTimeout = setTimeout(function() {
      handleError("Timeout", "Image processing took too long. Please try a smaller image.");
    }, 30000);

    var img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function() {
      updateProgress(null, 30);

      var c = document.createElement("canvas");
      var canvasWidth = img.naturalWidth || params.width;
      var canvasHeight = img.naturalHeight || params.height;
      c.width = canvasWidth;
      c.height = canvasHeight;
      var ctx = c.getContext("2d");

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      try {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        updateProgress(null, 50);
      } catch (e) {
        handleError("Canvas Error", "Failed to process the image. This might be due to CORS restrictions or an invalid image format.");
        return;
      }

      drawGrid(ctx, {
        width: canvasWidth,
        height: canvasHeight,
        gridSize: params.grid,
        color: params.color,
        thickness: params.thickness,
        opacity: params.opacity,
        showDiagonals: params.showDiagonals
      });

      updateProgress(null, 75);

      c.toBlob(function(blob) {
        if (!blob) {
          clearTimeout(processingTimeout);
          handleError("Download Error", "Failed to create image data for download. Please try again or use a different image.");
          return;
        }

        updateProgress(null, 90);

        var reader = new FileReader();
        reader.onloadend = function() {
          clearTimeout(processingTimeout);
          sendToElm(app, reader.result);
        };
        reader.readAsDataURL(blob);
      }, 'image/png', 1.0);
    };

    img.onerror = function() {
      clearTimeout(processingTimeout);
      handleError("Image Load Error", "Failed to load the image. Please check that the image URL is valid and accessible.");
    };

    img.src = params.url;
  });
}


function setupSharePort(app) {
  if (app.ports.receiveShareSupport) {
    var canShare = typeof navigator.share === 'function';
    app.ports.receiveShareSupport.send(canShare);
  }

  if (!app.ports.shareImageData) return;

  app.ports.shareImageData.subscribe(function(params) {
    dataUrlToBlob(params.dataUrl).then(function(blob) {
      var file = new File([blob], params.fileName || 'gridded-image.png', { type: 'image/png' });
      return navigator.share({ files: [file] });
    }).catch(function() {
      // User cancelled or share failed
    });
  });
}


function setupSettingsPersistence(app) {
  var SETTINGS_KEY = 'gridit-settings';

  if (app.ports.saveSettings) {
    app.ports.saveSettings.subscribe(function(settings) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch (e) {
        console.warn('Settings could not be saved (private browsing?)');
      }
    });
  }

  try {
    var saved = localStorage.getItem(SETTINGS_KEY);
    if (saved && app.ports.loadSettings) {
      var settings = JSON.parse(saved);
      if (settings.gridSize && settings.gridColor && settings.gridThickness !== undefined && settings.gridOpacity !== undefined && settings.showDiagonals !== undefined) {
        app.ports.loadSettings.send(settings);
      }
    }
  } catch (e) {
    console.warn('Settings could not be loaded (private browsing?)');
  }
}


function setupConfetti() {
  var confettiColors = [
    'hsl(22, 68%, 58%)',
    'hsl(16, 62%, 50%)',
    'hsl(30, 75%, 65%)',
    'hsl(10, 58%, 62%)',
    'hsl(38, 80%, 72%)',
    'hsl(25, 50%, 75%)'
  ];

  function createConfetti() {
    var container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (var i = 0; i < 35; i++) {
      var roll = Math.random();
      var confetti = document.createElement('div');
      confetti.className = 'confetti-piece';

      if (roll < 0.25) {
        var size = Math.random() * 10 + 10;
        confetti.innerHTML = '\u2665';
        confetti.style.cssText =
          'left: ' + (Math.random() * 100) + '%;' +
          'font-size: ' + size + 'px;' +
          'color: ' + confettiColors[Math.floor(Math.random() * confettiColors.length)] + ';' +
          'line-height: 1;' +
          'animation-delay: ' + (Math.random() * 0.5) + 's;' +
          'animation-duration: ' + (Math.random() * 1 + 1.5) + 's;';
      } else {
        var w = Math.random() * 10 + 6;
        var h = roll < 0.65 ? w : w * (0.5 + Math.random() * 0.4);
        confetti.style.cssText =
          'left: ' + (Math.random() * 100) + '%;' +
          'width: ' + w + 'px;' +
          'height: ' + h + 'px;' +
          'background: ' + confettiColors[Math.floor(Math.random() * confettiColors.length)] + ';' +
          'border-radius: 50%;' +
          'animation-delay: ' + (Math.random() * 0.5) + 's;' +
          'animation-duration: ' + (Math.random() * 1 + 1.5) + 's;';
      }
      container.appendChild(confetti);
    }

    setTimeout(function() { container.remove(); }, 2500);
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('.button-nice')) {
      createConfetti();
    }
  });
}


function initializeElmApp() {
  var app = Elm.Main.init({
    node: document.getElementById('elm-app')
  });

  _elmApp = app;

  setupLanguagePorts(app);
  setupDownloadPort(app);
  setupPngRequestPort(app);
  setupSharePort(app);
  setupSettingsPersistence(app);

  return app;
}

document.addEventListener('DOMContentLoaded', function() {
  var closeBtn = document.getElementById('close-error-button');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      DOMCache.errorContainer.style.display = 'none';
    });
  }

  setupConfetti();

  var elmScriptUrl = "elm.js?v=" + new Date().getTime();
  var elmScript = document.createElement('script');
  elmScript.src = elmScriptUrl;
  document.head.appendChild(elmScript);

  elmScript.onload = function() {
    initializeElmApp();
  };
});
