export const TYPES = {
  // command
  CommandAdd: Symbol.for('CommandAdd'),
  CommandCreate: Symbol.for('CommandCreate'),
  CommandInfo: Symbol.for('CommandInfo'),
  CommandOpen: Symbol.for('CommandOpen'),

  // actions
  ActionAdd: Symbol.for('ActionAdd'),
  ActionCreate: Symbol.for('ActionCreate'),
  ActionInfo: Symbol.for('ActionInfo'),
  ActionOpen: Symbol.for('ActionOpen'),

  // lib
  LibDownload: Symbol.for('LibDownload'),
  LibConfig: Symbol.for('LibConfig'),
  LibReader: Symbol.for('LibReader'),
  LibQuestion: Symbol.for('LibQuestion'),
  LibRunner: 'LibRunner',
  LibRunnerType: (name: any) => `LibRunner-${name}`,
  AbstractRunner: Symbol.for('AbstractRunner'),
  LibRunnerFactory: Symbol.for('LibRunnerFactory'),
  LibPackageManager: Symbol.for('LibPackageManager'),
  AbstractPackageManager: Symbol.for('AbstractPackageManager'),
  LibPackageManagerFactory: Symbol.for('LibPackageManagerFactory'),
  LibOpen: Symbol.for('LibOpen')
}
