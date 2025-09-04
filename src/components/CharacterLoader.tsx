"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Sword, Sparkles, Users2 } from "lucide-react";
import { DnDCharacter } from "@/types/character";
import {
  AVAILABLE_CHARACTERS,
  loadCharacterFromPublic,
  CharacterPreview,
} from "@/lib/character-loader";

interface CharacterLoaderProps {
  onCharacterLoad: (character: DnDCharacter) => void;
}

const getClassIcon = (characterClass: string) => {
  switch (characterClass.toLowerCase()) {
    case "kämpfer":
    case "fighter":
      return <Sword className="h-5 w-5 text-red-400" />;
    case "zauberer":
    case "sorcerer":
    case "magier":
    case "wizard":
      return <Sparkles className="h-5 w-5 text-purple-400" />;
    case "waldläufer":
    case "ranger":
      return <Users2 className="h-5 w-5 text-green-400" />;
    case "schurke":
    case "rogue":
      return <User className="h-5 w-5 text-gray-400" />;
    case "paladin":
      return <Sword className="h-5 w-5 text-yellow-400" />;
    default:
      return <User className="h-5 w-5 text-blue-400" />;
  }
};

export function CharacterLoader({ onCharacterLoad }: CharacterLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCharacter, setLoadingCharacter] = useState<string | null>(null);

  const handleCharacterSelect = useCallback(
    async (characterPreview: CharacterPreview) => {
      setIsLoading(true);
      setLoadingCharacter(characterPreview.id);

      try {
        const character = await loadCharacterFromPublic(
          characterPreview.filename
        );
        onCharacterLoad(character);
        toast.success(
          `Charakter "${character.basic_info.name}" erfolgreich geladen!`
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Fehler beim Laden des Charakters"
        );
      } finally {
        setIsLoading(false);
        setLoadingCharacter(null);
      }
    },
    [onCharacterLoad]
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">D&D Charakter Viewer</h1>
        <p className="text-muted-foreground">
          Wählen Sie einen der verfügbaren Charaktere aus und betrachten Sie
          deren detaillierte Charakterbögen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            Verfügbare Charaktere
          </CardTitle>
          <CardDescription>
            Klicken Sie auf einen Charakter, um dessen vollständiges
            Charakterblatt anzuzeigen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {AVAILABLE_CHARACTERS.map((character) => (
              <Card
                key={character.id}
                className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] bg-gradient-to-br from-card to-muted/20"
                onClick={() => handleCharacterSelect(character)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getClassIcon(character.class)}
                      {character.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Level {character.level}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {character.race}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {character.class}
                    </Badge>
                  </div>
                </CardHeader>
                {character.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {character.description}
                    </p>
                  </CardContent>
                )}
                <CardContent className="pt-2">
                  <Button
                    className="w-full"
                    disabled={isLoading}
                    variant={
                      loadingCharacter === character.id
                        ? "secondary"
                        : "default"
                    }
                  >
                    {loadingCharacter === character.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Lade...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Charakter laden
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="text-center">🎲 Tipp für Spielleiter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Diese Charaktere sind perfekt für Schnellspiele, One-Shots oder als
            NSCs für Ihre Kampagnen geeignet. Jeder Charakter hat eine
            vollständige Hintergrundgeschichte und ist sofort spielbereit!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
