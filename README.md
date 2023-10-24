# Shell-factory-cocos
Shell-factory-cocos (shell-factory common commands) extends the functionality of [shell-factory](https://github.com/monstermichl/shell-factory) by a set of commands generally used in shell scripts. This collection is by no means complete and should be extended by anyone who thinks something is missing :) At this point, this is a simple wrapper over shell-factory's [Command](https://github.com/monstermichl/shell-factory#command)-class. *It does not apply any checks on the provided commands.*

```sh
npm install shell-factory-cocos
```

## Usage
Each of the supported commands can easily by called as a function. Additionally, the commands can be executed as root using the *asRoot*-, respectively *notAsRoot*-getter.

```typescript
import { Script } from 'shell-factory';
import {
    echo,
    grep,
    sed,
} from 'shell-factory-cocos';

const script = new Script([
    echo('Hello World'),

    echo('Lets try to grep this command')
        .pipe(grep('-e', 'this'))
        .pipe(sed('-e', 's/this/that/g'))
        .asRoot,
]);

console.log(script.dump());
```

```sh
#!/bin/sh

echo "Hello World"
sudo echo "Lets try to grep this command" | grep -e this | sed -e s/this/that/g
```

## Currently supported
At the moment the following commands are supported. Many of them were taken from the [list of Unix commands](https://en.wikipedia.org/wiki/List_of_Unix_commands) on Wikipedia.

- admin
- alias
- ar
- asa
- at
- awk
- basename
- batch
- bc
- bg
- cc
- cal
- cat
- cd
- cflow
- chgrp
- chmod
- chown
- cksum
- cmp
- comm
- command
- compress
- cp
- crontab
- csplit
- ctags
- cut
- cxref
- date
- dd
- delta
- df
- diff
- dirname
- du
- echo
- ed
- env
- ex
- expand
- expr
- fc
- fg
- file
- find
- fold
- fort77
- fuser
- gencat
- get
- getconf
- getopts
- grep
- hash
- head
- iconv
- id
- ipcrm
- ipcs
- jobs
- join
- kill
- lex
- link
- ln
- locale
- localedef
- logger
- logname
- lp
- ls
- m4
- mailx
- make
- man
- mesg
- mkdir
- mkfifo
- more
- mv
- newgrp
- nice
- nl
- nm
- nohup
- od
- paste
- patch
- pathchk
- pax
- pr
- printf
- prs
- ps
- pwd
- qalter
- qdel
- qhold
- qmove
- qmsg
- qrerun
- qrls
- qselect
- qsig
- qstat
- qsub
- read
- readlink
- renice
- rm
- rmdel
- rmdir
- sact
- sccs
- sed
- sh
- sleep
- sort
- split
- strings
- strip
- stty
- tabs
- tail
- talk
- tee
- test
- time
- touch
- tput
- tr
- tsort
- tty
- type
- ulimit
- umask
- unalias
- uname
- uncompress
- unexpand
- unget
- uniq
- unlink
- uucp
- uudecode
- uuencode
- uustat
- uux
- val
- vi
- wait
- wc
- what
- who
- write
- xargs
- yacc
- zcat
- less
- pushd
- popd
- chroot
- mount
- umount
- history
- bash
- ssh
- scp
- passwd
- set
