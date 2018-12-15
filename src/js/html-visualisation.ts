import {AnalyzedLine, isProgram, programToAnalyzedLines} from './expression-analyzer';
import {parseParams, substituteProgram, ValuedLine, VarTuple} from './code-substitutor';

const analyzedLineToHtml = (line: AnalyzedLine): string =>
    `<tr><td>${line.line}</td><td>${line.type}</td><td>${line.name}</td><td>${line.condition}</td><td>${line.value}</td></tr>`;

const notAProgram: string = '<table><tr><td>Not a program!</td></tr>';
const headers: string = '<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>';
const concatStringTableEntries = (prev: string, curr: string): string => prev + curr;
const constructTable = (program: any): string =>
    isProgram(program) ? analyzedLinesIntoTable(programToAnalyzedLines(program)) :
        notAProgram;

let ident: number = 0;
const tabLength: number = 4;
const space: string = ' ';
const generateIdenttation = (): string => {
    let tab = "";
    for (let i = 0; i < ident; i++) {
        tab += space;
    }
    return tab;
}

const analyzedLinesIntoTable = (entries: AnalyzedLine[]): string =>
    entries.length > 0 ? '<table>' + headers + entries.map((tblEntry: AnalyzedLine): string => analyzedLineToHtml(tblEntry)).reduce(concatStringTableEntries) + '</table>' : '';


const atomicTypes = ['VariableDeclaration', 'AssignmentExpression', 'ReturnStatement', 'BreakStatement', 'DoWhileEnd', 'BlockClosing'];
const loopTypes = ['WhileStatement', 'DoWhileStatement', 'ForStatement'];
const computationTypes = ['BinaryExpression', 'UnaryExpresion', 'UpdateExpression'];
const valueTypes = ['Literal', 'Identifier', 'MemberExpression', 'ConditionalExpression'].concat(computationTypes);
const compoundTypes = ['FunctionDeclaration', 'IfStatement'].concat(valueTypes).concat(loopTypes);

const constructSubstitution = (program: any, params: string): string => {
    return isProgram(program) ? valuedLinesIntoTable(substituteProgram(program, parseParams(params)), paramsIntoList(parseParams(params))) :
        notAProgram;
}

const paramsIntoList = (params: VarTuple[]): string[] =>
    params.length == 0 ? [] :
    [params[0].name].concat(paramsIntoList(params.slice(1)));

const valuedLinesIntoTable = (lines: ValuedLine[], params: string[]): string =>
    lines.length > 0 ? '<table>' + lines.map((line: ValuedLine): string => valuedLineToHtml(line, params)).reduce(concatStringTableEntries) + '</table>' : '';

const valuedLineToHtml = (line: ValuedLine, params: string[]): string =>
    atomicTypes.indexOf(line.analyzedLine.type) != -1 ? valuedAtomicToHtml(line) :
    generateIdenttation() + valuedCompoundToHtml(line, params);

const valuedAtomicToHtml = (line: ValuedLine): string =>
    line.analyzedLine.type == 'VariableDeclaration' ? generateIdenttation() + valuedDeclarationToHtml(line) :
    line.analyzedLine.type == 'AssignmentExpression' ? generateIdenttation() +  valuedAssignmentToHtml(line) :
    line.analyzedLine.type == 'ReturnStatement' ? generateIdenttation() + valuedReturnStatementToHtml(line) :
    line.analyzedLine.type == 'BreakStatement' ? generateIdenttation() + valuedBreakToHtml(line) :
    line.analyzedLine.type == 'DoWhileEnd' ? doWhileEndToHtml(line) :
    blockClosingToHtml(line);

const valuedCompoundToHtml = (line: ValuedLine, params: string[]): string =>
    line.analyzedLine.type == 'FunctionDeclaration' ? valuedFuncToHtml(line, params) :
    line.analyzedLine.type == 'IfStatement' ? valuedIfToHtml(line) :
    valueTypes.indexOf(line.analyzedLine.type) != -1 ? valuedValueToHtml(line) :
    valuedLoopToHtml(line);

const valuedValueToHtml = (line: ValuedLine): string =>
    line.analyzedLine.type == 'UpdateExpression' ? valuedUpdateToHtml(line) :
    '';

const valuedLoopToHtml = (line: ValuedLine): string =>
    line.analyzedLine.type == 'WhileStatement' ? valuedWhileToHtml(line) :
    line.analyzedLine.type == 'DoWhileStatement' ? valuedDoWhileToHtml(line) :
    valuedForLineToHtml(line);

const valuedDeclarationToHtml = (line: ValuedLine): string =>
    `<tr><td>let ${line.analyzedLine.name} ${(line.value != 'null' ? ' = ' + line.analyzedLine.value : '')};</td></tr>`;

const valuedAssignmentToHtml = (line: ValuedLine): string =>
    `<tr><td>${line.analyzedLine.name} = ${line.analyzedLine.value};</td></tr>`;

const valuedReturnStatementToHtml = (line: ValuedLine): string =>
    `<tr><td>return ${line.analyzedLine.value};</td></tr>`;

const valuedBreakToHtml = (line: ValuedLine): string =>
    `<tr><td>break;</td></tr>`;

const doWhileEndToHtml = (line: ValuedLine): string => {
    ident -= tabLength;
    return generateIdenttation() + `<tr><td>} while (${line.analyzedLine.condition});</td></tr>`;
}

const blockClosingToHtml = (line: ValuedLine): string => {
    ident -= tabLength;
    return generateIdenttation() + `<tr><td>}</td></tr>`;
}

const valuedFuncToHtml = (line: ValuedLine, params: string[]): string => {
    ident += tabLength;
    return `<tr><td>function ${line.analyzedLine.name}(${params}) {</td></tr>`;
}

const valuedIfToHtml = (line: ValuedLine): string => {
    ident += tabLength;
    return `<tr><td>if (${line.analyzedLine.condition}) {</td></tr>`;
}

const valuedUpdateToHtml = (line: ValuedLine): string =>
    `<tr><td>${line.analyzedLine.value};</td></tr>`;

const valuedWhileToHtml = (line: ValuedLine): string => {
    ident += tabLength;
    return `<tr><td>while (${line.analyzedLine.condition}) {</td></tr>`;
}

const valuedDoWhileToHtml = (line: ValuedLine): string => {
    ident += tabLength;
    return `<tr><td>do (${line.analyzedLine.condition}) {</td></tr>`;
}

const valuedForLineToHtml = (line: ValuedLine): string => {
    ident += tabLength;
    return `<tr><td>for (${line.analyzedLine.condition}) {</td></tr>`;
}

export {constructTable, constructSubstitution};