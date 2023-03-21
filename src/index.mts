import { Command } from './base/command.mjs';

export { Command } from './base/command.mjs';
export { Argument } from './base/argument.mjs';
export {
    SwitchType,
    SwitchArgument,
} from './base/switch-argument.mjs';


export const echo = (...args: string[]) => new Command('echo', ...args);
export const ls = (...args: string[]) => new Command('ls', ...args);
export const touch = (...args: string[]) => new Command('touch', ...args);
export const mkdir = (...args: string[]) => new Command('mkdir', ...args);
export const grep = (...args: string[]) => new Command('grep', ...args);
export const man = (...args: string[]) => new Command('man', ...args);
export const pwd = (...args: string[]) => new Command('pwd', ...args);
export const mv = (...args: string[]) => new Command('cd', ...args);
export const cp = (...args: string[]) => new Command('cp', ...args);
export const rm = (...args: string[]) => new Command('rm', ...args);
export const rmdir = (...args: string[]) => new Command('rmdir', ...args);
export const find = (...args: string[]) => new Command('find', ...args);
export const less = (...args: string[]) => new Command('less', ...args);
export const cat = (...args: string[]) => new Command('cat', ...args);
export const head = (...args: string[]) => new Command('head', ...args);
export const tail = (...args: string[]) => new Command('tail', ...args);
export const chmod = (...args: string[]) => new Command('chmod', ...args);
export const pushd = (...args: string[]) => new Command('pushd', ...args);
export const popd = (...args: string[]) => new Command('popd', ...args);
export const exit = (...args: string[]) => new Command('exit', ...args);
export const chroot = (...args: string[]) => new Command('chroot', ...args);
export const ln = (...args: string[]) => new Command('ln', ...args);
export const mount = (...args: string[]) => new Command('mount', ...args);
export const umount = (...args: string[]) => new Command('umount', ...args);
export const history = (...args: string[]) => new Command('history', ...args);
export const cut = (...args: string[]) => new Command('cut', ...args);
export const awk = (...args: string[]) => new Command('awk', ...args);
export const read = (...args: string[]) => new Command('read', ...args);
export const sh = (...args: string[]) => new Command('sh', ...args);
export const bash = (...args: string[]) => new Command('bash', ...args);
export const ssh = (...args: string[]) => new Command('ssh', ...args);
export const scp = (...args: string[]) => new Command('scp', ...args);
export const passwd = (...args: string[]) => new Command('passwd', ...args);
export const set = (...args: string[]) => new Command('set', ...args);
export const expr = (...args: string[]) => new Command('expr', ...args);
