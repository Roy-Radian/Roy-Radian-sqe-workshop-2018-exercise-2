import {AnalyzedLine, isProgram, programToAnalyzedLines} from './expression-analyzer';

const analyzedLineToHtml = (line: AnalyzedLine): string =>
    `<tr><td>${line.line}</td><td>${line.type}</td><td>${line.name}</td><td>${line.condition}</td><td>${line.value}</td></tr>`;

const notAProgram: string = '<table><tr><td>Not a program!</td></tr>';
const headers: string = '<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>';
const concatStringTableEntries = (prev: string, curr: string): string => prev + curr;
const constructTable = (program: any): string =>
    isProgram(program) ? analyzedLinesIntoTable(programToAnalyzedLines(program)) :
        notAProgram;


const analyzedLinesIntoTable = (entries: AnalyzedLine[]): string =>
    entries.length > 0 ? '<table>' + headers + entries.map((tblEntry: AnalyzedLine): string => analyzedLineToHtml(tblEntry)).reduce(concatStringTableEntries) + '</table>' : '';

export {constructTable};