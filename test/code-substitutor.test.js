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
params: *NONE*
 */

const emptyProgram = { 'type': 'Program', 'body': [], 'sourceType': 'script', 'loc': { 'start': { 'line': 0, 'column': 0 }, 'end': { 'line': 0, 'column': 0 } } };
const emptyProgramParams = '';
const emptyProgramValuedLines = [];

describe('Testing empty program', function () {
    it('should return an empty array', function () {
        testSubstitution(emptyProgram, emptyProgramParams, emptyProgramValuedLines);
    });
});

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
function foo(x, y, z) {
    let a;
    a = 1;
    a = a + 1;
    let b = 2;
    b = ((b * a) / 2) ** 2;
    x = x + b;
    x++;
    return x;
    y[0]++;
    y[0]--;
    y[1]++;
    --y[0];
    x--;
    ++x;
    x[0]++;
    z++;
    [1,2][0]++;
}
params: x=1; y=[1,false]; z=false
 */
const varAssignmentProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 1, 'column': 17 } } }, { 'type': 'Identifier', 'name': 'z', 'loc': { 'start': { 'line': 1, 'column': 19 }, 'end': { 'line': 1, 'column': 20 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'init': null, 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 10 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 5 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 9 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 10 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 5 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 4, 'column': 12 }, 'end': { 'line': 4, 'column': 13 } } }, 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 13 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 13 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 14 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 9 } } }, 'init': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 13 } } }, 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 13 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 14 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 5 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '**', 'left': { 'type': 'BinaryExpression', 'operator': '/', 'left': { 'type': 'BinaryExpression', 'operator': '*', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 6, 'column': 10 }, 'end': { 'line': 6, 'column': 11 } } }, 'right': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 6, 'column': 14 }, 'end': { 'line': 6, 'column': 15 } } }, 'loc': { 'start': { 'line': 6, 'column': 10 }, 'end': { 'line': 6, 'column': 15 } } }, 'right': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 6, 'column': 19 }, 'end': { 'line': 6, 'column': 20 } } }, 'loc': { 'start': { 'line': 6, 'column': 9 }, 'end': { 'line': 6, 'column': 20 } } }, 'right': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 6, 'column': 25 }, 'end': { 'line': 6, 'column': 26 } } }, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 26 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 26 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 27 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 5 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 9 } } }, 'right': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 7, 'column': 12 }, 'end': { 'line': 7, 'column': 13 } } }, 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 13 } } }, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 13 } } }, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 14 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 5 } } }, 'prefix': false, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 7 } } }, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 8 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 9, 'column': 11 }, 'end': { 'line': 9, 'column': 12 } } }, 'loc': { 'start': { 'line': 9, 'column': 4 }, 'end': { 'line': 9, 'column': 13 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 10, 'column': 4 }, 'end': { 'line': 10, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 10, 'column': 6 }, 'end': { 'line': 10, 'column': 7 } } }, 'loc': { 'start': { 'line': 10, 'column': 4 }, 'end': { 'line': 10, 'column': 8 } } }, 'prefix': false, 'loc': { 'start': { 'line': 10, 'column': 4 }, 'end': { 'line': 10, 'column': 10 } } }, 'loc': { 'start': { 'line': 10, 'column': 4 }, 'end': { 'line': 10, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '--', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 11, 'column': 6 }, 'end': { 'line': 11, 'column': 7 } } }, 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 8 } } }, 'prefix': false, 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 10 } } }, 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 12, 'column': 6 }, 'end': { 'line': 12, 'column': 7 } } }, 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 8 } } }, 'prefix': false, 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 10 } } }, 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '--', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 13, 'column': 6 }, 'end': { 'line': 13, 'column': 7 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 13, 'column': 8 }, 'end': { 'line': 13, 'column': 9 } } }, 'loc': { 'start': { 'line': 13, 'column': 6 }, 'end': { 'line': 13, 'column': 10 } } }, 'prefix': true, 'loc': { 'start': { 'line': 13, 'column': 4 }, 'end': { 'line': 13, 'column': 10 } } }, 'loc': { 'start': { 'line': 13, 'column': 4 }, 'end': { 'line': 13, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '--', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 14, 'column': 4 }, 'end': { 'line': 14, 'column': 5 } } }, 'prefix': false, 'loc': { 'start': { 'line': 14, 'column': 4 }, 'end': { 'line': 14, 'column': 7 } } }, 'loc': { 'start': { 'line': 14, 'column': 4 }, 'end': { 'line': 14, 'column': 8 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 15, 'column': 6 }, 'end': { 'line': 15, 'column': 7 } } }, 'prefix': true, 'loc': { 'start': { 'line': 15, 'column': 4 }, 'end': { 'line': 15, 'column': 7 } } }, 'loc': { 'start': { 'line': 15, 'column': 4 }, 'end': { 'line': 15, 'column': 8 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 16, 'column': 4 }, 'end': { 'line': 16, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 16, 'column': 6 }, 'end': { 'line': 16, 'column': 7 } } }, 'loc': { 'start': { 'line': 16, 'column': 4 }, 'end': { 'line': 16, 'column': 8 } } }, 'prefix': false, 'loc': { 'start': { 'line': 16, 'column': 4 }, 'end': { 'line': 16, 'column': 10 } } }, 'loc': { 'start': { 'line': 16, 'column': 4 }, 'end': { 'line': 16, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'z', 'loc': { 'start': { 'line': 17, 'column': 4 }, 'end': { 'line': 17, 'column': 5 } } }, 'prefix': false, 'loc': { 'start': { 'line': 17, 'column': 4 }, 'end': { 'line': 17, 'column': 7 } } }, 'loc': { 'start': { 'line': 17, 'column': 4 }, 'end': { 'line': 17, 'column': 8 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 18, 'column': 5 }, 'end': { 'line': 18, 'column': 6 } } }, { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 18, 'column': 7 }, 'end': { 'line': 18, 'column': 8 } } } ], 'loc': { 'start': { 'line': 18, 'column': 4 }, 'end': { 'line': 18, 'column': 9 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 18, 'column': 10 }, 'end': { 'line': 18, 'column': 11 } } }, 'loc': { 'start': { 'line': 18, 'column': 4 }, 'end': { 'line': 18, 'column': 12 } } }, 'prefix': false, 'loc': { 'start': { 'line': 18, 'column': 4 }, 'end': { 'line': 18, 'column': 14 } } }, 'loc': { 'start': { 'line': 18, 'column': 4 }, 'end': { 'line': 18, 'column': 15 } } } ], 'loc': { 'start': { 'line': 1, 'column': 22 }, 'end': { 'line': 19, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 19, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 19, 'column': 1 } } };
const varAssignmentParams = 'x = 1;y=[1,false];z=false';
const varAssignmentValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 7, type: 'AssignmentExpression', name: 'x', condition: '', value: '(x + (((2 * (1 + 1)) / 2) ** 2))'},
        value: 0
    },
    {
        analyzedLine: {line: 8, type: 'UpdateExpression', name: 'x', condition: '', value: 'x++'},
        value: 0
    },
    {
        analyzedLine: {line: 9, type: 'ReturnStatement', name: '', condition: '', value: 'x'},
        value: 6
    },
    {
        analyzedLine: {line: 10, type: 'UpdateExpression', name: 'y[0]', condition: '', value: 'y[0]++'},
        value: 0
    },
    {
        analyzedLine: {line: 11, type: 'UpdateExpression', name: 'y[0]', condition: '', value: 'y[0]--'},
        value: 0
    },
    {
        analyzedLine: {line: 12, type: 'UpdateExpression', name: 'y[1]', condition: '', value: 'y[1]++'},
        value: 0
    },
    {
        analyzedLine: {line: 13, type: 'UpdateExpression', name: 'y[0]', condition: '', value: '--y[0]'},
        value: 0
    },
    {
        analyzedLine: {line: 14, type: 'UpdateExpression', name: 'x', condition: '', value: 'x--'},
        value: 0
    },
    {
        analyzedLine: {line: 15, type: 'UpdateExpression', name: 'x', condition: '', value: '++x'},
        value: 0
    },
    {
        analyzedLine: {line: 16, type: 'UpdateExpression', name: 'x[0]', condition: '', value: 'x[0]++'},
        value: 0
    },
    {
        analyzedLine: {line: 17, type: 'UpdateExpression', name: 'z', condition: '', value: 'z++'},
        value: 0
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

/* CODE:
function foo(x) {
    if (true) {
        x += 1;
        a += x;
    }

    if (x[0])
        return 0;
    else if (x[1]) {
        ([0, 1, 2][1]);
        if (x[0] || x[1])
            return x[1];
        else
            return (x[0] ? 9 : 11);

        ([0, 1, 2][2]);
    }
    return 1;
}
params: x=[true, false]
 */
const ifProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'IfStatement', 'test': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 12 } } }, 'consequent': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '+=', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 3, 'column': 13 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 15 } } } ], 'loc': { 'start': { 'line': 2, 'column': 14 }, 'end': { 'line': 4, 'column': 5 } } }, 'alternate': null, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 4, 'column': 5 } } }, { 'type': 'IfStatement', 'test': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 9 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 6, 'column': 10 }, 'end': { 'line': 6, 'column': 11 } } }, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 12 } } }, 'consequent': { 'type': 'ReturnStatement', 'argument': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 7, 'column': 15 }, 'end': { 'line': 7, 'column': 16 } } }, 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 17 } } }, 'alternate': { 'type': 'IfStatement', 'test': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 8, 'column': 13 }, 'end': { 'line': 8, 'column': 14 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 8, 'column': 15 }, 'end': { 'line': 8, 'column': 16 } } }, 'loc': { 'start': { 'line': 8, 'column': 13 }, 'end': { 'line': 8, 'column': 17 } } }, 'consequent': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 9, 'column': 10 }, 'end': { 'line': 9, 'column': 11 } } }, { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 9, 'column': 13 }, 'end': { 'line': 9, 'column': 14 } } }, { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 9, 'column': 16 }, 'end': { 'line': 9, 'column': 17 } } } ], 'loc': { 'start': { 'line': 9, 'column': 9 }, 'end': { 'line': 9, 'column': 18 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 9, 'column': 19 }, 'end': { 'line': 9, 'column': 20 } } }, 'loc': { 'start': { 'line': 9, 'column': 9 }, 'end': { 'line': 9, 'column': 21 } } }, 'loc': { 'start': { 'line': 9, 'column': 8 }, 'end': { 'line': 9, 'column': 23 } } }, { 'type': 'IfStatement', 'test': { 'type': 'LogicalExpression', 'operator': '||', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 10, 'column': 12 }, 'end': { 'line': 10, 'column': 13 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 10, 'column': 14 }, 'end': { 'line': 10, 'column': 15 } } }, 'loc': { 'start': { 'line': 10, 'column': 12 }, 'end': { 'line': 10, 'column': 16 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 10, 'column': 20 }, 'end': { 'line': 10, 'column': 21 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 10, 'column': 22 }, 'end': { 'line': 10, 'column': 23 } } }, 'loc': { 'start': { 'line': 10, 'column': 20 }, 'end': { 'line': 10, 'column': 24 } } }, 'loc': { 'start': { 'line': 10, 'column': 12 }, 'end': { 'line': 10, 'column': 24 } } }, 'consequent': { 'type': 'ReturnStatement', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 11, 'column': 19 }, 'end': { 'line': 11, 'column': 20 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 11, 'column': 21 }, 'end': { 'line': 11, 'column': 22 } } }, 'loc': { 'start': { 'line': 11, 'column': 19 }, 'end': { 'line': 11, 'column': 23 } } }, 'loc': { 'start': { 'line': 11, 'column': 12 }, 'end': { 'line': 11, 'column': 24 } } }, 'alternate': { 'type': 'ReturnStatement', 'argument': { 'type': 'ConditionalExpression', 'test': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 13, 'column': 20 }, 'end': { 'line': 13, 'column': 21 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 13, 'column': 22 }, 'end': { 'line': 13, 'column': 23 } } }, 'loc': { 'start': { 'line': 13, 'column': 20 }, 'end': { 'line': 13, 'column': 24 } } }, 'consequent': { 'type': 'Literal', 'value': 9, 'raw': '9', 'loc': { 'start': { 'line': 13, 'column': 27 }, 'end': { 'line': 13, 'column': 28 } } }, 'alternate': { 'type': 'Literal', 'value': 11, 'raw': '11', 'loc': { 'start': { 'line': 13, 'column': 31 }, 'end': { 'line': 13, 'column': 33 } } }, 'loc': { 'start': { 'line': 13, 'column': 20 }, 'end': { 'line': 13, 'column': 33 } } }, 'loc': { 'start': { 'line': 13, 'column': 12 }, 'end': { 'line': 13, 'column': 35 } } }, 'loc': { 'start': { 'line': 10, 'column': 8 }, 'end': { 'line': 13, 'column': 35 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 15, 'column': 10 }, 'end': { 'line': 15, 'column': 11 } } }, { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 15, 'column': 13 }, 'end': { 'line': 15, 'column': 14 } } }, { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 15, 'column': 16 }, 'end': { 'line': 15, 'column': 17 } } } ], 'loc': { 'start': { 'line': 15, 'column': 9 }, 'end': { 'line': 15, 'column': 18 } } }, 'property': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 15, 'column': 19 }, 'end': { 'line': 15, 'column': 20 } } }, 'loc': { 'start': { 'line': 15, 'column': 9 }, 'end': { 'line': 15, 'column': 21 } } }, 'loc': { 'start': { 'line': 15, 'column': 8 }, 'end': { 'line': 15, 'column': 23 } } } ], 'loc': { 'start': { 'line': 8, 'column': 19 }, 'end': { 'line': 16, 'column': 5 } } }, 'alternate': null, 'loc': { 'start': { 'line': 8, 'column': 9 }, 'end': { 'line': 16, 'column': 5 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 16, 'column': 5 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 17, 'column': 11 }, 'end': { 'line': 17, 'column': 12 } } }, 'loc': { 'start': { 'line': 17, 'column': 4 }, 'end': { 'line': 17, 'column': 13 } } } ], 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 18, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 18, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 18, 'column': 1 } } };
const ifProgramParams = 'x=[true, false]';
const ifProgramValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 2, type: 'IfStatement', name: '', condition: 'true', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 3, type: 'AssignmentExpression', name: 'x', condition: '', value: '(x + 1)'},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 6, type: 'IfStatement', name: '', condition: 'x[0]', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 7, type: 'ReturnStatement', name: '', condition: '', value: '0'},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'Else', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 8, type: 'IfStatement', name: '', condition: 'x[1]', value: ''},
        value: false
    },
    {
        analyzedLine: {line: 10, type: 'IfStatement', name: '', condition: '(x[0] || x[1])', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 11, type: 'ReturnStatement', name: '', condition: '', value: 'x[1]'},
        value: false
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'Else', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 13, type: 'ReturnStatement', name: '', condition: '', value: '(x[0] ? 9 : 11)'},
        value: 9
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 17, type: 'ReturnStatement', name: '', condition: '', value: '1'},
        value: 1
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing if statements', function () {
    it('should calculate if statements', function () {
        testSubstitution(ifProgram, ifProgramParams, ifProgramValuedLines);
    });
});

/* CODE:
function foo(x,y) {
    x[0] = x[1] || x[0];
    x[1] = x[0] && x[1];
    y[0] = x[0] + x[1];
    y[1] = 'abc' + y[1];
    y[2] += 'nbc';
    let a = y;
    if (5 < 4)
        return a[1];
    if (7 > 12)
        return a[2];
    if (4 >= 4)
        return a[0];
    return 7 <= 6;
    return '3' != 3;
    return '3' !== 3;
}
params: x=[true, false]; y=[1,2,3]
 */
const binaryOpProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 1, 'column': 15 }, 'end': { 'line': 1, 'column': 16 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 2, 'column': 6 }, 'end': { 'line': 2, 'column': 7 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 8 } } }, 'right': { 'type': 'LogicalExpression', 'operator': '||', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 12 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 14 } } }, 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 15 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 2, 'column': 19 }, 'end': { 'line': 2, 'column': 20 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 2, 'column': 21 }, 'end': { 'line': 2, 'column': 22 } } }, 'loc': { 'start': { 'line': 2, 'column': 19 }, 'end': { 'line': 2, 'column': 23 } } }, 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 23 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 23 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 24 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 3, 'column': 6 }, 'end': { 'line': 3, 'column': 7 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 8 } } }, 'right': { 'type': 'LogicalExpression', 'operator': '&&', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 3, 'column': 11 }, 'end': { 'line': 3, 'column': 12 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 3, 'column': 13 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 11 }, 'end': { 'line': 3, 'column': 15 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 3, 'column': 19 }, 'end': { 'line': 3, 'column': 20 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 3, 'column': 21 }, 'end': { 'line': 3, 'column': 22 } } }, 'loc': { 'start': { 'line': 3, 'column': 19 }, 'end': { 'line': 3, 'column': 23 } } }, 'loc': { 'start': { 'line': 3, 'column': 11 }, 'end': { 'line': 3, 'column': 23 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 23 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 24 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 4, 'column': 6 }, 'end': { 'line': 4, 'column': 7 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 8 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 4, 'column': 11 }, 'end': { 'line': 4, 'column': 12 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 4, 'column': 13 }, 'end': { 'line': 4, 'column': 14 } } }, 'loc': { 'start': { 'line': 4, 'column': 11 }, 'end': { 'line': 4, 'column': 15 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 4, 'column': 18 }, 'end': { 'line': 4, 'column': 19 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 4, 'column': 20 }, 'end': { 'line': 4, 'column': 21 } } }, 'loc': { 'start': { 'line': 4, 'column': 18 }, 'end': { 'line': 4, 'column': 22 } } }, 'loc': { 'start': { 'line': 4, 'column': 11 }, 'end': { 'line': 4, 'column': 22 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 22 } } }, 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 23 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 5, 'column': 6 }, 'end': { 'line': 5, 'column': 7 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 8 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Literal', 'value': 'abc', 'raw': '\'abc\'', 'loc': { 'start': { 'line': 5, 'column': 11 }, 'end': { 'line': 5, 'column': 16 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 5, 'column': 19 }, 'end': { 'line': 5, 'column': 20 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 5, 'column': 21 }, 'end': { 'line': 5, 'column': 22 } } }, 'loc': { 'start': { 'line': 5, 'column': 19 }, 'end': { 'line': 5, 'column': 23 } } }, 'loc': { 'start': { 'line': 5, 'column': 11 }, 'end': { 'line': 5, 'column': 23 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 23 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 24 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '+=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 6, 'column': 6 }, 'end': { 'line': 6, 'column': 7 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 8 } } }, 'right': { 'type': 'Literal', 'value': 'nbc', 'raw': '\'nbc\'', 'loc': { 'start': { 'line': 6, 'column': 12 }, 'end': { 'line': 6, 'column': 17 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 17 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 18 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 9 } } }, 'init': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 7, 'column': 12 }, 'end': { 'line': 7, 'column': 13 } } }, 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 13 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 14 } } }, { 'type': 'IfStatement', 'test': { 'type': 'BinaryExpression', 'operator': '<', 'left': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 8, 'column': 12 }, 'end': { 'line': 8, 'column': 13 } } }, 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 13 } } }, 'consequent': { 'type': 'ReturnStatement', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 9, 'column': 15 }, 'end': { 'line': 9, 'column': 16 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 9, 'column': 17 }, 'end': { 'line': 9, 'column': 18 } } }, 'loc': { 'start': { 'line': 9, 'column': 15 }, 'end': { 'line': 9, 'column': 19 } } }, 'loc': { 'start': { 'line': 9, 'column': 8 }, 'end': { 'line': 9, 'column': 20 } } }, 'alternate': null, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 9, 'column': 20 } } }, { 'type': 'IfStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Literal', 'value': 7, 'raw': '7', 'loc': { 'start': { 'line': 10, 'column': 8 }, 'end': { 'line': 10, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 12, 'raw': '12', 'loc': { 'start': { 'line': 10, 'column': 12 }, 'end': { 'line': 10, 'column': 14 } } }, 'loc': { 'start': { 'line': 10, 'column': 8 }, 'end': { 'line': 10, 'column': 14 } } }, 'consequent': { 'type': 'ReturnStatement', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 11, 'column': 15 }, 'end': { 'line': 11, 'column': 16 } } }, 'property': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 11, 'column': 17 }, 'end': { 'line': 11, 'column': 18 } } }, 'loc': { 'start': { 'line': 11, 'column': 15 }, 'end': { 'line': 11, 'column': 19 } } }, 'loc': { 'start': { 'line': 11, 'column': 8 }, 'end': { 'line': 11, 'column': 20 } } }, 'alternate': null, 'loc': { 'start': { 'line': 10, 'column': 4 }, 'end': { 'line': 11, 'column': 20 } } }, { 'type': 'IfStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>=', 'left': { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 12, 'column': 8 }, 'end': { 'line': 12, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 12, 'column': 13 }, 'end': { 'line': 12, 'column': 14 } } }, 'loc': { 'start': { 'line': 12, 'column': 8 }, 'end': { 'line': 12, 'column': 14 } } }, 'consequent': { 'type': 'ReturnStatement', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 13, 'column': 15 }, 'end': { 'line': 13, 'column': 16 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 13, 'column': 17 }, 'end': { 'line': 13, 'column': 18 } } }, 'loc': { 'start': { 'line': 13, 'column': 15 }, 'end': { 'line': 13, 'column': 19 } } }, 'loc': { 'start': { 'line': 13, 'column': 8 }, 'end': { 'line': 13, 'column': 20 } } }, 'alternate': null, 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 13, 'column': 20 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'BinaryExpression', 'operator': '<=', 'left': { 'type': 'Literal', 'value': 7, 'raw': '7', 'loc': { 'start': { 'line': 14, 'column': 11 }, 'end': { 'line': 14, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 6, 'raw': '6', 'loc': { 'start': { 'line': 14, 'column': 16 }, 'end': { 'line': 14, 'column': 17 } } }, 'loc': { 'start': { 'line': 14, 'column': 11 }, 'end': { 'line': 14, 'column': 17 } } }, 'loc': { 'start': { 'line': 14, 'column': 4 }, 'end': { 'line': 14, 'column': 18 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'BinaryExpression', 'operator': '!=', 'left': { 'type': 'Literal', 'value': '3', 'raw': '\'3\'', 'loc': { 'start': { 'line': 15, 'column': 11 }, 'end': { 'line': 15, 'column': 14 } } }, 'right': { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 15, 'column': 18 }, 'end': { 'line': 15, 'column': 19 } } }, 'loc': { 'start': { 'line': 15, 'column': 11 }, 'end': { 'line': 15, 'column': 19 } } }, 'loc': { 'start': { 'line': 15, 'column': 4 }, 'end': { 'line': 15, 'column': 20 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'BinaryExpression', 'operator': '!==', 'left': { 'type': 'Literal', 'value': '3', 'raw': '\'3\'', 'loc': { 'start': { 'line': 16, 'column': 11 }, 'end': { 'line': 16, 'column': 14 } } }, 'right': { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 16, 'column': 19 }, 'end': { 'line': 16, 'column': 20 } } }, 'loc': { 'start': { 'line': 16, 'column': 11 }, 'end': { 'line': 16, 'column': 20 } } }, 'loc': { 'start': { 'line': 16, 'column': 4 }, 'end': { 'line': 16, 'column': 21 } } } ], 'loc': { 'start': { 'line': 1, 'column': 18 }, 'end': { 'line': 17, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 17, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 17, 'column': 1 } } };
const binaryOpParams = 'x=[true, false];y=[1,2,3]';
const binaryValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 2, type: 'AssignmentExpression', name: 'x[0]', condition: '', value: '(x[1] || x[0])'},
        value: 0
    },
    {
        analyzedLine: {line: 3, type: 'AssignmentExpression', name: 'x[1]', condition: '', value: '(x[0] && x[1])'},
        value: 0
    },
    {
        analyzedLine: {line: 4, type: 'AssignmentExpression', name: 'y[0]', condition: '', value: '(x[0] + x[1])'},
        value: 0
    },
    {
        analyzedLine: {line: 5, type: 'AssignmentExpression', name: 'y[1]', condition: '', value: '(\'abc\' + y[1])'},
        value: 0
    },
    {
        analyzedLine: {line: 6, type: 'AssignmentExpression', name: 'y[2]', condition: '', value: '(y[2] + \'nbc\')'},
        value: 0
    },
    {
        analyzedLine: {line: 8, type: 'IfStatement', name: '', condition: '(5 < 4)', value: ''},
        value: false
    },
    {
        analyzedLine: {line: 9, type: 'ReturnStatement', name: '', condition: '', value: 'y[1]'},
        value: 'abc2'
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 10, type: 'IfStatement', name: '', condition: '(7 > 12)', value: ''},
        value: false
    },
    {
        analyzedLine: {line: 11, type: 'ReturnStatement', name: '', condition: '', value: 'y[2]'},
        value: '3nbc'
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 12, type: 'IfStatement', name: '', condition: '(4 >= 4)', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 13, type: 'ReturnStatement', name: '', condition: '', value: 'y[0]'},
        value: 'undefined operation: true + false'
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 14, type: 'ReturnStatement', name: '', condition: '', value: '(7 <= 6)'},
        value: false
    },
    {
        analyzedLine: {line: 15, type: 'ReturnStatement', name: '', condition: '', value: '(\'3\' != 3)'},
        value: false
    },
    {
        analyzedLine: {line: 16, type: 'ReturnStatement', name: '', condition: '', value: '(\'3\' !== 3)'},
        value: true
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing binary expressions', function () {
    it('should compute binary epxressions', function () {
        testSubstitution(binaryOpProgram, binaryOpParams, binaryValuedLines);
    });
});

/* CODE:
function foo(x,y) {
    while (x > 1) {
        y -= 1;
        while (y > 7)
            y -= 2;
        break;
    }
}
params: x=7;y=20
 */
const whileProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 1, 'column': 15 }, 'end': { 'line': 1, 'column': 16 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'WhileStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 2, 'column': 15 }, 'end': { 'line': 2, 'column': 16 } } }, 'loc': { 'start': { 'line': 2, 'column': 11 }, 'end': { 'line': 2, 'column': 16 } } }, 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '-=', 'left': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 3, 'column': 13 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 15 } } }, { 'type': 'WhileStatement', 'test': { 'type': 'BinaryExpression', 'operator': '>', 'left': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 4, 'column': 15 }, 'end': { 'line': 4, 'column': 16 } } }, 'right': { 'type': 'Literal', 'value': 7, 'raw': '7', 'loc': { 'start': { 'line': 4, 'column': 19 }, 'end': { 'line': 4, 'column': 20 } } }, 'loc': { 'start': { 'line': 4, 'column': 15 }, 'end': { 'line': 4, 'column': 20 } } }, 'body': { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '-=', 'left': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 13 } } }, 'right': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 5, 'column': 17 }, 'end': { 'line': 5, 'column': 18 } } }, 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 18 } } }, 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 19 } } }, 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 5, 'column': 19 } } }, { 'type': 'BreakStatement', 'label': null, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 14 } } } ], 'loc': { 'start': { 'line': 2, 'column': 18 }, 'end': { 'line': 7, 'column': 5 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 7, 'column': 5 } } } ], 'loc': { 'start': { 'line': 1, 'column': 18 }, 'end': { 'line': 8, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 8, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 8, 'column': 1 } } };
const whileProgramParams = 'x=7;y=20';
const whileProgramValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 2, type: 'WhileStatement', name: '', condition: '(x > 1)', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 3, type: 'AssignmentExpression', name: 'y', condition: '', value: '(y - 1)'},
        value: 0
    },
    {
        analyzedLine: {line: 4, type: 'WhileStatement', name: '', condition: '(y > 7)', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 5, type: 'AssignmentExpression', name: 'y', condition: '', value: '(y - 2)'},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 6, type: 'BreakStatement', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing while', function () {
    it('should calculate while statements', function () {
        testSubstitution(whileProgram, whileProgramParams, whileProgramValuedLines);
    });
});

/* CODE:
function foo() {
    let a = (x? false : true);
    do {
        [];
        7;
    } while (a);
    let b = [7, 5];
    b = b[1] + b[0];
    return b;
}
params: x=true
 */
var doWhileProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'init': { 'type': 'ConditionalExpression', 'test': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 14 } } }, 'consequent': { 'type': 'Literal', 'value': false, 'raw': 'false', 'loc': { 'start': { 'line': 2, 'column': 16 }, 'end': { 'line': 2, 'column': 21 } } }, 'alternate': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 2, 'column': 24 }, 'end': { 'line': 2, 'column': 28 } } }, 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 28 } } }, 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 29 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 30 } } }, { 'type': 'DoWhileStatement', 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'ArrayExpression', 'elements': [], 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 10 } } }, 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'Literal', 'value': 7, 'raw': '7', 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 9 } } }, 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 10 } } } ], 'loc': { 'start': { 'line': 3, 'column': 7 }, 'end': { 'line': 6, 'column': 5 } } }, 'test': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 6, 'column': 13 }, 'end': { 'line': 6, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 6, 'column': 16 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 9 } } }, 'init': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 7, 'raw': '7', 'loc': { 'start': { 'line': 7, 'column': 13 }, 'end': { 'line': 7, 'column': 14 } } }, { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 7, 'column': 16 }, 'end': { 'line': 7, 'column': 17 } } } ], 'loc': { 'start': { 'line': 7, 'column': 12 }, 'end': { 'line': 7, 'column': 18 } } }, 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 18 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 7, 'column': 19 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 5 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 9 } } }, 'property': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 8, 'column': 10 }, 'end': { 'line': 8, 'column': 11 } } }, 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 12 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 8, 'column': 15 }, 'end': { 'line': 8, 'column': 16 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 8, 'column': 17 }, 'end': { 'line': 8, 'column': 18 } } }, 'loc': { 'start': { 'line': 8, 'column': 15 }, 'end': { 'line': 8, 'column': 19 } } }, 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 19 } } }, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 19 } } }, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 20 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 9, 'column': 11 }, 'end': { 'line': 9, 'column': 12 } } }, 'loc': { 'start': { 'line': 9, 'column': 4 }, 'end': { 'line': 9, 'column': 13 } } } ], 'loc': { 'start': { 'line': 1, 'column': 15 }, 'end': { 'line': 10, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 10, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 10, 'column': 1 } } };
var doWhileParams = 'x=true';
var doWhileValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 3, type: 'DoWhileStatement', name: '', condition: '(x ? false : true)', value: ''},
        value: false
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'DoWhileEnd', name: '', condition: '(x ? false : true)', value: ''},
        value: false
    },
    {
        analyzedLine: {line: 9, type: 'ReturnStatement', name: '', condition: '', value: '([7, 5][1] + [7, 5][0])'},
        value: 12
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing do while', function () {
    it('should compute a do while statement', function () {
        testSubstitution(doWhileProgram, doWhileParams, doWhileValuedLines);
    });
});

/* CODE:
function foo(x, y) {
    for (let i = 0; i < 5; i = i + 1) {
        y = !y;
    }
    for (i = 0; i < 5; i = i + 1) {
        y = true;
    }
    return [2, 3, 6];
}
params: x=1; y=true
 */
const forProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } }, { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 1, 'column': 17 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'ForStatement', 'init': { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 14 } } }, 'init': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 2, 'column': 17 }, 'end': { 'line': 2, 'column': 18 } } }, 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 18 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 2, 'column': 9 }, 'end': { 'line': 2, 'column': 19 } } }, 'test': { 'type': 'BinaryExpression', 'operator': '<', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 2, 'column': 20 }, 'end': { 'line': 2, 'column': 21 } } }, 'right': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 2, 'column': 24 }, 'end': { 'line': 2, 'column': 25 } } }, 'loc': { 'start': { 'line': 2, 'column': 20 }, 'end': { 'line': 2, 'column': 25 } } }, 'update': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 2, 'column': 27 }, 'end': { 'line': 2, 'column': 28 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 2, 'column': 31 }, 'end': { 'line': 2, 'column': 32 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 2, 'column': 35 }, 'end': { 'line': 2, 'column': 36 } } }, 'loc': { 'start': { 'line': 2, 'column': 31 }, 'end': { 'line': 2, 'column': 36 } } }, 'loc': { 'start': { 'line': 2, 'column': 27 }, 'end': { 'line': 2, 'column': 36 } } }, 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'right': { 'type': 'UnaryExpression', 'operator': '!', 'argument': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 3, 'column': 13 }, 'end': { 'line': 3, 'column': 14 } } }, 'prefix': true, 'loc': { 'start': { 'line': 3, 'column': 12 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 15 } } } ], 'loc': { 'start': { 'line': 2, 'column': 38 }, 'end': { 'line': 4, 'column': 5 } } }, 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 4, 'column': 5 } } }, { 'type': 'ForStatement', 'init': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 5, 'column': 9 }, 'end': { 'line': 5, 'column': 10 } } }, 'right': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 5, 'column': 13 }, 'end': { 'line': 5, 'column': 14 } } }, 'loc': { 'start': { 'line': 5, 'column': 9 }, 'end': { 'line': 5, 'column': 14 } } }, 'test': { 'type': 'BinaryExpression', 'operator': '<', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 5, 'column': 16 }, 'end': { 'line': 5, 'column': 17 } } }, 'right': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 5, 'column': 20 }, 'end': { 'line': 5, 'column': 21 } } }, 'loc': { 'start': { 'line': 5, 'column': 16 }, 'end': { 'line': 5, 'column': 21 } } }, 'update': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 5, 'column': 23 }, 'end': { 'line': 5, 'column': 24 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Identifier', 'name': 'i', 'loc': { 'start': { 'line': 5, 'column': 27 }, 'end': { 'line': 5, 'column': 28 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 5, 'column': 31 }, 'end': { 'line': 5, 'column': 32 } } }, 'loc': { 'start': { 'line': 5, 'column': 27 }, 'end': { 'line': 5, 'column': 32 } } }, 'loc': { 'start': { 'line': 5, 'column': 23 }, 'end': { 'line': 5, 'column': 32 } } }, 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 6, 'column': 12 }, 'end': { 'line': 6, 'column': 16 } } }, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 16 } } }, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 17 } } } ], 'loc': { 'start': { 'line': 5, 'column': 34 }, 'end': { 'line': 7, 'column': 5 } } }, 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 7, 'column': 5 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 8, 'column': 12 }, 'end': { 'line': 8, 'column': 13 } } }, { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 8, 'column': 15 }, 'end': { 'line': 8, 'column': 16 } } }, { 'type': 'Literal', 'value': 6, 'raw': '6', 'loc': { 'start': { 'line': 8, 'column': 18 }, 'end': { 'line': 8, 'column': 19 } } } ], 'loc': { 'start': { 'line': 8, 'column': 11 }, 'end': { 'line': 8, 'column': 20 } } }, 'loc': { 'start': { 'line': 8, 'column': 4 }, 'end': { 'line': 8, 'column': 21 } } } ], 'loc': { 'start': { 'line': 1, 'column': 19 }, 'end': { 'line': 9, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 9, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 9, 'column': 1 } } };
const forProgramParams = 'x=1; y=true';
const forProgramValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 2, type: 'ForStatement', name: '', condition: '(0 < 5)', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 3, type: 'AssignmentExpression', name: 'y', condition: '', value: '!y'},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 5, type: 'ForStatement', name: '', condition: '(0 < 5)', value: ''},
        value: true
    },
    {
        analyzedLine: {line: 6, type: 'AssignmentExpression', name: 'y', condition: '', value: 'true'},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 8, type: 'ReturnStatement', name: '', condition: '', value: '[2, 3, 6]'},
        value: [2, 3, 6]
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing for loop', function () {
    it('should compute for loop', function () {
        testSubstitution(forProgram, forProgramParams, forProgramValuedLines);
    });
});

/* CODE:
function foo(x) {
    let a = (false ? true : false);
    let b = !a;
    let c = -x;
    let d = [1,2]['a'];
    x = a[0];
    if (a)
        return a;
    if (5 && 9)
        return [1,2] + [3,4];
    a = x++;
    return 5 == 4;
    y = (false ? true : false);
    return -5;
    return !true;
    return +7;
    return [1,2][false];
    return 5 === 5;
    return ++x;
    return b[0];
    return !5;
    x = [4,5][0];
    x = [];
    [1,2][0] = 1;
    x = [4,5];
    x[false] = 1;
    let a = [1,2];
    a[0]++;
}
params: x=1;y=3
 */
const errorTestingProgram = { 'type': 'Program', 'body': [ { 'type': 'FunctionDeclaration', 'id': { 'type': 'Identifier', 'name': 'foo', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 12 } } }, 'params': [ { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 1, 'column': 13 }, 'end': { 'line': 1, 'column': 14 } } } ], 'body': { 'type': 'BlockStatement', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 9 } } }, 'init': { 'type': 'ConditionalExpression', 'test': { 'type': 'Literal', 'value': false, 'raw': 'false', 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 18 } } }, 'consequent': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 2, 'column': 21 }, 'end': { 'line': 2, 'column': 25 } } }, 'alternate': { 'type': 'Literal', 'value': false, 'raw': 'false', 'loc': { 'start': { 'line': 2, 'column': 28 }, 'end': { 'line': 2, 'column': 33 } } }, 'loc': { 'start': { 'line': 2, 'column': 13 }, 'end': { 'line': 2, 'column': 33 } } }, 'loc': { 'start': { 'line': 2, 'column': 8 }, 'end': { 'line': 2, 'column': 34 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 2, 'column': 4 }, 'end': { 'line': 2, 'column': 35 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 9 } } }, 'init': { 'type': 'UnaryExpression', 'operator': '!', 'argument': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 3, 'column': 13 }, 'end': { 'line': 3, 'column': 14 } } }, 'prefix': true, 'loc': { 'start': { 'line': 3, 'column': 12 }, 'end': { 'line': 3, 'column': 14 } } }, 'loc': { 'start': { 'line': 3, 'column': 8 }, 'end': { 'line': 3, 'column': 14 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 3, 'column': 4 }, 'end': { 'line': 3, 'column': 15 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'c', 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 9 } } }, 'init': { 'type': 'UnaryExpression', 'operator': '-', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 4, 'column': 13 }, 'end': { 'line': 4, 'column': 14 } } }, 'prefix': true, 'loc': { 'start': { 'line': 4, 'column': 12 }, 'end': { 'line': 4, 'column': 14 } } }, 'loc': { 'start': { 'line': 4, 'column': 8 }, 'end': { 'line': 4, 'column': 14 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 4, 'column': 4 }, 'end': { 'line': 4, 'column': 15 } } }, { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'd', 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 9 } } }, 'init': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 5, 'column': 13 }, 'end': { 'line': 5, 'column': 14 } } }, { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 5, 'column': 15 }, 'end': { 'line': 5, 'column': 16 } } } ], 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 17 } } }, 'property': { 'type': 'Literal', 'value': 'a', 'raw': '\'a\'', 'loc': { 'start': { 'line': 5, 'column': 18 }, 'end': { 'line': 5, 'column': 21 } } }, 'loc': { 'start': { 'line': 5, 'column': 12 }, 'end': { 'line': 5, 'column': 22 } } }, 'loc': { 'start': { 'line': 5, 'column': 8 }, 'end': { 'line': 5, 'column': 22 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 5, 'column': 4 }, 'end': { 'line': 5, 'column': 23 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 5 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 9 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 6, 'column': 10 }, 'end': { 'line': 6, 'column': 11 } } }, 'loc': { 'start': { 'line': 6, 'column': 8 }, 'end': { 'line': 6, 'column': 12 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 12 } } }, 'loc': { 'start': { 'line': 6, 'column': 4 }, 'end': { 'line': 6, 'column': 13 } } }, { 'type': 'IfStatement', 'test': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 7, 'column': 8 }, 'end': { 'line': 7, 'column': 9 } } }, 'consequent': { 'type': 'ReturnStatement', 'argument': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 8, 'column': 15 }, 'end': { 'line': 8, 'column': 16 } } }, 'loc': { 'start': { 'line': 8, 'column': 8 }, 'end': { 'line': 8, 'column': 17 } } }, 'alternate': null, 'loc': { 'start': { 'line': 7, 'column': 4 }, 'end': { 'line': 8, 'column': 17 } } }, { 'type': 'IfStatement', 'test': { 'type': 'LogicalExpression', 'operator': '&&', 'left': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 9, 'column': 8 }, 'end': { 'line': 9, 'column': 9 } } }, 'right': { 'type': 'Literal', 'value': 9, 'raw': '9', 'loc': { 'start': { 'line': 9, 'column': 13 }, 'end': { 'line': 9, 'column': 14 } } }, 'loc': { 'start': { 'line': 9, 'column': 8 }, 'end': { 'line': 9, 'column': 14 } } }, 'consequent': { 'type': 'ReturnStatement', 'argument': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 10, 'column': 16 }, 'end': { 'line': 10, 'column': 17 } } }, { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 10, 'column': 18 }, 'end': { 'line': 10, 'column': 19 } } } ], 'loc': { 'start': { 'line': 10, 'column': 15 }, 'end': { 'line': 10, 'column': 20 } } }, 'right': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 10, 'column': 24 }, 'end': { 'line': 10, 'column': 25 } } }, { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 10, 'column': 26 }, 'end': { 'line': 10, 'column': 27 } } } ], 'loc': { 'start': { 'line': 10, 'column': 23 }, 'end': { 'line': 10, 'column': 28 } } }, 'loc': { 'start': { 'line': 10, 'column': 15 }, 'end': { 'line': 10, 'column': 28 } } }, 'loc': { 'start': { 'line': 10, 'column': 8 }, 'end': { 'line': 10, 'column': 29 } } }, 'alternate': null, 'loc': { 'start': { 'line': 9, 'column': 4 }, 'end': { 'line': 10, 'column': 29 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 5 } } }, 'right': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 11, 'column': 8 }, 'end': { 'line': 11, 'column': 9 } } }, 'prefix': false, 'loc': { 'start': { 'line': 11, 'column': 8 }, 'end': { 'line': 11, 'column': 11 } } }, 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 11 } } }, 'loc': { 'start': { 'line': 11, 'column': 4 }, 'end': { 'line': 11, 'column': 12 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'BinaryExpression', 'operator': '==', 'left': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 12, 'column': 11 }, 'end': { 'line': 12, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 12, 'column': 16 }, 'end': { 'line': 12, 'column': 17 } } }, 'loc': { 'start': { 'line': 12, 'column': 11 }, 'end': { 'line': 12, 'column': 17 } } }, 'loc': { 'start': { 'line': 12, 'column': 4 }, 'end': { 'line': 12, 'column': 18 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'y', 'loc': { 'start': { 'line': 13, 'column': 4 }, 'end': { 'line': 13, 'column': 5 } } }, 'right': { 'type': 'ConditionalExpression', 'test': { 'type': 'Literal', 'value': false, 'raw': 'false', 'loc': { 'start': { 'line': 13, 'column': 9 }, 'end': { 'line': 13, 'column': 14 } } }, 'consequent': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 13, 'column': 17 }, 'end': { 'line': 13, 'column': 21 } } }, 'alternate': { 'type': 'Literal', 'value': false, 'raw': 'false', 'loc': { 'start': { 'line': 13, 'column': 24 }, 'end': { 'line': 13, 'column': 29 } } }, 'loc': { 'start': { 'line': 13, 'column': 9 }, 'end': { 'line': 13, 'column': 29 } } }, 'loc': { 'start': { 'line': 13, 'column': 4 }, 'end': { 'line': 13, 'column': 30 } } }, 'loc': { 'start': { 'line': 13, 'column': 4 }, 'end': { 'line': 13, 'column': 31 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'UnaryExpression', 'operator': '-', 'argument': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 14, 'column': 12 }, 'end': { 'line': 14, 'column': 13 } } }, 'prefix': true, 'loc': { 'start': { 'line': 14, 'column': 11 }, 'end': { 'line': 14, 'column': 13 } } }, 'loc': { 'start': { 'line': 14, 'column': 4 }, 'end': { 'line': 14, 'column': 14 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'UnaryExpression', 'operator': '!', 'argument': { 'type': 'Literal', 'value': true, 'raw': 'true', 'loc': { 'start': { 'line': 15, 'column': 12 }, 'end': { 'line': 15, 'column': 16 } } }, 'prefix': true, 'loc': { 'start': { 'line': 15, 'column': 11 }, 'end': { 'line': 15, 'column': 16 } } }, 'loc': { 'start': { 'line': 15, 'column': 4 }, 'end': { 'line': 15, 'column': 17 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'UnaryExpression', 'operator': '+', 'argument': { 'type': 'Literal', 'value': 7, 'raw': '7', 'loc': { 'start': { 'line': 16, 'column': 12 }, 'end': { 'line': 16, 'column': 13 } } }, 'prefix': true, 'loc': { 'start': { 'line': 16, 'column': 11 }, 'end': { 'line': 16, 'column': 13 } } }, 'loc': { 'start': { 'line': 16, 'column': 4 }, 'end': { 'line': 16, 'column': 14 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 17, 'column': 12 }, 'end': { 'line': 17, 'column': 13 } } }, { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 17, 'column': 14 }, 'end': { 'line': 17, 'column': 15 } } } ], 'loc': { 'start': { 'line': 17, 'column': 11 }, 'end': { 'line': 17, 'column': 16 } } }, 'property': { 'type': 'Literal', 'value': false, 'raw': 'false', 'loc': { 'start': { 'line': 17, 'column': 17 }, 'end': { 'line': 17, 'column': 22 } } }, 'loc': { 'start': { 'line': 17, 'column': 11 }, 'end': { 'line': 17, 'column': 23 } } }, 'loc': { 'start': { 'line': 17, 'column': 4 }, 'end': { 'line': 17, 'column': 24 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'BinaryExpression', 'operator': '===', 'left': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 18, 'column': 11 }, 'end': { 'line': 18, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 18, 'column': 17 }, 'end': { 'line': 18, 'column': 18 } } }, 'loc': { 'start': { 'line': 18, 'column': 11 }, 'end': { 'line': 18, 'column': 18 } } }, 'loc': { 'start': { 'line': 18, 'column': 4 }, 'end': { 'line': 18, 'column': 19 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'UpdateExpression', 'operator': '++', 'argument': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 19, 'column': 13 }, 'end': { 'line': 19, 'column': 14 } } }, 'prefix': true, 'loc': { 'start': { 'line': 19, 'column': 11 }, 'end': { 'line': 19, 'column': 14 } } }, 'loc': { 'start': { 'line': 19, 'column': 4 }, 'end': { 'line': 19, 'column': 15 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 20, 'column': 11 }, 'end': { 'line': 20, 'column': 12 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 20, 'column': 13 }, 'end': { 'line': 20, 'column': 14 } } }, 'loc': { 'start': { 'line': 20, 'column': 11 }, 'end': { 'line': 20, 'column': 15 } } }, 'loc': { 'start': { 'line': 20, 'column': 4 }, 'end': { 'line': 20, 'column': 16 } } }, { 'type': 'ReturnStatement', 'argument': { 'type': 'UnaryExpression', 'operator': '!', 'argument': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 21, 'column': 12 }, 'end': { 'line': 21, 'column': 13 } } }, 'prefix': true, 'loc': { 'start': { 'line': 21, 'column': 11 }, 'end': { 'line': 21, 'column': 13 } } }, 'loc': { 'start': { 'line': 21, 'column': 4 }, 'end': { 'line': 21, 'column': 14 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 22, 'column': 4 }, 'end': { 'line': 22, 'column': 5 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 22, 'column': 9 }, 'end': { 'line': 22, 'column': 10 } } }, { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 22, 'column': 11 }, 'end': { 'line': 22, 'column': 12 } } } ], 'loc': { 'start': { 'line': 22, 'column': 8 }, 'end': { 'line': 22, 'column': 13 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 22, 'column': 14 }, 'end': { 'line': 22, 'column': 15 } } }, 'loc': { 'start': { 'line': 22, 'column': 8 }, 'end': { 'line': 22, 'column': 16 } } }, 'loc': { 'start': { 'line': 22, 'column': 4 }, 'end': { 'line': 22, 'column': 16 } } }, 'loc': { 'start': { 'line': 22, 'column': 4 }, 'end': { 'line': 22, 'column': 17 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 23, 'column': 4 }, 'end': { 'line': 23, 'column': 5 } } }, 'right': { 'type': 'ArrayExpression', 'elements': [], 'loc': { 'start': { 'line': 23, 'column': 8 }, 'end': { 'line': 23, 'column': 10 } } }, 'loc': { 'start': { 'line': 23, 'column': 4 }, 'end': { 'line': 23, 'column': 10 } } }, 'loc': { 'start': { 'line': 23, 'column': 4 }, 'end': { 'line': 23, 'column': 11 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 24, 'column': 5 }, 'end': { 'line': 24, 'column': 6 } } }, { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 24, 'column': 7 }, 'end': { 'line': 24, 'column': 8 } } } ], 'loc': { 'start': { 'line': 24, 'column': 4 }, 'end': { 'line': 24, 'column': 9 } } }, 'property': { 'type': 'Literal', 'value': 0, 'raw': '0', 'loc': { 'start': { 'line': 24, 'column': 10 }, 'end': { 'line': 24, 'column': 11 } } }, 'loc': { 'start': { 'line': 24, 'column': 4 }, 'end': { 'line': 24, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 24, 'column': 15 }, 'end': { 'line': 24, 'column': 16 } } }, 'loc': { 'start': { 'line': 24, 'column': 4 }, 'end': { 'line': 24, 'column': 16 } } }, 'loc': { 'start': { 'line': 24, 'column': 4 }, 'end': { 'line': 24, 'column': 17 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 25, 'column': 4 }, 'end': { 'line': 25, 'column': 5 } } }, 'right': { 'type': 'ArrayExpression', 'elements': [ { 'type': 'Literal', 'value': 4, 'raw': '4', 'loc': { 'start': { 'line': 25, 'column': 9 }, 'end': { 'line': 25, 'column': 10 } } }, { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 25, 'column': 11 }, 'end': { 'line': 25, 'column': 12 } } } ], 'loc': { 'start': { 'line': 25, 'column': 8 }, 'end': { 'line': 25, 'column': 13 } } }, 'loc': { 'start': { 'line': 25, 'column': 4 }, 'end': { 'line': 25, 'column': 13 } } }, 'loc': { 'start': { 'line': 25, 'column': 4 }, 'end': { 'line': 25, 'column': 14 } } }, { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'x', 'loc': { 'start': { 'line': 26, 'column': 4 }, 'end': { 'line': 26, 'column': 5 } } }, 'property': { 'type': 'Literal', 'value': false, 'raw': 'false', 'loc': { 'start': { 'line': 26, 'column': 6 }, 'end': { 'line': 26, 'column': 11 } } }, 'loc': { 'start': { 'line': 26, 'column': 4 }, 'end': { 'line': 26, 'column': 12 } } }, 'right': { 'type': 'Literal', 'value': 1, 'raw': '1', 'loc': { 'start': { 'line': 26, 'column': 15 }, 'end': { 'line': 26, 'column': 16 } } }, 'loc': { 'start': { 'line': 26, 'column': 4 }, 'end': { 'line': 26, 'column': 16 } } }, 'loc': { 'start': { 'line': 26, 'column': 4 }, 'end': { 'line': 26, 'column': 17 } } } ], 'loc': { 'start': { 'line': 1, 'column': 16 }, 'end': { 'line': 27, 'column': 1 } } }, 'generator': false, 'expression': false, 'async': false, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 27, 'column': 1 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 27, 'column': 1 } } };
const errorTestingParams = 'x=1;y=3';
const errorTestingValuedLines = [
    {
        analyzedLine: {line: 1, type: 'FunctionDeclaration', name: 'foo', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 6, type: 'AssignmentExpression', name: 'x', condition: '', value: '(false ? true : false)[0]'},
        value: 0
    },
    {
        analyzedLine: {line: 7, type: 'IfStatement', name: '', condition: '(false ? true : false)', value: ''},
        value: false
    },
    {
        analyzedLine: {line: 8, type: 'ReturnStatement', name: '', condition: '', value: '(false ? true : false)'},
        value: false
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 9, type: 'IfStatement', name: '', condition: '(5 && 9)', value: ''},
        value: 'error: && is undefined on non-booleans'
    },
    {
        analyzedLine: {line: 10, type: 'ReturnStatement', name: '', condition: '', value: '([1, 2] + [3, 4])'},
        value: 'undefined operation: 1,2 + 3,4'
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    },
    {
        analyzedLine: {line: 12, type: 'ReturnStatement', name: '', condition: '', value: '(5 == 4)'},
        value: false
    },
    {
        analyzedLine: {line: 13, type: 'AssignmentExpression', name: 'y', condition: '', value: '(false ? true : false)'},
        value: 0
    },
    {
        analyzedLine: {line: 14, type: 'ReturnStatement', name: '', condition: '', value: '-5'},
        value: -5
    },
    {
        analyzedLine: {line: 15, type: 'ReturnStatement', name: '', condition: '', value: '!true'},
        value: false
    },
    {
        analyzedLine: {line: 16, type: 'ReturnStatement', name: '', condition: '', value: '+7'},
        value: 7
    },
    {
        analyzedLine: {line: 17, type: 'ReturnStatement', name: '', condition: '', value: '[1, 2][false]'},
        value: 'error: no property false in array'
    },
    {
        analyzedLine: {line: 18, type: 'ReturnStatement', name: '', condition: '', value: '(5 === 5)'},
        value: true
    },
    {
        analyzedLine: {line: 19, type: 'ReturnStatement', name: '', condition: '', value: '++x'},
        value: 'unsupported: update expression'
    },
    {
        analyzedLine: {line: 20, type: 'ReturnStatement', name: '', condition: '', value: '!x++[0]'},
        value: 'error: not an array'
    },
    {
        analyzedLine: {line: 21, type: 'ReturnStatement', name: '', condition: '', value: '!5'},
        value: 'undefined operation: not on a non-boolean'
    },
    {
        analyzedLine: {line: 22, type: 'AssignmentExpression', name: 'x', condition: '', value: '[4, 5][0]'},
        value: 0
    },
    {
        analyzedLine: {line: 23, type: 'AssignmentExpression', name: 'x', condition: '', value: '[]'},
        value: 0
    },
    {
        analyzedLine: {line: 25, type: 'AssignmentExpression', name: 'x', condition: '', value: '[4, 5]'},
        value: 0
    },
    {
        analyzedLine: {line: 26, type: 'AssignmentExpression', name: 'x[false]', condition: '', value: '1'},
        value: 0
    },
    {
        analyzedLine: {line: -1, type: 'BlockClosing', name: '', condition: '', value: ''},
        value: 0
    }
];

describe('Testing error handling', function () {
    it('should produce error values', function () {
        testSubstitution(errorTestingProgram, errorTestingParams, errorTestingValuedLines);
    });
});