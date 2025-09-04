import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DnDCharacter, Attack } from "@/types/character";
import { formatModifier } from "@/lib/character-utils";
import { User } from "lucide-react";
import { DnDTooltip, TooltipTerm } from "@/components/DnDTooltip";

interface CharacterSheetProps {
  character: DnDCharacter;
}

export function CharacterSheet({ character }: CharacterSheetProps) {
  const {
    basic_info,
    ability_scores,
    hit_points,
    armor_and_movement,
    skills,
    saving_throws,
    notes,
  } = character;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Profil Header mit Bild */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profilbild */}
            <div className="flex-shrink-0">
              <div className="w-32 h-48 lg:w-40 lg:h-48 border-4 border-purple-400/30 overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                {basic_info.profile_image ? (
                  <img
                    src={basic_info.profile_image}
                    alt={`${basic_info.name} Profilbild`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.parentElement?.querySelector(
                        ".fallback-icon"
                      ) as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`fallback-icon ${
                    basic_info.profile_image ? "hidden" : "flex"
                  } items-center justify-center`}
                >
                  <User className="w-16 h-16 lg:w-20 lg:h-20 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Grundinformationen */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {basic_info.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-purple-600/80 text-white"
                  >
                    <DnDTooltip term="Level">Level</DnDTooltip>{" "}
                    {basic_info.level} {basic_info.race} {basic_info.class}
                    {basic_info.subclass && ` (${basic_info.subclass})`}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-purple-300 text-purple-300"
                  >
                    {basic_info.background}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-300 text-blue-300"
                  >
                    <DnDTooltip term={basic_info.alignment}>
                      {basic_info.alignment}
                    </DnDTooltip>
                  </Badge>
                </div>
                <p className="text-purple-200 text-sm">
                  <DnDTooltip term="Erfahrungspunkte">
                    Erfahrungspunkte
                  </DnDTooltip>
                  : {basic_info.experience_points.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hauptinhalt in breiterer Spalte */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Linke Spalte - Kompakte Grundwerte */}
        <div className="xl:col-span-1 space-y-4">
          {/* Fähigkeitswerte - Kompakt */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Fähigkeitswerte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(ability_scores).map(([ability, data]) => (
                <div
                  key={ability}
                  className="flex justify-between items-center py-1"
                >
                  <DnDTooltip
                    term={
                      ability === "strength"
                        ? "STR"
                        : ability === "dexterity"
                        ? "GES"
                        : ability === "constitution"
                        ? "KON"
                        : ability === "intelligence"
                        ? "INT"
                        : ability === "wisdom"
                        ? "WEI"
                        : "CHA"
                    }
                  >
                    <span className="text-sm font-medium">
                      {ability === "strength" && "STR"}
                      {ability === "dexterity" && "GES"}
                      {ability === "constitution" && "KON"}
                      {ability === "intelligence" && "INT"}
                      {ability === "wisdom" && "WEI"}
                      {ability === "charisma" && "CHA"}
                    </span>
                  </DnDTooltip>
                  <div className="text-right">
                    <div className="font-bold text-lg">{data.score}</div>
                    <div className="text-xs text-muted-foreground">
                      <DnDTooltip term="Modifier">
                        {formatModifier(data.modifier)}
                      </DnDTooltip>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Kampfwerte - Kompakt */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Kampfwerte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-1">
                <DnDTooltip term="RK">
                  <span className="text-sm">RK</span>
                </DnDTooltip>
                <span className="font-bold text-lg">
                  {armor_and_movement.armor_class}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <DnDTooltip term="Initiative">
                  <span className="text-sm">Initiative</span>
                </DnDTooltip>
                <span className="font-bold">
                  {formatModifier(armor_and_movement.initiative)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <DnDTooltip term="Tempo">
                  <span className="text-sm">Tempo</span>
                </DnDTooltip>
                <span className="font-bold">{armor_and_movement.speed} ft</span>
              </div>
              <Separator className="my-2" />
              <div className="space-y-1">
                <DnDTooltip term="TP">
                  <h4 className="font-semibold text-sm">TP</h4>
                </DnDTooltip>
                <div className="flex justify-between text-sm">
                  <span>Max</span>
                  <span className="font-bold">{hit_points.max}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Aktuell</span>
                  <span className="font-bold">{hit_points.current}</span>
                </div>
                {hit_points.temporary > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Temp.</span>
                    <span className="font-bold">{hit_points.temporary}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rettungswürfe - Kompakt */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rettungswürfe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {Object.entries(saving_throws).map(([ability, modifier]) => (
                <div key={ability} className="flex justify-between py-1">
                  <DnDTooltip
                    term={
                      ability === "strength"
                        ? "STR"
                        : ability === "dexterity"
                        ? "GES"
                        : ability === "constitution"
                        ? "KON"
                        : ability === "intelligence"
                        ? "INT"
                        : ability === "wisdom"
                        ? "WEI"
                        : "CHA"
                    }
                  >
                    <span className="text-sm">
                      {ability === "strength" && "STR"}
                      {ability === "dexterity" && "GES"}
                      {ability === "constitution" && "KON"}
                      {ability === "intelligence" && "INT"}
                      {ability === "wisdom" && "WEI"}
                      {ability === "charisma" && "CHA"}
                    </span>
                  </DnDTooltip>
                  <span className="font-bold text-sm">
                    {formatModifier(modifier)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Rechte Spalten - Hauptinhalt */}
        <div className="xl:col-span-3 space-y-6">
          {/* Fertigkeiten */}
          <Card>
            <CardHeader>
              <CardTitle>Fertigkeiten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {Object.entries(skills).map(([skill, modifier]) => (
                  <div
                    key={skill}
                    className="flex justify-between items-center"
                  >
                    <DnDTooltip
                      term={
                        skill.charAt(0).toUpperCase() +
                        skill.slice(1).replace(/_/g, " ")
                      }
                    >
                      <span className="text-sm capitalize">
                        {skill.replace(/_/g, " ")}
                      </span>
                    </DnDTooltip>
                    <span className="font-mono text-sm font-bold">
                      {formatModifier(modifier)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Angriffe und Zauber */}
          {character.attacks_and_spellcasting.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Angriffe & Zauber</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {character.attacks_and_spellcasting.map((attack, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      {typeof attack === "string" ? (
                        <div className="text-sm">{attack}</div>
                      ) : (
                        <div>
                          <div className="font-semibold text-lg mb-1">
                            {(attack as Attack).name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">
                              {(attack as Attack).type}
                            </span>
                            {formatModifier((attack as Attack).attack_bonus)}{" "}
                            zum Treffen
                          </div>
                          <div className="text-sm mt-1">
                            <strong>Schaden:</strong>{" "}
                            {(attack as Attack).damage}
                            {(attack as Attack).versatile_damage &&
                              ` (${
                                (attack as Attack).versatile_damage
                              } beidhändig)`}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eigenschaften und Merkmale */}
          {character.features_and_traits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Eigenschaften & Merkmale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {character.features_and_traits.map((feature, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted rounded-lg text-sm"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ausrüstung */}
          {character.equipment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ausrüstung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {character.equipment.map((item, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zaubersprüche */}
          {character.spellcasting.known_spells.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Zaubersprüche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DnDTooltip term="Zauberangriff">
                      <span className="text-sm font-medium">
                        Zauberangriff:
                      </span>
                    </DnDTooltip>
                    <Badge variant="outline" className="font-mono">
                      {formatModifier(
                        character.spellcasting.spell_attack_bonus
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <DnDTooltip term="Rettungswurf-SG">
                      <span className="text-sm font-medium">
                        Rettungswurf-SG:
                      </span>
                    </DnDTooltip>
                    <Badge variant="outline" className="font-mono">
                      {character.spellcasting.spell_save_dc}
                    </Badge>
                  </div>
                </div>

                {Object.keys(character.spellcasting.spell_slots).length > 0 && (
                  <div>
                    <DnDTooltip term="Zauberplätze">
                      <h4 className="font-semibold mb-3">Zauberplätze</h4>
                    </DnDTooltip>
                    <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
                      {Object.entries(character.spellcasting.spell_slots).map(
                        ([level, slots]) => (
                          <div
                            key={level}
                            className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg"
                          >
                            <div className="text-xs text-purple-600 mb-1">
                              Level {level}
                            </div>
                            <div className="font-bold text-lg text-purple-800">
                              {slots}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3">Bekannte Zauber</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {character.spellcasting.known_spells.map((spell, index) => (
                      <div
                        key={index}
                        className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800"
                      >
                        {spell}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notizen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notes.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Beschreibung</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {notes.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Persönlichkeit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notes.personality_traits && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-purple-700">
                      Persönlichkeitsmerkmale
                    </h4>
                    <p className="text-sm bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                      {notes.personality_traits}
                    </p>
                  </div>
                )}

                {notes.ideals && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-blue-700">
                      Ideale
                    </h4>
                    <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      {notes.ideals}
                    </p>
                  </div>
                )}

                {notes.bonds && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-700">
                      Bindungen
                    </h4>
                    <p className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
                      {notes.bonds}
                    </p>
                  </div>
                )}

                {notes.flaws && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-red-700">
                      Schwächen
                    </h4>
                    <p className="text-sm bg-red-50 p-3 rounded border-l-4 border-red-400">
                      {notes.flaws}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
