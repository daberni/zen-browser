# Indicate the tab's current container in the container context menus

> Venue: GitHub **Discussion** (Ideas) — this is an enhancement / a deliberate
> divergence from Firefox, so it does not fit the bug-report template
> (`config.yml` routes feature requests to Discussions; the bug template requires
> "not an enhancement" and "cannot be reproduced on Mozilla Firefox", neither of
> which holds here). Can be opened as / followed by a PR.

## Context / motivation
<!-- YOUR CONTEXT HERE — describe the real-world situation that made this annoying.
     e.g. heavy container/workspace user, can't tell at a glance which container a tab is in, etc. -->

## Summary
The container pickers built by `createUserContextMenu` (the tab context menu's
**Open in New Container Tab**, the link context menu's **Open Link in New Container Tab**,
and Zen's **Set Profile** workspace menu) currently **exclude** the tab's / workspace's
current container from the list. As a result there is **no indication of which container
the current tab or workspace is already associated with**.

This proposal: stop hiding the current container and instead **mark it with a checkmark**
(including the "No Container" case), so the menu doubles as a clear "you are here" indicator.

## Current behavior
- **Open in New Container Tab** (tab right-click): the container the tab is in is omitted
  from the submenu, so nothing tells you which one it's in.
- **Set Profile** (workspace menu): the currently assigned container is omitted, so the menu
  never shows the active selection.

Current state — current container is missing, nothing is marked:

<!-- SCREENSHOT: Open in New Container Tab submenu, current state -->
![Open in New Container Tab — current](URL_OR_DRAG_IMAGE_HERE)

<!-- SCREENSHOT: Set Profile menu, current state -->
![Set Profile — current](URL_OR_DRAG_IMAGE_HERE)

## Proposed behavior
The current container (or **No Container**) stays in the list and gets the native menu
checkmark, keeping its colored container icon:

<!-- SCREENSHOT: proposed, with checkmark on current container -->
![Open in New Container Tab — proposed](URL_OR_DRAG_IMAGE_HERE)

<!-- SCREENSHOT: Set Profile proposed, with checkmark (incl. No Container when unassigned) -->
![Set Profile — proposed](URL_OR_DRAG_IMAGE_HERE)

## Why this is worth it
- Answers "which container is this tab/workspace in?" directly from the menu.
- Consistent indicator across all container pickers (they share one helper).
- The checkmark is the native macOS/Windows convention for "current selection",
  matching how other Zen menus mark state.

## Scope / implementation sketch
All these menus go through a single shared helper, `createUserContextMenu`
(`browser/base/content/utilityOverlay.js`). The change is essentially:
- don't `return`/skip the current container — render it `checked`,
- mark **No Container** as checked when there is no current container,
- callers pass the current container via the existing option; no per-caller menu rebuilding.

No new tab-context patch and no new option are required — it reuses the existing
`excludeUserContextId` plumbing, so the patch footprint stays small.

## Open questions for discussion
1. **Divergence from Firefox:** upstream intentionally hides the current container in
   *Open in New Container Tab* (reopening into the same container is a no-op). Are we happy
   diverging here, given clicking the checked entry is already a harmless no-op?
2. **Clickability:** keep the checked current entry clickable (no-op) vs. disable it?
3. **"No Container" on plain tabs:** in the *Open in New Container Tab* menu, should a
   container-less tab also show **No Container** checked? (Covering that is the one case
   that needs a small `tabbrowser.js` caller tweak.)

## Environment
- Zen version: <!-- Help → About Zen, e.g. 1.x.x -->
- Platform: <!-- macOS aarch64 / Windows x64 / Linux ... -->

I have a working implementation and am happy to open a PR if there's appetite for this.
