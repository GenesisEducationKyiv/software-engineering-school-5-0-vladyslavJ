import { execSync } from 'child_process';

module.exports = async () => {
  const root = process.cwd();
  execSync('npm run db:create:test:docker', { cwd: root, stdio: 'inherit' });
  execSync('npm run migration:run', { cwd: root, stdio: 'inherit' });
};
