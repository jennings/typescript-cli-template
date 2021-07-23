import { Once } from "./utilities";

describe("Once", () => {
  it("only executes the first successful callback", async () => {
    const once = new Once();
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    await once.execute(async () => {
      fn1();
    });
    await once.execute(async () => {
      fn2();
    });

    expect(fn1).toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  it("executes the next callback if the first one fails asynchronously", async () => {
    const once = new Once();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    await expect(
      once.execute(async () => {
        throw Error();
      })
    ).rejects.toThrow();

    await once.execute(async () => {
      fn2();
    });
    await once.execute(async () => {
      fn3();
    });

    expect(fn2).toHaveBeenCalled();
    expect(fn3).not.toHaveBeenCalled();
  });

  it("executes the next callback if the first one fails synchronously", async () => {
    const once = new Once();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    await expect(
      once.execute(() => {
        throw Error();
      })
    ).rejects.toThrow();

    await once.execute(async () => {
      fn2();
    });
    await once.execute(async () => {
      fn3();
    });

    expect(fn2).toHaveBeenCalled();
    expect(fn3).not.toHaveBeenCalled();
  });
});
