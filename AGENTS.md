# Repository Work Rules

After any successful code, config, or data change:

1. Run the smallest relevant verification command.
2. Stage only the intended files.
3. Commit with a concise message.
4. Push the current branch to `origin`.

Pushing `main` is the deployment handoff. GitHub Actions builds and pushes Docker images, then the server-side Watchtower deployment can pick up the new images.

Do not push if verification fails, secrets are exposed, or the change is only exploratory.
