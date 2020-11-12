import { Console } from '../../libs';
import { NotImplementedError } from '../../ErrorLayer';
import { Entity } from './Entity';

export class Monster extends Entity {

  private _lootTable;
  private _gold: number = 0;
  private _items;

  static fromJson(data: Object): Monster {
    //const monster = Object.assign(new Monster, data);
    //throw new NotImplementedError();

    const monster = Object.assign(new Monster(), super.fromJson(data));
    return monster;
  }

  async chooseAction() {
    //Console.writeLineProgressively(this.name());
    await Console.writeLine(this.name()).await();
    //throw new NotImplementedError();
  }

  doAction() {
    throw new NotImplementedError();
  }

  actionForOneCharacter() {
    throw new NotImplementedError();
  }

  actionForMultipleCharacters() {
    throw new NotImplementedError();
  }

  actionWithOneMonster() {
    throw new NotImplementedError();
  }

  actionWithMultipleMonsters() {
    throw new NotImplementedError();
  }

  cannKillACharacterWithMultipleMonsters() {
    throw new NotImplementedError();
  }

  getMostDangerousCharacters() {
    throw new NotImplementedError();
  }

  findHealToConsume() {
    throw new NotImplementedError();
  }

  casualAction() {
    throw new NotImplementedError();
  }

  strongestAttack() {
    throw new NotImplementedError();
  }

  canHeal() {
    throw new NotImplementedError();
  }

  hasHealingSpell() {
    throw new NotImplementedError();
  }

  hasAttackingSpell() {
    throw new NotImplementedError();
  }

  getStrongestCastableHealingSpell() {
    throw new NotImplementedError();
  }

  getStrongestCastableAttackingSpell() {
    throw new NotImplementedError();
  }

  getCastableHealingSpells() {
    throw new NotImplementedError();
  }

  getCastableAttackingSpells() {
    throw new NotImplementedError();
  }

  getHealingSpells() {
    throw new NotImplementedError();
  }

  getAttackingSpells() {
    throw new NotImplementedError();
  }

  getCastableSpells() {
    throw new NotImplementedError();
  }

  getStrongestSpell() {
    throw new NotImplementedError();
  }

  consumeHeal() {
    throw new NotImplementedError();
  }

  loots() {
    throw new NotImplementedError();
  }
}
