import { Script } from 'shell-factory';
import {
    echo,
    grep,
    sed,
} from '../dist/index.mjs';

const script = new Script([
    echo('Hello World'),

    echo('Lets try to grep this command')
        .pipe(grep('-e', 'this'))
        .pipe(sed('-e', 's/this/that/g'))
        .runAsRoot(true),
]);

console.log(script.dump());
