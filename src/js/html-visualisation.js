"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expression_analyzer_1 = require("./expression-analyzer");
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
var analyzedLinesIntoTable = function (entries) {
    return entries.length > 0 ? '<table>' + headers + entries.map(function (tblEntry) { return analyzedLineToHtml(tblEntry); }).reduce(concatStringTableEntries) + '</table>' : '';
};
