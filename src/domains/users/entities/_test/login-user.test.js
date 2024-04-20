const LoginUser = require('../login-user')

describe('LoginUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'alzasyauqi'
    }

    expect(() => new LoginUser(payload)).toThrow(Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: true,
      password: '123'
    }

    expect(() => new LoginUser(payload)).toThrow(Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should create loginUser object correctly', () => {
    const payload = {
      username: 'alzasyauqi',
      password: 'abc'
    }

    const { username, password } = new LoginUser(payload)

    expect(username).toEqual(payload.username)
    expect(password).toEqual(payload.password)
  })
})
