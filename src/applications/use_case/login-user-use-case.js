const NewAuthentication = require('../../domains/authentications/entities/new-authentication')
const LoginUser = require('../../domains/users/entities/login-user')

class LoginUserUseCase {
  constructor ({
    userRepository,
    authenticationRepository,
    passwordHash,
    authenticationTokenManager
  }) {
    this._userRepository = userRepository
    this._authenticationRepository = authenticationRepository
    this._passwordHash = passwordHash
    this._authenticationTokenManager = authenticationTokenManager
  }

  async execute (useCasePayload) {
    const loginUser = new LoginUser(useCasePayload)
    const encryptedPassword = await this._userRepository.getPasswordByUsername(loginUser.username)
    await this._passwordHash.compare(loginUser.password, encryptedPassword)

    const accessToken = await this._authenticationTokenManager.createAccessToken({ username: loginUser.username })
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({ username: loginUser.username })

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken
    })

    await this._authenticationRepository.addToken(newAuthentication.refreshToken)
    return newAuthentication
  }
}

module.exports = LoginUserUseCase
