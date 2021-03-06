import WS from './websockets'

export default class SpiceRack {
  constructor() {
    this.ws = new WS('192.168.1.12')
      .init(ws => {
        console.log('WS: connected!')
        this.initialSetup()
      })

    return this
  }

  set position(val) {
    this._position = val
  }

  get position() {
    return this._position
  }

  initialSetup() {
    // default board LED state
    this.boardLED = false
    this.ws.emit('Off')

    // default pusher position
    this.position = 0
    this.direction = 'l'

    // SpiceArray
    this.spiceArray = []

    // Callback Stack
    this.callbackStack = []

    // When spicerack sends a "finished" message
    // this.ws.socket.addEventListener('message', console.log)
  }

  startFetching(spiceArray) {
    this.spiceArray = spiceArray

    const spiceLocationArray = this.spiceArray.map(spice => spice.position)

    const returnLocationPromise = (position, last = false) => {
      return new Promise(resolve => {
        const handleMoveEnd = event => {
          console.log(event, ' **FINISHED**')
          this.ws.socket.removeEventListener('message', handleMoveEnd)

          this.push()

          setTimeout(() => {
            if (last) {
              console.log('last...')
              this.to(0)
            }
            resolve()
          }, 2000)
        }

        this.ws.socket.addEventListener('message', handleMoveEnd)

        // pusher is 3cm above shuttle position
        this.to(position - 3)
      })
    }

    spiceLocationArray.reduce((previousPromise, nextPosition, currentIndex) => {
      return previousPromise.then(() => {
        return returnLocationPromise(nextPosition, currentIndex === spiceLocationArray.length - 1)
      })
    }, Promise.resolve())
  }

  toggleLED() {
    if (this.boardLED) {
      this.boardLED = false
      this.ws.emit('Off')
    } else {
      this.boardLED = true
      this.ws.emit('On')
    }
  }

  to(cmPosition, force = false) {
    const delta = Number(cmPosition) - this.position
    const steps = Math.abs(delta) / 4 * 1600
    if (delta < 0) {
      this.direction = 'r'
    } else {
      this.direction = 'l'
    }

    const newPosition = this.position + delta

    // guard against shuttle colliding with holders
    if (
      (this.position + delta < 0 ||
        this.position + delta > 50) && !force) {
      throw new Error('Spice rack is trying to go too far')
    }

    this.position = newPosition

    this.ws.emit(this.direction + ':' + steps)
    console.log(this.direction + ':' + steps)
  }

  push() {
    this.ws.emit('s')

    setTimeout(() => {
      this.ws.emit('x')
    }, 500)
  }
}
