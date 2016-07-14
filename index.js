const events = require('./scripts/events.js')
const playListModule = require('./scripts/playlist.js')

let modal = document.querySelector('.modal-overlay')
let modalContainer = modal.children[0]
let addForm = document.getElementById('add-media-form')
let playlistElement = document.querySelector('#playlist')
let playlistItems = playlistElement.children[0]
let addButton = document.querySelector('.add-button')

// video and audio player
let video = document.getElementById('video-player')

// Button elements
let playButton = document.querySelector('.play i')
let prevButton = document.querySelector('.prev i')
let nextButton = document.querySelector('.next i')
let togglePlaylist = document.querySelector('.toggle-playlist i')
let fullScreenButton = document.querySelector('.fullscreen i')

//progress bar
let progressBar = document.querySelector('.progress-bar')
// Progress indicator
let progressIndicator = document.querySelector('.progress-indicator')

// Close modal
modal.addEventListener('click', (event) => {
  event.target.style = ''
})

// Stop click event propagation on modal
modalContainer.addEventListener('click', (event) => {
  event.stopPropagation()
})

// Open modal dialog for add media
addButton.addEventListener('click', () => {
  modal.style = 'display: flex'
})

// Form submit event
addForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let name = document.getElementsByName('name')[0].value
  let source = document.getElementsByName('source')[0].value
  playListModule.add(name, source)
  modal.click()
})

playlistItems.addEventListener('click', (event) => {
  let el = event.target
  if (el.className === 'media-item') {
    let selectedIndex = parseInt(el.id.split('-')[1])
    events.emit('mediaChange', selectedIndex)
  }
})

const toggleFullScreen = () => {
  if (!document.mozFullScreen && !document.webkitFullScreen) {
    if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else {
      video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else {
      document.webkitCancelFullScreen();
    }
  }
}

// Bind events
video.addEventListener('play', () => events.emit('playingChange', !video.paused))
video.addEventListener('pause', () => events.emit('playingChange', !video.paused))
video.addEventListener('timeupdate', (event) => {
  let progress = video.currentTime / video.duration * 100
  events.emit('progressChange', progress)
})

// Buttons events
playButton.addEventListener('click', (event) => {
  if (video.src) {
    video.paused ? video.play() : video.pause()
  }
})

prevButton.addEventListener('click', (event) => {
  let activeItem = document.querySelector('.media-item.active')
  let selectedIndex = parseInt(activeItem.id.split('-')[1])

  selectedIndex = selectedIndex === 0 ? playlistItems.children.length - 1 : selectedIndex - 1
  events.emit('mediaChange', selectedIndex)
})

nextButton.addEventListener('click', (event) => {
  let activeItem = document.querySelector('.media-item.active')
  let selectedIndex = parseInt(activeItem.id.split('-')[1])

  selectedIndex = selectedIndex === playlistItems.children.length - 1 ? 0 : selectedIndex + 1
  events.emit('mediaChange', selectedIndex)
})

togglePlaylist.addEventListener('click', () => {
  let isVisible = playlistElement.className.indexOf('hidden') !== -1
  events.emit('togglePlaylist', !isVisible)
})

progressBar.addEventListener('click', (event) => {
  if (video.src) {
    let progress = (event.clientX - event.target.offsetLeft) / event.target.offsetWidth * 100
    events.emit('moveProgress', progress)
  }
})

events.on('progressChange', (progress) => {
  progressIndicator.style.width = progress + '%'
  if (progress === 100) nextButton.click()
})

events.on('mediaChange', (index) => {
  let media = playListModule.get(index)
  if (video.src !== media.source) {
    video.pause()
    video.src = media.source
    video.load()

    let activeItem = document.querySelector('.media-item.active')
    if (activeItem) activeItem.className = 'media-item'
    playlistItems.children[index].className = 'media-item active'

    events.emit('progressChange', 0)
    events.emit('playingChange', false)
    video.play()
  }
})

events.on('playingChange', (isPlaying) => {
  let playClassName = isPlaying ? 'fa fa-pause' : 'fa fa-play'
  playButton.className = playClassName
})

events.on('togglePlaylist', (visible) => {
  playlistElement.className = visible ? 'col hidden' : 'col'
})

events.on('moveProgress', (percentage) => {
  let progress = percentage / 100 * video.duration
  video.currentTime = progress
})
