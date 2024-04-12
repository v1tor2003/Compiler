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
    /**
     * Inicia a classe lexica com as constantes importadas do arquivo de constantes.
     * @param {TCharTypeMapping[]} charTypeMappings array de regex e seu tipo
     * @param {TState[]} states estados do automato !! DEVE HAVER UM ESTADO INICIAL !!
     * @param {TTransitionTable} transitionTable mesa de transicao de modo que estado: {symbolo -> proxEstado}
     * @returns {} a funcao eh um construtor, inicia a classe, sem retorno.
    */
    function Lexer(charTypeMappings, states, transitionTable) {
        if (charTypeMappings === void 0) { charTypeMappings = constants_1.charType; }
        if (states === void 0) { states = constants_1.states; }
        if (transitionTable === void 0) { transitionTable = constants_1.table; }
        this.charTypeMappings = charTypeMappings;
        this.states = states;
        this.transitionTable = transitionTable;
    }
    /**
     * Funcao que reconhece os tokens segundo a stream de entrada vinda de um arquivo .txt.
     * @param {string} inputPath caminho para o arquivo
     * @returns {Promise<TToken[]>} a funcao retorna uma lista com todos os tokens reconhecidos
    */
    Lexer.prototype.tokenize = function (inputPath) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var tokens, state, lineCounter, _d, _e, _f, lineFromFile, colCounter, token, line, _i, line_1, c, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        tokens = [];
                        state = this.getStartState();
                        lineCounter = 1;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 7, 8, 13]);
                        _d = true;
                        return [4 /*yield*/, this.readFile(inputPath)];
                    case 2:
                        _e = __asyncValues.apply(void 0, [(_g.sent()).readLines()]);
                        _g.label = 3;
                    case 3: return [4 /*yield*/, _e.next()];
                    case 4:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3 /*break*/, 6];
                        _c = _f.value;
                        _d = false;
                        lineFromFile = _c;
                        colCounter = 1;
                        token = '';
                        line = lineFromFile.includes('\n') ? lineFromFile : lineFromFile + '\n';
                        for (_i = 0, line_1 = line; _i < line_1.length; _i++) {
                            c = line_1[_i];
                            token += c;
                            state = this.nextState(state, c);
                            if (state.key === 'rejected') {
                                console.log("Unrecognized Token '".concat(this.format(token), "' at line[").concat(lineCounter, "], col[").concat(colCounter, "]"));
                                token = '';
                                state = this.getStartState();
                            }
                            if (state.final) {
                                tokens.push({
                                    type: types_1.TokenFamily[state.tokenType],
                                    value: token.slice(0, -1)
                                });
                                token = '';
                                state = this.getStartState();
                            }
                            colCounter++;
                        }
                        lineCounter++;
                        _g.label = 5;
                    case 5:
                        _d = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _g.trys.push([8, , 11, 12]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _b.call(_e)];
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
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fsPromises.open(path, 'r')];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error('Error opening file: ' + error_1);
                    case 3: return [2 /*return*/];
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
        var _this = this;
        var _loop_1 = function (regex, type) {
            if (!this_1.transitionTable[state.key][type])
                return "continue";
            if (regex.test(c))
                return { value: this_1.states.find(function (s) { return s.key === _this.transitionTable[state.key][type]; }) };
        };
        var this_1 = this;
        for (var _i = 0, _a = this.charTypeMappings; _i < _a.length; _i++) {
            var _b = _a[_i], regex = _b.regex, type = _b.type;
            var state_1 = _loop_1(regex, type);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return {
            key: 'rejected'
        };
    };
    /**
     * Funcao acha na lista de estados, o incial, caso nao exista tal estado ela dispara um erro.
     * @returns {TState} a funcao retorna o estado inicial do automato
    */
    Lexer.prototype.getStartState = function () {
        var startState = this.states.find(function (state) { return state.start === true; });
        if (!startState)
            throw new Error('It was not possible to find the initial state of the automaton.');
        return startState;
    };
    /**
     * Formata string, se o caracter for '\n', mostra como caracter nao como a quebra de linha
     * @param {string} str string para teste
     * @returns {string} a funcao retorna a string formatada
    */
    Lexer.prototype.format = function (str) { return str.localeCompare('\n') === 0 ? '\\n' : str; };
    return Lexer;
}());
exports.Lexer = Lexer;
