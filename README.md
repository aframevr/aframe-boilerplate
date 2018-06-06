# Welcome

Welcome to the development home for the Peachtree Corners Veterans Monument WebVR experience. The development team is staffed by a rag-tag team of smart STEM-oriented high school students from 5 area high schools.  Part-time mentorship is provided by a team of local professionals who live and work in Technology Park, in Peachtree Corners, GA.

## Development Team

* Stephen Dunlap - Senior, Wesleyan School
* Ethan Howe - Senior, Norcross High School
* Ian Venkatesan - Senior, Wesleyan School
* Jason Yu - Junior, Gwinnett School of Mathematics, Science, and Technology
* Abel Abraham - Junior, Gwinnett School of Mathematics, Science, and Technology
* Michelle Coker - Junior, Gwinnett School of Mathematics, Science, and Technology
* Connor Allsup - Sophomore, Lambert High School

## Mentors

* [Sean Dunlap](https://www.linkedin.com/in/seandunlap/) - Broadcom Ltd.
* [Mark Treager](https://www.linkedin.com/in/mark-treager/) - Cornerstone Media Group
* [Nashlee Young](https://www.linkedin.com/in/nashlee-young-269297b/) - Emnovate / Atlanta Tech Park
* [Robin Beinfait](https://www.linkedin.com/in/mark-treager/) - Emnovate / Atlanta Tech Park

# Contributing

Interested in contributing? As an open source project, we'd appreciate any help
and contributions! 

## Join the Team on Slack

1. [Invite yourself](https://ptcvets.slack.com/join/shared_invite/enQtMzYyNDM0MDI5NjUyLWE4MjA5OWFjZWJiNzk1ZTNmMTRhZjVkZDI4NGJhZmE0YjJjMDA3NWU3YjExMjI4NjhhM2MxZWJjYjJjNDZmNjU) to the PCVMA Slack channel.

## File an Issue or Change Request

1. Search the [issue tracker](https://github.com/Peachtree-Corners-Vetereans-Monument/WebVR/issues) for similar issues.
2. Specify information about your browser and system (e.g., "Firefox Nightly on OS X")
3. Describe the problem in detail (i.e., what happened and what you expected would happen).
4. If possible, provide a small test case with [CodePen](http://codepen.io), a link to your application, and/or a screenshot. You can fork this [sample pen](http://codepen.io/anon/pen/KVWpbb).

## Contribute Code

1. Have a [GitHub account](https://github.com/join) with [SSH keys][ssh] set up.
2. [Fork](https://github.com/Peachtree-Corners-Vetereans-Monument/WebVR/fork) the repository on GitHub.
3. Clone your fork of the repository locally (i.e., `git clone git@github.com:yourusername/WebVR`).
4. Run `npm install` to get dependencies and `npm run dev` to serve the test examples.
5. Create a branch to work in (i.e., `git checkout -b mybranch`).
6. Make changes to your fork of the repository, commit them, and push them (i.e., `git add -A . && git commit -m 'My Changes (fixes #1234)' && git push origin mybranch`).
7. If necessary, write [unit tests](tests/) ([guide][testing-guide]) and run with `npm test`.
8. [Submit a pull request][pr] to the master branch. If you head to the [master repository](https://github.com/Peachtree-Corners-Vetereans-Monument/WebVR/wiki/Home/_edit) after running `git push` from earlier, you should see a pop up to submit a pull request.
9. [Address review comments](http://stackoverflow.com/questions/9790448/how-to-update-a-pull-request) if any.

## On GitHub

1. Help respond to [newly-filed GitHub issues](https://github.com/Peachtree-Corners-Vetereans-Monument/WebVR/issues)
2. Redirect developers to [Stack Overflow][stackoverflow] if a question is filed rather than an issue.
3. For extra points, cross-post and answer the question on Stack Overflow after redirecting!



## Getting Started

There are two easy options for obtaining this A-Frame scene. It's then up to you to make it your own!

### <sup>Option 1:</sup> Download the ZIP kit 📦

[<img src="http://i.imgur.com/UVPZoM0.png" width="200">](https://github.com/aframevr/aframe-boilerplate/archive/master.zip)

After you have __[downloaded and extracted this `.zip` file](https://github.com/Peachtree-Corners-Vetereans-Monument/aframe-boilerplate/archive/master.zip)__ containing the contents of this repo, open the resulting directory, and you'll be have your scene ready in these few steps:

    npm install && npm start
    open http://localhost:3000/

<hr>

### <small><sup>Option 2:</sup> Fork this Git repo 🍴🐙

Alternatively, you can __[fork this repo](https://github.com/Peachtree-Corners-Vetereans-Monument/aframe-boilerplate/fork)__ to get started, if you'd like to maintain a Git workflow.

After you have __[forked this repo](https://github.com/Peachtree-Corners-Vetereans-Monument/aframe-boilerplate/fork)__, clone a copy of your fork locally and you'll be have your scene ready in these few steps:

    git clone https://github.com/Peachtree-Corners-Vetereans-Monument/aframe-boilerplate.git
    cd aframe-boilerplate && rm -rf .git && npm install && npm start
    open http://localhost:3000/

> :iphone: **Mobile pro tip:** Upon starting the development server, the URL will be logged to the console. Load that URL from a browser on your mobile device. (If your mobile phone and computer are not on the same LAN, consider using [ngrok](https://ngrok.com/) for local development and testing. [Browsersync](https://www.browsersync.io/) is also worth a gander.)

<hr>

### <small><sup>Option 3:</sup> Fork this CodePen example 🍴💾✒️

Or, you can simply __[fork this CodePen example](https://codepen.io/seandunlap/full/mLKexe/)__ to dive right in. Enjoy!

## Publishing your scene

If you don't already know, GitHub offers free and awesome publishing of static sites through __[GitHub Pages](https://pages.github.com/)__.

To publish your scene to your personal GitHub Pages:

    npm run deploy

And, it'll now be live at __http://`your_username`.github.io/__ :)

<hr>

To know which GitHub repo to deploy to, the `deploy` script first looks at the optional [`repository` key](https://docs.npmjs.com/files/package.json#repository) in the [`package.json` file](package.json) (see [npm docs](https://docs.npmjs.com/files/package.json#repository) for sample usage). If the `repository` key is missing, the script falls back to using the local git repo's remote origin URL (you can run the local command `git remote -v` to see all your remotes; also, you may refer to the [GitHub docs](https://help.github.com/articles/about-remote-repositories/) for more information).

<hr>

## Still need Help?

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

## License

This program is free software and is distributed under an [MIT License](LICENSE).
