var jsSpark = require('js-spark')({workers: 8});
var task = jsSpark.jsSpark;
var q = jsSpark.q;


var numbers = [];
for (var i = 0; i < 1000000; i++) {
  numbers.push(i);
}
// console.time('Singlethread');

// task(numbers)
//   .map(function (num) {
//     return num + 1;
//   })
//   .reduce(function(num, num2) {
//     return parseInt(num + num2, 10);
//   })
//   .run()
//   .then(function(data) {
//     console.log(data);
//     console.timeEnd('Singlethread');
//   }); 

var entry = [];
for (var i = 0; i < 4; i++) {
  entry.push(numbers.slice(i * 100000, (i + 1) * 100000 -1));
}

console.time('Multithread');
var tasks = entry
  .map(function (tableau) {
    return task(tableau)
      .map(function(num) {
        return num + 1;
      })
      .reduce(function(sum, nextNum) {
        return sum + nextNum;
      })
      .run()
  });

q.
  all(tasks)
  .then(function (responses) {
    const result = responses
      .reduce(function (sum, nextNum) {
        return sum + nextNum;
      });
    console.log(result);
    console.timeEnd('Multithread');
  });