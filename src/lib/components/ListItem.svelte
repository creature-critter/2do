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
  <button
    class="item-btn"
    title={item.completed ? 'Mark incomplete' : 'Mark complete'}
    onclick={() => setItemCompleted(listId, item.id, !item.completed)}
  >
    {#if !item.completed || hovering}
      <span class="icon">
        {#if item.completed}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6.66667 15.8333C6.43056 15.8333 6.23264 15.7535 6.07292 15.5938C5.91319 15.434 5.83333 15.2361 5.83333 15C5.83333 14.7639 5.91319 14.566 6.07292 14.4062C6.23264 14.2465 6.43056 14.1667 6.66667 14.1667H11.75C12.625 14.1667 13.3854 13.8889 14.0312 13.3333C14.6771 12.7778 15 12.0833 15 11.25C15 10.4167 14.6771 9.72222 14.0312 9.16667C13.3854 8.61111 12.625 8.33333 11.75 8.33333H6.5L8.08333 9.91667C8.23611 10.0694 8.3125 10.2639 8.3125 10.5C8.3125 10.7361 8.23611 10.9306 8.08333 11.0833C7.93056 11.2361 7.73611 11.3125 7.5 11.3125C7.26389 11.3125 7.06944 11.2361 6.91667 11.0833L3.91667 8.08333C3.83333 8 3.77431 7.90972 3.73958 7.8125C3.70486 7.71528 3.6875 7.61111 3.6875 7.5C3.6875 7.38889 3.70486 7.28472 3.73958 7.1875C3.77431 7.09028 3.83333 7 3.91667 6.91667L6.91667 3.91667C7.06944 3.76389 7.26389 3.6875 7.5 3.6875C7.73611 3.6875 7.93056 3.76389 8.08333 3.91667C8.23611 4.06944 8.3125 4.26389 8.3125 4.5C8.3125 4.73611 8.23611 4.93056 8.08333 5.08333L6.5 6.66667H11.75C13.0972 6.66667 14.2535 7.10417 15.2188 7.97917C16.184 8.85417 16.6667 9.94444 16.6667 11.25C16.6667 12.5556 16.184 13.6458 15.2188 14.5208C14.2535 15.3958 13.0972 15.8333 11.75 15.8333H6.66667Z" fill="var(--accent)"/>
          </svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              fill="var(--accent)"/>
          </svg>
        {/if}
      </span>
    {/if}

    {#if item.completed}
      <div class="text-group">
        <span class="text-wrap">
          <span class="text">{item.text}</span>
          <div class="strike"></div>
        </span>
      </div>
    {:else}
      <span class="text">{item.text}</span>
    {/if}
  </button>

  {#if hovering}
    <button
      class="delete-btn"
      data-tooltip="Remove"
      onclick={() => removeItem(listId, item.id)}
    >
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
        <path d="M2.625 16C2.14375 16 1.73177 15.8259 1.38906 15.4778C1.04635 15.1296 0.875 14.7111 0.875 14.2222V2.66667C0.627083 2.66667 0.419271 2.58148 0.251562 2.41111C0.0838542 2.24074 0 2.02963 0 1.77778C0 1.52593 0.0838542 1.31481 0.251562 1.14444C0.419271 0.974074 0.627083 0.888889 0.875 0.888889H4.375C4.375 0.637037 4.45885 0.425926 4.62656 0.255556C4.79427 0.0851852 5.00208 0 5.25 0H8.75C8.99792 0 9.20573 0.0851852 9.37344 0.255556C9.54115 0.425926 9.625 0.637037 9.625 0.888889H13.125C13.3729 0.888889 13.5807 0.974074 13.7484 1.14444C13.9161 1.31481 14 1.52593 14 1.77778C14 2.02963 13.9161 2.24074 13.7484 2.41111C13.5807 2.58148 13.3729 2.66667 13.125 2.66667V14.2222C13.125 14.7111 12.9536 15.1296 12.6109 15.4778C12.2682 15.8259 11.8563 16 11.375 16H2.625ZM11.375 2.66667H2.625V14.2222H11.375V2.66667ZM5.87344 12.1889C6.04115 12.0185 6.125 11.8074 6.125 11.5556V5.33333C6.125 5.08148 6.04115 4.87037 5.87344 4.7C5.70573 4.52963 5.49792 4.44444 5.25 4.44444C5.00208 4.44444 4.79427 4.52963 4.62656 4.7C4.45885 4.87037 4.375 5.08148 4.375 5.33333V11.5556C4.375 11.8074 4.45885 12.0185 4.62656 12.1889C4.79427 12.3593 5.00208 12.4444 5.25 12.4444C5.49792 12.4444 5.70573 12.3593 5.87344 12.1889ZM9.37344 12.1889C9.54115 12.0185 9.625 11.8074 9.625 11.5556V5.33333C9.625 5.08148 9.54115 4.87037 9.37344 4.7C9.20573 4.52963 8.99792 4.44444 8.75 4.44444C8.50208 4.44444 8.29427 4.52963 8.12656 4.7C7.95885 4.87037 7.875 5.08148 7.875 5.33333V11.5556C7.875 11.8074 7.95885 12.0185 8.12656 12.1889C8.29427 12.3593 8.50208 12.4444 8.75 12.4444C8.99792 12.4444 9.20573 12.3593 9.37344 12.1889Z" fill="currentColor"/>
      </svg>
    </button>
  {/if}
</li>

<style>
  li {
    display: flex;
    align-items: center;
    width: 100%;
    list-style: none;
    border-radius: var(--radius-sm);
    transition: background 0.1s;
  }

  li:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  :global([data-theme="light"]) li:hover {
    background: #F0E5D0;
  }

  .item-btn {
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    min-height: 36px;
    background: none;
    border: none;
    min-width: 0;
    text-align: left;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .text {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 400;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .completed .text {
    color: var(--text-muted);
  }

  .text-group {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .text-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    overflow: hidden;
  }

  .strike {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 2px;
    background: color-mix(in srgb, var(--accent) 60%, transparent);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: none;
    border: none;
    border-radius: 4px;
    color: var(--text-muted);
    opacity: 0.5;
    flex-shrink: 0;
    margin-right: var(--spacing-sm);
    transition: opacity 0.1s;
  }

  .delete-btn:hover {
    opacity: 1;
    background: rgba(196, 43, 28, 0.15);
  }
</style>
