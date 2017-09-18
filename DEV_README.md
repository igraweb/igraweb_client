# Running

1. Run a Backend Server (you can use staging or production if you want to).
2. Run a frontend. (This can be the `igraweb5_example_app` rails application or anything that runs a server and can server the igraweb client library).
3. Make sure that you have the correct access key configuration.

# Deploying

1. If you make changes, make sure you commit them in git.
2. Then run `npm version [major|minor|patch]` (see [https://docs.npmjs.com/cli/version](https://docs.npmjs.com/cli/version)) to bump the version
3. Push to git (the above command creates a git tag for the version number)
4. Then run `npm publish`. This will build the package and then push it to the npm registry.
5. Now npm update or yarn upgrade will install the new package version.

# TODO

1. Come up with a better way to do section edit buttons on hover. Currently nested sections will overlap buttons, which makes it sometimes impossilbe to click on the edit section button.
