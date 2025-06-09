<template>
  <div class="world-clock">
    <h1>🌍 World Clock</h1>
    
    <div class="search-section">
      <input
        v-model="searchCity"
        @keyup.enter="addClock"
        type="text"
        placeholder="도시명을 입력하세요 (예: Seoul, New York, London)"
        class="city-input"
      />
      <button @click="addClock" class="add-button">시계 추가</button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="clocks-container">
      <div 
        v-for="clock in clocks" 
        :key="clock.id"
        class="clock-card"
      >
        <div class="clock-header">
          <h3>{{ clock.city }}</h3>
          <button @click="removeClock(clock.id)" class="remove-button">×</button>
        </div>
        <div class="time-display">
          {{ clock.time }}
        </div>
        <div class="date-display">
          {{ clock.date }}
        </div>
        <div class="timezone-display">
          {{ clock.timezone }}
        </div>
      </div>
    </div>

    <div v-if="clocks.length === 0" class="empty-state">
      도시를 검색해서 시계를 추가해보세요!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Clock {
  id: number
  city: string
  timezone: string
  time: string
  date: string
}

const searchCity = ref('')
const clocks = ref<Clock[]>([])
const error = ref('')
let intervalId: number | null = null

// 시간대 매핑 (주요 도시들)
const timezoneMap: Record<string, string> = {
  'seoul': 'Asia/Seoul',
  'tokyo': 'Asia/Tokyo',
  'beijing': 'Asia/Shanghai',
  'shanghai': 'Asia/Shanghai',
  'hong kong': 'Asia/Hong_Kong',
  'singapore': 'Asia/Singapore',
  'bangkok': 'Asia/Bangkok',
  'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'dubai': 'Asia/Dubai',
  'moscow': 'Europe/Moscow',
  'istanbul': 'Europe/Istanbul',
  'london': 'Europe/London',
  'paris': 'Europe/Paris',
  'berlin': 'Europe/Berlin',
  'rome': 'Europe/Rome',
  'madrid': 'Europe/Madrid',
  'amsterdam': 'Europe/Amsterdam',
  'stockholm': 'Europe/Stockholm',
  'new york': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'toronto': 'America/Toronto',
  'vancouver': 'America/Vancouver',
  'mexico city': 'America/Mexico_City',
  'sao paulo': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  'sydney': 'Australia/Sydney',
  'melbourne': 'Australia/Melbourne',
  'auckland': 'Pacific/Auckland',
  'cairo': 'Africa/Cairo',
  'lagos': 'Africa/Lagos',
  'johannesburg': 'Africa/Johannesburg'
}

const addClock = () => {
  const city = searchCity.value.trim().toLowerCase()
  if (!city) {
    error.value = '도시명을 입력해주세요.'
    return
  }

  const timezone = timezoneMap[city]
  if (!timezone) {
    error.value = `"${searchCity.value}"는 지원하지 않는 도시입니다. 다른 도시를 시도해보세요.`
    return
  }

  // 중복 체크
  const exists = clocks.value.some(clock => 
    clock.city.toLowerCase() === searchCity.value.toLowerCase()
  )
  
  if (exists) {
    error.value = '이미 추가된 도시입니다.'
    return
  }

  const newClock: Clock = {
    id: Date.now(),
    city: searchCity.value,
    timezone,
    time: '',
    date: ''
  }

  clocks.value.push(newClock)
  searchCity.value = ''
  error.value = ''
  updateTimes()
}

const removeClock = (id: number) => {
  clocks.value = clocks.value.filter(clock => clock.id !== id)
}

const updateTimes = () => {
  clocks.value.forEach(clock => {
    try {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('ko-KR', {
        timeZone: clock.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      
      const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
        timeZone: clock.timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })

      clock.time = formatter.format(now)
      clock.date = dateFormatter.format(now)
    } catch (e) {
      console.error(`Error updating time for ${clock.city}:`, e)
    }
  })
}

onMounted(() => {
  // 기본으로 Seoul 시계 추가
  searchCity.value = 'Seoul'
  addClock()
  
  // 1초마다 시간 업데이트
  intervalId = setInterval(updateTimes, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.world-clock {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.city-input {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-width: 300px;
  outline: none;
  transition: border-color 0.3s;
}

.city-input:focus {
  border-color: #3498db;
}

.add-button {
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #2980b9;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
}

.clocks-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.clock-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.clock-card:hover {
  transform: translateY(-5px);
}

.clock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.clock-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.remove-button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background: rgba(255,255,255,0.3);
}

.time-display {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
}

.date-display {
  text-align: center;
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 10px;
}

.timezone-display {
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.7;
}

.empty-state {
  text-align: center;
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-top: 50px;
}

@media (max-width: 768px) {
  .city-input {
    min-width: 250px;
  }
  
  .clocks-container {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .time-display {
    font-size: 2rem;
  }
}
</style>