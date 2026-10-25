export default [
  {
    id: 'rounding',
    name: 'Modos de Arredondamento',
    difficulty: 'Iniciante',
    en: { name: 'Rounding Modes', summary: 'The classic ways to round a number — and why "round half to even" is the default in computers.' },
    facts: { 'Padrão em computadores': 'IEEE 754 (meio para o par)', 'Também chamado': 'Arredondamento bancário (meio para o par)', 'Modos clássicos': '6' },
    summary: 'As formas clássicas de arredondar um número — e por que o "meio para o par" é o padrão dos computadores.',
    description:
      'Arredondar parece simples, mas há várias regras diferentes, e elas só discordam em dois casos: números negativos e empates (valores terminados exatamente em ,5). Piso e teto vão sempre para baixo ou para cima; truncar descarta a parte fracionária; "meio para cima" e "meio para longe do zero" resolvem empates sempre na mesma direção; e o "meio para o par" (arredondamento bancário) manda cada empate para o inteiro par mais próximo. Esse último é o padrão do IEEE 754 porque não acumula viés: em somas longas, metade dos empates sobe e metade desce.',
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    steps: [
      'Piso (floor): o maior inteiro menor ou igual a x. Teto (ceil): o menor inteiro maior ou igual a x.',
      'Truncar: descarta a parte fracionária, indo sempre em direção ao zero (−2,7 → −2).',
      'Meio para cima: soma 0,5 e aplica o piso (2,5 → 3, mas −2,5 → −2).',
      'Meio para longe do zero: arredonda o valor absoluto e repõe o sinal (−2,5 → −3).',
      'Meio para o par: nos empates, escolhe o vizinho par (2,5 → 2, 3,5 → 4); fora dos empates, vai para o mais próximo.',
    ],
    usedIn: ['Aritmética de ponto flutuante (IEEE 754)', 'round() do Python e Math.rint() do Java', 'Sistemas financeiros e contábeis', 'Estatística e relatórios', 'Processamento de sinais e gráficos'],
    realWorld: [
      { title: 'Todo cálculo do processador', text: 'Cada soma ou multiplicação em ponto flutuante gera um resultado que precisa ser arredondado para caber em 64 bits. O padrão IEEE 754 usa "meio para o par" por padrão, para que os erros não se acumulem em uma só direção.' },
      { title: 'Bolsa de Vancouver', text: 'Em 1982, o índice da Bolsa de Vancouver começou em 1000 e, 22 meses depois, marcava cerca de 520 — embora o valor correto fosse perto de 1098. O motivo: a cada recálculo, milhares de vezes por dia, o índice era truncado em vez de arredondado.' },
      { title: 'Míssil Patriot', text: 'Em 1991, um sistema antimísseis Patriot falhou em interceptar um míssil em Dhahran, e 28 soldados morreram. O relógio interno truncava 0,1 segundo em 24 bits; após 100 horas ligado, o erro acumulado chegava a 0,34 s — o suficiente para errar o alvo.' },
    ],
    curiosities: [
      'No Python, round(2.5) dá 2 e round(3.5) dá 4: a função usa o arredondamento bancário. Já Math.round(-2.5) no JavaScript dá −2, porque arredonda os empates para cima (em direção a +∞).',
      'round(2.675, 2) no Python dá 2.67, e não 2.68: o número 2,675 não existe em binário e é guardado como 2,67499999999999982236431605997495353221893310546875.',
      'Para dinheiro, use tipos decimais (Decimal no Python, BigDecimal no Java), que guardam 0,1 exatamente e deixam escolher o modo de arredondamento.',
    ],
    code: {
      python: String.raw`
        import math

        def meio_para_longe_do_zero(x):
            return int(math.copysign(math.floor(abs(x) + 0.5), x))

        # round() do Python já usa "meio para o par" (arredondamento bancário)
        for x in [2.5, 3.5, -2.5, 2.4]:
            print(x, math.floor(x), math.ceil(x), math.trunc(x), round(x), meio_para_longe_do_zero(x))
        # x | piso teto truncar par longe-do-zero
        # 2.5 2 3 2 2 3
        # 3.5 3 4 3 4 4
        # -2.5 -3 -2 -2 -2 -3
        # 2.4 2 3 2 2 2
      `,
      javascript: String.raw`
        function meioParaPar(x) { // arredondamento bancário
          const piso = Math.floor(x), diferenca = x - piso;
          if (diferenca !== 0.5) return Math.round(x);
          return piso % 2 === 0 ? piso : piso + 1;
        }

        const meioParaLongeDoZero = x => Math.sign(x) * Math.floor(Math.abs(x) + 0.5);

        // Math.round arredonda os empates para cima: Math.round(-2.5) === -2
        for (const x of [2.5, 3.5, -2.5, 2.4]) {
          console.log(x, Math.floor(x), Math.ceil(x), Math.trunc(x), meioParaPar(x), meioParaLongeDoZero(x));
        }
        // x | piso teto truncar par longe-do-zero
        // 2.5 2 3 2 2 3
        // 3.5 3 4 3 4 4
        // -2.5 -3 -2 -2 -2 -3
        // 2.4 2 3 2 2 2
      `,
      java: String.raw`
        public class Arredondamento {
            static long meioParaLongeDoZero(double x) {
                return (long) (Math.signum(x) * Math.floor(Math.abs(x) + 0.5));
            }

            public static void main(String[] args) {
                // Math.rint usa "meio para o par"; Math.round arredonda empates para cima
                for (double x : new double[]{2.5, 3.5, -2.5, 2.4}) {
                    System.out.println(x + " " + (long) Math.floor(x) + " " + (long) Math.ceil(x) + " " + (long) x
                        + " " + (long) Math.rint(x) + " " + meioParaLongeDoZero(x));
                }
                // x | piso teto truncar par longe-do-zero
                // 2.5 2 3 2 2 3
                // 3.5 3 4 3 4 4
                // -2.5 -3 -2 -2 -2 -3
                // 2.4 2 3 2 2 2
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <iostream>
        using namespace std;

        int main() {
            // nearbyint usa o modo padrão do IEEE 754 ("meio para o par");
            // round arredonda os empates para longe do zero
            for (double x : {2.5, 3.5, -2.5, 2.4}) {
                cout << x << " " << floor(x) << " " << ceil(x) << " " << trunc(x)
                     << " " << nearbyint(x) << " " << round(x) << "\n";
            }
            // x | piso teto truncar par longe-do-zero
            // 2.5 2 3 2 2 3
            // 3.5 3 4 3 4 4
            // -2.5 -3 -2 -2 -2 -3
            // 2.4 2 3 2 2 2
        }
      `,
    },
  },
  {
    id: 'babylonian-sqrt',
    name: 'Raiz Quadrada (Método Babilônico)',
    difficulty: 'Iniciante',
    en: { name: 'Square Root (Babylonian Method)', summary: 'Approximates √a by repeatedly averaging x and a/x — the number of correct digits doubles each time.' },
    facts: { 'Origem': 'Babilônia (tábua YBC 7289)', 'Ano': '≈ 1800 a.C.', 'Descrito por': 'Heron de Alexandria (séc. I)', 'Convergência': 'Quadrática' },
    summary: 'Aproxima √a tirando, repetidamente, a média entre x e a/x — os dígitos corretos dobram a cada passo.',
    description:
      'O método babilônico (ou de Heron) calcula √a com uma ideia simples: se x é um palpite, então x e a/x ficam um de cada lado da raiz — se x for grande demais, a/x será pequeno demais. A média dos dois é um palpite melhor. Repetindo xₖ₊₁ = (xₖ + a/xₖ) / 2, o erro cai ao quadrado a cada passo, então o número de dígitos corretos praticamente dobra. É exatamente o método de Newton aplicado a f(x) = x² − a, descoberto uns 3 mil anos antes de Newton.',
    complexity: { best: 'O(1) iterações', average: 'O(log d) iterações', worst: 'O(log d + log a) iterações', space: 'O(1)' },
    steps: [
      'Escolha um palpite inicial positivo, como x = a (ou 1, se a < 1).',
      'Calcule a média entre x e a/x: x ← (x + a/x) / 2.',
      'Repita até que duas aproximações seguidas sejam praticamente iguais.',
      'Cada iteração eleva o erro ao quadrado: de 10⁻² para 10⁻⁴, 10⁻⁸, 10⁻¹⁶…',
    ],
    usedIn: ['Implementações de sqrt em software', 'Calculadoras e bibliotecas de precisão arbitrária', 'Raízes de inteiros (math.isqrt)', 'Gráficos 3D (normalização de vetores)', 'Ensino de métodos numéricos'],
    realWorld: [
      { title: 'Precisão arbitrária', text: 'Bibliotecas que calculam raízes com milhares de dígitos, como o módulo decimal do Python, usam iterações desse tipo: como os dígitos dobram a cada passo, bastam poucas dezenas de iterações.' },
      { title: 'Raiz de inteiros', text: 'Funções como math.isqrt (Python) calculam a raiz quadrada inteira exata de números com centenas de dígitos usando a mesma ideia, só com aritmética de inteiros.' },
      { title: 'Quake III', text: 'O famoso "fast inverse square root" do jogo Quake III Arena calculava 1/√x com um palpite inicial obtido por um truque de bits (a constante 0x5f3759df) seguido de um único passo de Newton.' },
    ],
    curiosities: [
      'A tábua babilônica YBC 7289, de cerca de 1800 a.C., registra √2 ≈ 1;24,51,10 em base 60 — isto é, 1,41421296…, correto até a sexta casa decimal.',
      'Heron de Alexandria descreveu o método no século I em sua obra Metrica, por isso ele também é chamado de método de Heron.',
      'Partindo de x = 2 para √2, as aproximações são 1,5 → 1,4167 → 1,414216 → 1,41421356237469…: 1, 3, 6 e 12 dígitos corretos.',
    ],
    code: {
      python: String.raw`
        def raiz_quadrada(a, tolerancia=1e-15):
            if a == 0:
                return 0.0
            x = a if a >= 1 else 1.0  # palpite inicial
            while True:
                proximo = (x + a / x) / 2  # média entre x e a/x
                if abs(proximo - x) <= tolerancia * proximo:
                    return proximo
                x = proximo

        print(f"{raiz_quadrada(2):.12f}")     # 1.414213562373
        print(f"{raiz_quadrada(1e6):.12f}")   # 1000.000000000000
      `,
      javascript: String.raw`
        function raizQuadrada(a, tolerancia = 1e-15) {
          if (a === 0) return 0;
          let x = a >= 1 ? a : 1; // palpite inicial
          while (true) {
            const proximo = (x + a / x) / 2; // média entre x e a/x
            if (Math.abs(proximo - x) <= tolerancia * proximo) return proximo;
            x = proximo;
          }
        }

        console.log(raizQuadrada(2).toFixed(12));   // 1.414213562373
        console.log(raizQuadrada(1e6).toFixed(12)); // 1000.000000000000
      `,
      java: String.raw`
        import java.util.Locale;

        public class RaizBabilonica {
            static double raizQuadrada(double a, double tolerancia) {
                if (a == 0) return 0;
                double x = a >= 1 ? a : 1; // palpite inicial
                while (true) {
                    double proximo = (x + a / x) / 2; // média entre x e a/x
                    if (Math.abs(proximo - x) <= tolerancia * proximo) return proximo;
                    x = proximo;
                }
            }

            public static void main(String[] args) {
                System.out.println(String.format(Locale.ROOT, "%.12f", raizQuadrada(2, 1e-15)));   // 1.414213562373
                System.out.println(String.format(Locale.ROOT, "%.12f", raizQuadrada(1e6, 1e-15))); // 1000.000000000000
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>

        double raizQuadrada(double a, double tolerancia = 1e-15) {
            if (a == 0) return 0;
            double x = a >= 1 ? a : 1; // palpite inicial
            while (true) {
                double proximo = (x + a / x) / 2; // média entre x e a/x
                if (std::fabs(proximo - x) <= tolerancia * proximo) return proximo;
                x = proximo;
            }
        }

        int main() {
            std::printf("%.12f\n", raizQuadrada(2));   // 1.414213562373
            std::printf("%.12f\n", raizQuadrada(1e6)); // 1000.000000000000
        }
      `,
    },
  },
  {
    id: 'newton-method',
    name: 'Método de Newton',
    difficulty: 'Intermediário',
    en: { name: "Newton's Method", summary: 'Finds roots of a function by following its tangent line down to the axis, again and again.' },
    facts: { 'Criado por': 'Isaac Newton; Joseph Raphson', 'Ano': '1669; 1690', 'Também chamado': 'Newton-Raphson', 'Convergência': 'Quadrática (perto da raiz)' },
    summary: 'Encontra raízes de uma função seguindo a reta tangente até o eixo, de novo e de novo.',
    description:
      'O Método de Newton (ou Newton-Raphson) encontra um x com f(x) = 0. A partir de um palpite, traça a reta tangente ao gráfico de f naquele ponto e toma como novo palpite o lugar onde essa reta cruza o eixo: xₖ₊₁ = xₖ − f(xₖ)/f\'(xₖ). Perto de uma raiz simples, a convergência é quadrática — os dígitos corretos dobram a cada passo. Em troca, precisa da derivada e pode divergir, oscilar ou cair em outra raiz se o palpite inicial for ruim.',
    complexity: { best: 'O(1) iterações', average: 'O(log d) iterações', worst: 'Pode divergir', space: 'O(1)' },
    steps: [
      'Escolha um palpite inicial x₀, de preferência perto da raiz.',
      'Calcule f(xₖ) e a derivada f\'(xₖ).',
      'Faça xₖ₊₁ = xₖ − f(xₖ) / f\'(xₖ): é onde a tangente cruza o eixo x.',
      'Pare quando a correção f(xₖ)/f\'(xₖ) ficar menor que a tolerância.',
      'Se a derivada se anular ou as iterações não convergirem, troque o palpite (ou use um método com intervalo, como a falsa posição).',
    ],
    usedIn: ['Bibliotecas numéricas (SciPy, MATLAB)', 'Otimização (Newton para mínimos)', 'Simuladores de circuitos (SPICE)', 'Divisão e raízes em hardware', 'Física, engenharia e finanças (taxa interna de retorno)'],
    realWorld: [
      { title: 'Simulação de circuitos', text: 'Simuladores como o SPICE resolvem as equações não lineares de transistores e diodos com o método de Newton, várias vezes por passo de tempo.' },
      { title: 'Divisão no processador', text: 'Muitos processadores e GPUs calculam 1/x e 1/√x com uma estimativa inicial de tabela seguida de um ou dois passos de Newton, dobrando a precisão a cada passo.' },
      { title: 'Finanças', text: 'A taxa interna de retorno (TIR) de um investimento é a raiz de um polinômio; planilhas como o Excel a calculam com iterações do tipo Newton.' },
    ],
    curiosities: [
      'Newton descreveu o método por volta de 1669 usando exatamente a equação x³ − 2x − 5 = 0 — que aparece no visualizador e no código. Joseph Raphson publicou uma versão mais simples em 1690, e Thomas Simpson deu, em 1740, a forma geral com a derivada.',
      'Aplicado a polinômios no plano complexo, o método produz os "fractais de Newton": colorindo cada ponto pela raiz à qual ele converge, surgem fronteiras infinitamente detalhadas.',
      'Para √a, o Método de Newton se reduz exatamente ao método babilônico, conhecido há quase 4 mil anos.',
    ],
    code: {
      python: String.raw`
        def newton(f, df, x, tolerancia=1e-12, max_iter=50):
            for _ in range(max_iter):
                passo = f(x) / df(x)
                x -= passo           # onde a tangente cruza o eixo
                if abs(passo) < tolerancia:
                    return x
            raise ValueError("não convergiu")

        raiz2 = newton(lambda x: x * x - 2, lambda x: 2 * x, 1.0)
        exemplo_newton = newton(lambda x: x**3 - 2 * x - 5, lambda x: 3 * x * x - 2, 2.0)
        print(f"{raiz2:.12f}")           # 1.414213562373
        print(f"{exemplo_newton:.12f}")  # 2.094551481542 (o exemplo do próprio Newton)
      `,
      javascript: String.raw`
        function newton(f, df, x, tolerancia = 1e-12, maxIter = 50) {
          for (let i = 0; i < maxIter; i++) {
            const passo = f(x) / df(x);
            x -= passo; // onde a tangente cruza o eixo
            if (Math.abs(passo) < tolerancia) return x;
          }
          throw new Error("não convergiu");
        }

        const raiz2 = newton(x => x * x - 2, x => 2 * x, 1);
        const exemploNewton = newton(x => x ** 3 - 2 * x - 5, x => 3 * x * x - 2, 2);
        console.log(raiz2.toFixed(12));         // 1.414213562373
        console.log(exemploNewton.toFixed(12)); // 2.094551481542 (o exemplo do próprio Newton)
      `,
      java: String.raw`
        import java.util.Locale;
        import java.util.function.DoubleUnaryOperator;

        public class Newton {
            static double newton(DoubleUnaryOperator f, DoubleUnaryOperator df, double x, double tolerancia) {
                for (int i = 0; i < 50; i++) {
                    double passo = f.applyAsDouble(x) / df.applyAsDouble(x);
                    x -= passo; // onde a tangente cruza o eixo
                    if (Math.abs(passo) < tolerancia) return x;
                }
                throw new ArithmeticException("não convergiu");
            }

            public static void main(String[] args) {
                double raiz2 = newton(x -> x * x - 2, x -> 2 * x, 1, 1e-12);
                double exemploNewton = newton(x -> x * x * x - 2 * x - 5, x -> 3 * x * x - 2, 2, 1e-12);
                System.out.println(String.format(Locale.ROOT, "%.12f", raiz2));         // 1.414213562373
                System.out.println(String.format(Locale.ROOT, "%.12f", exemploNewton)); // 2.094551481542
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>
        #include <functional>
        #include <stdexcept>
        using namespace std;

        double newton(function<double(double)> f, function<double(double)> df, double x, double tolerancia = 1e-12) {
            for (int i = 0; i < 50; i++) {
                double passo = f(x) / df(x);
                x -= passo; // onde a tangente cruza o eixo
                if (fabs(passo) < tolerancia) return x;
            }
            throw runtime_error("não convergiu");
        }

        int main() {
            double raiz2 = newton([](double x) { return x * x - 2; }, [](double x) { return 2 * x; }, 1);
            double exemploNewton = newton([](double x) { return x * x * x - 2 * x - 5; }, [](double x) { return 3 * x * x - 2; }, 2);
            printf("%.12f\n", raiz2);         // 1.414213562373
            printf("%.12f\n", exemploNewton); // 2.094551481542 (o exemplo do próprio Newton)
        }
      `,
    },
  },
  {
    id: 'secant-method',
    name: 'Método da Secante',
    difficulty: 'Intermediário',
    en: { name: 'Secant Method', summary: "Newton's method without derivatives: uses the line through the last two points instead of the tangent." },
    facts: { 'Origem': 'Derivado da regra da falsa posição', 'Ordem de convergência': '≈ 1,618 (razão áurea)', 'Exige derivada': 'Não' },
    summary: 'Newton sem derivadas: usa a reta pelos dois últimos pontos no lugar da tangente.',
    description:
      'O Método da Secante encontra raízes como o de Newton, mas sem precisar da derivada. Em vez da tangente, usa a reta secante que passa pelos dois últimos pontos calculados, (xₖ₋₁, f(xₖ₋₁)) e (xₖ, f(xₖ)), e toma como próximo palpite o ponto onde ela cruza o eixo. A convergência é um pouco mais lenta que a de Newton — de ordem ≈ 1,618, a razão áurea —, mas cada iteração calcula f uma só vez, então na prática ele costuma ser tão rápido quanto. Assim como Newton, não garante convergência.',
    complexity: { best: 'O(1) iterações', average: 'O(log d) iterações', worst: 'Pode divergir', space: 'O(1)' },
    steps: [
      'Escolha dois palpites iniciais x₀ e x₁.',
      'Trace a reta que passa por (x₀, f(x₀)) e (x₁, f(x₁)).',
      'O próximo palpite é onde ela cruza o eixo: x₂ = x₁ − f(x₁)·(x₁ − x₀) / (f(x₁) − f(x₀)).',
      'Descarte o ponto mais antigo e repita com (x₁, x₂).',
      'Pare quando dois palpites seguidos forem praticamente iguais.',
    ],
    usedIn: ['Método de Brent (scipy.optimize.brentq)', 'Funções sem derivada conhecida', 'Simulações com f cara de calcular', 'Calibração de modelos', 'Ensino de métodos numéricos'],
    realWorld: [
      { title: 'Quando a derivada não existe pronta', text: 'Se f(x) é o resultado de uma simulação longa ou de uma medição, não há fórmula para a derivada. A secante a aproxima usando os próprios valores já calculados.' },
      { title: 'Método de Brent', text: 'O brentq do SciPy e o fzero do MATLAB combinam passos de secante (rápidos) com bisseção (segura): ficam com a velocidade de um e a garantia de convergência do outro.' },
      { title: 'Calibração', text: 'Ajustar um parâmetro até o modelo bater com uma medida — a taxa de juros que dá determinada parcela, o ângulo que faz um projétil acertar o alvo — é procurar a raiz de "modelo − medida".' },
    ],
    curiosities: [
      'A ordem de convergência da secante é exatamente a razão áurea, (1 + √5)/2 ≈ 1,618 — a mesma constante que aparece na sequência de Fibonacci.',
      'A secante é, essencialmente, a antiga regra da falsa posição sem a preocupação de manter a raiz dentro de um intervalo — o que a torna mais rápida, mas menos segura.',
      'Como Newton usa duas avaliações por passo (f e f\') e a secante só uma, por avaliação de função a secante é ligeiramente mais eficiente.',
    ],
    code: {
      python: String.raw`
        import math

        def secante(f, x0, x1, tolerancia=1e-12, max_iter=50):
            for _ in range(max_iter):
                f0, f1 = f(x0), f(x1)
                x2 = x1 - f1 * (x1 - x0) / (f1 - f0)  # onde a secante cruza o eixo
                if abs(x2 - x1) < tolerancia:
                    return x2
                x0, x1 = x1, x2
            raise ValueError("não convergiu")

        print(f"{secante(lambda x: math.cos(x) - x, 0.0, 1.0):.12f}")  # 0.739085133215
        print(f"{secante(lambda x: x * x - 2, 1.0, 2.0):.12f}")        # 1.414213562373
      `,
      javascript: String.raw`
        function secante(f, x0, x1, tolerancia = 1e-12, maxIter = 50) {
          for (let i = 0; i < maxIter; i++) {
            const f0 = f(x0), f1 = f(x1);
            const x2 = x1 - f1 * (x1 - x0) / (f1 - f0); // onde a secante cruza o eixo
            if (Math.abs(x2 - x1) < tolerancia) return x2;
            [x0, x1] = [x1, x2];
          }
          throw new Error("não convergiu");
        }

        console.log(secante(x => Math.cos(x) - x, 0, 1).toFixed(12)); // 0.739085133215
        console.log(secante(x => x * x - 2, 1, 2).toFixed(12));       // 1.414213562373
      `,
      java: String.raw`
        import java.util.Locale;
        import java.util.function.DoubleUnaryOperator;

        public class Secante {
            static double secante(DoubleUnaryOperator f, double x0, double x1, double tolerancia) {
                for (int i = 0; i < 50; i++) {
                    double f0 = f.applyAsDouble(x0), f1 = f.applyAsDouble(x1);
                    double x2 = x1 - f1 * (x1 - x0) / (f1 - f0); // onde a secante cruza o eixo
                    if (Math.abs(x2 - x1) < tolerancia) return x2;
                    x0 = x1;
                    x1 = x2;
                }
                throw new ArithmeticException("não convergiu");
            }

            public static void main(String[] args) {
                System.out.println(String.format(Locale.ROOT, "%.12f", secante(x -> Math.cos(x) - x, 0, 1, 1e-12))); // 0.739085133215
                System.out.println(String.format(Locale.ROOT, "%.12f", secante(x -> x * x - 2, 1, 2, 1e-12)));       // 1.414213562373
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>
        #include <functional>
        #include <stdexcept>
        using namespace std;

        double secante(function<double(double)> f, double x0, double x1, double tolerancia = 1e-12) {
            for (int i = 0; i < 50; i++) {
                double f0 = f(x0), f1 = f(x1);
                double x2 = x1 - f1 * (x1 - x0) / (f1 - f0); // onde a secante cruza o eixo
                if (fabs(x2 - x1) < tolerancia) return x2;
                x0 = x1;
                x1 = x2;
            }
            throw runtime_error("não convergiu");
        }

        int main() {
            printf("%.12f\n", secante([](double x) { return cos(x) - x; }, 0, 1)); // 0.739085133215
            printf("%.12f\n", secante([](double x) { return x * x - 2; }, 1, 2));  // 1.414213562373
        }
      `,
    },
  },
  {
    id: 'false-position',
    name: 'Método da Falsa Posição',
    difficulty: 'Intermediário',
    en: { name: 'False Position Method (Regula Falsi)', summary: 'Like the secant method, but always keeps the root trapped inside an interval — so it never diverges.' },
    facts: { 'Origem': 'Papiro de Rhind (Egito); Nove Capítulos (China)', 'Ano': '≈ 1650 a.C.', 'Também chamado': 'Regula falsi', 'Convergência': 'Garantida (linear)' },
    summary: 'Como a secante, mas sempre mantém a raiz presa dentro de um intervalo — por isso nunca diverge.',
    description:
      'O Método da Falsa Posição (regula falsi) começa com um intervalo [a, b] em que f muda de sinal — e, portanto, contém uma raiz. Traça a reta entre (a, f(a)) e (b, f(b)) e usa o ponto c onde ela cruza o eixo como estimativa. Depois, troca a ponta do intervalo que tem o mesmo sinal de f(c), de modo que a raiz continua presa entre as duas pontas. A convergência é garantida, mas pode ser lenta: em funções curvas, uma das pontas fica "presa" e o método avança devagar — o que variações como o algoritmo de Illinois corrigem.',
    complexity: { best: 'O(1) iterações', average: 'O(d) iterações', worst: 'O(d) iterações', space: 'O(1)' },
    steps: [
      'Escolha a e b com f(a) e f(b) de sinais opostos (a raiz está entre eles).',
      'Calcule o ponto onde a reta entre (a, f(a)) e (b, f(b)) cruza o eixo: c = b − f(b)·(b − a) / (f(b) − f(a)).',
      'Se f(c) tiver o mesmo sinal de f(a), troque a por c; senão, troque b por c.',
      'O intervalo continua contendo a raiz; repita até c se estabilizar.',
      'Diferente da bisseção, c não é o meio do intervalo: ele leva em conta o tamanho de f em cada ponta.',
    ],
    usedIn: ['Solvers robustos de equações', 'Variantes Illinois e Anderson-Björck', 'Planilhas (atingir meta)', 'Problemas em que a divergência é inaceitável', 'Ensino de métodos numéricos'],
    realWorld: [
      { title: 'Robustez acima de tudo', text: 'Em sistemas embarcados e simulações longas, um método que pode divergir é um risco. A falsa posição (e suas variantes) sempre termina com uma raiz dentro do intervalo inicial.' },
      { title: 'Atingir meta', text: 'Recursos como "Atingir meta" de planilhas procuram o valor de entrada que produz um resultado desejado — um problema de raiz que métodos com intervalo resolvem de forma confiável.' },
      { title: 'Matemática antiga', text: 'Problemas como "uma quantidade e sua sétima parte somam 19" eram resolvidos testando um valor "falso" (7) e corrigindo proporcionalmente — a mesma ideia que dá nome ao método.' },
    ],
    curiosities: [
      'O Papiro de Rhind, do Egito (cerca de 1650 a.C.), já resolve equações lineares com a "regra da falsa posição". Na China, o livro Os Nove Capítulos sobre a Arte Matemática usava a versão com dois palpites.',
      'Fibonacci popularizou a técnica na Europa no Liber Abaci (1202), com o nome de "regra das duas falsas posições".',
      'No visualizador, compare com Newton e a secante usando x³ − 2x − 5: a falsa posição precisa de bem mais iterações, porque a ponta direita do intervalo fica presa.',
    ],
    code: {
      python: String.raw`
        def falsa_posicao(f, a, b, tolerancia=1e-12, max_iter=200):
            fa, fb = f(a), f(b)
            if fa * fb > 0:
                raise ValueError("f(a) e f(b) precisam ter sinais opostos")
            c = a
            for _ in range(max_iter):
                c_anterior = c
                c = b - fb * (b - a) / (fb - fa)  # onde a reta cruza o eixo
                fc = f(c)
                if fc == 0 or abs(c - c_anterior) < tolerancia:
                    return c
                if fa * fc < 0:   # a raiz está em [a, c]
                    b, fb = c, fc
                else:             # a raiz está em [c, b]
                    a, fa = c, fc
            return c

        print(f"{falsa_posicao(lambda x: x**3 - 2 * x - 5, 2, 3):.12f}")  # 2.094551481542
        print(f"{falsa_posicao(lambda x: x * x - 2, 0, 2):.12f}")         # 1.414213562373
      `,
      javascript: String.raw`
        function falsaPosicao(f, a, b, tolerancia = 1e-12, maxIter = 200) {
          let fa = f(a), fb = f(b);
          if (fa * fb > 0) throw new Error("f(a) e f(b) precisam ter sinais opostos");
          let c = a;
          for (let i = 0; i < maxIter; i++) {
            const cAnterior = c;
            c = b - fb * (b - a) / (fb - fa); // onde a reta cruza o eixo
            const fc = f(c);
            if (fc === 0 || Math.abs(c - cAnterior) < tolerancia) return c;
            if (fa * fc < 0) { b = c; fb = fc; } // a raiz está em [a, c]
            else { a = c; fa = fc; }             // a raiz está em [c, b]
          }
          return c;
        }

        console.log(falsaPosicao(x => x ** 3 - 2 * x - 5, 2, 3).toFixed(12)); // 2.094551481542
        console.log(falsaPosicao(x => x * x - 2, 0, 2).toFixed(12));          // 1.414213562373
      `,
      java: String.raw`
        import java.util.Locale;
        import java.util.function.DoubleUnaryOperator;

        public class FalsaPosicao {
            static double falsaPosicao(DoubleUnaryOperator f, double a, double b, double tolerancia) {
                double fa = f.applyAsDouble(a), fb = f.applyAsDouble(b);
                if (fa * fb > 0) throw new IllegalArgumentException("f(a) e f(b) precisam ter sinais opostos");
                double c = a;
                for (int i = 0; i < 200; i++) {
                    double cAnterior = c;
                    c = b - fb * (b - a) / (fb - fa); // onde a reta cruza o eixo
                    double fc = f.applyAsDouble(c);
                    if (fc == 0 || Math.abs(c - cAnterior) < tolerancia) return c;
                    if (fa * fc < 0) { b = c; fb = fc; } // a raiz está em [a, c]
                    else { a = c; fa = fc; }             // a raiz está em [c, b]
                }
                return c;
            }

            public static void main(String[] args) {
                System.out.println(String.format(Locale.ROOT, "%.12f", falsaPosicao(x -> x * x * x - 2 * x - 5, 2, 3, 1e-12))); // 2.094551481542
                System.out.println(String.format(Locale.ROOT, "%.12f", falsaPosicao(x -> x * x - 2, 0, 2, 1e-12)));             // 1.414213562373
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>
        #include <functional>
        #include <stdexcept>
        using namespace std;

        double falsaPosicao(function<double(double)> f, double a, double b, double tolerancia = 1e-12) {
            double fa = f(a), fb = f(b);
            if (fa * fb > 0) throw invalid_argument("f(a) e f(b) precisam ter sinais opostos");
            double c = a;
            for (int i = 0; i < 200; i++) {
                double cAnterior = c;
                c = b - fb * (b - a) / (fb - fa); // onde a reta cruza o eixo
                double fc = f(c);
                if (fc == 0 || fabs(c - cAnterior) < tolerancia) return c;
                if (fa * fc < 0) { b = c; fb = fc; } // a raiz está em [a, c]
                else { a = c; fa = fc; }             // a raiz está em [c, b]
            }
            return c;
        }

        int main() {
            printf("%.12f\n", falsaPosicao([](double x) { return x * x * x - 2 * x - 5; }, 2, 3)); // 2.094551481542
            printf("%.12f\n", falsaPosicao([](double x) { return x * x - 2; }, 0, 2));             // 1.414213562373
        }
      `,
    },
  },
  {
    id: 'nth-root-digits',
    name: 'Raiz n-ésima Dígito a Dígito',
    difficulty: 'Intermediário',
    en: { name: 'Digit-by-Digit nth Root', summary: 'Extracts square, cube or nth roots one exact digit at a time, using only whole numbers.' },
    facts: { 'Também chamado': 'Shifting nth-root algorithm', 'Registro antigo': 'Os Nove Capítulos (China)', 'Usa ponto flutuante': 'Não — só inteiros' },
    summary: 'Extrai raízes quadradas, cúbicas ou n-ésimas um dígito exato por vez, só com números inteiros.',
    description:
      'O algoritmo de raiz n-ésima dígito a dígito ("shifting nth root") é a generalização do método de extrair raiz quadrada "na mão", ensinado nas escolas até meados do século XX. O número é dividido em blocos de n dígitos; a cada bloco "descido", escolhe-se o maior dígito β que mantém (10y + β)ⁿ − 10ⁿyⁿ abaixo do resto acumulado, como em uma divisão longa. Cada passo produz exatamente um dígito correto, sem nenhum arredondamento — por isso é útil quando se quer dígitos garantidos de raízes irracionais.',
    complexity: { best: 'O(d) passos', average: 'O(d) passos com inteiros grandes', worst: 'O(d) passos com inteiros grandes', space: 'O(d)' },
    steps: [
      'Separe o número em blocos de n dígitos, a partir da vírgula (completando com zeros à esquerda e com blocos de zeros para as casas decimais).',
      'Comece com a raiz parcial y = 0 e o resto r = 0.',
      'Para cada bloco: c = 10ⁿ·r + bloco.',
      'Escolha o maior dígito β (0 a 9) tal que (10y + β)ⁿ − 10ⁿ·yⁿ ≤ c.',
      'Atualize r = c − [(10y + β)ⁿ − 10ⁿ·yⁿ] e y = 10y + β: o dígito β entrou na resposta.',
    ],
    usedIn: ['Raízes com dígitos garantidos', 'Hardware antigo de calculadoras', 'math.isqrt e raízes inteiras', 'Ensino de aritmética', 'Verificação de dígitos de constantes'],
    realWorld: [
      { title: 'Antes das calculadoras', text: 'Até os anos 1960, estudantes e engenheiros extraíam raízes quadradas no papel com exatamente este procedimento, organizado como uma divisão longa.' },
      { title: 'Hardware digital', text: 'Circuitos de raiz quadrada em processadores e calculadoras antigas usavam variantes dígito a dígito (em base 2), que produzem um bit do resultado por ciclo, sem multiplicadores complexos.' },
      { title: 'Dígitos certificados', text: 'Como cada dígito é exato e nunca muda depois de calculado, o método serve para gerar ou conferir as primeiras casas de constantes como √2 sem se preocupar com erros de arredondamento.' },
    ],
    curiosities: [
      'O livro chinês Os Nove Capítulos sobre a Arte Matemática, compilado por volta do século I, já descrevia procedimentos para raízes quadradas e cúbicas muito parecidos com este.',
      'Em base 2, o dígito só pode ser 0 ou 1, e a escolha vira uma simples comparação — por isso a versão binária é tão usada em hardware.',
      'Diferente de Newton, que melhora todos os dígitos de uma vez, este método fixa um dígito por passo — e nunca precisa voltar atrás.',
    ],
    code: {
      python: String.raw`
        def raiz_digito_a_digito(a, n, casas):
            # raiz n-ésima de um inteiro a, com "casas" casas decimais, só com inteiros
            s = str(a)
            s = "0" * (-len(s) % n) + s  # completa para formar blocos de n dígitos
            blocos = [int(s[i:i + n]) for i in range(0, len(s), n)] + [0] * casas
            base = 10 ** n
            y = r = 0
            for bloco in blocos:
                c = base * r + bloco
                beta = 9
                while (10 * y + beta) ** n - base * y ** n > c:  # maior dígito que cabe
                    beta -= 1
                r = c - ((10 * y + beta) ** n - base * y ** n)
                y = 10 * y + beta
            texto = str(y)
            inteiros = len(s) // n
            return texto[:inteiros] + "." + texto[inteiros:]

        print(raiz_digito_a_digito(2, 2, 15))   # 1.414213562373095
        print(raiz_digito_a_digito(10, 3, 10))  # 2.1544346900
      `,
      javascript: String.raw`
        // BigInt: os números crescem com a quantidade de dígitos pedida.
        function raizDigitoADigito(a, n, casas) {
          let s = String(a);
          s = "0".repeat((n - (s.length % n)) % n) + s; // completa para formar blocos de n dígitos
          const blocos = [];
          for (let i = 0; i < s.length; i += n) blocos.push(BigInt(s.slice(i, i + n)));
          for (let i = 0; i < casas; i++) blocos.push(0n);
          const N = BigInt(n), base = 10n ** N;
          let y = 0n, r = 0n;
          for (const bloco of blocos) {
            const c = base * r + bloco;
            let beta = 9n;
            while ((10n * y + beta) ** N - base * y ** N > c) beta--; // maior dígito que cabe
            r = c - ((10n * y + beta) ** N - base * y ** N);
            y = 10n * y + beta;
          }
          const texto = y.toString(), inteiros = s.length / n;
          return texto.slice(0, inteiros) + "." + texto.slice(inteiros);
        }

        console.log(raizDigitoADigito(2, 2, 15));  // 1.414213562373095
        console.log(raizDigitoADigito(10, 3, 10)); // 2.1544346900
      `,
      java: String.raw`
        import java.math.BigInteger;
        import java.util.ArrayList;
        import java.util.List;

        public class RaizDigitoADigito {
            static String raiz(long a, int n, int casas) {
                String s = Long.toString(a);
                s = "0".repeat((n - s.length() % n) % n) + s; // completa para formar blocos de n dígitos
                List<BigInteger> blocos = new ArrayList<>();
                for (int i = 0; i < s.length(); i += n) blocos.add(new BigInteger(s.substring(i, i + n)));
                for (int i = 0; i < casas; i++) blocos.add(BigInteger.ZERO);
                BigInteger base = BigInteger.TEN.pow(n), dez = BigInteger.TEN, y = BigInteger.ZERO, r = BigInteger.ZERO;
                for (BigInteger bloco : blocos) {
                    BigInteger c = base.multiply(r).add(bloco), termo;
                    int beta = 9;
                    while (true) { // maior dígito que cabe
                        termo = dez.multiply(y).add(BigInteger.valueOf(beta)).pow(n).subtract(base.multiply(y.pow(n)));
                        if (termo.compareTo(c) <= 0) break;
                        beta--;
                    }
                    r = c.subtract(termo);
                    y = dez.multiply(y).add(BigInteger.valueOf(beta));
                }
                String texto = y.toString();
                int inteiros = s.length() / n;
                return texto.substring(0, inteiros) + "." + texto.substring(inteiros);
            }

            public static void main(String[] args) {
                System.out.println(raiz(2, 2, 15));  // 1.414213562373095
                System.out.println(raiz(10, 3, 10)); // 2.1544346900
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        using i128 = __int128; // 128 bits (GCC e Clang): basta para ~38 dígitos nos cálculos

        i128 potencia(i128 b, int n) { i128 r = 1; while (n--) r *= b; return r; }

        string paraTexto(i128 v) {
            string s;
            do { s = char('0' + (int)(v % 10)) + s; v /= 10; } while (v > 0);
            return s;
        }

        string raiz(long long a, int n, int casas) {
            string s = to_string(a);
            s = string((n - s.size() % n) % n, '0') + s; // completa para formar blocos de n dígitos
            vector<i128> blocos;
            for (size_t i = 0; i < s.size(); i += n) blocos.push_back(stoll(s.substr(i, n)));
            blocos.insert(blocos.end(), casas, 0);
            i128 base = potencia(10, n), y = 0, r = 0;
            for (i128 bloco : blocos) {
                i128 c = base * r + bloco;
                int beta = 9;
                while (potencia(10 * y + beta, n) - base * potencia(y, n) > c) beta--; // maior dígito que cabe
                r = c - (potencia(10 * y + beta, n) - base * potencia(y, n));
                y = 10 * y + beta;
            }
            string texto = paraTexto(y);
            size_t inteiros = s.size() / n;
            return texto.substr(0, inteiros) + "." + texto.substr(inteiros);
        }

        int main() {
            cout << raiz(2, 2, 15) << "\n";  // 1.414213562373095
            cout << raiz(10, 3, 10) << "\n"; // 2.1544346900
        }
      `,
    },
  },
  {
    id: 'gauss-jordan',
    name: 'Eliminação de Gauss-Jordan',
    difficulty: 'Intermediário',
    en: { name: 'Gauss-Jordan Elimination', summary: 'Solves systems of linear equations by turning the augmented matrix into the identity, row by row.' },
    facts: { 'Criado por': 'Carl Friedrich Gauss; Wilhelm Jordan', 'Ano': '1810; 1888', 'Registro antigo': 'Os Nove Capítulos (China)', 'Custo': '≈ n³ operações' },
    summary: 'Resolve sistemas de equações lineares transformando a matriz aumentada na identidade, linha a linha.',
    description:
      'A Eliminação de Gauss-Jordan resolve um sistema Ax = b aplicando à matriz aumentada [A | b] três operações que não mudam a solução: trocar linhas, multiplicar uma linha por um número diferente de zero e somar a uma linha um múltiplo de outra. Coluna por coluna, escolhe-se um pivô, divide-se sua linha para que ele vire 1 e zera-se o resto da coluna — acima e abaixo. No fim, a parte esquerda vira a identidade e a coluna da direita é a solução. Com pivoteamento parcial (usar como pivô o maior valor absoluto da coluna), o método fica numericamente estável. Aplicado a [A | I], o mesmo processo produz a inversa A⁻¹.',
    complexity: { best: 'O(n³)', average: 'O(n³)', worst: 'O(n³)', space: 'O(n²)' },
    steps: [
      'Monte a matriz aumentada [A | b], com n linhas e n + 1 colunas.',
      'Para cada coluna c, escolha como pivô a linha (de c para baixo) com o maior |valor| nessa coluna e troque-a com a linha c.',
      'Se o pivô for zero, a matriz é singular: o sistema não tem solução única.',
      'Divida a linha do pivô pelo pivô, para que ele vire 1.',
      'Para todas as outras linhas, subtraia um múltiplo da linha do pivô para zerar a coluna c.',
      'Ao final, a parte esquerda é a identidade e a última coluna contém a solução x.',
    ],
    usedIn: ['Solução de sistemas lineares', 'Cálculo de matrizes inversas', 'Posto e espaço nulo de matrizes', 'Engenharia estrutural e circuitos elétricos', 'Códigos corretores de erro (sobre corpos finitos)'],
    realWorld: [
      { title: 'Circuitos elétricos', text: 'As leis de Kirchhoff transformam um circuito em um sistema linear — uma equação por nó ou malha. Resolvê-lo dá as correntes e tensões de cada componente.' },
      { title: 'Estruturas', text: 'O cálculo de forças em treliças de pontes e prédios gera sistemas lineares; softwares de engenharia os resolvem com variantes da eliminação de Gauss (como a decomposição LU).' },
      { title: 'Códigos e criptografia', text: 'A mesma eliminação, feita com aritmética módulo 2, é usada para decodificar códigos corretores de erro e em ataques algébricos a cifras e ao problema da fatoração (crivo quadrático).' },
    ],
    curiosities: [
      'O método aparece no livro chinês Os Nove Capítulos sobre a Arte Matemática, compilado há cerca de 2 mil anos — com os coeficientes dispostos em colunas em um tabuleiro de contagem.',
      'O nome homenageia Gauss, que o usou em 1810 para calcular a órbita do asteroide Palas, e o geodesista Wilhelm Jordan, que popularizou a variante que zera também acima do pivô em 1888.',
      'Na prática, resolver Ax = b com Gauss-Jordan custa cerca de 50% mais operações que a eliminação de Gauss com substituição regressiva — por isso bibliotecas como o LAPACK preferem a decomposição LU.',
    ],
    code: {
      python: String.raw`
        def gauss_jordan(A, b):
            n = len(A)
            M = [linha[:] + [b[i]] for i, linha in enumerate(A)]  # matriz aumentada
            for c in range(n):
                pivo = max(range(c, n), key=lambda r: abs(M[r][c]))  # pivoteamento parcial
                if abs(M[pivo][c]) < 1e-12:
                    raise ValueError("matriz singular")
                M[c], M[pivo] = M[pivo], M[c]
                p = M[c][c]
                M[c] = [v / p for v in M[c]]          # pivô vira 1
                for r in range(n):
                    if r != c and M[r][c] != 0:       # zera o resto da coluna
                        fator = M[r][c]
                        M[r] = [vr - fator * vc for vr, vc in zip(M[r], M[c])]
            return [linha[n] for linha in M]

        A = [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]]
        b = [8, -11, -3]
        print(" ".join(f"{x:.4f}" for x in gauss_jordan(A, b)))  # 2.0000 3.0000 -1.0000
      `,
      javascript: String.raw`
        function gaussJordan(A, b) {
          const n = A.length;
          const M = A.map((linha, i) => [...linha, b[i]]); // matriz aumentada
          for (let c = 0; c < n; c++) {
            let pivo = c; // pivoteamento parcial
            for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[pivo][c])) pivo = r;
            if (Math.abs(M[pivo][c]) < 1e-12) throw new Error("matriz singular");
            [M[c], M[pivo]] = [M[pivo], M[c]];
            const p = M[c][c];
            M[c] = M[c].map(v => v / p); // pivô vira 1
            for (let r = 0; r < n; r++) {
              if (r === c || M[r][c] === 0) continue; // zera o resto da coluna
              const fator = M[r][c];
              M[r] = M[r].map((v, j) => v - fator * M[c][j]);
            }
          }
          return M.map(linha => linha[n]);
        }

        const A = [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]];
        const b = [8, -11, -3];
        console.log(gaussJordan(A, b).map(x => x.toFixed(4)).join(" ")); // 2.0000 3.0000 -1.0000
      `,
      java: String.raw`
        import java.util.Locale;

        public class GaussJordan {
            static double[] resolver(double[][] A, double[] b) {
                int n = A.length;
                double[][] M = new double[n][n + 1]; // matriz aumentada
                for (int i = 0; i < n; i++) {
                    System.arraycopy(A[i], 0, M[i], 0, n);
                    M[i][n] = b[i];
                }
                for (int c = 0; c < n; c++) {
                    int pivo = c; // pivoteamento parcial
                    for (int r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[pivo][c])) pivo = r;
                    if (Math.abs(M[pivo][c]) < 1e-12) throw new ArithmeticException("matriz singular");
                    double[] tmp = M[c]; M[c] = M[pivo]; M[pivo] = tmp;
                    double p = M[c][c];
                    for (int j = 0; j <= n; j++) M[c][j] /= p; // pivô vira 1
                    for (int r = 0; r < n; r++) {
                        if (r == c || M[r][c] == 0) continue; // zera o resto da coluna
                        double fator = M[r][c];
                        for (int j = 0; j <= n; j++) M[r][j] -= fator * M[c][j];
                    }
                }
                double[] x = new double[n];
                for (int i = 0; i < n; i++) x[i] = M[i][n];
                return x;
            }

            public static void main(String[] args) {
                double[][] A = {{2, 1, -1}, {-3, -1, 2}, {-2, 1, 2}};
                double[] b = {8, -11, -3};
                StringBuilder sb = new StringBuilder();
                for (double x : resolver(A, b)) sb.append(String.format(Locale.ROOT, "%.4f ", x));
                System.out.println(sb.toString().trim()); // 2.0000 3.0000 -1.0000
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>
        #include <stdexcept>
        #include <utility>
        #include <vector>
        using namespace std;

        vector<double> gaussJordan(vector<vector<double>> A, const vector<double>& b) {
            int n = A.size();
            for (int i = 0; i < n; i++) A[i].push_back(b[i]); // matriz aumentada
            for (int c = 0; c < n; c++) {
                int pivo = c; // pivoteamento parcial
                for (int r = c + 1; r < n; r++) if (fabs(A[r][c]) > fabs(A[pivo][c])) pivo = r;
                if (fabs(A[pivo][c]) < 1e-12) throw runtime_error("matriz singular");
                swap(A[c], A[pivo]);
                double p = A[c][c];
                for (double& v : A[c]) v /= p; // pivô vira 1
                for (int r = 0; r < n; r++) {
                    if (r == c || A[r][c] == 0) continue; // zera o resto da coluna
                    double fator = A[r][c];
                    for (int j = 0; j <= n; j++) A[r][j] -= fator * A[c][j];
                }
            }
            vector<double> x(n);
            for (int i = 0; i < n; i++) x[i] = A[i][n];
            return x;
        }

        int main() {
            vector<vector<double>> A = {{2, 1, -1}, {-3, -1, 2}, {-2, 1, 2}};
            for (double x : gaussJordan(A, {8, -11, -3})) printf("%.4f ", x);
            printf("\n"); // 2.0000 3.0000 -1.0000
        }
      `,
    },
  },
  {
    id: 'de-casteljau',
    name: 'Algoritmo de De Casteljau',
    difficulty: 'Intermediário',
    en: { name: "De Casteljau's Algorithm", summary: 'Draws Bézier curves by repeatedly splitting segments in the same ratio t — geometric, simple and numerically stable.' },
    facts: { 'Criado por': 'Paul de Casteljau (Citroën)', 'Ano': '1959', 'Curvas': 'Bézier', 'Custo por ponto': 'O(n²)' },
    summary: 'Desenha curvas de Bézier dividindo segmentos, repetidamente, na mesma proporção t — geométrico, simples e estável.',
    description:
      'Uma curva de Bézier é definida por pontos de controle P₀, …, Pₙ: ela começa em P₀, termina em Pₙ e é "puxada" pelos pontos do meio. O algoritmo de De Casteljau calcula o ponto da curva no parâmetro t (de 0 a 1) só com interpolações lineares: divide cada segmento do polígono de controle na proporção t, obtendo n novos pontos; repete com eles, obtendo n − 1; e assim por diante, até sobrar um único ponto — que está na curva. Variando t de 0 a 1, o ponto desenha a curva inteira. Por usar apenas médias ponderadas de pontos, é numericamente muito estável, e os pontos intermediários ainda dividem a curva em duas curvas de Bézier menores.',
    complexity: { best: 'O(n²) por ponto', average: 'O(n²) por ponto', worst: 'O(n²) por ponto', space: 'O(n)' },
    steps: [
      'Comece com os n + 1 pontos de controle e um parâmetro t entre 0 e 1.',
      'Em cada segmento entre pontos vizinhos, marque o ponto que fica a uma fração t do caminho: (1 − t)·Pᵢ + t·Pᵢ₊₁.',
      'Os novos pontos formam um polígono com um vértice a menos; repita a interpolação nele.',
      'Após n rodadas sobra um único ponto: ele é B(t), o ponto da curva.',
      'Repita para vários valores de t para desenhar a curva — ou use os pontos intermediários para dividi-la em duas.',
    ],
    usedIn: ['Fontes tipográficas (TrueType, PostScript, OpenType)', 'Editores vetoriais (Illustrator, Inkscape, Figma)', 'SVG, Canvas e PDF', 'Animações e curvas de easing (CSS cubic-bezier)', 'CAD e design de carrocerias'],
    realWorld: [
      { title: 'Cada letra desta página', text: 'Fontes TrueType são feitas de curvas de Bézier quadráticas, e fontes PostScript/OpenType CFF, de cúbicas. Para desenhar cada letra na tela, o sistema avalia ou subdivide essas curvas.' },
      { title: 'Caneta dos editores vetoriais', text: 'A ferramenta "caneta" do Illustrator, Figma e Inkscape cria curvas de Bézier cúbicas; as alças que você arrasta são os pontos de controle P₁ e P₂.' },
      { title: 'Animações na web', text: 'A função cubic-bezier() do CSS define a aceleração das animações com uma curva de Bézier cúbica — ease-in-out, por exemplo, é cubic-bezier(0.42, 0, 0.58, 1).' },
    ],
    curiosities: [
      'Paul de Casteljau desenvolveu o algoritmo em 1959 na Citroën, mas a empresa o manteve em segredo industrial. Pierre Bézier, da Renault, publicou ideias equivalentes nos anos 1960 — e por isso as curvas levam o nome dele.',
      'As curvas de Bézier são escritas com os polinômios de Bernstein, criados por Sergei Bernstein em 1912 para provar o teorema de aproximação de Weierstrass — quase 50 anos antes de serem usados no design de carros.',
      'A curva sempre fica dentro do "fecho convexo" dos pontos de controle — por isso, testar se o fecho convexo cruza algo é um atalho rápido em detecção de colisão e renderização.',
    ],
    code: {
      python: String.raw`
        def de_casteljau(pontos, t):
            pts = [tuple(p) for p in pontos]
            while len(pts) > 1:  # cada rodada tem um ponto a menos
                pts = [((1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1])
                       for a, b in zip(pts, pts[1:])]
            return pts[0]

        controle = [(0, 0), (1, 2), (3, 3), (4, 0)]  # Bézier cúbica
        for t in (0, 0.5, 1):
            x, y = de_casteljau(controle, t)
            print(f"{x:.4f} {y:.4f}")
        # 0.0000 0.0000
        # 2.0000 1.8750
        # 4.0000 0.0000
      `,
      javascript: String.raw`
        function deCasteljau(pontos, t) {
          let pts = pontos.map(p => [...p]);
          while (pts.length > 1) { // cada rodada tem um ponto a menos
            const proximos = [];
            for (let i = 0; i + 1 < pts.length; i++) {
              const [a, b] = [pts[i], pts[i + 1]];
              proximos.push([(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]]);
            }
            pts = proximos;
          }
          return pts[0];
        }

        const controle = [[0, 0], [1, 2], [3, 3], [4, 0]]; // Bézier cúbica
        for (const t of [0, 0.5, 1]) {
          const [x, y] = deCasteljau(controle, t);
          console.log(x.toFixed(4) + " " + y.toFixed(4));
        }
        // 0.0000 0.0000
        // 2.0000 1.8750
        // 4.0000 0.0000
      `,
      java: String.raw`
        import java.util.Locale;

        public class DeCasteljau {
            static double[] avaliar(double[][] pontos, double t) {
                int n = pontos.length;
                double[][] pts = new double[n][];
                for (int i = 0; i < n; i++) pts[i] = pontos[i].clone();
                for (int k = n - 1; k > 0; k--) // cada rodada tem um ponto a menos
                    for (int i = 0; i < k; i++)
                        for (int d = 0; d < 2; d++)
                            pts[i][d] = (1 - t) * pts[i][d] + t * pts[i + 1][d];
                return pts[0];
            }

            public static void main(String[] args) {
                double[][] controle = {{0, 0}, {1, 2}, {3, 3}, {4, 0}}; // Bézier cúbica
                for (double t : new double[]{0, 0.5, 1}) {
                    double[] p = avaliar(controle, t);
                    System.out.println(String.format(Locale.ROOT, "%.4f %.4f", p[0], p[1]));
                }
                // 0.0000 0.0000
                // 2.0000 1.8750
                // 4.0000 0.0000
            }
        }
      `,
      cpp: String.raw`
        #include <array>
        #include <cstdio>
        #include <vector>
        using namespace std;

        using Ponto = array<double, 2>;

        Ponto deCasteljau(vector<Ponto> pts, double t) {
            for (size_t k = pts.size() - 1; k > 0; k--) // cada rodada tem um ponto a menos
                for (size_t i = 0; i < k; i++)
                    for (int d = 0; d < 2; d++)
                        pts[i][d] = (1 - t) * pts[i][d] + t * pts[i + 1][d];
            return pts[0];
        }

        int main() {
            vector<Ponto> controle = {{0, 0}, {1, 2}, {3, 3}, {4, 0}}; // Bézier cúbica
            for (double t : {0.0, 0.5, 1.0}) {
                Ponto p = deCasteljau(controle, t);
                printf("%.4f %.4f\n", p[0], p[1]);
            }
            // 0.0000 0.0000
            // 2.0000 1.8750
            // 4.0000 0.0000
        }
      `,
    },
  },
  {
    id: 'gram-schmidt',
    name: 'Processo de Gram-Schmidt',
    difficulty: 'Intermediário',
    en: { name: 'Gram-Schmidt Process', summary: 'Turns any set of independent vectors into an orthonormal basis by subtracting projections one by one.' },
    facts: { 'Criado por': 'Jørgen Pedersen Gram; Erhard Schmidt', 'Ano': '1883; 1907', 'Produz': 'Base ortonormal (decomposição QR)', 'Custo': 'O(m·n²)' },
    summary: 'Transforma vetores independentes em uma base ortonormal, subtraindo projeções uma a uma.',
    description:
      'O Processo de Gram-Schmidt recebe vetores linearmente independentes v₁, …, vₙ e produz vetores e₁, …, eₙ perpendiculares entre si, de comprimento 1, que geram o mesmo espaço. A ideia é tirar de cada vetor a "sombra" que ele projeta sobre os anteriores: u₂ = v₂ − (v₂·e₁)e₁ já é perpendicular a e₁, e basta dividi-lo pelo comprimento. Fazendo isso em ordem, cada novo vetor perde suas componentes nas direções já existentes. A versão "modificada", que subtrai as projeções uma de cada vez, é bem mais estável em ponto flutuante. Guardando os coeficientes, o processo dá a decomposição QR de uma matriz.',
    complexity: { best: 'O(m·n²)', average: 'O(m·n²)', worst: 'O(m·n²)', space: 'O(m·n)' },
    steps: [
      'Normalize o primeiro vetor: e₁ = v₁ / ‖v₁‖.',
      'Para o próximo vetor vₖ, calcule a projeção sobre cada eᵢ já obtido: (vₖ·eᵢ)·eᵢ.',
      'Subtraia essas projeções: uₖ = vₖ − Σ (vₖ·eᵢ)·eᵢ. O resíduo uₖ é perpendicular a todos os eᵢ.',
      'Se ‖uₖ‖ for (quase) zero, vₖ dependia dos anteriores; senão, normalize: eₖ = uₖ / ‖uₖ‖.',
      'Na versão modificada, atualize uₖ após cada projeção, usando o vetor já corrigido no próximo produto escalar.',
    ],
    usedIn: ['Decomposição QR', 'Mínimos quadrados e regressão linear', 'Métodos de Krylov (Arnoldi, GMRES)', 'Gráficos 3D (bases de câmera e tangentes)', 'Química quântica e processamento de sinais'],
    realWorld: [
      { title: 'Regressão linear', text: 'Ajustar uma reta ou um modelo linear por mínimos quadrados é mais estável via decomposição QR do que pelas equações normais — e o QR pode ser obtido com Gram-Schmidt (ou com reflexões de Householder).' },
      { title: 'Gráficos 3D', text: 'Para iluminar texturas com normal maps, os motores de jogos montam em cada vértice uma base tangente-bitangente-normal; a tangente é ortogonalizada em relação à normal com um passo de Gram-Schmidt.' },
      { title: 'Solvers iterativos', text: 'O método GMRES, usado para resolver sistemas lineares enormes e esparsos em simulações, constrói uma base ortonormal do espaço de Krylov com o processo de Arnoldi — um Gram-Schmidt modificado.' },
    ],
    curiosities: [
      'Laplace já usava a ideia em 1812, muito antes de Gram (1883) e Schmidt (1907). Schmidt, aliás, deu o crédito a Gram em seu artigo, e é por isso que o nome dos dois aparece junto.',
      'A versão clássica e a modificada são idênticas em aritmética exata, mas em ponto flutuante a clássica pode perder quase toda a ortogonalidade quando os vetores são quase paralelos.',
      'O mesmo processo funciona com funções no lugar de vetores: aplicado a 1, x, x², x³… com a integral como produto escalar, ele gera os polinômios de Legendre.',
    ],
    code: {
      python: String.raw`
        import math

        def gram_schmidt(vetores):
            base = []
            for v in vetores:
                u = list(v)
                for e in base:  # Gram-Schmidt modificado: subtrai uma projeção por vez
                    proj = sum(a * b for a, b in zip(u, e))
                    u = [a - proj * b for a, b in zip(u, e)]
                norma = math.sqrt(sum(a * a for a in u))
                if norma < 1e-12:
                    raise ValueError("vetores linearmente dependentes")
                base.append([a / norma for a in u])
            return base

        for e in gram_schmidt([[1, 1, 0], [1, 0, 1], [0, 1, 1]]):
            print(" ".join(f"{x:.4f}" for x in e))
        # 0.7071 0.7071 0.0000
        # 0.4082 -0.4082 0.8165
        # -0.5774 0.5774 0.5774
      `,
      javascript: String.raw`
        function gramSchmidt(vetores) {
          const base = [];
          for (const v of vetores) {
            let u = [...v];
            for (const e of base) { // Gram-Schmidt modificado: subtrai uma projeção por vez
              const proj = u.reduce((s, a, i) => s + a * e[i], 0);
              u = u.map((a, i) => a - proj * e[i]);
            }
            const norma = Math.hypot(...u);
            if (norma < 1e-12) throw new Error("vetores linearmente dependentes");
            base.push(u.map(a => a / norma));
          }
          return base;
        }

        for (const e of gramSchmidt([[1, 1, 0], [1, 0, 1], [0, 1, 1]])) {
          console.log(e.map(x => x.toFixed(4)).join(" "));
        }
        // 0.7071 0.7071 0.0000
        // 0.4082 -0.4082 0.8165
        // -0.5774 0.5774 0.5774
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Locale;

        public class GramSchmidt {
            static List<double[]> ortonormalizar(double[][] vetores) {
                List<double[]> base = new ArrayList<>();
                for (double[] v : vetores) {
                    double[] u = v.clone();
                    for (double[] e : base) { // Gram-Schmidt modificado: subtrai uma projeção por vez
                        double proj = 0;
                        for (int i = 0; i < u.length; i++) proj += u[i] * e[i];
                        for (int i = 0; i < u.length; i++) u[i] -= proj * e[i];
                    }
                    double norma = 0;
                    for (double a : u) norma += a * a;
                    norma = Math.sqrt(norma);
                    if (norma < 1e-12) throw new ArithmeticException("vetores linearmente dependentes");
                    for (int i = 0; i < u.length; i++) u[i] /= norma;
                    base.add(u);
                }
                return base;
            }

            public static void main(String[] args) {
                for (double[] e : ortonormalizar(new double[][]{{1, 1, 0}, {1, 0, 1}, {0, 1, 1}})) {
                    System.out.println(String.format(Locale.ROOT, "%.4f %.4f %.4f", e[0], e[1], e[2]));
                }
                // 0.7071 0.7071 0.0000
                // 0.4082 -0.4082 0.8165
                // -0.5774 0.5774 0.5774
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>
        #include <stdexcept>
        #include <vector>
        using namespace std;

        vector<vector<double>> gramSchmidt(const vector<vector<double>>& vetores) {
            vector<vector<double>> base;
            for (vector<double> u : vetores) {
                for (const auto& e : base) { // Gram-Schmidt modificado: subtrai uma projeção por vez
                    double proj = 0;
                    for (size_t i = 0; i < u.size(); i++) proj += u[i] * e[i];
                    for (size_t i = 0; i < u.size(); i++) u[i] -= proj * e[i];
                }
                double norma = 0;
                for (double a : u) norma += a * a;
                norma = sqrt(norma);
                if (norma < 1e-12) throw runtime_error("vetores linearmente dependentes");
                for (double& a : u) a /= norma;
                base.push_back(u);
            }
            return base;
        }

        int main() {
            for (const auto& e : gramSchmidt({{1, 1, 0}, {1, 0, 1}, {0, 1, 1}}))
                printf("%.4f %.4f %.4f\n", e[0], e[1], e[2]);
            // 0.7071 0.7071 0.0000
            // 0.4082 -0.4082 0.8165
            // -0.5774 0.5774 0.5774
        }
      `,
    },
  },
  {
    id: 'de-boor',
    name: 'Algoritmo de De Boor',
    difficulty: 'Avançado',
    en: { name: "De Boor's Algorithm", summary: 'Evaluates B-spline curves — smooth curves with local control — through a short cascade of interpolations.' },
    facts: { 'Criado por': 'Carl de Boor', 'Ano': '1972', 'Curvas': 'B-splines e NURBS', 'Custo por ponto': 'O(p²)' },
    summary: 'Avalia curvas B-spline — suaves e com controle local — com uma pequena cascata de interpolações.',
    description:
      'Uma B-spline de grau p é uma curva suave feita de vários trechos polinomiais emendados, controlada por pontos de controle e por um vetor de nós que diz onde cada trecho começa. A grande vantagem sobre uma única curva de Bézier é o controle local: mover um ponto altera apenas um pedaço da curva. O algoritmo de De Boor generaliza o de De Casteljau: para avaliar a curva em t, encontra o intervalo de nós que contém t, pega só os p + 1 pontos de controle que influenciam esse trecho e faz p rodadas de interpolações lineares, com pesos dados pelos nós. O último ponto que sobra está na curva.',
    complexity: { best: 'O(p²) por ponto', average: 'O(p²) por ponto', worst: 'O(p²) por ponto', space: 'O(p)' },
    steps: [
      'Dados os pontos de controle, o grau p e o vetor de nós, encontre o índice k tal que nóₖ ≤ t < nóₖ₊₁.',
      'Separe os p + 1 pontos de controle que afetam esse trecho: dₖ₋ₚ, …, dₖ.',
      'Na rodada r (de 1 a p), para j de k até k − p + r, calcule α = (t − nóⱼ) / (nóⱼ₊ₚ₊₁₋ᵣ − nóⱼ).',
      'Substitua dⱼ por (1 − α)·dⱼ₋₁ + α·dⱼ — uma interpolação linear, como no De Casteljau.',
      'Após p rodadas, dₖ é o ponto da curva em t. Com nós "presos" (repetidos p + 1 vezes nas pontas), a curva começa no primeiro ponto e termina no último.',
    ],
    usedIn: ['CAD/CAM (SolidWorks, CATIA, AutoCAD)', 'NURBS em modelagem 3D (Rhino, Maya, Blender)', 'Formato de troca IGES/STEP', 'Usinagem CNC', 'Interpolação e ajuste de dados'],
    realWorld: [
      { title: 'Indústria automotiva e aeronáutica', text: 'Carrocerias, asas e cascos de navios são modelados com NURBS (B-splines racionais). Programas como CATIA e SolidWorks avaliam essas superfícies com o algoritmo de De Boor.' },
      { title: 'Usinagem', text: 'Máquinas CNC modernas recebem trajetórias como B-splines em vez de milhares de segmentos retos, o que gera movimentos mais suaves e peças com melhor acabamento.' },
      { title: 'Animação', text: 'Trajetórias de câmera e curvas de animação em softwares 3D costumam ser splines: a suavidade garante movimentos sem trancos, e o controle local permite ajustar um trecho sem estragar o resto.' },
    ],
    curiosities: [
      'Carl de Boor publicou o algoritmo em 1972; no mesmo ano, Maurice Cox chegou de forma independente à fórmula recursiva das funções de base — hoje chamada de recursão de Cox-de Boor.',
      'O nome "spline" vem das réguas flexíveis de madeira que desenhistas navais curvavam com pesos de chumbo (os "patos") para traçar o casco dos navios.',
      'Uma B-spline com p + 1 pontos de controle e nós presos é exatamente uma curva de Bézier — e, nesse caso, o algoritmo de De Boor vira o de De Casteljau. Teste no visualizador com 4 pontos e grau 3.',
    ],
    code: {
      python: String.raw`
        def nos_presos(n_pontos, p):
            # nós repetidos p + 1 vezes nas pontas: a curva passa pelo primeiro e pelo último ponto
            internos = n_pontos - p - 1
            return [0.0] * (p + 1) + [i / (internos + 1) for i in range(1, internos + 1)] + [1.0] * (p + 1)

        def de_boor(pontos, p, nos, t):
            k = p  # intervalo de nós com nos[k] <= t < nos[k + 1]
            while k < len(pontos) - 1 and t >= nos[k + 1]:
                k += 1
            d = [list(pontos[j + k - p]) for j in range(p + 1)]
            for r in range(1, p + 1):
                for j in range(p, r - 1, -1):
                    i = j + k - p
                    alfa = (t - nos[i]) / (nos[i + p + 1 - r] - nos[i])
                    d[j] = [(1 - alfa) * a + alfa * b for a, b in zip(d[j - 1], d[j])]
            return d[p]

        controle = [(0, 0), (1, 2), (3, 3), (4, 0), (6, 1)]
        nos = nos_presos(len(controle), 3)  # B-spline cúbica: [0, 0, 0, 0, 0.5, 1, 1, 1, 1]
        for t in (0, 0.25, 0.5, 1):
            x, y = de_boor(controle, 3, nos, t)
            print(f"{x:.4f} {y:.4f}")
        # 0.0000 0.0000
        # 1.4688 1.9375
        # 2.7500 2.0000
        # 6.0000 1.0000
      `,
      javascript: String.raw`
        function nosPresos(nPontos, p) {
          // nós repetidos p + 1 vezes nas pontas: a curva passa pelo primeiro e pelo último ponto
          const internos = nPontos - p - 1, nos = Array(p + 1).fill(0);
          for (let i = 1; i <= internos; i++) nos.push(i / (internos + 1));
          return nos.concat(Array(p + 1).fill(1));
        }

        function deBoor(pontos, p, nos, t) {
          let k = p; // intervalo de nós com nos[k] <= t < nos[k + 1]
          while (k < pontos.length - 1 && t >= nos[k + 1]) k++;
          const d = [];
          for (let j = 0; j <= p; j++) d.push([...pontos[j + k - p]]);
          for (let r = 1; r <= p; r++) {
            for (let j = p; j >= r; j--) {
              const i = j + k - p;
              const alfa = (t - nos[i]) / (nos[i + p + 1 - r] - nos[i]);
              d[j] = d[j].map((b, c) => (1 - alfa) * d[j - 1][c] + alfa * b);
            }
          }
          return d[p];
        }

        const controle = [[0, 0], [1, 2], [3, 3], [4, 0], [6, 1]];
        const nos = nosPresos(controle.length, 3); // B-spline cúbica: [0, 0, 0, 0, 0.5, 1, 1, 1, 1]
        for (const t of [0, 0.25, 0.5, 1]) {
          const [x, y] = deBoor(controle, 3, nos, t);
          console.log(x.toFixed(4) + " " + y.toFixed(4));
        }
        // 0.0000 0.0000
        // 1.4688 1.9375
        // 2.7500 2.0000
        // 6.0000 1.0000
      `,
      java: String.raw`
        import java.util.Locale;

        public class DeBoor {
            static double[] nosPresos(int nPontos, int p) {
                // nós repetidos p + 1 vezes nas pontas: a curva passa pelo primeiro e pelo último ponto
                int internos = nPontos - p - 1;
                double[] nos = new double[nPontos + p + 1];
                for (int i = 1; i <= internos; i++) nos[p + i] = (double) i / (internos + 1);
                for (int i = nPontos; i < nos.length; i++) nos[i] = 1;
                return nos;
            }

            static double[] deBoor(double[][] pontos, int p, double[] nos, double t) {
                int k = p; // intervalo de nós com nos[k] <= t < nos[k + 1]
                while (k < pontos.length - 1 && t >= nos[k + 1]) k++;
                double[][] d = new double[p + 1][];
                for (int j = 0; j <= p; j++) d[j] = pontos[j + k - p].clone();
                for (int r = 1; r <= p; r++) {
                    for (int j = p; j >= r; j--) {
                        int i = j + k - p;
                        double alfa = (t - nos[i]) / (nos[i + p + 1 - r] - nos[i]);
                        for (int c = 0; c < 2; c++) d[j][c] = (1 - alfa) * d[j - 1][c] + alfa * d[j][c];
                    }
                }
                return d[p];
            }

            public static void main(String[] args) {
                double[][] controle = {{0, 0}, {1, 2}, {3, 3}, {4, 0}, {6, 1}};
                double[] nos = nosPresos(controle.length, 3); // B-spline cúbica: [0, 0, 0, 0, 0.5, 1, 1, 1, 1]
                for (double t : new double[]{0, 0.25, 0.5, 1}) {
                    double[] q = deBoor(controle, 3, nos, t);
                    System.out.println(String.format(Locale.ROOT, "%.4f %.4f", q[0], q[1]));
                }
                // 0.0000 0.0000
                // 1.4688 1.9375
                // 2.7500 2.0000
                // 6.0000 1.0000
            }
        }
      `,
      cpp: String.raw`
        #include <array>
        #include <cstdio>
        #include <vector>
        using namespace std;

        using Ponto = array<double, 2>;

        vector<double> nosPresos(int nPontos, int p) {
            // nós repetidos p + 1 vezes nas pontas: a curva passa pelo primeiro e pelo último ponto
            int internos = nPontos - p - 1;
            vector<double> nos(p + 1, 0.0);
            for (int i = 1; i <= internos; i++) nos.push_back((double)i / (internos + 1));
            nos.insert(nos.end(), p + 1, 1.0);
            return nos;
        }

        Ponto deBoor(const vector<Ponto>& pontos, int p, const vector<double>& nos, double t) {
            int k = p; // intervalo de nós com nos[k] <= t < nos[k + 1]
            while (k < (int)pontos.size() - 1 && t >= nos[k + 1]) k++;
            vector<Ponto> d(pontos.begin() + (k - p), pontos.begin() + (k + 1));
            for (int r = 1; r <= p; r++) {
                for (int j = p; j >= r; j--) {
                    int i = j + k - p;
                    double alfa = (t - nos[i]) / (nos[i + p + 1 - r] - nos[i]);
                    for (int c = 0; c < 2; c++) d[j][c] = (1 - alfa) * d[j - 1][c] + alfa * d[j][c];
                }
            }
            return d[p];
        }

        int main() {
            vector<Ponto> controle = {{0, 0}, {1, 2}, {3, 3}, {4, 0}, {6, 1}};
            vector<double> nos = nosPresos(controle.size(), 3); // B-spline cúbica: [0, 0, 0, 0, 0.5, 1, 1, 1, 1]
            for (double t : {0.0, 0.25, 0.5, 1.0}) {
                Ponto q = deBoor(controle, 3, nos, t);
                printf("%.4f %.4f\n", q[0], q[1]);
            }
            // 0.0000 0.0000
            // 1.4688 1.9375
            // 2.7500 2.0000
            // 6.0000 1.0000
        }
      `,
    },
  },
  {
    id: 'gauss-legendre',
    name: 'Algoritmo de Gauss-Legendre (π)',
    difficulty: 'Avançado',
    en: { name: 'Gauss-Legendre Algorithm (π)', summary: 'Computes the digits of π using the arithmetic-geometric mean — each iteration doubles the correct digits.' },
    facts: { 'Criado por': 'Gauss, Legendre; Salamin e Brent', 'Ano': '1975 (forma moderna)', 'Também chamado': 'Algoritmo de Brent-Salamin', 'Convergência': 'Quadrática' },
    summary: 'Calcula os dígitos de π com a média aritmético-geométrica — cada iteração dobra os dígitos corretos.',
    description:
      'O algoritmo de Gauss-Legendre (ou Brent-Salamin) calcula π a partir da média aritmético-geométrica, estudada por Gauss e Legendre no século XIX. Começa com a = 1, b = 1/√2, t = 1/4 e p = 1 e, a cada passo, troca a e b pela média aritmética e pela média geométrica deles, corrigindo t com a diferença entre o a antigo e o novo. As duas médias se aproximam muito rápido, e (a + b)² / 4t converge para π com convergência quadrática: 1, 3, 8, 19, 41, 84, 171… dígitos corretos. Com aritmética de precisão arbitrária, 25 iterações dão dezenas de milhões de dígitos.',
    complexity: { best: 'O(log d) iterações', average: 'O(M(d)·log d)', worst: 'O(M(d)·log d)', space: 'O(d)' },
    steps: [
      'Comece com a = 1, b = 1/√2, t = 1/4 e p = 1, usando aritmética com d dígitos de precisão (mais uma margem).',
      'Calcule a média aritmética aₙ = (a + b) / 2 e a geométrica b = √(a·b).',
      'Atualize t ← t − p·(a − aₙ)², depois a ← aₙ e p ← 2p.',
      'Repita cerca de log₂(d) vezes: o número de dígitos corretos dobra a cada iteração.',
      'A aproximação de π é (a + b)² / (4t).',
    ],
    usedIn: ['Recordes de cálculo de π', 'Bibliotecas de precisão arbitrária (MPFR)', 'Testes de estresse de hardware e compiladores', 'Funções elementares de alta precisão (log, exp)', 'Pesquisa em teoria dos números computacional'],
    realWorld: [
      { title: 'Recordes de π', text: 'Em 1999, Yasumasa Kanada calculou mais de 206 bilhões de dígitos de π com o Gauss-Legendre e conferiu o resultado com o algoritmo de Borwein. Hoje os recordes usam a série de Chudnovsky, mas a média aritmético-geométrica continua no centro de muitos cálculos de alta precisão.' },
      { title: 'Logaritmos rápidos', text: 'A mesma média aritmético-geométrica calcula logaritmos com milhões de dígitos em tempo quase linear; bibliotecas como a MPFR a usam para log() em precisão muito alta.' },
      { title: 'Testar computadores', text: 'Calcular milhões de dígitos de π é um clássico teste de estabilidade de processadores e memória (o SuperPi, popular entre overclockers, usa exatamente o Gauss-Legendre).' },
    ],
    curiosities: [
      'Gauss descobriu a média aritmético-geométrica aos 14 anos e, em 1799, anotou em seu diário a sua relação com integrais elípticas. A conexão com π só virou algoritmo em 1975, com Eugene Salamin e Richard Brent, de forma independente.',
      'O programa SuperPi, usado para medir a velocidade de PCs desde 1995, calcula até 32 milhões de dígitos de π usando o Gauss-Legendre.',
      'A primeira iteração já dá 3,140…; a segunda, 3,14159264…; a terceira acerta 19 casas. Com só 5 iterações, você tem mais dígitos do que qualquer aplicação física precisa — 40 dígitos de π bastam para medir o universo observável com precisão menor que um átomo de hidrogênio.',
    ],
    code: {
      python: String.raw`
        from decimal import Decimal, getcontext
        import math

        def pi_gauss_legendre(digitos):
            getcontext().prec = digitos + 10  # margem para erros de arredondamento
            a, b = Decimal(1), 1 / Decimal(2).sqrt()
            t, p = Decimal(1) / 4, Decimal(1)
            for _ in range(math.ceil(math.log2(digitos)) + 1):  # dígitos dobram a cada iteração
                a_novo = (a + b) / 2
                b = (a * b).sqrt()
                t -= p * (a - a_novo) ** 2
                a, p = a_novo, 2 * p
            return str((a + b) ** 2 / (4 * t))[:digitos + 2]

        print(pi_gauss_legendre(50))
        # 3.14159265358979323846264338327950288419716939937510
      `,
      javascript: String.raw`
        // Ponto fixo com BigInt: um número x é guardado como x * 10^(digitos + 10).
        function raizInteira(n) {
          if (n < 2n) return n;
          let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2));
          while (true) { // Newton para inteiros
            const y = (x + n / x) / 2n;
            if (y >= x) return x;
            x = y;
          }
        }

        function piGaussLegendre(digitos) {
          const S = 10n ** BigInt(digitos + 10); // margem para erros de arredondamento
          let a = S, b = raizInteira(S * S / 2n), t = S / 4n, p = 1n;
          for (let i = 0; i < Math.ceil(Math.log2(digitos)) + 1; i++) { // dígitos dobram a cada iteração
            const aNovo = (a + b) / 2n;
            b = raizInteira(a * b);
            t -= p * (a - aNovo) ** 2n / S;
            a = aNovo;
            p *= 2n;
          }
          const pi = ((a + b) ** 2n / (4n * t)).toString();
          return pi[0] + "." + pi.slice(1, digitos + 1);
        }

        console.log(piGaussLegendre(50));
        // 3.14159265358979323846264338327950288419716939937510
      `,
      java: String.raw`
        import java.math.BigDecimal;
        import java.math.MathContext;

        public class GaussLegendre {
            static String pi(int digitos) {
                MathContext mc = new MathContext(digitos + 10); // margem para erros de arredondamento
                BigDecimal dois = BigDecimal.valueOf(2);
                BigDecimal a = BigDecimal.ONE;
                BigDecimal b = BigDecimal.ONE.divide(dois.sqrt(mc), mc);
                BigDecimal t = new BigDecimal("0.25"), p = BigDecimal.ONE;
                int iteracoes = (int) Math.ceil(Math.log(digitos) / Math.log(2)) + 1;
                for (int i = 0; i < iteracoes; i++) { // dígitos dobram a cada iteração
                    BigDecimal aNovo = a.add(b).divide(dois, mc);
                    b = a.multiply(b, mc).sqrt(mc);
                    t = t.subtract(p.multiply(a.subtract(aNovo).pow(2, mc), mc), mc);
                    a = aNovo;
                    p = p.multiply(dois);
                }
                BigDecimal pi = a.add(b).pow(2, mc).divide(t.multiply(BigDecimal.valueOf(4)), mc);
                return pi.toPlainString().substring(0, digitos + 2);
            }

            public static void main(String[] args) {
                System.out.println(pi(50));
                // 3.14159265358979323846264338327950288419716939937510
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>

        // Com double (≈ 16 dígitos), 3 iterações já esgotam a precisão.
        // Para mais dígitos, use uma biblioteca de precisão arbitrária, como a GMP/MPFR.
        int main() {
            double a = 1, b = 1 / std::sqrt(2.0), t = 0.25, p = 1;
            for (int i = 0; i < 3; i++) {
                double aNovo = (a + b) / 2;
                b = std::sqrt(a * b);
                t -= p * (a - aNovo) * (a - aNovo);
                a = aNovo;
                p *= 2;
                std::printf("%d: %.15f\n", i + 1, (a + b) * (a + b) / (4 * t));
            }
            // 1: 3.140579250522169
            // 2: 3.141592646213543
            // 3: 3.141592653589794
        }
      `,
    },
  },
  {
    id: 'power-iteration',
    name: 'Método da Potência',
    difficulty: 'Avançado',
    en: { name: 'Power Iteration', summary: 'Finds the dominant eigenvalue and eigenvector of a matrix by multiplying a vector by it over and over.' },
    facts: { 'Criado por': 'Richard von Mises; Hilda Pollaczek-Geiringer', 'Ano': '1929', 'Encontra': 'Autovalor dominante e autovetor', 'Custo por iteração': 'Um produto matriz × vetor' },
    summary: 'Encontra o autovalor dominante de uma matriz e seu autovetor multiplicando um vetor por ela, várias vezes.',
    description:
      'Um autovetor de uma matriz A é uma direção que A apenas estica: Av = λv, e λ é o autovalor. O Método da Potência encontra o autovalor de maior valor absoluto (o dominante) com uma ideia simples: escreva um vetor qualquer como combinação de autovetores; ao multiplicar por A repetidamente, a componente do autovalor dominante cresce mais rápido que as outras e acaba dominando. Normalizando o vetor a cada passo (para ele não explodir), ele converge para o autovetor dominante, e o quociente de Rayleigh vᵀAv dá o autovalor. A velocidade depende da razão |λ₂/λ₁|: quanto mais destacado o maior autovalor, mais rápido.',
    complexity: { best: 'O(n²) por iteração', average: 'O(k·n²)', worst: 'Lento se |λ₂| ≈ |λ₁|', space: 'O(n)' },
    steps: [
      'Escolha um vetor inicial v qualquer (não perpendicular ao autovetor dominante) e normalize-o.',
      'Multiplique: w = A·v.',
      'Normalize: v = w / ‖w‖. A direção de v se aproxima do autovetor dominante.',
      'Estime o autovalor com o quociente de Rayleigh: λ ≈ vᵀ·A·v.',
      'Repita até λ parar de mudar. O erro cai, a cada iteração, por um fator de cerca de |λ₂/λ₁|.',
    ],
    usedIn: ['PageRank do Google', 'Análise de componentes principais (PCA)', 'Centralidade de autovetor em redes', 'Cadeias de Markov (distribuição estacionária)', 'Engenharia (modos de vibração)'],
    realWorld: [
      { title: 'PageRank', text: 'O PageRank original do Google é o autovetor dominante da matriz de links da web, com bilhões de páginas. Ele era calculado com o Método da Potência: cada iteração é só "somar a importância que chega por cada link".' },
      { title: 'Análise de dados', text: 'A primeira componente principal de um conjunto de dados (a direção de maior variância) é o autovetor dominante da matriz de covariância — e pode ser obtida com o Método da Potência sem formar todas as outras.' },
      { title: 'Redes sociais', text: 'A centralidade de autovetor mede a importância de uma pessoa pela importância de quem está ligado a ela; é calculada exatamente como o PageRank, com iterações de potência.' },
    ],
    curiosities: [
      'O método foi descrito em 1929 por Richard von Mises e Hilda Pollaczek-Geiringer, por isso também é chamado de iteração de Von Mises.',
      'O PageRank foi apelidado de "o autovetor de 25 bilhões de dólares" em um artigo de 2006 de Kurt Bryan e Tanya Leise.',
      'Para a matriz do visualizador, [[2, 1], [1, 3]], o autovalor dominante é (5 + √5)/2 ≈ 3,618 — a razão áurea mais 2. Variações do método, como a iteração inversa e o algoritmo QR, encontram os outros autovalores.',
    ],
    code: {
      python: String.raw`
        import math

        def metodo_da_potencia(A, tolerancia=1e-12, max_iter=1000):
            n = len(A)
            v = [1.0] * n
            lam = 0.0
            for _ in range(max_iter):
                w = [sum(A[i][j] * v[j] for j in range(n)) for i in range(n)]  # w = A·v
                norma = math.sqrt(sum(x * x for x in w))
                v = [x / norma for x in w]                                    # normaliza
                Av = [sum(A[i][j] * v[j] for j in range(n)) for i in range(n)]
                novo = sum(a * b for a, b in zip(v, Av))                      # quociente de Rayleigh
                if abs(novo - lam) < tolerancia:
                    return novo, v
                lam = novo
            return lam, v

        lam, v = metodo_da_potencia([[2, 1], [1, 3]])
        print(f"{lam:.12f}")                       # 3.618033988750  ((5 + √5) / 2)
        print(" ".join(f"{x:.4f}" for x in v))     # 0.5257 0.8507
      `,
      javascript: String.raw`
        const multiplicar = (A, v) => A.map(linha => linha.reduce((s, a, j) => s + a * v[j], 0));

        function metodoDaPotencia(A, tolerancia = 1e-12, maxIter = 1000) {
          let v = A.map(() => 1), lambda = 0;
          for (let i = 0; i < maxIter; i++) {
            const w = multiplicar(A, v);              // w = A·v
            const norma = Math.hypot(...w);
            v = w.map(x => x / norma);                 // normaliza
            const Av = multiplicar(A, v);
            const novo = v.reduce((s, x, j) => s + x * Av[j], 0); // quociente de Rayleigh
            if (Math.abs(novo - lambda) < tolerancia) return [novo, v];
            lambda = novo;
          }
          return [lambda, v];
        }

        const [lambda, v] = metodoDaPotencia([[2, 1], [1, 3]]);
        console.log(lambda.toFixed(12));                   // 3.618033988750  ((5 + √5) / 2)
        console.log(v.map(x => x.toFixed(4)).join(" "));   // 0.5257 0.8507
      `,
      java: String.raw`
        import java.util.Locale;

        public class MetodoDaPotencia {
            static double[] multiplicar(double[][] A, double[] v) {
                double[] w = new double[A.length];
                for (int i = 0; i < A.length; i++)
                    for (int j = 0; j < v.length; j++) w[i] += A[i][j] * v[j];
                return w;
            }

            public static void main(String[] args) {
                double[][] A = {{2, 1}, {1, 3}};
                double[] v = {1, 1};
                double lambda = 0;
                for (int it = 0; it < 1000; it++) {
                    double[] w = multiplicar(A, v); // w = A·v
                    double norma = 0;
                    for (double x : w) norma += x * x;
                    norma = Math.sqrt(norma);
                    for (int i = 0; i < w.length; i++) v[i] = w[i] / norma; // normaliza
                    double[] Av = multiplicar(A, v);
                    double novo = 0;
                    for (int i = 0; i < v.length; i++) novo += v[i] * Av[i]; // quociente de Rayleigh
                    boolean convergiu = Math.abs(novo - lambda) < 1e-12;
                    lambda = novo;
                    if (convergiu) break;
                }
                System.out.println(String.format(Locale.ROOT, "%.12f", lambda));          // 3.618033988750
                System.out.println(String.format(Locale.ROOT, "%.4f %.4f", v[0], v[1]));  // 0.5257 0.8507
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdio>
        #include <vector>
        using namespace std;

        using Matriz = vector<vector<double>>;

        vector<double> multiplicar(const Matriz& A, const vector<double>& v) {
            vector<double> w(A.size(), 0.0);
            for (size_t i = 0; i < A.size(); i++)
                for (size_t j = 0; j < v.size(); j++) w[i] += A[i][j] * v[j];
            return w;
        }

        int main() {
            Matriz A = {{2, 1}, {1, 3}};
            vector<double> v(A.size(), 1.0);
            double lambda = 0;
            for (int it = 0; it < 1000; it++) {
                vector<double> w = multiplicar(A, v); // w = A·v
                double norma = 0;
                for (double x : w) norma += x * x;
                norma = sqrt(norma);
                for (size_t i = 0; i < w.size(); i++) v[i] = w[i] / norma; // normaliza
                vector<double> Av = multiplicar(A, v);
                double novo = 0;
                for (size_t i = 0; i < v.size(); i++) novo += v[i] * Av[i]; // quociente de Rayleigh
                bool convergiu = fabs(novo - lambda) < 1e-12;
                lambda = novo;
                if (convergiu) break;
            }
            printf("%.12f\n", lambda);          // 3.618033988750  ((5 + √5) / 2)
            printf("%.4f %.4f\n", v[0], v[1]);  // 0.5257 0.8507
        }
      `,
    },
  },
]
