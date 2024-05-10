const Hapi = require('@hapi/hapi')
const ClientError = require('../../commons/exceptions/client-error')
const DomainErrorTranslator = require('../../commons/exceptions/domain-error-translator')
const users = require('../../interfaces/http/api/users')
const authentications = require('../../interfaces/http/api/authentications')
const config = require('../../commons/config')

const createServer = async container => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    }
  ])

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      value: 'Hello World!'
    })
  })

  server.ext('onPreResponse', (request, h) => {
    // get response context from request
    const { response } = request

    if (response instanceof Error) {
      // if the response is error, handle as needed
      const translatedError = DomainErrorTranslator.translate(response)

      // handle client error internally
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)
        return newResponse
      }

      // retains the client error handling by hapi natively, such as 404, etc.
      if (!translatedError.isServer) {
        return h.continue
      }

      // handle server error as needed
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami.'
      })
      newResponse.code(500)
      return newResponse
    }

    // if not error, continue the previous response (without intervented)
    return h.continue
  })

  return server
}

module.exports = createServer
