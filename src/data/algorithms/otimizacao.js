export default [
  {
    id: 'gradient-descent',
    name: 'Gradiente Descendente',
    difficulty: 'Iniciante',
    en: { name: 'Gradient Descent', summary: 'Minimizes a function by repeatedly stepping against its gradient — the engine that trains almost every neural network.' },
    facts: { 'Origem': 'Augustin-Louis Cauchy', 'Ano': '1847', 'Tipo': 'Otimização contínua de primeira ordem', 'Hiperparâmetro principal': 'Taxa de aprendizado η', 'Variantes': 'Estocástico (SGD), momento, Adam' },
    summary: 'Minimiza uma função dando passos repetidos contra o gradiente — o motor que treina quase toda rede neural.',
    description:
      'O gradiente de uma função aponta para onde ela cresce mais depressa. O gradiente descendente faz o contrário: a partir de um ponto, dá um passo na direção oposta ao gradiente, x ← x − η·∇f(x), e repete até o gradiente ficar praticamente zero. O tamanho do passo é controlado pela taxa de aprendizado η: pequena demais, o algoritmo se arrasta; grande demais, ele oscila e pode divergir. Em vales estreitos e alongados (como a função de Rosenbrock), o caminho ziguezagueia e avança devagar. O método só garante um mínimo local — em funções convexas, ele é também global. Em aprendizado de máquina, a função é o erro do modelo, os pontos são os pesos, e a versão estocástica (SGD) estima o gradiente com pequenos lotes de dados.',
    complexity: { best: 'O(k · custo do gradiente)', average: 'O(k · d) para d variáveis e k passos', worst: 'Pode não convergir (η grande)', space: 'O(d)' },
    steps: [
      'Escolha um ponto inicial e uma taxa de aprendizado η.',
      'Calcule o gradiente ∇f no ponto atual.',
      'Atualize: x ← x − η·∇f(x).',
      'Repita até o gradiente ficar menor que uma tolerância (ou até um número máximo de passos).',
      'Se o valor da função aumentar ou oscilar, diminua η.',
    ],
    usedIn: ['Treinamento de redes neurais (retropropagação + SGD/Adam)', 'Regressão linear e logística', 'Sistemas de recomendação (fatoração de matrizes)', 'Processamento de sinais (filtros adaptativos LMS)', 'Ajuste de curvas e modelos físicos'],
    realWorld: [
      { title: 'Inteligência artificial', text: 'Modelos de linguagem e de visão são treinados com variantes do gradiente descendente (como Adam) sobre bilhões de parâmetros: cada passo ajusta todos os pesos um pouquinho na direção que reduz o erro.' },
      { title: 'Regressão', text: 'Ajustar uma reta ou um modelo de previsão a dados é minimizar o erro quadrático médio; com milhões de exemplos, o gradiente descendente estocástico é mais prático que resolver o sistema exato.' },
      { title: 'Cancelamento de eco', text: 'Telefones e fones com cancelamento de ruído usam o filtro LMS, que é um gradiente descendente feito amostra a amostra, em tempo real.' },
    ],
    curiosities: [
      'Cauchy propôs o método em 1847 para resolver sistemas de equações da astronomia — mais de um século antes das redes neurais.',
      'O "momento" (Polyak, 1964) imita uma bola rolando: acumula velocidade nas direções consistentes e amortece o ziguezague.',
      'Em redes neurais modernas, quase todos os "mínimos locais" são parecidos em qualidade; o problema maior costuma ser os pontos de sela, onde o gradiente também é zero.',
    ],
    code: {
      python: String.raw`
        # 1) Minimizar f(x, y) = (x − 3)² + 2(y + 1)²
        x, y, eta, passos = 0.0, 0.0, 0.1, 0
        while True:
            gx, gy = 2 * (x - 3), 4 * (y + 1)        # gradiente
            if (gx * gx + gy * gy) ** 0.5 < 1e-6:
                break
            x, y = x - eta * gx, y - eta * gy        # passo contra o gradiente
            passos += 1
        print(f"mínimo em ({x:.4f}, {y:.4f}) após {passos} passos")  # mínimo em (3.0000, -1.0000) após 70 passos

        # 2) Ajustar uma reta y = a·x + b minimizando o erro quadrático médio
        xs, ys = [1, 2, 3, 4, 5], [3, 5, 7, 9, 11]
        a = b = 0.0
        for _ in range(5000):
            erros = [a * xi + b - yi for xi, yi in zip(xs, ys)]
            ga = 2 * sum(e * xi for e, xi in zip(erros, xs)) / len(xs)
            gb = 2 * sum(erros) / len(xs)
            a, b = a - 0.02 * ga, b - 0.02 * gb
        print(f"a = {a:.4f}, b = {b:.4f}")  # a = 2.0000, b = 1.0000
      `,
      javascript: String.raw`
        // 1) Minimizar f(x, y) = (x − 3)² + 2(y + 1)²
        let x = 0, y = 0, passos = 0;
        const eta = 0.1;
        while (true) {
          const gx = 2 * (x - 3), gy = 4 * (y + 1); // gradiente
          if (Math.sqrt(gx * gx + gy * gy) < 1e-6) break;
          x -= eta * gx; y -= eta * gy;             // passo contra o gradiente
          passos++;
        }
        console.log("mínimo em (" + x.toFixed(4) + ", " + y.toFixed(4) + ") após " + passos + " passos"); // mínimo em (3.0000, -1.0000) após 70 passos

        // 2) Ajustar uma reta y = a·x + b minimizando o erro quadrático médio
        const xs = [1, 2, 3, 4, 5], ys = [3, 5, 7, 9, 11];
        let a = 0, b = 0;
        for (let it = 0; it < 5000; it++) {
          const erros = xs.map((xi, i) => a * xi + b - ys[i]);
          const ga = (2 * erros.reduce((s, e, i) => s + e * xs[i], 0)) / xs.length;
          const gb = (2 * erros.reduce((s, e) => s + e, 0)) / xs.length;
          a -= 0.02 * ga; b -= 0.02 * gb;
        }
        console.log("a = " + a.toFixed(4) + ", b = " + b.toFixed(4)); // a = 2.0000, b = 1.0000
      `,
      java: String.raw`
        import java.util.Locale;

        public class GradienteDescendente {
            public static void main(String[] args) {
                // 1) Minimizar f(x, y) = (x − 3)² + 2(y + 1)²
                double x = 0, y = 0, eta = 0.1;
                int passos = 0;
                while (true) {
                    double gx = 2 * (x - 3), gy = 4 * (y + 1); // gradiente
                    if (Math.sqrt(gx * gx + gy * gy) < 1e-6) break;
                    x -= eta * gx; y -= eta * gy;              // passo contra o gradiente
                    passos++;
                }
                System.out.println(String.format(Locale.ROOT, "mínimo em (%.4f, %.4f) após %d passos", x, y, passos)); // (3.0000, -1.0000), 70 passos

                // 2) Ajustar uma reta y = a·x + b minimizando o erro quadrático médio
                double[] xs = {1, 2, 3, 4, 5}, ys = {3, 5, 7, 9, 11};
                double a = 0, b = 0;
                for (int it = 0; it < 5000; it++) {
                    double ga = 0, gb = 0;
                    for (int i = 0; i < xs.length; i++) {
                        double e = a * xs[i] + b - ys[i];
                        ga += e * xs[i];
                        gb += e;
                    }
                    ga = 2 * ga / xs.length; gb = 2 * gb / xs.length;
                    a -= 0.02 * ga; b -= 0.02 * gb;
                }
                System.out.println(String.format(Locale.ROOT, "a = %.4f, b = %.4f", a, b)); // a = 2.0000, b = 1.0000
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>

        int main() {
            // 1) Minimizar f(x, y) = (x − 3)² + 2(y + 1)²
            double x = 0, y = 0, eta = 0.1;
            int passos = 0;
            while (true) {
                double gx = 2 * (x - 3), gy = 4 * (y + 1); // gradiente
                if (std::sqrt(gx * gx + gy * gy) < 1e-6) break;
                x -= eta * gx; y -= eta * gy;              // passo contra o gradiente
                passos++;
            }
            printf("mínimo em (%.4f, %.4f) após %d passos\n", x, y, passos);

            // 2) Ajustar uma reta y = a·x + b minimizando o erro quadrático médio
            double xs[] = {1, 2, 3, 4, 5}, ys[] = {3, 5, 7, 9, 11};
            double a = 0, b = 0;
            for (int it = 0; it < 5000; it++) {
                double ga = 0, gb = 0;
                for (int i = 0; i < 5; i++) {
                    double e = a * xs[i] + b - ys[i];
                    ga += e * xs[i];
                    gb += e;
                }
                ga = 2 * ga / 5; gb = 2 * gb / 5;
                a -= 0.02 * ga; b -= 0.02 * gb;
            }
            printf("a = %.4f, b = %.4f\n", a, b);
        }
      `,
    },
  },
  {
    id: 'hill-climbing',
    name: 'Subida de Encosta (Hill Climbing)',
    difficulty: 'Intermediário',
    en: { name: 'Hill Climbing', summary: 'Local search that keeps moving to a better neighbor until none exists — simple and fast, but easily trapped in local optima.' },
    facts: { 'Tipo': 'Busca local', 'Garantia': 'Ótimo local (não global)', 'Variantes': 'Mais íngreme, estocástica, com reinícios aleatórios', 'Exemplo clássico': '2-opt no caixeiro-viajante' },
    summary: 'Busca local que se move para um vizinho melhor enquanto houver um — simples e rápida, mas fácil de ficar presa em ótimos locais.',
    description:
      'A subida de encosta é a ideia mais simples de otimização: a partir de uma solução, olhe para as soluções "vizinhas" (pequenas modificações) e mude para uma que seja melhor; repita até que nenhum vizinho melhore. O nome vem da imagem de um alpinista no nevoeiro que só dá passos para cima. O algoritmo é rápido e usa pouca memória, mas para no primeiro pico que encontrar — um ótimo local, que pode estar longe do melhor possível. No visualizador, a função de Rastrigin, cheia de vales, mostra isso bem. Remédios comuns são recomeçar de pontos aleatórios várias vezes, aceitar de vez em quando passos piores (têmpera simulada) ou proibir voltar a soluções recentes (busca tabu). No caixeiro-viajante, a subida de encosta com movimentos 2-opt — desfazer cruzamentos invertendo um trecho da rota — é uma das heurísticas mais usadas.',
    complexity: { best: 'O(vizinhos) por passo', average: 'Depende da paisagem', worst: 'Exponencial em casos patológicos', space: 'O(tamanho da solução)' },
    steps: [
      'Comece com uma solução (aleatória ou gulosa).',
      'Gere os vizinhos da solução atual (pequenas modificações).',
      'Se algum vizinho é melhor, mova-se para ele (o primeiro melhor ou o melhor de todos).',
      'Repita até nenhum vizinho ser melhor: é um ótimo local.',
      'Para escapar de ótimos locais, recomece de vários pontos e fique com o melhor resultado.',
    ],
    usedIn: ['Caixeiro-viajante e roteamento (2-opt, 3-opt, Lin-Kernighan)', 'Escalonamento e alocação de recursos', 'Ajuste de hiperparâmetros simples', 'Inteligência artificial clássica (busca local)', 'Refinamento final de soluções de outros algoritmos'],
    realWorld: [
      { title: 'Rotas de entrega', text: 'Depois de montar uma rota inicial (por exemplo, pelo vizinho mais próximo), sistemas de logística aplicam 2-opt e movimentos parecidos até não haver mais melhora — o que costuma reduzir a rota em 5% a 10%.' },
      { title: 'Lin-Kernighan', text: 'A heurística de Lin e Kernighan (1973), uma subida de encosta com movimentos de profundidade variável, ainda está entre os melhores métodos práticos para o caixeiro-viajante, encontrando rotas a 2% do ótimo em instâncias enormes.' },
      { title: 'Refinamento local', text: 'Algoritmos genéticos e de colônia de formigas costumam terminar com uma subida de encosta para "polir" a melhor solução encontrada (os chamados algoritmos meméticos).' },
    ],
    curiosities: [
      'Em um espaço com muitos ótimos locais, reiniciar a subida de encosta de pontos aleatórios (random restart) é surpreendentemente eficaz e simples de paralelizar.',
      'No problema das N-rainhas, a subida de encosta com a heurística de "mínimos conflitos" resolve tabuleiros com um milhão de rainhas em poucos passos.',
      'Uma rota ótima do caixeiro-viajante no plano nunca tem arestas que se cruzam — por isso o 2-opt, que desfaz cruzamentos, é tão eficaz.',
    ],
    code: {
      python: String.raw`
        import math

        cidades = [(0, 0), (4, 3), (1, 5), (6, 1), (3, 0), (5, 5), (2, 2), (6, 4)]

        def comprimento(rota):
            return sum(math.dist(cidades[rota[i]], cidades[rota[i - 1]]) for i in range(len(rota)))

        rota = list(range(len(cidades)))
        print(f"inicial: {comprimento(rota):.2f}")                # inicial: 39.48
        melhorou = True
        while melhorou:                                   # 2-opt: subida de encosta
            melhorou = False
            for i in range(1, len(rota) - 1):
                for j in range(i + 1, len(rota)):
                    vizinha = rota[:i] + rota[i:j + 1][::-1] + rota[j + 1:]   # inverte um trecho
                    if comprimento(vizinha) < comprimento(rota) - 1e-12:
                        rota, melhorou = vizinha, True        # primeiro vizinho melhor
        print(f"final: {comprimento(rota):.2f}", rota)  # final: 22.41 [0, 4, 3, 7, 5, 1, 2, 6] — o ótimo
      `,
      javascript: String.raw`
        const cidades = [[0, 0], [4, 3], [1, 5], [6, 1], [3, 0], [5, 5], [2, 2], [6, 4]];
        const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
        const comprimento = rota => rota.reduce((s, c, i) => s + dist(cidades[c], cidades[rota[(i - 1 + rota.length) % rota.length]]), 0);

        let rota = cidades.map((_, i) => i);
        console.log("inicial: " + comprimento(rota).toFixed(2)); // inicial: 39.48
        let melhorou = true;
        while (melhorou) { // 2-opt: subida de encosta
          melhorou = false;
          for (let i = 1; i < rota.length - 1; i++) {
            for (let j = i + 1; j < rota.length; j++) {
              const vizinha = [...rota.slice(0, i), ...rota.slice(i, j + 1).reverse(), ...rota.slice(j + 1)]; // inverte um trecho
              if (comprimento(vizinha) < comprimento(rota) - 1e-12) { rota = vizinha; melhorou = true; }   // primeiro vizinho melhor
            }
          }
        }
        console.log("final: " + comprimento(rota).toFixed(2) + " [" + rota.join(", ") + "]"); // final: 22.41 [0, 4, 3, 7, 5, 1, 2, 6] — o ótimo
      `,
      java: String.raw`
        import java.util.Arrays;
        import java.util.Locale;

        public class SubidaDeEncosta {
            static final double[][] CIDADES = {{0, 0}, {4, 3}, {1, 5}, {6, 1}, {3, 0}, {5, 5}, {2, 2}, {6, 4}};

            static double comprimento(int[] rota) {
                double s = 0;
                for (int i = 0; i < rota.length; i++) {
                    double[] a = CIDADES[rota[i]], b = CIDADES[rota[(i - 1 + rota.length) % rota.length]];
                    s += Math.hypot(a[0] - b[0], a[1] - b[1]);
                }
                return s;
            }

            public static void main(String[] args) {
                int[] rota = {0, 1, 2, 3, 4, 5, 6, 7};
                System.out.println(String.format(Locale.ROOT, "inicial: %.2f", comprimento(rota))); // inicial: 39.48
                boolean melhorou = true;
                while (melhorou) { // 2-opt: subida de encosta
                    melhorou = false;
                    for (int i = 1; i < rota.length - 1; i++)
                        for (int j = i + 1; j < rota.length; j++) {
                            int[] vizinha = rota.clone();
                            for (int a = i, b = j; a < b; a++, b--) { int t = vizinha[a]; vizinha[a] = vizinha[b]; vizinha[b] = t; } // inverte um trecho
                            if (comprimento(vizinha) < comprimento(rota) - 1e-12) { rota = vizinha; melhorou = true; }       // primeiro vizinho melhor
                        }
                }
                System.out.println(String.format(Locale.ROOT, "final: %.2f ", comprimento(rota)) + Arrays.toString(rota)); // final: 22.41 [0, 4, 3, 7, 5, 1, 2, 6]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cmath>
        #include <cstdio>
        #include <vector>
        using namespace std;

        const double CIDADES[8][2] = {{0, 0}, {4, 3}, {1, 5}, {6, 1}, {3, 0}, {5, 5}, {2, 2}, {6, 4}};

        double comprimento(const vector<int>& rota) {
            double s = 0;
            for (size_t i = 0; i < rota.size(); i++) {
                const double* a = CIDADES[rota[i]];
                const double* b = CIDADES[rota[(i + rota.size() - 1) % rota.size()]];
                s += hypot(a[0] - b[0], a[1] - b[1]);
            }
            return s;
        }

        int main() {
            vector<int> rota = {0, 1, 2, 3, 4, 5, 6, 7};
            printf("inicial: %.2f\n", comprimento(rota));
            bool melhorou = true;
            while (melhorou) { // 2-opt: subida de encosta
                melhorou = false;
                for (size_t i = 1; i + 1 < rota.size(); i++)
                    for (size_t j = i + 1; j < rota.size(); j++) {
                        vector<int> vizinha = rota;
                        reverse(vizinha.begin() + i, vizinha.begin() + j + 1);                        // inverte um trecho
                        if (comprimento(vizinha) < comprimento(rota) - 1e-12) { rota = vizinha; melhorou = true; } // primeiro vizinho melhor
                    }
            }
            printf("final: %.2f [", comprimento(rota));
            for (size_t i = 0; i < rota.size(); i++) printf(i ? ", %d" : "%d", rota[i]);
            printf("]\n");
        }
      `,
    },
  },
  {
    id: 'simulated-annealing',
    name: 'Têmpera Simulada (Simulated Annealing)',
    difficulty: 'Avançado',
    en: { name: 'Simulated Annealing', summary: 'Local search inspired by cooling metal: it sometimes accepts worse moves, less and less often as the "temperature" drops, to escape local optima.' },
    facts: { 'Criado por': 'Kirkpatrick, Gelatt e Vecchi', 'Ano': '1983 (base: Metropolis, 1953)', 'Tipo': 'Meta-heurística probabilística', 'Regra de aceitação': 'e^(−Δ/T) para passos piores', 'Inspiração': 'Recozimento de metais (termodinâmica)' },
    summary: 'Busca local inspirada no resfriamento de metais: às vezes aceita passos piores, cada vez menos à medida que a "temperatura" cai, para escapar de ótimos locais.',
    description:
      'Na metalurgia, o recozimento (têmpera) aquece um metal e o resfria devagar, para que os átomos se acomodem em uma estrutura de baixa energia. A têmpera simulada copia a ideia. A partir de uma solução, sorteia um vizinho: se ele é melhor, aceita; se é pior por uma diferença Δ, ainda aceita com probabilidade e^(−Δ/T), onde T é a "temperatura". No começo, com T alto, o algoritmo aceita quase tudo e explora a paisagem livremente, conseguindo sair de vales; conforme T diminui (por exemplo, multiplicando por 0,99 a cada passo), ele fica cada vez mais exigente até virar uma subida de encosta. Com um resfriamento lento o bastante, a teoria garante convergência ao ótimo global — na prática, é um bom compromisso entre exploração e refinamento.',
    complexity: { best: 'O(passos · custo do vizinho)', average: 'O(passos)', worst: 'Sem garantia com resfriamento rápido', space: 'O(tamanho da solução)' },
    steps: [
      'Comece com uma solução e uma temperatura inicial T alta.',
      'Sorteie um vizinho e calcule Δ = custo(vizinho) − custo(atual).',
      'Se Δ ≤ 0, aceite. Senão, aceite com probabilidade e^(−Δ/T).',
      'Guarde a melhor solução vista e resfrie: T ← α·T (com α perto de 1).',
      'Pare quando T ficar muito pequena ou depois de um número fixo de passos.',
    ],
    usedIn: ['Posicionamento e roteamento de chips (VLSI)', 'Caixeiro-viajante e roteamento de veículos', 'Escalonamento e grades horárias', 'Dobramento de proteínas e química computacional', 'Computação quântica adiabática (recozimento quântico)'],
    realWorld: [
      { title: 'Projeto de chips', text: 'O artigo de 1983 que popularizou a técnica a aplicou ao posicionamento de componentes em circuitos integrados. Ferramentas de projeto de chips usaram têmpera simulada por décadas para posicionar milhões de células reduzindo o comprimento dos fios.' },
      { title: 'Grades horárias', text: 'Montar horários de universidades e escalas de hospitais, com centenas de restrições "duras" e preferências "moles", é um uso clássico: a têmpera simulada troca alocações e aceita pioras temporárias para fugir de becos sem saída.' },
      { title: 'Recozimento quântico', text: 'Computadores da D-Wave fazem uma versão quântica da ideia: em vez de saltar barreiras com energia térmica, o sistema as atravessa por tunelamento quântico.' },
    ],
    curiosities: [
      'A regra de aceitação vem do algoritmo de Metropolis (1953), criado no Projeto Manhattan para simular partículas — por Nicholas Metropolis, Arianna e Marshall Rosenbluth, Augusta e Edward Teller.',
      'Com o resfriamento logarítmico T = c / log(k), há prova de convergência ao ótimo global — mas é tão lento que ninguém o usa na prática.',
      'No visualizador, compare a têmpera simulada com a subida de encosta partindo do mesmo ponto da função de Rastrigin: a subida para no primeiro vale, e a têmpera costuma chegar perto do centro.',
    ],
    code: {
      python: String.raw`
        import math

        estado = 42
        def aleatorio():                       # gerador congruencial (o mesmo nas 4 linguagens)
            global estado
            estado = (estado * 1664525 + 1013904223) & 0xFFFFFFFF
            return estado / 4294967296

        cidades = [(0, 0), (4, 3), (1, 5), (6, 1), (3, 0), (5, 5), (2, 2), (6, 4), (8, 2), (7, 7)]
        def comprimento(r):
            return sum(math.dist(cidades[r[i]], cidades[r[i - 1]]) for i in range(len(r)))

        rota = list(range(len(cidades)))
        atual = melhor = comprimento(rota)
        print(f"inicial: {atual:.2f}")   # inicial: 50.10
        T = 10.0
        for _ in range(5000):
            i = int(aleatorio() * len(rota))
            j = int(aleatorio() * len(rota))
            if i > j: i, j = j, i
            vizinha = rota[:i] + rota[i:j + 1][::-1] + rota[j + 1:]  # inverte um trecho
            delta = comprimento(vizinha) - atual
            if delta <= 0 or aleatorio() < math.exp(-delta / T):     # aceita pioras com prob. e^(−Δ/T)
                rota, atual = vizinha, atual + delta
                melhor = min(melhor, atual)
            T *= 0.998                                               # resfria
        print(f"melhor: {melhor:.2f}")   # melhor: 29.05 (o ótimo para estas 10 cidades)
      `,
      javascript: String.raw`
        let estado = 42;
        function aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
          estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
          return estado / 4294967296;
        }

        const cidades = [[0, 0], [4, 3], [1, 5], [6, 1], [3, 0], [5, 5], [2, 2], [6, 4], [8, 2], [7, 7]];
        const comprimento = r => r.reduce((s, c, i) => s + Math.hypot(cidades[c][0] - cidades[r[(i - 1 + r.length) % r.length]][0], cidades[c][1] - cidades[r[(i - 1 + r.length) % r.length]][1]), 0);

        let rota = cidades.map((_, i) => i);
        let atual = comprimento(rota), melhor = atual;
        console.log("inicial: " + atual.toFixed(2)); // inicial: 50.10
        let T = 10;
        for (let k = 0; k < 5000; k++) {
          let i = Math.floor(aleatorio() * rota.length), j = Math.floor(aleatorio() * rota.length);
          if (i > j) [i, j] = [j, i];
          const vizinha = [...rota.slice(0, i), ...rota.slice(i, j + 1).reverse(), ...rota.slice(j + 1)]; // inverte um trecho
          const delta = comprimento(vizinha) - atual;
          if (delta <= 0 || aleatorio() < Math.exp(-delta / T)) { // aceita pioras com prob. e^(−Δ/T)
            rota = vizinha;
            atual += delta;
            melhor = Math.min(melhor, atual);
          }
          T *= 0.998; // resfria
        }
        console.log("melhor: " + melhor.toFixed(2)); // melhor: 29.05 (o ótimo para estas 10 cidades)
      `,
      java: String.raw`
        import java.util.Locale;

        public class TemperaSimulada {
            static int estado = 42;
            static double aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
                estado = estado * 1664525 + 1013904223;
                return Integer.toUnsignedLong(estado) / 4294967296.0;
            }

            static final double[][] CIDADES = {{0, 0}, {4, 3}, {1, 5}, {6, 1}, {3, 0}, {5, 5}, {2, 2}, {6, 4}, {8, 2}, {7, 7}};

            static double comprimento(int[] r) {
                double s = 0;
                for (int i = 0; i < r.length; i++) {
                    double[] a = CIDADES[r[i]], b = CIDADES[r[(i - 1 + r.length) % r.length]];
                    s += Math.hypot(a[0] - b[0], a[1] - b[1]);
                }
                return s;
            }

            public static void main(String[] args) {
                int[] rota = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
                double atual = comprimento(rota), melhor = atual, T = 10;
                System.out.println(String.format(Locale.ROOT, "inicial: %.2f", atual)); // inicial: 50.10
                for (int k = 0; k < 5000; k++) {
                    int i = (int) (aleatorio() * rota.length), j = (int) (aleatorio() * rota.length);
                    if (i > j) { int t = i; i = j; j = t; }
                    int[] vizinha = rota.clone();
                    for (int a = i, b = j; a < b; a++, b--) { int t = vizinha[a]; vizinha[a] = vizinha[b]; vizinha[b] = t; } // inverte um trecho
                    double delta = comprimento(vizinha) - atual;
                    if (delta <= 0 || aleatorio() < Math.exp(-delta / T)) { // aceita pioras com prob. e^(−Δ/T)
                        rota = vizinha;
                        atual += delta;
                        melhor = Math.min(melhor, atual);
                    }
                    T *= 0.998; // resfria
                }
                System.out.println(String.format(Locale.ROOT, "melhor: %.2f", melhor)); // melhor: 29.05 (o ótimo)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cmath>
        #include <cstdint>
        #include <cstdio>
        #include <vector>
        using namespace std;

        uint32_t estado = 42;
        double aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
            estado = estado * 1664525u + 1013904223u;
            return estado / 4294967296.0;
        }

        const double CIDADES[10][2] = {{0, 0}, {4, 3}, {1, 5}, {6, 1}, {3, 0}, {5, 5}, {2, 2}, {6, 4}, {8, 2}, {7, 7}};

        double comprimento(const vector<int>& r) {
            double s = 0;
            for (size_t i = 0; i < r.size(); i++) {
                const double* a = CIDADES[r[i]];
                const double* b = CIDADES[r[(i + r.size() - 1) % r.size()]];
                s += hypot(a[0] - b[0], a[1] - b[1]);
            }
            return s;
        }

        int main() {
            vector<int> rota = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
            double atual = comprimento(rota), melhor = atual, T = 10;
            printf("inicial: %.2f\n", atual);
            for (int k = 0; k < 5000; k++) {
                int i = (int)(aleatorio() * rota.size()), j = (int)(aleatorio() * rota.size());
                if (i > j) swap(i, j);
                vector<int> vizinha = rota;
                reverse(vizinha.begin() + i, vizinha.begin() + j + 1); // inverte um trecho
                double delta = comprimento(vizinha) - atual;
                if (delta <= 0 || aleatorio() < exp(-delta / T)) {     // aceita pioras com prob. e^(−Δ/T)
                    rota = vizinha;
                    atual += delta;
                    melhor = min(melhor, atual);
                }
                T *= 0.998; // resfria
            }
            printf("melhor: %.2f\n", melhor);
        }
      `,
    },
  },
  {
    id: 'genetic-algorithm',
    name: 'Algoritmo Genético',
    difficulty: 'Avançado',
    en: { name: 'Genetic Algorithm', summary: 'Evolves a population of candidate solutions with selection, crossover and mutation — optimization by natural selection.' },
    facts: { 'Criado por': 'John Holland', 'Ano': '1975 (Adaptation in Natural and Artificial Systems)', 'Tipo': 'Algoritmo evolutivo (meta-heurística)', 'Operadores': 'Seleção, cruzamento, mutação', 'Inspiração': 'Seleção natural de Darwin' },
    summary: 'Evolui uma população de soluções candidatas com seleção, cruzamento e mutação — otimização por seleção natural.',
    description:
      'Um algoritmo genético mantém uma população de soluções, cada uma codificada como um "cromossomo" (uma sequência de genes). Uma função de aptidão diz quão boa cada uma é. A cada geração, os pais são escolhidos favorecendo os mais aptos (por exemplo, por torneio: sorteiam-se alguns indivíduos e vence o melhor), combinados por cruzamento (o filho herda um pedaço de cada pai) e levemente modificados por mutação (alguns genes trocados ao acaso). Opcionalmente, os melhores passam intactos para a próxima geração (elitismo). Ao longo das gerações, as boas "características" se espalham e se combinam. O método não usa gradientes nem exige que o problema seja contínuo, por isso funciona em problemas combinatórios e "caixas-pretas" — mas tem muitos parâmetros e nenhuma garantia de ótimo.',
    complexity: { best: 'O(gerações · população · custo da aptidão)', average: 'O(g · p · L)', worst: 'Sem garantia de convergência', space: 'O(p · L)' },
    steps: [
      'Crie uma população inicial aleatória e avalie a aptidão de cada indivíduo.',
      'Seleção: escolha pais favorecendo os mais aptos (torneio, roleta ou ranking).',
      'Cruzamento: combine dois pais em um ou mais filhos (por exemplo, cortando os cromossomos em um ponto).',
      'Mutação: altere cada gene com uma probabilidade pequena, para manter a diversidade.',
      'Forme a nova geração (mantendo os melhores, se usar elitismo) e repita até atingir a meta ou um limite de gerações.',
    ],
    usedIn: ['Projeto de antenas e estruturas (NASA)', 'Escalonamento e roteamento com muitas restrições', 'Ajuste de hiperparâmetros e arquiteturas de redes neurais', 'Mineração de dados (regras de associação, seleção de atributos)', 'Arte e música generativas'],
    realWorld: [
      { title: 'A antena da NASA', text: 'A antena da missão Space Technology 5 (2006) foi projetada por um algoritmo evolutivo: o formato estranho e retorcido que surgiu atendia às especificações melhor que os projetos feitos à mão.' },
      { title: 'Mineração de dados', text: 'Como diz a lista original, algoritmos genéticos são usados para descobrir regras de associação e escolher quais atributos usar em modelos — problemas combinatórios em que testar tudo é impossível.' },
      { title: 'Engenharia', text: 'Montadoras e fabricantes de turbinas usam otimização evolutiva para ajustar formas aerodinâmicas e parâmetros de motores, avaliando cada candidato com simulações.' },
    ],
    curiosities: [
      'O exemplo da frase vem do "programa da doninha" de Richard Dawkins (O Relojoeiro Cego, 1986), que evoluía "METHINKS IT IS LIKE A WEASEL" para mostrar como a seleção cumulativa é muito mais poderosa que o puro acaso.',
      'Sem seleção, acertar uma frase de 18 caracteres por sorte exigiria em média cerca de 27¹⁸ ≈ 6 × 10²⁵ tentativas; o visualizador chega lá em algumas dezenas de gerações.',
      'O "teorema dos esquemas" de Holland tenta explicar por que os algoritmos genéticos funcionam: blocos curtos de genes bons se multiplicam exponencialmente na população.',
    ],
    code: {
      python: String.raw`
        estado = 1
        def aleatorio():                       # gerador congruencial (o mesmo nas 4 linguagens)
            global estado
            estado = (estado * 1664525 + 1013904223) & 0xFFFFFFFF
            return estado / 4294967296
        def sorteio(n):
            return int(aleatorio() * n)

        ALVO, GENES = "OLA MUNDO", "ABCDEFGHIJKLMNOPQRSTUVWXYZ "
        TAM, MUTACAO = 50, 0.05
        aptidao = lambda s: sum(a == b for a, b in zip(s, ALVO))

        def torneio(pop):                      # o melhor de 3 sorteados
            melhor = pop[sorteio(TAM)]
            for _ in range(2):
                c = pop[sorteio(TAM)]
                if aptidao(c) > aptidao(melhor):
                    melhor = c
            return melhor

        pop = ["".join(GENES[sorteio(len(GENES))] for _ in ALVO) for _ in range(TAM)]
        for geracao in range(1000):
            melhor = max(pop, key=aptidao)
            if melhor == ALVO:
                print(f"geração {geracao}: {melhor}")   # geração 33: OLA MUNDO
                break
            nova = [melhor]                    # elitismo
            while len(nova) < TAM:
                a, b, corte = torneio(pop), torneio(pop), sorteio(len(ALVO))
                filho = a[:corte] + b[corte:]  # cruzamento em um ponto
                nova.append("".join(GENES[sorteio(len(GENES))] if aleatorio() < MUTACAO else g for g in filho))
            pop = nova
      `,
      javascript: String.raw`
        let estado = 1;
        function aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
          estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
          return estado / 4294967296;
        }
        const sorteio = n => Math.floor(aleatorio() * n);

        const ALVO = "OLA MUNDO", GENES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ", TAM = 50, MUTACAO = 0.05;
        const aptidao = s => [...s].filter((c, i) => c === ALVO[i]).length;

        function torneio(pop) { // o melhor de 3 sorteados
          let melhor = pop[sorteio(TAM)];
          for (let k = 0; k < 2; k++) { const c = pop[sorteio(TAM)]; if (aptidao(c) > aptidao(melhor)) melhor = c; }
          return melhor;
        }

        let pop = Array.from({ length: TAM }, () => Array.from(ALVO, () => GENES[sorteio(GENES.length)]).join(""));
        for (let geracao = 0; geracao < 1000; geracao++) {
          const melhor = pop.reduce((m, s) => (aptidao(s) > aptidao(m) ? s : m));
          if (melhor === ALVO) { console.log("geração " + geracao + ": " + melhor); break; } // geração 33: OLA MUNDO
          const nova = [melhor]; // elitismo
          while (nova.length < TAM) {
            const a = torneio(pop), b = torneio(pop), corte = sorteio(ALVO.length);
            const filho = a.slice(0, corte) + b.slice(corte); // cruzamento em um ponto
            nova.push(Array.from(filho, g => (aleatorio() < MUTACAO ? GENES[sorteio(GENES.length)] : g)).join(""));
          }
          pop = nova;
        }
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class AlgoritmoGenetico {
            static int estado = 1;
            static double aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
                estado = estado * 1664525 + 1013904223;
                return Integer.toUnsignedLong(estado) / 4294967296.0;
            }
            static int sorteio(int n) { return (int) (aleatorio() * n); }

            static final String ALVO = "OLA MUNDO", GENES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
            static final int TAM = 50;
            static final double MUTACAO = 0.05;

            static int aptidao(String s) {
                int k = 0;
                for (int i = 0; i < s.length(); i++) if (s.charAt(i) == ALVO.charAt(i)) k++;
                return k;
            }

            static String torneio(List<String> pop) { // o melhor de 3 sorteados
                String melhor = pop.get(sorteio(TAM));
                for (int k = 0; k < 2; k++) { String c = pop.get(sorteio(TAM)); if (aptidao(c) > aptidao(melhor)) melhor = c; }
                return melhor;
            }

            public static void main(String[] args) {
                List<String> pop = new ArrayList<>();
                for (int i = 0; i < TAM; i++) {
                    StringBuilder s = new StringBuilder();
                    for (int j = 0; j < ALVO.length(); j++) s.append(GENES.charAt(sorteio(GENES.length())));
                    pop.add(s.toString());
                }
                for (int geracao = 0; geracao < 1000; geracao++) {
                    String melhor = pop.get(0);
                    for (String s : pop) if (aptidao(s) > aptidao(melhor)) melhor = s;
                    if (melhor.equals(ALVO)) { System.out.println("geração " + geracao + ": " + melhor); break; } // geração 33: OLA MUNDO
                    List<String> nova = new ArrayList<>(List.of(melhor)); // elitismo
                    while (nova.size() < TAM) {
                        String a = torneio(pop), b = torneio(pop);
                        int corte = sorteio(ALVO.length());
                        String filho = a.substring(0, corte) + b.substring(corte); // cruzamento em um ponto
                        StringBuilder mutado = new StringBuilder();
                        for (char g : filho.toCharArray()) mutado.append(aleatorio() < MUTACAO ? GENES.charAt(sorteio(GENES.length())) : g);
                        nova.add(mutado.toString());
                    }
                    pop = nova;
                }
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <string>
        #include <vector>
        using namespace std;

        uint32_t estado = 1;
        double aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
            estado = estado * 1664525u + 1013904223u;
            return estado / 4294967296.0;
        }
        int sorteio(int n) { return (int)(aleatorio() * n); }

        const string ALVO = "OLA MUNDO", GENES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
        const int TAM = 50;
        const double MUTACAO = 0.05;

        int aptidao(const string& s) { int k = 0; for (size_t i = 0; i < s.size(); i++) k += s[i] == ALVO[i]; return k; }

        string torneio(const vector<string>& pop) { // o melhor de 3 sorteados
            string melhor = pop[sorteio(TAM)];
            for (int k = 0; k < 2; k++) { const string& c = pop[sorteio(TAM)]; if (aptidao(c) > aptidao(melhor)) melhor = c; }
            return melhor;
        }

        int main() {
            vector<string> pop;
            for (int i = 0; i < TAM; i++) {
                string s;
                for (size_t j = 0; j < ALVO.size(); j++) s += GENES[sorteio(GENES.size())];
                pop.push_back(s);
            }
            for (int geracao = 0; geracao < 1000; geracao++) {
                string melhor = pop[0];
                for (const string& s : pop) if (aptidao(s) > aptidao(melhor)) melhor = s;
                if (melhor == ALVO) { printf("geração %d: %s\n", geracao, melhor.c_str()); break; }
                vector<string> nova = {melhor}; // elitismo
                while ((int)nova.size() < TAM) {
                    string a = torneio(pop), b = torneio(pop);
                    int corte = sorteio(ALVO.size());
                    string filho = a.substr(0, corte) + b.substr(corte); // cruzamento em um ponto
                    for (char& g : filho) if (aleatorio() < MUTACAO) g = GENES[sorteio(GENES.size())];
                    nova.push_back(filho);
                }
                pop = nova;
            }
        }
      `,
    },
  },
  {
    id: 'simplex',
    name: 'Método Simplex',
    difficulty: 'Avançado',
    en: { name: 'Simplex Method', summary: 'Solves linear programs by walking from vertex to vertex of the feasible region, always improving the objective.' },
    facts: { 'Criado por': 'George Dantzig', 'Ano': '1947', 'Tipo': 'Programação linear', 'Pior caso': 'Exponencial (Klee-Minty, 1972)', 'Na prática': 'Muito rápido (análise suavizada)' },
    summary: 'Resolve problemas de programação linear andando de vértice em vértice da região viável, sempre melhorando o objetivo.',
    description:
      'Um problema de programação linear pede o máximo (ou mínimo) de uma função linear, como 3x + 5y, sujeita a restrições lineares, como 3x + 2y ≤ 18. As restrições formam uma região viável que é um poliedro convexo, e o ótimo — se existir — está sempre em um vértice. O método Simplex, de George Dantzig, aproveita isso: começa em um vértice (por exemplo, a origem) e, a cada passo, escolhe uma aresta pela qual o objetivo melhora e anda até o próximo vértice, até não haver mais melhora. Algebricamente, tudo acontece em uma tabela (o tableau): cada restrição ganha uma variável de folga, uma variável "entra" na base (a de coeficiente mais negativo na linha do objetivo), o teste da razão decide qual "sai" e um pivoteamento, como na eliminação de Gauss-Jordan, atualiza a tabela. No pior caso o número de passos é exponencial, mas na prática o Simplex é extremamente rápido.',
    complexity: { best: 'O(m · n) por pivoteamento', average: 'Poucos pivoteamentos na prática (≈ 2m)', worst: 'Exponencial (cubo de Klee-Minty)', space: 'O(m · n)' },
    steps: [
      'Escreva o problema na forma padrão: maximizar c·x com Ax ≤ b, x ≥ 0 e b ≥ 0. Acrescente uma variável de folga por restrição.',
      'Monte o tableau: as restrições com as folgas e, na última linha, −c (a linha do objetivo). A base inicial são as folgas: o vértice x = 0.',
      'Escolha a variável que entra: a de coeficiente mais negativo na linha do objetivo. Se não houver, a solução atual é ótima.',
      'Teste da razão: entre as linhas com coeficiente positivo na coluna que entra, a de menor razão b/coeficiente diz qual variável sai (se nenhuma, o problema é ilimitado).',
      'Pivoteie (divida a linha do pivô e zere o resto da coluna) e volte ao passo 3.',
    ],
    usedIn: ['Logística e cadeias de suprimentos', 'Planejamento de produção e mistura (rações, ligas, combustíveis)', 'Escalas de companhias aéreas', 'Mercados de energia e despacho de usinas', 'Resolvedores comerciais (CPLEX, Gurobi, HiGHS)'],
    realWorld: [
      { title: 'Indústria e logística', text: 'Refinarias decidem quanto produzir de cada combustível, fábricas de ração escolhem a mistura mais barata que atende às exigências nutricionais e redes de varejo planejam o transporte entre depósitos — tudo com programação linear.' },
      { title: 'Companhias aéreas', text: 'Escalar tripulações e aeronaves envolve milhões de variáveis. Os resolvedores combinam o Simplex com técnicas de programação inteira, e economizam centenas de milhões de dólares por ano.' },
      { title: 'Mercado de energia', text: 'Operadores de sistemas elétricos decidem, a cada poucos minutos, quanto cada usina deve gerar para atender a demanda ao menor custo — um problema de programação linear resolvido continuamente.' },
    ],
    curiosities: [
      'Dantzig chegou atrasado a uma aula na faculdade, copiou dois problemas do quadro achando que eram lição de casa e os resolveu — eram problemas em aberto da estatística. A história inspirou uma cena do filme "Gênio Indomável".',
      'Em 1972, Klee e Minty mostraram um cubo "deformado" em que o Simplex visita todos os 2ⁿ vértices. Em 2001, Spielman e Teng explicaram, com a análise suavizada, por que isso quase nunca acontece na prática.',
      'Algoritmos de pontos interiores (Karmarkar, 1984) resolvem programação linear em tempo polinomial e competem com o Simplex em problemas enormes.',
    ],
    code: {
      python: String.raw`
        def simplex(c, A, b):                 # maximizar c·x com A·x <= b, x >= 0, b >= 0
            m, n = len(A), len(c)
            T = [A[i] + [1.0 if k == i else 0.0 for k in range(m)] + [b[i]] for i in range(m)]
            T.append([-v for v in c] + [0.0] * (m + 1))       # linha do objetivo
            base = [n + i for i in range(m)]                  # as folgas começam na base
            while True:
                entra = min(range(n + m), key=lambda j: T[m][j])
                if T[m][entra] >= -1e-9:
                    break                                     # nenhum coeficiente negativo: ótimo
                razoes = [(T[i][-1] / T[i][entra], i) for i in range(m) if T[i][entra] > 1e-9]
                if not razoes:
                    raise ValueError("problema ilimitado")
                _, sai = min(razoes)                          # teste da razão
                piv = T[sai][entra]
                T[sai] = [v / piv for v in T[sai]]
                for i in range(m + 1):
                    if i != sai:
                        f = T[i][entra]
                        T[i] = [a - f * p for a, p in zip(T[i], T[sai])]
                base[sai] = entra
            x = [0.0] * n
            for i, v in enumerate(base):
                if v < n:
                    x[v] = T[i][-1]
            return x, T[m][-1]

        x, z = simplex([3, 5], [[1, 0], [0, 2], [3, 2]], [4, 12, 18])
        print(f"x = {x[0]:.2f}, y = {x[1]:.2f}, z = {z:.2f}")   # x = 2.00, y = 6.00, z = 36.00
      `,
      javascript: String.raw`
        function simplex(c, A, b) { // maximizar c·x com A·x <= b, x >= 0, b >= 0
          const m = A.length, n = c.length;
          const T = A.map((row, i) => [...row, ...Array.from({ length: m }, (_, k) => (k === i ? 1 : 0)), b[i]]);
          T.push([...c.map(v => -v), ...Array(m + 1).fill(0)]); // linha do objetivo
          const base = A.map((_, i) => n + i);                  // as folgas começam na base
          while (true) {
            let entra = 0;
            for (let j = 1; j < n + m; j++) if (T[m][j] < T[m][entra]) entra = j;
            if (T[m][entra] >= -1e-9) break;                     // nenhum coeficiente negativo: ótimo
            let sai = -1;
            for (let i = 0; i < m; i++) // teste da razão
              if (T[i][entra] > 1e-9 && (sai < 0 || T[i][n + m] / T[i][entra] < T[sai][n + m] / T[sai][entra])) sai = i;
            if (sai < 0) throw new Error("problema ilimitado");
            const piv = T[sai][entra];
            T[sai] = T[sai].map(v => v / piv);
            for (let i = 0; i <= m; i++) {
              if (i === sai) continue;
              const f = T[i][entra];
              T[i] = T[i].map((v, j) => v - f * T[sai][j]);
            }
            base[sai] = entra;
          }
          const x = Array(n).fill(0);
          base.forEach((v, i) => { if (v < n) x[v] = T[i][n + m]; });
          return [x, T[m][n + m]];
        }

        const [x, z] = simplex([3, 5], [[1, 0], [0, 2], [3, 2]], [4, 12, 18]);
        console.log("x = " + x[0].toFixed(2) + ", y = " + x[1].toFixed(2) + ", z = " + z.toFixed(2)); // x = 2.00, y = 6.00, z = 36.00
      `,
      java: String.raw`
        import java.util.Locale;

        public class Simplex {
            public static void main(String[] args) {
                double[] c = {3, 5};                       // maximizar 3x + 5y
                double[][] A = {{1, 0}, {0, 2}, {3, 2}};   // sujeito a A·x <= b
                double[] b = {4, 12, 18};
                int m = A.length, n = c.length;
                double[][] T = new double[m + 1][n + m + 1];
                int[] base = new int[m];
                for (int i = 0; i < m; i++) {
                    System.arraycopy(A[i], 0, T[i], 0, n);
                    T[i][n + i] = 1;                       // folga
                    T[i][n + m] = b[i];
                    base[i] = n + i;
                }
                for (int j = 0; j < n; j++) T[m][j] = -c[j]; // linha do objetivo
                while (true) {
                    int entra = 0;
                    for (int j = 1; j < n + m; j++) if (T[m][j] < T[m][entra]) entra = j;
                    if (T[m][entra] >= -1e-9) break;       // ótimo
                    int sai = -1;
                    for (int i = 0; i < m; i++) // teste da razão
                        if (T[i][entra] > 1e-9 && (sai < 0 || T[i][n + m] / T[i][entra] < T[sai][n + m] / T[sai][entra])) sai = i;
                    if (sai < 0) throw new ArithmeticException("problema ilimitado");
                    double piv = T[sai][entra];
                    for (int j = 0; j <= n + m; j++) T[sai][j] /= piv;
                    for (int i = 0; i <= m; i++) {
                        if (i == sai) continue;
                        double f = T[i][entra];
                        for (int j = 0; j <= n + m; j++) T[i][j] -= f * T[sai][j];
                    }
                    base[sai] = entra;
                }
                double[] x = new double[n];
                for (int i = 0; i < m; i++) if (base[i] < n) x[base[i]] = T[i][n + m];
                System.out.println(String.format(Locale.ROOT, "x = %.2f, y = %.2f, z = %.2f", x[0], x[1], T[m][n + m])); // x = 2.00, y = 6.00, z = 36.00
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <stdexcept>
        #include <vector>
        using namespace std;

        int main() {
            vector<double> c = {3, 5};                          // maximizar 3x + 5y
            vector<vector<double>> A = {{1, 0}, {0, 2}, {3, 2}}; // sujeito a A·x <= b
            vector<double> b = {4, 12, 18};
            int m = A.size(), n = c.size();
            vector<vector<double>> T(m + 1, vector<double>(n + m + 1, 0));
            vector<int> base(m);
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) T[i][j] = A[i][j];
                T[i][n + i] = 1;                                // folga
                T[i][n + m] = b[i];
                base[i] = n + i;
            }
            for (int j = 0; j < n; j++) T[m][j] = -c[j];        // linha do objetivo
            while (true) {
                int entra = 0;
                for (int j = 1; j < n + m; j++) if (T[m][j] < T[m][entra]) entra = j;
                if (T[m][entra] >= -1e-9) break;                // ótimo
                int sai = -1;
                for (int i = 0; i < m; i++) // teste da razão
                    if (T[i][entra] > 1e-9 && (sai < 0 || T[i][n + m] / T[i][entra] < T[sai][n + m] / T[sai][entra])) sai = i;
                if (sai < 0) throw runtime_error("problema ilimitado");
                double piv = T[sai][entra];
                for (double& v : T[sai]) v /= piv;
                for (int i = 0; i <= m; i++) {
                    if (i == sai) continue;
                    double f = T[i][entra];
                    for (int j = 0; j <= n + m; j++) T[i][j] -= f * T[sai][j];
                }
                base[sai] = entra;
            }
            vector<double> x(n, 0);
            for (int i = 0; i < m; i++) if (base[i] < n) x[base[i]] = T[i][n + m];
            printf("x = %.2f, y = %.2f, z = %.2f\n", x[0], x[1], T[m][n + m]); // x = 2.00, y = 6.00, z = 36.00
        }
      `,
    },
  },
  {
    id: 'ant-colony',
    name: 'Otimização por Colônia de Formigas',
    difficulty: 'Avançado',
    en: { name: 'Ant Colony Optimization', summary: 'Virtual ants build routes and leave pheromone on short ones; the colony converges on good solutions to the traveling salesman problem.' },
    facts: { 'Criado por': 'Marco Dorigo', 'Ano': '1992 (tese de doutorado)', 'Tipo': 'Inteligência de enxame (meta-heurística)', 'Inspiração': 'Formigas marcando trilhas com feromônio', 'Parâmetros': 'α (feromônio), β (distância), ρ (evaporação)' },
    summary: 'Formigas virtuais constroem rotas e deixam feromônio nas mais curtas; a colônia converge para boas soluções do caixeiro-viajante.',
    description:
      'Formigas de verdade encontram o caminho mais curto até a comida sem nenhum plano: cada uma deixa um rastro de feromônio, e as outras tendem a seguir os rastros mais fortes. Como o caminho curto é percorrido mais vezes no mesmo tempo, ele acumula mais feromônio, e a colônia converge para ele. A otimização por colônia de formigas transforma isso em algoritmo. No caixeiro-viajante, cada formiga monta uma rota cidade por cidade, escolhendo a próxima com probabilidade proporcional a τ^α · (1/d)^β — o feromônio da aresta e o quanto ela é curta. Depois que todas terminam, o feromônio evapora em parte (para esquecer escolhas ruins) e cada formiga deposita mais nas arestas que usou, em quantidade inversa ao comprimento da rota. Ao longo das iterações, as arestas das boas rotas ficam cada vez mais atraentes.',
    complexity: { best: 'O(iterações · formigas · n²)', average: 'O(t · k · n²)', worst: 'Sem garantia de ótimo', space: 'O(n²) (matriz de feromônio)' },
    steps: [
      'Inicialize o feromônio de todas as arestas com um valor pequeno igual.',
      'Cada formiga começa em uma cidade e escolhe a próxima (ainda não visitada) com probabilidade ∝ τ^α · (1/d)^β, até fechar a rota.',
      'Evapore: τ ← (1 − ρ)·τ em todas as arestas.',
      'Deposite: cada formiga soma 1/comprimento da sua rota ao feromônio das arestas usadas.',
      'Guarde a melhor rota vista e repita por várias iterações.',
    ],
    usedIn: ['Roteamento de veículos e de entregas', 'Roteamento em redes de telecomunicações (AntNet)', 'Escalonamento de tarefas e de máquinas', 'Montagem de sequências de DNA', 'Planejamento de trajetórias de robôs'],
    realWorld: [
      { title: 'Redes de telecomunicações', text: 'O AntNet (1998) usava "formigas" — pacotes de controle — para explorar uma rede e atualizar tabelas de roteamento conforme o congestionamento, adaptando as rotas em tempo real.' },
      { title: 'Logística', text: 'Empresas de distribuição já usaram colônias de formigas para planejar rotas de caminhões com janelas de horário; a suíça AntOptima foi criada justamente para comercializar esses algoritmos.' },
      { title: 'Inteligência de enxame', text: 'A ideia de muitos agentes simples, sem controle central, produzindo um comportamento inteligente também inspira a otimização por enxame de partículas e o controle de enxames de drones e robôs.' },
    ],
    curiosities: [
      'O experimento da "ponte dupla" (Deneubourg, 1990) mostrou formigas argentinas escolhendo o mais curto de dois caminhos até a comida — a observação que inspirou Dorigo.',
      'A evaporação é essencial: sem ela, as primeiras rotas (ainda ruins) acumulariam feromônio para sempre, e a colônia ficaria presa a elas.',
      'Variantes como o MAX-MIN Ant System limitam o feromônio entre um mínimo e um máximo para manter a diversidade — e estão entre as mais eficazes.',
    ],
    code: {
      python: String.raw`
        import math

        estado = 7
        def aleatorio():                       # gerador congruencial (o mesmo nas 4 linguagens)
            global estado
            estado = (estado * 1664525 + 1013904223) & 0xFFFFFFFF
            return estado / 4294967296

        cidades = [(0, 0), (4, 3), (1, 5), (6, 1), (3, 0), (5, 5), (2, 2), (6, 4)]
        n = len(cidades)
        d = [[math.dist(a, b) for b in cidades] for a in cidades]
        tau = [[1.0] * n for _ in range(n)]
        FORMIGAS, RHO = 10, 0.5
        melhor = float("inf")

        for _ in range(30):
            rotas = []
            for _ in range(FORMIGAS):
                rota = [int(aleatorio() * n)]
                while len(rota) < n:
                    i = rota[-1]
                    opcoes = [j for j in range(n) if j not in rota]
                    pesos = [tau[i][j] / (d[i][j] * d[i][j]) for j in opcoes]   # α = 1, β = 2
                    r, k = aleatorio() * sum(pesos), 0
                    while k < len(pesos) - 1 and r >= pesos[k]:                 # roleta
                        r -= pesos[k]
                        k += 1
                    rota.append(opcoes[k])
                comp = sum(d[rota[i]][rota[i - 1]] for i in range(n))
                rotas.append((rota, comp))
                melhor = min(melhor, comp)
            tau = [[v * (1 - RHO) for v in linha] for linha in tau]             # evaporação
            for rota, comp in rotas:                                            # depósito
                for i in range(n):
                    a, b = rota[i], rota[i - 1]
                    tau[a][b] += 1 / comp
                    tau[b][a] += 1 / comp
        print(f"melhor rota: {melhor:.2f}")   # melhor rota: 22.41 (o ótimo)
      `,
      javascript: String.raw`
        let estado = 7;
        function aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
          estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
          return estado / 4294967296;
        }

        const cidades = [[0, 0], [4, 3], [1, 5], [6, 1], [3, 0], [5, 5], [2, 2], [6, 4]];
        const n = cidades.length;
        const d = cidades.map(a => cidades.map(b => Math.hypot(a[0] - b[0], a[1] - b[1])));
        let tau = cidades.map(() => Array(n).fill(1));
        const FORMIGAS = 10, RHO = 0.5;
        let melhor = Infinity;

        for (let it = 0; it < 30; it++) {
          const rotas = [];
          for (let f = 0; f < FORMIGAS; f++) {
            const rota = [Math.floor(aleatorio() * n)];
            while (rota.length < n) {
              const i = rota[rota.length - 1];
              const opcoes = [...Array(n).keys()].filter(j => !rota.includes(j));
              const pesos = opcoes.map(j => tau[i][j] / (d[i][j] * d[i][j])); // α = 1, β = 2
              let r = aleatorio() * pesos.reduce((a, b) => a + b, 0), k = 0;
              while (k < pesos.length - 1 && r >= pesos[k]) { r -= pesos[k]; k++; } // roleta
              rota.push(opcoes[k]);
            }
            let comp = 0;
            for (let i = 0; i < n; i++) comp += d[rota[i]][rota[(i - 1 + n) % n]];
            rotas.push([rota, comp]);
            melhor = Math.min(melhor, comp);
          }
          tau = tau.map(linha => linha.map(v => v * (1 - RHO))); // evaporação
          for (const [rota, comp] of rotas) // depósito
            for (let i = 0; i < n; i++) {
              const a = rota[i], b = rota[(i - 1 + n) % n];
              tau[a][b] += 1 / comp;
              tau[b][a] += 1 / comp;
            }
        }
        console.log("melhor rota: " + melhor.toFixed(2)); // melhor rota: 22.41 (o ótimo)
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Locale;

        public class ColoniaDeFormigas {
            static int estado = 7;
            static double aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
                estado = estado * 1664525 + 1013904223;
                return Integer.toUnsignedLong(estado) / 4294967296.0;
            }

            public static void main(String[] args) {
                double[][] cidades = {{0, 0}, {4, 3}, {1, 5}, {6, 1}, {3, 0}, {5, 5}, {2, 2}, {6, 4}};
                int n = cidades.length, FORMIGAS = 10;
                double RHO = 0.5, melhor = Double.POSITIVE_INFINITY;
                double[][] d = new double[n][n], tau = new double[n][n];
                for (int i = 0; i < n; i++)
                    for (int j = 0; j < n; j++) {
                        d[i][j] = Math.hypot(cidades[i][0] - cidades[j][0], cidades[i][1] - cidades[j][1]);
                        tau[i][j] = 1;
                    }
                for (int it = 0; it < 30; it++) {
                    List<int[]> rotas = new ArrayList<>();
                    List<Double> comps = new ArrayList<>();
                    for (int f = 0; f < FORMIGAS; f++) {
                        List<Integer> rota = new ArrayList<>(List.of((int) (aleatorio() * n)));
                        while (rota.size() < n) {
                            int i = rota.get(rota.size() - 1);
                            List<Integer> opcoes = new ArrayList<>();
                            List<Double> pesos = new ArrayList<>();
                            double total = 0;
                            for (int j = 0; j < n; j++) if (!rota.contains(j)) {
                                opcoes.add(j);
                                double p = tau[i][j] / (d[i][j] * d[i][j]); // α = 1, β = 2
                                pesos.add(p);
                                total += p;
                            }
                            double r = aleatorio() * total;
                            int k = 0;
                            while (k < pesos.size() - 1 && r >= pesos.get(k)) { r -= pesos.get(k); k++; } // roleta
                            rota.add(opcoes.get(k));
                        }
                        double comp = 0;
                        for (int i = 0; i < n; i++) comp += d[rota.get(i)][rota.get((i - 1 + n) % n)];
                        rotas.add(rota.stream().mapToInt(Integer::intValue).toArray());
                        comps.add(comp);
                        melhor = Math.min(melhor, comp);
                    }
                    for (double[] linha : tau) for (int j = 0; j < n; j++) linha[j] *= 1 - RHO; // evaporação
                    for (int r = 0; r < rotas.size(); r++) // depósito
                        for (int i = 0; i < n; i++) {
                            int a = rotas.get(r)[i], b = rotas.get(r)[(i - 1 + n) % n];
                            tau[a][b] += 1 / comps.get(r);
                            tau[b][a] += 1 / comps.get(r);
                        }
                }
                System.out.println(String.format(Locale.ROOT, "melhor rota: %.2f", melhor)); // melhor rota: 22.41 (o ótimo)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cmath>
        #include <cstdint>
        #include <cstdio>
        #include <limits>
        #include <utility>
        #include <vector>
        using namespace std;

        uint32_t estado = 7;
        double aleatorio() { // gerador congruencial (o mesmo nas 4 linguagens)
            estado = estado * 1664525u + 1013904223u;
            return estado / 4294967296.0;
        }

        int main() {
            const double cidades[8][2] = {{0, 0}, {4, 3}, {1, 5}, {6, 1}, {3, 0}, {5, 5}, {2, 2}, {6, 4}};
            const int n = 8, FORMIGAS = 10;
            const double RHO = 0.5;
            double d[n][n], tau[n][n], melhor = numeric_limits<double>::infinity();
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++) {
                    d[i][j] = hypot(cidades[i][0] - cidades[j][0], cidades[i][1] - cidades[j][1]);
                    tau[i][j] = 1;
                }
            for (int it = 0; it < 30; it++) {
                vector<pair<vector<int>, double>> rotas;
                for (int f = 0; f < FORMIGAS; f++) {
                    vector<int> rota = {(int)(aleatorio() * n)};
                    while ((int)rota.size() < n) {
                        int i = rota.back();
                        vector<int> opcoes;
                        vector<double> pesos;
                        double total = 0;
                        for (int j = 0; j < n; j++)
                            if (find(rota.begin(), rota.end(), j) == rota.end()) {
                                opcoes.push_back(j);
                                pesos.push_back(tau[i][j] / (d[i][j] * d[i][j])); // α = 1, β = 2
                                total += pesos.back();
                            }
                        double r = aleatorio() * total;
                        size_t k = 0;
                        while (k + 1 < pesos.size() && r >= pesos[k]) { r -= pesos[k]; k++; } // roleta
                        rota.push_back(opcoes[k]);
                    }
                    double comp = 0;
                    for (int i = 0; i < n; i++) comp += d[rota[i]][rota[(i - 1 + n) % n]];
                    rotas.push_back({rota, comp});
                    melhor = min(melhor, comp);
                }
                for (auto& linha : tau) for (double& v : linha) v *= 1 - RHO; // evaporação
                for (auto& [rota, comp] : rotas) // depósito
                    for (int i = 0; i < n; i++) {
                        int a = rota[i], b = rota[(i - 1 + n) % n];
                        tau[a][b] += 1 / comp;
                        tau[b][a] += 1 / comp;
                    }
            }
            printf("melhor rota: %.2f\n", melhor);
        }
      `,
    },
  },
]
