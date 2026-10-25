export default [
  {
    id: 'euclid',
    name: 'Algoritmo de Euclides (MDC)',
    difficulty: 'Iniciante',
    en: { name: "Euclid's Algorithm (GCD)", summary: 'Finds the greatest common divisor by repeatedly replacing the pair with (divisor, remainder).' },
    facts: { 'Origem': 'Euclides, Elementos (Livro VII)', 'Ano': '≈ 300 a.C.', 'Variação incluída': 'Euclides estendido (inverso modular)' },
    summary: 'Calcula o máximo divisor comum trocando o par de números por (divisor, resto) até o resto zerar.',
    description:
      'O Algoritmo de Euclides calcula o máximo divisor comum (MDC) de dois inteiros usando um fato simples: mdc(a, b) = mdc(b, a mod b). A cada passo, o par diminui rapidamente, e quando o resto chega a zero o outro número é o MDC. A versão estendida também encontra x e y tais que a·x + b·y = mdc(a, b) — o que permite calcular inversos modulares, peça central da criptografia RSA.',
    complexity: { best: 'O(1)', average: 'O(log min(a, b))', worst: 'O(log min(a, b))', space: 'O(1)' },
    steps: [
      'Se b = 0, o MDC é a.',
      'Caso contrário, calcule o resto r = a mod b.',
      'Troque o par (a, b) por (b, r) e repita.',
      'Na versão estendida, acompanhe também os coeficientes x e y na volta da recursão: se b·x\' + (a mod b)·y\' = g, então a·y\' + b·(x\' − ⌊a/b⌋·y\') = g.',
      'O inverso de a módulo m é o coeficiente x quando mdc(a, m) = 1.',
    ],
    usedIn: ['Criptografia RSA (cálculo da chave privada)', 'Simplificação de frações', 'Bibliotecas de inteiros grandes', 'Aritmética modular e teoria dos códigos', 'Gráficos (proporções e ritmos euclidianos)'],
    realWorld: [
      { title: 'Chaves RSA', text: 'Ao gerar um par de chaves RSA, a chave privada d é o inverso do expoente público e módulo φ(n) — calculado com o Euclides estendido. No exemplo de código, 2753 é o inverso de 17 módulo 3120.' },
      { title: 'Frações e proporções', text: 'Calculadoras e planilhas simplificam 1071/462 para 51/22 dividindo os dois pelo MDC (21). Editores de vídeo fazem o mesmo para mostrar 1920×1080 como 16:9.' },
      { title: 'Ritmos musicais', text: 'Os "ritmos euclidianos" distribuem k batidas em n tempos da forma mais uniforme possível usando a mesma estrutura do algoritmo — e reproduzem padrões tradicionais de várias culturas.' },
    ],
    curiosities: [
      'Aparece no Livro VII dos Elementos de Euclides, por volta de 300 a.C. Donald Knuth o chamou de "o avô de todos os algoritmos", por ser um dos mais antigos ainda em uso.',
      'Em 1844, Gabriel Lamé provou que o número de passos nunca passa de cerca de 5 vezes o número de dígitos do menor número — um dos primeiros resultados de análise de complexidade da história. O pior caso acontece com números de Fibonacci consecutivos.',
      'Euclides descreveu a ideia com subtrações sucessivas de segmentos de reta; a versão com o resto da divisão é a forma moderna, bem mais rápida.',
    ],
    code: {
      python: String.raw`
        def mdc(a, b):
            while b:
                a, b = b, a % b
            return a

        def mdc_estendido(a, b):
            # devolve (g, x, y) com a·x + b·y = g = mdc(a, b)
            if b == 0:
                return a, 1, 0
            g, x, y = mdc_estendido(b, a % b)
            return g, y, x - (a // b) * y

        def inverso_modular(a, m):
            g, x, _ = mdc_estendido(a, m)
            if g != 1:
                raise ValueError("não existe inverso: a e m não são coprimos")
            return x % m

        print(mdc(1071, 462))             # 21
        print(inverso_modular(17, 3120))  # 2753, pois 17 × 2753 = 46801 ≡ 1 (mod 3120)
      `,
      javascript: String.raw`
        function mdc(a, b) {
          while (b) [a, b] = [b, a % b];
          return a;
        }

        // devolve [g, x, y] com a·x + b·y = g = mdc(a, b)
        function mdcEstendido(a, b) {
          if (b === 0) return [a, 1, 0];
          const [g, x, y] = mdcEstendido(b, a % b);
          return [g, y, x - Math.floor(a / b) * y];
        }

        function inversoModular(a, m) {
          const [g, x] = mdcEstendido(a, m);
          if (g !== 1) throw new Error("não existe inverso: a e m não são coprimos");
          return ((x % m) + m) % m;
        }

        console.log(mdc(1071, 462));            // 21
        console.log(inversoModular(17, 3120)); // 2753, pois 17 × 2753 = 46801 ≡ 1 (mod 3120)
      `,
      java: String.raw`
        public class Euclides {
            static long mdc(long a, long b) {
                while (b != 0) {
                    long r = a % b;
                    a = b;
                    b = r;
                }
                return a;
            }

            // devolve {g, x, y} com a·x + b·y = g = mdc(a, b)
            static long[] mdcEstendido(long a, long b) {
                if (b == 0) return new long[]{a, 1, 0};
                long[] r = mdcEstendido(b, a % b);
                return new long[]{r[0], r[2], r[1] - (a / b) * r[2]};
            }

            static long inversoModular(long a, long m) {
                long[] r = mdcEstendido(a, m);
                if (r[0] != 1) throw new ArithmeticException("não existe inverso: a e m não são coprimos");
                return ((r[1] % m) + m) % m;
            }

            public static void main(String[] args) {
                System.out.println(mdc(1071, 462));            // 21
                System.out.println(inversoModular(17, 3120)); // 2753, pois 17 × 2753 = 46801 ≡ 1 (mod 3120)
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <stdexcept>
        #include <tuple>
        using namespace std;

        long long mdc(long long a, long long b) {
            while (b != 0) {
                long long r = a % b;
                a = b;
                b = r;
            }
            return a;
        }

        // devolve (g, x, y) com a·x + b·y = g = mdc(a, b)
        tuple<long long, long long, long long> mdcEstendido(long long a, long long b) {
            if (b == 0) return {a, 1, 0};
            auto [g, x, y] = mdcEstendido(b, a % b);
            return {g, y, x - (a / b) * y};
        }

        long long inversoModular(long long a, long long m) {
            auto [g, x, y] = mdcEstendido(a, m);
            if (g != 1) throw invalid_argument("não existe inverso: a e m não são coprimos");
            return ((x % m) + m) % m;
        }

        int main() {
            cout << mdc(1071, 462) << "\n";            // 21
            cout << inversoModular(17, 3120) << "\n"; // 2753, pois 17 × 2753 = 46801 ≡ 1 (mod 3120)
        }
      `,
    },
  },
  {
    id: 'sieve-of-eratosthenes',
    name: 'Crivo de Eratóstenes',
    difficulty: 'Iniciante',
    en: { name: 'Sieve of Eratosthenes', summary: 'Lists every prime up to n by crossing out the multiples of each prime found.' },
    facts: { 'Criado por': 'Eratóstenes de Cirene', 'Ano': '≈ 240 a.C.', 'Primeiro registro': 'Nicômaco de Gerasa (séc. II)' },
    summary: 'Lista todos os primos até n riscando os múltiplos de cada primo encontrado.',
    description:
      'O Crivo de Eratóstenes encontra todos os números primos até um limite n. Escreve-se a lista de 2 a n; o primeiro número não riscado é primo, e todos os seus múltiplos são riscados. Repete-se com o próximo número não riscado. Basta ir até √n: qualquer composto menor ou igual a n tem um fator primo que não passa de √n e, portanto, já foi riscado. Com O(n log log n) operações, é a forma mais rápida de gerar muitos primos pequenos.',
    complexity: { best: 'O(n log log n)', average: 'O(n log log n)', worst: 'O(n log log n)', space: 'O(n)' },
    steps: [
      'Marque todos os números de 2 a n como candidatos a primo.',
      'Pegue o menor número p ainda marcado: ele é primo.',
      'Risque os múltiplos de p a partir de p² (os menores já foram riscados por primos menores).',
      'Repita enquanto p² ≤ n.',
      'Os números que continuam marcados são exatamente os primos até n.',
    ],
    usedIn: ['Geração de tabelas de primos', 'Competições de programação', 'Pré-cálculo para fatoração e criptografia', 'Funções aritméticas (φ de Euler, divisores)', 'Ensino de matemática'],
    realWorld: [
      { title: 'Tabelas de primos', text: 'Bibliotecas matemáticas e sistemas de álgebra computacional usam crivos para gerar rapidamente milhões de primos pequenos, usados depois em testes e fatorações.' },
      { title: 'Divisão por primos pequenos', text: 'Antes de testar se um número enorme é primo (como em chaves RSA), programas eliminam candidatos dividindo-os pelos primos de uma tabela gerada por um crivo — o que descarta a maioria em microssegundos.' },
      { title: 'Variações modernas', text: 'O crivo segmentado processa o intervalo em blocos que cabem no cache do processador e é usado em projetos que contam ou enumeram primos até 10¹⁸ e além.' },
    ],
    curiosities: [
      'Eratóstenes de Cirene, bibliotecário de Alexandria por volta de 240 a.C., também mediu a circunferência da Terra comparando sombras em duas cidades — com erro surpreendentemente pequeno.',
      'Não há registro do crivo nos textos do próprio Eratóstenes: a descrição mais antiga que conhecemos está na "Introdução à Aritmética" de Nicômaco de Gerasa, do século II.',
      'O fator log log n cresce tão devagar que, para n = 10¹⁸, ele vale menos que 4: na prática, o crivo é quase linear.',
    ],
    code: {
      python: String.raw`
        def crivo(n):
            primo = [True] * (n + 1)
            primo[0] = primo[1] = False
            for p in range(2, int(n ** 0.5) + 1):
                if primo[p]:
                    for m in range(p * p, n + 1, p):  # começa em p²: os menores já foram riscados
                        primo[m] = False
            return [i for i, e in enumerate(primo) if e]

        print(crivo(50))
        # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
      `,
      javascript: String.raw`
        function crivo(n) {
          const primo = new Array(n + 1).fill(true);
          primo[0] = primo[1] = false;
          for (let p = 2; p * p <= n; p++) {
            if (!primo[p]) continue;
            for (let m = p * p; m <= n; m += p) primo[m] = false; // começa em p²
          }
          return primo.flatMap((e, i) => (e ? [i] : []));
        }

        console.log(crivo(50).join(", "));
        // 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;

        public class Crivo {
            static List<Integer> crivo(int n) {
                boolean[] primo = new boolean[n + 1];
                Arrays.fill(primo, true);
                primo[0] = primo[1] = false;
                for (int p = 2; (long) p * p <= n; p++) {
                    if (!primo[p]) continue;
                    for (int m = p * p; m <= n; m += p) primo[m] = false; // começa em p²
                }
                List<Integer> primos = new ArrayList<>();
                for (int i = 2; i <= n; i++) if (primo[i]) primos.add(i);
                return primos;
            }

            public static void main(String[] args) {
                System.out.println(crivo(50));
                // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        vector<int> crivo(int n) {
            vector<bool> primo(n + 1, true);
            primo[0] = primo[1] = false;
            for (long long p = 2; p * p <= n; p++) {
                if (!primo[p]) continue;
                for (long long m = p * p; m <= n; m += p) primo[m] = false; // começa em p²
            }
            vector<int> primos;
            for (int i = 2; i <= n; i++) if (primo[i]) primos.push_back(i);
            return primos;
        }

        int main() {
            for (int p : crivo(50)) cout << p << " ";
            // 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47
        }
      `,
    },
  },
  {
    id: 'trial-division',
    name: 'Divisão por Tentativas',
    difficulty: 'Iniciante',
    en: { name: 'Trial Division', summary: 'Factors a number by trying divisors 2, 3, 4… up to its square root.' },
    facts: { 'Primeira descrição': 'Fibonacci, Liber Abaci', 'Ano': '1202', 'Limite de busca': '√n' },
    summary: 'Fatora um número testando os divisores 2, 3, 4… até a raiz quadrada.',
    description:
      'A Divisão por Tentativas é o método mais simples de fatoração: testa se 2 divide n, depois 3, depois 4, e assim por diante. A cada divisor encontrado, divide-se n por ele quantas vezes for possível. Basta testar até √n, porque, se n tivesse dois fatores maiores que √n, o produto deles passaria de n. O que sobrar no fim, se for maior que 1, é primo. É rápida para números com fatores pequenos, mas inviável para números grandes com fatores grandes — e é justamente nisso que a criptografia se apoia.',
    complexity: { best: 'O(log n)', average: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
    steps: [
      'Comece com o divisor d = 2.',
      'Enquanto d divide n, registre d como fator e faça n = n / d.',
      'Avance para o próximo d.',
      'Pare quando d² for maior que o valor restante de n.',
      'Se o que sobrou for maior que 1, ele também é um fator primo.',
    ],
    usedIn: ['Fatoração de números pequenos', 'Primeiro passo de fatoradores sofisticados', 'Testes de primalidade simples', 'Ensino de aritmética', 'Competições de programação'],
    realWorld: [
      { title: 'Primeiro filtro', text: 'Ferramentas como o comando factor do GNU e sistemas de álgebra computacional começam dividindo por primos pequenos antes de usar métodos avançados como Pollard rho ou curvas elípticas.' },
      { title: 'Geração de chaves', text: 'Ao buscar primos de 1024 bits para o RSA, programas descartam a grande maioria dos candidatos dividindo-os por alguns milhares de primos pequenos, antes de aplicar o caro teste de Miller-Rabin.' },
      { title: 'Por que a criptografia funciona', text: 'Para um número de 600 dígitos com dois fatores de 300 dígitos, a divisão por tentativas precisaria de cerca de 10³⁰⁰ testes — mais do que o número de átomos do universo observável.' },
    ],
    curiosities: [
      'Fibonacci descreveu o método no Liber Abaci, em 1202 — o mesmo livro que popularizou os algarismos indo-arábicos na Europa.',
      'Uma otimização simples é testar só 2 e depois os ímpares, ou só números da forma 6k ± 1, reduzindo o trabalho a um terço.',
      'O exemplo do código, 600851475143 = 71 × 839 × 1471 × 6857, é o famoso Problema 3 do Project Euler.',
    ],
    code: {
      python: String.raw`
        def fatorar(n):
            fatores = []
            d = 2
            while d * d <= n:
                while n % d == 0:
                    fatores.append(d)
                    n //= d
                d += 1
            if n > 1:
                fatores.append(n)  # o que sobrou é primo
            return fatores

        print(fatorar(360))           # [2, 2, 2, 3, 3, 5]
        print(fatorar(600851475143))  # [71, 839, 1471, 6857]
      `,
      javascript: String.raw`
        function fatorar(n) {
          const fatores = [];
          for (let d = 2; d * d <= n; d++) {
            while (n % d === 0) {
              fatores.push(d);
              n /= d;
            }
          }
          if (n > 1) fatores.push(n); // o que sobrou é primo
          return fatores;
        }

        console.log(fatorar(360));          // [2, 2, 2, 3, 3, 5]
        console.log(fatorar(600851475143)); // [71, 839, 1471, 6857]
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class DivisaoTentativas {
            static List<Long> fatorar(long n) {
                List<Long> fatores = new ArrayList<>();
                for (long d = 2; d * d <= n; d++) {
                    while (n % d == 0) {
                        fatores.add(d);
                        n /= d;
                    }
                }
                if (n > 1) fatores.add(n); // o que sobrou é primo
                return fatores;
            }

            public static void main(String[] args) {
                System.out.println(fatorar(360));           // [2, 2, 2, 3, 3, 5]
                System.out.println(fatorar(600851475143L)); // [71, 839, 1471, 6857]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        vector<long long> fatorar(long long n) {
            vector<long long> fatores;
            for (long long d = 2; d * d <= n; d++) {
                while (n % d == 0) {
                    fatores.push_back(d);
                    n /= d;
                }
            }
            if (n > 1) fatores.push_back(n); // o que sobrou é primo
            return fatores;
        }

        int main() {
            for (long long f : fatorar(360)) cout << f << " ";           // 2 2 2 3 3 5
            cout << "\n";
            for (long long f : fatorar(600851475143LL)) cout << f << " "; // 71 839 1471 6857
        }
      `,
    },
  },
  {
    id: 'fast-exponentiation',
    name: 'Exponenciação Rápida',
    difficulty: 'Intermediário',
    en: { name: 'Exponentiation by Squaring', summary: 'Computes huge powers with a few multiplications by reading the exponent in binary.' },
    facts: { 'Ideia presente em': 'Chandaḥśāstra, de Pingala (Índia)', 'Ano': '≈ 200 a.C.', 'Também chamada': 'Exponenciação binária, square-and-multiply' },
    summary: 'Calcula potências enormes com poucas multiplicações, lendo o expoente em binário.',
    description:
      'A Exponenciação Rápida calcula bᵉ usando o fato de que b¹³ = b⁸ · b⁴ · b¹, pois 13 em binário é 1101. Elevando a base ao quadrado sucessivamente (b, b², b⁴, b⁸…) e multiplicando no resultado apenas as potências que correspondem aos bits 1 do expoente, bastam cerca de 2·log₂(e) multiplicações em vez de e − 1. Combinada com o resto de uma divisão a cada passo (exponenciação modular), ela permite calcular números como 2^(10¹⁸) mod 1 000 000 007 instantaneamente — e é o coração do RSA e da troca de chaves Diffie-Hellman.',
    complexity: { best: 'O(log e)', average: 'O(log e)', worst: 'O(log e)', space: 'O(1)' },
    steps: [
      'Comece com resultado = 1 e reduza a base módulo m.',
      'Se o bit atual (o menos significativo) do expoente for 1, multiplique o resultado pela base.',
      'Eleve a base ao quadrado (ela passa a representar b², b⁴, b⁸…).',
      'Desloque o expoente um bit para a direita.',
      'Repita até o expoente chegar a zero; aplique "mod m" após cada multiplicação.',
    ],
    usedIn: ['Criptografia RSA e Diffie-Hellman', 'Testes de primalidade (Fermat, Miller-Rabin)', 'pow(b, e, m) do Python, BigInteger.modPow do Java', 'Potências de matrizes (Fibonacci em O(log n))', 'Hash e geradores pseudoaleatórios'],
    realWorld: [
      { title: 'HTTPS', text: 'A cada conexão segura, servidores e navegadores calculam potências modulares com expoentes de centenas de dígitos. Sem a exponenciação rápida, um único handshake levaria mais que a idade do universo.' },
      { title: 'Fibonacci em tempo logarítmico', text: 'Elevando a matriz [[1, 1], [1, 0]] à n-ésima potência com o mesmo método, obtém-se o n-ésimo número de Fibonacci com O(log n) multiplicações de matrizes.' },
      { title: 'Competições de programação', text: 'Problemas que pedem respostas "módulo 10⁹ + 7" com expoentes gigantes são resolvidos com essa técnica, uma das primeiras ensinadas em treinamentos de maratona.' },
    ],
    curiosities: [
      'A ideia já aparece no Chandaḥśāstra, tratado de métrica poética do indiano Pingala, por volta de 200 a.C., para contar combinações de sílabas.',
      'Calcular 2^(10¹⁸) mod 1 000 000 007 pelo método ingênuo exigiria 10¹⁸ multiplicações (décadas de computação); com a exponenciação rápida são cerca de 120.',
      'Implementações criptográficas usam variações como a "escada de Montgomery", que faz sempre as mesmas operações em cada bit, para não vazar a chave secreta pelo tempo de execução.',
    ],
    code: {
      python: String.raw`
        def potencia_mod(base, exp, mod):
            resultado = 1
            base %= mod
            while exp > 0:
                if exp & 1:                  # bit atual do expoente é 1
                    resultado = resultado * base % mod
                base = base * base % mod     # base passa a valer base^(2^i)
                exp >>= 1
            return resultado

        print(potencia_mod(3, 13, 1000))           # 323
        print(potencia_mod(2, 10**18, 10**9 + 7))  # 719476260 (o Python também oferece pow(2, 10**18, 10**9 + 7))
      `,
      javascript: String.raw`
        // BigInt: os produtos intermediários passam do limite seguro do tipo Number.
        function potenciaMod(base, exp, mod) {
          let resultado = 1n;
          base %= mod;
          while (exp > 0n) {
            if (exp & 1n) resultado = (resultado * base) % mod; // bit atual do expoente é 1
            base = (base * base) % mod;                         // base passa a valer base^(2^i)
            exp >>= 1n;
          }
          return resultado;
        }

        console.log(potenciaMod(3n, 13n, 1000n).toString());               // 323
        console.log(potenciaMod(2n, 10n ** 18n, 10n ** 9n + 7n).toString()); // 719476260
      `,
      java: String.raw`
        public class ExponenciacaoRapida {
            // o módulo deve caber em 31 bits para que base * base não estoure o long
            static long potenciaMod(long base, long exp, long mod) {
                long resultado = 1;
                base %= mod;
                while (exp > 0) {
                    if ((exp & 1) == 1) resultado = resultado * base % mod; // bit atual é 1
                    base = base * base % mod;                               // base^(2^i)
                    exp >>= 1;
                }
                return resultado;
            }

            public static void main(String[] args) {
                System.out.println(potenciaMod(3, 13, 1000));                         // 323
                System.out.println(potenciaMod(2, 1_000_000_000_000_000_000L, 1_000_000_007)); // 719476260
                // para números maiores: new BigInteger("2").modPow(expoente, modulo)
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        using namespace std;

        // o módulo deve caber em 31 bits para que base * base não estoure 64 bits
        long long potenciaMod(long long base, long long exp, long long mod) {
            long long resultado = 1;
            base %= mod;
            while (exp > 0) {
                if (exp & 1) resultado = resultado * base % mod; // bit atual é 1
                base = base * base % mod;                        // base^(2^i)
                exp >>= 1;
            }
            return resultado;
        }

        int main() {
            cout << potenciaMod(3, 13, 1000) << "\n";                       // 323
            cout << potenciaMod(2, 1000000000000000000LL, 1000000007) << "\n"; // 719476260
        }
      `,
    },
  },
  {
    id: 'karatsuba',
    name: 'Multiplicação de Karatsuba',
    difficulty: 'Intermediário',
    en: { name: 'Karatsuba Multiplication', summary: 'Multiplies large numbers with three half-size multiplications instead of four.' },
    facts: { 'Criado por': 'Anatoly Karatsuba', 'Ano': '1960 (publicado em 1962)', 'Ideia central': 'Dividir e conquistar' },
    summary: 'Multiplica números grandes com 3 multiplicações de metade do tamanho, em vez de 4.',
    description:
      'A multiplicação aprendida na escola faz n² multiplicações de dígitos para dois números de n dígitos. Karatsuba percebeu que, dividindo cada número ao meio — x = a·10ᵐ + b e y = c·10ᵐ + d —, o produto precisa de ac, bd e (ad + bc), e que este último pode ser obtido como (a + b)(c + d) − ac − bd. São 3 multiplicações pela metade em vez de 4. Aplicando a ideia recursivamente, o custo cai para cerca de n^1,585 — e foi a primeira prova de que multiplicar podia ser mais rápido que n².',
    complexity: { best: 'O(n^1,585)', average: 'O(n^1,585)', worst: 'O(n^1,585)', space: 'O(n)' },
    steps: [
      'Se um dos números tiver um único dígito, multiplique diretamente.',
      'Escolha m = metade do número de dígitos e escreva x = a·10ᵐ + b e y = c·10ᵐ + d.',
      'Calcule recursivamente ac, bd e (a + b)(c + d).',
      'Obtenha o termo do meio: ad + bc = (a + b)(c + d) − ac − bd.',
      'Monte o resultado: ac·10²ᵐ + (ad + bc)·10ᵐ + bd.',
    ],
    usedIn: ['Inteiros grandes do Python (int)', 'Biblioteca GMP e Java BigInteger', 'Criptografia com números grandes', 'Multiplicação de polinômios', 'Cálculo de π e constantes com bilhões de dígitos'],
    realWorld: [
      { title: 'Python e Java', text: 'O tipo int do CPython troca a multiplicação escolar pela de Karatsuba quando os números passam de cerca de 70 "dígitos" internos; o BigInteger do Java faz o mesmo a partir de alguns milhares de bits.' },
      { title: 'Criptografia', text: 'Operações com chaves RSA de 2048 ou 4096 bits multiplicam números enormes milhares de vezes; bibliotecas como a GMP escolhem entre Karatsuba, Toom-Cook e FFT conforme o tamanho.' },
      { title: 'Recordes de dígitos de π', text: 'Programas que calculam trilhões de dígitos de π dependem de multiplicações ultrarrápidas; Karatsuba é um dos degraus dessa hierarquia, antes dos métodos baseados em FFT.' },
    ],
    curiosities: [
      'Em 1960, Andrey Kolmogorov conjecturou em um seminário em Moscou que multiplicar exigia necessariamente n² operações. Anatoly Karatsuba, então com 23 anos e estudante, encontrou este algoritmo em cerca de uma semana — e derrubou a conjectura.',
      'O algoritmo foi publicado em 1962 em um artigo assinado por Karatsuba e Yuri Ofman, mas escrito por Kolmogorov, sem que Karatsuba soubesse antes da publicação.',
      'Em 2019, David Harvey e Joris van der Hoeven apresentaram um algoritmo O(n log n), considerado o limite teórico — mas ele só compensa para números com uma quantidade astronômica de dígitos.',
    ],
    code: {
      python: String.raw`
        def karatsuba(x, y):
            if x < 10 or y < 10:
                return x * y
            m = max(len(str(x)), len(str(y))) // 2
            p = 10 ** m
            a, b = divmod(x, p)                      # x = a·10^m + b
            c, d = divmod(y, p)                      # y = c·10^m + d
            ac = karatsuba(a, c)
            bd = karatsuba(b, d)
            meio = karatsuba(a + b, c + d) - ac - bd  # ad + bc com uma única multiplicação
            return ac * p * p + meio * p + bd

        print(karatsuba(1234, 5678))          # 7006652
        print(karatsuba(12345678, 87654321))  # 1082152022374638
      `,
      javascript: String.raw`
        function karatsuba(x, y) {
          if (x < 10 || y < 10) return x * y;
          const m = Math.floor(Math.max(String(x).length, String(y).length) / 2);
          const p = 10 ** m;
          const a = Math.floor(x / p), b = x % p;     // x = a·10^m + b
          const c = Math.floor(y / p), d = y % p;     // y = c·10^m + d
          const ac = karatsuba(a, c);
          const bd = karatsuba(b, d);
          const meio = karatsuba(a + b, c + d) - ac - bd; // ad + bc com uma única multiplicação
          return ac * p * p + meio * p + bd;
        }

        console.log(karatsuba(1234, 5678));         // 7006652
        console.log(karatsuba(12345678, 87654321)); // 1082152022374638 (para números maiores, use BigInt)
      `,
      java: String.raw`
        public class Karatsuba {
            static long karatsuba(long x, long y) {
                if (x < 10 || y < 10) return x * y;
                int m = Math.max(Long.toString(x).length(), Long.toString(y).length()) / 2;
                long p = (long) Math.pow(10, m);
                long a = x / p, b = x % p;   // x = a·10^m + b
                long c = y / p, d = y % p;   // y = c·10^m + d
                long ac = karatsuba(a, c);
                long bd = karatsuba(b, d);
                long meio = karatsuba(a + b, c + d) - ac - bd; // ad + bc com uma única multiplicação
                return ac * p * p + meio * p + bd;
            }

            public static void main(String[] args) {
                System.out.println(karatsuba(1234, 5678));         // 7006652
                System.out.println(karatsuba(12345678, 87654321)); // 1082152022374638
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <string>
        using namespace std;

        long long karatsuba(long long x, long long y) {
            if (x < 10 || y < 10) return x * y;
            int m = max(to_string(x).size(), to_string(y).size()) / 2;
            long long p = 1;
            for (int i = 0; i < m; i++) p *= 10;
            long long a = x / p, b = x % p;   // x = a·10^m + b
            long long c = y / p, d = y % p;   // y = c·10^m + d
            long long ac = karatsuba(a, c);
            long long bd = karatsuba(b, d);
            long long meio = karatsuba(a + b, c + d) - ac - bd; // ad + bc com uma única multiplicação
            return ac * p * p + meio * p + bd;
        }

        int main() {
            cout << karatsuba(1234, 5678) << "\n";         // 7006652
            cout << karatsuba(12345678, 87654321) << "\n"; // 1082152022374638
        }
      `,
    },
  },
  {
    id: 'miller-rabin',
    name: 'Teste de Miller-Rabin',
    difficulty: 'Intermediário',
    en: { name: 'Miller-Rabin Primality Test', summary: 'Decides whether a huge number is prime by looking for "witnesses" of compositeness.' },
    facts: { 'Criado por': 'Gary Miller; Michael Rabin', 'Ano': '1976; 1980', 'Tipo': 'Probabilístico (determinístico com bases fixas)' },
    summary: 'Decide se um número enorme é primo procurando "testemunhas" de que ele é composto.',
    description:
      'O teste de Miller-Rabin verifica a primalidade de números com centenas de dígitos em milissegundos. Ele escreve n − 1 = 2ˢ·d e, para uma base a, calcula a sequência aᵈ, a²ᵈ, a⁴ᵈ… módulo n. Se n for primo, essa sequência começa em 1 ou passa por −1 antes de chegar a 1; se isso não acontecer, a é uma "testemunha" e n é certamente composto. Um número composto engana no máximo 1/4 das bases, então k bases aleatórias erram com probabilidade de no máximo 4⁻ᵏ — e, para números de até 64 bits, um conjunto fixo de 12 bases dá resposta exata.',
    complexity: { best: 'O(log n)', average: 'O(k · log³ n)', worst: 'O(k · log³ n)', space: 'O(1)' },
    steps: [
      'Trate os casos pequenos e elimine números pares.',
      'Escreva n − 1 = 2ˢ · d, com d ímpar.',
      'Para cada base a: calcule x = aᵈ mod n. Se x for 1 ou n − 1, a base passou.',
      'Caso contrário, eleve x ao quadrado até s − 1 vezes; se em algum momento x = n − 1, a base passou.',
      'Se nunca passar, a é uma testemunha: n é composto. Se todas as bases passarem, n é (provavelmente, ou certamente com as bases fixas) primo.',
    ],
    usedIn: ['Geração de chaves RSA (OpenSSL, BoringSSL)', 'isProbablePrime do Java', 'Sistemas de álgebra computacional', 'Busca por primos grandes', 'Competições de programação'],
    realWorld: [
      { title: 'Chaves criptográficas', text: 'Para criar uma chave RSA de 2048 bits, o OpenSSL sorteia números de 1024 bits e aplica Miller-Rabin até encontrar dois primos — normalmente centenas de testes, em menos de um segundo.' },
      { title: 'Java BigInteger', text: 'O método isProbablePrime da classe BigInteger combina Miller-Rabin com o teste de Lucas, permitindo escolher a certeza desejada pelo número de rodadas.' },
      { title: 'Números de Carmichael', text: 'Números como 561 = 3 × 11 × 17 enganam o teste de Fermat para todas as bases coprimas a eles, mas não o Miller-Rabin — que é por isso o padrão na prática.' },
    ],
    curiosities: [
      'Gary Miller propôs em 1976 uma versão determinística, cuja correção depende da Hipótese de Riemann Generalizada. Em 1980, Michael Rabin a transformou em um algoritmo probabilístico com garantia incondicional.',
      'Com 40 bases aleatórias, a chance de erro é menor que 10⁻²⁴ — bem menor que a de um raio cósmico alterar um bit da memória durante o cálculo.',
      'As 12 primeiras bases primas (2 a 37) bastam para responder com certeza para qualquer n menor que cerca de 3,3 × 10²⁴.',
    ],
    code: {
      python: String.raw`
        BASES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]  # exato para n < 3,3·10^24

        def miller_rabin(n):
            if n < 2:
                return False
            for p in BASES:
                if n % p == 0:
                    return n == p
            d, s = n - 1, 0
            while d % 2 == 0:  # n - 1 = 2^s · d
                d //= 2
                s += 1
            for a in BASES:
                x = pow(a, d, n)
                if x in (1, n - 1):
                    continue
                for _ in range(s - 1):
                    x = x * x % n
                    if x == n - 1:
                        break
                else:
                    return False  # a é uma testemunha: n é composto
            return True

        print(miller_rabin(561))         # False (número de Carmichael)
        print(miller_rabin(1000000007))  # True
        print(miller_rabin(2**61 - 1))   # True (primo de Mersenne)
      `,
      javascript: String.raw`
        // BigInt: x * x passa do limite seguro do tipo Number para n de 64 bits.
        const BASES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

        function potenciaMod(b, e, m) {
          let r = 1n;
          for (b %= m; e > 0n; e >>= 1n, b = (b * b) % m) if (e & 1n) r = (r * b) % m;
          return r;
        }

        function millerRabin(n) {
          if (n < 2n) return false;
          for (const p of BASES) if (n % p === 0n) return n === p;
          let d = n - 1n, s = 0;
          while (d % 2n === 0n) { d /= 2n; s++; } // n - 1 = 2^s · d
          testes: for (const a of BASES) {
            let x = potenciaMod(a, d, n);
            if (x === 1n || x === n - 1n) continue;
            for (let r = 1; r < s; r++) {
              x = (x * x) % n;
              if (x === n - 1n) continue testes;
            }
            return false; // a é uma testemunha: n é composto
          }
          return true;
        }

        console.log(millerRabin(561n));        // false (número de Carmichael)
        console.log(millerRabin(1000000007n)); // true
        console.log(millerRabin(2n ** 61n - 1n)); // true (primo de Mersenne)
      `,
      java: String.raw`
        import java.math.BigInteger;

        public class MillerRabin {
            static final long[] BASES = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};

            static boolean millerRabin(long n) {
                if (n < 2) return false;
                for (long p : BASES) if (n % p == 0) return n == p;
                long d = n - 1;
                int s = 0;
                while (d % 2 == 0) { d /= 2; s++; } // n - 1 = 2^s · d
                BigInteger N = BigInteger.valueOf(n), menosUm = N.subtract(BigInteger.ONE);
                for (long a : BASES) {
                    BigInteger x = BigInteger.valueOf(a).modPow(BigInteger.valueOf(d), N);
                    if (x.equals(BigInteger.ONE) || x.equals(menosUm)) continue;
                    boolean passou = false;
                    for (int r = 1; r < s && !passou; r++) {
                        x = x.multiply(x).mod(N);
                        passou = x.equals(menosUm);
                    }
                    if (!passou) return false; // a é uma testemunha: n é composto
                }
                return true;
            }

            public static void main(String[] args) {
                System.out.println(millerRabin(561));                    // false (número de Carmichael)
                System.out.println(millerRabin(1_000_000_007));          // true
                System.out.println(millerRabin(2305843009213693951L));   // true (2^61 - 1)
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <iostream>
        using namespace std;

        using u64 = uint64_t;
        using u128 = __uint128_t; // inteiro de 128 bits (GCC e Clang)

        u64 potenciaMod(u64 b, u64 e, u64 m) {
            u64 r = 1;
            for (b %= m; e > 0; e >>= 1, b = (u128)b * b % m)
                if (e & 1) r = (u128)r * b % m;
            return r;
        }

        bool millerRabin(u64 n) {
            const u64 bases[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
            if (n < 2) return false;
            for (u64 p : bases) if (n % p == 0) return n == p;
            u64 d = n - 1;
            int s = 0;
            while (d % 2 == 0) { d /= 2; s++; } // n - 1 = 2^s · d
            for (u64 a : bases) {
                u64 x = potenciaMod(a, d, n);
                if (x == 1 || x == n - 1) continue;
                bool passou = false;
                for (int r = 1; r < s && !passou; r++) {
                    x = (u128)x * x % n;
                    passou = (x == n - 1);
                }
                if (!passou) return false; // a é uma testemunha: n é composto
            }
            return true;
        }

        int main() {
            cout << boolalpha << millerRabin(561) << "\n";                  // false (Carmichael)
            cout << boolalpha << millerRabin(1000000007) << "\n";           // true
            cout << boolalpha << millerRabin(2305843009213693951ULL) << "\n"; // true (2^61 - 1)
        }
      `,
    },
  },
  {
    id: 'fermat-factorization',
    name: 'Fatoração de Fermat',
    difficulty: 'Intermediário',
    en: { name: "Fermat's Factorization", summary: 'Writes n as a difference of two squares, a² − b² = (a − b)(a + b).' },
    facts: { 'Criado por': 'Pierre de Fermat', 'Ano': '1643', 'Base de': 'Congruência de quadrados (Dixon, crivo quadrático, NFS)' },
    summary: 'Escreve n como diferença de dois quadrados, a² − b² = (a − b)(a + b).',
    description:
      'A Fatoração de Fermat parte de uma identidade simples: se n = a² − b², então n = (a − b)(a + b). O método testa a = ⌈√n⌉, ⌈√n⌉ + 1, … até que a² − n seja um quadrado perfeito b². Quando os dois fatores de n são próximos entre si, isso acontece logo nas primeiras tentativas — mesmo para números enormes. A mesma ideia, generalizada para "x² ≡ y² (mod n)" (a congruência de quadrados), é o fundamento dos métodos modernos de fatoração: o crivo quadrático e o crivo do corpo numérico.',
    complexity: { best: 'O(1)', average: 'Depende da distância entre os fatores', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Comece com a = ⌈√n⌉ (n deve ser ímpar).',
      'Calcule b² = a² − n.',
      'Se b² for um quadrado perfeito, os fatores são a − b e a + b.',
      'Caso contrário, aumente a em 1 e repita.',
      'O número de tentativas é proporcional a (q − p)² / √n: muito pequeno quando os fatores p e q estão próximos.',
    ],
    usedIn: ['Auditoria de chaves RSA mal geradas', 'Primeiro passo de fatoradores', 'Base do crivo quadrático e do NFS', 'Ensino de teoria dos números'],
    realWorld: [
      { title: 'Chaves RSA vulneráveis', text: 'Em 2022, o pesquisador Hanno Böck descobriu que impressoras de fabricantes como Canon e Fujifilm geravam chaves RSA com primos próximos demais — fatoráveis em segundos pelo método de Fermat (vulnerabilidade CVE-2022-26320).' },
      { title: 'Por que os primos do RSA devem ser distantes', text: 'O padrão FIPS 186, do governo americano, exige que a diferença entre os dois primos de uma chave RSA de n bits seja maior que 2^(n/2 − 100), justamente para impedir ataques como este.' },
      { title: 'Ideia que gerou os métodos modernos', text: 'Maurice Kraitchik, nos anos 1920, generalizou Fermat buscando x² ≡ y² (mod n). Dessa ideia nasceram o método de Dixon, o crivo quadrático e o crivo do corpo numérico.' },
    ],
    curiosities: [
      'Fermat descreveu o método em 1643, em uma carta a Marin Mersenne, fatorando o número 2 027 651 281 = 44 021 × 46 061.',
      'Para um número com fatores muito diferentes, como 3 × um primo enorme, o método é mais lento que a própria divisão por tentativas.',
      'No exemplo 8051, a primeira tentativa já funciona: 90² − 8051 = 49 = 7², então 8051 = 83 × 97.',
    ],
    code: {
      python: String.raw`
        from math import isqrt

        def fermat(n):  # n ímpar
            a = isqrt(n)
            if a * a < n:
                a += 1
            while True:
                b2 = a * a - n
                b = isqrt(b2)
                if b * b == b2:  # a² − n é um quadrado perfeito
                    return a - b, a + b
                a += 1

        print(fermat(5959))  # (59, 101)
        print(fermat(8051))  # (83, 97)
      `,
      javascript: String.raw`
        const isqrt = n => {
          let x = Math.floor(Math.sqrt(n));
          while (x * x > n) x--;
          while ((x + 1) * (x + 1) <= n) x++;
          return x;
        };

        function fermat(n) { // n ímpar
          let a = isqrt(n);
          if (a * a < n) a++;
          while (true) {
            const b2 = a * a - n;
            const b = isqrt(b2);
            if (b * b === b2) return [a - b, a + b]; // a² − n é um quadrado perfeito
            a++;
          }
        }

        console.log(fermat(5959)); // [59, 101]
        console.log(fermat(8051)); // [83, 97]
      `,
      java: String.raw`
        public class Fermat {
            static long isqrt(long n) {
                long x = (long) Math.sqrt((double) n);
                while (x * x > n) x--;
                while ((x + 1) * (x + 1) <= n) x++;
                return x;
            }

            static long[] fermat(long n) { // n ímpar
                long a = isqrt(n);
                if (a * a < n) a++;
                while (true) {
                    long b2 = a * a - n;
                    long b = isqrt(b2);
                    if (b * b == b2) return new long[]{a - b, a + b}; // a² − n é um quadrado perfeito
                    a++;
                }
            }

            public static void main(String[] args) {
                long[] f = fermat(5959);
                System.out.println(f[0] + " × " + f[1]); // 59 × 101
                f = fermat(8051);
                System.out.println(f[0] + " × " + f[1]); // 83 × 97
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <iostream>
        #include <utility>
        using namespace std;

        long long isqrt(long long n) {
            long long x = (long long)sqrtl((long double)n);
            while (x * x > n) x--;
            while ((x + 1) * (x + 1) <= n) x++;
            return x;
        }

        pair<long long, long long> fermat(long long n) { // n ímpar
            long long a = isqrt(n);
            if (a * a < n) a++;
            while (true) {
                long long b2 = a * a - n;
                long long b = isqrt(b2);
                if (b * b == b2) return {a - b, a + b}; // a² − n é um quadrado perfeito
                a++;
            }
        }

        int main() {
            auto [p, q] = fermat(5959);
            cout << p << " × " << q << "\n"; // 59 × 101
            auto [r, s] = fermat(8051);
            cout << r << " × " << s << "\n"; // 83 × 97
        }
      `,
    },
  },
  {
    id: 'pollard-rho',
    name: 'Algoritmo rho de Pollard',
    difficulty: 'Avançado',
    en: { name: "Pollard's Rho Algorithm", summary: 'Finds a factor by detecting a cycle in a pseudo-random sequence, with the tortoise and the hare.' },
    facts: { 'Criado por': 'John Pollard', 'Ano': '1975', 'Detecção de ciclo': 'Floyd (tartaruga e lebre)' },
    summary: 'Encontra um fator detectando um ciclo em uma sequência pseudoaleatória, com a tartaruga e a lebre.',
    description:
      'O algoritmo rho de Pollard gera a sequência x → x² + 1 (mod n). Módulo um fator primo p desconhecido de n, essa sequência entra em ciclo depois de cerca de √p passos — pelo paradoxo do aniversário —, desenhando a forma da letra grega ρ. Para detectar o ciclo sem conhecer p, usa duas cópias: a "tartaruga" anda um passo e a "lebre" anda dois; quando elas coincidem módulo p, a diferença x − y é múltiplo de p, e mdc(|x − y|, n) revela o fator. O custo esperado é O(√p) ≈ O(n^¼), muito melhor que a divisão por tentativas.',
    complexity: { best: 'O(1)', average: 'O(√p) ≈ O(n^¼)', worst: 'Sem garantia (heurístico)', space: 'O(1)' },
    steps: [
      'Comece com x = y = 2 e a função f(x) = x² + c (mod n), com c = 1.',
      'A cada passo: x = f(x) (tartaruga, 1 passo) e y = f(f(y)) (lebre, 2 passos).',
      'Calcule d = mdc(|x − y|, n).',
      'Se d = 1, continue. Se 1 < d < n, d é um fator de n.',
      'Se d = n, a sequência ciclou ao mesmo tempo para todos os fatores: troque a constante c e recomece.',
    ],
    usedIn: ['Comando factor do GNU coreutils', 'Sistemas de álgebra (Mathematica, SageMath, PARI/GP)', 'Fatoração de números de até ~25 dígitos', 'Logaritmo discreto (variante rho)', 'Competições de programação'],
    realWorld: [
      { title: 'Fatoradores do dia a dia', text: 'O comando factor do GNU coreutils e sistemas como PARI/GP usam Pollard rho depois da divisão por primos pequenos: ele encontra fatores de até uns 20 dígitos em frações de segundo.' },
      { title: 'Ataque ao logaritmo discreto', text: 'Uma variante, o rho para logaritmo discreto, é o melhor ataque genérico conhecido contra criptografia de curvas elípticas — e é por causa dele que chaves de 256 bits oferecem "128 bits de segurança".' },
      { title: 'Recordes históricos', text: 'Em 1980, Richard Brent e John Pollard usaram uma versão aprimorada do rho para fatorar o número de Fermat F8 = 2²⁵⁶ + 1, que tem 78 dígitos.' },
    ],
    curiosities: [
      'O nome vem do formato da sequência: um "rabo" seguido de um ciclo, como a letra grega ρ.',
      'A detecção de ciclo com dois ponteiros em velocidades diferentes é atribuída a Robert Floyd e também é usada para achar ciclos em listas ligadas — uma pergunta clássica de entrevistas.',
      'Pelo paradoxo do aniversário, bastam cerca de √p valores aleatórios módulo p para que dois coincidam — o mesmo motivo pelo qual, em uma sala com 23 pessoas, a chance de duas fazerem aniversário no mesmo dia passa de 50%.',
    ],
    code: {
      python: String.raw`
        from math import gcd

        def pollard_rho(n, c=1):
            if n % 2 == 0:
                return 2
            x = y = 2
            d = 1
            while d == 1:
                x = (x * x + c) % n          # tartaruga: 1 passo
                y = (y * y + c) % n
                y = (y * y + c) % n          # lebre: 2 passos
                d = gcd(abs(x - y), n)
            return d if d != n else pollard_rho(n, c + 1)  # falhou: tenta outra constante

        print(pollard_rho(8051))   # 97 (8051 = 97 × 83)
        print(pollard_rho(10403))  # 101 (10403 = 101 × 103)
      `,
      javascript: String.raw`
        const mdc = (a, b) => (b === 0 ? a : mdc(b, a % b));

        // Number basta enquanto n² < 2^53 (n até ~9 · 10^7); para mais, use BigInt.
        function pollardRho(n, c = 1) {
          if (n % 2 === 0) return 2;
          let x = 2, y = 2, d = 1;
          while (d === 1) {
            x = (x * x + c) % n;         // tartaruga: 1 passo
            y = (y * y + c) % n;
            y = (y * y + c) % n;         // lebre: 2 passos
            d = mdc(Math.abs(x - y), n);
          }
          return d !== n ? d : pollardRho(n, c + 1); // falhou: tenta outra constante
        }

        console.log(pollardRho(8051));  // 97 (8051 = 97 × 83)
        console.log(pollardRho(10403)); // 101 (10403 = 101 × 103)
      `,
      java: String.raw`
        public class PollardRho {
            static long mdc(long a, long b) { return b == 0 ? a : mdc(b, a % b); }

            // long basta enquanto n² < 2^63 (n até ~3 · 10^9); para mais, use BigInteger
            static long pollardRho(long n, long c) {
                if (n % 2 == 0) return 2;
                long x = 2, y = 2, d = 1;
                while (d == 1) {
                    x = (x * x + c) % n;          // tartaruga: 1 passo
                    y = (y * y + c) % n;
                    y = (y * y + c) % n;          // lebre: 2 passos
                    d = mdc(Math.abs(x - y), n);
                }
                return d != n ? d : pollardRho(n, c + 1); // falhou: tenta outra constante
            }

            public static void main(String[] args) {
                System.out.println(pollardRho(8051, 1));  // 97 (8051 = 97 × 83)
                System.out.println(pollardRho(10403, 1)); // 101 (10403 = 101 × 103)
            }
        }
      `,
      cpp: String.raw`
        #include <cstdlib>
        #include <iostream>
        #include <numeric>
        using namespace std;

        // long long basta enquanto n² < 2^63 (n até ~3 · 10^9); para mais, use __int128
        long long pollardRho(long long n, long long c = 1) {
            if (n % 2 == 0) return 2;
            long long x = 2, y = 2, d = 1;
            while (d == 1) {
                x = (x * x + c) % n;          // tartaruga: 1 passo
                y = (y * y + c) % n;
                y = (y * y + c) % n;          // lebre: 2 passos
                d = gcd(llabs(x - y), n);
            }
            return d != n ? d : pollardRho(n, c + 1); // falhou: tenta outra constante
        }

        int main() {
            cout << pollardRho(8051) << "\n";  // 97 (8051 = 97 × 83)
            cout << pollardRho(10403) << "\n"; // 101 (10403 = 101 × 103)
        }
      `,
    },
  },
  {
    id: 'pollard-p-1',
    name: 'Algoritmo p − 1 de Pollard',
    difficulty: 'Avançado',
    en: { name: "Pollard's p − 1 Algorithm", summary: 'Finds a factor p quickly when p − 1 is made only of small primes.' },
    facts: { 'Criado por': 'John Pollard', 'Ano': '1974', 'Baseado em': 'Pequeno teorema de Fermat' },
    summary: 'Encontra um fator p rapidamente quando p − 1 é formado só por primos pequenos.',
    description:
      'O algoritmo p − 1 de Pollard usa o pequeno teorema de Fermat: se p é primo, então a^(p−1) ≡ 1 (mod p) — e o mesmo vale para qualquer múltiplo de p − 1. Calculando a = 2^(k!) mod n para k crescente, assim que k! se torna múltiplo de p − 1 para algum fator primo p de n, temos p | (a − 1), e mdc(a − 1, n) revela p. Funciona muito bem quando p − 1 é "suave" (só tem fatores primos pequenos) e falha quando p − 1 tem um primo grande.',
    complexity: { best: 'O(log n)', average: 'O(B · log B · log² n)', worst: 'O(B · log B · log² n)', space: 'O(1)' },
    steps: [
      'Escolha uma base a = 2 e um limite B.',
      'Para k = 2, 3, …, B: faça a = aᵏ mod n (assim a = 2^(k!) mod n).',
      'Calcule d = mdc(a − 1, n).',
      'Se 1 < d < n, d é um fator. Se d = n, troque a base; se d = 1, continue.',
      'Se chegar a B sem sucesso, os fatores de n têm p − 1 com algum primo maior que B.',
    ],
    usedIn: ['Fatoradores de uso geral (GMP-ECM, PARI/GP)', 'Testes de segurança de chaves RSA', 'Busca de fatores de números de Mersenne (GIMPS)', 'Ensino de teoria dos números'],
    realWorld: [
      { title: 'Por que existem "primos fortes"', text: 'Para resistir a este ataque, normas antigas de RSA recomendavam escolher primos p em que p − 1 tivesse um fator primo grande — os chamados primos fortes.' },
      { title: 'GIMPS', text: 'O projeto GIMPS, que busca primos de Mersenne, roda p − 1 em cada candidato 2ᵖ − 1 antes do teste caro de primalidade, eliminando muitos deles ao encontrar um fator.' },
      { title: 'Fatoração em camadas', text: 'Programas de fatoração aplicam o p − 1 cedo, por ser barato: quando ele funciona, economiza muito tempo; quando falha, passam para o ECM ou crivos.' },
    ],
    curiosities: [
      'John Pollard publicou o método em 1974, um ano antes do rho. Ele trabalhou na British Telecom e é considerado um dos pais da fatoração moderna.',
      'No exemplo, 299 = 13 × 23: 13 − 1 = 12 divide 4! = 24, então o fator 13 aparece em k = 4, enquanto 23 − 1 = 22 só dividiria 11!.',
      'O método de curvas elípticas de Lenstra generaliza esta ideia: em vez do grupo fixo de tamanho p − 1, troca de "grupo" a cada curva até encontrar um de ordem suave.',
    ],
    code: {
      python: String.raw`
        from math import gcd

        def pollard_p_menos_1(n, limite=100):
            a = 2
            for k in range(2, limite):
                a = pow(a, k, n)        # agora a = 2^(k!) mod n
                d = gcd(a - 1, n)
                if 1 < d < n:
                    return d
                if d == n:
                    return None         # falhou: tente outra base
            return None

        print(pollard_p_menos_1(299))   # 13  (13 − 1 = 12 divide 4!)
        print(pollard_p_menos_1(1403))  # 61  (61 − 1 = 60 divide 5!)
      `,
      javascript: String.raw`
        const mdc = (a, b) => (b === 0n ? a : mdc(b, a % b));

        function potenciaMod(b, e, m) {
          let r = 1n;
          for (b %= m; e > 0n; e >>= 1n, b = (b * b) % m) if (e & 1n) r = (r * b) % m;
          return r;
        }

        function pollardPMenos1(n, limite = 100n) {
          let a = 2n;
          for (let k = 2n; k < limite; k++) {
            a = potenciaMod(a, k, n); // agora a = 2^(k!) mod n
            const d = mdc(a - 1n, n);
            if (d > 1n && d < n) return d;
            if (d === n) return null;  // falhou: tente outra base
          }
          return null;
        }

        console.log(String(pollardPMenos1(299n)));  // 13 (13 − 1 = 12 divide 4!)
        console.log(String(pollardPMenos1(1403n))); // 61 (61 − 1 = 60 divide 5!)
      `,
      java: String.raw`
        import java.math.BigInteger;

        public class PollardPMenos1 {
            static long pollardPMenos1(long n, int limite) {
                BigInteger N = BigInteger.valueOf(n), a = BigInteger.TWO;
                for (int k = 2; k < limite; k++) {
                    a = a.modPow(BigInteger.valueOf(k), N); // agora a = 2^(k!) mod n
                    long d = a.subtract(BigInteger.ONE).gcd(N).longValue();
                    if (d > 1 && d < n) return d;
                    if (d == n) return -1;                  // falhou: tente outra base
                }
                return -1;
            }

            public static void main(String[] args) {
                System.out.println(pollardPMenos1(299, 100));  // 13 (13 − 1 = 12 divide 4!)
                System.out.println(pollardPMenos1(1403, 100)); // 61 (61 − 1 = 60 divide 5!)
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <numeric>
        using namespace std;

        // n deve caber em 31 bits para que b * b não estoure 64 bits
        long long potenciaMod(long long b, long long e, long long m) {
            long long r = 1;
            for (b %= m; e > 0; e >>= 1, b = b * b % m) if (e & 1) r = r * b % m;
            return r;
        }

        long long pollardPMenos1(long long n, int limite = 100) {
            long long a = 2;
            for (int k = 2; k < limite; k++) {
                a = potenciaMod(a, k, n);    // agora a = 2^(k!) mod n
                long long d = gcd(a - 1, n);
                if (d > 1 && d < n) return d;
                if (d == n) return -1;       // falhou: tente outra base
            }
            return -1;
        }

        int main() {
            cout << pollardPMenos1(299) << "\n";  // 13 (13 − 1 = 12 divide 4!)
            cout << pollardPMenos1(1403) << "\n"; // 61 (61 − 1 = 60 divide 5!)
        }
      `,
    },
  },
  {
    id: 'quadratic-sieve',
    name: 'Crivo Quadrático',
    difficulty: 'Avançado',
    en: { name: 'Quadratic Sieve', summary: 'Collects "smooth" numbers and combines them, with linear algebra, into a congruence of squares.' },
    facts: { 'Criado por': 'Carl Pomerance', 'Ano': '1981', 'Recorde histórico': 'RSA-129 (1994)', 'Versão mostrada': 'Didática (sem crivo real)' },
    summary: 'Coleta números "suaves" e os combina, com álgebra linear, em uma congruência de quadrados.',
    description:
      'O Crivo Quadrático busca dois números com x² ≡ y² (mod n), mas x ≢ ±y — o que dá um fator via mdc(x − y, n). Para isso, avalia Q(x) = x² − n para x logo acima de √n e guarda os valores "suaves", que se fatoram completamente em uma base de primos pequenos. Cada relação vira um vetor com a paridade dos expoentes; com eliminação de Gauss módulo 2, encontra-se um subconjunto cujo produto tem todos os expoentes pares — um quadrado perfeito. O "crivo" do nome é a técnica que encontra os valores suaves sem dividir um por um; a versão didática do código usa divisão direta para manter a clareza.',
    complexity: { best: 'exp(√(ln n · ln ln n))', average: 'exp(√(ln n · ln ln n))', worst: 'exp(√(ln n · ln ln n))', space: 'O(B²)' },
    steps: [
      'Monte a base de fatores: primos p pequenos para os quais n é resíduo quadrático módulo p (só eles podem dividir x² − n).',
      'Para x = ⌈√n⌉, ⌈√n⌉ + 1, …, calcule x² − n e guarde os que se fatoram só com a base (relações suaves).',
      'Represente cada relação pelo vetor de paridades dos expoentes.',
      'Com eliminação de Gauss módulo 2, encontre um subconjunto de relações cujos vetores somam zero: o produto dos x² − n é um quadrado Y².',
      'Com X = produto dos x, vale X² ≡ Y² (mod n); calcule mdc(X − Y, n) para obter um fator.',
    ],
    usedIn: ['Fatoração de números de 50 a 100 dígitos', 'msieve e YAFU', 'Pesquisa em criptoanálise', 'Base conceitual do NFS'],
    realWorld: [
      { title: 'RSA-129', text: 'Em 1994, cerca de 600 voluntários em mais de 20 países usaram uma variante do crivo quadrático para fatorar o RSA-129, revelando a frase secreta "The Magic Words are Squeamish Ossifrage", publicada como desafio na Scientific American em 1977.' },
      { title: 'Ferramentas modernas', text: 'Programas como msieve e YAFU ainda usam o crivo quadrático (na versão com múltiplos polinômios) para números de até uns 100 dígitos, faixa em que ele é mais rápido que o NFS.' },
      { title: 'Computação distribuída', text: 'A coleta de relações é "embaraçosamente paralela": cada computador testa um intervalo diferente de x, e só a álgebra linear final precisa ser centralizada.' },
    ],
    curiosities: [
      'Carl Pomerance apresentou o método em 1981. Ele conta que a ideia veio ao pensar em como melhorar o método de Dixon, que testa valores de x aleatórios em vez de próximos de √n.',
      'Quando Rivest, Shamir e Adleman lançaram o desafio do RSA-129 em 1977, estimaram que fatorá-lo levaria 40 quatrilhões de anos. Levou 17 anos — graças a algoritmos melhores, não só a computadores mais rápidos.',
      'No exemplo do código, 15347 = 103 × 149, e os valores suaves aparecem logo depois de √15347 ≈ 123,9.',
    ],
    code: {
      python: String.raw`
        from math import gcd, isqrt

        def crivo_quadratico(n, tam_base=8):
            # 1) base de fatores: primos p em que n é resíduo quadrático módulo p
            base, p = [], 2
            while len(base) < tam_base:
                if all(p % q for q in range(2, isqrt(p) + 1)):
                    if n % p == 0:
                        return p
                    if p == 2 or pow(n, (p - 1) // 2, p) == 1:
                        base.append(p)
                p += 1
            # 2) relações suaves: x² − n que se fatora só com a base
            relacoes, x = [], isqrt(n) + 1
            while len(relacoes) < len(base) + 2:
                v, exps = x * x - n, []
                for p in base:
                    e = 0
                    while v % p == 0:
                        v //= p
                        e += 1
                    exps.append(e)
                if v == 1:
                    relacoes.append((x, exps))
                x += 1
            # 3) eliminação de Gauss módulo 2 (cada linha: [paridades, combinação usada])
            linhas = [[sum((e % 2) << j for j, e in enumerate(exps)), 1 << i] for i, (_, exps) in enumerate(relacoes)]
            usada = [False] * len(linhas)
            for col in range(len(base)):
                piv = next((i for i, l in enumerate(linhas) if not usada[i] and l[0] >> col & 1), None)
                if piv is None:
                    continue
                usada[piv] = True
                for i, l in enumerate(linhas):
                    if i != piv and l[0] >> col & 1:
                        l[0] ^= linhas[piv][0]
                        l[1] ^= linhas[piv][1]
            # 4) cada combinação com paridades zeradas dá X² ≡ Y² (mod n)
            for bits, combo in linhas:
                if bits:
                    continue
                escolhidas = [r for i, r in enumerate(relacoes) if combo >> i & 1]
                X = 1
                for xi, _ in escolhidas:
                    X = X * xi % n
                Y = 1
                for j, p in enumerate(base):
                    Y = Y * pow(p, sum(e[j] for _, e in escolhidas) // 2, n) % n
                d = gcd(X - Y, n)
                if 1 < d < n:
                    return d
            return None

        d = crivo_quadratico(15347)
        print(d, 15347 // d)  # 103 149
      `,
      javascript: String.raw`
        // Versão didática para n pequeno (os produtos ficam abaixo de 2^53).
        const mdc = (a, b) => (b === 0 ? Math.abs(a) : mdc(b, a % b));
        const isqrt = n => Math.floor(Math.sqrt(n));
        const potenciaMod = (b, e, m) => { let r = 1; for (b %= m; e > 0; e = Math.floor(e / 2), b = (b * b) % m) if (e % 2) r = (r * b) % m; return r; };
        const ehPrimo = p => { for (let q = 2; q * q <= p; q++) if (p % q === 0) return false; return true; };

        function crivoQuadratico(n, tamBase = 8) {
          // 1) base de fatores: primos p em que n é resíduo quadrático módulo p
          const base = [];
          for (let p = 2; base.length < tamBase; p++) {
            if (!ehPrimo(p)) continue;
            if (n % p === 0) return p;
            if (p === 2 || potenciaMod(n % p, (p - 1) / 2, p) === 1) base.push(p);
          }
          // 2) relações suaves: x² − n que se fatora só com a base
          const relacoes = [];
          for (let x = isqrt(n) + 1; relacoes.length < base.length + 2; x++) {
            let v = x * x - n;
            const exps = base.map(p => { let e = 0; while (v % p === 0) { v /= p; e++; } return e; });
            if (v === 1) relacoes.push({ x, exps });
          }
          // 3) eliminação de Gauss módulo 2 (paridades e combinação usada, em bits)
          const linhas = relacoes.map((r, i) => ({ bits: r.exps.reduce((s, e, j) => s | ((e % 2) << j), 0), combo: 1 << i, usada: false }));
          for (let col = 0; col < base.length; col++) {
            const piv = linhas.findIndex(l => !l.usada && (l.bits >> col) & 1);
            if (piv < 0) continue;
            linhas[piv].usada = true;
            linhas.forEach((l, i) => {
              if (i !== piv && (l.bits >> col) & 1) { l.bits ^= linhas[piv].bits; l.combo ^= linhas[piv].combo; }
            });
          }
          // 4) cada combinação com paridades zeradas dá X² ≡ Y² (mod n)
          for (const l of linhas) {
            if (l.bits) continue;
            const escolhidas = relacoes.filter((_, i) => (l.combo >> i) & 1);
            const X = escolhidas.reduce((acc, r) => (acc * r.x) % n, 1);
            const Y = base.reduce((acc, p, j) => (acc * potenciaMod(p, escolhidas.reduce((s, r) => s + r.exps[j], 0) / 2, n)) % n, 1);
            const d = mdc(X - Y, n);
            if (d > 1 && d < n) return d;
          }
          return null;
        }

        const d = crivoQuadratico(15347);
        console.log(d, 15347 / d); // 103 149
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class CrivoQuadratico {
            static long mdc(long a, long b) { return b == 0 ? Math.abs(a) : mdc(b, a % b); }

            static long potenciaMod(long b, long e, long m) {
                long r = 1;
                for (b %= m; e > 0; e >>= 1, b = b * b % m) if ((e & 1) == 1) r = r * b % m;
                return r;
            }

            static boolean ehPrimo(long p) {
                for (long q = 2; q * q <= p; q++) if (p % q == 0) return false;
                return true;
            }

            static long crivoQuadratico(long n, int tamBase) {
                // 1) base de fatores: primos p em que n é resíduo quadrático módulo p
                List<Long> base = new ArrayList<>();
                for (long p = 2; base.size() < tamBase; p++) {
                    if (!ehPrimo(p)) continue;
                    if (n % p == 0) return p;
                    if (p == 2 || potenciaMod(n % p, (p - 1) / 2, p) == 1) base.add(p);
                }
                // 2) relações suaves: x² − n que se fatora só com a base
                List<long[]> xs = new ArrayList<>();
                List<int[]> exps = new ArrayList<>();
                for (long x = (long) Math.sqrt((double) n) + 1; xs.size() < base.size() + 2; x++) {
                    long v = x * x - n;
                    int[] e = new int[base.size()];
                    for (int j = 0; j < base.size(); j++) while (v % base.get(j) == 0) { v /= base.get(j); e[j]++; }
                    if (v == 1) { xs.add(new long[]{x}); exps.add(e); }
                }
                // 3) eliminação de Gauss módulo 2 (paridades e combinação usada, em bits)
                int m = xs.size();
                long[] bits = new long[m], combo = new long[m];
                boolean[] usada = new boolean[m];
                for (int i = 0; i < m; i++) {
                    for (int j = 0; j < base.size(); j++) bits[i] |= (long) (exps.get(i)[j] % 2) << j;
                    combo[i] = 1L << i;
                }
                for (int col = 0; col < base.size(); col++) {
                    int piv = -1;
                    for (int i = 0; i < m && piv < 0; i++) if (!usada[i] && ((bits[i] >> col) & 1) == 1) piv = i;
                    if (piv < 0) continue;
                    usada[piv] = true;
                    for (int i = 0; i < m; i++)
                        if (i != piv && ((bits[i] >> col) & 1) == 1) { bits[i] ^= bits[piv]; combo[i] ^= combo[piv]; }
                }
                // 4) cada combinação com paridades zeradas dá X² ≡ Y² (mod n)
                for (int i = 0; i < m; i++) {
                    if (bits[i] != 0) continue;
                    long X = 1;
                    int[] total = new int[base.size()];
                    for (int k = 0; k < m; k++) {
                        if (((combo[i] >> k) & 1) == 0) continue;
                        X = X * xs.get(k)[0] % n;
                        for (int j = 0; j < base.size(); j++) total[j] += exps.get(k)[j];
                    }
                    long Y = 1;
                    for (int j = 0; j < base.size(); j++) Y = Y * potenciaMod(base.get(j), total[j] / 2, n) % n;
                    long d = mdc(X - Y, n);
                    if (d > 1 && d < n) return d;
                }
                return -1;
            }

            public static void main(String[] args) {
                long d = crivoQuadratico(15347, 8);
                System.out.println(d + " " + 15347 / d); // 103 149
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdlib>
        #include <iostream>
        #include <vector>
        using namespace std;

        long long mdc(long long a, long long b) { return b == 0 ? llabs(a) : mdc(b, a % b); }

        long long potenciaMod(long long b, long long e, long long m) {
            long long r = 1;
            for (b %= m; e > 0; e >>= 1, b = b * b % m) if (e & 1) r = r * b % m;
            return r;
        }

        bool ehPrimo(long long p) {
            for (long long q = 2; q * q <= p; q++) if (p % q == 0) return false;
            return true;
        }

        long long crivoQuadratico(long long n, size_t tamBase = 8) {
            // 1) base de fatores: primos p em que n é resíduo quadrático módulo p
            vector<long long> base;
            for (long long p = 2; base.size() < tamBase; p++) {
                if (!ehPrimo(p)) continue;
                if (n % p == 0) return p;
                if (p == 2 || potenciaMod(n % p, (p - 1) / 2, p) == 1) base.push_back(p);
            }
            // 2) relações suaves: x² − n que se fatora só com a base
            vector<long long> xs;
            vector<vector<int>> exps;
            for (long long x = (long long)sqrtl((long double)n) + 1; xs.size() < base.size() + 2; x++) {
                long long v = x * x - n;
                vector<int> e(base.size(), 0);
                for (size_t j = 0; j < base.size(); j++) while (v % base[j] == 0) { v /= base[j]; e[j]++; }
                if (v == 1) { xs.push_back(x); exps.push_back(e); }
            }
            // 3) eliminação de Gauss módulo 2 (paridades e combinação usada, em bits)
            size_t m = xs.size();
            vector<unsigned long long> bits(m, 0), combo(m);
            vector<bool> usada(m, false);
            for (size_t i = 0; i < m; i++) {
                for (size_t j = 0; j < base.size(); j++) bits[i] |= (unsigned long long)(exps[i][j] % 2) << j;
                combo[i] = 1ULL << i;
            }
            for (size_t col = 0; col < base.size(); col++) {
                int piv = -1;
                for (size_t i = 0; i < m && piv < 0; i++) if (!usada[i] && ((bits[i] >> col) & 1)) piv = i;
                if (piv < 0) continue;
                usada[piv] = true;
                for (size_t i = 0; i < m; i++)
                    if ((int)i != piv && ((bits[i] >> col) & 1)) { bits[i] ^= bits[piv]; combo[i] ^= combo[piv]; }
            }
            // 4) cada combinação com paridades zeradas dá X² ≡ Y² (mod n)
            for (size_t i = 0; i < m; i++) {
                if (bits[i]) continue;
                long long X = 1;
                vector<int> total(base.size(), 0);
                for (size_t k = 0; k < m; k++) {
                    if (!((combo[i] >> k) & 1)) continue;
                    X = X * xs[k] % n;
                    for (size_t j = 0; j < base.size(); j++) total[j] += exps[k][j];
                }
                long long Y = 1;
                for (size_t j = 0; j < base.size(); j++) Y = Y * potenciaMod(base[j], total[j] / 2, n) % n;
                long long d = mdc(X - Y, n);
                if (d > 1 && d < n) return d;
            }
            return -1;
        }

        int main() {
            long long d = crivoQuadratico(15347);
            cout << d << " " << 15347 / d << "\n"; // 103 149
        }
      `,
    },
  },
  {
    id: 'lenstra-ecm',
    name: 'Fatoração por Curvas Elípticas (Lenstra)',
    difficulty: 'Avançado',
    en: { name: "Lenstra's Elliptic Curve Factorization (ECM)", summary: 'Does arithmetic on random elliptic curves until an impossible inversion reveals a factor.' },
    facts: { 'Criado por': 'Hendrik Lenstra', 'Ano': '1985 (publicado em 1987)', 'Custo depende de': 'Tamanho do menor fator' },
    summary: 'Faz contas em curvas elípticas aleatórias até que uma inversão impossível revele um fator.',
    description:
      'O método de curvas elípticas de Lenstra (ECM) generaliza o p − 1 de Pollard. Ele escolhe uma curva y² = x³ + ax + b módulo n e um ponto P sobre ela, e calcula kP para k = 2!, 3!, 4!… Somar pontos exige dividir — isto é, calcular inversos módulo n. Como n não é primo, em algum momento pode surgir um número sem inverso: e então o mdc dele com n é um fator! Isso acontece quando o número de pontos da curva módulo algum fator p é "suave". Se uma curva falha, basta trocar de curva — e cada nova curva é uma nova chance. O custo depende do tamanho do menor fator, não do tamanho de n.',
    complexity: { best: 'O(log² n)', average: 'exp(√(2 ln p · ln ln p))', worst: 'exp(√(2 ln p · ln ln p))', space: 'O(1)' },
    steps: [
      'Escolha uma curva y² = x³ + ax + b (mod n) e um ponto P sobre ela (aqui P = (0, 1), o que fixa b = 1).',
      'Para k = 2, 3, 4, …: substitua P por kP, usando as fórmulas de soma e duplicação de pontos.',
      'Cada soma precisa do inverso de um número módulo n, calculado com o Euclides estendido.',
      'Se algum número não tiver inverso, d = mdc(número, n) > 1. Se d < n, d é um fator!',
      'Se d = n ou o limite for atingido, troque a curva (outro a) e recomece.',
    ],
    usedIn: ['GMP-ECM e PARI/GP', 'GIMPS (fatores de números de Mersenne)', 'Fatoração de números com fatores "médios"', 'Etapa de fatoração dentro do NFS'],
    realWorld: [
      { title: 'Fatores escondidos em números enormes', text: 'O ECM encontra fatores de 30 a 60 dígitos mesmo em números com milhares de dígitos — algo impossível para crivos, cujo custo depende do tamanho total de n.' },
      { title: 'GIMPS', text: 'Voluntários do GIMPS rodam ECM em números de Mersenne pequenos (2ᵖ − 1) para encontrar novos fatores; o projeto mantém uma lista pública com milhares deles.' },
      { title: 'Dentro do NFS', text: 'O crivo do corpo numérico gera milhões de números de tamanho médio que precisam ser fatorados; implementações como o CADO-NFS usam ECM nessa etapa.' },
    ],
    curiosities: [
      'Hendrik Lenstra apresentou o método em 1985. Curvas elípticas já eram estudadas havia séculos, mas este foi um dos primeiros usos delas em algoritmos — dois anos antes de surgirem na criptografia.',
      'O recorde de maior fator encontrado por ECM passa de 80 dígitos decimais.',
      'No exemplo, 455839 = 599 × 761: a curva com a = 1 revela o fator 599 depois de alguns passos — basta que o número de pontos da curva módulo 599 seja suave.',
    ],
    code: {
      python: String.raw`
        from math import gcd

        class FatorEncontrado(Exception):
            def __init__(self, d):
                self.d = d

        def inverso(v, n):
            v %= n
            g = gcd(v, n)
            if g != 1:
                raise FatorEncontrado(g)  # v não tem inverso: g divide n!
            return pow(v, -1, n)

        def somar(P, Q, a, n):  # soma de pontos em y² = x³ + a·x + b (mod n)
            if P is None:
                return Q
            if Q is None:
                return P
            (x1, y1), (x2, y2) = P, Q
            if x1 == x2 and y1 == y2:
                lam = (3 * x1 * x1 + a) * inverso(2 * y1, n) % n
            else:
                lam = (y2 - y1) * inverso(x2 - x1, n) % n
            x3 = (lam * lam - x1 - x2) % n
            return (x3, (lam * (x1 - x3) - y1) % n)

        def multiplicar(k, P, a, n):  # k·P por duplicações sucessivas
            R = None
            while k:
                if k & 1:
                    R = somar(R, P, a, n)
                P = somar(P, P, a, n)
                k >>= 1
            return R

        def lenstra(n, limite=30, curvas=10):
            for a in range(1, curvas + 1):  # curva y² = x³ + a·x + 1, ponto P = (0, 1)
                P = (0, 1)
                try:
                    for k in range(2, limite):
                        P = multiplicar(k, P, a, n)  # P vira k!·P
                except FatorEncontrado as f:
                    if f.d != n:
                        return f.d
            return None

        d = lenstra(455839)
        print(d, 455839 // d)  # 599 761
      `,
      javascript: String.raw`
        // Versão didática para n pequeno (os produtos ficam abaixo de 2^53).
        class FatorEncontrado extends Error {
          constructor(d) { super("fator"); this.d = d; }
        }
        const mod = (v, n) => ((v % n) + n) % n;
        const mdc = (a, b) => (b === 0 ? a : mdc(b, a % b));

        function inverso(v, n) {
          v = mod(v, n);
          const g = mdc(v, n);
          if (g !== 1) throw new FatorEncontrado(g); // v não tem inverso: g divide n!
          let [r0, r1, s0, s1] = [v, n, 1, 0];       // Euclides estendido
          while (r1) { const q = Math.floor(r0 / r1); [r0, r1, s0, s1] = [r1, r0 - q * r1, s1, s0 - q * s1]; }
          return mod(s0, n);
        }

        function somar(P, Q, a, n) { // soma de pontos em y² = x³ + a·x + b (mod n)
          if (P === null) return Q;
          if (Q === null) return P;
          const [x1, y1] = P, [x2, y2] = Q;
          const lam = x1 === x2 && y1 === y2
            ? mod((3 * x1 * x1 + a) % n * inverso(2 * y1, n), n)
            : mod(mod(y2 - y1, n) * inverso(x2 - x1, n), n);
          const x3 = mod(lam * lam - x1 - x2, n);
          return [x3, mod(lam * (x1 - x3) - y1, n)];
        }

        function multiplicar(k, P, a, n) { // k·P por duplicações sucessivas
          let R = null;
          for (; k > 0; k = Math.floor(k / 2)) {
            if (k % 2) R = somar(R, P, a, n);
            P = somar(P, P, a, n);
          }
          return R;
        }

        function lenstra(n, limite = 30, curvas = 10) {
          for (let a = 1; a <= curvas; a++) { // curva y² = x³ + a·x + 1, ponto P = (0, 1)
            let P = [0, 1];
            try {
              for (let k = 2; k < limite; k++) P = multiplicar(k, P, a, n); // P vira k!·P
            } catch (e) {
              if (!(e instanceof FatorEncontrado)) throw e;
              if (e.d !== n) return e.d;
            }
          }
          return null;
        }

        const d = lenstra(455839);
        console.log(d, 455839 / d); // 599 761
      `,
      java: String.raw`
        public class Lenstra {
            static class FatorEncontrado extends RuntimeException {
                final long d;
                FatorEncontrado(long d) { this.d = d; }
            }

            static long mod(long v, long n) { return ((v % n) + n) % n; }
            static long mdc(long a, long b) { return b == 0 ? a : mdc(b, a % b); }

            static long inverso(long v, long n) {
                v = mod(v, n);
                long g = mdc(v, n);
                if (g != 1) throw new FatorEncontrado(g); // v não tem inverso: g divide n!
                long r0 = v, r1 = n, s0 = 1, s1 = 0;      // Euclides estendido
                while (r1 != 0) {
                    long q = r0 / r1, t = r0 - q * r1; r0 = r1; r1 = t;
                    t = s0 - q * s1; s0 = s1; s1 = t;
                }
                return mod(s0, n);
            }

            // soma de pontos em y² = x³ + a·x + b (mod n); null representa o ponto no infinito
            static long[] somar(long[] P, long[] Q, long a, long n) {
                if (P == null) return Q;
                if (Q == null) return P;
                long lam = (P[0] == Q[0] && P[1] == Q[1])
                    ? mod(mod(3 * P[0] % n * P[0] + a, n) * inverso(2 * P[1], n), n)
                    : mod(mod(Q[1] - P[1], n) * inverso(Q[0] - P[0], n), n);
                long x3 = mod(lam * lam - P[0] - Q[0], n);
                return new long[]{x3, mod(lam * mod(P[0] - x3, n) - P[1], n)};
            }

            static long[] multiplicar(long k, long[] P, long a, long n) { // k·P por duplicações
                long[] R = null;
                for (; k > 0; k >>= 1) {
                    if ((k & 1) == 1) R = somar(R, P, a, n);
                    P = somar(P, P, a, n);
                }
                return R;
            }

            static long lenstra(long n, int limite, int curvas) {
                for (long a = 1; a <= curvas; a++) { // curva y² = x³ + a·x + 1, ponto P = (0, 1)
                    long[] P = {0, 1};
                    try {
                        for (int k = 2; k < limite; k++) P = multiplicar(k, P, a, n); // P vira k!·P
                    } catch (FatorEncontrado f) {
                        if (f.d != n) return f.d;
                    }
                }
                return -1;
            }

            public static void main(String[] args) {
                long d = lenstra(455839, 30, 10);
                System.out.println(d + " " + 455839 / d); // 599 761
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <optional>
        #include <utility>
        using namespace std;

        using Ponto = optional<pair<long long, long long>>; // nullopt = ponto no infinito
        struct FatorEncontrado { long long d; };

        long long mod(long long v, long long n) { return ((v % n) + n) % n; }
        long long mdc(long long a, long long b) { return b == 0 ? a : mdc(b, a % b); }

        long long inverso(long long v, long long n) {
            v = mod(v, n);
            long long g = mdc(v, n);
            if (g != 1) throw FatorEncontrado{g}; // v não tem inverso: g divide n!
            long long r0 = v, r1 = n, s0 = 1, s1 = 0; // Euclides estendido
            while (r1 != 0) {
                long long q = r0 / r1, t = r0 - q * r1; r0 = r1; r1 = t;
                t = s0 - q * s1; s0 = s1; s1 = t;
            }
            return mod(s0, n);
        }

        Ponto somar(Ponto P, Ponto Q, long long a, long long n) { // y² = x³ + a·x + b (mod n)
            if (!P) return Q;
            if (!Q) return P;
            auto [x1, y1] = *P;
            auto [x2, y2] = *Q;
            long long lam = (x1 == x2 && y1 == y2)
                ? mod(mod(3 * x1 % n * x1 + a, n) * inverso(2 * y1, n), n)
                : mod(mod(y2 - y1, n) * inverso(x2 - x1, n), n);
            long long x3 = mod(lam * lam - x1 - x2, n);
            return pair{x3, mod(lam * mod(x1 - x3, n) - y1, n)};
        }

        Ponto multiplicar(long long k, Ponto P, long long a, long long n) { // k·P por duplicações
            Ponto R = nullopt;
            for (; k > 0; k >>= 1) {
                if (k & 1) R = somar(R, P, a, n);
                P = somar(P, P, a, n);
            }
            return R;
        }

        long long lenstra(long long n, int limite = 30, int curvas = 10) {
            for (long long a = 1; a <= curvas; a++) { // curva y² = x³ + a·x + 1, ponto P = (0, 1)
                Ponto P = pair{0LL, 1LL};
                try {
                    for (int k = 2; k < limite; k++) P = multiplicar(k, P, a, n); // P vira k!·P
                } catch (FatorEncontrado f) {
                    if (f.d != n) return f.d;
                }
            }
            return -1;
        }

        int main() {
            long long d = lenstra(455839);
            cout << d << " " << 455839 / d << "\n"; // 599 761
        }
      `,
    },
  },
  {
    id: 'aks',
    name: 'Teste de Primalidade AKS',
    difficulty: 'Avançado',
    en: { name: 'AKS Primality Test', summary: 'The first algorithm proven to decide primality in polynomial time, deterministically and unconditionally.' },
    facts: { 'Criado por': 'Agrawal, Kayal e Saxena', 'Ano': '2002', 'Prêmios': 'Gödel e Fulkerson (2006)' },
    summary: 'O primeiro algoritmo comprovadamente capaz de decidir primalidade em tempo polinomial, sem acaso nem hipóteses.',
    description:
      'O teste AKS responde "n é primo?" com certeza absoluta, sem aleatoriedade e sem depender de conjecturas, em tempo polinomial no número de dígitos de n. Sua base é uma generalização do pequeno teorema de Fermat: n é primo se e somente se (x + a)ⁿ ≡ xⁿ + a (mod n) como polinômios. Verificar isso diretamente teria n termos; o AKS reduz a conta trabalhando módulo xʳ − 1 para um r pequeno e testando só alguns valores de a. Foi um marco teórico — mas, na prática, o Miller-Rabin continua muito mais rápido.',
    complexity: { best: 'Õ(log⁶ n)', average: 'Õ(log⁶ n)', worst: 'Õ(log⁶ n)', space: 'O(r · log n)' },
    steps: [
      'Se n for uma potência perfeita (aᵇ com b > 1), é composto.',
      'Encontre o menor r tal que a ordem de n módulo r seja maior que log²(n).',
      'Se algum a ≤ r tiver 1 < mdc(a, n) < n, n é composto.',
      'Se n ≤ r, n é primo.',
      'Para a = 1 até ⌊√φ(r) · log n⌋, verifique se (x + a)ⁿ ≡ xⁿ + a (mod xʳ − 1, n). Se alguma falhar, n é composto; se todas valerem, n é primo.',
    ],
    usedIn: ['Teoria da complexidade computacional', 'Ensino de algoritmos e teoria dos números', 'Provas de que PRIMES está em P', 'Pesquisa em testes determinísticos'],
    realWorld: [
      { title: 'Marco da teoria da computação', text: 'Antes do AKS, não se sabia se testar primalidade estava na classe P (problemas resolvíveis deterministicamente em tempo polinomial). O artigo "PRIMES is in P" encerrou essa questão de décadas.' },
      { title: 'Por que não é usado na prática', text: 'Para números de 2048 bits, o AKS levaria um tempo enorme, enquanto o Miller-Rabin responde em milissegundos com probabilidade de erro desprezível. Bibliotecas criptográficas preferem o segundo.' },
      { title: 'Certificados de primalidade', text: 'Quando se precisa de certeza absoluta na prática, usam-se métodos como ECPP (com curvas elípticas), que produzem um "certificado" verificável e são muito mais rápidos que o AKS.' },
    ],
    curiosities: [
      'Foi publicado em 2002 por Manindra Agrawal e dois de seus alunos de graduação, Neeraj Kayal e Nitin Saxena, do Instituto Indiano de Tecnologia de Kanpur.',
      'O trabalho recebeu o Prêmio Gödel e o Prêmio Fulkerson em 2006, dois dos mais importantes da ciência da computação teórica e da matemática discreta.',
      'A versão original custava Õ(log¹² n); melhorias de Hendrik Lenstra e Carl Pomerance reduziram o expoente para 6.',
    ],
    code: {
      python: String.raw`
        from math import gcd, log2

        def mult_poli(p, q, r, n):  # produto de polinômios módulo (x^r − 1, n)
            res = [0] * r
            for i, ci in enumerate(p):
                if ci:
                    for j, cj in enumerate(q):
                        if cj:
                            res[(i + j) % r] = (res[(i + j) % r] + ci * cj) % n
            return res

        def potencia_poli(base, e, r, n):
            res = [1] + [0] * (r - 1)
            while e:
                if e & 1:
                    res = mult_poli(res, base, r, n)
                base = mult_poli(base, base, r, n)
                e >>= 1
            return res

        def aks(n):
            if n < 2:
                return False
            # 1) potência perfeita?
            for b in range(2, n.bit_length() + 1):
                a = round(n ** (1 / b))
                if any(c > 1 and c ** b == n for c in (a - 1, a, a + 1)):
                    return False
            # 2) menor r com ordem de n módulo r maior que log²(n)
            L = log2(n) ** 2
            r = 2
            while True:
                if gcd(r, n) == 1:
                    k, v = 1, n % r
                    while v != 1 and k <= L:
                        v = v * n % r
                        k += 1
                    if k > L:
                        break
                r += 1
            # 3) fator pequeno?
            for a in range(2, min(r, n - 1) + 1):
                if 1 < gcd(a, n) < n:
                    return False
            # 4)
            if n <= r:
                return True
            # 5) (x + a)^n ≡ x^n + a  (mod x^r − 1, n)
            phi = sum(1 for k in range(1, r) if gcd(k, r) == 1)
            for a in range(1, int(phi ** 0.5 * log2(n)) + 1):
                base = [0] * r
                base[0], base[1] = a % n, 1
                esperado = [0] * r
                esperado[n % r] = 1
                esperado[0] = (esperado[0] + a) % n
                if potencia_poli(base, n, r, n) != esperado:
                    return False
            return True

        print([k for k in range(2, 60) if aks(k)])
        # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]
      `,
      javascript: String.raw`
        // Versão didática para n pequeno.
        const mdc = (a, b) => (b === 0 ? a : mdc(b, a % b));

        function multPoli(p, q, r, n) { // produto de polinômios módulo (x^r − 1, n)
          const res = new Array(r).fill(0);
          for (let i = 0; i < r; i++) if (p[i]) for (let j = 0; j < r; j++) if (q[j]) res[(i + j) % r] = (res[(i + j) % r] + p[i] * q[j]) % n;
          return res;
        }

        function potenciaPoli(base, e, r, n) {
          let res = new Array(r).fill(0);
          res[0] = 1;
          for (; e > 0; e = Math.floor(e / 2)) {
            if (e % 2) res = multPoli(res, base, r, n);
            base = multPoli(base, base, r, n);
          }
          return res;
        }

        function aks(n) {
          if (n < 2) return false;
          // 1) potência perfeita?
          for (let b = 2; 2 ** b <= n; b++) {
            const a = Math.round(n ** (1 / b));
            if ([a - 1, a, a + 1].some(c => c > 1 && c ** b === n)) return false;
          }
          // 2) menor r com ordem de n módulo r maior que log²(n)
          const L = Math.log2(n) ** 2;
          let r = 2;
          for (;; r++) {
            if (mdc(r, n) !== 1) continue;
            let k = 1, v = n % r;
            while (v !== 1 && k <= L) { v = (v * n) % r; k++; }
            if (k > L) break;
          }
          // 3) fator pequeno?
          for (let a = 2; a <= Math.min(r, n - 1); a++) {
            const g = mdc(a, n);
            if (g > 1 && g < n) return false;
          }
          // 4)
          if (n <= r) return true;
          // 5) (x + a)^n ≡ x^n + a  (mod x^r − 1, n)
          let phi = 0;
          for (let k = 1; k < r; k++) if (mdc(k, r) === 1) phi++;
          for (let a = 1; a <= Math.floor(Math.sqrt(phi) * Math.log2(n)); a++) {
            const base = new Array(r).fill(0);
            base[0] = a % n;
            base[1] = 1;
            const esperado = new Array(r).fill(0);
            esperado[n % r] = 1;
            esperado[0] = (esperado[0] + a) % n;
            if (potenciaPoli(base, n, r, n).some((c, i) => c !== esperado[i])) return false;
          }
          return true;
        }

        console.log(Array.from({ length: 58 }, (_, i) => i + 2).filter(aks).join(", "));
        // 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class AKS {
            static long mdc(long a, long b) { return b == 0 ? a : mdc(b, a % b); }

            static long[] multPoli(long[] p, long[] q, int r, long n) { // módulo (x^r − 1, n)
                long[] res = new long[r];
                for (int i = 0; i < r; i++) if (p[i] != 0)
                    for (int j = 0; j < r; j++) if (q[j] != 0) res[(i + j) % r] = (res[(i + j) % r] + p[i] * q[j]) % n;
                return res;
            }

            static long[] potenciaPoli(long[] base, long e, int r, long n) {
                long[] res = new long[r];
                res[0] = 1;
                for (; e > 0; e >>= 1) {
                    if ((e & 1) == 1) res = multPoli(res, base, r, n);
                    base = multPoli(base, base, r, n);
                }
                return res;
            }

            static boolean aks(long n) {
                if (n < 2) return false;
                // 1) potência perfeita?
                for (int b = 2; (1L << b) <= n; b++) {
                    long a = Math.round(Math.pow(n, 1.0 / b));
                    for (long c = a - 1; c <= a + 1; c++) if (c > 1 && Math.round(Math.pow(c, b)) == n) return false;
                }
                // 2) menor r com ordem de n módulo r maior que log²(n)
                double L = Math.pow(Math.log(n) / Math.log(2), 2);
                int r = 2;
                for (;; r++) {
                    if (mdc(r, n) != 1) continue;
                    long k = 1, v = n % r;
                    while (v != 1 && k <= L) { v = v * n % r; k++; }
                    if (k > L) break;
                }
                // 3) fator pequeno?
                for (long a = 2; a <= Math.min(r, n - 1); a++) {
                    long g = mdc(a, n);
                    if (g > 1 && g < n) return false;
                }
                // 4)
                if (n <= r) return true;
                // 5) (x + a)^n ≡ x^n + a  (mod x^r − 1, n)
                int phi = 0;
                for (int k = 1; k < r; k++) if (mdc(k, r) == 1) phi++;
                long limite = (long) Math.floor(Math.sqrt(phi) * Math.log(n) / Math.log(2));
                for (long a = 1; a <= limite; a++) {
                    long[] base = new long[r];
                    base[0] = a % n;
                    base[1] = 1;
                    long[] esperado = new long[r];
                    esperado[(int) (n % r)] = 1;
                    esperado[0] = (esperado[0] + a) % n;
                    long[] res = potenciaPoli(base, n, r, n);
                    for (int i = 0; i < r; i++) if (res[i] != esperado[i]) return false;
                }
                return true;
            }

            public static void main(String[] args) {
                List<Integer> primos = new ArrayList<>();
                for (int k = 2; k < 60; k++) if (aks(k)) primos.add(k);
                System.out.println(primos);
                // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <iostream>
        #include <vector>
        using namespace std;

        using Poli = vector<long long>;
        long long mdc(long long a, long long b) { return b == 0 ? a : mdc(b, a % b); }

        Poli multPoli(const Poli& p, const Poli& q, int r, long long n) { // módulo (x^r − 1, n)
            Poli res(r, 0);
            for (int i = 0; i < r; i++) if (p[i])
                for (int j = 0; j < r; j++) if (q[j]) res[(i + j) % r] = (res[(i + j) % r] + p[i] * q[j]) % n;
            return res;
        }

        Poli potenciaPoli(Poli base, long long e, int r, long long n) {
            Poli res(r, 0);
            res[0] = 1;
            for (; e > 0; e >>= 1) {
                if (e & 1) res = multPoli(res, base, r, n);
                base = multPoli(base, base, r, n);
            }
            return res;
        }

        bool aks(long long n) {
            if (n < 2) return false;
            // 1) potência perfeita?
            for (int b = 2; (1LL << b) <= n; b++) {
                long long a = llround(pow((double)n, 1.0 / b));
                for (long long c = a - 1; c <= a + 1; c++) if (c > 1 && llround(pow((double)c, b)) == n) return false;
            }
            // 2) menor r com ordem de n módulo r maior que log²(n)
            double L = pow(log2((double)n), 2);
            int r = 2;
            for (;; r++) {
                if (mdc(r, n) != 1) continue;
                long long k = 1, v = n % r;
                while (v != 1 && k <= L) { v = v * n % r; k++; }
                if (k > L) break;
            }
            // 3) fator pequeno?
            for (long long a = 2; a <= min<long long>(r, n - 1); a++) {
                long long g = mdc(a, n);
                if (g > 1 && g < n) return false;
            }
            // 4)
            if (n <= r) return true;
            // 5) (x + a)^n ≡ x^n + a  (mod x^r − 1, n)
            int phi = 0;
            for (int k = 1; k < r; k++) if (mdc(k, r) == 1) phi++;
            long long limite = (long long)floor(sqrt((double)phi) * log2((double)n));
            for (long long a = 1; a <= limite; a++) {
                Poli base(r, 0), esperado(r, 0);
                base[0] = a % n;
                base[1] = 1;
                esperado[n % r] = 1;
                esperado[0] = (esperado[0] + a) % n;
                if (potenciaPoli(base, n, r, n) != esperado) return false;
            }
            return true;
        }

        int main() {
            for (int k = 2; k < 60; k++) if (aks(k)) cout << k << " ";
            // 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59
        }
      `,
    },
  },
  {
    id: 'number-field-sieve',
    name: 'Crivo do Corpo Numérico (SNFS e GNFS)',
    difficulty: 'Avançado',
    en: { name: 'Number Field Sieve (SNFS and GNFS)', summary: 'The fastest known method for factoring huge numbers — the one that sets the size of RSA keys.' },
    facts: { 'Proposto por': 'John Pollard (SNFS)', 'Ano': '1988; 1990s (GNFS)', 'Recorde': 'RSA-250, 829 bits (2020)', 'Versão mostrada': 'Passo final (congruência de quadrados)' },
    summary: 'O método mais rápido conhecido para fatorar números enormes — o que define o tamanho das chaves RSA.',
    description:
      'O Crivo do Corpo Numérico (NFS) é o algoritmo mais rápido conhecido para fatorar números com mais de ~100 dígitos. Como o crivo quadrático, ele busca uma congruência de quadrados x² ≡ y² (mod n), mas trabalha ao mesmo tempo nos inteiros e em um corpo numérico algébrico (números da forma a + bθ, em que θ é raiz de um polinômio escolhido). Isso permite procurar relações suaves entre números muito menores, o que reduz drasticamente o custo. A versão especial (SNFS) vale para números de formas particulares, como rᵉ ± s; a geral (GNFS) funciona para qualquer número. Uma implementação completa tem dezenas de milhares de linhas; o código abaixo mostra o passo final que todos os crivos compartilham.',
    complexity: { best: 'exp((64/9)^⅓ (ln n)^⅓ (ln ln n)^⅔)', average: 'exp((64/9)^⅓ (ln n)^⅓ (ln ln n)^⅔)', worst: 'exp((64/9)^⅓ (ln n)^⅓ (ln ln n)^⅔)', space: 'Matrizes esparsas enormes' },
    steps: [
      'Seleção de polinômio: escolha f(x) com raiz m módulo n (no SNFS, f vem da forma especial de n).',
      'Crivo: encontre pares (a, b) tais que a − bm e o valor algébrico correspondente sejam ambos suaves.',
      'Álgebra linear: com milhões de relações, resolva um sistema enorme módulo 2 (algoritmos de Lanczos ou Wiedemann em blocos) para achar produtos que sejam quadrados nos dois lados.',
      'Raiz quadrada: calcule a raiz quadrada no lado inteiro e no corpo numérico, obtendo x e y com x² ≡ y² (mod n).',
      'Calcule mdc(x − y, n) para obter um fator — o passo mostrado no código.',
    ],
    usedIn: ['CADO-NFS e msieve/GGNFS', 'Recordes de fatoração (desafios RSA)', 'Definição do tamanho de chaves RSA', 'Ataques ao logaritmo discreto em corpos finitos'],
    realWorld: [
      { title: 'Por que chaves RSA têm 2048 bits', text: 'O custo do NFS é a referência usada por agências como o NIST para recomendar tamanhos de chave: estima-se que RSA de 2048 bits ofereça segurança equivalente a 112 bits contra o melhor ataque conhecido — o GNFS.' },
      { title: 'Recorde RSA-250', text: 'Em 2020, uma equipe fatorou o RSA-250 (250 dígitos, 829 bits) com o software CADO-NFS, usando o equivalente a cerca de 2.700 anos de um núcleo de processador.' },
      { title: 'Logjam', text: 'Uma variante do NFS para logaritmos discretos permitiu, em 2015, o ataque Logjam contra conexões TLS que usavam parâmetros Diffie-Hellman de 512 bits — e levou navegadores a abandonarem esses parâmetros.' },
    ],
    curiosities: [
      'John Pollard propôs a ideia em 1988 para números de forma especial; em 1990, o SNFS fatorou o nono número de Fermat, F9 = 2⁵¹² + 1, com 155 dígitos. A versão geral foi desenvolvida nos anos seguintes por Buhler, Lenstra, Pomerance e outros.',
      'O "corpo numérico" do nome é uma extensão dos números racionais com uma raiz de polinômio — como ℚ(√2), formado pelos números a + b√2.',
      'Um computador quântico grande o suficiente tornaria o NFS obsoleto: o algoritmo de Shor fatora em tempo polinomial. Por isso já existem padrões de criptografia "pós-quântica".',
    ],
    code: {
      python: String.raw`
        from math import gcd

        # Passo final de todos os "crivos" (Dixon, crivo quadrático, NFS):
        # com x² ≡ y² (mod n) e x ≢ ±y, mdc(x − y, n) é um fator não trivial.
        # Para números grandes de verdade, use ferramentas como CADO-NFS ou msieve.

        def fator_por_quadrados(x, y, n):
            assert (x * x - y * y) % n == 0, "x² e y² precisam ser congruentes módulo n"
            return gcd(x - y, n)

        n = 1649
        # relações suaves: 41² ≡ 32 e 43² ≡ 200 (mod 1649); 32 · 200 = 6400 = 80²
        x = 41 * 43 % n  # 114
        y = 80
        d = fator_por_quadrados(x, y, n)
        print(d, n // d)  # 17 97
      `,
      javascript: String.raw`
        const mdc = (a, b) => (b === 0 ? Math.abs(a) : mdc(b, a % b));

        // Passo final de todos os "crivos" (Dixon, crivo quadrático, NFS):
        // com x² ≡ y² (mod n) e x ≢ ±y, mdc(x − y, n) é um fator não trivial.
        // Para números grandes de verdade, use ferramentas como CADO-NFS ou msieve.
        function fatorPorQuadrados(x, y, n) {
          if ((x * x - y * y) % n !== 0) throw new Error("x² e y² precisam ser congruentes módulo n");
          return mdc(x - y, n);
        }

        const n = 1649;
        // relações suaves: 41² ≡ 32 e 43² ≡ 200 (mod 1649); 32 · 200 = 6400 = 80²
        const x = (41 * 43) % n; // 114
        const y = 80;
        const d = fatorPorQuadrados(x, y, n);
        console.log(d, n / d); // 17 97
      `,
      java: String.raw`
        public class CongruenciaQuadrados {
            static long mdc(long a, long b) { return b == 0 ? Math.abs(a) : mdc(b, a % b); }

            // Passo final de todos os "crivos" (Dixon, crivo quadrático, NFS):
            // com x² ≡ y² (mod n) e x ≢ ±y, mdc(x − y, n) é um fator não trivial.
            // Para números grandes de verdade, use ferramentas como CADO-NFS ou msieve.
            static long fatorPorQuadrados(long x, long y, long n) {
                if ((x * x - y * y) % n != 0) throw new IllegalArgumentException("x² e y² precisam ser congruentes módulo n");
                return mdc(x - y, n);
            }

            public static void main(String[] args) {
                long n = 1649;
                // relações suaves: 41² ≡ 32 e 43² ≡ 200 (mod 1649); 32 · 200 = 6400 = 80²
                long x = 41 * 43 % n; // 114
                long y = 80;
                long d = fatorPorQuadrados(x, y, n);
                System.out.println(d + " " + n / d); // 17 97
            }
        }
      `,
      cpp: String.raw`
        #include <cstdlib>
        #include <iostream>
        #include <stdexcept>
        using namespace std;

        long long mdc(long long a, long long b) { return b == 0 ? llabs(a) : mdc(b, a % b); }

        // Passo final de todos os "crivos" (Dixon, crivo quadrático, NFS):
        // com x² ≡ y² (mod n) e x ≢ ±y, mdc(x − y, n) é um fator não trivial.
        // Para números grandes de verdade, use ferramentas como CADO-NFS ou msieve.
        long long fatorPorQuadrados(long long x, long long y, long long n) {
            if ((x * x - y * y) % n != 0) throw invalid_argument("x² e y² precisam ser congruentes módulo n");
            return mdc(x - y, n);
        }

        int main() {
            long long n = 1649;
            // relações suaves: 41² ≡ 32 e 43² ≡ 200 (mod 1649); 32 · 200 = 6400 = 80²
            long long x = 41 * 43 % n; // 114
            long long y = 80;
            long long d = fatorPorQuadrados(x, y, n);
            cout << d << " " << n / d << "\n"; // 17 97
        }
      `,
    },
  },
]
