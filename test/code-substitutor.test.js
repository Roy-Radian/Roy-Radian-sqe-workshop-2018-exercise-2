import assert from 'assert';
import {substituteProgram, parseParams} from '../src/js/code-substitutor';
import {isProgram} from '../src/js/Expression-Types';

function testSubstitution(program, params, expectedSubstitution) {
    if (isProgram(program)) {
        assert.deepEqual(substituteProgram(program, parseParams(params)), expectedSubstitution);
    }
    else
        assert.fail();
}

/* CODE:
function foo() {
}
params: *NONE*
 */
const emptyFunctionProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } } ], 'body': { 'type': 'BlockStatement', 'body': [], 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 1, 'column': 18 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 18 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 18 } } };
const emptyFunctionParams = '';
const emptyFunctionValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];
describe('Testing an empty function', function () {
    it('should return only function lines', function () {
        testSubstitution(emptyFunctionProgram, emptyFunctionParams, emptyFunctionValuedLines);
    });
});

/* CODE:
function foo(x) {
    let a = 0;
    let b = 5;
    let c = a + b;
    let d = c + x;
    return d;
}
params: x = 1
 */
const varDeclarationProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'init': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 2, 'column': 12 }, 'end': { 'line': 2, 'column': 13 } } }, 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 13 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 14 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'init': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 3, 'column': 12 }, 'end': { 'line': 3, 'column': 13 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 13 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 14 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'c', 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 9 } } }, 'init': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 4, 'column': 12 }, 'end': { 'line': 4, 'column': 13 } } }, 'right': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 4, 'column': 16 }, 'end': { 'line': 4, 'column': 17 } } }, 'loc': { 'start': { 'line': 4, 'column': 12 }, 'end': { 'line': 4, 'column': 17 } } }, 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 17 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 18 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'd', 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 9 } } }, 'init': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'c', 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 13 } } }, 'right': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 5, 'column': 16 }, 'end': { 'line': 5, 'column': 17 } } }, 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 17 } } }, 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 17 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 18 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'Identifier', 'name': 'd', 'loc': { 'start': { 'line': 6, 'column': 11 }, 'end': { 'line': 6, 'column': 12 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 13 } } } ], 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 7, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 7, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 7, 'column': 1 } } };
const varDeclarationParams = 'x = 1';
const varDeclarationValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 6, type: 'ReturnStatement', name: '', condition: '', value: '((0 + 5) + x)'},
        value: 6
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing variable declaration', function () {
    it('should return only the function lines and the return statement', function () {
        testSubstitution(varDeclarationProgram, varDeclarationParams, varDeclarationValuedLines);
    });
});

/* CODE:
function foo(x) {
    let a;
    a = 1;
    a = a + 1;
    let b = 2;
    b = ((b * a) / 2) ** 2;
    x = x + b;
    return x;
}
 */
const varAssignmentProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'init': null, 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 10 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 5 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 9 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 10 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 5 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 4, 'column': 12 }, 'end': { 'line': 4, 'column': 13 } } }, 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 13 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 13 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 14 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 9 } } }, 'init': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 13 } } }, 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 13 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 14 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 5 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '**', 'left': { 'type': 'BinaryExpression', 'operator': '/', 'left': { 'type': 'BinaryExpression', 'operator': '*', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 6, 'column': 10 }, 'end': { 'line': 6, 'column': 11 } } }, 'right': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 6, 'column': 14 }, 'end': { 'line': 6, 'column': 15 } } }, 'loc': { 'start': { 'line': 6, 'column': 10 }, 'end': { 'line': 6, 'column': 15 } } }, 'right': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 6, 'column': 19 }, 'end': { 'line': 6, 'column': 20 } } }, 'loc': { 'start': { 'line': 6, 'column': 9 }, 'end': { 'line': 6, 'column': 20 } } }, 'right': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 6, 'column': 25 }, 'end': { 'line': 6, 'column': 26 } } }, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 26 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 26 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 27 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 5 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 9 } } }, 'right': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 7, 'column': 12 }, 'end': { 'line': 7, 'column': 13 } } }, 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 13 } } }, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 13 } } }, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 14 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 8, 'column': 11 }, 'end': { 'line': 8, 'column': 12 } } }, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 13 } } } ], 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 9, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 9, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 9, 'column': 1 } } };
const varAssignmentParams = 'x = 1';
const varAssignmentValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 7, type: 'AssignmentExpression', name: 'x', condition: '', value: '(x + (((2 * (1 + 1)) / 2) ** 2))'},
        value: 5
    },
    {
        analyzedLine: {line: 8, type: 'ReturnStatement', name: '', condition: '', value: 'x'},
        value: 5
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing assignment', function () {
    it('should compute assignments correctly', function () {
        testSubstitution(varAssignmentProgram, varAssignmentParams, varAssignmentValuedLines);
    });
});