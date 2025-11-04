export class TextJustifier {
// Longueur de chaque ligne justifiée
  private static readonly LINE_LENGTH = 80;
  
  //Fonction justifier un texte en répartissant les mots sur des lignes de 80 caractères
  static justifyText(text: string): string {
    // Découpe le texte en mots en supprimant les espaces
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const lines: string[] = []; // Stocke les lignes justifiées
    let currentLine: string[] = []; // la ligne en cours de construction
    let currentLength = 0; // Longueur totale des caractères des mots (sans espaces)

    for (const word of words) {
    // Vérifie si l'ajout du mot dépasse la limite de 80 caractères
      if (currentLength + word.length + currentLine.length > this.LINE_LENGTH) {
        // On justifie et on l'ajoute au résultat si la ligne est complète
        lines.push(this.justifyLine(currentLine, currentLength));
        // Commence une nouvelle ligne avec le mot courant
        currentLine = [word];
        currentLength = word.length;
      } else {
        // Cas contraire ajoute le mot à la ligne courante
        currentLine.push(word);
        currentLength += word.length;
      }
    }

    // Dernière ligne non justifiée at alignée à gauche
    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }

    // Retourne toutes les lignes séparées par des sauts de ligne
    return lines.join('\n');
  }

  // Fonction pour justifier une ligne en répartissant les espaces entre les mots
  private static justifyLine(words: string[], currentLength: number): string {
    // Si un seul mot, retourne le mot sans modification
    if (words.length === 1) return words[0];
    
    const totalSpaces = this.LINE_LENGTH - currentLength; // Espaces totaux à ajouter
    const spaceSlots = words.length - 1;  // Nombre d'intervalles entre les mots
    const baseSpaces = Math.floor(totalSpaces / spaceSlots); // Espaces de base par intervalle
    const extraSpaces = totalSpaces % spaceSlots; // Espaces supplémentaires à répartir

    let justifiedLine = ''; // Ligne justifiée en cours de construction
    
    // Construit la ligne mot par mot
    for (let i = 0; i < words.length; i++) {
      justifiedLine += words[i];
      
      // Ajoute les espaces après le mot (sauf pour le dernier mot)
      if (i < words.length - 1) {
        let spaces = baseSpaces;
        // Ajoute un espace supplémentaire pour les premiers intervalles si nécessaire
        if (i < extraSpaces) spaces++;
        justifiedLine += ' '.repeat(spaces);
      }
    }

    return justifiedLine;
  }
}