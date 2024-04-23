const RefreshAuthentication = require('../refresh-authentication')

describe('RefreshAuthentication', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {}

    expect(() => new RefreshAuthentication(payload)).toThrow(Error('REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      refreshToken: true
    }

    expect(() => new RefreshAuthentication(payload)).toThrow(Error('REFRESH_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create refreshAuthentication object correctly', () => {
    const payload = {
      refreshToken: 'refreshToken'
    }

    const { refreshToken } = new RefreshAuthentication(payload)

    expect(refreshToken).toEqual(payload.refreshToken)
  })
})
