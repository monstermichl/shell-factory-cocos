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
export const chroot = (...args: string[]) => new Command('exit', ...args);
