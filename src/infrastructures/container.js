/* istanbul ignore file */
const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc.)
const UserRepositoryPostgres = require('./repository/user-repository-postgres')
const BcryptPasswordHash = require('./security/bcrypt-password-hash')

// use case
const AddUserUseCase = require('../applications/use_case/add-user-use-case')
const UserRepository = require('../domains/users/user-repository')
const PasswordHash = require('../applications/security/password-hash')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        { concrete: bcrypt }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  }
])

module.exports = container
