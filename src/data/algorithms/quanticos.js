export default [
  {
    id: 'deutsch-jozsa',
    name: 'Algoritmo de Deutsch-Jozsa',
    difficulty: 'Intermediário',
    en: { name: 'Deutsch-Jozsa Algorithm', summary: 'Decides with a single query whether a function is constant or balanced — the first proof that a quantum computer can be exponentially faster than a deterministic classical one.' },
    facts: { 'Criado por': 'David Deutsch e Richard Jozsa', 'Ano': '1992', 'Consultas quânticas': '1', 'Consultas clássicas (determinístico)': '2ⁿ⁻¹ + 1 no pior caso', 'Ideia central': 'Interferência e retrocesso de fase' },
    summary: 'Descobre com uma única consulta se uma função é constante ou balanceada — a primeira prova de que um computador quântico pode ser exponencialmente mais rápido que um clássico determinístico.',
    description:
      'Imagine uma caixa-preta f que recebe n bits e devolve 0 ou 1, com a promessa de que ela é constante (sempre a mesma resposta) ou balanceada (metade das entradas dá 0 e metade dá 1). Um algoritmo clássico determinístico pode precisar de 2ⁿ⁻¹ + 1 consultas para ter certeza: as primeiras metade das respostas podem ser todas iguais por azar. O algoritmo de Deutsch-Jozsa resolve com uma única consulta. Ele coloca os n qubits em superposição de todas as entradas com portas Hadamard, consulta o oráculo uma vez — que, com um qubit auxiliar preparado em |−⟩, inverte o sinal da amplitude de cada x com f(x) = 1 — e aplica Hadamard de novo. As amplitudes então interferem: a de |00…0⟩ vira a média dos sinais. Se f é constante, todos os sinais são iguais e a medição dá sempre 00…0; se é balanceada, os sinais se cancelam exatamente e 00…0 nunca aparece. O problema é artificial e um algoritmo clássico aleatório acerta com alta probabilidade usando poucas consultas, mas ele mostrou pela primeira vez a combinação de superposição, oráculo e interferência que está por trás de Simon, Shor e Grover. O simulador abaixo guarda as 2ⁿ amplitudes de um vetor de estado, exatamente como um simulador quântico de verdade.',
    complexity: { best: 'O(1) consultas', average: 'O(1) consultas + O(n) portas', worst: 'Simulação clássica: O(n · 2ⁿ)', space: 'n + 1 qubits (2ⁿ amplitudes para simular)' },
    steps: [
      'Prepare n qubits em |0⟩ e um qubit auxiliar em |1⟩.',
      'Aplique Hadamard em todos: o registrador fica em superposição uniforme de todas as 2ⁿ entradas, e o auxiliar em |−⟩.',
      'Consulte o oráculo uma vez: |x⟩|y⟩ → |x⟩|y ⊕ f(x)⟩. Como o auxiliar está em |−⟩, isso equivale a multiplicar a amplitude de |x⟩ por (−1)^f(x).',
      'Aplique Hadamard de novo nos n qubits: a amplitude de |00…0⟩ passa a ser a média de (−1)^f(x).',
      'Meça: se o resultado for 00…0, a função é constante; qualquer outro resultado indica que é balanceada.',
    ],
    usedIn: ['Ensino de computação quântica (primeiro algoritmo de muitos cursos)', 'Testes e demonstrações de processadores quânticos reais', 'Base para os algoritmos de Bernstein-Vazirani e Simon', 'Estudo de complexidade de consultas (oráculos)'],
    realWorld: [
      { title: 'Primeiras demonstrações em hardware', text: 'Em 1998, o algoritmo de Deutsch-Jozsa foi um dos primeiros executados em um computador quântico de verdade, usando ressonância magnética nuclear com 2 qubits. Desde então é usado como teste de sanidade em novas plataformas.' },
      { title: 'Nuvens quânticas', text: 'IBM Quantum, Amazon Braket e Azure Quantum trazem o Deutsch-Jozsa entre os primeiros tutoriais: o circuito é curto o bastante para rodar em hardware ruidoso e o resultado esperado (só zeros ou não) é fácil de conferir.' },
      { title: 'Bernstein-Vazirani', text: 'O mesmo circuito, com um oráculo f(x) = s · x mod 2, descobre um número secreto s de n bits com uma consulta, contra n consultas clássicas — uma variação direta do Deutsch-Jozsa.' },
    ],
    curiosities: [
      'O caso com n = 1 é o algoritmo de Deutsch, de 1985 — o primeiro algoritmo quântico. A versão original só funcionava com 50% de chance; a versão determinística veio em 1998, com Cleve, Ekert, Macchiavello e Mosca.',
      'David Deutsch é um dos pais da computação quântica: em 1985 ele descreveu a máquina de Turing quântica universal.',
      'A vantagem é exponencial só contra algoritmos clássicos determinísticos e exatos. Sorteando algumas entradas, um algoritmo clássico erra com probabilidade minúscula — por isso o problema é mais didático do que útil.',
    ],
    code: {
      python: String.raw`
        import math

        def hadamard(estado):                      # H em todos os qubits (Walsh-Hadamard)
            v, h = list(estado), 1
            while h < len(v):
                for i in range(0, len(v), 2 * h):
                    for j in range(i, i + h):
                        a, b = v[j], v[j + h]
                        v[j], v[j + h] = (a + b) / math.sqrt(2), (a - b) / math.sqrt(2)
                h *= 2
            return v

        def deutsch_jozsa(f, n):
            estado = [0.0] * (2 ** n)
            estado[0] = 1.0                        # |00…0⟩
            estado = hadamard(estado)              # superposição uniforme
            estado = [-a if f(x) else a for x, a in enumerate(estado)]   # oráculo: fase (−1)^f(x)
            estado = hadamard(estado)              # interferência
            p0 = estado[0] ** 2                    # probabilidade de medir |00…0⟩
            return "constante" if p0 > 0.5 else "balanceada"

        print(deutsch_jozsa(lambda x: 1, 3))                       # constante
        print(deutsch_jozsa(lambda x: x & 1, 3))                   # balanceada
        print(deutsch_jozsa(lambda x: bin(x).count("1") % 2, 3))   # balanceada
      `,
      javascript: String.raw`
        function hadamard(estado) { // H em todos os qubits (Walsh-Hadamard)
          const v = [...estado];
          for (let h = 1; h < v.length; h *= 2)
            for (let i = 0; i < v.length; i += 2 * h)
              for (let j = i; j < i + h; j++) {
                const a = v[j], b = v[j + h];
                v[j] = (a + b) / Math.SQRT2;
                v[j + h] = (a - b) / Math.SQRT2;
              }
          return v;
        }

        function deutschJozsa(f, n) {
          let estado = Array(2 ** n).fill(0);
          estado[0] = 1;                                   // |00…0⟩
          estado = hadamard(estado);                       // superposição uniforme
          estado = estado.map((a, x) => (f(x) ? -a : a));  // oráculo: fase (−1)^f(x)
          estado = hadamard(estado);                       // interferência
          const p0 = estado[0] ** 2;                       // probabilidade de medir |00…0⟩
          return p0 > 0.5 ? "constante" : "balanceada";
        }

        const paridade = x => x.toString(2).split("1").length % 2 === 0 ? 1 : 0;
        console.log(deutschJozsa(() => 1, 3));      // constante
        console.log(deutschJozsa(x => x & 1, 3));   // balanceada
        console.log(deutschJozsa(paridade, 3));     // balanceada
      `,
      java: String.raw`
        import java.util.function.IntUnaryOperator;

        public class DeutschJozsa {
            static double[] hadamard(double[] estado) { // H em todos os qubits (Walsh-Hadamard)
                double[] v = estado.clone();
                double s = Math.sqrt(2);
                for (int h = 1; h < v.length; h *= 2)
                    for (int i = 0; i < v.length; i += 2 * h)
                        for (int j = i; j < i + h; j++) {
                            double a = v[j], b = v[j + h];
                            v[j] = (a + b) / s;
                            v[j + h] = (a - b) / s;
                        }
                return v;
            }

            static String deutschJozsa(IntUnaryOperator f, int n) {
                double[] estado = new double[1 << n];
                estado[0] = 1;                                         // |00…0⟩
                estado = hadamard(estado);                             // superposição uniforme
                for (int x = 0; x < estado.length; x++)
                    if (f.applyAsInt(x) == 1) estado[x] = -estado[x];  // oráculo: fase (−1)^f(x)
                estado = hadamard(estado);                             // interferência
                double p0 = estado[0] * estado[0];                     // probabilidade de medir |00…0⟩
                return p0 > 0.5 ? "constante" : "balanceada";
            }

            public static void main(String[] args) {
                System.out.println(deutschJozsa(x -> 1, 3));                    // constante
                System.out.println(deutschJozsa(x -> x & 1, 3));                // balanceada
                System.out.println(deutschJozsa(x -> Integer.bitCount(x) % 2, 3)); // balanceada
            }
        }
      `,
      cpp: String.raw`
        #include <bitset>
        #include <cmath>
        #include <functional>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<double> hadamard(vector<double> v) { // H em todos os qubits (Walsh-Hadamard)
            for (size_t h = 1; h < v.size(); h *= 2)
                for (size_t i = 0; i < v.size(); i += 2 * h)
                    for (size_t j = i; j < i + h; j++) {
                        double a = v[j], b = v[j + h];
                        v[j] = (a + b) / sqrt(2.0);
                        v[j + h] = (a - b) / sqrt(2.0);
                    }
            return v;
        }

        string deutschJozsa(function<int(int)> f, int n) {
            vector<double> estado(1 << n, 0.0);
            estado[0] = 1;                                        // |00…0⟩
            estado = hadamard(estado);                            // superposição uniforme
            for (int x = 0; x < (int)estado.size(); x++)
                if (f(x)) estado[x] = -estado[x];                 // oráculo: fase (−1)^f(x)
            estado = hadamard(estado);                            // interferência
            double p0 = estado[0] * estado[0];                    // probabilidade de medir |00…0⟩
            return p0 > 0.5 ? "constante" : "balanceada";
        }

        int main() {
            cout << deutschJozsa([](int) { return 1; }, 3) << "\n";                        // constante
            cout << deutschJozsa([](int x) { return x & 1; }, 3) << "\n";                  // balanceada
            cout << deutschJozsa([](int x) { return (int)(bitset<32>(x).count() % 2); }, 3) << "\n"; // balanceada
        }
      `,
    },
  },
  {
    id: 'grover',
    name: 'Algoritmo de Grover',
    difficulty: 'Intermediário',
    en: { name: "Grover's Algorithm", summary: 'Finds a marked item among N unsorted ones with about √N queries, by repeatedly amplifying the amplitude of the right answer.' },
    facts: { 'Criado por': 'Lov Grover (Bell Labs)', 'Ano': '1996', 'Consultas': '≈ π/4 · √N', 'Classicamente': 'N/2 consultas em média', 'Ideia central': 'Amplificação de amplitude', 'Ótimo?': 'Sim: nenhum algoritmo quântico faz menos que Ω(√N)' },
    summary: 'Encontra um item marcado entre N sem ordem nenhuma com cerca de √N consultas, amplificando repetidamente a amplitude da resposta certa.',
    description:
      'Procurar um item em uma lista sem ordem exige, classicamente, olhar em média metade dos N itens. O algoritmo de Grover faz isso com cerca de π/4 · √N consultas a um oráculo que reconhece a resposta. Ele começa com todos os N estados em superposição uniforme, cada um com amplitude 1/√N. Cada iteração tem duas partes. O oráculo inverte o sinal da amplitude do item marcado — a probabilidade ainda é a mesma, só a fase mudou. Em seguida, o operador de difusão reflete todas as amplitudes em torno da média: como a amplitude marcada está abaixo da média (negativa), ela é jogada bem para cima, e as demais diminuem um pouco. Geometricamente, cada iteração gira o estado de um ângulo fixo em direção à resposta. Depois de ≈ π/4 · √N giros, medir dá o item marcado com probabilidade próxima de 1; girar demais passa do ponto e a probabilidade volta a cair. Com 1 milhão de itens, são cerca de 785 consultas em vez de 500 mil. A aceleração é quadrática, não exponencial, mas vale para qualquer problema de busca em que dá para verificar uma resposta — por isso ela também afeta a criptografia simétrica: uma chave de 128 bits teria a segurança de uma de 64 bits.',
    complexity: { best: 'O(√N) consultas', average: 'O(√N) consultas', worst: 'O(√N) consultas; simulação clássica O(N · √N)', space: 'log₂ N qubits' },
    steps: [
      'Coloque os n = log₂ N qubits em superposição uniforme com Hadamard: cada item com amplitude 1/√N.',
      'Oráculo: inverta o sinal da amplitude do item procurado (o oráculo só precisa saber reconhecer a resposta).',
      'Difusão: troque cada amplitude a por 2·média − a (inversão em torno da média). A amplitude marcada cresce.',
      'Repita oráculo + difusão cerca de ⌊π/4 · √N⌋ vezes.',
      'Meça: o resultado é o item marcado com alta probabilidade. Se houver M itens marcados, bastam ≈ π/4 · √(N/M) iterações.',
    ],
    usedIn: ['Busca em espaços não estruturados', 'Ataques de força bruta a chaves simétricas (análise de segurança pós-quântica)', 'Acelerar algoritmos para SAT e problemas NP (aceleração quadrática)', 'Contagem quântica e estimativa de amplitude (finanças, Monte Carlo)', 'Subrotina de algoritmos de mínimo, colisões e grafos'],
    realWorld: [
      { title: 'Tamanho de chaves', text: 'Por causa de Grover, órgãos como o NIST recomendam AES-256 para proteção de longo prazo: Grover reduz a força bruta de 2²⁵⁶ para cerca de 2¹²⁸ operações quânticas, o que continua fora de alcance.' },
      { title: 'Estimativa de amplitude', text: 'Uma generalização de Grover, a estimativa de amplitude, acelera quadraticamente simulações de Monte Carlo. Bancos como JPMorgan e Goldman Sachs estudam o uso em precificação de opções e análise de risco.' },
      { title: 'Demonstrações em hardware', text: 'Grover com 2 a 5 qubits já rodou em íons aprisionados e chips supercondutores. Para N = 4, uma única iteração encontra o item com 100% de probabilidade.' },
    ],
    curiosities: [
      'Para N = 4 o algoritmo é perfeito: uma iteração leva a probabilidade do item marcado de 25% para exatamente 100%.',
      'Bennett, Bernstein, Brassard e Vazirani provaram que Ω(√N) consultas são necessárias: Grover é ótimo, e computadores quânticos não resolvem busca cega em tempo polinomial.',
      'Lov Grover publicou o algoritmo com o título "Um algoritmo quântico rápido para busca em banco de dados" — mas, na prática, ele brilha em problemas em que o "banco de dados" é implícito, como testar chaves.',
    ],
    code: {
      python: String.raw`
        import math

        def grover(n, marcado):
            N = 2 ** n
            estado = [1 / math.sqrt(N)] * N               # superposição uniforme
            iteracoes = int(math.pi / 4 * math.sqrt(N))
            for _ in range(iteracoes):
                estado[marcado] = -estado[marcado]       # oráculo: inverte a fase do item marcado
                media = sum(estado) / N
                estado = [2 * media - a for a in estado] # difusão: inversão em torno da média
            return iteracoes, estado[marcado] ** 2

        for n, alvo in [(2, 3), (4, 11), (10, 700)]:
            it, p = grover(n, alvo)
            print(2 ** n, "itens:", it, "iterações, P =", round(p, 4))
        # 4 itens: 1 iterações, P = 1.0
        # 16 itens: 3 iterações, P = 0.9613
        # 1024 itens: 25 iterações, P = 0.9995
      `,
      javascript: String.raw`
        function grover(n, marcado) {
          const N = 2 ** n;
          let estado = Array(N).fill(1 / Math.sqrt(N));      // superposição uniforme
          const iteracoes = Math.floor((Math.PI / 4) * Math.sqrt(N));
          for (let i = 0; i < iteracoes; i++) {
            estado[marcado] = -estado[marcado];              // oráculo: inverte a fase do item marcado
            const media = estado.reduce((s, a) => s + a, 0) / N;
            estado = estado.map(a => 2 * media - a);         // difusão: inversão em torno da média
          }
          return [iteracoes, estado[marcado] ** 2];
        }

        for (const [n, alvo] of [[2, 3], [4, 11], [10, 700]]) {
          const [it, p] = grover(n, alvo);
          console.log(2 ** n + " itens: " + it + " iterações, P = " + Math.round(p * 10000) / 10000);
        }
        // 4 itens: 1 iterações, P = 1
        // 16 itens: 3 iterações, P = 0.9613
        // 1024 itens: 25 iterações, P = 0.9995
      `,
      java: String.raw`
        public class Grover {
            static double[] grover(int n, int marcado) {
                int N = 1 << n;
                double[] estado = new double[N];
                java.util.Arrays.fill(estado, 1 / Math.sqrt(N));   // superposição uniforme
                int iteracoes = (int) (Math.PI / 4 * Math.sqrt(N));
                for (int i = 0; i < iteracoes; i++) {
                    estado[marcado] = -estado[marcado];            // oráculo: inverte a fase do item marcado
                    double media = 0;
                    for (double a : estado) media += a / N;
                    for (int x = 0; x < N; x++) estado[x] = 2 * media - estado[x]; // difusão
                }
                return new double[] { iteracoes, estado[marcado] * estado[marcado] };
            }

            public static void main(String[] args) {
                int[][] casos = { { 2, 3 }, { 4, 11 }, { 10, 700 } };
                for (int[] c : casos) {
                    double[] r = grover(c[0], c[1]);
                    System.out.println((1 << c[0]) + " itens: " + (int) r[0] + " iterações, P = " + Math.round(r[1] * 10000) / 10000.0);
                }
                // 4 itens: 1 iterações, P = 1.0
                // 16 itens: 3 iterações, P = 0.9613
                // 1024 itens: 25 iterações, P = 0.9995
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <iostream>
        #include <utility>
        #include <vector>
        using namespace std;

        pair<int, double> grover(int n, int marcado) {
            int N = 1 << n;
            vector<double> estado(N, 1 / sqrt((double)N));        // superposição uniforme
            int iteracoes = (int)(M_PI / 4 * sqrt((double)N));
            for (int i = 0; i < iteracoes; i++) {
                estado[marcado] = -estado[marcado];               // oráculo: inverte a fase do item marcado
                double media = 0;
                for (double a : estado) media += a / N;
                for (double& a : estado) a = 2 * media - a;       // difusão: inversão em torno da média
            }
            return { iteracoes, estado[marcado] * estado[marcado] };
        }

        int main() {
            int casos[3][2] = { { 2, 3 }, { 4, 11 }, { 10, 700 } };
            for (auto& c : casos) {
                auto [it, p] = grover(c[0], c[1]);
                cout << (1 << c[0]) << " itens: " << it << " iterações, P = " << round(p * 10000) / 10000 << "\n";
            }
            // 4 itens: 1 iterações, P = 1
            // 16 itens: 3 iterações, P = 0.9613
            // 1024 itens: 25 iterações, P = 0.9995
        }
      `,
    },
  },
  {
    id: 'shor',
    name: 'Algoritmo de Shor',
    difficulty: 'Avançado',
    en: { name: "Shor's Algorithm", summary: 'Factors integers in polynomial time on a quantum computer by finding the period of aˣ mod N with the quantum Fourier transform — the reason RSA is not post-quantum.' },
    facts: { 'Criado por': 'Peter Shor (Bell Labs)', 'Ano': '1994', 'Problema': 'Fatoração e logaritmo discreto', 'Parte quântica': 'Achar o período de aˣ mod N (QFT)', 'Parte clássica': 'Frações contínuas e mdc', 'Ameaça': 'RSA, Diffie-Hellman, curvas elípticas' },
    summary: 'Fatora inteiros em tempo polinomial em um computador quântico, achando o período de aˣ mod N com a transformada de Fourier quântica — o motivo de o RSA não ser pós-quântico.',
    description:
      'A segurança do RSA depende de ninguém conseguir fatorar rapidamente um número N de 2048 bits: o melhor algoritmo clássico conhecido, o crivo do corpo de números, leva tempo subexponencial — bilhões de anos para esse tamanho. Peter Shor mostrou em 1994 que um computador quântico fatora em tempo polinomial. O truque é transformar fatoração em achar um período. Escolhe-se um a < N ao acaso; a sequência aˣ mod N é periódica, com algum período r. Se r for par e a^(r/2) ≢ −1 (mod N), então a^(r/2) − 1 e a^(r/2) + 1 têm fatores em comum com N, encontrados pelo mdc. Achar r classicamente é tão difícil quanto fatorar, mas um computador quântico faz assim: coloca um registrador em superposição de todos os x de 0 a Q − 1 (Q ≥ N²), calcula aˣ mod N em um segundo registrador para todos os x de uma vez e mede o segundo registrador. O primeiro colapsa em um "pente" de valores espaçados de r. A transformada de Fourier quântica (QFT) converte esse espaçamento em picos de probabilidade perto dos múltiplos de Q/r. Uma medição dá um k ≈ j·Q/r, e o algoritmo de frações contínuas recupera r a partir de k/Q. A parte quântica leva O((log N)³) portas. O visualizador simula a distribuição exata da QFT para números pequenos; números de verdade exigiriam milhares de qubits lógicos sem erro, que ainda não existem.',
    complexity: { best: 'O((log N)³) portas quânticas', average: 'O((log N)² · log log N) com multiplicação rápida', worst: 'Repete com novo a se r for ímpar (probabilidade ≤ 1/2)', space: 'O(log N) qubits (≈ 2n + 3 com circuitos otimizados)' },
    steps: [
      'Se N é par ou potência de primo, fatore classicamente. Escolha a aleatório com 1 < a < N; se mdc(a, N) > 1, achou um fator.',
      'Parte quântica: crie a superposição de x = 0 … Q − 1 (Q potência de 2, Q ≥ N²) e calcule aˣ mod N em um segundo registrador.',
      'Meça o segundo registrador: o primeiro fica em superposição só dos x com o mesmo valor, espaçados pelo período r.',
      'Aplique a transformada de Fourier quântica ao primeiro registrador e meça, obtendo k ≈ j · Q / r.',
      'Use frações contínuas em k/Q para encontrar um denominador r < N com aʳ ≡ 1 (mod N).',
      'Se r é par e a^(r/2) ≢ −1 (mod N), os fatores são mdc(a^(r/2) − 1, N) e mdc(a^(r/2) + 1, N). Senão, repita com outro a.',
    ],
    usedIn: ['Motivação da criptografia pós-quântica (Kyber/ML-KEM, Dilithium/ML-DSA)', 'Logaritmo discreto: ameaça a Diffie-Hellman e curvas elípticas', 'Planejamento de migração criptográfica de governos e bancos', 'Benchmark de computadores quânticos', 'Problema do subgrupo oculto (generalização)'],
    realWorld: [
      { title: 'Criptografia pós-quântica', text: 'Em 2024 o NIST publicou os padrões ML-KEM (Kyber) e ML-DSA (Dilithium), baseados em reticulados, justamente porque o algoritmo de Shor quebraria RSA e curvas elípticas. Navegadores e o Signal já usam troca de chaves híbrida.' },
      { title: '"Colha agora, decifre depois"', text: 'Mesmo sem computadores quânticos grandes hoje, dados cifrados com RSA podem ser gravados agora e decifrados no futuro. Por isso governos tratam a migração pós-quântica como urgente.' },
      { title: 'Fatorar 15 e 21', text: 'Em 2001 a IBM fatorou 15 = 3 × 5 com ressonância magnética nuclear de 7 qubits; depois vieram 21 = 3 × 7 em fótons e chips supercondutores. Estimativas de 2025 indicam que RSA-2048 exigiria cerca de um milhão de qubits físicos ruidosos rodando por uma semana.' },
    ],
    curiosities: [
      'Shor descobriu primeiro o algoritmo para logaritmo discreto e só depois adaptou a ideia para fatoração — os dois saíram no mesmo artigo de 1994.',
      'A parte quântica só acha o período; todo o resto (mdc, frações contínuas, teste de r) é matemática clássica de séculos atrás, de Euclides a Euler.',
      'Shor ganhou o Prêmio Nevanlinna em 1998 e o Breakthrough Prize em Física Fundamental em 2023, junto com outros pioneiros da computação quântica.',
    ],
    code: {
      python: String.raw`
        import math

        def picos_qft(a, N):
            Q = 1
            while Q < N * N:
                Q *= 2
            f = [pow(a, x, N) for x in range(Q)]            # 2º registrador: aˣ mod N para todo x
            pente = [x for x in range(Q) if f[x] == f[0]]   # medir f = f(0) colapsa o 1º registrador
            picos = []
            for k in range(Q):                              # QFT: amplitude de cada k
                re = sum(math.cos(2 * math.pi * x * k / Q) for x in pente)
                im = sum(math.sin(2 * math.pi * x * k / Q) for x in pente)
                if (re * re + im * im) / (Q * len(pente)) > 0.01:
                    picos.append(k)
            return Q, picos

        def periodo(k, Q, a, N):                            # frações contínuas de k/Q
            h0, h1, d0, d1 = 0, 1, 1, 0
            while Q:
                q = k // Q
                k, Q = Q, k - q * Q
                h0, h1, d0, d1 = h1, q * h1 + h0, d1, q * d1 + d0
                if d1 < N and pow(a, d1, N) == 1:
                    return d1
            return None

        N, a = 15, 7
        Q, picos = picos_qft(a, N)
        print("picos:", *picos)                             # picos: 0 64 128 192
        for k in picos:
            r = periodo(k, Q, a, N)
            if r and r % 2 == 0 and pow(a, r // 2, N) != N - 1:
                h = pow(a, r // 2, N)
                print("k =", k, "-> r =", r)                # k = 64 -> r = 4
                print(N, "=", math.gcd(h - 1, N), "x", math.gcd(h + 1, N))   # 15 = 3 x 5
                break
      `,
      javascript: String.raw`
        const modPow = (b, e, m) => { let r = 1; b %= m; for (; e > 0; e >>= 1) { if (e & 1) r = (r * b) % m; b = (b * b) % m; } return r; };
        const gcd = (a, b) => (b ? gcd(b, a % b) : a);

        function picosQft(a, N) {
          let Q = 1;
          while (Q < N * N) Q *= 2;
          const f = Array.from({ length: Q }, (_, x) => modPow(a, x, N)); // 2º registrador
          const pente = f.flatMap((v, x) => (v === f[0] ? [x] : []));     // medir f = f(0)
          const picos = [];
          for (let k = 0; k < Q; k++) {                                   // QFT: amplitude de cada k
            let re = 0, im = 0;
            for (const x of pente) { re += Math.cos((2 * Math.PI * x * k) / Q); im += Math.sin((2 * Math.PI * x * k) / Q); }
            if ((re * re + im * im) / (Q * pente.length) > 0.01) picos.push(k);
          }
          return [Q, picos];
        }

        function periodo(k, Q, a, N) { // frações contínuas de k/Q
          let h0 = 0, h1 = 1, d0 = 1, d1 = 0;
          while (Q) {
            const q = Math.floor(k / Q);
            [k, Q] = [Q, k - q * Q];
            [h0, h1, d0, d1] = [h1, q * h1 + h0, d1, q * d1 + d0];
            if (d1 < N && modPow(a, d1, N) === 1) return d1;
          }
          return null;
        }

        const N = 15, a = 7;
        const [Q, picos] = picosQft(a, N);
        console.log("picos: " + picos.join(" "));                   // picos: 0 64 128 192
        for (const k of picos) {
          const r = periodo(k, Q, a, N);
          if (r && r % 2 === 0 && modPow(a, r / 2, N) !== N - 1) {
            const h = modPow(a, r / 2, N);
            console.log("k = " + k + " -> r = " + r);               // k = 64 -> r = 4
            console.log(N + " = " + gcd(h - 1, N) + " x " + gcd(h + 1, N)); // 15 = 3 x 5
            break;
          }
        }
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class Shor {
            static int modPow(long b, int e, int m) {
                long r = 1; b %= m;
                for (; e > 0; e >>= 1) { if ((e & 1) == 1) r = r * b % m; b = b * b % m; }
                return (int) r;
            }
            static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }

            static Integer periodo(int k, int Q, int a, int N) { // frações contínuas de k/Q
                int h0 = 0, h1 = 1, d0 = 1, d1 = 0;
                while (Q != 0) {
                    int q = k / Q, t = k - q * Q;
                    k = Q; Q = t;
                    int nh = q * h1 + h0, nd = q * d1 + d0;
                    h0 = h1; h1 = nh; d0 = d1; d1 = nd;
                    if (d1 < N && modPow(a, d1, N) == 1) return d1;
                }
                return null;
            }

            public static void main(String[] args) {
                int N = 15, a = 7, Q = 1;
                while (Q < N * N) Q *= 2;
                List<Integer> pente = new ArrayList<>();
                for (int x = 0; x < Q; x++) if (modPow(a, x, N) == 1) pente.add(x); // medir f = f(0) = 1
                List<Integer> picos = new ArrayList<>();
                for (int k = 0; k < Q; k++) {                                       // QFT: amplitude de cada k
                    double re = 0, im = 0;
                    for (int x : pente) { re += Math.cos(2 * Math.PI * x * k / Q); im += Math.sin(2 * Math.PI * x * k / Q); }
                    if ((re * re + im * im) / (Q * pente.size()) > 0.01) picos.add(k);
                }
                StringBuilder sb = new StringBuilder("picos:");
                for (int k : picos) sb.append(" ").append(k);
                System.out.println(sb);                                              // picos: 0 64 128 192
                for (int k : picos) {
                    Integer r = periodo(k, Q, a, N);
                    if (r != null && r % 2 == 0 && modPow(a, r / 2, N) != N - 1) {
                        int h = modPow(a, r / 2, N);
                        System.out.println("k = " + k + " -> r = " + r);            // k = 64 -> r = 4
                        System.out.println(N + " = " + gcd(h - 1, N) + " x " + gcd(h + 1, N)); // 15 = 3 x 5
                        break;
                    }
                }
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <iostream>
        #include <numeric>
        #include <vector>
        using namespace std;

        int modPow(long long b, int e, int m) {
            long long r = 1; b %= m;
            for (; e > 0; e >>= 1) { if (e & 1) r = r * b % m; b = b * b % m; }
            return (int)r;
        }

        int periodo(int k, int Q, int a, int N) { // frações contínuas de k/Q; 0 se não achar
            int h0 = 0, h1 = 1, d0 = 1, d1 = 0;
            while (Q) {
                int q = k / Q, t = k - q * Q;
                k = Q; Q = t;
                int nh = q * h1 + h0, nd = q * d1 + d0;
                h0 = h1; h1 = nh; d0 = d1; d1 = nd;
                if (d1 < N && modPow(a, d1, N) == 1) return d1;
            }
            return 0;
        }

        int main() {
            int N = 15, a = 7, Q = 1;
            while (Q < N * N) Q *= 2;
            vector<int> pente, picos;
            for (int x = 0; x < Q; x++) if (modPow(a, x, N) == 1) pente.push_back(x); // medir f = f(0) = 1
            for (int k = 0; k < Q; k++) {                                            // QFT: amplitude de cada k
                double re = 0, im = 0;
                for (int x : pente) { re += cos(2 * M_PI * x * k / Q); im += sin(2 * M_PI * x * k / Q); }
                if ((re * re + im * im) / (Q * pente.size()) > 0.01) picos.push_back(k);
            }
            cout << "picos:";
            for (int k : picos) cout << " " << k;
            cout << "\n";                                                           // picos: 0 64 128 192
            for (int k : picos) {
                int r = periodo(k, Q, a, N);
                if (r && r % 2 == 0 && modPow(a, r / 2, N) != N - 1) {
                    int h = modPow(a, r / 2, N);
                    cout << "k = " << k << " -> r = " << r << "\n";                 // k = 64 -> r = 4
                    cout << N << " = " << gcd(h - 1, N) << " x " << gcd(h + 1, N) << "\n"; // 15 = 3 x 5
                    break;
                }
            }
        }
      `,
    },
  },
]
