import fs from 'fs';
import path from 'path';

/**
 * A simple file-based logger to track news fetching activity.
 * Writes to a 'mora-fetch.log' file in the project root.
 */
export function logFetchActivity(
  totalItems: number,
  sourceReports: { source: string; itemCount: number; urls: string[]; success: boolean; error?: string }[]
) {
  const isVercel = process.env.VERCEL === '1';
  const logFile = isVercel 
    ? path.join('/tmp', 'mora-fetch.log')
    : path.join(process.cwd(), 'mora-fetch.log');
    
  const timestamp = new Date().toLocaleString();
  
  let logContent = `\n[${timestamp}] --- NEW FETCH SESSION ---\n`;
  logContent += `Total Items Compiled: ${totalItems}\n`;
  logContent += `Detailed Source Reports:\n`;

  sourceReports.forEach((report) => {
    logContent += `  [${report.source}] Status: ${report.success ? 'SUCCESS' : 'FAILED'}\n`;
    logContent += `    Items: ${report.itemCount}\n`;
    if (report.error) {
      logContent += `    Error: ${report.error}\n`;
    }
    logContent += `    Paths Fetched (${report.urls.length}):\n`;
    report.urls.forEach(url => {
      logContent += `      - ${url}\n`;
    });
  });

  logContent += `--------------------------------------\n`;

  try {
    fs.appendFileSync(logFile, logContent, 'utf8');
    console.log(`Log: Fetch activity written to ${logFile}`);
  } catch (err) {
    console.error('Failed to write fetch log:', err);
  }
}
