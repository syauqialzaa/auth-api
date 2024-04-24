const Jwt = require('@hapi/jwt')
const config = require('../../../commons/config')
const InvariantError = require('../../../commons/exceptions/invariant-error')
const JwtTokenManager = require('../jwt-token-manager')

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create access token correctly', async () => {
      const payload = {
        username: 'alzasyauqi'
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      }
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      const accessToken = await jwtTokenManager.createAccessToken(payload)

      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, config.jwt.accessTokenKey)
      expect(accessToken).toEqual('mock_token')
    })
  })

  describe('createRefreshToken function', () => {
    it('should create refresh token correctly', async () => {
      const payload = {
        username: 'alzasyauqi'
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      }
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, config.jwt.refreshTokenKey)
      expect(refreshToken).toEqual('mock_token')
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'alzasyauqi' })

      await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when refresh token verified', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'alzasyauqi' })

      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError)
    })
  })

  describe('decodePayload function', () => {
    it('should decode payload correclty', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'alzasyauqi' })

      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken)

      expect(expectedUsername).toEqual('alzasyauqi')
    })
  })
})
