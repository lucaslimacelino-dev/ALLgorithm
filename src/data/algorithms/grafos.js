export default [
  {
    id: 'topological-sort',
    name: 'Ordenação Topológica',
    difficulty: 'Intermediário',
    facts: { 'Algoritmo mostrado': 'Kahn', 'Ano': '1962', 'Requer': 'Grafo dirigido acíclico (DAG)' },
    summary: 'Coloca tarefas em uma ordem que respeita todas as dependências.',
    description:
      'A Ordenação Topológica organiza os vértices de um grafo dirigido sem ciclos de modo que toda aresta u → v apareça com u antes de v — como montar a grade de disciplinas respeitando os pré-requisitos. O algoritmo de Kahn conta quantas dependências cada vértice tem (grau de entrada), começa pelos que não dependem de ninguém e, a cada vértice processado, "libera" os que dependiam dele. Se sobrarem vértices, o grafo tem um ciclo e nenhuma ordem é possível.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    steps: [
      'Calcule o grau de entrada de cada vértice (quantas arestas chegam nele).',
      'Coloque numa fila todos os vértices com grau 0 — os que não dependem de ninguém.',
      'Retire um vértice da fila e acrescente-o à ordem final.',
      'Para cada aresta que sai dele, diminua o grau do destino; se chegar a 0, coloque o destino na fila.',
      'Ao esvaziar a fila, se nem todos os vértices entraram na ordem, existe um ciclo.',
    ],
    usedIn: ['Sistemas de build (Make, Bazel, Gradle)', 'Gerenciadores de pacotes (npm, apt, pip)', 'Planilhas (ordem de recálculo)', 'Agendamento de tarefas e pipelines de dados', 'Grades curriculares e pré-requisitos'],
    realWorld: [
      { title: 'Instalar dependências', text: 'Ao instalar um pacote, gerenciadores como npm e apt ordenam topologicamente as dependências para instalar cada biblioteca antes das que precisam dela — e acusam erro se houver dependência circular.' },
      { title: 'Planilhas', text: 'Quando você muda uma célula, a planilha recalcula as fórmulas que dependem dela em ordem topológica, garantindo que cada fórmula use valores já atualizados.' },
      { title: 'Pipelines de dados', text: 'Ferramentas como Apache Airflow representam cada fluxo de trabalho como um DAG de tarefas e as executam em ordem topológica, rodando em paralelo as que são independentes.' },
    ],
    curiosities: [
      'O algoritmo de Kahn foi publicado por Arthur B. Kahn em 1962. Outra abordagem clássica usa busca em profundidade: a ordem inversa de término da DFS também é uma ordem topológica.',
      'Um grafo pode ter muitas ordens topológicas válidas; no exemplo, "Cálculo I" poderia vir antes de "Lógica" sem quebrar nenhuma regra.',
      'O nome vem da topologia: a ordenação respeita a "forma" do grafo, isto é, suas relações de dependência.',
    ],
    code: {
      python: String.raw`
        from collections import deque

        def ordem_topologica(vertices, arestas):
            grau = {v: 0 for v in vertices}
            saidas = {v: [] for v in vertices}
            for u, v in arestas:
                saidas[u].append(v)
                grau[v] += 1
            fila = deque(v for v in vertices if grau[v] == 0)  # sem dependências
            ordem = []
            while fila:
                u = fila.popleft()
                ordem.append(u)
                for v in saidas[u]:
                    grau[v] -= 1
                    if grau[v] == 0:  # todas as dependências de v já foram feitas
                        fila.append(v)
            if len(ordem) != len(vertices):
                raise ValueError("há um ciclo: não existe ordem topológica")
            return ordem

        materias = ["Lógica", "Cálculo I", "Prog. I", "Cálculo II", "Estr. Dados", "Estatística", "Algoritmos"]
        requisitos = [("Lógica", "Prog. I"), ("Lógica", "Estr. Dados"), ("Prog. I", "Estr. Dados"),
                      ("Cálculo I", "Cálculo II"), ("Cálculo II", "Estatística"),
                      ("Estr. Dados", "Algoritmos"), ("Cálculo II", "Algoritmos")]
        print(" → ".join(ordem_topologica(materias, requisitos)))
        # Lógica → Cálculo I → Prog. I → Cálculo II → Estr. Dados → Estatística → Algoritmos
      `,
      javascript: String.raw`
        function ordemTopologica(vertices, arestas) {
          const grau = new Map(vertices.map(v => [v, 0]));
          const saidas = new Map(vertices.map(v => [v, []]));
          for (const [u, v] of arestas) {
            saidas.get(u).push(v);
            grau.set(v, grau.get(v) + 1);
          }
          const fila = vertices.filter(v => grau.get(v) === 0); // sem dependências
          const ordem = [];
          while (fila.length) {
            const u = fila.shift();
            ordem.push(u);
            for (const v of saidas.get(u)) {
              grau.set(v, grau.get(v) - 1);
              if (grau.get(v) === 0) fila.push(v); // todas as dependências de v já foram feitas
            }
          }
          if (ordem.length !== vertices.length) throw new Error("há um ciclo: não existe ordem topológica");
          return ordem;
        }

        const materias = ["Lógica", "Cálculo I", "Prog. I", "Cálculo II", "Estr. Dados", "Estatística", "Algoritmos"];
        const requisitos = [["Lógica", "Prog. I"], ["Lógica", "Estr. Dados"], ["Prog. I", "Estr. Dados"],
          ["Cálculo I", "Cálculo II"], ["Cálculo II", "Estatística"],
          ["Estr. Dados", "Algoritmos"], ["Cálculo II", "Algoritmos"]];
        console.log(ordemTopologica(materias, requisitos).join(" → "));
        // Lógica → Cálculo I → Prog. I → Cálculo II → Estr. Dados → Estatística → Algoritmos
      `,
      java: String.raw`
        import java.util.*;

        public class OrdemTopologica {
            static List<String> ordemTopologica(List<String> vertices, String[][] arestas) {
                Map<String, Integer> grau = new HashMap<>();
                Map<String, List<String>> saidas = new HashMap<>();
                for (String v : vertices) { grau.put(v, 0); saidas.put(v, new ArrayList<>()); }
                for (String[] a : arestas) {
                    saidas.get(a[0]).add(a[1]);
                    grau.merge(a[1], 1, Integer::sum);
                }
                Deque<String> fila = new ArrayDeque<>();
                for (String v : vertices) if (grau.get(v) == 0) fila.add(v); // sem dependências
                List<String> ordem = new ArrayList<>();
                while (!fila.isEmpty()) {
                    String u = fila.poll();
                    ordem.add(u);
                    for (String v : saidas.get(u)) {
                        grau.merge(v, -1, Integer::sum);
                        if (grau.get(v) == 0) fila.add(v); // todas as dependências de v já foram feitas
                    }
                }
                if (ordem.size() != vertices.size()) throw new IllegalStateException("há um ciclo: não existe ordem topológica");
                return ordem;
            }

            public static void main(String[] args) {
                List<String> materias = List.of("Lógica", "Cálculo I", "Prog. I", "Cálculo II", "Estr. Dados", "Estatística", "Algoritmos");
                String[][] requisitos = {{"Lógica", "Prog. I"}, {"Lógica", "Estr. Dados"}, {"Prog. I", "Estr. Dados"},
                    {"Cálculo I", "Cálculo II"}, {"Cálculo II", "Estatística"},
                    {"Estr. Dados", "Algoritmos"}, {"Cálculo II", "Algoritmos"}};
                System.out.println(String.join(" → ", ordemTopologica(materias, requisitos)));
                // Lógica → Cálculo I → Prog. I → Cálculo II → Estr. Dados → Estatística → Algoritmos
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <map>
        #include <queue>
        #include <stdexcept>
        #include <string>
        #include <vector>
        using namespace std;

        vector<string> ordemTopologica(const vector<string>& vertices, const vector<pair<string, string>>& arestas) {
            map<string, int> grau;
            map<string, vector<string>> saidas;
            for (const auto& v : vertices) grau[v] = 0;
            for (const auto& [u, v] : arestas) {
                saidas[u].push_back(v);
                grau[v]++;
            }
            queue<string> fila;
            for (const auto& v : vertices) if (grau[v] == 0) fila.push(v); // sem dependências
            vector<string> ordem;
            while (!fila.empty()) {
                string u = fila.front();
                fila.pop();
                ordem.push_back(u);
                for (const auto& v : saidas[u])
                    if (--grau[v] == 0) fila.push(v); // todas as dependências de v já foram feitas
            }
            if (ordem.size() != vertices.size()) throw runtime_error("há um ciclo: não existe ordem topológica");
            return ordem;
        }

        int main() {
            vector<string> materias = {"Lógica", "Cálculo I", "Prog. I", "Cálculo II", "Estr. Dados", "Estatística", "Algoritmos"};
            vector<pair<string, string>> requisitos = {{"Lógica", "Prog. I"}, {"Lógica", "Estr. Dados"}, {"Prog. I", "Estr. Dados"},
                {"Cálculo I", "Cálculo II"}, {"Cálculo II", "Estatística"}, {"Estr. Dados", "Algoritmos"}, {"Cálculo II", "Algoritmos"}};
            auto ordem = ordemTopologica(materias, requisitos);
            for (size_t i = 0; i < ordem.size(); i++) cout << (i ? " → " : "") << ordem[i];
            // Lógica → Cálculo I → Prog. I → Cálculo II → Estr. Dados → Estatística → Algoritmos
        }
      `,
    },
  },
  {
    id: 'dijkstra',
    name: 'Algoritmo de Dijkstra',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Edsger W. Dijkstra', 'Ano': '1956 (publicado em 1959)', 'Restrição': 'Pesos não negativos' },
    summary: 'Encontra os caminhos mais curtos a partir de uma origem, fixando sempre o vértice mais próximo.',
    description:
      'O algoritmo de Dijkstra calcula a menor distância de um vértice de origem até todos os outros em um grafo com pesos não negativos. Ele mantém uma estimativa de distância para cada vértice e, a cada passo, "fixa" o vértice não fixado mais próximo da origem — sua distância já não pode melhorar —, relaxando as arestas que saem dele. Com uma fila de prioridades (heap), roda em O((V + E) log V) e é a base do roteamento em redes e mapas.',
    complexity: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V)' },
    steps: [
      'Dê distância 0 à origem e ∞ a todos os outros vértices.',
      'Escolha o vértice não fixado com a menor distância e fixe-o.',
      'Para cada vizinho v do vértice fixado u, relaxe a aresta: se dist[u] + peso < dist[v], atualize dist[v].',
      'Repita até fixar todos os vértices (ou até a fila de prioridades esvaziar).',
      'Guardando de onde veio cada melhoria, é possível reconstruir os caminhos.',
    ],
    usedIn: ['GPS e aplicativos de mapas', 'Protocolos de roteamento (OSPF, IS-IS)', 'Redes de telecomunicações', 'Jogos (pathfinding)', 'Base do algoritmo A*'],
    realWorld: [
      { title: 'Roteamento na internet', text: 'Roteadores que usam o protocolo OSPF executam Dijkstra sobre o mapa da rede para decidir, a cada destino, por qual enlace enviar os pacotes.' },
      { title: 'Mapas e navegação', text: 'Serviços de rotas partem de variações do Dijkstra — com pré-processamento e heurísticas — para calcular trajetos em grafos com milhões de cruzamentos.' },
      { title: 'Logística', text: 'Empresas de entrega calculam as menores distâncias entre centros de distribuição e destinos, considerando tempos de viagem como pesos das arestas.' },
    ],
    curiosities: [
      'Dijkstra criou o algoritmo em 1956, em cerca de 20 minutos, sentado em um café em Amsterdã com a noiva — sem papel nem lápis. Ele queria demonstrar o novo computador ARMAC com um problema que qualquer pessoa entendesse: a menor rota entre duas cidades holandesas.',
      'Dijkstra recebeu o Prêmio Turing em 1972 e é também conhecido por frases como "a ciência da computação não é mais sobre computadores do que a astronomia é sobre telescópios" (atribuída a ele).',
      'Com uma aresta negativa, o Dijkstra pode errar: um vértice fixado ainda poderia melhorar. Para esses casos existe o Bellman-Ford.',
    ],
    code: {
      python: String.raw`
        import heapq

        def dijkstra(grafo, origem):
            dist = {v: float("inf") for v in grafo}
            dist[origem] = 0
            fila = [(0, origem)]  # (distância, vértice)
            while fila:
                d, u = heapq.heappop(fila)
                if d > dist[u]:
                    continue  # entrada antiga: u já foi fixado com distância menor
                for v, peso in grafo[u]:
                    if d + peso < dist[v]:  # relaxamento
                        dist[v] = d + peso
                        heapq.heappush(fila, (dist[v], v))
            return dist

        arestas = [("A", "B", 7), ("A", "C", 3), ("B", "C", 2), ("B", "D", 4), ("C", "D", 8), ("B", "E", 9),
                   ("D", "E", 3), ("D", "F", 5), ("C", "F", 10), ("E", "G", 2), ("F", "G", 6), ("E", "F", 4)]
        grafo = {v: [] for v in "ABCDEFG"}
        for u, v, w in arestas:  # grafo não dirigido
            grafo[u].append((v, w))
            grafo[v].append((u, w))

        print(dijkstra(grafo, "A"))
        # {'A': 0, 'B': 5, 'C': 3, 'D': 9, 'E': 12, 'F': 13, 'G': 14}
      `,
      javascript: String.raw`
        // Versão O(V²), sem heap: simples e ótima para grafos pequenos ou densos.
        function dijkstra(grafo, origem) {
          const dist = {};
          for (const v in grafo) dist[v] = Infinity;
          dist[origem] = 0;
          const fixados = new Set();
          while (fixados.size < Object.keys(grafo).length) {
            let u = null;
            for (const v in grafo) {
              if (!fixados.has(v) && (u === null || dist[v] < dist[u])) u = v; // o mais próximo
            }
            if (dist[u] === Infinity) break; // o resto é inalcançável
            fixados.add(u);
            for (const [v, peso] of grafo[u]) {
              if (dist[u] + peso < dist[v]) dist[v] = dist[u] + peso; // relaxamento
            }
          }
          return dist;
        }

        const arestas = [["A", "B", 7], ["A", "C", 3], ["B", "C", 2], ["B", "D", 4], ["C", "D", 8], ["B", "E", 9],
          ["D", "E", 3], ["D", "F", 5], ["C", "F", 10], ["E", "G", 2], ["F", "G", 6], ["E", "F", 4]];
        const grafo = {};
        for (const v of "ABCDEFG") grafo[v] = [];
        for (const [u, v, w] of arestas) { // grafo não dirigido
          grafo[u].push([v, w]);
          grafo[v].push([u, w]);
        }

        console.log(dijkstra(grafo, "A"));
        // { A: 0, B: 5, C: 3, D: 9, E: 12, F: 13, G: 14 }
      `,
      java: String.raw`
        import java.util.*;

        public class Dijkstra {
            static int[] dijkstra(List<List<int[]>> grafo, int origem) {
                int[] dist = new int[grafo.size()];
                Arrays.fill(dist, Integer.MAX_VALUE);
                dist[origem] = 0;
                PriorityQueue<int[]> fila = new PriorityQueue<>((a, b) -> a[0] - b[0]); // {distância, vértice}
                fila.add(new int[]{0, origem});
                while (!fila.isEmpty()) {
                    int[] topo = fila.poll();
                    int d = topo[0], u = topo[1];
                    if (d > dist[u]) continue; // entrada antiga
                    for (int[] e : grafo.get(u)) {
                        int v = e[0], peso = e[1];
                        if (d + peso < dist[v]) { // relaxamento
                            dist[v] = d + peso;
                            fila.add(new int[]{dist[v], v});
                        }
                    }
                }
                return dist;
            }

            public static void main(String[] args) {
                String nomes = "ABCDEFG";
                int[][] arestas = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                   {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
                List<List<int[]>> grafo = new ArrayList<>();
                for (int i = 0; i < nomes.length(); i++) grafo.add(new ArrayList<>());
                for (int[] a : arestas) { // grafo não dirigido
                    grafo.get(a[0]).add(new int[]{a[1], a[2]});
                    grafo.get(a[1]).add(new int[]{a[0], a[2]});
                }
                int[] dist = dijkstra(grafo, 0);
                for (int i = 0; i < dist.length; i++) System.out.print(nomes.charAt(i) + "=" + dist[i] + " ");
                // A=0 B=5 C=3 D=9 E=12 F=13 G=14
            }
        }
      `,
      cpp: String.raw`
        #include <climits>
        #include <iostream>
        #include <queue>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> dijkstra(const vector<vector<pair<int, int>>>& grafo, int origem) {
            vector<int> dist(grafo.size(), INT_MAX);
            dist[origem] = 0;
            // {distância, vértice}, o menor primeiro
            priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> fila;
            fila.push({0, origem});
            while (!fila.empty()) {
                auto [d, u] = fila.top();
                fila.pop();
                if (d > dist[u]) continue; // entrada antiga
                for (auto [v, peso] : grafo[u]) {
                    if (d + peso < dist[v]) { // relaxamento
                        dist[v] = d + peso;
                        fila.push({dist[v], v});
                    }
                }
            }
            return dist;
        }

        int main() {
            string nomes = "ABCDEFG";
            int arestas[][3] = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
            vector<vector<pair<int, int>>> grafo(nomes.size());
            for (auto& a : arestas) { // grafo não dirigido
                grafo[a[0]].push_back({a[1], a[2]});
                grafo[a[1]].push_back({a[0], a[2]});
            }
            vector<int> dist = dijkstra(grafo, 0);
            for (size_t i = 0; i < dist.size(); i++) cout << nomes[i] << "=" << dist[i] << " ";
            // A=0 B=5 C=3 D=9 E=12 F=13 G=14
        }
      `,
    },
  },
  {
    id: 'bellman-ford',
    name: 'Algoritmo de Bellman-Ford',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Richard Bellman; Lester Ford Jr.', 'Ano': '1958; 1956', 'Pesos negativos': 'Aceita (e detecta ciclos negativos)' },
    summary: 'Caminhos mínimos que funcionam mesmo com pesos negativos — e detectam ciclos negativos.',
    description:
      'O algoritmo de Bellman-Ford calcula as menores distâncias a partir de uma origem relaxando todas as arestas do grafo, repetidamente, V − 1 vezes. Como um caminho mínimo tem no máximo V − 1 arestas, isso basta para que as distâncias corretas se propaguem — mesmo com arestas de peso negativo, que confundem o Dijkstra. Uma passada extra revela ciclos negativos: se alguma distância ainda melhorar, ela poderia melhorar para sempre.',
    complexity: { best: 'O(E)', average: 'O(V · E)', worst: 'O(V · E)', space: 'O(V)' },
    steps: [
      'Dê distância 0 à origem e ∞ a todos os outros vértices.',
      'Repita V − 1 vezes: para cada aresta u → v com peso w, se dist[u] + w < dist[v], atualize dist[v].',
      'Se uma rodada inteira não mudar nada, pare mais cedo: as distâncias já são finais.',
      'Faça mais uma passada: se alguma aresta ainda melhorar uma distância, existe um ciclo negativo alcançável.',
    ],
    usedIn: ['Protocolos de roteamento por vetor de distância (RIP)', 'Detecção de arbitragem em câmbio', 'Grafos com custos negativos', 'Restrições de diferença (sistemas de agendamento)', 'Base do algoritmo de Johnson'],
    realWorld: [
      { title: 'Protocolo RIP', text: 'Roteadores que usam o RIP aplicam uma versão distribuída do Bellman-Ford: cada um envia aos vizinhos sua tabela de distâncias, e as rotas mínimas se propagam pela rede.' },
      { title: 'Arbitragem de moedas', text: 'Com o peso de cada conversão de moeda igual a −log(taxa), um ciclo negativo corresponde a uma sequência de trocas que termina com mais dinheiro do que começou. O Bellman-Ford encontra essas oportunidades.' },
      { title: 'Agendamento com restrições', text: 'Restrições do tipo "a tarefa B começa no máximo 3 horas depois da A" viram arestas de um grafo; resolver o sistema é calcular caminhos mínimos, e um ciclo negativo indica que as restrições são impossíveis.' },
    ],
    curiosities: [
      'O algoritmo leva o nome de Richard Bellman (1958) e Lester Ford Jr. (1956), mas também foi publicado por Alfonso Shimbel (1955) e Edward F. Moore (1957).',
      'Richard Bellman também criou a programação dinâmica — e o Bellman-Ford é, no fundo, um algoritmo de programação dinâmica sobre o número de arestas do caminho.',
      'Com um ciclo negativo, "caminho mínimo" deixa de fazer sentido: dá para dar voltas no ciclo e reduzir o custo indefinidamente.',
    ],
    code: {
      python: String.raw`
        def bellman_ford(vertices, arestas, origem):
            dist = {v: float("inf") for v in vertices}
            dist[origem] = 0
            for _ in range(len(vertices) - 1):
                mudou = False
                for u, v, w in arestas:
                    if dist[u] + w < dist[v]:  # relaxamento
                        dist[v] = dist[u] + w
                        mudou = True
                if not mudou:
                    break  # parada antecipada
            for u, v, w in arestas:  # se ainda melhora, há ciclo negativo
                if dist[u] + w < dist[v]:
                    raise ValueError("ciclo negativo alcançável a partir da origem")
            return dist

        arestas = [("S", "A", 6), ("S", "B", 7), ("A", "C", 5), ("A", "D", -4), ("A", "B", 8),
                   ("B", "C", -3), ("B", "D", 9), ("C", "A", -2), ("D", "C", 7), ("D", "S", 2)]
        print(bellman_ford("SABCD", arestas, "S"))
        # {'S': 0, 'A': 2, 'B': 7, 'C': 4, 'D': -2}
      `,
      javascript: String.raw`
        function bellmanFord(vertices, arestas, origem) {
          const dist = {};
          for (const v of vertices) dist[v] = Infinity;
          dist[origem] = 0;
          for (let i = 0; i < vertices.length - 1; i++) {
            let mudou = false;
            for (const [u, v, w] of arestas) {
              if (dist[u] + w < dist[v]) { // relaxamento
                dist[v] = dist[u] + w;
                mudou = true;
              }
            }
            if (!mudou) break; // parada antecipada
          }
          for (const [u, v, w] of arestas) { // se ainda melhora, há ciclo negativo
            if (dist[u] + w < dist[v]) throw new Error("ciclo negativo alcançável a partir da origem");
          }
          return dist;
        }

        const arestas = [["S", "A", 6], ["S", "B", 7], ["A", "C", 5], ["A", "D", -4], ["A", "B", 8],
          ["B", "C", -3], ["B", "D", 9], ["C", "A", -2], ["D", "C", 7], ["D", "S", 2]];
        console.log(bellmanFord([..."SABCD"], arestas, "S"));
        // { S: 0, A: 2, B: 7, C: 4, D: -2 }
      `,
      java: String.raw`
        import java.util.Arrays;

        public class BellmanFord {
            static final long INF = Long.MAX_VALUE / 4;

            static long[] bellmanFord(int n, int[][] arestas, int origem) {
                long[] dist = new long[n];
                Arrays.fill(dist, INF);
                dist[origem] = 0;
                for (int i = 0; i < n - 1; i++) {
                    boolean mudou = false;
                    for (int[] a : arestas) {
                        if (dist[a[0]] != INF && dist[a[0]] + a[2] < dist[a[1]]) { // relaxamento
                            dist[a[1]] = dist[a[0]] + a[2];
                            mudou = true;
                        }
                    }
                    if (!mudou) break; // parada antecipada
                }
                for (int[] a : arestas) // se ainda melhora, há ciclo negativo
                    if (dist[a[0]] != INF && dist[a[0]] + a[2] < dist[a[1]])
                        throw new IllegalStateException("ciclo negativo alcançável a partir da origem");
                return dist;
            }

            public static void main(String[] args) {
                String nomes = "SABCD";
                int[][] arestas = {{0, 1, 6}, {0, 2, 7}, {1, 3, 5}, {1, 4, -4}, {1, 2, 8},
                                   {2, 3, -3}, {2, 4, 9}, {3, 1, -2}, {4, 3, 7}, {4, 0, 2}};
                long[] dist = bellmanFord(nomes.length(), arestas, 0);
                for (int i = 0; i < dist.length; i++) System.out.print(nomes.charAt(i) + "=" + dist[i] + " ");
                // S=0 A=2 B=7 C=4 D=-2
            }
        }
      `,
      cpp: String.raw`
        #include <climits>
        #include <iostream>
        #include <stdexcept>
        #include <string>
        #include <vector>
        using namespace std;

        const long long INF = LLONG_MAX / 4;

        vector<long long> bellmanFord(int n, const vector<vector<int>>& arestas, int origem) {
            vector<long long> dist(n, INF);
            dist[origem] = 0;
            for (int i = 0; i < n - 1; i++) {
                bool mudou = false;
                for (const auto& a : arestas) {
                    if (dist[a[0]] != INF && dist[a[0]] + a[2] < dist[a[1]]) { // relaxamento
                        dist[a[1]] = dist[a[0]] + a[2];
                        mudou = true;
                    }
                }
                if (!mudou) break; // parada antecipada
            }
            for (const auto& a : arestas) // se ainda melhora, há ciclo negativo
                if (dist[a[0]] != INF && dist[a[0]] + a[2] < dist[a[1]])
                    throw runtime_error("ciclo negativo alcançável a partir da origem");
            return dist;
        }

        int main() {
            string nomes = "SABCD";
            vector<vector<int>> arestas = {{0, 1, 6}, {0, 2, 7}, {1, 3, 5}, {1, 4, -4}, {1, 2, 8},
                                           {2, 3, -3}, {2, 4, 9}, {3, 1, -2}, {4, 3, 7}, {4, 0, 2}};
            auto dist = bellmanFord(nomes.size(), arestas, 0);
            for (size_t i = 0; i < dist.size(); i++) cout << nomes[i] << "=" << dist[i] << " ";
            // S=0 A=2 B=7 C=4 D=-2
        }
      `,
    },
  },
  {
    id: 'floyd-warshall',
    name: 'Algoritmo de Floyd-Warshall',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Robert Floyd; Stephen Warshall', 'Ano': '1962', 'Resolve': 'Caminhos mínimos entre todos os pares' },
    summary: 'Calcula a menor distância entre todos os pares de vértices com três laços aninhados.',
    description:
      'O algoritmo de Floyd-Warshall resolve o problema dos caminhos mínimos entre todos os pares de vértices de uma vez. Ele mantém uma matriz de distâncias e, para cada vértice k, verifica se passar por k encurta o caminho entre cada par (i, j): d[i][j] = min(d[i][j], d[i][k] + d[k][j]). Depois de considerar todos os k, a matriz contém todas as menores distâncias. São três laços simples — O(V³) —, ideais para grafos densos e de tamanho moderado. Aceita pesos negativos, desde que não haja ciclos negativos.',
    complexity: { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)', space: 'O(V²)' },
    steps: [
      'Monte a matriz d com os pesos das arestas diretas, 0 na diagonal e ∞ onde não há aresta.',
      'Para cada vértice k (o candidato a intermediário):',
      'Para cada par (i, j), se d[i][k] + d[k][j] < d[i][j], atualize d[i][j].',
      'Ao final, d[i][j] é a menor distância de i até j. Se algum d[i][i] ficar negativo, há um ciclo negativo.',
    ],
    usedIn: ['Tabelas de distância entre cidades', 'Fechamento transitivo (alcançabilidade)', 'Análise de redes', 'Roteamento em redes pequenas e densas', 'Detecção de ciclos negativos'],
    realWorld: [
      { title: 'Tabelas de distâncias', text: 'As tabelas de "distância entre cidades" dos antigos atlas rodoviários são exatamente o resultado de um algoritmo de todos os pares, como o Floyd-Warshall.' },
      { title: 'Quem alcança quem', text: 'Trocando soma e mínimo por "e" e "ou", o mesmo algoritmo (de Warshall) calcula o fechamento transitivo: em uma rede social, quem consegue alcançar quem por alguma cadeia de contatos.' },
      { title: 'Jogos e mapas pequenos', text: 'Em jogos com mapas de algumas centenas de pontos de navegação, é comum pré-calcular todas as distâncias com Floyd-Warshall e apenas consultar a matriz durante a partida.' },
    ],
    curiosities: [
      'Robert Floyd publicou o algoritmo em 1962, no mesmo ano em que Stephen Warshall publicou a versão para fechamento transitivo. Bernard Roy já o havia descrito em 1959.',
      'Floyd recebeu o Prêmio Turing em 1978. Um detalhe curioso: ele nunca concluiu um doutorado, mas tornou-se professor titular em Stanford.',
      'A ordem dos laços importa: o laço de k precisa ser o mais externo. Trocar a ordem é um erro clássico que produz resultados errados.',
    ],
    code: {
      python: String.raw`
        INF = float("inf")

        def floyd_warshall(n, arestas):
            d = [[0 if i == j else INF for j in range(n)] for i in range(n)]
            for u, v, w in arestas:
                d[u][v] = w
            for k in range(n):          # k precisa ser o laço mais externo
                for i in range(n):
                    for j in range(n):
                        if d[i][k] + d[k][j] < d[i][j]:  # passar por k encurta?
                            d[i][j] = d[i][k] + d[k][j]
            return d

        # vértices 1..4 do exemplo, aqui numerados de 0 a 3
        arestas = [(0, 1, 3), (0, 3, 7), (1, 0, 8), (1, 2, 2), (2, 0, 5), (2, 3, 1), (3, 0, 2)]
        for linha in floyd_warshall(4, arestas):
            print(linha)
        # [0, 3, 5, 6]
        # [5, 0, 2, 3]
        # [3, 6, 0, 1]
        # [2, 5, 7, 0]
      `,
      javascript: String.raw`
        function floydWarshall(n, arestas) {
          const d = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
          for (const [u, v, w] of arestas) d[u][v] = w;
          for (let k = 0; k < n; k++) { // k precisa ser o laço mais externo
            for (let i = 0; i < n; i++) {
              for (let j = 0; j < n; j++) {
                if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j]; // passar por k encurta?
              }
            }
          }
          return d;
        }

        // vértices 1..4 do exemplo, aqui numerados de 0 a 3
        const arestas = [[0, 1, 3], [0, 3, 7], [1, 0, 8], [1, 2, 2], [2, 0, 5], [2, 3, 1], [3, 0, 2]];
        for (const linha of floydWarshall(4, arestas)) console.log(linha.join(" "));
        // 0 3 5 6
        // 5 0 2 3
        // 3 6 0 1
        // 2 5 7 0
      `,
      java: String.raw`
        import java.util.Arrays;

        public class FloydWarshall {
            static final int INF = Integer.MAX_VALUE / 2; // metade do máximo: a soma não estoura

            static int[][] floydWarshall(int n, int[][] arestas) {
                int[][] d = new int[n][n];
                for (int i = 0; i < n; i++) {
                    Arrays.fill(d[i], INF);
                    d[i][i] = 0;
                }
                for (int[] a : arestas) d[a[0]][a[1]] = a[2];
                for (int k = 0; k < n; k++) // k precisa ser o laço mais externo
                    for (int i = 0; i < n; i++)
                        for (int j = 0; j < n; j++)
                            if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j]; // passar por k encurta?
                return d;
            }

            public static void main(String[] args) {
                // vértices 1..4 do exemplo, aqui numerados de 0 a 3
                int[][] arestas = {{0, 1, 3}, {0, 3, 7}, {1, 0, 8}, {1, 2, 2}, {2, 0, 5}, {2, 3, 1}, {3, 0, 2}};
                for (int[] linha : floydWarshall(4, arestas)) System.out.println(Arrays.toString(linha));
                // [0, 3, 5, 6] / [5, 0, 2, 3] / [3, 6, 0, 1] / [2, 5, 7, 0]
            }
        }
      `,
      cpp: String.raw`
        #include <climits>
        #include <iostream>
        #include <vector>
        using namespace std;

        const int INF = INT_MAX / 2; // metade do máximo: a soma não estoura

        vector<vector<int>> floydWarshall(int n, const vector<vector<int>>& arestas) {
            vector<vector<int>> d(n, vector<int>(n, INF));
            for (int i = 0; i < n; i++) d[i][i] = 0;
            for (const auto& a : arestas) d[a[0]][a[1]] = a[2];
            for (int k = 0; k < n; k++) // k precisa ser o laço mais externo
                for (int i = 0; i < n; i++)
                    for (int j = 0; j < n; j++)
                        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j]; // passar por k encurta?
            return d;
        }

        int main() {
            // vértices 1..4 do exemplo, aqui numerados de 0 a 3
            vector<vector<int>> arestas = {{0, 1, 3}, {0, 3, 7}, {1, 0, 8}, {1, 2, 2}, {2, 0, 5}, {2, 3, 1}, {3, 0, 2}};
            for (const auto& linha : floydWarshall(4, arestas)) {
                for (int v : linha) cout << v << " ";
                cout << "\n";
            }
            // 0 3 5 6 / 5 0 2 3 / 3 6 0 1 / 2 5 7 0
        }
      `,
    },
  },
  {
    id: 'prim',
    name: 'Algoritmo de Prim',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Vojtěch Jarník; Robert Prim', 'Ano': '1930; 1957', 'Redescoberto por': 'Edsger Dijkstra (1959)' },
    summary: 'Faz uma árvore crescer a partir de um vértice, sempre pela aresta mais leve que sai dela.',
    description:
      'O algoritmo de Prim constrói uma árvore geradora mínima — o conjunto de arestas que conecta todos os vértices com o menor peso total possível. Ele começa com um único vértice e, a cada passo, adiciona a aresta mais leve que liga a árvore a um vértice ainda de fora. Com uma fila de prioridades, roda em O(E log V), e é especialmente eficiente em grafos densos.',
    complexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)', space: 'O(V + E)' },
    steps: [
      'Comece a árvore com um vértice qualquer.',
      'Considere todas as arestas que ligam a árvore a vértices ainda fora dela.',
      'Adicione a mais leve dessas arestas (e o vértice novo) à árvore.',
      'Repita até todos os vértices estarem na árvore.',
    ],
    usedIn: ['Projeto de redes (elétricas, de água, de fibra)', 'Geração de labirintos', 'Agrupamento (clustering) hierárquico', 'Aproximações para o caixeiro-viajante', 'Segmentação de imagens'],
    realWorld: [
      { title: 'Redes de infraestrutura', text: 'Para ligar todos os bairros de uma cidade à rede de fibra óptica com o mínimo de cabo, basta uma árvore geradora mínima sobre o grafo dos custos de cada ligação possível.' },
      { title: 'Labirintos', text: 'Rodar o Prim em uma grade com pesos aleatórios gera um labirinto perfeito — com exatamente um caminho entre quaisquer dois pontos —, de aparência mais "ramificada" que a do backtracking.' },
      { title: 'Caixeiro-viajante', text: 'Percorrer uma árvore geradora mínima em profundidade dá uma rota que custa no máximo o dobro da ótima — uma aproximação clássica para o problema do caixeiro-viajante métrico.' },
    ],
    curiosities: [
      'Foi descrito primeiro pelo matemático tcheco Vojtěch Jarník em 1930; Robert Prim o redescobriu em 1957, nos Laboratórios Bell, e Edsger Dijkstra, em 1959. Por isso também é chamado de algoritmo de Jarník.',
      'Prim e Kruskal sempre chegam ao mesmo peso total (e, se os pesos forem todos diferentes, à mesma árvore), mas constroem a solução de formas opostas: um faz crescer uma única árvore, o outro junta várias.',
      'O código do Prim é quase idêntico ao do Dijkstra: a diferença é que a prioridade é o peso da aresta, e não a distância acumulada desde a origem.',
    ],
    code: {
      python: String.raw`
        import heapq

        def prim(grafo, inicio):
            na_arvore = {inicio}
            fila = [(w, inicio, v) for v, w in grafo[inicio]]  # (peso, de, para)
            heapq.heapify(fila)
            arvore, total = [], 0
            while fila and len(na_arvore) < len(grafo):
                w, u, v = heapq.heappop(fila)  # a aresta mais leve que sai da árvore
                if v in na_arvore:
                    continue  # aresta antiga: v já entrou por outro caminho
                na_arvore.add(v)
                arvore.append((u, v, w))
                total += w
                for x, wx in grafo[v]:
                    if x not in na_arvore:
                        heapq.heappush(fila, (wx, v, x))
            return arvore, total

        arestas = [("A", "B", 7), ("A", "C", 3), ("B", "C", 2), ("B", "D", 4), ("C", "D", 8), ("B", "E", 9),
                   ("D", "E", 3), ("D", "F", 5), ("C", "F", 10), ("E", "G", 2), ("F", "G", 6), ("E", "F", 4)]
        grafo = {v: [] for v in "ABCDEFG"}
        for u, v, w in arestas:
            grafo[u].append((v, w))
            grafo[v].append((u, w))

        arvore, total = prim(grafo, "A")
        print("peso total:", total)                                  # 18
        print(" ".join(u + "-" + v + "(" + str(w) + ")" for u, v, w in arvore))
        # A-C(3) C-B(2) B-D(4) D-E(3) E-G(2) E-F(4)
      `,
      javascript: String.raw`
        // Versão O(V²) com o "custo de entrada" de cada vértice — ótima para grafos densos.
        function prim(grafo, inicio) {
          const custo = {}, de = {};
          for (const v in grafo) custo[v] = Infinity;
          custo[inicio] = 0;
          const naArvore = new Set();
          const arvore = [];
          let total = 0;
          while (naArvore.size < Object.keys(grafo).length) {
            let u = null; // o vértice de fora mais barato de conectar
            for (const v in grafo) if (!naArvore.has(v) && (u === null || custo[v] < custo[u])) u = v;
            naArvore.add(u);
            if (u !== inicio) {
              arvore.push([de[u], u, custo[u]]);
              total += custo[u];
            }
            for (const [v, w] of grafo[u]) {
              if (!naArvore.has(v) && w < custo[v]) { custo[v] = w; de[v] = u; }
            }
          }
          return { arvore, total };
        }

        const arestas = [["A", "B", 7], ["A", "C", 3], ["B", "C", 2], ["B", "D", 4], ["C", "D", 8], ["B", "E", 9],
          ["D", "E", 3], ["D", "F", 5], ["C", "F", 10], ["E", "G", 2], ["F", "G", 6], ["E", "F", 4]];
        const grafo = {};
        for (const v of "ABCDEFG") grafo[v] = [];
        for (const [u, v, w] of arestas) { grafo[u].push([v, w]); grafo[v].push([u, w]); }

        const { arvore, total } = prim(grafo, "A");
        console.log("peso total:", total); // 18
        console.log(arvore.map(([u, v, w]) => u + "-" + v + "(" + w + ")").join(" "));
        // A-C(3) C-B(2) B-D(4) D-E(3) E-G(2) E-F(4)
      `,
      java: String.raw`
        import java.util.*;

        public class Prim {
            public static void main(String[] args) {
                String nomes = "ABCDEFG";
                int n = nomes.length();
                int[][] arestas = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                   {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
                List<List<int[]>> grafo = new ArrayList<>();
                for (int i = 0; i < n; i++) grafo.add(new ArrayList<>());
                for (int[] a : arestas) {
                    grafo.get(a[0]).add(new int[]{a[1], a[2]});
                    grafo.get(a[1]).add(new int[]{a[0], a[2]});
                }

                boolean[] naArvore = new boolean[n];
                // {peso, de, para}: a aresta mais leve sai primeiro
                PriorityQueue<int[]> fila = new PriorityQueue<>((x, y) -> x[0] - y[0]);
                naArvore[0] = true;
                for (int[] e : grafo.get(0)) fila.add(new int[]{e[1], 0, e[0]});
                int total = 0;
                StringBuilder arvore = new StringBuilder();
                while (!fila.isEmpty()) {
                    int[] a = fila.poll();
                    int w = a[0], u = a[1], v = a[2];
                    if (naArvore[v]) continue; // aresta antiga
                    naArvore[v] = true;
                    total += w;
                    arvore.append(nomes.charAt(u)).append('-').append(nomes.charAt(v)).append('(').append(w).append(") ");
                    for (int[] e : grafo.get(v)) if (!naArvore[e[0]]) fila.add(new int[]{e[1], v, e[0]});
                }
                System.out.println("peso total: " + total); // 18
                System.out.println(arvore.toString().trim());  // A-C(3) C-B(2) B-D(4) D-E(3) E-G(2) E-F(4)
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <queue>
        #include <string>
        #include <tuple>
        #include <vector>
        using namespace std;

        int main() {
            string nomes = "ABCDEFG";
            int n = nomes.size();
            int arestas[][3] = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
            vector<vector<pair<int, int>>> grafo(n);
            for (auto& a : arestas) {
                grafo[a[0]].push_back({a[1], a[2]});
                grafo[a[1]].push_back({a[0], a[2]});
            }

            vector<bool> naArvore(n, false);
            // (peso, de, para): a aresta mais leve sai primeiro
            priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> fila;
            naArvore[0] = true;
            for (auto [v, w] : grafo[0]) fila.push({w, 0, v});
            int total = 0;
            while (!fila.empty()) {
                auto [w, u, v] = fila.top();
                fila.pop();
                if (naArvore[v]) continue; // aresta antiga
                naArvore[v] = true;
                total += w;
                cout << nomes[u] << "-" << nomes[v] << "(" << w << ") ";
                for (auto [x, wx] : grafo[v]) if (!naArvore[x]) fila.push({wx, v, x});
            }
            cout << "\npeso total: " << total << "\n";
            // A-C(3) C-B(2) B-D(4) D-E(3) E-G(2) E-F(4) / peso total: 18
        }
      `,
    },
  },
  {
    id: 'kruskal',
    name: 'Algoritmo de Kruskal',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Joseph Kruskal', 'Ano': '1956', 'Estrutura auxiliar': 'Union-Find' },
    summary: 'Ordena as arestas pelo peso e as adiciona da mais leve à mais pesada, evitando ciclos.',
    description:
      'O algoritmo de Kruskal constrói uma árvore geradora mínima de forma "gulosa": ordena todas as arestas pelo peso e percorre a lista, aceitando cada aresta que liga duas partes ainda separadas do grafo e rejeitando as que fechariam um ciclo. Para saber rapidamente se dois vértices já estão conectados, usa a estrutura Union-Find. O custo é dominado pela ordenação: O(E log E).',
    complexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', space: 'O(V + E)' },
    steps: [
      'Ordene todas as arestas por peso, da mais leve para a mais pesada.',
      'Coloque cada vértice em seu próprio grupo (Union-Find).',
      'Para cada aresta (u, v): se u e v estão em grupos diferentes, aceite a aresta e una os grupos; senão, rejeite-a (formaria um ciclo).',
      'Pare quando a árvore tiver V − 1 arestas.',
    ],
    usedIn: ['Projeto de redes de custo mínimo', 'Agrupamento (single-linkage clustering)', 'Segmentação de imagens', 'Geração de labirintos', 'Aproximação de problemas de roteamento'],
    realWorld: [
      { title: 'Redes elétricas e de cabos', text: 'Para conectar todas as subestações, torres ou prédios de um campus gastando o mínimo de cabo, o Kruskal escolhe as ligações mais baratas que não criam caminhos redundantes.' },
      { title: 'Agrupamento de dados', text: 'Parar o Kruskal antes do fim, com k grupos restantes, produz um agrupamento em que pontos parecidos ficam juntos — o método "single-linkage", usado em biologia e análise de dados.' },
      { title: 'Segmentação de imagens', text: 'O algoritmo de Felzenszwalb-Huttenlocher, muito usado em visão computacional, é um Kruskal sobre os pixels: une regiões vizinhas de cor parecida, da diferença menor para a maior.' },
    ],
    curiosities: [
      'Joseph Kruskal publicou o algoritmo em 1956, em um artigo de apenas três páginas. Seus irmãos também se destacaram: Martin cunhou o termo "sóliton" na física matemática, e William foi um estatístico renomado.',
      'O algoritmo é um exemplo clássico em que a estratégia gulosa — sempre escolher o melhor agora — leva comprovadamente ao ótimo global.',
      'No exemplo, há empates de peso (dois pesos 2, dois 3, dois 4). Com empates, podem existir várias árvores mínimas diferentes — mas todas com o mesmo peso total.',
    ],
    code: {
      python: String.raw`
        def kruskal(vertices, arestas):
            pai = {v: v for v in vertices}

            def find(x):
                while pai[x] != x:
                    pai[x] = pai[pai[x]]  # encurta o caminho enquanto sobe
                    x = pai[x]
                return x

            arvore, total = [], 0
            for u, v, w in sorted(arestas, key=lambda a: a[2]):  # da mais leve à mais pesada
                ru, rv = find(u), find(v)
                if ru != rv:  # grupos diferentes: não forma ciclo
                    pai[ru] = rv
                    arvore.append((u, v, w))
                    total += w
            return arvore, total

        arestas = [("A", "B", 7), ("A", "C", 3), ("B", "C", 2), ("B", "D", 4), ("C", "D", 8), ("B", "E", 9),
                   ("D", "E", 3), ("D", "F", 5), ("C", "F", 10), ("E", "G", 2), ("F", "G", 6), ("E", "F", 4)]
        arvore, total = kruskal("ABCDEFG", arestas)
        print("peso total:", total)                                  # 18
        print(" ".join(u + "-" + v + "(" + str(w) + ")" for u, v, w in arvore))
        # B-C(2) E-G(2) A-C(3) D-E(3) B-D(4) E-F(4)
      `,
      javascript: String.raw`
        function kruskal(vertices, arestas) {
          const pai = {};
          for (const v of vertices) pai[v] = v;
          const find = x => {
            while (pai[x] !== x) {
              pai[x] = pai[pai[x]]; // encurta o caminho enquanto sobe
              x = pai[x];
            }
            return x;
          };
          const arvore = [];
          let total = 0;
          for (const [u, v, w] of [...arestas].sort((a, b) => a[2] - b[2])) { // da mais leve à mais pesada
            const ru = find(u), rv = find(v);
            if (ru !== rv) { // grupos diferentes: não forma ciclo
              pai[ru] = rv;
              arvore.push([u, v, w]);
              total += w;
            }
          }
          return { arvore, total };
        }

        const arestas = [["A", "B", 7], ["A", "C", 3], ["B", "C", 2], ["B", "D", 4], ["C", "D", 8], ["B", "E", 9],
          ["D", "E", 3], ["D", "F", 5], ["C", "F", 10], ["E", "G", 2], ["F", "G", 6], ["E", "F", 4]];
        const { arvore, total } = kruskal("ABCDEFG", arestas);
        console.log("peso total:", total); // 18
        console.log(arvore.map(([u, v, w]) => u + "-" + v + "(" + w + ")").join(" "));
        // B-C(2) E-G(2) A-C(3) D-E(3) B-D(4) E-F(4)
      `,
      java: String.raw`
        import java.util.*;

        public class Kruskal {
            static int[] pai;

            static int find(int x) {
                while (pai[x] != x) {
                    pai[x] = pai[pai[x]]; // encurta o caminho enquanto sobe
                    x = pai[x];
                }
                return x;
            }

            public static void main(String[] args) {
                String nomes = "ABCDEFG";
                int[][] arestas = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                   {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
                pai = new int[nomes.length()];
                for (int i = 0; i < pai.length; i++) pai[i] = i;

                int[][] ordenadas = arestas.clone();
                Arrays.sort(ordenadas, Comparator.comparingInt(a -> a[2])); // da mais leve à mais pesada (estável)
                int total = 0;
                StringBuilder arvore = new StringBuilder();
                for (int[] a : ordenadas) {
                    int ru = find(a[0]), rv = find(a[1]);
                    if (ru != rv) { // grupos diferentes: não forma ciclo
                        pai[ru] = rv;
                        total += a[2];
                        arvore.append(nomes.charAt(a[0])).append('-').append(nomes.charAt(a[1])).append('(').append(a[2]).append(") ");
                    }
                }
                System.out.println("peso total: " + total); // 18
                System.out.println(arvore.toString().trim());  // B-C(2) E-G(2) A-C(3) D-E(3) B-D(4) E-F(4)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <numeric>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> pai;

        int find(int x) {
            while (pai[x] != x) {
                pai[x] = pai[pai[x]]; // encurta o caminho enquanto sobe
                x = pai[x];
            }
            return x;
        }

        int main() {
            string nomes = "ABCDEFG";
            vector<vector<int>> arestas = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                           {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
            pai.resize(nomes.size());
            iota(pai.begin(), pai.end(), 0);

            // da mais leve à mais pesada; stable_sort mantém a ordem original nos empates
            stable_sort(arestas.begin(), arestas.end(), [](const auto& a, const auto& b) { return a[2] < b[2]; });
            int total = 0;
            for (const auto& a : arestas) {
                int ru = find(a[0]), rv = find(a[1]);
                if (ru != rv) { // grupos diferentes: não forma ciclo
                    pai[ru] = rv;
                    total += a[2];
                    cout << nomes[a[0]] << "-" << nomes[a[1]] << "(" << a[2] << ") ";
                }
            }
            cout << "\npeso total: " << total << "\n";
            // B-C(2) E-G(2) A-C(3) D-E(3) B-D(4) E-F(4) / peso total: 18
        }
      `,
    },
  },
  {
    id: 'boruvka',
    name: 'Algoritmo de Borůvka',
    difficulty: 'Avançado',
    facts: { 'Criado por': 'Otakar Borůvka', 'Ano': '1926', 'Motivação': 'Rede elétrica da Morávia' },
    summary: 'Em rodadas, cada componente escolhe sua aresta mais leve para fora — todos ao mesmo tempo.',
    description:
      'O algoritmo de Borůvka foi o primeiro método para encontrar uma árvore geradora mínima. Ele trabalha em rodadas: no início, cada vértice é um componente; em cada rodada, todos os componentes escolhem, simultaneamente, a aresta mais leve que os liga a outro componente, e todas essas arestas são adicionadas. Como o número de componentes cai pelo menos pela metade a cada rodada, bastam O(log V) rodadas. Por ser naturalmente paralelo, é a base de algoritmos modernos para GPUs e sistemas distribuídos.',
    complexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)', space: 'O(V + E)' },
    steps: [
      'Comece com cada vértice sendo um componente separado.',
      'Para cada componente, encontre a aresta mais leve que o liga a outro componente.',
      'Adicione todas essas arestas à árvore (ignorando as que, por empate, fechariam um ciclo) e una os componentes.',
      'Repita até restar um único componente.',
    ],
    usedIn: ['Algoritmos paralelos de MST (GPUs)', 'Sistemas distribuídos', 'Base de algoritmos teóricos mais rápidos', 'Redes de grande escala', 'Agrupamento de dados'],
    realWorld: [
      { title: 'Computação paralela', text: 'Como cada componente escolhe sua aresta de forma independente, as escolhas podem ser feitas em paralelo por milhares de núcleos de uma GPU — algo difícil de fazer com Prim ou Kruskal.' },
      { title: 'Grafos gigantes', text: 'Em grafos com bilhões de arestas distribuídos em várias máquinas, cada máquina calcula as melhores arestas dos seus componentes, e só os resultados são trocados entre elas.' },
      { title: 'Eletrificação', text: 'O problema original de Borůvka era real: planejar a rede elétrica da região da Morávia, na atual República Tcheca, com o menor custo possível de linhas.' },
    ],
    curiosities: [
      'Otakar Borůvka publicou o algoritmo em 1926 — antes mesmo de existirem computadores eletrônicos —, para ajudar a companhia elétrica da Morávia Ocidental.',
      'O algoritmo foi redescoberto várias vezes: por Choquet (1938), Florek e colegas (1951) e Sollin (1965). Por isso também é chamado de algoritmo de Sollin.',
      'O algoritmo aleatorizado de Karger, Klein e Tarjan, que encontra a árvore mínima em tempo linear esperado, usa passos de Borůvka como peça central.',
    ],
    code: {
      python: String.raw`
        def boruvka(vertices, arestas):
            pai = {v: v for v in vertices}

            def find(x):
                while pai[x] != x:
                    pai[x] = pai[pai[x]]
                    x = pai[x]
                return x

            arvore, total, componentes = [], 0, len(vertices)
            while componentes > 1:
                mais_leve = {}  # componente -> aresta mais leve que sai dele
                for u, v, w in arestas:
                    ru, rv = find(u), find(v)
                    if ru == rv:
                        continue
                    for r in (ru, rv):
                        if r not in mais_leve or w < mais_leve[r][2]:
                            mais_leve[r] = (u, v, w)
                for u, v, w in mais_leve.values():  # adiciona todas de uma vez
                    ru, rv = find(u), find(v)
                    if ru != rv:  # pode já ter sido unida nesta mesma rodada
                        pai[ru] = rv
                        arvore.append((u, v, w))
                        total += w
                        componentes -= 1
            return arvore, total

        arestas = [("A", "B", 7), ("A", "C", 3), ("B", "C", 2), ("B", "D", 4), ("C", "D", 8), ("B", "E", 9),
                   ("D", "E", 3), ("D", "F", 5), ("C", "F", 10), ("E", "G", 2), ("F", "G", 6), ("E", "F", 4)]
        arvore, total = boruvka("ABCDEFG", arestas)
        print("peso total:", total, "| arestas:", len(arvore))  # peso total: 18 | arestas: 6
      `,
      javascript: String.raw`
        function boruvka(vertices, arestas) {
          const pai = {};
          for (const v of vertices) pai[v] = v;
          const find = x => {
            while (pai[x] !== x) { pai[x] = pai[pai[x]]; x = pai[x]; }
            return x;
          };
          const arvore = [];
          let total = 0, componentes = vertices.length;
          while (componentes > 1) {
            const maisLeve = new Map(); // componente -> aresta mais leve que sai dele
            for (const a of arestas) {
              const ru = find(a[0]), rv = find(a[1]);
              if (ru === rv) continue;
              for (const r of [ru, rv]) if (!maisLeve.has(r) || a[2] < maisLeve.get(r)[2]) maisLeve.set(r, a);
            }
            for (const [u, v, w] of maisLeve.values()) { // adiciona todas de uma vez
              const ru = find(u), rv = find(v);
              if (ru !== rv) { // pode já ter sido unida nesta mesma rodada
                pai[ru] = rv;
                arvore.push([u, v, w]);
                total += w;
                componentes--;
              }
            }
          }
          return { arvore, total };
        }

        const arestas = [["A", "B", 7], ["A", "C", 3], ["B", "C", 2], ["B", "D", 4], ["C", "D", 8], ["B", "E", 9],
          ["D", "E", 3], ["D", "F", 5], ["C", "F", 10], ["E", "G", 2], ["F", "G", 6], ["E", "F", 4]];
        const { arvore, total } = boruvka([..."ABCDEFG"], arestas);
        console.log("peso total:", total, "| arestas:", arvore.length); // peso total: 18 | arestas: 6
      `,
      java: String.raw`
        import java.util.*;

        public class Boruvka {
            static int[] pai;

            static int find(int x) {
                while (pai[x] != x) { pai[x] = pai[pai[x]]; x = pai[x]; }
                return x;
            }

            public static void main(String[] args) {
                int n = 7; // A..G
                int[][] arestas = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                   {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
                pai = new int[n];
                for (int i = 0; i < n; i++) pai[i] = i;

                int total = 0, escolhidas = 0, componentes = n;
                while (componentes > 1) {
                    int[] maisLeve = new int[n]; // índice da aresta mais leve de cada componente
                    Arrays.fill(maisLeve, -1);
                    for (int i = 0; i < arestas.length; i++) {
                        int ru = find(arestas[i][0]), rv = find(arestas[i][1]);
                        if (ru == rv) continue;
                        for (int r : new int[]{ru, rv})
                            if (maisLeve[r] == -1 || arestas[i][2] < arestas[maisLeve[r]][2]) maisLeve[r] = i;
                    }
                    for (int r = 0; r < n; r++) { // adiciona todas de uma vez
                        if (maisLeve[r] == -1) continue;
                        int[] a = arestas[maisLeve[r]];
                        int ru = find(a[0]), rv = find(a[1]);
                        if (ru != rv) { // pode já ter sido unida nesta mesma rodada
                            pai[ru] = rv;
                            total += a[2];
                            escolhidas++;
                            componentes--;
                        }
                    }
                }
                System.out.println("peso total: " + total + " | arestas: " + escolhidas); // peso total: 18 | arestas: 6
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <numeric>
        #include <vector>
        using namespace std;

        vector<int> pai;

        int find(int x) {
            while (pai[x] != x) { pai[x] = pai[pai[x]]; x = pai[x]; }
            return x;
        }

        int main() {
            int n = 7; // A..G
            vector<vector<int>> arestas = {{0, 1, 7}, {0, 2, 3}, {1, 2, 2}, {1, 3, 4}, {2, 3, 8}, {1, 4, 9},
                                           {3, 4, 3}, {3, 5, 5}, {2, 5, 10}, {4, 6, 2}, {5, 6, 6}, {4, 5, 4}};
            pai.resize(n);
            iota(pai.begin(), pai.end(), 0);

            int total = 0, escolhidas = 0, componentes = n;
            while (componentes > 1) {
                vector<int> maisLeve(n, -1); // índice da aresta mais leve de cada componente
                for (int i = 0; i < (int)arestas.size(); i++) {
                    int ru = find(arestas[i][0]), rv = find(arestas[i][1]);
                    if (ru == rv) continue;
                    for (int r : {ru, rv})
                        if (maisLeve[r] == -1 || arestas[i][2] < arestas[maisLeve[r]][2]) maisLeve[r] = i;
                }
                for (int r = 0; r < n; r++) { // adiciona todas de uma vez
                    if (maisLeve[r] == -1) continue;
                    const auto& a = arestas[maisLeve[r]];
                    int ru = find(a[0]), rv = find(a[1]);
                    if (ru != rv) { // pode já ter sido unida nesta mesma rodada
                        pai[ru] = rv;
                        total += a[2];
                        escolhidas++;
                        componentes--;
                    }
                }
            }
            cout << "peso total: " << total << " | arestas: " << escolhidas << "\n"; // peso total: 18 | arestas: 6
        }
      `,
    },
  },
  {
    id: 'ford-fulkerson',
    name: 'Método de Ford-Fulkerson',
    difficulty: 'Avançado',
    facts: { 'Criado por': 'L. R. Ford Jr. e D. R. Fulkerson', 'Ano': '1956', 'Teorema associado': 'Fluxo máximo = corte mínimo' },
    summary: 'Envia fluxo por caminhos com folga até não existir nenhum: o fluxo máximo de uma rede.',
    description:
      'O método de Ford-Fulkerson calcula o fluxo máximo que pode ir de uma origem s até um destino t em uma rede em que cada aresta tem uma capacidade — como água em canos ou dados em cabos. Enquanto existir um caminho de s até t com folga em todas as arestas (um caminho aumentante), ele envia por ele o máximo possível, limitado pela aresta mais apertada (o gargalo). O truque essencial são as arestas reversas da rede residual, que permitem "desfazer" escolhas ruins. Quando não há mais caminhos, o fluxo é máximo — e igual à capacidade do corte mínimo. (Na complexidade, F é o valor do fluxo máximo.)',
    complexity: { best: 'O(E)', average: 'O(E · F)', worst: 'O(E · F)', space: 'O(V + E)' },
    steps: [
      'Comece com fluxo zero em todas as arestas.',
      'Procure, na rede residual, um caminho de s até t em que todas as arestas tenham folga (capacidade − fluxo > 0). Arestas reversas têm folga igual ao fluxo já enviado.',
      'Calcule o gargalo: a menor folga ao longo do caminho.',
      'Envie o gargalo pelo caminho: aumente o fluxo nas arestas diretas e diminua nas reversas.',
      'Repita até não existir caminho aumentante; o fluxo total é o máximo.',
    ],
    usedIn: ['Redes de transporte e logística', 'Emparelhamento bipartido (vagas e candidatos)', 'Segmentação de imagens (graph cuts)', 'Capacidade de redes de computadores', 'Problemas de escalonamento'],
    realWorld: [
      { title: 'Redes de distribuição', text: 'Quanto petróleo um oleoduto, quanta água uma rede de canos ou quantos dados uma rede de cabos consegue levar de um ponto a outro por segundo é exatamente um problema de fluxo máximo.' },
      { title: 'Emparelhamentos', text: 'Distribuir candidatos entre vagas, alunos entre orientadores ou tarefas entre máquinas vira um fluxo máximo em um grafo bipartido: cada unidade de fluxo é um par formado.' },
      { title: 'Recorte de imagens', text: 'Ferramentas que separam o objeto do fundo de uma foto modelam os pixels como uma rede e calculam um corte mínimo: a borda do objeto é onde "cortar" sai mais barato.' },
    ],
    curiosities: [
      'L. R. Ford Jr. e D. R. Fulkerson publicaram o método em 1956. O problema vinha de estudos da Guerra Fria sobre a capacidade da rede ferroviária soviética, descritos em um relatório de T. E. Harris e F. S. Ross em 1955.',
      'O teorema do fluxo máximo e corte mínimo garante que o maior fluxo possível é igual à menor soma de capacidades de arestas que, removidas, separam s de t. O visualizador mostra esse corte no final.',
      'Com capacidades irracionais, o método genérico pode nunca terminar — nem convergir para o valor certo. Escolher sempre o caminho mais curto, como faz o Edmonds-Karp, resolve o problema.',
    ],
    code: {
      python: String.raw`
        def ford_fulkerson(cap, s, t):
            n = len(cap)
            fluxo = [[0] * n for _ in range(n)]

            def dfs(u, visitado, gargalo):  # procura um caminho aumentante em profundidade
                if u == t:
                    return gargalo
                visitado.add(u)
                for v in range(n):
                    folga = cap[u][v] - fluxo[u][v]
                    if v not in visitado and folga > 0:
                        enviado = dfs(v, visitado, min(gargalo, folga))
                        if enviado > 0:
                            fluxo[u][v] += enviado
                            fluxo[v][u] -= enviado  # aresta reversa: permite "desfazer" depois
                            return enviado
                return 0

            total = 0
            while True:
                enviado = dfs(s, set(), float("inf"))
                if enviado == 0:
                    return total
                total += enviado

        # vértices: s=0, a=1, b=2, c=3, d=4, t=5
        cap = [
            [0, 16, 13, 0, 0, 0],   # s
            [0, 0, 0, 12, 0, 0],    # a
            [0, 4, 0, 0, 14, 0],    # b
            [0, 0, 9, 0, 0, 20],    # c
            [0, 0, 0, 7, 0, 4],     # d
            [0, 0, 0, 0, 0, 0],     # t
        ]
        print(ford_fulkerson(cap, 0, 5))  # 23
      `,
      javascript: String.raw`
        function fordFulkerson(cap, s, t) {
          const n = cap.length;
          const fluxo = Array.from({ length: n }, () => new Array(n).fill(0));

          function dfs(u, visitado, gargalo) { // procura um caminho aumentante em profundidade
            if (u === t) return gargalo;
            visitado.add(u);
            for (let v = 0; v < n; v++) {
              const folga = cap[u][v] - fluxo[u][v];
              if (!visitado.has(v) && folga > 0) {
                const enviado = dfs(v, visitado, Math.min(gargalo, folga));
                if (enviado > 0) {
                  fluxo[u][v] += enviado;
                  fluxo[v][u] -= enviado; // aresta reversa: permite "desfazer" depois
                  return enviado;
                }
              }
            }
            return 0;
          }

          let total = 0;
          for (let enviado; (enviado = dfs(s, new Set(), Infinity)) > 0;) total += enviado;
          return total;
        }

        // vértices: s=0, a=1, b=2, c=3, d=4, t=5
        const cap = [
          [0, 16, 13, 0, 0, 0],  // s
          [0, 0, 0, 12, 0, 0],   // a
          [0, 4, 0, 0, 14, 0],   // b
          [0, 0, 9, 0, 0, 20],   // c
          [0, 0, 0, 7, 0, 4],    // d
          [0, 0, 0, 0, 0, 0],    // t
        ];
        console.log(fordFulkerson(cap, 0, 5)); // 23
      `,
      java: String.raw`
        public class FordFulkerson {
            static int[][] cap, fluxo;
            static boolean[] visitado;

            static int dfs(int u, int t, int gargalo) { // procura um caminho aumentante em profundidade
                if (u == t) return gargalo;
                visitado[u] = true;
                for (int v = 0; v < cap.length; v++) {
                    int folga = cap[u][v] - fluxo[u][v];
                    if (!visitado[v] && folga > 0) {
                        int enviado = dfs(v, t, Math.min(gargalo, folga));
                        if (enviado > 0) {
                            fluxo[u][v] += enviado;
                            fluxo[v][u] -= enviado; // aresta reversa: permite "desfazer" depois
                            return enviado;
                        }
                    }
                }
                return 0;
            }

            static int fordFulkerson(int s, int t) {
                fluxo = new int[cap.length][cap.length];
                int total = 0;
                while (true) {
                    visitado = new boolean[cap.length];
                    int enviado = dfs(s, t, Integer.MAX_VALUE);
                    if (enviado == 0) return total;
                    total += enviado;
                }
            }

            public static void main(String[] args) {
                // vértices: s=0, a=1, b=2, c=3, d=4, t=5
                cap = new int[][]{
                    {0, 16, 13, 0, 0, 0},  // s
                    {0, 0, 0, 12, 0, 0},   // a
                    {0, 4, 0, 0, 14, 0},   // b
                    {0, 0, 9, 0, 0, 20},   // c
                    {0, 0, 0, 7, 0, 4},    // d
                    {0, 0, 0, 0, 0, 0},    // t
                };
                System.out.println(fordFulkerson(0, 5)); // 23
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <climits>
        #include <iostream>
        #include <vector>
        using namespace std;

        vector<vector<int>> cap, fluxo;
        vector<bool> visitado;

        int dfs(int u, int t, int gargalo) { // procura um caminho aumentante em profundidade
            if (u == t) return gargalo;
            visitado[u] = true;
            for (int v = 0; v < (int)cap.size(); v++) {
                int folga = cap[u][v] - fluxo[u][v];
                if (!visitado[v] && folga > 0) {
                    int enviado = dfs(v, t, min(gargalo, folga));
                    if (enviado > 0) {
                        fluxo[u][v] += enviado;
                        fluxo[v][u] -= enviado; // aresta reversa: permite "desfazer" depois
                        return enviado;
                    }
                }
            }
            return 0;
        }

        int fordFulkerson(int s, int t) {
            int n = cap.size(), total = 0;
            fluxo.assign(n, vector<int>(n, 0));
            while (true) {
                visitado.assign(n, false);
                int enviado = dfs(s, t, INT_MAX);
                if (enviado == 0) return total;
                total += enviado;
            }
        }

        int main() {
            // vértices: s=0, a=1, b=2, c=3, d=4, t=5
            cap = {
                {0, 16, 13, 0, 0, 0},  // s
                {0, 0, 0, 12, 0, 0},   // a
                {0, 4, 0, 0, 14, 0},   // b
                {0, 0, 9, 0, 0, 20},   // c
                {0, 0, 0, 7, 0, 4},    // d
                {0, 0, 0, 0, 0, 0},    // t
            };
            cout << fordFulkerson(0, 5) << "\n"; // 23
        }
      `,
    },
  },
  {
    id: 'edmonds-karp',
    name: 'Algoritmo de Edmonds-Karp',
    difficulty: 'Avançado',
    facts: { 'Criado por': 'Jack Edmonds e Richard Karp', 'Ano': '1972', 'Antecedente': 'Yefim Dinitz (1970)', 'Busca usada': 'BFS (caminho mais curto)' },
    summary: 'Ford-Fulkerson usando sempre o caminho aumentante mais curto: tempo polinomial garantido.',
    description:
      'O algoritmo de Edmonds-Karp é uma implementação específica do Ford-Fulkerson: em vez de um caminho aumentante qualquer, usa sempre o que tem menos arestas, encontrado com uma busca em largura (BFS). Essa escolha simples garante que o número de aumentos seja no máximo O(V·E), independentemente das capacidades — e o tempo total fica O(V·E²). No exemplo, ele chega ao mesmo fluxo máximo de 23 usando menos caminhos que a versão com busca em profundidade.',
    complexity: { best: 'O(E)', average: 'O(V · E²)', worst: 'O(V · E²)', space: 'O(V + E)' },
    steps: [
      'Comece com fluxo zero em todas as arestas.',
      'Faça uma busca em largura a partir de s, usando só arestas com folga, até alcançar t.',
      'Se t não foi alcançado, o fluxo atual é máximo: termine.',
      'Percorra o caminho encontrado de t até s, calculando o gargalo (a menor folga).',
      'Envie o gargalo pelo caminho, atualizando as arestas diretas e reversas, e repita.',
    ],
    usedIn: ['Referência de fluxo máximo em bibliotecas e cursos', 'Emparelhamento bipartido', 'Alocação de recursos e escalonamento', 'Competições de programação', 'Base para algoritmos mais rápidos (Dinic)'],
    realWorld: [
      { title: 'Alocação de recursos', text: 'Distribuir pedidos entre centros de distribuição com capacidades limitadas, ou turnos entre funcionários disponíveis, pode ser modelado como fluxo máximo e resolvido com Edmonds-Karp em redes de tamanho moderado.' },
      { title: 'Competições de programação', text: 'Por ser curto, correto e ter tempo garantido, é uma das implementações de fluxo máximo mais usadas em maratonas de programação.' },
      { title: 'Planejamento de redes', text: 'Calcular quanto tráfego pode fluir entre dois data centers, considerando a capacidade de cada enlace, ajuda a decidir onde a rede precisa ser expandida.' },
    ],
    curiosities: [
      'Foi publicado por Jack Edmonds e Richard Karp em 1972. O soviético Yefim Dinitz havia publicado, em 1970, uma ideia semelhante — e ainda mais rápida, hoje conhecida como algoritmo de Dinic.',
      'Jack Edmonds foi um dos primeiros a defender, em um artigo de 1965 sobre emparelhamentos, que "algoritmo eficiente" deveria significar tempo polinomial — ideia central da teoria da complexidade.',
      'No visualizador, compare com o Ford-Fulkerson: a busca em largura evita caminhos longos e "tortos" e chega ao resultado com menos caminhos aumentantes.',
    ],
    code: {
      python: String.raw`
        from collections import deque

        def edmonds_karp(cap, s, t):
            n = len(cap)
            fluxo = [[0] * n for _ in range(n)]
            total = 0
            while True:
                pai = [-1] * n
                pai[s] = s
                fila = deque([s])
                while fila and pai[t] == -1:  # BFS: caminho com menos arestas
                    u = fila.popleft()
                    for v in range(n):
                        if pai[v] == -1 and cap[u][v] - fluxo[u][v] > 0:
                            pai[v] = u
                            fila.append(v)
                if pai[t] == -1:
                    return total  # não há mais caminho aumentante
                gargalo, v = float("inf"), t
                while v != s:  # menor folga ao longo do caminho
                    gargalo = min(gargalo, cap[pai[v]][v] - fluxo[pai[v]][v])
                    v = pai[v]
                v = t
                while v != s:  # envia o gargalo (e registra a aresta reversa)
                    fluxo[pai[v]][v] += gargalo
                    fluxo[v][pai[v]] -= gargalo
                    v = pai[v]
                total += gargalo

        # vértices: s=0, a=1, b=2, c=3, d=4, t=5
        cap = [
            [0, 16, 13, 0, 0, 0],   # s
            [0, 0, 0, 12, 0, 0],    # a
            [0, 4, 0, 0, 14, 0],    # b
            [0, 0, 9, 0, 0, 20],    # c
            [0, 0, 0, 7, 0, 4],     # d
            [0, 0, 0, 0, 0, 0],     # t
        ]
        print(edmonds_karp(cap, 0, 5))  # 23
      `,
      javascript: String.raw`
        function edmondsKarp(cap, s, t) {
          const n = cap.length;
          const fluxo = Array.from({ length: n }, () => new Array(n).fill(0));
          let total = 0;
          while (true) {
            const pai = new Array(n).fill(-1);
            pai[s] = s;
            const fila = [s];
            for (let h = 0; h < fila.length && pai[t] === -1; h++) { // BFS: caminho com menos arestas
              const u = fila[h];
              for (let v = 0; v < n; v++) {
                if (pai[v] === -1 && cap[u][v] - fluxo[u][v] > 0) { pai[v] = u; fila.push(v); }
              }
            }
            if (pai[t] === -1) return total; // não há mais caminho aumentante
            let gargalo = Infinity;
            for (let v = t; v !== s; v = pai[v]) gargalo = Math.min(gargalo, cap[pai[v]][v] - fluxo[pai[v]][v]);
            for (let v = t; v !== s; v = pai[v]) { // envia o gargalo (e registra a aresta reversa)
              fluxo[pai[v]][v] += gargalo;
              fluxo[v][pai[v]] -= gargalo;
            }
            total += gargalo;
          }
        }

        // vértices: s=0, a=1, b=2, c=3, d=4, t=5
        const cap = [
          [0, 16, 13, 0, 0, 0],  // s
          [0, 0, 0, 12, 0, 0],   // a
          [0, 4, 0, 0, 14, 0],   // b
          [0, 0, 9, 0, 0, 20],   // c
          [0, 0, 0, 7, 0, 4],    // d
          [0, 0, 0, 0, 0, 0],    // t
        ];
        console.log(edmondsKarp(cap, 0, 5)); // 23
      `,
      java: String.raw`
        import java.util.ArrayDeque;
        import java.util.Arrays;
        import java.util.Deque;

        public class EdmondsKarp {
            static int edmondsKarp(int[][] cap, int s, int t) {
                int n = cap.length, total = 0;
                int[][] fluxo = new int[n][n];
                while (true) {
                    int[] pai = new int[n];
                    Arrays.fill(pai, -1);
                    pai[s] = s;
                    Deque<Integer> fila = new ArrayDeque<>();
                    fila.add(s);
                    while (!fila.isEmpty() && pai[t] == -1) { // BFS: caminho com menos arestas
                        int u = fila.poll();
                        for (int v = 0; v < n; v++)
                            if (pai[v] == -1 && cap[u][v] - fluxo[u][v] > 0) { pai[v] = u; fila.add(v); }
                    }
                    if (pai[t] == -1) return total; // não há mais caminho aumentante
                    int gargalo = Integer.MAX_VALUE;
                    for (int v = t; v != s; v = pai[v]) gargalo = Math.min(gargalo, cap[pai[v]][v] - fluxo[pai[v]][v]);
                    for (int v = t; v != s; v = pai[v]) { // envia o gargalo (e registra a aresta reversa)
                        fluxo[pai[v]][v] += gargalo;
                        fluxo[v][pai[v]] -= gargalo;
                    }
                    total += gargalo;
                }
            }

            public static void main(String[] args) {
                // vértices: s=0, a=1, b=2, c=3, d=4, t=5
                int[][] cap = {
                    {0, 16, 13, 0, 0, 0},  // s
                    {0, 0, 0, 12, 0, 0},   // a
                    {0, 4, 0, 0, 14, 0},   // b
                    {0, 0, 9, 0, 0, 20},   // c
                    {0, 0, 0, 7, 0, 4},    // d
                    {0, 0, 0, 0, 0, 0},    // t
                };
                System.out.println(edmondsKarp(cap, 0, 5)); // 23
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <climits>
        #include <iostream>
        #include <queue>
        #include <vector>
        using namespace std;

        int edmondsKarp(const vector<vector<int>>& cap, int s, int t) {
            int n = cap.size(), total = 0;
            vector<vector<int>> fluxo(n, vector<int>(n, 0));
            while (true) {
                vector<int> pai(n, -1);
                pai[s] = s;
                queue<int> fila;
                fila.push(s);
                while (!fila.empty() && pai[t] == -1) { // BFS: caminho com menos arestas
                    int u = fila.front();
                    fila.pop();
                    for (int v = 0; v < n; v++)
                        if (pai[v] == -1 && cap[u][v] - fluxo[u][v] > 0) { pai[v] = u; fila.push(v); }
                }
                if (pai[t] == -1) return total; // não há mais caminho aumentante
                int gargalo = INT_MAX;
                for (int v = t; v != s; v = pai[v]) gargalo = min(gargalo, cap[pai[v]][v] - fluxo[pai[v]][v]);
                for (int v = t; v != s; v = pai[v]) { // envia o gargalo (e registra a aresta reversa)
                    fluxo[pai[v]][v] += gargalo;
                    fluxo[v][pai[v]] -= gargalo;
                }
                total += gargalo;
            }
        }

        int main() {
            // vértices: s=0, a=1, b=2, c=3, d=4, t=5
            vector<vector<int>> cap = {
                {0, 16, 13, 0, 0, 0},  // s
                {0, 0, 0, 12, 0, 0},   // a
                {0, 4, 0, 0, 14, 0},   // b
                {0, 0, 9, 0, 0, 20},   // c
                {0, 0, 0, 7, 0, 4},    // d
                {0, 0, 0, 0, 0, 0},    // t
            };
            cout << edmondsKarp(cap, 0, 5) << "\n"; // 23
        }
      `,
    },
  },
  {
    id: 'clarke-wright',
    name: 'Algoritmo das Economias (Clarke-Wright)',
    difficulty: 'Avançado',
    facts: { 'Criado por': 'G. Clarke e J. W. Wright', 'Ano': '1964', 'Problema': 'Roteamento de veículos (VRP)', 'Tipo': 'Heurística (não garante o ótimo)' },
    summary: 'Planeja rotas de entrega juntando, em ordem, os pares de clientes que mais economizam distância.',
    description:
      'O Algoritmo das Economias resolve de forma aproximada o problema de roteamento de veículos: caminhões com capacidade limitada saem de um depósito para atender clientes, e o objetivo é percorrer a menor distância total. Ele começa com uma rota separada para cada cliente e calcula, para cada par (i, j), quanto se economiza atendendo os dois na mesma viagem: s(i, j) = d(0, i) + d(0, j) − d(i, j). Depois une as rotas na ordem das maiores economias, desde que a carga caiba no caminhão. É uma heurística: rápida e boa, mas sem garantia de solução ótima.',
    complexity: { best: 'O(n² log n)', average: 'O(n² log n)', worst: 'O(n² log n)', space: 'O(n²)' },
    steps: [
      'Crie uma rota de ida e volta para cada cliente: depósito → cliente → depósito.',
      'Calcule a economia s(i, j) = d(0, i) + d(0, j) − d(i, j) para cada par de clientes.',
      'Ordene os pares da maior para a menor economia.',
      'Para cada par, se i e j estão nas pontas de rotas diferentes e a carga somada cabe no caminhão, una as duas rotas pela ligação i–j.',
      'Ao fim da lista, as rotas restantes formam o plano de entregas.',
    ],
    usedIn: ['Roteamento de veículos de entrega', 'Coleta de lixo e reciclagem', 'Transporte escolar', 'Distribuição de mercadorias e e-commerce', 'Ponto de partida para metaheurísticas'],
    realWorld: [
      { title: 'Entregas urbanas', text: 'Transportadoras e lojas online decidem, todos os dias, quantos veículos usar e em que ordem cada um visita os endereços. O Algoritmo das Economias gera um bom plano em frações de segundo.' },
      { title: 'Coleta de lixo', text: 'Prefeituras planejam rotas de caminhões de coleta com capacidade limitada, partindo e voltando ao mesmo pátio — exatamente o cenário do algoritmo.' },
      { title: 'Ponto de partida', text: 'Softwares de logística costumam usar a solução das economias como ponto de partida e depois a melhoram com buscas locais ou metaheurísticas.' },
    ],
    curiosities: [
      'Foi publicado em 1964 por G. Clarke e J. W. Wright e continua, décadas depois, entre as heurísticas de roteamento mais usadas.',
      'O roteamento de veículos é um problema NP-difícil — ele generaliza o problema do caixeiro-viajante —, por isso na prática se usam heurísticas como esta.',
      'No exemplo, as economias reduzem a distância total de 328 para 195, cerca de 40% a menos, usando 3 caminhões em vez de 8.',
    ],
    code: {
      python: String.raw`
        import math

        def clarke_wright(pontos, demanda, capacidade):
            def d(a, b):  # distância arredondada (pontos[0] é o depósito)
                dx, dy = pontos[a][0] - pontos[b][0], pontos[a][1] - pontos[b][1]
                return int(math.sqrt(dx * dx + dy * dy) / 10 + 0.5)

            clientes = range(1, len(pontos))
            rota = {c: [c] for c in clientes}  # a rota em que cada cliente está
            economias = [(d(0, i) + d(0, j) - d(i, j), i, j) for i in clientes for j in clientes if i < j]
            economias.sort(key=lambda e: -e[0])  # da maior para a menor economia
            for s, i, j in economias:
                ri, rj = rota[i], rota[j]
                if ri is rj or sum(demanda[c] for c in ri + rj) > capacidade:
                    continue
                # i precisa estar no fim da sua rota e j no início da dele (invertendo se preciso)
                if ri[-1] == i: esq = ri
                elif ri[0] == i: esq = ri[::-1]
                else: continue
                if rj[0] == j: dir_ = rj
                elif rj[-1] == j: dir_ = rj[::-1]
                else: continue
                nova = esq + dir_
                for c in nova:
                    rota[c] = nova
            rotas = []
            for c in clientes:
                if all(rota[c] is not r for r in rotas):
                    rotas.append(rota[c])
            custo = sum(d(0, r[0]) + d(r[-1], 0) + sum(d(a, b) for a, b in zip(r, r[1:])) for r in rotas)
            return rotas, custo

        pontos = [(320, 175), (110, 60), (230, 40), (420, 45), (560, 95), (560, 270), (400, 305), (210, 300), (70, 220)]
        demanda = [0, 4, 3, 5, 4, 3, 6, 4, 3]
        rotas, custo = clarke_wright(pontos, demanda, capacidade=12)
        for r in rotas:
            print("0-" + "-".join(map(str, r)) + "-0")
        print("custo total:", custo)
        # 0-8-1-2-0 / 0-3-4-5-0 / 0-6-7-0 / custo total: 195
      `,
      javascript: String.raw`
        function clarkeWright(pontos, demanda, capacidade) {
          const d = (a, b) => Math.round(Math.sqrt((pontos[a][0] - pontos[b][0]) ** 2 + (pontos[a][1] - pontos[b][1]) ** 2) / 10);
          const clientes = pontos.map((_, i) => i).slice(1); // pontos[0] é o depósito
          const rota = new Map(clientes.map(c => [c, [c]])); // a rota em que cada cliente está
          const economias = [];
          for (const i of clientes) for (const j of clientes) if (i < j) economias.push([d(0, i) + d(0, j) - d(i, j), i, j]);
          economias.sort((x, y) => y[0] - x[0]); // da maior para a menor economia
          for (const [, i, j] of economias) {
            const ri = rota.get(i), rj = rota.get(j);
            const carga = [...ri, ...rj].reduce((s, c) => s + demanda[c], 0);
            if (ri === rj || carga > capacidade) continue;
            // i precisa estar no fim da sua rota e j no início da dele (invertendo se preciso)
            const esq = ri.at(-1) === i ? ri : ri[0] === i ? [...ri].reverse() : null;
            const dir = rj[0] === j ? rj : rj.at(-1) === j ? [...rj].reverse() : null;
            if (!esq || !dir) continue;
            const nova = [...esq, ...dir];
            for (const c of nova) rota.set(c, nova);
          }
          const rotas = [...new Set(clientes.map(c => rota.get(c)))];
          const custo = rotas.reduce((s, r) => s + d(0, r[0]) + d(r.at(-1), 0) + r.slice(1).reduce((t, c, k) => t + d(r[k], c), 0), 0);
          return { rotas, custo };
        }

        const pontos = [[320, 175], [110, 60], [230, 40], [420, 45], [560, 95], [560, 270], [400, 305], [210, 300], [70, 220]];
        const demanda = [0, 4, 3, 5, 4, 3, 6, 4, 3];
        const { rotas, custo } = clarkeWright(pontos, demanda, 12);
        for (const r of rotas) console.log("0-" + r.join("-") + "-0");
        console.log("custo total:", custo);
        // 0-8-1-2-0 / 0-3-4-5-0 / 0-6-7-0 / custo total: 195
      `,
      java: String.raw`
        import java.util.*;

        public class ClarkeWright {
            static int[][] pontos = {{320, 175}, {110, 60}, {230, 40}, {420, 45}, {560, 95}, {560, 270}, {400, 305}, {210, 300}, {70, 220}};
            static int[] demanda = {0, 4, 3, 5, 4, 3, 6, 4, 3};

            static int d(int a, int b) { // distância arredondada (pontos[0] é o depósito)
                double dx = pontos[a][0] - pontos[b][0], dy = pontos[a][1] - pontos[b][1];
                return (int) (Math.sqrt(dx * dx + dy * dy) / 10 + 0.5);
            }

            public static void main(String[] args) {
                int n = pontos.length, capacidade = 12;
                List<List<Integer>> rota = new ArrayList<>(); // a rota em que cada cliente está
                for (int c = 0; c < n; c++) rota.add(new ArrayList<>(List.of(c)));

                List<int[]> economias = new ArrayList<>();
                for (int i = 1; i < n; i++)
                    for (int j = i + 1; j < n; j++) economias.add(new int[]{d(0, i) + d(0, j) - d(i, j), i, j});
                economias.sort((x, y) -> y[0] - x[0]); // da maior para a menor economia (estável)

                for (int[] e : economias) {
                    int i = e[1], j = e[2];
                    List<Integer> ri = rota.get(i), rj = rota.get(j);
                    if (ri == rj) continue;
                    int carga = 0;
                    for (int c : ri) carga += demanda[c];
                    for (int c : rj) carga += demanda[c];
                    if (carga > capacidade) continue;
                    // i precisa estar no fim da sua rota e j no início da dele (invertendo se preciso)
                    List<Integer> esq = new ArrayList<>(ri), dir = new ArrayList<>(rj);
                    if (esq.get(esq.size() - 1) != i) { if (esq.get(0) == i) Collections.reverse(esq); else continue; }
                    if (dir.get(0) != j) { if (dir.get(dir.size() - 1) == j) Collections.reverse(dir); else continue; }
                    esq.addAll(dir);
                    for (int c : esq) rota.set(c, esq);
                }

                int custo = 0;
                Set<List<Integer>> vistas = Collections.newSetFromMap(new IdentityHashMap<>());
                for (int c = 1; c < n; c++) {
                    List<Integer> r = rota.get(c);
                    if (!vistas.add(r)) continue;
                    StringBuilder sb = new StringBuilder("0");
                    for (int x : r) sb.append('-').append(x);
                    System.out.println(sb.append("-0"));
                    custo += d(0, r.get(0)) + d(r.get(r.size() - 1), 0);
                    for (int k = 1; k < r.size(); k++) custo += d(r.get(k - 1), r.get(k));
                }
                System.out.println("custo total: " + custo);
                // 0-8-1-2-0 / 0-3-4-5-0 / 0-6-7-0 / custo total: 195
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <array>
        #include <cmath>
        #include <iostream>
        #include <memory>
        #include <set>
        #include <vector>
        using namespace std;

        const int pontos[][2] = {{320, 175}, {110, 60}, {230, 40}, {420, 45}, {560, 95}, {560, 270}, {400, 305}, {210, 300}, {70, 220}};
        const int demanda[] = {0, 4, 3, 5, 4, 3, 6, 4, 3};

        int d(int a, int b) { // distância arredondada (pontos[0] é o depósito)
            double dx = pontos[a][0] - pontos[b][0], dy = pontos[a][1] - pontos[b][1];
            return (int)(sqrt(dx * dx + dy * dy) / 10 + 0.5);
        }

        int main() {
            int n = 9, capacidade = 12;
            using Rota = shared_ptr<vector<int>>;
            vector<Rota> rota(n); // a rota em que cada cliente está
            for (int c = 0; c < n; c++) rota[c] = make_shared<vector<int>>(vector<int>{c});

            vector<array<int, 3>> economias;
            for (int i = 1; i < n; i++)
                for (int j = i + 1; j < n; j++) economias.push_back({d(0, i) + d(0, j) - d(i, j), i, j});
            stable_sort(economias.begin(), economias.end(), [](auto& x, auto& y) { return x[0] > y[0]; });

            for (auto [s, i, j] : economias) {
                Rota ri = rota[i], rj = rota[j];
                if (ri == rj) continue;
                int carga = 0;
                for (int c : *ri) carga += demanda[c];
                for (int c : *rj) carga += demanda[c];
                if (carga > capacidade) continue;
                // i precisa estar no fim da sua rota e j no início da dele (invertendo se preciso)
                vector<int> esq = *ri, dir = *rj;
                if (esq.back() != i) { if (esq.front() == i) reverse(esq.begin(), esq.end()); else continue; }
                if (dir.front() != j) { if (dir.back() == j) reverse(dir.begin(), dir.end()); else continue; }
                esq.insert(esq.end(), dir.begin(), dir.end());
                Rota nova = make_shared<vector<int>>(esq);
                for (int c : esq) rota[c] = nova;
            }

            int custo = 0;
            set<Rota> vistas;
            for (int c = 1; c < n; c++) {
                Rota r = rota[c];
                if (!vistas.insert(r).second) continue;
                cout << "0";
                for (int x : *r) cout << "-" << x;
                cout << "-0\n";
                custo += d(0, r->front()) + d(r->back(), 0);
                for (size_t k = 1; k < r->size(); k++) custo += d((*r)[k - 1], (*r)[k]);
            }
            cout << "custo total: " << custo << "\n"; // 0-8-1-2-0 / 0-3-4-5-0 / 0-6-7-0 / custo total: 195
        }
      `,
    },
  },
  {
    id: 'force-directed',
    name: 'Desenho de Grafos por Molas',
    difficulty: 'Avançado',
    facts: { 'Modelo mostrado': 'Fruchterman-Reingold (1991)', 'Precursor': 'Peter Eades (1984)', 'Tipo': 'Simulação física iterativa' },
    summary: 'Desenha um grafo simulando física: vértices se repelem e arestas puxam como molas.',
    description:
      'Os algoritmos de desenho dirigido por forças ("spring-based") posicionam os vértices de um grafo simulando um sistema físico: todos os vértices se repelem, como cargas elétricas, e cada aresta atrai suas pontas, como uma mola. A simulação avança passo a passo, com uma "temperatura" que limita o deslocamento e diminui com o tempo, até o sistema se acomodar em equilíbrio. O resultado costuma ser um desenho harmonioso, com arestas de tamanho parecido e poucas sobreposições — sem que ninguém posicione nada à mão. (Na complexidade, I é o número de iterações.)',
    complexity: { best: 'O(I · (V² + E))', average: 'O(I · (V² + E))', worst: 'O(I · (V² + E))', space: 'O(V)' },
    steps: [
      'Posicione os vértices aleatoriamente.',
      'Para cada par de vértices, calcule uma força de repulsão proporcional a k²/d, em que k é a distância ideal e d a distância atual.',
      'Para cada aresta, calcule uma força de atração proporcional a d²/k, puxando as pontas uma em direção à outra.',
      'Mova cada vértice na direção da força resultante, limitando o deslocamento pela temperatura atual.',
      'Diminua a temperatura e repita até o movimento ficar desprezível.',
    ],
    usedIn: ['Visualização de redes sociais', 'D3.js (d3-force), Gephi e Graphviz (fdp)', 'Mapas de dependências de software', 'Bioinformática (redes de proteínas)', 'Grafos de conhecimento'],
    realWorld: [
      { title: 'Redes sociais', text: 'Visualizações de redes de amizade ou de seguidores usam layouts de forças: grupos muito conectados se aproximam naturalmente e formam "comunidades" visíveis. Experimente o grafo "Duas comunidades".' },
      { title: 'Ferramentas de visualização', text: 'O D3.js (d3-force), o Gephi (ForceAtlas2) e o Graphviz (fdp) implementam variações desse modelo para desenhar grafos interativos e diagramas de dependências.' },
      { title: 'Biologia', text: 'Redes de interação entre proteínas, com milhares de vértices, são exploradas visualmente com layouts de forças em ferramentas como o Cytoscape.' },
    ],
    curiosities: [
      'Peter Eades propôs o modelo de molas em 1984; Thomas Fruchterman e Edward Reingold o refinaram em 1991, com as forças k²/d e d²/k e a ideia de "temperatura", inspirada no recozimento simulado.',
      'Nenhuma regra diz "desenhe um cubo como um cubo": a forma aparece sozinha, porque é um arranjo de baixa energia. Escolha o grafo "Cubo" na visualização e veja.',
      'Com n vértices, a repulsão entre todos os pares custa O(n²) por passo. Para grafos enormes, usa-se a aproximação de Barnes-Hut, emprestada das simulações de gravitação da astronomia.',
    ],
    code: {
      python: String.raw`
        import math

        def fruchterman_reingold(n, arestas, passos=200, largura=600, altura=400):
            k = math.sqrt(largura * altura / n)  # distância "ideal" entre vértices
            pos = [[50 + (i * 37) % 500, 50 + (i * 91) % 300] for i in range(n)]  # início fixo (reprodutível)
            temp = largura / 10
            for _ in range(passos):
                desloc = [[0.0, 0.0] for _ in range(n)]
                for i in range(n):  # repulsão entre todos os pares
                    for j in range(i + 1, n):
                        dx, dy = pos[i][0] - pos[j][0], pos[i][1] - pos[j][1]
                        d = max(math.sqrt(dx * dx + dy * dy), 0.01)
                        f = k * k / d
                        desloc[i][0] += dx / d * f
                        desloc[i][1] += dy / d * f
                        desloc[j][0] -= dx / d * f
                        desloc[j][1] -= dy / d * f
                for a, b in arestas:  # atração ao longo das arestas (molas)
                    dx, dy = pos[a][0] - pos[b][0], pos[a][1] - pos[b][1]
                    d = max(math.sqrt(dx * dx + dy * dy), 0.01)
                    f = d * d / k
                    desloc[a][0] -= dx / d * f
                    desloc[a][1] -= dy / d * f
                    desloc[b][0] += dx / d * f
                    desloc[b][1] += dy / d * f
                for i in range(n):  # move, limitado pela temperatura
                    dx, dy = desloc[i]
                    d = max(math.sqrt(dx * dx + dy * dy), 0.01)
                    passo = min(d, temp)
                    pos[i][0] += dx / d * passo
                    pos[i][1] += dy / d * passo
                temp *= 0.95  # "esfria"
            return pos

        cubo = [(0, 1), (1, 2), (2, 3), (3, 0), (4, 5), (5, 6), (6, 7), (7, 4), (0, 4), (1, 5), (2, 6), (3, 7)]
        pos = fruchterman_reingold(8, cubo)
        media = sum(math.dist(pos[a], pos[b]) for a, b in cubo) / len(cubo)
        print(f"comprimento médio das arestas: {media:.1f}")  # 227.5
      `,
      javascript: String.raw`
        function fruchtermanReingold(n, arestas, passos = 200, largura = 600, altura = 400) {
          const k = Math.sqrt((largura * altura) / n); // distância "ideal" entre vértices
          const pos = Array.from({ length: n }, (_, i) => [50 + ((i * 37) % 500), 50 + ((i * 91) % 300)]); // início fixo
          let temp = largura / 10;
          for (let p = 0; p < passos; p++) {
            const desloc = Array.from({ length: n }, () => [0, 0]);
            for (let i = 0; i < n; i++) { // repulsão entre todos os pares
              for (let j = i + 1; j < n; j++) {
                const dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1];
                const d = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
                const f = (k * k) / d;
                desloc[i][0] += (dx / d) * f; desloc[i][1] += (dy / d) * f;
                desloc[j][0] -= (dx / d) * f; desloc[j][1] -= (dy / d) * f;
              }
            }
            for (const [a, b] of arestas) { // atração ao longo das arestas (molas)
              const dx = pos[a][0] - pos[b][0], dy = pos[a][1] - pos[b][1];
              const d = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
              const f = (d * d) / k;
              desloc[a][0] -= (dx / d) * f; desloc[a][1] -= (dy / d) * f;
              desloc[b][0] += (dx / d) * f; desloc[b][1] += (dy / d) * f;
            }
            for (let i = 0; i < n; i++) { // move, limitado pela temperatura
              const [dx, dy] = desloc[i];
              const d = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
              const passo = Math.min(d, temp);
              pos[i][0] += (dx / d) * passo;
              pos[i][1] += (dy / d) * passo;
            }
            temp *= 0.95; // "esfria"
          }
          return pos;
        }

        const cubo = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
        const pos = fruchtermanReingold(8, cubo);
        const media = cubo.reduce((s, [a, b]) => s + Math.sqrt((pos[a][0] - pos[b][0]) ** 2 + (pos[a][1] - pos[b][1]) ** 2), 0) / cubo.length;
        console.log("comprimento médio das arestas:", media.toFixed(1)); // 227.5
      `,
      java: String.raw`
        import java.util.Locale;

        public class FruchtermanReingold {
            static double[][] layout(int n, int[][] arestas, int passos, double largura, double altura) {
                double k = Math.sqrt(largura * altura / n); // distância "ideal" entre vértices
                double[][] pos = new double[n][2];
                for (int i = 0; i < n; i++) { pos[i][0] = 50 + (i * 37) % 500; pos[i][1] = 50 + (i * 91) % 300; } // início fixo
                double temp = largura / 10;
                for (int p = 0; p < passos; p++) {
                    double[][] desloc = new double[n][2];
                    for (int i = 0; i < n; i++) { // repulsão entre todos os pares
                        for (int j = i + 1; j < n; j++) {
                            double dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1];
                            double d = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
                            double f = k * k / d;
                            desloc[i][0] += dx / d * f; desloc[i][1] += dy / d * f;
                            desloc[j][0] -= dx / d * f; desloc[j][1] -= dy / d * f;
                        }
                    }
                    for (int[] a : arestas) { // atração ao longo das arestas (molas)
                        double dx = pos[a[0]][0] - pos[a[1]][0], dy = pos[a[0]][1] - pos[a[1]][1];
                        double d = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
                        double f = d * d / k;
                        desloc[a[0]][0] -= dx / d * f; desloc[a[0]][1] -= dy / d * f;
                        desloc[a[1]][0] += dx / d * f; desloc[a[1]][1] += dy / d * f;
                    }
                    for (int i = 0; i < n; i++) { // move, limitado pela temperatura
                        double dx = desloc[i][0], dy = desloc[i][1];
                        double d = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
                        double passo = Math.min(d, temp);
                        pos[i][0] += dx / d * passo;
                        pos[i][1] += dy / d * passo;
                    }
                    temp *= 0.95; // "esfria"
                }
                return pos;
            }

            public static void main(String[] args) {
                int[][] cubo = {{0, 1}, {1, 2}, {2, 3}, {3, 0}, {4, 5}, {5, 6}, {6, 7}, {7, 4}, {0, 4}, {1, 5}, {2, 6}, {3, 7}};
                double[][] pos = layout(8, cubo, 200, 600, 400);
                double soma = 0;
                for (int[] a : cubo) soma += Math.sqrt(Math.pow(pos[a[0]][0] - pos[a[1]][0], 2) + Math.pow(pos[a[0]][1] - pos[a[1]][1], 2));
                System.out.println(String.format(Locale.ROOT, "comprimento médio das arestas: %.1f", soma / cubo.length)); // 227.5
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <array>
        #include <cmath>
        #include <cstdio>
        #include <vector>
        using namespace std;

        vector<array<double, 2>> layout(int n, const vector<array<int, 2>>& arestas, int passos, double largura, double altura) {
            double k = sqrt(largura * altura / n); // distância "ideal" entre vértices
            vector<array<double, 2>> pos(n);
            for (int i = 0; i < n; i++) pos[i] = {50.0 + (i * 37) % 500, 50.0 + (i * 91) % 300}; // início fixo
            double temp = largura / 10;
            for (int p = 0; p < passos; p++) {
                vector<array<double, 2>> desloc(n, {0, 0});
                for (int i = 0; i < n; i++) { // repulsão entre todos os pares
                    for (int j = i + 1; j < n; j++) {
                        double dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1];
                        double d = max(sqrt(dx * dx + dy * dy), 0.01), f = k * k / d;
                        desloc[i][0] += dx / d * f; desloc[i][1] += dy / d * f;
                        desloc[j][0] -= dx / d * f; desloc[j][1] -= dy / d * f;
                    }
                }
                for (auto [a, b] : arestas) { // atração ao longo das arestas (molas)
                    double dx = pos[a][0] - pos[b][0], dy = pos[a][1] - pos[b][1];
                    double d = max(sqrt(dx * dx + dy * dy), 0.01), f = d * d / k;
                    desloc[a][0] -= dx / d * f; desloc[a][1] -= dy / d * f;
                    desloc[b][0] += dx / d * f; desloc[b][1] += dy / d * f;
                }
                for (int i = 0; i < n; i++) { // move, limitado pela temperatura
                    double dx = desloc[i][0], dy = desloc[i][1];
                    double d = max(sqrt(dx * dx + dy * dy), 0.01), passo = min(d, temp);
                    pos[i][0] += dx / d * passo;
                    pos[i][1] += dy / d * passo;
                }
                temp *= 0.95; // "esfria"
            }
            return pos;
        }

        int main() {
            vector<array<int, 2>> cubo = {{0, 1}, {1, 2}, {2, 3}, {3, 0}, {4, 5}, {5, 6}, {6, 7}, {7, 4}, {0, 4}, {1, 5}, {2, 6}, {3, 7}};
            auto pos = layout(8, cubo, 200, 600, 400);
            double soma = 0;
            for (auto [a, b] : cubo) soma += hypot(pos[a][0] - pos[b][0], pos[a][1] - pos[b][1]);
            printf("comprimento médio das arestas: %.1f\n", soma / cubo.size()); // 227.5
        }
      `,
    },
  },
]
