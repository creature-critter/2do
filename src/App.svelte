<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { loadSettings, settings } from './lib/stores/settings.svelte';
  import { loadLists, listsState } from './lib/stores/lists.svelte';
  import TitleBar from './lib/components/TitleBar.svelte';
  import FlipClock from './lib/components/FlipClock.svelte';
  import ListCard from './lib/components/ListCard.svelte';
  import BottomBar from './lib/components/BottomBar.svelte';

  // Measure each zone independently so fitHeight works regardless of shell height
  let titlebarWrap: HTMLElement | undefined = $state();
  let bodyEl: HTMLElement | undefined = $state();
  let contentEl: HTMLElement | undefined = $state();
  let bottombarWrap: HTMLElement | undefined = $state();

  let win: any = null;
  let LogicalSize: any = null;
  let maxH = 0;

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
    if (!contentEl || !titlebarWrap || !bottombarWrap || !bodyEl || !win || !LogicalSize || !maxH) return;
    try {
      const bs = window.getComputedStyle(bodyEl);
      const bodyPadV = parseFloat(bs.paddingTop) + parseFloat(bs.paddingBottom);
      const total = titlebarWrap.offsetHeight + bodyPadV + contentEl.offsetHeight + bottombarWrap.offsetHeight;
      const h = Math.min(total, maxH);
      await win.setSize(new LogicalSize(window.innerWidth, h));
    } catch {}
  }

  $effect(() => {
    if (!contentEl) return;
    const ro = new ResizeObserver(() => { fitHeight(); });
    ro.observe(contentEl);
    return () => ro.disconnect();
  });
</script>

<div class="shell" data-theme={settings.theme} style:--accent={settings.accentColor}>
  <div class="bar-wrap" bind:this={titlebarWrap}>
    <TitleBar />
  </div>

  <div class="body" bind:this={bodyEl}>
    <div class="content" bind:this={contentEl}>
      <FlipClock />
      <ListCard />
    </div>
  </div>

  <div class="bar-wrap" bind:this={bottombarWrap}>
    <BottomBar />
  </div>
</div>

<style>
  .shell {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
  }

  .bar-wrap {
    flex-shrink: 0;
  }

  .body {
    flex: 1;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: hidden;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    flex-shrink: 0;
  }
</style>
