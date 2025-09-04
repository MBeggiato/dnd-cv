import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DnDTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

// D&D Begriffserklärungen
const DND_TERMS: Record<string, string> = {
  // Grundwerte
  STR: "Stärke - Bestimmt physische Kraft, Sprungkraft und Tragfähigkeit. Wichtig für Nahkampfangriffe und Atletik.",
  GES: "Geschicklichkeit - Bestimmt Reflexe, Balance und Fingerfertigkeiten. Wichtig für Fernkampf, Initiative und Rüstungsklasse.",
  KON: "Konstitution - Bestimmt Ausdauer, Gesundheit und Widerstandsfähigkeit. Beeinflusst Trefferpunkte direkt.",
  INT: "Intelligenz - Bestimmt Gedächtnis, Logik und Lernfähigkeit. Wichtig für Zauber von Magiern und Wissensfertigkeiten.",
  WEI: "Weisheit - Bestimmt Wahrnehmung, Intuition und Willenskraft. Wichtig für Kleriker- und Druiden-Zauber.",
  CHA: "Charisma - Bestimmt Persönlichkeit, Führungsqualitäten und magische Kraft. Wichtig für soziale Interaktionen und Barden-/Hexenmeister-/Paladin-Zauber.",

  // Kampfwerte
  RK: "Rüstungsklasse - Schwierigkeit, den Charakter zu treffen. Je höher, desto besser ist die Verteidigung.",
  Initiative:
    "Initiative - Bestimmt die Reihenfolge im Kampf. Wird zu Beginn jedes Kampfes gewürfelt (1W20 + Initiative-Modifier).",
  Tempo:
    "Bewegungsgeschwindigkeit pro Runde in Fuß. Standard für Menschen sind 30 Fuß (ca. 9 Meter).",
  TP: "Trefferpunkte - Repräsentieren die Fähigkeit, Schaden zu widerstehen. Bei 0 TP wird der Charakter bewusstlos.",

  // Fertigkeiten
  Acrobatics:
    "Akrobatik - Für Balance, Rollen und akrobatische Manöver. Basiert auf Geschicklichkeit.",
  "Animal handling":
    "Tierkunde - Für den Umgang mit Tieren. Basiert auf Weisheit.",
  Arcana:
    "Arkane Kunde - Wissen über Magie, magische Gegenstände und Zauber. Basiert auf Intelligenz.",
  Athletics:
    "Athletik - Für Klettern, Schwimmen und Springen. Basiert auf Stärke.",
  Deception: "Täuschung - Für Lügen und Irreführung. Basiert auf Charisma.",
  History:
    "Geschichte - Wissen über historische Ereignisse. Basiert auf Intelligenz.",
  Insight:
    "Menschenkenntnis - Erkennen von Motiven und Lügen. Basiert auf Weisheit.",
  Intimidation:
    "Einschüchterung - Andere durch Drohungen beeinflussen. Basiert auf Charisma.",
  Investigation:
    "Untersuchung - Hinweise suchen und analysieren. Basiert auf Intelligenz.",
  Medicine:
    "Heilkunde - Erste Hilfe und medizinisches Wissen. Basiert auf Weisheit.",
  Nature:
    "Naturkunde - Wissen über Natur, Pflanzen und Tiere. Basiert auf Intelligenz.",
  Perception:
    "Wahrnehmung - Dinge bemerken und entdecken. Basiert auf Weisheit.",
  Performance:
    "Darbietung - Für Auftritte und Unterhaltung. Basiert auf Charisma.",
  Persuasion:
    "Überredung - Andere durch Argumente überzeugen. Basiert auf Charisma.",
  Religion:
    "Religionskunde - Wissen über Götter und religiöse Riten. Basiert auf Intelligenz.",
  "Sleight of hand":
    "Fingerfertigkeit - Für Taschendiebstahl und Zaubertricks. Basiert auf Geschicklichkeit.",
  Stealth:
    "Heimlichkeit - Sich verstecken und schleichen. Basiert auf Geschicklichkeit.",
  Survival:
    "Überlebenskunst - In der Wildnis überleben und Spuren lesen. Basiert auf Weisheit.",

  // Zauber
  Zauberangriff:
    "Zauberangriffswurf - Bonus für Angriffswürfe mit Zaubern. Berechnet sich aus Übungsbonus + Zauberattribut.",
  "Rettungswurf-SG":
    "Rettungswurf-Schwierigkeitsgrad - Wert, den Gegner erreichen müssen, um Zaubern zu widerstehen. Berechnet sich aus 8 + Übungsbonus + Zauberattribut.",
  Zauberplätze:
    "Zauberslots - Begrenzte Ressource zum Wirken von Zaubern. Verschiedene Level für verschiedene Zauberstärken.",

  // Allgemeine Begriffe
  Übungsbonus:
    "Proficiency Bonus - Bonus für Fertigkeiten, Rettungswürfe und Angriffe, in denen der Charakter geübt ist. Steigt mit dem Level.",
  Modifier:
    "Attributsmodifikator - Bonus oder Malus basierend auf Attributswerten. Wird zu Würfeln addiert.",
  Level:
    "Stufe/Level - Maß für die Erfahrung und Macht des Charakters. Höhere Level bedeuten mehr Fähigkeiten.",
  Erfahrungspunkte:
    "EP/XP - Experience Points. Werden für das Besiegen von Gegnern und Lösen von Problemen erhalten.",

  // Ausrichtungen
  "Lawful Good":
    "Rechtschaffen Gut - Folgt Gesetzen und moralischen Prinzipien. Klassischer Held.",
  "Neutral Good":
    "Neutral Gut - Tut das Richtige, unabhängig von Gesetzen. Pragmatisch gut.",
  "Chaotic Good":
    "Chaotisch Gut - Rebellisch aber mit guten Absichten. Freiheitskämpfer.",
  "Lawful Neutral":
    "Rechtschaffen Neutral - Folgt Gesetzen und Ordnung über alles andere.",
  "True Neutral": "Wahrhaft Neutral - Ausgewogen, vermeidet Extreme.",
  "Chaotic Neutral": "Chaotisch Neutral - Folgt Impulsen, unvorhersagbar.",
  "Lawful Evil": "Rechtschaffen Böse - Nutzt Systeme für böse Zwecke. Tyrann.",
  "Neutral Evil": "Neutral Böse - Selbstsüchtig, ohne Rücksicht auf andere.",
  "Chaotic Evil": "Chaotisch Böse - Destruktiv und gewalttätig ohne Grenzen.",
};

export function DnDTooltip({ term, children, className }: DnDTooltipProps) {
  const explanation = DND_TERMS[term];

  if (!explanation) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={`cursor-help underline decoration-dotted underline-offset-2 decoration-muted-foreground/50 hover:decoration-primary ${
            className || ""
          }`}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs p-3 text-sm bg-popover border border-border shadow-lg"
        >
          <p className="font-medium mb-1">{term}</p>
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Convenience-Komponente für häufig verwendete Begriffe
export function TooltipTerm({
  term,
  className,
}: {
  term: string;
  className?: string;
}) {
  return (
    <DnDTooltip term={term} className={className}>
      {term}
    </DnDTooltip>
  );
}
