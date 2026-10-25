export default [
  {
    id: 'shoelace-formula',
    name: 'Área de Polígono (Fórmula do Laço)',
    difficulty: 'Iniciante',
    en: { name: 'Shoelace Formula (Polygon Area)', summary: 'Computes the area of any simple polygon from its vertex coordinates with one cross-multiplying sum.' },
    facts: { 'Também chamada': 'Fórmula de Gauss; fórmula do agrimensor', 'Descrita por': 'Albrecht Meister (1769); Gauss (1795)', 'Custo': 'O(n)', 'Requer': 'Polígono simples (sem autointerseção)' },
    summary: 'Calcula a área de qualquer polígono simples a partir das coordenadas dos vértices, com uma única soma "cruzada".',
    description:
      'A fórmula do laço (shoelace) calcula a área de um polígono simples — convexo ou não — só com as coordenadas dos vértices em ordem: A = ½ |Σ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)|. O nome vem do padrão de multiplicações cruzadas, que lembra o cadarço de um sapato. Cada termo é o dobro da área, com sinal, do triângulo formado pela origem e por uma aresta: arestas que "andam" no sentido anti-horário somam, e as que voltam no sentido horário subtraem. As partes fora do polígono se cancelam, e sobra exatamente a área. O sinal do resultado ainda revela a orientação dos vértices — positivo para anti-horário, negativo para horário.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Liste os vértices em ordem (horária ou anti-horária) ao longo do contorno.',
      'Para cada aresta (xᵢ, yᵢ) → (xᵢ₊₁, yᵢ₊₁), calcule xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ; a última aresta volta ao primeiro vértice.',
      'Some todos os termos.',
      'A área é o valor absoluto da soma dividido por 2; o sinal indica a orientação (positivo = anti-horário).',
    ],
    usedIn: ['Sistemas de informação geográfica (área de terrenos e regiões)', 'Agrimensura e cadastro de imóveis', 'Computação gráfica (orientação de faces, backface culling)', 'Teste de orientação de polígonos em bibliotecas de geometria', 'Centroide e momentos de figuras planas'],
    realWorld: [
      { title: 'Mapas e terrenos', text: 'Programas de SIG, como o QGIS, e serviços de mapas calculam a área de lotes, municípios e reservas a partir dos vértices do contorno — com a fórmula do laço aplicada a coordenadas projetadas.' },
      { title: 'Qual lado é a frente', text: 'Motores 3D usam o sinal da área de um triângulo projetado na tela para saber se ele está de frente ou de costas para a câmera e descartar as faces de trás (backface culling).' },
      { title: 'Bibliotecas de geometria', text: 'Para garantir que polígonos tenham a orientação esperada (por exemplo, contorno externo anti-horário e furos horários, como exige o GeoJSON), bibliotecas verificam o sinal da fórmula do laço.' },
    ],
    curiosities: [
      'A fórmula aparece em um trabalho de Albrecht Ludwig Friedrich Meister de 1769 e foi usada por Gauss — por isso também é chamada de fórmula de área de Gauss.',
      'Para polígonos com vértices inteiros, o teorema de Pick liga a área à contagem de pontos: A = I + B/2 − 1, onde I são os pontos inteiros internos e B os da borda.',
      'Se o polígono se cruzar (como uma estrela de 5 pontas desenhada sem tirar o lápis), a fórmula dá um resultado "estranho": as regiões contam com pesos diferentes, conforme quantas vezes o contorno gira ao redor delas.',
    ],
    code: {
      python: String.raw`
        def area_poligono(vertices):
            soma = 0
            n = len(vertices)
            for i in range(n):
                x1, y1 = vertices[i]
                x2, y2 = vertices[(i + 1) % n]   # a última aresta volta ao primeiro vértice
                soma += x1 * y2 - x2 * y1
            return abs(soma) / 2

        print(f"{area_poligono([(1, 1), (5, 1), (6, 4), (3, 6), (0, 4)]):.1f}")  # 21.0
      `,
      javascript: String.raw`
        function areaPoligono(vertices) {
          let soma = 0;
          for (let i = 0; i < vertices.length; i++) {
            const [x1, y1] = vertices[i];
            const [x2, y2] = vertices[(i + 1) % vertices.length]; // a última aresta volta ao primeiro vértice
            soma += x1 * y2 - x2 * y1;
          }
          return Math.abs(soma) / 2;
        }

        console.log(areaPoligono([[1, 1], [5, 1], [6, 4], [3, 6], [0, 4]]).toFixed(1)); // 21.0
      `,
      java: String.raw`
        import java.util.Locale;

        public class AreaPoligono {
            static double area(double[][] v) {
                double soma = 0;
                for (int i = 0; i < v.length; i++) {
                    double[] a = v[i], b = v[(i + 1) % v.length]; // a última aresta volta ao primeiro vértice
                    soma += a[0] * b[1] - b[0] * a[1];
                }
                return Math.abs(soma) / 2;
            }

            public static void main(String[] args) {
                double[][] poligono = {{1, 1}, {5, 1}, {6, 4}, {3, 6}, {0, 4}};
                System.out.println(String.format(Locale.ROOT, "%.1f", area(poligono))); // 21.0
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>
        #include <utility>
        #include <vector>
        using namespace std;

        double area(const vector<pair<double, double>>& v) {
            double soma = 0;
            for (size_t i = 0; i < v.size(); i++) {
                auto [x1, y1] = v[i];
                auto [x2, y2] = v[(i + 1) % v.size()]; // a última aresta volta ao primeiro vértice
                soma += x1 * y2 - x2 * y1;
            }
            return fabs(soma) / 2;
        }

        int main() {
            printf("%.1f\n", area({{1, 1}, {5, 1}, {6, 4}, {3, 6}, {0, 4}})); // 21.0
        }
      `,
    },
  },
  {
    id: 'segment-intersection',
    name: 'Interseção de Segmentos',
    difficulty: 'Iniciante',
    en: { name: 'Segment Intersection', summary: 'Decides whether two line segments cross using only orientation tests — the sign of a cross product.' },
    facts: { 'Ideia central': 'Teste de orientação (produto vetorial)', 'Custo': 'O(1)', 'Usa divisão': 'Não (só para achar o ponto)', 'Base de': 'Envoltórios, varredura de Bentley-Ottmann, ponto no polígono' },
    summary: 'Decide se dois segmentos se cruzam usando só testes de orientação — o sinal de um produto vetorial.',
    description:
      'Saber se dois segmentos se cruzam é a operação mais básica da geometria computacional. A solução elegante usa o teste de orientação: o sinal do produto vetorial (b − a) × (c − a) diz se o ponto c está à esquerda, à direita ou sobre a reta que vai de a até b. Dois segmentos p1q1 e p2q2 se cruzam quando p2 e q2 estão em lados opostos da reta p1q1 e, ao mesmo tempo, p1 e q1 estão em lados opostos da reta p2q2. Se algum teste der zero, os pontos são colineares, e basta verificar se o ponto está dentro dos limites do outro segmento. Com coordenadas inteiras, tudo é feito com somas e multiplicações exatas, sem divisões nem erros de arredondamento.',
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    steps: [
      'Defina orientação(a, b, c) = (bₓ − aₓ)(c_y − a_y) − (b_y − a_y)(cₓ − aₓ): positivo = à esquerda (anti-horário), negativo = à direita, zero = colinear.',
      'Calcule o1 = orientação(p1, q1, p2) e o2 = orientação(p1, q1, q2).',
      'Calcule o3 = orientação(p2, q2, p1) e o4 = orientação(p2, q2, q1).',
      'Se o1 e o2 têm sinais diferentes e o3 e o4 também, os segmentos se cruzam.',
      'Casos especiais: se uma orientação é zero e o ponto está dentro do retângulo do outro segmento, eles se tocam.',
    ],
    usedIn: ['Detecção de colisão em jogos', 'Validação de polígonos (autointerseção) em SIG', 'Varredura de Bentley-Ottmann', 'Roteamento de placas de circuito e CAD', 'Robótica (planejamento de caminhos)'],
    realWorld: [
      { title: 'Jogos', text: 'Para saber se um projétil atravessou uma parede entre dois quadros da animação, o jogo testa se o segmento percorrido pelo projétil cruza o segmento da parede — mesmo que ele "pule" a parede em um único quadro.' },
      { title: 'Mapas', text: 'Ao importar limites de municípios ou lotes, sistemas de SIG verificam se as arestas de um polígono se cruzam; polígonos inválidos quebram cálculos de área e de interseção.' },
      { title: 'Circuitos impressos', text: 'Programas de projeto de placas verificam se trilhas de cobre se cruzam ou ficam próximas demais — milhões de testes de interseção a cada verificação de regras.' },
    ],
    curiosities: [
      'O teste de orientação é tão central que bibliotecas como a CGAL usam aritmética exata ou adaptativa (os "predicados robustos" de Jonathan Shewchuk) só para ele, porque um sinal errado por arredondamento pode quebrar algoritmos inteiros.',
      'Para descobrir se algum par entre n segmentos se cruza, o algoritmo de Shamos-Hoey (1976) usa uma linha de varredura e resolve em O(n log n), sem testar todos os pares.',
      'O mesmo produto vetorial dá a área do triângulo (dividida por 2): é a ponte entre a fórmula do laço e o teste de orientação.',
    ],
    code: {
      python: String.raw`
        def orientacao(a, b, c):
            return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

        def no_segmento(p, q, r):  # r colinear: está dentro do retângulo de p e q?
            return min(p[0], q[0]) <= r[0] <= max(p[0], q[0]) and min(p[1], q[1]) <= r[1] <= max(p[1], q[1])

        def se_cruzam(p1, q1, p2, q2):
            o1, o2 = orientacao(p1, q1, p2), orientacao(p1, q1, q2)
            o3, o4 = orientacao(p2, q2, p1), orientacao(p2, q2, q1)
            if (o1 > 0) != (o2 > 0) and (o3 > 0) != (o4 > 0) and 0 not in (o1, o2, o3, o4):
                return True  # caso geral: lados opostos
            return ((o1 == 0 and no_segmento(p1, q1, p2)) or (o2 == 0 and no_segmento(p1, q1, q2)) or
                    (o3 == 0 and no_segmento(p2, q2, p1)) or (o4 == 0 and no_segmento(p2, q2, q1)))

        print("sim" if se_cruzam((0, 0), (4, 4), (0, 4), (4, 0)) else "não")  # sim
        print("sim" if se_cruzam((0, 0), (2, 2), (3, 3), (5, 1)) else "não")  # não
        print("sim" if se_cruzam((0, 0), (4, 0), (2, 0), (6, 0)) else "não")  # sim (colineares)
      `,
      javascript: String.raw`
        const orientacao = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

        // r colinear: está dentro do retângulo de p e q?
        const noSegmento = (p, q, r) =>
          Math.min(p[0], q[0]) <= r[0] && r[0] <= Math.max(p[0], q[0]) && Math.min(p[1], q[1]) <= r[1] && r[1] <= Math.max(p[1], q[1]);

        function seCruzam(p1, q1, p2, q2) {
          const o1 = orientacao(p1, q1, p2), o2 = orientacao(p1, q1, q2);
          const o3 = orientacao(p2, q2, p1), o4 = orientacao(p2, q2, q1);
          if (o1 * o2 < 0 && o3 * o4 < 0) return true; // caso geral: lados opostos
          return (o1 === 0 && noSegmento(p1, q1, p2)) || (o2 === 0 && noSegmento(p1, q1, q2)) ||
                 (o3 === 0 && noSegmento(p2, q2, p1)) || (o4 === 0 && noSegmento(p2, q2, q1));
        }

        console.log(seCruzam([0, 0], [4, 4], [0, 4], [4, 0]) ? "sim" : "não"); // sim
        console.log(seCruzam([0, 0], [2, 2], [3, 3], [5, 1]) ? "sim" : "não"); // não
        console.log(seCruzam([0, 0], [4, 0], [2, 0], [6, 0]) ? "sim" : "não"); // sim (colineares)
      `,
      java: String.raw`
        public class InterseccaoSegmentos {
            static long orientacao(long[] a, long[] b, long[] c) {
                return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
            }

            static boolean noSegmento(long[] p, long[] q, long[] r) { // r colinear: dentro do retângulo de p e q?
                return Math.min(p[0], q[0]) <= r[0] && r[0] <= Math.max(p[0], q[0])
                    && Math.min(p[1], q[1]) <= r[1] && r[1] <= Math.max(p[1], q[1]);
            }

            static boolean seCruzam(long[] p1, long[] q1, long[] p2, long[] q2) {
                long o1 = Long.signum(orientacao(p1, q1, p2)), o2 = Long.signum(orientacao(p1, q1, q2));
                long o3 = Long.signum(orientacao(p2, q2, p1)), o4 = Long.signum(orientacao(p2, q2, q1));
                if (o1 * o2 < 0 && o3 * o4 < 0) return true; // caso geral: lados opostos
                return (o1 == 0 && noSegmento(p1, q1, p2)) || (o2 == 0 && noSegmento(p1, q1, q2))
                    || (o3 == 0 && noSegmento(p2, q2, p1)) || (o4 == 0 && noSegmento(p2, q2, q1));
            }

            static long[] p(long x, long y) { return new long[]{x, y}; }

            public static void main(String[] args) {
                System.out.println(seCruzam(p(0, 0), p(4, 4), p(0, 4), p(4, 0)) ? "sim" : "não"); // sim
                System.out.println(seCruzam(p(0, 0), p(2, 2), p(3, 3), p(5, 1)) ? "sim" : "não"); // não
                System.out.println(seCruzam(p(0, 0), p(4, 0), p(2, 0), p(6, 0)) ? "sim" : "não"); // sim (colineares)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        using namespace std;

        struct P { long long x, y; };

        long long orientacao(P a, P b, P c) { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }
        int sinal(long long v) { return (v > 0) - (v < 0); }

        bool noSegmento(P p, P q, P r) { // r colinear: dentro do retângulo de p e q?
            return min(p.x, q.x) <= r.x && r.x <= max(p.x, q.x) && min(p.y, q.y) <= r.y && r.y <= max(p.y, q.y);
        }

        bool seCruzam(P p1, P q1, P p2, P q2) {
            int o1 = sinal(orientacao(p1, q1, p2)), o2 = sinal(orientacao(p1, q1, q2));
            int o3 = sinal(orientacao(p2, q2, p1)), o4 = sinal(orientacao(p2, q2, q1));
            if (o1 * o2 < 0 && o3 * o4 < 0) return true; // caso geral: lados opostos
            return (o1 == 0 && noSegmento(p1, q1, p2)) || (o2 == 0 && noSegmento(p1, q1, q2)) ||
                   (o3 == 0 && noSegmento(p2, q2, p1)) || (o4 == 0 && noSegmento(p2, q2, q1));
        }

        int main() {
            cout << (seCruzam({0, 0}, {4, 4}, {0, 4}, {4, 0}) ? "sim" : "não") << "\n"; // sim
            cout << (seCruzam({0, 0}, {2, 2}, {3, 3}, {5, 1}) ? "sim" : "não") << "\n"; // não
            cout << (seCruzam({0, 0}, {4, 0}, {2, 0}, {6, 0}) ? "sim" : "não") << "\n"; // sim (colineares)
        }
      `,
    },
  },
  {
    id: 'flood-fill',
    name: 'Preenchimento por Inundação (Flood Fill)',
    difficulty: 'Iniciante',
    en: { name: 'Flood Fill', summary: 'Fills a connected region of same-colored pixels starting from a seed — the paint bucket tool.' },
    facts: { 'Também chamado': 'Balde de tinta; seed fill', 'Estrutura': 'Fila (BFS) ou pilha (DFS)', 'Vizinhança': '4 ou 8 vizinhos', 'Usado em': 'Editores de imagem, jogos, segmentação' },
    summary: 'Preenche uma região conectada de pixels da mesma cor a partir de uma semente — a ferramenta "balde de tinta".',
    description:
      'O preenchimento por inundação (flood fill) pinta todos os pixels conectados à semente que têm a mesma cor que ela. A partir do pixel inicial, a nova cor se espalha para os vizinhos de mesma cor original — como água que se espalha até encontrar paredes. Na prática, é uma busca em largura (com fila) ou em profundidade (com pilha) sobre a grade de pixels, considerada como um grafo. A versão com 4 vizinhos (cima, baixo, esquerda, direita) não atravessa diagonais; a de 8 vizinhos atravessa. Implementações reais evitam a recursão, que estoura a pilha em regiões grandes, e preenchem trechos horizontais inteiros de uma vez (scanline fill).',
    complexity: { best: 'O(1)', average: 'O(área da região)', worst: 'O(L × A) pixels da imagem', space: 'O(L × A)' },
    steps: [
      'Guarde a cor original da semente; se ela já for a cor nova, não há nada a fazer.',
      'Pinte a semente e coloque-a em uma fila.',
      'Retire um pixel da fila e examine seus vizinhos (4 ou 8).',
      'Cada vizinho dentro da imagem e com a cor original é pintado e entra na fila.',
      'Repita até a fila esvaziar: toda a região conectada foi pintada.',
    ],
    usedIn: ['Ferramenta "balde de tinta" (Paint, Photoshop, GIMP)', 'Jogos (Campo Minado, Go, Puyo Puyo)', 'Segmentação de imagens e "varinha mágica"', 'Contagem de componentes conexos (ilhas)', 'Mapas de navegação em jogos e robótica'],
    realWorld: [
      { title: 'Balde de tinta', text: 'A ferramenta de preenchimento de qualquer editor de imagens é um flood fill — às vezes com uma tolerância, que trata cores "parecidas" com a original como iguais.' },
      { title: 'Campo Minado', text: 'Ao clicar em uma casa sem minas por perto, o jogo abre de uma vez toda a área vazia conectada: é um flood fill que para nas casas com números.' },
      { title: 'Go', text: 'Para saber se um grupo de pedras foi capturado, programas de Go fazem um flood fill no grupo e verificam se sobrou alguma "liberdade" (casa vazia vizinha).' },
    ],
    curiosities: [
      'A versão recursiva ingênua, com uma chamada por vizinho, estoura a pilha em imagens comuns: uma região de 1000 × 1000 pixels pode exigir um milhão de chamadas aninhadas.',
      'Com 8 vizinhos, a tinta "vaza" por paredes diagonais de 1 pixel — linhas desenhadas com Bresenham, por exemplo. Por isso a escolha da vizinhança depende de como as bordas foram desenhadas.',
      'O mesmo algoritmo conta ilhas em um mapa: cada vez que um flood fill começa em uma célula de terra ainda não visitada, há uma ilha nova.',
    ],
    code: {
      python: String.raw`
        from collections import deque

        def flood_fill(grade, x, y, nova):
            grade = [list(linha) for linha in grade]
            original = grade[y][x]
            if original == nova:
                return grade
            grade[y][x] = nova
            fila = deque([(x, y)])
            while fila:
                cx, cy = fila.popleft()
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):  # 4 vizinhos
                    if 0 <= ny < len(grade) and 0 <= nx < len(grade[0]) and grade[ny][nx] == original:
                        grade[ny][nx] = nova
                        fila.append((nx, ny))
            return grade

        imagem = ["##########",
                  "#....#...#",
                  "#....#...#",
                  "#.####...#",
                  "#.#..#...#",
                  "#.####...#",
                  "#........#",
                  "##########"]
        for linha in flood_fill(imagem, 1, 1, "~"):
            print("".join(linha))
        # ##########
        # #~~~~#~~~#
        # #~~~~#~~~#
        # #~####~~~#
        # #~#..#~~~#
        # #~####~~~#
        # #~~~~~~~~#
        # ##########
      `,
      javascript: String.raw`
        function floodFill(grade, x, y, nova) {
          const g = grade.map(linha => [...linha]);
          const original = g[y][x];
          if (original === nova) return g;
          g[y][x] = nova;
          const fila = [[x, y]];
          for (let i = 0; i < fila.length; i++) { // fila: o índice i avança em vez de remover
            const [cx, cy] = fila[i];
            for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) { // 4 vizinhos
              if (ny >= 0 && ny < g.length && nx >= 0 && nx < g[0].length && g[ny][nx] === original) {
                g[ny][nx] = nova;
                fila.push([nx, ny]);
              }
            }
          }
          return g;
        }

        const imagem = ["##########", "#....#...#", "#....#...#", "#.####...#", "#.#..#...#", "#.####...#", "#........#", "##########"];
        for (const linha of floodFill(imagem, 1, 1, "~")) console.log(linha.join(""));
        // ##########
        // #~~~~#~~~#
        // #~~~~#~~~#
        // #~####~~~#
        // #~#..#~~~#
        // #~####~~~#
        // #~~~~~~~~#
        // ##########
      `,
      java: String.raw`
        import java.util.ArrayDeque;

        public class FloodFill {
            static void preencher(char[][] g, int x, int y, char nova) {
                char original = g[y][x];
                if (original == nova) return;
                g[y][x] = nova;
                ArrayDeque<int[]> fila = new ArrayDeque<>();
                fila.add(new int[]{x, y});
                int[][] passos = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}}; // 4 vizinhos
                while (!fila.isEmpty()) {
                    int[] c = fila.poll();
                    for (int[] p : passos) {
                        int nx = c[0] + p[0], ny = c[1] + p[1];
                        if (ny >= 0 && ny < g.length && nx >= 0 && nx < g[0].length && g[ny][nx] == original) {
                            g[ny][nx] = nova;
                            fila.add(new int[]{nx, ny});
                        }
                    }
                }
            }

            public static void main(String[] args) {
                String[] imagem = {"##########", "#....#...#", "#....#...#", "#.####...#", "#.#..#...#", "#.####...#", "#........#", "##########"};
                char[][] g = new char[imagem.length][];
                for (int i = 0; i < imagem.length; i++) g[i] = imagem[i].toCharArray();
                preencher(g, 1, 1, '~');
                for (char[] linha : g) System.out.println(new String(linha));
                // ##########
                // #~~~~#~~~#
                // #~~~~#~~~#
                // #~####~~~#
                // #~#..#~~~#
                // #~####~~~#
                // #~~~~~~~~#
                // ##########
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <queue>
        #include <string>
        #include <utility>
        #include <vector>
        using namespace std;

        void preencher(vector<string>& g, int x, int y, char nova) {
            char original = g[y][x];
            if (original == nova) return;
            g[y][x] = nova;
            queue<pair<int, int>> fila;
            fila.push({x, y});
            int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1}; // 4 vizinhos
            while (!fila.empty()) {
                auto [cx, cy] = fila.front();
                fila.pop();
                for (int k = 0; k < 4; k++) {
                    int nx = cx + dx[k], ny = cy + dy[k];
                    if (ny >= 0 && ny < (int)g.size() && nx >= 0 && nx < (int)g[0].size() && g[ny][nx] == original) {
                        g[ny][nx] = nova;
                        fila.push({nx, ny});
                    }
                }
            }
        }

        int main() {
            vector<string> imagem = {"##########", "#....#...#", "#....#...#", "#.####...#", "#.#..#...#", "#.####...#", "#........#", "##########"};
            preencher(imagem, 1, 1, '~');
            for (const string& linha : imagem) cout << linha << "\n";
            // ##########
            // #~~~~#~~~#
            // #~~~~#~~~#
            // #~####~~~#
            // #~#..#~~~#
            // #~####~~~#
            // #~~~~~~~~#
            // ##########
        }
      `,
    },
  },
  {
    id: 'point-in-polygon',
    name: 'Ponto no Polígono',
    difficulty: 'Intermediário',
    en: { name: 'Point in Polygon', summary: 'Shoots a ray from the point and counts how many edges it crosses: odd means inside, even means outside.' },
    facts: { 'Também chamado': 'Lançamento de raio; regra par-ímpar', 'Princípio': 'Teorema da curva de Jordan', 'Custo': 'O(n) por consulta', 'Alternativa': 'Número de voltas (winding number)' },
    summary: 'Lança um raio a partir do ponto e conta quantas arestas ele cruza: ímpar = dentro, par = fora.',
    description:
      'Para saber se um ponto está dentro de um polígono qualquer — convexo ou não —, o algoritmo de lançamento de raio traça uma semirreta a partir do ponto (por exemplo, horizontal para a direita) e conta quantas vezes ela cruza as arestas. Cada cruzamento alterna entre "dentro" e "fora"; como longe o bastante a semirreta está fora, um número ímpar de cruzamentos significa que o ponto está dentro. É o teorema da curva de Jordan aplicado na prática. O cuidado está nos casos de borda: quando o raio passa exatamente por um vértice, a regra "conta a aresta só se um extremo estiver estritamente acima" evita contar o mesmo cruzamento duas vezes.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Trace uma semirreta horizontal partindo do ponto (x, y) para a direita.',
      'Para cada aresta (a, b), verifique se ela atravessa a altura y: um extremo acima de y e o outro não.',
      'Se atravessa, calcule o x em que a aresta cruza a altura y.',
      'Se esse x está à direita do ponto, o raio cruza a aresta: alterne o estado "dentro".',
      'No fim, dentro se o número de cruzamentos for ímpar.',
    ],
    usedIn: ['SIG e geocodificação (em qual bairro/país está a coordenada?)', 'Interfaces gráficas (o clique caiu em qual forma?)', 'Jogos (zonas, gatilhos e regiões)', 'Rasterização e preenchimento de polígonos (regra par-ímpar)', 'Geofencing em aplicativos de transporte e entrega'],
    realWorld: [
      { title: 'Em que lugar estou?', text: 'Quando um aplicativo descobre em que cidade, zona eleitoral ou área de entrega está uma coordenada de GPS, ele testa o ponto contra os polígonos das regiões — primeiro filtrando pelos retângulos envolventes e depois com o lançamento de raio.' },
      { title: 'Cliques na tela', text: 'Em mapas interativos e editores vetoriais, saber qual forma foi clicada é um teste de ponto no polígono para cada forma candidata.' },
      { title: 'Preenchimento de formas', text: 'A regra "par-ímpar" (even-odd) do SVG e do Canvas decide quais regiões de um caminho que se cruza são pintadas — exatamente a mesma contagem de cruzamentos.' },
    ],
    curiosities: [
      'A versão em C mais copiada do algoritmo, a PNPOLY de W. Randolph Franklin, tem só 7 linhas e é a mesma lógica do código desta página.',
      'O teorema da curva de Jordan — toda curva fechada simples divide o plano em "dentro" e "fora" — parece óbvio, mas sua prova rigorosa é surpreendentemente difícil; a primeira considerada completa é de Oswald Veblen, em 1905.',
      'Para polígonos que se cruzam, a regra par-ímpar e a do número de voltas (nonzero) dão respostas diferentes — é por isso que o SVG oferece as duas opções em fill-rule.',
    ],
    code: {
      python: String.raw`
        def dentro(poligono, px, py):
            resultado = False
            j = len(poligono) - 1
            for i in range(len(poligono)):
                xi, yi = poligono[i]
                xj, yj = poligono[j]
                if (yi > py) != (yj > py):                       # a aresta atravessa a altura do ponto
                    x_cruza = (xj - xi) * (py - yi) / (yj - yi) + xi
                    if px < x_cruza:                             # cruza o raio que vai para a direita
                        resultado = not resultado
                j = i
            return resultado

        poligono = [(0, 0), (6, 0), (6, 6), (3, 3), (0, 6)]  # um "M" visto de cabeça para baixo
        for p in [(1, 1), (3, 5), (5, 4), (7, 1)]:
            print("dentro" if dentro(poligono, *p) else "fora")
        # dentro
        # fora
        # dentro
        # fora
      `,
      javascript: String.raw`
        function dentro(poligono, px, py) {
          let resultado = false;
          for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
            const [xi, yi] = poligono[i], [xj, yj] = poligono[j];
            if ((yi > py) !== (yj > py)) { // a aresta atravessa a altura do ponto
              const xCruza = ((xj - xi) * (py - yi)) / (yj - yi) + xi;
              if (px < xCruza) resultado = !resultado; // cruza o raio que vai para a direita
            }
          }
          return resultado;
        }

        const poligono = [[0, 0], [6, 0], [6, 6], [3, 3], [0, 6]]; // um "M" visto de cabeça para baixo
        for (const [x, y] of [[1, 1], [3, 5], [5, 4], [7, 1]]) console.log(dentro(poligono, x, y) ? "dentro" : "fora");
        // dentro
        // fora
        // dentro
        // fora
      `,
      java: String.raw`
        public class PontoNoPoligono {
            static boolean dentro(double[][] poligono, double px, double py) {
                boolean resultado = false;
                for (int i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
                    double xi = poligono[i][0], yi = poligono[i][1], xj = poligono[j][0], yj = poligono[j][1];
                    if ((yi > py) != (yj > py)) { // a aresta atravessa a altura do ponto
                        double xCruza = (xj - xi) * (py - yi) / (yj - yi) + xi;
                        if (px < xCruza) resultado = !resultado; // cruza o raio que vai para a direita
                    }
                }
                return resultado;
            }

            public static void main(String[] args) {
                double[][] poligono = {{0, 0}, {6, 0}, {6, 6}, {3, 3}, {0, 6}}; // um "M" visto de cabeça para baixo
                for (double[] p : new double[][]{{1, 1}, {3, 5}, {5, 4}, {7, 1}})
                    System.out.println(dentro(poligono, p[0], p[1]) ? "dentro" : "fora");
                // dentro
                // fora
                // dentro
                // fora
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <utility>
        #include <vector>
        using namespace std;

        bool dentro(const vector<pair<double, double>>& poligono, double px, double py) {
            bool resultado = false;
            for (size_t i = 0, j = poligono.size() - 1; i < poligono.size(); j = i++) {
                auto [xi, yi] = poligono[i];
                auto [xj, yj] = poligono[j];
                if ((yi > py) != (yj > py)) { // a aresta atravessa a altura do ponto
                    double xCruza = (xj - xi) * (py - yi) / (yj - yi) + xi;
                    if (px < xCruza) resultado = !resultado; // cruza o raio que vai para a direita
                }
            }
            return resultado;
        }

        int main() {
            vector<pair<double, double>> poligono = {{0, 0}, {6, 0}, {6, 6}, {3, 3}, {0, 6}}; // um "M" de cabeça para baixo
            for (auto [x, y] : vector<pair<double, double>>{{1, 1}, {3, 5}, {5, 4}, {7, 1}})
                cout << (dentro(poligono, x, y) ? "dentro" : "fora") << "\n";
            // dentro
            // fora
            // dentro
            // fora
        }
      `,
    },
  },
  {
    id: 'gift-wrapping',
    name: 'Embrulho para Presente (Jarvis)',
    difficulty: 'Intermediário',
    en: { name: 'Gift Wrapping (Jarvis March)', summary: 'Builds the convex hull by wrapping the points like a string: from each hull vertex, pick the point that leaves all others on one side.' },
    facts: { 'Criado por': 'R. A. Jarvis (2D); Chand e Kapur (geral)', 'Ano': '1973; 1970', 'Também chamado': 'Marcha de Jarvis', 'Custo': 'O(n·h) — sensível à saída' },
    summary: 'Constrói o envoltório convexo "embrulhando" os pontos com um barbante: de cada vértice, escolhe o ponto que deixa todos os outros de um lado só.',
    description:
      'O envoltório convexo de um conjunto de pontos é o menor polígono convexo que contém todos eles — a forma de um elástico esticado ao redor de pregos. O algoritmo do embrulho para presente (marcha de Jarvis) começa no ponto mais à esquerda, que certamente está no envoltório. A partir do vértice atual p, ele procura o ponto q tal que todos os outros fiquem à esquerda da reta p → q; para isso, mantém um candidato e o troca sempre que encontra um ponto à direita dele (teste de orientação). Então q vira o novo vértice, e o processo continua até voltar ao início. O custo é O(n·h), onde h é o número de vértices do envoltório: ótimo quando h é pequeno, ruim quando quase todos os pontos estão na borda.',
    complexity: { best: 'O(n) (h constante)', average: 'O(n·h)', worst: 'O(n²)', space: 'O(h)' },
    steps: [
      'Comece no ponto mais à esquerda (em empate, o mais baixo): ele está no envoltório.',
      'A partir do vértice atual p, escolha qualquer outro ponto como candidato q.',
      'Para cada ponto r, se r está à direita de p → q (ou colinear e mais longe), r vira o novo candidato.',
      'Ao fim da passada, q é o próximo vértice do envoltório. Faça p = q.',
      'Repita até voltar ao ponto inicial.',
    ],
    usedIn: ['Envoltórios com poucos vértices (sensível à saída)', 'Base do algoritmo de Chan (O(n log h))', 'Detecção de colisão (formas convexas)', 'Robótica e planejamento de movimento', 'Ensino de geometria computacional'],
    realWorld: [
      { title: 'Colisão em jogos', text: 'Motores de física aproximam objetos complexos por envoltórios convexos, para os quais existem testes de colisão rápidos (como o GJK).' },
      { title: 'Análise de dados geográficos', text: 'O envoltório convexo de ocorrências (casos de uma doença, avistamentos de uma espécie) é a forma mais simples de estimar a área ocupada — usado, por exemplo, nas avaliações de risco de extinção da IUCN.' },
      { title: 'Algoritmo de Chan', text: 'O algoritmo de Chan (1996) combina Graham em pequenos grupos com passos de embrulho para presente entre os grupos e atinge O(n log h), o melhor possível.' },
    ],
    curiosities: [
      'O nome vem da imagem de embrulhar um presente: o papel (ou barbante) gira em volta do conjunto, encostando nos pontos mais externos um a um.',
      'Em 3D, o mesmo princípio — "girar" um plano em torno de uma aresta até encostar no próximo ponto — foi proposto por Chand e Kapur em 1970, antes da versão 2D de Jarvis.',
      'Se os pontos forem gerados uniformemente dentro de um círculo, o envoltório tem em média cerca de n^(1/3) vértices; dentro de um quadrado, só O(log n) — o que torna o Jarvis bem rápido na prática.',
    ],
    code: {
      python: String.raw`
        def orientacao(o, a, b):
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

        def dist2(a, b):
            return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

        def jarvis(pontos):
            inicio = min(pontos)  # mais à esquerda (empate: mais baixo)
            envoltorio, p = [], inicio
            while True:
                envoltorio.append(p)
                q = pontos[0] if pontos[0] != p else pontos[1]
                for r in pontos:
                    o = orientacao(p, q, r)
                    if o < 0 or (o == 0 and dist2(p, r) > dist2(p, q)):  # r à direita de p→q
                        q = r
                p = q
                if p == inicio:
                    return envoltorio

        pontos = [(0, 3), (1, 1), (2, 2), (4, 4), (0, 0), (1, 2), (3, 1), (3, 3)]
        print(" ".join(f"({x}, {y})" for x, y in jarvis(pontos)))  # (0, 0) (3, 1) (4, 4) (0, 3)
      `,
      javascript: String.raw`
        const orientacao = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

        function jarvis(pontos) {
          const inicio = pontos.reduce((m, p) => (p[0] < m[0] || (p[0] === m[0] && p[1] < m[1]) ? p : m)); // mais à esquerda
          const envoltorio = [];
          let p = inicio;
          do {
            envoltorio.push(p);
            let q = pontos[0] !== p ? pontos[0] : pontos[1];
            for (const r of pontos) {
              const o = orientacao(p, q, r);
              if (o < 0 || (o === 0 && dist2(p, r) > dist2(p, q))) q = r; // r à direita de p→q
            }
            p = q;
          } while (p !== inicio);
          return envoltorio;
        }

        const pontos = [[0, 3], [1, 1], [2, 2], [4, 4], [0, 0], [1, 2], [3, 1], [3, 3]];
        console.log(jarvis(pontos).map(([x, y]) => "(" + x + ", " + y + ")").join(" ")); // (0, 0) (3, 1) (4, 4) (0, 3)
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class Jarvis {
            static long orientacao(int[] o, int[] a, int[] b) {
                return (long) (a[0] - o[0]) * (b[1] - o[1]) - (long) (a[1] - o[1]) * (b[0] - o[0]);
            }

            static long dist2(int[] a, int[] b) {
                return (long) (a[0] - b[0]) * (a[0] - b[0]) + (long) (a[1] - b[1]) * (a[1] - b[1]);
            }

            static List<int[]> jarvis(int[][] pontos) {
                int[] inicio = pontos[0];
                for (int[] p : pontos) if (p[0] < inicio[0] || (p[0] == inicio[0] && p[1] < inicio[1])) inicio = p; // mais à esquerda
                List<int[]> envoltorio = new ArrayList<>();
                int[] p = inicio;
                do {
                    envoltorio.add(p);
                    int[] q = pontos[0] != p ? pontos[0] : pontos[1];
                    for (int[] r : pontos) {
                        long o = orientacao(p, q, r);
                        if (o < 0 || (o == 0 && dist2(p, r) > dist2(p, q))) q = r; // r à direita de p→q
                    }
                    p = q;
                } while (p != inicio);
                return envoltorio;
            }

            public static void main(String[] args) {
                int[][] pontos = {{0, 3}, {1, 1}, {2, 2}, {4, 4}, {0, 0}, {1, 2}, {3, 1}, {3, 3}};
                StringBuilder sb = new StringBuilder();
                for (int[] p : jarvis(pontos)) sb.append("(").append(p[0]).append(", ").append(p[1]).append(") ");
                System.out.println(sb.toString().trim()); // (0, 0) (3, 1) (4, 4) (0, 3)
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        struct P { long long x, y; };

        long long orientacao(P o, P a, P b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
        long long dist2(P a, P b) { return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y); }

        vector<P> jarvis(const vector<P>& pontos) {
            size_t inicio = 0; // mais à esquerda (empate: mais baixo)
            for (size_t i = 1; i < pontos.size(); i++)
                if (pontos[i].x < pontos[inicio].x || (pontos[i].x == pontos[inicio].x && pontos[i].y < pontos[inicio].y)) inicio = i;
            vector<P> envoltorio;
            size_t p = inicio;
            do {
                envoltorio.push_back(pontos[p]);
                size_t q = (p + 1) % pontos.size();
                for (size_t r = 0; r < pontos.size(); r++) {
                    long long o = orientacao(pontos[p], pontos[q], pontos[r]);
                    if (o < 0 || (o == 0 && dist2(pontos[p], pontos[r]) > dist2(pontos[p], pontos[q]))) q = r; // à direita de p→q
                }
                p = q;
            } while (p != inicio);
            return envoltorio;
        }

        int main() {
            vector<P> pontos = {{0, 3}, {1, 1}, {2, 2}, {4, 4}, {0, 0}, {1, 2}, {3, 1}, {3, 3}};
            for (P p : jarvis(pontos)) cout << "(" << p.x << ", " << p.y << ") ";
            cout << "\n"; // (0, 0) (3, 1) (4, 4) (0, 3)
        }
      `,
    },
  },
  {
    id: 'graham-scan',
    name: 'Varredura de Graham',
    difficulty: 'Intermediário',
    en: { name: 'Graham Scan', summary: 'Sorts the points by angle around the lowest one and sweeps them with a stack, discarding every right turn — O(n log n).' },
    facts: { 'Criado por': 'Ronald Graham', 'Ano': '1972', 'Estrutura': 'Pilha', 'Custo': 'O(n log n)', 'Variante': 'Cadeia monótona de Andrew (1979)' },
    summary: 'Ordena os pontos pelo ângulo em torno do mais baixo e os percorre com uma pilha, descartando toda curva à direita — O(n log n).',
    description:
      'A Varredura de Graham calcula o envoltório convexo em O(n log n), o que é ótimo no pior caso. Ela escolhe como pivô o ponto mais baixo e ordena os demais pelo ângulo que formam com ele. Depois percorre os pontos nessa ordem mantendo uma pilha com o envoltório parcial: antes de empilhar um ponto, verifica se os dois últimos da pilha e o novo ponto fazem uma curva à esquerda. Se fizerem uma curva à direita (ou seguirem em linha reta), o topo da pilha não pode ser vértice do envoltório e é removido — e a verificação se repete. Cada ponto entra e sai da pilha no máximo uma vez, então a varredura é linear; o custo total vem da ordenação.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    steps: [
      'Escolha como pivô o ponto mais baixo (em empate, o mais à esquerda).',
      'Ordene os outros pontos pelo ângulo polar em relação ao pivô (com produtos vetoriais, sem trigonometria); empates pela distância.',
      'Empilhe o pivô e percorra os pontos ordenados.',
      'Para cada ponto p, enquanto os dois do topo e p fizerem uma curva à direita (ou reta), desempilhe.',
      'Empilhe p. No fim, a pilha contém o envoltório em sentido anti-horário.',
    ],
    usedIn: ['Bibliotecas de geometria (CGAL, Shapely, scipy.spatial)', 'Visão computacional (contornos e defeitos de convexidade, OpenCV)', 'Detecção de colisão', 'Diâmetro e largura de conjuntos (rotating calipers)', 'Cartografia e agrupamento de pontos'],
    realWorld: [
      { title: 'Reconhecer gestos da mão', text: 'No OpenCV, um exemplo clássico conta dedos levantados: calcula o envoltório convexo do contorno da mão e mede os "defeitos de convexidade" — os vãos entre os dedos.' },
      { title: 'Medidas de formas', text: 'O diâmetro de um conjunto de pontos (o par mais distante) está sempre no envoltório convexo; depois de calculá-lo, a técnica dos "calibradores giratórios" encontra o diâmetro em tempo linear.' },
      { title: 'Ciência de dados', text: 'O envoltório convexo ajuda a desenhar contornos de grupos em gráficos de dispersão e a detectar pontos fora da curva (os que ficam nas "camadas" externas).' },
    ],
    curiosities: [
      'Ronald Graham criou o algoritmo em 1972 a pedido dos Bell Labs, que precisavam calcular envoltórios de cerca de 10 mil pontos — algo lento demais com os métodos da época.',
      'Graham também era malabarista (chegou a presidir a Associação Internacional de Malabaristas) e é o autor do "número de Graham", por muito tempo o maior número usado em uma prova matemática.',
      'A variante de Andrew (cadeia monótona) ordena por x em vez de ângulo e monta a parte de baixo e a de cima separadamente — é a versão preferida em competições de programação.',
    ],
    code: {
      python: String.raw`
        from functools import cmp_to_key

        def orientacao(o, a, b):
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

        def graham(pontos):
            pivo = min(pontos, key=lambda p: (p[1], p[0]))  # mais baixo (empate: mais à esquerda)
            def por_angulo(a, b):
                o = orientacao(pivo, a, b)
                if o != 0:
                    return -1 if o > 0 else 1
                return ((a[0] - pivo[0]) ** 2 + (a[1] - pivo[1]) ** 2) - ((b[0] - pivo[0]) ** 2 + (b[1] - pivo[1]) ** 2)
            pilha = [pivo]
            for p in sorted((q for q in pontos if q != pivo), key=cmp_to_key(por_angulo)):
                while len(pilha) >= 2 and orientacao(pilha[-2], pilha[-1], p) <= 0:
                    pilha.pop()  # curva à direita (ou reta): o topo não é vértice
                pilha.append(p)
            return pilha

        pontos = [(0, 3), (1, 1), (2, 2), (4, 4), (0, 0), (1, 2), (3, 1), (3, 3)]
        print(" ".join(f"({x}, {y})" for x, y in graham(pontos)))  # (0, 0) (3, 1) (4, 4) (0, 3)
      `,
      javascript: String.raw`
        const orientacao = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

        function graham(pontos) {
          const pivo = pontos.reduce((m, p) => (p[1] < m[1] || (p[1] === m[1] && p[0] < m[0]) ? p : m)); // mais baixo
          const d2 = p => (p[0] - pivo[0]) ** 2 + (p[1] - pivo[1]) ** 2;
          const ordenados = pontos.filter(p => p !== pivo).sort((a, b) => -orientacao(pivo, a, b) || d2(a) - d2(b));
          const pilha = [pivo];
          for (const p of ordenados) {
            while (pilha.length >= 2 && orientacao(pilha.at(-2), pilha.at(-1), p) <= 0) pilha.pop(); // curva à direita
            pilha.push(p);
          }
          return pilha;
        }

        const pontos = [[0, 3], [1, 1], [2, 2], [4, 4], [0, 0], [1, 2], [3, 1], [3, 3]];
        console.log(graham(pontos).map(([x, y]) => "(" + x + ", " + y + ")").join(" ")); // (0, 0) (3, 1) (4, 4) (0, 3)
      `,
      java: String.raw`
        import java.util.ArrayDeque;
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.Deque;
        import java.util.List;

        public class Graham {
            static long orientacao(int[] o, int[] a, int[] b) {
                return (long) (a[0] - o[0]) * (b[1] - o[1]) - (long) (a[1] - o[1]) * (b[0] - o[0]);
            }

            static List<int[]> graham(int[][] pontos) {
                int[] pivo = pontos[0];
                for (int[] p : pontos) if (p[1] < pivo[1] || (p[1] == pivo[1] && p[0] < pivo[0])) pivo = p; // mais baixo
                final int[] pv = pivo;
                int[][] resto = Arrays.stream(pontos).filter(p -> p != pv).toArray(int[][]::new);
                Arrays.sort(resto, (a, b) -> {
                    long o = orientacao(pv, a, b);
                    if (o != 0) return o > 0 ? -1 : 1;
                    long da = (long) (a[0] - pv[0]) * (a[0] - pv[0]) + (long) (a[1] - pv[1]) * (a[1] - pv[1]);
                    long db = (long) (b[0] - pv[0]) * (b[0] - pv[0]) + (long) (b[1] - pv[1]) * (b[1] - pv[1]);
                    return Long.compare(da, db);
                });
                List<int[]> pilha = new ArrayList<>(List.of(pivo));
                for (int[] p : resto) {
                    while (pilha.size() >= 2 && orientacao(pilha.get(pilha.size() - 2), pilha.get(pilha.size() - 1), p) <= 0)
                        pilha.remove(pilha.size() - 1); // curva à direita (ou reta): o topo não é vértice
                    pilha.add(p);
                }
                return pilha;
            }

            public static void main(String[] args) {
                int[][] pontos = {{0, 3}, {1, 1}, {2, 2}, {4, 4}, {0, 0}, {1, 2}, {3, 1}, {3, 3}};
                StringBuilder sb = new StringBuilder();
                for (int[] p : graham(pontos)) sb.append("(").append(p[0]).append(", ").append(p[1]).append(") ");
                System.out.println(sb.toString().trim()); // (0, 0) (3, 1) (4, 4) (0, 3)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <vector>
        using namespace std;

        struct P { long long x, y; };

        long long orientacao(P o, P a, P b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }

        vector<P> graham(vector<P> pontos) {
            auto menor = min_element(pontos.begin(), pontos.end(), [](P a, P b) { return a.y != b.y ? a.y < b.y : a.x < b.x; });
            swap(*menor, pontos[0]); // pivô: o mais baixo (empate: mais à esquerda)
            P pivo = pontos[0];
            auto d2 = [&](P p) { return (p.x - pivo.x) * (p.x - pivo.x) + (p.y - pivo.y) * (p.y - pivo.y); };
            sort(pontos.begin() + 1, pontos.end(), [&](P a, P b) {
                long long o = orientacao(pivo, a, b);
                return o != 0 ? o > 0 : d2(a) < d2(b);
            });
            vector<P> pilha = {pivo};
            for (size_t i = 1; i < pontos.size(); i++) {
                while (pilha.size() >= 2 && orientacao(pilha[pilha.size() - 2], pilha.back(), pontos[i]) <= 0)
                    pilha.pop_back(); // curva à direita (ou reta): o topo não é vértice
                pilha.push_back(pontos[i]);
            }
            return pilha;
        }

        int main() {
            vector<P> pontos = {{0, 3}, {1, 1}, {2, 2}, {4, 4}, {0, 0}, {1, 2}, {3, 1}, {3, 3}};
            for (P p : graham(pontos)) cout << "(" << p.x << ", " << p.y << ") ";
            cout << "\n"; // (0, 0) (3, 1) (4, 4) (0, 3)
        }
      `,
    },
  },
  {
    id: 'bresenham-line',
    name: 'Linha de Bresenham',
    difficulty: 'Intermediário',
    en: { name: "Bresenham's Line Algorithm", summary: 'Draws a straight line on a pixel grid using only integer additions — no multiplication, no floating point.' },
    facts: { 'Criado por': 'Jack Elton Bresenham (IBM)', 'Ano': '1962 (publicado em 1965)', 'Usa ponto flutuante': 'Não — só somas inteiras', 'Usado em': 'Plotters, placas de vídeo, bibliotecas gráficas' },
    summary: 'Desenha uma reta em uma grade de pixels usando só somas de inteiros — sem multiplicações nem números decimais.',
    description:
      'Uma tela é uma grade de pixels, e uma reta ideal quase nunca passa exatamente pelo centro deles. O algoritmo de Bresenham escolhe, a cada passo, o pixel mais próximo da reta ideal. Para uma reta mais "deitada" que inclinada, ele anda um pixel em x por vez e decide se também sobe um em y. Em vez de calcular y = m·x + b com números decimais, mantém um termo de erro inteiro que mede a distância (escalada) entre a reta ideal e o pixel escolhido: a cada passo, soma dy ao erro e, quando ele ultrapassa um limite, avança em y e subtrai dx. A versão mostrada aqui, de Alois Zingl, trata todos os octantes com o mesmo laço. O resultado é exato, rápido e fácil de implementar em hardware.',
    complexity: { best: 'O(n)', average: 'O(n) — n = max(|dx|, |dy|)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Calcule dx = |x₁ − x₀|, dy = −|y₁ − y₀| e os sentidos sx e sy (+1 ou −1).',
      'Inicie o erro com err = dx + dy.',
      'Acenda o pixel atual; se chegou ao fim, pare.',
      'Calcule e2 = 2·err. Se e2 ≥ dy, avance em x (err += dy). Se e2 ≤ dx, avance em y (err += dx).',
      'Repita. Só somas, comparações e uma multiplicação por 2 (um deslocamento de bit).',
    ],
    usedIn: ['Rasterização de linhas em bibliotecas gráficas e GPUs', 'Plotters e impressoras', 'Jogos 2D e emuladores', 'Visão em grade (linha de visada em roguelikes)', 'Movimento de motores de passo em CNC e impressoras 3D'],
    realWorld: [
      { title: 'Plotters da IBM', text: 'Bresenham criou o algoritmo em 1962 na IBM para controlar um plotter digital Calcomp, que só sabia mover a caneta um passo por vez na horizontal, na vertical ou na diagonal.' },
      { title: 'Impressoras 3D e CNC', text: 'Firmwares como o Marlin e o GRBL usam a mesma ideia para coordenar vários motores de passo: o eixo mais longo dá um passo a cada ciclo, e os outros dão passos quando o erro acumulado manda.' },
      { title: 'Linha de visada em jogos', text: 'Em jogos baseados em grade (roguelikes, táticos), saber se um personagem enxerga outro é traçar uma linha de Bresenham entre os dois e verificar se alguma célula no caminho é uma parede.' },
    ],
    curiosities: [
      'O algoritmo é de 1962 e só foi publicado em 1965, no IBM Systems Journal. Mais de 60 anos depois, continua no coração das bibliotecas gráficas.',
      'A mesma ideia de "erro acumulado" aparece em lugares inesperados, como distribuir uniformemente pulsos no tempo (o algoritmo euclidiano de ritmos, usado em música).',
      'Linhas de Bresenham parecem "serrilhadas"; o algoritmo de Xiaolin Wu (1991) usa a mesma estrutura para desenhar linhas suavizadas (antialiasing), pintando dois pixels por coluna com intensidades proporcionais.',
    ],
    code: {
      python: String.raw`
        def bresenham(x0, y0, x1, y1):
            dx, sx = abs(x1 - x0), (1 if x0 < x1 else -1)
            dy, sy = -abs(y1 - y0), (1 if y0 < y1 else -1)
            err = dx + dy
            pontos = []
            while True:
                pontos.append((x0, y0))
                if x0 == x1 and y0 == y1:
                    return pontos
                e2 = 2 * err
                if e2 >= dy:   # avança em x
                    err += dy
                    x0 += sx
                if e2 <= dx:   # avança em y
                    err += dx
                    y0 += sy

        print(" ".join(f"({x},{y})" for x, y in bresenham(0, 0, 8, 3)))
        # (0,0) (1,0) (2,1) (3,1) (4,2) (5,2) (6,2) (7,3) (8,3)
      `,
      javascript: String.raw`
        function bresenham(x0, y0, x1, y1) {
          const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
          const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
          let err = dx + dy;
          const pontos = [];
          while (true) {
            pontos.push([x0, y0]);
            if (x0 === x1 && y0 === y1) return pontos;
            const e2 = 2 * err;
            if (e2 >= dy) { err += dy; x0 += sx; } // avança em x
            if (e2 <= dx) { err += dx; y0 += sy; } // avança em y
          }
        }

        console.log(bresenham(0, 0, 8, 3).map(([x, y]) => "(" + x + "," + y + ")").join(" "));
        // (0,0) (1,0) (2,1) (3,1) (4,2) (5,2) (6,2) (7,3) (8,3)
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class Bresenham {
            static List<int[]> linha(int x0, int y0, int x1, int y1) {
                int dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
                int dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
                int err = dx + dy;
                List<int[]> pontos = new ArrayList<>();
                while (true) {
                    pontos.add(new int[]{x0, y0});
                    if (x0 == x1 && y0 == y1) return pontos;
                    int e2 = 2 * err;
                    if (e2 >= dy) { err += dy; x0 += sx; } // avança em x
                    if (e2 <= dx) { err += dx; y0 += sy; } // avança em y
                }
            }

            public static void main(String[] args) {
                StringBuilder sb = new StringBuilder();
                for (int[] p : linha(0, 0, 8, 3)) sb.append("(").append(p[0]).append(",").append(p[1]).append(") ");
                System.out.println(sb.toString().trim());
                // (0,0) (1,0) (2,1) (3,1) (4,2) (5,2) (6,2) (7,3) (8,3)
            }
        }
      `,
      cpp: String.raw`
        #include <cstdlib>
        #include <iostream>
        #include <utility>
        #include <vector>
        using namespace std;

        vector<pair<int, int>> bresenham(int x0, int y0, int x1, int y1) {
            int dx = abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
            int dy = -abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
            int err = dx + dy;
            vector<pair<int, int>> pontos;
            while (true) {
                pontos.push_back({x0, y0});
                if (x0 == x1 && y0 == y1) return pontos;
                int e2 = 2 * err;
                if (e2 >= dy) { err += dy; x0 += sx; } // avança em x
                if (e2 <= dx) { err += dx; y0 += sy; } // avança em y
            }
        }

        int main() {
            auto pontos = bresenham(0, 0, 8, 3);
            for (size_t i = 0; i < pontos.size(); i++) cout << (i ? " " : "") << "(" << pontos[i].first << "," << pontos[i].second << ")";
            cout << "\n"; // (0,0) (1,0) (2,1) (3,1) (4,2) (5,2) (6,2) (7,3) (8,3)
        }
      `,
    },
  },
  {
    id: 'midpoint-circle',
    name: 'Círculo do Ponto Médio',
    difficulty: 'Intermediário',
    en: { name: 'Midpoint Circle Algorithm', summary: 'Rasterizes a circle with integer arithmetic, computing one eighth of it and mirroring the rest by symmetry.' },
    facts: { 'Também chamado': 'Círculo de Bresenham', 'Base de': 'Linha de Bresenham', 'Simetria': '8 octantes', 'Usa ponto flutuante': 'Não — só somas inteiras' },
    summary: 'Rasteriza um círculo só com inteiros, calculando um oitavo dele e espelhando o resto por simetria.',
    description:
      'O algoritmo do ponto médio desenha um círculo em uma grade de pixels sem senos, cossenos ou raízes quadradas. Ele aproveita a simetria: basta calcular os pontos de um oitavo do círculo (de 0° a 45°) e refleti-los nos outros 7 octantes. Nesse trecho, y sobe um pixel por vez, e a única decisão é se x se mantém ou diminui. Para decidir, o algoritmo avalia a equação do círculo, f(x, y) = x² + y² − r², no ponto médio entre os dois pixels candidatos: se ele estiver dentro do círculo, mantém x; se estiver fora, diminui x. Esse valor de decisão é atualizado de um passo para o outro só com somas, como na linha de Bresenham.',
    complexity: { best: 'O(r)', average: 'O(r)', worst: 'O(r)', space: 'O(1)' },
    steps: [
      'Comece em (x, y) = (r, 0) e com o parâmetro de decisão d = 1 − r.',
      'Acenda os 8 pontos simétricos (±x, ±y) e (±y, ±x) em torno do centro.',
      'Aumente y em 1. Se d < 0, o ponto médio está dentro: mantenha x e faça d += 2y + 1.',
      'Se d ≥ 0, o ponto médio está fora: diminua x e faça d += 2(y − x) + 1.',
      'Repita enquanto x ≥ y (até a diagonal de 45°).',
    ],
    usedIn: ['Bibliotecas gráficas 2D', 'Jogos retrô e pixel art', 'Displays de microcontroladores (Adafruit GFX, u8g2)', 'Editores de imagem (círculos sem suavização)', 'Ensino de computação gráfica'],
    realWorld: [
      { title: 'Telinhas de microcontroladores', text: 'Bibliotecas como Adafruit GFX e u8g2, usadas em Arduino e displays OLED, desenham círculos com o algoritmo do ponto médio, porque esses processadores muitas vezes não têm unidade de ponto flutuante.' },
      { title: 'Jogos em grade', text: 'Áreas de explosão, raios de visão e campos de visão circulares em jogos de grade são rasterizados com ele ou com variantes.' },
      { title: 'Pixel art', text: 'Editores de pixel art (como o Aseprite) usam rasterização inteira para que círculos fiquem simétricos e sem pixels "sobrando" — algo que arredondar senos e cossenos não garante.' },
    ],
    curiosities: [
      'Com a simetria de 8 vias, um círculo de raio 100 exige calcular só cerca de 71 pontos para acender mais de 560 pixels.',
      'A mesma técnica do ponto médio funciona para elipses (com 4 vias de simetria e duas regiões de decisão) e para outras cônicas.',
      'Calculando x² + y² − r² diretamente, seriam necessárias multiplicações a cada passo; as diferenças sucessivas (2y + 1, 2(y − x) + 1) transformam tudo em somas, a mesma ideia do método das diferenças finitas das máquinas de Babbage.',
    ],
    code: {
      python: String.raw`
        def circulo(r):
            tamanho = 2 * r + 1
            grade = [["." for _ in range(tamanho)] for _ in range(tamanho)]
            x, y, d = r, 0, 1 - r
            while x >= y:
                for px, py in ((x, y), (y, x), (-y, x), (-x, y), (-x, -y), (-y, -x), (y, -x), (x, -y)):
                    grade[r - py][r + px] = "#"  # os 8 pontos simétricos
                y += 1
                if d < 0:
                    d += 2 * y + 1         # ponto médio dentro: mantém x
                else:
                    x -= 1
                    d += 2 * (y - x) + 1   # ponto médio fora: diminui x
            return ["".join(linha) for linha in grade]

        for linha in circulo(5):
            print(linha)
            # ...#####...
            # ..#.....#..
            # .#.......#.
            # #.........#
            # #.........#
            # #.........#
            # #.........#
            # #.........#
            # .#.......#.
            # ..#.....#..
            # ...#####...
      `,
      javascript: String.raw`
        function circulo(r) {
          const tamanho = 2 * r + 1;
          const grade = Array.from({ length: tamanho }, () => Array(tamanho).fill("."));
          let x = r, y = 0, d = 1 - r;
          while (x >= y) {
            for (const [px, py] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) {
              grade[r - py][r + px] = "#"; // os 8 pontos simétricos
            }
            y++;
            if (d < 0) d += 2 * y + 1; // ponto médio dentro: mantém x
            else { x--; d += 2 * (y - x) + 1; } // ponto médio fora: diminui x
          }
          return grade.map(linha => linha.join(""));
        }

        for (const linha of circulo(5)) console.log(linha);
        // ...#####...
        // ..#.....#..
        // .#.......#.
        // #.........#
        // #.........#
        // #.........#
        // #.........#
        // #.........#
        // .#.......#.
        // ..#.....#..
        // ...#####...
      `,
      java: String.raw`
        public class CirculoPontoMedio {
            static String[] circulo(int r) {
                int tamanho = 2 * r + 1;
                char[][] grade = new char[tamanho][tamanho];
                for (char[] linha : grade) java.util.Arrays.fill(linha, '.');
                int x = r, y = 0, d = 1 - r;
                while (x >= y) {
                    int[][] simetricos = {{x, y}, {y, x}, {-y, x}, {-x, y}, {-x, -y}, {-y, -x}, {y, -x}, {x, -y}};
                    for (int[] p : simetricos) grade[r - p[1]][r + p[0]] = '#'; // os 8 pontos simétricos
                    y++;
                    if (d < 0) d += 2 * y + 1; // ponto médio dentro: mantém x
                    else { x--; d += 2 * (y - x) + 1; } // ponto médio fora: diminui x
                }
                String[] linhas = new String[tamanho];
                for (int i = 0; i < tamanho; i++) linhas[i] = new String(grade[i]);
                return linhas;
            }

            public static void main(String[] args) {
                for (String linha : circulo(5)) System.out.println(linha);
                // ...#####...
                // ..#.....#..
                // .#.......#.
                // #.........#
                // #.........#
                // #.........#
                // #.........#
                // #.........#
                // .#.......#.
                // ..#.....#..
                // ...#####...
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<string> circulo(int r) {
            int tamanho = 2 * r + 1;
            vector<string> grade(tamanho, string(tamanho, '.'));
            int x = r, y = 0, d = 1 - r;
            while (x >= y) {
                int simetricos[8][2] = {{x, y}, {y, x}, {-y, x}, {-x, y}, {-x, -y}, {-y, -x}, {y, -x}, {x, -y}};
                for (auto& p : simetricos) grade[r - p[1]][r + p[0]] = '#'; // os 8 pontos simétricos
                y++;
                if (d < 0) d += 2 * y + 1; // ponto médio dentro: mantém x
                else { x--; d += 2 * (y - x) + 1; } // ponto médio fora: diminui x
            }
            return grade;
        }

        int main() {
            for (const string& linha : circulo(5)) cout << linha << "\n";
            // ...#####...
            // ..#.....#..
            // .#.......#.
            // #.........#
            // #.........#
            // #.........#
            // #.........#
            // #.........#
            // .#.......#.
            // ..#.....#..
            // ...#####...
        }
      `,
    },
  },
  {
    id: 'cohen-sutherland',
    name: 'Recorte de Cohen-Sutherland',
    difficulty: 'Intermediário',
    en: { name: 'Cohen-Sutherland Line Clipping', summary: 'Clips line segments to a rectangular window using 4-bit region codes that make the easy cases trivial.' },
    facts: { 'Criado por': 'Danny Cohen e Ivan Sutherland', 'Ano': '1967', 'Ideia central': 'Códigos de região de 4 bits', 'Alternativa': 'Liang-Barsky (1984)' },
    summary: 'Recorta segmentos de reta por uma janela retangular usando códigos de região de 4 bits, que tornam os casos fáceis triviais.',
    description:
      'Antes de desenhar, é preciso descartar o que fica fora da tela — ou da janela de visualização. O algoritmo de Cohen-Sutherland recorta segmentos de reta por um retângulo. As quatro retas da janela dividem o plano em nove regiões, e cada ponta do segmento recebe um código de 4 bits: um bit para "acima", "abaixo", "à direita" e "à esquerda". Se os dois códigos são 0000, o segmento está todo dentro e é aceito. Se o E bit a bit dos códigos não é zero, as duas pontas estão do mesmo lado de fora (ambas acima, por exemplo) e o segmento é rejeitado. Nos outros casos, uma ponta de fora é movida para a interseção com uma das bordas, seu código é recalculado, e o teste se repete.',
    complexity: { best: 'O(1) (aceite ou rejeição trivial)', average: 'O(1)', worst: 'O(1) — no máximo 4 cortes', space: 'O(1)' },
    steps: [
      'Calcule o código de 4 bits de cada ponta: acima (y > yₘₐₓ), abaixo (y < yₘᵢₙ), à direita (x > xₘₐₓ), à esquerda (x < xₘᵢₙ).',
      'Se os dois códigos são 0000, aceite o segmento como está.',
      'Se código1 AND código2 ≠ 0000, rejeite: as pontas estão do mesmo lado de fora.',
      'Senão, escolha uma ponta de fora e um bit ligado dela; calcule a interseção com essa borda e mova a ponta para lá.',
      'Recalcule o código e repita.',
    ],
    usedIn: ['Pipeline gráfico (recorte antes da rasterização)', 'Janelas e viewports em interfaces gráficas', 'Mapas (recortar vias pela área visível)', 'Jogos 2D', 'Ensino de computação gráfica'],
    realWorld: [
      { title: 'Desenhar só o que aparece', text: 'Em um mapa com milhões de segmentos de vias, recortar pelo retângulo visível evita rasterizar o que está fora da tela — e os testes de bits descartam a maioria dos segmentos sem nenhum cálculo.' },
      { title: 'Simuladores de voo', text: 'O algoritmo nasceu em 1967 nos trabalhos de Ivan Sutherland com simuladores de voo, em que era preciso recortar rapidamente o cenário pela "janela" da cabine.' },
      { title: 'Placas de vídeo', text: 'As GPUs fazem o recorte em coordenadas homogêneas contra o volume de visão (6 planos); a ideia dos códigos de região, um bit por plano, continua a mesma.' },
    ],
    curiosities: [
      'Ivan Sutherland criou o Sketchpad (1963), considerado o primeiro programa de desenho interativo, e recebeu o Prêmio Turing em 1988. Danny Cohen depois ficou conhecido por criar os termos "big-endian" e "little-endian".',
      'O Sutherland-Hodgman (1974) estende a ideia para recortar polígonos inteiros, borda por borda da janela.',
      'O Liang-Barsky trata o segmento como uma equação paramétrica e costuma ser mais rápido quando muitos segmentos cruzam a janela; o Cohen-Sutherland brilha quando a maioria está toda dentro ou toda fora.',
    ],
    code: {
      python: String.raw`
        DENTRO, ESQUERDA, DIREITA, ABAIXO, ACIMA = 0, 1, 2, 4, 8

        def codigo(x, y, janela):
            xmin, ymin, xmax, ymax = janela
            c = DENTRO
            if x < xmin: c |= ESQUERDA
            elif x > xmax: c |= DIREITA
            if y < ymin: c |= ABAIXO
            elif y > ymax: c |= ACIMA
            return c

        def recortar(x1, y1, x2, y2, janela):
            xmin, ymin, xmax, ymax = janela
            c1, c2 = codigo(x1, y1, janela), codigo(x2, y2, janela)
            while True:
                if not (c1 | c2):
                    return (x1, y1, x2, y2)   # todo dentro: aceita
                if c1 & c2:
                    return None               # mesmo lado de fora: rejeita
                fora = c1 or c2
                if fora & ACIMA:     x, y = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1), ymax
                elif fora & ABAIXO:  x, y = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1), ymin
                elif fora & DIREITA: x, y = xmax, y1 + (y2 - y1) * (xmax - x1) / (x2 - x1)
                else:                x, y = xmin, y1 + (y2 - y1) * (xmin - x1) / (x2 - x1)
                if fora == c1:
                    x1, y1, c1 = x, y, codigo(x, y, janela)
                else:
                    x2, y2, c2 = x, y, codigo(x, y, janela)

        janela = (0, 0, 10, 10)
        for seg in [(-5, 5, 15, 5), (2, 2, 8, 8), (12, 12, 15, 15), (5, -3, 13, 5)]:
            r = recortar(*seg, janela)
            print("rejeitado" if r is None else "(%.2f, %.2f) - (%.2f, %.2f)" % r)
            # (0.00, 5.00) - (10.00, 5.00)
            # (2.00, 2.00) - (8.00, 8.00)
            # rejeitado
            # (8.00, 0.00) - (10.00, 2.00)
      `,
      javascript: String.raw`
        const DENTRO = 0, ESQUERDA = 1, DIREITA = 2, ABAIXO = 4, ACIMA = 8;

        function codigo(x, y, [xmin, ymin, xmax, ymax]) {
          let c = DENTRO;
          if (x < xmin) c |= ESQUERDA; else if (x > xmax) c |= DIREITA;
          if (y < ymin) c |= ABAIXO; else if (y > ymax) c |= ACIMA;
          return c;
        }

        function recortar(x1, y1, x2, y2, janela) {
          const [xmin, ymin, xmax, ymax] = janela;
          let c1 = codigo(x1, y1, janela), c2 = codigo(x2, y2, janela);
          while (true) {
            if (!(c1 | c2)) return [x1, y1, x2, y2]; // todo dentro: aceita
            if (c1 & c2) return null;               // mesmo lado de fora: rejeita
            const fora = c1 || c2;
            let x, y;
            if (fora & ACIMA) { x = x1 + ((x2 - x1) * (ymax - y1)) / (y2 - y1); y = ymax; }
            else if (fora & ABAIXO) { x = x1 + ((x2 - x1) * (ymin - y1)) / (y2 - y1); y = ymin; }
            else if (fora & DIREITA) { y = y1 + ((y2 - y1) * (xmax - x1)) / (x2 - x1); x = xmax; }
            else { y = y1 + ((y2 - y1) * (xmin - x1)) / (x2 - x1); x = xmin; }
            if (fora === c1) { x1 = x; y1 = y; c1 = codigo(x, y, janela); }
            else { x2 = x; y2 = y; c2 = codigo(x, y, janela); }
          }
        }

        const janela = [0, 0, 10, 10];
        for (const seg of [[-5, 5, 15, 5], [2, 2, 8, 8], [12, 12, 15, 15], [5, -3, 13, 5]]) {
          const r = recortar(...seg, janela);
          const f = v => v.toFixed(2);
          console.log(r ? "(" + f(r[0]) + ", " + f(r[1]) + ") - (" + f(r[2]) + ", " + f(r[3]) + ")" : "rejeitado");
          // (0.00, 5.00) - (10.00, 5.00)
          // (2.00, 2.00) - (8.00, 8.00)
          // rejeitado
          // (8.00, 0.00) - (10.00, 2.00)
        }
      `,
      java: String.raw`
        import java.util.Locale;

        public class CohenSutherland {
            static final int DENTRO = 0, ESQUERDA = 1, DIREITA = 2, ABAIXO = 4, ACIMA = 8;
            static double xmin = 0, ymin = 0, xmax = 10, ymax = 10;

            static int codigo(double x, double y) {
                int c = DENTRO;
                if (x < xmin) c |= ESQUERDA; else if (x > xmax) c |= DIREITA;
                if (y < ymin) c |= ABAIXO; else if (y > ymax) c |= ACIMA;
                return c;
            }

            static double[] recortar(double x1, double y1, double x2, double y2) {
                int c1 = codigo(x1, y1), c2 = codigo(x2, y2);
                while (true) {
                    if ((c1 | c2) == 0) return new double[]{x1, y1, x2, y2}; // todo dentro: aceita
                    if ((c1 & c2) != 0) return null;                        // mesmo lado de fora: rejeita
                    int fora = c1 != 0 ? c1 : c2;
                    double x, y;
                    if ((fora & ACIMA) != 0) { x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1); y = ymax; }
                    else if ((fora & ABAIXO) != 0) { x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1); y = ymin; }
                    else if ((fora & DIREITA) != 0) { y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1); x = xmax; }
                    else { y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1); x = xmin; }
                    if (fora == c1) { x1 = x; y1 = y; c1 = codigo(x, y); }
                    else { x2 = x; y2 = y; c2 = codigo(x, y); }
                }
            }

            public static void main(String[] args) {
                double[][] segmentos = {{-5, 5, 15, 5}, {2, 2, 8, 8}, {12, 12, 15, 15}, {5, -3, 13, 5}};
                for (double[] s : segmentos) {
                    double[] r = recortar(s[0], s[1], s[2], s[3]);
                    System.out.println(r == null ? "rejeitado" : String.format(Locale.ROOT, "(%.2f, %.2f) - (%.2f, %.2f)", r[0], r[1], r[2], r[3]));
                    // (0.00, 5.00) - (10.00, 5.00)
                    // (2.00, 2.00) - (8.00, 8.00)
                    // rejeitado
                    // (8.00, 0.00) - (10.00, 2.00)
                }
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>

        const int DENTRO = 0, ESQUERDA = 1, DIREITA = 2, ABAIXO = 4, ACIMA = 8;
        const double xmin = 0, ymin = 0, xmax = 10, ymax = 10;

        int codigo(double x, double y) {
            int c = DENTRO;
            if (x < xmin) c |= ESQUERDA; else if (x > xmax) c |= DIREITA;
            if (y < ymin) c |= ABAIXO; else if (y > ymax) c |= ACIMA;
            return c;
        }

        bool recortar(double& x1, double& y1, double& x2, double& y2) {
            int c1 = codigo(x1, y1), c2 = codigo(x2, y2);
            while (true) {
                if (!(c1 | c2)) return true;  // todo dentro: aceita
                if (c1 & c2) return false;    // mesmo lado de fora: rejeita
                int fora = c1 ? c1 : c2;
                double x, y;
                if (fora & ACIMA) { x = x1 + (x2 - x1) * (ymax - y1) / (y2 - y1); y = ymax; }
                else if (fora & ABAIXO) { x = x1 + (x2 - x1) * (ymin - y1) / (y2 - y1); y = ymin; }
                else if (fora & DIREITA) { y = y1 + (y2 - y1) * (xmax - x1) / (x2 - x1); x = xmax; }
                else { y = y1 + (y2 - y1) * (xmin - x1) / (x2 - x1); x = xmin; }
                if (fora == c1) { x1 = x; y1 = y; c1 = codigo(x, y); }
                else { x2 = x; y2 = y; c2 = codigo(x, y); }
            }
        }

        int main() {
            double segmentos[4][4] = {{-5, 5, 15, 5}, {2, 2, 8, 8}, {12, 12, 15, 15}, {5, -3, 13, 5}};
            for (auto& s : segmentos) {
                if (recortar(s[0], s[1], s[2], s[3])) printf("(%.2f, %.2f) - (%.2f, %.2f)\n", s[0], s[1], s[2], s[3]);
                else printf("rejeitado\n");
                // (0.00, 5.00) - (10.00, 5.00)
                // (2.00, 2.00) - (8.00, 8.00)
                // rejeitado
                // (8.00, 0.00) - (10.00, 2.00)
            }
        }
      `,
    },
  },
  {
    id: 'painters-algorithm',
    name: 'Algoritmo do Pintor',
    difficulty: 'Intermediário',
    en: { name: "Painter's Algorithm", summary: 'Solves visibility by drawing objects from farthest to nearest, so closer ones paint over the ones behind.' },
    facts: { 'Também chamado': 'Prioridade por profundidade', 'Ideia central': 'Desenhar de trás para frente', 'Limitação': 'Sobreposições cíclicas e objetos que se cruzam', 'Sucessor': 'Z-buffer (Catmull, 1974)' },
    summary: 'Resolve a visibilidade desenhando os objetos do mais distante para o mais próximo, de modo que os da frente pintem por cima dos de trás.',
    description:
      'Em uma cena 3D, objetos da frente escondem os de trás. O algoritmo do pintor resolve esse problema de visibilidade como um pintor de paisagens: primeiro o céu e as montanhas ao fundo, depois as casas, por fim as árvores da frente. Os polígonos são ordenados pela profundidade (distância à câmera) e desenhados do mais distante para o mais próximo; cada um simplesmente pinta por cima do que já estava na tela. É simples e não precisa de memória extra, mas tem dois problemas: desenha pixels que depois serão cobertos (overdraw) e falha quando não existe uma ordem correta — polígonos que se cruzam ou que se sobrepõem em ciclo (A cobre B, B cobre C, C cobre A). Nesses casos, é preciso dividir os polígonos, como faz o algoritmo de Newell, ou usar o z-buffer.',
    complexity: { best: 'O(n log n)', average: 'O(n log n) + custo de pintar', worst: 'O(n²) com divisão de polígonos', space: 'O(n)' },
    steps: [
      'Calcule a profundidade de cada polígono (por exemplo, a distância média ou máxima até a câmera).',
      'Ordene os polígonos do mais distante para o mais próximo.',
      'Desenhe-os nessa ordem, cada um por cima do que já foi desenhado.',
      'Se dois polígonos não puderem ser ordenados (se cruzam ou formam um ciclo), divida um deles e reordene.',
    ],
    usedIn: ['Transparência em motores 3D (objetos translúcidos ordenados de trás para frente)', 'Gráficos 2D com camadas (SVG, Canvas, interfaces)', 'Jogos 2.5D e isométricos', 'Renderização por software em hardware limitado', 'Gráficos de superfícies 3D em bibliotecas de plotagem'],
    realWorld: [
      { title: 'Transparência em jogos', text: 'O z-buffer não lida bem com vidro, fumaça e água. Por isso, motores como Unity e Unreal desenham primeiro os objetos opacos (com z-buffer) e depois os transparentes ordenados de trás para frente — o algoritmo do pintor.' },
      { title: 'Interfaces e SVG', text: 'Em SVG, HTML com z-index ou qualquer editor com camadas, o que vem depois é desenhado por cima: é o algoritmo do pintor em 2D, com a ordem dada pelo próprio documento.' },
      { title: 'Jogos isométricos', text: 'Jogos isométricos clássicos ordenam os sprites pela posição na tela (quem está mais "embaixo" está mais perto) e desenham na ordem — com truques para objetos grandes que ocupam várias casas.' },
    ],
    curiosities: [
      'O algoritmo de Newell, Newell e Sancha (1972) é a versão "completa": testa sobreposições entre os polígonos e os divide quando não há ordem possível.',
      'O z-buffer, proposto por Edwin Catmull em 1974, guarda a profundidade de cada pixel e resolve a visibilidade pixel a pixel. Na época, a memória necessária era caríssima; hoje está em toda GPU.',
      'O Doom (1993) fazia o contrário do pintor: desenhava as paredes de frente para trás usando uma árvore BSP, e cada pixel era pintado uma única vez.',
    ],
    code: {
      python: String.raw`
        # Cada objeto: (nome, profundidade, caractere, x0, y0, x1, y1) — retângulos em uma tela de texto
        cena = [
            ("arvore", 2, "A", 14, 2, 18, 8),
            ("fundo", 9, ".", 0, 0, 24, 8),
            ("casa", 4, "C", 7, 4, 16, 8),
            ("predio", 6, "P", 2, 1, 10, 8),
        ]

        tela = [[" "] * 24 for _ in range(8)]
        for nome, z, ch, x0, y0, x1, y1 in sorted(cena, key=lambda o: -o[1]):  # do mais distante ao mais próximo
            for y in range(y0, y1):
                for x in range(x0, x1):
                    tela[y][x] = ch  # pinta por cima do que já estava
        for linha in tela:
            print("".join(linha))
            # ........................
            # ..PPPPPPPP..............
            # ..PPPPPPPP....AAAA......
            # ..PPPPPPPP....AAAA......
            # ..PPPPPCCCCCCCAAAA......
            # ..PPPPPCCCCCCCAAAA......
            # ..PPPPPCCCCCCCAAAA......
            # ..PPPPPCCCCCCCAAAA......
      `,
      javascript: String.raw`
        // Cada objeto: [nome, profundidade, caractere, x0, y0, x1, y1] — retângulos em uma tela de texto
        const cena = [
          ["arvore", 2, "A", 14, 2, 18, 8],
          ["fundo", 9, ".", 0, 0, 24, 8],
          ["casa", 4, "C", 7, 4, 16, 8],
          ["predio", 6, "P", 2, 1, 10, 8],
        ];

        const tela = Array.from({ length: 8 }, () => Array(24).fill(" "));
        for (const [, , ch, x0, y0, x1, y1] of [...cena].sort((a, b) => b[1] - a[1])) { // do mais distante ao mais próximo
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) tela[y][x] = ch; // pinta por cima
        }
        for (const linha of tela) console.log(linha.join(""));
        // ........................
        // ..PPPPPPPP..............
        // ..PPPPPPPP....AAAA......
        // ..PPPPPPPP....AAAA......
        // ..PPPPPCCCCCCCAAAA......
        // ..PPPPPCCCCCCCAAAA......
        // ..PPPPPCCCCCCCAAAA......
        // ..PPPPPCCCCCCCAAAA......
      `,
      java: String.raw`
        import java.util.Arrays;
        import java.util.Comparator;

        public class Pintor {
            record Objeto(String nome, int z, char ch, int x0, int y0, int x1, int y1) {}

            public static void main(String[] args) {
                Objeto[] cena = { // retângulos em uma tela de texto
                    new Objeto("arvore", 2, 'A', 14, 2, 18, 8),
                    new Objeto("fundo", 9, '.', 0, 0, 24, 8),
                    new Objeto("casa", 4, 'C', 7, 4, 16, 8),
                    new Objeto("predio", 6, 'P', 2, 1, 10, 8),
                };
                char[][] tela = new char[8][24];
                for (char[] linha : tela) Arrays.fill(linha, ' ');
                Arrays.sort(cena, Comparator.comparingInt(Objeto::z).reversed()); // do mais distante ao mais próximo
                for (Objeto o : cena)
                    for (int y = o.y0(); y < o.y1(); y++)
                        for (int x = o.x0(); x < o.x1(); x++) tela[y][x] = o.ch(); // pinta por cima
                for (char[] linha : tela) System.out.println(new String(linha));
                // ........................
                // ..PPPPPPPP..............
                // ..PPPPPPPP....AAAA......
                // ..PPPPPPPP....AAAA......
                // ..PPPPPCCCCCCCAAAA......
                // ..PPPPPCCCCCCCAAAA......
                // ..PPPPPCCCCCCCAAAA......
                // ..PPPPPCCCCCCCAAAA......
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        struct Objeto { string nome; int z; char ch; int x0, y0, x1, y1; };

        int main() {
            vector<Objeto> cena = { // retângulos em uma tela de texto
                {"arvore", 2, 'A', 14, 2, 18, 8},
                {"fundo", 9, '.', 0, 0, 24, 8},
                {"casa", 4, 'C', 7, 4, 16, 8},
                {"predio", 6, 'P', 2, 1, 10, 8},
            };
            vector<string> tela(8, string(24, ' '));
            sort(cena.begin(), cena.end(), [](const Objeto& a, const Objeto& b) { return a.z > b.z; }); // do mais distante
            for (const Objeto& o : cena)
                for (int y = o.y0; y < o.y1; y++)
                    for (int x = o.x0; x < o.x1; x++) tela[y][x] = o.ch; // pinta por cima
            for (const string& linha : tela) cout << linha << "\n";
            // ........................
            // ..PPPPPPPP..............
            // ..PPPPPPPP....AAAA......
            // ..PPPPPPPP....AAAA......
            // ..PPPPPCCCCCCCAAAA......
            // ..PPPPPCCCCCCCAAAA......
            // ..PPPPPCCCCCCCAAAA......
            // ..PPPPPCCCCCCCAAAA......
        }
      `,
    },
  },
  {
    id: 'closest-pair',
    name: 'Par de Pontos Mais Próximo',
    difficulty: 'Avançado',
    en: { name: 'Closest Pair of Points', summary: 'Finds the two closest points in O(n log n) with divide and conquer: solve each half, then check only a narrow strip around the split.' },
    facts: { 'Criado por': 'Michael Shamos e Dan Hoey', 'Ano': '1975', 'Técnica': 'Dividir e conquistar', 'Custo': 'O(n log n)', 'Força bruta': 'O(n²)' },
    summary: 'Encontra os dois pontos mais próximos em O(n log n) dividindo e conquistando: resolve cada metade e depois só examina uma faixa estreita em torno da divisão.',
    description:
      'Comparar todos os pares de n pontos custa O(n²). O algoritmo de dividir e conquistar de Shamos e Hoey faz melhor: ordena os pontos por x, divide-os ao meio por uma reta vertical e resolve cada metade recursivamente, obtendo a menor distância d. O par mais próximo pode ainda ter um ponto de cada lado — mas, nesse caso, os dois estão a menos de d da reta divisória. Basta examinar essa faixa de largura 2d, com os pontos ordenados por y. O detalhe genial é geométrico: dentro da faixa, cada ponto só precisa ser comparado com os próximos 7 (no máximo), porque não cabem mais pontos a distância menor que d uns dos outros em um retângulo d × 2d. Assim a combinação é linear e o total, O(n log n).',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    steps: [
      'Ordene os pontos por x.',
      'Se houver 3 pontos ou menos, compare todos os pares (caso base).',
      'Divida ao meio por uma reta vertical e resolva cada metade recursivamente; seja d a menor distância encontrada.',
      'Separe os pontos a menos de d da reta divisória e ordene-os por y.',
      'Compare cada ponto da faixa com os seguintes enquanto a diferença em y for menor que d (no máximo 7). Atualize d se achar um par melhor.',
    ],
    usedIn: ['Controle de tráfego aéreo (aeronaves próximas demais)', 'Detecção de colisão entre muitas partículas', 'Agrupamento hierárquico (clustering)', 'Visão computacional e nuvens de pontos', 'Ensino clássico de dividir e conquistar'],
    realWorld: [
      { title: 'Tráfego aéreo', text: 'Sistemas de alerta de conflito precisam saber rapidamente quais aeronaves estão próximas demais umas das outras — uma variação dinâmica do problema do par mais próximo.' },
      { title: 'Simulações físicas', text: 'Em simulações com milhares de partículas, encontrar pares próximos sem testar todos os pares é essencial; na prática, usam-se grades espaciais e árvores k-d com a mesma ideia de descartar regiões distantes.' },
      { title: 'Agrupamento', text: 'O agrupamento hierárquico aglomerativo começa juntando os dois pontos mais próximos e repete o processo; estruturas para pares mais próximos tornam isso viável para grandes conjuntos.' },
    ],
    curiosities: [
      'Michael Shamos apresentou o algoritmo em sua tese de 1978, considerada uma das obras que fundaram a geometria computacional como área de pesquisa.',
      'Em 1976, Rabin mostrou um algoritmo aleatorizado de tempo esperado O(n), usando uma grade; é um dos primeiros exemplos de como a aleatoriedade pode vencer limites determinísticos.',
      'O limite de "no máximo 7 vizinhos na faixa" vem de dividir o retângulo d × 2d em 8 quadrados de lado d/2: em cada quadrado cabe no máximo um ponto, senão já haveria um par a menos de d.',
    ],
    code: {
      python: String.raw`
        import math

        def forca_bruta(p):
            melhor = (math.inf, None, None)
            for i in range(len(p)):
                for j in range(i + 1, len(p)):
                    d = math.dist(p[i], p[j])
                    if d < melhor[0]:
                        melhor = (d, p[i], p[j])
            return melhor

        def resolver(p):  # p ordenado por x
            if len(p) <= 3:
                return forca_bruta(p)
            meio = len(p) // 2
            x_meio = p[meio][0]
            esquerda, direita = resolver(p[:meio]), resolver(p[meio:])
            melhor = esquerda if esquerda[0] <= direita[0] else direita
            faixa = sorted((q for q in p if abs(q[0] - x_meio) < melhor[0]), key=lambda q: q[1])
            for i in range(len(faixa)):
                for j in range(i + 1, len(faixa)):
                    if faixa[j][1] - faixa[i][1] >= melhor[0]:
                        break  # no máximo 7 vizinhos chegam aqui
                    d = math.dist(faixa[i], faixa[j])
                    if d < melhor[0]:
                        melhor = (d, faixa[i], faixa[j])
            return melhor

        d, a, b = resolver(sorted([(2, 3), (12, 30), (40, 50), (5, 1), (12, 10), (3, 4)]))
        print(a, b, f"{d:.4f}")  # (2, 3) (3, 4) 1.4142
      `,
      javascript: String.raw`
        const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

        function forcaBruta(p) {
          let melhor = [Infinity, null, null];
          for (let i = 0; i < p.length; i++)
            for (let j = i + 1; j < p.length; j++)
              if (dist(p[i], p[j]) < melhor[0]) melhor = [dist(p[i], p[j]), p[i], p[j]];
          return melhor;
        }

        function resolver(p) { // p ordenado por x
          if (p.length <= 3) return forcaBruta(p);
          const meio = Math.floor(p.length / 2), xMeio = p[meio][0];
          const esquerda = resolver(p.slice(0, meio)), direita = resolver(p.slice(meio));
          let melhor = esquerda[0] <= direita[0] ? esquerda : direita;
          const faixa = p.filter(q => Math.abs(q[0] - xMeio) < melhor[0]).sort((a, b) => a[1] - b[1]);
          for (let i = 0; i < faixa.length; i++) {
            for (let j = i + 1; j < faixa.length && faixa[j][1] - faixa[i][1] < melhor[0]; j++) { // no máximo 7
              const d = dist(faixa[i], faixa[j]);
              if (d < melhor[0]) melhor = [d, faixa[i], faixa[j]];
            }
          }
          return melhor;
        }

        const pontos = [[2, 3], [12, 30], [40, 50], [5, 1], [12, 10], [3, 4]].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        const [d, a, b] = resolver(pontos);
        console.log("(" + a.join(", ") + ") (" + b.join(", ") + ") " + d.toFixed(4)); // (2, 3) (3, 4) 1.4142
      `,
      java: String.raw`
        import java.util.Arrays;
        import java.util.Comparator;
        import java.util.Locale;

        public class ParMaisProximo {
            record Resultado(double d, int[] a, int[] b) {}

            static double dist(int[] a, int[] b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

            static Resultado resolver(int[][] p, int ini, int fim) { // p[ini..fim) ordenado por x
                Resultado melhor = new Resultado(Double.POSITIVE_INFINITY, null, null);
                if (fim - ini <= 3) {
                    for (int i = ini; i < fim; i++)
                        for (int j = i + 1; j < fim; j++)
                            if (dist(p[i], p[j]) < melhor.d()) melhor = new Resultado(dist(p[i], p[j]), p[i], p[j]);
                    return melhor;
                }
                int meio = (ini + fim) / 2, xMeio = p[meio][0];
                Resultado esq = resolver(p, ini, meio), dir = resolver(p, meio, fim);
                melhor = esq.d() <= dir.d() ? esq : dir;
                final double d = melhor.d();
                int[][] faixa = Arrays.stream(p, ini, fim).filter(q -> Math.abs(q[0] - xMeio) < d)
                    .sorted(Comparator.comparingInt(q -> q[1])).toArray(int[][]::new);
                for (int i = 0; i < faixa.length; i++)
                    for (int j = i + 1; j < faixa.length && faixa[j][1] - faixa[i][1] < melhor.d(); j++) // no máximo 7
                        if (dist(faixa[i], faixa[j]) < melhor.d()) melhor = new Resultado(dist(faixa[i], faixa[j]), faixa[i], faixa[j]);
                return melhor;
            }

            public static void main(String[] args) {
                int[][] pontos = {{2, 3}, {12, 30}, {40, 50}, {5, 1}, {12, 10}, {3, 4}};
                Arrays.sort(pontos, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
                Resultado r = resolver(pontos, 0, pontos.length);
                System.out.println(String.format(Locale.ROOT, "(%d, %d) (%d, %d) %.4f", r.a()[0], r.a()[1], r.b()[0], r.b()[1], r.d()));
                // (2, 3) (3, 4) 1.4142
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cmath>
        #include <cstdio>
        #include <limits>
        #include <vector>
        using namespace std;

        struct P { int x, y; };
        struct Resultado { double d; P a, b; };

        double dist(P a, P b) { return hypot(a.x - b.x, a.y - b.y); }

        Resultado resolver(const vector<P>& p, int ini, int fim) { // p[ini..fim) ordenado por x
            Resultado melhor = {numeric_limits<double>::infinity(), {}, {}};
            if (fim - ini <= 3) {
                for (int i = ini; i < fim; i++)
                    for (int j = i + 1; j < fim; j++)
                        if (dist(p[i], p[j]) < melhor.d) melhor = {dist(p[i], p[j]), p[i], p[j]};
                return melhor;
            }
            int meio = (ini + fim) / 2, xMeio = p[meio].x;
            Resultado esq = resolver(p, ini, meio), dir = resolver(p, meio, fim);
            melhor = esq.d <= dir.d ? esq : dir;
            vector<P> faixa;
            for (int i = ini; i < fim; i++) if (abs(p[i].x - xMeio) < melhor.d) faixa.push_back(p[i]);
            sort(faixa.begin(), faixa.end(), [](P a, P b) { return a.y < b.y; });
            for (size_t i = 0; i < faixa.size(); i++)
                for (size_t j = i + 1; j < faixa.size() && faixa[j].y - faixa[i].y < melhor.d; j++) // no máximo 7
                    if (dist(faixa[i], faixa[j]) < melhor.d) melhor = {dist(faixa[i], faixa[j]), faixa[i], faixa[j]};
            return melhor;
        }

        int main() {
            vector<P> pontos = {{2, 3}, {12, 30}, {40, 50}, {5, 1}, {12, 10}, {3, 4}};
            sort(pontos.begin(), pontos.end(), [](P a, P b) { return a.x != b.x ? a.x < b.x : a.y < b.y; });
            Resultado r = resolver(pontos, 0, pontos.size());
            printf("(%d, %d) (%d, %d) %.4f\n", r.a.x, r.a.y, r.b.x, r.b.y, r.d); // (2, 3) (3, 4) 1.4142
        }
      `,
    },
  },
  {
    id: 'ray-tracing',
    name: 'Traçado de Raios (Ray Tracing)',
    difficulty: 'Avançado',
    en: { name: 'Ray Tracing', summary: 'Renders images by following rays of light backwards from the camera through each pixel — with shadows and reflections for free.' },
    facts: { 'Criado por': 'Arthur Appel; Turner Whitted', 'Ano': '1968; 1980 (recursivo)', 'Ideia central': 'Seguir a luz da câmera para a cena', 'Usado em': 'Cinema, arquitetura, jogos (RTX)' },
    summary: 'Gera imagens seguindo raios de luz ao contrário, da câmera para a cena, por cada pixel — com sombras e reflexos naturalmente.',
    description:
      'O traçado de raios gera uma imagem simulando o caminho da luz, mas ao contrário: em vez de seguir os raios que saem das lâmpadas (quase todos nunca chegam à câmera), lança um raio da câmera através de cada pixel da tela. Para cada raio, encontra o objeto mais próximo que ele atinge (resolvendo uma equação, como a do segundo grau para esferas). No ponto atingido, calcula a cor: lança um raio de sombra em direção à luz — se algo estiver no caminho, o ponto está na sombra —, aplica um modelo de iluminação (difusa e especular) e, se o material for espelhado, lança recursivamente um raio refletido. Essa forma recursiva, de Turner Whitted (1980), produz sombras, reflexos e refrações com uma única ideia. O preço é o custo: milhões de raios por imagem.',
    complexity: { best: 'O(pixels × objetos)', average: 'O(pixels × log objetos) com BVH', worst: 'O(pixels × objetos × profundidade)', space: 'O(objetos)' },
    steps: [
      'Para cada pixel, crie um raio que parte da câmera e passa pelo pixel.',
      'Encontre a interseção mais próxima do raio com os objetos da cena (esferas, triângulos…).',
      'Se não acertou nada, use a cor do fundo (céu).',
      'No ponto atingido, lance um raio de sombra até a luz: se for bloqueado, só a luz ambiente ilumina o ponto.',
      'Calcule a iluminação (difusa: n·l; especular: brilho) e, se o material reflete, lance um raio refletido e misture a cor que ele trouxer.',
    ],
    usedIn: ['Filmes de animação e efeitos visuais (path tracing)', 'Visualização arquitetônica e de produtos', 'Jogos com ray tracing em tempo real (GPUs RTX e RDNA)', 'Simulação de luz, acústica e antenas', 'Óptica e projeto de lentes'],
    realWorld: [
      { title: 'Cinema', text: 'A Pixar adotou o path tracing (uma extensão estatística do traçado de raios) no RenderMan a partir de "Procurando Dory" (2016); hoje praticamente todo filme de animação e efeito visual é renderizado assim, ao custo de horas por quadro.' },
      { title: 'Jogos em tempo real', text: 'Desde 2018, GPUs com núcleos dedicados (RTX, RDNA 2) aceleram a busca de interseções com hierarquias de volumes envolventes (BVH), permitindo reflexos e sombras traçados em tempo real em jogos.' },
      { title: 'Projeto de lentes e iluminação', text: 'Ferramentas de óptica traçam raios por sistemas de lentes para prever aberrações, e projetistas de iluminação simulam como a luz se distribui em um ambiente antes de construí-lo.' },
    ],
    curiosities: [
      'A imagem de Turner Whitted de 1980, com esferas refletindo um tabuleiro xadrez, levou cerca de 74 minutos para ser gerada em 512 × 512 pixels — o visualizador desta página faz uma cena parecida em uma fração de segundo.',
      'A ideia de traçar raios é muito anterior aos computadores: Albrecht Dürer descreveu, no século XVI, um aparelho que projetava objetos em uma tela seguindo linhas a partir de um ponto de vista.',
      'O programa desta página usa os mesmos passos de um traçador de raios real — interseção raio-esfera, normal e iluminação difusa —, só que desenha com caracteres em vez de pixels.',
    ],
    code: {
      python: String.raw`
        import math

        LARGURA, ALTURA = 40, 20
        PALETA = ".:-=+*#%@"           # do mais escuro ao mais claro
        CENTRO, RAIO = (0.0, 0.0, 3.0), 1.0

        def normaliza(v):
            k = 1.0 / math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
            return (v[0] * k, v[1] * k, v[2] * k)

        def dot(a, b):
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

        LUZ = normaliza((-1.0, 1.0, -1.0))  # direção da luz: de cima, da esquerda e da frente

        for j in range(ALTURA):
            linha = ""
            for i in range(LARGURA):
                x = (i + 0.5 - LARGURA / 2) / (LARGURA / 2) * 0.6
                y = -(j + 0.5 - ALTURA / 2) / (ALTURA / 2) * 0.6
                d = normaliza((x, y, 1.0))       # raio da câmera (na origem) pelo "pixel"
                oc = (-CENTRO[0], -CENTRO[1], -CENTRO[2])
                b = dot(oc, d)
                c = dot(oc, oc) - RAIO * RAIO
                disc = b * b - c                 # equação do 2º grau da interseção raio-esfera
                if disc < 0:
                    linha += " "
                    continue
                t = -b - math.sqrt(disc)
                p = (t * d[0], t * d[1], t * d[2])
                n = ((p[0] - CENTRO[0]) / RAIO, (p[1] - CENTRO[1]) / RAIO, (p[2] - CENTRO[2]) / RAIO)
                brilho = max(0.0, dot(n, LUZ))   # iluminação difusa (Lambert)
                linha += PALETA[int(brilho * 8.999)]
            print(linha.rstrip())
            # Saída (entre linhas em branco): uma esfera iluminada de cima, pela esquerda
            #                 @@%%%##*
            #             @@@@@@%%%##**++-
            #            @@@@@%%%%###**++=-
            #          @@@@@@%%%####**++==-:.
            #          @@@%%%%%###***++==--:.
            #         %%%%%%####****++==--::..
            #         ########****+++==--::...
            #          ###*****++++==---:....
            #          +***+++++===---::.....
            #            =======---:::.....
            #             :----:::........
            #                 ........
      `,
      javascript: String.raw`
        const LARGURA = 40, ALTURA = 20;
        const PALETA = ".:-=+*#%@"; // do mais escuro ao mais claro
        const CENTRO = [0, 0, 3], RAIO = 1;

        function normaliza(v) {
          const k = 1 / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
          return [v[0] * k, v[1] * k, v[2] * k];
        }
        const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

        const LUZ = normaliza([-1, 1, -1]); // direção da luz: de cima, da esquerda e da frente

        for (let j = 0; j < ALTURA; j++) {
          let linha = "";
          for (let i = 0; i < LARGURA; i++) {
            const x = ((i + 0.5 - LARGURA / 2) / (LARGURA / 2)) * 0.6;
            const y = (-(j + 0.5 - ALTURA / 2) / (ALTURA / 2)) * 0.6;
            const d = normaliza([x, y, 1]); // raio da câmera (na origem) pelo "pixel"
            const oc = [-CENTRO[0], -CENTRO[1], -CENTRO[2]];
            const b = dot(oc, d);
            const c = dot(oc, oc) - RAIO * RAIO;
            const disc = b * b - c; // equação do 2º grau da interseção raio-esfera
            if (disc < 0) { linha += " "; continue; }
            const t = -b - Math.sqrt(disc);
            const p = [t * d[0], t * d[1], t * d[2]];
            const n = [(p[0] - CENTRO[0]) / RAIO, (p[1] - CENTRO[1]) / RAIO, (p[2] - CENTRO[2]) / RAIO];
            const brilho = Math.max(0, dot(n, LUZ)); // iluminação difusa (Lambert)
            linha += PALETA[Math.floor(brilho * 8.999)];
          }
          console.log(linha.trimEnd());
          // Saída (entre linhas em branco): uma esfera iluminada de cima, pela esquerda
          //                 @@%%%##*
          //             @@@@@@%%%##**++-
          //            @@@@@%%%%###**++=-
          //          @@@@@@%%%####**++==-:.
          //          @@@%%%%%###***++==--:.
          //         %%%%%%####****++==--::..
          //         ########****+++==--::...
          //          ###*****++++==---:....
          //          +***+++++===---::.....
          //            =======---:::.....
          //             :----:::........
          //                 ........
        }
      `,
      java: String.raw`
        public class TracadoDeRaios {
            static final int LARGURA = 40, ALTURA = 20;
            static final String PALETA = ".:-=+*#%@"; // do mais escuro ao mais claro
            static final double[] CENTRO = {0, 0, 3};
            static final double RAIO = 1;

            static double[] normaliza(double[] v) {
                double k = 1.0 / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
                return new double[]{v[0] * k, v[1] * k, v[2] * k};
            }

            static double dot(double[] a, double[] b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

            public static void main(String[] args) {
                double[] luz = normaliza(new double[]{-1, 1, -1}); // de cima, da esquerda e da frente
                for (int j = 0; j < ALTURA; j++) {
                    StringBuilder linha = new StringBuilder();
                    for (int i = 0; i < LARGURA; i++) {
                        double x = (i + 0.5 - LARGURA / 2.0) / (LARGURA / 2.0) * 0.6;
                        double y = -(j + 0.5 - ALTURA / 2.0) / (ALTURA / 2.0) * 0.6;
                        double[] d = normaliza(new double[]{x, y, 1}); // raio da câmera (na origem) pelo "pixel"
                        double[] oc = {-CENTRO[0], -CENTRO[1], -CENTRO[2]};
                        double b = dot(oc, d);
                        double c = dot(oc, oc) - RAIO * RAIO;
                        double disc = b * b - c; // equação do 2º grau da interseção raio-esfera
                        if (disc < 0) { linha.append(' '); continue; }
                        double t = -b - Math.sqrt(disc);
                        double[] p = {t * d[0], t * d[1], t * d[2]};
                        double[] n = {(p[0] - CENTRO[0]) / RAIO, (p[1] - CENTRO[1]) / RAIO, (p[2] - CENTRO[2]) / RAIO};
                        double brilho = Math.max(0, dot(n, luz)); // iluminação difusa (Lambert)
                        linha.append(PALETA.charAt((int) (brilho * 8.999)));
                    }
                    System.out.println(linha.toString().stripTrailing());
                    // Saída (entre linhas em branco): uma esfera iluminada de cima, pela esquerda
                    //                 @@%%%##*
                    //             @@@@@@%%%##**++-
                    //            @@@@@%%%%###**++=-
                    //          @@@@@@%%%####**++==-:.
                    //          @@@%%%%%###***++==--:.
                    //         %%%%%%####****++==--::..
                    //         ########****+++==--::...
                    //          ###*****++++==---:....
                    //          +***+++++===---::.....
                    //            =======---:::.....
                    //             :----:::........
                    //                 ........
                }
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <array>
        #include <cmath>
        #include <iostream>
        #include <string>
        using namespace std;

        using V = array<double, 3>;
        const int LARGURA = 40, ALTURA = 20;
        const string PALETA = ".:-=+*#%@"; // do mais escuro ao mais claro
        const V CENTRO = {0, 0, 3};
        const double RAIO = 1;

        V normaliza(V v) {
            double k = 1.0 / sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            return {v[0] * k, v[1] * k, v[2] * k};
        }
        double dot(V a, V b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

        int main() {
            V luz = normaliza({-1, 1, -1}); // de cima, da esquerda e da frente
            for (int j = 0; j < ALTURA; j++) {
                string linha;
                for (int i = 0; i < LARGURA; i++) {
                    double x = (i + 0.5 - LARGURA / 2.0) / (LARGURA / 2.0) * 0.6;
                    double y = -(j + 0.5 - ALTURA / 2.0) / (ALTURA / 2.0) * 0.6;
                    V d = normaliza({x, y, 1}); // raio da câmera (na origem) pelo "pixel"
                    V oc = {-CENTRO[0], -CENTRO[1], -CENTRO[2]};
                    double b = dot(oc, d);
                    double c = dot(oc, oc) - RAIO * RAIO;
                    double disc = b * b - c; // equação do 2º grau da interseção raio-esfera
                    if (disc < 0) { linha += ' '; continue; }
                    double t = -b - sqrt(disc);
                    V p = {t * d[0], t * d[1], t * d[2]};
                    V n = {(p[0] - CENTRO[0]) / RAIO, (p[1] - CENTRO[1]) / RAIO, (p[2] - CENTRO[2]) / RAIO};
                    double brilho = max(0.0, dot(n, luz)); // iluminação difusa (Lambert)
                    linha += PALETA[(int)(brilho * 8.999)];
                }
                linha.erase(linha.find_last_not_of(' ') + 1);
                cout << linha << "\n";
                // Saída (entre linhas em branco): uma esfera iluminada de cima, pela esquerda
                //                 @@%%%##*
                //             @@@@@@%%%##**++-
                //            @@@@@%%%%###**++=-
                //          @@@@@@%%%####**++==-:.
                //          @@@%%%%%###***++==--:.
                //         %%%%%%####****++==--::..
                //         ########****+++==--::...
                //          ###*****++++==---:....
                //          +***+++++===---::.....
                //            =======---:::.....
                //             :----:::........
                //                 ........
            }
        }
      `,
    },
  },
]
