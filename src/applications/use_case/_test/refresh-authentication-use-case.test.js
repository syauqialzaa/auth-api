const AuthenticationRepository = require('../../../domains/authentications/authentication-repository')
const AuthenticationTokenManager = require('../../security/authentication-token-manager')
const RefreshAuthenticationUseCase = require('../refresh-authentication-use-case')

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrating the refresh authentication action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }

    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()

    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ username: 'alzasyauqi' }))
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve('newAccessToken'))

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager
    })

    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload)

    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ username: 'alzasyauqi' })
    expect(accessToken).toEqual('newAccessToken')
  })
})
