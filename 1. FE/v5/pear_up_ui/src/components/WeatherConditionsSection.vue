<template>
  <section class="relative py-20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white flex items-center justify-center gap-2 mb-4">
          <i class="fas fa-chart-line text-blue-400 text-3xl"></i>
          <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Weather Conditions We Analyze
          </span>
        </h2>
        <p class="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Our AI-powered system monitors these critical weather factors to ensure your safety
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-gray-600/50 rounded-2xl p-8 shadow-lg animate-pulse">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gray-700/50"></div>
            <div class="h-6 bg-gray-700/50 rounded mb-3"></div>
            <div class="h-4 bg-gray-700/50 rounded mb-6"></div>
            <div class="flex items-center justify-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-700/50"></div>
              <div class="h-3 bg-gray-700/50 rounded w-20"></div>
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
            @click="fetchWeatherConditions"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <el-card 
          v-for="(condition, index) in conditions" 
          :key="condition.title"
          class="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-gray-600/50 rounded-2xl p-8 shadow-lg transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/60 overflow-hidden group"
          :style="{ animationDelay: index * 0.1 + 's' }"
          shadow="hover"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-lg border-2 border-gray-500/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:border-blue-400/60 group-hover:shadow-lg group-hover:shadow-blue-500/30">
              <i :class="'fa-solid ' + condition.icon + ' text-2xl transition-all duration-300 group-hover:scale-110'" 
                 :style="{ color: condition.color }"></i>
            </div>
            
            <h3 class="text-xl font-semibold mb-3 text-white group-hover:text-blue-200 transition-colors duration-300">{{ condition.title }}</h3>
            <p class="text-gray-300 text-sm leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">{{ condition.desc }}</p>
            
            <div class="flex items-center justify-center gap-2">
              <span class="w-3 h-3 rounded-full animate-pulse shadow-lg" :style="{ backgroundColor: condition.color, boxShadow: `0 0 10px ${condition.color}40` }"></span>
              <span class="text-xs text-gray-400 font-medium uppercase tracking-wider group-hover:text-blue-300 transition-colors duration-300">Risk Factor</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiService } from '../config/api.js'

const conditions = ref([])
const isLoading = ref(true)
const error = ref(null)

// Default fallback data
const defaultConditions = [
  {
    icon: 'fa-temperature-full',
    title: 'Temperature',
    desc: 'Extreme hot and cold conditions',
    color: '#ff6347'
  },
  {
    icon: 'fa-droplet',
    title: 'Precipitation',
    desc: 'Rain, snow, and wet conditions',
    color: '#3498db'
  },
  {
    icon: 'fa-wind',
    title: 'Wind Speed',
    desc: 'Dangerous wind conditions',
    color: '#2ecc71'
  },
  {
    icon: 'fa-solid fa-eye-slash',
    title: 'Visibility',
    desc: 'Dust, fog and low visibility',
    color: '#95a5a6'
  }
]

const fetchWeatherConditions = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const data = await apiService.getWeatherConditions()
    
    // Transform API response to match our component structure
    if (data && Array.isArray(data)) {
      conditions.value = data.map(item => ({
        icon: item.icon || 'fa-cloud',
        title: item.title || item.name || 'Unknown',
        desc: item.description || item.desc || 'Weather condition',
        color: item.color || '#3498db'
      }))
    } else {
      throw new Error('Invalid API response format')
    }
    
  } catch (err) {
    console.error('Failed to fetch weather conditions:', err)
    error.value = err.message
    
    // Fallback to default data
    conditions.value = defaultConditions
    console.log('Using fallback weather conditions data')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchWeatherConditions()
})
</script>


