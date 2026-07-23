import * as migration_20260723_164957_initial from './20260723_164957_initial';

export const migrations = [
  {
    up: migration_20260723_164957_initial.up,
    down: migration_20260723_164957_initial.down,
    name: '20260723_164957_initial'
  },
];
