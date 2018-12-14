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
    isComputationExpressoin,
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

const variableDeclarationToAnalyzedLines = (varDec: VariableDeclaration): AnalyzedLine[] =>
    varDec.declarations.map((varDeclarator) => variableDeclaratorToAnalyzedLine(varDeclarator));

const variableDeclaratorToAnalyzedLine = (varDec: VariableDeclarator): AnalyzedLine =>
    ({line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init)});

const getValOfInit = (init: ValueExpression | null): string =>
    isValueExpression(init) ? getValOfValExp(init) :
    'null';

const getValOfValExp = (v: ValueExpression): string =>
    isLiteral(v) ? v.raw :
    isIdentifier(v) ? v.name :
    isComputationExpressoin(v) ? getValOfComputationExpression(v) :
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

const valueExpressionToAnalyzedLines = (val: ValueExpression): AnalyzedLine[] =>
    isLiteral(val) ? literalExpressionToAnalyzedLines(val) :
    isIdentifier(val) ? identifierToAnalyzedLines(val) :
    isComputationExpressoin(val) ? computationExpressionToAnalyzedLines(val) :
    isConditionalExpression(val) ? conditionalExpressionToAnalyzedLines(val) :
    memberExpressionToAnalyzedLines(val);

const computationExpressionToAnalyzedLines = (comp: ComputationExpression): AnalyzedLine[] =>
    isUpdateExpression(comp) ? updateExpressionToAnalyzedLines(comp) :
    isBinaryExpression(comp) ? binaryExpressionToAnalyzedLines(comp) :
    unaryExpressionToAnalyzedLines(comp);

const literalExpressionToAnalyzedLines = (l: Literal): AnalyzedLine[] =>
    [{line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw}];

const identifierToAnalyzedLines = (i: Identifier): AnalyzedLine[] =>
    [{line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY}];

const binaryExpressionToAnalyzedLines = (b: BinaryExpression): AnalyzedLine[] =>
    [{line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b)}];

const unaryExpressionToAnalyzedLines = (u: UnaryExpression): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u)}];

const updateExpressionToAnalyzedLines = (u: UpdateExpression): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: getNameOfAssignable(u.argument), condition: EMPTY, value: getValOfValExp(u)}];

const assignmentExpressionToAnalyzedLines = (assignmentExpression: AssignmentExpression): AnalyzedLine[] =>
    [{line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: getNameOfAssignable(assignmentExpression.left), condition: EMPTY, value: getValOfAssignmentExpression(assignmentExpression)}];

const getNameOfAssignable = (a: Assignable): string =>
    isMemberExpression(a) ? getValOfValExp(a) : a.name;

const getValOfAssignmentExpression = (a: AssignmentExpression): string =>
    (a.operator.length > 1 ? getValOfValExp(a.left) + ' ' + a.operator[0] + ' ' : '' ) + getValOfValExp(a.right);

const returnStatementToAnalyzedLines = (ret: ReturnStatement): AnalyzedLine[] =>
    [{line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument)}];

const whileStatementToAnalyzedLines = (whileStatement: WhileStatement): AnalyzedLine[] =>
    [{line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY}];

const forStatementToAnalyzedLines = (forStatement: ForStatement): AnalyzedLine[] =>
    forConditionToAnalyzedLines(forStatement).concat(forInitToAnalyzedLines(forStatement)).concat(forUpdateToAnalyzedLines(forStatement));

const forConditionToAnalyzedLines = (forStatement: ForStatement): AnalyzedLine[] =>
    [{line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY}];

const breakStatementToAnalyzedLines = (breakStatement: BreakStatement): AnalyzedLine[] =>
    [{line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY}];

const ifStatementToAnalyzedLines = (ifStatement: IfStatement): AnalyzedLine[] =>
    [{line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY}];

const elseToAnalyzedLines = (alt: Body): AnalyzedLine[] =>
    [{line: alt.loc.start.line, type: 'Else', name: EMPTY, condition: EMPTY, value: EMPTY}];

const conditionalExpressionToAnalyzedLines = (conditionalExpression: ConditionalExpression): AnalyzedLine[] =>
    [{line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY}];

const memberExpressionToAnalyzedLines = (memberExpression: MemberExpression): AnalyzedLine[] =>
    [{line: memberExpression.loc.start.line, type: memberExpression.type, name: getNameOfAssignable(memberExpression), condition: EMPTY, value: EMPTY}];

const doWhileStatementToAnalyzedLines = (doWhileStatement: DoWhileStatement): AnalyzedLine[] =>
    [{line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY}];

const concatAnalyzedLines = (prev: AnalyzedLine[], curr: AnalyzedLine[]): AnalyzedLine[] => prev.concat(curr);
const programToAnalyzedLines = (program: Program): AnalyzedLine[] =>
    program.body.length > 0 ? program.body.map((exp: Expression) => getAllAnalyzedLines(exp)).reduce(concatAnalyzedLines) : [];

const getAllAnalyzedLines = (exp: Expression): AnalyzedLine[] =>
    isAtomicExpression(exp) ? getAnalyzedLinesFromAtomicExpression(exp) :
    getAnalyzedLinesFromCompoundExpression(exp);


const getAnalyzedLinesFromAtomicExpression = (a: AtomicExpression): AnalyzedLine[] =>
    isVariableDeclaration(a) ? variableDeclarationToAnalyzedLines(a) :
    isAssignmentExpression(a) ? assignmentExpressionToAnalyzedLines(a) :
    isReturnStatement(a) ? returnStatementToAnalyzedLines(a) :
    breakStatementToAnalyzedLines(a);

const getAnalyzedLinesFromCompoundExpression = (comp: CompoundExpression): AnalyzedLine[] =>
    isExpressionStatement(comp) ? getAllAnalyzedLines(comp.expression) :
    isFunctionDeclaration(comp) ? getAnalyzedLinesFromFunctionDeclaration(comp) :
    isValueExpression(comp) ? valueExpressionToAnalyzedLines(comp) :
    isLoopStatement(comp) ? getAnalyzedLinesFromLoopStatement(comp) :
    getAnalyzedLinesFromIfStatement(comp);

const getAnalyzedLinesFromLoopStatement = (loop: LoopStatement): AnalyzedLine[] =>
    isWhileStatement(loop) ? getAnalyzedLinesFromWhileStatement(loop) :
    isDoWhileStatement(loop) ? getAnalyzedLinesFromDoWhileStatement(loop) :
    getAnalyzedLinesFromForStatement(loop);

const getAnalyzedLinesFromBody = (b: Body): AnalyzedLine[] =>
    isBlockStatement(b) ? b.body.map((exp: Expression) => getAllAnalyzedLines(exp)).reduce(concatAnalyzedLines) :
        getAllAnalyzedLines(b);

const getAnalyzedLinesFromFunctionDeclaration = (func: FunctionDeclaration): AnalyzedLine[] =>
    functionDeclarationToAnalyzedLines(func).concat(getDeclarationsOfParams(func)).concat(getAnalyzedLinesFromBody(func.body));

const makeDeclaratorOfIdentifier = (id: Identifier): VariableDeclarator =>
    ({type: 'VariableDeclarator', id: id, init: null, loc: id.loc});

const getAnalyzedLinesFromWhileStatement = (whileStatement: WhileStatement): AnalyzedLine[] =>
    whileStatementToAnalyzedLines(whileStatement).concat(getAnalyzedLinesFromBody(whileStatement.body));

const getAnalyzedLinesFromDoWhileStatement = (doWhileStatement: DoWhileStatement): AnalyzedLine[] =>
    doWhileStatementToAnalyzedLines(doWhileStatement).concat(getAnalyzedLinesFromBody(doWhileStatement.body));

const getAnalyzedLinesFromForStatement = (forStatement: ForStatement): AnalyzedLine[] =>
    forStatementToAnalyzedLines(forStatement).concat(getAnalyzedLinesFromBody(forStatement.body));

const forInitToAnalyzedLines = (forStatement: ForStatement): AnalyzedLine[] =>
    isVariableDeclaration(forStatement.init) ? variableDeclarationToAnalyzedLines(forStatement.init) :
    assignmentExpressionToAnalyzedLines(forStatement.init);

const forUpdateToAnalyzedLines = (forStatement: ForStatement): AnalyzedLine[] =>
    isAssignmentExpression(forStatement.update) ? assignmentExpressionToAnalyzedLines(forStatement.update) :
    updateExpressionToAnalyzedLines(forStatement.update);

const getAnalyzedLinesFromIfStatement = (ifStatement: IfStatement): AnalyzedLine[] =>
    ifStatementToAnalyzedLines(ifStatement).concat(getAnalyzedLinesFromBody(ifStatement.consequent)).concat(getAnalyzedLinesFromAlternate(ifStatement.alternate));

const getAnalyzedLinesFromAlternate = (altBody: Body | null) : AnalyzedLine[] =>
    isBody(altBody) ? elseToAnalyzedLines(altBody).concat(getAnalyzedLinesFromBody(altBody)) : [];

export {AnalyzedLine, isProgram, programToAnalyzedLines, ValueExpression, isLiteral, isIdentifier, isBinaryExpression, isUnaryExpression, isUpdateExpression, isConditionalExpression, isMemberExpression};