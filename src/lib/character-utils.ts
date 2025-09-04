import { DnDCharacter } from "@/types/character";

export function loadCharacterFromJSON(jsonData: string): DnDCharacter {
  try {
    const parsed = JSON.parse(jsonData);

    // Validierung der grundlegenden Struktur
    if (!parsed.basic_info || !parsed.ability_scores || !parsed.hit_points) {
      throw new Error("Ungültige Charakterdaten: Wichtige Felder fehlen");
    }

    return parsed as DnDCharacter;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Ungültiges JSON-Format");
    }
    throw error;
  }
}

export function validateCharacter(
  character: unknown
): character is DnDCharacter {
  // Grundlegende Validierung
  if (!character || typeof character !== "object") {
    return false;
  }

  const charObj = character as Record<string, unknown>;

  // Überprüfe ob alle erforderlichen Top-Level-Felder vorhanden sind
  const requiredFields = [
    "basic_info",
    "ability_scores",
    "hit_points",
    "armor_and_movement",
    "skills",
    "saving_throws",
  ];

  for (const field of requiredFields) {
    if (!charObj[field] || typeof charObj[field] !== "object") {
      return false;
    }
  }

  // Validiere basic_info
  const basicInfo = charObj.basic_info as Record<string, unknown>;
  if (!basicInfo.name || typeof basicInfo.name !== "string") {
    return false;
  }

  return true;
}

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}
