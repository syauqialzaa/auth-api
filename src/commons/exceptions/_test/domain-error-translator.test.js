const DomainErrorTranslator = require('../domain-error-translator')
const InvariantError = require('../invariant-error')

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada.'))
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai.'))
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit.'))
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang.'))

    expect(DomainErrorTranslator.translate(new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat menampilkan user baru karena properti yang dibutuhkan tidak ada.'))
    expect(DomainErrorTranslator.translate(new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat menampilkan user baru karena tipe data tidak sesuai.'))

    expect(DomainErrorTranslator.translate(new Error('NEW_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat authentikasi baru karena properti yang dibutuhkan tidak ada.'))
    expect(DomainErrorTranslator.translate(new Error('NEW_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat authentikasi baru karena tipe data tidak sesuai.'))

    expect(DomainErrorTranslator.translate(new Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat login user karena properti yang dibutuhkan tidak ada.'))
    expect(DomainErrorTranslator.translate(new Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat login user karena tipe data tidak sesuai.'))
  })

  it('should return original error when error message is not needed to translate', () => {
    // arrange
    const error = new Error('some_error_message')

    // action
    const translatedError = DomainErrorTranslator.translate(error)

    // assert
    expect(translatedError).toStrictEqual(error)
  })
})
