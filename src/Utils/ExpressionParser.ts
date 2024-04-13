type Token = {
    type: "number" | "operator" | "symbol" | "parenthesis";
    value: string;
}

export type Symbol = {
    name: string;
    value: number
}

function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let currentToken = "";
    let tagOpen = false;

    for(const char of input.replaceAll(" ", "")) {
        if(tagOpen || char == "{") { // TODO: Properly check for tag closing
            // Invalid attempt to open a tag before closing the previous one
            if(char == "{" && tagOpen) 
                throw new Error("Invalid expression");

            tagOpen = true;

            if(char != "{" && char != "}") currentToken += char;

            if(char == "}") {
                tagOpen = false;   
                tokens.push({ type: "symbol", value: currentToken });
                currentToken = "";
            }

            continue;
        }

        if(/[0-9.]/.test(char)) {
            currentToken += char;
        } else if(/[+\-*/]/.test(char)) {
            if(currentToken != "") {
                tokens.push({ type: "number", value: currentToken });
                currentToken = "";
            }

            tokens.push({ type: "operator", value: char });
        } else if(char == "(" || char == ")") {
            if(currentToken != "") {
                tokens.push({ type: "number", value: currentToken });
                currentToken = "";
            }

            tokens.push({ type: "parenthesis", value: char });
        }
    }

    if(currentToken != "") {
        tokens.push({ type: "number", value: currentToken });
    }

    return tokens;
}

function parseSymbol(token : Token, symbols: Symbol[]): number {
    const symbol = symbols.find(s => s.name == token.value);

    if (!symbol) 
        throw new Error(`Symbol "${token.value}" not available`);

    return symbol.value;
}

function evaluateSubExpression(tokens: Token[]) {
    let parenthesisCount = 0;
    let endIndex = -1;

    for (let i = 0; i < tokens.length; i++) {
        if(tokens[i].value === "(") 
            parenthesisCount++;
        else if (tokens[i].value === ")") {
            parenthesisCount--;

            if(parenthesisCount === 0) {
                endIndex = i;
                break;
            }
        }
    }

    if (endIndex === -1)
        throw new Error("Unexpected end of expression");

    let lastOpeningParenthesis = tokens.filter(t => t.value === "(").map(t => tokens.indexOf(t)).pop()!;
    let firstClosingParenthesis = tokens.filter(t => t.value === ")").map(t => tokens.indexOf(t)).shift()!;

    const subExpression = tokens.slice(lastOpeningParenthesis + 1, firstClosingParenthesis);
    tokens.splice(lastOpeningParenthesis, firstClosingParenthesis - lastOpeningParenthesis);

    evaluateTokens(subExpression);
    tokens[lastOpeningParenthesis] = { type: "number", value: subExpression[0].value.toString() };
}

function evaluateTokens(tokens: Token[]) {
    if (tokens.length == 0) 
        throw new Error("Invalid expression");

    let divMulTokens: Token[] = tokens.filter(t => t.value === "/" || t.value === "*");
    let addSubTokens: Token[] = tokens.filter(t => t.value === "+" || t.value === "-");

    if (divMulTokens.length > 0) 
        evaluateOperations(tokens, divMulTokens);

    if (addSubTokens.length > 0)
        evaluateOperations(tokens, addSubTokens);
}

function evaluateParenthesis(tokens: Token[]) {
    while(true) {
        const index = tokens.findIndex(t => t.value === "(");
        if (index === -1) break;
        evaluateSubExpression(tokens);
    }
}

function evaluateOperations(tokens: Token[], operationTokens: Token[]) {
    for(let operation of operationTokens) {
        const i = tokens.indexOf(operation);
        
        const operator = tokens[i];
        let postOperand = tokens[i + 1];
        let preOperand = tokens[i - 1];

        if(operator.value === "/" && (postOperand.value === "0" || preOperand.value === "0"))
            throw new Error("Division by zero");

        let operationResult = 0;

        switch(operator.value) {
            case "/":
                operationResult = parseFloat(preOperand.value) / parseFloat(postOperand.value);
                break;
            case "*":
                operationResult = parseFloat(preOperand.value) * parseFloat(postOperand.value);
                break;
            case "+":
                operationResult = parseFloat(preOperand.value) + parseFloat(postOperand.value);
                break;
            case "-":
                operationResult = parseFloat(preOperand.value) - parseFloat(postOperand.value);
                break;
        }

        tokens.splice(i - 1, 3, { type: "number", value: operationResult.toString() });
    }
}

function evaluateSymbols(tokens: Token[], symbols: Symbol[]) {
    for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if(token.type === "symbol")
            tokens[i] = { type: "number", value: parseSymbol(token, symbols).toString() };
    }
}

export default function evaluateExpression(expression: string, symbols: Symbol[]) {
    const tokens = tokenize(expression);

    evaluateSymbols(tokens, symbols);
    evaluateParenthesis(tokens);
    evaluateTokens(tokens);    

    return parseInt(tokens[0].value);
}