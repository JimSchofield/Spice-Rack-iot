export default class WS {
  constructor(endpoint) {
    this.endpoint = endpoint

    return this
  }

  init(func) {
    this.socket = new WebSocket(`ws://${this.endpoint}:81`)

    this.socket.addEventListener('open', () => { func(this) })

    return this
  }

  emit(str) {
    this.socket.send(str)

    return this
  }
}
