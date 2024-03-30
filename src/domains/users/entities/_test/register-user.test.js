const RegisterUser = require('../register-user')

describe('A RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // arrange
    const payload = {
      username: 'abc',
      password: 'abc'
    }

    // action and assert
    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'))
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      fullname: true,
      password: 'abc'
    }

    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))
  })

  it('should throw error when username contains more than 50 character', () => {
    const payload = {
      username: 'alzasyauqialzasyauqialzasyauqialzasyauqialzasyauqialzasyauqi',
      fullname: 'Alza Syauqi',
      password: 'abc'
    }

    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.USERNAME_LIMIT_CHAR'))
  })

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'alza syauqi',
      fullname: 'Alza Syauqi',
      password: 'abc'
    }

    expect(() => new RegisterUser(payload)).toThrow(Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'))
  })

  it('should create resgisterUser object correctly', () => {
    const payload = {
      username: 'alzasyauqi',
      fullname: 'Alza Syauqi',
      password: 'abc'
    }

    const { username, fullname, password } = new RegisterUser(payload)

    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
    expect(password).toEqual(payload.password)
  })
})
