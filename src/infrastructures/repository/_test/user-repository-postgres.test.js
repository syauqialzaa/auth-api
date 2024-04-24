const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const InvariantError = require('../../../commons/exceptions/invariant-error')
const RegisterUser = require('../../../domains/users/entities/register-user')
const RegisteredUser = require('../../../domains/users/entities/registered-user')
const pool = require('../../database/postgres/pool')
const UserRepositoryPostgres = require('../user-repository-postgres')

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'alzasyauqi' })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // action & assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('alzasyauqi')).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when username available', async () => {
      // arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // action & assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('alzasyauqi')).resolves.not.toThrow(InvariantError)
    })
  })

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // arrange
      const registerUser = new RegisterUser({
        username: 'alzasyauqi',
        password: 'secret_password',
        fullname: 'Alza Syauqi'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // action
      await userRepositoryPostgres.addUser(registerUser)

      // assert
      const users = await UsersTableTestHelper.findUsersById('user-123')
      expect(users).toHaveLength(1)
    })

    it('should return registered user correctly', async () => {
      // arrange
      const registerUser = new RegisterUser({
        username: 'alzasyauqi',
        password: 'secret_password',
        fullname: 'Alza Syauqi'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      // assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'alzasyauqi',
        fullname: 'Alza Syauqi'
      }))
    })
  })

  describe('getPasswordByUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      await expect(userRepositoryPostgres.getPasswordByUsername('alzasyauqi')).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when username available', async () => {
      const registerUser = new RegisterUser({
        username: 'alzasyauqi',
        password: 'secret_password',
        fullname: 'Alza Syauqi'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      await userRepositoryPostgres.addUser(registerUser)

      const password = await userRepositoryPostgres.getPasswordByUsername(registerUser.username)

      expect(password).toEqual(registerUser.password)
    })
  })
})
