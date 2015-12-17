var path = require('path');
var spawn = require('child_process').spawn;

var gitconfig = require('gitconfiglocal');
var ghpages = require('gh-pages');
var ghUrl = require('parse-github-url');

function lower (str) {
  return (str || '').toLowerCase().trim();
}

function getCacheDir (ghUser, ghRepo, ghBranch) {
  var pathAbsolute = path.resolve(
    __dirname, '.cache', lower(ghUser), lower(ghRepo), lower(ghBranch));
  return path.relative(process.cwd(), pathAbsolute);
}

module.exports = function (opts, cb) {
  // TODO: Document this CLI option and probably rename it to `path`.
  var cwd = opts.dir || process.cwd();

  // Parse the project's `package.json` so we can use the `repository` key.
  var pkg = {};
  try {
    pkg = require(path.join(cwd, 'package.json'));
  } catch (e) {
  }
  var pkgRepo = pkg.repository || '';
  var repoUrl = typeof pkgRepo === 'string' ? pkgRepo : pkgRepo.url;
  if (repoUrl) {
    deploy();
    return;
  }

  gitconfig(cwd, function (err, config) {
    if (err) { console.warn('gitconfig error: %s', err); }

    try {
      repoUrl = config.remote.origin.url;
    } catch (e) {}

    if (repoUrl) {
      deploy();
      return;
    }

    return cb(new Error('Expected a valid `repository` in the ' +
      '`package.json` or `remote.origin.url` in the Git repo.'));
  });

  function deploy () {
    var gh = ghUrl(repoUrl);

    if (opts.repo) {
      if (opts.repo.indexOf('/') === -1) {
        // If it doesn't contain a `/`, we assume only the username is different.
        gh.user = opts.repo;
        gh.repopath = gh.user + '/' + gh.repo;
      } else {
        // Otherwise, assume it's a parsable Git(Hub) URL.
        gh = ghUrl(opts.repo);
      }
    }

    gh.branch = 'gh-pages';

    // TODO: Add a `CNAME` file in the directory before we push.
    // if (opts.domain) {
    //   fs.writeFileSync(path.join(opts.cwd, 'CNAME'), opts.domain);
    // }

    // Reconstruct the URL to the GitHub repo.
    gh.repoUrl = 'git@github.com:' + gh.repopath + '.git';
    gh.ghPagesUrl = 'https://' + gh.user + '.github.io/' + gh.repo + '/';

    var src = path.join(cwd, opts.path);

    console.log('Publishing from %s to %s', src, gh.repoUrl);

    // ghpages.clean();  // Wipe out the checkout from scratch every time in case we change repos.

    ghpages.publish(path.join(cwd, opts.path), {
      clone: getCacheDir(gh.user, gh.repo, gh.branch),
      repo: gh.repoUrl,
      dotfiles: false,
      logger: console.log.bind(console)
    }, function (err) {
      cb(err, gh);
    });
  }
};
