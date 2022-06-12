const SYS_COMMANDS = ['.exit'];
const NAV_COMMANDS = ['up', 'cd', 'ls'];
const FS_COMMANDS = ['cat', 'add', 'rn', 'cp', 'mv', 'rm'];
const OS_INFO_COMMANDS = ['os'];
const HASH_COMMANDS = ['hash'];
const ZIP_COMMANDS = ['compress', 'decompress'];
const ALL_COMMANDS = [...SYS_COMMANDS, ...NAV_COMMANDS, ...FS_COMMANDS, ...OS_INFO_COMMANDS, ...HASH_COMMANDS, ...ZIP_COMMANDS];
const OS_PARAMETERS = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];

export {
  SYS_COMMANDS,
  NAV_COMMANDS,
  FS_COMMANDS,
  OS_INFO_COMMANDS,
  HASH_COMMANDS,
  ZIP_COMMANDS,
  ALL_COMMANDS,
  OS_PARAMETERS,
}