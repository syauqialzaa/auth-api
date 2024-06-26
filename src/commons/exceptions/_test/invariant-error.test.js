const InvariantError = require('../invariant-error')

describe('InvariantError', () => {
  it('should create an error correctly', () => {
    const invariantError = new InvariantError('an error occurs')

    expect(invariantError.statusCode).toEqual(400)
    expect(invariantError.message).toEqual('an error occurs')
    expect(invariantError.name).toEqual('InvariantError')
  })
})
