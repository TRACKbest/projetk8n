/* Lightweight structured logger (no external deps). */
const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = levels[(process.env.LOG_LEVEL || 'info').toLowerCase()] ?? 2;

const log = (level, ...args) => {
  if (levels[level] > currentLevel) return;
  const time = new Date().toISOString();
  const prefix = `[${time}] [${level.toUpperCase()}]`;
  // eslint-disable-next-line no-console
  (console[level] || console.log)(prefix, ...args);
};

module.exports = {
  error: (...a) => log('error', ...a),
  warn: (...a) => log('warn', ...a),
  info: (...a) => log('info', ...a),
  debug: (...a) => log('debug', ...a),
};
