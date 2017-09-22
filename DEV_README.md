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

1. Install Handlebars and replace all template strings with Handlebars templates.
2. BUG: ACE editor will not allow form tags, because it is inside a form. See [https://github.com/froala/wysiwyg-editor/issues/984](https://github.com/froala/wysiwyg-editor/issues/984) for possible solutions. Probably the best solution would be to move it out of the form tag (or just dont use a form at all. It isnt really necessary)
