
const datePicker = document.getElementById('date-picker');
const matchesContainer = document.getElementById('matches-container');
const messageDisplay = document.getElementById('message-display');
const leagueFilter = document.getElementById('league-filter');
const prevDayBtn = document.getElementById('prev-day-btn');
const nextDayBtn = document.getElementById('next-day-btn');
const setupModal = document.getElementById('setup-modal');
const savePreferencesBtn = document.getElementById('save-preferences-btn');
const favLeaguesList = document.getElementById('favorite-leagues-list');
const favTeamsList = document.getElementById('favorite-teams-list');
const liveFilterBtn = document.getElementById('live-filter-btn');

// --- عناصر جدول الترتيب الجديدة ---
const standingsModal = document.getElementById('standings-modal');
const standingsTableBody = document.getElementById('standings-table-body');
const standingsLeagueName = document.getElementById('standings-league-name');

// --- عناصر نموذج تفاصيل المباراة الجديدة ---
const matchDetailsModal = document.getElementById('match-details-modal');
const detailsHeader = document.getElementById('details-header');
const detailsEvents = document.getElementById('details-events');
const detailsLineupsContainer = document.getElementById('details-lineups-container');
const matchDetailsTitle = document.getElementById('match-details-title');

const API_URL = 'dna.php'; 
let allMatchesData = [];
let showOnlyLive = false;
const priorityOrder = [1, 4, 9, 21, 8, 2, 3, 39, 140, 135, 78, 61, 45, 528, 143, 137, 81, 848, 203, 10];

// ****** القوائم الثابتة لفرق الدوريات الكبرى ******
const PREMIER_LEAGUE_TEAMS = [
    { id: 42, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
    { id: 44, name: 'Aston Villa', logo: 'https://media.api-sports.io/football/teams/44.png' },
    { id: 35, name: 'Bournemouth', logo: 'https://media.api-sports.io/football/teams/35.png' },
    { id: 47, name: 'Brentford', logo: 'https://media.api-sports.io/football/teams/47.png' },
    { id: 55, name: 'Brighton', logo: 'https://media.api-sports.io/football/teams/55.png' },
    { id: 41, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/41.png' },
    { id: 52, name: 'Crystal Palace', logo: 'https://media.api-sports.io/football/teams/52.png' },
    { id: 45, name: 'Everton', logo: 'https://media.api-sports.io/football/teams/45.png' },
    { id: 36, name: 'Fulham', logo: 'https://media.api-sports.io/football/teams/36.png' },
    { id: 63, name: 'Ipswich Town', logo: 'https://media.api-sports.io/football/teams/63.png' },
    { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
    { id: 50, name: 'Luton Town', logo: 'https://media.api-sports.io/football/teams/50.png' }, 
    { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
    { id: 49, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/49.png' },
    { id: 34, name: 'Newcastle', logo: 'https://media.api-sports.io/football/teams/34.png' },
    { id: 48, name: 'Nottingham Forest', logo: 'https://media.api-sports.io/football/teams/48.png' },
    { id: 46, name: 'Southampton', logo: 'https://media.api-sports.io/football/teams/46.png' }, 
    { id: 39, name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/39.png' },
    { id: 51, name: 'West Ham', logo: 'https://media.api-sports.io/football/teams/51.png' },
    { id: 66, name: 'Wolves', logo: 'https://media.api-sports.io/football/teams/66.png' },
];
const BUNDESLIGA_TEAMS = [
    { id: 173, name: 'Augsburg', logo: 'https://media.api-sports.io/football/teams/173.png' },
    { id: 165, name: 'Bayer Leverkusen', logo: 'https://media.api-sports.io/football/teams/165.png' },
    { id: 157, name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png' },
    { id: 167, name: 'Bochum', logo: 'https://media.api-sports.io/football/teams/167.png' },
    { id: 182, name: 'Borussia Dortmund', logo: 'https://media.api-sports.io/football/teams/182.png' },
    { id: 163, name: 'Eintract Frankfurt', logo: 'https://media.api-sports.io/football/teams/163.png' },
    { id: 170, name: 'Freiburg', logo: 'https://media.api-sports.io/football/teams/170.png' },
    { id: 168, name: 'Heidenheim', logo: 'https://media.api-sports.io/football/teams/168.png' },
    { id: 164, name: 'Hoffenheim', logo: 'https://media.api-sports.io/football/teams/164.png' },
    { id: 169, name: 'Koln', logo: 'https://media.api-sports.io/football/teams/169.png' },
    { id: 192, name: 'Leipzig', logo: 'https://media.api-sports.io/football/teams/192.png' },
    { id: 172, name: 'Mainz 05', logo: 'https://media.api-sports.io/football/teams/172.png' },
    { id: 175, name: 'Monchengladbach', logo: 'https://media.api-sports.io/football/teams/175.png' },
    { id: 188, name: 'Union Berlin', logo: 'https://media.api-sports.io/football/teams/188.png' },
    { id: 171, name: 'Stuttgart', logo: 'https://media.api-sports.io/football/teams/171.png' },
    { id: 174, name: 'Werder Bremen', logo: 'https://media.api-sports.io/football/teams/174.png' },
    { id: 187, name: 'Wolfsburg', logo: 'https://media.api-sports.io/football/teams/187.png' },
    { id: 161, name: 'Schalke 04', logo: 'https://media.api-sports.io/football/teams/161.png' }, 
];
const LIGUE_1_TEAMS = [
    { id: 85, name: 'Angers', logo: 'https://media.api-sports.io/football/teams/85.png' }, 
    { id: 83, name: 'Brest', logo: 'https://media.api-sports.io/football/teams/83.png' },
    { id: 106, name: 'Clermont Foot', logo: 'https://media.api-sports.io/football/teams/106.png' }, 
    { id: 82, name: 'Dijon', logo: 'https://media.api-sports.io/football/teams/82.png' }, 
    { id: 110, name: 'Le Havre', logo: 'https://media.api-sports.io/football/teams/110.png' }, 
    { id: 96, name: 'Lens', logo: 'https://media.api-sports.io/football/teams/96.png' },
    { id: 79, name: 'Lille', logo: 'https://media.api-sports.io/football/teams/79.png' },
    { id: 80, name: 'Lorient', logo: 'https://media.api-sports.io/football/teams/80.png' },
    { id: 98, name: 'Lyon', logo: 'https://media.api-sports.io/football/teams/98.png' },
    { id: 93, name: 'Marseille', logo: 'https://media.api-sports.io/football/teams/93.png' },
    { id: 84, name: 'Metz', logo: 'https://media.api-sports.io/football/teams/84.png' },
    { id: 87, name: 'Monaco', logo: 'https://media.api-sports.io/football/teams/87.png' },
    { id: 97, name: 'Montpellier', logo: 'https://media.api-sports.io/football/teams/97.png' },
    { id: 92, name: 'Nantes', logo: 'https://media.api-sports.io/football/teams/92.png' },
    { id: 81, name: 'Nice', logo: 'https://media.api-sports.io/football/teams/81.png' },
    { id: 86, name: 'Paris Saint Germain', logo: 'https://media.api-sports.io/football/teams/86.png' },
    { id: 95, name: 'Reims', logo: 'https://media.api-sports.io/football/teams/95.png' },
    { id: 89, name: 'Rennes', logo: 'https://media.api-sports.io/football/teams/89.png' },
    { id: 91, name: 'Strasbourg', logo: 'https://media.api-sports.io/football/teams/91.png' },
    { id: 108, name: 'Toulouse', logo: 'https://media.api-sports.io/football/teams/108.png' },
];
const LA_LIGA_TEAMS = [
    { id: 533, name: 'Athletic Club', logo: 'https://media.api-sports.io/football/teams/533.png' },
    { id: 530, name: 'Atletico Madrid', logo: 'https://media.api-sports.io/football/teams/530.png' },
    { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
    { id: 728, name: 'Cádiz', logo: 'https://media.api-sports.io/football/teams/728.png' },
    { id: 531, name: 'Celta Vigo', logo: 'https://media.api-sports.io/football/teams/531.png' },
    { id: 797, name: 'Deportivo Alaves', logo: 'https://media.api-sports.io/football/teams/797.png' },
    { id: 539, name: 'Getafe', logo: 'https://media.api-sports.io/football/teams/539.png' },
    { id: 541, name: 'Girona', logo: 'https://media.api-sports.io/football/teams/541.png' },
    { id: 544, name: 'Granada CF', logo: 'https://media.api-sports.io/football/teams/544.png' },
    { id: 537, name: 'Las Palmas', logo: 'https://media.api-sports.io/football/teams/537.png' },
    { id: 540, name: 'Mallorca', logo: 'https://media.api-sports.io/football/teams/540.png' },
    { id: 720, name: 'Osasuna', logo: 'https://media.api-sports.io/football/teams/720.png' },
    { id: 548, name: 'Rayo Vallecano', logo: 'https://media.api-sports.io/football/teams/548.png' },
    { id: 543, name: 'Real Betis', logo: 'https://media.api-sports.io/football/teams/543.png' },
    { id: 547, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/547.png' },
    { id: 549, name: 'Real Sociedad', logo: 'https://media.api-sports.io/football/teams/549.png' },
    { id: 532, name: 'Sevilla', logo: 'https://media.api-sports.io/football/teams/532.png' },
    { id: 715, name: 'Valencia', logo: 'https://media.api-sports.io/football/teams/715.png' },
    { id: 538, name: 'Villarreal', logo: 'https://media.api-sports.io/football/teams/538.png' },
    { id: 542, name: 'Almería', logo: 'https://media.api-sports.io/football/teams/542.png' },
];
// ***************************************************************

// --- PREFERENCES ---
function showSetupModal() { populateSetupLists(); setupModal.classList.remove('hidden'); }
function savePreferences() {
    const selectedLeagues = Array.from(favLeaguesList.querySelectorAll('input:checked')).map(el => el.value);
    const selectedTeams = Array.from(favTeamsList.querySelectorAll('input:checked')).map(el => el.value);
    localStorage.setItem('kooralist_prefs', JSON.stringify({ leagues: selectedLeagues, teams: selectedTeams, setupComplete: true }));
    setupModal.classList.add('hidden');
    fetchMatches(datePicker.value);
}
function populateSetupLists() {
    const majorLeagues = [{ id: 39, name: 'Premier League' }, { id: 140, name: 'La Liga' }, { id: 135, name: 'Serie A' }];
    const majorTeams = [{ id: 33, name: 'Man United' }, { id: 40, name: 'Liverpool' }, { id: 529, name: 'Barcelona' }];
    favLeaguesList.innerHTML = majorLeagues.map(l => `
        <label class="flex items-center gap-2 bg-slate-700/50 p-2 rounded-md cursor-pointer hover:bg-slate-700">
            <input type="checkbox" value="${l.id}" class="form-checkbox h-5 w-5 rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-emerald-600">
            <span class="text-sm">${l.name}</span>
        </label>`).join('');
    favTeamsList.innerHTML = majorTeams.map(t => `
        <label class="flex items-center gap-2 bg-slate-700/50 p-2 rounded-md cursor-pointer hover:bg-slate-700">
            <input type="checkbox" value="${t.id}" class="form-checkbox h-5 w-5 rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-emerald-600">
            <span class="text-sm">${t.name}</span>
        </label>`).join('');
}

// --- RENDERING FIXTURES ---
function renderFixtures(data) {
    matchesContainer.innerHTML = '';
    const selectedLeagueId = leagueFilter.value;
    const liveStatuses = ['1H','HT','2H','ET','P'];
    let filteredMatches = showOnlyLive ? data.filter(m => liveStatuses.includes(m.fixture.status.short)) : data;
    if (selectedLeagueId !== 'all') filteredMatches = filteredMatches.filter(m => m.league.id == selectedLeagueId);
    if (filteredMatches.length === 0) { messageDisplay.textContent = 'لا توجد مباريات تطابق الفلتر.'; messageDisplay.classList.remove('hidden'); return; }
    messageDisplay.classList.add('hidden');

    const leaguesMap = new Map();
    filteredMatches.forEach(match => {
        const leagueId = match.league.id;
        if (!leaguesMap.has(leagueId)) leaguesMap.set(leagueId, { leagueInfo: match.league, matches: [] });
        leaguesMap.get(leagueId).matches.push(match);
    });

    const prefs = JSON.parse(localStorage.getItem('kooralist_prefs')) || { leagues: [], teams: [] };
    const sortedLeagues = Array.from(leaguesMap.values()).sort((a,b) => {
        const aIsFav = prefs.leagues.includes(a.leagueInfo.id.toString());
        const bIsFav = prefs.leagues.includes(b.leagueInfo.id.toString());
        if(aIsFav && !bIsFav) return -1; if(!aIsFav && bIsFav) return 1;
        const aPrio = priorityOrder.indexOf(a.leagueInfo.id); const bPrio = priorityOrder.indexOf(b.leagueInfo.id);
        if(aPrio!==-1 && bPrio!==-1) return aPrio-bPrio; if(aPrio!==-1) return -1; if(bPrio!==-1) return 1;
        return a.leagueInfo.name.localeCompare(b.leagueInfo.name);
    });

    sortedLeagues.forEach(leagueGroup => {
        const leagueId = leagueGroup.leagueInfo.id; 
        const leagueContainer = document.createElement('div');
        leagueContainer.className = 'bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden';
        
        leagueContainer.innerHTML = `
            <div id="league-header-${leagueId}" class="bg-slate-900/70 px-4 py-3 border-b border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-900/90 transition-colors">
                <img src="${leagueGroup.leagueInfo.logo}" alt="${leagueGroup.leagueInfo.name}" class="w-6 h-6 object-contain" onerror="this.style.display='none'">
                <h2 class="text-lg font-bold text-slate-200">${leagueGroup.leagueInfo.name}</h2>
            </div>
            <div class="divide-y divide-slate-800">
                ${leagueGroup.matches.map(match => renderMatch(match, leagueId)).join('')}
            </div>`;
        
        matchesContainer.appendChild(leagueContainer);

        const leagueHeader = document.getElementById(`league-header-${leagueId}`);
        leagueHeader.addEventListener('click', () => {
            
            let teamsToDisplay;

            if (leagueId == 39) { teamsToDisplay = PREMIER_LEAGUE_TEAMS; } 
            else if (leagueId == 78) { teamsToDisplay = BUNDESLIGA_TEAMS; } 
            else if (leagueId == 61) { teamsToDisplay = LIGUE_1_TEAMS; } 
            else if (leagueId == 140) { teamsToDisplay = LA_LIGA_TEAMS; } 
            else {
                const allTeamsInLeague = [];
                leagueGroup.matches.forEach(match => {
                    if (!allTeamsInLeague.some(t => t.id === match.teams.home.id)) { allTeamsInLeague.push(match.teams.home); }
                    if (!allTeamsInLeague.some(t => t.id === match.teams.away.id)) { allTeamsInLeague.push(match.teams.away); }
                });
                teamsToDisplay = allTeamsInLeague;
            }

            displayLocalStandings(leagueId, leagueGroup.leagueInfo.name, teamsToDisplay);
        });
    });
}

function renderMatch(match, leagueId) {
    const { fixture, teams, goals } = match;
    const timeString = new Date(fixture.date).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false });
    let statusHTML = '';
    switch(fixture.status.short){
        case 'NS': statusHTML = `<div class="text-lg font-bold text-slate-300">${timeString}</div>`; break;
        case '1H': case 'HT': case '2H': case 'ET': case 'P':
            statusHTML = `<div class="text-center"><div class="text-lg font-bold text-emerald-400">${goals.home ?? 0} - ${goals.away ?? 0}</div><div class="text-xs text-emerald-500 animate-pulse">Live ${fixture.status.elapsed}'</div></div>`; break;
        case 'FT': case 'AET': case 'PEN':
            statusHTML = `<div class="text-center"><div class="text-lg font-bold">${goals.home} - ${goals.away}</div><div class="text-xs text-slate-500">Finished</div></div>`; break;
        default: statusHTML = `<div class="text-sm text-slate-400">${fixture.status.long}</div>`;
    }
    // تم الإبقاء على onclick
    return `<div class="flex items-center justify-between p-4 match-card transition-colors duration-200 cursor-pointer" onclick="showMatchDetails(${fixture.id}, ${leagueId})">
        <div class="flex items-center gap-3 w-2/5 justify-end"><span class="text-base md:text-lg font-semibold text-right flex-1">${teams.home.name}</span><img src="${teams.home.logo}" alt="${teams.home.name}" class="w-8 h-8 object-contain"></div>
        <div class="w-1/5 text-center">${statusHTML}</div>
        <div class="flex items-center gap-3 w-2/5"><img src="${teams.away.logo}" alt="${teams.away.name}" class="w-8 h-8 object-contain"><span class="text-base md:text-lg font-semibold text-left flex-1">${teams.away.name}</span></div>
    </div>`;
}

// --- DISPLAY LOCAL STANDINGS (الحل البديل للترتيب) ---
function displayLocalStandings(leagueId, leagueName, teamsList) {
    standingsTableBody.innerHTML = '';
    standingsLeagueName.textContent = leagueName;
    standingsModal.classList.remove('hidden');
    
    const sortedTeams = teamsList.sort((a, b) => a.name.localeCompare(b.name));

    if (sortedTeams.length > 0) {
        standingsTableBody.innerHTML = sortedTeams.map((team, index) => {
            const emptyStats = `<td class="text-center text-sm p-2">-</td>`;
            return `
                <tr class="hover:bg-slate-700/50 transition-colors duration-150 border-b border-slate-700">
                    <td class="text-center text-sm font-bold p-2">${index + 1}</td>
                    <td class="flex items-center gap-2 p-2">
                        <img src="${team.logo}" alt="${team.name}" class="w-6 h-6 object-contain">
                        <span class="text-sm font-semibold">${team.name}</span>
                    </td>
                    ${emptyStats} ${emptyStats} ${emptyStats} ${emptyStats} ${emptyStats} ${emptyStats} ${emptyStats} <td class="text-center text-sm font-bold text-lg p-2 bg-emerald-700/30">-</td> </tr>
            `;
        }).join('');
    } else {
        standingsTableBody.innerHTML = '<tr><td colspan="10" class="text-center p-4">لم يتم العثور على بيانات فرق لهذا الدوري اليوم.</td></tr>';
    }
}
// ----------------------------------------------------

function updateLeagueFilter(data) {
    if(!data) return;
    const leaguesInView = [...new Map(data.map(m=>[m.league.id,m.league])).values()];
    leaguesInView.sort((a,b)=>{
        const aPrio = priorityOrder.indexOf(a.id); const bPrio = priorityOrder.indexOf(b.id);
        if(aPrio!==-1 && bPrio!==-1) return aPrio-bPrio; if(aPrio!==-1) return -1; if(bPrio!==-1) return 1;
        return a.name.localeCompare(b.name);
    });
    const currentVal = leagueFilter.value;
    leagueFilter.innerHTML = '<option value="all">كل الدوريات</option>';
    leaguesInView.forEach(league => { leagueFilter.innerHTML += `<option value="${league.id}">${league.name}</option>`; });
    leagueFilter.value = currentVal;
}

// --- FETCH MATCHES ---
async function fetchMatches(date){
    matchesContainer.innerHTML = `<div class="text-center text-slate-400 p-8">جاري تحميل المباريات...</div>`;
    try{
        const response = await fetch(`${API_URL}?type=fixtures&date=${date}`);
        if(!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        allMatchesData = data.response || [];
        renderFixtures(allMatchesData);
        updateLeagueFilter(allMatchesData);
    } catch(error){
        console.error(error);
        matchesContainer.innerHTML='';
        messageDisplay.textContent=`حدث خطأ: ${error.message}`;
        messageDisplay.classList.remove('hidden');
    }
}


// ****** الدالة المساعدة الجديدة لحل مشكلة عدم العثور على البيانات الأساسية ******
function getBaseFixtureData(details) {
    // 1. محاولة استخراجها من الـ events (الأكثر ترجيحاً)
    if (details.events && details.events.response && details.events.response.length > 0) {
        return details.events.response[0];
    }
    // 2. محاولة استخراجها من الـ statistics
    if (details.statistics && details.statistics.response && details.statistics.response.length > 0) {
        // نستخدم العنصر الأول من الـ statistics
        return details.statistics.response[0]; 
    }
    // 3. محاولة استخراجها من الـ lineups 
    if (details.lineups && details.lineups.response && details.lineups.response.length > 0) {
        const lineup = details.lineups.response[0];
        // يجب إضافة goals و league يدوياً إن لم تكن موجودة في Lineup response
        // نفترض أن fixture و teams موجودة
        return {
            fixture: lineup.fixture,
            league: lineup.league || { name: 'N/A', logo: '' },
            teams: lineup.teams,
            goals: { home: 'N/A', away: 'N/A' } // إضافة قيم وهمية لتجنب الانهيار
        };
    }
    return null;
}
// ***************************************************************


// --- MATCH DETAILS FUNCTIONS (مُحدثة) ---
async function showMatchDetails(fixtureId, leagueId) {
    matchDetailsModal.classList.remove('hidden');
    
    detailsHeader.innerHTML = `<div class="text-slate-400">جاري تحميل تفاصيل المباراة...</div>`;
    detailsEvents.innerHTML = `<p class="text-slate-400 text-center p-4">جاري تحميل الهدافين والأحداث...</p>`;
    detailsLineupsContainer.innerHTML = `<p class="text-slate-400 text-center col-span-2 p-4">جاري تحميل التشكيلات والمدربين...</p>`;
    matchDetailsTitle.textContent = 'تفاصيل المباراة';

    try {
        const response = await fetch(`${API_URL}?type=match_details&fixture_id=${fixtureId}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        
        if (!data.response || Object.keys(data.response).length === 0) {
             throw new Error('لم يتم العثور على بيانات تفصيلية لهذه المباراة.');
        }

        const details = data.response;
        
        // ****** استخدام الدالة المساعدة الجديدة ******
        const baseFixtureData = getBaseFixtureData(details);

        if (!baseFixtureData) {
            throw new Error('لم يتم العثور على البيانات الأساسية للمباراة (النتائج والحالة).');
        }
        
        // 1. عرض العنوان والنتيجة والحالة
        renderDetailsHeader(baseFixtureData); // نمرر البيانات الأساسية مباشرةً
        
        // 2. عرض الهدافين والأحداث
        renderEvents(details.events.response);

        // 3. عرض التشكيلات والمدربين
        renderLineups(details.lineups.response);

    } catch (error) {
        console.error('Error fetching match details:', error);
        detailsHeader.innerHTML = `<div class="text-red-400 text-center">عذراً، حدث خطأ في تحميل التفاصيل: ${error.message}</div>`;
        detailsEvents.innerHTML = '';
        detailsLineupsContainer.innerHTML = '';
    }
}

/**
 * يعرض النتائج والحالة في رأس النموذج (مُحدثة)
 * @param {object} matchData - بيانات المباراة الأساسية (fixture, teams, goals)
 */
function renderDetailsHeader(matchData) {
    // التحقق المباشر من الخصائص المطلوبة
    if (!matchData || !matchData.fixture || !matchData.teams) {
        detailsHeader.innerHTML = `<div class="text-slate-400">لم يتم العثور على بيانات المباراة الأساسية (Fixture).</div>`;
        return;
    }

    const { league, fixture, teams } = matchData;
    // إضافة معالج للـ Goals في حال كانت مفقودة (كما يحدث عند جلبها من lineups)
    const goals = matchData.goals || { home: 'N/A', away: 'N/A' }; 

    // هنا يتم قراءة status بعد التأكد من وجود fixture
    const status = fixture.status.long; 
    const homeScore = goals.home ?? '0';
    const awayScore = goals.away ?? '0';
    const elapsed = fixture.status.elapsed ?? '';
    const timeDisplay = ['1H','HT','2H','ET','P'].includes(fixture.status.short) ? 
                        `<span class="text-emerald-400 animate-pulse">مباشر ${elapsed}'</span>` : 
                        `<span class="text-slate-400">${status}</span>`;

    matchDetailsTitle.textContent = `${teams.home.name} vs ${teams.away.name} | ${league.name}`;

    detailsHeader.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex flex-col items-center w-1/3">
                <img src="${teams.home.logo}" alt="${teams.home.name}" class="w-12 h-12 mb-1 object-contain">
                <span class="text-lg font-bold">${teams.home.name}</span>
            </div>
            
            <div class="w-1/3 text-center">
                <div class="text-4xl font-extrabold text-white">${homeScore} - ${awayScore}</div>
                <div class="text-sm mt-1">${timeDisplay}</div>
            </div>
            
            <div class="flex flex-col items-center w-1/3">
                <img src="${teams.away.logo}" alt="${teams.away.name}" class="w-12 h-12 mb-1 object-contain">
                <span class="text-lg font-bold">${teams.away.name}</span>
            </div>
        </div>
    `;
}

/**
 * يعرض قائمة الهدافين والأحداث الرئيسية
 * @param {array} events - قائمة الأحداث
 */
function renderEvents(events) {
    if (!events || events.length === 0) {
        detailsEvents.innerHTML = `<p class="text-slate-400 text-center p-4">لا توجد أحداث رئيسية مسجلة بعد.</p>`;
        return;
    }

    const filteredEvents = events.filter(e => e.type === 'Goal' || e.type === 'Card' || e.type === 'Subst');

    if (filteredEvents.length === 0) {
        detailsEvents.innerHTML = `<p class="text-slate-400 text-center p-4">لم تُسجل أهداف، بطاقات، أو تبديلات حتى الآن.</p>`;
        return;
    }

    // نحصل على ID الفريق المضيف من أول حدث لتحديد الجانب، ونضيف تحققا
    const homeTeamId = filteredEvents[0]?.teams?.home?.id; 

    detailsEvents.innerHTML = filteredEvents.map(event => {
        const playerName = event.player.name;
        const assistName = event.assist?.name ? `(بمساعدة: ${event.assist.name})` : '';
        const time = event.time.elapsed;
        let eventIcon = '';
        let detailsText = '';

        if (event.type === 'Goal') {
            eventIcon = '⚽';
            detailsText = event.detail === 'Own Goal' ? '(هدف عكسي)' : 
                          event.detail === 'Penalty' ? ' (ركلة جزاء)' : '';
        } else if (event.type === 'Card') {
            eventIcon = event.detail === 'Yellow Card' ? '🟨' : '🟥';
        } else if (event.type === 'Subst') {
            eventIcon = '🔁';
            detailsText = `خروج: ${event.assist.name}`; // في حالة التبديل، assist يحمل اسم اللاعب الخارج
        }

        const content = `
            <div class="flex flex-col">
                <span class="font-semibold text-sm">${playerName} ${detailsText}</span>
                ${event.type === 'Goal' && assistName ? `<span class="text-xs text-slate-400">${assistName}</span>` : ''}
            </div>
        `;
        
        const isHomeTeam = event.team.id === homeTeamId;
        
        return `
            <div class="flex p-2 items-center text-sm hover:bg-slate-700/30 transition-colors">
                <div class="w-1/2 flex items-center ${isHomeTeam ? 'justify-end pr-2' : 'hidden'} text-right">
                    ${isHomeTeam ? content : ''}
                </div>

                <div class="w-auto flex items-center justify-center min-w-[100px] gap-1 text-center font-bold text-lg">
                    ${eventIcon} 
                    <span class="text-base text-white">(${time}')</span>
                </div>
                
                <div class="w-1/2 flex items-center ${!isHomeTeam ? 'justify-start pl-2' : 'hidden'} text-left">
                    ${!isHomeTeam ? content : ''}
                </div>
            </div>
        `;

    }).join('');
}


/**
 * يعرض التشكيلات والمدربين
 * @param {array} lineups - قائمة التشكيلات
 */
function renderLineups(lineups) {
    if (!lineups || lineups.length < 2) {
        detailsLineupsContainer.innerHTML = `<p class="text-slate-400 text-center col-span-2 p-4">لم يتم الإعلان عن التشكيلات بعد.</p>`;
        return;
    }

    detailsLineupsContainer.innerHTML = lineups.map(teamLineup => {
        const teamName = teamLineup.team.name;
        const coachName = teamLineup.coach.name;
        const formation = teamLineup.formation;
        
        const startingPlayers = teamLineup.startXI.map(p => p.player);
        const substitutes = teamLineup.substitutes.map(p => p.player);

        return `
            <div class="bg-slate-900/50 p-3 rounded-lg border-t-2 ${teamLineup.team.id === lineups[0].team.id ? 'border-emerald-500' : 'border-cyan-500'}">
                <div class="flex items-center gap-2 mb-3">
                    <img src="${teamLineup.team.logo}" alt="${teamName}" class="w-8 h-8 object-contain">
                    <h4 class="font-bold text-lg">${teamName}</h4>
                </div>
                
                <p class="text-sm font-semibold text-slate-400 mb-2">التشكيل: ${formation || 'غير متوفر'}</p>

                <div class="space-y-4">
                    <div class="bg-slate-700/50 p-2 rounded-md">
                        <h5 class="text-md font-semibold text-emerald-300">الأساسي (XI)</h5>
                        <ul class="list-disc pr-5 mt-1 text-sm space-y-1">
                            ${startingPlayers.map(p => `<li><span class="font-bold text-yellow-300">${p.number}</span> - ${p.name} (${p.pos})</li>`).join('')}
                        </ul>
                    </div>

                    <div class="bg-slate-700/50 p-2 rounded-md">
                        <h5 class="text-md font-semibold text-cyan-300">الاحتياط</h5>
                        <ul class="list-disc pr-5 mt-1 text-sm space-y-1">
                            ${substitutes.length > 0 ? substitutes.map(p => `<li><span class="font-bold text-yellow-300">${p.number}</span> - ${p.name} (${p.pos})</li>`).join('') : '<li>لا يوجد احتياط</li>'}
                        </ul>
                    </div>
                </div>

                <p class="mt-4 text-sm font-semibold border-t border-slate-700 pt-3">المدرب: <span class="text-yellow-400">${coachName}</span></p>
            </div>
        `;
    }).join('');
}


// --- EVENTS ---
function handleDateChange(offset){
    const currentDate = new Date(datePicker.value);
    currentDate.setDate(currentDate.getDate()+offset);
    datePicker.value = currentDate.toISOString().split('T')[0];
    fetchMatches(datePicker.value);
}

datePicker.addEventListener('change', ()=>fetchMatches(datePicker.value));
prevDayBtn.addEventListener('click', ()=>handleDateChange(-1));
nextDayBtn.addEventListener('click', ()=>handleDateChange(1));
leagueFilter.addEventListener('change', ()=>renderFixtures(allMatchesData));
savePreferencesBtn.addEventListener('click', savePreferences);
liveFilterBtn.addEventListener('click', ()=>{
    showOnlyLive = !showOnlyLive;
    liveFilterBtn.classList.toggle('btn-filter-active');
    renderFixtures(allMatchesData);
});

// --- INIT ---
function initialize(){
    const prefs = localStorage.getItem('kooralist_prefs');
    if(!prefs || !JSON.parse(prefs).setupComplete){ showSetupModal(); }
    const today = new Date();
    datePicker.value = today.toISOString().split('T')[0];
    fetchMatches(datePicker.value);
}
initialize();