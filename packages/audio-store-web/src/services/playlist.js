import db from './db';

export async function getPlaylists() {
  const database = await db.getDb();
  const keys = await database.getAllKeys('playlists');
  const playlists = await Promise.all(keys.map(async (key) => database.get('playlists', key)));
  return playlists.reduce((acc, val) => {
    acc[val.id] = val;
    return acc;
  }, {});
}

export async function getPlaylist(playlistId) {
  const database = await db.getDb();
  return database.get('playlists', parseInt(playlistId, 10));
}

export async function createPlaylist(playlistName) {
  const database = await db.getDb();
  const newPlaylist = {
    title: playlistName,
    tracks: [],
  };
  const playlistId = await database.add('playlists', newPlaylist);

  return {
    id: playlistId,
    ...newPlaylist,
  };
}

export async function updatePlaylist(playlist) {
  const database = await db.getDb();
  await database.put('playlists', playlist);
}

export async function deletePlaylist(playlistId) {
  const database = await db.getDb();
  await database.delete('playlists', playlistId);
}
