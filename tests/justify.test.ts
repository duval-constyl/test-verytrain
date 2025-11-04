import { TextJustifier } from '../src/utils/justify';

// Tester l'algorithme de justification de texte
describe('TextJustifier', () => {
  describe('justifyText', () => {

    // Test pour vérifier que le texte est correctement justifié sur plusieurs lignes
    test('should justify text with multiple lines', () => {
      const input = "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour.";
      const result = TextJustifier.justifyText(input);
      
      console.log('Input:', input);
      console.log('Output:', result);
      console.log('Line lengths:', result.split('\n').map(line => line.length));
      
       // Vérifier que le résultat contient des sauts de ligne
      expect(result).toContain('\n');
      const lines = result.split('\n');
      
      // Vérifier que toutes les lignes font <= 80 caractères
      lines.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(80);
      });
      
      // Vérifier que au moins une ligne fait exactement 80 caractères (sauf la dernière)
      const justifiedLines = lines.slice(0, -1);
      if (justifiedLines.length > 0) {
        expect(justifiedLines.some(line => line.length === 80)).toBe(true);
      }
    });

    // Test pour vérifier le comportement avec une entrée minimale
    test('should handle single word', () => {
      const input = "Hello";
      const result = TextJustifier.justifyText(input);
      
      expect(result).toBe("Hello");
      expect(result.length).toBeLessThanOrEqual(80);
    });

    // Test pour vérifier avec une chaine vide
    test('should handle empty text', () => {
      const input = "";
      const result = TextJustifier.justifyText(input);
      
      expect(result).toBe("");
    });

    // Test pour vérifier si des espaces multiples sont correctement gérés
    test('should handle text with multiple spaces', () => {
      const input = "Hello    world    with    multiple    spaces";
      const result = TextJustifier.justifyText(input);
      
      expect(result.split('\n').every(line => line.length <= 80)).toBe(true);
      // Vérifier que les espaces multiples sont normalisés
      expect(result).not.toMatch(/ {2,}/); // Pas plus de 2 espaces consécutifs sauf pour la justification
    });
  });
});