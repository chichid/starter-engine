import { Config } from './Config';
import { ConfigKey } from './ConfigKeys';
describe('Config', () => {
  it('should return the default folder config', async () => {
    // TODO when dependency injection is solved use it for the FileUtils dependency
    process.env['config'] = "./test/staengrc/test-read";
    const config = await Config.get('TEST_KEY_2' as any as number);
    expect(config).toBe("Test Value 2")
  });

  it('should detect wrong configuration', async () => {
    // TODO when dependency injection is solved use it for the FileUtils dependency
    process.env['config'] = "./test/staengrc/test-wrong";
    const config = await Config.get('TEST_KEY_2' as any as number);
    expect(config).not.toBeDefined();
    
  });
});