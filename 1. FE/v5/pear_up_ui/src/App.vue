<template>
  <div id="app" class="min-h-screen relative" 
 >
 
    <!-- Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-1 bg-gray-700 z-50">
      <div class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300" 
           :style="{ width: scrollProgress + '%' }"></div>
    </div>
    
    <!-- Hero Section -->
    <div class="relative">
      <HeroSection @start-planning="scrollToActivities" />
    </div>
    
    <!-- Weather Trends Chart -->
    <WeatherTrendsSection />
    
    <!-- Weather Conditions -->
    <WeatherConditionsSection />
     
    <!-- Activities Section -->
    <ActivitiesSection 
      ref="activitiesSection" 
      @activities-changed="handleActivitiesChanged"
    />
    
    <!-- Location & Date Form -->
    <LocationDateForm 
      :selected-activities="selectedActivities"
      @analyze="showResults"
      @form-complete="isFormComplete = $event"
    />
    
    <!-- Results Section -->
    <ResultsSection 
      v-if="showResultsSection"
      :selected-activities="selectedActivities"
      :location="location"
      :month="month"
      :day="day"
      :api-results="analyzeResults"
      ref="resultsSection"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { apiService } from './config/api'
import { ElLoading } from 'element-plus'
import HeroSection from './components/HeroSection.vue'
import WeatherTrendsSection from './components/WeatherTrendsSection.vue'
import WeatherConditionsSection from './components/WeatherConditionsSection.vue'
import ActivitiesSection from './components/ActivitiesSection.vue'
import LocationDateForm from './components/LocationDateForm.vue'
import ResultsSection from './components/ResultsSection.vue'
import backgroundImageUrl from './assets/mf.png'

const scrollProgress = ref(0)
const selectedActivities = ref(new Set())
const location = ref('')
const month = ref(null)
const day = ref(null)
const isFormComplete = ref(false)
const showResultsSection = ref(false)
const activitiesSection = ref(null)
const resultsSection = ref(null)
const backgroundImage = backgroundImageUrl
const analyzeResults = ref(null)


const scrollToActivities = () => {
  activitiesSection.value?.$el.scrollIntoView({ behavior: 'smooth' })
}

const handleActivitiesChanged = (activities) => {
  selectedActivities.value = activities
}

const showResults = async (formData) => {
  const loading = ElLoading.service({
    lock: true,
    text: '🤖 Analyzing with AI',
    background: 'rgba(0, 0, 0, 0.8)',
    spinner: 'el-icon-loading',
    customClass: 'custom-loading ai-thinking'
  })
  
  try {
    selectedActivities.value = formData.selectedActivities
    location.value = formData.location
    month.value = formData.month
    day.value = formData.day
    showResultsSection.value = true
    
    // Call analyze API
    const arrEnumActivity = Array.from(selectedActivities.value)
    const { latitude, longitude, dateSelection } = formData
    try {
      analyzeResults.value = await apiService.getAnalyzeWeatherRiskForSelectedActivities(
        arrEnumActivity.join(',').toUpperCase(),
        latitude,
        longitude,
        dateSelection
      )
    } catch (e) {
      console.error('Analyze API failed', e)
      analyzeResults.value = null
    }
    
    resultsSection.value?.$el.scrollIntoView({ behavior: 'smooth' })
  } catch (error) {
    console.log(error)
  } finally {
    loading.close()
  }
}

const updateScrollProgress = () => {
  const scrolled = window.scrollY
  const height = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = height > 0 ? (scrolled / height) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<style>
.custom-loading .el-loading-text {
  color: #60a5fa !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}

.custom-loading .el-loading-spinner {
  color: #60a5fa !important;
}

.custom-loading .el-loading-spinner .el-icon-loading {
  font-size: 32px !important;
  color: #60a5fa !important;
}

/* AI themed loading enhancements */
.ai-thinking .el-loading-text::after {
  content: ' .';
  animation: aiDots 1.2s infinite steps(4);
}

@keyframes aiDots {
  0%, 20% { content: ' .'; }
  40% { content: ' ..'; }
  60% { content: ' ...'; }
  80%, 100% { content: ' ....'; }
}

.ai-thinking .el-loading-spinner::before {
  content: '';
  position: absolute;
  inset: -12px;
  border-radius: 9999px;
  background: radial-gradient(closest-side, rgba(96,165,250,0.25), transparent);
  filter: blur(8px);
}
</style>
