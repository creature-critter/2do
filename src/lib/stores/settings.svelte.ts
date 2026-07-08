import { Store } from '@tauri-apps/plugin-store';

export const settings = $state({
  theme: 'dark' as 'light' | 'dark',
  accentColor: '#c084fc',
  audioEnabled: true,
});

let store: Store | null = null;

export async function loadSettings() {
  store = await Store.load('settings.json');
  const saved = await store.get<typeof settings>('settings');
  if (saved) {
    settings.theme = saved.theme ?? settings.theme;
    settings.accentColor = saved.accentColor ?? settings.accentColor;
    settings.audioEnabled = saved.audioEnabled ?? settings.audioEnabled;
  }
}

export async function saveSettings() {
  if (!store) return;
  await store.set('settings', { ...settings });
  await store.save();
}
