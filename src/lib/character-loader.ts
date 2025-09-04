import { DnDCharacter } from "@/types/character";

export interface CharacterPreview {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  filename: string;
  description?: string;
}

// Statische Liste der verfügbaren Charaktere
export const AVAILABLE_CHARACTERS: CharacterPreview[] = [
  {
    id: "lyra",
    name: "Lyra Brightshield",
    race: "Human (Variant)",
    class: "Paladin",
    level: 5,
    filename: "Lyra-Brightshield.json",
    description:
      "Eine edle Paladin-Kriegerin mit unerschütterlichem Glauben und dem Drang, das Gute zu beschützen.",
  },
  {
    id: "xarion",
    name: "Xarion Vey",
    race: "Drow (Dark Elf)",
    class: "Schurke",
    level: 5,
    filename: "xarion-vey.json",
    description:
      "Ein verstoßener Drow-Adliger und Arcane Trickster, der aus dem Schatten agiert und Geheimnisse sammelt.",
  },
];

export async function loadCharacterFromPublic(
  filename: string
): Promise<DnDCharacter> {
  try {
    const response = await fetch(`/${filename}`);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
    }

    const jsonData = await response.text();
    const character = JSON.parse(jsonData) as DnDCharacter;

    // Grundlegende Validierung
    if (!character.basic_info?.name) {
      throw new Error("Ungültige Charakterdaten: Name fehlt");
    }

    return character;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unbekannter Fehler beim Laden des Charakters");
  }
}
