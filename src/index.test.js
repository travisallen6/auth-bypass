const fns = require('./index');

describe('withObject tests', () => {
  test('should an error if invoked without a user object as an argument.', () => {
    const result = () => fns.withObject();
    expect(result).toThrowError();
  });

  test('should not throw an error if properly configured with a user object.', () => {
    const user = {
      id: 1,
      name: 'John Doe'
    };
    const result = () => fns.withObject(user);
    expect(result).not.toThrowError();
  });

  test('should not throw an error if called without a configuration object as a second argument.', () => {
    const user = {
      id: 1,
      name: 'John Doe'
    };
    const result = () => fns.withObject(user);
    expect(result).not.toThrowError();
  });
});

describe('withDB Tests.', () => {
  test('should ', () => {});
});
