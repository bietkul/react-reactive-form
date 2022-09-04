export default class Observable {
  constructor() {
    this.observers = []
  }
  subscribe(fn) {
    this.observers.push(fn)
  }
  unsubscribe(fn) {
    if (fn) {
      this.observers = this.observers.filter(item => {
        if (item !== fn) {
          return item
        }
        return null
      })
    } else {
      this.observers = []
    }
  }
  next(o, thisObj) {
    var scope = thisObj || window
    this.observers.forEach(function(item) {
      item.call(scope, o)
    })
  }
}
