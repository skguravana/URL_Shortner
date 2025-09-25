import fs from 'fs';
import path from 'path';

// Log file path
const logFile = path.join(process.cwd(), 'shortener.log'); // current working directory

export const log = (level, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;

  // Append log to file
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Failed to write log:', err);
  });

};
