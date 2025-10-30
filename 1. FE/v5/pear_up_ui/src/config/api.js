// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://183.80.250.208:8090/gateway_nasa/pear_up_api',
  ENDPOINTS: {
    WEATHER_CONDITIONS: '/v1/category/get_list_weather_condition',
    PROVINCE_VIETNAM: '/v1/category/get_list_province_of_vietnam',
    LIST_ACTIVITY: '/v1/category/get_list_activity',
    VIETNAM_WEATHER_TRENDS: '/v1/index/get_vietnam_weather_trends',
    GET_ANALYZE_WEATHER_RISK_FOR_SELECTED_ACTIVITIES: '/v1/index/get_analyze_weather_risk_for_selected_activities'
  }
}

// API Service
export class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Get weather conditions data
  async getWeatherConditions() {
    return this.request(API_CONFIG.ENDPOINTS.WEATHER_CONDITIONS)
  }

   // Get province of vietnam data
   async getProvinceOfVietnam() {
    return this.request(API_CONFIG.ENDPOINTS.PROVINCE_VIETNAM)
  }

   // Get list activity data
   async getListActivity() {
    return this.request(API_CONFIG.ENDPOINTS.LIST_ACTIVITY)
  }

  // Get weather trends by date type
  async getWeatherTrendsByDateType(enumDateType, provinceCode, latitude, longitude) {
    const params = new URLSearchParams({
      enumDateType,
      provinceCode,
      latitude,
      longitude
    })
    return this.request(`${API_CONFIG.ENDPOINTS.VIETNAM_WEATHER_TRENDS}?${params}`)
  }

    // Get weather analyze risk for selected activities
    async getAnalyzeWeatherRiskForSelectedActivities(arrEnumActivity, latitude, longitude, dateSelection) {
      const params = new URLSearchParams({
        arrEnumActivity,
        latitude,
        longitude,
        dateSelection
      })
      return this.request(`${API_CONFIG.ENDPOINTS.GET_ANALYZE_WEATHER_RISK_FOR_SELECTED_ACTIVITIES}?${params}`)
    }

}

// Create singleton instance
export const apiService = new ApiService()
