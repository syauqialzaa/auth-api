const AuthenticationsTableTestHelper = require('../../../../tests/authentications-table-test-helper')
const InvariantError = require('../../../commons/exceptions/invariant-error')
const NewAuthentication = require('../../../domains/authentications/entities/new-authentication')
const pool = require('../../database/postgres/pool')
const AuthenticationRepositoryPostgres = require('../authentication-repository-postgres')

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addToken function', () => {
    it('should add token to database', async () => {
      const newAuthentication = new NewAuthentication({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken'
      })
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)

      await authenticationRepositoryPostgres.addToken(newAuthentication.refreshToken)

      const tokens = await AuthenticationsTableTestHelper.findToken(newAuthentication.refreshToken)
      expect(tokens).toHaveLength(1)
      expect(tokens[0].token).toEqual(newAuthentication.refreshToken)
    })
  })

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError when token not available', async () => {
      const refreshToken = 'refreshToken'
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)

      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(refreshToken)).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when token available', async () => {
      const refreshToken = 'refreshToken'
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)
      await AuthenticationsTableTestHelper.addToken(refreshToken)

      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(refreshToken)).resolves.not.toThrow(InvariantError)
    })
  })

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      const refreshToken = 'refreshToken'
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)
      await AuthenticationsTableTestHelper.addToken(refreshToken)

      await authenticationRepositoryPostgres.deleteToken(refreshToken)

      const tokens = await AuthenticationsTableTestHelper.findToken(refreshToken)
      expect(tokens).toHaveLength(0)
    })
  })
})
