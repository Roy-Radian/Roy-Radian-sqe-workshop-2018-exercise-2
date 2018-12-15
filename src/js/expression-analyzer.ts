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
    Body
} from "./Expression-Types";
import {getValueOfIdentifier, isVarParam, VarTuple} from "./code-substitutor";

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
    func.params.map((id: Identifier): AnalyzedLine => variableDeclaratorToAnalyzedLine(makeDeclaratorOfIdentifier(id)));

const variableDeclarationToAnalyzedLines = (varDec: VariableDeclaration, varTable: VarTuple[] = []): AnalyzedLine[] =>
    varDec.declarations.map((varDeclarator) => variableDeclaratorToAnalyzedLine(varDeclarator, varTable));

const variableDeclaratorToAnalyzedLine = (varDec: VariableDeclarator, varTable: VarTuple[] = []): AnalyzedLine =>
    ({line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init, varTable)});

const getValOfInit = (init: ValueExpression | null, varTable: VarTuple[] = []): string =>
    isValueExpression(init) ? getValOfValExp(init, varTable) :
    'null';

export const getValOfValExp = (v: ValueExpression, varTable: VarTuple[] = []): string =>
    isLiteral(v) ? v.raw :
    isIdentifier(v) ? (varTable.length == 0 || isVarParam(v, varTable) ? v.name : String(getValueOfIdentifier(v, varTable)))  :
    isComputationExpression(v) ? getValOfComputationExpression(v) :
    isConditionalExpression(v) ? getValOfConditionalExpression(v) :
    getValOfMemberExpression(v);

const getValOfComputationExpression = (c: ComputationExpression): string =>
    isBinaryExpression(c) ? '(' + getValOfValExp(c.left) + ' ' + c.operator + ' ' + getValOfValExp(c.right) + ')' :
    isUnaryExpression(c) ? c.operator + getValOfValExp(c.argument) : // If there were non-prefix unary expressions: (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
    (c.prefix ? c.operator + getValOfValExp(c.argument) : getValOfValExp(c.argument) + c.operator);

const getValOfConditionalExpression = (cond: ConditionalExpression): string =>
    `(${getValOfValExp(cond.test)} ? ${getValOfValExp(cond.consequent)} : ${getValOfValExp(cond.alternate)})`;

const getValOfMemberExpression = (m: MemberExpression): string =>
    m.computed ? getValOfValExp(m.object) + '[' + getValOfValExp(m.property) + ']' :
        getValOfValExp(m.object) + '.' + getValOfValExp(m.property);

const valueExpressionToAnalyzedLines = (val: ValueExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isLiteral(val) ? literalExpressionToAnalyzedLines(val) :
    isIdentifier(val) ? identifierToAnalyzedLines(val, varTable) :
    isComputationExpression(val) ? computationExpressionToAnalyzedLines(val, varTable) :
    isConditionalExpression(val) ? conditionalExpressionToAnalyzedLines(val, varTable) :
    memberExpressionToAnalyzedLines(val);

const computationExpressionToAnalyzedLines = (comp: ComputationExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isUpdateExpression(comp) ? updateExpressionToAnalyzedLines(comp, varTable) :
    isBinaryExpression(comp) ? binaryExpressionToAnalyzedLines(comp, varTable) :
    unaryExpressionToAnalyzedLines(comp, varTable);

const literalExpressionToAnalyzedLines = (l: Literal): AnalyzedLine[] =>
    [{line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw}];

const identifierToAnalyzedLines = (i: Identifier, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: i.loc.start.line, type: i.type, name: (varTable.length == 0 ? i.name : String(getValueOfIdentifier(i, varTable))), condition: EMPTY, value: EMPTY}];

const binaryExpressionToAnalyzedLines = (b: BinaryExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b, varTable)}];

const unaryExpressionToAnalyzedLines = (u: UnaryExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u, varTable)}];

const updateExpressionToAnalyzedLines = (u: UpdateExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: getNameOfAssignable(u.argument), condition: EMPTY, value: getValOfValExp(u, varTable)}];

const assignmentExpressionToAnalyzedLines = (assignmentExpression: AssignmentExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: getNameOfAssignable(assignmentExpression.left), condition: EMPTY, value: getValOfAssignmentExpression(assignmentExpression, varTable)}];

const getNameOfAssignable = (a: Assignable): string =>
    isMemberExpression(a) ? getValOfValExp(a) : a.name;

const getValOfAssignmentExpression = (a: AssignmentExpression, varTable: VarTuple[] = []): string =>
    (a.operator.length > 1 ? getValOfValExp(a.left, varTable) + ' ' + a.operator[0] + ' ' : '' ) + getValOfValExp(a.right, varTable);

const returnStatementToAnalyzedLines = (ret: ReturnStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument, varTable)}];

const whileStatementToAnalyzedLines = (whileStatement: WhileStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test, varTable), value: EMPTY}];

const forStatementToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    forConditionToAnalyzedLines(forStatement, varTable).concat(forInitToAnalyzedLines(forStatement, varTable)).concat(forUpdateToAnalyzedLines(forStatement, varTable));

const forConditionToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test, varTable), value: EMPTY}];

const forInitToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isVariableDeclaration(forStatement.init) ? variableDeclarationToAnalyzedLines(forStatement.init, varTable) :
        assignmentExpressionToAnalyzedLines(forStatement.init, varTable);

const forUpdateToAnalyzedLines = (forStatement: ForStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isAssignmentExpression(forStatement.update) ? assignmentExpressionToAnalyzedLines(forStatement.update, varTable) :
        updateExpressionToAnalyzedLines(forStatement.update, varTable);

const breakStatementToAnalyzedLines = (breakStatement: BreakStatement): AnalyzedLine[] =>
    [{line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY}];

const ifStatementToAnalyzedLines = (ifStatement: IfStatement): AnalyzedLine[] =>
    [{line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY}];

const elseToAnalyzedLines = (alt: Body): AnalyzedLine[] =>
    [{line: alt.loc.start.line, type: 'Else', name: EMPTY, condition: EMPTY, value: EMPTY}];

const conditionalExpressionToAnalyzedLines = (conditionalExpression: ConditionalExpression, varTable: VarTuple[]= []): AnalyzedLine[] =>
    [{line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test, varTable), value: EMPTY}];

const memberExpressionToAnalyzedLines = (memberExpression: MemberExpression): AnalyzedLine[] =>
    [{line: memberExpression.loc.start.line, type: memberExpression.type, name: getNameOfAssignable(memberExpression), condition: EMPTY, value: EMPTY}];

const doWhileStatementToAnalyzedLines = (doWhileStatement: DoWhileStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    [{line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test, varTable), value: EMPTY}];

const concatAnalyzedLines = (prev: AnalyzedLine[], curr: AnalyzedLine[]): AnalyzedLine[] => prev.concat(curr);
const programToAnalyzedLines = (program: Program, varTable: VarTuple[] = []): AnalyzedLine[] =>
    program.body.length > 0 ? program.body.map((exp: Expression) => getAllAnalyzedLines(exp, varTable)).reduce(concatAnalyzedLines) : [];

export const getAllAnalyzedLines = (exp: Expression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isAtomicExpression(exp) ? getAnalyzedLinesFromAtomicExpression(exp, varTable) :
    getAnalyzedLinesFromCompoundExpression(exp, varTable);


const getAnalyzedLinesFromAtomicExpression = (a: AtomicExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isVariableDeclaration(a) ? variableDeclarationToAnalyzedLines(a, varTable) :
    isAssignmentExpression(a) ? assignmentExpressionToAnalyzedLines(a, varTable) :
    isReturnStatement(a) ? returnStatementToAnalyzedLines(a, varTable) :
    breakStatementToAnalyzedLines(a);

const getAnalyzedLinesFromCompoundExpression = (comp: CompoundExpression, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isExpressionStatement(comp) ? getAllAnalyzedLines(comp.expression, varTable) :
    isFunctionDeclaration(comp) ? getAnalyzedLinesFromFunctionDeclaration(comp, varTable) :
    isValueExpression(comp) ? valueExpressionToAnalyzedLines(comp, varTable) :
    isLoopStatement(comp) ? getAnalyzedLinesFromLoopStatement(comp, varTable) :
    getAnalyzedLinesFromIfStatement(comp, varTable);

const getAnalyzedLinesFromLoopStatement = (loop: LoopStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isWhileStatement(loop) ? getAnalyzedLinesFromWhileStatement(loop, varTable) :
    isDoWhileStatement(loop) ? getAnalyzedLinesFromDoWhileStatement(loop, varTable) :
    getAnalyzedLinesFromForStatement(loop, varTable);

const getAnalyzedLinesFromBody = (b: Body, varTable: VarTuple[] = []): AnalyzedLine[] =>
    isBlockStatement(b) ? b.body.map((exp: Expression) => getAllAnalyzedLines(exp, varTable)).reduce(concatAnalyzedLines) :
        getAllAnalyzedLines(b, varTable);

const getAnalyzedLinesFromFunctionDeclaration = (func: FunctionDeclaration, varTable: VarTuple[] = []): AnalyzedLine[] =>
    functionDeclarationToAnalyzedLines(func).concat(getDeclarationsOfParams(func)).concat(getAnalyzedLinesFromBody(func.body, varTable));

const makeDeclaratorOfIdentifier = (id: Identifier): VariableDeclarator =>
    ({type: 'VariableDeclarator', id: id, init: null, loc: id.loc});

const getAnalyzedLinesFromWhileStatement = (whileStatement: WhileStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    whileStatementToAnalyzedLines(whileStatement, varTable).concat(getAnalyzedLinesFromBody(whileStatement.body, varTable));

const getAnalyzedLinesFromDoWhileStatement = (doWhileStatement: DoWhileStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    doWhileStatementToAnalyzedLines(doWhileStatement, varTable).concat(getAnalyzedLinesFromBody(doWhileStatement.body, varTable));

const getAnalyzedLinesFromForStatement = (forStatement: ForStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    forStatementToAnalyzedLines(forStatement, varTable).concat(getAnalyzedLinesFromBody(forStatement.body, varTable));



const getAnalyzedLinesFromIfStatement = (ifStatement: IfStatement, varTable: VarTuple[] = []): AnalyzedLine[] =>
    ifStatementToAnalyzedLines(ifStatement).concat(getAnalyzedLinesFromBody(ifStatement.consequent, varTable)).concat(getAnalyzedLinesFromAlternate(ifStatement.alternate, varTable));

const getAnalyzedLinesFromAlternate = (altBody: Body | null, varTable: VarTuple[] = []) : AnalyzedLine[] =>
    isBody(altBody) ? elseToAnalyzedLines(altBody).concat(getAnalyzedLinesFromBody(altBody, varTable)) : [];

export {AnalyzedLine, isProgram, programToAnalyzedLines, ValueExpression, isLiteral, isIdentifier, isBinaryExpression, isUnaryExpression, isUpdateExpression, isConditionalExpression, isMemberExpression};