const modelsData = [
    { name: "magic tower", file: "magic_tower.png", color: "#7928CA" },
    { name: "medieval building", file: "medieval_building.png", color: "#3B82F6" },
    { name: "scythe", file: "scythe.png", color: "#FF3B30" },
    { name: "cactus", file: "cactus.png", color: "#00E599" },
    { name: "tree", file: "tree.png", color: "#CCFF00" },
    { name: "motorcycle", file: "motorcycle.png", color: "#FF7A00" },
    { name: "gas station", file: "gas_station.png", color: "#00F0FF" },
    { name: "dragon", file: "dragon.png", color: "#FF007A" },
    { name: "donut", file: "donut.png", color: "#A855F7" },
    { name: "backpack", file: "backpack.png", color: "#FF7A00" }
];

const colors = [
    "#FF7A00", "#00F0FF", "#7928CA", "#00E599", "#FF007A",
    "#3B82F6", "#CCFF00", "#FF3B30", "#A855F7", "#64748B"
];

function createWireframeSVG(color) {
    return `
    <svg class="placeholder-icon" viewBox="0 0 48 48" fill="none" stroke="${color}">
        <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" />
        <path d="M24 4V44" />
        <path d="M42 14L24 24L6 14" />
        <path d="M42 34L24 24L6 34" />
    </svg>`;
}

function buildCard(item) {
    const card = document.createElement("div");
    card.className = "model-card";

    const badgeBg = `${item.color}18`;
    const badgeBorder = `${item.color}45`;

    card.innerHTML = `
        <div class="model-corner-tag" style="background: ${badgeBg}; border: 1px solid ${badgeBorder}; color: ${item.color};">
            <span class="corner-dot" style="background: ${item.color};"></span>
            <span>${item.name}</span>
        </div>
        <div class="model-image-wrap">
            <img class="model-img" src="assets/Models/${item.file}" alt="${item.name}" style="display: none;">
            <div class="model-placeholder">
                ${createWireframeSVG(item.color)}
                <span class="placeholder-label">${item.name}</span>
            </div>
        </div>
    `;

    const img = card.querySelector(".model-img");
    const placeholder = card.querySelector(".model-placeholder");

    img.onload = () => {
        img.style.display = "block";
        placeholder.style.display = "none";
    };

    img.onerror = () => {
        img.remove();
        placeholder.style.display = "flex";
    };

    return card;
}

function initMarquee() {
    const viewport = document.getElementById("marquee-viewport");
    if (!viewport) return;

    viewport.innerHTML = "";

    const columnsCount = window.innerWidth > 1440 ? 5 : 4;
    const directions = ["down", "up", "down", "up", "down"];

    for (let c = 0; c < columnsCount; c++) {
        const column = document.createElement("div");
        column.className = `marquee-column ${directions[c % directions.length]}`;

        const track = document.createElement("div");
        track.className = "marquee-track";

        const shuffled = [...modelsData].sort(() => 0.5 - Math.random());

        shuffled.forEach((m) => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            track.appendChild(buildCard({ ...m, color: randomColor }));
        });

        shuffled.forEach((m) => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            track.appendChild(buildCard({ ...m, color: randomColor }));
        });

        column.appendChild(track);
        viewport.appendChild(column);
    }
}

function setupTheme() {
    const themeBtn = document.querySelector(".theme-toggle-btn");
    const savedTheme = localStorage.getItem("stryx-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark = savedTheme ? savedTheme === "dark" : systemPrefersDark;

    applyTheme(isDark);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const currentIsDark = document.body.classList.contains("dark-mode");
            const nextTheme = !currentIsDark;
            applyTheme(nextTheme);
            localStorage.setItem("stryx-theme", nextTheme ? "dark" : "light");
        });
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("stryx-theme")) {
            applyTheme(e.matches);
        }
    });
}

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    const themeIcon = document.getElementById("theme-icon");
    if (themeIcon) {
        themeIcon.src = isDark ? "assets/lightmode.png" : "assets/darkmode.png";
        themeIcon.alt = isDark ? "Light Mode" : "Dark Mode";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    initMarquee();
});

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMarquee, 250);
});
