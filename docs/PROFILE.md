# Maintaining the profile

Edit `README.md` normally. The block between `WORKBENCH:START` and `WORKBENCH:END` is generated; everything outside it is preserved. The same updater also generates the four `assets/flight-log-*.svg` files.

## Automatic workbench

`.github/workflows/workbench.yml` runs daily at 06:23 UTC, on relevant pushes to `main`, or from **Actions → Refresh the workbench → Run workflow**. It uses the built-in `GITHUB_TOKEN`; no personal token, hosted stats service, package installation, or extra secret is needed.

The updater reads the public `/users/ShadowNineX/repos` endpoint, excludes private, archived, disabled, forked, and profile repositories, and shows the three most recently pushed projects. Push dates describe repository activity, not necessarily commits authored by Nine. Repository descriptions are escaped as text. No private activity or commit messages are collected. Failed or empty API responses leave the previous content intact and fail the workflow.

Run locally with Node.js 22 or newer:

```sh
node --test scripts/*.test.mjs
node scripts/update-workbench.mjs
```

Local reads can run without authentication. An optional `GITHUB_TOKEN` environment variable raises the API rate limit. The script never logs it. No-op refreshes create no commits. A concurrent edit to `main` makes a normal push fail safely; rerun the workflow to refresh from the new version. Branch protection may require allowing the workflow to write or using a pull request instead. GitHub may delay scheduled runs and disables schedules after 60 days of inactivity in public repositories.

The flight log reuses the same API response and repository filter, but includes every eligible repository rather than only the newest three. Each repository is counted under its GitHub primary language (or `Unspecified`), so the bars describe project counts, not bytes or lines of code. The five largest language groups are shown individually, with any remainder combined as `Other languages`; the SVG description includes the full breakdown. No private or organization repository data is requested. Network/data validation happens before writes, and each changed file is replaced atomically. A failed workflow does not reach the commit step.

## Visual assets

The warm SVG headers are self-contained geometry and text, with light, dark, and compact variants. Motion stops after a short introduction and respects `prefers-reduced-motion`. They do not depend on a font server or JavaScript. The static composition stays complete when animation is disabled.

The existing Tails greeting, workshop illustration, Spotify, and Last.fm are retained. The supplied Labs logo is included intact. The old activity-graph endpoint returned HTTP 402 during verification, so a direct contribution-history link replaces that broken image. External music widgets can be cached or temporarily unavailable; direct listening links remain usable. The contribution snake is generated weekly on the `output` branch, with colors matched to the profile.

The original ShadowNine/Tails wordmark opens the profile. The ShadowNine/Shadorux artwork has its own friendship section, with both of Shadorux's existing links. All pre-existing local graphics remain byte-for-byte unchanged. The new flight log has light/dark and compact variants, with no animation or third-party stats endpoint. GitHub supplies the surrounding page styles; navigation, headings, and disclosures use native Markdown/HTML.

Sources: [GitHub profile formatting](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github), [scheduled workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule), [snake palette options](https://github.com/Platane/snk#usage).
