var username = window.location.host.split('.')[0];
var path = window.location.pathname;

// Initialize particles.js if it exists
function initParticles() {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 40,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.3,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.2,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 100,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  }
}

async function fetchTree() {
  // If running locally, fetch might fail due to CORS or structure differences
  // In a real environment, it uses the GitHub API
  var url = 'https://api.github.com/repos/' +
    `${username}/${username}.github.io/contents${path}`;

  try {
    return await fetch(url);
  } catch (e) {
    console.error("Fetch failed", e);
    return { status: 500 };
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const folderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
const fileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`;

function makeFileItem(isFolder, file) {
  var typeClass = isFolder ? 'folder-icon' : 'file-icon';
  var icon = isFolder ? folderSvg : fileSvg;
  var filePath = '/' + file.path;
  var sizeDisplay = isFolder ? '-' : formatBytes(file.size);

  return `
    <a href="${filePath}" class="file-item">
      <div class="item-icon ${typeClass}">${icon}</div>
      <div class="item-details">
        <span class="item-name">${file.name}</span>
        <span class="item-size">${sizeDisplay}</span>
      </div>
    </a>
  `;
}

function renderError() {
  return `
    <div class="error-container">
      <div class="error-code">404</div>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">The page or directory you are looking for doesn't exist or has been moved.</p>
      <a href="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Home
      </a>
      <div style="margin-top: 3rem; color: var(--text-secondary); font-size: 0.875rem;">
        ${username}
      </div>
    </div>
  `;
}

function renderFileList(indexText, files) {
  var folderList = '';
  var fileList = '';

  files.forEach(file => {
    var isFolder = (file.type === 'dir');
    var itemHtml = makeFileItem(isFolder, file);

    if (isFolder) {
      folderList += itemHtml;
    } else {
      fileList += itemHtml;
    }
  });

  return `
    <h1>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
      ${indexText}
    </h1>
    <div class="file-list">
      ${folderList}
      ${fileList}
    </div>
  `;
}

async function main() {
  initParticles();

  var appDiv = document.getElementById('app');
  if (!appDiv) {
    // Fallback if structure is missing
    appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.appendChild(appDiv);
  }

  var resp = await fetchTree();

  if (resp.status === 404 || resp.status === 500) {
    document.title = '404 Not Found';
    appDiv.innerHTML = renderError();
  } else if (resp.status === 200) {
    var indexText = `Index of ${path}`;
    document.title = indexText;
    var files = await resp.json();
    appDiv.innerHTML = renderFileList(indexText, files);
  }
}

// Add event listener to make sure DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
