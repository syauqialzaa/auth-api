const bcrypt = require('bcrypt')
const AuthenticationError = require('../../../commons/exceptions/authentication-error')
const BcryptPasswordHash = require('../bcrypt-password-hash')

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // arrange
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)

      // action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password')

      // assert
      expect(typeof encryptedPassword).toEqual('string')
      expect(encryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10) // 10 is default saltRound value for BcryptPasswordHash
    })
  })

  describe('compare funciton', () => {
    it('should throw AuthenticationError when password not match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)

      await expect(bcryptPasswordHash.compare('plain_password', 'encrypted_password')).rejects.toThrow(AuthenticationError)
    })

    it('should not throw AuthenticationError when password match', async () => {
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password')

      await expect(bcryptPasswordHash.compare('plain_password', encryptedPassword)).resolves.not.toThrow(AuthenticationError)
    })
  })
})
