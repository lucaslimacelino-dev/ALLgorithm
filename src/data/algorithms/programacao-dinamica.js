export default [
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci com Programação Dinâmica',
    difficulty: 'Iniciante',
    en: { name: 'Fibonacci with Dynamic Programming', summary: 'The classic first example of dynamic programming: store each result once instead of recomputing it exponentially many times.' },
    facts: { 'Técnica': 'Memoização ou tabela (bottom-up)', 'Ingênuo': 'O(φⁿ) ≈ O(1,618ⁿ) chamadas', 'Com PD': 'O(n) tempo, O(1) memória', 'Ideia central': 'Subproblemas sobrepostos' },
    summary: 'O primeiro exemplo clássico de programação dinâmica: guardar cada resultado uma vez em vez de recalculá-lo um número exponencial de vezes.',
    description:
      'A sequência de Fibonacci (0, 1, 1, 2, 3, 5, 8, 13, …) é definida por F(n) = F(n − 1) + F(n − 2). Traduzir a definição diretamente em uma função recursiva funciona, mas é desastroso: F(n − 2) é calculado de novo dentro de F(n − 1), e assim por diante, e o número de chamadas cresce como 1,618ⁿ — F(50) levaria horas. A programação dinâmica nasce da observação de que os mesmos subproblemas se repetem. Há duas formas de aproveitar isso: memoização (a recursão consulta um dicionário antes de calcular) e tabela de baixo para cima (calcula F(0), F(1), F(2)… em ordem, cada valor uma vez só). Ambas reduzem o custo para O(n); a versão de baixo para cima só precisa lembrar os dois últimos valores.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1) (de baixo para cima) / O(n) (memoização)' },
    steps: [
      'Identifique a recorrência: F(n) = F(n − 1) + F(n − 2), com F(0) = 0 e F(1) = 1.',
      'Perceba os subproblemas sobrepostos: a árvore de recursão repete os mesmos valores muitas vezes.',
      'Memoização: antes de calcular F(k), procure em uma tabela; depois de calcular, guarde.',
      'Ou de baixo para cima: preencha F(0), F(1), …, F(n) em ordem, usando os dois valores anteriores.',
      'Como cada valor só depende dos dois anteriores, bastam duas variáveis.',
    ],
    usedIn: ['Ensino de programação dinâmica e recursão', 'Busca de Fibonacci e heaps de Fibonacci', 'Modelos de crescimento em biologia', 'Análise de algoritmos (pior caso do algoritmo de Euclides)', 'Codificação de Fibonacci (compressão)'],
    realWorld: [
      { title: 'A ideia por trás de toda PD', text: 'Rotas mais curtas, alinhamento de DNA, corretores ortográficos e reconhecimento de voz usam a mesma estratégia: dividir o problema em subproblemas que se repetem e resolver cada um uma única vez.' },
      { title: 'Cache de funções', text: 'Decoradores como @lru_cache (Python) e useMemo (React) aplicam memoização: guardam resultados já calculados para não refazer trabalho — a mesma técnica, usada no dia a dia.' },
      { title: 'Euclides no pior caso', text: 'Os pares de números de Fibonacci consecutivos são o pior caso do algoritmo de Euclides para o MDC — o que dá um limite logarítmico para o número de divisões.' },
    ],
    curiosities: [
      'O termo "programação dinâmica" foi criado por Richard Bellman nos anos 1950. Ele contou que escolheu o nome por soar impressionante e por esconder do secretário de Defesa, que detestava a palavra "pesquisa", que aquilo era matemática.',
      'A versão recursiva ingênua de F(40) faz mais de 300 milhões de chamadas; a versão com programação dinâmica faz 39 somas.',
      'Com exponenciação rápida de matrizes, F(n) pode ser calculado com O(log n) multiplicações: [[1, 1], [1, 0]]ⁿ contém F(n).',
    ],
    code: {
      python: String.raw`
        from functools import lru_cache

        @lru_cache(maxsize=None)        # memoização: cada F(k) é calculado uma vez
        def fib_memo(n):
            return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

        def fib_tabela(n):              # de baixo para cima, só com os dois últimos valores
            a, b = 0, 1
            for _ in range(n):
                a, b = b, a + b
            return a

        print(fib_memo(50))     # 12586269025
        print(fib_tabela(90))   # 2880067194370816120
      `,
      javascript: String.raw`
        const memo = new Map();
        function fibMemo(n) { // memoização: cada F(k) é calculado uma vez
          if (n < 2) return BigInt(n);
          if (!memo.has(n)) memo.set(n, fibMemo(n - 1) + fibMemo(n - 2));
          return memo.get(n);
        }

        function fibTabela(n) { // de baixo para cima; BigInt porque F(90) passa de 2^53
          let a = 0n, b = 1n;
          for (let i = 0; i < n; i++) [a, b] = [b, a + b];
          return a;
        }

        console.log(fibMemo(50).toString());   // 12586269025
        console.log(fibTabela(90).toString()); // 2880067194370816120
      `,
      java: String.raw`
        import java.util.HashMap;
        import java.util.Map;

        public class Fibonacci {
            static final Map<Integer, Long> memo = new HashMap<>();

            static long fibMemo(int n) { // memoização: cada F(k) é calculado uma vez
                if (n < 2) return n;
                Long salvo = memo.get(n);
                if (salvo != null) return salvo;
                long valor = fibMemo(n - 1) + fibMemo(n - 2);
                memo.put(n, valor);
                return valor;
            }

            static long fibTabela(int n) { // de baixo para cima, só com os dois últimos valores
                long a = 0, b = 1;
                for (int i = 0; i < n; i++) { long t = a + b; a = b; b = t; }
                return a;
            }

            public static void main(String[] args) {
                System.out.println(fibMemo(50));   // 12586269025
                System.out.println(fibTabela(90)); // 2880067194370816120
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <unordered_map>
        using namespace std;

        unordered_map<int, unsigned long long> memo;

        unsigned long long fibMemo(int n) { // memoização: cada F(k) é calculado uma vez
            if (n < 2) return n;
            auto it = memo.find(n);
            if (it != memo.end()) return it->second;
            return memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
        }

        unsigned long long fibTabela(int n) { // de baixo para cima, só com os dois últimos valores
            unsigned long long a = 0, b = 1;
            for (int i = 0; i < n; i++) { unsigned long long t = a + b; a = b; b = t; }
            return a;
        }

        int main() {
            printf("%llu\n", fibMemo(50));   // 12586269025
            printf("%llu\n", fibTabela(90)); // 2880067194370816120
        }
      `,
    },
  },
  {
    id: 'coin-change',
    name: 'Troco de Moedas',
    difficulty: 'Iniciante',
    en: { name: 'Coin Change', summary: 'Finds the fewest coins that add up to an amount — where the greedy "biggest coin first" strategy can fail and dynamic programming does not.' },
    facts: { 'Técnica': 'Programação dinâmica (de baixo para cima)', 'Recorrência': 'dp[v] = 1 + min(dp[v − c])', 'Custo': 'O(V · k) para k moedas', 'Guloso funciona?': 'Só para alguns sistemas de moedas' },
    summary: 'Encontra o menor número de moedas que somam um valor — um caso em que a estratégia gulosa "maior moeda primeiro" pode falhar e a programação dinâmica não.',
    description:
      'Dado um conjunto de valores de moedas e um total V, qual é o menor número de moedas que soma V? A intuição diz: pegue sempre a maior moeda que cabe. Com as moedas do real (1, 5, 10, 25, 50 centavos) isso funciona, mas com moedas 1, 3 e 4 e total 6 o guloso escolhe 4 + 1 + 1 (três moedas), enquanto 3 + 3 usa só duas. A programação dinâmica resolve qualquer sistema de moedas: dp[v] é o menor número de moedas para formar v, e vale 1 + min(dp[v − c]) entre as moedas c que cabem em v, com dp[0] = 0. Preenchendo a tabela de 0 a V, cada valor depende só de valores menores já calculados. Guardando qual moeda deu o mínimo, reconstrói-se a combinação.',
    complexity: { best: 'O(V · k)', average: 'O(V · k)', worst: 'O(V · k)', space: 'O(V)' },
    steps: [
      'Crie dp[0..V] com dp[0] = 0 e os demais = ∞.',
      'Para cada valor v de 1 a V, e para cada moeda c ≤ v: dp[v] = min(dp[v], dp[v − c] + 1).',
      'Guarde qual moeda produziu o mínimo em cada v.',
      'Se dp[V] = ∞, o valor é impossível de formar.',
      'Para listar as moedas, volte de V subtraindo a moeda guardada até chegar a 0.',
    ],
    usedIn: ['Máquinas de troco e caixas automáticos', 'Problemas de alocação de recursos', 'Ensino de PD versus algoritmos gulosos', 'Planejamento de embalagens e cortes', 'Variante "quantas formas de formar V" (contagem)'],
    realWorld: [
      { title: 'Sistemas de moedas "canônicos"', text: 'Moedas reais costumam ser projetadas para que o guloso dê sempre o ótimo (sistemas canônicos), o que facilita o troco. A PD verifica se um sistema tem essa propriedade.' },
      { title: 'Caixas eletrônicos', text: 'Um caixa com quantidades limitadas de cada nota resolve uma variante: entregar o valor pedido com as notas disponíveis — e o guloso pode falhar, por exemplo, quando faltam notas intermediárias.' },
      { title: 'Corte e empacotamento', text: 'O mesmo modelo aparece em cortar barras ou bobinas em pedaços de tamanhos padronizados minimizando o número de peças.' },
    ],
    curiosities: [
      'O antigo xelim britânico tinha moedas de 1, 3, 4, 6, 12, 24 e 30 pence — um sistema em que o troco guloso nem sempre era o melhor.',
      'Decidir se um sistema de moedas é canônico pode ser feito em tempo polinomial (Pearson, 2005), embora o problema geral do troco seja NP-difícil quando os valores são enormes.',
      'Trocando "min" por "soma", a mesma tabela conta de quantas maneiras diferentes o valor pode ser formado.',
    ],
    code: {
      python: String.raw`
        def troco(moedas, valor):
            INF = float("inf")
            dp = [0] + [INF] * valor
            escolha = [0] * (valor + 1)
            for v in range(1, valor + 1):
                for c in sorted(moedas):
                    if c <= v and dp[v - c] + 1 < dp[v]:
                        dp[v], escolha[v] = dp[v - c] + 1, c
            if dp[valor] == INF:
                return None
            usadas, v = [], valor
            while v > 0:                 # reconstrói voltando pelas escolhas
                usadas.append(escolha[v])
                v -= escolha[v]
            return usadas

        print(troco([1, 3, 4], 6))       # [3, 3] — o guloso daria [4, 1, 1]
        print(troco([1, 5, 10, 25], 63)) # [1, 1, 1, 10, 25, 25]
      `,
      javascript: String.raw`
        function troco(moedas, valor) {
          const dp = [0, ...Array(valor).fill(Infinity)], escolha = Array(valor + 1).fill(0);
          const ordenadas = [...moedas].sort((a, b) => a - b);
          for (let v = 1; v <= valor; v++) {
            for (const c of ordenadas) {
              if (c <= v && dp[v - c] + 1 < dp[v]) { dp[v] = dp[v - c] + 1; escolha[v] = c; }
            }
          }
          if (dp[valor] === Infinity) return null;
          const usadas = [];
          for (let v = valor; v > 0; v -= escolha[v]) usadas.push(escolha[v]); // reconstrói
          return usadas;
        }

        console.log(troco([1, 3, 4], 6).join(" "));       // 3 3 — o guloso daria 4 1 1
        console.log(troco([1, 5, 10, 25], 63).join(" ")); // 1 1 1 10 25 25
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;

        public class Troco {
            static List<Integer> troco(int[] moedas, int valor) {
                int[] dp = new int[valor + 1], escolha = new int[valor + 1];
                Arrays.fill(dp, Integer.MAX_VALUE);
                dp[0] = 0;
                int[] ordenadas = moedas.clone();
                Arrays.sort(ordenadas);
                for (int v = 1; v <= valor; v++)
                    for (int c : ordenadas)
                        if (c <= v && dp[v - c] != Integer.MAX_VALUE && dp[v - c] + 1 < dp[v]) { dp[v] = dp[v - c] + 1; escolha[v] = c; }
                if (dp[valor] == Integer.MAX_VALUE) return null;
                List<Integer> usadas = new ArrayList<>();
                for (int v = valor; v > 0; v -= escolha[v]) usadas.add(escolha[v]); // reconstrói
                return usadas;
            }

            public static void main(String[] args) {
                System.out.println(troco(new int[]{1, 3, 4}, 6));        // [3, 3] — o guloso daria [4, 1, 1]
                System.out.println(troco(new int[]{1, 5, 10, 25}, 63));  // [1, 1, 1, 10, 25, 25]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <climits>
        #include <cstdio>
        #include <vector>
        using namespace std;

        vector<int> troco(vector<int> moedas, int valor) {
            vector<int> dp(valor + 1, INT_MAX), escolha(valor + 1, 0);
            dp[0] = 0;
            sort(moedas.begin(), moedas.end());
            for (int v = 1; v <= valor; v++)
                for (int c : moedas)
                    if (c <= v && dp[v - c] != INT_MAX && dp[v - c] + 1 < dp[v]) { dp[v] = dp[v - c] + 1; escolha[v] = c; }
            vector<int> usadas;
            if (dp[valor] == INT_MAX) return usadas; // impossível
            for (int v = valor; v > 0; v -= escolha[v]) usadas.push_back(escolha[v]); // reconstrói
            return usadas;
        }

        void imprimir(const vector<int>& v) { for (size_t i = 0; i < v.size(); i++) printf(i ? " %d" : "%d", v[i]); printf("\n"); }

        int main() {
            imprimir(troco({1, 3, 4}, 6));        // 3 3 — o guloso daria 4 1 1
            imprimir(troco({1, 5, 10, 25}, 63));  // 1 1 1 10 25 25
        }
      `,
    },
  },
  {
    id: 'knapsack',
    name: 'Problema da Mochila 0/1',
    difficulty: 'Intermediário',
    en: { name: '0/1 Knapsack Problem', summary: 'Chooses which items to pack, each with a weight and a value, to maximize the total value without exceeding the capacity.' },
    facts: { 'Técnica': 'Programação dinâmica (tabela itens × capacidade)', 'Recorrência': 'dp[i][c] = max(dp[i−1][c], dp[i−1][c−pᵢ] + vᵢ)', 'Custo': 'O(n · W) — pseudo-polinomial', 'Complexidade do problema': 'NP-difícil' },
    summary: 'Escolhe quais itens levar, cada um com peso e valor, para maximizar o valor total sem passar da capacidade.',
    description:
      'Na mochila 0/1, cada item tem um peso e um valor, e pode ser levado inteiro ou deixado (não dá para levar metade). Testar todas as combinações custa 2ⁿ. A programação dinâmica monta uma tabela dp[i][c]: o maior valor possível usando só os i primeiros itens com capacidade c. Para cada item há duas opções — deixá-lo (dp[i − 1][c]) ou levá-lo, se couber (dp[i − 1][c − pᵢ] + vᵢ) — e a tabela guarda a melhor. O custo é O(n · W), onde W é a capacidade: rápido para capacidades moderadas, mas "pseudo-polinomial", porque cresce com o valor de W e não com o número de dígitos — o problema continua NP-difícil. Voltando pela tabela, nas linhas em que o valor mudou, descobre-se quais itens foram escolhidos.',
    complexity: { best: 'O(n · W)', average: 'O(n · W)', worst: 'O(n · W)', space: 'O(n · W) (ou O(W) só para o valor)' },
    steps: [
      'Crie a tabela dp[0..n][0..W] com a linha 0 toda zero (nenhum item, valor 0).',
      'Para cada item i (peso p, valor v) e cada capacidade c: se p > c, dp[i][c] = dp[i − 1][c].',
      'Senão, dp[i][c] = max(dp[i − 1][c], dp[i − 1][c − p] + v): deixar ou levar o item.',
      'O valor ótimo está em dp[n][W].',
      'Para saber os itens, volte de (n, W): se dp[i][c] ≠ dp[i − 1][c], o item i foi levado e c diminui o seu peso.',
    ],
    usedIn: ['Alocação de orçamento e seleção de projetos', 'Carregamento de cargas e contêineres', 'Seleção de anúncios e de portfólio', 'Criptografia (sistema de Merkle-Hellman, quebrado)', 'Corte de materiais e planejamento de produção'],
    realWorld: [
      { title: 'Orçamento', text: 'Escolher quais projetos financiar com um orçamento fixo, cada um com custo e retorno estimado, é exatamente uma mochila 0/1.' },
      { title: 'Cargas', text: 'Transportadoras e companhias aéreas escolhem quais encomendas embarcar respeitando peso ou volume máximo e maximizando o frete — com variantes de várias restrições ao mesmo tempo.' },
      { title: 'Criptografia de mochila', text: 'Em 1978, Merkle e Hellman propuseram um sistema de chave pública baseado na mochila. Ele foi quebrado por Shamir em 1982 — a versão usada tinha uma estrutura escondida fácil de explorar.' },
    ],
    curiosities: [
      'A mochila é um dos 21 problemas NP-completos da famosa lista de Richard Karp (1972).',
      'Na mochila "fracionária", em que dá para levar pedaços dos itens, o algoritmo guloso (melhor valor por quilo primeiro) é ótimo — a restrição de levar tudo ou nada é o que torna o problema difícil.',
      'Para capacidades enormes, existem esquemas de aproximação (FPTAS) que garantem um resultado tão próximo do ótimo quanto se queira, em tempo polinomial.',
    ],
    code: {
      python: String.raw`
        def mochila(itens, W):           # itens = [(peso, valor), ...]
            n = len(itens)
            dp = [[0] * (W + 1) for _ in range(n + 1)]
            for i, (p, v) in enumerate(itens, start=1):
                for c in range(W + 1):
                    dp[i][c] = dp[i - 1][c]                       # deixar o item
                    if p <= c:
                        dp[i][c] = max(dp[i][c], dp[i - 1][c - p] + v)  # ou levar
            escolhidos, c = [], W
            for i in range(n, 0, -1):    # volta pela tabela
                if dp[i][c] != dp[i - 1][c]:
                    escolhidos.append(i)
                    c -= itens[i - 1][0]
            return dp[n][W], sorted(escolhidos)

        print(mochila([(1, 1), (3, 4), (4, 5), (5, 7)], 7))   # (9, [2, 3])
      `,
      javascript: String.raw`
        function mochila(itens, W) { // itens = [[peso, valor], ...]
          const n = itens.length;
          const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
          for (let i = 1; i <= n; i++) {
            const [p, v] = itens[i - 1];
            for (let c = 0; c <= W; c++) {
              dp[i][c] = dp[i - 1][c];                                        // deixar o item
              if (p <= c) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - p] + v); // ou levar
            }
          }
          const escolhidos = [];
          for (let i = n, c = W; i > 0; i--) { // volta pela tabela
            if (dp[i][c] !== dp[i - 1][c]) { escolhidos.unshift(i); c -= itens[i - 1][0]; }
          }
          return [dp[n][W], escolhidos];
        }

        const [valor, itens] = mochila([[1, 1], [3, 4], [4, 5], [5, 7]], 7);
        console.log(valor + " " + itens.join(" ")); // 9 2 3
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Collections;
        import java.util.List;

        public class Mochila {
            public static void main(String[] args) {
                int[][] itens = {{1, 1}, {3, 4}, {4, 5}, {5, 7}}; // {peso, valor}
                int W = 7, n = itens.length;
                int[][] dp = new int[n + 1][W + 1];
                for (int i = 1; i <= n; i++) {
                    int p = itens[i - 1][0], v = itens[i - 1][1];
                    for (int c = 0; c <= W; c++) {
                        dp[i][c] = dp[i - 1][c];                                       // deixar o item
                        if (p <= c) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - p] + v); // ou levar
                    }
                }
                List<Integer> escolhidos = new ArrayList<>();
                for (int i = n, c = W; i > 0; i--) // volta pela tabela
                    if (dp[i][c] != dp[i - 1][c]) { escolhidos.add(i); c -= itens[i - 1][0]; }
                Collections.reverse(escolhidos);
                System.out.println(dp[n][W] + " " + escolhidos); // 9 [2, 3]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cstdio>
        #include <utility>
        #include <vector>
        using namespace std;

        int main() {
            vector<pair<int, int>> itens = {{1, 1}, {3, 4}, {4, 5}, {5, 7}}; // {peso, valor}
            int W = 7, n = itens.size();
            vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
            for (int i = 1; i <= n; i++) {
                auto [p, v] = itens[i - 1];
                for (int c = 0; c <= W; c++) {
                    dp[i][c] = dp[i - 1][c];                                  // deixar o item
                    if (p <= c) dp[i][c] = max(dp[i][c], dp[i - 1][c - p] + v); // ou levar
                }
            }
            vector<int> escolhidos;
            for (int i = n, c = W; i > 0; i--) // volta pela tabela
                if (dp[i][c] != dp[i - 1][c]) { escolhidos.push_back(i); c -= itens[i - 1].first; }
            printf("%d:", dp[n][W]);
            for (auto it = escolhidos.rbegin(); it != escolhidos.rend(); ++it) printf(" %d", *it);
            printf("\n"); // 9: 2 3
        }
      `,
    },
  },
  {
    id: 'lcs',
    name: 'Maior Subsequência Comum (LCS)',
    difficulty: 'Intermediário',
    en: { name: 'Longest Common Subsequence (LCS)', summary: 'Finds the longest sequence of characters that appears, in order, in two strings — the core of diff tools and DNA comparison.' },
    facts: { 'Técnica': 'Programação dinâmica (tabela m × n)', 'Recorrência': 'iguais: diagonal + 1; senão: max(cima, esquerda)', 'Custo': 'O(m · n)', 'Usado em': 'diff, git, bioinformática' },
    summary: 'Encontra a maior sequência de caracteres que aparece, na mesma ordem, em duas strings — o coração das ferramentas de diff e da comparação de DNA.',
    description:
      'Uma subsequência mantém a ordem dos caracteres, mas não precisa ser contígua: "ACE" é subsequência de "ABCDE". A maior subsequência comum (LCS) entre duas strings mede o quanto elas se parecem. A programação dinâmica usa uma tabela em que dp[i][j] é o tamanho da LCS entre os i primeiros caracteres da primeira string e os j primeiros da segunda. Se os caracteres A[i] e B[j] são iguais, eles podem fazer parte da resposta: dp[i][j] = dp[i − 1][j − 1] + 1. Senão, descarta-se um dos dois: dp[i][j] = max(dp[i − 1][j], dp[i][j − 1]). Para obter a subsequência, volta-se do canto da tabela: diagonal onde os caracteres coincidem, e em direção ao maior vizinho onde não coincidem.',
    complexity: { best: 'O(m · n)', average: 'O(m · n)', worst: 'O(m · n)', space: 'O(m · n) (ou O(min(m, n)) só para o tamanho)' },
    steps: [
      'Crie a tabela dp[0..m][0..n] com a linha 0 e a coluna 0 iguais a 0.',
      'Para cada i e j: se A[i] = B[j], dp[i][j] = dp[i − 1][j − 1] + 1.',
      'Senão, dp[i][j] = max(dp[i − 1][j], dp[i][j − 1]).',
      'O tamanho da LCS está em dp[m][n].',
      'Para reconstruir, comece em (m, n): se os caracteres são iguais, inclua-o e vá na diagonal; senão, vá para o vizinho (cima ou esquerda) com o maior valor.',
    ],
    usedIn: ['Ferramentas de diff (diff, git diff, revisão de código)', 'Comparação de sequências de DNA e proteínas', 'Detecção de plágio', 'Controle de versão e mesclagem de arquivos', 'Correção de textos e comparação de documentos'],
    realWorld: [
      { title: 'diff e git', text: 'Comparar duas versões de um arquivo é encontrar a maior sequência de linhas em comum: o que não está nela foi removido ou acrescentado. O diff do Unix e o git usam algoritmos de LCS refinados (como o de Myers) para isso.' },
      { title: 'Bioinformática', text: 'Alinhar sequências de DNA ou proteínas — base para identificar genes e parentesco entre espécies — é uma generalização da LCS com pontuações para coincidências, trocas e lacunas (Needleman-Wunsch).' },
      { title: 'Plágio', text: 'Ferramentas de detecção de plágio em código e textos medem semelhanças por subsequências comuns, que resistem a pequenas inserções e trocas feitas para disfarçar a cópia.' },
    ],
    curiosities: [
      'O diff original do Unix foi escrito em 1974 por Douglas McIlroy, com um algoritmo de James Hunt e Thomas Szymanski para LCS.',
      'O algoritmo de Hirschberg (1975) encontra a própria subsequência, não só o tamanho, usando memória linear — com um truque de dividir e conquistar.',
      'Para três ou mais strings, a tabela vira um cubo; para um número arbitrário de strings, o problema é NP-difícil.',
    ],
    code: {
      python: String.raw`
        def lcs(a, b):
            m, n = len(a), len(b)
            dp = [[0] * (n + 1) for _ in range(m + 1)]
            for i in range(1, m + 1):
                for j in range(1, n + 1):
                    if a[i - 1] == b[j - 1]:
                        dp[i][j] = dp[i - 1][j - 1] + 1             # estende a diagonal
                    else:
                        dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # descarta um dos caracteres
            resultado, i, j = [], m, n
            while i > 0 and j > 0:                                  # reconstrói do fim
                if a[i - 1] == b[j - 1]:
                    resultado.append(a[i - 1]); i -= 1; j -= 1
                elif dp[i - 1][j] >= dp[i][j - 1]:
                    i -= 1
                else:
                    j -= 1
            return "".join(reversed(resultado))

        print(lcs("ABCBDAB", "BDCABA"))   # BCBA
      `,
      javascript: String.raw`
        function lcs(a, b) {
          const m = a.length, n = b.length;
          const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
          for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
              dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1] + 1                    // estende a diagonal
                : Math.max(dp[i - 1][j], dp[i][j - 1]);   // descarta um dos caracteres
          let resultado = "";
          for (let i = m, j = n; i > 0 && j > 0;) {      // reconstrói do fim
            if (a[i - 1] === b[j - 1]) { resultado = a[i - 1] + resultado; i--; j--; }
            else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
            else j--;
          }
          return resultado;
        }

        console.log(lcs("ABCBDAB", "BDCABA")); // BCBA
      `,
      java: String.raw`
        public class LCS {
            static String lcs(String a, String b) {
                int m = a.length(), n = b.length();
                int[][] dp = new int[m + 1][n + 1];
                for (int i = 1; i <= m; i++)
                    for (int j = 1; j <= n; j++)
                        dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                            ? dp[i - 1][j - 1] + 1                    // estende a diagonal
                            : Math.max(dp[i - 1][j], dp[i][j - 1]);   // descarta um dos caracteres
                StringBuilder sb = new StringBuilder();
                for (int i = m, j = n; i > 0 && j > 0;) {             // reconstrói do fim
                    if (a.charAt(i - 1) == b.charAt(j - 1)) { sb.append(a.charAt(i - 1)); i--; j--; }
                    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
                    else j--;
                }
                return sb.reverse().toString();
            }

            public static void main(String[] args) {
                System.out.println(lcs("ABCBDAB", "BDCABA")); // BCBA
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        string lcs(const string& a, const string& b) {
            int m = a.size(), n = b.size();
            vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
            for (int i = 1; i <= m; i++)
                for (int j = 1; j <= n; j++)
                    dp[i][j] = a[i - 1] == b[j - 1] ? dp[i - 1][j - 1] + 1   // estende a diagonal
                                                    : max(dp[i - 1][j], dp[i][j - 1]);
            string resultado;
            for (int i = m, j = n; i > 0 && j > 0;) { // reconstrói do fim
                if (a[i - 1] == b[j - 1]) { resultado += a[i - 1]; i--; j--; }
                else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
                else j--;
            }
            reverse(resultado.begin(), resultado.end());
            return resultado;
        }

        int main() {
            cout << lcs("ABCBDAB", "BDCABA") << "\n"; // BCBA
        }
      `,
    },
  },
  {
    id: 'edit-distance',
    name: 'Distância de Edição (Levenshtein)',
    difficulty: 'Intermediário',
    en: { name: 'Edit Distance (Levenshtein)', summary: 'Counts the fewest insertions, deletions and substitutions that turn one word into another — the math behind spell checkers.' },
    facts: { 'Criado por': 'Vladimir Levenshtein', 'Ano': '1965', 'Técnica': 'Programação dinâmica (tabela m × n)', 'Operações': 'Inserir, remover, trocar', 'Custo': 'O(m · n)' },
    summary: 'Conta o menor número de inserções, remoções e trocas que transformam uma palavra em outra — a matemática por trás dos corretores ortográficos.',
    description:
      'A distância de Levenshtein entre duas palavras é o menor número de operações de um caractere — inserir, remover ou trocar — que transforma uma na outra. "kitten" vira "sitting" em 3 passos: trocar k por s, trocar e por i e inserir g. A programação dinâmica preenche uma tabela em que dp[i][j] é a distância entre os i primeiros caracteres da primeira palavra e os j primeiros da segunda. A primeira linha e a primeira coluna são fáceis (só inserções ou só remoções). Cada célula escolhe o menor de três caminhos: diagonal (troca, que custa 0 se os caracteres forem iguais), de cima (remoção) ou da esquerda (inserção), somando 1. Voltando pela tabela, obtém-se a lista de operações.',
    complexity: { best: 'O(m · n)', average: 'O(m · n)', worst: 'O(m · n)', space: 'O(m · n) (ou O(min(m, n)) só para a distância)' },
    steps: [
      'Crie a tabela dp[0..m][0..n] com dp[i][0] = i e dp[0][j] = j.',
      'Para cada i e j: custo = 0 se A[i] = B[j], senão 1.',
      'dp[i][j] = min(dp[i − 1][j − 1] + custo, dp[i − 1][j] + 1, dp[i][j − 1] + 1) — trocar, remover ou inserir.',
      'A distância está em dp[m][n].',
      'Para listar as operações, volte de (m, n) pela célula que deu o mínimo.',
    ],
    usedIn: ['Corretores ortográficos e "você quis dizer…?"', 'Busca aproximada (fuzzy) e autocompletar', 'Bioinformática (mutações em sequências)', 'Reconhecimento de voz e OCR (medir erros)', 'Deduplicação de cadastros com nomes digitados errado'],
    realWorld: [
      { title: 'Corretores ortográficos', text: 'Ao encontrar uma palavra que não está no dicionário, o corretor sugere as palavras a menor distância de edição — normalmente 1 ou 2. Estruturas como BK-trees aceleram essa busca em dicionários grandes.' },
      { title: 'Busca tolerante a erros', text: 'Motores de busca como Elasticsearch oferecem buscas "fuzzy" que aceitam termos a até 2 edições do digitado, encontrando "algoritmo" mesmo que se digite "algorítimo".' },
      { title: 'Medir reconhecimento de voz', text: 'A taxa de erro de palavras (WER), usada para avaliar sistemas de reconhecimento de voz, é a distância de edição entre a transcrição e o texto correto, contada em palavras.' },
    ],
    curiosities: [
      'Vladimir Levenshtein definiu a distância em 1965, estudando códigos corretores de erros na União Soviética.',
      'A variante de Damerau-Levenshtein conta também a troca de dois caracteres vizinhos ("teh" → "the") como uma única operação — o erro de digitação mais comum.',
      'Sob hipóteses amplamente aceitas da teoria da complexidade (SETH), não existe algoritmo para a distância de edição significativamente mais rápido que O(n²).',
    ],
    code: {
      python: String.raw`
        def levenshtein(a, b):
            m, n = len(a), len(b)
            dp = [[0] * (n + 1) for _ in range(m + 1)]
            for i in range(m + 1): dp[i][0] = i          # só remoções
            for j in range(n + 1): dp[0][j] = j          # só inserções
            for i in range(1, m + 1):
                for j in range(1, n + 1):
                    custo = 0 if a[i - 1] == b[j - 1] else 1
                    dp[i][j] = min(dp[i - 1][j - 1] + custo,   # trocar (ou manter)
                                   dp[i - 1][j] + 1,           # remover
                                   dp[i][j - 1] + 1)           # inserir
            return dp[m][n]

        print(levenshtein("kitten", "sitting"))    # 3
        print(levenshtein("algoritmo", "logaritmo"))  # 3
      `,
      javascript: String.raw`
        function levenshtein(a, b) {
          const m = a.length, n = b.length;
          const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
          for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++) {
              const custo = a[i - 1] === b[j - 1] ? 0 : 1;
              dp[i][j] = Math.min(dp[i - 1][j - 1] + custo, // trocar (ou manter)
                                  dp[i - 1][j] + 1,         // remover
                                  dp[i][j - 1] + 1);        // inserir
            }
          return dp[m][n];
        }

        console.log(levenshtein("kitten", "sitting"));      // 3
        console.log(levenshtein("algoritmo", "logaritmo")); // 3
      `,
      java: String.raw`
        public class Levenshtein {
            static int distancia(String a, String b) {
                int m = a.length(), n = b.length();
                int[][] dp = new int[m + 1][n + 1];
                for (int i = 0; i <= m; i++) dp[i][0] = i; // só remoções
                for (int j = 0; j <= n; j++) dp[0][j] = j; // só inserções
                for (int i = 1; i <= m; i++)
                    for (int j = 1; j <= n; j++) {
                        int custo = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                        dp[i][j] = Math.min(dp[i - 1][j - 1] + custo,           // trocar (ou manter)
                                   Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1)); // remover / inserir
                    }
                return dp[m][n];
            }

            public static void main(String[] args) {
                System.out.println(distancia("kitten", "sitting"));      // 3
                System.out.println(distancia("algoritmo", "logaritmo")); // 3
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cstdio>
        #include <string>
        #include <vector>
        using namespace std;

        int levenshtein(const string& a, const string& b) {
            int m = a.size(), n = b.size();
            vector<vector<int>> dp(m + 1, vector<int>(n + 1));
            for (int i = 0; i <= m; i++) dp[i][0] = i; // só remoções
            for (int j = 0; j <= n; j++) dp[0][j] = j; // só inserções
            for (int i = 1; i <= m; i++)
                for (int j = 1; j <= n; j++) {
                    int custo = a[i - 1] == b[j - 1] ? 0 : 1;
                    dp[i][j] = min({dp[i - 1][j - 1] + custo, dp[i - 1][j] + 1, dp[i][j - 1] + 1}); // trocar, remover, inserir
                }
            return dp[m][n];
        }

        int main() {
            printf("%d\n", levenshtein("kitten", "sitting"));      // 3
            printf("%d\n", levenshtein("algoritmo", "logaritmo")); // 3
        }
      `,
    },
  },
  {
    id: 'subset-sum',
    name: 'Soma de Subconjuntos',
    difficulty: 'Intermediário',
    en: { name: 'Subset Sum', summary: 'Decides whether some subset of numbers adds up exactly to a target — NP-complete, yet solvable with a table when the numbers are small.' },
    facts: { 'Complexidade do problema': 'NP-completo', 'Técnica': 'Programação dinâmica (tabela de booleanos)', 'Custo': 'O(n · S) — pseudo-polinomial', 'Relacionado a': 'Mochila 0/1, partição' },
    summary: 'Decide se algum subconjunto de números soma exatamente um alvo — NP-completo, mas resolvível com uma tabela quando os números são pequenos.',
    description:
      'Dado um conjunto de números inteiros e um alvo S, existe um subconjunto que some exatamente S? Testar todos os subconjuntos custa 2ⁿ, e o problema é NP-completo: não se conhece algoritmo polinomial no tamanho da entrada. Ainda assim, quando S é moderado, a programação dinâmica resolve: dp[i][s] diz se é possível formar a soma s usando os i primeiros números. Cada número pode ser ignorado (dp[i − 1][s]) ou usado, se couber (dp[i − 1][s − x]). O custo O(n · S) é pseudo-polinomial — polinomial no valor de S, mas exponencial no número de dígitos de S. É o mesmo raciocínio da mochila 0/1, em que o valor de cada item é igual ao peso.',
    complexity: { best: 'O(n · S)', average: 'O(n · S)', worst: 'O(n · S)', space: 'O(n · S) (ou O(S) só para a resposta)' },
    steps: [
      'Crie a tabela dp[0..n][0..S] com dp[i][0] = verdadeiro (o conjunto vazio soma 0) e dp[0][s] = falso para s > 0.',
      'Para cada número x (linha i) e soma s: dp[i][s] = dp[i − 1][s] ou (x ≤ s e dp[i − 1][s − x]).',
      'A resposta está em dp[n][S].',
      'Para reconstruir, volte de (n, S): se dp[i − 1][s] é falso, o número i foi usado e s diminui x.',
    ],
    usedIn: ['Problema da partição (dividir em dois grupos de mesma soma)', 'Balanceamento de cargas e de carga em servidores', 'Criptografia (sistemas de mochila, históricos)', 'Teoria da complexidade (reduções NP-completas)', 'Conciliação contábil (quais lançamentos somam o valor?)'],
    realWorld: [
      { title: 'Conciliação financeira', text: 'Encontrar quais faturas em aberto somam exatamente o valor de um pagamento recebido é um problema de soma de subconjuntos — comum em contabilidade e conciliação bancária.' },
      { title: 'Dividir igualmente', text: 'O problema da partição — dividir itens em dois grupos de mesma soma — é a soma de subconjuntos com alvo igual à metade do total; aparece ao balancear tarefas entre dois processadores.' },
      { title: 'Prova de NP-completude', text: 'Como a soma de subconjuntos é simples de enunciar, ela é usada como ponto de partida para provar que muitos outros problemas também são NP-completos.' },
    ],
    curiosities: [
      'A lista original pedia "aceitar a linguagem NP-completa Subset-sum em tempo polinomial" — isso só é possível de forma pseudo-polinomial; um algoritmo realmente polinomial provaria P = NP e valeria um prêmio de um milhão de dólares do Instituto Clay.',
      'O algoritmo "meet in the middle" de Horowitz e Sahni (1974) resolve o problema em O(2^(n/2)), dividindo os números em duas metades.',
      'Sistemas de criptografia baseados em mochila/soma de subconjuntos foram quebrados nos anos 1980 por técnicas de reticulados — as mesmas que hoje sustentam a criptografia pós-quântica.',
    ],
    code: {
      python: String.raw`
        def soma_subconjunto(numeros, alvo):
            n = len(numeros)
            dp = [[s == 0 for s in range(alvo + 1)] for _ in range(n + 1)]
            for i in range(1, n + 1):
                x = numeros[i - 1]
                for s in range(1, alvo + 1):
                    dp[i][s] = dp[i - 1][s] or (x <= s and dp[i - 1][s - x])  # ignorar ou usar x
            if not dp[n][alvo]:
                return None
            usados, s = [], alvo
            for i in range(n, 0, -1):    # reconstrói
                if not dp[i - 1][s]:
                    usados.append(numeros[i - 1])
                    s -= numeros[i - 1]
            return usados[::-1]

        print(soma_subconjunto([3, 34, 4, 12, 5, 2], 9))    # [4, 5]
        print(soma_subconjunto([3, 34, 4, 12, 5, 2], 30))   # None
      `,
      javascript: String.raw`
        function somaSubconjunto(numeros, alvo) {
          const n = numeros.length;
          const dp = Array.from({ length: n + 1 }, () => Array.from({ length: alvo + 1 }, (_, s) => s === 0));
          for (let i = 1; i <= n; i++) {
            const x = numeros[i - 1];
            for (let s = 1; s <= alvo; s++) dp[i][s] = dp[i - 1][s] || (x <= s && dp[i - 1][s - x]); // ignorar ou usar x
          }
          if (!dp[n][alvo]) return null;
          const usados = [];
          for (let i = n, s = alvo; i > 0; i--) // reconstrói
            if (!dp[i - 1][s]) { usados.unshift(numeros[i - 1]); s -= numeros[i - 1]; }
          return usados;
        }

        console.log(somaSubconjunto([3, 34, 4, 12, 5, 2], 9));  // [ 4, 5 ]
        console.log(somaSubconjunto([3, 34, 4, 12, 5, 2], 30)); // null
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Collections;
        import java.util.List;

        public class SomaSubconjunto {
            static List<Integer> resolver(int[] numeros, int alvo) {
                int n = numeros.length;
                boolean[][] dp = new boolean[n + 1][alvo + 1];
                for (int i = 0; i <= n; i++) dp[i][0] = true;
                for (int i = 1; i <= n; i++) {
                    int x = numeros[i - 1];
                    for (int s = 1; s <= alvo; s++) dp[i][s] = dp[i - 1][s] || (x <= s && dp[i - 1][s - x]); // ignorar ou usar x
                }
                if (!dp[n][alvo]) return null;
                List<Integer> usados = new ArrayList<>();
                for (int i = n, s = alvo; i > 0; i--) // reconstrói
                    if (!dp[i - 1][s]) { usados.add(numeros[i - 1]); s -= numeros[i - 1]; }
                Collections.reverse(usados);
                return usados;
            }

            public static void main(String[] args) {
                int[] numeros = {3, 34, 4, 12, 5, 2};
                System.out.println(resolver(numeros, 9));  // [4, 5]
                System.out.println(resolver(numeros, 30)); // null
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <vector>
        using namespace std;

        bool resolver(const vector<int>& numeros, int alvo, vector<int>& usados) {
            int n = numeros.size();
            vector<vector<bool>> dp(n + 1, vector<bool>(alvo + 1, false));
            for (int i = 0; i <= n; i++) dp[i][0] = true;
            for (int i = 1; i <= n; i++) {
                int x = numeros[i - 1];
                for (int s = 1; s <= alvo; s++) dp[i][s] = dp[i - 1][s] || (x <= s && dp[i - 1][s - x]); // ignorar ou usar x
            }
            if (!dp[n][alvo]) return false;
            for (int i = n, s = alvo; i > 0; i--) // reconstrói (de trás para frente)
                if (!dp[i - 1][s]) { usados.insert(usados.begin(), numeros[i - 1]); s -= numeros[i - 1]; }
            return true;
        }

        int main() {
            vector<int> numeros = {3, 34, 4, 12, 5, 2}, usados;
            if (resolver(numeros, 9, usados)) { for (int x : usados) printf("%d ", x); printf("\n"); } // 4 5
            usados.clear();
            printf("%s\n", resolver(numeros, 30, usados) ? "possível" : "impossível");             // impossível
        }
      `,
    },
  },
  {
    id: 'lis',
    name: 'Maior Subsequência Crescente (LIS)',
    difficulty: 'Avançado',
    en: { name: 'Longest Increasing Subsequence (LIS)', summary: 'Finds the longest strictly increasing subsequence of a list — O(n²) with a simple table, O(n log n) with patience sorting.' },
    facts: { 'Técnica': 'PD O(n²) ou paciência com busca binária', 'Melhor custo': 'O(n log n)', 'Recorrência': 'dp[i] = 1 + max(dp[j]) para j < i com aⱼ < aᵢ', 'Relacionado a': 'Paciência (jogo de cartas), teorema de Erdős–Szekeres' },
    summary: 'Encontra a maior subsequência estritamente crescente de uma lista — O(n²) com uma tabela simples, O(n log n) com o método da paciência.',
    description:
      'Dada uma sequência de números, a maior subsequência crescente (LIS) é a maior lista de elementos, na ordem original, em que cada um é maior que o anterior. Em 10, 9, 2, 5, 3, 7, 101, 18, a resposta tem tamanho 4 (por exemplo, 2, 3, 7, 18). A programação dinâmica direta define dp[i] como o tamanho da maior subsequência crescente que termina no elemento i: dp[i] = 1 + o maior dp[j] entre os elementos anteriores menores que ele — O(n²). Existe um método mais esperto, inspirado no jogo de paciência: mantém-se, para cada tamanho k, o menor valor possível para o último elemento de uma subsequência crescente de tamanho k. Essa lista é sempre ordenada, então cada novo elemento encontra sua posição por busca binária, e o total cai para O(n log n).',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n) (ou O(n²) com a tabela simples)', space: 'O(n)' },
    steps: [
      'Versão O(n²): dp[i] = 1 + max(dp[j]) para todo j < i com a[j] < a[i] (ou 1 se não houver).',
      'Versão O(n log n): mantenha caudas[k] = menor final possível de uma subsequência crescente de tamanho k + 1.',
      'Para cada elemento x, encontre por busca binária a primeira cauda ≥ x e substitua-a por x (ou acrescente x no fim, se ele for maior que todas).',
      'O tamanho da LIS é o número de caudas.',
      'Guardando, para cada elemento, o índice do predecessor, reconstrói-se a subsequência do fim para o começo.',
    ],
    usedIn: ['Diff de arquivos (algoritmo patience diff do git)', 'Bioinformática (encadeamento de alinhamentos)', 'Escalonamento e empilhamento de caixas', 'Análise de séries temporais (tendências)', 'Problemas clássicos de programação competitiva'],
    realWorld: [
      { title: 'Patience diff', text: 'O git oferece o algoritmo "patience diff" (git diff --patience), que alinha as linhas únicas dos dois arquivos com uma LIS e costuma produzir diffs mais legíveis em código.' },
      { title: 'Genomas', text: 'Ao comparar dois genomas, ferramentas encontram muitos trechos idênticos e precisam escolher a maior cadeia deles que mantém a mesma ordem nos dois — uma LIS sobre as posições.' },
      { title: 'Empilhar caixas', text: 'Problemas como empilhar o maior número de caixas (cada uma menor que a de baixo) ou encaixar envelopes se reduzem à maior subsequência crescente depois de uma ordenação.' },
    ],
    curiosities: [
      'O teorema de Erdős–Szekeres (1935) garante que toda sequência de n² + 1 números distintos tem uma subsequência crescente ou decrescente de tamanho n + 1.',
      'O método das caudas é chamado de "paciência" porque simula um jogo de cartas: cada carta vai para a pilha mais à esquerda cujo topo é maior que ela, e o número de pilhas é a LIS.',
      'Para uma permutação aleatória de n números, o tamanho esperado da LIS é cerca de 2√n — um resultado profundo ligado às matrizes aleatórias (problema de Ulam).',
    ],
    code: {
      python: String.raw`
        from bisect import bisect_left

        def lis(a):  # O(n log n): método da paciência com reconstrução
            caudas, idx_caudas = [], []   # menor final para cada tamanho, e seu índice em a
            anterior = [-1] * len(a)
            for i, x in enumerate(a):
                k = bisect_left(caudas, x)              # busca binária
                if k == len(caudas):
                    caudas.append(x); idx_caudas.append(i)
                else:
                    caudas[k], idx_caudas[k] = x, i
                anterior[i] = idx_caudas[k - 1] if k > 0 else -1
            seq, i = [], idx_caudas[-1]
            while i != -1:                              # reconstrói do fim
                seq.append(a[i])
                i = anterior[i]
            return seq[::-1]

        print(lis([10, 9, 2, 5, 3, 7, 101, 18, 4, 19]))   # [2, 3, 7, 18, 19]
      `,
      javascript: String.raw`
        function lis(a) { // O(n log n): método da paciência com reconstrução
          const caudas = [], idxCaudas = [], anterior = Array(a.length).fill(-1);
          a.forEach((x, i) => {
            let lo = 0, hi = caudas.length; // busca binária: primeira cauda >= x
            while (lo < hi) { const m = (lo + hi) >> 1; if (caudas[m] < x) lo = m + 1; else hi = m; }
            caudas[lo] = x;
            idxCaudas[lo] = i;
            anterior[i] = lo > 0 ? idxCaudas[lo - 1] : -1;
          });
          const seq = [];
          for (let i = idxCaudas[caudas.length - 1]; i !== -1; i = anterior[i]) seq.unshift(a[i]); // reconstrói
          return seq;
        }

        console.log(lis([10, 9, 2, 5, 3, 7, 101, 18, 4, 19]).join(" ")); // 2 3 7 18 19
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;

        public class LIS {
            static List<Integer> lis(int[] a) { // O(n log n): método da paciência com reconstrução
                int[] caudas = new int[a.length], idxCaudas = new int[a.length], anterior = new int[a.length];
                int tamanho = 0;
                for (int i = 0; i < a.length; i++) {
                    int k = Arrays.binarySearch(caudas, 0, tamanho, a[i]); // busca binária
                    if (k < 0) k = -k - 1;                                  // posição de inserção
                    caudas[k] = a[i];
                    idxCaudas[k] = i;
                    anterior[i] = k > 0 ? idxCaudas[k - 1] : -1;
                    if (k == tamanho) tamanho++;
                }
                List<Integer> seq = new ArrayList<>();
                for (int i = idxCaudas[tamanho - 1]; i != -1; i = anterior[i]) seq.add(0, a[i]); // reconstrói
                return seq;
            }

            public static void main(String[] args) {
                System.out.println(lis(new int[]{10, 9, 2, 5, 3, 7, 101, 18, 4, 19})); // [2, 3, 7, 18, 19]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cstdio>
        #include <vector>
        using namespace std;

        vector<int> lis(const vector<int>& a) { // O(n log n): método da paciência com reconstrução
            vector<int> caudas, idxCaudas, anterior(a.size(), -1);
            for (int i = 0; i < (int)a.size(); i++) {
                int k = lower_bound(caudas.begin(), caudas.end(), a[i]) - caudas.begin(); // busca binária
                if (k == (int)caudas.size()) { caudas.push_back(a[i]); idxCaudas.push_back(i); }
                else { caudas[k] = a[i]; idxCaudas[k] = i; }
                anterior[i] = k > 0 ? idxCaudas[k - 1] : -1;
            }
            vector<int> seq;
            for (int i = idxCaudas.back(); i != -1; i = anterior[i]) seq.push_back(a[i]); // reconstrói
            reverse(seq.begin(), seq.end());
            return seq;
        }

        int main() {
            for (int x : lis({10, 9, 2, 5, 3, 7, 101, 18, 4, 19})) printf("%d ", x); // 2 3 7 18 19
            printf("\n");
        }
      `,
    },
  },
  {
    id: 'matrix-chain',
    name: 'Multiplicação de Cadeia de Matrizes',
    difficulty: 'Avançado',
    en: { name: 'Matrix Chain Multiplication', summary: 'Chooses where to put the parentheses in a product of matrices to minimize the number of scalar multiplications.' },
    facts: { 'Técnica': 'Programação dinâmica por intervalos', 'Recorrência': 'dp[i][j] = min(dp[i][k] + dp[k+1][j] + dᵢ₋₁·dₖ·dⱼ)', 'Custo': 'O(n³)', 'Algoritmo mais rápido': 'Hu e Shing, O(n log n) (1981)' },
    summary: 'Escolhe onde colocar os parênteses em um produto de matrizes para minimizar o número de multiplicações escalares.',
    description:
      'A multiplicação de matrizes é associativa: (A·B)·C dá o mesmo resultado que A·(B·C). Mas o custo pode ser muito diferente. Multiplicar uma matriz p × q por uma q × r custa p·q·r multiplicações escalares; com A de 10 × 100, B de 100 × 5 e C de 5 × 50, (A·B)·C custa 7.500 e A·(B·C), 75.000 — dez vezes mais. Com n matrizes, o número de formas de colocar parênteses é o número de Catalan, que cresce exponencialmente. A programação dinâmica resolve por intervalos: dp[i][j] é o menor custo para multiplicar Aᵢ…Aⱼ, e testa cada ponto de divisão k: dp[i][k] + dp[k + 1][j] + o custo de multiplicar os dois resultados. A tabela é preenchida por diagonais, das cadeias curtas para as longas.',
    complexity: { best: 'O(n³)', average: 'O(n³)', worst: 'O(n³)', space: 'O(n²)' },
    steps: [
      'Represente as dimensões em um vetor d: a matriz Aᵢ é d[i − 1] × d[i].',
      'dp[i][i] = 0 (uma matriz sozinha não custa nada).',
      'Para cadeias de tamanho 2, 3, …, n: dp[i][j] = min sobre k de dp[i][k] + dp[k + 1][j] + d[i − 1]·d[k]·d[j].',
      'Guarde o k que deu o mínimo em cada intervalo.',
      'Reconstrua os parênteses recursivamente a partir dos pontos de divisão guardados.',
    ],
    usedIn: ['Otimizadores de bibliotecas de álgebra linear e de redes neurais (einsum)', 'Otimização de consultas em bancos de dados (ordem de junções)', 'Compiladores (ordem de avaliação de expressões)', 'Computação gráfica (composição de transformações)', 'Ensino de PD por intervalos'],
    realWorld: [
      { title: 'NumPy e einsum', text: 'A função numpy.einsum_path (e bibliotecas como opt_einsum) escolhe a ordem das contrações de tensores para minimizar o custo — uma generalização da cadeia de matrizes que pode acelerar cálculos em ordens de grandeza.' },
      { title: 'Bancos de dados', text: 'Otimizadores de consultas SQL escolhem a ordem em que fazem as junções de várias tabelas com um algoritmo de PD muito parecido (o do System R, da IBM, de 1979).' },
      { title: 'Redes neurais', text: 'Ao calcular gradientes (retropropagação), a ordem de multiplicação das matrizes jacobianas decide o custo — é por isso que o modo reverso da diferenciação automática é o padrão em aprendizado de máquina.' },
    ],
    curiosities: [
      'O número de formas de colocar parênteses em n matrizes é o número de Catalan Cₙ₋₁: com 10 matrizes já são 4.862.',
      'T. C. Hu e M. T. Shing mostraram em 1981 um algoritmo O(n log n) para o problema, baseado em triangulações de polígonos — mas ele é tão complicado que quase ninguém o implementa.',
      'O mesmo esquema de "PD por intervalos" resolve a árvore binária de busca ótima, o algoritmo CYK de análise sintática e o problema de triangulação de polígonos.',
    ],
    code: {
      python: String.raw`
        def cadeia(d):                         # a matriz Ai tem dimensões d[i-1] x d[i]
            n = len(d) - 1
            dp = [[0] * n for _ in range(n)]
            corte = [[0] * n for _ in range(n)]
            for tamanho in range(2, n + 1):     # cadeias curtas antes das longas
                for i in range(n - tamanho + 1):
                    j = i + tamanho - 1
                    dp[i][j] = float("inf")
                    for k in range(i, j):
                        custo = dp[i][k] + dp[k + 1][j] + d[i] * d[k + 1] * d[j + 1]
                        if custo < dp[i][j]:
                            dp[i][j], corte[i][j] = custo, k
            def parenteses(i, j):
                if i == j:
                    return f"A{i + 1}"
                k = corte[i][j]
                return f"({parenteses(i, k)}·{parenteses(k + 1, j)})"
            return dp[0][n - 1], parenteses(0, n - 1)

        print(cadeia([40, 20, 30, 10, 30]))   # (26000, '((A1·(A2·A3))·A4)')
        print(cadeia([10, 100, 5, 50]))       # (7500, '((A1·A2)·A3)')
      `,
      javascript: String.raw`
        function cadeia(d) { // a matriz Ai tem dimensões d[i-1] x d[i]
          const n = d.length - 1;
          const dp = Array.from({ length: n }, () => Array(n).fill(0));
          const corte = Array.from({ length: n }, () => Array(n).fill(0));
          for (let tamanho = 2; tamanho <= n; tamanho++) { // cadeias curtas antes das longas
            for (let i = 0; i + tamanho - 1 < n; i++) {
              const j = i + tamanho - 1;
              dp[i][j] = Infinity;
              for (let k = i; k < j; k++) {
                const custo = dp[i][k] + dp[k + 1][j] + d[i] * d[k + 1] * d[j + 1];
                if (custo < dp[i][j]) { dp[i][j] = custo; corte[i][j] = k; }
              }
            }
          }
          const parenteses = (i, j) => (i === j ? "A" + (i + 1) : "(" + parenteses(i, corte[i][j]) + "·" + parenteses(corte[i][j] + 1, j) + ")");
          return dp[0][n - 1] + " " + parenteses(0, n - 1);
        }

        console.log(cadeia([40, 20, 30, 10, 30])); // 26000 ((A1·(A2·A3))·A4)
        console.log(cadeia([10, 100, 5, 50]));     // 7500 ((A1·A2)·A3)
      `,
      java: String.raw`
        public class CadeiaMatrizes {
            static int[][] corte;

            static String parenteses(int i, int j) {
                if (i == j) return "A" + (i + 1);
                return "(" + parenteses(i, corte[i][j]) + "·" + parenteses(corte[i][j] + 1, j) + ")";
            }

            static String cadeia(int[] d) { // a matriz Ai tem dimensões d[i-1] x d[i]
                int n = d.length - 1;
                long[][] dp = new long[n][n];
                corte = new int[n][n];
                for (int tamanho = 2; tamanho <= n; tamanho++) // cadeias curtas antes das longas
                    for (int i = 0; i + tamanho - 1 < n; i++) {
                        int j = i + tamanho - 1;
                        dp[i][j] = Long.MAX_VALUE;
                        for (int k = i; k < j; k++) {
                            long custo = dp[i][k] + dp[k + 1][j] + (long) d[i] * d[k + 1] * d[j + 1];
                            if (custo < dp[i][j]) { dp[i][j] = custo; corte[i][j] = k; }
                        }
                    }
                return dp[0][n - 1] + " " + parenteses(0, n - 1);
            }

            public static void main(String[] args) {
                System.out.println(cadeia(new int[]{40, 20, 30, 10, 30})); // 26000 ((A1·(A2·A3))·A4)
                System.out.println(cadeia(new int[]{10, 100, 5, 50}));     // 7500 ((A1·A2)·A3)
            }
        }
      `,
      cpp: String.raw`
        #include <climits>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<vector<int>> corte;

        string parenteses(int i, int j) {
            if (i == j) return "A" + to_string(i + 1);
            return "(" + parenteses(i, corte[i][j]) + "·" + parenteses(corte[i][j] + 1, j) + ")";
        }

        string cadeia(const vector<long long>& d) { // a matriz Ai tem dimensões d[i-1] x d[i]
            int n = d.size() - 1;
            vector<vector<long long>> dp(n, vector<long long>(n, 0));
            corte.assign(n, vector<int>(n, 0));
            for (int tamanho = 2; tamanho <= n; tamanho++) // cadeias curtas antes das longas
                for (int i = 0; i + tamanho - 1 < n; i++) {
                    int j = i + tamanho - 1;
                    dp[i][j] = LLONG_MAX;
                    for (int k = i; k < j; k++) {
                        long long custo = dp[i][k] + dp[k + 1][j] + d[i] * d[k + 1] * d[j + 1];
                        if (custo < dp[i][j]) { dp[i][j] = custo; corte[i][j] = k; }
                    }
                }
            return to_string(dp[0][n - 1]) + " " + parenteses(0, n - 1);
        }

        int main() {
            cout << cadeia({40, 20, 30, 10, 30}) << "\n"; // 26000 ((A1·(A2·A3))·A4)
            cout << cadeia({10, 100, 5, 50}) << "\n";     // 7500 ((A1·A2)·A3)
        }
      `,
    },
  },
  {
    id: 'n-queens',
    name: 'Problema das N-Rainhas',
    difficulty: 'Intermediário',
    en: { name: 'N-Queens Problem', summary: 'Places N queens on an N×N board so none attack each other — the textbook example of backtracking.' },
    facts: { 'Proposto por': 'Max Bezzel (1848), para 8 rainhas', 'Técnica': 'Backtracking (busca com retrocesso)', 'Soluções para N = 8': '92 (12 distintas por simetria)', 'Custo': 'Exponencial no pior caso; poda reduz muito' },
    summary: 'Coloca N rainhas em um tabuleiro N × N sem que nenhuma ataque outra — o exemplo clássico de backtracking.',
    description:
      'Uma rainha no xadrez ataca qualquer peça na mesma linha, coluna ou diagonal. O problema das N-rainhas pede para colocar N rainhas em um tabuleiro N × N sem nenhum ataque. Testar todas as posições é inviável (para N = 8, são mais de 4 bilhões de formas de escolher 8 casas). O backtracking constrói a solução aos poucos: coloca uma rainha por linha, testando as colunas em ordem; se a casa estiver atacada, passa para a próxima coluna; se nenhuma coluna da linha funcionar, volta (retrocede) para a linha anterior e move aquela rainha. Cada ramo é abandonado assim que se mostra impossível — a poda faz o algoritmo examinar só uma fração minúscula das possibilidades. Guardar as colunas e as duas diagonais ocupadas em conjuntos permite testar cada casa em O(1).',
    complexity: { best: 'O(N) (sorte na primeira tentativa)', average: 'Exponencial, mas com poda forte', worst: 'O(N!)', space: 'O(N)' },
    steps: [
      'Coloque as rainhas uma por linha, começando pela primeira.',
      'Na linha atual, teste as colunas da esquerda para a direita.',
      'Uma casa é segura se sua coluna e suas duas diagonais (linha − coluna e linha + coluna) não tiverem rainha.',
      'Se encontrar uma casa segura, coloque a rainha e avance para a próxima linha.',
      'Se nenhuma coluna servir, retroceda: remova a rainha da linha anterior e tente a próxima coluna dela. Ao preencher todas as linhas, há uma solução.',
    ],
    usedIn: ['Ensino de backtracking e recursão', 'Testes de desempenho de resolvedores de restrições (CSP/SAT)', 'Problemas de alocação sem conflitos', 'Projeto de testes e de experimentos (quadrados latinos)', 'Paralelismo (contagem de soluções para N grande)'],
    realWorld: [
      { title: 'Resolvedores de restrições', text: 'O mesmo esquema — escolher uma variável, tentar valores, propagar restrições e retroceder — é a base de resolvedores de restrições usados em escalas de trabalho, grades horárias e configuração de produtos.' },
      { title: 'Alocação sem conflitos', text: 'Posicionar antenas, sensores ou tarefas de forma que não interfiram entre si tem a mesma estrutura: cada escolha restringe as próximas, e becos sem saída exigem voltar atrás.' },
      { title: 'Recordes de computação', text: 'O número de soluções só é conhecido até N = 27 (cerca de 2,34 × 10¹⁷), calculado em 2016 com hardware especializado (FPGAs) por um ano.' },
    ],
    curiosities: [
      'O problema das 8 rainhas foi proposto pelo enxadrista Max Bezzel em 1848; Gauss se interessou por ele, e as 92 soluções foram publicadas em 1850 por Franz Nauck.',
      'Dijkstra usou o problema em 1972 para ilustrar a programação estruturada e o backtracking.',
      'Existe solução para todo N exceto 2 e 3 — e há fórmulas que constroem uma diretamente, sem busca alguma.',
    ],
    code: {
      python: String.raw`
        def n_rainhas(n):
            solucoes, colunas = [], []
            cols, diag1, diag2 = set(), set(), set()     # ocupações, para testar em O(1)
            def colocar(linha):
                if linha == n:
                    solucoes.append(list(colunas))
                    return
                for c in range(n):
                    if c in cols or linha - c in diag1 or linha + c in diag2:
                        continue                         # casa atacada: poda
                    cols.add(c); diag1.add(linha - c); diag2.add(linha + c); colunas.append(c)
                    colocar(linha + 1)
                    cols.remove(c); diag1.remove(linha - c); diag2.remove(linha + c); colunas.pop()  # retrocede
            colocar(0)
            return solucoes

        solucoes = n_rainhas(8)
        print(len(solucoes))                 # 92
        for c in solucoes[0]:
            print("".join("Q" if i == c else "." for i in range(8)))
        # Q....... (primeira solução)
        # ....Q...
        # .......Q
        # .....Q..
        # ..Q.....
        # ......Q.
        # .Q......
        # ...Q....
      `,
      javascript: String.raw`
        function nRainhas(n) {
          const solucoes = [], colunas = [];
          const cols = new Set(), diag1 = new Set(), diag2 = new Set(); // ocupações, para testar em O(1)
          function colocar(linha) {
            if (linha === n) { solucoes.push([...colunas]); return; }
            for (let c = 0; c < n; c++) {
              if (cols.has(c) || diag1.has(linha - c) || diag2.has(linha + c)) continue; // casa atacada: poda
              cols.add(c); diag1.add(linha - c); diag2.add(linha + c); colunas.push(c);
              colocar(linha + 1);
              cols.delete(c); diag1.delete(linha - c); diag2.delete(linha + c); colunas.pop(); // retrocede
            }
          }
          colocar(0);
          return solucoes;
        }

        const solucoes = nRainhas(8);
        console.log(solucoes.length); // 92
        for (const c of solucoes[0]) console.log(Array.from({ length: 8 }, (_, i) => (i === c ? "Q" : ".")).join(""));
        // Q....... (primeira solução)
        // ....Q...
        // .......Q
        // .....Q..
        // ..Q.....
        // ......Q.
        // .Q......
        // ...Q....
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class NRainhas {
            static int n;
            static boolean[] cols, diag1, diag2; // ocupações, para testar em O(1)
            static int[] colunas;
            static List<int[]> solucoes = new ArrayList<>();

            static void colocar(int linha) {
                if (linha == n) { solucoes.add(colunas.clone()); return; }
                for (int c = 0; c < n; c++) {
                    if (cols[c] || diag1[linha - c + n] || diag2[linha + c]) continue; // casa atacada: poda
                    cols[c] = diag1[linha - c + n] = diag2[linha + c] = true;
                    colunas[linha] = c;
                    colocar(linha + 1);
                    cols[c] = diag1[linha - c + n] = diag2[linha + c] = false; // retrocede
                }
            }

            public static void main(String[] args) {
                n = 8;
                cols = new boolean[n]; diag1 = new boolean[2 * n]; diag2 = new boolean[2 * n]; colunas = new int[n];
                colocar(0);
                System.out.println(solucoes.size()); // 92
                for (int c : solucoes.get(0)) {
                    StringBuilder linha = new StringBuilder();
                    for (int i = 0; i < n; i++) linha.append(i == c ? 'Q' : '.');
                    System.out.println(linha);
                }
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <vector>
        using namespace std;

        int n;
        vector<bool> cols, diag1, diag2; // ocupações, para testar em O(1)
        vector<int> colunas;
        vector<vector<int>> solucoes;

        void colocar(int linha) {
            if (linha == n) { solucoes.push_back(colunas); return; }
            for (int c = 0; c < n; c++) {
                if (cols[c] || diag1[linha - c + n] || diag2[linha + c]) continue; // casa atacada: poda
                cols[c] = diag1[linha - c + n] = diag2[linha + c] = true;
                colunas[linha] = c;
                colocar(linha + 1);
                cols[c] = diag1[linha - c + n] = diag2[linha + c] = false; // retrocede
            }
        }

        int main() {
            n = 8;
            cols.assign(n, false); diag1.assign(2 * n, false); diag2.assign(2 * n, false); colunas.assign(n, 0);
            colocar(0);
            printf("%zu\n", solucoes.size()); // 92
            for (int c : solucoes[0]) {
                for (int i = 0; i < n; i++) putchar(i == c ? 'Q' : '.');
                putchar('\n');
            }
        }
      `,
    },
  },
  {
    id: 'sudoku',
    name: 'Resolvedor de Sudoku (Backtracking)',
    difficulty: 'Intermediário',
    en: { name: 'Sudoku Solver (Backtracking)', summary: 'Fills a Sudoku by trying digits and undoing wrong guesses, picking first the cell with the fewest candidates.' },
    facts: { 'Técnica': 'Backtracking com heurística MRV', 'Heurística': 'Menos candidatos primeiro (MRV)', 'Complexidade do problema': 'NP-completo (Sudoku n² × n²)', 'Alternativa': 'Dancing Links (Knuth) para cobertura exata' },
    summary: 'Preenche um Sudoku testando dígitos e desfazendo palpites errados, escolhendo primeiro a célula com menos candidatos.',
    description:
      'Um Sudoku é um problema de satisfação de restrições: cada linha, coluna e bloco 3 × 3 precisa conter os dígitos de 1 a 9 sem repetição. O backtracking escolhe uma célula vazia, tenta um dígito permitido e continua recursivamente; se em algum momento uma célula fica sem nenhum candidato, o algoritmo desfaz a última escolha e tenta o próximo dígito. A ordem das escolhas faz uma diferença enorme. A heurística MRV (minimum remaining values) escolhe sempre a célula com menos candidatos: células com um único candidato são preenchidas sem chute, e os chutes acontecem onde há menos opções, o que encolhe drasticamente a árvore de busca. Com ela, Sudokus de jornal são resolvidos em milissegundos.',
    complexity: { best: 'O(81) (só células forçadas)', average: 'Rápido na prática com MRV', worst: 'Exponencial (9^vazias)', space: 'O(81)' },
    steps: [
      'Encontre a célula vazia com menos dígitos permitidos (sem repetir na linha, coluna e bloco).',
      'Se alguma célula vazia não tem candidatos, este caminho falhou: retroceda.',
      'Se não há células vazias, o Sudoku está resolvido.',
      'Tente cada candidato da célula escolhida, chamando o algoritmo recursivamente.',
      'Se nenhum candidato levar a uma solução, apague a célula e retroceda.',
    ],
    usedIn: ['Resolvedores e geradores de Sudoku', 'Resolvedores de restrições (CSP) e de satisfatibilidade (SAT)', 'Grades horárias e escalas', 'Ensino de busca com retrocesso e heurísticas', 'Verificação de unicidade da solução em quebra-cabeças'],
    realWorld: [
      { title: 'Gerar quebra-cabeças', text: 'Para criar um Sudoku com solução única, geradores apagam números de uma grade completa e usam um resolvedor para verificar, a cada remoção, se ainda existe exatamente uma solução.' },
      { title: 'Grades horárias', text: 'Montar horários escolares — sem professor em duas salas ao mesmo tempo, sem turma com duas aulas no mesmo horário — usa as mesmas ideias: restrições, escolher a variável mais restrita e retroceder.' },
      { title: 'Dancing Links', text: 'Donald Knuth mostrou que o Sudoku é um caso de "cobertura exata" e o resolveu com o Algoritmo X e a técnica Dancing Links, que torna o desfazer de cada escolha extremamente barato.' },
    ],
    curiosities: [
      'Um Sudoku válido precisa de pelo menos 17 números dados para ter solução única — isso foi provado em 2012 por uma busca computacional que levou cerca de 7 milhões de horas de CPU.',
      'Existem 6.670.903.752.021.072.936.960 grades de Sudoku completas, ou cerca de 5,5 bilhões essencialmente diferentes.',
      'A versão generalizada (n² × n²) é NP-completa, o que significa que o Sudoku "grande" é tão difícil quanto qualquer problema de NP.',
    ],
    code: {
      python: String.raw`
        def candidatos(g, i):
            r, c = divmod(i, 9)
            br, bc = r - r % 3, c - c % 3
            usados = {g[r * 9 + k] for k in range(9)} | {g[k * 9 + c] for k in range(9)}
            usados |= {g[(br + k // 3) * 9 + bc + k % 3] for k in range(9)}
            return [d for d in range(1, 10) if d not in usados]

        def resolver(g):
            vazias = [i for i in range(81) if g[i] == 0]
            if not vazias:
                return True
            i = min(vazias, key=lambda v: len(candidatos(g, v)))   # MRV: menos candidatos primeiro
            for d in candidatos(g, i):
                g[i] = d
                if resolver(g):
                    return True
            g[i] = 0                                                # retrocede
            return False

        grade = [int(ch) for ch in "000000907000420180000705026100904000050000040000507009920108000034059000507000000"]
        resolver(grade)
        for r in range(9):
            print("".join(map(str, grade[r * 9:r * 9 + 9])))
        # 462831957
        # 795426183
        # 381795426
        # 173984265
        # 659312748
        # 248567319
        # 926178534
        # 834259671
        # 517643892
      `,
      javascript: String.raw`
        function candidatos(g, i) {
          const r = Math.floor(i / 9), c = i % 9, br = r - (r % 3), bc = c - (c % 3), usados = new Set();
          for (let k = 0; k < 9; k++) {
            usados.add(g[r * 9 + k]).add(g[k * 9 + c]).add(g[(br + Math.floor(k / 3)) * 9 + bc + (k % 3)]);
          }
          return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !usados.has(d));
        }

        function resolver(g) {
          let melhor = -1, opcoes = null;
          for (let i = 0; i < 81; i++) { // MRV: célula vazia com menos candidatos
            if (g[i]) continue;
            const c = candidatos(g, i);
            if (!opcoes || c.length < opcoes.length) { melhor = i; opcoes = c; }
          }
          if (melhor < 0) return true;
          for (const d of opcoes) {
            g[melhor] = d;
            if (resolver(g)) return true;
          }
          g[melhor] = 0; // retrocede
          return false;
        }

        const grade = [..."000000907000420180000705026100904000050000040000507009920108000034059000507000000"].map(Number);
        resolver(grade);
        for (let r = 0; r < 9; r++) console.log(grade.slice(r * 9, r * 9 + 9).join(""));
        // 462831957
        // 795426183
        // 381795426
        // 173984265
        // 659312748
        // 248567319
        // 926178534
        // 834259671
        // 517643892
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class Sudoku {
            static List<Integer> candidatos(int[] g, int i) {
                int r = i / 9, c = i % 9, br = r - r % 3, bc = c - c % 3;
                boolean[] usado = new boolean[10];
                for (int k = 0; k < 9; k++) {
                    usado[g[r * 9 + k]] = true;
                    usado[g[k * 9 + c]] = true;
                    usado[g[(br + k / 3) * 9 + bc + k % 3]] = true;
                }
                List<Integer> lista = new ArrayList<>();
                for (int d = 1; d <= 9; d++) if (!usado[d]) lista.add(d);
                return lista;
            }

            static boolean resolver(int[] g) {
                int melhor = -1;
                List<Integer> opcoes = null;
                for (int i = 0; i < 81; i++) { // MRV: célula vazia com menos candidatos
                    if (g[i] != 0) continue;
                    List<Integer> c = candidatos(g, i);
                    if (opcoes == null || c.size() < opcoes.size()) { melhor = i; opcoes = c; }
                }
                if (melhor < 0) return true;
                for (int d : opcoes) {
                    g[melhor] = d;
                    if (resolver(g)) return true;
                }
                g[melhor] = 0; // retrocede
                return false;
            }

            public static void main(String[] args) {
                String texto = "000000907000420180000705026100904000050000040000507009920108000034059000507000000";
                int[] grade = new int[81];
                for (int i = 0; i < 81; i++) grade[i] = texto.charAt(i) - '0';
                resolver(grade);
                for (int r = 0; r < 9; r++) {
                    StringBuilder linha = new StringBuilder();
                    for (int c = 0; c < 9; c++) linha.append(grade[r * 9 + c]);
                    System.out.println(linha);
                }
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> candidatos(const vector<int>& g, int i) {
            int r = i / 9, c = i % 9, br = r - r % 3, bc = c - c % 3;
            bool usado[10] = {false};
            for (int k = 0; k < 9; k++) {
                usado[g[r * 9 + k]] = true;
                usado[g[k * 9 + c]] = true;
                usado[g[(br + k / 3) * 9 + bc + k % 3]] = true;
            }
            vector<int> lista;
            for (int d = 1; d <= 9; d++) if (!usado[d]) lista.push_back(d);
            return lista;
        }

        bool resolver(vector<int>& g) {
            int melhor = -1;
            vector<int> opcoes;
            for (int i = 0; i < 81; i++) { // MRV: célula vazia com menos candidatos
                if (g[i]) continue;
                vector<int> c = candidatos(g, i);
                if (melhor < 0 || c.size() < opcoes.size()) { melhor = i; opcoes = c; }
            }
            if (melhor < 0) return true;
            for (int d : opcoes) {
                g[melhor] = d;
                if (resolver(g)) return true;
            }
            g[melhor] = 0; // retrocede
            return false;
        }

        int main() {
            string texto = "000000907000420180000705026100904000050000040000507009920108000034059000507000000";
            vector<int> grade(81);
            for (int i = 0; i < 81; i++) grade[i] = texto[i] - '0';
            resolver(grade);
            for (int r = 0; r < 9; r++) {
                for (int c = 0; c < 9; c++) printf("%d", grade[r * 9 + c]);
                printf("\n");
            }
        }
      `,
    },
  },
]
