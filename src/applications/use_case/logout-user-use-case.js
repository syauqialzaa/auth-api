const DeleteAuthentication = require('../../domains/authentications/entities/delete-authentication')

class LogoutUserUseCase {
  constructor ({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository
  }

  async execute (useCasePayload) {
    const deleteAuthentication = new DeleteAuthentication(useCasePayload)

    await this._authenticationRepository.checkAvailabilityToken(deleteAuthentication.refreshToken)
    await this._authenticationRepository.deleteToken(deleteAuthentication.refreshToken)
  }
}

module.exports = LogoutUserUseCase
