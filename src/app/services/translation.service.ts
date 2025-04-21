import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private dictionary: Record<string, string> = {
    "The item was completely broken upon arrival": "L'article était complètement cassé à l'arrivée",
    "Delivery was delayed by three days": "La livraison a été retardée de trois jours",
    "The owner did not respond to any of my messages": "Le propriétaire n'a répondu à aucun de mes messages",
    "The item did not match the description": "L'article ne correspondait pas à la description",
    "There was a small scratch, but it still worked": "Il y avait une petite rayure, mais il fonctionnait encore",
    "I couldn’t reach the owner through the app": "Je ne pouvais pas contacter le propriétaire via l'application",
    "The item was missing from the package": "L'article manquait dans le colis",
    "The delivery arrived late in the evening": "La livraison est arrivée tard dans la soirée",
    "The owner was friendly but the item was defective": "Le propriétaire était sympathique, mais l'article était défectueux",
    "Everything went smoothly, no issues": "Tout s'est bien passé, aucun problème",
    "The product was dirty and clearly used": "Le produit était sale et manifestement utilisé",
    "The app crashed during payment": "L'application a planté pendant le paiement",
    "Rental was canceled last minute by the owner": "La location a été annulée à la dernière minute par le propriétaire",
    "Late delivery with no explanation": "Livraison tardive sans explication",
    "The packaging was open when I received it": "L'emballage était ouvert à la réception",
    "The support team took too long to reply": "L'équipe d'assistance a mis trop de temps à répondre",
    "The item arrived earlier than expected": "L'article est arrivé plus tôt que prévu",
    "I was charged twice for the same rental": "J'ai été facturé deux fois pour la même location",
    "The pickup point was hard to find": "Le point de retrait était difficile à trouver",
    "The product had missing accessories": "Le produit avait des accessoires manquants"
  };

  translate(text: string): string {
    return this.dictionary[text] || Object.keys(this.dictionary).find(key => this.dictionary[key] === text) || text;
  }

  toggleTranslation(text: string): string {
    return this.dictionary[text] || this.getOriginalText(text) || text;
  }

  private getOriginalText(frenchText: string): string | undefined {
    return Object.entries(this.dictionary).find(([_, value]) => value === frenchText)?.[0];
  }
}
