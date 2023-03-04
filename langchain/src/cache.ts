import { Generation } from "./llms/index.js";

// more "edge friendly" hashing algo
function hashCode(input: string): number {
    var hash = 0;
    for (var i = 0; i < input.length; i++) {
        var code = input.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash;
    }
    return hash;
}

// Takes in an arbitrary number of strings and returns a hash of them
// that can be used as a key in a cache.
export const getKey = (...strings: string[]): string => {
  return String(
    strings.reduce(
      (accumulator, currentValue) => accumulator + hashCode(currentValue),
      0
    )
  );
};

export abstract class BaseCache<T = Generation[]> {
  abstract lookup(key: string): T | undefined;

  abstract update(key: string, value: T): void;
}

export class InMemoryCache<T = Generation[]> extends BaseCache<T> {
  private cache: Record<string, T>;

  constructor() {
    super();
    this.cache = {};
  }

  lookup(key: string) {
    return this.cache[key];
  }

  update(key: string, value: T) {
    this.cache[key] = value;
  }
}
