import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

let driver = null;
let configError = null;

/**
 * Initializes the shared Neo4j/CognoDB driver instance if configured.
 * Validates presence of required environment variables without exposing sensitive values.
 */
function initDriver() {
  if (driver) return driver;

  const uri = process.env.COGNODB_URI;
  const user = process.env.COGNODB_USER;
  const password = process.env.COGNODB_PASSWORD;

  const missing = [];
  if (!uri) missing.push('COGNODB_URI');
  if (!user) missing.push('COGNODB_USER');
  if (!password) missing.push('COGNODB_PASSWORD');

  if (missing.length > 0) {
    configError = `Missing required environment variable(s): ${missing.join(', ')}`;
    console.error(`[CognoDB Config] ${configError}`);
    return null;
  }

  try {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    configError = null;
    return driver;
  } catch (err) {
    configError = `Failed to create driver: ${err.message}`;
    console.error(`[CognoDB Config] Driver creation error: ${err.message}`);
    return null;
  }
}

// Initial driver creation attempt on module load
initDriver();

/**
 * Returns the active shared driver instance or attempts re-initialization.
 */
export function getDriver() {
  if (!driver) {
    initDriver();
  }
  return driver;
}

/**
 * Performs a real connectivity verification against the CognoDB instance.
 * Distinguishes between configuration errors and network/database reachability failures.
 *
 * @returns {Promise<{connected: boolean, reason?: 'configuration_error' | 'database_disconnected'}>}
 */
export async function verifyDatabaseConnection() {
  const currentDriver = getDriver();

  if (!currentDriver || configError) {
    return {
      connected: false,
      reason: 'configuration_error',
    };
  }

  try {
    await currentDriver.verifyConnectivity();
    return { connected: true };
  } catch (err) {
    console.error(`[CognoDB Connectivity] Check failed: ${err.message}`);
    return {
      connected: false,
      reason: 'database_disconnected',
    };
  }
}

/**
 * Closes the shared CognoDB driver gracefully on process termination.
 */
export async function closeDatabaseDriver() {
  if (driver) {
    try {
      await driver.close();
      console.log('[CognoDB] Driver closed cleanly.');
    } catch (err) {
      console.error(`[CognoDB] Error closing driver: ${err.message}`);
    } finally {
      driver = null;
    }
  }
}

export default {
  getDriver,
  verifyDatabaseConnection,
  closeDatabaseDriver,
};
