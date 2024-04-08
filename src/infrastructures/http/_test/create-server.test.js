const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
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
})
