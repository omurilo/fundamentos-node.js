const EventEmitter = require('events');

class Emitter extends EventEmitter {};

const myEmitter = new Emitter();

const eventName = 'user:click';

// myEmitter.on(eventName, function (click) {
//   console.log('user clicked', click);
// });

// myEmitter.emit(eventName, 'on scrollbar');

// let count = 0;
// setInterval(function(){
//   myEmitter.emit(eventName, `on OK ${count++}`);
// });

const stdin = process.openStdin()
stdin.addListener('data', function (value) {
  console.log(`você digitou: ${value.toString().trim()}`);
})