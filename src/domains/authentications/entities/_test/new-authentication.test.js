const NewAuthentication = require('../new-authentication')

describe('NewAuthentication entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      accessToken: 'accessToken'
    }

    expect(() => new NewAuthentication(payload)).toThrow(Error('NEW_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specifiacation', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 123
    }

    expect(() => new NewAuthentication(payload)).toThrow(Error('NEW_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create newAuthentication object correctly', () => {
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    }

    const { accessToken, refreshToken } = new NewAuthentication(payload)

    expect(accessToken).toEqual(payload.accessToken)
    expect(refreshToken).toEqual(payload.refreshToken)
  })
})
