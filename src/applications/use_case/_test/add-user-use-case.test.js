const RegisterUser = require('../../../domains/users/entities/register-user')
const RegisteredUser = require('../../../domains/users/entities/registered-user')
const UserRepository = require('../../../domains/users/user-repository')
const PasswordHash = require('../../security/password-hash')
const AddUserUseCase = require('../add-user-use-case')

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // arrange
    const useCasePayload = {
      username: 'alzasyauqi',
      password: 'secret',
      fullname: 'Alza Syauqi'
    }
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    })

    /* creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    /* mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser))

    /* creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    // action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    }))
    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(useCasePayload.username)
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname
    }))
  })
})
