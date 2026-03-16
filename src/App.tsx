import { useState, useEffect } from 'react';
import './App.css';

interface Folder {
  id: string;
  name: string;
  code?: string;
  subfolders?: Folder[];
  details?: {
    file: string;
    commands: string[];
    input: string;
    output: string;
  };
  options?: Record<string, { file: string; code: string }>;
}

const folders: Folder[] = [
  {
    id: 'exp3',
    name: 'EXP 3 — Lexical Analyzer',
    code: `%{
#include <stdio.h>
%}

digit [0-9]
id [a-zA-Z][a-zA-Z0-9]*

%%

int|float|char|return     printf("Keyword: %s\\n", yytext);
{id}                      printf("Identifier: %s\\n", yytext);
{digit}+                  printf("Number: %s\\n", yytext);
[+\\-*/=]                  printf("Operator: %s\\n", yytext);
[;(){}]                   printf("Special Symbol: %s\\n", yytext);
[ \\t\\n]                   ;
.                         printf("Unknown: %s\\n", yytext);

%%

int main(){
printf("Enter code:\\n");
yylex();
}
int yywrap(){return 1;}`,
    details: {
      file: "lexer.l",
      commands: ["flex lexer.l", "gcc lex.yy.c", "./a.out"],
      input: "int a = 5 + b;",
      output: `Keyword: int
Identifier: a
Operator: =
Number: 5
Operator: +
Identifier: b
Special Symbol: ;`
    }
  },
  {
    id: 'exp4',
    name: 'EXP 4 — FLEX Programs',
    subfolders: [
      {
        id: 'exp4_1',
        name: '4.1 — Vowel or Not',
        code: `%{
#include <stdio.h>
%}

%%

[aAeEiIoOuU]     { printf("%s is a vowel\\n", yytext); }

[a-zA-Z]         { printf("%s is not a vowel\\n", yytext); }

\\n               return 0;

.                ;

%%

int main()
{
    printf("Enter characters:\\n");
    yylex();
    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "vowel.l",
          commands: ["flex vowel.l", "gcc lex.yy.c -o vowel -lfl", "./vowel"],
          input: `a
b
E
k`,
          output: `a is a vowel
b is not a vowel
E is a vowel
k is not a vowel`
        }
      },
      {
        id: 'exp4_2',
        name: '4.2 — Count Lines and Characters',
        code: `%{
#include <stdio.h>

int lines = 0;
int chars = 0;
%}

%%

\\n        { lines++; chars++; }
.         { chars++; }

%%

int main()
{
    printf("Enter text (Ctrl+D to stop):\\n");
    yylex();

    printf("Number of lines = %d\\n", lines);
    printf("Number of characters = %d\\n", chars);

    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "count.l",
          commands: ["flex count.l", "gcc lex.yy.c -o count -lfl", "./count"],
          input: `Hello
SRM
University`,
          output: `Number of lines = 3
Number of characters = 19`
        }
      },
      {
        id: 'exp4_3',
        name: '4.3 — Total Number of Characters',
        code: `%{
#include <stdio.h>
int count = 0;
%}

%%

.     { count++; }
\\n    { count++; }

%%

int main()
{
    printf("Enter text:\\n");
    yylex();

    printf("Total characters = %d\\n", count);

    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "totalchars.l",
          commands: ["flex totalchars.l", "gcc lex.yy.c -o totalchars -lfl", "./totalchars"],
          input: `Hello 123`,
          output: `Total characters = 9`
        }
      },
      {
        id: 'exp4_4',
        name: '4.4 — Number of Words',
        code: `%{
#include <stdio.h>
int words = 0;
%}

%%

[a-zA-Z]+    { words++; }

\\n           ;

.            ;

%%

int main()
{
    printf("Enter text (Ctrl+D to stop):\\n");
    yylex();

    printf("Number of words = %d\\n", words);

    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "wordcount.l",
          commands: ["flex wordcount.l", "gcc lex.yy.c -o wordcount -lfl", "./wordcount"],
          input: `Hello SRM University`,
          output: `Number of words = 3`
        }
      },
      {
        id: 'exp4_5',
        name: '4.5 — Count Lines, Spaces and Tabs',
        code: `%{
#include <stdio.h>

int lines = 0;
int spaces = 0;
int tabs = 0;
%}

%%

\\n        { lines++; }

" "       { spaces++; }

\\t        { tabs++; }

.         ;

%%

int main()
{
    printf("Enter text (Ctrl+D to stop):\\n");
    yylex();

    printf("Lines = %d\\n", lines);
    printf("Spaces = %d\\n", spaces);
    printf("Tabs = %d\\n", tabs);

    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "line_space_tab.l",
          commands: ["flex line_space_tab.l", "gcc lex.yy.c -o line_space_tab -lfl", "./line_space_tab"],
          input: `Hello SRM
Compiler Design`,
          output: `Lines = 2
Spaces = 2
Tabs = 0`
        }
      },
      {
        id: 'exp4_6',
        name: '4.6 — Frequency of Given Word',
        code: `%{
#include <stdio.h>
#include <string.h>

int count = 0;
char word[20];
%}

%%

[a-zA-Z]+    {
                if(strcmp(yytext, word) == 0)
                    count++;
             }

\\n           ;

.            ;

%%

int main()
{
    printf("Enter word to search: ");
    scanf("%s", word);

    printf("Enter text (Ctrl+D to stop):\\n");

    yylex();

    printf("Frequency of '%s' = %d\\n", word, count);

    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "wordfreq.l",
          commands: ["flex wordfreq.l", "gcc lex.yy.c -o wordfreq -lfl", "./wordfreq"],
          input: `Enter word to search: hello

hello world hello srm hello`,
          output: `Frequency of 'hello' = 3`
        }
      },
      {
        id: 'exp4_7',
        name: '4.7 — Uppercase & Lowercase Letter',
        code: `%{
#include <stdio.h>
%}

%%

[A-Z]     { printf("%s is uppercase\\n", yytext); }

[a-z]     { printf("%s is lowercase\\n", yytext); }

\\n        return 0;

.         ;

%%

int main()
{
    printf("Enter characters:\\n");
    yylex();

    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "casecheck.l",
          commands: ["flex casecheck.l", "gcc lex.yy.c -o casecheck -lfl", "./casecheck"],
          input: `A
b
C
d`,
          output: `A is uppercase
b is lowercase
C is uppercase
d is lowercase`
        }
      },
      {
        id: 'exp4_8',
        name: '4.8 — String is Digit or Word',
        code: `%{
#include <stdio.h>
%}

%%

[0-9]+        { printf("%s is a digit\\n", yytext); }

[a-zA-Z]+     { printf("%s is a word\\n", yytext); }

\\n            return 0;

.             { printf("%s unknown input\\n", yytext); }

%%

int main()
{
    printf("Enter string:\\n");
    yylex();
    return 0;
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "digit_word.l",
          commands: ["flex digit_word.l", "gcc lex.yy.c -o digit_word -lfl", "./digit_word"],
          input: `123
hello`,
          output: `123 is a digit
hello is a word`
        }
      },
      {
        id: 'exp4_9',
        name: '4.9 — Positive Closure',
        code: `%{
#include<stdio.h>
%}

%%

a+    { printf("Positive closure matched: %s\\n", yytext); }

\\n    return 0;

.     ;

%%

int main()
{
    printf("Enter sequence:\\n");
    yylex();
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "positive.l",
          commands: ["flex positive.l", "gcc lex.yy.c -o positive -lfl", "./positive"],
          input: "aaa",
          output: "Positive closure matched: aaa"
        }
      },
      {
        id: 'exp4_10',
        name: '4.10 — Total Number of Tokens',
        code: `%{
#include<stdio.h>
int tokens = 0;
%}

%%

[a-zA-Z]+      { tokens++; }

[0-9]+         { tokens++; }

[+\\*/=]       { tokens++; }

[ \\t\\n]        ;

.              { tokens++; }

%%

int main()
{
    printf("Enter input:\\n");
    yylex();

    printf("Total tokens = %d\\n", tokens);
}

int yywrap()
{
    return 1;
}`,
        details: {
          file: "tokens.l",
          commands: ["flex tokens.l", "gcc lex.yy.c -o tokens -lfl", "./tokens"],
          input: "a = 10 + b",
          output: "Total tokens = 5"
        }
      },
      {
        id: 'exp4_11',
        name: '4.11 — Positive & Negative Numbers',
        code: `%{
#include<stdio.h>

int pos = 0;
int neg = 0;
%}

%%

-[0-9]+     { neg++; printf("%s Negative number\\n", yytext); }

[0-9]+      { pos++; printf("%s Positive number\\n", yytext); }

\\n          return 0;

.           ;

%%

int main()
{
    printf("Enter numbers:\\n");
    yylex();

    printf("Positive = %d\\n", pos);
    printf("Negative = %d\\n", neg);

    return 0;
}

int yywrap(){ return 1; }`,
        details: {
          file: "posneg.l",
          commands: ["flex posneg.l", "gcc lex.yy.c -o posneg -lfl", "./posneg"],
          input: `10
-5
20
-3`,
          output: `10 Positive number
-5 Negative number
20 Positive number
-3 Negative number
Positive = 2
Negative = 2`
        }
      },
      {
        id: 'exp4_12',
        name: '4.12 — Identify Operators',
        code: `%{
#include<stdio.h>
%}

%%

[+\\*/=]     { printf("%s is an operator\\n", yytext); }

[a-zA-Z0-9]+ { printf("%s is not an operator\\n", yytext); }

\\n           return 0;

.            ;

%%

int main()
{
    printf("Enter input:\\n");
    yylex();
    return 0;
}

int yywrap(){ return 1; }`,
        details: {
          file: "operator.l",
          commands: ["flex operator.l", "gcc lex.yy.c -o operator -lfl", "./operator"],
          input: `+
a
*`,
          output: `+ is an operator
a is not an operator
* is an operator`
        }
      },
      {
        id: 'exp4_13',
        name: '4.13 — Identify Identifier',
        code: `%{
#include<stdio.h>
%}

%%

[a-zA-Z_][a-zA-Z0-9_]*   { printf("%s is an identifier\\n", yytext); }

\\n                       return 0;

.                        { printf("%s not identifier\\n", yytext); }

%%

int main()
{
    printf("Enter identifier:\\n");
    yylex();
    return 0;
}

int yywrap(){ return 1; }`,
        details: {
          file: "identifier.l",
          commands: ["flex identifier.l", "gcc lex.yy.c -o identifier -lfl", "./identifier"],
          input: "count1",
          output: "count1 is an identifier"
        }
      },
      {
        id: 'exp4_14',
        name: '4.14 — Identify Number',
        code: `%{
#include<stdio.h>
%}

%%

[0-9]+     { printf("%s is a number\\n", yytext); }

[a-zA-Z]+  { printf("%s is not a number\\n", yytext); }

\\n         return 0;

.          ;

%%

int main()
{
    printf("Enter input:\\n");
    yylex();
    return 0;
}

int yywrap(){ return 1; }`,
        details: {
          file: "number.l",
          commands: ["flex number.l", "gcc lex.yy.c -o number -lfl", "./number"],
          input: `123
abc`,
          output: `123 is a number
abc is not a number`
        }
      },
      {
        id: 'exp4_15',
        name: '4.15 — Identify Keyword',
        code: `%{
#include<stdio.h>
%}

%%

"int"|"float"|"char"|"if"|"else"|"while"|"return"
        { printf("%s is a keyword\\n", yytext); }

[a-zA-Z]+
        { printf("%s is not a keyword\\n", yytext); }

\\n      return 0;

.       ;

%%

int main()
{
    printf("Enter word:\\n");
    yylex();
    return 0;
}

int yywrap(){ return 1; }`,
        details: {
          file: "keyword.l",
          commands: ["flex keyword.l", "gcc lex.yy.c -o keyword -lfl", "./keyword"],
          input: `int
hello`,
          output: `int is a keyword
hello is not a keyword`
        }
      }
    ]
  },
  {
    id: 'exp5',
    name: 'EXP 5 — Left Recursion and Left Factoring',
    code: ``, // dynamic based on language
    options: {
      c_cpp: {
        file: "leftrec.cpp",
        code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main()
{
    string nonTerminal;
    int n;

    cout << "Enter Non-Terminal (Example E): ";
    cin >> nonTerminal;

    cout << "Enter number of productions: ";
    cin >> n;

    vector<string> prod(n);
    vector<string> alpha, beta;

    cout << "Enter productions (without A->):\\n";

    for(int i=0;i<n;i++)
    {
        cin >> prod[i];

        if(prod[i][0] == nonTerminal[0])
            alpha.push_back(prod[i].substr(1));
        else
            beta.push_back(prod[i]);
    }

    // -------- LEFT RECURSION --------
    if(!alpha.empty())
    {
        cout<<"\\nGrammar after removing Left Recursion:\\n";

        cout<<nonTerminal<<" -> ";

        for(int i=0;i<beta.size();i++)
            cout<<beta[i]<<nonTerminal<<"' | ";

        cout<<"\\n";

        cout<<nonTerminal<<"' -> ";

        for(int i=0;i<alpha.size();i++)
            cout<<alpha[i]<<nonTerminal<<"' | ";

        cout<<"ε\\n";
    }
    else
        cout<<"\\nNo Left Recursion found\\n";



    // -------- LEFT FACTORING --------
    cout<<"\\nChecking Left Factoring...\\n";

    string prefix = prod[0];

    for(int i=1;i<n;i++)
    {
        int j=0;

        while(j < prefix.size() && j < prod[i].size() && prefix[j]==prod[i][j])
            j++;

        prefix = prefix.substr(0,j);
    }

    if(prefix.empty())
    {
        cout<<"No Left Factoring needed\\n";
        return 0;
    }

    cout<<"\\nGrammar after Left Factoring:\\n";

    cout<<nonTerminal<<" -> "<<prefix<<nonTerminal<<"'\\n";

    cout<<nonTerminal<<"' -> ";

    for(int i=0;i<n;i++)
    {
        string remain = prod[i].substr(prefix.length());

        if(remain.empty())
            cout<<"ε | ";
        else
            cout<<remain<<" | ";
    }

    cout<<endl;
}`
      },
      c: {
        file: "leftrec.c",
        code: `#include<stdio.h>
#include<string.h>

int main()
{
    char nt;
    char prod[10][20], alpha[10][20], beta[10][20];
    char prefix[20], s1[20], s2[20];
    int n,i,a=0,b=0;

    printf("Enter Non-Terminal: ");
    scanf(" %c",&nt);

    printf("Enter number of productions: ");
    scanf("%d",&n);

    printf("Enter productions:\\n");

    for(i=0;i<n;i++)
    {
        scanf("%s",prod[i]);

        if(prod[i][0]==nt)
        {
            strcpy(alpha[a],prod[i]+1);
            a++;
        }
        else
        {
            strcpy(beta[b],prod[i]);
            b++;
        }
    }

    printf("\\nAfter Eliminating Left Recursion:\\n");

    printf("%c -> ",nt);
    for(i=0;i<b;i++)
        printf("%s%c' ",beta[i],nt);

    printf("\\n%c' -> ",nt);
    for(i=0;i<a;i++)
        printf("%s%c' | ",alpha[i],nt);

    printf("epsilon\\n");

    printf("\\n----- Left Factoring -----\\n");

    printf("Enter two productions for factoring:\\n");
    scanf("%s %s",s1,s2);

    int j=0;
    while(s1[j]==s2[j])
    {
        prefix[j]=s1[j];
        j++;
    }
    prefix[j]='\\0';

    printf("Common Prefix: %s\\n",prefix);

    printf("%c -> %s%c'\\n",nt,prefix,nt);
    printf("%c' -> %s | %s\\n",nt,s1+j,s2+j);

    return 0;
}`
      }
    },
    details: {
      file: "leftrec.cpp / leftrec.c",
      commands: ["g++ leftrec.cpp", "gcc leftrec.c", "./a.out"],
      input: `Example 1 (Left Recursion)
Enter Non-Terminal: E
Enter number of productions: 2
E+T
T

Example 2 (Left Factoring)
Enter Non-Terminal: S
Enter number of productions: 2
abS
aSb`,
      output: `Example 1 Output:
Grammar after removing Left Recursion:
E -> TE' | 
E' -> +TE' | ε

Example 2 Output:
Grammar after Left Factoring
S -> aS'
S' -> bS | Sb`
    }
  },
  {
    id: 'exp6',
    name: 'EXP 6 — Calculator using FLEX + BISON',
    code: ``, // dynamic based on language
    options: {
      flex: {
        file: "calc.l",
        code: `%{
#include "calc.tab.h"
#include<stdio.h>
%}

%%

[0-9]+ { yylval=atoi(yytext); return NUMBER; }

[+\\-*/()] return yytext[0];

\\n return 0;

[ \\t] ;

%%`
      },
      bison: {
        file: "calc.y",
        code: `%{
%{
#include<stdio.h>
#include<stdlib.h>
void yyerror(const char *s);
int yylex();
%}

%token NUMBER

%left '+' '-'
%left '*' '/'

%%

line:
    exp '\n' { printf("Result = %d\n",$1); }
    ;

exp:
      exp '+' exp { $$ = $1 + $3; }
    | exp '-' exp { $$ = $1 - $3; }
    | exp '*' exp { $$ = $1 * $3; }
    | exp '/' exp { $$ = $1 / $3; }
    | NUMBER { $$ = $1; }
    ;

%%

void yyerror(const char *s)
{
    printf("Error\n");
}

int main()
{
    printf("Enter expression:\n");
    yyparse();
    return 0;
}`
      }
    },
    details: {
      file: "calc.l / calc.y",
      commands: ["flex calc.l", "bison -d calc.y", "gcc calc.tab.c lex.yy.c -o calc", "./calc"],
      input: "5+3*2",
      output: "Result = 11"
    }
  },
  {
    id: 'exp7',
    name: 'EXP 7 — Compute FIRST & FOLLOW',
    code: ``, // dynamic based on language
    options: {
      c_cpp: {
        file: "firstfollow.cpp",
        code: `#include <iostream>
#include <cstring>
using namespace std;

char production[10][10];
char first[10];
char follow[10];
int n;

void findFirst(char c)
{
    for(int i=0;i<n;i++)
    {
        if(production[i][0]==c)
        {
            if(!(production[i][2]>='A' && production[i][2]<='Z'))
                cout<<production[i][2]<<" ";
            else
                findFirst(production[i][2]);
        }
    }
}

void findFollow(char c)
{
    if(production[0][0]==c)
        cout<<"$ ";

    for(int i=0;i<n;i++)
    {
        for(int j=2;j<strlen(production[i]);j++)
        {
            if(production[i][j]==c)
            {
                if(production[i][j+1]!='\\0')
                    findFirst(production[i][j+1]);

                if(production[i][j+1]=='\\0' && c!=production[i][0])
                    findFollow(production[i][0]);
            }
        }
    }
}

int main()
{
    cout<<"Enter number of productions: ";
    cin>>n;

    cout<<"Enter productions (Example E=TR):\\n";

    for(int i=0;i<n;i++)
        cin>>production[i];

    cout<<"\\nFIRST sets\\n";

    for(int i=0;i<n;i++)
    {
        cout<<"FIRST("<<production[i][0]<<") = { ";
        findFirst(production[i][0]);
        cout<<"}\\n";
    }

    cout<<"\\nFOLLOW sets\\n";

    for(int i=0;i<n;i++)
    {
        cout<<"FOLLOW("<<production[i][0]<<") = { ";
        findFollow(production[i][0]);
        cout<<"}\\n";
    }
}`
      },
      c: {
        file: "firstfollow.c",
        code: `#include<stdio.h>
#include<string.h>

char prod[10][10];
int n;

void first(char c)
{
    int i;

    for(i=0;i<n;i++)
    {
        if(prod[i][0]==c)
        {
            if(!(prod[i][2]>='A' && prod[i][2]<='Z'))
                printf("%c ",prod[i][2]);
            else
                first(prod[i][2]);
        }
    }
}

void follow(char c)
{
    int i,j;

    if(prod[0][0]==c)
        printf("$ ");

    for(i=0;i<n;i++)
    {
        for(j=2;j<strlen(prod[i]);j++)
        {
            if(prod[i][j]==c)
            {
                if(prod[i][j+1]!='\\0')
                    first(prod[i][j+1]);

                if(prod[i][j+1]=='\\0' && c!=prod[i][0])
                    follow(prod[i][0]);
            }
        }
    }
}

int main()
{
    int i;

    printf("Enter number of productions: ");
    scanf("%d",&n);

    printf("Enter productions (Example E=TR)\\n");

    for(i=0;i<n;i++)
        scanf("%s",prod[i]);

    printf("\\nFIRST sets\\n");

    for(i=0;i<n;i++)
    {
        printf("FIRST(%c) = { ",prod[i][0]);
        first(prod[i][0]);
        printf("}\\n");
    }

    printf("\\nFOLLOW sets\\n");

    for(i=0;i<n;i++)
    {
        printf("FOLLOW(%c) = { ",prod[i][0]);
        follow(prod[i][0]);
        printf("}\\n");
    }
}`
      }
    },
    details: {
      file: "firstfollow.cpp / firstfollow.c",
      commands: ["g++ firstfollow.cpp", "gcc firstfollow.c", "./a.out"],
      input: `5
E=TR
R=+TR
R=#
T=FY
F=i`,
      output: `FIRST(E) = { i }
FIRST(R) = { + # }
FIRST(T) = { i }
FIRST(F) = { i }

FOLLOW(E) = { $ }
FOLLOW(R) = { $ }
FOLLOW(T) = { + $ }
FOLLOW(F) = { + $ }`
    }
  },
  {
    id: 'exp8',
    name: 'EXP 8 — Predictive Parsing Table',
    code: ``, // dynamic based on language
    options: {
      c_cpp: {
        file: "predictive.cpp",
        code: `#include <iostream>
#include <vector>
#include <set>
#include <map>
#include <cstring>
using namespace std;

map<char, set<char>> firstSet;
map<char, set<char>> followSet;
vector<string> prod;

bool isTerminal(char c)
{
    return !(c >= 'A' && c <= 'Z');
}

void computeFirst(char X)
{
    for(auto p : prod)
    {
        if(p[0] == X)
        {
            if(isTerminal(p[3]))
                firstSet[X].insert(p[3]);
            else
            {
                computeFirst(p[3]);
                for(auto x : firstSet[p[3]])
                    firstSet[X].insert(x);
            }
        }
    }
}

void computeFollow(char X)
{
    if(X == prod[0][0])
        followSet[X].insert('$');

    for(auto p : prod)
    {
        for(int i=3;i<p.size();i++)
        {
            if(p[i]==X)
            {
                if(i+1<p.size())
                {
                    char next = p[i+1];

                    if(isTerminal(next))
                        followSet[X].insert(next);
                    else
                        for(auto x : firstSet[next])
                            followSet[X].insert(x);
                }
                else
                {
                    for(auto x : followSet[p[0]])
                        followSet[X].insert(x);
                }
            }
        }
    }
}

int main()
{
    int n;
    cout<<"Enter number of productions: ";
    cin>>n;

    cout<<"Enter productions (Example E->TR)\\n";

    for(int i=0;i<n;i++)
    {
        string s;
        cin>>s;
        prod.push_back(s);
    }

    set<char> nonTerminals;

    for(auto p:prod)
        nonTerminals.insert(p[0]);

    for(auto nt:nonTerminals)
        computeFirst(nt);

    for(auto nt:nonTerminals)
        computeFollow(nt);

    cout<<"\\nFIRST sets\\n";
    for(auto nt:nonTerminals)
    {
        cout<<"FIRST("<<nt<<") = { ";
        for(auto x:firstSet[nt]) cout<<x<<" ";
        cout<<"}\\n";
    }

    cout<<"\\nFOLLOW sets\\n";
    for(auto nt:nonTerminals)
    {
        cout<<"FOLLOW("<<nt<<") = { ";
        for(auto x:followSet[nt]) cout<<x<<" ";
        cout<<"}\\n";
    }

    cout<<"\\nPredictive Parsing Table\\n";

    for(auto p:prod)
    {
        char A = p[0];
        char a = p[3];

        cout<<"M["<<A<<","<<a<<"] = "<<p<<endl;
    }
}`
      },
      c: {
        file: "predictive.c",
        code: `#include<stdio.h>
#include<string.h>

char prod[10][10];
char first[10], follow[10];
int n;

void findFirst(char c)
{
    int i;

    for(i=0;i<n;i++)
    {
        if(prod[i][0]==c)
        {
            if(!(prod[i][3]>='A' && prod[i][3]<='Z'))
                printf("%c ",prod[i][3]);
            else
                findFirst(prod[i][3]);
        }
    }
}

void findFollow(char c)
{
    int i,j;

    if(prod[0][0]==c)
        printf("$ ");

    for(i=0;i<n;i++)
    {
        for(j=3;j<strlen(prod[i]);j++)
        {
            if(prod[i][j]==c)
            {
                if(prod[i][j+1]!='\\0')
                    findFirst(prod[i][j+1]);

                if(prod[i][j+1]=='\\0' && c!=prod[i][0])
                    findFollow(prod[i][0]);
            }
        }
    }
}

int main()
{
    int i;

    printf("Enter number of productions: ");
    scanf("%d",&n);

    printf("Enter productions (Example E->TR)\\n");

    for(i=0;i<n;i++)
        scanf("%s",prod[i]);

    printf("\\nFIRST sets\\n");

    for(i=0;i<n;i++)
    {
        printf("FIRST(%c) = { ",prod[i][0]);
        findFirst(prod[i][0]);
        printf("}\\n");
    }

    printf("\\nFOLLOW sets\\n");

    for(i=0;i<n;i++)
    {
        printf("FOLLOW(%c) = { ",prod[i][0]);
        findFollow(prod[i][0]);
        printf("}\\n");
    }

    printf("\\nPredictive Parsing Table\\n");

    for(i=0;i<n;i++)
        printf("M[%c,%c] = %s\\n",prod[i][0],prod[i][3],prod[i]);
}`
      }
    },
    details: {
      file: "predictive.cpp / predictive.c",
      commands: ["g++ predictive.cpp", "gcc predictive.c", "./a.out"],
      input: `3
E->TR
T->FY
F->i`,
      output: `FIRST(E) = { i }
FIRST(T) = { i }
FIRST(F) = { i }

FOLLOW(E) = { $ }
FOLLOW(T) = { $ }
FOLLOW(F) = { $ }

Predictive Parsing Table
M[E,i] = E->TR
M[T,i] = T->FY
M[F,i] = F->i`
    }
  },
];

function App() {
  const [activeFolderId, setActiveFolderId] = useState<string>(folders[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'c_cpp' | 'c' | 'flex' | 'bison'>('c_cpp');
  const [toastMessage, setToastMessage] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['exp4']);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Deep find to support subfolders
  const findFolder = (fid: string, list: Folder[]): Folder | null => {
    for (const f of list) {
      if (f.id === fid) return f;
      if (f.subfolders) {
        const found = findFolder(fid, f.subfolders);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFolder = findFolder(activeFolderId, folders);

  // Resolve code based on whether the folder has language options or not
  const folderOptions = activeFolder?.options;
  const optionsKeys = folderOptions ? Object.keys(folderOptions) : [];
  const codeToRender = folderOptions
    ? (folderOptions[activeLanguage] || folderOptions[optionsKeys[0]])?.code
    : activeFolder?.code;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCopy = () => {
    if (codeToRender) {
      navigator.clipboard.writeText(codeToRender);
      setCopied(true);
      setToastMessage('Code copied !!');
      setTimeout(() => {
        setCopied(false);
        setToastMessage('');
      }, 2500);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={"sidebar glass-panel " + (isSidebarOpen ? 'open' : '')}>
        <div className="sidebar-header">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            <h2>My Notes</h2>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="folder-list">
          {folders.map(folder => {
            const isExpanded = expandedFolders.includes(folder.id);
            const hasSub = folder.subfolders && folder.subfolders.length > 0;

            const toggleExpand = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (expandedFolders.includes(folder.id)) {
                setExpandedFolders(expandedFolders.filter(id => id !== folder.id));
              } else {
                setExpandedFolders([...expandedFolders, folder.id]);
              }
            };

            return (
              <div key={folder.id}>
                <button
                  className={"folder-item " + (activeFolderId === folder.id ? 'active' : '')}
                  onClick={(e) => {
                    if (hasSub) {
                      toggleExpand(e);
                      return;
                    }
                    setActiveFolderId(folder.id);
                    setShowMobileDetails(false);
                    if (window.innerWidth <= 768) setIsSidebarOpen(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="folder-icon">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    {folder.name}
                  </div>
                  {hasSub && (
                    <svg 
                      onClick={toggleExpand}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  )}
                </button>
                
                {hasSub && isExpanded && folder.subfolders && (
                  <div className="subfolder-list">
                    {folder.subfolders.map((sub: Folder) => (
                      <button
                        key={sub.id}
                        className={"folder-item subfolder-item " + (activeFolderId === sub.id ? 'active' : '')}
                        onClick={() => {
                          setActiveFolderId(sub.id);
                          setShowMobileDetails(false);
                          if (window.innerWidth <= 768) setIsSidebarOpen(false);
                        }}
                        style={{ paddingLeft: '44px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="folder-icon">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="menu-toggle-btn" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h1>{activeFolder?.name}</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
            <div className="badge">Read-only Code</div>
          </div>
        </div>

        <div className="code-container glass-panel">
          <div className="mac-buttons" style={{ borderBottom: '1px solid var(--panel-border)', gridColumn: '1 / -1', position: 'relative' }}>
            <span className="mac-btn close"></span>
            <span className="mac-btn minimize"></span>
            <span className="mac-btn expand"></span>

            {activeFolder?.options && (
              <div className="language-selector">
                {Object.keys(activeFolder.options).map(key => {
                  const opts = activeFolder.options!;
                  const keys = Object.keys(opts);
                  const isActive = activeLanguage === key || (!opts[activeLanguage] && key === keys[0]);
                  return (
                    <button
                      key={key}
                      className={"lang-btn " + (isActive ? 'active' : '')}
                      onClick={() => setActiveLanguage(key as any)}
                    >
                      {key === 'c_cpp' ? 'C++' : key === 'c' ? 'C' : key.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="split-view">
            <div className="code-block-wrapper">
              <button className="copy-btn absolute-copy" onClick={handleCopy} title="Copy to clipboard">
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27c93f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
              <pre className="code-block">
                <code>{codeToRender}</code>
              </pre>

              {activeFolder?.details && (
                <button
                  className="mobile-details-btn"
                  onClick={() => setShowMobileDetails(!showMobileDetails)}
                >
                  {showMobileDetails ? 'Hide Instructions' : 'View Instructions & Output'}
                </button>
              )}
            </div>

            {activeFolder?.details && (
              <div className={"details-pane " + (showMobileDetails ? 'mobile-show' : '')}>
                <div className="details-section">
                  <h3>File</h3>
                  <div><code className="inline-code">{activeFolder.details.file}</code></div>
                </div>

                <div className="details-section">
                  <h3>Run Commands</h3>
                  <div className="terminal-commands">
                    {activeFolder.details.commands.map((cmd: string, i: number) => (
                      <div key={i} className="command-line">
                        <span className="prompt">$</span> {cmd}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  <h3>Sample Input</h3>
                  <pre className="io-block">{activeFolder.details.input}</pre>
                </div>

                <div className="details-section">
                  <h3>Expected Output</h3>
                  <pre className="io-block">{activeFolder.details.output}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom Toast Notification */}
      <div className={"toast " + (toastMessage ? 'show' : '')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27c93f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        {toastMessage}
      </div>
    </div>
  );
}

export default App;
