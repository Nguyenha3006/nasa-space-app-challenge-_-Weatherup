<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden">
    
    <!-- Main Content Container -->
    <div class="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
      <!-- Logo and Brand Name -->
      <div class="text-7xl sm:text-5xl md:text-7xl mb-10 flex items-center justify-center gap-4 text-white font-bold">   
          <i class="fas fa-cloud-sun"></i>
          <div>weatherUP</div>
      </div>
      
      <!-- Tagline -->
      <p class="sm:text-xl md:text-2xl font-medium mb-6 text-white drop-shadow-lg">
        UP to you, UP to weather
      </p>
      
      <!-- Description -->
      <p class=" sm:text-xl md:text-xl font-medium mb-12 text-white drop-shadow-lg max-w-3xl mx-auto">
        Plan your outdoor adventures with confidence
      </p>
      
      <!-- CTA Button -->
      <div class="mb-8">
        <el-button 
          type="primary"
          size="large"
          @click="$emit('start-planning')"
        >
          <span class="drop-shadow-lg">Start Planning</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['start-planning'])
</script>


