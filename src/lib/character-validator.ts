import { DnDCharacter } from "@/types/character";

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100, wie "korrekt" der Charakter ist
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
  suggestion?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface ClassInfo {
  name: string;
  hitDie: number;
  savingThrows: string[];
  skillChoices: number;
  availableSkills: string[];
  primaryAbility?: string[];
  spellcasting?: {
    ability: string;
    type: "full" | "half" | "third";
  };
}

export interface RaceInfo {
  name: string;
  abilityBonuses: Record<string, number>;
  size: "Small" | "Medium" | "Large";
  speed: number;
  traits: string[];
  languages?: string[];
}

// D&D 5e Referenzdaten
export const CLASS_DATA: Record<string, ClassInfo> = {
  kämpfer: {
    name: "Kämpfer",
    hitDie: 10,
    savingThrows: ["strength", "constitution"],
    skillChoices: 2,
    availableSkills: [
      "acrobatics",
      "animal_handling",
      "athletics",
      "history",
      "insight",
      "intimidation",
      "perception",
      "survival",
    ],
    primaryAbility: ["strength", "dexterity"],
  },
  waldläufer: {
    name: "Waldläufer",
    hitDie: 10,
    savingThrows: ["strength", "dexterity"],
    skillChoices: 3,
    availableSkills: [
      "animal_handling",
      "athletics",
      "insight",
      "investigation",
      "nature",
      "perception",
      "stealth",
      "survival",
    ],
    primaryAbility: ["dexterity", "wisdom"],
    spellcasting: {
      ability: "wisdom",
      type: "half",
    },
  },
  zauberer: {
    name: "Zauberer",
    hitDie: 6,
    savingThrows: ["constitution", "charisma"],
    skillChoices: 2,
    availableSkills: [
      "arcana",
      "deception",
      "insight",
      "intimidation",
      "persuasion",
      "religion",
    ],
    primaryAbility: ["charisma"],
    spellcasting: {
      ability: "charisma",
      type: "full",
    },
  },
  schurke: {
    name: "Schurke",
    hitDie: 8,
    savingThrows: ["dexterity", "intelligence"],
    skillChoices: 4,
    availableSkills: [
      "acrobatics",
      "athletics",
      "deception",
      "insight",
      "intimidation",
      "investigation",
      "perception",
      "performance",
      "persuasion",
      "sleight_of_hand",
      "stealth",
    ],
    primaryAbility: ["dexterity"],
  },
  paladin: {
    name: "Paladin",
    hitDie: 10,
    savingThrows: ["wisdom", "charisma"],
    skillChoices: 2,
    availableSkills: [
      "athletics",
      "insight",
      "intimidation",
      "medicine",
      "persuasion",
      "religion",
    ],
    primaryAbility: ["strength", "charisma"],
    spellcasting: {
      ability: "charisma",
      type: "half",
    },
  },
};

export const RACE_DATA: Record<string, RaceInfo> = {
  waldelfe: {
    name: "Waldelfe",
    abilityBonuses: { dexterity: 2, wisdom: 1 },
    size: "Medium",
    speed: 35,
    traits: ["darkvision", "fey_ancestry", "trance"],
  },
  bergzwerg: {
    name: "Bergzwerg",
    abilityBonuses: { constitution: 2, strength: 2 },
    size: "Medium",
    speed: 25,
    traits: ["darkvision", "dwarven_resilience", "stonecunning"],
  },
  tiefling: {
    name: "Tiefling",
    abilityBonuses: { charisma: 2, intelligence: 1 },
    size: "Medium",
    speed: 30,
    traits: ["darkvision", "hellish_resistance", "infernal_legacy"],
  },
  halbling: {
    name: "Halbling",
    abilityBonuses: { dexterity: 2 },
    size: "Small",
    speed: 25,
    traits: ["lucky", "brave", "halfling_nimbleness"],
  },
  mensch: {
    name: "Mensch",
    abilityBonuses: {
      strength: 1,
      dexterity: 1,
      constitution: 1,
      intelligence: 1,
      wisdom: 1,
      charisma: 1,
    },
    size: "Medium",
    speed: 30,
    traits: [],
  },
  "human(variant)": {
    name: "Human (Variant)",
    abilityBonuses: {}, // Flexibel - 2 verschiedene Attribute um je 1 erhöhen
    size: "Medium",
    speed: 30,
    traits: ["extra_skill", "feat"],
  },
  "drow(darkelf)": {
    name: "Drow (Dark Elf)",
    abilityBonuses: { dexterity: 2, charisma: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      "darkvision_superior",
      "sunlight_sensitivity",
      "drow_magic",
      "drow_weapon_training",
    ],
  },
};

// Zauberplätze pro Level für verschiedene Zauberklassen
export const SPELL_SLOTS_BY_LEVEL = {
  full: {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 },
    7: { 1: 4, 2: 3, 3: 3, 4: 1 },
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  },
  half: {
    2: { 1: 2 },
    3: { 1: 3 },
    4: { 1: 3 },
    5: { 1: 4, 2: 2 },
    6: { 1: 4, 2: 2 },
    7: { 1: 4, 2: 3 },
    8: { 1: 4, 2: 3 },
    9: { 1: 4, 2: 3, 3: 2 },
    10: { 1: 4, 2: 3, 3: 2 },
  },
};

export function calculateProficiencyBonus(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

export function validateCharacter(character: DnDCharacter): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let score = 100;

  // 1. Grundlegende Validierung
  if (!character.basic_info?.name?.trim()) {
    errors.push({
      field: "basic_info.name",
      message: "Name ist erforderlich",
      severity: "error",
    });
    score -= 10;
  }

  // 2. Fähigkeitswerte validieren
  const abilityValidation = validateAbilityScores(character);
  errors.push(...abilityValidation.errors);
  warnings.push(...abilityValidation.warnings);
  score -= abilityValidation.penalty;

  // 3. Klassen-spezifische Validierung
  const classValidation = validateClass(character);
  errors.push(...classValidation.errors);
  warnings.push(...classValidation.warnings);
  score -= classValidation.penalty;

  // 4. Rassen-spezifische Validierung
  const raceValidation = validateRace(character);
  errors.push(...raceValidation.errors);
  warnings.push(...raceValidation.warnings);
  score -= raceValidation.penalty;

  // 5. Trefferpunkte validieren
  const hpValidation = validateHitPoints(character);
  errors.push(...hpValidation.errors);
  warnings.push(...hpValidation.warnings);
  score -= hpValidation.penalty;

  // 6. Fertigkeiten validieren
  const skillValidation = validateSkills(character);
  errors.push(...skillValidation.errors);
  warnings.push(...skillValidation.warnings);
  score -= skillValidation.penalty;

  // 7. Zaubersprüche validieren (falls zutreffend)
  const spellValidation = validateSpellcasting(character);
  errors.push(...spellValidation.errors);
  warnings.push(...spellValidation.warnings);
  score -= spellValidation.penalty;

  return {
    isValid: errors.filter((e) => e.severity === "error").length === 0,
    errors: errors.filter((e) => e.severity === "error"),
    warnings: warnings,
    score: Math.max(0, score),
  };
}

function validateAbilityScores(character: DnDCharacter) {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penalty = 0;

  const abilities = character.ability_scores;
  const totalPoints = Object.values(abilities).reduce(
    (sum, ability) => sum + ability.score,
    0
  );

  // Prüfe ob Modifier korrekt berechnet sind
  Object.entries(abilities).forEach(([ability, data]) => {
    const expectedModifier = Math.floor((data.score - 10) / 2);
    if (data.modifier !== expectedModifier) {
      errors.push({
        field: `ability_scores.${ability}.modifier`,
        message: `${ability} Modifier sollte ${expectedModifier} sein, ist aber ${data.modifier}`,
        severity: "error",
        suggestion: `Korrigiere den ${ability} Modifier auf ${expectedModifier}`,
      });
      penalty += 5;
    }

    // Warnung für sehr niedrige oder hohe Werte
    if (data.score < 8) {
      warnings.push({
        field: `ability_scores.${ability}.score`,
        message: `${ability} ist sehr niedrig (${data.score})`,
        suggestion: "Überprüfe ob dies beabsichtigt ist",
      });
    }

    if (data.score > 20) {
      errors.push({
        field: `ability_scores.${ability}.score`,
        message: `${ability} überschreitet das Maximum von 20 für Spielercharaktere`,
        severity: "error",
      });
      penalty += 10;
    }
  });

  // Point Buy Validierung (Standard: 72-78 Punkte vor Rassenmodifikatoren)
  if (totalPoints < 65 || totalPoints > 85) {
    warnings.push({
      field: "ability_scores",
      message: `Gesamtpunkte (${totalPoints}) sind ungewöhnlich für Standard-Charaktererstellung`,
      suggestion: "Standard Point Buy ergeben meist 72-78 Punkte",
    });
  }

  return { errors, warnings, penalty };
}

function validateClass(character: DnDCharacter) {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penalty = 0;

  const className = character.basic_info.class.toLowerCase();
  const classInfo = CLASS_DATA[className];

  if (!classInfo) {
    warnings.push({
      field: "basic_info.class",
      message: `Klasse "${character.basic_info.class}" nicht in der Validierungsdatenbank`,
      suggestion: "Manuelle Überprüfung erforderlich",
    });
    return { errors, warnings, penalty: 5 };
  }

  // Rettungswürfe prüfen
  const proficiencyBonus = calculateProficiencyBonus(
    character.basic_info.level
  );
  classInfo.savingThrows.forEach((save) => {
    const expected =
      character.ability_scores[save as keyof typeof character.ability_scores]
        .modifier + proficiencyBonus;
    const actual =
      character.saving_throws[save as keyof typeof character.saving_throws];

    if (Math.abs(actual - expected) > 1) {
      // Kleine Toleranz für Gegenstände etc.
      warnings.push({
        field: `saving_throws.${save}`,
        message: `${save} Rettungswurf könnte inkorrekt sein (erwartet ~${expected}, ist ${actual})`,
        suggestion: "Überprüfe Klassenkompetenzen und Gegenstände",
      });
    }
  });

  return { errors, warnings, penalty };
}

function validateRace(character: DnDCharacter) {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penalty = 0;

  const raceName = character.basic_info.race.toLowerCase().replace(/\s+/g, "");
  const raceInfo = RACE_DATA[raceName];

  if (!raceInfo) {
    warnings.push({
      field: "basic_info.race",
      message: `Rasse "${character.basic_info.race}" nicht in der Validierungsdatenbank`,
      suggestion: "Manuelle Überprüfung erforderlich",
    });
    return { errors, warnings, penalty: 5 };
  }

  // Geschwindigkeit prüfen
  if (character.armor_and_movement.speed !== raceInfo.speed) {
    warnings.push({
      field: "armor_and_movement.speed",
      message: `Geschwindigkeit sollte ${raceInfo.speed} für ${raceInfo.name} sein`,
      suggestion: `Korrigiere auf ${raceInfo.speed} oder erkläre Abweichung`,
    });
  }

  return { errors, warnings, penalty };
}

function validateHitPoints(character: DnDCharacter) {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penalty = 0;

  const className = character.basic_info.class.toLowerCase();
  const classInfo = CLASS_DATA[className];
  const level = character.basic_info.level;
  const conModifier = character.ability_scores.constitution.modifier;

  if (classInfo) {
    // Minimum HP (nimmt niedrigste Würfe an)
    const minHp =
      classInfo.hitDie + conModifier + (level - 1) * (1 + conModifier);
    // Maximum HP (nimmt höchste Würfe an)
    const maxHp =
      classInfo.hitDie +
      conModifier +
      (level - 1) * (classInfo.hitDie + conModifier);
    // Durchschnitt HP
    const avgHp =
      classInfo.hitDie +
      conModifier +
      (level - 1) * (Math.floor(classInfo.hitDie / 2) + 1 + conModifier);

    if (character.hit_points.max < minHp) {
      errors.push({
        field: "hit_points.max",
        message: `Max HP zu niedrig (${character.hit_points.max}, Minimum: ${minHp})`,
        severity: "error",
      });
      penalty += 10;
    }

    if (character.hit_points.max > maxHp + 10) {
      // +10 Toleranz für Gegenstände
      warnings.push({
        field: "hit_points.max",
        message: `Max HP sehr hoch (${character.hit_points.max}, erwartet ~${avgHp})`,
        suggestion: "Überprüfe auf magische Gegenstände oder Buffs",
      });
    }
  }

  // Aktuelle HP sollten nicht größer als Max HP sein
  if (character.hit_points.current > character.hit_points.max) {
    errors.push({
      field: "hit_points.current",
      message: "Aktuelle HP können nicht größer als Maximum HP sein",
      severity: "error",
    });
    penalty += 5;
  }

  return { errors, warnings, penalty };
}

function validateSkills(character: DnDCharacter) {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penalty = 0;

  const proficiencyBonus = calculateProficiencyBonus(
    character.basic_info.level
  );

  // Skill-zu-Ability Mapping
  const skillToAbility: Record<string, keyof typeof character.ability_scores> =
    {
      acrobatics: "dexterity",
      animal_handling: "wisdom",
      arcana: "intelligence",
      athletics: "strength",
      deception: "charisma",
      history: "intelligence",
      insight: "wisdom",
      intimidation: "charisma",
      investigation: "intelligence",
      medicine: "wisdom",
      nature: "intelligence",
      perception: "wisdom",
      performance: "charisma",
      persuasion: "charisma",
      religion: "intelligence",
      sleight_of_hand: "dexterity",
      stealth: "dexterity",
      survival: "wisdom",
    };

  // Prüfe jeden Skill
  Object.entries(character.skills).forEach(([skill, bonus]) => {
    const ability = skillToAbility[skill];
    if (!ability) return;

    const abilityModifier = character.ability_scores[ability].modifier;

    // Verschiedene mögliche Werte
    const baseValue = abilityModifier; // Ohne Kompetenz
    const proficientValue = abilityModifier + proficiencyBonus; // Mit Kompetenz
    const expertiseValue = abilityModifier + proficiencyBonus * 2; // Expertise

    // Prüfe ob der Wert einer der erwarteten Werte entspricht
    const possibleValues = [baseValue, proficientValue, expertiseValue];
    const isValid = possibleValues.some((val) => Math.abs(val - bonus) <= 1); // 1 Punkt Toleranz

    if (!isValid) {
      warnings.push({
        field: `skills.${skill}`,
        message: `${skill} Bonus (${bonus}) scheint inkorrekt (erwartet: ${baseValue}/${proficientValue}/${expertiseValue})`,
        suggestion: "Überprüfe Kompetenz und Expertise-Boni",
      });
    }
  });

  return { errors, warnings, penalty };
}

function validateSpellcasting(character: DnDCharacter) {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let penalty = 0;

  const className = character.basic_info.class.toLowerCase();
  const classInfo = CLASS_DATA[className];

  if (!classInfo?.spellcasting) {
    // Klasse hat keine Zaubersprüche
    if (
      character.spellcasting.known_spells.length > 0 ||
      Object.keys(character.spellcasting.spell_slots).length > 0
    ) {
      warnings.push({
        field: "spellcasting",
        message: `${character.basic_info.class} sollte normalerweise keine Zaubersprüche haben`,
        suggestion: "Überprüfe Multiclassing oder spezielle Fähigkeiten",
      });
    }
    return { errors, warnings, penalty };
  }

  const level = character.basic_info.level;
  const spellAbility = classInfo.spellcasting.ability;
  const casterType = classInfo.spellcasting.type;
  const abilityModifier =
    character.ability_scores[
      spellAbility as keyof typeof character.ability_scores
    ].modifier;
  const proficiencyBonus = calculateProficiencyBonus(level);

  // Zauberangriff prüfen
  const expectedSpellAttack = abilityModifier + proficiencyBonus;
  if (
    Math.abs(character.spellcasting.spell_attack_bonus - expectedSpellAttack) >
    1
  ) {
    warnings.push({
      field: "spellcasting.spell_attack_bonus",
      message: `Zauberangriff sollte ${expectedSpellAttack} sein (${abilityModifier} + ${proficiencyBonus})`,
      suggestion: "Prüfe Zauber-Fähigkeit und Kompetenz-Bonus",
    });
  }

  // Zauber-DC prüfen
  const expectedSpellDC = 8 + abilityModifier + proficiencyBonus;
  if (Math.abs(character.spellcasting.spell_save_dc - expectedSpellDC) > 1) {
    warnings.push({
      field: "spellcasting.spell_save_dc",
      message: `Zauber-DC sollte ${expectedSpellDC} sein (8 + ${abilityModifier} + ${proficiencyBonus})`,
      suggestion: "Prüfe Zauber-Fähigkeit und Kompetenz-Bonus",
    });
  }

  // Zauberplätze prüfen
  const spellSlotData =
    SPELL_SLOTS_BY_LEVEL[casterType as keyof typeof SPELL_SLOTS_BY_LEVEL];
  const expectedSlots = spellSlotData?.[level as keyof typeof spellSlotData];
  if (expectedSlots) {
    Object.entries(expectedSlots).forEach(([spellLevel, expectedCount]) => {
      const actualCount = character.spellcasting.spell_slots[spellLevel] || 0;
      if (actualCount !== expectedCount) {
        warnings.push({
          field: "spellcasting.spell_slots",
          message: `Level ${spellLevel} Zauberplätze: erwartet ${expectedCount}, gefunden ${actualCount}`,
          suggestion:
            "Überprüfe Zauberplatz-Tabelle für deine Klasse und Level",
        });
      }
    });
  }

  return { errors, warnings, penalty };
}
