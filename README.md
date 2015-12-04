# a-hello-world

__Hello World:__ a WebVR scene built using A-Frame.

Pull requests are welcome!


## Getting Started

After you have __[forked this repo](https://github.com/aframevr/a-hello-world/fork)__, clone a copy of your fork locally and you'll be have your scene ready in a few steps:

    git clone git@github.com:your_username/a-hello-world.git
    cd a-hello-world
    npm install
    npm start

And open `package.json` and change `"repository": "aframevr/a-hello-world"` to `"repository": "your_username/a-hello-world"`.


## Publishing your scene

If you don't already know, GitHub offers free and awesome publishing of static sites via __[https://pages.github.com/](GitHub Pages)__.

To publish the scene to your personal GitHub Pages:

    npm run ghpages


## Need Help?

### Installation

First make sure you have Node installed.

On Mac OS X, it's recommended to use [Homebrew](http://brew.sh/) to install Node + [npm](https://www.npmjs.com):

    brew install node

To install the Node dependencies:

    npm install


### Local Development

To serve the site from a simple Node development server:

    npm start

Then launch the site from your favourite browser:

[__http://localhost:3000/__](http://localhost:3000/)

If you wish to serve the site from a different port:

    PORT=8000 npm start
