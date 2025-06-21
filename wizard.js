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
    creator.setCombatNotes(document.getElementById('combat-notes').value);
    creator.setBackground(document.getElementById('background-notes').value);
    creator.setEquipment(document.getElementById('equipment-notes').value);
}

function renderSummary(){
    gatherData();
    const char = creator.getCharacter();
    let txt = '';
    Object.entries(char.stats).forEach(([k,v])=>{txt += `${k}: ${v}\n`;});
    txt += `PV: ${char.derived.HP}\n`;
    txt += `Cordura: ${char.derived.SAN}\n`;
    txt += `PM: ${char.derived.MP}\n`;
    txt += `Suerte: ${char.luck}\n`;
    if(char.occupation){
        txt += `Ocupación: ${char.occupation.name}\n`;
        txt += 'Habilidades:\n';
        char.occupation.skills.forEach(sk=>{txt+=`- ${sk}\n`;});
    }
    if(char.combat.notes){ txt+=`\nCombate:\n${char.combat.notes}\n`; }
    if(char.background){ txt+=`\nBackground:\n${char.background}\n`; }
    if(char.equipment){ txt+=`\nEquipamiento:\n${char.equipment}\n`; }
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
