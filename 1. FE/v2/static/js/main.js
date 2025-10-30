// Dark mode detection
if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    document.documentElement.classList.add("dark");
}
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        document.documentElement.classList.toggle("dark", e.matches);
    });



// State
const state = {
    location: "",
    month: null,
    day: null,
    chart: null,
    selectedActivities: new Set(),
};
let map, marker;

// Utility functions
const $ = (id) => document.getElementById(id);
const scrollTo = (selector) => {
    console.log("Attempting to scroll to:", selector);
    const element = document.querySelector(selector);
    console.log("Found element:", element);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        console.log("Scrolled to element");
    } else {
        console.log("Element not found");
    }
};
const randomRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Activity selection
const toggleActivity = (activityId) => {
    if (state.selectedActivities.has(activityId)) {
        state.selectedActivities.delete(activityId);
    } else {
        state.selectedActivities.add(activityId);
    }

    document.querySelectorAll(".activity-btn").forEach((btn) => {
        const id = btn.dataset.activity;
        btn.classList.toggle("active", state.selectedActivities.has(id));
    });

    checkFormComplete();
};

// Form validation
const checkFormComplete = () => {
    const hasActivities = state.selectedActivities.size > 0;
    const hasLocation = state.location.trim() !== "";
    const hasDateTime = state.month && state.day;

    $("analyzeBtn").disabled = !(
        hasActivities &&
        hasLocation &&
        hasDateTime
    );
};

// Map initialization
const initMap = () => {
    map = L.map("map").setView([21.0285, 105.8542], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
    );

    map.on("click", async (e) => {
        if (marker) map.removeLayer(marker);
        marker = L.marker(e.latlng).addTo(map);

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
            );
            const data = await res.json();
            state.location =
                data.display_name ||
                `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
        } catch {
            state.location = `${e.latlng.lat.toFixed(
                4
            )}, ${e.latlng.lng.toFixed(4)}`;
        }

        $("locationInput").value = state.location;
        checkFormComplete();
    });
};

// Chart functions
const createChart = (canvasId, data) => {
    const canvas = $(canvasId);
    if (!canvas) return null;

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: data.label || "Data",
                    data: data.values,
                    borderColor: "#5D5CDE",
                    backgroundColor: "rgba(93,92,222,0.1)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
        },
    });
};

const updateChart = () => {
    const data = Array.from({ length: 7 }, () => randomRange(15, 35));
    if (state.chart) state.chart.destroy();

    state.chart = createChart("weatherChart", {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: data,
        label: "Temperature °C",
    });

    $("temp").textContent = randomRange(15, 35) + "°C";
    $("humidity").textContent = randomRange(40, 80) + "%";
    $("wind").textContent = randomRange(5, 20) + " km/h";
    $("dust").textContent = randomRange(50, 150) + " AQI";
};

// Date selection
const selectMonth = (month, index) => {
    state.month = month;
    state.day = null;

    document
        .querySelectorAll("#monthGrid .date-btn")
        .forEach((b) =>
            b.classList.toggle("active", b.textContent === month)
        );

    const daySection = $("daySection");
    daySection.classList.remove("hidden");

    const dayGrid = $("dayGrid");
    dayGrid.innerHTML = "";
    for (let i = 1; i <= CONFIG.DAYS_IN_MONTH[index]; i++) {
        const btn = document.createElement("button");
        btn.className = "date-btn";
        btn.textContent = i;
        btn.onclick = () => selectDay(i);
        dayGrid.appendChild(btn);
    }
    checkFormComplete();
};

const selectDay = (day) => {
    state.day = day;
    document
        .querySelectorAll("#dayGrid .date-btn")
        .forEach((b) => b.classList.toggle("active", b.textContent == day));
    checkFormComplete();
};

// Results and tips
const showResults = () => {
    const results = $("results");
    results.classList.remove("hidden");

    const selectedActivityNames = Array.from(state.selectedActivities)
        .map((id) => CONFIG.ACTIVITIES.find((a) => a.id === id)?.name)
        .join(", ");

    $(
        "resultsTitle"
    ).innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Risk Assessment for ${selectedActivityNames} in ${state.location}`;

    // Generate relevant risks based on selected activities
    const relevantFactors = new Set();
    state.selectedActivities.forEach((activityId) => {
        const activity = CONFIG.ACTIVITIES.find((a) => a.id === activityId);
        activity?.affects.forEach((factor) => relevantFactors.add(factor));
    });

    const risks = Array.from(relevantFactors).map((factor) => {
        const config = CONFIG.RISK_FACTORS[factor];
        const prob = randomRange(15, 75);
        const level = prob > 60 ? "high" : prob > 35 ? "moderate" : "low";

        return {
            name: config.name,
            icon: config.icon,
            level,
            prob,
        };
    });

    $("riskCards").innerHTML = risks
        .map(
            (risk) => `
                <div class="card risk-card">
                    <span class="risk-level ${risk.level
                }">${risk.level.toUpperCase()}</span>
                    <h3><i class="fa-solid ${risk.icon}"></i> ${risk.name}</h3>
                    <p>Probability: ${risk.prob}%</p>
                    <div class="progress-bar">
                        <div class="progress-fill ${risk.prob > 50 ? "red" : "green"
                }" style="width:${risk.prob}%"></div>
                    </div>
                </div>
            `
        )
        .join("");

    // Generate tips
    const overallRisk =
        risks.reduce((sum, r) => sum + r.prob, 0) / risks.length;
    const riskLevel =
        overallRisk > 60 ? "high" : overallRisk > 35 ? "moderate" : "low";

    const tips = Array.from(state.selectedActivities).map((activityId) => {
        const activity = CONFIG.ACTIVITIES.find((a) => a.id === activityId);
        const tip =
            CONFIG.TIPS[activityId]?.[riskLevel] ||
            "Monitor weather conditions and use common sense.";

        return `
                    <div class="tip-card">
                        <h4><i class="fa-solid ${activity.icon}"></i> ${activity.name}</h4>
                        <p>${tip}</p>
                    </div>
                `;
    });

    $("tipsGrid").innerHTML = tips.join("");

    // Generate historical trends
    generateTrends();

    results.scrollIntoView({ behavior: "smooth" });
};

const updateChartPeriod = (period) => {
    document
        .querySelectorAll(".city-info .btn")
        .forEach((btn) => (btn.style.background = "#555"));
    event.target.style.background = "var(--primary)";
    updateChart();
};

// Generate historical trends
const generateTrends = () => {
    const trendsHTML = CONFIG.TRENDS.map(
        (trend, index) => `
                <div class="trend-card">
                    <div class="trend-title-row">
                        <h4>${trend.title}</h4>
                        <span class="trend-change ${trend.changeClass}">${trend.changeLabel}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: #888; margin: 0.5rem 0;">${trend.period}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 0.95rem; margin-bottom: 0.5rem;">
                        <p>Change:</p>
                        <span class="trend-change ${trend.changeClass}">${trend.percentage}</span>
                    </div>
                    <div style="margin: 1rem 0; height: 140px;">
                        <canvas id="trendChart${index}"></canvas>
                    </div>
                    <p style="font-size: 0.8rem; color: #999;">${trend.footer}</p>
                </div>
            `
    ).join("");

    $("trendsGrid").innerHTML = trendsHTML;

    // Create trend charts after DOM update
    setTimeout(() => {
        CONFIG.TRENDS.forEach((trend, index) => {
            const canvas = $(`trendChart${index}`);
            if (canvas) {
                new Chart(canvas, {
                    type: "line",
                    data: {
                        labels: ["2014", "2016", "2018", "2020", "2022", "2024"],
                        datasets: [
                            {
                                label: trend.title,
                                data: trend.data,
                                borderColor: trend.borderColor,
                                backgroundColor: trend.borderColor + "40",
                                tension: 0.4,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true },
                            x: { display: true },
                            y: { display: true },
                        },
                    },
                });
            }
        });
    }, 100);
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Generate conditions grid
    $("conditionsGrid").innerHTML = CONFIG.CONDITIONS.map(
        (c) => `
                <div class="card">
                    <div class="icon" style="color: ${c.color}"><i class="fa-solid ${c.icon}"></i></div>
                    <h3>${c.title}</h3>
                    <p>${c.desc}</p>
                </div>
            `
    ).join("");

    // Generate activities grid
    $("activitiesGrid").innerHTML = CONFIG.ACTIVITIES.map(
        (activity) => `
                <button class="activity-btn" data-activity="${activity.id}" onclick="toggleActivity('${activity.id}')">
                    <div><i class="fa-solid ${activity.icon}" style="font-size: 2em; margin-bottom: 10px;"></i></div>
                    <div>${activity.name}</div>
                </button>
            `
    ).join("");

    // Generate month buttons
    const monthGrid = $("monthGrid");
    CONFIG.MONTHS.forEach((month, index) => {
        const btn = document.createElement("button");
        btn.className = "date-btn";
        btn.textContent = month;
        btn.onclick = () => selectMonth(month, index);
        monthGrid.appendChild(btn);
    });

    // Initialize components
    initMap();
    updateChart();

    // Event listeners
    $("citySelect").addEventListener("change", updateChart);

    let geocodeTimeout;
    $("locationInput").addEventListener("input", (e) => {
        state.location = e.target.value;
        checkFormComplete();

        clearTimeout(geocodeTimeout);
        if (e.target.value.length > 2) {
            geocodeTimeout = setTimeout(async () => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            e.target.value
                        )}&limit=1`
                    );
                    const data = await res.json();
                    if (data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lng = parseFloat(data[0].lon);
                        map.setView([lat, lng], 10);
                        if (marker) map.removeLayer(marker);
                        marker = L.marker([lat, lng]).addTo(map);
                        state.location = data[0].display_name;
                    }
                } catch (error) {
                    console.log("Geocoding failed:", error);
                }
            }, 800);
        }
    });

    $("analyzeBtn").addEventListener("click", showResults);

    // Progress bar
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const height =
            document.documentElement.scrollHeight - window.innerHeight;
        $("progressBar").style.width = (scrolled / height) * 100 + "%";
    });
});