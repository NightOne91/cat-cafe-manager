<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const baseUrl = import.meta.env.BASE_URL
const asset = (path) => `${baseUrl}${path}`.replace(/\/{2,}/g, '/').replace(/^.\//, './')

const flexProperties = ['justify-content', 'align-content', 'flex-wrap', 'flex-direction', 'align-items']

const propertyOptions = {
  'justify-content': ['flex-start', 'flex-end', 'space-around', 'center', 'space-between', 'stretch'],
  'align-content': ['flex-start', 'flex-end', 'space-around', 'center', 'space-between', 'stretch'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
  'align-items': ['flex-start', 'flex-end', 'center', 'stretch', 'baseline']
}

const propertyHints = {
  display: '試著先讓外容器變成 flex 容器。',
  'justify-content': '試著調整主軸上的排列方式。',
  'align-content': '試著調整多行內容在交錯軸上的排列。',
  'flex-wrap': '試著調整物件是否換行。',
  'flex-direction': '試著調整主軸方向。',
  'align-items': '試著調整交錯軸上的排列方式。'
}

const catArtSources = {
  orange: asset('cats/orange.png'),
  black: asset('cats/black.png'),
  coal: asset('cats/coal.png'),
  gray: asset('cats/gray.png'),
  white: asset('cats/white.png'),
  cream: asset('cats/cream.png'),
  calico: asset('cats/calico.png'),
  brown: asset('cats/brown.png'),
  deepRed: asset('cats/deep-red.png'),
  lightYellow: asset('cats/light-yellow.png')
}

const targetColors = {
  orange: 'rgba(239, 138, 58, 0.48)',
  black: 'rgba(35, 35, 40, 0.56)',
  coal: 'rgba(72, 73, 78, 0.52)',
  gray: 'rgba(129, 141, 148, 0.5)',
  white: 'rgba(255, 248, 239, 0.76)',
  cream: 'rgba(244, 216, 161, 0.62)',
  calico: 'linear-gradient(135deg, rgba(248, 240, 226, 0.72) 0 38%, rgba(236, 135, 50, 0.58) 38% 68%, rgba(36, 36, 40, 0.54) 68% 100%)',
  brown: 'rgba(145, 106, 76, 0.52)',
  deepRed: 'rgba(155, 69, 45, 0.54)',
  lightYellow: 'rgba(248, 222, 140, 0.62)'
}

const pairCats = [
  { id: 'orange', name: '橘貓', type: 'cat', color: 'orange' },
  { id: 'black', name: '黑貓', type: 'cat', color: 'black' }
]

const cafeGuests = [
  { id: 'orange', name: '橘貓', type: 'cat', color: 'orange' },
  { id: 'guest1', name: '1號客人', type: 'guest', label: '1' },
  { id: 'gray', name: '灰貓', type: 'cat', color: 'gray' },
  { id: 'guest2', name: '2號客人', type: 'guest', label: '2' },
  { id: 'black', name: '黑貓', type: 'cat', color: 'black' }
]

const level11Units = [
  { id: 'orange', name: '橘貓', type: 'cat', color: 'orange' },
  { id: 'gray', name: '灰貓', type: 'cat', color: 'gray' },
  { id: 'black', name: '黑貓', type: 'cat', color: 'black' },
  { id: 'lightYellow', name: '淺黃貓', type: 'cat', color: 'lightYellow' },
  { id: 'calico', name: '三花貓', type: 'cat', color: 'calico' },
  { id: 'white', name: '白貓', type: 'cat', color: 'white' }
]

const coverLeaves = Array.from({ length: 28 }, (_, index) => ({
  id: `leaf-${index}`,
  left: `${(index * 37) % 100}%`,
  delay: `${-(index % 14) * 0.55}s`,
  duration: `${7 + (index % 6) * 0.8}s`,
  drift: `${(index % 2 === 0 ? 1 : -1) * (26 + (index % 5) * 12)}px`,
  scale: `${0.72 + (index % 5) * 0.08}`,
  spin: `${(index % 2 === 0 ? 1 : -1) * (160 + index * 16)}deg`
}))

function makeNestCats() {
  const cats = [
    ['orange', '橘貓'],
    ['gray', '灰貓'],
    ['black', '黑貓'],
    ['white', '白貓'],
    ['lightYellow', '淺黃貓'],
    ['calico', '三花貓'],
    ['brown', '棕貓'],
    ['deepRed', '深紅貓'],
    ['coal', '煤炭貓'],
    ['cream', '奶油貓']
  ]
  return cats.map(([color, name]) => ({
    id: `nest-${color}`,
    name,
    type: 'cat',
    color
  }))
}

const levels = [
  {
    scene: 'a',
    title: '關卡 1 | 讓貓咪動起來',
    goal: 'display: flex',
    story: '橘貓和黑貓站在貓架木板上。請在外容器加上語法，讓貓咪們動起來。',
    units: pairCats,
    base: {},
    target: { display: 'flex' },
    required: { display: 'flex' },
    menuGroups: []
  },
  {
    scene: 'a',
    title: '關卡 2 | 走向貓架中央',
    goal: 'justify-content: center',
    story: '橘貓跟在黑貓後面，請讓兩隻貓一起往中間走。',
    units: pairCats,
    base: { display: 'flex' },
    target: { display: 'flex', 'justify-content': 'center' },
    required: { 'justify-content': 'center' },
    menuGroups: ['justify-content'],
    carryFromPrevious: true
  },
  {
    scene: 'a',
    title: '關卡 3 | 橘貓超車',
    goal: 'flex-direction: row-reverse',
    story: '橘貓和黑貓要換方向，讓橘貓跑到前面。',
    units: pairCats,
    base: { display: 'flex' },
    target: { display: 'flex', 'flex-direction': 'row-reverse' },
    required: { 'flex-direction': 'row-reverse' },
    menuGroups: ['flex-direction'],
    carryFromPrevious: true
  },
  {
    scene: 'a',
    title: '關卡 4 | 各站一邊',
    goal: 'justify-content: space-between',
    story: '請讓兩隻貓分別靠在兩端，保持最大距離。',
    units: pairCats,
    base: { display: 'flex' },
    target: { display: 'flex', 'justify-content': 'space-between' },
    required: { 'justify-content': 'space-between' },
    menuGroups: ['justify-content'],
    carryFromPrevious: true
  },
  {
    scene: 'a',
    title: '關卡 5 | 中層道歉',
    goal: 'align-items: center',
    story: '黑貓覺得自己錯了，於是跑去找橘貓道歉。',
    units: pairCats,
    base: { display: 'flex' },
    target: { display: 'flex', 'align-items': 'center' },
    required: { 'align-items': 'center' },
    menuGroups: ['align-items'],
    carryFromPrevious: true
  },
  {
    scene: 'a',
    title: '關卡 6 | 跳到地板上班',
    goal: 'align-items: flex-end',
    story: '兩貓和好後從貓爬架跳到地板開始上班。',
    units: pairCats,
    base: { display: 'flex' },
    target: { display: 'flex', 'align-items': 'flex-end' },
    required: { 'align-items': 'flex-end' },
    menuGroups: ['align-items'],
    carryFromPrevious: true
  },
  {
    scene: 'b',
    title: '關卡 7 | 白貓待命',
    goal: '水平垂直置中',
    story: '請把白貓放到房間正中央。',
    units: [{ id: 'white', name: '白貓', type: 'cat', color: 'white' }],
    base: { display: 'flex' },
    layerStyle: { inset: '1% 0 1% 0' },
    unitSize: '96px',
    target: { display: 'flex', 'justify-content': 'center', 'align-items': 'center' },
    required: { 'justify-content': 'center', 'align-items': 'center' },
    menuGroups: ['justify-content', 'align-items']
  },
  {
    scene: 'b',
    title: '關卡 8 | 兩桌客人',
    goal: '主軸與交錯軸運用',
    story: '橘貓、1號客人、灰貓、2號客人、黑貓要依照提示排好。',
    units: cafeGuests,
    base: { display: 'flex' },
    layerStyle: { inset: '1% 0 1% 0' },
    unitSize: '92px',
    target: { display: 'flex', 'flex-direction': 'column', 'justify-content': 'space-between' },
    required: { 'flex-direction': 'column', 'justify-content': 'space-between' },
    menuGroups: ['flex-direction', 'justify-content']
  },
  {
    scene: 'c-1',
    title: '關卡 9 | 一貓一窩',
    goal: 'flex-wrap: wrap',
    story: '貓咪回到貓窩後，請讓牠們自動換行。',
    units: makeNestCats(),
    base: { display: 'flex' },
    target: { display: 'flex', 'flex-wrap': 'wrap' },
    required: { 'flex-wrap': 'wrap' },
    menuGroups: ['flex-wrap'],
    compact: true
  },
  {
    scene: 'c-2',
    title: '關卡 10 | 下排往上靠',
    goal: 'flex-wrap + align-content',
    story: '多行貓咪需要往上靠攏，讓排版更整齊。',
    units: makeNestCats(),
    base: { display: 'flex' },
    target: { display: 'flex', 'flex-wrap': 'wrap', 'align-content': 'flex-start' },
    required: { 'flex-wrap': 'wrap', 'align-content': 'flex-start' },
    menuGroups: ['flex-wrap', 'align-content'],
    compact: true,
    showAlignContentIntro: true
  },
  {
    scene: 'b',
    title: '關卡 11 | 4號桌陪伴',
    goal: '複合運用',
    story: '一名客人已經入座 4 號桌，請安排六隻貓與客人到位。',
    units: level11Units,
    base: { display: 'flex' },
    target: { display: 'flex', 'flex-wrap': 'wrap', 'align-content': 'space-between', 'justify-content': 'center' },
    required: { 'flex-wrap': 'wrap', 'align-content': 'space-between', 'justify-content': 'center' },
    menuGroups: ['flex-wrap', 'align-content', 'justify-content'],
    compact: true,
    largeUnits: true,
    unitSize: '86px',
    layerStyle: { inset: '1% 0 1% 0' },
    fixedUnits: [
      { id: 'guest4', name: '4號客人', type: 'guest', label: '4', left: '15%', top: '81.5%', size: '86px' }
    ]
  }
]

const hasStarted = ref(false)
const currentIndex = ref(0)
const code = ref('')
const completed = reactive(new Set())
const dismissedAlignIntro = reactive(new Set())
const pointer = reactive({ x: 0, y: 0 })
const showCelebration = ref(false)
const openMenu = ref(null)
const pawPrints = ref([])

let audioContext
let ambienceTimers = []
let musicNodes = []
let ambienceStarted = false
let celebrationTimer
let menuCloseTimer
let pawPrintId = 0
const playerUnitElements = new Map()

const currentLevel = computed(() => levels[currentIndex.value])
const parsedRules = computed(() => parseCss(code.value))
const layerStyle = computed(() => currentLevel.value.layerStyle ?? {})
const flexUnits = computed(() => currentLevel.value.units ?? [])
const fixedUnits = computed(() => currentLevel.value.fixedUnits ?? [])
const playerStyle = computed(() => ({ ...layerStyle.value, ...currentLevel.value.base, ...parsedRules.value }))
const targetStyle = computed(() => ({ ...layerStyle.value, ...currentLevel.value.target }))
const activeMenuGroups = computed(() => currentLevel.value.menuGroups ?? [])
const activeHint = computed(() => {
  const missing = Object.entries(currentLevel.value.required).find(([property, value]) => playerStyle.value[property] !== value)
  return propertyHints[missing?.[0] ?? Object.keys(currentLevel.value.required)[0]]
})
const isCorrect = computed(() => {
  const requiredEntries = Object.entries(currentLevel.value.required)
  const hasRequired = requiredEntries.every(([property, value]) => playerStyle.value[property] === value)
  const expectedProperties = new Set(requiredEntries.map(([property]) => property))
  const extraFlexProperties = flexProperties.filter((property) => parsedRules.value[property] && !expectedProperties.has(property))
  return hasRequired && extraFlexProperties.length === 0
})
const sceneImage = computed(() => asset(`scene-${currentLevel.value.scene}.png`))
const sceneClass = computed(() => `scene-${currentLevel.value.scene.replace('-1', '').replace('-2', '')}`)
const showAlignIntro = computed(() => currentLevel.value.showAlignContentIntro && !dismissedAlignIntro.has(currentIndex.value))
const coverMotionStyle = computed(() => ({
  '--pointer-x': `${pointer.x}px`,
  '--pointer-y': `${pointer.y}px`
}))
const celebrationPieces = computed(() => {
  return Array.from({ length: 10 }, (_, index) => ({
    id: `piece-${currentIndex.value}-${index}`,
    left: `${8 + index * 9}%`,
    delay: `${index * 0.06}s`,
    rotation: `${(index % 2 === 0 ? 1 : -1) * (18 + index * 4)}deg`
  }))
})

watch(isCorrect, (passed) => {
  if (!passed) return
  completed.add(currentIndex.value)
  triggerCelebration()
})

watch(currentIndex, (index, previousIndex) => {
  const nextLevelData = levels[index]
  if (nextLevelData.carryFromPrevious && previousIndex !== undefined) {
    code.value = rulesToCss(levels[previousIndex].required)
    return
  }
  code.value = ''
})

onMounted(() => {
  startAmbience()
  document.addEventListener('pointerdown', handleSnippetOutsidePointer)
})

onBeforeUnmount(() => {
  stopAmbience()
  document.removeEventListener('pointerdown', handleSnippetOutsidePointer)
  if (celebrationTimer) window.clearTimeout(celebrationTimer)
  if (menuCloseTimer) window.clearTimeout(menuCloseTimer)
})

function parseCss(input) {
  return input
    .split(';')
    .map((rule) => rule.trim())
    .filter(Boolean)
    .reduce((rules, rule) => {
      const [rawProperty, ...rawValue] = rule.split(':')
      if (!rawProperty || rawValue.length === 0) return rules
      rules[rawProperty.trim().toLowerCase()] = rawValue.join(':').trim().replace(/\s+/g, ' ')
      return rules
    }, {})
}

function rulesToCss(rules) {
  return Object.entries(rules)
    .filter(([property]) => property !== 'display')
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n')
}

function replaceOption(group, value) {
  const nextRules = { ...parsedRules.value, [group]: value }
  applyCode(rulesToCss(nextRules))
  openMenu.value = null
  if (menuCloseTimer) window.clearTimeout(menuCloseTimer)
}

function openSnippetMenu(group) {
  if (menuCloseTimer) window.clearTimeout(menuCloseTimer)
  openMenu.value = group
}

function scheduleSnippetMenuClose() {
  if (menuCloseTimer) window.clearTimeout(menuCloseTimer)
  menuCloseTimer = window.setTimeout(() => {
    openMenu.value = null
  }, 1000)
}

function cancelSnippetMenuClose() {
  if (menuCloseTimer) window.clearTimeout(menuCloseTimer)
}

function handleSnippetOutsidePointer(event) {
  if (!event.target.closest?.('.snippet-menu')) scheduleSnippetMenuClose()
}

function goToLevel(index) {
  const before = capturePlayerRects()
  currentIndex.value = index
  nextTick(() => animatePlayerUnits(before))
}

function nextLevel() {
  if (currentIndex.value < levels.length - 1) goToLevel(currentIndex.value + 1)
}

function clearCode() {
  applyCode('')
}

function dismissAlignIntro() {
  dismissedAlignIntro.add(currentIndex.value)
}

function startGame() {
  hasStarted.value = true
  startAmbience()
}

function updatePointer(event) {
  pointer.x = event.clientX
  pointer.y = event.clientY
}

function updateCode(value) {
  applyCode(value)
}

function getCatSprite(color) {
  return catArtSources[color] ?? catArtSources.orange
}

function getTargetColor(unit) {
  if (unit.type === 'guest') return 'rgba(102, 125, 145, 0.48)'
  return targetColors[unit.color] ?? 'rgba(255, 249, 232, 0.34)'
}

function unitInlineStyle(unit) {
  const style = {}
  if (currentLevel.value.largeUnits || currentLevel.value.unitSize) {
    const size = currentLevel.value.unitSize ?? '76px'
    style.width = size
    style.height = size
  }
  if (currentLevel.value.unitGap) style.margin = currentLevel.value.unitGap
  if (unit) style['--target-color'] = getTargetColor(unit)
  return style
}

function fixedUnitStyle(unit) {
  const size = unit.size ?? currentLevel.value.unitSize ?? '76px'
  return {
    left: unit.left,
    top: unit.top,
    width: size,
    height: size,
    '--target-color': getTargetColor(unit)
  }
}

function setPlayerUnitRef(id, element) {
  if (element) {
    playerUnitElements.set(id, element)
    return
  }
  playerUnitElements.delete(id)
}

function capturePlayerRects() {
  const rects = new Map()
  playerUnitElements.forEach((element, id) => {
    rects.set(id, element.getBoundingClientRect())
  })
  return rects
}

function applyCode(value) {
  const before = capturePlayerRects()
  code.value = value
  nextTick(() => animatePlayerUnits(before))
}

function animatePlayerUnits(before) {
  playerUnitElements.forEach((element, id) => {
    const first = before.get(id)
    if (!first) return
    const last = element.getBoundingClientRect()
    const deltaX = first.left - last.left
    const deltaY = first.top - last.top
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return
    element.animate(
      [
        { transform: `translate(${deltaX}px, ${deltaY}px)` },
        { transform: 'translate(0, 0)' }
      ],
      { duration: 260, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
    )
  })
}

function handleAppPointerDown(event) {
  addPawPrint(event.clientX, event.clientY)
}

function addPawPrint(x, y) {
  const id = ++pawPrintId
  pawPrints.value.push({
    id,
    x,
    y,
    rotate: `${Math.round(Math.random() * 42 - 21)}deg`
  })
  window.setTimeout(() => {
    pawPrints.value = pawPrints.value.filter((print) => print.id !== id)
  }, 720)
}

function handleUnitClick(unit, event) {
  addPawPrint(event.clientX, event.clientY)
  if (unit.type === 'cat') playCatMeow()
}

function playCatMeow() {
  startAmbience()
  if (!audioContext) return
  audioContext.resume?.()
  const now = audioContext.currentTime
  const gain = audioContext.createGain()
  const oscillator = audioContext.createOscillator()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(720, now)
  oscillator.frequency.exponentialRampToValueAtTime(480, now + 0.12)
  oscillator.frequency.exponentialRampToValueAtTime(820, now + 0.22)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)
  oscillator.connect(gain).connect(audioContext.destination)
  oscillator.start(now)
  oscillator.stop(now + 0.3)
}

function triggerCelebration() {
  showCelebration.value = false
  if (celebrationTimer) window.clearTimeout(celebrationTimer)
  requestAnimationFrame(() => {
    showCelebration.value = true
    celebrationTimer = window.setTimeout(() => {
      showCelebration.value = false
    }, 1500)
  })
}

function startAmbience() {
  if (ambienceStarted && audioContext) {
    audioContext.resume?.()
    return
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return

  audioContext = new AudioContextClass()
  ambienceStarted = true
  const masterGain = audioContext.createGain()
  masterGain.gain.value = 0.035
  masterGain.connect(audioContext.destination)

  const musicGain = audioContext.createGain()
  musicGain.gain.value = 0.22
  musicGain.connect(masterGain)

  ;[261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = index === 0 ? 'sine' : 'triangle'
    oscillator.frequency.value = frequency
    gain.gain.value = index === 0 ? 0.08 : 0.035
    oscillator.connect(gain).connect(musicGain)
    oscillator.start()
    musicNodes.push(oscillator, gain)
  })

  const playCafeNote = () => {
    if (!audioContext) return
    const now = audioContext.currentTime
    const notes = [523.25, 587.33, 659.25, 783.99, 880]
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = notes[Math.floor(Math.random() * notes.length)]
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
    oscillator.connect(gain).connect(musicGain)
    oscillator.start(now)
    oscillator.stop(now + 1.9)
  }

  ambienceTimers = [window.setInterval(playCafeNote, 3600)]
  window.setTimeout(playCafeNote, 500)
}

function stopAmbience() {
  ambienceTimers.forEach((timer) => window.clearInterval(timer))
  ambienceTimers = []
  musicNodes.forEach((node) => {
    try {
      node.stop?.()
      node.disconnect?.()
    } catch {
      node.disconnect?.()
    }
  })
  musicNodes = []
  audioContext?.close()
  audioContext = undefined
  ambienceStarted = false
}
</script>

<template>
  <main v-if="!hasStarted" class="cover-screen" :style="coverMotionStyle" @pointermove="updatePointer" @pointerdown="startAmbience">
    <img :src="asset('cover.png')" alt="" class="cover-image" />
    <div class="cover-leaves" aria-hidden="true">
      <span
        v-for="leaf in coverLeaves"
        :key="leaf.id"
        class="cover-leaf"
        :style="{
          '--leaf-left': leaf.left,
          '--leaf-delay': leaf.delay,
          '--leaf-duration': leaf.duration,
          '--leaf-drift': leaf.drift,
          '--leaf-scale': leaf.scale,
          '--leaf-spin': leaf.spin
        }"
      ></span>
    </div>
    <section class="cover-copy">
      <p>Cat Cafe Manager</p>
      <h1>貓咪午茶時光</h1>
      <span>森林咖啡廳的第一個營業日，從安排貓咪的位置開始。</span>
      <button type="button" @click="startGame">開始營業</button>
      <small>封面會先播放輕柔的咖啡廳 loop，進入後也會持續播放。</small>
    </section>
  </main>

  <main v-else class="app-shell" @pointerdown="handleAppPointerDown">
    <aside class="control-panel">
      <header class="brand">
        <div>
          <p>Cat Cafe Manager</p>
          <h1>貓咪午茶時光</h1>
        </div>
        <span>{{ currentIndex + 1 }}/{{ levels.length }}</span>
      </header>

      <nav class="level-nav" aria-label="關卡選擇">
        <button
          v-for="(level, index) in levels"
          :key="level.title"
          class="level-dot"
          :class="{ active: index === currentIndex, done: completed.has(index) }"
          type="button"
          @click="goToLevel(index)"
        >
          {{ index + 1 }}
        </button>
      </nav>

      <section class="brief">
        <h2>{{ currentLevel.title }}</h2>
        <p>{{ currentLevel.story }}</p>
      </section>

      <section v-if="activeMenuGroups.length" class="snippet-toolbar" aria-label="語法選單">
        <div
          v-for="group in activeMenuGroups"
          :key="group"
          class="snippet-menu"
          :class="{ open: openMenu === group }"
          @mouseenter="openSnippetMenu(group)"
          @mouseleave="scheduleSnippetMenuClose"
          @focusin="openSnippetMenu(group)"
          @focusout="scheduleSnippetMenuClose"
        >
          <button class="snippet-trigger" type="button">
            <span>{{ group }}</span>
            <span aria-hidden="true">copy</span>
          </button>
          <div class="snippet-list" @mouseenter="cancelSnippetMenuClose" @mouseleave="scheduleSnippetMenuClose">
            <button v-for="value in propertyOptions[group]" :key="value" type="button" @click="replaceOption(group, value)">
              {{ value }}
            </button>
          </div>
        </div>
      </section>

      <section class="editor-card">
        <div class="editor-head">
          <span>.cafe-floor {</span>
          <button type="button" @click="clearCode">清空</button>
        </div>
        <pre v-if="currentIndex > 0" class="locked-rule">  display: flex;</pre>
        <textarea :value="code" spellcheck="false" aria-label="CSS 輸入區" placeholder="  請輸入 CSS 語法" @input="updateCode($event.target.value)"></textarea>
        <div class="editor-foot">}</div>
      </section>

      <footer class="actions">
        <div class="hint-menu">
          <button class="hint-button" type="button" :disabled="isCorrect">提示燈泡</button>
          <p>{{ activeHint }}</p>
        </div>
        <button class="next-button" type="button" :disabled="!isCorrect || currentIndex === levels.length - 1" @click="nextLevel">
          下一關
        </button>
      </footer>

      <p class="check-status" :class="{ pass: isCorrect }">
        自動檢查：{{ isCorrect ? '完成，可以前往下一關。' : '調整中，請讓物件與目標位置重合。' }}
      </p>
    </aside>

    <section class="play-panel">
      <div class="stage-wrap" :class="sceneClass">
        <div class="stage-title">
          <strong>目標影子</strong>
          <span :class="{ pass: isCorrect }">{{ isCorrect ? '完成' : '調整中' }}</span>
        </div>

        <div class="stage" :class="[sceneClass, { compact: currentLevel.compact }]">
          <img :src="sceneImage" alt="" class="scene-bg" />
          <div class="ambient-layer" aria-hidden="true">
            <span v-for="index in 8" :key="`ambient-${index}`" class="sparkle"></span>
            <span v-for="index in 6" :key="`ambient-paw-${index}`" class="ambient-paw"></span>
            <span v-for="index in 3" :key="`ambient-cat-${index}`" class="ambient-cat"></span>
          </div>
          <div class="flex-layer target-layer" :style="targetStyle">
            <div
              v-for="unit in flexUnits"
              :key="`target-${unit.id}`"
              class="unit target"
              :class="[unit.type, unit.color]"
              :style="unitInlineStyle(unit)"
            ></div>
          </div>
          <div class="flex-layer player-layer" :style="playerStyle">
            <div
              v-for="unit in flexUnits"
              :key="unit.id"
              :ref="(element) => setPlayerUnitRef(unit.id, element)"
              class="unit"
              :class="[unit.type, unit.color]"
              :title="unit.name"
              :style="unitInlineStyle(unit)"
              @pointerdown.stop
              @click.stop="handleUnitClick(unit, $event)"
            >
              <span v-if="unit.type === 'guest'">客</span>
              <img
                v-else
                class="cat-art-image"
                :src="getCatSprite(unit.color)"
                :alt="unit.name"
                aria-hidden="true"
              />
              <small>{{ unit.label ?? unit.name }}</small>
            </div>
          </div>

          <div v-if="fixedUnits.length" class="fixed-layer" aria-hidden="false">
            <div
              v-for="unit in fixedUnits"
              :key="`fixed-${unit.id}`"
              class="unit fixed-unit"
              :class="[unit.type, unit.color]"
              :title="unit.name"
              :style="fixedUnitStyle(unit)"
              @pointerdown.stop
              @click.stop="handleUnitClick(unit, $event)"
            >
              <span v-if="unit.type === 'guest'">客</span>
              <img
                v-else
                class="cat-art-image"
                :src="getCatSprite(unit.color)"
                :alt="unit.name"
                aria-hidden="true"
              />
              <small>{{ unit.label ?? unit.name }}</small>
            </div>
          </div>

          <div v-if="showCelebration" class="celebration-layer" aria-hidden="true">
            <span
              v-for="piece in celebrationPieces"
              :key="piece.id"
              class="celebration-paw"
              :style="{ left: piece.left, animationDelay: piece.delay, rotate: piece.rotation }"
            ></span>
            <span v-for="index in 14" :key="`confetti-${index}`" class="celebration-confetti"></span>
          </div>

          <dialog :open="showAlignIntro" class="concept-dialog">
            <h2>align-content</h2>
            <p>align-content 跟 justify-content 很像，只是它處理的是交錯軸上多行內容的排列。</p>
            <button type="button" @click="dismissAlignIntro">我知道了</button>
          </dialog>
        </div>
      </div>
    </section>

    <div class="paw-click-layer" aria-hidden="true">
      <span
        v-for="print in pawPrints"
        :key="print.id"
        class="paw-print"
        :style="{ left: `${print.x}px`, top: `${print.y}px`, rotate: print.rotate }"
      ></span>
    </div>
  </main>
</template>
