import { Config } from './Config';
import { ConfigKey } from './ConfigKeys';
describe('Config', () => {
  it('should get the config instance', () => {
    let instance = Config.getConfig();
    expect(instance).toBeDefined();
    expect(Config.getConfig()).toBe(instance);
  });

  it('should get the default configuration file path', () => {
    process.env['config'] = "";
    let file = Config.getConfig().getConfigFilePath();
    expect(file).toBe(`./.staengrc`)

    process.env['config'] = "./test/staengrc/test-read";
    file = Config.getConfig().getConfigFilePath();
    expect(file).toBe(`./test/staengrc/test-read/.staengrc`)
  });

  it('should get the base path', () => {
    process.env['config'] = "";
    let path = Config.getConfig().getBasePath();
    expect(path).toBe(`.`);

    process.env['config'] = "./test/staengrc/test-read";
    path = Config.getConfig().getBasePath();
    expect(path).toBe(`./test/staengrc/test-read`);
  });

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