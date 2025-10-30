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

// Config
const CONFIG = {
  MONTHS: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  CONDITIONS: [
    {
      icon: "fa-temperature-full",
      title: "Temperature",
      desc: "Extreme hot and cold conditions",
      color: "#ff6347",
    },
    {
      icon: "fa-droplet",
      title: "Precipitation",
      desc: "Rain, snow, and wet conditions",
      color: "#3498db",
    },
    {
      icon: "fa-wind",
      title: "Wind Speed",
      desc: "Dangerous wind conditions",
      color: "#2ecc71",
    },
    {
      icon: "fa-solid fa-eye-slash",
      title: "Visibility",
      desc: "Dust, fog and low visibility",
      color: "#95a5a6",
    },
  ],
  ACTIVITIES: [
    {
      id: "hiking",
      name: "Hiking",
      icon: "fa-person-hiking",
      affects: ["temperature", "precipitation", "wind", "visibility"],
    },
    {
      id: "cycling",
      name: "Cycling",
      icon: "fa-person-biking",
      affects: ["wind", "precipitation", "temperature"],
    },
    {
      id: "photography",
      name: "Photography",
      icon: "fa-camera",
      affects: ["visibility", "precipitation", "wind"],
    },
    {
      id: "camping",
      name: "Camping",
      icon: "fa-campground",
      affects: ["temperature", "precipitation", "wind"],
    },
    {
      id: "beach",
      name: "Beach Activities",
      icon: "fa-umbrella-beach",
      affects: ["temperature", "wind", "precipitation"],
    },
    {
      id: "running",
      name: "Running",
      icon: "fa-person-running",
      affects: ["temperature", "precipitation", "visibility"],
    },
    {
      id: "fishing",
      name: "Fishing",
      icon: "fa-fish",
      affects: ["wind", "precipitation", "temperature"],
    },
    {
      id: "gardening",
      name: "Gardening",
      icon: "fa-seedling",
      affects: ["temperature", "precipitation", "wind"],
    },
    {
      id: "sports",
      name: "Outdoor Sports",
      icon: "fa-futbol",
      affects: ["wind", "precipitation", "temperature", "visibility"],
    },
    {
      id: "picnic",
      name: "Picnicking",
      icon: "fa-utensils",
      affects: ["precipitation", "wind", "temperature"],
    },
    {
      id: "climbing",
      name: "Rock Climbing",
      icon: "fa-mountain",
      affects: ["wind", "precipitation", "temperature", "visibility"],
    },
    {
      id: "kayaking",
      name: "Water Sports",
      icon: "fa-water",
      affects: ["wind", "precipitation", "temperature"],
    },
  ],
  RISK_FACTORS: {
    temperature: { name: "Heat Risk", icon: "fa-temperature-full" },
    precipitation: { name: "Rain Risk", icon: "fa-cloud-showers-heavy" },
    wind: { name: "Wind Risk", icon: "fa-wind" },
    visibility: { name: "Visibility Risk", icon: "fa-eye-low-vision" },
  },
  TRENDS: [
    {
      title: "Extreme Heat",
      changeClass: "increasing",
      changeLabel: "Increasing",
      period: "7 days",
      percentage: "+15%",
      footer: "Number of days above 95°F has increased over the past decade",
      data: [20, 22, 25, 27, 30, 33, 29],
      borderColor: "#d60000",
    },
    {
      title: "Heavy Precipitation",
      changeClass: "stable",
      changeLabel: "Stable",
      period: "7 days",
      percentage: "±3%",
      footer: "Rainfall patterns remain relatively consistent",
      data: [12, 11, 13, 12, 12, 11, 13],
      borderColor: "#666666",
    },
    {
      title: "Wind Speed",
      changeClass: "decreasing",
      changeLabel: "Decreasing",
      period: "7 days",
      percentage: "-8%",
      footer: "Fewer high wind events recorded in recent years",
      data: [18, 17, 15, 14, 13, 12, 15],
      borderColor: "#0077cc",
    },
    {
      title: "Poor Visibility",
      changeClass: "stable",
      changeLabel: "Stable",
      period: "7 days",
      percentage: "±2%",
      footer: "Fog and dust events remain consistent",
      data: [10, 11, 10, 10, 11, 10, 11],
      borderColor: "#999999",
    },
    {
      title: "Extreme Cold",
      changeClass: "increasing",
      changeLabel: "Increasing",
      period: "7 days",
      percentage: "+10%",
      footer: "More days below 32°F recorded in recent winters",
      data: [5, 6, 7, 8, 9, 10, 8],
      borderColor: "#0055aa",
    },
  ],
  TIPS: {
    hiking: {
      high: "Consider postponing or choose indoor alternatives. If you must go, bring extra safety gear.",
      moderate:
        "Monitor conditions closely. Bring appropriate gear and inform others of your plans.",
      low: "Good conditions for hiking! Remember basic safety equipment.",
    },
    cycling: {
      high: "Avoid cycling in these conditions. Consider indoor training or public transport.",
      moderate:
        "Ride with caution. Use proper safety gear and choose protected routes.",
      low: "Great cycling weather! Enjoy your ride with standard safety precautions.",
    },
    photography: {
      high: "Protect your equipment from harsh conditions. Consider indoor or covered locations.",
      moderate:
        "Use weather protection for gear. Golden hour might be affected by conditions.",
      low: "Excellent conditions for outdoor photography! Take advantage of clear skies.",
    },
    camping: {
      high: "Camping not recommended. Consider cabin rentals or postpone the trip.",
      moderate:
        "Prepare for challenging conditions. Ensure your gear is weather-appropriate.",
      low: "Perfect camping weather! Enjoy the great outdoors.",
    },
    beach: {
      high: "Beach activities not safe. Stay indoors or find alternative entertainment.",
      moderate:
        "Limited beach time recommended. Stay near lifeguards and shelter.",
      low: "Ideal beach day! Remember sun protection and stay hydrated.",
    },
    running: {
      high: "Run indoors or skip today. Air quality and conditions pose health risks.",
      moderate:
        "Short runs okay with proper precautions. Monitor your body's response.",
      low: "Perfect running conditions! Enjoy your workout outdoors.",
    },
    fishing: {
      high: "Fishing not recommended due to dangerous conditions.",
      moderate:
        "Fish from shore or protected areas only. Monitor weather closely.",
      low: "Great fishing weather! Fish are likely to be active.",
    },
    gardening: {
      high: "Wait for better conditions to protect plants and your safety.",
      moderate: "Quick garden tasks only. Protect sensitive plants.",
      low: "Perfect for all gardening activities! Plants will thrive.",
    },
    sports: {
      high: "Cancel outdoor sports. Risk of injury too high.",
      moderate: "Modified activities only. Stay alert to changing conditions.",
      low: "Excellent conditions for all outdoor sports!",
    },
    picnic: {
      high: "Plan indoor alternatives. Outdoor picnics unsafe.",
      moderate: "Covered areas only. Have backup indoor plans.",
      low: "Perfect picnic weather! Enjoy dining outdoors.",
    },
    climbing: {
      high: "Extremely dangerous. Cancel climbing plans immediately.",
      moderate:
        "Easy routes only with experienced partners. Extra safety measures required.",
      low: "Good climbing conditions! Enjoy the rock safely.",
    },
    kayaking: {
      high: "Water activities extremely dangerous. Stay on land.",
      moderate: "Calm waters only. Stay close to shore with safety gear.",
      low: "Excellent water conditions! Enjoy paddling safely.",
    },
  },
};

// State & Helpers
const state = {
  location: "",
  month: null,
  day: null,
  chart: null,
  selectedActivities: new Set(),
  currentPeriod: "week", // default
};
let map = null;
let marker = null;

const $ = (id) => document.getElementById(id);
const randomRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateSeries = (len, min = 10, max = 35) =>
  Array.from({ length: len }, () => randomRange(min, max));

// Chart Helpers
function createChart(canvasId, data, color = "#5D5CDE") {
  const canvas = $(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext("2d");
  // destroy any Chart attached to this canvas by Chart.js registry
  try {
    if (window.Chart && Chart.getChart && Chart.getChart(canvas)) {
      Chart.getChart(canvas).destroy();
    }
  } catch (e) {
    // ignore
  }
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: data.label || "Data",
          data: data.values,
          borderColor: color,
          backgroundColor: color + "30",
          tension: 0.3,
          fill: true,
          pointRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: true },
        y: { beginAtZero: true },
      },
    },
  });
}

function updateInfoBoxes(values) {
  // put some meaningful numbers: latest or average
  const last = values[values.length - 1];
  const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
  $("temp").textContent = `${last}°C`;
  $("humidity").textContent = `${randomRange(40, 80)}%`;
  $("wind").textContent = `${randomRange(5, 20)} km/h`;
  $("dust").textContent = `${randomRange(30, 140)} AQI`;
}

/* updateChartForPeriod: builds labels/values based on period and renders chart */
function updateChartForPeriod(period) {
  state.currentPeriod = period;
  let labels = [],
    values = [];

  if (period === "week") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    values = generateSeries(7, 15, 35);
  } else if (period === "3month") {
    // show 12 weeks
    labels = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
    values = generateSeries(12, 10, 35);
  } else if (period === "12month") {
    labels = CONFIG.MONTHS.slice();
    values = generateSeries(12, 5, 35);
  } else {
    // fallback to week
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    values = generateSeries(7, 15, 35);
  }

  // Destroy previous chart stored in state.chart (if any)
  if (state.chart && typeof state.chart.destroy === "function") {
    try {
      state.chart.destroy();
    } catch (e) {
      /* ignore */
    }
  }

  state.chart = createChart("weatherChart", {
    labels,
    values,
    label: "Temperature °C",
  });
  updateInfoBoxes(values);
}

/* updateChartPeriod - toggles button styles and calls updateChartForPeriod
   btn parameter is optional; if not provided we try to resolve the button automatically.
*/
function updateChartPeriod(period, btn = null) {
  // get the set of period buttons (only the ones inside .city-info)
  const cityInfo = document.querySelector(".city-info");
  const periodButtons = cityInfo
    ? Array.from(cityInfo.querySelectorAll("button"))
    : [];

  // Try to find a matching button if none passed
  let selectedBtn = btn;
  if (!selectedBtn) {
    selectedBtn = periodButtons.find(
      (b) => b.dataset && b.dataset.period === period
    );
  }
  // fallback by text content (if dataset wasn't set)
  if (!selectedBtn) {
    selectedBtn = periodButtons.find((b) => {
      const t = b.textContent.trim().toLowerCase();
      if (period === "week" && t.includes("7")) return true;
      if (
        period === "3month" &&
        (t.includes("3") || t.includes("3 month") || t.includes("3months"))
      )
        return true;
      if (
        period === "12month" &&
        (t.includes("12") || t.includes("12 month") || t.includes("12months"))
      )
        return true;
      return false;
    });
  }

  // Reset styles on all (only for those buttons)
  periodButtons.forEach((b) => {
    b.style.background = "#555";
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });

  if (selectedBtn) {
    selectedBtn.style.background = "var(--primary)";
    selectedBtn.classList.add("active");
    selectedBtn.setAttribute("aria-pressed", "true");
  }

  // Render chart for the chosen period
  updateChartForPeriod(period);
}

// expose globally so inline onclick="updateChartPeriod('week')" still works
window.updateChartPeriod = updateChartPeriod;

// Map
function initMap() {
  try {
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
        state.location = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(
          4
        )}`;
      }
      const locInput = $("locationInput");
      if (locInput) locInput.value = state.location;
      checkFormComplete();
    });
  } catch (err) {
    console.warn("Leaflet init failed (maybe library not loaded yet):", err);
  }
}

// Activity selection & form check
function toggleActivity(activityId) {
  if (state.selectedActivities.has(activityId))
    state.selectedActivities.delete(activityId);
  else state.selectedActivities.add(activityId);

  document.querySelectorAll(".activity-btn").forEach((btn) => {
    const id = btn.dataset.activity;
    btn.classList.toggle("active", state.selectedActivities.has(id));
  });
  checkFormComplete();
}
window.toggleActivity = toggleActivity; // allow inline handlers

function checkFormComplete() {
  const hasActivities = state.selectedActivities.size > 0;
  const hasLocation = state.location && state.location.trim() !== "";
  const hasDateTime = !!(state.month && state.day);
  const analyzeBtn = $("analyzeBtn");
  if (analyzeBtn)
    analyzeBtn.disabled = !(hasActivities && hasLocation && hasDateTime);
}

// Month/day selection
function selectMonth(month, index) {
  state.month = month;
  state.day = null;
  document
    .querySelectorAll("#monthGrid .date-btn")
    .forEach((b) => b.classList.toggle("active", b.textContent === month));
  const daySection = $("daySection");
  if (daySection) daySection.classList.remove("hidden");
  const dayGrid = $("dayGrid");
  if (dayGrid) {
    dayGrid.innerHTML = "";
    const days = CONFIG.DAYS_IN_MONTH[index] || 31;
    for (let i = 1; i <= days; i++) {
      const btn = document.createElement("button");
      btn.className = "date-btn";
      btn.textContent = i;
      btn.type = "button";
      btn.onclick = () => selectDay(i);
      dayGrid.appendChild(btn);
    }
  }
  checkFormComplete();
}
window.selectMonth = selectMonth;

function selectDay(day) {
  state.day = day;
  document
    .querySelectorAll("#dayGrid .date-btn")
    .forEach((b) => b.classList.toggle("active", b.textContent == day));
  checkFormComplete();
}
window.selectDay = selectDay;

// Results & Trends
function showResults() {
  const results = $("results");
  if (results) results.classList.remove("hidden");

  const selectedActivityNames = Array.from(state.selectedActivities)
    .map((id) => CONFIG.ACTIVITIES.find((a) => a.id === id)?.name)
    .filter(Boolean)
    .join(", ");
  const title = $("resultsTitle");
  if (title)
    title.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Risk Assessment for ${selectedActivityNames} in ${state.location}`;

  const relevantFactors = new Set();
  state.selectedActivities.forEach((id) => {
    const a = CONFIG.ACTIVITIES.find((x) => x.id === id);
    a?.affects.forEach((f) => relevantFactors.add(f));
  });

  const risks = Array.from(relevantFactors).map((f) => {
    const cfg = CONFIG.RISK_FACTORS[f];
    const prob = randomRange(15, 75);
    const level = prob > 60 ? "high" : prob > 35 ? "moderate" : "low";
    return { name: cfg.name, icon: cfg.icon, level, prob };
  });

  const riskCards = $("riskCards");
  if (riskCards) {
    riskCards.innerHTML = risks
      .map(
        (r) => `
      <div class="card risk-card">
        <span class="risk-level ${r.level}">${r.level.toUpperCase()}</span>
        <h3><i class="fa-solid ${r.icon}"></i> ${r.name}</h3>
        <p>Probability: ${r.prob}%</p>
        <div class="progress-bar"><div class="progress-fill ${
          r.prob > 50 ? "red" : "green"
        }" style="width:${r.prob}%"></div></div>
      </div>
    `
      )
      .join("");
  }

  const overallRisk = risks.length
    ? risks.reduce((s, r) => s + r.prob, 0) / risks.length
    : 0;
  const riskLevel =
    overallRisk > 60 ? "high" : overallRisk > 35 ? "moderate" : "low";
  const tipsGrid = $("tipsGrid");
  if (tipsGrid) {
    tipsGrid.innerHTML = Array.from(state.selectedActivities)
      .map((id) => {
        const act = CONFIG.ACTIVITIES.find((a) => a.id === id);
        const tip =
          CONFIG.TIPS[id]?.[riskLevel] ||
          "Monitor weather conditions and use common sense.";
        return `<div class="tip-card"><h4><i class="fa-solid ${act.icon}"></i> ${act.name}</h4><p>${tip}</p></div>`;
      })
      .join("");
  }

  generateTrends();
  results?.scrollIntoView({ behavior: "smooth" });
}
window.showResults = showResults;

// Trends Generation
function generateTrends() {
  const trendsGrid = $("trendsGrid");
  if (!trendsGrid) return;
  trendsGrid.innerHTML = CONFIG.TRENDS.map(
    (t, i) => `
    <div class="trend-card">
      <div class="trend-title-row"><h4>${t.title}</h4><span class="trend-change ${t.changeClass}">${t.changeLabel}</span></div>
      <p style="font-size:0.85rem;color:#888;margin:0.5rem 0;">${t.period}</p>
      <div style="display:flex;justify-content:space-between;font-size:0.95rem;margin-bottom:0.5rem;"><p>Change:</p><span class="trend-change ${t.changeClass}">${t.percentage}</span></div>
      <div style="margin:1rem 0;height:140px;"><canvas id="trendChart${i}"></canvas></div>
      <p style="font-size:0.8rem;color:#999;">${t.footer}</p>
    </div>
  `
  ).join("");

  // create charts shortly after DOM update
  setTimeout(() => {
    CONFIG.TRENDS.forEach((t, i) => {
      const c = document.getElementById(`trendChart${i}`);
      if (c) {
        createChart(
          `trendChart${i}`,
          {
            labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
            values: t.data,
            label: t.title,
          },
          t.borderColor
        );
      }
    });
  }, 80);
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Conditions grid
  const conditionsGrid = $("conditionsGrid");
  if (conditionsGrid) {
    conditionsGrid.innerHTML = CONFIG.CONDITIONS.map(
      (c) => `
      <div class="card"><div class="icon" style="color:${c.color}"><i class="fa-solid ${c.icon}"></i></div><h3>${c.title}</h3><p>${c.desc}</p></div>
    `
    ).join("");
  }

  // Activities grid
  const activitiesGrid = $("activitiesGrid");
  if (activitiesGrid) {
    activitiesGrid.innerHTML = CONFIG.ACTIVITIES.map(
      (a) => `
      <button class="activity-btn" data-activity="${a.id}" type="button" onclick="toggleActivity('${a.id}')">
        <div><i class="fa-solid ${a.icon}" style="font-size:2em;margin-bottom:10px;"></i></div><div>${a.name}</div>
      </button>
    `
    ).join("");
  }

  // Month buttons
  const monthGrid = $("monthGrid");
  if (monthGrid) {
    CONFIG.MONTHS.forEach((m, i) => {
      const btn = document.createElement("button");
      btn.className = "date-btn";
      btn.type = "button";
      btn.textContent = m;
      btn.onclick = () => selectMonth(m, i);
      monthGrid.appendChild(btn);
    });
  }

  // Initialize map and charts
  initMap();

  // Setup period buttons inside .city-info: detect those 3 and add dataset + event listeners
  const cityInfo = document.querySelector(".city-info");
  if (cityInfo) {
    // find the small container which contains the three period buttons (the one with inline style in your HTML)
    const possibleContainers = Array.from(cityInfo.querySelectorAll("div"));
    let periodContainer = possibleContainers.find((d) => {
      // heuristics: contains 3 buttons and limited children
      return (
        d.querySelectorAll &&
        d.querySelectorAll("button").length >= 1 &&
        d.querySelectorAll("button").length <= 4 &&
        d.textContent.toLowerCase().includes("7")
      );
    });
    if (!periodContainer) {
      // fallback: just take first div that has buttons
      periodContainer = possibleContainers.find(
        (d) => d.querySelectorAll && d.querySelectorAll("button").length > 0
      );
    }
    if (periodContainer) {
      const btns = Array.from(periodContainer.querySelectorAll("button"));
      btns.forEach((btn) => {
        const txt = btn.textContent.trim().toLowerCase();
        let period = "week";
        if (txt.includes("7")) period = "week";
        else if (txt.includes("3")) period = "3month";
        else if (txt.includes("12")) period = "12month";
        btn.dataset.period = period;
        btn.type = "button";
        btn.addEventListener("click", (ev) => {
          updateChartPeriod(period, btn);
        });
      });
    }
  }

  // initial chart render (default to week)
  updateChartPeriod(state.currentPeriod);

  // city select change -> re-render current period (keeps selection)
  const citySelect = $("citySelect");
  if (citySelect)
    citySelect.addEventListener("change", () =>
      updateChartForPeriod(state.currentPeriod)
    );

  // location autocompletion handler (debounced)
  let geocodeTimeout = null;
  const locInput = $("locationInput");
  if (locInput) {
    locInput.addEventListener("input", (e) => {
      state.location = e.target.value;
      checkFormComplete();
      if (geocodeTimeout) clearTimeout(geocodeTimeout);
      if (e.target.value && e.target.value.length > 2) {
        geocodeTimeout = setTimeout(async () => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                e.target.value
              )}&limit=1`
            );
            const data = await res.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat),
                lon = parseFloat(data[0].lon);
              if (map) {
                map.setView([lat, lon], 10);
                if (marker) map.removeLayer(marker);
                marker = L.marker([lat, lon]).addTo(map);
              }
              state.location = data[0].display_name;
              locInput.value = state.location;
              checkFormComplete();
            }
          } catch (err) {
            console.log("Geocode error", err);
          }
        }, 700);
      }
    });
  }

  // analyze button
  const analyzeBtn = $("analyzeBtn");
  if (analyzeBtn) analyzeBtn.addEventListener("click", showResults);

  // progress bar on scroll
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const w = height > 0 ? (scrolled / height) * 100 : 0;
    const pb = $("progressBar");
    if (pb) pb.style.width = `${w}%`;
  });
}); // DOMContentLoaded end
