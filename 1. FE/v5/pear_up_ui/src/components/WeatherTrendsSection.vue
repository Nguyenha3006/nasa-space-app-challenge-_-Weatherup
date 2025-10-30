<template>
  <section class="min-h-screen flex items-center">
    <div class="w-full max-w-7xl mx-auto p-8">
      <div class="bg-gray-800/95 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
        <div class="mb-6">
          <h2 class="text-2xl text-white flex items-center gap-2">
            <i class="fa-solid fa-cloud-sun text-primary-500"></i> 
            Vietnam Weather Trends
          </h2>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="max-h-80 min-h-64 bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
            <div class="text-gray-400">
              <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
              <p>Loading chart data...</p>
            </div>
          </div>
          <div class="space-y-6">
            <div class="h-10 bg-gray-700/50 rounded-lg animate-pulse"></div>
            <div class="flex gap-3 flex-wrap">
              <div v-for="i in 3" :key="i" class="h-10 bg-gray-700/50 rounded-lg animate-pulse w-24"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="i in 4" :key="i" class="bg-gray-700/50 rounded-xl p-4 animate-pulse">
                <div class="h-6 bg-gray-600/50 rounded mb-2"></div>
                <div class="h-4 bg-gray-600/50 rounded mb-2"></div>
                <div class="h-8 bg-gray-600/50 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 max-w-md mx-auto">
            <i class="fa-solid fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
            <h3 class="text-xl font-semibold text-red-300 mb-2">API Error</h3>
            <p class="text-gray-300 mb-4">{{ error }}</p>
            <button 
              @click="fetchProvincesData"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        </div>

        <!-- Success State -->
        <div v-else class="space-y-8">
          <!-- Chart Section - Full Width -->
          <div class="w-full">
            <div class="bg-gray-700/30 rounded-2xl p-6 border border-white/10">
              <div class="h-96 w-full relative">
                <canvas ref="chartCanvas" id="weatherChart" class="w-full h-full"></canvas>
                <div v-if="isUpdatingChart" class="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div class="text-center text-blue-200">
                    <i class="fa-solid fa-robot fa-beat-fade text-2xl mb-2"></i>
                    <p class="font-semibold">Updating chart...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Controls and Weather Cards Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Controls -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Select City</label>
                <el-select 
                  v-model="selectedCity" 
                  placeholder="Select a city"
                  class="w-full !bg-gray-800/90 !border-2 !border-blue-400 !text-white !rounded-xl !shadow-lg hover:!shadow-xl hover:!border-blue-300 transition-all duration-300"
                  @change="updateChart"
                >
                  <el-option
                    v-for="city in cities"
                    :key="city.value"
                    :label="city.label"
                    :value="city.value"
                    class="!bg-gray-800 !text-white hover:!bg-blue-600/50"
                  />
                </el-select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Select Period</label>
                <div class="flex gap-3 flex-wrap">
                  <el-button 
                    v-for="period in periods"
                    :key="period.value"
                    :class="currentPeriod === period.value 
                      ? '!bg-blue-600 !border-2 !border-blue-400 !text-white !font-bold !shadow-lg hover:!shadow-xl hover:!bg-blue-500 !rounded-xl !px-6 !py-2 !transition-all !duration-300 hover:!scale-105' 
                      : '!bg-gray-700/80 !border-2 !border-gray-500 !text-gray-200 !font-medium !shadow-md hover:!shadow-lg hover:!bg-gray-600 hover:!border-gray-400 hover:!text-white !rounded-xl !px-6 !py-2 !transition-all !duration-300 hover:!scale-105'"
                    size="small"
                    @click="updateChartPeriod(period.value)"
                  >
                    <i class="fas fa-calendar-day mr-2"></i>
                    {{ period.label }}
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- Weather Cards -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-400/30 p-4 rounded-xl text-center text-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <i class="fa-solid fa-temperature-full text-red-400 mb-2 block text-2xl"></i> 
                <div class="text-sm font-medium text-gray-300">Temperature</div>
                <span class="block text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mt-1">{{ weatherData.temperature }}</span>
              </div>
              <div class="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 p-4 rounded-xl text-center text-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <i class="fa-solid fa-wind text-green-400 mb-2 block text-2xl"></i> 
                <div class="text-sm font-medium text-gray-300">Wind Speed</div>
                <span class="block text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-1">{{ weatherData.windSpeed }}</span>
              </div>
              <div class="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 p-4 rounded-xl text-center text-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <i class="fa-solid fa-droplet text-blue-400 mb-2 block text-2xl"></i> 
                <div class="text-sm font-medium text-gray-300">Relative Humidity</div>
                <span class="block text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mt-1">{{ weatherData.humidity }}</span>
              </div>
          
              <div class="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 p-4 rounded-xl text-center text-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <i class="fa-solid fa-cloud text-purple-400 mb-2 block text-2xl"></i> 
                <div class="text-sm font-medium text-gray-300">Precipitation Corrected</div>
                <span class="block text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-1">{{ weatherData.probalilytiOfRain }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { apiService } from '../config/api.js'

const chartCanvas = ref(null)
let chart = null

const selectedCity = ref('')
const currentPeriod = ref('DAY_7')
const isLoading = ref(true)
const isUpdatingChart = ref(false)
const error = ref(null)

const cities = ref([])
const provincesData = ref([])

const periods = [
  { value: 'DAY_3', label: '3 Days' },
  { value: 'DAY_7', label: '7 Days' },
  { value: 'DAY_10', label: '10 Days' }
]

const weatherData = ref({
  temperature: '--',
  humidity: '--',
  windSpeed: '--',
  probalilytiOfRain: '--'
})

const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const generateSeries = (len, min = 10, max = 35) => 
  Array.from({ length: len }, () => randomRange(min, max))

const updateWeatherData = (province) => {
  if (!province || !province.bbox) {
    weatherData.value = {
      temperature: '--',
      humidity: '--',
      windSpeed: '--',
      probalilytiOfRain: '--'
    }
    return
  }

  // Map bbox data to weather metrics
  // bbox: [min_lat, min_lng, max_lat, max_lng]
  const [minLat, minLng, maxLat, maxLng] = province.bbox
  
  weatherData.value = {
    temperature: Math.round((minLat + maxLat) / 2), // Average of lat coordinates
    humidity: Math.round((minLng + maxLng) / 2), // Average of lng coordinates  
    windSpeed: Math.round(Math.abs(maxLat - minLat) * 10), // Lat range * 10
    probalilytiOfRain: Math.round(Math.abs(maxLng - minLng) * 10) // Lng range * 10
  }
}

const fetchProvincesData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    console.log('Fetching provinces data from API...')
    const data = await apiService.getProvinceOfVietnam()
    
    if (data && Array.isArray(data)) {
      provincesData.value = data
      
      // Map API data to cities format
      cities.value = data.map(province => ({
        value: province.code,
        label: province.name_vi,
        name: province.name,
        code: province.code,
        latitude: province.latitude,
        longitude: province.longitude,
        bbox: province.bbox
      }))
      
      // Set default selected city to first one
      if (cities.value.length > 0) {
        selectedCity.value = cities.value[0].value
        updateWeatherData(provincesData.value[0])
      }
      
    } else {
      throw new Error('Invalid API response format')
    }
  } catch (err) {
    console.error('Failed to fetch provinces data:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const createChart = (data) => {
  if (chart) {
    chart.destroy()
  }
  
  if (!chartCanvas.value) return
  
  // Define colors for each metric
  const colors = {
    'Temperature': '#ef4444', // red
    'Relative Humidity': '#3b82f6', // blue
    'Wind Speed': '#10b981', // green
    'Precipitation Corrected': '#8b5cf6' // purple
  }
  
  // Use global Chart.js from CDN
  chart = new window.Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data.map(value => value === null ? null : parseFloat(value)),
        borderColor: colors[dataset.label] || '#5D5CDE',
        backgroundColor: (colors[dataset.label] || '#5D5CDE') + '20',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
        spanGaps: false, // Don't connect points across null values
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true,
          position: 'top',
          labels: {
            color: '#ffffff',
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        x: { 
          display: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        y: { 
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
}

const formatDate = (raw) => {
  return dayjs(raw, 'YYYYMMDD').format('DD/MM/YYYY')
}

const updateChartForPeriod = async (period) => {
  currentPeriod.value = period
  isUpdatingChart.value = true
  
  // Get selected province data
  const selectedProvince = provincesData.value.find(p => p.code === selectedCity.value)
  
  if (!selectedProvince) {
    console.warn('No province selected')
    return
  }

  try {
    const apiData = await apiService.getWeatherTrendsByDateType(
      period,
      selectedProvince.code,
      selectedProvince.latitude,
      selectedProvince.longitude
    )

    // Process API data
    let labels = []
    let values = []

    if (apiData && apiData.labels && apiData.datasets) {
      // Use real API data with new format
      labels = apiData.labels.map(item => formatDate(item))
      
      // Update weather data from first non-null values of each dataset
      const temperatureData = apiData.datasets.find(d => d.label === 'Temperature')?.data
      const humidityData = apiData.datasets.find(d => d.label === 'Relative Humidity')?.data
      const windSpeedData = apiData.datasets.find(d => d.label === 'Wind Speed')?.data
      const rainData = apiData.datasets.find(d => d.label === 'Precipitation Corrected')?.data
      
      // Get first non-null value from each dataset
      const getFirstValue = (data) => {
        if (!data) return '--'
        const firstNonNull = data.find(val => val !== null && val !== undefined)
        return firstNonNull ? parseFloat(firstNonNull).toFixed(1) : '--'
      }
      
      weatherData.value = {
        temperature: getFirstValue(temperatureData) + ' °C',
        humidity: getFirstValue(humidityData) + ' %',
        windSpeed: getFirstValue(windSpeedData) + ' m/s',
        probalilytiOfRain: getFirstValue(rainData) + ' mm/day'
      }
      
      createChart({
        labels,
        datasets: apiData.datasets
      })
      
    } else {
      labels = generateLabelsForPeriod(period)
      const fallbackValues = generateFallbackValues(period, selectedProvince)
      
      // Create fallback datasets for all 4 metrics
      const fallbackDatasets = [
        {
          label: 'Temperature',
          data: fallbackValues
        },
        {
          label: 'Relative Humidity',
          data: generateSeries(labels.length, 60, 90)
        },
        {
          label: 'Wind Speed',
          data: generateSeries(labels.length, 1, 10)
        },
        {
          label: 'Precipitation Corrected',
          data: generateSeries(labels.length, 0, 50)
        }
      ]
      
      createChart({
        labels,
        datasets: fallbackDatasets
      })
      
      updateWeatherData(selectedProvince)
    }

  } catch (error) {
    console.error('Failed to fetch weather trends:', error)
    
    // Fallback to generated data on error
    const labels = generateLabelsForPeriod(period)
    const fallbackValues = generateFallbackValues(period, selectedProvince)
    
    // Create fallback datasets for all 4 metrics
    const fallbackDatasets = [
      {
        label: 'Temperature',
        data: fallbackValues
      },
      {
        label: 'Relative Humidity',
        data: generateSeries(labels.length, 60, 90)
      },
      {
        label: 'Wind Speed',
        data: generateSeries(labels.length, 1, 10)
      },
      {
        label: 'Precipitation Corrected',
        data: generateSeries(labels.length, 0, 50)
      }
    ]
    
    createChart({
      labels,
      datasets: fallbackDatasets
    })
    
    updateWeatherData(selectedProvince)
  } finally {
    isUpdatingChart.value = false
  }
}

const generateLabelsForPeriod = (period) => {
  if (period === 'DAY_3') {
    return ['Day 1', 'Day 2', 'Day 3']
  } else if (period === 'DAY_7') {
    return Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`)
  } else if (period === 'DAY_10') {
    return Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`)
  }
  return Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`)
}

const generateFallbackValues = (period, selectedProvince) => {
  const baseTemp = Math.round(selectedProvince.latitude * 1.5 + 10)
  
  if (period === 'DAY_3') {
    return generateSeries(3, baseTemp - 3, baseTemp + 5)
  } else if (period === 'DAY_7') {
    return generateSeries(7, baseTemp - 5, baseTemp + 10)
  } else if (period === 'DAY_10') {
    return generateSeries(10, baseTemp - 8, baseTemp + 12)
  }
  return generateSeries(7, baseTemp - 5, baseTemp + 10)
}

const updateChartPeriod = (period) => {
  updateChartForPeriod(period)
}

const updateChart = async () => {
  await updateChartForPeriod(currentPeriod.value)
}

onMounted(async () => {
  await fetchProvincesData()
  // Wait a bit for the chart to be ready
  setTimeout(async () => {
    await updateChartForPeriod(currentPeriod.value)
  }, 100)
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

