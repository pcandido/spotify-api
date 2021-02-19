import path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..', '..')

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@presentation': path.join(files, 'src', 'presentation'),
  '@domain': path.join(files, 'src', 'domain'),
  '@data': path.join(files, 'src', 'data'),
  '@infra': path.join(files, 'src', 'infra'),
  '@utils': path.join(files, 'src', 'utils'),
  '@test': path.join(files, 'test'),
})
