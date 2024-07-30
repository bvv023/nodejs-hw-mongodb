// src/format-json.js
if (typeof process !== 'undefined' && process.stdin) {
  process.stdin.on('data', function (data) {
    try {
      const json = JSON.parse(data.toString());
      console.log(JSON.stringify(json, null, 2));
    } catch (error) {
      console.error('Invalid JSON input');
    }
  });
} else {
  console.error('This script should be run with Node.js');
}
