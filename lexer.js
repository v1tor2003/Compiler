"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
var fsPromises = require("fs/promises");
var types_1 = require("./types");
var constants_1 = require("./constants");
var Lexer = /** @class */ (function () {
    function Lexer(sourceCodeErrorReport, lastErrorLine) {
        if (sourceCodeErrorReport === void 0) { sourceCodeErrorReport = ''; }
        if (lastErrorLine === void 0) { lastErrorLine = ''; }
        this.sourceCodeErrorReport = sourceCodeErrorReport;
        this.lastErrorLine = lastErrorLine;
    }
    /**
     * Funcao que reconhece os tokens segundo a stream de entrada vinda de um arquivo .txt.
     * @param {string} inputPath caminho para o arquivo
     * @returns {Promise<TToken[]>} a funcao retorna uma lista com todos os tokens reconhecidos
    */
    Lexer.prototype.tokenize = function (inputPath) {
        var _a, e_1, _b, _c;
        var _d;
        return __awaiter(this, void 0, void 0, function () {
            var tokens, _e, fileLines, EOF, rewind, token, lineCounter, state, _f, fileLines_1, fileLines_1_1, fileLine, line, c, value, tk, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        tokens = [];
                        return [4 /*yield*/, this.readFile(inputPath)];
                    case 1:
                        _e = (_g.sent()), fileLines = _e.fileLines, EOF = _e.EOF;
                        rewind = false;
                        token = '';
                        lineCounter = 1;
                        state = this.getStartState();
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 7, 8, 13]);
                        _f = true, fileLines_1 = __asyncValues(fileLines);
                        _g.label = 3;
                    case 3: return [4 /*yield*/, fileLines_1.next()];
                    case 4:
                        if (!(fileLines_1_1 = _g.sent(), _a = fileLines_1_1.done, !_a)) return [3 /*break*/, 6];
                        _c = fileLines_1_1.value;
                        _f = false;
                        fileLine = _c;
                        line = fileLine.includes('\n') ? fileLine : fileLine + '\n';
                        this.sourceCodeErrorReport += "[".concat(lineCounter, "] ").concat(line);
                        for (c = 0; c < line.length; c++) {
                            c = rewind ? c - 1 : c;
                            rewind = false;
                            state = this.nextState(state, line[c]);
                            if (!state.key) {
                                if (/[^\n ]/.test(line[c]))
                                    this.setErrorOnSource(state, token.length, lineCounter, c);
                                token = '';
                                state = this.getStartState();
                                continue;
                            }
                            if (state.err) {
                                this.setErrorOnSource(state, token.length, lineCounter, c);
                                token = '';
                                state = this.getStartState();
                                rewind = state.pathHadWedding ? true : false;
                                continue;
                            }
                            if (!state.final) {
                                if (lineCounter === EOF.posLine && c === EOF.posCol) {
                                    state = this.nextState(state, '$');
                                    this.setErrorOnSource(state, 0, lineCounter, c);
                                }
                                token += line[c] !== '\n' ? line[c] : '';
                                continue;
                            }
                            value = void 0;
                            if (state.pathHadWedding) {
                                rewind = line[c] === '\n' ? false : true;
                                value = token;
                            }
                            else
                                value = token + line[c];
                            if (state.tokenType !== undefined) {
                                tk = (state.tokenType === types_1.TokenFamily.TK_RESERVADA) ? types_1.TokenFamily[(_d = Lexer.keywords.find(function (k) { return k.value === token; })) === null || _d === void 0 ? void 0 : _d.tokenType] : types_1.TokenFamily[state.tokenType];
                                tk !== undefined ? tokens.push({
                                    tokenKind: tk,
                                    lexeme: this.getLexeme(tk, value),
                                    lin: lineCounter,
                                    col: c + 1 - (value.length > 1 ? value.length : 0)
                                }) :
                                    this.setErrorOnSource(state, token.length, lineCounter, c);
                            }
                            token = '';
                            state = this.getStartState();
                        }
                        lineCounter++;
                        _g.label = 5;
                    case 5:
                        _f = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _g.trys.push([8, , 11, 12]);
                        if (!(!_f && !_a && (_b = fileLines_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _b.call(fileLines_1)];
                    case 9:
                        _g.sent();
                        _g.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/, tokens];
                }
            });
        });
    };
    /**
     * Funcao realiza a leitura do arquivo de entrada .txt.
     * @param {string} path caminho do arquivo
     * @returns {Promise<fsPromises.FileHandle>} a funcao retorna um handler para o arquivo
    */
    Lexer.prototype.readFile = function (path) {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var counterHandler, linesOfFile, linesCount, charCount, _d, linesOfFile_1, linesOfFile_1_1, l, _i, l_1, c, e_2_1, fileHandler, error_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 16, , 17]);
                        return [4 /*yield*/, fsPromises.open(path, 'r')];
                    case 1:
                        counterHandler = _e.sent();
                        linesOfFile = counterHandler.readLines();
                        linesCount = 0;
                        charCount = 0;
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 8, 13]);
                        _d = true, linesOfFile_1 = __asyncValues(linesOfFile);
                        _e.label = 3;
                    case 3: return [4 /*yield*/, linesOfFile_1.next()];
                    case 4:
                        if (!(linesOfFile_1_1 = _e.sent(), _a = linesOfFile_1_1.done, !_a)) return [3 /*break*/, 6];
                        _c = linesOfFile_1_1.value;
                        _d = false;
                        l = _c;
                        linesCount++;
                        charCount = 0;
                        for (_i = 0, l_1 = l; _i < l_1.length; _i++) {
                            c = l_1[_i];
                            charCount++;
                        }
                        _e.label = 5;
                    case 5:
                        _d = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_2_1 = _e.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _e.trys.push([8, , 11, 12]);
                        if (!(!_d && !_a && (_b = linesOfFile_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _b.call(linesOfFile_1)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [4 /*yield*/, counterHandler.close()];
                    case 14:
                        _e.sent();
                        return [4 /*yield*/, fsPromises.open(path, 'r')];
                    case 15:
                        fileHandler = _e.sent();
                        return [2 /*return*/, { fileLines: fileHandler.readLines(), EOF: { posLine: linesCount, posCol: charCount } }];
                    case 16:
                        error_1 = _e.sent();
                        throw new Error('Erro ao abrir arquivo: ' + error_1);
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Dado o estado atual, verifica na lista de regex se existe transicao no estado
     * para aquele tipo de caracter e se sim transiciona
     * em caso de nao existir tal transicao o estado de retorno eh o de rejeicao
     * @param {TState} state estado atual do automato
     * @param {string} c caracter atual da stream de leitura
     * @returns {TState} a funcao retorna o proximo estado
    */
    Lexer.prototype.nextState = function (state, c) {
        var _loop_1 = function (regex, type) {
            if (!Lexer.transitionTable[state.key][type])
                return "continue";
            if (regex.test(c)) {
                return { value: Lexer.states.find(function (s) { return s.key === Lexer.transitionTable[state.key][type]; }) };
            }
        };
        for (var _i = 0, _a = Lexer.charTypeMappings; _i < _a.length; _i++) {
            var _b = _a[_i], regex = _b.regex, type = _b.type;
            var state_1 = _loop_1(regex, type);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return { key: '' };
    };
    /**
     * Funcao acha na lista de estados, o incial, caso nao exista tal estado ela dispara um erro.
     * @returns {TState} a funcao retorna o estado inicial do automato
    */
    Lexer.prototype.getStartState = function () {
        var startState = Lexer.states.find(function (state) { return state.start === true; });
        if (!startState)
            throw new Error('Nao foi possivel achar o estado inicial do automato.');
        return startState;
    };
    /**
     * Formata string, se o caracter for '\n', mostra como caracter nao como a quebra de linha
     * @param {string} c caracter para teste
     * @returns {string} a funcao retorna a string formatada
    */
    Lexer.prototype.format = function (c) { return c.localeCompare('\n') === 0 ? '\\n' : c; };
    Lexer.prototype.getSourceCodeErrors = function () { return this.sourceCodeErrorReport; };
    Lexer.prototype.setErrorOnSource = function (state, tokenSize, line, col) {
        var _a;
        var errorPointer = '';
        var errorMsg = (_a = state.err) === null || _a === void 0 ? void 0 : _a.msg;
        var errorCol = (errorMsg === null || errorMsg === void 0 ? void 0 : errorMsg.includes('Cadeia')) ? col : col - tokenSize + 1;
        var newError = "   Erro linha ".concat(line, " coluna ").concat(errorCol, ": ").concat(errorMsg ? errorMsg : 'Simbolo nao reconhecido', "\n");
        this.sourceCodeErrorReport += '   ';
        for (var i = 0; i < errorCol; i++)
            errorPointer += '-';
        errorPointer += '^\n';
        this.sourceCodeErrorReport += errorPointer;
        if (this.lastErrorLine === '')
            this.sourceCodeErrorReport += newError;
        if (this.lastErrorLine.includes(line.toString())) {
            this.sourceCodeErrorReport.replace(this.lastErrorLine, errorPointer);
            this.sourceCodeErrorReport += this.lastErrorLine;
            this.sourceCodeErrorReport += newError;
        }
        this.lastErrorLine = newError;
    };
    Lexer.prototype.getLexeme = function (tokenType, value) {
        return Lexer.canHaveLexeme.includes(types_1.TokenFamily[tokenType]) ? value : undefined;
    };
    Lexer.keywords = constants_1.keywords;
    Lexer.charTypeMappings = constants_1.charType;
    Lexer.states = constants_1.states;
    Lexer.transitionTable = constants_1.table;
    Lexer.canHaveLexeme = [
        types_1.TokenFamily.TK_INT,
        types_1.TokenFamily.TK_FLOAT,
        types_1.TokenFamily.TK_END,
        types_1.TokenFamily.TK_ID,
        types_1.TokenFamily.TK_CADEIA,
        types_1.TokenFamily.TK_DATA
    ];
    return Lexer;
}());
exports.Lexer = Lexer;
