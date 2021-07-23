export function unreachable(
  _value: never,
  message = "Entered unreachable code"
) {
  throw Error(message);
}

export class Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (error: unknown) => void;

  constructor() {
    let resolve_: (value: T) => void;
    let reject_: (error: unknown) => void;

    this.promise = new Promise((resolve, reject) => {
      resolve_ = resolve;
      reject_ = reject;
    });

    this.resolve = resolve_!;
    this.reject = reject_!;
  }
}

type OnceState =
  | { type: "init" }
  | { type: "executing"; promise: Promise<void> }
  | { type: "done" };
export class Once {
  private state: OnceState = { type: "init" };

  async execute(fn: () => PromiseLike<void>): Promise<void> {
    while (true) {
      if (this.state.type === "done") {
        return;
      } else if (this.state.type === "executing") {
        await this.state.promise;
        continue;
      } else if (this.state.type !== "init") {
        unreachable(this.state);
      } else {
        const def = new Deferred<void>();
        this.state = {
          type: "executing",
          promise: def.promise,
        };

        try {
          await fn();
          this.state = { type: "done" };
          return;
        } catch (err) {
          this.state = { type: "init" };
          throw err;
        } finally {
          def.resolve();
        }
      }
    }
  }
}

const LAZY_NOT_CREATED = Symbol("LAZY_NOT_CREATED");
export class Lazy<T> {
  private valueOrOnce: T | Once = new Once();

  constructor(private factory: () => PromiseLike<T>) {}

  async value(): Promise<T> {
    const once = this.valueOrOnce;
    if (typeof once !== "object" || !(once instanceof Once)) {
      return once;
    }

    let value: T;
    await once.execute(async () => {
      value = this.valueOrOnce = await this.factory();
    });
    return this.value;
  }
}
