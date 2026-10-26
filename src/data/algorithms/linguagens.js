export default [
  {
    id: 'recursive-descent',
    name: 'Análise por Descida Recursiva',
    difficulty: 'Iniciante',
    en: { name: 'Recursive Descent Parsing', summary: 'Turns each grammar rule into a function that calls the others — the simplest way to write a parser, used in most hand-written compilers.' },
    facts: { 'Tipo': 'Análise sintática descendente (LL)', 'Ideia central': 'Uma função por regra da gramática', 'Custo': 'O(n) para gramáticas LL(1)', 'Limitação': 'Não aceita recursão à esquerda direta', 'Usado em': 'GCC, Clang, V8, Go, Rust' },
    summary: 'Transforma cada regra da gramática em uma função que chama as outras — o jeito mais simples de escrever um analisador, usado na maioria dos compiladores escritos à mão.',
    description:
      'Um analisador sintático (parser) lê uma sequência de tokens e descobre sua estrutura, segundo uma gramática. Na descida recursiva, cada regra da gramática vira uma função: para expressões aritméticas, expr() lê termos separados por + e −, termo() lê fatores separados por × e ÷, e fator() lê um número, um sinal de menos ou uma expressão entre parênteses — chamando expr() de novo, recursivamente. A precedência dos operadores sai da própria estrutura: como termo() fica "abaixo" de expr(), as multiplicações são agrupadas antes das somas. Cada função decide o que fazer olhando o próximo token, sem voltar atrás, o que torna a análise linear. O resultado é uma árvore sintática, que pode ser avaliada, otimizada ou traduzida. A única restrição importante é evitar regras recursivas à esquerda (como expr := expr + termo), que fariam a função chamar a si mesma para sempre; elas são reescritas como repetições.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n) para gramáticas LL(1); exponencial com retrocesso', space: 'O(profundidade da expressão)' },
    steps: [
      'Escreva a gramática sem recursão à esquerda: expr := termo ((+|−) termo)*; termo := fator ((×|÷) fator)*; fator := número | ( expr ) | − fator.',
      'Crie uma função para cada regra.',
      'Cada função consome tokens e chama as funções das regras que aparecem nela.',
      'Decida entre alternativas olhando o próximo token (lookahead).',
      'Monte e devolva nós da árvore sintática; ao final, todos os tokens devem ter sido consumidos.',
    ],
    usedIn: ['Compiladores e interpretadores (GCC, Clang, V8, Go, Rust, CPython 3.9+)', 'Calculadoras e planilhas (fórmulas)', 'Leitores de JSON, configurações e linguagens específicas', 'Ferramentas de linha de comando e consultas de busca', 'Ensino de compiladores'],
    realWorld: [
      { title: 'Compiladores modernos', text: 'GCC trocou seu analisador gerado por ferramenta por um de descida recursiva escrito à mão em 2004 (C++) e 2006 (C); Clang, V8 (JavaScript) e os compiladores de Go e Rust também usam descida recursiva, pelas mensagens de erro melhores e pela facilidade de manutenção.' },
      { title: 'Planilhas', text: 'Quando você digita =SOMA(A1:A3)*2 em uma planilha, um analisador transforma a fórmula em uma árvore antes de calculá-la — frequentemente com descida recursiva e precedência de operadores.' },
      { title: 'JSON', text: 'Analisadores de JSON são quase sempre descida recursiva: objeto() lê pares chave–valor chamando valor(), que pode chamar objeto() ou lista() de novo.' },
    ],
    curiosities: [
      'Tony Hoare escreveu um dos primeiros compiladores de descida recursiva (para ALGOL 60) no início dos anos 1960; Niklaus Wirth popularizou a técnica com Pascal.',
      'A técnica de Pratt (1973), ou "precedence climbing", é uma variação da descida recursiva que trata a precedência de operadores com uma tabela — usada no V8 e em muitos interpretadores.',
      'Em 2020, o CPython trocou seu analisador LL(1) por um PEG, que também é um tipo de descida recursiva, com memoização (packrat).',
    ],
    code: {
      python: String.raw`
        import re

        def avaliar(texto):
            tokens = re.findall(r"\d+(?:\.\d+)?|[-+*/()]", texto)
            pos = 0
            def olhar():
                return tokens[pos] if pos < len(tokens) else None
            def consumir():
                nonlocal pos
                pos += 1
                return tokens[pos - 1]

            def expr():                     # expr := termo (('+' | '-') termo)*
                v = termo()
                while olhar() in ("+", "-"):
                    v = v + termo() if consumir() == "+" else v - termo()
                return v
            def termo():                    # termo := fator (('*' | '/') fator)*
                v = fator()
                while olhar() in ("*", "/"):
                    v = v * fator() if consumir() == "*" else v / fator()
                return v
            def fator():                    # fator := número | '(' expr ')' | '-' fator
                t = consumir()
                if t == "(":
                    v = expr()
                    consumir()              # ')'
                    return v
                if t == "-":
                    return -fator()
                return float(t)

            return expr()

        for e in ["2 * (3 + 4) - 5", "-(1 + 2) * 3", "10 / 4"]:
            print(f"{e} = {avaliar(e):g}")
        # 2 * (3 + 4) - 5 = 9
        # -(1 + 2) * 3 = -9
        # 10 / 4 = 2.5
      `,
      javascript: String.raw`
        function avaliar(texto) {
          const tokens = texto.match(/\d+(?:\.\d+)?|[-+*/()]/g);
          let pos = 0;
          const olhar = () => tokens[pos];
          const consumir = () => tokens[pos++];

          function expr() { // expr := termo (('+' | '-') termo)*
            let v = termo();
            while (olhar() === "+" || olhar() === "-") v = consumir() === "+" ? v + termo() : v - termo();
            return v;
          }
          function termo() { // termo := fator (('*' | '/') fator)*
            let v = fator();
            while (olhar() === "*" || olhar() === "/") v = consumir() === "*" ? v * fator() : v / fator();
            return v;
          }
          function fator() { // fator := número | '(' expr ')' | '-' fator
            const t = consumir();
            if (t === "(") { const v = expr(); consumir(); return v; } // consome ')'
            if (t === "-") return -fator();
            return Number(t);
          }
          return expr();
        }

        for (const e of ["2 * (3 + 4) - 5", "-(1 + 2) * 3", "10 / 4"]) console.log(e + " = " + avaliar(e));
        // 2 * (3 + 4) - 5 = 9
        // -(1 + 2) * 3 = -9
        // 10 / 4 = 2.5
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;
        import java.util.regex.Matcher;
        import java.util.regex.Pattern;

        public class DescidaRecursiva {
            static List<String> tokens;
            static int pos;

            static String olhar() { return pos < tokens.size() ? tokens.get(pos) : ""; }
            static String consumir() { return tokens.get(pos++); }

            static double expr() { // expr := termo (('+' | '-') termo)*
                double v = termo();
                while (olhar().equals("+") || olhar().equals("-")) v = consumir().equals("+") ? v + termo() : v - termo();
                return v;
            }
            static double termo() { // termo := fator (('*' | '/') fator)*
                double v = fator();
                while (olhar().equals("*") || olhar().equals("/")) v = consumir().equals("*") ? v * fator() : v / fator();
                return v;
            }
            static double fator() { // fator := número | '(' expr ')' | '-' fator
                String t = consumir();
                if (t.equals("(")) { double v = expr(); consumir(); return v; } // consome ')'
                if (t.equals("-")) return -fator();
                return Double.parseDouble(t);
            }

            static double avaliar(String texto) {
                tokens = new ArrayList<>();
                Matcher m = Pattern.compile("\\d+(?:\\.\\d+)?|[-+*/()]").matcher(texto);
                while (m.find()) tokens.add(m.group());
                pos = 0;
                return expr();
            }

            public static void main(String[] args) {
                for (String e : new String[]{"2 * (3 + 4) - 5", "-(1 + 2) * 3", "10 / 4"}) {
                    double v = avaliar(e);
                    System.out.println(e + " = " + (v == Math.rint(v) ? String.valueOf((long) v) : String.valueOf(v)));
                }
                // 2 * (3 + 4) - 5 = 9
                // -(1 + 2) * 3 = -9
                // 10 / 4 = 2.5
            }
        }
      `,
      cpp: String.raw`
        #include <cctype>
        #include <cstdio>
        #include <string>
        using namespace std;

        string s;
        size_t pos;

        char olhar() { while (pos < s.size() && s[pos] == ' ') pos++; return pos < s.size() ? s[pos] : '\0'; }
        double expr();

        double fator() { // fator := número | '(' expr ')' | '-' fator
            char c = olhar();
            if (c == '(') { pos++; double v = expr(); olhar(); pos++; return v; } // consome ')'
            if (c == '-') { pos++; return -fator(); }
            size_t lido;
            double v = stod(s.substr(pos), &lido);
            pos += lido;
            return v;
        }
        double termo() { // termo := fator (('*' | '/') fator)*
            double v = fator();
            for (char c = olhar(); c == '*' || c == '/'; c = olhar()) { pos++; v = c == '*' ? v * fator() : v / fator(); }
            return v;
        }
        double expr() { // expr := termo (('+' | '-') termo)*
            double v = termo();
            for (char c = olhar(); c == '+' || c == '-'; c = olhar()) { pos++; v = c == '+' ? v + termo() : v - termo(); }
            return v;
        }

        int main() {
            for (const char* e : {"2 * (3 + 4) - 5", "-(1 + 2) * 3", "10 / 4"}) {
                s = e; pos = 0;
                printf("%s = %g\n", e, expr());
            }
            // 2 * (3 + 4) - 5 = 9
            // -(1 + 2) * 3 = -9
            // 10 / 4 = 2.5
        }
      `,
    },
  },
  {
    id: 'cyk',
    name: 'Algoritmo CYK',
    difficulty: 'Intermediário',
    en: { name: 'CYK Algorithm', summary: 'Decides whether a string can be generated by a context-free grammar in Chomsky normal form, filling a triangular table bottom-up.' },
    facts: { 'Criado por': 'Cocke, Younger e Kasami (independentemente)', 'Ano': '1961–1967', 'Requer': 'Gramática na forma normal de Chomsky', 'Custo': 'O(n³ · |G|)', 'Técnica': 'Programação dinâmica por intervalos' },
    summary: 'Decide se uma frase pode ser gerada por uma gramática livre de contexto na forma normal de Chomsky, preenchendo uma tabela triangular de baixo para cima.',
    description:
      'O algoritmo CYK (Cocke–Younger–Kasami) responde à pergunta "esta frase pertence à linguagem desta gramática?" para qualquer gramática livre de contexto, desde que ela esteja na forma normal de Chomsky: cada regra produz duas variáveis (A → B C) ou uma palavra (A → a). É programação dinâmica por intervalos: a célula (tamanho ℓ, início i) guarda o conjunto de variáveis que conseguem gerar o trecho de ℓ palavras que começa em i. Os trechos de uma palavra vêm direto do léxico. Para um trecho maior, testa-se cada ponto de divisão em duas partes: se B gera a parte esquerda, C gera a direita e existe a regra A → B C, então A gera o trecho todo. A frase é aceita se o símbolo inicial S aparece na célula da frase inteira. Como guarda todas as possibilidades, o CYK também revela ambiguidades — frases com mais de uma estrutura possível.',
    complexity: { best: 'O(n³ · |G|)', average: 'O(n³ · |G|)', worst: 'O(n³ · |G|)', space: 'O(n² · |V|)' },
    steps: [
      'Converta a gramática para a forma normal de Chomsky (regras A → B C ou A → palavra).',
      'Para cada palavra i, preencha a célula (1, i) com as variáveis que a geram.',
      'Para cada tamanho ℓ de 2 a n e cada início i: para cada divisão k, se B ∈ (k, i), C ∈ (ℓ − k, i + k) e A → B C, ponha A em (ℓ, i).',
      'A frase é aceita se S está na célula (n, 1).',
      'Guardando de onde veio cada variável, reconstroem-se as árvores sintáticas.',
    ],
    usedIn: ['Processamento de linguagem natural (análise de frases)', 'Bioinformática (estrutura secundária de RNA)', 'Teoria da computação e ensino de linguagens formais', 'Análise de gramáticas probabilísticas (CKY probabilístico)', 'Verificação de pertinência em linguagens livres de contexto'],
    realWorld: [
      { title: 'Linguagem natural', text: 'Analisadores estatísticos de frases, como os usados em tradução automática antes das redes neurais, eram variantes probabilísticas do CYK: cada regra tem uma probabilidade, e a tabela guarda a análise mais provável.' },
      { title: 'RNA', text: 'A estrutura secundária de moléculas de RNA (quais bases se pareiam) é modelada por gramáticas livres de contexto estocásticas, e algoritmos do tipo CYK encontram a estrutura mais provável.' },
      { title: 'Ambiguidade', text: 'Na frase do exemplo, "with a fork" pode modificar "eats" (comer usando o garfo) ou "fish" (o peixe que vem com o garfo). O CYK encontra as duas estruturas — o que mostra por que linguagens de programação evitam gramáticas ambíguas.' },
    ],
    curiosities: [
      'O algoritmo foi descoberto de forma independente por John Cocke, Daniel Younger e Tadao Kasami nos anos 1960 — daí o nome com três iniciais.',
      'Leslie Valiant mostrou em 1975 que o reconhecimento livre de contexto pode ser feito no tempo da multiplicação de matrizes, abaixo de O(n³) — mas com constantes enormes.',
      'Toda gramática livre de contexto pode ser convertida para a forma normal de Chomsky, embora o tamanho da gramática possa crescer bastante.',
    ],
    code: {
      python: String.raw`
        BINARIAS = [("S", "NP", "VP"), ("VP", "VP", "PP"), ("VP", "V", "NP"), ("PP", "P", "NP"), ("NP", "Det", "N")]
        LEXICO = {"she": {"NP"}, "eats": {"V", "VP"}, "with": {"P"}, "fish": {"N", "NP"}, "fork": {"N"}, "a": {"Det"}}

        def cyk(frase):
            p = frase.split()
            n = len(p)
            T = [[set() for _ in range(n)] for _ in range(n)]   # T[tamanho - 1][início]
            for i, w in enumerate(p):
                T[0][i] = set(LEXICO.get(w, ()))
            for l in range(1, n):
                for i in range(n - l):
                    for k in range(l):                         # divide em tamanho k+1 e l-k
                        for A, B, C in BINARIAS:
                            if B in T[k][i] and C in T[l - k - 1][i + k + 1]:
                                T[l][i].add(A)
            return "S" in T[n - 1][0]

        print(cyk("she eats a fish with a fork"))   # True
        print(cyk("she fish eats"))                 # False
      `,
      javascript: String.raw`
        const BINARIAS = [["S", "NP", "VP"], ["VP", "VP", "PP"], ["VP", "V", "NP"], ["PP", "P", "NP"], ["NP", "Det", "N"]];
        const LEXICO = { she: ["NP"], eats: ["V", "VP"], with: ["P"], fish: ["N", "NP"], fork: ["N"], a: ["Det"] };

        function cyk(frase) {
          const p = frase.split(" "), n = p.length;
          const T = Array.from({ length: n }, () => Array.from({ length: n }, () => new Set())); // T[tamanho - 1][início]
          p.forEach((w, i) => (LEXICO[w] ?? []).forEach(s => T[0][i].add(s)));
          for (let l = 1; l < n; l++)
            for (let i = 0; i + l < n; i++)
              for (let k = 0; k < l; k++) // divide em tamanho k+1 e l-k
                for (const [A, B, C] of BINARIAS)
                  if (T[k][i].has(B) && T[l - k - 1][i + k + 1].has(C)) T[l][i].add(A);
          return T[n - 1][0].has("S");
        }

        console.log(cyk("she eats a fish with a fork")); // true
        console.log(cyk("she fish eats"));               // false
      `,
      java: String.raw`
        import java.util.HashSet;
        import java.util.List;
        import java.util.Map;
        import java.util.Set;

        public class CYK {
            static final String[][] BINARIAS = {{"S", "NP", "VP"}, {"VP", "VP", "PP"}, {"VP", "V", "NP"}, {"PP", "P", "NP"}, {"NP", "Det", "N"}};
            static final Map<String, List<String>> LEXICO = Map.of("she", List.of("NP"), "eats", List.of("V", "VP"), "with", List.of("P"),
                "fish", List.of("N", "NP"), "fork", List.of("N"), "a", List.of("Det"));

            static boolean cyk(String frase) {
                String[] p = frase.split(" ");
                int n = p.length;
                @SuppressWarnings("unchecked")
                Set<String>[][] T = new Set[n][n]; // T[tamanho - 1][início]
                for (int l = 0; l < n; l++) for (int i = 0; i < n; i++) T[l][i] = new HashSet<>();
                for (int i = 0; i < n; i++) T[0][i].addAll(LEXICO.getOrDefault(p[i], List.of()));
                for (int l = 1; l < n; l++)
                    for (int i = 0; i + l < n; i++)
                        for (int k = 0; k < l; k++) // divide em tamanho k+1 e l-k
                            for (String[] r : BINARIAS)
                                if (T[k][i].contains(r[1]) && T[l - k - 1][i + k + 1].contains(r[2])) T[l][i].add(r[0]);
                return T[n - 1][0].contains("S");
            }

            public static void main(String[] args) {
                System.out.println(cyk("she eats a fish with a fork")); // true
                System.out.println(cyk("she fish eats"));               // false
            }
        }
      `,
      cpp: String.raw`
        #include <array>
        #include <iostream>
        #include <map>
        #include <set>
        #include <sstream>
        #include <string>
        #include <vector>
        using namespace std;

        const vector<array<string, 3>> BINARIAS = {{"S", "NP", "VP"}, {"VP", "VP", "PP"}, {"VP", "V", "NP"}, {"PP", "P", "NP"}, {"NP", "Det", "N"}};
        const map<string, vector<string>> LEXICO = {{"she", {"NP"}}, {"eats", {"V", "VP"}}, {"with", {"P"}},
            {"fish", {"N", "NP"}}, {"fork", {"N"}}, {"a", {"Det"}}};

        bool cyk(const string& frase) {
            vector<string> p;
            istringstream in(frase);
            for (string w; in >> w;) p.push_back(w);
            int n = p.size();
            vector<vector<set<string>>> T(n, vector<set<string>>(n)); // T[tamanho - 1][início]
            for (int i = 0; i < n; i++) if (LEXICO.count(p[i])) T[0][i].insert(LEXICO.at(p[i]).begin(), LEXICO.at(p[i]).end());
            for (int l = 1; l < n; l++)
                for (int i = 0; i + l < n; i++)
                    for (int k = 0; k < l; k++) // divide em tamanho k+1 e l-k
                        for (auto& r : BINARIAS)
                            if (T[k][i].count(r[1]) && T[l - k - 1][i + k + 1].count(r[2])) T[l][i].insert(r[0]);
            return T[n - 1][0].count("S");
        }

        int main() {
            cout << boolalpha << cyk("she eats a fish with a fork") << "\n"; // true
            cout << cyk("she fish eats") << "\n";                            // false
        }
      `,
    },
  },
  {
    id: 'earley',
    name: 'Algoritmo de Earley',
    difficulty: 'Avançado',
    en: { name: 'Earley Parser', summary: 'Parses any context-free grammar — even left-recursive and ambiguous ones — by tracking partially recognized rules with "dotted items".' },
    facts: { 'Criado por': 'Jay Earley', 'Ano': '1968 (tese de doutorado)', 'Operações': 'Previsão, leitura e conclusão', 'Custo': 'O(n³) no pior caso; O(n²) se não ambígua; O(n) para a maioria das LR(k)', 'Vantagem': 'Aceita qualquer gramática livre de contexto, sem conversão' },
    summary: 'Analisa qualquer gramática livre de contexto — até recursiva à esquerda ou ambígua — acompanhando regras parcialmente reconhecidas com "itens com ponto".',
    description:
      'O algoritmo de Earley reconhece frases de qualquer gramática livre de contexto, sem exigir que ela seja convertida para alguma forma especial. Ele lê a entrada da esquerda para a direita e mantém um conjunto Sᵢ para cada posição. Cada item é uma regra com um ponto marcando quanto dela já foi reconhecido, mais a posição onde ela começou — por exemplo, "E → E • + T, desde 0". Três operações preenchem os conjuntos. Previsão: se o ponto está antes de uma variável, acrescentam-se as regras dessa variável começando ali. Leitura: se o ponto está antes do próximo símbolo da entrada, o item avança para o próximo conjunto. Conclusão: quando uma regra termina, todos os itens que esperavam por aquela variável, no conjunto onde ela começou, avançam o ponto. A frase é aceita se, no último conjunto, há uma regra do símbolo inicial completa começando em 0.',
    complexity: { best: 'O(n) para gramáticas LR(k) típicas', average: 'O(n²) para gramáticas não ambíguas', worst: 'O(n³)', space: 'O(n²)' },
    steps: [
      'S₀ começa com as regras do símbolo inicial, com o ponto no começo e origem 0.',
      'Previsão: para um item com o ponto antes da variável X, acrescente ao conjunto atual todas as regras X → • …, com origem na posição atual.',
      'Leitura: se o ponto está antes do símbolo que aparece na entrada, copie o item, com o ponto avançado, para o próximo conjunto.',
      'Conclusão: quando um item X → … • termina (origem j), avance o ponto de todos os itens de Sⱼ que esperavam X.',
      'Repita até não haver itens novos; aceite se o último conjunto tem o símbolo inicial completo com origem 0.',
    ],
    usedIn: ['Processamento de linguagem natural', 'Geradores de analisadores para gramáticas arbitrárias (Marpa, nearley.js)', 'Analisadores de linguagens com gramáticas ambíguas', 'Reconhecimento de fala com gramáticas', 'Ensino de linguagens formais'],
    realWorld: [
      { title: 'nearley.js e Marpa', text: 'Bibliotecas como nearley.js (JavaScript) e Marpa (Perl) implementam o Earley com as otimizações de Joop Leo e Aycock-Horspool, permitindo escrever gramáticas naturais, até ambíguas, sem se preocupar com conflitos.' },
      { title: 'Linguagem natural', text: 'Por aceitar gramáticas ambíguas e produzir todas as análises, o Earley é usado em linguística computacional — por exemplo, no NLTK, a biblioteca de processamento de linguagem do Python.' },
      { title: 'Gramáticas de fala', text: 'Sistemas de reconhecimento de fala com gramáticas (como menus de atendimento por voz) usam analisadores do tipo Earley para combinar as hipóteses do reconhecedor com as frases permitidas.' },
    ],
    curiosities: [
      'Jay Earley apresentou o algoritmo em sua tese de doutorado em 1968, na Carnegie Mellon; depois, deixou a computação e se tornou psicólogo.',
      'A gramática do exemplo é recursiva à esquerda (E → E + T), o que derrubaria um analisador de descida recursiva ingênuo — mas o Earley a trata naturalmente.',
      'Joop Leo mostrou em 1991 como tornar o Earley linear para todas as gramáticas LR-regulares, que incluem quase todas as linguagens de programação.',
    ],
    code: {
      python: String.raw`
        GRAMATICA = [("E", ["E", "+", "T"]), ("E", ["T"]), ("T", ["T", "*", "F"]), ("T", ["F"]), ("F", ["(", "E", ")"]), ("F", ["n"])]
        VARIAVEIS = {"E", "T", "F"}

        def earley(entrada):
            S = [[] for _ in range(len(entrada) + 1)]       # item: (regra, ponto, origem)
            def adicionar(i, item):
                if item not in S[i]:
                    S[i].append(item)
            for r, (lhs, _) in enumerate(GRAMATICA):
                if lhs == "E":
                    adicionar(0, (r, 0, 0))
            for i in range(len(entrada) + 1):
                for r, ponto, origem in S[i]:               # a lista cresce enquanto é percorrida
                    lhs, rhs = GRAMATICA[r]
                    if ponto < len(rhs):
                        prox = rhs[ponto]
                        if prox in VARIAVEIS:               # previsão
                            for q, (l2, _) in enumerate(GRAMATICA):
                                if l2 == prox:
                                    adicionar(i, (q, 0, i))
                        elif i < len(entrada) and entrada[i] == prox:   # leitura
                            adicionar(i + 1, (r, ponto + 1, origem))
                    else:                                   # conclusão
                        for r2, p2, o2 in S[origem]:
                            if p2 < len(GRAMATICA[r2][1]) and GRAMATICA[r2][1][p2] == lhs:
                                adicionar(i, (r2, p2 + 1, o2))
            return any(GRAMATICA[r][0] == "E" and p == len(GRAMATICA[r][1]) and o == 0 for r, p, o in S[-1])

        for e in ["n+n*n", "(n+n)*n", "n+*n"]:
            print(e, "aceita" if earley(e) else "rejeitada")
        # n+n*n aceita
        # (n+n)*n aceita
        # n+*n rejeitada
      `,
      javascript: String.raw`
        const GRAMATICA = [["E", ["E", "+", "T"]], ["E", ["T"]], ["T", ["T", "*", "F"]], ["T", ["F"]], ["F", ["(", "E", ")"]], ["F", ["n"]]];
        const VARIAVEIS = new Set(["E", "T", "F"]);

        function earley(entrada) {
          const S = Array.from({ length: entrada.length + 1 }, () => []); // item: [regra, ponto, origem]
          const adicionar = (i, item) => { if (!S[i].some(x => x.join() === item.join())) S[i].push(item); };
          GRAMATICA.forEach(([lhs], r) => { if (lhs === "E") adicionar(0, [r, 0, 0]); });
          for (let i = 0; i <= entrada.length; i++) {
            for (let j = 0; j < S[i].length; j++) { // a lista cresce enquanto é percorrida
              const [r, ponto, origem] = S[i][j], [lhs, rhs] = GRAMATICA[r];
              if (ponto < rhs.length) {
                const prox = rhs[ponto];
                if (VARIAVEIS.has(prox)) GRAMATICA.forEach(([l2], q) => { if (l2 === prox) adicionar(i, [q, 0, i]); }); // previsão
                else if (entrada[i] === prox) adicionar(i + 1, [r, ponto + 1, origem]);                                 // leitura
              } else {
                for (const [r2, p2, o2] of S[origem]) // conclusão
                  if (GRAMATICA[r2][1][p2] === lhs) adicionar(i, [r2, p2 + 1, o2]);
              }
            }
          }
          return S[entrada.length].some(([r, p, o]) => GRAMATICA[r][0] === "E" && p === GRAMATICA[r][1].length && o === 0);
        }

        for (const e of ["n+n*n", "(n+n)*n", "n+*n"]) console.log(e + " " + (earley(e) ? "aceita" : "rejeitada"));
        // n+n*n aceita
        // (n+n)*n aceita
        // n+*n rejeitada
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;
        import java.util.Set;

        public class Earley {
            static final String[] LHS = {"E", "E", "T", "T", "F", "F"};
            static final String[][] RHS = {{"E", "+", "T"}, {"T"}, {"T", "*", "F"}, {"F"}, {"(", "E", ")"}, {"n"}};
            static final Set<String> VARIAVEIS = Set.of("E", "T", "F");

            static void adicionar(List<List<int[]>> S, int i, int[] item) {
                for (int[] x : S.get(i)) if (Arrays.equals(x, item)) return;
                S.get(i).add(item);
            }

            static boolean earley(String entrada) {
                int n = entrada.length();
                List<List<int[]>> S = new ArrayList<>(); // item: {regra, ponto, origem}
                for (int i = 0; i <= n; i++) S.add(new ArrayList<>());
                for (int r = 0; r < LHS.length; r++) if (LHS[r].equals("E")) adicionar(S, 0, new int[]{r, 0, 0});
                for (int i = 0; i <= n; i++) {
                    for (int j = 0; j < S.get(i).size(); j++) { // a lista cresce enquanto é percorrida
                        int[] it = S.get(i).get(j);
                        int r = it[0], ponto = it[1], origem = it[2];
                        if (ponto < RHS[r].length) {
                            String prox = RHS[r][ponto];
                            if (VARIAVEIS.contains(prox)) { // previsão
                                for (int q = 0; q < LHS.length; q++) if (LHS[q].equals(prox)) adicionar(S, i, new int[]{q, 0, i});
                            } else if (i < n && String.valueOf(entrada.charAt(i)).equals(prox)) adicionar(S, i + 1, new int[]{r, ponto + 1, origem}); // leitura
                        } else {
                            for (int[] x : new ArrayList<>(S.get(origem))) // conclusão
                                if (x[1] < RHS[x[0]].length && RHS[x[0]][x[1]].equals(LHS[r])) adicionar(S, i, new int[]{x[0], x[1] + 1, x[2]});
                        }
                    }
                }
                for (int[] x : S.get(n)) if (LHS[x[0]].equals("E") && x[1] == RHS[x[0]].length && x[2] == 0) return true;
                return false;
            }

            public static void main(String[] args) {
                for (String e : new String[]{"n+n*n", "(n+n)*n", "n+*n"}) System.out.println(e + " " + (earley(e) ? "aceita" : "rejeitada"));
                // n+n*n aceita
                // (n+n)*n aceita
                // n+*n rejeitada
            }
        }
      `,
      cpp: String.raw`
        #include <array>
        #include <cstdio>
        #include <set>
        #include <string>
        #include <vector>
        using namespace std;

        const vector<string> LHS = {"E", "E", "T", "T", "F", "F"};
        const vector<vector<string>> RHS = {{"E", "+", "T"}, {"T"}, {"T", "*", "F"}, {"F"}, {"(", "E", ")"}, {"n"}};
        const set<string> VARIAVEIS = {"E", "T", "F"};
        using Item = array<int, 3>; // {regra, ponto, origem}

        bool earley(const string& entrada) {
            int n = entrada.size();
            vector<vector<Item>> S(n + 1);
            auto adicionar = [&](int i, Item it) { for (auto& x : S[i]) if (x == it) return; S[i].push_back(it); };
            for (int r = 0; r < (int)LHS.size(); r++) if (LHS[r] == "E") adicionar(0, {r, 0, 0});
            for (int i = 0; i <= n; i++) {
                for (size_t j = 0; j < S[i].size(); j++) { // a lista cresce enquanto é percorrida
                    auto [r, ponto, origem] = S[i][j];
                    if (ponto < (int)RHS[r].size()) {
                        const string& prox = RHS[r][ponto];
                        if (VARIAVEIS.count(prox)) { // previsão
                            for (int q = 0; q < (int)LHS.size(); q++) if (LHS[q] == prox) adicionar(i, {q, 0, i});
                        } else if (i < n && string(1, entrada[i]) == prox) adicionar(i + 1, {r, ponto + 1, origem}); // leitura
                    } else {
                        vector<Item> anteriores = S[origem]; // conclusão
                        for (auto& x : anteriores)
                            if (x[1] < (int)RHS[x[0]].size() && RHS[x[0]][x[1]] == LHS[r]) adicionar(i, {x[0], x[1] + 1, x[2]});
                    }
                }
            }
            for (auto& x : S[n]) if (LHS[x[0]] == "E" && x[1] == (int)RHS[x[0]].size() && x[2] == 0) return true;
            return false;
        }

        int main() {
            for (const char* e : {"n+n*n", "(n+n)*n", "n+*n"}) printf("%s %s\n", e, earley(e) ? "aceita" : "rejeitada");
            // n+n*n aceita
            // (n+n)*n aceita
            // n+*n rejeitada
        }
      `,
    },
  },
  {
    id: 'halting-problem',
    name: 'O Problema da Parada (e Collatz)',
    difficulty: 'Avançado',
    en: { name: 'The Halting Problem (and Collatz)', summary: 'No algorithm can decide whether every program halts — and a 3-line loop, the Collatz conjecture, shows how hard that is in practice.' },
    facts: { 'Provado por': 'Alan Turing', 'Ano': '1936', 'Resultado': 'Indecidível: nenhum algoritmo resolve para todo programa', 'Exemplo famoso': 'Conjectura de Collatz (3n + 1)', 'Verificado até': '2⁶⁸ (Collatz, 2020)' },
    summary: 'Nenhum algoritmo consegue decidir se todo programa para — e um laço de três linhas, a conjectura de Collatz, mostra o quanto isso é difícil na prática.',
    description:
      'O problema da parada pergunta: dado um programa e uma entrada, ele termina ou roda para sempre? Alan Turing provou em 1936 que não existe um algoritmo que responda corretamente para todos os programas. A prova é por contradição: suponha um decisor para(P, x). Construa o programa D(P), que pergunta se P para recebendo a si mesmo e faz o contrário — entra em laço infinito se a resposta for "para", e termina se for "não para". Então D(D) para se e somente se não para: absurdo. A lista original cita um programa de 43 bytes em C de que "ninguém sabe se sempre para"; o exemplo mais conhecido desse tipo é o laço de Collatz: enquanto n ≠ 1, divida n por 2 se for par, ou troque por 3n + 1 se for ímpar. Para todo número já testado ele para, mas ninguém conseguiu provar que para sempre — a conjectura de Collatz está em aberto desde 1937.',
    complexity: { best: 'Indecidível em geral', average: '—', worst: '—', space: '—' },
    steps: [
      'Suponha que exista uma função para(P, x) que sempre responde se o programa P para com a entrada x.',
      'Construa D(P): se para(P, P) responder "sim", entre em um laço infinito; se responder "não", termine.',
      'Pergunte o que acontece com D(D): se D(D) para, então para(D, D) disse "sim" e D entrou em laço — contradição.',
      'Se D(D) não para, então para(D, D) disse "não" e D terminou — contradição de novo.',
      'Logo, a função para não pode existir. Para programas específicos, como o laço de Collatz, a resposta pode simplesmente ser desconhecida.',
    ],
    usedIn: ['Fundamentos da computação (limites do que algoritmos podem fazer)', 'Análise estática de programas (sempre aproximada)', 'Teorema de Rice: propriedades não triviais de programas são indecidíveis', 'Verificação formal e provadores de teoremas', 'Detecção de laços infinitos (heurísticas e tempo limite)'],
    realWorld: [
      { title: 'Analisadores de código', text: 'Linters e verificadores avisam sobre "código inalcançável" ou "possível laço infinito", mas nunca conseguem acertar sempre: pelo teorema de Rice, qualquer propriedade não trivial do comportamento de programas é indecidível. Por isso eles erram para o lado seguro ou dão alarmes falsos.' },
      { title: 'Tempos limite', text: 'Como não dá para saber se um programa vai terminar, sistemas reais usam tempos limite: o navegador oferece "parar script", e plataformas de juízes online interrompem soluções que demoram demais.' },
      { title: 'Matemática em aberto', text: 'Muitos problemas famosos podem ser escritos como "este programa para?" — por exemplo, um programa que procura um contraexemplo para a conjectura de Goldbach. Um decisor de parada resolveria todos eles.' },
    ],
    curiosities: [
      'O número 27 leva 111 passos para chegar a 1 no laço de Collatz e sobe até 9.232 no caminho — o visualizador mostra essa trajetória.',
      'Paul Erdős disse sobre a conjectura de Collatz: "A matemática ainda não está pronta para problemas como este." Em 2019, Terence Tao provou que "quase todos" os números chegam a valores bem pequenos.',
      'O "castor ocupado" (busy beaver) mede quanto tempo um programa pequeno pode rodar antes de parar; em 2024, uma colaboração online provou que BB(5) = 47.176.870, mas BB(6) já envolve problemas parecidos com Collatz.',
    ],
    code: {
      python: String.raw`
        def collatz(n):
            passos, pico = 0, n
            while n != 1:                  # ninguém provou que este laço sempre termina
                n = n // 2 if n % 2 == 0 else 3 * n + 1
                passos += 1
                pico = max(pico, n)
            return passos, pico

        print(collatz(27))                 # (111, 9232)
        maior = max(range(1, 10000), key=lambda k: collatz(k)[0])
        print(maior, collatz(maior)[0])    # 6171 261
      `,
      javascript: String.raw`
        function collatz(n) {
          let passos = 0, pico = n;
          while (n !== 1) { // ninguém provou que este laço sempre termina
            n = n % 2 === 0 ? n / 2 : 3 * n + 1;
            passos++;
            pico = Math.max(pico, n);
          }
          return [passos, pico];
        }

        console.log(collatz(27).join(" ")); // 111 9232
        let maior = 1;
        for (let k = 1; k < 10000; k++) if (collatz(k)[0] > collatz(maior)[0]) maior = k;
        console.log(maior + " " + collatz(maior)[0]); // 6171 261
      `,
      java: String.raw`
        public class Collatz {
            static long[] collatz(long n) {
                long passos = 0, pico = n;
                while (n != 1) { // ninguém provou que este laço sempre termina
                    n = n % 2 == 0 ? n / 2 : 3 * n + 1;
                    passos++;
                    pico = Math.max(pico, n);
                }
                return new long[]{passos, pico};
            }

            public static void main(String[] args) {
                long[] r = collatz(27);
                System.out.println(r[0] + " " + r[1]); // 111 9232
                int maior = 1;
                for (int k = 1; k < 10000; k++) if (collatz(k)[0] > collatz(maior)[0]) maior = k;
                System.out.println(maior + " " + collatz(maior)[0]); // 6171 261
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cstdio>
        #include <utility>

        std::pair<long long, long long> collatz(long long n) {
            long long passos = 0, pico = n;
            while (n != 1) { // ninguém provou que este laço sempre termina
                n = n % 2 == 0 ? n / 2 : 3 * n + 1;
                passos++;
                pico = std::max(pico, n);
            }
            return {passos, pico};
        }

        int main() {
            auto [passos, pico] = collatz(27);
            printf("%lld %lld\n", passos, pico); // 111 9232
            int maior = 1;
            for (int k = 1; k < 10000; k++) if (collatz(k).first > collatz(maior).first) maior = k;
            printf("%d %lld\n", maior, collatz(maior).first); // 6171 261
        }
      `,
    },
  },
]
