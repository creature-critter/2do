import { Store } from '@tauri-apps/plugin-store';

// Bump this to wipe all stored data on next launch (forces empty state)
const DATA_VERSION = '0.1.1';

export type ListType = 'daily' | 'efficiency' | 'unlimited';

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoList {
  id: string;
  name: string;
  type: ListType;
  items: ListItem[];
}

export const listsState = $state({ lists: [] as TodoList[] });

let store: Store | null = null;

function uid() {
  return crypto.randomUUID();
}

export async function loadLists() {
  store = await Store.load('lists.json');
  const storedVersion = await store.get<string>('dataVersion');
  if (storedVersion !== DATA_VERSION) {
    listsState.lists = [];
    await store.set('lists', []);
    await store.set('dataVersion', DATA_VERSION);
    await store.save();
    return;
  }
  const saved = await store.get<TodoList[]>('lists');
  if (saved) listsState.lists = saved;
}

async function persist() {
  if (!store) return;
  await store.set('lists', listsState.lists);
  await store.save();
}

export function addList(name: string, type: ListType) {
  listsState.lists.push({ id: uid(), name, type, items: [] });
  persist();
}

export function removeList(id: string) {
  const idx = listsState.lists.findIndex(l => l.id === id);
  if (idx !== -1) listsState.lists.splice(idx, 1);
  persist();
}

export function addItem(listId: string, text: string) {
  const list = listsState.lists.find(l => l.id === listId);
  if (!list) return;
  if (list.type === 'efficiency' && list.items.length >= 3) return;
  list.items.push({ id: uid(), text, completed: false });
  persist();
}

export function removeItem(listId: string, itemId: string) {
  const list = listsState.lists.find(l => l.id === listId);
  if (!list) return;
  const idx = list.items.findIndex(i => i.id === itemId);
  if (idx !== -1) list.items.splice(idx, 1);
  persist();
}

export function renameList(id: string, name: string) {
  const list = listsState.lists.find(l => l.id === id);
  if (list) { list.name = name; persist(); }
}

export function setItemCompleted(listId: string, itemId: string, completed: boolean) {
  const list = listsState.lists.find(l => l.id === listId);
  const item = list?.items.find(i => i.id === itemId);
  if (item) { item.completed = completed; persist(); }
}
