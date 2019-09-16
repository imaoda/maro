const Events = require('events')
class Ev extends Events {
  trigger () {
    this.emit(...arguments)
  }
}
const center = new Ev()
export default center
