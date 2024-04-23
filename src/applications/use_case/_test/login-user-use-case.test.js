const NewAuthentication = require('../../../domains/authentications/entities/new-authentication')
const UserRepository = require('../../../domains/users/user-repository')
const AuthenticationRepository = require('../../../domains/authentications/authentication-repository')
const PasswordHash = require('../../security/password-hash')
const AuthenticationTokenManager = require('../../security/authentication-token-manager')
const LoginUserUseCase = require('../login-user-use-case')

describe('LoginUserUseCase', () => {
  it('should orchestrating the login user action correctly', async () => {
    const useCasePayload = {
      username: 'alzasyauqi',
      password: 'secret'
    }
    const expectedAuthentication = new NewAuthentication({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    })

    const mockUserRepository = new UserRepository()
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockPasswordHash = new PasswordHash()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()

    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.refreshToken))
    mockPasswordHash.compare = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.accessToken))
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.refreshToken))

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      passwordHash: mockPasswordHash,
      authenticationTokenManager: mockAuthenticationTokenManager
    })

    const authenticateUser = await loginUserUseCase.execute(useCasePayload)

    expect(authenticateUser).toStrictEqual(expectedAuthentication)
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith(useCasePayload.username)
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(expectedAuthentication.refreshToken)
    expect(mockPasswordHash.compare).toHaveBeenCalledWith('secret', 'encrypted_password')
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: useCasePayload.username })
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ username: useCasePayload.username })
  })
})
