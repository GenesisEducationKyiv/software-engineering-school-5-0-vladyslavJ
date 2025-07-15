import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Ports and Adapters Architecture Compliance', () => {
  const srcFiles = () => filesOfProject().inFolder('src');

  it('Domain layer should not depend on any other layer', () => {
    const rule = srcFiles()
      .inFolder('domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('application')
      .inFolder('infrastructure');

    return expect(rule).toPassAsync();
  });

  it('Application layer should depend only on Domain', () => {
    const rule = srcFiles()
      .inFolder('application')
      .shouldNot()
      .dependOnFiles()
      .inFolder('infrastructure');

    return expect(rule).toPassAsync();
  });

  it('All layers should be free of cycles', () => {
    const domainCycleFree = srcFiles().inFolder('domain').should().beFreeOfCycles();
    const applicationCycleFree = srcFiles().inFolder('application').should().beFreeOfCycles();

    return Promise.all([
      expect(domainCycleFree).toPassAsync(),
      expect(applicationCycleFree).toPassAsync(),
    ]);
  });
});
