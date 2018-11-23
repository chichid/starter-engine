import { Injector } from "@core/di/Module";
import { ConfigModule, ConfigKey, Config } from ".";

describe("Config", () => {
  const getConfigTestKey = (key: string) => {
    // Get a key that only exist in the test configuration (not defined in the enum ConfigKey)
    return (key as any) as ConfigKey;
  };

  const fixture = (): Config => {
    const instance = Injector(ConfigModule).create(Config);
    return instance;
  };

  it("should create the config instance", () => {
    const instance = fixture();
    expect(instance).toBeDefined();
  });

  it("should get the default configuration file path", () => {
    process.env["config"] = "";
    const instance = fixture();
    let file = instance.getConfigFilePath();
    expect(file).toBe("./.staengrc");

    process.env["config"] = "./test/staengrc/test-read";
    file = instance.getConfigFilePath();
    expect(file).toBe("./test/staengrc/test-read/.staengrc");
  });

  it("should get the base path", () => {
    process.env["config"] = "";
    const instance = fixture();
    let path = instance.getBasePath();
    expect(path).toBe(".");

    process.env["config"] = "./test/staengrc/test-read";
    path = instance.getBasePath();
    expect(path).toBe("./test/staengrc/test-read");
  });

  it("should cache the config", async () => {
    let loadCallCount = 0;
    const instance = fixture();

    // wrap the load function
    const loadFunc = instance["load"];
    instance["load"] = function() {
      loadCallCount = loadCallCount + 1;
      return loadFunc.apply(instance, arguments);
    };

    // Get the configs then test if the load function was called several times
    await instance.get(getConfigTestKey("TEST_KEY_1"));
    await instance.get(getConfigTestKey("TEST_KEY_1"));
    await instance.get(getConfigTestKey("TEST_KEY_1"));

    expect(loadCallCount).toBe(1);
  });

  it("should return the default folder config", async () => {
    const instance = fixture();
    process.env["config"] = "./test/staengrc/test-read";
    const config = await instance.get(getConfigTestKey("TEST_KEY_2"));
    expect(config).toBe("Test Value 2");
  });

  it("should detect wrong configuration", async () => {
    const instance = fixture();
    process.env["config"] = "./test/staengrc/test-error";
    const config = await instance.get(getConfigTestKey("TEST_KEY_2"));
    expect(config).not.toBeDefined();
  });
});
