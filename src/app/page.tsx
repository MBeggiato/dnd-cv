"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sword,
  Shield,
  Zap,
  Users,
  Eye,
  Plus,
  BookOpen,
  Dice6,
  Heart,
  Star,
  ArrowLeft,
  CheckCircle2,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CharacterLoader } from "@/components/CharacterLoader";
import { CharacterSheet } from "@/components/CharacterSheet";
import { CharacterValidation } from "@/components/CharacterValidation";
import { DnDCharacter } from "@/types/character";
import {
  loadCharacterFromPublic,
  AVAILABLE_CHARACTERS,
} from "@/lib/character-loader";
import { toast } from "sonner";
import { validateCharacter } from "@/lib/character-validator";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCharacter, setCurrentCharacter] = useState<DnDCharacter | null>(
    null
  );
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // URL-Parameter für Charakter-Sharing
  useEffect(() => {
    const characterId = searchParams.get("character");
    if (characterId && !currentCharacter) {
      loadCharacterFromUrl(characterId);
    }
  }, [searchParams, currentCharacter]);

  const loadCharacterFromUrl = async (characterId: string) => {
    setIsLoading(true);
    try {
      const characterPreview = AVAILABLE_CHARACTERS.find(
        (char) => char.id === characterId
      );
      if (characterPreview) {
        const character = await loadCharacterFromPublic(
          characterPreview.filename
        );
        setCurrentCharacter(character);
        toast.success(
          `Charakter "${character.basic_info.name}" über Link geladen!`
        );
      } else {
        toast.error("Charakter nicht gefunden");
      }
    } catch (error) {
      toast.error("Fehler beim Laden des Charakters über Link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterLoad = (character: DnDCharacter) => {
    setCurrentCharacter(character);
    // URL aktualisieren für Sharing
    const characterPreview = AVAILABLE_CHARACTERS.find(
      (char) => char.name === character.basic_info.name
    );
    if (characterPreview) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("character", characterPreview.id);
      window.history.pushState({}, "", newUrl.toString());
    }
  };

  const handleBackToLoader = () => {
    setCurrentCharacter(null);
    setShowValidation(false);
    // URL zurücksetzen
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("character");
    window.history.pushState({}, "", newUrl.toString());
  };

  const handleShareCharacter = async () => {
    if (!currentCharacter) return;

    const characterPreview = AVAILABLE_CHARACTERS.find(
      (char) => char.name === currentCharacter.basic_info.name
    );
    if (characterPreview) {
      const shareUrl = `${window.location.origin}/?character=${characterPreview.id}`;

      try {
        if (navigator.share) {
          // Native Sharing API (mobile/modern browsers)
          await navigator.share({
            title: `D&D Charakter: ${currentCharacter.basic_info.name}`,
            text: `Schaue dir ${currentCharacter.basic_info.name} an - ${characterPreview.description}`,
            url: shareUrl,
          });
        } else {
          // Fallback: Copy to clipboard
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Link in Zwischenablage kopiert!");
        }
      } catch (error) {
        // Fallback falls clipboard nicht funktioniert
        prompt("Kopiere diesen Link zum Teilen:", shareUrl);
      }
    }
  };

  const handleValidateCharacter = () => {
    setShowValidation(true);
  };

  const handleCloseValidation = () => {
    setShowValidation(false);
  };

  // Loading state für URL-basiertes Laden
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white">Lade Charakter...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Wenn Validierung angezeigt werden soll
  if (currentCharacter && showValidation) {
    const validationResult = validateCharacter(currentCharacter);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto py-6">
          <CharacterValidation
            validationResult={validationResult}
            onClose={handleCloseValidation}
          />
        </div>
      </main>
    );
  }

  // Wenn ein Charakter geladen ist, zeige das Charakterblatt
  if (currentCharacter) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto py-6">
          <div className="mb-6 flex justify-between items-center">
            <Button
              onClick={handleBackToLoader}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Charakterlader
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleShareCharacter}
                variant="outline"
                className="mb-4"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Teilen
              </Button>
              <Button
                onClick={handleValidateCharacter}
                className="mb-4 bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Charakter validieren
              </Button>
            </div>
          </div>
          <CharacterSheet character={currentCharacter} />
        </div>
      </main>
    );
  }

  // Ansonsten zeige den Charakterlader
  const features = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Character Viewer",
      description:
        "Betrachte und verwalte deine D&D-Charaktere in einer übersichtlichen und intuitiven Oberfläche.",
    },
    {
      icon: <Dice6 className="h-8 w-8" />,
      title: "Würfel-Integration",
      description:
        "Integrierte Würfel-Tools für alle deine Würfe direkt im Character-Viewer.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Spell Database",
      description:
        "Umfangreiche Zauberspruch-Datenbank mit detaillierten Beschreibungen und Filtern.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Party Management",
      description:
        "Verwalte ganze Abenteurer-Gruppen und teile Charaktere mit deinen Mitspielern.",
    },
  ];

  const sampleCharacters = [
    {
      name: "Aragorn Sturmwind",
      class: "Ranger",
      level: 12,
      race: "Mensch",
      hp: 89,
      maxHp: 98,
      ac: 17,
    },
    {
      name: "Lyanna Goldleaf",
      class: "Zauberin",
      level: 8,
      race: "Elf",
      hp: 52,
      maxHp: 64,
      ac: 14,
    },
    {
      name: "Thorek Eisenbart",
      class: "Kämpfer",
      level: 10,
      race: "Zwerg",
      hp: 95,
      maxHp: 95,
      ac: 19,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sword className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">DnD Viewer</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#characters"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Charaktere
              </Link>
              <Link
                href="#about"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Über uns
              </Link>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white"
              >
                Anmelden
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-slate-900 border-slate-700">
                <SheetHeader>
                  <SheetTitle className="text-white">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link
                    href="#features"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#characters"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Charaktere
                  </Link>
                  <Link
                    href="#about"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Über uns
                  </Link>
                  <Separator className="bg-slate-700" />
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Jetzt starten
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Character Loader Section */}
      <section className="relative py-20 lg:py-32">
        <CharacterLoader onCharacterLoad={handleCharacterLoad} />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Warum DnD Viewer?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Entwickelt von D&D-Spielern für D&D-Spieler. Alle Tools, die du
              für epische Abenteuer brauchst.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-colors"
              >
                <CardHeader className="text-center">
                  <div className="text-purple-400 flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Characters Section */}
      <section id="characters" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Beispiel-Charaktere
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Siehe, wie deine Charaktere in unserem System aussehen würden.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleCharacters.map((character, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-all hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      {character.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-purple-600 text-white"
                    >
                      Level {character.level}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-300">
                    {character.race} {character.class}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-400" />
                        HP
                      </span>
                      <span className="text-white font-semibold">
                        {character.hp}/{character.maxHp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-400" />
                        AC
                      </span>
                      <span className="text-white font-semibold">
                        {character.ac}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all"
                        style={{
                          width: `${(character.hp / character.maxHp) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Entdecke alle Features
            </h2>
          </div>
          <Tabs defaultValue="character" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
              <TabsTrigger
                value="character"
                className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-purple-600"
              >
                Character Sheet
              </TabsTrigger>
              <TabsTrigger
                value="spells"
                className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-purple-600"
              >
                Zaubersprüche
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-purple-600"
              >
                Inventar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="character" className="mt-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="mr-2 h-5 w-5 text-purple-400" />
                    Character Sheet
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Vollständige Charakterverwaltung mit allen wichtigen
                    Statistiken
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Grundwerte</h4>
                      <div className="space-y-2">
                        {["Stärke", "Geschicklichkeit", "Konstitution"].map(
                          (stat) => (
                            <div
                              key={stat}
                              className="flex justify-between items-center"
                            >
                              <span className="text-slate-300">{stat}</span>
                              <Badge
                                variant="outline"
                                className="border-purple-500 text-purple-300"
                              >
                                +3
                              </Badge>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Skills</h4>
                      <div className="space-y-2">
                        {["Akrobatik", "Täuschen", "Einschüchtern"].map(
                          (skill) => (
                            <div
                              key={skill}
                              className="flex justify-between items-center"
                            >
                              <span className="text-slate-300">{skill}</span>
                              <Badge
                                variant="outline"
                                className="border-blue-500 text-blue-300"
                              >
                                +5
                              </Badge>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Kampfwerte</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Initiative</span>
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-300"
                          >
                            +4
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">
                            Geschwindigkeit
                          </span>
                          <Badge
                            variant="outline"
                            className="border-yellow-500 text-yellow-300"
                          >
                            30 ft
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="spells" className="mt-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-purple-400" />
                    Zauberspruch-Verwaltung
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Organisiere und verwalte alle deine Zaubersprüche
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {[
                        { name: "Feuerball", level: 3, school: "Evokation" },
                        {
                          name: "Magisches Geschoss",
                          level: 1,
                          school: "Evokation",
                        },
                        {
                          name: "Unsichtbarkeit",
                          level: 2,
                          school: "Illusion",
                        },
                        { name: "Blitz", level: 3, school: "Evokation" },
                        { name: "Heilung", level: 1, school: "Evokation" },
                      ].map((spell, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                        >
                          <div>
                            <h5 className="text-white font-medium">
                              {spell.name}
                            </h5>
                            <p className="text-slate-300 text-sm">
                              {spell.school}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-purple-600 text-white"
                          >
                            Level {spell.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className="mt-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-purple-400" />
                    Inventar-System
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Behalte den Überblick über deine Ausrüstung
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Waffen</h4>
                      {[
                        { name: "Langschwert +1", damage: "1d8+4" },
                        { name: "Langbogen", damage: "1d8+3" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                        >
                          <div>
                            <h5 className="text-white font-medium">
                              {item.name}
                            </h5>
                            <p className="text-slate-300 text-sm">
                              {item.damage} Schaden
                            </p>
                          </div>
                          <Sword className="h-5 w-5 text-red-400" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Rüstung</h4>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <h5 className="text-white font-medium">Kettenhemd</h5>
                          <p className="text-slate-300 text-sm">AC 16</p>
                        </div>
                        <Shield className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Star className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bereit für dein nächstes Abenteuer?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Erstelle deinen ersten Charakter und tauche ein in die Welt von D&D
            wie nie zuvor.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg"
          >
            <Plus className="mr-2 h-6 w-6" />
            Kostenlos starten
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Sword className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">
                  DnD Viewer
                </span>
              </div>
              <p className="text-slate-300 max-w-md">
                Das ultimative Tool für D&D-Spieler. Verwalte deine Charaktere,
                plane deine Abenteuer und erlebe epische Geschichten.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-300">
                <li>Character Viewer</li>
                <li>Spell Database</li>
                <li>Dice Roller</li>
                <li>Party Management</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-slate-300">
                <li>Datenschutz</li>
                <li>Impressum</li>
                <li>AGB</li>
                <li>Kontakt</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-slate-700" />
          <div className="text-center text-slate-400">
            <p>&copy; 2024 DnD Viewer. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <HomeContent />
    </Suspense>
  );
}
