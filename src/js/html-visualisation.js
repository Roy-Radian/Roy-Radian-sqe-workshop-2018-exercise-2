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
var space = '&nbsp;';
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
var specialLines = ['ReturnStatement', 'BreakStatement', 'DoWhileEnd', 'BlockClosing', 'Else'];
var atomicTypes = ['VariableDeclaration', 'AssignmentExpression'].concat(specialLines);
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
    return lines.length > 0 ? lines.map(function (line) { return valuedLineToHtml(line, params); }).reduce(concatStringTableEntries) : '';
};
var valuedLineToHtml = function (line, params) {
    return (atomicTypes.indexOf(line.analyzedLine.type) != -1 ? valuedAtomicToHtml(line) :
        generateIdenttation() + valuedCompoundToHtml(line, params)) + "<br/>";
};
var valuedAtomicToHtml = function (line) {
    return line.analyzedLine.type == 'VariableDeclaration' ? generateIdenttation() + valuedDeclarationToHtml(line) :
        line.analyzedLine.type == 'AssignmentExpression' ? generateIdenttation() + valuedAssignmentToHtml(line) :
            specialLineToHtml(line);
};
var specialLineToHtml = function (line) {
    return line.analyzedLine.type == 'ReturnStatement' ? generateIdenttation() + valuedReturnStatementToHtml(line) :
        line.analyzedLine.type == 'BreakStatement' ? generateIdenttation() + valuedBreakToHtml(line) :
            line.analyzedLine.type == 'DoWhileEnd' ? doWhileEndToHtml(line) :
                line.analyzedLine.type == 'Else' ? generateIdenttation() + elseToHtml(line) :
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
    return "let " + line.analyzedLine.name + " " + (line.value != 'null' ? ' = ' + line.analyzedLine.value : '') + ";";
};
var valuedAssignmentToHtml = function (line) {
    return line.analyzedLine.name + " = " + line.analyzedLine.value + ";";
};
var valuedReturnStatementToHtml = function (line) {
    return "return " + line.analyzedLine.value + ";";
};
var valuedBreakToHtml = function (line) {
    return "break;";
};
var doWhileEndToHtml = function (line) {
    ident -= tabLength;
    return generateIdenttation() + ("} while (" + line.analyzedLine.condition + ");");
};
var elseToHtml = function (line) {
    ident += tabLength;
    return "else";
};
var blockClosingToHtml = function (line) {
    ident -= tabLength;
    return generateIdenttation() + "}";
};
var valuedFuncToHtml = function (line, params) {
    ident += tabLength;
    return "function " + line.analyzedLine.name + "(" + params + ") {";
};
var valuedIfToHtml = function (line) {
    ident += tabLength;
    return markLine("if (" + line.analyzedLine.condition + ") {", line);
};
var valuedUpdateToHtml = function (line) {
    return line.analyzedLine.value + ";";
};
var valuedWhileToHtml = function (line) {
    ident += tabLength;
    return markLine("while (" + line.analyzedLine.condition + ") {", line);
};
var valuedDoWhileToHtml = function (line) {
    ident += tabLength;
    return markLine("do (" + line.analyzedLine.condition + ") {", line);
};
var valuedForLineToHtml = function (line) {
    ident += tabLength;
    return markLine("for (" + line.analyzedLine.condition + ") {", line);
};
var markLine = function (str, line) {
    return "<mark style=\"background-color:" + (line.value ? "green" : "red") + "\">" + str + "</mark>";
};
