import { CharacterCreator } from './characterCreator.js';

const creator = new CharacterCreator();
creator.init();

const steps = Array.from(document.querySelectorAll('.wizard-step'));
let current = 0;

function showStep(index){
    steps.forEach((s,i)=>{
        s.style.display = i===index ? 'block' : 'none';
    });
    document.getElementById('prev-btn').style.display = index===0?'none':'inline-block';
    document.getElementById('next-btn').textContent = index===steps.length-1?'Finalizar':'Siguiente';
}

function gatherData(){
    creator.character.combatNotes = document.getElementById('combat-notes').value;
    creator.character.background = document.getElementById('background-notes').value;
    creator.character.equipment = document.getElementById('equipment-notes').value;
}

function renderSummary(){
    gatherData();
    let txt = '';
    Object.entries(creator.character.stats).forEach(([k,v])=>{txt += `${k}: ${v}\n`;});
    txt += `PV: ${creator.character.derived.HP}\n`;
    txt += `Cordura: ${creator.character.derived.SAN}\n`;
    txt += `PM: ${creator.character.derived.MP}\n`;
    if(creator.character.occupation){
        txt += `Ocupación: ${creator.character.occupation.name}\n`;
        txt += 'Habilidades:\n';
        creator.character.occupation.skills.forEach(sk=>{txt+=`- ${sk}\n`;});
    }
    if(creator.character.combatNotes){ txt+=`\nCombate:\n${creator.character.combatNotes}\n`; }
    if(creator.character.background){ txt+=`\nBackground:\n${creator.character.background}\n`; }
    if(creator.character.equipment){ txt+=`\nEquipamiento:\n${creator.character.equipment}\n`; }
    document.getElementById('summary').textContent = txt;
}

document.getElementById('next-btn').addEventListener('click', () => {
    if(current < steps.length - 1){
        current++;
        if(current === steps.length - 1){
            renderSummary();
        }
        showStep(current);
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if(current > 0){
        current--;
        showStep(current);
    }
});

showStep(0);
