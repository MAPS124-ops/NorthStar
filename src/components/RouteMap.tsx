import React, { useState } from 'react';
import { NPC_PROFILES } from '../data/npcs';
import { MAP_STATIONS } from '../data/storyNodes';
import { MapStation, PlayerInventory, StationId } from '../types/game';

interface RouteMapProps {
  currentStationId: StationId;
  visitedStations: StationId[];
  inventory: PlayerInventory;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  currentStationId,
  visitedStations,
  inventory,
}) => {
  const [inspectedId, setInspectedId] = useState<StationId>(currentStationId);

  const activeStation: MapStation =
    MAP_STATIONS.find((s) => s.id === inspectedId) ||
    MAP_STATIONS.find((s) => s.id === currentStationId) ||
    MAP_STATIONS[0];

  const currentIdx = MAP_STATIONS.findIndex((s) => s.id === currentStationId);

  React.useEffect(() => {
    setInspectedId(currentStationId);
  }, [currentStationId]);

  const pathD = MAP_STATIONS.map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${s.x} ${s.y}`).join(' ');
  const visitedPathPoints = MAP_STATIONS.slice(0, Math.max(1, currentIdx + 1))
    .map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${s.x} ${s.y}`)
    .join(' ');

  return (
    <aside className="flex flex-col gap-4 bg-[#121821] border border-[#E2D5B9]/12 rounded-lg p-4 sm:p-5 h-full">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-base font-semibold text-[#F6EBD4]">
          Eastern Corridor, 1854
        </h2>
        <span className="text-xs font-mono-tabular text-[#A99C82]">
          {visitedStations.length} / {MAP_STATIONS.length} Stations
        </span>
      </div>

      {/* Cartographic SVG Map */}
      <div className="relative w-full rounded-md overflow-hidden border border-[#E2D5B9]/10 bg-[#0B1017]">
        <svg
          viewBox="0 0 380 480"
          className="w-full h-auto block select-none"
          role="img"
          aria-label="Map of the Eastern Underground Railroad corridor from Dorchester County, Maryland to St. Catharines, Canada West"
        >
          <defs>
            <pattern id="mapGrid" width="38" height="38" patternUnits="userSpaceOnUse">
              <path
                d="M 38 0 L 0 0 0 38"
                fill="none"
                stroke="#E2D5B9"
                strokeOpacity="0.045"
                strokeWidth="0.75"
              />
            </pattern>
            <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D99B38" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#D99B38" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="380" height="480" fill="url(#mapGrid)" />

          {/* Great Lakes (Lake Ontario & Erie silhouettes) */}
          <path
            d="M 10 112 Q 65 92 135 110 Q 175 118 168 134 Q 120 142 52 136 Q 22 134 10 122 Z"
            fill="#172434"
            stroke="#517294"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <path
            d="M 8 158 Q 50 156 82 178 Q 52 212 8 220 Z"
            fill="#172434"
            stroke="#517294"
            strokeOpacity="0.25"
            strokeWidth="1"
          />

          {/* Chesapeake Bay & Atlantic coastline stylized contours */}
          <path
            d="M 205 468 Q 214 432 204 405 Q 218 378 232 356 Q 248 395 238 468 Z"
            fill="#172434"
            stroke="#517294"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <path
            d="M 304 468 Q 308 380 288 320 Q 320 265 352 224 L 380 224 L 380 468 Z"
            fill="#14202D"
            stroke="#517294"
            strokeOpacity="0.2"
            strokeWidth="1"
          />

          {/* Major Rivers */}
          <path
            d="M 284 345 Q 292 292 308 242"
            fill="none"
            stroke="#3C5875"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <path
            d="M 332 236 Q 324 195 318 148"
            fill="none"
            stroke="#3C5875"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />

          {/* British North America / US Border */}
          <path
            d="M 18 104 Q 78 132 108 134 Q 168 124 235 92 L 350 74"
            fill="none"
            stroke="#73B58E"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x="24"
            y="84"
            fill="#73B58E"
            fillOpacity="0.72"
            fontSize="9"
            fontFamily="IBM Plex Mono, monospace"
          >
            CANADA WEST (BRITISH SOIL)
          </text>

          {/* Mason-Dixon Line */}
          <line
            x1="120"
            y1="306"
            x2="288"
            y2="306"
            stroke="#C85A4A"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x="122"
            y="300"
            fill="#C85A4A"
            fillOpacity="0.7"
            fontSize="8.5"
            fontFamily="IBM Plex Mono, monospace"
          >
            MASON-DIXON LINE
          </text>

          {/* State Labels */}
          <text x="148" y="422" fill="#A99C82" fillOpacity="0.45" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">
            MARYLAND
          </text>
          <text x="275" y="366" fill="#A99C82" fillOpacity="0.45" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">
            DELAWARE
          </text>
          <text x="165" y="252" fill="#A99C82" fillOpacity="0.45" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">
            PENNSYLVANIA
          </text>
          <text x="210" y="198" fill="#A99C82" fillOpacity="0.45" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">
            NEW YORK
          </text>

          {/* North Star Compass Rose */}
          <g transform="translate(332, 42)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#D99B38" strokeOpacity="0.3" strokeWidth="0.9" />
            <path
              d="M 0 -16 L 2.5 -2.5 L 16 0 L 2.5 2.5 L 0 16 L -2.5 2.5 L -16 0 L -2.5 -2.5 Z"
              fill="#D99B38"
              fillOpacity="0.85"
            />
            <text
              x="0"
              y="29"
              textAnchor="middle"
              fill="#D99B38"
              fontSize="8.5"
              fontFamily="IBM Plex Mono, monospace"
            >
              NORTH STAR
            </text>
          </g>

          {/* Planned / Remaining Corridor Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#E2D5B9"
            strokeOpacity="0.22"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Traveled Corridor Path */}
          <path
            d={visitedPathPoints}
            fill="none"
            stroke="#D99B38"
            strokeOpacity="0.88"
            strokeWidth="2.2"
          />

          {/* Stations */}
          {MAP_STATIONS.map((station) => {
            const isCurrent = station.id === currentStationId;
            const isVisited = visitedStations.includes(station.id);
            const isInspected = station.id === activeStation.id;
            const labelLeft = station.x > 240;

            return (
              <g
                key={station.id}
                onClick={() => setInspectedId(station.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setInspectedId(station.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${station.name}, ${station.region}`}
                className="cursor-pointer focus:outline-none"
              >
                {isCurrent && (
                  <circle cx={station.x} cy={station.y} r="18" fill="url(#lanternGlow)" />
                )}
                {isInspected && !isCurrent && (
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r="9"
                    fill="none"
                    stroke="#EDE3CE"
                    strokeOpacity="0.55"
                    strokeWidth="1"
                  />
                )}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isCurrent ? 5.5 : isVisited ? 4 : 3}
                  fill={
                    isCurrent
                      ? '#D99B38'
                      : isVisited
                        ? '#EDE3CE'
                        : '#253141'
                  }
                  stroke={isCurrent ? '#F6EBD4' : isVisited ? '#D99B38' : '#64748B'}
                  strokeWidth="1.5"
                />
                <text
                  x={labelLeft ? station.x - 10 : station.x + 10}
                  y={station.y + 3}
                  textAnchor={labelLeft ? 'end' : 'start'}
                  fill={isCurrent ? '#F6EBD4' : isVisited ? '#D5C9B1' : '#7D899B'}
                  fontSize={isCurrent ? '10.5' : '9.5'}
                  fontWeight={isCurrent ? '600' : '400'}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {station.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Station Detail */}
      <div className="border-t border-[#E2D5B9]/10 pt-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F6EBD4]">{activeStation.name}</span>
          <span className="text-[#A99C82] font-mono-tabular">{activeStation.region}</span>
        </div>
        <p className="text-xs text-[#C4B79C] leading-relaxed">
          {activeStation.historicalRole}
        </p>
      </div>

      {/* Satchel & Unlocked Rewards */}
      <div className="border-t border-[#E2D5B9]/10 pt-3 space-y-3 mt-auto">
        <div className="space-y-2">
          <div className="text-xs font-medium text-[#A99C82]">
            Satchel &amp; Supplies
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-[#A99C82]">Companion</dt>
              <dd className="text-[#EDE3CE] font-medium">
                {inventory.travelingWithClara ? 'Sister Clara' : 'Solo'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#A99C82]">Rations</dt>
              <dd className="text-[#EDE3CE] font-mono-tabular">{inventory.rations}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#A99C82]">Silver Coins</dt>
              <dd className="text-[#EDE3CE] font-mono-tabular">{inventory.silverCoins}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#A99C82]">Papers</dt>
              <dd className="text-[#EDE3CE] font-medium">
                {inventory.forgedPass ? 'Forged Pass' : 'None'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#A99C82]">Self-Defense</dt>
              <dd className="text-[#EDE3CE] font-medium">
                {inventory.armedDefense ? 'Armed' : 'Unarmed'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#A99C82]">Credentials</dt>
              <dd className="text-[#EDE3CE] font-medium">
                {inventory.douglassLetter
                  ? 'Douglass Letter'
                  : inventory.stillReceipt
                    ? 'Still Cipher'
                    : inventory.tubmanGuidance
                      ? 'Tubman Token'
                      : 'None'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Trusted Allies & Safer Routes Earned */}
        {(inventory.trustedAllies.length > 0 || inventory.saferRoutesUnlocked.length > 0) && (
          <div className="border-t border-[#E2D5B9]/10 pt-2.5 space-y-1.5 text-xs">
            {inventory.trustedAllies.length > 0 && (
              <div>
                <span className="text-[#A99C82]">Trusted Allies: </span>
                <span className="text-[#73B58E] font-medium">
                  {inventory.trustedAllies.map((id) => NPC_PROFILES[id].name).join(' · ')}
                </span>
              </div>
            )}
            {inventory.saferRoutesUnlocked.length > 0 && (
              <div>
                <span className="text-[#A99C82]">Safer Routes: </span>
                <span className="text-[#D99B38] font-medium">
                  {inventory.saferRoutesUnlocked.join(' · ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
