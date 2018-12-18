import {parseCode} from './code-analyzer';
import {
    Assignable,
    AssignmentExpression,
    AtomicExpression,
    BinaryExpression,
    BreakStatement, CompoundExpression,
    ComputationExpression,
    ConditionalExpression,
    DoWhileStatement,
    Expression,
    ForStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement, isAssignmentExpression,
    isAtomicExpression,
    isBinaryExpression, isBlockStatement, isBody,
    isComputationExpression,
    isConditionalExpression, isDoWhileStatement, isExpressionStatement, isFunctionDeclaration,
    isIdentifier,
    isLiteral, isLoopStatement,
    isMemberExpression, isReturnStatement,
    isUnaryExpression,
    isUpdateExpression,
    isValueExpression,
    isVariableDeclaration, isWhileStatement,
    Literal, LoopStatement,
    MemberExpression,
    Program,
    isProgram,
    ReturnStatement,
    UnaryExpression,
    UpdateExpression,
    ValueExpression,
    VariableDeclaration,
    VariableDeclarator,
    WhileStatement,
    Body, isAtomicLiteral, ArrayExpression, isLogicalExpression, LogicalExpression
} from "./Expression-Types";
import {getValueExpressionOfIdentifier, isVarParam, VarTuple} from "./code-substitutor";

const EMPTY = '';
interface AnalyzedLine {
    line: number;
    type: string;
    name: string;
    condition: string;
    value: string;
}

/*const expressionToAnalyzedLines = (exp: Expression): AnalyzedLine[] =>
    //isExpressionStatement(exp) ? expressionStatementToAnalyzedLines(exp) :
    isFunctionDeclaration(exp) ? functionDeclarationToAnalyzedLines(exp) :
    isVariableDeclaration(exp) ? variableDeclarationToAnalyzedLines(exp) :
    isValueExpression(exp) ? valueExpressionToAnalyzedLines(exp) :
    isAssignmentExpression(exp) ? assignmentExpressionToAnalyzedLines(exp) :
    isReturnStatement(exp) ? returnStatementToAnalyzedLines(exp) :
    isWhileStatement(exp) ? whileStatementToAnalyzedLines(exp) :
    isDoWhileStatement(exp) ? doWhileStatementToAnalyzedLines(exp) :
    isForStatement(exp) ? forStatementToAnalyzedLines(exp) :
    isBreakStatement(exp) ? breakStatementToAnalyzedLines(exp) :
    isIfStatement(exp) ? ifStatementToAnalyzedLines(exp) :
    conditionalExpressionToAnalyzedLines(exp);*/

/*const expressionStatementToAnalyzedLines = (expStatement: ExpressionStatement): AnalyzedLine[] =>
    expressionToAnalyzedLines(expStatement.expression);*/

const functionDeclarationToAnalyzedLines = (func: FunctionDeclaration): AnalyzedLine[] =>
    [{line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY}];

const getDeclarationsOfParams = (func: FunctionDeclaration): AnalyzedLine[] =>
    func.params.map((id: Identifier): AnalyzedLine => variableDeclaratorToAnalyzedLine(makeDeclaratorOfIdentifier(id), []));

const variableDeclarationToAnalyzedLines = (varDec: VariableDeclaration, varTable: VarTuple[]): AnalyzedLine[] =>
    varDec.declarations.map((varDeclarator) => variableDeclaratorToAnalyzedLine(varDeclarator, varTable));

const variableDeclaratorToAnalyzedLine = (varDec: VariableDeclarator, varTable: VarTuple[]): AnalyzedLine =>
    ({line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init, varTable)});

const getValOfInit = (init: ValueExpression | null, varTable: VarTuple[]): string =>
    isValueExpression(init) ? getValOfValExp(init, varTable) :
    'null';

export const getValOfValExp = (v: ValueExpression, varTable: VarTuple[]): string =>
    isLiteral(v) ? getValOfLiteral(v, varTable) :
    isIdentifier(v) ? (varTable.length == 0 || isVarParam(v, varTable) ? v.name : getValOfValExp(getValueExpressionOfIdentifier(v, varTable), varTable))  :
    isComputationExpression(v) ? getValOfComputationExpression(v, varTable) :
    isConditionalExpression(v) ? getValOfConditionalExpression(v, varTable) :
    getValOfMemberExpression(v, varTable);

const getValOfLiteral = (literal: Literal, varTable: VarTuple[]): string =>
    isAtomicLiteral(literal) ? literal.raw :
    arrayToString(literal, varTable);

const concatArrayStrings = (prev: string, curr: string): string => prev + ', ' + curr;
const arrayToString = (arr: ArrayExpression, varTable: VarTuple[]): string =>
    arr.elements.length == 0 ? '[]' :
    '[' + arr.elements.map((v: ValueExpression): string => getValOfValExp(v, varTable)).reduce(concatArrayStrings) + ']';

const getValOfComputationExpression = (c: ComputationExpression, varTable: VarTuple[]): string =>
    isBinaryExpression(c) ? '(' + getValOfValExp(c.left, varTable) + ' ' + c.operator + ' ' + getValOfValExp(c.right, varTable) + ')' :
    isLogicalExpression(c) ? '(' + getValOfValExp(c.left, varTable) + ' ' + c.operator + ' ' + getValOfValExp(c.right, varTable) + ')' :
    isUnaryExpression(c) ? c.operator + getValOfValExp(c.argument, varTable) : // If there were non-prefix unary expressions: (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
    (c.prefix ? c.operator + getValOfValExp(c.argument, varTable) : getValOfValExp(c.argument, varTable) + c.operator);

const getValOfConditionalExpression = (cond: ConditionalExpression, varTable: VarTuple[]): string =>
    `(${getValOfValExp(cond.test, varTable)} ? ${getValOfValExp(cond.consequent, varTable)} : ${getValOfValExp(cond.alternate, varTable)})`;

const getValOfMemberExpression = (m: MemberExpression, varTable: VarTuple[]): string =>
    m.computed ? getValOfValExp(m.object, varTable) + '[' + getValOfValExp(m.property, varTable) + ']' :
        getValOfValExp(m.object, varTable) + '.' + getValOfValExp(m.property, varTable);

const valueExpressionToAnalyzedLines = (val: ValueExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    isLiteral(val) ? literalExpressionToAnalyzedLines(val, varTable) :
    isIdentifier(val) ? identifierToAnalyzedLines(val) :
    isComputationExpression(val) ? computationExpressionToAnalyzedLines(val, varTable) :
    isConditionalExpression(val) ? conditionalExpressionToAnalyzedLines(val, varTable) :
    memberExpressionToAnalyzedLines(val, varTable);

const computationExpressionToAnalyzedLines = (comp: ComputationExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    isUpdateExpression(comp) ? updateExpressionToAnalyzedLines(comp, varTable) :
    isLogicalExpression(comp) ? logicalExpressionToAnalyzedLines(comp, varTable) :
    isBinaryExpression(comp) ? binaryExpressionToAnalyzedLines(comp, varTable) :
    unaryExpressionToAnalyzedLines(comp, varTable);

const literalExpressionToAnalyzedLines = (l: Literal, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: getValOfLiteral(l, varTable)}];

const identifierToAnalyzedLines = (i: Identifier): AnalyzedLine[] =>
    [{line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY}];

const binaryExpressionToAnalyzedLines = (b: BinaryExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b, varTable)}];

const logicalExpressionToAnalyzedLines = (l: LogicalExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(l, varTable)}];

const unaryExpressionToAnalyzedLines = (u: UnaryExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u, varTable)}];

const updateExpressionToAnalyzedLines = (u: UpdateExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: getNameOfAssignable(u.argument, varTable), condition: EMPTY, value: getValOfValExp(u, varTable)}];

const assignmentExpressionToAnalyzedLines = (assignmentExpression: AssignmentExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: getNameOfAssignable(assignmentExpression.left, varTable), condition: EMPTY, value: getValOfAssignmentExpression(assignmentExpression, varTable)}];

const getNameOfAssignable = (a: Assignable, varTable: VarTuple[]): string =>
    isMemberExpression(a) ? getValOfValExp(a, varTable) : a.name;

const getValOfAssignmentExpression = (a: AssignmentExpression, varTable: VarTuple[]): string =>
    (a.operator.length > 1 ? getValOfValExp(a.left, varTable) + ' ' + a.operator[0] + ' ' : '' ) + getValOfValExp(a.right, varTable);

const returnStatementToAnalyzedLines = (ret: ReturnStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument, varTable)}];

const whileStatementToAnalyzedLines = (whileStatement: WhileStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test, varTable), value: EMPTY}];

const forStatementToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    forConditionToAnalyzedLines(forStatement, varTable);

const forConditionToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test, varTable), value: EMPTY}];

const forInitToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    isVariableDeclaration(forStatement.init) ? variableDeclarationToAnalyzedLines(forStatement.init, varTable) :
        assignmentExpressionToAnalyzedLines(forStatement.init, varTable);

const forUpdateToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    isAssignmentExpression(forStatement.update) ? assignmentExpressionToAnalyzedLines(forStatement.update, varTable) :
        updateExpressionToAnalyzedLines(forStatement.update, varTable);

const breakStatementToAnalyzedLines = (breakStatement: BreakStatement): AnalyzedLine[] =>
    [{line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY}];

const ifStatementToAnalyzedLines = (ifStatement: IfStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test, varTable), value: EMPTY}];

const elseToAnalyzedLines = (alt: Body): AnalyzedLine[] =>
    [{line: alt.loc.start.line, type: 'Else', name: EMPTY, condition: EMPTY, value: EMPTY}];

const conditionalExpressionToAnalyzedLines = (conditionalExpression: ConditionalExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test, varTable), value: EMPTY}];

const memberExpressionToAnalyzedLines = (memberExpression: MemberExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: memberExpression.loc.start.line, type: memberExpression.type, name: getNameOfAssignable(memberExpression, varTable), condition: EMPTY, value: EMPTY}];

const doWhileStatementToAnalyzedLines = (doWhileStatement: DoWhileStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    [{line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test, varTable), value: EMPTY}];

const concatAnalyzedLines = (prev: AnalyzedLine[], curr: AnalyzedLine[]): AnalyzedLine[] => prev.concat(curr);
const programToAnalyzedLines = (program: Program, varTable: VarTuple[] = []): AnalyzedLine[] =>
    program.body.length > 0 ? program.body.map((exp: Expression) => getAllAnalyzedLines(exp, varTable)).reduce(concatAnalyzedLines) : [];

export const getAllAnalyzedLines = (exp: Expression, varTable: VarTuple[]): AnalyzedLine[] =>
    isAtomicExpression(exp) ? getAnalyzedLinesFromAtomicExpression(exp, varTable) :
    getAnalyzedLinesFromCompoundExpression(exp, varTable);

export const getFirstAnalyzedLine = (exp: Expression, varTable: VarTuple[]): AnalyzedLine =>
    isAtomicExpression(exp) ?  getAnalyzedLinesFromAtomicExpression(exp, varTable)[0] :
    isExpressionStatement(exp) ? getFirstAnalyzedLine(exp.expression, varTable) :
    isValueExpression(exp) ? valueExpressionToAnalyzedLines(exp, varTable)[0] :
    isFunctionDeclaration(exp) ? functionDeclarationToAnalyzedLines(exp)[0] :
    isLoopStatement(exp) ? getFirstAnalyzedLineFromLoop(exp, varTable) :
    ifStatementToAnalyzedLines(exp, varTable)[0];

const getFirstAnalyzedLineFromLoop = (loop: LoopStatement, varTable: VarTuple[]): AnalyzedLine =>
    isWhileStatement(loop) ? whileStatementToAnalyzedLines(loop, varTable)[0] :
    isDoWhileStatement(loop) ? doWhileStatementToAnalyzedLines(loop, varTable)[0] :
    forStatementToAnalyzedLines(loop, varTable)[0];

const getAnalyzedLinesFromAtomicExpression = (a: AtomicExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    isVariableDeclaration(a) ? variableDeclarationToAnalyzedLines(a, varTable) :
    isAssignmentExpression(a) ? assignmentExpressionToAnalyzedLines(a, varTable) :
    isReturnStatement(a) ? returnStatementToAnalyzedLines(a, varTable) :
    breakStatementToAnalyzedLines(a);

const getAnalyzedLinesFromCompoundExpression = (comp: CompoundExpression, varTable: VarTuple[]): AnalyzedLine[] =>
    isExpressionStatement(comp) ? getAllAnalyzedLines(comp.expression, varTable) :
    isFunctionDeclaration(comp) ? getAnalyzedLinesFromFunctionDeclaration(comp, varTable) :
    isValueExpression(comp) ? valueExpressionToAnalyzedLines(comp, varTable) :
    isLoopStatement(comp) ? getAnalyzedLinesFromLoopStatement(comp, varTable) :
    getAnalyzedLinesFromIfStatement(comp, varTable);

const getAnalyzedLinesFromLoopStatement = (loop: LoopStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    isWhileStatement(loop) ? getAnalyzedLinesFromWhileStatement(loop, varTable) :
    isDoWhileStatement(loop) ? getAnalyzedLinesFromDoWhileStatement(loop, varTable) :
    getAnalyzedLinesFromForStatement(loop, varTable);

const getAnalyzedLinesFromBody = (b: Body, varTable: VarTuple[]): AnalyzedLine[] =>
    isBlockStatement(b) ? (b.body.length > 0 ? b.body.map((exp: Expression) => getAllAnalyzedLines(exp, varTable)).reduce(concatAnalyzedLines) : []) :
        getAllAnalyzedLines(b, varTable);

const getAnalyzedLinesFromFunctionDeclaration = (func: FunctionDeclaration, varTable: VarTuple[]): AnalyzedLine[] =>
    functionDeclarationToAnalyzedLines(func).concat(getDeclarationsOfParams(func)).concat(getAnalyzedLinesFromBody(func.body, varTable));

const makeDeclaratorOfIdentifier = (id: Identifier): VariableDeclarator =>
    ({type: 'VariableDeclarator', id: id, init: null, loc: id.loc});

const getAnalyzedLinesFromWhileStatement = (whileStatement: WhileStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    whileStatementToAnalyzedLines(whileStatement, varTable).concat(getAnalyzedLinesFromBody(whileStatement.body, varTable));

const getAnalyzedLinesFromDoWhileStatement = (doWhileStatement: DoWhileStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    doWhileStatementToAnalyzedLines(doWhileStatement, varTable).concat(getAnalyzedLinesFromBody(doWhileStatement.body, varTable));

const getAnalyzedLinesFromForStatement = (forStatement: ForStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    forStatementToAnalyzedLines(forStatement, varTable).concat(forInitToAnalyzedLines(forStatement, varTable)).concat(forUpdateToAnalyzedLines(forStatement, varTable)).concat(getAnalyzedLinesFromBody(forStatement.body, varTable));



const getAnalyzedLinesFromIfStatement = (ifStatement: IfStatement, varTable: VarTuple[]): AnalyzedLine[] =>
    ifStatementToAnalyzedLines(ifStatement, varTable).concat(getAnalyzedLinesFromBody(ifStatement.consequent, varTable)).concat(getAnalyzedLinesFromAlternate(ifStatement.alternate, varTable));

const getAnalyzedLinesFromAlternate = (altBody: Body | null, varTable: VarTuple[]) : AnalyzedLine[] =>
    isBody(altBody) ? elseToAnalyzedLines(altBody).concat(getAnalyzedLinesFromBody(altBody, varTable)) : [];

export {AnalyzedLine, isProgram, programToAnalyzedLines, ValueExpression, isLiteral, isIdentifier, isBinaryExpression, isUnaryExpression, isUpdateExpression, isConditionalExpression, isMemberExpression};