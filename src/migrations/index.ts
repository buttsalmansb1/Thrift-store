import * as migration_20260723_173444_initial from './20260723_173444_initial';
import * as migration_20260723_184837_mobile_hero from './20260723_184837_mobile_hero';

export const migrations = [
  {
    up: migration_20260723_173444_initial.up,
    down: migration_20260723_173444_initial.down,
    name: '20260723_173444_initial',
  },
  {
    up: migration_20260723_184837_mobile_hero.up,
    down: migration_20260723_184837_mobile_hero.down,
    name: '20260723_184837_mobile_hero'
  },
];
