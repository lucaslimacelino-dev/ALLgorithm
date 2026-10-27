export default [
  {
    id: 'multivariate-division',
    name: 'Divisão de Polinômios Multivariados',
    difficulty: 'Intermediário',
    en: { name: 'Multivariate Polynomial Division', summary: 'Divides a polynomial in several variables by a list of polynomials, term by term along a monomial order, leaving quotients and a remainder.' },
    facts: { 'Tipo': 'Álgebra computacional', 'Ingrediente-chave': 'Ordem monomial (lex, grlex, grevlex)', 'Saída': 'Quocientes q₁…qₛ e um resto r', 'Armadilha': 'O resto depende da ordem dos divisores', 'Usado em': 'Bases de Gröbner, sistemas de álgebra computacional' },
    summary: 'Divide um polinômio em várias variáveis por uma lista de polinômios, termo a termo, seguindo uma ordem monomial, e devolve quocientes e um resto.',
    description:
      'Com uma variável, dividir polinômios é o que se aprende na escola: o termo de maior grau do dividendo é dividido pelo termo de maior grau do divisor, subtrai-se, e repete-se. Com várias variáveis surge uma pergunta: qual é o "maior" termo de x²y + xy² + y²? É preciso fixar uma ordem monomial. Na ordem lexicográfica (lex), compara-se primeiro o expoente de x, depois o de y, como palavras em um dicionário — então x²y > xy² > y². Com a ordem escolhida, o algoritmo divide f por uma lista g₁, …, gₛ: olha o termo líder do que sobrou; se ele é divisível pelo termo líder de algum gᵢ (o primeiro da lista que servir), acrescenta o quociente desses termos a qᵢ e subtrai o múltiplo correspondente de gᵢ; se nenhum divide, o termo vai para o resto e o algoritmo continua com os demais termos. No fim, f = q₁g₁ + … + qₛgₛ + r, e nenhum termo de r é divisível pelos termos líderes. A grande diferença em relação a uma variável é que o resto não é único: trocar a ordem dos divisores pode mudar r, e um resto não nulo não prova que f está fora do ideal gerado pelos gᵢ. Esse defeito é exatamente o que as bases de Gröbner corrigem — e a divisão multivariada é a peça principal do algoritmo de Buchberger.',
    complexity: { best: 'O(t · s) quando cada passo cancela um termo', average: 'Depende do número de termos gerados (pode crescer muito)', worst: 'Exponencial no grau, em casos patológicos', space: 'O(número de termos intermediários)' },
    steps: [
      'Fixe uma ordem monomial (por exemplo, lex com x > y > z) e ordene os termos de cada polinômio do maior para o menor.',
      'Comece com p = f, todos os quocientes qᵢ = 0 e o resto r = 0.',
      'Enquanto p ≠ 0, olhe o termo líder LT(p).',
      'Se LT(gᵢ) divide LT(p) para algum i (pegue o primeiro), faça qᵢ += LT(p)/LT(gᵢ) e p −= (LT(p)/LT(gᵢ)) · gᵢ.',
      'Se nenhum LT(gᵢ) divide LT(p), mova LT(p) para o resto: r += LT(p) e p −= LT(p).',
      'No fim, f = Σ qᵢgᵢ + r, com nenhum termo de r divisível por um termo líder.',
    ],
    usedIn: ['Algoritmo de Buchberger e bases de Gröbner', 'Sistemas de álgebra computacional (Mathematica, Maple, SageMath, SymPy, Singular)', 'Teste de pertinência a ideais', 'Simplificação de expressões sob restrições polinomiais', 'Robótica e geometria algébrica computacional'],
    realWorld: [
      { title: 'SymPy e Mathematica', text: 'Funções como reduced() no SymPy e PolynomialReduce no Mathematica implementam exatamente esta divisão, devolvendo os quocientes e o resto para uma ordem monomial escolhida.' },
      { title: 'Simplificar com restrições', text: 'Para simplificar uma expressão sabendo que x² + y² = 1, divide-se pelo polinômio x² + y² − 1: o resto é uma forma equivalente sem x². Com uma base de Gröbner como divisor, essa forma é canônica.' },
      { title: 'Verificação de circuitos', text: 'Ferramentas de verificação formal de multiplicadores em hardware modelam cada porta lógica como um polinômio e reduzem a especificação pelos polinômios do circuito: resto zero significa circuito correto.' },
    ],
    curiosities: [
      'Com f = x²y + xy² + y² e divisores (xy − 1, y² − 1), o resto é x + y + 1; trocando a ordem para (y² − 1, xy − 1), o resto vira 2x + 1. Os dois restos são válidos.',
      'Há infinitas ordens monomiais possíveis. A grevlex (grau total, com desempate lexicográfico reverso) costuma ser a mais rápida na prática; a lex é a melhor para eliminar variáveis.',
      'A teoria por trás vem de Hilbert (1890), mas o algoritmo só se tornou prático com computadores, a partir da tese de Bruno Buchberger em 1965.',
    ],
    code: {
      python: String.raw`
        # Polinômio em x, y: dicionário {(expoente de x, expoente de y): coeficiente}.
        # Comparar as tuplas é exatamente a ordem lex (x > y), então max(p) é o termo líder.
        def soma(p, q, fator=1, desloc=(0, 0)):             # p + fator · x^a y^b · q
            r = dict(p)
            for (i, j), c in q.items():
                m = (i + desloc[0], j + desloc[1])
                r[m] = r.get(m, 0) + fator * c
                if abs(r[m]) < 1e-9:
                    del r[m]
            return r

        def divide(a, b):                                   # o monômio a divide o monômio b?
            return a[0] <= b[0] and a[1] <= b[1]

        def dividir(f, divisores):
            q, r, p = [{} for _ in divisores], {}, dict(f)
            while p:
                m = max(p)                                  # termo líder do que sobrou
                for k, g in enumerate(divisores):
                    lg = max(g)
                    if divide(lg, m):
                        t = (m[0] - lg[0], m[1] - lg[1])
                        fator = p[m] / g[lg]
                        q[k] = soma(q[k], {t: fator})
                        p = soma(p, g, -fator, t)           # cancela o termo líder
                        break
                else:                                       # nenhum líder divide: vai para o resto
                    r = soma(r, {m: p.pop(m)})
            return q, r

        def num(v):
            return str(int(v)) if v == int(v) else str(v)

        def texto(p):
            s = ""
            for (i, j) in sorted(p, reverse=True):
                c = p[(i, j)]
                mono = ("x" if i else "") + ("^" + str(i) if i > 1 else "") + ("y" if j else "") + ("^" + str(j) if j > 1 else "")
                s += (" - " if c < 0 else " + ") + (num(abs(c)) if abs(c) != 1 or not mono else "") + mono
            return ("-" if s.startswith(" - ") else "") + s.lstrip(" +-") if s else "0"

        f = {(2, 1): 1, (1, 2): 1, (0, 2): 1}               # x²y + xy² + y²
        g1 = {(1, 1): 1, (0, 0): -1}                        # xy − 1
        g2 = {(0, 2): 1, (0, 0): -1}                        # y² − 1
        q, r = dividir(f, [g1, g2])
        print("q1 =", texto(q[0]), "| q2 =", texto(q[1]), "| r =", texto(r))
        # q1 = x + y | q2 = 1 | r = x + y + 1
        q, r = dividir(f, [g2, g1])
        print("ordem trocada: r =", texto(r))                # ordem trocada: r = 2x + 1
      `,
      javascript: String.raw`
        // Polinômio em x, y: Map { 100·i + j → coeficiente }. A chave cresce na ordem lex (x > y),
        // então a maior chave é o termo líder.
        const lider = p => Math.max(...p.keys());
        const divide = (a, b) => Math.floor(a / 100) <= Math.floor(b / 100) && a % 100 <= b % 100; // a divide b?

        function soma(p, q, fator = 1, desloc = 0) { // p + fator · x^a y^b · q  (desloc = 100a + b)
          const r = new Map(p);
          for (const [m, c] of q) {
            const v = (r.get(m + desloc) ?? 0) + fator * c;
            if (Math.abs(v) < 1e-9) r.delete(m + desloc); else r.set(m + desloc, v);
          }
          return r;
        }

        function dividir(f, divisores) {
          const q = divisores.map(() => new Map());
          let r = new Map(), p = new Map(f);
          while (p.size) {
            const m = lider(p), c = p.get(m);                 // termo líder do que sobrou
            const k = divisores.findIndex(g => divide(lider(g), m));
            if (k >= 0) {
              const g = divisores[k], t = m - lider(g), fator = c / g.get(lider(g));
              q[k] = soma(q[k], new Map([[t, fator]]));
              p = soma(p, g, -fator, t);                     // cancela o termo líder
            } else {                                         // nenhum líder divide: vai para o resto
              r = soma(r, new Map([[m, c]]));
              p.delete(m);
            }
          }
          return [q, r];
        }

        function texto(p) {
          let s = "";
          for (const m of [...p.keys()].sort((a, b) => b - a)) {
            const c = p.get(m), i = Math.floor(m / 100), j = m % 100;
            const mono = (i ? "x" : "") + (i > 1 ? "^" + i : "") + (j ? "y" : "") + (j > 1 ? "^" + j : "");
            s += (c < 0 ? " - " : " + ") + (Math.abs(c) !== 1 || !mono ? String(Math.abs(c)) : "") + mono;
          }
          return !s ? "0" : s.startsWith(" - ") ? "-" + s.slice(3) : s.slice(3);
        }

        const f = new Map([[201, 1], [102, 1], [2, 1]]); // x²y + xy² + y²
        const g1 = new Map([[101, 1], [0, -1]]);          // xy − 1
        const g2 = new Map([[2, 1], [0, -1]]);            // y² − 1
        let [q, r] = dividir(f, [g1, g2]);
        console.log("q1 = " + texto(q[0]) + " | q2 = " + texto(q[1]) + " | r = " + texto(r));
        // q1 = x + y | q2 = 1 | r = x + y + 1
        [q, r] = dividir(f, [g2, g1]);
        console.log("ordem trocada: r = " + texto(r));      // ordem trocada: r = 2x + 1
      `,
      java: String.raw`
        import java.util.*;

        public class DivisaoMultivariada {
            // Polinômio em x, y: chave 100·i + j → coeficiente. A chave cresce na ordem lex (x > y),
            // então lastKey() é o termo líder.
            static TreeMap<Integer, Double> soma(TreeMap<Integer, Double> p, Map<Integer, Double> q, double fator, int desloc) {
                TreeMap<Integer, Double> r = new TreeMap<>(p);
                for (var e : q.entrySet()) {
                    int m = e.getKey() + desloc;
                    double v = r.getOrDefault(m, 0.0) + fator * e.getValue();
                    if (Math.abs(v) < 1e-9) r.remove(m); else r.put(m, v);
                }
                return r;
            }
            static boolean divide(int a, int b) { return a / 100 <= b / 100 && a % 100 <= b % 100; }

            // Devolve os quocientes seguidos do resto (último elemento da lista).
            static List<TreeMap<Integer, Double>> dividir(TreeMap<Integer, Double> f, List<TreeMap<Integer, Double>> divisores) {
                List<TreeMap<Integer, Double>> q = new ArrayList<>();
                for (int k = 0; k < divisores.size(); k++) q.add(new TreeMap<>());
                TreeMap<Integer, Double> r = new TreeMap<>(), p = new TreeMap<>(f);
                while (!p.isEmpty()) {
                    int m = p.lastKey();                                   // termo líder do que sobrou
                    double c = p.get(m);
                    int k = 0;
                    while (k < divisores.size() && !divide(divisores.get(k).lastKey(), m)) k++;
                    if (k < divisores.size()) {
                        TreeMap<Integer, Double> g = divisores.get(k);
                        int t = m - g.lastKey();
                        double fator = c / g.get(g.lastKey());
                        q.set(k, soma(q.get(k), Map.of(t, fator), 1, 0));
                        p = soma(p, g, -fator, t);                         // cancela o termo líder
                    } else {                                               // nenhum líder divide: vai para o resto
                        r = soma(r, Map.of(m, c), 1, 0);
                        p.remove(m);
                    }
                }
                q.add(r);
                return q;
            }

            static String texto(TreeMap<Integer, Double> p) {
                StringBuilder s = new StringBuilder();
                for (int m : p.descendingKeySet()) {
                    double c = p.get(m), a = Math.abs(c);
                    int i = m / 100, j = m % 100;
                    String mono = (i > 0 ? "x" : "") + (i > 1 ? "^" + i : "") + (j > 0 ? "y" : "") + (j > 1 ? "^" + j : "");
                    String num = a == Math.rint(a) ? String.valueOf((long) a) : String.valueOf(a);
                    s.append(c < 0 ? " - " : " + ").append(a != 1 || mono.isEmpty() ? num : "").append(mono);
                }
                if (s.length() == 0) return "0";
                return (s.charAt(1) == '-' ? "-" : "") + s.substring(3);
            }

            static TreeMap<Integer, Double> poli(double... t) { // trios (coeficiente, i, j)
                TreeMap<Integer, Double> p = new TreeMap<>();
                for (int k = 0; k < t.length; k += 3) p.put((int) t[k + 1] * 100 + (int) t[k + 2], t[k]);
                return p;
            }

            public static void main(String[] args) {
                var f = poli(1, 2, 1, 1, 1, 2, 1, 0, 2); // x²y + xy² + y²
                var g1 = poli(1, 1, 1, -1, 0, 0);        // xy − 1
                var g2 = poli(1, 0, 2, -1, 0, 0);        // y² − 1
                var res = dividir(f, List.of(g1, g2));
                System.out.println("q1 = " + texto(res.get(0)) + " | q2 = " + texto(res.get(1)) + " | r = " + texto(res.get(2)));
                // q1 = x + y | q2 = 1 | r = x + y + 1
                res = dividir(f, List.of(g2, g1));
                System.out.println("ordem trocada: r = " + texto(res.get(2))); // ordem trocada: r = 2x + 1
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <iostream>
        #include <map>
        #include <sstream>
        #include <string>
        #include <vector>
        using namespace std;

        // Polinômio em x, y: chave 100·i + j → coeficiente. A chave cresce na ordem lex (x > y),
        // então a última chave do map é o termo líder.
        using Poli = map<int, double>;

        Poli soma(Poli p, const Poli& q, double fator = 1, int desloc = 0) { // p + fator · x^a y^b · q
            for (auto [m, c] : q) {
                double v = p[m + desloc] + fator * c;
                if (fabs(v) < 1e-9) p.erase(m + desloc); else p[m + desloc] = v;
            }
            return p;
        }
        bool divide(int a, int b) { return a / 100 <= b / 100 && a % 100 <= b % 100; }

        pair<vector<Poli>, Poli> dividir(Poli p, const vector<Poli>& divisores) {
            vector<Poli> q(divisores.size());
            Poli r;
            while (!p.empty()) {
                auto [m, c] = *p.rbegin();                        // termo líder do que sobrou
                size_t k = 0;
                while (k < divisores.size() && !divide(divisores[k].rbegin()->first, m)) k++;
                if (k < divisores.size()) {
                    const Poli& g = divisores[k];
                    int t = m - g.rbegin()->first;
                    double fator = c / g.rbegin()->second;
                    q[k] = soma(q[k], { { t, fator } });
                    p = soma(p, g, -fator, t);                    // cancela o termo líder
                } else {                                          // nenhum líder divide: vai para o resto
                    r = soma(r, { { m, c } });
                    p.erase(m);
                }
            }
            return { q, r };
        }

        string texto(const Poli& p) {
            ostringstream s;
            for (auto it = p.rbegin(); it != p.rend(); ++it) {
                int i = it->first / 100, j = it->first % 100;
                double c = it->second;
                string mono = string(i ? "x" : "") + (i > 1 ? "^" + to_string(i) : "") + (j ? "y" : "") + (j > 1 ? "^" + to_string(j) : "");
                s << (c < 0 ? " - " : " + ");
                if (fabs(c) != 1 || mono.empty()) s << fabs(c);
                s << mono;
            }
            string t = s.str();
            if (t.empty()) return "0";
            return (t[1] == '-' ? "-" : "") + t.substr(3);
        }

        int main() {
            Poli f = { { 201, 1 }, { 102, 1 }, { 2, 1 } }; // x²y + xy² + y²
            Poli g1 = { { 101, 1 }, { 0, -1 } };          // xy − 1
            Poli g2 = { { 2, 1 }, { 0, -1 } };            // y² − 1
            auto [q, r] = dividir(f, { g1, g2 });
            cout << "q1 = " << texto(q[0]) << " | q2 = " << texto(q[1]) << " | r = " << texto(r) << "\n";
            // q1 = x + y | q2 = 1 | r = x + y + 1
            cout << "ordem trocada: r = " << texto(dividir(f, { g2, g1 }).second) << "\n"; // ordem trocada: r = 2x + 1
        }
      `,
    },
  },
  {
    id: 'buchberger',
    name: 'Algoritmo de Buchberger (Bases de Gröbner)',
    difficulty: 'Avançado',
    en: { name: "Buchberger's Algorithm (Gröbner Bases)", summary: 'Turns any set of polynomials into a Gröbner basis — a generating set in which division always gives a unique remainder — by adding the reduced S-polynomials until every pair reduces to zero.' },
    facts: { 'Criado por': 'Bruno Buchberger', 'Ano': '1965 (tese de doutorado)', 'Nome': 'Homenagem ao orientador, Wolfgang Gröbner', 'Peça central': 'S-polinômios', 'Complexidade': 'Duplamente exponencial no pior caso', 'Variantes modernas': 'F4 e F5 (Jean-Charles Faugère)' },
    summary: 'Transforma qualquer conjunto de polinômios em uma base de Gröbner — um conjunto gerador em que a divisão sempre dá resto único —, acrescentando S-polinômios reduzidos até que todo par se reduza a zero.',
    description:
      'Um sistema de equações polinomiais, como x² + y² = 1 e x = y, gera um ideal: todos os polinômios que podem ser escritos como combinação dos originais. Duas perguntas aparecem o tempo todo: um polinômio pertence a esse ideal? E quais são as soluções do sistema? Com a divisão multivariada comum, o resto depende da ordem dos divisores e não responde à primeira pergunta. Uma base de Gröbner é um conjunto gerador especial do mesmo ideal em que esse problema desaparece: o resto da divisão é único, e ele é zero exatamente quando o polinômio pertence ao ideal. Bruno Buchberger deu, em 1965, o critério e o algoritmo para construí-la. Para cada par de polinômios (f, g), forma-se o S-polinômio: multiplicam-se f e g pelos menores fatores que tornam seus termos líderes iguais e subtrai-se, cancelando esses termos. O S-polinômio pertence ao ideal; se ele deixa um resto não nulo ao ser dividido pela base atual, esse resto é um elemento "escondido" do ideal e entra na base. Quando todos os pares se reduzem a zero, a base é de Gröbner. Na ordem lexicográfica, ela ainda tem uma propriedade preciosa, a eliminação: aparecem polinômios só em y, depois só em y e z…, e o sistema pode ser resolvido de baixo para cima, como uma escada — é a generalização não linear da eliminação de Gauss. O custo pode explodir (duplamente exponencial no pior caso), mas, com critérios para descartar pares inúteis e algoritmos modernos como F4 e F5, bases de Gröbner resolvem problemas reais de robótica, criptanálise e geometria.',
    complexity: { best: 'Polinomial para ideais lineares (vira eliminação de Gauss)', average: 'Muito variável; a ordem grevlex costuma ser a mais rápida', worst: 'Duplamente exponencial no número de variáveis', space: 'Pode gerar bases com muitos polinômios de grau alto' },
    steps: [
      'Escolha uma ordem monomial (lex para eliminar variáveis) e comece com G = {f₁, …, fₛ}.',
      'Forme a lista de todos os pares (gᵢ, gⱼ) de G.',
      'Para cada par, se os termos líderes não têm variáveis em comum, pule (critério de Buchberger). Senão, calcule S(gᵢ, gⱼ) = (L/LT(gᵢ))·gᵢ − (L/LT(gⱼ))·gⱼ, com L = mmc dos monômios líderes.',
      'Divida S(gᵢ, gⱼ) por G. Se o resto r ≠ 0, acrescente r a G e crie pares de r com todos os elementos.',
      'Quando a lista de pares acabar, G é uma base de Gröbner.',
      'Para a base reduzida (única): descarte elementos cujo termo líder é divisível pelo de outro, reduza cada um pelos demais e torne os coeficientes líderes iguais a 1.',
    ],
    usedIn: ['Resolução de sistemas de equações polinomiais', 'Sistemas de álgebra computacional (Mathematica, Maple, Magma, Singular, SageMath)', 'Cinemática inversa de robôs', 'Criptanálise algébrica', 'Prova automática de teoremas de geometria', 'Teoria de códigos e estatística algébrica'],
    realWorld: [
      { title: 'Robótica', text: 'A cinemática inversa de braços robóticos — que ângulos das juntas levam a garra a uma posição — vira um sistema polinomial em senos e cossenos. Com bases de Gröbner, obtém-se uma equação em uma só variável e depois as demais.' },
      { title: 'Criptanálise', text: 'Em 2002, Faugère usou o algoritmo F5 para quebrar o desafio HFE de 80 bits, um sistema criptográfico multivariado, resolvendo diretamente o sistema de equações da chave.' },
      { title: 'Geometria e visão computacional', text: 'Provas automáticas de teoremas de geometria e o problema de calcular a posição de uma câmera a partir de poucos pontos (resolvedores mínimos, usados em reconstrução 3D) são resolvidos com bases de Gröbner.' },
    ],
    curiosities: [
      'Buchberger chamou a estrutura de "base de Gröbner" em homenagem ao seu orientador, Wolfgang Gröbner, que propôs o problema. Ideias parecidas já existiam em trabalhos de Gordan (1900) e Hironaka (1964), sob outro nome.',
      'Para equações lineares, o algoritmo de Buchberger se reduz exatamente à eliminação de Gauss; para uma variável, ao algoritmo de Euclides para o mdc de polinômios.',
      'Bruno Buchberger também fundou o RISC, instituto de pesquisa em computação simbólica instalado em um castelo do século XII, em Hagenberg, na Áustria.',
    ],
    code: {
      python: String.raw`
        # Polinômio em x, y: dicionário {(expoente de x, expoente de y): coeficiente}; max(p) é o termo líder (lex).
        def soma(p, q, fator=1, desloc=(0, 0)):             # p + fator · x^a y^b · q
            r = dict(p)
            for (i, j), c in q.items():
                m = (i + desloc[0], j + desloc[1])
                r[m] = r.get(m, 0) + fator * c
                if abs(r[m]) < 1e-9:
                    del r[m]
            return r

        def divide(a, b):
            return a[0] <= b[0] and a[1] <= b[1]

        def resto(p, G):                                    # divisão multivariada, só o resto
            p, r = dict(p), {}
            while p:
                m = max(p)
                g = next((g for g in G if divide(max(g), m)), None)
                if g:
                    lg = max(g)
                    p = soma(p, g, -p[m] / g[lg], (m[0] - lg[0], m[1] - lg[1]))
                else:
                    r = soma(r, {m: p.pop(m)})
            return r

        def monico(p):
            c = p[max(p)]
            return {m: v / c for m, v in p.items()}

        def s_poli(f, g):                                   # cancela os termos líderes de f e g
            a, b = max(f), max(g)
            L = (max(a[0], b[0]), max(a[1], b[1]))          # mmc dos monômios líderes
            return soma(soma({}, f, 1 / f[a], (L[0] - a[0], L[1] - a[1])), g, -1 / g[b], (L[0] - b[0], L[1] - b[1]))

        def buchberger(F):
            G = [monico(f) for f in F]
            pares = [(i, j) for j in range(len(G)) for i in range(j)]
            while pares:
                i, j = pares.pop(0)
                r = resto(s_poli(G[i], G[j]), G)
                if r:                                       # sobrou algo: entra na base
                    G.append(monico(r))
                    pares += [(k, len(G) - 1) for k in range(len(G) - 1)]
            k = 0                                           # base reduzida: tira líderes redundantes...
            while k < len(G):
                if any(t != k and divide(max(G[t]), max(G[k])) for t in range(len(G))):
                    G.pop(k)
                    k = 0
                else:
                    k += 1
            G = [monico(resto(g, [h for t, h in enumerate(G) if t != k])) for k, g in enumerate(G)]   # ...e reduz cada um
            return sorted(G, key=max, reverse=True)

        def num(v):
            return str(int(v)) if v == int(v) else str(v)

        def texto(p):
            s = ""
            for (i, j) in sorted(p, reverse=True):
                c = p[(i, j)]
                mono = ("x" if i else "") + ("^" + str(i) if i > 1 else "") + ("y" if j else "") + ("^" + str(j) if j > 1 else "")
                s += (" - " if c < 0 else " + ") + (num(abs(c)) if abs(c) != 1 or not mono else "") + mono
            return ("-" if s.startswith(" - ") else "") + s.lstrip(" +-") if s else "0"

        circulo = {(2, 0): 1, (0, 2): 1, (0, 0): -1}        # x² + y² − 1
        reta = {(1, 0): 1, (0, 1): -1}                      # x − y
        print([texto(g) for g in buchberger([circulo, reta])])
        # ['x - y', 'y^2 - 0.5']   →  y = ±√½ e x = y
        f1 = {(3, 0): 1, (1, 1): -2}                        # x³ − 2xy
        f2 = {(2, 1): 1, (0, 2): -2, (1, 0): 1}             # x²y − 2y² + x
        print([texto(g) for g in buchberger([f1, f2])])
        # ['x - 2y^2', 'y^3']
      `,
      javascript: String.raw`
        // Polinômio em x, y: Map { 100·i + j → coeficiente }; a maior chave é o termo líder (lex, x > y).
        const lider = p => Math.max(...p.keys());
        const divide = (a, b) => Math.floor(a / 100) <= Math.floor(b / 100) && a % 100 <= b % 100;

        function soma(p, q, fator = 1, desloc = 0) { // p + fator · x^a y^b · q
          const r = new Map(p);
          for (const [m, c] of q) {
            const v = (r.get(m + desloc) ?? 0) + fator * c;
            if (Math.abs(v) < 1e-9) r.delete(m + desloc); else r.set(m + desloc, v);
          }
          return r;
        }

        function resto(p, G) { // divisão multivariada, só o resto
          let r = new Map();
          while (p.size) {
            const m = lider(p), g = G.find(g => divide(lider(g), m));
            if (g) p = soma(p, g, -p.get(m) / g.get(lider(g)), m - lider(g));
            else { r = soma(r, new Map([[m, p.get(m)]])); p = soma(p, new Map([[m, p.get(m)]]), -1); }
          }
          return r;
        }

        const monico = p => soma(new Map(), p, 1 / p.get(lider(p)));

        function sPoli(f, g) { // cancela os termos líderes de f e g
          const a = lider(f), b = lider(g);
          const L = Math.max(Math.floor(a / 100), Math.floor(b / 100)) * 100 + Math.max(a % 100, b % 100); // mmc
          return soma(soma(new Map(), f, 1 / f.get(a), L - a), g, -1 / g.get(b), L - b);
        }

        function buchberger(F) {
          const G = F.map(monico);
          const pares = [];
          for (let j = 1; j < G.length; j++) for (let i = 0; i < j; i++) pares.push([i, j]);
          while (pares.length) {
            const [i, j] = pares.shift();
            const r = resto(sPoli(G[i], G[j]), G);
            if (r.size) {                                     // sobrou algo: entra na base
              G.push(monico(r));
              for (let k = 0; k < G.length - 1; k++) pares.push([k, G.length - 1]);
            }
          }
          for (let k = 0; k < G.length; ) {                   // base reduzida: tira líderes redundantes...
            if (G.some((h, t) => t !== k && divide(lider(h), lider(G[k])))) { G.splice(k, 1); k = 0; } else k++;
          }
          return G.map((g, k) => monico(resto(g, G.filter((_, t) => t !== k))))  // ...e reduz cada um
            .sort((p, q) => lider(q) - lider(p));
        }

        function texto(p) {
          let s = "";
          for (const m of [...p.keys()].sort((a, b) => b - a)) {
            const c = p.get(m), i = Math.floor(m / 100), j = m % 100;
            const mono = (i ? "x" : "") + (i > 1 ? "^" + i : "") + (j ? "y" : "") + (j > 1 ? "^" + j : "");
            s += (c < 0 ? " - " : " + ") + (Math.abs(c) !== 1 || !mono ? String(Math.abs(c)) : "") + mono;
          }
          return s.startsWith(" - ") ? "-" + s.slice(3) : s.slice(3);
        }

        const circulo = new Map([[200, 1], [2, 1], [0, -1]]); // x² + y² − 1
        const reta = new Map([[100, 1], [1, -1]]);            // x − y
        console.log(buchberger([circulo, reta]).map(texto));
        // [ 'x - y', 'y^2 - 0.5' ]   →  y = ±√½ e x = y
        const f1 = new Map([[300, 1], [101, -2]]);            // x³ − 2xy
        const f2 = new Map([[201, 1], [2, -2], [100, 1]]);    // x²y − 2y² + x
        console.log(buchberger([f1, f2]).map(texto));
        // [ 'x - 2y^2', 'y^3' ]
      `,
      java: String.raw`
        import java.util.*;

        public class Buchberger {
            // Polinômio em x, y: chave 100·i + j → coeficiente; lastKey() é o termo líder (lex, x > y).
            static TreeMap<Integer, Double> soma(Map<Integer, Double> p, Map<Integer, Double> q, double fator, int desloc) {
                TreeMap<Integer, Double> r = new TreeMap<>(p);
                for (var e : q.entrySet()) {
                    int m = e.getKey() + desloc;
                    double v = r.getOrDefault(m, 0.0) + fator * e.getValue();
                    if (Math.abs(v) < 1e-9) r.remove(m); else r.put(m, v);
                }
                return r;
            }
            static boolean divide(int a, int b) { return a / 100 <= b / 100 && a % 100 <= b % 100; }

            static TreeMap<Integer, Double> resto(TreeMap<Integer, Double> p, List<TreeMap<Integer, Double>> G) {
                TreeMap<Integer, Double> r = new TreeMap<>();
                p = new TreeMap<>(p);                                   // não altera o polinômio original
                while (!p.isEmpty()) {
                    int m = p.lastKey();
                    TreeMap<Integer, Double> g = null;
                    for (var h : G) if (divide(h.lastKey(), m)) { g = h; break; }
                    if (g != null) p = soma(p, g, -p.get(m) / g.lastEntry().getValue(), m - g.lastKey());
                    else { r.put(m, p.get(m)); p.remove(m); }
                }
                return r;
            }

            static TreeMap<Integer, Double> monico(TreeMap<Integer, Double> p) {
                return soma(Map.of(), p, 1 / p.lastEntry().getValue(), 0);
            }

            static TreeMap<Integer, Double> sPoli(TreeMap<Integer, Double> f, TreeMap<Integer, Double> g) {
                int a = f.lastKey(), b = g.lastKey();
                int L = Math.max(a / 100, b / 100) * 100 + Math.max(a % 100, b % 100); // mmc dos líderes
                return soma(soma(Map.of(), f, 1 / f.get(a), L - a), g, -1 / g.get(b), L - b);
            }

            static List<TreeMap<Integer, Double>> buchberger(List<TreeMap<Integer, Double>> F) {
                List<TreeMap<Integer, Double>> G = new ArrayList<>();
                for (var f : F) G.add(monico(f));
                Deque<int[]> pares = new ArrayDeque<>();
                for (int j = 1; j < G.size(); j++) for (int i = 0; i < j; i++) pares.add(new int[] { i, j });
                while (!pares.isEmpty()) {
                    int[] par = pares.poll();
                    var r = resto(sPoli(G.get(par[0]), G.get(par[1])), G);
                    if (!r.isEmpty()) {                                   // sobrou algo: entra na base
                        G.add(monico(r));
                        for (int k = 0; k < G.size() - 1; k++) pares.add(new int[] { k, G.size() - 1 });
                    }
                }
                for (int k = 0; k < G.size(); ) {                         // base reduzida: tira líderes redundantes...
                    boolean redundante = false;
                    for (int t = 0; t < G.size(); t++) if (t != k && divide(G.get(t).lastKey(), G.get(k).lastKey())) redundante = true;
                    if (redundante) { G.remove(k); k = 0; } else k++;
                }
                List<TreeMap<Integer, Double>> B = new ArrayList<>();
                for (int k = 0; k < G.size(); k++) {                      // ...e reduz cada um pelos demais
                    List<TreeMap<Integer, Double>> outros = new ArrayList<>(G);
                    outros.remove(k);
                    B.add(monico(resto(G.get(k), outros)));
                }
                B.sort((p, q) -> q.lastKey() - p.lastKey());
                return B;
            }

            static String texto(TreeMap<Integer, Double> p) {
                StringBuilder s = new StringBuilder();
                for (int m : p.descendingKeySet()) {
                    double c = p.get(m), a = Math.abs(c);
                    int i = m / 100, j = m % 100;
                    String mono = (i > 0 ? "x" : "") + (i > 1 ? "^" + i : "") + (j > 0 ? "y" : "") + (j > 1 ? "^" + j : "");
                    String num = a == Math.rint(a) ? String.valueOf((long) a) : String.valueOf(a);
                    s.append(c < 0 ? " - " : " + ").append(a != 1 || mono.isEmpty() ? num : "").append(mono);
                }
                return (s.charAt(1) == '-' ? "-" : "") + s.substring(3);
            }

            static TreeMap<Integer, Double> poli(double... t) { // trios (coeficiente, i, j)
                TreeMap<Integer, Double> p = new TreeMap<>();
                for (int k = 0; k < t.length; k += 3) p.put((int) t[k + 1] * 100 + (int) t[k + 2], t[k]);
                return p;
            }

            static void mostrar(List<TreeMap<Integer, Double>> G) {
                List<String> s = new ArrayList<>();
                for (var g : G) s.add(texto(g));
                System.out.println(s);
            }

            public static void main(String[] args) {
                mostrar(buchberger(List.of(poli(1, 2, 0, 1, 0, 2, -1, 0, 0), poli(1, 1, 0, -1, 0, 1))));
                // [x - y, y^2 - 0.5]   (círculo x² + y² − 1 e reta x − y)
                mostrar(buchberger(List.of(poli(1, 3, 0, -2, 1, 1), poli(1, 2, 1, -2, 0, 2, 1, 1, 0))));
                // [x - 2y^2, y^3]      (x³ − 2xy e x²y − 2y² + x)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cmath>
        #include <deque>
        #include <iostream>
        #include <map>
        #include <sstream>
        #include <string>
        #include <vector>
        using namespace std;

        // Polinômio em x, y: chave 100·i + j → coeficiente; a última chave é o termo líder (lex, x > y).
        using Poli = map<int, double>;
        int lider(const Poli& p) { return p.rbegin()->first; }
        bool divide(int a, int b) { return a / 100 <= b / 100 && a % 100 <= b % 100; }

        Poli soma(Poli p, const Poli& q, double fator = 1, int desloc = 0) { // p + fator · x^a y^b · q
            for (auto [m, c] : q) {
                double v = p[m + desloc] + fator * c;
                if (fabs(v) < 1e-9) p.erase(m + desloc); else p[m + desloc] = v;
            }
            return p;
        }

        Poli resto(Poli p, const vector<Poli>& G) { // divisão multivariada, só o resto
            Poli r;
            while (!p.empty()) {
                int m = lider(p);
                auto g = find_if(G.begin(), G.end(), [&](const Poli& h) { return divide(lider(h), m); });
                if (g != G.end()) p = soma(p, *g, -p[m] / g->rbegin()->second, m - lider(*g));
                else { r[m] = p[m]; p.erase(m); }
            }
            return r;
        }

        Poli monico(const Poli& p) { return soma({}, p, 1 / p.rbegin()->second); }

        Poli sPoli(const Poli& f, const Poli& g) { // cancela os termos líderes de f e g
            int a = lider(f), b = lider(g);
            int L = max(a / 100, b / 100) * 100 + max(a % 100, b % 100); // mmc dos monômios líderes
            return soma(soma({}, f, 1 / f.at(a), L - a), g, -1 / g.at(b), L - b);
        }

        vector<Poli> buchberger(const vector<Poli>& F) {
            vector<Poli> G;
            for (auto& f : F) G.push_back(monico(f));
            deque<pair<int, int>> pares;
            for (int j = 1; j < (int)G.size(); j++) for (int i = 0; i < j; i++) pares.push_back({ i, j });
            while (!pares.empty()) {
                auto [i, j] = pares.front();
                pares.pop_front();
                Poli r = resto(sPoli(G[i], G[j]), G);
                if (!r.empty()) {                                       // sobrou algo: entra na base
                    G.push_back(monico(r));
                    for (int k = 0; k + 1 < (int)G.size(); k++) pares.push_back({ k, (int)G.size() - 1 });
                }
            }
            for (size_t k = 0; k < G.size(); ) {                       // base reduzida: tira líderes redundantes...
                bool redundante = false;
                for (size_t t = 0; t < G.size(); t++) if (t != k && divide(lider(G[t]), lider(G[k]))) redundante = true;
                if (redundante) { G.erase(G.begin() + k); k = 0; } else k++;
            }
            vector<Poli> B;
            for (size_t k = 0; k < G.size(); k++) {                    // ...e reduz cada um pelos demais
                vector<Poli> outros = G;
                outros.erase(outros.begin() + k);
                B.push_back(monico(resto(G[k], outros)));
            }
            sort(B.begin(), B.end(), [](const Poli& p, const Poli& q) { return lider(p) > lider(q); });
            return B;
        }

        string texto(const Poli& p) {
            ostringstream s;
            for (auto it = p.rbegin(); it != p.rend(); ++it) {
                int i = it->first / 100, j = it->first % 100;
                double c = it->second;
                string mono = string(i ? "x" : "") + (i > 1 ? "^" + to_string(i) : "") + (j ? "y" : "") + (j > 1 ? "^" + to_string(j) : "");
                s << (c < 0 ? " - " : " + ");
                if (fabs(c) != 1 || mono.empty()) s << fabs(c);
                s << mono;
            }
            string t = s.str();
            return (t[1] == '-' ? "-" : "") + t.substr(3);
        }

        void mostrar(const vector<Poli>& G) {
            for (size_t k = 0; k < G.size(); k++) cout << (k ? ", " : "[") << texto(G[k]);
            cout << "]\n";
        }

        int main() {
            mostrar(buchberger({ { { 200, 1 }, { 2, 1 }, { 0, -1 } }, { { 100, 1 }, { 1, -1 } } }));
            // [x - y, y^2 - 0.5]   (círculo x² + y² − 1 e reta x − y)
            mostrar(buchberger({ { { 300, 1 }, { 101, -2 } }, { { 201, 1 }, { 2, -2 }, { 100, 1 } } }));
            // [x - 2y^2, y^3]      (x³ − 2xy e x²y − 2y² + x)
        }
      `,
    },
  },
  {
    id: 'knuth-bendix',
    name: 'Completação de Knuth-Bendix',
    difficulty: 'Avançado',
    en: { name: 'Knuth-Bendix Completion', summary: 'Turns a set of equations into rewriting rules that always reach a single normal form, by orienting equations and resolving every critical overlap between rules.' },
    facts: { 'Criado por': 'Donald Knuth e Peter Bendix', 'Ano': '1970', 'Entrada': 'Equações e uma ordem de redução', 'Saída': 'Sistema de reescrita confluente e terminante', 'Peça central': 'Pares críticos (sobreposições)', 'Pode não terminar?': 'Sim — e o problema da palavra é indecidível em geral' },
    summary: 'Transforma um conjunto de equações em regras de reescrita que sempre chegam a uma única forma normal, orientando as equações e resolvendo cada sobreposição crítica entre regras.',
    description:
      'Suponha que se sabe que, em um grupo, aa = 1, bbb = 1 e abab = 1. Duas palavras como "ba" e "aabb" representam o mesmo elemento? Esse é o problema da palavra. A ideia de Knuth e Bendix é transformar cada equação em uma regra de reescrita que troca o lado "maior" pelo "menor", segundo uma ordem bem fundada (aqui, shortlex: palavras mais curtas são menores; empates pela ordem alfabética). Reescrever sempre termina, porque as palavras só diminuem. O problema é que a forma final pode depender de qual regra se aplica primeiro: com aa → ε e abab → ε, a palavra aabab pode virar bab (usando aa) ou a (usando abab). Isso é um par crítico — duas regras cujos lados esquerdos se sobrepõem. Se as duas formas normais diferem, elas são iguais no grupo, e a equação bab = a vira uma nova regra. O algoritmo repete: calcula pares críticos, reduz os dois lados, descarta os que coincidem, orienta e acrescenta os que diferem, e remove regras que ficaram redundantes. Se o processo termina, o sistema é confluente: toda palavra tem uma única forma normal, e o problema da palavra se resolve reescrevendo os dois lados e comparando. No exemplo, o resultado tem 6 regras e exatamente 6 palavras irredutíveis — o grupo simétrico S₃. O mesmo método funciona para termos com variáveis (como axiomas de grupos), o que fez dele uma peça central de provadores automáticos de teoremas.',
    complexity: { best: 'Termina rápido quando há poucas sobreposições', average: 'Imprevisível: o número de regras pode crescer muito antes de diminuir', worst: 'Pode não terminar (sistemas completos infinitos)', space: 'Proporcional ao número de regras e equações pendentes' },
    steps: [
      'Escolha uma ordem de redução (por exemplo, shortlex) e coloque todas as equações em uma fila.',
      'Retire uma equação s = t e reduza os dois lados à forma normal com as regras atuais.',
      'Se as formas normais coincidem, descarte a equação. Senão, oriente-a do maior para o menor e acrescente a regra.',
      'Regras antigas cujo lado esquerdo contém o novo lado esquerdo voltam para a fila como equações; os lados direitos são reduzidos de novo.',
      'Para cada sobreposição entre a nova regra e as existentes (um sufixo de um lado esquerdo igual a um prefixo do outro), reescreva a palavra sobreposta pelos dois caminhos e ponha o par na fila.',
      'Quando a fila esvaziar, o sistema é completo: toda palavra tem uma única forma normal.',
    ],
    usedIn: ['Provadores automáticos de teoremas (Waldmeister, E, Vampire)', 'Teoria computacional de grupos (GAP, KBMAG, MAF)', 'Verificação de especificações algébricas e de software', 'Simplificadores e otimizadores baseados em reescrita', 'Assistentes de prova (táticas de reescrita)'],
    realWorld: [
      { title: 'Teoria de grupos', text: 'Pacotes como o KBMAG, usado pelo sistema GAP, aplicam Knuth-Bendix a presentações de grupos para decidir o problema da palavra e construir estruturas automáticas, que permitem desenhar e enumerar grupos infinitos.' },
      { title: 'Provadores de teoremas', text: 'A completação sem falhas (unfailing completion), uma variante de Knuth-Bendix, é o motor do Waldmeister e de partes do E e do Vampire, que vencem competições de lógica equacional.' },
      { title: 'A conjectura de Robbins', text: 'Em 1996, o provador EQP, baseado em técnicas de completação e reescrita, provou a conjectura de Robbins sobre álgebras booleanas, aberta desde os anos 1930.' },
    ],
    curiosities: [
      'O artigo de 1970 já completava os axiomas de grupo x·e = x, x·x⁻¹ = e, (x·y)·z = x·(y·z) em um sistema de 10 regras que decide qualquer identidade entre expressões de grupo.',
      'O problema da palavra para grupos finitamente apresentados é indecidível (Novikov e Boone, anos 1950): nenhum algoritmo, nem Knuth-Bendix, resolve todos os casos.',
      'Peter Bendix era aluno de graduação de Donald Knuth quando os dois desenvolveram o método.',
    ],
    code: {
      python: String.raw`
        def menor(u, v):                                    # ordem shortlex
            return (len(u), u) < (len(v), v)

        def forma_normal(w, regras):
            while True:
                regra = next((r for r in regras if r[0] in w), None)
                if regra is None:
                    return w
                w = w.replace(regra[0], regra[1], 1)

        def knuth_bendix(equacoes):
            regras, pendentes = [], list(equacoes)
            while pendentes:
                s, t = pendentes.pop(0)
                s, t = forma_normal(s, regras), forma_normal(t, regras)
                if s == t:
                    continue                                # par confluente
                l, r = (t, s) if menor(s, t) else (s, t)    # regra: maior → menor
                pendentes += [g for g in regras if l in g[0]]   # regras com l dentro voltam a ser equações
                regras = [g for g in regras if l not in g[0]]
                regras = [(a, forma_normal(b, regras + [(l, r)])) for a, b in regras]
                regras.append((l, r))
                for outra in regras:                        # pares críticos: sufixo de um = prefixo do outro
                    for (l1, r1), (l2, r2) in [((l, r), outra), (outra, (l, r))]:
                        for k in range(1, min(len(l1), len(l2))):
                            if l1.endswith(l2[0:k]):
                                pendentes.append((r1 + l2[k:len(l2)], l1[0:len(l1) - k] + r2))
            return sorted(regras, key=lambda g: (len(g[0]), g[0]))

        def elementos(regras, letras):                      # palavras irredutíveis (grupo finito)
            nivel, total = [""], 1
            while nivel:
                nivel = [w + c for w in nivel for c in letras if not any(g[0] in w + c for g in regras)]
                total += len(nivel)
            return total

        regras = knuth_bendix([("aa", ""), ("bbb", ""), ("abab", "")])
        for l, r in regras:
            print(l, "->", r or "ε")
        print(elementos(regras, "ab"), "elementos")
        # aa -> ε, aba -> bb, abb -> ba, bab -> a, bba -> ab, bbb -> ε; 6 elementos (o grupo S₃)
      `,
      javascript: String.raw`
        const menor = (u, v) => (u.length !== v.length ? u.length < v.length : u < v); // ordem shortlex

        function formaNormal(w, regras) {
          for (;;) {
            const regra = regras.find(([l]) => w.includes(l));
            if (!regra) return w;
            w = w.replace(regra[0], regra[1]);
          }
        }

        function knuthBendix(equacoes) {
          let regras = [];
          const pendentes = [...equacoes];
          while (pendentes.length) {
            let [s, t] = pendentes.shift();
            s = formaNormal(s, regras);
            t = formaNormal(t, regras);
            if (s === t) continue;                                    // par confluente
            const [l, r] = menor(s, t) ? [t, s] : [s, t];             // regra: maior → menor
            pendentes.push(...regras.filter(([a]) => a.includes(l))); // regras com l dentro voltam a ser equações
            regras = regras.filter(([a]) => !a.includes(l));
            regras = regras.map(([a, b]) => [a, formaNormal(b, [...regras, [l, r]])]);
            regras.push([l, r]);
            for (const outra of regras)                               // pares críticos: sufixo de um = prefixo do outro
              for (const [[l1, r1], [l2, r2]] of [[[l, r], outra], [outra, [l, r]]])
                for (let k = 1; k < Math.min(l1.length, l2.length); k++)
                  if (l1.endsWith(l2.slice(0, k))) pendentes.push([r1 + l2.slice(k), l1.slice(0, l1.length - k) + r2]);
          }
          return regras.sort(([a], [b]) => a.length - b.length || (a < b ? -1 : 1));
        }

        function elementos(regras, letras) { // palavras irredutíveis (grupo finito)
          let nivel = [""], total = 1;
          while (nivel.length) {
            nivel = nivel.flatMap(w => [...letras].map(c => w + c)).filter(w => !regras.some(([l]) => w.includes(l)));
            total += nivel.length;
          }
          return total;
        }

        const regras = knuthBendix([["aa", ""], ["bbb", ""], ["abab", ""]]);
        for (const [l, r] of regras) console.log(l + " -> " + (r || "ε"));
        console.log(elementos(regras, "ab") + " elementos");
        // aa -> ε, aba -> bb, abb -> ba, bab -> a, bba -> ab, bbb -> ε; 6 elementos (o grupo S₃)
      `,
      java: String.raw`
        import java.util.*;

        public class KnuthBendix {
            static boolean menor(String u, String v) { // ordem shortlex
                return u.length() != v.length() ? u.length() < v.length() : u.compareTo(v) < 0;
            }

            static String formaNormal(String w, List<String[]> regras) {
                while (true) {
                    String[] regra = null;
                    for (String[] g : regras) if (w.contains(g[0])) { regra = g; break; }
                    if (regra == null) return w;
                    int i = w.indexOf(regra[0]);
                    w = w.substring(0, i) + regra[1] + w.substring(i + regra[0].length());
                }
            }

            static List<String[]> knuthBendix(List<String[]> equacoes) {
                List<String[]> regras = new ArrayList<>();
                Deque<String[]> pendentes = new ArrayDeque<>(equacoes);
                while (!pendentes.isEmpty()) {
                    String[] eq = pendentes.poll();
                    String s = formaNormal(eq[0], regras), t = formaNormal(eq[1], regras);
                    if (s.equals(t)) continue;                                 // par confluente
                    String l = menor(s, t) ? t : s, r = menor(s, t) ? s : t;   // regra: maior → menor
                    List<String[]> mantidas = new ArrayList<>();
                    for (String[] g : regras) {
                        if (g[0].contains(l)) pendentes.add(g);                // regras com l dentro voltam a ser equações
                        else mantidas.add(g);
                    }
                    mantidas.add(new String[] { l, r });
                    for (String[] g : mantidas) g[1] = formaNormal(g[1], mantidas);  // reduz os lados direitos
                    regras = mantidas;
                    String[] nova = regras.get(regras.size() - 1);
                    for (String[] outra : regras)                              // pares críticos: sufixo de um = prefixo do outro
                        for (String[][] par : new String[][][] { { nova, outra }, { outra, nova } }) {
                            String l1 = par[0][0], r1 = par[0][1], l2 = par[1][0], r2 = par[1][1];
                            for (int k = 1; k < Math.min(l1.length(), l2.length()); k++)
                                if (l1.endsWith(l2.substring(0, k)))
                                    pendentes.add(new String[] { r1 + l2.substring(k), l1.substring(0, l1.length() - k) + r2 });
                        }
                }
                regras.sort((a, b) -> a[0].length() != b[0].length() ? a[0].length() - b[0].length() : a[0].compareTo(b[0]));
                return regras;
            }

            static int elementos(List<String[]> regras, String letras) { // palavras irredutíveis (grupo finito)
                List<String> nivel = List.of("");
                int total = 1;
                while (!nivel.isEmpty()) {
                    List<String> prox = new ArrayList<>();
                    for (String w : nivel)
                        for (char c : letras.toCharArray()) {
                            String v = w + c;
                            if (regras.stream().noneMatch(g -> v.contains(g[0]))) prox.add(v);
                        }
                    nivel = prox;
                    total += nivel.size();
                }
                return total;
            }

            public static void main(String[] args) {
                var regras = knuthBendix(List.of(new String[] { "aa", "" }, new String[] { "bbb", "" }, new String[] { "abab", "" }));
                for (String[] g : regras) System.out.println(g[0] + " -> " + (g[1].isEmpty() ? "ε" : g[1]));
                System.out.println(elementos(regras, "ab") + " elementos");
                // aa -> ε, aba -> bb, abb -> ba, bab -> a, bba -> ab, bbb -> ε; 6 elementos (o grupo S₃)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <deque>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        using Regra = pair<string, string>;

        bool menor(const string& u, const string& v) { // ordem shortlex
            return u.size() != v.size() ? u.size() < v.size() : u < v;
        }

        string formaNormal(string w, const vector<Regra>& regras) {
            while (true) {
                auto regra = find_if(regras.begin(), regras.end(), [&](const Regra& g) { return w.find(g.first) != string::npos; });
                if (regra == regras.end()) return w;
                w.replace(w.find(regra->first), regra->first.size(), regra->second);
            }
        }

        vector<Regra> knuthBendix(const vector<Regra>& equacoes) {
            vector<Regra> regras;
            deque<Regra> pendentes(equacoes.begin(), equacoes.end());
            while (!pendentes.empty()) {
                auto [s, t] = pendentes.front();
                pendentes.pop_front();
                s = formaNormal(s, regras);
                t = formaNormal(t, regras);
                if (s == t) continue;                                      // par confluente
                Regra nova = menor(s, t) ? Regra{ t, s } : Regra{ s, t };  // regra: maior → menor
                vector<Regra> mantidas;
                for (auto& g : regras) {
                    if (g.first.find(nova.first) != string::npos) pendentes.push_back(g); // volta a ser equação
                    else mantidas.push_back(g);
                }
                mantidas.push_back(nova);
                for (auto& g : mantidas) g.second = formaNormal(g.second, mantidas);
                regras = mantidas;
                nova = regras.back();
                for (const auto& outra : regras)                           // pares críticos: sufixo de um = prefixo do outro
                    for (auto [a, b] : { pair{ nova, outra }, pair{ outra, nova } })
                        for (size_t k = 1; k < min(a.first.size(), b.first.size()); k++)
                            if (a.first.compare(a.first.size() - k, k, b.first, 0, k) == 0)
                                pendentes.push_back({ a.second + b.first.substr(k), a.first.substr(0, a.first.size() - k) + b.second });
            }
            sort(regras.begin(), regras.end(), [](const Regra& a, const Regra& b) { return menor(a.first, b.first); });
            return regras;
        }

        int elementos(const vector<Regra>& regras, const string& letras) { // palavras irredutíveis (grupo finito)
            vector<string> nivel = { "" };
            int total = 1;
            while (!nivel.empty()) {
                vector<string> prox;
                for (auto& w : nivel)
                    for (char c : letras) {
                        string v = w + c;
                        if (none_of(regras.begin(), regras.end(), [&](const Regra& g) { return v.find(g.first) != string::npos; })) prox.push_back(v);
                    }
                nivel = prox;
                total += nivel.size();
            }
            return total;
        }

        int main() {
            auto regras = knuthBendix({ { "aa", "" }, { "bbb", "" }, { "abab", "" } });
            for (auto& [l, r] : regras) cout << l << " -> " << (r.empty() ? "ε" : r) << "\n";
            cout << elementos(regras, "ab") << " elementos\n";
            // aa -> ε, aba -> bb, abb -> ba, bab -> a, bba -> ab, bbb -> ε; 6 elementos (o grupo S₃)
        }
      `,
    },
  },
]
