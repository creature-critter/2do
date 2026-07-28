<script lang="ts">
  let now = $state(new Date());

  $effect(() => {
    const id = setInterval(() => {
      const next = new Date();
      if (next.getMinutes() !== now.getMinutes()) now = next;
    }, 10_000);
    return () => clearInterval(id);
  });

  const h = $derived(String(now.getHours()).padStart(2, '0'));
  const m = $derived(String(now.getMinutes()).padStart(2, '0'));
</script>

<div class="clock-row">
  <div class="digit-card">
    <div class="digit-group"><span class="digit">{h[0]}</span></div>
    <div class="digit-group"><span class="digit">{h[1]}</span></div>
  </div>
  <div class="digit-card">
    <div class="digit-group"><span class="digit">{m[0]}</span></div>
    <div class="digit-group"><span class="digit">{m[1]}</span></div>
  </div>
</div>

<style>
  .clock-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    max-width: 345px;
    margin-inline: auto;
    flex-shrink: 0;
  }

  .digit-card {
    background: var(--surface);
    border: 1px solid var(--surface);
    border-radius: var(--radius-sm);
    padding: 0 var(--spacing-sm);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .digit-group {
    width: 48px;
    height: 104px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .digit-group::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    transform: translateY(-50%);
    background: var(--surface);
    pointer-events: none;
    z-index: 2;
  }

  .digit {
    font-family: 'Geist Mono', monospace;
    font-weight: 200;
    font-size: 80px;
    line-height: normal;
    color: var(--accent);
    white-space: nowrap;
    position: relative;
    z-index: 1;
  }
</style>
