const ClientError = require('../client-error')

describe('ClientError', () => {
  it('should throw error when directly use it', () => {
    expect(() => new ClientError('')).toThrow(Error('cannot instantiate abstract class'))
  })
})
