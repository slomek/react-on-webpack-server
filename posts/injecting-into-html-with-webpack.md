# Injecting Into HTML with Webpack

Using Webpack can make the whole development process much easier, as it requires minimal configuration while providing good value. It takes your code and produces a single JS file (and if you prefer, another one with all CSS rules). One thing that is missing here is that you might want to have your files named dynamically (eg. with version number), but this way you'd need to change HTML template all the time. Fortunately, there is a way to do this automatically as well - it's a plugin that surprisingly is called HTML Webpack Plugin.

### Basic usage

First of all, we need to create an HTML template, where we'd like to inject our Webpack outputs. It can be generated automatically, but if our React application renders itself to some specific element, we need to add it manually. In our case, our template looks like this:

    <!-- src/index.html -->
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Example Webpack Dev Server</title>
        </head>
        <body>
            <div id="app"></div>
        </body>
    </html>

As you can see, it is as simple as an HTML page can get, plus our `#app` element. Next step is to install our plugin:

    npm i --save-dev html-webpack-plugin

Then just add it into Webpack configuration:

    // webpack.config.babel.js
    import ExtractTextPlugin from 'extract-text-webpack-plugin';
    import HtmlWebpackPlugin from 'html-webpack-plugin';

    export default {
        ...
        plugins: [
            ...
            new HtmlWebpackPlugin({
                template: './src/index.html'
            })
        ],
        ...
    };

Now when we run our build, both `bundle.js` and `bundle.css` will be injected into our template and saved as a new file:

    <!-- dist/index.html -->
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Example Webpack Dev Server</title>
        <link href="/./css/bundle.css" rel="stylesheet"></head>
        <body>
            <div id="app"></div>
        <script type="text/javascript" src="/./js/bundle.js"></script></body>
    </html>

### Use cases

There are a couple I've run across, for example, you might want to name your files dynamically. If we tweak Webpack config a bit, we can add some random hash to output file names (eg. to prevent browsers from caching):

    // webpack.config.babel.js
    ...
    export default {
        ...
        output: {
            ...
            filename: './js/bundle.[chunkhash:8].js'
        },
        ...
        plugins: [
            new ExtractTextPlugin('./css/bundle.[chunkhash:8].css'),
            ...
        ],
        ...
    };

With HTML Webpack Plugin, as I mentioned, we don't have to change `index.html` file, but have it updated automatically:

    <!-- dist/index.html -->
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Example Webpack Dev Server</title>
        <link href="/./css/bundle.758c71fb.css" rel="stylesheet"></head>
        <body>
            <div id="app"></div>
        <script type="text/javascript" src="/./js/bundle.758c71fb.js"></script></body>
    </html>

Complete source code of this example is available [on Github](https://github.com/slomek/react-on-webpack-server).
