const AuthenticationRepository = require('../../../domains/authentications/authentication-repository')
const LogoutUserUseCase = require('../logout-user-use-case')

describe('LogoutUserUseCase', () => {
  it('should orchestrating the logout user action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }

    const mockAuthenticationRepository = new AuthenticationRepository()

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository
    })

    await logoutUserUseCase.execute(useCasePayload)

    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})
