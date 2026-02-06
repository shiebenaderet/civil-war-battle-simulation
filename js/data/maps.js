// SVG battle maps for visual display

function createBattleMap(battleId) {
    const maps = {
        bull_run: `
            <svg viewBox="0 0 400 300" aria-label="Map of First Battle of Bull Run">
                <rect width="400" height="300" fill="var(--color-cream-200)" />
                <g stroke="var(--color-navy-600)" stroke-width="2" fill="none">
                    <!-- Bull Run Creek -->
                    <path d="M 50 150 Q 200 120 350 160" stroke="var(--color-blue-500)" stroke-width="3" />
                    <!-- Stone Bridge -->
                    <rect x="95" y="145" width="15" height="10" fill="var(--color-navy-800)" />
                    <!-- Union Forces -->
                    <rect x="80" y="100" width="40" height="20" fill="var(--color-blue-700)" />
                    <text x="100" y="90" text-anchor="middle" font-size="12" fill="var(--color-navy-800)">Union</text>
                    <!-- Confederate Forces -->
                    <rect x="280" y="180" width="40" height="20" fill="var(--color-error)" />
                    <text x="300" y="215" text-anchor="middle" font-size="12" fill="var(--color-navy-800)">Confederate</text>
                    <!-- Henry Hill -->
                    <circle cx="250" cy="150" r="20" fill="var(--color-gold-400)" opacity="0.7" />
                    <text x="250" y="155" text-anchor="middle" font-size="10" fill="var(--color-navy-800)">Henry Hill</text>
                </g>
            </svg>
        `,
        gettysburg: `
            <svg viewBox="0 0 400 300" aria-label="Map of Battle of Gettysburg">
                <rect width="400" height="300" fill="var(--color-cream-200)" />
                <g stroke="var(--color-navy-600)" stroke-width="2" fill="none">
                    <!-- Cemetery Hill -->
                    <circle cx="200" cy="120" r="25" fill="var(--color-gold-400)" opacity="0.7" />
                    <text x="200" y="95" text-anchor="middle" font-size="12" fill="var(--color-navy-800)">Cemetery Hill</text>
                    <!-- Union Lines -->
                    <path d="M 180 120 Q 200 180 220 240" stroke="var(--color-blue-700)" stroke-width="4" />
                    <!-- Confederate Lines -->
                    <path d="M 100 100 Q 150 150 120 200 Q 180 220 240 200 Q 280 180 300 140" stroke="var(--color-error)" stroke-width="4" />
                    <!-- Little Round Top -->
                    <circle cx="160" cy="220" r="15" fill="var(--color-gold-400)" opacity="0.7" />
                    <text x="160" y="245" text-anchor="middle" font-size="10" fill="var(--color-navy-800)">Little Round Top</text>
                    <!-- Big Round Top -->
                    <circle cx="140" cy="240" r="18" fill="var(--color-gold-400)" opacity="0.7" />
                    <text x="90" y="260" text-anchor="middle" font-size="10" fill="var(--color-navy-800)">Big Round Top</text>
                </g>
            </svg>
        `,
        antietam: `
            <svg viewBox="0 0 400 300" aria-label="Map of Battle of Antietam">
                <rect width="400" height="300" fill="var(--color-cream-200)" />
                <g stroke="var(--color-navy-600)" stroke-width="2" fill="none">
                    <!-- Antietam Creek -->
                    <path d="M 150 50 Q 180 150 150 250" stroke="var(--color-blue-500)" stroke-width="4" />
                    <!-- Burnside Bridge -->
                    <rect x="145" y="200" width="15" height="8" fill="var(--color-navy-800)" />
                    <text x="170" y="215" font-size="10" fill="var(--color-navy-800)">Burnside Bridge</text>
                    <!-- Union Forces -->
                    <rect x="80" y="120" width="50" height="15" fill="var(--color-blue-700)" />
                    <rect x="70" y="180" width="50" height="15" fill="var(--color-blue-700)" />
                    <!-- Confederate Forces -->
                    <rect x="200" y="140" width="50" height="15" fill="var(--color-error)" />
                    <!-- Sharpsburg -->
                    <circle cx="220" cy="120" r="12" fill="var(--color-navy-800)" />
                    <text x="220" y="105" text-anchor="middle" font-size="10" fill="var(--color-navy-800)">Sharpsburg</text>
                </g>
            </svg>
        `
    };
    
    return maps[battleId] || `
        <svg viewBox="0 0 400 300" aria-label="Generic battle map">
            <rect width="400" height="300" fill="var(--color-cream-200)" />
            <g stroke="var(--color-navy-600)" stroke-width="2" fill="none">
                <text x="200" y="150" text-anchor="middle" font-size="16" fill="var(--color-navy-800)">Battle Map</text>
                <text x="200" y="170" text-anchor="middle" font-size="12" fill="var(--color-navy-600)">Detailed map not available</text>
            </g>
        </svg>
    `;
}
