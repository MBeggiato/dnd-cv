"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Shield,
  Zap,
  Target,
  Award,
} from "lucide-react";
import { ValidationResult } from "@/lib/character-validator";

interface CharacterValidationProps {
  validationResult: ValidationResult;
  onClose?: () => void;
}

export function CharacterValidation({
  validationResult,
  onClose,
}: CharacterValidationProps) {
  const { isValid, errors, warnings, score } = validationResult;

  const getScoreColor = (score: number) => {
    if (score >= 90)
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (score >= 75)
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    if (score >= 50)
      return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Award className="h-5 w-5 text-green-500" />;
    if (score >= 75) return <Shield className="h-5 w-5 text-yellow-500" />;
    if (score >= 50) return <Target className="h-5 w-5 text-orange-500" />;
    return <Zap className="h-5 w-5 text-red-500" />;
  };

  const getScoreText = (score: number) => {
    if (score >= 95) return "Perfekt!";
    if (score >= 90) return "Hervorragend";
    if (score >= 80) return "Sehr gut";
    if (score >= 70) return "Gut";
    if (score >= 60) return "Akzeptabel";
    if (score >= 50) return "Überarbeitungsbedürftig";
    return "Erhebliche Probleme";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {onClose && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Charaktervalidierung</h2>
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </div>
      )}

      {/* Gesamtbewertung */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {isValid ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <span>
              {isValid ? "Charakter ist gültig!" : "Charakter hat Probleme"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${getScoreColor(
                score
              )}`}
            >
              {getScoreIcon(score)}
              <span className="font-bold text-lg">{score}/100</span>
            </div>
            <div>
              <p className="font-semibold">{getScoreText(score)}</p>
              <p className="text-sm text-muted-foreground">
                {errors.length === 0 &&
                  warnings.length === 0 &&
                  "Keine Probleme gefunden!"}
                {errors.length > 0 && `${errors.length} Fehler`}
                {errors.length > 0 && warnings.length > 0 && ", "}
                {warnings.length > 0 && `${warnings.length} Warnungen`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fehler */}
      {errors.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
              Fehler ({errors.length})
            </CardTitle>
            <CardDescription>
              Diese Probleme sollten behoben werden, da sie gegen die D&D 5e
              Regeln verstoßen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {errors.map((error, index) => (
              <Alert key={index} className="border-red-200 dark:border-red-800">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {error.field}
                      </Badge>
                      <span className="font-medium">{error.message}</span>
                    </div>
                    {error.suggestion && (
                      <p className="text-sm text-muted-foreground">
                        💡 Vorschlag: {error.suggestion}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Warnungen */}
      {warnings.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              Warnungen ({warnings.length})
            </CardTitle>
            <CardDescription>
              Diese Werte scheinen ungewöhnlich zu sein, könnten aber durch
              spezielle Umstände erklärt werden.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {warnings.map((warning, index) => (
              <Alert
                key={index}
                className="border-yellow-200 dark:border-yellow-800"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      >
                        {warning.field}
                      </Badge>
                      <span className="font-medium">{warning.message}</span>
                    </div>
                    {warning.suggestion && (
                      <p className="text-sm text-muted-foreground">
                        💡 Vorschlag: {warning.suggestion}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Validierungsdetails */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Validierungsdetails
          </CardTitle>
          <CardDescription>
            Diese Validierung basiert auf den offiziellen D&D 5e Regeln und dem
            System Reference Document (SRD).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Überprüfte Bereiche:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Fähigkeitswerte und Modifikatoren</li>
                  <li>✓ Klassen-spezifische Regeln</li>
                  <li>✓ Rassen-Eigenschaften</li>
                  <li>✓ Trefferpunkte-Berechnung</li>
                  <li>✓ Fertigkeits-Boni</li>
                  <li>✓ Zauberspruch-Mechaniken</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Bewertungskriterien:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>90-100: Regelkonform und optimiert</li>
                  <li>75-89: Kleinere Ungenauigkeiten</li>
                  <li>50-74: Mehrere Probleme</li>
                  <li>0-49: Schwerwiegende Regelverletzungen</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Hinweis:</strong> Diese Validierung berücksichtigt
                Standardregeln aus dem SRD. Hausregeln, optionale Regeln oder
                spezielle Kampagnen-Einstellungen können zu berechtigten
                Abweichungen führen. Bei Fragen wende dich an deinen
                Spielleiter.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Erfolgreiche Validierung */}
      {isValid && errors.length === 0 && warnings.length === 0 && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                Perfekter Charakter!
              </h3>
              <p className="text-green-600 dark:text-green-400">
                Dein Charakter entspricht vollständig den offiziellen D&D 5e
                Regeln. Bereit für das Abenteuer! 🎲
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
