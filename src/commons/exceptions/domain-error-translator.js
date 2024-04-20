const InvariantError = require('./invariant-error')

const DomainErrorTranslator = {
  translate (error) {
    return DomainErrorTranslator._directories[error.message] || error
  }
}

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada.'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai.'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit.'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang.'),
  'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menampilkan user baru karena properti yang dibutuhkan tidak ada.'),
  'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menampilkan user baru karena tipe data tidak sesuai.'),
  'NEW_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat authentikasi baru karena properti yang dibutuhkan tidak ada.'),
  'NEW_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat authentikasi baru karena tipe data tidak sesuai.'),
  'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat login user karena properti yang dibutuhkan tidak ada.'),
  'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat login user karena tipe data tidak sesuai.')
}

module.exports = DomainErrorTranslator
