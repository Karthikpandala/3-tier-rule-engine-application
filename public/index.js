        document.getElementById('createRuleForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("inside src create Rule");

            const ruleString = document.getElementById('ruleInput').value;

            console.log(ruleString);

            try {
                const response = await fetch('/create_rule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rule_string: ruleString }),
                });

                if (response.ok) {
                    const result = await response.json();
                    document.getElementById('createRuleResponse').innerText = 'Rule created successfully: ' + JSON.stringify(result);
                } else {
                    document.getElementById('createRuleResponse').innerText = 'Error creating rule';
                }
            } catch (error) {
                document.getElementById('createRuleResponse').innerText = 'Error: ' + error.message;
            }
        });

        document.getElementById('evaluateRuleForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const dataInput = document.getElementById('dataInput').value;
            
            // Normally, the AST would be fetched from the backend or passed directly after rule creation
            // For this example, we'll assume the backend handles it
            const ast = {}; // The AST from rule creation would be here

            try {
                const response = await fetch('/evaluate_rule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ast, data: JSON.parse(dataInput) }),
                });

                if (response.ok) {
                    const result = await response.json();
                    document.getElementById('evaluateRuleResponse').innerText = 'Evaluation result: ' + JSON.stringify(result);
                } else {
                    document.getElementById('evaluateRuleResponse').innerText = 'Error evaluating rule';
                }
            } catch (error) {
                document.getElementById('evaluateRuleResponse').innerText = 'Error: ' + error.message;
            }
        });


        function showRule() {
            const ruleBook = document.getElementById('ruleBook');
            if (ruleBook.style.display === 'none' || ruleBook.style.display === '') {
                ruleBook.style.display = 'block'; // Show the rule book
            } else {
                ruleBook.style.display = 'none'; // Hide the rule book
            }
        }
        