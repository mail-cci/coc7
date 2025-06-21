        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Remove active class from all buttons
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.classList.remove('active');
            });

            // Show selected tab content
            document.getElementById(tabName).classList.add('active');

            // Add active class to clicked button
            event.target.classList.add('active');
        }

        function filterSkills() {
            const searchTerm = document.getElementById('skills-search').value.toLowerCase();
            const skillCards = document.querySelectorAll('.skill-card');
            
            skillCards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const text = card.textContent.toLowerCase();
                
                if (name.includes(searchTerm) || text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function filterOccupations() {
            const searchTerm = document.getElementById('occupation-search').value.toLowerCase();
            const occupationCards = document.querySelectorAll('.occupation-card');
            
            occupationCards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const text = card.textContent.toLowerCase();
                
                if (name.includes(searchTerm) || text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function toggleSection(section) {
            const characteristicsSection = document.getElementById('characteristics-section');
            const derivedSection = document.getElementById('derived-section');
            
            if (section === 'characteristics') {
                characteristicsSection.style.display = 'block';
                derivedSection.style.display = 'none';
            } else if (section === 'derived') {
                characteristicsSection.style.display = 'none';
                derivedSection.style.display = 'block';
            }
        }

        function calculateDerived() {
            // Get input values
            const pod = parseInt(document.getElementById('pod-input').value) || 0;
            const con = parseInt(document.getElementById('con-input').value) || 0;
            const tam = parseInt(document.getElementById('tam-input').value) || 0;
            const fue = parseInt(document.getElementById('fue-input').value) || 0;
            const tam2 = parseInt(document.getElementById('tam2-input').value) || 0;
            const des = parseInt(document.getElementById('des-input').value) || 0;
            const fue2 = parseInt(document.getElementById('fue2-input').value) || 0;
            const tam3 = parseInt(document.getElementById('tam3-input').value) || 0;

            // Calculate Sanity Points
            if (pod > 0) {
                document.getElementById('sanity-result').innerHTML = `
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        Cordura: ${pod} puntos
                    </div>
                `;
            }

            // Calculate Magic Points
            if (pod > 0) {
                const magicPoints = Math.floor(pod / 5);
                document.getElementById('magic-result').innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        ${pod} ÷ 5 = ${magicPoints}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        PM: ${magicPoints} puntos
                    </div>
                `;
            }

            // Calculate Hit Points
            if (con > 0 && tam > 0) {
                const hitPoints = Math.floor((con + tam) / 10);
                document.getElementById('hp-result').innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        (${con} + ${tam}) ÷ 10 = ${hitPoints}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        PV: ${hitPoints} puntos
                    </div>
                `;
            }

            // Calculate Damage Bonus and Build
            if (fue > 0 && tam2 > 0) {
                const total = fue + tam2;
                let damageBonus, build;
                
                if (total <= 64) {
                    damageBonus = "-2";
                    build = "-2";
                } else if (total <= 84) {
                    damageBonus = "-1";
                    build = "-1";
                } else if (total <= 124) {
                    damageBonus = "+0";
                    build = "0";
                } else if (total <= 164) {
                    damageBonus = "+1D4";
                    build = "+1";
                } else if (total <= 204) {
                    damageBonus = "+1D6";
                    build = "+2";
                } else {
                    damageBonus = "+2D6";
                    build = "+3";
                }

                document.getElementById('damage-result').innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        FUE + TAM: ${fue} + ${tam2} = ${total}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        BD: ${damageBonus}
                    </div>
                `;

                document.getElementById('build-result').innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        FUE + TAM: ${total}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        Constitución: ${build}
                    </div>
                `;
            }

            // Calculate Movement Rate
            if (des > 0 && fue2 > 0 && tam3 > 0) {
                let movement;
                
                if (des < tam3 && fue2 < tam3) {
                    movement = 7;
                } else if (des > tam3 && fue2 > tam3) {
                    movement = 9;
                } else {
                    movement = 8;
                }

                document.getElementById('movement-result').innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        DES:${des}, FUE:${fue2}, TAM:${tam3}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        Velocidad: ${movement} m/asalto
                    </div>
                `;
            }

            // Calculate Dodge
            if (des > 0) {
                const dodge = Math.floor(des / 2);
                document.getElementById('dodge-result').innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        ${des} ÷ 2 = ${dodge}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        Esquivar: ${dodge}%
                    </div>
                `;
            }
        }

        function rollDice(numDice, sides, multiplier, resultId) {
            let total = 0;
            let rolls = [];
            
            for (let i = 0; i < numDice; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                rolls.push(roll);
                total += roll;
            }
            
            const finalResult = total * multiplier;
            const resultElement = document.getElementById(resultId);
            
            // Show animation
            resultElement.innerHTML = "🎲 Tirando...";
            
            setTimeout(() => {
                resultElement.innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        Dados: [${rolls.join(', ')}] = ${total}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        Resultado: ${finalResult}
                    </div>
                `;
            }, 800);
        }

        function rollDiceWithBonus(numDice, sides, bonus, multiplier, resultId) {
            let total = 0;
            let rolls = [];
            
            for (let i = 0; i < numDice; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                rolls.push(roll);
                total += roll;
            }
            
            total += bonus;
            const finalResult = total * multiplier;
            const resultElement = document.getElementById(resultId);
            
            // Show animation
            resultElement.innerHTML = "🎲 Tirando...";
            
            setTimeout(() => {
                resultElement.innerHTML = `
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">
                        Dados: [${rolls.join(', ')}] + ${bonus} = ${total}
                    </div>
                    <div style="font-size: 1.2rem; font-weight: bold;">
                        Resultado: ${finalResult}
                    </div>
                `;
            }, 800);
        }

