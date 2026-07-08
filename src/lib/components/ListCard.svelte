<script lang="ts">
  import type { TodoList } from '../stores/lists.svelte';
  import { removeList, addItem } from '../stores/lists.svelte';
  import ListItem from './ListItem.svelte';

  let { list }: { list: TodoList } = $props();

  let showGhost = $state(false);
  let showKebab = $state(false);
  let newText = $state('');
  let inputEl: HTMLInputElement | null = null;

  const atCap = $derived(list.type === 'efficiency' && list.items.length >= 3);

  const typeLabel: Record<typeof list.type, string> = {
    daily: '📅',
    efficiency: '⚡',
    unlimited: '♾️',
  };

  function revealGhost() {
    if (atCap) return;
    showGhost = true;
    setTimeout(() => inputEl?.focus(), 0);
  }

  function submit() {
    const text = newText.trim();
    if (text) { addItem(list.id, text); newText = ''; }
    showGhost = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  class="list-card"
  onclick={() => { if (showKebab) showKebab = false; }}
>
  <header>
    <span class="type-icon" title={list.type}>{typeLabel[list.type]}</span>
    <h3>{list.name}</h3>
    <div class="kebab-wrap">
      <button class="kebab-btn" onclick={(e) => { e.stopPropagation(); showKebab = !showKebab; }}>⋮</button>
      {#if showKebab}
        <div class="kebab-menu">
          <button onclick={() => removeList(list.id)}>Remove list</button>
        </div>
      {/if}
    </div>
  </header>

  <ul>
    {#each list.items as item (item.id)}
      <ListItem {item} listId={list.id} />
    {/each}
  </ul>

  <div class="ghost-area" role="button" tabindex="0" onmouseenter={revealGhost} onmouseleave={() => { if (!newText) showGhost = false; }}>
    {#if showGhost && !atCap}
      <input
        bind:this={inputEl}
        bind:value={newText}
        type="text"
        placeholder="Add a task…"
        onkeydown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') { newText = ''; showGhost = false; } }}
        onblur={() => { if (!newText) showGhost = false; }}
      />
    {:else if atCap}
      <span class="cap-msg">Efficiency list full (3/3)</span>
    {:else}
      <span class="ghost-hint">+ add task</span>
    {/if}
  </div>
</div>

<style>
  .list-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    width: 260px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .type-icon { font-size: 0.9rem; }
  h3 { flex: 1; font-size: 0.95rem; font-weight: 600; }

  .kebab-wrap { position: relative; }
  .kebab-btn {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-size: 1.1rem; line-height: 1;
    padding: 0.2rem; border-radius: 4px;
  }
  .kebab-btn:hover { background: var(--border); }

  .kebab-menu {
    position: absolute; right: 0; top: calc(100% + 4px);
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 0.25rem; z-index: 20; min-width: 130px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
  .kebab-menu button {
    width: 100%; text-align: left; background: none; border: none;
    padding: 0.45rem 0.6rem; cursor: pointer; color: var(--text);
    border-radius: 5px; font-size: 0.85rem;
  }
  .kebab-menu button:hover { background: var(--border); }

  ul { display: flex; flex-direction: column; gap: 0.1rem; min-height: 0.5rem; }

  .ghost-area {
    padding: 0.3rem 0.4rem;
    min-height: 2rem;
    display: flex;
    align-items: center;
  }
  .ghost-hint {
    color: var(--text-muted);
    font-size: 0.82rem;
    opacity: 0;
    transition: opacity 0.15s;
    cursor: pointer;
  }
  .list-card:hover .ghost-hint { opacity: 1; }

  input {
    width: 100%; background: none; border: none;
    border-bottom: 1px solid var(--accent);
    color: var(--text); font-size: 0.88rem;
    padding: 0.15rem 0; outline: none;
    font-family: inherit;
  }

  .cap-msg { font-size: 0.75rem; color: var(--text-muted); }
</style>
