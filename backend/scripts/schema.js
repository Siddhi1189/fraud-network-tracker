import path from 'path';
import { fileURLToPath } from 'url';
import { getDriver, closeDatabaseDriver } from '../src/config/database.js';

/**
 * Canonical Graph Schema Constraints for Fraud Detection & Money Mule Network Tracker.
 * Scope: 7 Uniqueness constraints: 5 on the primary identifier (`id`) of all canonical fraud-domain
 * node labels, and 2 on application User (`id` and `email`).
 */
const REQUIRED_CONSTRAINTS = [
  {
    name: 'constraint_person_id',
    label: 'Person',
    property: 'id',
    statement: 'CREATE CONSTRAINT constraint_person_id IF NOT EXISTS FOR (n:Person) REQUIRE n.id IS UNIQUE',
  },
  {
    name: 'constraint_account_id',
    label: 'Account',
    property: 'id',
    statement: 'CREATE CONSTRAINT constraint_account_id IF NOT EXISTS FOR (n:Account) REQUIRE n.id IS UNIQUE',
  },
  {
    name: 'constraint_device_id',
    label: 'Device',
    property: 'id',
    statement: 'CREATE CONSTRAINT constraint_device_id IF NOT EXISTS FOR (n:Device) REQUIRE n.id IS UNIQUE',
  },
  {
    name: 'constraint_phonenumber_id',
    label: 'PhoneNumber',
    property: 'id',
    statement: 'CREATE CONSTRAINT constraint_phonenumber_id IF NOT EXISTS FOR (n:PhoneNumber) REQUIRE n.id IS UNIQUE',
  },
  {
    name: 'constraint_address_id',
    label: 'Address',
    property: 'id',
    statement: 'CREATE CONSTRAINT constraint_address_id IF NOT EXISTS FOR (n:Address) REQUIRE n.id IS UNIQUE',
  },
  {
    name: 'constraint_user_id',
    label: 'User',
    property: 'id',
    statement: 'CREATE CONSTRAINT constraint_user_id IF NOT EXISTS FOR (n:User) REQUIRE n.id IS UNIQUE',
  },
  {
    name: 'constraint_user_email',
    label: 'User',
    property: 'email',
    statement: 'CREATE CONSTRAINT constraint_user_email IF NOT EXISTS FOR (n:User) REQUIRE n.email IS UNIQUE',
  },
];

/**
 * Initializes and verifies all canonical uniqueness constraints in CognoDB.
 * Idempotent: safe to run multiple times without throwing errors or mutating data.
 */
export async function initializeSchema() {
  const driver = getDriver();

  if (!driver) {
    console.error('Schema initialization failed: Database driver is not initialized or configuration is missing.');
    process.exit(1);
  }

  const session = driver.session();

  try {
    // 1. Create constraints idempotently
    for (const constraint of REQUIRED_CONSTRAINTS) {
      try {
        await session.run(constraint.statement);
      } catch (err) {
        // If constraint already exists, treat as non-fatal
        const msg = (err.message || '').toLowerCase();
        if (msg.includes('already exists') || msg.includes('equivalent constraint')) {
          // Idempotent pass
          continue;
        }
        throw new Error(`Failed to create constraint for ${constraint.label}.${constraint.property}: ${err.message}`);
      }
    }

    // 2. Verify constraints from CognoDB metadata
    const showResult = await session.run('SHOW CONSTRAINTS');
    const existingConstraints = showResult.records.map((record) => {
      const obj = record.toObject();
      return {
        name: obj.name,
        label: obj.label || (Array.isArray(obj.labelsOrTypes) ? obj.labelsOrTypes[0] : obj.labelsOrTypes),
        property: Array.isArray(obj.properties) ? obj.properties[0] : obj.properties,
      };
    });

    const verified = [];
    const missing = [];

    for (const req of REQUIRED_CONSTRAINTS) {
      const match = existingConstraints.find(
        (c) =>
          c.name === req.name ||
          (c.label?.toLowerCase() === req.label.toLowerCase() &&
            c.property?.toLowerCase() === req.property.toLowerCase())
      );

      if (match) {
        verified.push(`${req.label}.${req.property}`);
      } else {
        missing.push(`${req.label}.${req.property}`);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Verification failed. Missing constraints: ${missing.join(', ')}`);
    }

    // 3. Print credential-free success summary
    console.log('Schema initialization successful.\n');
    console.log('Constraints verified:');
    for (const item of verified) {
      console.log(`- ${item}`);
    }

    return true;
  } catch (err) {
    console.error(`Schema initialization error: ${err.message}`);
    process.exitCode = 1;
    return false;
  } finally {
    await session.close();
    await closeDatabaseDriver();
  }
}

// Execute when invoked directly from command line
const currentFilePath = fileURLToPath(import.meta.url);
const invokedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFilePath === currentFilePath) {
  initializeSchema();
}
