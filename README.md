# Shell-factory
Shell-factory is a simple yet powerful ESM module that allows you to create Bourne shell scripts on the fly using Typescript. It's intuitive syntax and chainable commands take all the hassle of formatting strings manually and remembering weird syntax away from you and provides you with a rich set of configurations to tailor the script according to your needs.

```sh
npm install shell-factory
```


## Components
Each shell-script is built with the Script-class which serves as the container for all building blocks. At this point, the following building-blocks are supported (*the output of the following examples was provided by console.log. It is not dumped to the console or any file automatically. This is shown in the first example but for readability reasons avoided in the other ones.*).

### Statement
A statement represents a single line of code. It can be a string or an instance of the Statement class. Usually, a simple string is sufficient. However, the Statement class inherits from the Base class which offers additional functionalities like having an ID for later adjustment or adding comments which will be added to the generated code.

```typescript
const script = new Script([
    'echo "Hello World"',
    new Statement('echo "Hello Statement"').setComment('Statement class example'),
]).dump();

console.log(script);
```

```sh
#!/bin/sh

echo "Hello World"
echo "Hello Statement" # Statement class example
```

### If
If-statements control the further code execution flow. The If-class adds the possibility to add all required else-if (+ else) branches via chaining as shown in the example.

```typescript
new Script([
    'read -p "What do you want to say? " input',
    new If('"$input" == "Hello"', [
        'echo "Hello"',
    ]).elseIf('"$input" == "Bye"', [
        'echo "Bye"',
    ]).else([
        'echo "What shall we do with the drunken sailor?"',
    ]),
]).dump();
```

```sh
#!/bin/sh

read -p "What do you want to say? " input

if [ "$input" == "Hello" ]; then
  echo "Hello"
elif [ "$input" == "Bye" ]; then
  echo "Bye"
else
  echo "What shall we do with the drunken sailor?"
fi
```

### While
While-loops execute the content in their body as long as the condition is fulfilled.

```typescript
new Script([
    'input=0',
    new While(true, [
        'input=$(expr $input + 1)',
        'echo $input',
        'sleep 1',
    ]),
]).dump();
```

```sh
#!/bin/sh

input=0

while [ 1 ]; do
  input=$(expr $input + 1)
  echo $input
  sleep 1
done
```

### For
For-loops iterate over a defined collection of values and provid the current value via the specified variable.

```typescript
new Script([
    new For('i', [true, 2, 'three'], [
        'echo $i',
        'sleep 1',
    ]),
]).dump();
```

```sh
#!/bin/sh

for i in true 2 three; do
  echo $i
  sleep 1
done
```

### Select
Select is a builtin Shell function which provides the user with a selection menu based on the provided values.

```typescript
new Script([
    new Select('selection', ['a', 'b', 'c'], [
        'echo "You\'ve selected $selection"',
    ]),
]).dump();
```

```sh
#!/bin/sh

select selection in a b c; do
  echo "You've selected $selection"
done
```

### Case
Case looks at the provided input and decides, based on the defined cases, which branch to execute. *The Case-class expects CaseOption as it's content. Everything that is not a CaseOption instance is being added to the latest defined CaseOption.*

```typescript
new Script([
    'read -p "Where are we running? " input',
    new Case('$input', [
        new CaseOption('We need some time to clear our heads', [
            'echo "Keep on working \'til we\'re dead"',
        ]),
        new CaseOption('*', [
            'echo "I have no idea"'
        ]),
        'echo "I\'m added to the last CaseOption"',
    ]),
]).dump();
```

```sh
#!/bin/sh

read -p "Where are we running? " input

case $input in
  "We need some time to clear our heads")
    echo "Keep on working 'til we're dead"
    ;;
  *)
    echo "I have no idea"
    echo "I'm added to the last CaseOption"
    ;;
esac
```

### Function
Functions are reusable code blocks which can be called at later points in the script. The Function-class also adds the possibility to map the positional parameters to function-internal variables for better usability.

```typescript
new Script([
    new Function('hello_world', [
        'echo "Greetings $first_name, $last_name"',
    ], [
        'first_name',
        'last name',
    ]),
    'hello_world',
]).dump();
```

```sh
#!/bin/sh

hello_world() {
  first_name=$1
  last_name=$2
  echo "Greetings $first_name, $last_name"
}
hello_world
```

The Function class additionally provides the *call*-method to return a function-call Statement with the provided parameters.
```typescript
const exitFunc = new Function('exit_function', [
    new If('"$2" != ""', [
        'echo "$2"',
    ]),
    new Statement('exit $1').setComment('Exiting with the provided error-code.'),
]);
const script = new Script([
    exitFunc,

    new If('-e "hello.txt"', [
        exitFunc.call(0),
    ]).else([
        exitFunc.call(-1, 'File doesn\'t exit.'),
    ])
]).dump();

console.log(script);
```

```sh
#!/bin/sh

exit_function() {
  if [ "$2" != "" ]; then
    echo "$2"
  fi
  exit $1 # Exiting with the provided error-code.
}

if [ -e "hello.txt" ]; then
  exit_function 0
else
  exit_function -1 "File doesn't exit."
fi
```

## Formatting
How scripts are dumped can be configured separatelly. Either by setting the config directly on the Script instance or by passing it to the dump-method.
```typescript
const spacyConfig = {
    detailed: {
        for: {
            newlinesAfter: 2,
        },
        statement: {
            newlinesBefore: 1,
            indentBeforeComment: 6,
        },
    }
} as Config;

const script = new Script([
    new For('i', [1, 2, 3], [
        new Statement('echo "Iteration $i"').setComment('Far away comment.'),
    ]),
    'echo "First statement"',
    new Statement('echo "Second statement"').setComment('Another far, far away comment.'),
    'echo "Third statement"',
]).dump(spacyConfig);
```

```sh
#!/bin/sh

for i in 1 2 3; do
  echo "Iteration $i"      # Far away comment.
done


echo "First statement"

echo "Second statement"      # Another far away comment.

echo "Third statement"
```

## Modification
### Add
New content can be added to a block (e.g. If) by using the *addContent* method.

```typescript
const meta = new MetaData(); /* MetaData container. */
const script = new Script([
    new If(1, [
        'echo "This is the first statement"',
    ]).meta(meta),
]);
console.log(script.dump()); /* Dump the original script. */

/* Find the If-block in the Script-block by its ID. */
const ifBlock = script.findContent(meta.id)[0];

/* Add another statement to the If-block. */
ifBlock.addContent('echo "Here\'s another statement"');

console.log(script.dump()); /* Dump the updated script. */
```

```sh
#!/bin/sh

if [ 1 ]; then
  echo "This is the first statement"
fi
```

```sh
#!/bin/sh

if [ 1 ]; then
  echo "This is the first statement"
  echo "Here's another statement"
fi
```

### Remove
Blocks and Statements can removed from their parent block (e.g. Script) via their ID or a statement pattern using the *removeContent* method.

```typescript
const script = new Script([
    new Statement().setComment('First line of this script'),
    'echo "Is this going to be removed?"',
    'echo "Will this also be removed?"',
    new Statement().setComment('Last line of this script'),
]);

/* Dump the original script. */
console.log(script.dump());

/* Remove statements by pattern. */
script.removeContent(/remove/);

/* Dump the altered script. */
console.log(script.dump());
```

```sh
#!/bin/sh

# First line of this script
echo "Is this going to be removed?"
echo "Will this also be removed?"
# Last line of this script
```

```sh
#!/bin/sh

# First line of this script
# Last line of this script
```

### Alter
Blocks and Statements can altered by retrieving them via their ID or a statement pattern through their parent block (e.g. Script) with the *findContent* method and altering the returned object(s).

```typescript
const meta = new MetaData(); /* MetaData container. */
const script = new Script([
    new Statement('echo "Hello"')
        .setComment('This might be altered at the next dump')
        .meta(meta), /* Get the Statement's meta-data. */
]);
console.log(script.dump()); /* Dump the original script. */

/* Find the statement in the script by its ID. */
const statement = script.findContent(meta.id)[0];

/* Update the Statement's value and comment. */
statement.value = 'echo "World';
statement.setComment('It has been altered"');

console.log(script.dump()); /* Dump the altered script. */
```

```sh
#!/bin/sh

echo "Hello" # This might be altered at the next dump
```

```sh
#!/bin/sh

echo "World" # It has been altered"
```
