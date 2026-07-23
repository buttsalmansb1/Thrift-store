import * as migration_20260723_173444_initial from './20260723_173444_initial';

export const migrations = [
  {
    up: migration_20260723_173444_initial.up,
    down: migration_20260723_173444_initial.down,
    name: '20260723_173444_initial'
  },
];
