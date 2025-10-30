<template>
  <section id="locationForm" class="relative py-20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-4">
          <i class="fa-solid fa-map-location-dot text-blue-400 text-3xl"></i> 
          <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Location & Date Selection
          </span>
        </h2>
        <p class="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Choose your destination and time for personalized weather risk assessment
        </p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Location Section -->
        <div class="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <i class="fa-solid fa-location-dot text-blue-400 text-xl"></i> 
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Location</span>
            </h3>
            <el-input
            v-loading="loadingLocalInput"
              v-model="locationInput"
              placeholder="Enter location (e.g., Hoan Kiem Lake)"
              @input="handleLocationInput"
              class="w-full mb-4 !bg-gray-700/80 !border-2 !border-gray-500/50 !text-white !rounded-xl !shadow-md hover:!border-blue-400/60 hover:!shadow-lg transition-all duration-300"
            />
            <p class="text-gray-400 text-sm flex items-center gap-2">
              <i class="fas fa-mouse-pointer text-blue-400"></i>
              Click to place a marker on the map
            </p>
          </div>
          <div ref="mapContainer" id="map" class="h-64 w-full rounded-xl border-2 border-gray-500/30 shadow-inner"></div>
        </div>
        
        <!-- Date Section -->
        <div class="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <i class="fa-regular fa-calendar text-blue-400 text-xl"></i> 
              <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Time of Year</span>
            </h3>
            <p class="text-gray-300 mb-4 flex items-center gap-2">
              <i class="fas fa-calendar-alt text-blue-400"></i>
              Select Month:
            </p>
            <div class="grid grid-cols-3 gap-2 mb-6">
              <el-button
                v-for="(month, index) in months"
                :key="month"
                :class="selectedMonth === month 
                  ? '!bg-blue-600 !border-2 !border-blue-400 !text-white !font-bold !shadow-lg hover:!shadow-xl hover:!bg-blue-500 !rounded-xl !transition-all !duration-300 hover:!scale-105' 
                  : '!bg-gray-700/80 !border-2 !border-gray-500 !text-gray-200 !font-medium !shadow-md hover:!shadow-lg hover:!bg-gray-600 hover:!border-gray-400 hover:!text-white !rounded-xl !transition-all !duration-300 hover:!scale-105'"
                size="small"
                @click="selectMonth(month, index)"
                class="w-full"
              >
                {{ month }}
              </el-button>
            </div>
            
            <div v-if="showDaySection" class="space-y-4">
              <p class="text-gray-300 flex items-center gap-2">
                <i class="fas fa-calendar-day text-blue-400"></i>
                Select Day:
              </p>
              <div class="grid grid-cols-7 gap-1">
                <el-button
                  v-for="day in availableDays"
                  :key="day"
                  :class="selectedDay === day 
                    ? '!bg-blue-600 !border-2 !border-blue-400 !text-white !font-bold !shadow-lg hover:!shadow-xl hover:!bg-blue-500 !rounded-lg !transition-all !duration-300 hover:!scale-105' 
                    : '!bg-gray-700/80 !border-2 !border-gray-500 !text-gray-200 !font-medium !shadow-md hover:!shadow-lg hover:!bg-gray-600 hover:!border-gray-400 hover:!text-white !rounded-lg !transition-all !duration-300 hover:!scale-105'"
                  size="small"
                  @click="selectDay(day)"
                  class="w-full"
                >
                  {{ day }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <el-button
          :class="isFormComplete 
            ? '!bg-gradient-to-r !from-blue-600 !to-purple-600 !border-0 !text-white !font-bold !shadow-lg hover:!shadow-xl hover:!scale-105 !rounded-xl !transition-all !duration-300' 
            : '!bg-gray-600/50 !border-2 !border-gray-500 !text-gray-400 !font-medium !shadow-md !rounded-xl !transition-all !duration-300'"
          size="large"
          :disabled="!isFormComplete"
          @click="handleAnalyze"
          class="w-full max-w-md h-12 text-base"
        >
          <i class="fas fa-chart-line mr-3"></i>
          Analyze Weather Risk for Selected Activities
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  selectedActivities: {
    type: Set,
    default: () => new Set()
  }
})

const emit = defineEmits(['analyze', 'form-complete'])

const mapContainer = ref(null)
const locationInput = ref('')
const selectedMonth = ref(null)
const selectedDay = ref(null)
const showDaySection = ref(false)
const isFormComplete = ref(false)
const loadingLocalInput = ref(false)
const latitude = ref(null)
const longitude = ref(null)

let map = null
let marker = null

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const availableDays = ref([])

const initMap = () => {
  try {
    // Use global Leaflet from CDN
    const L = window.L
    if (!L) {
      console.warn('Leaflet not loaded')
      return
    }
    
    // Fix Leaflet default markers
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
    
    map = L.map('map').setView([21.0285, 105.8542], 10)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    
    map.on('click', async (e) => {
      if (marker) map.removeLayer(marker)
      marker = L.marker(e.latlng).addTo(map)
      
      try {
        loadingLocalInput.value = true
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        )
        const data = await res.json()
        locationInput.value = data.display_name || `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
        latitude.value = e.latlng.lat
        longitude.value = e.latlng.lng
      } catch {
        locationInput.value = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
        latitude.value = e.latlng.lat
        longitude.value = e.latlng.lng
      } finally {
    loadingLocalInput.value = false
  }
      checkFormComplete()
    })
  } catch (err) {
    console.warn('Leaflet init failed:', err)
  } 
}

const handleLocationInput = (value) => {
  if (!value || value.length <= 2) return
  
  setTimeout(async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=1`
      )
      const data = await res.json()
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lon = parseFloat(data[0].lon)
        if (map && window.L) {
          map.setView([lat, lon], 10)
          if (marker) map.removeLayer(marker)
          marker = window.L.marker([lat, lon]).addTo(map)
        }
        locationInput.value = data[0].display_name
        latitude.value = lat
        longitude.value = lon
        checkFormComplete()
      }
    } catch (err) {
      console.log('Geocode error', err)
    }
  }, 700)
}

const selectMonth = (month, index) => {
  selectedMonth.value = month
  selectedDay.value = null
  showDaySection.value = true
  
  const days = daysInMonth[index] || 31
  availableDays.value = Array.from({ length: days }, (_, i) => i + 1)
  checkFormComplete()
}

const selectDay = (day) => {
  selectedDay.value = day
  checkFormComplete()
}

const checkFormComplete = () => {
  const hasActivities = props.selectedActivities.size > 0
  const hasLocation = locationInput.value && locationInput.value.trim() !== ''
  const hasDateTime = !!(selectedMonth.value && selectedDay.value)
  
  isFormComplete.value = hasActivities && hasLocation && hasDateTime
  emit('form-complete', isFormComplete.value)
}

const handleAnalyze = () => {
  if (isFormComplete.value) {
    const monthIndex = months.indexOf(selectedMonth.value)
    const monthStr = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, '0') : ''
    const dayStr = selectedDay.value ? String(selectedDay.value).padStart(2, '0') : ''
    const yearStr = String(new Date().getFullYear())
    const dateSelection = monthStr && dayStr ? `${dayStr}/${monthStr}/${yearStr}` : ''
    emit('analyze', {
      selectedActivities: props.selectedActivities,
      location: locationInput.value,
      month: selectedMonth.value,
      day: selectedDay.value,
      latitude: latitude.value,
      longitude: longitude.value,
      dateSelection
    })
  }
}

watch(() => props.selectedActivities, checkFormComplete, { deep: true })

onMounted(async () => {
  await nextTick()
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

