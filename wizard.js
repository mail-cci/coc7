import { CharacterCreator } from './characterCreator.js';

const creator = new CharacterCreator();
creator.init().then(()=>{
    loadState();
    updateUIFromState();
    showStep(current);
});

const steps = Array.from(document.querySelectorAll('.wizard-step'));
let current = 0;

function saveState(){
    const data = {
        step: current,
        character: creator.getCharacter()
    };
    localStorage.setItem('wizardState', JSON.stringify(data));
}
window.saveWizardState = saveState;

function loadState(){
    const saved = localStorage.getItem('wizardState');
    if(saved){
        try{
            const data = JSON.parse(saved);
            current = data.step || 0;
            Object.assign(creator.character, data.character || {});
        }catch(e){
            console.error('Error loading state', e);
        }
    }
}

function updateUIFromState(){
    const char = creator.getCharacter();
    Object.keys(char.stats).forEach(k=>{
        const el = document.getElementById(`stat-${k}`);
        if(el) el.textContent = char.stats[k] || '-';
        const cmt = document.getElementById(`comment-${k}`);
        if(cmt && char.stats[k]){
            cmt.textContent = char.stats[k] >= 50 ? 'Por encima del promedio' : 'En el promedio';
        }
    });
    if(char.luck){
        const lEl = document.getElementById('luck-field');
        if(lEl) lEl.textContent = char.luck;
    }
    if(char.occupation){
        const sel = document.getElementById('occupation-select');
        if(sel) sel.value = char.occupation.name;
    }
    gatherData();
    renderSummary();
}

const rollLuckBtn = document.getElementById('roll-luck');
if (rollLuckBtn) {
    rollLuckBtn.addEventListener('click', () => {
        creator.rollLuck();
        saveState();
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
    const bar = document.getElementById('progress-bar');
    if(bar){
        bar.style.width = ((index)/(steps.length-1))*100 + '%';
    }
    saveState();
}

function gatherData(){
    creator.setCombatNotes(document.getElementById('combat-notes').value);
    creator.setBackground(document.getElementById('background-notes').value);
    creator.setEquipment(document.getElementById('equipment-notes').value);
    const posEl = document.getElementById('possessions-notes');
    if(posEl){
        creator.setPossessions(posEl.value);
    }
    saveState();
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

['combat-notes','background-notes','equipment-notes','possessions-notes'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){
        el.addEventListener('input', ()=>{gatherData();});
    }
});

const occSelect=document.getElementById('occupation-select');
if(occSelect){
    occSelect.addEventListener('change', ()=>{saveState();});
}

const restartBtn = document.getElementById('restart-btn');
if(restartBtn){
    restartBtn.addEventListener('click', ()=>{
        if(confirm('¿Seguro que quieres empezar de nuevo?')){
            localStorage.removeItem('wizardState');
            window.location.reload();
        }
    });
}
showStep(current);
