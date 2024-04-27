const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const AuthenticationsTableTestHelper = require('../../../../tests/authentications-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')
const AuthenticationTokenManager = require('../../../applications/security/authentication-token-manager')

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  it('should response 404 when request unregistered route', async () => {
    // arrange
    const server = await createServer({})

    // action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    })

    // assert
    expect(response.statusCode).toEqual(404)
  })

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // arrange
      const requestPayload = {
        username: 'alzasyauqi',
        password: 'secret',
        fullname: 'Alza Syauqi'
      }
      const server = await createServer(container)

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedUser).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // arrange
      const requestPayload = {
        fullname: 'Alza Syauqi',
        password: 'secret'
      }
      const server = await createServer(container)

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada.')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // arrange
      const requestPayload = {
        username: 'alzasyauqi',
        password: 'secret',
        fullname: ['Alza Syauqi']
      }
      const server = await createServer(container)

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai.')
    })

    it('should response 400 when username more than 50 character', async () => {
      // arrange
      const requestPayload = {
        username: 'alzasyauqialzasyauqialzasyauqialzasyauqialzasyauqialzasyauqi',
        password: 'secret',
        fullname: 'Alza Syauqi'
      }
      const server = await createServer(container)

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit.')
    })

    it('should response 400 when username contain restricted character', async () => {
      // arrange
      const requestPayload = {
        username: 'alza syauqi',
        password: 'secret',
        fullname: 'Alza Syauqi'
      }
      const server = await createServer(container)

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang.')
    })

    it('should response 400 when username unavailable', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'alzasyauqi' })
      const requestPayload = {
        username: 'alzasyauqi',
        password: 'secret',
        fullname: 'Alza Syauqi'
      }
      const server = await createServer(container)

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak tersedia.')
    })

    it('should handle server error correctly', async () => {
      // arrange
      const requestPayload = {
        username: 'alzasyauqi',
        password: 'super_secret',
        fullname: 'Alza Syauqi'
      }
      const server = await createServer({}) // fake container

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(500)
      expect(responseJson.status).toEqual('error')
      expect(responseJson.message).toEqual('terjadi kegagalan pada server kami.')
    })
  })

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      const requestPayload = {
        username: 'alzasyauqi',
        password: 'secret'
      }
      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alzasyauqi',
          password: 'secret',
          fullname: 'Alza Syauqi'
        }
      })

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
      expect(responseJson.data.refreshToken).toBeDefined()
    })

    it('should response 400 if username not found', async () => {
      const requestPayload = {
        username: 'alzasyauqi',
        password: 'secret'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak ditemukan di database.')
    })

    it('should response 401 if password wrong', async () => {
      const requestPayload = {
        username: 'alzasyauqi',
        password: 'another_password'
      }
      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alzasyauqi',
          password: 'secret',
          fullname: 'Alza Syauqi'
        }
      })

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('kredensial yang anda masukkan salah.')
    })

    it('should response 400 if login payload not contain needed property', async () => {
      const requestPayload = {
        username: 'alzasyauqi'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat login user karena properti yang dibutuhkan tidak ada.')
    })

    it('should response 400 if login payload wrong data type', async () => {
      const requestPayload = {
        username: true,
        password: 'secret'
      }
      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat login user karena tipe data tidak sesuai.')
    })
  })

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alzasyauqi',
          password: 'secret',
          fullname: 'Alza Syauqi'
        }
      })

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alzasyauqi',
          password: 'secret'
        }
      })
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload)

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
    })

    it('should return 400 payload not contain refresh token', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {}
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat refresh authentikasi karena token refresh yang dibutuhkan tidak ada.')
    })

    it('should return 400 if refresh token not string', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat refresh authentikasi karena tipe data tidak sesuai.')
    })

    it('should return 400 if refresh token not valid', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: 'invalidRefreshToken'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token tidak valid.')
    })

    it('should return 400 if refresh token not registered in database', async () => {
      const server = await createServer(container)
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'alzasyauqi' })

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('token tidak ditemukan di database.')
    })
  })

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const server = await createServer(container)
      const refreshToken = 'refresh_token'
      await AuthenticationsTableTestHelper.addToken(refreshToken)

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 400 if refresh token not registered in database', async () => {
      const server = await createServer(container)
      const refreshToken = 'refresh_token'

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('token tidak ditemukan di database.')
    })

    it('should response 400 if payload not contain refresh token', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {}
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat menghapus authentikasi karena token refresh yang dibutuhkan tidak ada.')
    })

    it('should response 400 if refresh token not string', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 123
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat menghapus authentikasi karena tipe data tidak sesuai.')
    })
  })

  it('should handle server error correctly', async () => {
    const requestPayload = {
      username: 'alzasyauqi',
      fullname: 'Alza Syauqi',
      password: 'super_secret'
    }
    const server = await createServer({}) // fake injection

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami.')
  })
})
