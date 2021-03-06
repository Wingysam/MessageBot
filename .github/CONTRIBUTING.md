### Most importantly

Please do! Any and all help is welcome, even if all you do is file an issue which helps me fix a bug.

### What branch should I work from?

When a large rewrite is taking place, a branch for the primary feature will be added. This is the branch to work from for adding new features. If are fixing a bug which needs to be released before the large feature is released, work from the `master` branch.

### Pull requests

Please keep pull requests to one bugfix / feature, this makes them easier to review and more likely to be merged in.

Don't bump the version - this will be done when publishing so that I can review changes to ensure semver is followed.

#### Code style

- Indent with 4 spaces
- Semicolons only if required
- Variables, methods, and properties are `camelCased`, classes and interfaces are `PascalCased`.
- Write JSDoc comments at a minimum for methods accessible to extensions, if the method is not exposed, documenting parameters is optional though a summary of the method is a good idea.
- Test coverage must remain at 100%.
