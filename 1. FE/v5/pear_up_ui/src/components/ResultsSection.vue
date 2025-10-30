<template>
  <section id="results" class="relative py-20 animate-fade-in-up">
    <div class="container mx-auto px-4">
      <!-- Risk Assessment Section -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white flex items-center justify-center gap-2 mb-4">
          <!-- <i class="fa-solid fa-triangle-exclamation text-blue-400 text-3xl"></i>  -->
          <!-- <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"> -->
            Risk Assessment for {{ selectedActivityNames }} in {{ location }}
          <!-- </span> -->
        </h2>
        <p class="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Comprehensive weather risk analysis for your selected activities
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <el-card 
          v-for="(risk, index) in riskFactors" 
          :key="risk.name"
          class="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-gray-600/50 rounded-2xl p-6 shadow-lg transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/60 overflow-hidden group"
          :style="{ animationDelay: index * 0.1 + 's' }"
          shadow="hover"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-4">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                risk.level === 'high' ? 'bg-red-900/50 text-red-300 border border-red-500/30' :
                risk.level === 'moderate' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
                'bg-green-900/50 text-green-300 border border-green-500/30'
              ]">
                {{ (risk.levelStr || risk.level).toString().toUpperCase() }}
              </span>
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-lg border-2 border-gray-500/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:border-blue-400/60 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <i :class="'fa-solid ' + risk.icon + ' text-xl text-blue-400 transition-all duration-300 group-hover:scale-110'"></i>
              </div>
            </div>
            
            <h3 class="text-lg font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">{{ risk.name }}</h3>
            
              <div class="space-y-4">
             
              <el-progress 
                :percentage="risk.prob" 
                :color="risk.prob > 50 ? '#ef4444' : risk.prob > 35 ? '#f59e0b' : '#10b981'"
                :stroke-width="8"
                class="w-full"
              />
              <div v-if="risk.param !== undefined && risk.param !== null" class="flex justify-between items-center">
                <p class="text-gray-300 text-sm">Value:</p>
                <span class="font-semibold text-gray-200">{{ risk.param }}<span v-if="risk.unit"> {{ risk.unit }}</span></span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- Historical Trends Section (from apiResults.mapWeatherAi['5 year']) -->
      <div class="mb-16">
        <div class="bg-gray-800/95 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white flex items-center justify-center gap-2 mb-4">
              <i class="fa-solid fa-chart-line text-blue-400 text-3xl"></i> 
              <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Weather Trends Overview
              </span>
            </h2>
            <p class="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Historical weather patterns and trend analysis for better planning
            </p>
          </div>
          <div class="bg-gray-700/30 rounded-2xl p-6 border border-white/10">
            <div class="h-96 w-full">
              <canvas ref="trendsChartCanvas" id="resultsWeatherTrendsChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border-2 border-gray-600/50 shadow-2xl">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white flex items-center justify-center gap-2 mb-4">
            <i class="fa-solid fa-lightbulb text-blue-400 text-3xl"></i> 
            <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Personalized Tips & Advice
            </span>
          </h2>
          <p class="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Expert recommendations tailored to your selected activities and weather conditions
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-card 
            v-for="(tip, index) in tipItems" 
            :key="tip.activity"
            class="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-2 border-gray-700/60 rounded-2xl p-6 shadow-lg transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 hover:border-gray-500/60 overflow-hidden group"
            :style="{ animationDelay: index * 0.1 + 's' }"
            shadow="hover"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-black/10 to-black/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-4">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-2 border-blue-400/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                  <i :class="'fa-solid ' + tip.icon + ' text-xl text-blue-400 transition-all duration-300 group-hover:scale-110'"></i>
                </div>
                <h4 class="text-lg font-semibold text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
                  {{ tip.displayName }}
                </h4>
              </div>
              
              <div class="space-y-2">
                
                <p class="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 font-medium">
                  {{ tip.note }}
                </p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  selectedActivities: {
    type: Set,
    default: () => new Set()
  },
  location: {
    type: String,
    default: ''
  },
  month: {
    type: String,
    default: null
  },
  day: {
    type: Number,
    default: null
  },
  apiResults: {
    type: [Array, Object, null],
    default: null
  }
})

const riskFactors = ref([])
const trendCharts = ref([])
const trendsChartCanvas = ref(null)
let trendsChart = null

const activityIconMap = {
  HIKING: 'fa-person-hiking',
  CYCLING: 'fa-person-biking',
  PHOTOGRAPHY: 'fa-camera',
  CAMPING: 'fa-campground',
  BEACH: 'fa-umbrella-beach',
  RUNNING: 'fa-person-running',
  FISHING: 'fa-fish',
  GARDENING: 'fa-seedling',
  SPORTS: 'fa-futbol',
  PICNIC: 'fa-utensils',
  CLIMBING: 'fa-mountain',
  KAYAKING: 'fa-water'
}

const tipItems = computed(() => {
  const list = props.apiResults && props.apiResults.lstPersonalizedTipsAdviceResDto
  if (!Array.isArray(list)) return []
  return list.map(item => {
    const displayName = item.activity?.toString().toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) || 'Activity'
    const icon = activityIconMap[item.activity] || 'fa-lightbulb'
    return {
      activity: item.activity,
      displayName,
      icon,
      note: item.note,
      score: item.score
    }
  })
})


const activities = [
  { id: 'hiking', name: 'Hiking', icon: 'fa-person-hiking', affects: ['temperature', 'precipitation', 'wind', 'visibility'] },
  { id: 'cycling', name: 'Cycling', icon: 'fa-person-biking', affects: ['wind', 'precipitation', 'temperature'] },
  { id: 'photography', name: 'Photography', icon: 'fa-camera', affects: ['visibility', 'precipitation', 'wind'] },
  { id: 'camping', name: 'Camping', icon: 'fa-campground', affects: ['temperature', 'precipitation', 'wind'] },
  { id: 'beach', name: 'Beach Activities', icon: 'fa-umbrella-beach', affects: ['temperature', 'wind', 'precipitation'] },
  { id: 'running', name: 'Running', icon: 'fa-person-running', affects: ['temperature', 'precipitation', 'visibility'] },
  { id: 'fishing', name: 'Fishing', icon: 'fa-fish', affects: ['wind', 'precipitation', 'temperature'] },
  { id: 'gardening', name: 'Gardening', icon: 'fa-seedling', affects: ['temperature', 'precipitation', 'wind'] },
  { id: 'sports', name: 'Outdoor Sports', icon: 'fa-futbol', affects: ['wind', 'precipitation', 'temperature', 'visibility'] },
  { id: 'picnic', name: 'Picnicking', icon: 'fa-utensils', affects: ['precipitation', 'wind', 'temperature'] },
  { id: 'climbing', name: 'Rock Climbing', icon: 'fa-mountain', affects: ['wind', 'precipitation', 'temperature', 'visibility'] },
  { id: 'kayaking', name: 'Water Sports', icon: 'fa-water', affects: ['wind', 'precipitation', 'temperature'] }
]

const riskFactorTypes = {
  temperature: { name: 'Heat Risk', icon: 'fa-temperature-full' },
  precipitation: { name: 'Rain Risk', icon: 'fa-cloud-showers-heavy' },
  wind: { name: 'Wind Risk', icon: 'fa-wind' },
  visibility: { name: 'Visibility Risk', icon: 'fa-eye-low-vision' }
}

const trends = [
  {
    title: 'Extreme Heat',
    changeClass: 'increasing',
    changeLabel: 'Increasing',
    period: '7 days',
    percentage: '+15%',
    footer: 'Number of days above 95°F has increased over the past decade',
    data: [20, 22, 25, 27, 30, 33, 29],
    borderColor: '#d60000'
  },
  {
    title: 'Heavy Precipitation',
    changeClass: 'stable',
    changeLabel: 'Stable',
    period: '7 days',
    percentage: '±3%',
    footer: 'Rainfall patterns remain relatively consistent',
    data: [12, 11, 13, 12, 12, 11, 13],
    borderColor: '#666666'
  },
  {
    title: 'Wind Speed',
    changeClass: 'decreasing',
    changeLabel: 'Decreasing',
    period: '7 days',
    percentage: '-8%',
    footer: 'Fewer high wind events recorded in recent years',
    data: [18, 17, 15, 14, 13, 12, 15],
    borderColor: '#0077cc'
  },
  {
    title: 'Poor Visibility',
    changeClass: 'stable',
    changeLabel: 'Stable',
    period: '7 days',
    percentage: '±2%',
    footer: 'Fog and dust events remain consistent',
    data: [10, 11, 10, 10, 11, 10, 11],
    borderColor: '#999999'
  },
  {
    title: 'Extreme Cold',
    changeClass: 'increasing',
    changeLabel: 'Increasing',
    period: '7 days',
    percentage: '+10%',
    footer: 'More days below 32°F recorded in recent winters',
    data: [5, 6, 7, 8, 9, 10, 8],
    borderColor: '#0055aa'
  }
]

const tips = {
  hiking: {
    high: 'Consider postponing or choose indoor alternatives. If you must go, bring extra safety gear.',
    moderate: 'Monitor conditions closely. Bring appropriate gear and inform others of your plans.',
    low: 'Good conditions for hiking! Remember basic safety equipment.'
  },
  cycling: {
    high: 'Avoid cycling in these conditions. Consider indoor training or public transport.',
    moderate: 'Ride with caution. Use proper safety gear and choose protected routes.',
    low: 'Great cycling weather! Enjoy your ride with standard safety precautions.'
  },
  photography: {
    high: 'Protect your equipment from harsh conditions. Consider indoor or covered locations.',
    moderate: 'Use weather protection for gear. Golden hour might be affected by conditions.',
    low: 'Excellent conditions for outdoor photography! Take advantage of clear skies.'
  },
  camping: {
    high: 'Camping not recommended. Consider cabin rentals or postpone the trip.',
    moderate: 'Prepare for challenging conditions. Ensure your gear is weather-appropriate.',
    low: 'Perfect camping weather! Enjoy the great outdoors.'
  },
  beach: {
    high: 'Beach activities not safe. Stay indoors or find alternative entertainment.',
    moderate: 'Limited beach time recommended. Stay near lifeguards and shelter.',
    low: 'Ideal beach day! Remember sun protection and stay hydrated.'
  },
  running: {
    high: 'Run indoors or skip today. Air quality and conditions pose health risks.',
    moderate: 'Short runs okay with proper precautions. Monitor your body\'s response.',
    low: 'Perfect running conditions! Enjoy your workout outdoors.'
  },
  fishing: {
    high: 'Fishing not recommended due to dangerous conditions.',
    moderate: 'Fish from shore or protected areas only. Monitor weather closely.',
    low: 'Great fishing weather! Fish are likely to be active.'
  },
  gardening: {
    high: 'Wait for better conditions to protect plants and your safety.',
    moderate: 'Quick garden tasks only. Protect sensitive plants.',
    low: 'Perfect for all gardening activities! Plants will thrive.'
  },
  sports: {
    high: 'Cancel outdoor sports. Risk of injury too high.',
    moderate: 'Modified activities only. Stay alert to changing conditions.',
    low: 'Excellent conditions for all outdoor sports!'
  },
  picnic: {
    high: 'Plan indoor alternatives. Outdoor picnics unsafe.',
    moderate: 'Covered areas only. Have backup indoor plans.',
    low: 'Perfect picnic weather! Enjoy dining outdoors.'
  },
  climbing: {
    high: 'Extremely dangerous. Cancel climbing plans immediately.',
    moderate: 'Easy routes only with experienced partners. Extra safety measures required.',
    low: 'Good climbing conditions! Enjoy the rock safely.'
  },
  kayaking: {
    high: 'Water activities extremely dangerous. Stay on land.',
    moderate: 'Calm waters only. Stay close to shore with safety gear.',
    low: 'Excellent water conditions! Enjoy paddling safely.'
  }
}

const selectedActivitiesArray = computed(() => {
  return Array.from(props.selectedActivities).map(id => 
    activities.find(a => a.id === id)
  ).filter(Boolean)
})

const selectedActivityNames = computed(() => {
  return selectedActivitiesArray.value.map(a => a.name).join(', ')
})

const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const calculateRiskFactors = () => {
  if (props.apiResults && props.apiResults.mapWeatherSelection) {
    try {
      const entries = Object.entries(props.apiResults.mapWeatherSelection)
      if (entries.length > 0) {
        riskFactors.value = entries.map(([label, info]) => {
          const name = label
          const levelRaw = (info?.level || '').toString().toUpperCase()
          const param = info?.param
          const levelToProb = { HIGH: 75, MID: 50, LOW: 25, 'N/A': 0 }
          const prob = levelToProb[levelRaw] ?? 0
          const key = label.toLowerCase()
          let icon = 'fa-triangle-exclamation'
          if (key.includes('temp')) icon = 'fa-temperature-full'
          else if (key.includes('humidity')) icon = 'fa-droplet'
          else if (key.includes('wind')) icon = 'fa-wind'
          else if (key.includes('rain') || key.includes('precip')) icon = 'fa-cloud-showers-heavy'
          const level = prob > 60 ? 'high' : prob > 35 ? 'moderate' : 'low'
          // Naive unit hinting based on label
          const unit = key.includes('temp') ? ' °C' : key.includes('humidity') ? ' %' : key.includes('wind') ? ' m/s' : ' mm/day'
          return { name, icon, level, levelStr: info?.level, prob, param, unit }
        })
        return
      }
    } catch (e) {
      console.warn('Failed to map mapWeatherSelection:', e)
    }
  }
  const relevantFactors = new Set()
  props.selectedActivities.forEach(id => {
    const activity = activities.find(a => a.id === id)
    activity?.affects.forEach(factor => relevantFactors.add(factor))
  })

  riskFactors.value = Array.from(relevantFactors).map(factor => {
    const config = riskFactorTypes[factor]
    const prob = randomRange(15, 75)
    const level = prob > 60 ? 'high' : prob > 35 ? 'moderate' : 'low'
    return { 
      name: config.name, 
      icon: config.icon, 
      level, 
      prob 
    }
  })
}

const getOverallRiskLevel = () => {
  if (riskFactors.value.length === 0) return 'low'
  const avgRisk = riskFactors.value.reduce((sum, r) => sum + r.prob, 0) / riskFactors.value.length
  return avgRisk > 60 ? 'high' : avgRisk > 35 ? 'moderate' : 'low'
}

const getTipForActivity = (activityId) => {
  const riskLevel = getOverallRiskLevel()
  return tips[activityId]?.[riskLevel] || 'Monitor weather conditions and use common sense.'
}

const createTrendChart = (canvas, trend) => {
  if (!canvas) return
  
  // Use global Chart.js from CDN
  new window.Chart(canvas, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: trend.title,
        data: trend.data,
        borderColor: trend.borderColor,
        backgroundColor: trend.borderColor + '30',
        tension: 0.3,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: true },
        y: { beginAtZero: true }
      }
    }
  })
}

// Colors for results trends chart
const resultsTrendsColors = {
  'Temperature': '#ef4444',
  'Relative Humidity': '#3b82f6',
  'Wind Speed': '#10b981',
  'Precipitation Corrected': '#8b5cf6'
}

const createResultsTrendsChart = (aiData) => {
  if (!aiData || !aiData.labels || !aiData.datasets) return
  if (trendsChart) {
    trendsChart.destroy()
    trendsChart = null
  }
  if (!trendsChartCanvas.value) return
  const labels = aiData.labels.map(l => {
    if (typeof l === 'string' && l.length === 8) {
      // YYYYMMDD -> DD/MM/YYYY
      return `${l.slice(6, 8)}/${l.slice(4, 6)}/${l.slice(0, 4)}`
    }
    return l
  })
  const datasets = aiData.datasets.map(ds => ({
    label: ds.label,
    data: (ds.data || []).map(v => v === null || v === undefined ? null : parseFloat(v)),
    borderColor: resultsTrendsColors[ds.label] || '#5D5CDE',
    backgroundColor: (resultsTrendsColors[ds.label] || '#5D5CDE') + '20',
    tension: 0.3,
    fill: false,
    pointRadius: 3,
    pointHoverRadius: 5,
    spanGaps: false
  }))
  trendsChart = new window.Chart(trendsChartCanvas.value, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#ffffff', font: { size: 12 } }
        }
      },
      scales: {
        x: { display: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#ffffff' } },
        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#ffffff' } }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  })
}

onMounted(async () => {
  calculateRiskFactors()
  await nextTick()
  
  // Create trend charts
  setTimeout(() => {
    trends.forEach((trend, index) => {
      const canvas = trendCharts.value[index]
      if (canvas) {
        createTrendChart(canvas, trend)
      }
    })
  }, 100)
  // Create results trends chart from apiResults (5 year)
  const ai = props.apiResults && props.apiResults.mapWeatherAi && props.apiResults.mapWeatherAi['5 year']
  if (ai) {
    createResultsTrendsChart(ai)
  }
})

// Recalculate when API results change
watch(() => props.apiResults, () => {
  calculateRiskFactors()
  const ai = props.apiResults && props.apiResults.mapWeatherAi && props.apiResults.mapWeatherAi['5 year']
  if (ai) {
    createResultsTrendsChart(ai)
  }
}, { deep: true })
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Custom progress bar colors */
:deep(.el-progress-bar__outer) {
  background-color: rgba(75, 85, 99, 0.3) !important;
  border-radius: 10px !important;
}

:deep(.el-progress-bar__inner) {
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
}

/* Custom chart styling */
:deep(canvas) {
  border-radius: 8px;
}
</style>

