import { NpcId, NpcProfile } from '../types/game';

export const NPC_PROFILES: Record<NpcId, NpcProfile> = {
  harriet_tubman: {
    id: 'harriet_tubman',
    name: 'Harriet Tubman',
    lifespan: 'c. 1822 – 1913',
    role: 'Conductor ("Moses") · Dorchester & St. Catharines',
    stationLabel: 'Choptank Marsh & Niagara Frontier',
    biography:
      'Born Araminta Ross in Dorchester County, Maryland, Tubman escaped slavery in 1849 and returned south roughly thirteen times to guide over seventy enslaved people to freedom. Traveling in late autumn and winter for longer nights, she enforced strict discipline—carrying a pistol to defend against slave catchers and prevent frightened travelers from turning back and compromising the network.',
    historicalQuote:
      '"I never ran my train off the track, and I never lost a passenger."',
  },
  thomas_garrett: {
    id: 'thomas_garrett',
    name: 'Thomas Garrett',
    lifespan: '1789 – 1871',
    role: 'Quaker Stationmaster · Wilmington, Delaware',
    stationLabel: '227 Shipley Street, Wilmington',
    biography:
      'A Delaware iron merchant and devout Quaker abolitionist, Thomas Garrett assisted more than 2,700 freedom seekers over four decades. Fined $5,400 by a federal court in 1848—losing nearly his entire fortune—Garrett declared in open court that he would shelter even more fugitives. He insisted on strict Quaker nonviolence while supplying shoes, forged passes, and wagons.',
    historicalQuote:
      '"Judge, thou hast left me not a dollar, but I say to thee if anyone knows a fugitive who needs shelter, send him to Thomas Garrett."',
  },
  william_still: {
    id: 'william_still',
    name: 'William Still',
    lifespan: '1821 – 1902',
    role: 'Chair, Philadelphia Vigilance Committee',
    stationLabel: '107 North Fifth Street, Philadelphia',
    biography:
      'Born free in New Jersey to parents who had escaped Maryland, William Still served as clerk of the Pennsylvania Anti-Slavery Society and organized aid for roughly 800 freedom seekers. Defying the risk of federal prosecution under the 1850 Fugitive Slave Act, Still recorded travelers’ true names and lineages in hidden ledgers—reuniting with his own lost brother Peter in 1855.',
    historicalQuote:
      '"The simple truth of the Underground Rail Road is stranger than any fiction, and must be preserved for the generations yet to come."',
  },
  jermain_loguen: {
    id: 'jermain_loguen',
    name: 'Rev. Jermain Wesley Loguen',
    lifespan: '1813 – 1872',
    role: 'Stationmaster · Syracuse Vigilance Committee',
    stationLabel: '293 East Genesee Street, Syracuse',
    biography:
      'Self-emancipated from Tennessee in 1834, Loguen became an AME Zion minister and central leader of the Syracuse Underground Railroad, aiding over 1,500 freedom seekers. After helping lead the famous 1851 Jerry Rescue, Loguen openly defied slaveholders in print and turned Syracuse into one of the North’s fiercest bastions of communal defense.',
    historicalQuote:
      '"I will not live a slave, and if force is employed to re-enslave me, I shall make preparations to meet the crisis as becomes a man."',
  },
  frederick_douglass: {
    id: 'frederick_douglass',
    name: 'Frederick Douglass',
    lifespan: '1818 – 1895',
    role: 'Editor of The North Star · Rochester Stationmaster',
    stationLabel: 'South Avenue, Rochester, NY',
    biography:
      'Having escaped Maryland’s Eastern Shore himself in 1838 disguised as a sailor with borrowed Seaman’s Protection papers, Douglass settled in Rochester to publish The North Star. His home served as a major final station before Lake Ontario and Niagara Falls, sheltering up to eleven freedom seekers at once while raising fares for boat and rail passage to Canada.',
    historicalQuote:
      '"The true remedy for the Fugitive Slave Law is a good revolver, a steady hand, and a determination to shoot down any man attempting to kidnap."',
  },
};
