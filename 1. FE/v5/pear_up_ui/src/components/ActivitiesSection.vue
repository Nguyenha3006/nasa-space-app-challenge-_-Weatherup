<template>
  <section id="activities" class="relative py-20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white flex items-center justify-center gap-2 mb-4">
          <i class="fas fa-heart text-blue-400 text-3xl"></i> 
          <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Activities
          </span>
        </h2>
        <p class="text-gray-300 text-lg mb-4 max-w-3xl mx-auto leading-relaxed">
          Select activities you plan to do - we'll customize the weather analysis accordingly
        </p>
        <div class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 rounded-full backdrop-blur-sm shadow-lg">
          <i class="fas fa-check-circle text-blue-400 mr-2"></i>
          <span class="text-sm text-blue-300 font-semibold">{{ selectedActivities.size }} selected</span>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
        <div v-for="i in 12" :key="i" class="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-gray-600/50 rounded-2xl p-6 animate-pulse">
          <div class="flex flex-col gap-4">
            <div class="w-16 h-16 mx-auto rounded-full bg-gray-700/50"></div>
            <div class="text-center">
              <div class="h-6 bg-gray-700/50 rounded mb-2"></div>
              <div class="h-4 bg-gray-700/50 rounded mb-4"></div>
              <div class="flex flex-wrap gap-1 justify-center">
                <div v-for="j in 2" :key="j" class="h-6 bg-gray-700/50 rounded w-16"></div>
              </div>
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
            @click="fetchActivitiesData"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
        <el-card 
          v-for="(activity, index) in activities"
          :key="activity.id"
          :class="[
            'relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-2 border-gray-600/50 rounded-2xl p-6 cursor-pointer transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/60 overflow-hidden group',
            { 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/60 shadow-xl shadow-blue-500/30': selectedActivities.has(activity.id) }
          ]"
          :style="{ animationDelay: index * 0.05 + 's' }"
          @click="toggleActivity(activity.id)"
          shadow="hover"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10 flex flex-col gap-4">
            <div class="relative flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-lg border-2 border-gray-500/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:border-blue-400/60 group-hover:shadow-lg group-hover:shadow-blue-500/30">
              <i :class="'fa-solid ' + activity.icon + ' text-xl text-blue-400 transition-all duration-300 group-hover:scale-110'"></i>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-0 scale-0 transition-all duration-300 shadow-lg"
                   :class="{ 'opacity-100 scale-100': selectedActivities.has(activity.id) }">
                <i class="fas fa-check text-xs text-white"></i>
              </div>
            </div>
            
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-2 text-white group-hover:text-blue-200 transition-colors duration-300">{{ activity.name }}</h3>
              <p class="text-gray-300 text-sm leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-300">{{ getActivityDescription(activity.id) }}</p>
              
              <div class="flex flex-wrap gap-1 justify-center">
                <el-tag 
                  v-for="factor in activity.affects" 
                  :key="factor"
                  size="small"
                  type="info"
                  class="text-xs px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-lg font-medium capitalize border border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:text-blue-200 transition-all duration-300"
                >
                  {{ factor }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { apiService } from '../config/api.js'

const emit = defineEmits(['activities-changed'])

const selectedActivities = ref(new Set())
const activities = ref([])
const isLoading = ref(true)
const error = ref(null)

const fetchActivitiesData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    console.log('Fetching activities data from API...')
    const data = await apiService.getListActivity()
    
    if (data && Array.isArray(data)) {
      // Map API data to activities format
      activities.value = data.map(activity => ({
        id: activity.id || activity.code || activity.name?.toLowerCase().replace(/\s+/g, '_'),
        name: activity.name || activity.title || 'Unknown Activity',
        icon: activity.icon || getDefaultIcon(activity.name),
        affects: activity.affects || activity.weather_factors || ['temperature', 'precipitation']
      }))
      
    } else {
      throw new Error('Invalid API response format')
    }
  } catch (err) {
    console.error('Failed to fetch activities data:', err)
    error.value = err.message

  } finally {
    isLoading.value = false
  }
}

const getDefaultIcon = (activityName) => {
  const iconMap = {
    'hiking': 'fa-person-hiking',
    'cycling': 'fa-person-biking',
    'photography': 'fa-camera',
    'camping': 'fa-campground',
    'beach': 'fa-umbrella-beach',
    'running': 'fa-person-running',
    'fishing': 'fa-fish',
    'gardening': 'fa-seedling',
    'sports': 'fa-futbol',
    'picnic': 'fa-utensils',
    'climbing': 'fa-mountain',
    'kayaking': 'fa-water',
    'swimming': 'fa-person-swimming',
    'tennis': 'fa-table-tennis-paddle-ball',
    'golf': 'fa-golf-ball-tee',
    'soccer': 'fa-futbol',
    'basketball': 'fa-basketball',
    'volleyball': 'fa-volleyball',
    'badminton': 'fa-table-tennis-paddle-ball'
  }
  
  if (!activityName) return 'fa-heart'
  
  const name = activityName.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon
    }
  }
  
  return 'fa-heart' // Default icon
}

const toggleActivity = (activityId) => {
  if (selectedActivities.value.has(activityId)) {
    selectedActivities.value.delete(activityId)
  } else {
    selectedActivities.value.add(activityId)
  }
  emit('activities-changed', selectedActivities.value)
}

const getActivityDescription = (activityId) => {
  const descriptions = {
    hiking: 'Explore nature trails and mountain paths',
    cycling: 'Bike rides through scenic routes',
    photography: 'Capture beautiful outdoor moments',
    camping: 'Overnight outdoor adventures',
    beach: 'Relaxing by the water',
    running: 'Cardio workouts in fresh air',
    fishing: 'Peaceful time by the water',
    gardening: 'Tending to plants and flowers',
    sports: 'Active outdoor games',
    picnic: 'Dining in nature',
    climbing: 'Scale rock formations',
    kayaking: 'Paddle through waters'
  }
  return descriptions[activityId] || 'Outdoor activity'
}

watch(selectedActivities, (newValue) => {
  emit('activities-changed', newValue)
}, { deep: true })

onMounted(() => {
  fetchActivitiesData()
})
</script>


