import { ExecutableCommand } from './base/executable-command.mjs';

export { ExecutableCommand } from './base/executable-command.mjs';
export { Argument } from './base/argument.mjs';
export {
    SwitchType,
    SwitchArgument,
} from './base/switch-argument.mjs';


export const echo = (...args: string[]) => new ExecutableCommand('echo', ...args);
export const ls = (...args: string[]) => new ExecutableCommand('ls', ...args);
export const touch = (...args: string[]) => new ExecutableCommand('touch', ...args);
export const mkdir = (...args: string[]) => new ExecutableCommand('mkdir', ...args);
export const grep = (...args: string[]) => new ExecutableCommand('grep', ...args);
export const man = (...args: string[]) => new ExecutableCommand('man', ...args);
export const pwd = (...args: string[]) => new ExecutableCommand('pwd', ...args);
export const mv = (...args: string[]) => new ExecutableCommand('cd', ...args);
export const cp = (...args: string[]) => new ExecutableCommand('cp', ...args);
export const rm = (...args: string[]) => new ExecutableCommand('rm', ...args);
export const rmdir = (...args: string[]) => new ExecutableCommand('rmdir', ...args);
export const find = (...args: string[]) => new ExecutableCommand('find', ...args);
export const less = (...args: string[]) => new ExecutableCommand('less', ...args);
export const cat = (...args: string[]) => new ExecutableCommand('cat', ...args);
export const head = (...args: string[]) => new ExecutableCommand('head', ...args);
export const tail = (...args: string[]) => new ExecutableCommand('tail', ...args);
export const chmod = (...args: string[]) => new ExecutableCommand('chmod', ...args);
export const pushd = (...args: string[]) => new ExecutableCommand('pushd', ...args);
export const popd = (...args: string[]) => new ExecutableCommand('popd', ...args);
export const exit = (...args: string[]) => new ExecutableCommand('exit', ...args);
export const chroot = (...args: string[]) => new ExecutableCommand('chroot', ...args);
export const ln = (...args: string[]) => new ExecutableCommand('ln', ...args);
export const mount = (...args: string[]) => new ExecutableCommand('mount', ...args);
export const umount = (...args: string[]) => new ExecutableCommand('umount', ...args);
export const history = (...args: string[]) => new ExecutableCommand('history', ...args);
export const cut = (...args: string[]) => new ExecutableCommand('cut', ...args);
export const awk = (...args: string[]) => new ExecutableCommand('awk', ...args);
export const read = (...args: string[]) => new ExecutableCommand('read', ...args);
export const sh = (...args: string[]) => new ExecutableCommand('sh', ...args);
export const bash = (...args: string[]) => new ExecutableCommand('bash', ...args);
export const ssh = (...args: string[]) => new ExecutableCommand('ssh', ...args);
export const scp = (...args: string[]) => new ExecutableCommand('scp', ...args);
export const passwd = (...args: string[]) => new ExecutableCommand('passwd', ...args);
export const set = (...args: string[]) => new ExecutableCommand('set', ...args);
export const expr = (...args: string[]) => new ExecutableCommand('expr', ...args);
