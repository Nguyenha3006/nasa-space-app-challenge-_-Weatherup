// Configuration
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
        temperature: {
            name: "Heat Risk",
            icon: "fa-temperature-full",
        },
        precipitation: { name: "Rain Risk", icon: "fa-cloud-showers-heavy" },
        wind: { name: "Wind Risk", icon: "fa-wind" },
        visibility: { name: "Visibility Risk", icon: "fa-eye-low-vision" },
    },
    TRENDS: [
        {
            title: "Extreme Heat",
            changeClass: "increasing",
            changeLabel: "Increasing",
            period: "2014-2024",
            percentage: "+15%",
            footer:
                "Number of days above 95°F has increased over the past decade",
            data: [20, 22, 25, 27, 30, 33],
            borderColor: "#d60000",
        },
        {
            title: "Heavy Precipitation",
            changeClass: "stable",
            changeLabel: "Stable",
            period: "2014-2024",
            percentage: "±3%",
            footer: "Rainfall patterns remain relatively consistent",
            data: [12, 11, 13, 12, 12, 11],
            borderColor: "#666666",
        },
        {
            title: "Wind Speed",
            changeClass: "decreasing",
            changeLabel: "Decreasing",
            period: "2014-2024",
            percentage: "-8%",
            footer: "Fewer high wind events recorded in recent years",
            data: [18, 17, 15, 14, 13, 12],
            borderColor: "#0077cc",
        },
        {
            title: "Poor Visibility",
            changeClass: "stable",
            changeLabel: "Stable",
            period: "2014-2024",
            percentage: "±2%",
            footer: "Fog and dust events remain consistent",
            data: [10, 11, 10, 10, 11, 10],
            borderColor: "#999999",
        },
        {
            title: "Extreme Cold",
            changeClass: "increasing",
            changeLabel: "Increasing",
            period: "2014-2024",
            percentage: "+10%",
            footer: "More days below 32°F recorded in recent winters",
            data: [5, 6, 7, 8, 9, 10],
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
            moderate:
                "Modified activities only. Stay alert to changing conditions.",
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