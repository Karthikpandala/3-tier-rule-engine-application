const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const hbs = require('hbs');
const app = express();
const PORT = process.env.PORT || 3000;

const { Node, createRuleAST } = require('./backend/ast'); // Import from ast.js

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views')); 

app.use(express.static(path.join(__dirname, '/public')));
const rulesFilePath = path.join(__dirname, 'rules.json');

// Sample Rule Creation API
function readRules() {
    try {
        const data = fs.readFileSync(rulesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading rules file:', error);
        return [];
    }
}

// Function to write rules to the JSON file
function writeRules(rules) {
    try {
        fs.writeFileSync(rulesFilePath, JSON.stringify(rules, null, 2));
    } catch (error) {
        console.error('Error writing rules file:', error);
    }
}

// POST endpoint to create a new rule
app.post('/create_rule', (req, res) => {
    console.log("console: inside create rule route");
    const { rule_string } = req.body;  
    console.log("Rule String: " + rule_string);

    if (!rule_string) {
        return res.status(400).json({ error: 'No rule string provided' });
    }

    const ast = createRuleAST(rule_string);
    
    // Read existing rules
    const rules = readRules();
    
    // Append the new rule
    rules.push({ rule_string, ast });

    // Write the updated rules back to the file
    writeRules(rules);

    res.json({ success: true, ast });
});

// Rule Evaluation API
app.post('/evaluate_rule', (req, res) => {
    const { ruleAST, userData } = req.body;

    // Rebuild the AST from the received JSON structure
    const root = new Node(ruleAST.type, ruleAST.left, ruleAST.right, ruleAST.value);

    // Evaluate the AST with the user data
    const result = root.evaluate(userData);

    res.json({ success: true, result });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.render('index.hbs');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
