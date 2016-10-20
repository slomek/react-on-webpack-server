# Environment-independent JavaScript Builds With Webpack

Does your project have two separate ways of building for development and production environment? If so, you must realise that you are doing it wrong, because this way you are not able to implement Continuous Delivery. On the other hand, you may want to connect to different backend APIs for each, not to mess up prod database with any tests. How can you do that? It's actually pretty simple.

### Reading configuration from environment

The best way to have an environment-specific configuration is to store it in host's environmental variables. For example, we may set our `API_URL` to some specific address, save it into a correct (syntax-wise) JavaScript file, so that it looks like this:

    window.API_URL = 'http://somehost.com';

In order to do that, all you need to do is generate a file with a simple bash script:

    echo "window.API_URL = '${API_URL}';" > config.js

### When do you do that?

The main problem is, when you deploy your application, you already have a whole directory, containing HTML templates, Java Scripts and CSS. In order to have the configuration ready for your app, you need to run a script and save an appropriate file inside your scripts directory. The best way to do that is run that config-generating script at the same time with starting out server, for example:

    echo "window.API_URL = '${API_URL}';" > config.js
    npm start

When you do that, you must remember to prepare your application script (eg. `bundle.js`) to be able to use data stored in another script, but at the same time it must be ready to handle the case when `config.js` is not present:

    // bundle.js
    app.properties.API_URL = window.API_URL || 'http://defaulthost.com';

There is one major problem with this setup. If you create a `config.js` file manually, do you also edit HTML by hand?

### Webpack to inject another file

The solution for this is adding another output file to our Webpack build. In order to do that, we need to tweak the configuration, so that we have an object of entry points. The key will be the name of the output file, so it does matter what you type here:

    // webpack.config.babel.js
    ...
    export default {
        entry: {
            bundle: './src/index.jsx',
            config: './src/config.js'
        },
        output: {
            ...
            filename: './js/[name].js'
        },
        ...
    };

Then you can create a `src/config.js` that can store default configuration for a development environment. Also, with HtmlWebpackPlugin, we have those scripts injected automatically, so we don't have to worry about editing HTML, nor about missing `config.js` on our local machine.

What about scripts named dynamically? If you change output's filename to `'./js/[name].[chunkhash:8].js'` you need to alter the script for creating environment-specific config as well. I use a trick in which I first list the files (one file) that matches `config.*.js` pattern:

    // start.sh
    ...
    echo "window.API_URL = '${API_URL}';" > $(ls prod/js/config*)
    ...

### Complete solution

To imitate the deployment, we create `prod` directory to store our final result. First, we clear this folder, then build the app and copy its contents. Then we create a config file built from environmental variable, and finally start the server:

    npm run build
    rm -rf prod
    mkdir prod
    cp -r dist/* prod
    echo "window.API_URL = '${API_URL}';" > $(ls prod/js/config*)
    http-server -c-1 prod/

Running the script without any additional configuration results, then trying to read `API_URL` variable results in:

    // CLI:
    $ scripts/start.sh

    // browser:
    console.log(API_URL)
    > ""

While running the same thing with a specific variable:

    // CLI
    $ API_URL=http://somehost.com scripts/start.sh

    // browser:
    console.log(API_URL)
    > "http://somehost.com"

Complete source code of this example is available [on Github](https://github.com/slomek/react-on-webpack-server/tree/indenepdant-build).
