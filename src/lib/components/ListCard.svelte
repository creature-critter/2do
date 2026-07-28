<script lang="ts">
  import type { TodoList, ListType } from '../stores/lists.svelte';
  import { listsState, removeList, addList, renameList, addItem } from '../stores/lists.svelte';
  import ListItem from './ListItem.svelte';
  import ConfirmModal from './ConfirmModal.svelte';

  let showTypePicker = $state(false);
  let kebabOpenId = $state<string | null>(null);
  let confirmRemoveId = $state<string | null>(null);
  let editingTitleId = $state<string | null>(null);
  let editingTitleValue = $state('');
  let titleInputEl: HTMLInputElement | null = $state(null);
  let addTaskInputId = $state<string | null>(null);
  let newTaskText = $state('');
  let taskInputEl: HTMLInputElement | null = $state(null);

  const TYPE_OPTIONS: { label: string; name: string; type: ListType; badge: string }[] = [
    { label: 'Daily list',            name: 'Daily list',            type: 'daily',      badge: '∞' },
    { label: 'Get shit DONE list!!!', name: 'Get shit DONE list!!!', type: 'efficiency', badge: '3' },
    { label: 'Custom',                name: 'Custom',                type: 'unlimited',  badge: '∞' },
  ];

  let takenTypes = $derived(new Set(listsState.lists.map(l => l.type)));
  let allTypesTaken = $derived(takenTypes.size >= TYPE_OPTIONS.length);

  function pickType(opt: typeof TYPE_OPTIONS[0]) {
    addList(opt.name, opt.type);
    showTypePicker = false;
    if (opt.type === 'unlimited') {
      const newList = listsState.lists[listsState.lists.length - 1];
      if (newList) setTimeout(() => startEditTitle(newList), 30);
    }
  }

  function atCap(list: TodoList) {
    return list.type === 'efficiency' && list.items.length >= 3;
  }

  function startAddTask(listId: string) {
    addTaskInputId = listId;
    newTaskText = '';
    setTimeout(() => taskInputEl?.focus(), 0);
  }

  function submitTask(listId: string) {
    const text = newTaskText.trim();
    if (text) { addItem(listId, text); newTaskText = ''; }
    addTaskInputId = null;
  }

  function startEditTitle(list: TodoList) {
    editingTitleId = list.id;
    editingTitleValue = list.name;
    kebabOpenId = null;
    setTimeout(() => { titleInputEl?.focus(); titleInputEl?.select(); }, 0);
  }

  function submitTitle() {
    const name = editingTitleValue.trim();
    if (name && editingTitleId) renameList(editingTitleId, name);
    editingTitleId = null;
  }

  function cancelEditTitle() {
    editingTitleId = null;
    editingTitleValue = '';
  }

  function closeKebab() { kebabOpenId = null; }

  $effect(() => {
    if (!kebabOpenId) return;
    const handler = (e: MouseEvent) => {
      const inKebab = e.composedPath().some(
        el => (el as Element).classList?.contains('kebab-wrap')
      );
      if (!inKebab) kebabOpenId = null;
    };
    const id = setTimeout(() => window.addEventListener('click', handler, true), 0);
    return () => { clearTimeout(id); window.removeEventListener('click', handler, true); };
  });
</script>

{#if confirmRemoveId}
  <ConfirmModal
    onConfirm={() => { removeList(confirmRemoveId!); confirmRemoveId = null; }}
    onCancel={() => { confirmRemoveId = null; }}
  />
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="list-card" onclick={closeKebab}>

  <!-- ── Content ── -->
  <div class="card-content">

    {#if listsState.lists.length === 0 && !showTypePicker}
      <!-- Empty state -->
      <div class="empty-state">
        <p class="empty-title">hi there :D</p>
        <p class="empty-sub">Start by adding a list of your choice!</p>
      </div>

    {:else if listsState.lists.length > 0}
      <!-- List sections -->
      <div class="slot">
        {#each listsState.lists as list, i (list.id)}
          {#if i > 0}
            <div class="divider" role="separator">
              <div class="divider-line"></div>
            </div>
          {/if}

          <div class="list-section">
            <div class="section-spacer"></div>

            <div class="list-header">
              <div class="header-left">
                {#if list.type === 'efficiency'}
                  <div class="task-count-wrap">
                    <div class="task-count" class:at-cap={list.items.length >= 3}>
                      <span>{list.items.length}/3</span>
                    </div>
                  </div>
                {:else if list.type === 'daily'}
                  <svg class="daily-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path transform="translate(0.44, 1.67)" fill="currentColor" d="M2.89833 8.35417C2.89833 9.53472 3.19347 10.6319 3.78375 11.6458C4.37403 12.6597 5.17611 13.4722 6.19 14.0833C6.38444 14.2083 6.51986 14.3785 6.59625 14.5938C6.67264 14.809 6.65528 15.0139 6.54417 15.2083C6.43306 15.4167 6.26292 15.5521 6.03375 15.6146C5.80458 15.6771 5.58583 15.6528 5.3775 15.5417C4.08583 14.7917 3.07194 13.7778 2.33583 12.5C1.59972 11.2222 1.23167 9.84028 1.23167 8.35417C1.23167 7.99306 1.25597 7.63889 1.30458 7.29167C1.35319 6.94444 1.41917 6.59722 1.5025 6.25L1.23167 6.41667C1.03722 6.54167 0.828889 6.57292 0.606667 6.51042C0.384444 6.44792 0.217778 6.31944 0.106667 6.125C-0.00444445 5.93056 -0.02875 5.71875 0.03375 5.48958C0.09625 5.26042 0.224722 5.09028 0.419167 4.97917L2.94 3.52083C3.13444 3.40972 3.34625 3.38542 3.57542 3.44792C3.80458 3.51042 3.97472 3.63889 4.08583 3.83333L5.54417 6.33333C5.65528 6.52778 5.67958 6.73958 5.61708 6.96875C5.55458 7.19792 5.42611 7.36806 5.23167 7.47917C5.03722 7.59028 4.82542 7.61458 4.59625 7.55208C4.36708 7.48958 4.19694 7.36111 4.08583 7.16667L3.3775 5.9375C3.22472 6.32639 3.10667 6.72222 3.02333 7.125C2.94 7.52778 2.89833 7.9375 2.89833 8.35417ZM9.565 1.66667C8.99556 1.66667 8.43306 1.73958 7.8775 1.88542C7.32194 2.03125 6.79417 2.24306 6.29417 2.52083C6.08583 2.63194 5.86708 2.67014 5.63792 2.63542C5.40875 2.60069 5.23861 2.48611 5.1275 2.29167C5.0025 2.06944 4.97472 1.84375 5.04417 1.61458C5.11361 1.38542 5.25944 1.20833 5.48167 1.08333C6.10667 0.722222 6.76292 0.451389 7.45042 0.270833C8.13792 0.0902778 8.84278 0 9.565 0C10.6622 0 11.7143 0.204861 12.7213 0.614583C13.7282 1.02431 14.6275 1.61806 15.4192 2.39583V2.08333C15.4192 1.84722 15.499 1.64931 15.6588 1.48958C15.8185 1.32986 16.0164 1.25 16.2525 1.25C16.4886 1.25 16.6865 1.32986 16.8463 1.48958C17.006 1.64931 17.0858 1.84722 17.0858 2.08333V5C17.0858 5.23611 17.006 5.43403 16.8463 5.59375C16.6865 5.75347 16.4886 5.83333 16.2525 5.83333H13.3358C13.0997 5.83333 12.9018 5.75347 12.7421 5.59375C12.5824 5.43403 12.5025 5.23611 12.5025 5C12.5025 4.76389 12.5824 4.56597 12.7421 4.40625C12.9018 4.24653 13.0997 4.16667 13.3358 4.16667H14.7733C14.1344 3.375 13.3636 2.76042 12.4608 2.32292C11.5581 1.88542 10.5928 1.66667 9.565 1.66667ZM14.6067 12.7292C15.1344 12.1181 15.5372 11.4444 15.815 10.7083C16.0928 9.97222 16.2317 9.20139 16.2317 8.39583C16.2317 8.15972 16.3115 7.95139 16.4713 7.77083C16.631 7.59028 16.8289 7.5 17.065 7.5C17.3011 7.5 17.499 7.59028 17.6588 7.77083C17.8185 7.95139 17.8983 8.15972 17.8983 8.39583C17.8983 9.29861 17.756 10.1701 17.4713 11.0104C17.1865 11.8507 16.7733 12.6319 16.2317 13.3542C15.69 14.0764 15.0476 14.6944 14.3046 15.2083C13.5615 15.7222 12.7525 16.1042 11.8775 16.3542L12.0858 16.4792C12.2803 16.5903 12.4053 16.7604 12.4608 16.9896C12.5164 17.2188 12.4886 17.4306 12.3775 17.625C12.2664 17.8194 12.0997 17.9444 11.8775 18C11.6553 18.0556 11.4469 18.0278 11.2525 17.9167L8.71083 16.4583C8.51639 16.3472 8.38792 16.1771 8.32542 15.9479C8.26292 15.7188 8.28722 15.5069 8.39833 15.3125L9.85667 12.7917C9.96778 12.5972 10.1344 12.4722 10.3567 12.4167C10.5789 12.3611 10.7872 12.3889 10.9817 12.5C11.1761 12.6111 11.3046 12.7813 11.3671 13.0104C11.4296 13.2396 11.4053 13.4514 11.2942 13.6458L10.5233 14.9583C11.315 14.8472 12.0615 14.6007 12.7629 14.2188C13.4643 13.8368 14.0789 13.3403 14.6067 12.7292Z"/>
                  </svg>
                {/if}
                {#if editingTitleId === list.id}
                  <!-- svelte-ignore a11y_autofocus -->
                  <input
                    bind:this={titleInputEl}
                    bind:value={editingTitleValue}
                    type="text"
                    class="title-input"
                    onclick={(e) => e.stopPropagation()}
                    onkeydown={(e) => {
                      if (e.key === 'Enter') submitTitle();
                      if (e.key === 'Escape') cancelEditTitle();
                    }}
                    onblur={submitTitle}
                  />
                {:else}
                  <span class="list-name">{list.name}</span>
                {/if}
              </div>
              <div class="kebab-wrap">
                <button
                  class="kebab-btn"
                  data-tooltip="List options"
                  onclick={(e) => { e.stopPropagation(); kebabOpenId = kebabOpenId === list.id ? null : list.id; }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                    <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
                {#if kebabOpenId === list.id}
                  <div class="kebab-menu" role="menu" onclick={(e) => e.stopPropagation()}>
                    <button role="menuitem" onclick={() => { confirmRemoveId = list.id; kebabOpenId = null; }}>Remove List</button>
                    <button role="menuitem" onclick={() => startEditTitle(list)}>Edit List Title</button>
                  </div>
                {/if}
              </div>
            </div>

            <ul class="items">
              {#each list.items as item (item.id)}
                <ListItem {item} listId={list.id} />
              {/each}
            </ul>

            {#if !atCap(list)}
              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <div
                class="add-task-area"
                role="button"
                tabindex="0"
                onclick={(e) => { e.stopPropagation(); startAddTask(list.id); }}
                onkeydown={(e) => e.key === 'Enter' && startAddTask(list.id)}
              >
                {#if addTaskInputId === list.id}
                  <input
                    bind:this={taskInputEl}
                    bind:value={newTaskText}
                    type="text"
                    placeholder="new task…"
                    class="task-input"
                    onclick={(e) => e.stopPropagation()}
                    onkeydown={(e) => {
                      if (e.key === 'Enter') submitTask(list.id);
                      if (e.key === 'Escape') { newTaskText = ''; addTaskInputId = null; }
                    }}
                    onblur={() => { if (!newTaskText) addTaskInputId = null; }}
                  />
                {:else}
                  <span class="add-task-hint">+ ADD TASK</span>
                {/if}
              </div>
            {:else}
              <div class="section-spacer"></div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

  </div>

  <!-- ── Bottom bar: type picker + add button ── -->
  <div class="card-bottom" onclick={(e) => e.stopPropagation()}>
    {#if (!allTypesTaken || showTypePicker) && listsState.lists.length > 0}
      <div class="divider"><div class="divider-line"></div></div>
    {/if}
    {#if showTypePicker}
      <div class="type-picker">
        {#each TYPE_OPTIONS as opt}
          <button
            class="type-row"
            class:taken={takenTypes.has(opt.type)}
            disabled={takenTypes.has(opt.type)}
            onclick={() => pickType(opt)}
          >
            <span class="type-label">{opt.label}</span>
            {#if opt.type === 'daily'}
              <svg class="type-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path transform="translate(0.44, 1.67)" fill="currentColor" d="M2.89833 8.35417C2.89833 9.53472 3.19347 10.6319 3.78375 11.6458C4.37403 12.6597 5.17611 13.4722 6.19 14.0833C6.38444 14.2083 6.51986 14.3785 6.59625 14.5938C6.67264 14.809 6.65528 15.0139 6.54417 15.2083C6.43306 15.4167 6.26292 15.5521 6.03375 15.6146C5.80458 15.6771 5.58583 15.6528 5.3775 15.5417C4.08583 14.7917 3.07194 13.7778 2.33583 12.5C1.59972 11.2222 1.23167 9.84028 1.23167 8.35417C1.23167 7.99306 1.25597 7.63889 1.30458 7.29167C1.35319 6.94444 1.41917 6.59722 1.5025 6.25L1.23167 6.41667C1.03722 6.54167 0.828889 6.57292 0.606667 6.51042C0.384444 6.44792 0.217778 6.31944 0.106667 6.125C-0.00444445 5.93056 -0.02875 5.71875 0.03375 5.48958C0.09625 5.26042 0.224722 5.09028 0.419167 4.97917L2.94 3.52083C3.13444 3.40972 3.34625 3.38542 3.57542 3.44792C3.80458 3.51042 3.97472 3.63889 4.08583 3.83333L5.54417 6.33333C5.65528 6.52778 5.67958 6.73958 5.61708 6.96875C5.55458 7.19792 5.42611 7.36806 5.23167 7.47917C5.03722 7.59028 4.82542 7.61458 4.59625 7.55208C4.36708 7.48958 4.19694 7.36111 4.08583 7.16667L3.3775 5.9375C3.22472 6.32639 3.10667 6.72222 3.02333 7.125C2.94 7.52778 2.89833 7.9375 2.89833 8.35417ZM9.565 1.66667C8.99556 1.66667 8.43306 1.73958 7.8775 1.88542C7.32194 2.03125 6.79417 2.24306 6.29417 2.52083C6.08583 2.63194 5.86708 2.67014 5.63792 2.63542C5.40875 2.60069 5.23861 2.48611 5.1275 2.29167C5.0025 2.06944 4.97472 1.84375 5.04417 1.61458C5.11361 1.38542 5.25944 1.20833 5.48167 1.08333C6.10667 0.722222 6.76292 0.451389 7.45042 0.270833C8.13792 0.0902778 8.84278 0 9.565 0C10.6622 0 11.7143 0.204861 12.7213 0.614583C13.7282 1.02431 14.6275 1.61806 15.4192 2.39583V2.08333C15.4192 1.84722 15.499 1.64931 15.6588 1.48958C15.8185 1.32986 16.0164 1.25 16.2525 1.25C16.4886 1.25 16.6865 1.32986 16.8463 1.48958C17.006 1.64931 17.0858 1.84722 17.0858 2.08333V5C17.0858 5.23611 17.006 5.43403 16.8463 5.59375C16.6865 5.75347 16.4886 5.83333 16.2525 5.83333H13.3358C13.0997 5.83333 12.9018 5.75347 12.7421 5.59375C12.5824 5.43403 12.5025 5.23611 12.5025 5C12.5025 4.76389 12.5824 4.56597 12.7421 4.40625C12.9018 4.24653 13.0997 4.16667 13.3358 4.16667H14.7733C14.1344 3.375 13.3636 2.76042 12.4608 2.32292C11.5581 1.88542 10.5928 1.66667 9.565 1.66667ZM14.6067 12.7292C15.1344 12.1181 15.5372 11.4444 15.815 10.7083C16.0928 9.97222 16.2317 9.20139 16.2317 8.39583C16.2317 8.15972 16.3115 7.95139 16.4713 7.77083C16.631 7.59028 16.8289 7.5 17.065 7.5C17.3011 7.5 17.499 7.59028 17.6588 7.77083C17.8185 7.95139 17.8983 8.15972 17.8983 8.39583C17.8983 9.29861 17.756 10.1701 17.4713 11.0104C17.1865 11.8507 16.7733 12.6319 16.2317 13.3542C15.69 14.0764 15.0476 14.6944 14.3046 15.2083C13.5615 15.7222 12.7525 16.1042 11.8775 16.3542L12.0858 16.4792C12.2803 16.5903 12.4053 16.7604 12.4608 16.9896C12.5164 17.2188 12.4886 17.4306 12.3775 17.625C12.2664 17.8194 12.0997 17.9444 11.8775 18C11.6553 18.0556 11.4469 18.0278 11.2525 17.9167L8.71083 16.4583C8.51639 16.3472 8.38792 16.1771 8.32542 15.9479C8.26292 15.7188 8.28722 15.5069 8.39833 15.3125L9.85667 12.7917C9.96778 12.5972 10.1344 12.4722 10.3567 12.4167C10.5789 12.3611 10.7872 12.3889 10.9817 12.5C11.1761 12.6111 11.3046 12.7813 11.3671 13.0104C11.4296 13.2396 11.4053 13.4514 11.2942 13.6458L10.5233 14.9583C11.315 14.8472 12.0615 14.6007 12.7629 14.2188C13.4643 13.8368 14.0789 13.3403 14.6067 12.7292Z"/>
              </svg>
            {:else if opt.type === 'efficiency'}
              <div class="type-badge">3</div>
            {:else if opt.type === 'unlimited'}
              <svg class="type-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"/>
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    {/if}

    {#if !allTypesTaken || showTypePicker}
    <div class="add-btn-row">
      <button
        class="add-btn"
        data-tooltip={showTypePicker ? 'Dismiss' : 'Add list'}
        onclick={() => (showTypePicker = !showTypePicker)}
      >
        {#if showTypePicker}
          <!-- X icon -->
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="#313131" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        {:else}
          <!-- + icon -->
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="#313131" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        {/if}
      </button>
    </div>
    {/if}
  </div>

</div>

<style>
  .list-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0 var(--spacing-md);
    width: 100%;
    max-width: 750px;
    min-width: 273px;
    display: flex;
    flex-direction: column;
  }

  /* ── Content ── */
  .card-content {
    overflow: visible;
  }

  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 20px 16px 12px;
  }

  .empty-title {
    font-family: 'Geist Mono', monospace;
    font-weight: 300;
    font-size: 14px;
    color: var(--text);
    margin: 0;
  }

  .empty-sub {
    font-family: 'Geist Mono', monospace;
    font-weight: 300;
    font-size: 11px;
    color: var(--text-muted);
    margin: 0;
    text-align: center;
  }

  /* ── Lists slot ── */
  .slot {
    display: flex;
    flex-direction: column;
  }

  .list-section {
    display: flex;
    flex-direction: column;
  }

  .section-spacer {
    height: 12px;
    flex-shrink: 0;
  }

  /* ── List header ── */
  .list-header {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .list-name {
    font-family: 'Work Sans', sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .title-input {
    flex: 1;
    min-width: 0;
    background: none;
    border: none;
    border-bottom: 1px solid var(--accent);
    color: var(--text-muted);
    font-family: 'Work Sans', sans-serif;
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 2px 0;
    outline: none;
    user-select: text;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
    min-width: 0;
  }

  .daily-icon {
    flex-shrink: 0;
    color: var(--text-muted);
  }

  /* ── Task count badge ── */
  .task-count-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    flex-shrink: 0;
  }

  .task-count {
    background: var(--surface-dim);
    height: 16px;
    padding: 0 var(--spacing-xs);
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .task-count.at-cap { background: var(--red); }

  .task-count.at-cap span { color: #ffffff; }

  .task-count span {
    font-family: 'Geist Mono', monospace;
    font-weight: 700;
    font-size: 12px;
    color: var(--text);
    white-space: nowrap;
  }

  :global([data-theme="light"]) .task-count span {
    color: var(--text-muted);
  }

  :global([data-theme="light"]) .task-count.at-cap span {
    color: #ffffff;
  }

  /* ── Kebab ── */
  .kebab-wrap { position: relative; }

  .kebab-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    color: var(--text-muted);
    border-radius: var(--radius-sm);
    transition: background 0.1s;
  }

  .kebab-btn:hover { background: rgba(255, 255, 255, 0.06); }

  :global([data-theme="light"]) .kebab-btn:hover { background: #F0E5D0; }

  .kebab-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 2px);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 4px;
    z-index: 20;
    width: max-content;
    display: flex;
    flex-direction: column;
    gap: 2px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .kebab-menu button {
    width: 100%;
    text-align: left;
    background: none;
    border: 2px solid transparent;
    padding: 6px 10px;
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    color: var(--text);
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
  }

  .kebab-menu button:hover { background: rgba(255, 255, 255, 0.06); }

  .kebab-menu button:focus-visible {
    outline: none;
    border-color: var(--border);
  }

  .kebab-menu button:disabled { color: var(--text-muted); cursor: default; }

  :global([data-theme="light"]) .kebab-menu button:hover { background: #F0E5D0; }

  /* ── Items ── */
  .items {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-height: 0;
  }

  /* ── Add task ── */
  .add-task-area {
    margin: 4px 0 8px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: height 0.15s;
  }

  .add-task-hint {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    user-select: none;
    transition: opacity 0.15s;
  }

  .task-input {
    width: 100%;
    background: none;
    border: none;
    color: var(--text);
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    padding: 0 8px;
    outline: none;
    user-select: text;
  }

  /* ── Divider ── */
  .divider {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 10px 0;
  }

  .divider-line {
    border-top: 1px dashed var(--border);
    width: 100%;
    height: 0;
  }

  /* ── Bottom bar ── */
  .card-bottom {
    flex-shrink: 0;
  }

  /* ── Type picker ── */
  .type-picker {
    padding: 4px 0;
  }

  .type-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 4px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: background 0.1s;
  }

  .type-row:hover:not(:disabled) { background: rgba(255, 255, 255, 0.04); }

  .type-row.taken {
    opacity: 0.3;
    cursor: default;
  }

  .type-badge {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    background: var(--accent);
    border-radius: 50px;
    min-width: 22px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    flex-shrink: 0;
  }

  .type-icon {
    flex-shrink: 0;
    color: var(--accent);
  }

  .type-label {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 300;
    color: var(--text);
    text-align: left;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Add button row ── */
  .add-btn-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md) 0;
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--accent);
    border: none;
    border-radius: var(--radius-sm);
    transition: opacity 0.1s;
    cursor: pointer;
  }

  .add-btn:hover { opacity: 0.85; }
</style>
