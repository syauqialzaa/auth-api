const DeleteAuthentication = require('../delete-authentication')

describe('DeleteAuthentication entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {}

    expect(() => new DeleteAuthentication(payload)).toThrow(Error('DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      refreshToken: true
    }

    expect(() => new DeleteAuthentication(payload)).toThrow(Error('DELETE_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create deleteAuthentication object correctly', () => {
    const payload = {
      refreshToken: 'refreshToken'
    }

    const { refreshToken } = new DeleteAuthentication(payload)

    expect(refreshToken).toEqual(payload.refreshToken)
  })
})
