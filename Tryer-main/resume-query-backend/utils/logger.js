const format = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
};

const logger = {
  info: (message) => console.info(format('info', message)),
  warn: (message) => console.warn(format('warn', message)),
  error: (message) => console.error(format('error', message)),
};

module.exports = { logger };
