# Compilador para Linguagem da Prof. Jaqc

RECONHECE Inteiro e Float

Instruções para rodar o projeto: 

Requisitos:
- node.js (preferência maior que v18)
- typescript (preferência maior que v5)
Passos:
1. clone o repositorio "git clone https://github.com/v1tor2003/Compiler.git"
2. cd compiler 
3. npm install 
4. npm install typescript --save-dev (se não tiver ts já instalado na máquina)
5. tsc index.ts
6. node index.js

Instruções para arquivo de entrada:

O arquivo deve se encontrar com a extensao .txt

Cada token (Inteiro ou Float) deve ser terminado com um caracter nao digito, ex:
1234a 1234'\n' 1234, 1234. 1234' '
