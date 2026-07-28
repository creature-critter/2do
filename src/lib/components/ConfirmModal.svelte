<script lang="ts">
  let { onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="overlay" onclick={onCancel}>
  <div class="card" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
    <div class="content">
      <div class="text-group">
        <p class="title">r u sure u want to remove?</p>
        <p class="subtitle">list will be lost to time...../ </p>
      </div>
      <span class="emoji" aria-hidden="true">😖</span>
      <div class="buttons">
        <button class="btn" onclick={onConfirm}>y es</button>
        <button class="btn" onclick={onCancel}>no, take me back</button>
      </div>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(18, 18, 18, 0.8);
    backdrop-filter: blur(2.75px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--spacing-md);
    width: calc(100% - var(--spacing-xl));
    max-width: 300px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .text-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .title {
    font-family: 'Work Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: var(--text);
    white-space: nowrap;
  }

  .subtitle {
    font-family: 'Geist Mono', monospace;
    font-weight: 300;
    font-size: 12px;
    color: var(--text);
    white-space: nowrap;
  }

  .emoji {
    font-size: 48px;
    line-height: 1;
  }

  .buttons {
    display: flex;
    gap: var(--spacing-md);
  }

  .btn {
    background: var(--bg);
    border: none;
    border-radius: var(--radius-sm);
    padding: var(--spacing-sm);
    width: 107px;
    text-align: center;
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    color: var(--text);
    transition: background 0.1s;
  }

  .btn:hover {
    background: var(--surface-dim);
  }
</style>
