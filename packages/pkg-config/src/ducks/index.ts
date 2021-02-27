interface Dictionary {
  [key: string]: string;
}

class ConfigSingleton {
  #config: Dictionary;
  constructor() {
    this.#config = {};
    this.#config.key = `${Math.random()}`;
  }

  addConfig(obj: Dictionary) {
    this.#config = {
      ...this.#config,
      ...obj,
    };
  }

  getConfig(key?: string) {
    if (!key) {
      return { ...this.#config };
    }
    return this.#config[key];
  }
}

const configStore = new ConfigSingleton();

Object.freeze(configStore);

export { configStore };
