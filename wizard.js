import { CharacterCreator } from './characterCreator.js';

const creator = new CharacterCreator();
creator.init();

const steps = Array.from(document.querySelectorAll('.wizard-step'));
let current = 0;

const rollLuckBtn = document.getElementById('roll-luck');
if (rollLuckBtn) {
    rollLuckBtn.addEventListener('click', () => {
        creator.rollLuck();
    });
}

function showStep(index){
    steps.forEach((s,i)=>{
        s.style.display = i===index ? 'block' : 'none';
    });
    document.getElementById('prev-btn').style.display = index===0?'none':'inline-block';
    const nextBtn = document.getElementById('next-btn');
    if(index===steps.length-1){
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'inline-block';
        nextBtn.textContent = 'Siguiente';
    }
}

function gatherData(){
    creator.setCombatNotes(document.getElementById('combat-notes').value);
    creator.setBackground(document.getElementById('background-notes').value);
    creator.setEquipment(document.getElementById('equipment-notes').value);
    const posEl = document.getElementById('possessions-notes');
    if(posEl){
        creator.setPossessions(posEl.value);
    }
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
    if(char.possessions){ txt+=`\nPosesiones:\n${char.possessions}\n`; }
    else if(char.equipment){ txt+=`\nEquipamiento:\n${char.equipment}\n`; }
    document.getElementById('summary').textContent = txt;
}

function validateStep(index){
    const char = creator.getCharacter();
    if(index === 0){
        const allRolled = Object.values(char.stats).every(v => v > 0);
        if(!allRolled){
            alert('Tira todas las características antes de continuar');
            return false;
        }
    }
    if(index === 1){
        if(char.luck === 0){
            alert('Debes tirar la Suerte antes de continuar');
            return false;
        }
    }
    if(index === 2){
        if(!char.occupation){
            alert('Selecciona una ocupación');
            return false;
        }
    }
    return true;
}

document.getElementById('next-btn').addEventListener('click', () => {
    if(!validateStep(current)) return;
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

const downloadBtn = document.getElementById('download-btn');
if(downloadBtn){
    downloadBtn.addEventListener('click', () => {
        gatherData();
        creator.exportPDF();
    });
}

showStep(0);
