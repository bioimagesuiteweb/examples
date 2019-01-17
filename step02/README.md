## Introducing Common.js (CJS) modules as used by Node.js

A second node.js example using a module in node.js. Type

    node main.js
    
### Defining a CJS Module

A node.js module consists of

1. Some JaveScript Code
2. A set of exported symbols packaged into the ``predefined`` object
   ``module.exports``.
   

For example, in `nodemodule.js`, we define two functions (`isfilenamecsv`,
`isfilenametxt`) and then export them as:

    // module.exports stores the item that is being exported/exposed

    module.exports = {
        istxt : isfilenametxt,
        iscsv : isfilenamecsv
    };

The variable `module.exports` can take any value. It can be a variable, a
single function, a class definition or a JavaScript Object (dictionary), as is
the case here.

### Using a Module

In ``main.js`` we import the module using the `require` keyword as follows:

    const fnameutils=require('./nodemodule');

Once this is done, `fnameutils` has the same value as the variable
`module.exports` defined in `nodemodule`. Hence, later in the code we can call
the function `iscsv`.

    let iscsv=fnameutils.iscsv(fnames[i]);

This maps to the value of `module.exports.iscsv`, which
in turn maps to the functions `isfilenamecsv` defined in nodemodule.js.

### Browser Issues

The constructs `module.exports` and `require` do not work in a Browser, only
in node.js. They are effectively node.js extensions to the core JavaScript
language. There are tools such as `browserify` and `webpack` that will take
code written with these module constructs and transform it (bundle it) to
make it usable in the browser. We will revisit this in [Step 4](../step04).


