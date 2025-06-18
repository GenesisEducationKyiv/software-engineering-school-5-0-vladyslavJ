import { execSync } from 'child_process';

module.exports = async () => {
  const root = process.cwd();
  execSync('npx ts-node src/scripts/drop-test-db.ts', { cwd: root, stdio: 'inherit' });
};
