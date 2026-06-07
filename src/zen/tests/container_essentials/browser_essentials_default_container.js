/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Regression test: with separate-essentials enabled, a default-container tab
// must still be addable to essentials when the active workspace has no
// explicit container. Migrated/synced workspaces can lack `containerTabId`
// entirely, and `0 != undefined` previously disabled the action even though
// the essentials count was well below the limit.
add_task(async function test_default_container_tab_can_be_essential() {
  const workspace = gZenWorkspaces.getActiveWorkspaceFromCache();
  const originalContainerTabId = workspace.containerTabId;
  workspace.containerTabId = undefined;
  const tab = BrowserTestUtils.addTab(gBrowser, "about:blank", {
    skipAnimation: true,
  });
  try {
    Assert.ok(
      gZenPinnedTabManager.canEssentialBeAdded(tab),
      "A default-container tab can be added to essentials in a workspace without an explicit container."
    );
  } finally {
    workspace.containerTabId = originalContainerTabId;
    BrowserTestUtils.removeTab(tab);
  }
});
