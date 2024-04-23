const AuthenticationTokenManager = require('../authentication-token-manager')

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const authenticationTokenManager = new AuthenticationTokenManager()

    await expect(authenticationTokenManager.createAccessToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
    await expect(authenticationTokenManager.createRefreshToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
    await expect(authenticationTokenManager.verifyRefreshToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
    await expect(authenticationTokenManager.decodePayload('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
  })
})
