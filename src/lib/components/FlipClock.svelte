<script lang="ts">
  let now = $state(new Date());

  $effect(() => {
    const id = setInterval(() => {
      const next = new Date();
      if (next.getMinutes() !== now.getMinutes()) now = next;
    }, 10_000);
    return () => clearInterval(id);
  });

  const hours = $derived(String(now.getHours()).padStart(2, '0'));
  const minutes = $derived(String(now.getMinutes()).padStart(2, '0'));
</script>

<div class="flip-clock">
  <div class="card">{hours}</div>
  <span class="sep">:</span>
  <div class="card">{minutes}</div>
</div>

<style>
  .flip-clock {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-family: monospace;
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.1em 0.4em;
    color: var(--text);
    min-width: 2ch;
    text-align: center;
  }
  .sep {
    color: var(--text-muted);
    line-height: 1;
    padding-bottom: 0.1em;
  }
</style>
