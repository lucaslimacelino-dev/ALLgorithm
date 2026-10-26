export default [
  {
    id: 'moving-average',
    name: 'Média Móvel (Filtro FIR)',
    difficulty: 'Iniciante',
    en: { name: 'Moving Average (FIR Filter)', summary: 'Smooths a signal by averaging the last few samples — the simplest low-pass filter, computed in O(1) per sample with a running sum.' },
    facts: { 'Tipo': 'Filtro passa-baixas FIR', 'Truque': 'Soma deslizante: O(1) por amostra', 'Atraso': '(w − 1)/2 amostras', 'Variante': 'Média móvel exponencial (IIR)' },
    summary: 'Suaviza um sinal tirando a média das últimas amostras — o filtro passa-baixas mais simples, calculado em O(1) por amostra com uma soma deslizante.',
    description:
      'A média móvel substitui cada amostra pela média das w amostras mais recentes. Variações rápidas (ruído, oscilações de alta frequência) se cancelam na média, enquanto tendências lentas permanecem: é um filtro passa-baixas. Em processamento de sinais, ela é o exemplo mais simples de filtro FIR (resposta finita ao impulso), em que a saída é uma combinação ponderada das últimas entradas — aqui, todos os pesos valem 1/w. Calcular cada média do zero custaria O(w) por amostra; com uma soma deslizante, basta somar a amostra que entra e subtrair a que sai da janela: O(1), qualquer que seja o tamanho da janela. O preço da suavização é o atraso: a saída fica (w − 1)/2 amostras atrás do sinal, e picos são achatados.',
    complexity: { best: 'O(n)', average: 'O(n) — O(1) por amostra', worst: 'O(n)', space: 'O(w)' },
    steps: [
      'Escolha o tamanho da janela w.',
      'Mantenha a soma das últimas w amostras.',
      'A cada nova amostra, some-a à soma e subtraia a amostra que saiu da janela.',
      'A saída é a soma dividida por w.',
      'Janelas maiores suavizam mais, mas atrasam e achatam o sinal.',
    ],
    usedIn: ['Análise técnica de ações (médias de 50 e 200 dias)', 'Leituras de sensores e microcontroladores', 'Séries temporais e indicadores de negócio', 'Processamento de áudio e de imagens (filtro de caixa)', 'Monitoramento de servidores e métricas'],
    realWorld: [
      { title: 'Mercado financeiro', text: 'As médias móveis de 50 e de 200 dias são indicadores clássicos da análise técnica; quando a curta cruza a longa, operadores falam em "cruz dourada" ou "cruz da morte".' },
      { title: 'Sensores', text: 'Leituras de temperatura, acelerômetros e potenciômetros em microcontroladores costumam passar por uma média móvel para eliminar a oscilação do último dígito.' },
      { title: 'Desfoque de imagens', text: 'Em duas dimensões, a média móvel vira o "box blur"; aplicado três vezes, ele se aproxima de um desfoque gaussiano — um truque usado em interfaces e jogos por ser muito rápido.' },
    ],
    curiosities: [
      'A média móvel exponencial (y ← α·x + (1 − α)·y) dá mais peso às amostras recentes e precisa guardar só um número — ela é um filtro IIR (resposta infinita ao impulso).',
      'Em frequência, a média móvel tem uma resposta em forma de "sinc": ela elimina completamente as frequências cujo período cabe um número inteiro de vezes na janela.',
      'Com números de ponto flutuante, a soma deslizante acumula erros de arredondamento ao longo de milhões de amostras; implementações robustas a recalculam do zero de tempos em tempos.',
    ],
    code: {
      python: String.raw`
        def media_movel(x, w):
            saida, soma = [], 0.0
            for i, v in enumerate(x):
                soma += v                  # entra a amostra nova
                if i >= w:
                    soma -= x[i - w]       # sai a que deixou a janela
                if i >= w - 1:
                    saida.append(soma / w)
            return saida

        dados = [1, 2, 6, 4, 8, 10, 9, 3, 2, 5]
        print(" ".join(f"{v:.2f}" for v in media_movel(dados, 3)))
        # 3.00 4.00 6.00 7.33 9.00 7.33 4.67 3.33
      `,
      javascript: String.raw`
        function mediaMovel(x, w) {
          const saida = [];
          let soma = 0;
          x.forEach((v, i) => {
            soma += v;                       // entra a amostra nova
            if (i >= w) soma -= x[i - w];    // sai a que deixou a janela
            if (i >= w - 1) saida.push(soma / w);
          });
          return saida;
        }

        const dados = [1, 2, 6, 4, 8, 10, 9, 3, 2, 5];
        console.log(mediaMovel(dados, 3).map(v => v.toFixed(2)).join(" "));
        // 3.00 4.00 6.00 7.33 9.00 7.33 4.67 3.33
      `,
      java: String.raw`
        import java.util.Locale;

        public class MediaMovel {
            static double[] mediaMovel(double[] x, int w) {
                double[] saida = new double[x.length - w + 1];
                double soma = 0;
                for (int i = 0; i < x.length; i++) {
                    soma += x[i];                  // entra a amostra nova
                    if (i >= w) soma -= x[i - w];  // sai a que deixou a janela
                    if (i >= w - 1) saida[i - w + 1] = soma / w;
                }
                return saida;
            }

            public static void main(String[] args) {
                double[] dados = {1, 2, 6, 4, 8, 10, 9, 3, 2, 5};
                StringBuilder sb = new StringBuilder();
                for (double v : mediaMovel(dados, 3)) sb.append(String.format(Locale.ROOT, "%.2f ", v));
                System.out.println(sb.toString().trim());
                // 3.00 4.00 6.00 7.33 9.00 7.33 4.67 3.33
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <vector>
        using namespace std;

        vector<double> mediaMovel(const vector<double>& x, int w) {
            vector<double> saida;
            double soma = 0;
            for (int i = 0; i < (int)x.size(); i++) {
                soma += x[i];                  // entra a amostra nova
                if (i >= w) soma -= x[i - w];  // sai a que deixou a janela
                if (i >= w - 1) saida.push_back(soma / w);
            }
            return saida;
        }

        int main() {
            vector<double> dados = {1, 2, 6, 4, 8, 10, 9, 3, 2, 5};
            for (double v : mediaMovel(dados, 3)) printf("%.2f ", v);
            printf("\n"); // 3.00 4.00 6.00 7.33 9.00 7.33 4.67 3.33
        }
      `,
    },
  },
  {
    id: 'dft',
    name: 'Transformada Discreta de Fourier (DFT)',
    difficulty: 'Intermediário',
    en: { name: 'Discrete Fourier Transform (DFT)', summary: 'Decomposes a sampled signal into its frequencies by comparing it with a wave of each frequency — O(N²), the definition the FFT accelerates.' },
    facts: { 'Base': 'Série de Fourier (Joseph Fourier, 1807)', 'Fórmula': 'Xₖ = Σ xₙ · e^(−2πikn/N)', 'Custo': 'O(N²)', 'Versão rápida': 'FFT, O(N log N)' },
    summary: 'Decompõe um sinal amostrado em frequências, comparando-o com uma onda de cada frequência — O(N²), a definição que a FFT acelera.',
    description:
      'Joseph Fourier mostrou que qualquer sinal periódico pode ser escrito como uma soma de senos e cossenos. A Transformada Discreta de Fourier faz isso para N amostras: para cada frequência k (de 0 a N − 1), calcula Xₖ = Σ xₙ · e^(−2πikn/N). Cada termo multiplica o sinal por uma onda que dá k voltas ao longo das N amostras; se o sinal contém essa frequência, os produtos se somam e Xₖ fica grande; se não contém, eles se cancelam. O módulo |Xₖ| diz a amplitude daquela frequência, e o ângulo de Xₖ, a fase. Calcular os N coeficientes diretamente custa N² multiplicações — o que motivou a FFT, que obtém exatamente o mesmo resultado em O(N log N).',
    complexity: { best: 'O(N²)', average: 'O(N²)', worst: 'O(N²)', space: 'O(N)' },
    steps: [
      'Para cada frequência k de 0 a N − 1:',
      'Some, para cada amostra n, xₙ · cos(2πkn/N) (parte real) e −xₙ · sen(2πkn/N) (parte imaginária).',
      'O módulo |Xₖ| mede a presença da frequência k; para sinais reais, divida por N (e multiplique por 2, exceto em k = 0) para obter a amplitude.',
      'Para sinais reais, o espectro é simétrico: basta olhar até k = N/2 (a frequência de Nyquist).',
      'A transformada inversa (com o sinal do expoente trocado e divisão por N) reconstrói o sinal.',
    ],
    usedIn: ['Analisadores de espectro e afinadores', 'Compressão de áudio e imagem (MP3 e JPEG usam transformadas parentes)', 'Telecomunicações (OFDM no Wi-Fi e no 4G/5G)', 'Análise de vibrações em máquinas', 'Ensino de processamento de sinais'],
    realWorld: [
      { title: 'Afinadores e equalizadores', text: 'Um afinador de violão encontra a frequência dominante da nota tocada; um equalizador gráfico mostra a energia em cada faixa — ambos olham para o espectro calculado por transformadas de Fourier.' },
      { title: 'Goertzel', text: 'Quando só interessam algumas frequências — como os tons das teclas de um telefone (DTMF) —, o algoritmo de Goertzel calcula apenas aqueles coeficientes da DFT, com custo O(N) cada.' },
      { title: 'JPEG', text: 'O JPEG usa a transformada discreta do cosseno (DCT), uma parente real da DFT, em blocos de 8 × 8 pixels: a maior parte da energia fica em poucas frequências baixas, e as altas podem ser descartadas.' },
    ],
    curiosities: [
      'Fourier apresentou suas ideias em 1807 em um estudo sobre a propagação do calor. Lagrange e Laplace receberam o trabalho com desconfiança, e ele só foi publicado em 1822.',
      'O ouvido humano faz algo parecido com uma análise de Fourier: a cóclea tem regiões que vibram com frequências diferentes.',
      'Pelo teorema de Nyquist-Shannon, para capturar frequências até f é preciso amostrar a mais de 2f por segundo — por isso o áudio de CD usa 44,1 kHz para cobrir até cerca de 20 kHz.',
    ],
    code: {
      python: String.raw`
        import cmath

        def dft(x):
            N = len(x)
            return [sum(x[n] * cmath.exp(-2j * cmath.pi * k * n / N) for n in range(N)) for k in range(N)]

        X = dft([1, 1, 1, 1, 0, 0, 0, 0])
        print(" ".join(f"{abs(v):.3f}" for v in X))
        # 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613
      `,
      javascript: String.raw`
        function dft(x) {
          const N = x.length;
          return x.map((_, k) => {
            let re = 0, im = 0;
            for (let n = 0; n < N; n++) {
              re += x[n] * Math.cos((2 * Math.PI * k * n) / N);
              im -= x[n] * Math.sin((2 * Math.PI * k * n) / N);
            }
            return [re, im];
          });
        }

        const X = dft([1, 1, 1, 1, 0, 0, 0, 0]);
        console.log(X.map(([re, im]) => Math.hypot(re, im).toFixed(3)).join(" "));
        // 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613
      `,
      java: String.raw`
        import java.util.Locale;

        public class DFT {
            public static void main(String[] args) {
                double[] x = {1, 1, 1, 1, 0, 0, 0, 0};
                int N = x.length;
                StringBuilder sb = new StringBuilder();
                for (int k = 0; k < N; k++) {
                    double re = 0, im = 0;
                    for (int n = 0; n < N; n++) {
                        re += x[n] * Math.cos(2 * Math.PI * k * n / N);
                        im -= x[n] * Math.sin(2 * Math.PI * k * n / N);
                    }
                    sb.append(String.format(Locale.ROOT, "%.3f ", Math.hypot(re, im)));
                }
                System.out.println(sb.toString().trim());
                // 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <complex>
        #include <cstdio>
        #include <vector>
        using namespace std;

        vector<complex<double>> dft(const vector<double>& x) {
            int N = x.size();
            vector<complex<double>> X(N);
            for (int k = 0; k < N; k++)
                for (int n = 0; n < N; n++) X[k] += x[n] * polar(1.0, -2 * M_PI * k * n / N);
            return X;
        }

        int main() {
            for (auto v : dft({1, 1, 1, 1, 0, 0, 0, 0})) printf("%.3f ", abs(v));
            printf("\n"); // 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613
        }
      `,
    },
  },
  {
    id: 'cordic',
    name: 'CORDIC',
    difficulty: 'Intermediário',
    en: { name: 'CORDIC', summary: 'Computes sines, cosines and other functions with only additions, bit shifts and a small table — the algorithm inside pocket calculators.' },
    facts: { 'Criado por': 'Jack Volder', 'Ano': '1959', 'Operações': 'Somas, deslocamentos de bits e uma tabela', 'Precisão': '≈ 1 bit por iteração', 'Usado em': 'Calculadoras, FPGAs, o Intel 8087' },
    summary: 'Calcula seno, cosseno e outras funções só com somas, deslocamentos de bits e uma tabela pequena — o algoritmo das calculadoras de bolso.',
    description:
      'O CORDIC (COordinate Rotation DIgital Computer) calcula funções trigonométricas sem multiplicações. A ideia é girar um vetor até o ângulo desejado usando uma sequência fixa de ângulos cada vez menores: arctan(1) = 45°, arctan(1/2) ≈ 26,6°, arctan(1/4) ≈ 14,0°, … Girar por arctan(2⁻ⁱ) exige multiplicar por 2⁻ⁱ, que em binário é só deslocar bits. A cada passo, o algoritmo decide se gira no sentido horário ou anti-horário, conforme ainda falte ou sobre ângulo, e acumula o resto. Cada rotação também estica um pouco o vetor, mas o fator total é uma constante conhecida K ≈ 0,6073, compensada começando com o vetor (K, 0). Depois de n passos, as coordenadas do vetor são o cosseno e o seno do ângulo, com cerca de n bits de precisão.',
    complexity: { best: 'O(n) para n bits', average: 'O(n)', worst: 'O(n)', space: 'O(n) (tabela de ângulos)' },
    steps: [
      'Guarde uma tabela com os ângulos αᵢ = arctan(2⁻ⁱ) e a constante K = Π 1/√(1 + 2⁻²ⁱ).',
      'Comece com x = K, y = 0 e z = ângulo desejado.',
      'Em cada passo i: d = +1 se z ≥ 0, senão −1.',
      'Atualize x ← x − d·y·2⁻ⁱ, y ← y + d·x·2⁻ⁱ (deslocamentos de bits) e z ← z − d·αᵢ.',
      'Depois de n passos, x ≈ cos(ângulo) e y ≈ sen(ângulo).',
    ],
    usedIn: ['Calculadoras científicas (HP-35 e sucessoras)', 'FPGAs e processadores de sinais sem multiplicador', 'Coprocessador matemático Intel 8087', 'Rádio definido por software (osciladores e mixers digitais)', 'Conversão entre coordenadas polares e retangulares'],
    realWorld: [
      { title: 'A primeira calculadora científica de bolso', text: 'A HP-35 (1972) calculava funções trigonométricas, logaritmos e exponenciais com variantes do CORDIC, em um processador simples, sem circuito de multiplicação.' },
      { title: 'Hardware digital', text: 'Em FPGAs e chips de comunicação, blocos CORDIC calculam fases e amplitudes de sinais e giram vetores em tempo real, porque somas e deslocamentos ocupam muito menos área que multiplicadores.' },
      { title: 'Navegação', text: 'Jack Volder criou o CORDIC em 1959 para o computador de navegação do bombardeiro B-58, que precisava de trigonometria rápida em tempo real com a eletrônica da época.' },
    ],
    curiosities: [
      'Com pequenas mudanças, o mesmo esquema calcula arco-tangente, módulo de vetores, logaritmos, exponenciais, raízes quadradas e funções hiperbólicas.',
      'O fator K converge rapidamente para 0,60725293500888…; depois de cerca de 20 iterações, ele praticamente não muda mais.',
      'Henry Briggs usou uma ideia parecida em 1624 para calcular sua tábua de logaritmos — mais de três séculos antes dos computadores.',
    ],
    code: {
      python: String.raw`
        import math

        N = 32
        ANGULOS = [math.atan(2.0 ** -i) for i in range(N)]
        K = 1.0
        for i in range(N):
            K /= math.sqrt(1 + 2.0 ** (-2 * i))     # compensa o alongamento das rotações

        def cordic(theta):                          # theta em radianos, entre −π/2 e π/2
            x, y, z = K, 0.0, theta
            for i in range(N):
                d = 1 if z >= 0 else -1
                x, y = x - d * y * 2.0 ** -i, y + d * x * 2.0 ** -i   # em hardware: deslocamentos de bits
                z -= d * ANGULOS[i]
            return x, y                             # (cos, sen)

        for graus in (30, 60):
            c, s = cordic(math.radians(graus))
            print(f"cos {graus}° = {c:.6f}, sen {graus}° = {s:.6f}")
        # cos 30° = 0.866025, sen 30° = 0.500000
        # cos 60° = 0.500000, sen 60° = 0.866025
      `,
      javascript: String.raw`
        const N = 32;
        const ANGULOS = Array.from({ length: N }, (_, i) => Math.atan(2 ** -i));
        let K = 1;
        for (let i = 0; i < N; i++) K /= Math.sqrt(1 + 2 ** (-2 * i)); // compensa o alongamento das rotações

        function cordic(theta) { // theta em radianos, entre −π/2 e π/2
          let x = K, y = 0, z = theta;
          for (let i = 0; i < N; i++) {
            const d = z >= 0 ? 1 : -1;
            [x, y] = [x - d * y * 2 ** -i, y + d * x * 2 ** -i]; // em hardware: deslocamentos de bits
            z -= d * ANGULOS[i];
          }
          return [x, y]; // (cos, sen)
        }

        for (const graus of [30, 60]) {
          const [c, s] = cordic((graus * Math.PI) / 180);
          console.log("cos " + graus + "° = " + c.toFixed(6) + ", sen " + graus + "° = " + s.toFixed(6));
        }
        // cos 30° = 0.866025, sen 30° = 0.500000
        // cos 60° = 0.500000, sen 60° = 0.866025
      `,
      java: String.raw`
        import java.util.Locale;

        public class Cordic {
            static final int N = 32;
            static final double[] ANGULOS = new double[N];
            static double K = 1;
            static {
                for (int i = 0; i < N; i++) {
                    ANGULOS[i] = Math.atan(Math.pow(2, -i));
                    K /= Math.sqrt(1 + Math.pow(2, -2 * i)); // compensa o alongamento das rotações
                }
            }

            static double[] cordic(double theta) { // theta em radianos, entre −π/2 e π/2
                double x = K, y = 0, z = theta;
                for (int i = 0; i < N; i++) {
                    int d = z >= 0 ? 1 : -1;
                    double p = Math.pow(2, -i);           // em hardware: deslocamento de bits
                    double nx = x - d * y * p, ny = y + d * x * p;
                    x = nx; y = ny;
                    z -= d * ANGULOS[i];
                }
                return new double[]{x, y}; // (cos, sen)
            }

            public static void main(String[] args) {
                for (int graus : new int[]{30, 60}) {
                    double[] cs = cordic(Math.toRadians(graus));
                    System.out.println(String.format(Locale.ROOT, "cos %d° = %.6f, sen %d° = %.6f", graus, cs[0], graus, cs[1]));
                }
                // cos 30° = 0.866025, sen 30° = 0.500000
                // cos 60° = 0.500000, sen 60° = 0.866025
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>

        const int N = 32;
        double ANGULOS[N], K = 1;

        void cordic(double theta, double& c, double& s) { // theta em radianos, entre −π/2 e π/2
            double x = K, y = 0, z = theta;
            for (int i = 0; i < N; i++) {
                int d = z >= 0 ? 1 : -1;
                double p = std::ldexp(1.0, -i);           // 2^−i: em hardware, um deslocamento de bits
                double nx = x - d * y * p, ny = y + d * x * p;
                x = nx; y = ny;
                z -= d * ANGULOS[i];
            }
            c = x; s = y;
        }

        int main() {
            for (int i = 0; i < N; i++) {
                ANGULOS[i] = std::atan(std::ldexp(1.0, -i));
                K /= std::sqrt(1 + std::ldexp(1.0, -2 * i)); // compensa o alongamento das rotações
            }
            for (int graus : {30, 60}) {
                double c, s;
                cordic(graus * M_PI / 180, c, s);
                printf("cos %d° = %.6f, sen %d° = %.6f\n", graus, c, graus, s);
            }
            // cos 30° = 0.866025, sen 30° = 0.500000
            // cos 60° = 0.500000, sen 60° = 0.866025
        }
      `,
    },
  },
  {
    id: 'fft',
    name: 'Transformada Rápida de Fourier (FFT, Cooley-Tukey)',
    difficulty: 'Avançado',
    en: { name: 'Fast Fourier Transform (FFT, Cooley-Tukey)', summary: 'Computes the DFT in O(N log N) by splitting it into even and odd halves recursively — one of the most important algorithms ever.' },
    facts: { 'Criado por': 'James Cooley e John Tukey (redescoberta de Gauss)', 'Ano': '1965 (Gauss, ≈ 1805)', 'Custo': 'O(N log N)', 'Estrutura': 'Dividir e conquistar ("borboletas")', 'Variante mostrada': 'Raiz 2 (N potência de 2)' },
    summary: 'Calcula a DFT em O(N log N) dividindo-a em metades pares e ímpares, recursivamente — um dos algoritmos mais importantes da história.',
    description:
      'A FFT calcula exatamente a mesma transformada que a DFT, mas em vez de N² operações usa cerca de N log N. O algoritmo de Cooley-Tukey (raiz 2) observa que a DFT de N pontos pode ser escrita a partir de duas DFTs de N/2 pontos: uma das amostras de índice par (E) e outra das de índice ímpar (O). Para cada k, Xₖ = Eₖ + Wᵏ·Oₖ e Xₖ₊N/₂ = Eₖ − Wᵏ·Oₖ, com W = e^(−2πi/N) — a mesma multiplicação serve para dois resultados, uma operação chamada "borboleta". Aplicando a ideia recursivamente, chega-se a log₂ N estágios de N/2 borboletas. Na versão iterativa, as amostras são primeiro reordenadas pela inversão dos bits dos índices. Para N = 1 milhão, a FFT é cerca de 50 mil vezes mais rápida que a DFT direta.',
    complexity: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)', space: 'O(N)' },
    steps: [
      'Se N = 1, a DFT é a própria amostra.',
      'Divida as amostras em índices pares e ímpares e calcule a FFT de cada metade (recursivamente).',
      'Para k de 0 a N/2 − 1: t = e^(−2πik/N) · O[k].',
      'Combine: X[k] = E[k] + t e X[k + N/2] = E[k] − t (a "borboleta").',
      'Na versão iterativa: reordene por inversão de bits e faça log₂ N estágios de borboletas, dobrando o tamanho dos blocos a cada estágio.',
    ],
    usedIn: ['Áudio (MP3, AAC, reconhecimento de voz, Shazam)', 'Telecomunicações (OFDM no Wi-Fi, 4G, 5G e TV digital)', 'Imagens médicas (ressonância magnética)', 'Multiplicação de inteiros e polinômios gigantes', 'Simulações científicas e processamento de imagens'],
    realWorld: [
      { title: 'Wi-Fi e 4G/5G', text: 'O OFDM, técnica de transmissão do Wi-Fi, do 4G, do 5G e da TV digital, divide o sinal em centenas de subportadoras; transmissor e receptor fazem uma FFT (e a inversa) a cada símbolo — milhões de vezes por segundo.' },
      { title: 'Ressonância magnética', text: 'O aparelho de ressonância mede o sinal no "espaço de frequências" (espaço k); a imagem que o médico vê é obtida com uma FFT bidimensional.' },
      { title: 'Shazam', text: 'Aplicativos de reconhecimento de música calculam FFTs de pequenos trechos do áudio, extraem os picos do espectrograma e comparam essa "impressão digital" com um banco de milhões de músicas.' },
    ],
    curiosities: [
      'Gauss usou a mesma ideia por volta de 1805 para calcular órbitas de asteroides, mas o manuscrito, em latim, só foi publicado após sua morte e ficou esquecido.',
      'Cooley e Tukey publicaram o algoritmo em 1965, em parte motivados pela detecção de testes nucleares soviéticos por sismógrafos — a análise exigia transformadas de Fourier rápidas.',
      'A FFT está na lista dos "10 melhores algoritmos do século XX" da revista Computing in Science & Engineering; Gilbert Strang a chamou de "o algoritmo numérico mais importante da nossa vida".',
    ],
    code: {
      python: String.raw`
        import cmath

        def fft(x):                         # N precisa ser potência de 2
            N = len(x)
            if N == 1:
                return list(x)
            pares, impares = fft(x[0::2]), fft(x[1::2])
            X = [0] * N
            for k in range(N // 2):
                t = cmath.exp(-2j * cmath.pi * k / N) * impares[k]
                X[k] = pares[k] + t           # borboleta
                X[k + N // 2] = pares[k] - t
            return X

        X = fft([1, 1, 1, 1, 0, 0, 0, 0])
        print(" ".join(f"{abs(v):.3f}" for v in X))
        # 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613 (o mesmo que a DFT)
      `,
      javascript: String.raw`
        function fft(x) { // x: lista de [re, im]; N precisa ser potência de 2
          const N = x.length;
          if (N === 1) return [x[0]];
          const pares = fft(x.filter((_, i) => i % 2 === 0)), impares = fft(x.filter((_, i) => i % 2 === 1));
          const X = Array(N);
          for (let k = 0; k < N / 2; k++) {
            const ang = (-2 * Math.PI * k) / N, [ore, oim] = impares[k];
            const t = [Math.cos(ang) * ore - Math.sin(ang) * oim, Math.cos(ang) * oim + Math.sin(ang) * ore];
            X[k] = [pares[k][0] + t[0], pares[k][1] + t[1]];         // borboleta
            X[k + N / 2] = [pares[k][0] - t[0], pares[k][1] - t[1]];
          }
          return X;
        }

        const X = fft([1, 1, 1, 1, 0, 0, 0, 0].map(v => [v, 0]));
        console.log(X.map(([re, im]) => Math.hypot(re, im).toFixed(3)).join(" "));
        // 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613 (o mesmo que a DFT)
      `,
      java: String.raw`
        import java.util.Locale;

        public class FFT {
            // re e im: partes real e imaginária; N precisa ser potência de 2
            static double[][] fft(double[] re, double[] im) {
                int N = re.length;
                if (N == 1) return new double[][]{{re[0]}, {im[0]}};
                double[] pr = new double[N / 2], pi = new double[N / 2], ir = new double[N / 2], ii = new double[N / 2];
                for (int i = 0; i < N / 2; i++) { pr[i] = re[2 * i]; pi[i] = im[2 * i]; ir[i] = re[2 * i + 1]; ii[i] = im[2 * i + 1]; }
                double[][] E = fft(pr, pi), O = fft(ir, ii);
                double[] Xr = new double[N], Xi = new double[N];
                for (int k = 0; k < N / 2; k++) {
                    double ang = -2 * Math.PI * k / N, c = Math.cos(ang), s = Math.sin(ang);
                    double tr = c * O[0][k] - s * O[1][k], ti = c * O[1][k] + s * O[0][k];
                    Xr[k] = E[0][k] + tr; Xi[k] = E[1][k] + ti;               // borboleta
                    Xr[k + N / 2] = E[0][k] - tr; Xi[k + N / 2] = E[1][k] - ti;
                }
                return new double[][]{Xr, Xi};
            }

            public static void main(String[] args) {
                double[][] X = fft(new double[]{1, 1, 1, 1, 0, 0, 0, 0}, new double[8]);
                StringBuilder sb = new StringBuilder();
                for (int k = 0; k < 8; k++) sb.append(String.format(Locale.ROOT, "%.3f ", Math.hypot(X[0][k], X[1][k])));
                System.out.println(sb.toString().trim());
                // 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613 (o mesmo que a DFT)
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <complex>
        #include <cstdio>
        #include <vector>
        using namespace std;

        using C = complex<double>;

        vector<C> fft(const vector<C>& x) { // N precisa ser potência de 2
            size_t N = x.size();
            if (N == 1) return x;
            vector<C> pares, impares;
            for (size_t i = 0; i < N; i++) (i % 2 ? impares : pares).push_back(x[i]);
            vector<C> E = fft(pares), O = fft(impares), X(N);
            for (size_t k = 0; k < N / 2; k++) {
                C t = polar(1.0, -2 * M_PI * k / N) * O[k];
                X[k] = E[k] + t;          // borboleta
                X[k + N / 2] = E[k] - t;
            }
            return X;
        }

        int main() {
            for (C v : fft({1, 1, 1, 1, 0, 0, 0, 0})) printf("%.3f ", abs(v));
            printf("\n"); // 4.000 2.613 0.000 1.082 0.000 1.082 0.000 2.613 (o mesmo que a DFT)
        }
      `,
    },
  },
  {
    id: 'rainflow',
    name: 'Contagem Rainflow',
    difficulty: 'Avançado',
    en: { name: 'Rainflow Counting', summary: 'Breaks an irregular stress history into simple load cycles so engineers can estimate metal fatigue.' },
    facts: { 'Criado por': 'Tatsuo Endo e M. Matsuishi', 'Ano': '1968', 'Padrão': 'ASTM E1049', 'Usado com': 'Regra de Miner e curvas S-N', 'Área': 'Engenharia de fadiga' },
    summary: 'Decompõe um histórico irregular de tensões em ciclos simples de carga, para que engenheiros estimem a fadiga de metais.',
    description:
      'Peças de metal não quebram só por uma carga grande: cargas repetidas, mesmo moderadas, abrem e propagam trincas — é a fadiga. Os ensaios de laboratório medem quantos ciclos regulares (de uma certa amplitude) uma peça aguenta, mas as cargas reais são irregulares: uma ponte vibra com o vento e o tráfego, uma asa com as rajadas. A contagem rainflow transforma um histórico irregular em uma lista de ciclos equivalentes. O nome vem da imagem original: girando o gráfico de tensões, os picos parecem telhados de um pagode, e a contagem imita a chuva escorrendo por eles. A versão padronizada (ASTM E1049) usa uma pilha: lê os picos e vales em ordem e, sempre que a faixa mais recente é maior ou igual à anterior, conta um ciclo com a amplitude da faixa anterior. O que sobrar na pilha vira meios ciclos. Com os ciclos, a regra de Miner soma o dano de cada um.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    steps: [
      'Reduza o histórico aos picos e vales (pontos de reversão).',
      'Leia os pontos em ordem, empilhando cada um.',
      'Com pelo menos 3 pontos na pilha, compare a faixa mais recente X com a anterior Y. Se X < Y, leia o próximo ponto.',
      'Se X ≥ Y: se Y inclui o primeiro ponto da pilha, conte meio ciclo de amplitude Y e descarte o primeiro ponto; senão, conte um ciclo completo de amplitude Y e remova os dois pontos de Y. Repita a comparação.',
      'No fim, cada faixa restante na pilha conta como meio ciclo.',
    ],
    usedIn: ['Projeto aeronáutico (vida em fadiga de estruturas)', 'Engenharia automotiva (suspensões, chassis)', 'Turbinas eólicas e estruturas offshore', 'Pontes e estruturas metálicas', 'Estimativa de vida de baterias (ciclos de carga)'],
    realWorld: [
      { title: 'Aviões', text: 'Fabricantes registram as cargas de voo de aeronaves de teste e usam a contagem rainflow para calcular a vida em fadiga de asas e fuselagem — e definir quando inspecionar cada peça.' },
      { title: 'Turbinas eólicas', text: 'As pás e a torre de uma turbina sofrem milhões de ciclos irregulares ao longo de 20 anos. Normas de certificação exigem análises de fadiga com rainflow sobre simulações de vento.' },
      { title: 'Baterias', text: 'Modelos de envelhecimento de baterias aplicam a contagem rainflow ao histórico de carga e descarga para estimar quanto da vida útil cada ciclo parcial consumiu.' },
    ],
    curiosities: [
      'Endo e Matsuishi apresentaram o método em 1968 no Japão; a analogia com a chuva escorrendo de telhados de pagodes deu nome ao algoritmo.',
      'O exemplo do padrão ASTM E1049 (−2, 1, −3, 5, −1, 3, −4, 4, −2) dá: 0,5 ciclo de amplitude 3, 1,5 de 4, 0,5 de 6, 1 de 8 e 0,5 de 9 — exatamente o que o código desta página calcula.',
      'A regra de Palmgren-Miner (1924/1945) diz que a peça falha quando a soma, sobre todos os ciclos, de (ciclos aplicados / ciclos suportados naquela amplitude) chega a 1.',
    ],
    code: {
      python: String.raw`
        def rainflow(pontos):                      # pontos: picos e vales em ordem
            pilha, ciclos = [], []
            for p in pontos:
                pilha.append(p)
                while len(pilha) >= 3:
                    X = abs(pilha[-1] - pilha[-2])
                    Y = abs(pilha[-2] - pilha[-3])
                    if X < Y:
                        break
                    if len(pilha) == 3:            # Y contém o ponto inicial: meio ciclo
                        ciclos.append((Y, 0.5))
                        pilha.pop(0)
                    else:                          # ciclo completo
                        ciclos.append((Y, 1.0))
                        pilha.pop(-2)              # remove os dois pontos da faixa Y
                        pilha.pop(-2)
            ciclos += [(abs(b - a), 0.5) for a, b in zip(pilha, pilha[1:])]   # o que sobrou: meios ciclos
            return ciclos

        contagem = {}
        for amplitude, n in rainflow([-2, 1, -3, 5, -1, 3, -4, 4, -2]):
            contagem[amplitude] = contagem.get(amplitude, 0) + n
        for amplitude in sorted(contagem):
            print(amplitude, contagem[amplitude])
        # 3 0.5
        # 4 1.5
        # 6 0.5
        # 8 1.0
        # 9 0.5
      `,
      javascript: String.raw`
        function rainflow(pontos) { // pontos: picos e vales em ordem
          const pilha = [], ciclos = [];
          for (const p of pontos) {
            pilha.push(p);
            while (pilha.length >= 3) {
              const n = pilha.length;
              const X = Math.abs(pilha[n - 1] - pilha[n - 2]), Y = Math.abs(pilha[n - 2] - pilha[n - 3]);
              if (X < Y) break;
              if (n === 3) { ciclos.push([Y, 0.5]); pilha.shift(); } // Y contém o ponto inicial: meio ciclo
              else { ciclos.push([Y, 1]); pilha.splice(n - 3, 2); }  // ciclo completo
            }
          }
          for (let i = 0; i + 1 < pilha.length; i++) ciclos.push([Math.abs(pilha[i + 1] - pilha[i]), 0.5]); // meios ciclos
          return ciclos;
        }

        const contagem = new Map();
        for (const [amplitude, n] of rainflow([-2, 1, -3, 5, -1, 3, -4, 4, -2])) contagem.set(amplitude, (contagem.get(amplitude) ?? 0) + n);
        for (const amplitude of [...contagem.keys()].sort((a, b) => a - b)) console.log(amplitude + " " + contagem.get(amplitude).toFixed(1));
        // 3 0.5
        // 4 1.5
        // 6 0.5
        // 8 1.0
        // 9 0.5
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Map;
        import java.util.TreeMap;

        public class Rainflow {
            static Map<Integer, Double> rainflow(int[] pontos) { // picos e vales em ordem
                List<Integer> pilha = new ArrayList<>();
                Map<Integer, Double> contagem = new TreeMap<>();
                for (int p : pontos) {
                    pilha.add(p);
                    while (pilha.size() >= 3) {
                        int n = pilha.size();
                        int X = Math.abs(pilha.get(n - 1) - pilha.get(n - 2)), Y = Math.abs(pilha.get(n - 2) - pilha.get(n - 3));
                        if (X < Y) break;
                        if (n == 3) { contagem.merge(Y, 0.5, Double::sum); pilha.remove(0); } // meio ciclo
                        else { contagem.merge(Y, 1.0, Double::sum); pilha.remove(n - 2); pilha.remove(n - 3); } // ciclo completo
                    }
                }
                for (int i = 0; i + 1 < pilha.size(); i++) contagem.merge(Math.abs(pilha.get(i + 1) - pilha.get(i)), 0.5, Double::sum);
                return contagem;
            }

            public static void main(String[] args) {
                rainflow(new int[]{-2, 1, -3, 5, -1, 3, -4, 4, -2}).forEach((amplitude, n) -> System.out.println(amplitude + " " + n));
                // 3 0.5
                // 4 1.5
                // 6 0.5
                // 8 1.0
                // 9 0.5
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <cstdlib>
        #include <map>
        #include <vector>
        using namespace std;

        map<int, double> rainflow(const vector<int>& pontos) { // picos e vales em ordem
            vector<int> pilha;
            map<int, double> contagem;
            for (int p : pontos) {
                pilha.push_back(p);
                while (pilha.size() >= 3) {
                    size_t n = pilha.size();
                    int X = abs(pilha[n - 1] - pilha[n - 2]), Y = abs(pilha[n - 2] - pilha[n - 3]);
                    if (X < Y) break;
                    if (n == 3) { contagem[Y] += 0.5; pilha.erase(pilha.begin()); }                        // meio ciclo
                    else { contagem[Y] += 1.0; pilha.erase(pilha.begin() + n - 3, pilha.begin() + n - 1); } // ciclo completo
                }
            }
            for (size_t i = 0; i + 1 < pilha.size(); i++) contagem[abs(pilha[i + 1] - pilha[i])] += 0.5;
            return contagem;
        }

        int main() {
            for (auto [amplitude, n] : rainflow({-2, 1, -3, 5, -1, 3, -4, 4, -2})) printf("%d %.1f\n", amplitude, n);
            // 3 0.5
            // 4 1.5
            // 6 0.5
            // 8 1.0
            // 9 0.5
        }
      `,
    },
  },
  {
    id: 'osem',
    name: 'OSEM (Reconstrução Tomográfica)',
    difficulty: 'Avançado',
    en: { name: 'OSEM (Tomographic Reconstruction)', summary: 'Rebuilds a medical image from its projections by repeatedly comparing measured and estimated sums — fast EM using ordered subsets.' },
    facts: { 'Criado por': 'H. Malcolm Hudson e Richard Larkin', 'Ano': '1994', 'Base': 'MLEM (Shepp e Vardi, 1982)', 'Usado em': 'PET e SPECT (medicina nuclear)', 'Vantagem': 'Converge ≈ tantas vezes mais rápido quanto o número de subconjuntos' },
    summary: 'Reconstrói uma imagem médica a partir das projeções, comparando repetidamente as somas medidas com as estimadas — o EM acelerado por subconjuntos ordenados.',
    description:
      'Em exames de PET e SPECT, o paciente recebe um traçador radioativo, e detectores ao redor do corpo contam fótons em muitas direções. Cada contagem é, aproximadamente, a soma da atividade ao longo de uma linha que atravessa o corpo: uma projeção. Reconstruir a imagem é resolver o problema inverso. O algoritmo MLEM (maximização da verossimilhança por expectativa-maximização) faz isso iterativamente: projeta a imagem atual, compara com as medidas (razão medido/estimado) e "retroprojeta" essas razões, multiplicando cada pixel pela média das razões dos raios que o atravessam. O MLEM é robusto ao ruído estatístico, mas lento. O OSEM divide as projeções em subconjuntos ordenados (por exemplo, por ângulo) e atualiza a imagem depois de cada subconjunto: com 8 subconjuntos, uma passada pelos dados rende quase o mesmo que 8 iterações do MLEM.',
    complexity: { best: 'O(iterações · medidas · pixels por raio)', average: 'O(k · M · L)', worst: 'O(k · M · L)', space: 'O(pixels + medidas)' },
    steps: [
      'Comece com uma imagem uniforme (todos os pixels positivos).',
      'Divida as projeções em subconjuntos (por exemplo, por ângulo).',
      'Para cada subconjunto: calcule a projeção da imagem atual em cada raio e a razão medido/estimado.',
      'Retroprojete: cada pixel é multiplicado pela média das razões dos raios do subconjunto que o atravessam.',
      'Uma iteração completa percorre todos os subconjuntos; repita algumas vezes (parar cedo evita amplificar o ruído).',
    ],
    usedIn: ['PET (tomografia por emissão de pósitrons)', 'SPECT e cintilografia', 'Tomografia computadorizada iterativa (baixa dose)', 'Astronomia (deconvolução de imagens, Richardson-Lucy)', 'Tomografia industrial e de materiais'],
    realWorld: [
      { title: 'Diagnóstico de câncer', text: 'Exames de PET-CT, usados para localizar tumores e avaliar tratamentos, são reconstruídos com OSEM (muitas vezes com correções de atenuação e de resolução) em praticamente todos os equipamentos modernos.' },
      { title: 'Doses menores', text: 'Métodos iterativos como o OSEM lidam melhor com dados ruidosos que a retroprojeção filtrada clássica, o que permite exames com menos radiação ou mais rápidos.' },
      { title: 'Telescópios', text: 'O mesmo esquema multiplicativo do MLEM é conhecido em astronomia como algoritmo de Richardson-Lucy, usado para tirar o borrão de imagens — inclusive as do Hubble antes da correção da sua lente.' },
    ],
    curiosities: [
      'O MLEM foi proposto por Shepp e Vardi em 1982; o OSEM, de Hudson e Larkin (1994), tornou a reconstrução iterativa rápida o bastante para uso clínico de rotina.',
      'Como a atualização é multiplicativa, pixels que começam positivos nunca ficam negativos — uma propriedade desejável, já que atividade radioativa não pode ser negativa.',
      'No visualizador, há só 4 direções de projeção em uma grade 12 × 12; um PET real mede milhões de linhas de resposta em centenas de ângulos.',
    ],
    code: {
      python: String.raw`
        N = 3
        verdade = [0, 1, 0,
                   1, 2, 1,
                   0, 1, 0]
        # 4 subconjuntos de raios: linhas, colunas, diagonais e antidiagonais
        subconjuntos = [
            [[r * N + c for c in range(N)] for r in range(N)],
            [[r * N + c for r in range(N)] for c in range(N)],
            [[r * N + c for r in range(N) for c in range(N) if r + c == s] for s in range(2 * N - 1)],
            [[r * N + c for r in range(N) for c in range(N) if r - c == s] for s in range(-N + 1, N)],
        ]
        medidas = [[sum(verdade[j] for j in raio) for raio in sub] for sub in subconjuntos]

        img = [1.0] * (N * N)
        for _ in range(200):
            for sub, med in zip(subconjuntos, medidas):
                retro, sens = [0.0] * len(img), [0] * len(img)
                for raio, m in zip(sub, med):
                    estimado = sum(img[j] for j in raio)
                    razao = m / estimado if estimado > 0 else 0.0     # medido / estimado
                    for j in raio:
                        retro[j] += razao
                        sens[j] += 1
                img = [v * r / s for v, r, s in zip(img, retro, sens)]  # atualização multiplicativa
        for r in range(N):
            print(" ".join(f"{img[r * N + c]:.2f}" for c in range(N)))
        # 0.00 1.00 0.00  (a imagem original é recuperada)
        # 1.00 2.00 1.00
        # 0.00 1.00 0.00
      `,
      javascript: String.raw`
        const N = 3;
        const verdade = [0, 1, 0, 1, 2, 1, 0, 1, 0];
        const idx = (r, c) => r * N + c;
        const faixa = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);
        const celulas = faixa(0, N).flatMap(r => faixa(0, N).map(c => [r, c]));
        // 4 subconjuntos de raios: linhas, colunas, diagonais e antidiagonais
        const subconjuntos = [
          faixa(0, N).map(r => faixa(0, N).map(c => idx(r, c))),
          faixa(0, N).map(c => faixa(0, N).map(r => idx(r, c))),
          faixa(0, 2 * N - 1).map(s => celulas.filter(([r, c]) => r + c === s).map(([r, c]) => idx(r, c))),
          faixa(-N + 1, N).map(s => celulas.filter(([r, c]) => r - c === s).map(([r, c]) => idx(r, c))),
        ];
        const medidas = subconjuntos.map(sub => sub.map(raio => raio.reduce((s, j) => s + verdade[j], 0)));

        let img = Array(N * N).fill(1);
        for (let it = 0; it < 200; it++) {
          subconjuntos.forEach((sub, k) => {
            const retro = Array(img.length).fill(0), sens = Array(img.length).fill(0);
            sub.forEach((raio, i) => {
              const estimado = raio.reduce((s, j) => s + img[j], 0);
              const razao = estimado > 0 ? medidas[k][i] / estimado : 0; // medido / estimado
              for (const j of raio) { retro[j] += razao; sens[j] += 1; }
            });
            img = img.map((v, j) => (v * retro[j]) / sens[j]); // atualização multiplicativa
          });
        }
        for (let r = 0; r < N; r++) console.log(faixa(0, N).map(c => img[idx(r, c)].toFixed(2)).join(" "));
        // 0.00 1.00 0.00  (a imagem original é recuperada)
        // 1.00 2.00 1.00
        // 0.00 1.00 0.00
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Locale;

        public class OSEM {
            public static void main(String[] args) {
                int N = 3;
                double[] verdade = {0, 1, 0, 1, 2, 1, 0, 1, 0};
                // 4 subconjuntos de raios: linhas, colunas, diagonais e antidiagonais
                List<List<int[]>> subconjuntos = new ArrayList<>();
                for (int tipo = 0; tipo < 4; tipo++) {
                    List<int[]> raios = new ArrayList<>();
                    int quantos = tipo < 2 ? N : 2 * N - 1;
                    for (int s = 0; s < quantos; s++) {
                        List<Integer> raio = new ArrayList<>();
                        for (int r = 0; r < N; r++)
                            for (int c = 0; c < N; c++)
                                if ((tipo == 0 && r == s) || (tipo == 1 && c == s) || (tipo == 2 && r + c == s) || (tipo == 3 && r - c == s - N + 1))
                                    raio.add(r * N + c);
                        raios.add(raio.stream().mapToInt(Integer::intValue).toArray());
                    }
                    subconjuntos.add(raios);
                }
                double[] img = new double[N * N];
                java.util.Arrays.fill(img, 1);
                for (int it = 0; it < 200; it++) {
                    for (List<int[]> sub : subconjuntos) {
                        double[] retro = new double[img.length];
                        int[] sens = new int[img.length];
                        for (int[] raio : sub) {
                            double medido = 0, estimado = 0;
                            for (int j : raio) { medido += verdade[j]; estimado += img[j]; }
                            double razao = estimado > 0 ? medido / estimado : 0; // medido / estimado
                            for (int j : raio) { retro[j] += razao; sens[j]++; }
                        }
                        for (int j = 0; j < img.length; j++) img[j] = img[j] * retro[j] / sens[j]; // atualização multiplicativa
                    }
                }
                for (int r = 0; r < N; r++)
                    System.out.println(String.format(Locale.ROOT, "%.2f %.2f %.2f", img[r * N], img[r * N + 1], img[r * N + 2]));
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <vector>
        using namespace std;

        int main() {
            const int N = 3;
            vector<double> verdade = {0, 1, 0, 1, 2, 1, 0, 1, 0};
            // 4 subconjuntos de raios: linhas, colunas, diagonais e antidiagonais
            vector<vector<vector<int>>> subconjuntos(4);
            for (int tipo = 0; tipo < 4; tipo++) {
                int quantos = tipo < 2 ? N : 2 * N - 1;
                for (int s = 0; s < quantos; s++) {
                    vector<int> raio;
                    for (int r = 0; r < N; r++)
                        for (int c = 0; c < N; c++)
                            if ((tipo == 0 && r == s) || (tipo == 1 && c == s) || (tipo == 2 && r + c == s) || (tipo == 3 && r - c == s - N + 1))
                                raio.push_back(r * N + c);
                    subconjuntos[tipo].push_back(raio);
                }
            }
            vector<double> img(N * N, 1.0);
            for (int it = 0; it < 200; it++) {
                for (auto& sub : subconjuntos) {
                    vector<double> retro(img.size(), 0);
                    vector<int> sens(img.size(), 0);
                    for (auto& raio : sub) {
                        double medido = 0, estimado = 0;
                        for (int j : raio) { medido += verdade[j]; estimado += img[j]; }
                        double razao = estimado > 0 ? medido / estimado : 0; // medido / estimado
                        for (int j : raio) { retro[j] += razao; sens[j]++; }
                    }
                    for (size_t j = 0; j < img.size(); j++) img[j] = img[j] * retro[j] / sens[j]; // atualização multiplicativa
                }
            }
            for (int r = 0; r < N; r++) printf("%.2f %.2f %.2f\n", img[r * N], img[r * N + 1], img[r * N + 2]);
        }
      `,
    },
  },
]
