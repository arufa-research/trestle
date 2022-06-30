import { assert, AssertionError } from "chai";

import { JunokitError } from "../../src/internal/core/errors";
import { ErrorDescriptor } from "../../src/internal/core/errors-list";

export async function expectErrorAsync (
  f: () => Promise<any>,
  matchMessage?: string | RegExp
): Promise<void> {
  const noError = new AssertionError("Async error was expected but no error was thrown");
  const message = `Async error should have had message "${String(matchMessage)}" but got "`;
  const notExactMatch = new AssertionError(message);
  const notRegexpMatch = new AssertionError(message);
  try {
    await f();
  } catch (err) {
    if (matchMessage === undefined) {
      return;
    }
    if (typeof matchMessage === "string") {
      if ((err as Error).message !== matchMessage) {
        notExactMatch.message += `${String((err as Error).message)}"`;
        throw notExactMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
      }
    } else {
      if (matchMessage.exec((err as Error).message) === null) {
        notRegexpMatch.message += `${String((err as Error).message)}"`;
        throw notRegexpMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
      }
    }
    return;
  }
  throw noError; // eslint-disable-line @typescript-eslint/no-throw-literal
}

export function expectJunokitError (
  f: () => any,
  errorDescriptor: ErrorDescriptor,
  matchMessage?: string | RegExp,
  errorMessage?: string
): void {
  try {
    const returnValue = f();
    if (returnValue instanceof Promise) {
      throw new Error("Please use expectJunokitErrorAsync() when working with async code");
    }
  } catch (error) {
    assert.instanceOf(error, JunokitError, errorMessage);
    assert.equal((error as JunokitError).number, errorDescriptor.number, errorMessage);
    assert.notMatch(
      (error as JunokitError).message,
      /%[a-zA-Z][a-zA-Z0-9]*%/,
      "JunokitError has an non-replaced variable tag"
    );

    if (typeof matchMessage === "string") {
      assert.include((error as JunokitError).message, matchMessage, errorMessage);
    } else if (matchMessage !== undefined) {
      assert.match((error as JunokitError).message, matchMessage, errorMessage);
    }

    return;
  }
  throw new AssertionError( // eslint-disable-line @typescript-eslint/no-throw-literal
    `JunokitError number ${errorDescriptor.number} expected, but no Error was thrown`
  );
}

export async function expectJunokitErrorAsync (
  f: () => Promise<any>,
  errorDescriptor: ErrorDescriptor,
  matchMessage?: string | RegExp
): Promise<void> {
  const error = new AssertionError(
    `JunokitError number ${errorDescriptor.number} expected, but no Error was thrown`
  );

  const match = String(matchMessage);
  const notExactMatch = new AssertionError(
    `JunokitError was correct, but should have include "${match}" but got "`
  );

  const notRegexpMatch = new AssertionError(
    `JunokitError was correct, but should have matched regex ${match} but got "`
  );

  try {
    await f();
  } catch (error) {
    assert.instanceOf(error, JunokitError);
    assert.equal((error as JunokitError).number, errorDescriptor.number);
    assert.notMatch(
      (error as JunokitError).message,
      /%[a-zA-Z][a-zA-Z0-9]*%/,
      "JunokitError has an non-replaced variable tag"
    );

    if (matchMessage !== undefined) {
      if (typeof matchMessage === "string") {
        if (!(error as JunokitError).message.includes(matchMessage)) {
          notExactMatch.message += `${String((error as JunokitError).message)}`;
          throw notExactMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
        }
      } else {
        if (matchMessage.exec((error as JunokitError).message) === null) {
          notRegexpMatch.message += `${String((error as JunokitError).message)}`;
          throw notRegexpMatch; // eslint-disable-line @typescript-eslint/no-throw-literal
        }
      }
    }

    return;
  }

  throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
}
