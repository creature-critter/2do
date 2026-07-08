<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, loadSettings, saveSettings } from './lib/stores/settings.svelte';
  import { listsState, loadLists, addList } from './lib/stores/lists.svelte';
  import type { ListType } from './lib/stores/lists.svelte';
  import FlipClock from './lib/components/FlipClock.svelte';
  import ListCard from './lib/components/ListCard.svelte';

  let showAddForm = $state(false);
  let newName = $state('');
  let newType = $state<ListType>('daily');

  onMount(async () => {
    await Promise.all([loadSettings(), loadLists()]);
  });

  function toggleTheme() {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings();
  }

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addList(name, newType);
    newName = '';
    showAddForm = false;
  }
</script>

<div class="app" data-theme={settings.theme} style="--accent: {settings.accentColor}">
  <header>
    <FlipClock />
    <div class="header-actions">
      <button class="icon-btn" onclick={toggleTheme} title="Toggle theme">
        {settings.theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  </header>

  <main>
    <div class="lists-row">
      {#each listsState.lists as list (list.id)}
        <ListCard {list} />
      {/each}

      <!-- Add list -->
      {#if showAddForm}
        <div class="add-form">
          <div class="type-row">
            {#each (['daily', 'efficiency', 'unlimited'] as ListType[]) as t}
              <button
                class="type-chip"
                class:active={newType === t}
                onclick={() => newType = t}
              >
                {t === 'daily' ? '📅' : t === 'efficiency' ? '⚡' : '♾️'} {t}
              </button>
            {/each}
          </div>
          <input
            type="text"
            placeholder="List name…"
            bind:value={newName}
            autofocus
            onkeydown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') { showAddForm = false; newName = ''; }
            }}
          />
          <div class="form-btns">
            <button class="btn-primary" onclick={handleAdd}>Add</button>
            <button class="btn-ghost" onclick={() => { showAddForm = false; newName = ''; }}>Cancel</button>
          </div>
        </div>
      {:else}
        <button class="add-list-btn" onclick={() => showAddForm = true}>+ Add List</button>
      {/if}
    </div>
  </main>
</div>

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
    transition: background 0.25s, color 0.25s;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .header-actions { display: flex; gap: 0.5rem; }
  .icon-btn {
    background: none; border: none; cursor: pointer;
    font-size: 1.1rem; padding: 0.35rem; border-radius: 7px;
    transition: background 0.1s;
  }
  .icon-btn:hover { background: var(--border); }

  main {
    flex: 1;
    overflow: auto;
    padding: 1.5rem;
  }

  .lists-row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  /* --- add list button --- */
  .add-list-btn {
    background: none;
    border: 2px dashed var(--border);
    border-radius: var(--radius);
    color: var(--accent);
    padding: 1rem 1.25rem;
    cursor: pointer;
    font-size: 0.88rem;
    min-width: 160px;
    align-self: stretch;
    min-height: 80px;
    transition: border-color 0.15s, background 0.15s;
  }
  .add-list-btn:hover {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  /* --- add list form --- */
  .add-form {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    width: 260px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .type-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .type-chip {
    flex: 1; padding: 0.35rem 0.4rem;
    border: 1px solid var(--border); border-radius: 6px;
    background: none; color: var(--text-muted);
    cursor: pointer; font-size: 0.72rem; font-family: inherit;
    text-transform: capitalize; transition: border-color 0.1s, color 0.1s;
  }
  .type-chip.active { border-color: var(--accent); color: var(--accent); }

  input {
    width: 100%; background: none; border: none;
    border-bottom: 1px solid var(--accent);
    color: var(--text); font-size: 0.9rem;
    padding: 0.2rem 0; outline: none; font-family: inherit;
  }

  .form-btns { display: flex; gap: 0.5rem; justify-content: flex-end; }
  .btn-primary {
    background: var(--accent); border: none; border-radius: 6px;
    color: #fff; padding: 0.35rem 0.8rem; cursor: pointer;
    font-size: 0.82rem; font-family: inherit;
  }
  .btn-ghost {
    background: none; border: none; color: var(--text-muted);
    cursor: pointer; font-size: 0.82rem; font-family: inherit;
  }
</style>
