<script lang="ts">
  import { onMount } from 'svelte';

  let isMaximized = $state(false);

  onMount(() => {
    let unlisten: (() => void) | null = null;

    (async () => {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = getCurrentWindow();
        isMaximized = await win.isMaximized();
        unlisten = await win.onResized(async () => {
          isMaximized = await win.isMaximized();
        });
      } catch {}
    })();

    return () => { unlisten?.(); };
  });

  async function minimize() {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().minimize();
    } catch {}
  }

  async function toggleExpand() {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const win = getCurrentWindow();
      if (isMaximized) {
        await win.unmaximize();
      } else {
        await win.maximize();
      }
    } catch {}
  }

  async function closeWindow() {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch {}
  }
</script>

<div class="titlebar" data-tauri-drag-region>
  <div class="drag-region" data-tauri-drag-region></div>
  <div class="controls">

    <!-- Minimize -->
    <button class="ctrl-btn" onclick={minimize} data-tooltip="Minimize" data-tooltip-dir="bottom">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.66667 10.3333C6.47778 10.3333 6.31944 10.2694 6.19167 10.1417C6.06389 10.0139 6 9.85556 6 9.66667C6 9.47778 6.06389 9.31944 6.19167 9.19167C6.31944 9.06389 6.47778 9 6.66667 9H13.3333C13.5222 9 13.6806 9.06389 13.8083 9.19167C13.9361 9.31944 14 9.47778 14 9.66667C14 9.85556 13.9361 10.0139 13.8083 10.1417C13.6806 10.2694 13.5222 10.3333 13.3333 10.3333H6.66667Z" fill="currentColor"/>
      </svg>
    </button>

    <!-- Restore / Expand (toggles based on window state) -->
    <button class="ctrl-btn" onclick={toggleExpand} data-tooltip={isMaximized ? 'Restore' : 'Expand'} data-tooltip-dir="bottom">
      {#if isMaximized}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 12.3333H15V5.66667H7V12.3333ZM7 13.6667C6.63333 13.6667 6.31944 13.5361 6.05833 13.275C5.79722 13.0139 5.66667 12.7 5.66667 12.3333V4.33333C5.66667 3.96667 5.79722 3.65278 6.05833 3.39167C6.31944 3.13056 6.63333 3 7 3H15C15.3667 3 15.6806 3.13056 15.9417 3.39167C16.2028 3.65278 16.3333 3.96667 16.3333 4.33333V12.3333C16.3333 12.7 16.2028 13.0139 15.9417 13.275C15.6806 13.5361 15.3667 13.6667 15 13.6667H7ZM4.33333 16.3333C3.96667 16.3333 3.65278 16.2028 3.39167 15.9417C3.13056 15.6806 3 15.3667 3 15V6.33333C3 6.14444 3.06389 5.98611 3.19167 5.85833C3.31944 5.73056 3.47778 5.66667 3.66667 5.66667C3.85556 5.66667 4.01389 5.73056 4.14167 5.85833C4.26944 5.98611 4.33333 6.14444 4.33333 6.33333V15H13C13.1889 15 13.3472 15.0639 13.475 15.1917C13.6028 15.3194 13.6667 15.4778 13.6667 15.6667C13.6667 15.8556 13.6028 16.0139 13.475 16.1417C13.3472 16.2694 13.1889 16.3333 13 16.3333H4.33333Z" fill="currentColor"/>
        </svg>
      {:else}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.33333 14.3333H14.3333V7.66667H6.33333V14.3333ZM6.33333 15.6667C5.96667 15.6667 5.65278 15.5361 5.39167 15.275C5.13056 15.0139 5 14.7 5 14.3333V6.33333C5 5.96667 5.13056 5.65278 5.39167 5.39167C5.65278 5.13056 5.96667 5 6.33333 5H14.3333C14.7 5 15.0139 5.13056 15.275 5.39167C15.5361 5.65278 15.6667 5.96667 15.6667 6.33333V14.3333C15.6667 14.7 15.5361 15.0139 15.275 15.275C15.0139 15.5361 14.7 15.6667 14.3333 15.6667H6.33333Z" fill="currentColor"/>
        </svg>
      {/if}
    </button>

    <!-- Close -->
    <button class="ctrl-btn close-btn" onclick={closeWindow} data-tooltip="Close" data-tooltip-dir="bottom">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.3833 11.3167L7.11667 14.5833C6.99444 14.7056 6.83889 14.7667 6.65 14.7667C6.46111 14.7667 6.30556 14.7056 6.18333 14.5833C6.06111 14.4611 6 14.3056 6 14.1167C6 13.9278 6.06111 13.7722 6.18333 13.65L9.45 10.3833L6.18333 7.11667C6.06111 6.99444 6 6.83889 6 6.65C6 6.46111 6.06111 6.30556 6.18333 6.18333C6.30556 6.06111 6.46111 6 6.65 6C6.83889 6 6.99444 6.06111 7.11667 6.18333L10.3833 9.45L13.65 6.18333C13.7722 6.06111 13.9278 6 14.1167 6C14.3056 6 14.4611 6.06111 14.5833 6.18333C14.7056 6.30556 14.7667 6.46111 14.7667 6.65C14.7667 6.83889 14.7056 6.99444 14.5833 7.11667L11.3167 10.3833L14.5833 13.65C14.7056 13.7722 14.7667 13.9278 14.7667 14.1167C14.7667 14.3056 14.7056 14.4611 14.5833 14.5833C14.4611 14.7056 14.3056 14.7667 14.1167 14.7667C13.9278 14.7667 13.7722 14.7056 13.65 14.5833L10.3833 11.3167Z" fill="currentColor"/>
      </svg>
    </button>

  </div>
</div>

<style>
  .titlebar {
    height: 32px;
    background: var(--surface);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .drag-region {
    flex: 1;
    height: 100%;
  }

  .controls {
    display: flex;
    height: 100%;
  }

  .ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    color: var(--text-muted);
    transition: color 0.1s, background 0.1s;
    flex-shrink: 0;
  }

  .ctrl-btn:hover {
    color: var(--text);
    background: rgba(255, 255, 255, 0.08);
  }

  .close-btn:hover {
    background: var(--red);
    color: white;
  }

</style>
