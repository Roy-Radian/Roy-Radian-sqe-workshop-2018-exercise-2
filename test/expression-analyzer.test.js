import assert from 'assert';
import {isProgram, programToAnalyzedLines} from '../src/js/expression-analyzer';



describe('Testing isProgram', () => {
    //'Make sure isProgram can handle a program, null, objects without type, and objects with bad type'
    it ('Make sure isProgram can handle a program', () => {
        assert.equal(isProgram({ 'type': 'Program', 'body': [], 'sourceType': 'script', 'loc': { 'start': { 'line': 0, 'column': 0 }, 'end': { 'line': 0, 'column': 0 } } }), true)
    });
    it ('Make sure isProgram can handle null', () => {
        assert.equal(isProgram(null), false);
    });
    it ('Make sure isProgram can handle an object without type', () => {
        assert.equal(isProgram({'loc': { 'start': { 'line': 0, 'column': 0 }, 'end': { 'line': 0, 'column': 0 }}}), false);
    });
    it ('Make sure isProgram can handle something which is not a program', () => {
        assert.equal(isProgram({ 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'init': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 8 }, 'end': { 'line': 1, 'column': 9 } } }, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 9 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 10 } } }), false);
    });
});

function testProgram(program, expectedLines) {
    if (isProgram(program))
        assert.deepEqual(programToAnalyzedLines(program), expectedLines);
    else
        assert.fail();
}

const varDecProgram = { 'type': 'Program', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'init': null, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } };
const varDecAnalyzedLines = [{line: 1, type: 'VariableDeclarator', name: 'b', condition: '', value: 'null'}];
const varDecAndInitProgram = { 'type': 'Program', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'init': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 8 }, 'end': { 'line': 1, 'column': 9 } } }, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 9 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 10 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 10 } } };
const varDecAndInitAnalyzedLines = [{line: 1, type: 'VariableDeclarator', name: 'a', condition: '', value: '5'}];

describe('Testing Variable Declaration', () => {
    it ('Parsing simple Variable Declaration correctly', () => {
        testProgram(varDecProgram, varDecAnalyzedLines);
    });
    it ('Parsing Variable Declaration with initialization correctly', () => {
        testProgram(varDecAndInitProgram, varDecAndInitAnalyzedLines);
    });
});

const simpleVarAssignmentProgram = { 'type': 'Program', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 1 } } }, 'right': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 5 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } };
const simpleVarAssignmentAnalyzedLines = [{line: 1, type: 'AssignmentExpression', name: 'a', condition: '', value: '5'}];
const compoundVarAssignmentProgram = { 'type': 'Program', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 1 } } }, 'right': { 'type': 'ConditionalExpression', 'test': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 1, 'column': 5 }, 'end': { 'line': 1, 'column': 6 } } }, 'consequent': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 10 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '/', 'left': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'm', 'loc': { 'start': { 'line': 1, 'column': 17 }, 'end': { 'line': 1, 'column': 18 } } }, 'property': { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 1, 'column': 19 }, 'end': { 'line': 1, 'column': 20 } } }, 'loc': { 'start': { 'line': 1, 'column': 17 }, 'end': { 'line': 1, 'column': 21 } } }, 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 21 } } }, 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 21 } } }, 'alternate': { 'type': 'Literal', 'value': 66, 'raw': '66', 'loc': { 'start': { 'line': 1, 'column': 24 }, 'end': { 'line': 1, 'column': 26 } } }, 'loc': { 'start': { 'line': 1, 'column': 5 }, 'end': { 'line': 1, 'column': 26 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 27 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 28 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 28 } } };
const compoundVarAssignmentAnalyzedLines = [{line: 1, type: 'AssignmentExpression', name: 'a', condition: '', value: '(b ? (5 + (2 / m[3])) : 66)'}];

describe('Testing Variable Assignment', () => {
    it ('Parsing simple Variable Assignment correctly', () => {
        testProgram(simpleVarAssignmentProgram, simpleVarAssignmentAnalyzedLines);
    });
    it ('Parsing Variable Assignment with compound value correctly', () => {
        testProgram(compoundVarAssignmentProgram, compoundVarAssignmentAnalyzedLines);
    });
});

const simpleWhileProgram = { 'type': 'Program', 'body': [ { 'type': 'WhileStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 7 }, 'end': { 'line': 1, 'column': 8 } } }, 'right': { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 1, 'column': 11 }, 'end': { 'line': 1, 'column': 12 } } }, 'loc': { 'start': { 'line': 1, 'column': 7 }, 'end': { 'line': 1, 'column': 12 } } }, 'body': { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '--', 'argument': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 5 } } }, 'prefix': false, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 7 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 8 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 2, 'column': 8 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 2, 'column': 8 } } };
const simpleWhileAnalyzedLines = [
    {line: 1, type: 'WhileStatement', name: '', condition: '(i > 3)', value: ''},
    {line: 2, type: 'UpdateExpression', name: 'i', condition: '', value: 'i--'}
];
const compoundWhileProgram = { 'type': 'Program', 'body': [ { 'type': 'WhileStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 7 }, 'end': { 'line': 1, 'column': 8 } } }, 'right': { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 10 } } }, 'loc': { 'start': { 'line': 1, 'column': 7 }, 'end': { 'line': 1, 'column': 10 } } }, 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'WhileStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 2, 'column': 15 }, 'end': { 'line': 2, 'column': 16 } } }, 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 16 } } }, 'body': { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '--', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'arr', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 11 } } }, 'property': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 3, 'column': 12 }, 'end': { 'line': 3, 'column': 13 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 14 } } }, 'prefix': false, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 16 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 17 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 3, 'column': 17 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 5 } } }, 'right': { 'type': 'UnaryExpression', 'operator': '!', 'argument': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 4, 'column': 9 }, 'end': { 'line': 4, 'column': 10 } } }, 'prefix': true, 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 10 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 10 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 5 } } }, 'right': { 'type': 'Identifier', 'name': 'f', 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 9 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 9 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 10 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UnaryExpression', 'operator': '-', 'argument': { 'type': 'Identifier', 'name': 't', 'loc': { 'start': { 'line': 6, 'column': 5 }, 'end': { 'line': 6, 'column': 6 } } }, 'prefix': true, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 6 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 7 } } }, { 'type': 'BreakStatement', 'label': null, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 10 } } } ], 'loc': { 'start': { 'line': 1, 'column': 12 }, 'end': { 'line': 8, 'column': 1 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 8, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 8, 'column': 1 } } };
const compoundWhileAnalyzedLines = [
    {line: 1, type: 'WhileStatement', name: '', condition: '(i > 3)', value: ''},
    {line: 2, type: 'WhileStatement', name: '', condition: '(i > 4)', value: ''},
    {line: 3, type: 'UpdateExpression', name: 'arr[i]', condition: '', value: 'arr[i]--'},
    {line: 4, type: 'AssignmentExpression', name: 'b', condition: '', value: '!b'},
    {line: 5, type: 'BinaryExpression', name: '', condition: '', value: '(5 + f)'},
    {line: 6, type: 'UnaryExpression', name: '', condition: '', value: '-t'},
    {line: 7, type: 'BreakStatement', name: '', condition: '', value: ''}

];

describe('Testing while loops', () => {

    it('Parsing simple while loop correctly', () => {
        testProgram(simpleWhileProgram, simpleWhileAnalyzedLines);
    });

    it('Parsing compound while loop correctly', () => {
        testProgram(compoundWhileProgram, compoundWhileAnalyzedLines);
    });
});

const simpleDoWhileProgram = { 'type': 'Program', 'body': [ { 'type': 'DoWhileStatement', 'body': { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 5 } } }, 'prefix': false, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 7 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 8 } } }, 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'X', 'loc': { 'start': { 'line': 3, 'column': 7 }, 'end': { 'line': 3, 'column': 8 } } }, 'right': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 3, 'column': 11 }, 'end': { 'line': 3, 'column': 12 } } }, 'loc': { 'start': { 'line': 3, 'column': 7 }, 'end': { 'line': 3, 'column': 12 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 3, 'column': 14 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 3, 'column': 14 } } };
const simpleDoWhileAnalyzedLines = [
    {line: 1, type: 'DoWhileStatement', name: '', condition: '(X > y)', value: ''},
    {line: 2, type: 'UpdateExpression', name: 'i', condition: '', value: 'i++'}
];
const compoundDoWhileProgram = { 'type': 'Program', 'body': [ { 'type': 'DoWhileStatement', 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'DoWhileStatement', 'body': { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'prefix': false, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 11 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 12 } } }, 'test': { 'type': 'BinaryExpression', 'operator': '<', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 4, 'column': 11 }, 'end': { 'line': 4, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 4, 'column': 15 }, 'end': { 'line': 4, 'column': 16 } } }, 'loc': { 'start': { 'line': 4, 'column': 11 }, 'end': { 'line': 4, 'column': 16 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 4, 'column': 18 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '+=', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 5 } } }, 'right': { 'type': 'Literal', 'value': 7, 'raw': '7', 'loc': { 'start': { 'line': 5, 'column': 9 }, 'end': { 'line': 5, 'column': 10 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 10 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 8 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 9 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'Identifier', 'name': 'g', 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 5 } } }, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 6 } } } ], 'loc': { 'start': { 'line': 1, 'column': 3 }, 'end': { 'line': 8, 'column': 1 } } }, 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'X', 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 9 } } }, 'right': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 8, 'column': 12 }, 'end': { 'line': 8, 'column': 13 } } }, 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 13 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 8, 'column': 15 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 8, 'column': 15 } } };
const compoundDoWhileAnalyzedLines = [
    {line: 1, type: 'DoWhileStatement', name: '', condition: '(X > y)', value: ''},
    {line: 2, type: 'DoWhileStatement', name: '', condition: '(i < 5)', value: ''},
    {line: 3, type: 'UpdateExpression', name: 'i', condition: '', value: 'i++'},
    {line: 5, type: 'AssignmentExpression', name: 'b', condition: '', value: 'b + 7'},
    {line: 6, type: 'Literal', name: '', condition: '', value: 'true'},
    {line: 7, type: 'Identifier', name: 'g', condition: '', value: ''}
];


describe('Testing do while loops', () =>
{
    it('Parsing simple do while loop correctly', () => {
        testProgram(simpleDoWhileProgram, simpleDoWhileAnalyzedLines);
    });

    it('Parsing compound do while loop correctly', () => {
        testProgram(compoundDoWhileProgram, compoundDoWhileAnalyzedLines);
    });
});

const simpleForProgram = { 'type': 'Program', 'body': [ { 'type': 'ForStatement', 'init': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 5 }, 'end': { 'line': 1, 'column': 6 } } }, 'right': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 10 } } }, 'loc': { 'start': { 'line': 1, 'column': 5 }, 'end': { 'line': 1, 'column': 10 } } }, 'test': { 'type': 'BinaryExpression', 'operator': '<=', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 12 }, 'end': { 'line': 1, 'column': 13 } } }, 'right': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 17 }, 'end': { 'line': 1, 'column': 18 } } }, 'loc': { 'start': { 'line': 1, 'column': 12 }, 'end': { 'line': 1, 'column': 18 } } }, 'update': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 20 }, 'end': { 'line': 1, 'column': 21 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 24 }, 'end': { 'line': 1, 'column': 25 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 1, 'column': 28 }, 'end': { 'line': 1, 'column': 29 } } }, 'loc': { 'start': { 'line': 1, 'column': 24 }, 'end': { 'line': 1, 'column': 29 } } }, 'loc': { 'start': { 'line': 1, 'column': 20 }, 'end': { 'line': 1, 'column': 29 } } }, 'body': { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'l', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 5 } } }, 'right': { 'type': 'MemberExpression', 'computed': false, 'object': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'property': { 'type': 'Identifier', 'name': 'length', 'loc': { 'start': { 'line': 2, 'column': 10 }, 'end': { 'line': 2, 'column': 16 } } }, 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 16 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 16 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 17 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 2, 'column': 17 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 2, 'column': 17 } } };
const simpleForAnaylzedLines = [
    {line: 1, type: 'ForStatement', name: '', condition: '(i <= 5)', value: ''},
    {line: 1, type: 'AssignmentExpression', name: 'i', condition: '', value: '0'},
    {line: 1, type: 'AssignmentExpression', name: 'i', condition: '', value: '(i + 1)'},
    {line: 2, type: 'AssignmentExpression', name: 'l', condition: '', value: 'a.length'}
];
const compoundForProgram = { 'type': 'Program', 'body': [ { 'type': 'ForStatement', 'init': { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 10 } } }, 'init': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 14 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 1, 'column': 5 }, 'end': { 'line': 1, 'column': 15 } } }, 'test': { 'type': 'BinaryExpression', 'operator': '<=', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 1, 'column': 17 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'M', 'loc': { 'start': { 'line': 1, 'column': 21 }, 'end': { 'line': 1, 'column': 22 } } }, 'property': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 23 }, 'end': { 'line': 1, 'column': 24 } } }, 'loc': { 'start': { 'line': 1, 'column': 21 }, 'end': { 'line': 1, 'column': 25 } } }, 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 1, 'column': 25 } } }, 'update': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 1, 'column': 27 }, 'end': { 'line': 1, 'column': 28 } } }, 'prefix': false, 'loc': { 'start': { 'line': 1, 'column': 27 }, 'end': { 'line': 1, 'column': 30 } } }, 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'WhileStatement', 'test': { 'type': 'Identifier', 'name': 'bool', 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 15 } } }, 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'prefix': false, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 11 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 12 } } } ], 'loc': { 'start': { 'line': 2, 'column': 17 }, 'end': { 'line': 4, 'column': 5 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 4, 'column': 5 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'c', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 5 } } }, 'property': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 5, 'column': 6 }, 'end': { 'line': 5, 'column': 7 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 8 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 9 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 5 } } }, 'right': { 'type': 'UnaryExpression', 'operator': '!', 'argument': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 6, 'column': 9 }, 'end': { 'line': 6, 'column': 10 } } }, 'prefix': true, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 10 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 10 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 10 } } } ], 'loc': { 'start': { 'line': 1, 'column': 32 }, 'end': { 'line': 7, 'column': 1 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 7, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 7, 'column': 1 } } };
const compoundForAnalyzedLines = [
    {line: 1, type: 'ForStatement', name: '', condition: '(i <= M[i])', value: ''},
    {line: 1, type: 'VariableDeclarator', name: 'i', condition: '', value: '1'},
    {line: 1, type: 'UpdateExpression', name: 'i', condition: '', value: 'i++'},
    {line: 2, type: 'WhileStatement', name: '', condition: 'bool', value: ''},
    {line: 3, type: 'UpdateExpression', name: 'a', condition: '', value: 'a++'},
    {line: 5, type: 'MemberExpression', name: 'c[i]', condition: '', value: ''},
    {line: 6, type: 'AssignmentExpression', name: 'b', condition: '', value: '!b'}
];

describe('Testing for loops', () => {
    it('Parsing simple for loop correctly', () => {
        testProgram(simpleForProgram, simpleForAnaylzedLines);
    });

    it('Parsing compound for loop correctly', () => {
        testProgram(compoundForProgram, compoundForAnalyzedLines);
    });
});

const simpleIfProgram = { 'type': 'Program', 'body': [ { 'type': 'IfStatement', 'test': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'consequent': { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 2, 'column': 6 }, 'end': { 'line': 2, 'column': 7 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 8 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '*', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 12 } } }, 'property': { 'type': 'Literal', 'value': 6, 'raw': '6', 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 14 } } }, 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 15 } } }, 'right': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 2, 'column': 18 }, 'end': { 'line': 2, 'column': 19 } } }, 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 19 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 19 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 20 } } }, 'alternate': null, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 2, 'column': 20 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 2, 'column': 20 } } };
const simpleIfAnalyzedLines = [
    {line: 1, type: 'IfStatement', name: '', condition: 'b', value: ''},
    {line: 2, type: 'AssignmentExpression', name: 'a[5]', condition: '', value: '(a[6] * 2)'}
];
const complexIfProgram = { 'type': 'Program', 'body': [ { 'type': 'IfStatement', 'test': { 'type': 'BinaryExpression', 'operator': '<', 'left': { 'type': 'Identifier', 'name': 'X', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'V', 'loc': { 'start': { 'line': 1, 'column': 8 }, 'end': { 'line': 1, 'column': 9 } } }, 'property': { 'type': 'Identifier', 'name': 'mid', 'loc': { 'start': { 'line': 1, 'column': 10 }, 'end': { 'line': 1, 'column': 13 } } }, 'loc': { 'start': { 'line': 1, 'column': 8 }, 'end': { 'line': 1, 'column': 14 } } }, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 14 } } }, 'consequent': { 'type': 'BlockStatement', 'body': [ { 'type': 'IfStatement', 'test': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'consequent': { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'prefix': true, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 11 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 12 } } }, 'alternate': null, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 3, 'column': 12 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'high', 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 8 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '-', 'left': { 'type': 'Identifier', 'name': 'mid', 'loc': { 'start': { 'line': 4, 'column': 11 }, 'end': { 'line': 4, 'column': 14 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 4, 'column': 17 }, 'end': { 'line': 4, 'column': 18 } } }, 'loc': { 'start': { 'line': 4, 'column': 11 }, 'end': { 'line': 4, 'column': 18 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 18 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 19 } } } ], 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 5, 'column': 1 } } }, 'alternate': { 'type': 'IfStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'X', 'loc': { 'start': { 'line': 6, 'column': 9 }, 'end': { 'line': 6, 'column': 10 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'V', 'loc': { 'start': { 'line': 6, 'column': 13 }, 'end': { 'line': 6, 'column': 14 } } }, 'property': { 'type': 'Identifier', 'name': 'mid', 'loc': { 'start': { 'line': 6, 'column': 15 }, 'end': { 'line': 6, 'column': 18 } } }, 'loc': { 'start': { 'line': 6, 'column': 13 }, 'end': { 'line': 6, 'column': 19 } } }, 'loc': { 'start': { 'line': 6, 'column': 9 }, 'end': { 'line': 6, 'column': 19 } } }, 'consequent': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'low', 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 7 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'mid', 'loc': { 'start': { 'line': 7, 'column': 10 }, 'end': { 'line': 7, 'column': 13 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 7, 'column': 16 }, 'end': { 'line': 7, 'column': 17 } } }, 'loc': { 'start': { 'line': 7, 'column': 10 }, 'end': { 'line': 7, 'column': 17 } } }, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 17 } } }, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 18 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'V', 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 8, 'column': 6 }, 'end': { 'line': 8, 'column': 7 } } }, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 8 } } }, 'prefix': false, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 10 } } }, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 11 } } } ], 'loc': { 'start': { 'line': 6, 'column': 21 }, 'end': { 'line': 9, 'column': 1 } } }, 'alternate': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '--', 'argument': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 5 } } }, 'prefix': false, 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 7 } } }, 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 8 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 5 } } }, 'prefix': false, 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 7 } } }, 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 8 } } } ], 'loc': { 'start': { 'line': 10, 'column': 5 }, 'end': { 'line': 13, 'column': 1 } } }, 'loc': { 'start': { 'line': 6, 'column': 5 }, 'end': { 'line': 13, 'column': 1 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 13, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 13, 'column': 1 } } };
const complexIfAnalyzedLines = [
    {line: 1, type: 'IfStatement', name: '', condition: '(X < V[mid])', value: ''},
    {line: 2, type: 'IfStatement', name: '', condition: 'b', value: ''},
    {line: 3, type: 'UpdateExpression', name: 'i', condition: '', value: '++i'},
    {line: 4, type: 'AssignmentExpression', name: 'high', condition: '', value: '(mid - 1)'},
    {line: 6, type: 'Else', name: '', condition: '', value: ''},
    {line: 6, type: 'IfStatement', name: '', condition: '(X > V[mid])', value: ''},
    {line: 7, type: 'AssignmentExpression', name: 'low', condition: '', value: '(mid + 1)'},
    {line: 8, type: 'UpdateExpression', name: 'V[5]', condition: '', value: 'V[5]++'},
    {line: 10, type: 'Else', name: '', condition: '', value: ''},
    {line: 11, type: 'UpdateExpression', name: 'i', condition: '', value: 'i--'},
    {line: 12, type: 'UpdateExpression', name: 'a', condition: '', value: 'a++'},
];

describe('Testing ifs', () => {
    it('Parsing simple if correctly', () => {
        testProgram(simpleIfProgram, simpleIfAnalyzedLines);
    });

    it('Parsing complex if correctly', function () {
        testProgram(complexIfProgram, complexIfAnalyzedLines);
    });
});

const simpleFunctionProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'add', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 1, 'column': 17 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'init': null, 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 10 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 3, 'column': 11 }, 'end': { 'line': 3, 'column': 12 } } }, 'right': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 3, 'column': 15 }, 'end': { 'line': 3, 'column': 16 } } }, 'loc': { 'start': { 'line': 3, 'column': 11 }, 'end': { 'line': 3, 'column': 16 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 17 } } } ], 'loc': { 'start': { 'line': 1, 'column': 19 }, 'end': { 'line': 4, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 4, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 4, 'column': 1 } } };
const simpleFunctionAnalyzedLines = [
    {line: 1, type: 'FunctionDeclaration', name: 'add', condition: '', value: ''},
    {line: 1, type: 'VariableDeclarator', name: 'x', condition: '', value: 'null'},
    {line: 1, type: 'VariableDeclarator', name: 'y', condition: '', value: 'null'},
    {line: 2, type: 'VariableDeclarator', name: 'a', condition: '', value: 'null'},
    {line: 3, type: 'ReturnStatement', name: '', condition: '', value: '(x + y)'}
];
const conditionalProgram = { 'type': 'Program', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'ConditionalExpression', 'test': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 1, 'column': 1 }, 'end': { 'line': 1, 'column': 5 } } }, 'consequent': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 1, 'column': 8 }, 'end': { 'line': 1, 'column': 9 } } }, 'alternate': { 'type': 'UnaryExpression', 'operator': '-', 'argument': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, 'prefix': true, 'loc': { 'start': { 'line': 1, 'column': 12 }, 'end': { 'line': 1, 'column': 14 } } }, 'loc': { 'start': { 'line': 1, 'column': 1 }, 'end': { 'line': 1, 'column': 14 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 16 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 16 } } };
const conditionalAnalyzedLines = [{line: 1, type: 'ConditionalExpression', name: '', condition: 'true', value: ''}];

describe('Testing functions', () => {
    it('Parsing simple function correctly', function () {
        testProgram(simpleFunctionProgram, simpleFunctionAnalyzedLines);
    });

    it('Parsing conditional expression correctly', function () {
        testProgram(conditionalProgram, conditionalAnalyzedLines);
    });
});

const emptyProgram = { 'type': 'Program', 'body': [], 'sourceType': 'script', 'loc': { 'start': { 'line': 0, 'column': 0 }, 'end': { 'line': 0, 'column': 0 } } };
const emptyProgramAnalyzedLines = [];

describe('Testing an empty program', () => {
    it('Parsing an empty program correctly', function () {
        testProgram(emptyProgram, emptyProgramAnalyzedLines);
    });
});