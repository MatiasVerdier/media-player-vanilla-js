const HOLA = 'HOLA'

const playlist = {
  STORAGE_KEY: 'playlist',
  init () {
    this.el = document.querySelector('#playlist .items')
    this.items = []
    this.load()
  },
  load () {
    try {
      this.items = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || []
      this.render()
    } catch (e) {
      this.items = []
      console.log(e)
    }
  },
  add (name, source) {
    this.items.push({ name, source })
    this.save()
  },
  clear () {
    this.items = []
    this.save()
  },
  save () {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items))
      this.render()
    } catch (e) {
      console.log(e)
    }
  },
  remove (item) {

  },
  render () {
    let html = ''
    this.items.forEach((obj, index) => {
      html += `<div id="media-${index}" class="media-item">${obj.name}</div>`
    })

    this.el.innerHTML = html
  },
  get (index) {
    return this.items[index]
  },
  hasItems () {
    return this.items.length > 0
  }
}

playlist.init()

module.exports = playlist
