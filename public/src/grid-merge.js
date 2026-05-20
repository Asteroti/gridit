function el(id) { return document.getElementById(id); }

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
var PROCESSING_TIMEOUT_MS = 30000;
var ERROR_DISPLAY_MS = 5000;
var DOWNLOAD_RESET_MS = 500;
var ANCHOR_CLEANUP_MS = 200;
var WINDOW_BLOB_TTL_MS = 60000;
var CONFETTI_COUNT = 35;
var CONFETTI_TTL_MS = 2500;

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
  el('progress-message').textContent = message || getProgressMessage(pct);
  el('progress-bar').style.width = pct + '%';
  el('progress-container').style.display = 'block';
}

function updateProgress(message, percent) {
  if (percent !== undefined) {
    el('progress-bar').style.width = percent + '%';
    if (!message) {
      el('progress-message').textContent = getProgressMessage(percent);
    }
  }
  if (message) el('progress-message').textContent = message;
}

function hideProgress() {
  el('progress-container').style.display = 'none';
}

function showError(title, message) {
  el('error-title').textContent = title;
  el('error-message').textContent = message;
  el('error-container').style.display = 'flex';
  setTimeout(function() {
    el('error-container').style.display = 'none';
  }, ERROR_DISPLAY_MS);
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
    setTimeout(hideProgress, DOWNLOAD_RESET_MS);
    return true;
  } else {
    handleError("Port Error", "The receivePng port is not available. Please refresh the page and try again.");
    return false;
  }
}

function dataUrlToBlob(dataUrl) {
  return fetch(dataUrl).then(function(res) { return res.blob(); });
}

function computeEntropyGrid(imageUrl, gridSize, width, height, callback) {
  var img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    var cellW = width / gridSize;
    var cellH = height / gridSize;
    var entropyList = [];

    for (var row = 0; row < gridSize; row++) {
      for (var col = 0; col < gridSize; col++) {
        var x = Math.floor(col * cellW);
        var y = Math.floor(row * cellH);
        var w = Math.ceil(cellW);
        var h = Math.ceil(cellH);

        if (x + w > width) w = width - x;
        if (y + h > height) h = height - y;

        var imageData = ctx.getImageData(x, y, w, h);
        var pixels = imageData.data;
        var histogram = new Array(256).fill(0);
        var totalPixels = w * h;

        for (var p = 0; p < pixels.length; p += 4) {
          var luminance = Math.round(0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2]);
          histogram[luminance]++;
        }

        var entropy = 0;
        for (var b = 0; b < 256; b++) {
          if (histogram[b] > 0) {
            var prob = histogram[b] / totalPixels;
            entropy -= prob * Math.log2(prob);
          }
        }

        entropyList.push(entropy);
      }
    }

    callback(entropyList);
  };

  img.onerror = function() {
    callback([]);
  };

  img.src = imageUrl;
}

function compositeOverlay(ctx, w, h, callback) {
  var overlay = document.querySelector('.grid-overlay');
  if (!overlay) {
    callback();
    return;
  }
  var svgString = new XMLSerializer().serializeToString(overlay);
  var svgImage = new Image();
  svgImage.onload = function() {
    ctx.drawImage(svgImage, 0, 0, w, h);
    callback();
  };
  svgImage.onerror = function() { callback(); };
  svgImage.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
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


function downloadViaAnchor(blob, fileName) {
  var blobUrl = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }, ANCHOR_CLEANUP_MS);
}

function downloadViaWindow(blob) {
  var blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
  setTimeout(function() { URL.revokeObjectURL(blobUrl); }, WINDOW_BLOB_TTL_MS);
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
    var fileName = params.fileName || 'gridded-image.png';

    dataUrlToBlob(params.dataUrl).then(function(blob) {
      updateProgress(null, 90);

      // Try anchor download first, fall back to window.open for iOS Safari
      try {
        downloadViaAnchor(blob, fileName);
      } catch (e) {
        downloadViaWindow(blob);
      }

      setTimeout(hideProgress, DOWNLOAD_RESET_MS);
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
    }, PROCESSING_TIMEOUT_MS);

    var img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function() {
      updateProgress(null, 30);

      var canvas = document.createElement("canvas");
      var canvasWidth = img.naturalWidth || params.width;
      var canvasHeight = img.naturalHeight || params.height;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      var ctx = canvas.getContext("2d");

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      try {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        updateProgress(null, 50);
      } catch (e) {
        clearTimeout(processingTimeout);
        handleError("Canvas Error", "Failed to process the image. This might be due to CORS restrictions or an invalid image format.");
        return;
      }

      compositeOverlay(ctx, canvasWidth, canvasHeight, function() {
        updateProgress(null, 75);

        canvas.toBlob(function(blob) {
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
      });
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
    var canShare = false;
    try {
      if (typeof navigator.share === 'function' && typeof navigator.canShare === 'function') {
        var testFile = new File(['test'], 'test.png', { type: 'image/png' });
        canShare = navigator.canShare({ files: [testFile] });
      }
    } catch (e) {
      canShare = false;
    }
    app.ports.receiveShareSupport.send(canShare);
  }

  if (!app.ports.shareImageData) return;

  app.ports.shareImageData.subscribe(function(params) {
    var fileName = params.fileName || 'gridded-image.png';

    dataUrlToBlob(params.dataUrl).then(function(blob) {
      var file = new File([blob], fileName, { type: 'image/png' });
      var shareData = { files: [file] };

      if (navigator.canShare && navigator.canShare(shareData)) {
        return navigator.share(shareData);
      } else {
        // Fallback: trigger download instead
        downloadViaAnchor(blob, fileName);
      }
    }).catch(function(err) {
      if (err && err.name !== 'AbortError') {
        handleError("Share Error", "Could not share the image. Try downloading instead.");
      }
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

    var frogSvg =
      '<svg viewBox="0 0 20 20" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<circle cx="6" cy="6" r="3"/>' +
      '<circle cx="14" cy="6" r="3"/>' +
      '<circle cx="6" cy="6" r="1" fill="currentColor"/>' +
      '<circle cx="14" cy="6" r="1" fill="currentColor"/>' +
      '<path d="M4 12 Q10 18 16 12" stroke-linecap="round"/>' +
      '</svg>';

    for (var i = 0; i < CONFETTI_COUNT; i++) {
      var roll = Math.random();
      var confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      var color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      var delay = Math.random() * 0.5;
      var duration = Math.random() * 1 + 1.5;

      if (roll < 0.15) {
        // Frog: subtle, ~15% of pieces, rendered in primary green for "Gridit DNA".
        var fsize = Math.random() * 8 + 14;
        confetti.innerHTML = frogSvg;
        confetti.style.cssText =
          'left: ' + (Math.random() * 100) + '%;' +
          'width: ' + fsize + 'px;' +
          'height: ' + fsize + 'px;' +
          'color: hsl(152, 40%, 45%);' +
          'animation-delay: ' + delay + 's;' +
          'animation-duration: ' + duration + 's;';
      } else if (roll < 0.40) {
        var size = Math.random() * 10 + 10;
        confetti.textContent = '\u2665';
        confetti.style.cssText =
          'left: ' + (Math.random() * 100) + '%;' +
          'font-size: ' + size + 'px;' +
          'color: ' + color + ';' +
          'line-height: 1;' +
          'animation-delay: ' + delay + 's;' +
          'animation-duration: ' + duration + 's;';
      } else {
        var w = Math.random() * 10 + 6;
        var h = roll < 0.70 ? w : w * (0.5 + Math.random() * 0.4);
        confetti.style.cssText =
          'left: ' + (Math.random() * 100) + '%;' +
          'width: ' + w + 'px;' +
          'height: ' + h + 'px;' +
          'background: ' + color + ';' +
          'border-radius: 50%;' +
          'animation-delay: ' + delay + 's;' +
          'animation-duration: ' + duration + 's;';
      }
      container.appendChild(confetti);
    }

    setTimeout(function() { container.remove(); }, CONFETTI_TTL_MS);
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('.button-nice')) {
      createConfetti();
    }
  });
}


function setupEntropyPort(app) {
  if (!app.ports.requestEntropyAnalysis) return;

  app.ports.requestEntropyAnalysis.subscribe(function(params) {
    computeEntropyGrid(params.url, params.grid, params.width, params.height, function(entropyList) {
      if (app.ports.receiveEntropyData) {
        app.ports.receiveEntropyData.send(entropyList);
      }
    });
  });
}


function setupErrorPort(app) {
  if (!app.ports.showFileError) return;

  app.ports.showFileError.subscribe(function(params) {
    showError(params.title, params.message);
  });
}


function setupFilePickerPort(app) {
  if (!app.ports.pickImageFile) return;

  app.ports.pickImageFile.subscribe(function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', function(e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function() {
        app.ports.receivePickedImage.send({
          name: f.name,
          size: f.size,
          dataUrl: reader.result
        });
      };
      reader.readAsDataURL(f);
    });
    input.click();
  });
}


function getSessionToken() {
  try {
    var stored = localStorage.getItem('gridit-session');
    if (stored && /^[a-zA-Z0-9_-]{8,128}$/.test(stored)) return stored;
  } catch (e) {}
  var fresh = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'st-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  try { localStorage.setItem('gridit-session', fresh); } catch (e) {}
  return fresh;
}


function setupCommunityPort(app) {
  var sessionToken = getSessionToken();

  if (app.ports.reportEvent) {
    app.ports.reportEvent.subscribe(function(event) {
      fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken
        },
        body: JSON.stringify({ event: event }),
        keepalive: true
      })
        .then(function(r) {
          if (r.status === 429 && app.ports.receiveRateLimit) {
            app.ports.receiveRateLimit.send(null);
          }
        })
        .catch(function() {});
    });
  }

  if (app.ports.receiveCounters) {
    fetch('/api/counters')
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        if (data && typeof data.totalDownloaded === 'number') {
          app.ports.receiveCounters.send(data);
        }
      })
      .catch(function() {});
  }
}


function initializeElmApp() {
  var app = Elm.Main.init({
    node: document.getElementById('elm-app')
  });

  _elmApp = app;
  if (typeof window !== 'undefined') window._elmApp = app;

  setupLanguagePorts(app);
  setupDownloadPort(app);
  setupPngRequestPort(app);
  setupSharePort(app);
  setupSettingsPersistence(app);
  setupEntropyPort(app);
  setupErrorPort(app);
  setupFilePickerPort(app);
  setupCommunityPort(app);

  return app;
}

document.addEventListener('DOMContentLoaded', function() {
  var closeBtn = document.getElementById('close-error-button');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      el('error-container').style.display = 'none';
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
