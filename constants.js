"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.table = exports.states = exports.charType = void 0;
var types_1 = require("./types");
// Base de comparacao do tipo de caracter
var charType = [
    { regex: /[0-9]/, type: 'digit' },
    { regex: /^\./, type: 'dot' },
    { regex: /\e/, type: 'e' },
    { regex: /\-/, type: 'hifen' },
    { regex: /^[^\d.]$/, type: '!digit!dot' },
    { regex: /[^0-9]/, type: '!digit' }
];
exports.charType = charType;
// Estados para aceitacao de Int e Float
var states = [
    {
        key: 'q0',
        start: true,
    },
    { key: 'q1' },
    { key: 'q2' },
    { key: 'q3' },
    { key: 'q4' },
    { key: 'q5' },
    {
        key: 'q6',
        final: true,
        tokenType: types_1.TokenFamily.Float
    },
    { key: 'q7' },
    { key: 'q8' },
    { key: 'q9' },
    { key: 'q10' },
    {
        key: 'q11',
        final: true,
        tokenType: types_1.TokenFamily.Integer
    },
    { key: 'q62' }
];
exports.states = states;
// Transicoes para aceitacao de Int e Float
var table = {
    'q0': {
        'digit': 'q1',
        'dot': 'q62'
    },
    'q1': {
        '!digit!dot': 'q11',
        'digit': 'q8',
        'dot': 'q2'
    },
    'q2': {
        'digit': 'q3',
        '!digit!dot': 'q6',
        'e': 'q4'
    },
    'q62': {
        'digit': 'q2'
    },
    'q3': {
        '!digit!dot': 'q6',
        'digit': 'q3',
        'e': 'q4'
    },
    'q4': {
        'digit': 'q7',
        'hifen': 'q5'
    },
    'q5': {
        'digit': 'q7'
    },
    'q6': {},
    'q7': {
        'digit': 'q7',
        '!digit!dot': 'q6'
    },
    'q8': {
        'digit': 'q9',
        '!digit!dot': 'q11',
        'dot': 'q2'
    },
    'q9': {
        'digit': 'q10',
        '!digit!dot': 'q11',
        'dot': 'q2'
    },
    'q10': {
        'digit': 'q10',
        '!digit': 'q11',
    },
    'q11': {},
};
exports.table = table;
