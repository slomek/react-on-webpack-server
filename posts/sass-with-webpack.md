# SASS With Webpack

One of the first things you need to do when setting up your front-end project is create some kind of building script. While transpiling your scripts is relatively easy, eg. with babel, it might not be that trivial with styles. Let's take a look on how to make Webpack work with SASS, so that you can write your CSS more efficiently.

### Building with Webpack

Some time ago, I wrote [a post on basic usage of Webpack](http://mycodesmells.com/post/webpack-simple-example/). That was quick and easy, but in a real world, your projects will be more complex and you probably need more configuration than just entry file (and output filename). If you want to create React application, you need to transpile `.js` and `.jsx` files with `babel-loader`:

    // webpack.config.babel.js
    export default {
        entry: './src/index.jsx',
        output: {
            path: './dist/',
            publicPath: '/',
            filename: './js/bundle.js'
        },
        module: {
            loaders: [
                { test: /.jsx|.js?$/, loader: 'babel-loader' }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    };

**Note** that in order to use ES6 features in webpack configuration (which we'll need later on), you need to have `babel-register` package installed in your project.

Additionally, you need to create babel configuration in `.babelrc` file:

    // .babelrc
    {
        "presets": ["es2015", "es2017", "react"]
    }

While this is perfect with Java Script assets, we still need to build styles separately. This is definitely not right, because we should not have two building steps, as your application rely both on JS and CSS. Fortunately, it is possible to have styles included in webpack build as well. First, we need to define additional loader for CSS files:

    // webpack.config.babel.js
    export default {
        ...
        module: {
            loaders: [
                ...
                { test: /.sass?$/, loaders: ['style', 'css!sass?sourceMap'] }
            ]
        },
        ...
    };

This requires us to install three things (plus `node-sass` if you don't have it installed yet):

    npm i --save-dev style-loader css-loader sass-loader

After doing that, you can simply import your index SASS file in one of JS scripts, with `index.js` (`index.jsx`) being probably the best place to do so:

    // index.jsx
    ...
    import './index.sass'
    ...

As a result you get all your SASS transpiled and inserted into output `bundle.js` file.

### Separate outputs

The only disadvantage of this approach is that for some reason you have your styles injected into `.js` file. This looks and feels really strange - I'd rather have two output of my webpack build - one file for scripts and one for styles.

This can be done with _Extract Text Plugin_ installed with `extract-text-webpack-plugin` package. This requires us to alter our configuration, because instead of an array of loaders, we now need to use one:

    // webpack.config.babel.js
    export default {
        ...
        module: {
            loaders: [
                ...
                { test: /.sass?$/, loader: ExtractTextPlugin.extract('style', 'css!sass?sourceMap') },
            ]
        },
        plugins: [
            new ExtractTextPlugin('./css/bundle.css')
        ],
        ...
    };

As you can see, we also need to notify webpack explicitly that we wand to use this plugin in `plugins` section. The constructor `ExtractTextPlugin` takes one parameter - the name of an output file which will contain all transpiled SASS content.

### Final result

In the end, `webpack.config.babel.js` looks like this:

    import ExtractTextPlugin from 'extract-text-webpack-plugin';

    export default {
        entry: './src/index.jsx',
        output: {
            path: './dist/',
            publicPath: '/',
            filename: './js/bundle.js'
        },
        module: {
            loaders: [
                { test: /.jsx|.js?$/, loader: 'babel-loader' },
                { test: /.sass?$/, loader: ExtractTextPlugin.extract('style', 'css!sass?sourceMap') }
            ]
        },
        plugins: [
            new ExtractTextPlugin('./css/bundle.css')
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    };

Running webpack build results in a following output:

    Hash: 9d63ed4dcb38e45c3204
    Version: webpack 1.13.2
    Time: 3978ms
               Asset      Size  Chunks             Chunk Names
      ./js/bundle.js    752 kB       0  [emitted]  main
    ./css/bundle.css  61 bytes       0  [emitted]  main
        + 178 hidden modules
    Child extract-text-webpack-plugin:
            + 2 hidden modules

As you can see, we end up with two separate files with can be inserted into an HTML template just like it should be done.

Complete source code of this example is available [on Github](https://github.com/slomek/react-on-webpack-server).
