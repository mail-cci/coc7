export class CharacterCreator {
    constructor() {
        this.character = {
            stats: {
                FUE: 0, CON: 0, TAM: 0, DES: 0, APA: 0,
                INT: 0, POD: 0, EDU: 0, SUE: 0
            },
            derived: { HP: 0, SAN: 0, MP: 0 },
            luck: 0,
            combat: { skills: {}, notes: '' },
            background: '',
            equipment: '',
            possessions: '',
            occupation: null,
            skills: {}
        };
        this.occupations = [];
    }

    async init() {
        await this.loadOccupations();
        this.populateOccupationSelect();
        this.renderStats();
        document.getElementById('roll-all').addEventListener('click', () => {
            this.rollAll();
        });
        document.getElementById('occupation-select').addEventListener('change', e => {
            this.selectOccupation(e.target.value);
        });
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportPDF();
        });
    }

    async loadOccupations() {
        const resp = await fetch('occupations.json');
        this.occupations = await resp.json();
    }

    populateOccupationSelect() {
        const select = document.getElementById('occupation-select');
        select.innerHTML = '<option value="">--Selecciona--</option>';
        this.occupations.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.name;
            opt.textContent = o.name;
            select.appendChild(opt);
        });
    }

    renderStats() {
        const grid = document.getElementById('stats-grid');
        grid.innerHTML = '';
        Object.keys(this.character.stats).forEach(key => {
            const card = document.createElement('div');
            card.className = 'characteristic-card';
            const name = document.createElement('div');
            name.className = 'char-name';
            name.textContent = key;
            const val = document.createElement('div');
            val.id = `stat-${key}`;
            val.className = 'result-display';
            val.textContent = '-';
            card.appendChild(name);
            card.appendChild(val);
            const btn = document.createElement('button');
            btn.textContent = 'Tirar';
            btn.className = 'dice-button';
            btn.addEventListener('click', () => {
                this.rollStat(key);
            });
            card.appendChild(btn);
            grid.appendChild(card);
        });
    }

    rollDice(n, s) {
        let t = 0;
        for (let i=0;i<n;i++) t += Math.floor(Math.random()*s)+1;
        return t;
    }

    rollStat(stat) {
        let value;
        if (['TAM','INT','EDU'].includes(stat)) {
            value = (this.rollDice(2,6)+6)*5;
        } else {
            value = this.rollDice(3,6)*5;
        }
        this.character.stats[stat] = value;
        document.getElementById(`stat-${stat}`).textContent = value;
        this.calculateDerived();
        this.updateDerivedUI();
    }

    rollLuck() {
        const value = this.rollDice(3, 6) * 5;
        this.character.luck = value;
        this.character.stats.SUE = value;
        const el = document.getElementById('stat-SUE');
        if (el) el.textContent = value;
        const luckEl = document.getElementById('luck-field');
        if (luckEl) luckEl.textContent = value;
        this.calculateDerived();
        this.updateDerivedUI();
    }

    rollAll() {
        Object.keys(this.character.stats).forEach(stat => this.rollStat(stat));
        this.rollLuck();
    }

    calculateDerived() {
        const c = this.character.stats;
        this.character.derived.SAN = c.POD;
        this.character.derived.MP = Math.floor(c.POD/5);
        if(c.CON && c.TAM){
            this.character.derived.HP = Math.floor((c.CON + c.TAM)/10);
        }
    }

    updateDerivedUI() {
        document.getElementById('hp-field').textContent = this.character.derived.HP || '-';
        document.getElementById('sanity-field').textContent = this.character.derived.SAN || '-';
        document.getElementById('mp-field').textContent = this.character.derived.MP || '-';
    }

    selectOccupation(name) {
        this.character.occupation = this.occupations.find(o => o.name === name);
        const list = document.getElementById('skills-list');
        list.innerHTML = '';
        if (this.character.occupation) {
            this.character.occupation.skills.forEach(sk => {
                const li = document.createElement('li');
                li.textContent = sk;
                list.appendChild(li);
            });
        }
    }

    exportPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Personaje de Call of Cthulhu', 10, 10);
        let y = 20;
        Object.entries(this.character.stats).forEach(([k,v]) => {
            doc.text(`${k}: ${v}`, 10, y); y += 6;
        });
        doc.text(`PV: ${this.character.derived.HP}`, 10, y); y +=6;
        doc.text(`Cordura: ${this.character.derived.SAN}`,10,y); y+=6;
        doc.text(`PM: ${this.character.derived.MP}`,10,y); y+=6;
        doc.text(`Suerte: ${this.character.luck}`,10,y); y+=10;
        if(this.character.occupation){
            doc.text(`Ocupación: ${this.character.occupation.name}`,10,y); y+=6;
            doc.text('Habilidades:',10,y); y+=6;
            this.character.occupation.skills.forEach(sk => { doc.text(`- ${sk}`, 12, y); y+=6; });
            y += 4;
        }
        if(Object.keys(this.character.combat.skills).length || this.character.combat.notes){
            doc.text('Combate:',10,y); y+=6;
            Object.entries(this.character.combat.skills).forEach(([k,v])=>{ doc.text(`${k}: ${v}`,12,y); y+=6; });
            if(this.character.combat.notes){ doc.text(this.character.combat.notes,12,y); y+=6; }
        }
        if(this.character.background){
            doc.text('Background:',10,y); y+=6;
            doc.text(this.character.background,12,y); y+=6;
        }
        if(this.character.possessions){
            doc.text('Posesiones:',10,y); y+=6;
            doc.text(this.character.possessions,12,y); y+=6;
        } else if(this.character.equipment){
            doc.text('Equipamiento:',10,y); y+=6;
            doc.text(this.character.equipment,12,y); y+=6;
        }
        doc.save('personaje.pdf');
    }

    setCombatSkill(name, value) {
        this.character.combat.skills[name] = value;
    }

    setCombatNotes(text) {
        this.character.combat.notes = text;
    }

    setBackground(text) {
        this.character.background = text;
    }

    setEquipment(text) {
        this.character.equipment = text;
    }

    setPossessions(text) {
        this.character.possessions = text;
    }

    getCharacter() {
        return this.character;
    }
}

const creator = new CharacterCreator();
creator.init();
