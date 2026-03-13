import { useState } from 'react';
import './App.css';

const folders = [
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
    name: 'EXP 4 — Capital Letter Count', 
    code: `%{
#include <stdio.h>
int count=0;
%}

%%
[A-Z] { printf("%s capital\\n",yytext); count++; }
[a-z] { printf("%s not capital\\n",yytext); }
\\n return 0;
%%

int main(){
printf("Enter text:\\n");
yylex();
printf("Total capitals = %d\\n",count);
}
int yywrap(){return 1;}`,
    details: {
      file: "capital.l",
      commands: ["flex capital.l", "gcc lex.yy.c", "./a.out"],
      input: "SRM university",
      output: `S capital
R capital
M capital
u not capital
n not capital
...
Total capitals = 3`
    }
  },
  { 
    id: 'exp5', 
    name: 'EXP 5 — Left Recursion', 
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

    cout << "Enter productions (without A->) :\\n";

    for(int i=0;i<n;i++)
    {
        cin >> prod[i];

        if(prod[i][0] == nonTerminal[0])
            alpha.push_back(prod[i].substr(1));
        else
            beta.push_back(prod[i]);
    }

    if(alpha.empty())
    {
        cout<<"No Left Recursion\\n";
        return 0;
    }

    cout<<"\\nGrammar after removing Left Recursion:\\n";

    cout<<nonTerminal<<" -> ";

    for(int i=0;i<beta.size();i++)
        cout<<beta[i]<<nonTerminal<<"' | ";

    cout<<"\\n";

    cout<<nonTerminal<<"' -> ";

    for(int i=0;i<alpha.size();i++)
        cout<<alpha[i]<<nonTerminal<<"' | ";

    cout<<"ε\\n";
}`
      },
      c: {
        file: "leftrec.c",
        code: `#include<stdio.h>
#include<string.h>

int main()
{
    char nt;
    char prod[10][20];
    char alpha[10][20], beta[10][20];

    int n,i;
    int a=0,b=0;

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

    printf("\\nAfter removing Left Recursion:\\n");

    printf("%c -> ",nt);

    for(i=0;i<b;i++)
        printf("%s%c' | ",beta[i],nt);

    printf("\\n");

    printf("%c' -> ",nt);

    for(i=0;i<a;i++)
        printf("%s%c' | ",alpha[i],nt);

    printf("epsilon\\n");
}`
      }
    },
    details: {
      file: "leftrec.cpp / leftrec.c",
      commands: ["g++ leftrec.cpp", "gcc leftrec.c", "./a.out"],
      input: `Enter Non-Terminal: E
Enter number of productions: 2
E+T
T`,
      output: `After removing Left Recursion
      
E -> TE'
E' -> +TE' | epsilon`
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
#include<stdio.h>
#include<stdlib.h>
%}

%token NUMBER

%%

input:
expr { printf("Result = %d\\n",$1); }
;

expr:
expr '+' expr { $$=$1+$3; }
| expr '-' expr { $$=$1-$3; }
| expr '*' expr { $$=$1*$3; }
| expr '/' expr { $$=$1/$3; }
| NUMBER { $$=$1; }
;

%%

int main()
{
printf("Enter expression:\\n");
yyparse();
}

int yyerror(char *s)
{
printf("Error\\n");
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
  const [activeFolderId, setActiveFolderId] = useState(folders[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'c_cpp' | 'c' | 'flex' | 'bison'>('c_cpp');
  const [toastMessage, setToastMessage] = useState('');
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const activeFolder = folders.find(f => f.id === activeFolderId);
  
  // Resolve code based on whether the folder has language options or not
  const codeToRender = activeFolder?.options 
    ? activeFolder.options[activeLanguage as keyof typeof activeFolder.options]?.code || activeFolder.options[Object.keys(activeFolder.options)[0] as keyof typeof activeFolder.options]?.code
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
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
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
          {folders.map(folder => (
            <button 
              key={folder.id} 
              className={"folder-item " + (activeFolderId === folder.id ? 'active' : '')}
              onClick={() => {
                setActiveFolderId(folder.id);
                setShowMobileDetails(false); // Reset instruction view on mobile
                // Auto-close sidebar on mobile after selecting a folder
                if (window.innerWidth <= 768) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="folder-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              {folder.name}
            </button>
          ))}
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
          <div className="badge">Read-only Code</div>
        </div>
        
        <div className="code-container glass-panel">
          <div className="mac-buttons" style={{ borderBottom: '1px solid var(--panel-border)', gridColumn: '1 / -1', position: 'relative' }}>
            <span className="mac-btn close"></span>
            <span className="mac-btn minimize"></span>
            <span className="mac-btn expand"></span>

            {activeFolder?.options && (
              <div className="language-selector">
                {Object.keys(activeFolder.options).map(key => (
                  <button 
                    key={key}
                    className={"lang-btn " + (activeLanguage === key || (!activeFolder.options[activeLanguage as keyof typeof activeFolder.options] && key === Object.keys(activeFolder.options)[0]) ? 'active' : '')}
                    onClick={() => setActiveLanguage(key as any)}
                  >
                    {key === 'c_cpp' ? 'C++' : key === 'c' ? 'C' : key.toUpperCase()}
                  </button>
                ))}
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
                    {activeFolder.details.commands.map((cmd, i) => (
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
