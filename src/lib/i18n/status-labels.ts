import type { TranslationStatus } from '$lib/scoring/types';

/**
 * Anzeige-Infos für den vierstufigen Übersetzungsstatus.
 * Für DE/EN/LT als Status-Labels — wird im UI (Intro-Seite, Badges) verwendet.
 */
export const TRANSLATION_STATUS_LABELS: Record<TranslationStatus, { label: string; description: string; tone: 'green' | 'blue' | 'amber' | 'gray' }> = {
	official_ipip: {
		label: 'Offizielle IPIP-Items',
		description: 'Originaltexte aus der offiziellen IPIP-Quelle (Public Domain).',
		tone: 'green'
	},
	community_verified: {
		label: 'Community-geprüft',
		description: 'Übersetzung von Muttersprachlern/Experten geprüft.',
		tone: 'blue'
	},
	community_draft: {
		label: 'Community-Entwurf',
		description: 'Eigene/Community-Übersetzung — ungeprüft, kann Fehler enthalten.',
		tone: 'amber'
	},
	machine_draft: {
		label: 'Maschineller Entwurf',
		description: 'Automatisch übersetzt — ungeprüft, kann Fehler enthalten.',
		tone: 'gray'
	}
};

/** Kurzlabel für Badges (z.B. "Offiziell", "Entwurf", "Maschinell") */
export const TRANSLATION_STATUS_SHORT: Record<TranslationStatus, string> = {
	official_ipip: 'Offiziell',
	community_verified: 'Geprüft',
	community_draft: 'Entwurf',
	machine_draft: 'Maschinell'
};
