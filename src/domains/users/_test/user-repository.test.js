const UserRepository = require('../user-repository')

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const userRepository = new UserRepository()

    await expect(userRepository.addUser({})).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(userRepository.verifyAvailableUsername('')).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(userRepository.getPasswordByUsername('')).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
