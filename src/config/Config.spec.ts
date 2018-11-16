import { Config } from './Config';
import { ConfigKey } from './ConfigKeys';

describe('Config', () => {
  const getConfigTestKey = (key: string) => {
    // Get a key that only exist in the test configuration (not defined in the enum ConfigKey)
    return key as any as ConfigKey;
  };

  afterEach(() => {
    if (Config['instance']) {
      delete Config['instance'];
    }
  });

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

  it('should cache the config', async () => {
    let loadCallCount = 0;
    let config = Config.getConfig();

    // wrap the load function
    let loadFunc = config['load'];
    config['load'] = function () {
      loadCallCount++;
      return loadFunc.apply(config, arguments);
    }

    // Get the configs then test if the load function was called several times
    await Config.get(getConfigTestKey('TEST_KEY_1'));
    await Config.get(getConfigTestKey('TEST_KEY_1'));
    await Config.get(getConfigTestKey('TEST_KEY_1'));

    expect(loadCallCount).toBe(1);
  });

  it('should return the default folder config', async () => {
    // TODO when dependency injection is solved use it for the FileUtils dependency
    process.env['config'] = "./test/staengrc/test-read";
    const config = await Config.get(getConfigTestKey('TEST_KEY_2'));
    expect(config).toBe("Test Value 2")
  });

  it('should detect wrong configuration', async () => {
    // TODO when dependency injection is solved use it for the FileUtils dependency
    process.env['config'] = "./test/staengrc/test-wrong";
    const config = await Config.get(getConfigTestKey('TEST_KEY_2'));
    expect(config).not.toBeDefined();
  });
});