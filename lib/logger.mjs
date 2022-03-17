export const Colors = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

export function logError(message) {
  console.log(`${ Colors.red }ERROR:${ Colors.reset } ${ message }`);
}

export function logWarn(message) {
  console.log(`${ Colors.yellow }WARN:${ Colors.reset } ${ message }`);
}

export function logInfo(message) {
  console.log(message);
}
