"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTokensAsTable = exports.countTokenOccurrence = exports.formatTransiontionTable = void 0;
/**
  * Funcao que conta a ocorrencia de tokens
  * @param {TToken[]} tokens lista de tokens gerados pelo lexer
  * @returns {{tk: string, count: number}[]} lista com os tokens e seus respectivos usos
*/
function countTokenOccurrence(tokens) {
    var ocurrences = {};
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (ocurrences[token.tokenKind])
            ocurrences[token.tokenKind]++;
        else
            ocurrences[token.tokenKind] = 1;
    }
    var result = [];
    for (var _a = 0, _b = Object.entries(ocurrences); _a < _b.length; _a++) {
        var _c = _b[_a], tokenKind = _c[0], count = _c[1];
        result.push({ tk: tokenKind, count: count });
    }
    return result;
}
exports.countTokenOccurrence = countTokenOccurrence;
/**
  * Funcao que formata para uma tabela os dados sobre os tokens reconhecidos
  * @param {TToken[]} tokens lista de tokens
  * @returns {{LIN: number | string, COL: number, TOKEN: string, LEXEMA: string}[]} lista do objeto que representa uma tabela de tokens
*/
function formatTokensAsTable(tokens) {
    var prevLineId = 0;
    return tokens.map(function (_a) {
        var col = _a.col, lin = _a.lin, tokenKind = _a.tokenKind, lexeme = _a.lexeme;
        var lineId = lin;
        if (lin === prevLineId)
            lineId = '';
        else
            prevLineId = lin;
        return {
            LIN: lineId,
            COL: col,
            TOKEN: tokenKind,
            LEXEMA: lexeme ? lexeme : ''
        };
    });
}
exports.formatTokensAsTable = formatTokensAsTable;
// IN PROGRESS
function formatTransiontionTable(table) {
    // Get all the states and symbols(transitions) with no duplications
    var states = Object.keys(table);
    var symbols = [];
    for (var state in table) {
        for (var symbol in table[state]) {
            if (symbols.indexOf(symbol) === -1) {
                symbols.push(symbol);
            }
        }
    }
    // header
    var tableStr = ' '.padEnd(5) + symbols.map(function (symbol) { return symbol.padEnd(12); }).join('');
    for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
        var state = states_1[_i];
        // add state to line
        tableStr += '\n' + state.padEnd(4) + ' ';
        // Set resultState on table for state(trasition) => resultState
        // If there is no resultState we set - in the table
        for (var _a = 0, symbols_1 = symbols; _a < symbols_1.length; _a++) {
            var symbol = symbols_1[_a];
            var nextState = table[state][symbol] || '-';
            tableStr += nextState.padEnd(12);
        }
    }
    return tableStr;
}
exports.formatTransiontionTable = formatTransiontionTable;
