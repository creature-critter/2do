<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import { loadSettings, settings } from './lib/stores/settings.svelte';
  import { loadLists, listsState } from './lib/stores/lists.svelte';
  import TitleBar from './lib/components/TitleBar.svelte';
  import FlipClock from './lib/components/FlipClock.svelte';
  import ListCard from './lib/components/ListCard.svelte';
  import BottomBar from './lib/components/BottomBar.svelte';

  let contentEl: HTMLElement | undefined = $state();

  let win: any = null;
  let LogicalSize: any = null;
  let maxH = 0;

  // Heights match TitleBar (32px fixed) and BottomBar (80px fixed)
  const TITLEBAR_H = 32;
  const BOTTOMBAR_H = 80;

  onMount(async () => {
    await Promise.all([loadSettings(), loadLists()]);
    try {
      const mod = await import('@tauri-apps/api/window');
      win = mod.getCurrentWindow();
      LogicalSize = mod.LogicalSize;
      maxH = window.screen.availHeight;
      await win.setMaxSize(new LogicalSize(Math.floor(window.screen.availWidth / 2), maxH));
      await tick();
      await fitHeight();
    } catch {}
  });

  async function fitHeight() {
    if (!contentEl || !win || !LogicalSize || !maxH) return;
    try {
      const h = Math.min(TITLEBAR_H + contentEl.offsetHeight + BOTTOMBAR_H, maxH);
      await win.setSize(new LogicalSize(window.innerWidth, h));
    } catch {}
  }

  // Only re-run when list/item counts change — NOT on window resize (no ResizeObserver)
  $effect(() => {
    listsState.lists.length;
    listsState.lists.forEach(l => l.items.length);
    untrack(fitHeight);
  });
</script>

<div class="shell" data-theme={settings.theme} style:--accent={settings.accentColor}>
  <TitleBar />
  <div class="body">
    <div class="content" bind:this={contentEl}>
      <FlipClock />
      <ListCard />
    </div>
  </div>
  <BottomBar />
</div>

<style>
  .shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
  }

  .body {
    flex: 1;
    /* Top/bottom padding clears the fixed TitleBar and BottomBar */
    padding: 32px var(--spacing-xl) 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }
</style>
