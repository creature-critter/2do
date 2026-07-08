<script lang="ts">
  import type { ListItem } from '../stores/lists.svelte';
  import { removeItem, setItemCompleted } from '../stores/lists.svelte';

  let { item, listId }: { item: ListItem; listId: string } = $props();
  let hovering = $state(false);
</script>

<li
  class:completed={item.completed}
  onmouseenter={() => hovering = true}
  onmouseleave={() => hovering = false}
>
  <span class="text">{item.text}</span>

  {#if hovering}
    {#if !item.completed}
      <button
        class="icon-btn"
        title="Mark complete"
        onclick={() => setItemCompleted(listId, item.id, true)}
      >✏️</button>
      <button
        class="icon-btn"
        title="Remove"
        onclick={() => removeItem(listId, item.id)}
      >🗑️</button>
    {:else}
      <button
        class="icon-btn"
        title="Unmark"
        onclick={() => setItemCompleted(listId, item.id, false)}
      >🧹</button>
    {/if}
  {/if}
</li>

<style>
  li {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.4rem;
    border-radius: 6px;
    min-height: 2rem;
    transition: background 0.1s;
    list-style: none;
  }
  li:hover { background: var(--border); }

  .text {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.3;
  }
  .completed .text {
    text-decoration: line-through;
    text-decoration-color: var(--accent);
    text-decoration-thickness: 2px;
    color: var(--text-muted);
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.1rem 0.25rem;
    border-radius: 4px;
    font-size: 0.85rem;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.1s;
  }
  .icon-btn:hover { opacity: 1; }
</style>
