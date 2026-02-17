// Navi Landing Page - Main JavaScript

const GITHUB_API_URL = 'https://api.github.com/repos/Arkane-o7/Navi/releases/latest';
const GITHUB_RELEASES_PAGE = 'https://github.com/Arkane-o7/Navi/releases/latest';

// Detect user's operating system
function detectOS() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('mac')) {
        return 'macos';
    } else if (userAgent.includes('win')) {
        return 'windows';
    } else if (userAgent.includes('linux')) {
        return 'linux';
    }

    return null;
}

// Highlight the detected OS button
function highlightPrimaryButton() {
    const detectedOS = detectOS();

    if (detectedOS) {
        const primaryBtn = document.querySelector(`.download-btn.${detectedOS}`);
        if (primaryBtn) {
            primaryBtn.classList.add('primary');
            const buttonsContainer = primaryBtn.parentElement;
            buttonsContainer.insertBefore(primaryBtn, buttonsContainer.firstChild);
        }
    }
}

// Fetch the latest release from GitHub and update download links
async function updateDownloadLinks() {
    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const release = await response.json();
        const assets = release.assets || [];

        // Match assets by file extension / naming pattern
        const macAsset = assets.find(a => a.name.endsWith('.dmg'));
        const winAsset = assets.find(a => a.name.endsWith('.exe'));
        const linuxAsset = assets.find(a => a.name.includes('linux') && a.name.endsWith('.zip'));

        const btnMac = document.getElementById('btn-macos');
        const btnWin = document.getElementById('btn-windows');
        const btnLinux = document.getElementById('btn-linux');

        if (macAsset && btnMac) btnMac.href = macAsset.browser_download_url;
        if (winAsset && btnWin) btnWin.href = winAsset.browser_download_url;
        if (linuxAsset && btnLinux) btnLinux.href = linuxAsset.browser_download_url;
    } catch (err) {
        console.warn('Could not fetch latest release, using fallback links:', err);
        // Fallback: redirect all buttons to the latest releases page
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.href = GITHUB_RELEASES_PAGE;
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    highlightPrimaryButton();
    updateDownloadLinks();

    // Click tracking
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.id.replace('btn-', '');
            console.log(`Download clicked: ${platform}`);
        });
    });
});
