// backend/ast.js

class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type;
        this.left = left;
        this.right = right;
        this.value = value;
    }

    // Evaluate the node based on user data
    evaluate(userData) {
        if (this.type === 'operand') {
            // Assuming value is in "key operator value" format
            const [key, operator, comparisonValue] = this.value.match(/(\w+)([<>=!]+)(\w+)/).slice(1);
            const userValue = userData[key];
            switch (operator) {
                case '>':
                    return userValue > comparisonValue;
                case '<':
                    return userValue < comparisonValue;
                case '=':
                    return userValue === comparisonValue;
                case '!=':
                    return userValue !== comparisonValue;
                default:
                    return false; // Unexpected operator
            }
        } else if (this.type === 'operator') {
            if (this.value === '&&') {
                return this.left.evaluate(userData) && this.right.evaluate(userData);
            } else if (this.value === '||') {
                return this.left.evaluate(userData) || this.right.evaluate(userData);
            }
        }
        return false; // Default case
    }
}

function createRuleAST(ruleString) {
    const tokens = ruleString
        .replace(/\s+/g, '') // Remove spaces
        .split(/(\|\||&&|>=|<=|>|<|!=|=)/); // Split by operators

    let stack = [];
    let currentNode = null;

    tokens.forEach(token => {
        if (token === '&&' || token === '||') {
            // Create a new operator node for AND/OR
            if (currentNode) {
                const newNode = new Node('operator', currentNode, null, token);
                stack.push(newNode);
                currentNode = null; // Reset currentNode for the next operand
            }
        } else if (token) {
            if (/>=|<=|>|<|!=|=/.test(token)) {
                const parts = token.split(/(>=|<=|>|<|!=|=)/);
                if (parts.length === 3) {
                    const leftOperand = new Node('operand', null, null, parts[0]);
                    const operator = new Node('operator', leftOperand, null, parts[1]);
                    const rightOperand = new Node('operand', null, null, parts[2]);
                    operator.right = rightOperand;

                    if (currentNode) {
                        const lastOperator = stack.pop();
                        lastOperator.right = operator; // Attach to last operator
                        stack.push(lastOperator); // Push back the modified last operator
                    } else {
                        stack.push(operator); // First operator
                    }
                    currentNode = operator; // Update to latest operator
                }
            } else {
                const operandNode = new Node('operand', null, null, token);
                if (currentNode) {
                    currentNode.right = operandNode; // Attach to last operator
                } else {
                    stack.push(operandNode); // First node
                }
                currentNode = operandNode; // Update current node
            }
        }
    });

    // Handle linking of the final tree structure
    if (stack.length === 1) {
        return stack[0]; // Return the root of the AST
    } else if (stack.length > 1) {
        // If there's more than one operator, create a root operator
        const rootOperator = new Node('operator', stack[0], null, '||');
        for (let i = 1; i < stack.length; i++) {
            rootOperator.right = stack[i]; // Attach remaining nodes
        }
        return rootOperator;
    }

    return null; // In case of empty input
}







module.exports = { Node, createRuleAST };
