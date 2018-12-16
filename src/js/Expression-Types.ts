interface WithType {
    type: string;
}
const isWithType = (x: object): x is WithType => x != null && x.hasOwnProperty('type');

interface CodePostition {
    line: number;
    column: number;
}

interface Location {
    start: CodePostition;
    end: CodePostition;
}

export interface Program {
    type: 'Program';
    body: Expression[];
    sourceType: string;
    loc: Location;
}
export const isProgram = (x: object): x is Program => isWithType(x) ? x.type == 'Program' : false;

export type LoopStatement = WhileStatement | DoWhileStatement | ForStatement;
export const isLoopStatement = (x: object): x is LoopStatement => isWhileStatement(x) || isDoWhileStatement(x) || isForStatement(x);

export type AtomicExpression = VariableDeclaration | AssignmentExpression | ReturnStatement | BreakStatement;
export const isAtomicExpression = (x: object): x is AtomicExpression => isVariableDeclaration(x) || isAssignmentExpression(x) || isReturnStatement(x) ||
    isBreakStatement(x);

export type CompoundExpression = ExpressionStatement | FunctionDeclaration | ValueExpression | LoopStatement | IfStatement;
export const isCompoundExpression = (x: object): x is CompoundExpression => isExpressionStatement(x) || isFunctionDeclaration(x) || isValueExpression(x) ||
    isLoopStatement(x) || isIfStatement(x);

export type Expression = AtomicExpression | CompoundExpression;
export const isExpression = (x: object): x is Expression => isAtomicExpression(x) || isCompoundExpression(x);

export interface ExpressionStatement {
    type: 'ExpressionStatement';
    expression: Expression;
    loc: Location
}
export const isExpressionStatement = (x: any): x is ExpressionStatement => isWithType(x) ? x.type === 'ExpressionStatement' : false;

export interface Identifier {
    type: 'Identifier';
    name: string;
    loc: Location;
}
export const isIdentifier = (x: any): x is Identifier => isWithType(x) ? x.type === 'Identifier' : false;

export interface Literal {
    type: 'Literal';
    value: any;
    raw: string;
    loc: Location;
}
export const isLiteral = (x: any): x is Literal => isWithType(x) ? x.type === 'Literal' : false;

//type BinaryOperator = '+' | '-' | '*' | '/' | '>' | '<' | '>=' | '<=' | '==' | '===' | '**' | '&&' | '||';
export interface BinaryExpression {
    type: 'BinaryExpression';
    operator: string;
    left: ValueExpression;
    right: ValueExpression;
    loc: Location;
}
export const isBinaryExpression = (x: any): x is BinaryExpression => isWithType(x) ? x.type === 'BinaryExpression' : false;
export const createBinaryExpression = (operator: string, left: ValueExpression, right: ValueExpression, loc: Location): BinaryExpression =>
    ({type: 'BinaryExpression', operator: operator, left: left, right: right, loc: loc});

// type UnaryOperator = '!' | '-' | '+';
export interface UnaryExpression {
    type: 'UnaryExpression';
    operator: string;
    argument: ValueExpression;
    prefix: boolean;
    loc: Location;
}
export const isUnaryExpression = (x: any): x is UnaryExpression => isWithType(x) ? x.type === 'UnaryExpression' : false;
export const createUnaryExpression = (operator: string, argument: ValueExpression, prefix: boolean, loc: Location): UnaryExpression =>
    ({type: 'UnaryExpression', operator: operator, argument: argument, prefix: prefix, loc: loc});

export type ComputationExpression = BinaryExpression | UnaryExpression | UpdateExpression;
export const isComputationExpression = (x: object): x is ComputationExpression => isBinaryExpression(x) || isUnaryExpression(x) || isUpdateExpression(x);

export type ValueExpression = Literal | Identifier | ComputationExpression | ConditionalExpression | MemberExpression;
export const isValueExpression = (x: any): x is ValueExpression => isLiteral(x) || isIdentifier(x) || isComputationExpression(x) || isConditionalExpression(x) || isMemberExpression(x);

export interface BlockStatement {
    type: 'BlockStatement';
    body: Expression[];
    loc: Location;
}
export const isBlockStatement = (x: any): x is BlockStatement => isWithType(x) ? x.type === 'BlockStatement' : false;

export type Body = BlockStatement | Expression;
export const isBody = (x: any): x is Body => isBlockStatement(x) || isExpression(x);

export interface FunctionDeclaration {
    type: 'FunctionDeclaration';
    id: Identifier;
    params: Identifier[];
    body: Body;
    generator: boolean;
    expression: boolean;
    async: boolean;
    loc: Location;
}
export const isFunctionDeclaration = (x: any): x is FunctionDeclaration => isWithType(x) ? x.type === 'FunctionDeclaration' : false;

export interface VariableDeclarator {
    type: 'VariableDeclarator';
    id: Identifier;
    init: ValueExpression | null;
    loc: Location;
}
//export const isVariableDeclarator = (x: any): x is VariableDeclarator => isWithType(x) ? x.type === 'VariableDeclarator' : false;

export interface VariableDeclaration {
    type: 'VariableDeclaration';
    declarations: VariableDeclarator[];
    kind: string;
    loc: Location;
}
export const isVariableDeclaration = (x: any): x is VariableDeclaration => isWithType(x) ? x.type === 'VariableDeclaration' : false;

export type Assignable = Identifier | MemberExpression;

type AssignmentOperator = '=' | '+=' | '-=' | '*=' | '/=';
export interface AssignmentExpression {
    type: 'AssignmentExpression';
    operator: AssignmentOperator;
    left: Assignable;
    right: ValueExpression;
    loc: Location;
}
export const isAssignmentExpression = (x: any): x is AssignmentExpression => isWithType(x) ? x.type === 'AssignmentExpression' : false;

export interface UpdateExpression {
    type: 'UpdateExpression';
    operator: string;
    argument: Assignable;
    prefix: boolean;
    loc: Location;
}
export const isUpdateExpression = (x: any): x is UpdateExpression => isWithType(x) ? x.type === 'UpdateExpression' : false;
export const createUpdateExpression = (operator: string, argument: Assignable, prefix: boolean, loc: Location): UpdateExpression =>
    ({type: 'UpdateExpression', operator: operator, argument: argument, prefix: prefix, loc: loc});

export interface ConditionalExpression {
    type: 'ConditionalExpression';
    test: ValueExpression;
    consequent: ValueExpression;
    alternate: ValueExpression;
    loc: Location;
}
export const isConditionalExpression = (x: any): x is ConditionalExpression => isWithType(x) ? x.type === 'ConditionalExpression' : false;
export const createConditionalExpression = (test: ValueExpression, consequent: ValueExpression, alternate: ValueExpression, loc: Location): ConditionalExpression =>
    ({type: 'ConditionalExpression', test: test, consequent: consequent, alternate: alternate, loc: loc});

export interface MemberExpression {
    type: 'MemberExpression';
    computed: boolean;
    object: ValueExpression;
    property: ValueExpression;
    loc: Location;
}
export const isMemberExpression = (x: any): x is MemberExpression => isWithType(x) ? x.type === 'MemberExpression' : false;
export const createMemberExpression = (computed: boolean, object: ValueExpression, property: ValueExpression, loc: Location): MemberExpression =>
    ({type: 'MemberExpression', computed: computed, object: object, property: property, loc: loc});

export interface ReturnStatement {
    type: 'ReturnStatement';
    argument: ValueExpression;
    loc: Location;
}
export const isReturnStatement = (x: any): x is ReturnStatement => isWithType(x) ? x.type === 'ReturnStatement' : false;

export interface WhileStatement {
    type: 'WhileStatement';
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
export const isWhileStatement = (x: any) : x is WhileStatement => isWithType(x) ? x.type === 'WhileStatement' : false;

export interface DoWhileStatement {
    type: 'DoWhileStatement';
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
export const isDoWhileStatement = (x: any): x is DoWhileStatement => isWithType(x) ? x.type === 'DoWhileStatement' : false;

export interface ForStatement {
    type: 'ForStatement';
    init: VariableDeclaration | AssignmentExpression;
    test: ValueExpression;
    update: AssignmentExpression | UpdateExpression;
    body: BlockStatement;
    loc: Location;
}
export const isForStatement = (x: any): x is ForStatement => isWithType(x) ? x.type === 'ForStatement' : false;

export interface BreakStatement {
    type: 'BreakStatement';
    label: any;
    loc: Location;
}
export const isBreakStatement = (x: any): x is BreakStatement => isWithType(x) ? x.type === 'BreakStatement' : false;


export interface IfStatement {
    type: 'IfStatement';
    test: ValueExpression;
    consequent: Body;
    alternate: Body | null;
    loc: Location;
}
export const isIfStatement = (x: any): x is IfStatement => isWithType(x) ? x.type === 'IfStatement' : false;

export const literalToLitExp = (x: any) : Literal =>
    ({type: "Literal", value: x, raw: String(x), loc: null});