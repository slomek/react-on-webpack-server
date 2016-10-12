# Rapid Development With Webpack Server

One of the biggest advantages of being a front-end developer is the ability to have an instant feedback about changes made you the code. In most cases, in order to see your latest update, all you need to do is refresh the page. But for some reason, refreshing is not an option anymore - we want to have our page refresh itself automatically (gosh, we are so lazy!). How do we do that? One of the options is Webpack Dev Server.

### Webpack configuration

If you followed [my previous post](http://mycodesmells.com/post/sass-with-webpack), you already have a complete Webpack config for your project. You can obviously have it customised, but as long as you are already using webpack to build your code, you'll find running auto-refreshing dev server extremely easy.

First, make sure that your webpack.config.babel.js contains important information about a path your output files (JS and CSS) should be served from:

    // webpack.config.babel.js
    export default {
        ...
        output: {
            path: './dist/',
            publicPath: '/',
            filename: './js/bundle.js'
        },
        ...
    };

Now you need to install a package for dev server:

    npm i --save-dev webpack-dev-server

Finally, you can run it using `--content-base` option to define where is the whole (HTML + JS + CSS) page:

    webpack-dev-server --content-base dist/

### Not quite there yet

If you run your code, you can see that the page is indeed served (probably on port 8080), but even if you make any changes to the code, it's not being rebuilt. In order to do that, you need to add another option, `watch`:

    webpack-dev-server --watch --content-base dist/

Last, but not least, we want to have that auto refreshing, so that it's not required for us to do this manually. Fortunately, there is an option for that as well, called `inline`

    webpack-dev-server --watch --inline --content-base dist/

What does it mean? Why `inline`? The reason for that is quite simple, as our server must notify the page to refresh (push it via WebSocket), but we obviously don't want to add that logic to our application. Webpack dev server is ready to handle such connection, but with `inline` option, this WS logic is inserted into our page scripts (it is _inline_ with the rest of our code), therefore those notifications are enabled.

### Summary

As you can see, setting up a fast, reliable dev server on top of your Webpack configuration is both quick and easy. Just a couple of commands, one dependency and you are good to go. Don't forget to wrap the command for running dev server into a script in your `package.json`:

    // package.json
    {
      ...
      "scripts": {
        ...
        "start": "webpack-dev-server --watch --inline --content-base dist/"
      },
      ...
    }

Complete source code of this example is available [on Github](https://github.com/slomek/react-on-webpack-server).
