const RefreshAuthentication = require('../../domains/authentications/entities/refresh-authentication')

class RefreshAuthenticationUseCase {
  constructor ({ authenticationRepository, authenticationTokenManager }) {
    this._authenticationRepository = authenticationRepository
    this._authenticationTokenManager = authenticationTokenManager
  }

  async execute (useCasePayload) {
    const refreshAuthentication = new RefreshAuthentication(useCasePayload)

    await this._authenticationTokenManager.verifyRefreshToken(refreshAuthentication.refreshToken)
    await this._authenticationRepository.checkAvailabilityToken(refreshAuthentication.refreshToken)

    const { username } = await this._authenticationTokenManager.decodePayload(refreshAuthentication.refreshToken)
    return this._authenticationTokenManager.createAccessToken({ username })
  }
}

module.exports = RefreshAuthenticationUseCase
