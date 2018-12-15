"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expression_analyzer_1 = require("./expression-analyzer");
var code_substitutor_1 = require("./code-substitutor");
var analyzedLineToHtml = function (line) {
    return "<tr><td>" + line.line + "</td><td>" + line.type + "</td><td>" + line.name + "</td><td>" + line.condition + "</td><td>" + line.value + "</td></tr>";
};
var notAProgram = '<table><tr><td>Not a program!</td></tr>';
var headers = '<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>';
var concatStringTableEntries = function (prev, curr) { return prev + curr; };
var constructTable = function (program) {
    return expression_analyzer_1.isProgram(program) ? analyzedLinesIntoTable(expression_analyzer_1.programToAnalyzedLines(program)) :
        notAProgram;
};
exports.constructTable = constructTable;
var ident = 0;
var tabLength = 4;
var space = ' ';
var generateIdenttation = function () {
    var tab = "";
    for (var i = 0; i < ident; i++) {
        tab += space;
    }
    return tab;
};
var analyzedLinesIntoTable = function (entries) {
    return entries.length > 0 ? '<table>' + headers + entries.map(function (tblEntry) { return analyzedLineToHtml(tblEntry); }).reduce(concatStringTableEntries) + '</table>' : '';
};
var atomicTypes = ['VariableDeclaration', 'AssignmentExpression', 'ReturnStatement', 'BreakStatement', 'DoWhileEnd', 'BlockClosing'];
var loopTypes = ['WhileStatement', 'DoWhileStatement', 'ForStatement'];
var computationTypes = ['BinaryExpression', 'UnaryExpresion', 'UpdateExpression'];
var valueTypes = ['Literal', 'Identifier', 'MemberExpression', 'ConditionalExpression'].concat(computationTypes);
var compoundTypes = ['FunctionDeclaration', 'IfStatement'].concat(valueTypes).concat(loopTypes);
var constructSubstitution = function (program, params) {
    return expression_analyzer_1.isProgram(program) ? valuedLinesIntoTable(code_substitutor_1.substituteProgram(program, code_substitutor_1.parseParams(params)), paramsIntoList(code_substitutor_1.parseParams(params))) :
        notAProgram;
};
exports.constructSubstitution = constructSubstitution;
var paramsIntoList = function (params) {
    return params.length == 0 ? [] :
        [params[0].name].concat(paramsIntoList(params.slice(1)));
};
var valuedLinesIntoTable = function (lines, params) {
    return lines.length > 0 ? '<table>' + lines.map(function (line) { return valuedLineToHtml(line, params); }).reduce(concatStringTableEntries) + '</table>' : '';
};
var valuedLineToHtml = function (line, params) {
    return atomicTypes.indexOf(line.analyzedLine.type) != -1 ? valuedAtomicToHtml(line) :
        generateIdenttation() + valuedCompoundToHtml(line, params);
};
var valuedAtomicToHtml = function (line) {
    return line.analyzedLine.type == 'VariableDeclaration' ? generateIdenttation() + valuedDeclarationToHtml(line) :
        line.analyzedLine.type == 'AssignmentExpression' ? generateIdenttation() + valuedAssignmentToHtml(line) :
            line.analyzedLine.type == 'ReturnStatement' ? generateIdenttation() + valuedReturnStatementToHtml(line) :
                line.analyzedLine.type == 'BreakStatement' ? generateIdenttation() + valuedBreakToHtml(line) :
                    line.analyzedLine.type == 'DoWhileEnd' ? doWhileEndToHtml(line) :
                        blockClosingToHtml(line);
};
var valuedCompoundToHtml = function (line, params) {
    return line.analyzedLine.type == 'FunctionDeclaration' ? valuedFuncToHtml(line, params) :
        line.analyzedLine.type == 'IfStatement' ? valuedIfToHtml(line) :
            valueTypes.indexOf(line.analyzedLine.type) != -1 ? valuedValueToHtml(line) :
                valuedLoopToHtml(line);
};
var valuedValueToHtml = function (line) {
    return line.analyzedLine.type == 'UpdateExpression' ? valuedUpdateToHtml(line) :
        '';
};
var valuedLoopToHtml = function (line) {
    return line.analyzedLine.type == 'WhileStatement' ? valuedWhileToHtml(line) :
        line.analyzedLine.type == 'DoWhileStatement' ? valuedDoWhileToHtml(line) :
            valuedForLineToHtml(line);
};
var valuedDeclarationToHtml = function (line) {
    return "<tr><td>let " + line.analyzedLine.name + " " + (line.value != 'null' ? ' = ' + line.analyzedLine.value : '') + ";</td></tr>";
};
var valuedAssignmentToHtml = function (line) {
    return "<tr><td>" + line.analyzedLine.name + " = " + line.analyzedLine.value + ";</td></tr>";
};
var valuedReturnStatementToHtml = function (line) {
    return "<tr><td>return " + line.analyzedLine.value + ";</td></tr>";
};
var valuedBreakToHtml = function (line) {
    return "<tr><td>break;</td></tr>";
};
var doWhileEndToHtml = function (line) {
    ident -= tabLength;
    return generateIdenttation() + ("<tr><td>} while (" + line.analyzedLine.condition + ");</td></tr>");
};
var blockClosingToHtml = function (line) {
    ident -= tabLength;
    return generateIdenttation() + "<tr><td>}</td></tr>";
};
var valuedFuncToHtml = function (line, params) {
    ident += tabLength;
    return "<tr><td>function " + line.analyzedLine.name + "(" + params + ") {</td></tr>";
};
var valuedIfToHtml = function (line) {
    ident += tabLength;
    return "<tr><td>if (" + line.analyzedLine.condition + ") {</td></tr>";
};
var valuedUpdateToHtml = function (line) {
    return "<tr><td>" + line.analyzedLine.value + ";</td></tr>";
};
var valuedWhileToHtml = function (line) {
    ident += tabLength;
    return "<tr><td>while (" + line.analyzedLine.condition + ") {</td></tr>";
};
var valuedDoWhileToHtml = function (line) {
    ident += tabLength;
    return "<tr><td>do (" + line.analyzedLine.condition + ") {</td></tr>";
};
var valuedForLineToHtml = function (line) {
    ident += tabLength;
    return "<tr><td>for (" + line.analyzedLine.condition + ") {</td></tr>";
};
