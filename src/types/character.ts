export interface AbilityScore {
  score: number;
  modifier: number;
}

export interface HitPoints {
  max: number;
  current: number;
  temporary: number;
}

export interface ArmorAndMovement {
  armor_class: number;
  initiative: number;
  speed: number;
}

export interface Skills {
  acrobatics: number;
  animal_handling: number;
  arcana: number;
  athletics: number;
  deception: number;
  history: number;
  insight: number;
  intimidation: number;
  investigation: number;
  medicine: number;
  nature: number;
  perception: number;
  performance: number;
  persuasion: number;
  religion: number;
  sleight_of_hand: number;
  stealth: number;
  survival: number;
}

export interface SavingThrows {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Spellcasting {
  spell_slots: Record<string, number>;
  known_spells: string[];
  spell_attack_bonus: number;
  spell_save_dc: number;
}

export interface Notes {
  description: string;
  personality_traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

export interface Attack {
  name: string;
  type: string;
  attack_bonus: number;
  damage: string;
  versatile_damage?: string;
}

export interface DnDCharacter {
  basic_info: {
    name: string;
    race: string;
    class: string;
    subclass: string;
    level: number;
    background: string;
    alignment: string;
    experience_points: number;
    profile_image?: string;
  };
  ability_scores: {
    strength: AbilityScore;
    dexterity: AbilityScore;
    constitution: AbilityScore;
    intelligence: AbilityScore;
    wisdom: AbilityScore;
    charisma: AbilityScore;
  };
  hit_points: HitPoints;
  armor_and_movement: ArmorAndMovement;
  skills: Skills;
  saving_throws: SavingThrows;
  attacks_and_spellcasting: (string | Attack)[];
  features_and_traits: string[];
  spellcasting: Spellcasting;
  equipment: string[];
  notes: Notes;
}
