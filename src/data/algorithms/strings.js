export default [
  {
    id: 'naive-string-search',
    name: 'Busca Ingênua (Força Bruta)',
    difficulty: 'Iniciante',
    en: { name: 'Naive String Search (Brute Force)', summary: 'Tries the pattern at every position of the text, comparing letter by letter.' },
    facts: { 'Também chamada': 'Força bruta', 'Pré-processamento': 'Nenhum', 'Direção da comparação': 'Esquerda → direita' },
    summary: 'Testa o padrão em cada posição do texto, comparando letra a letra.',
    description:
      'A busca ingênua alinha o padrão no início do texto e compara letra a letra; ao primeiro erro — ou ao achar uma ocorrência —, desloca o padrão uma única posição e recomeça. É simples e, em textos comuns, razoavelmente rápida. Mas em casos repetitivos, como procurar "AAAB" em "AAAAAAAA…", refaz quase todo o trabalho a cada deslocamento e chega a O(n·m). Todos os outros algoritmos desta categoria existem para evitar esse desperdício.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n·m)', space: 'O(1)' },
    steps: [
      'Alinhe o padrão na posição 0 do texto.',
      'Compare as letras da esquerda para a direita.',
      'Se todas coincidirem, registre uma ocorrência.',
      'Desloque o padrão uma posição para a direita, qualquer que tenha sido o resultado, e repita.',
      'Pare quando o padrão passar do fim do texto.',
    ],
    usedIn: ['Textos e padrões curtos', 'Implementações simples de "localizar"', 'Ensino de algoritmos', 'Referência para testar outros algoritmos'],
    realWorld: [
      { title: 'Textos curtos', text: 'Para procurar uma palavra em uma frase ou em um campo de formulário, a força bruta é tão rápida quanto qualquer alternativa — e muito mais simples de acertar.' },
      { title: 'Gabarito de testes', text: 'Por ser fácil de implementar corretamente, ela serve de referência para testar algoritmos sofisticados: os resultados precisam ser idênticos aos dela.' },
      { title: 'Onde ela sofre', text: 'Sequências de DNA têm só 4 letras e muitas repetições — exatamente o cenário em que a força bruta degrada e algoritmos como KMP e Boyer-Moore compensam.' },
    ],
    curiosities: [
      'Em textos de linguagem natural, a primeira letra comparada costuma já ser diferente, então a busca ingênua faz, na média, pouco mais de n comparações.',
      'O pior caso aparece com textos e padrões repetitivos: procurar "AAAAB" em uma sequência de 1.000 letras "A" exige cerca de 5.000 comparações.',
      'Os testes deste site comparam cada algoritmo de busca em strings com a busca ingênua em milhares de textos aleatórios.',
    ],
    code: {
      python: String.raw`
        def busca_ingenua(texto, padrao):
            n, m = len(texto), len(padrao)
            posicoes = []
            for s in range(n - m + 1):  # cada alinhamento possível
                j = 0
                while j < m and texto[s + j] == padrao[j]:
                    j += 1
                if j == m:
                    posicoes.append(s)
            return posicoes

        print(busca_ingenua("AABAACAADAABAABA", "AABA"))  # [0, 9, 12]
      `,
      javascript: String.raw`
        function buscaIngenua(texto, padrao) {
          const n = texto.length, m = padrao.length;
          const posicoes = [];
          for (let s = 0; s <= n - m; s++) { // cada alinhamento possível
            let j = 0;
            while (j < m && texto[s + j] === padrao[j]) j++;
            if (j === m) posicoes.push(s);
          }
          return posicoes;
        }

        console.log(buscaIngenua("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class BuscaIngenua {
            static List<Integer> buscaIngenua(String texto, String padrao) {
                int n = texto.length(), m = padrao.length();
                List<Integer> posicoes = new ArrayList<>();
                for (int s = 0; s <= n - m; s++) { // cada alinhamento possível
                    int j = 0;
                    while (j < m && texto.charAt(s + j) == padrao.charAt(j)) j++;
                    if (j == m) posicoes.add(s);
                }
                return posicoes;
            }

            public static void main(String[] args) {
                System.out.println(buscaIngenua("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> buscaIngenua(const string& texto, const string& padrao) {
            int n = texto.size(), m = padrao.size();
            vector<int> posicoes;
            for (int s = 0; s <= n - m; s++) { // cada alinhamento possível
                int j = 0;
                while (j < m && texto[s + j] == padrao[j]) j++;
                if (j == m) posicoes.push_back(s);
            }
            return posicoes;
        }

        int main() {
            for (int p : buscaIngenua("AABAACAADAABAABA", "AABA")) cout << p << " "; // 0 9 12
        }
      `,
    },
  },
  {
    id: 'kmp',
    name: 'Knuth-Morris-Pratt (KMP)',
    difficulty: 'Intermediário',
    en: { name: 'Knuth-Morris-Pratt (KMP)', summary: 'Uses what has already matched so it never goes back in the text: guaranteed linear time.' },
    facts: { 'Criado por': 'Knuth, Morris e Pratt', 'Ano': '1970 (publicado em 1977)', 'Pré-processamento': 'Tabela LPS, O(m)' },
    summary: 'Usa o que já casou para nunca voltar no texto: tempo linear garantido.',
    description:
      'O algoritmo de Knuth-Morris-Pratt evita o retrabalho da força bruta. Quando ocorre um erro depois de algumas letras coincidirem, ele já sabe — por uma tabela pré-calculada sobre o padrão — qual é o maior prefixo do padrão que continua alinhado com o texto, e retoma a comparação dali. O índice do texto nunca retrocede, o que garante O(n + m) em qualquer caso.',
    complexity: { best: 'O(n + m)', average: 'O(n + m)', worst: 'O(n + m)', space: 'O(m)' },
    steps: [
      'Pré-processe o padrão: lps[i] é o tamanho do maior prefixo próprio de padrão[0..i] que também é sufixo dele.',
      'Percorra o texto com i, mantendo j = quantas letras do padrão já casaram.',
      'Se texto[i] = padrão[j], avance os dois.',
      'Se houver erro com j > 0, faça j = lps[j − 1] — o padrão "salta" para a frente — e compare de novo; se j = 0, apenas avance i.',
      'Quando j chegar a m, registre a ocorrência e continue com j = lps[m − 1].',
    ],
    usedIn: ['Editores de texto', 'Bioinformática (busca em DNA)', 'Busca em fluxos de dados', 'Base do algoritmo Aho-Corasick', 'Análise de logs em tempo real'],
    realWorld: [
      { title: 'Dados em fluxo', text: 'Como nunca volta no texto, o KMP processa dados que chegam aos poucos — pacotes de rede, logs em tempo real — sem precisar guardar o que já passou.' },
      { title: 'Detecção de intrusão', text: 'Ferramentas de segurança procuram assinaturas de ataques no tráfego de rede. A ideia de autômato do KMP, generalizada no Aho-Corasick, permite buscar milhares de padrões de uma só vez.' },
      { title: 'Genômica', text: 'Em sequências de DNA, com alfabeto pequeno e muitas repetições, a garantia linear do KMP evita a explosão de comparações da força bruta.' },
    ],
    curiosities: [
      'James H. Morris descobriu o algoritmo em 1970 ao implementar um editor de texto; Donald Knuth chegou a ele de forma independente a partir da teoria de autômatos, junto com Vaughan Pratt. O artigo conjunto só foi publicado em 1977.',
      'A tabela lps também é chamada de "função de falha" ou "função de prefixo".',
      'Na prática, o KMP costuma ser mais lento que o Boyer-Moore em textos comuns: sua força é a garantia de pior caso, não a média.',
    ],
    code: {
      python: String.raw`
        def tabela_lps(padrao):
            # lps[i] = maior prefixo próprio de padrao[:i+1] que também é sufixo
            lps = [0] * len(padrao)
            k = 0
            for i in range(1, len(padrao)):
                while k > 0 and padrao[i] != padrao[k]:
                    k = lps[k - 1]
                if padrao[i] == padrao[k]:
                    k += 1
                lps[i] = k
            return lps

        def kmp(texto, padrao):
            lps = tabela_lps(padrao)
            posicoes, j = [], 0
            for i, ch in enumerate(texto):  # o índice do texto nunca volta
                while j > 0 and ch != padrao[j]:
                    j = lps[j - 1]          # reaproveita o que já casou
                if ch == padrao[j]:
                    j += 1
                if j == len(padrao):
                    posicoes.append(i - j + 1)
                    j = lps[j - 1]
            return posicoes

        print(tabela_lps("AABA"))                 # [0, 1, 0, 1]
        print(kmp("AABAACAADAABAABA", "AABA"))  # [0, 9, 12]
      `,
      javascript: String.raw`
        function tabelaLps(padrao) {
          // lps[i] = maior prefixo próprio de padrao[0..i] que também é sufixo
          const lps = new Array(padrao.length).fill(0);
          for (let i = 1, k = 0; i < padrao.length; i++) {
            while (k > 0 && padrao[i] !== padrao[k]) k = lps[k - 1];
            if (padrao[i] === padrao[k]) k++;
            lps[i] = k;
          }
          return lps;
        }

        function kmp(texto, padrao) {
          const lps = tabelaLps(padrao);
          const posicoes = [];
          let j = 0;
          for (let i = 0; i < texto.length; i++) { // o índice do texto nunca volta
            while (j > 0 && texto[i] !== padrao[j]) j = lps[j - 1]; // reaproveita o que já casou
            if (texto[i] === padrao[j]) j++;
            if (j === padrao.length) {
              posicoes.push(i - j + 1);
              j = lps[j - 1];
            }
          }
          return posicoes;
        }

        console.log(tabelaLps("AABA"));                 // [0, 1, 0, 1]
        console.log(kmp("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;

        public class KMP {
            static int[] tabelaLps(String padrao) {
                // lps[i] = maior prefixo próprio de padrao[0..i] que também é sufixo
                int[] lps = new int[padrao.length()];
                for (int i = 1, k = 0; i < padrao.length(); i++) {
                    while (k > 0 && padrao.charAt(i) != padrao.charAt(k)) k = lps[k - 1];
                    if (padrao.charAt(i) == padrao.charAt(k)) k++;
                    lps[i] = k;
                }
                return lps;
            }

            static List<Integer> kmp(String texto, String padrao) {
                int[] lps = tabelaLps(padrao);
                List<Integer> posicoes = new ArrayList<>();
                int j = 0;
                for (int i = 0; i < texto.length(); i++) { // o índice do texto nunca volta
                    while (j > 0 && texto.charAt(i) != padrao.charAt(j)) j = lps[j - 1]; // reaproveita o que já casou
                    if (texto.charAt(i) == padrao.charAt(j)) j++;
                    if (j == padrao.length()) {
                        posicoes.add(i - j + 1);
                        j = lps[j - 1];
                    }
                }
                return posicoes;
            }

            public static void main(String[] args) {
                System.out.println(Arrays.toString(tabelaLps("AABA")));  // [0, 1, 0, 1]
                System.out.println(kmp("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> tabelaLps(const string& padrao) {
            // lps[i] = maior prefixo próprio de padrao[0..i] que também é sufixo
            vector<int> lps(padrao.size(), 0);
            for (size_t i = 1, k = 0; i < padrao.size(); i++) {
                while (k > 0 && padrao[i] != padrao[k]) k = lps[k - 1];
                if (padrao[i] == padrao[k]) k++;
                lps[i] = k;
            }
            return lps;
        }

        vector<int> kmp(const string& texto, const string& padrao) {
            vector<int> lps = tabelaLps(padrao), posicoes;
            size_t j = 0;
            for (size_t i = 0; i < texto.size(); i++) { // o índice do texto nunca volta
                while (j > 0 && texto[i] != padrao[j]) j = lps[j - 1]; // reaproveita o que já casou
                if (texto[i] == padrao[j]) j++;
                if (j == padrao.size()) {
                    posicoes.push_back(i - j + 1);
                    j = lps[j - 1];
                }
            }
            return posicoes;
        }

        int main() {
            for (int p : kmp("AABAACAADAABAABA", "AABA")) cout << p << " "; // 0 9 12
        }
      `,
    },
  },
  {
    id: 'rabin-karp',
    name: 'Rabin-Karp',
    difficulty: 'Intermediário',
    en: { name: 'Rabin-Karp', summary: 'Compares "fingerprints" (hashes) of text windows and only checks letters when they match.' },
    facts: { 'Criado por': 'Michael Rabin e Richard Karp', 'Ano': '1987', 'Técnica': 'Hash rolante' },
    summary: 'Compara "impressões digitais" (hashes) das janelas do texto e só confere letras quando batem.',
    description:
      'O algoritmo de Rabin-Karp calcula um hash do padrão e de cada janela de m letras do texto, e só compara as letras de fato quando os hashes coincidem. O truque é o hash rolante: ao deslizar a janela uma posição, o novo hash é obtido em O(1) a partir do anterior, removendo a contribuição da letra que sai e somando a da que entra. Brilha especialmente na busca de muitos padrões ao mesmo tempo.',
    complexity: { best: 'O(n + m)', average: 'O(n + m)', worst: 'O(n·m)', space: 'O(1)' },
    steps: [
      'Calcule o hash do padrão e da primeira janela do texto, tratando as letras como dígitos em uma base, módulo um número primo.',
      'Se os hashes forem iguais, compare as letras para confirmar — pode ser uma colisão.',
      'Deslize a janela: subtraia a contribuição da letra que sai, multiplique pela base e some a letra que entra.',
      'Repita até a última janela.',
    ],
    usedIn: ['Detecção de plágio', 'Busca de muitos padrões simultâneos', 'rsync e sincronização de arquivos', 'Deduplicação em backups', 'Busca de trechos repetidos'],
    realWorld: [
      { title: 'Detecção de plágio', text: 'Ferramentas antiplágio calculam o hash de cada trecho de k palavras de um documento e procuram os mesmos hashes em uma base de textos — uma busca de milhares de padrões de uma vez.' },
      { title: 'rsync', text: 'Para sincronizar arquivos enviando só o que mudou, o rsync usa um checksum rolante e encontra, em qualquer posição, blocos que o outro lado já possui.' },
      { title: 'Backup e deduplicação', text: 'Sistemas de backup usam a impressão digital de Rabin para cortar arquivos em blocos de acordo com o conteúdo; um bloco que já existe não é armazenado de novo.' },
    ],
    curiosities: [
      'Foi publicado por Michael O. Rabin e Richard M. Karp em 1987. Os dois já tinham recebido o Prêmio Turing por outros trabalhos — Rabin em 1976 e Karp em 1985.',
      'Uma "colisão falsa" acontece quando janelas diferentes têm o mesmo hash. Com um módulo primo grande, isso é raríssimo, e a conferência letra a letra garante a resposta certa.',
      'Na visualização, o hash usa módulo 101 justamente para que colisões falsas apareçam de vez em quando. Experimente textos longos.',
    ],
    code: {
      python: String.raw`
        def rabin_karp(texto, padrao, base=256, mod=1_000_000_007):
            n, m = len(texto), len(padrao)
            if m > n:
                return []
            peso = pow(base, m - 1, mod)  # peso da letra que sai da janela
            hp = hj = 0
            for k in range(m):
                hp = (hp * base + ord(padrao[k])) % mod
                hj = (hj * base + ord(texto[k])) % mod
            posicoes = []
            for s in range(n - m + 1):
                if hp == hj and texto[s:s + m] == padrao:  # confere: pode ser colisão
                    posicoes.append(s)
                if s < n - m:  # hash rolante: tira a letra que sai, põe a que entra
                    hj = ((hj - ord(texto[s]) * peso) * base + ord(texto[s + m])) % mod
            return posicoes

        print(rabin_karp("AABAACAADAABAABA", "AABA"))  # [0, 9, 12]
      `,
      javascript: String.raw`
        function rabinKarp(texto, padrao, base = 256, mod = 1_000_000_007) {
          const n = texto.length, m = padrao.length;
          if (m > n) return [];
          let peso = 1; // peso da letra que sai da janela
          for (let k = 0; k < m - 1; k++) peso = (peso * base) % mod;
          let hp = 0, hj = 0;
          for (let k = 0; k < m; k++) {
            hp = (hp * base + padrao.charCodeAt(k)) % mod;
            hj = (hj * base + texto.charCodeAt(k)) % mod;
          }
          const posicoes = [];
          for (let s = 0; s <= n - m; s++) {
            if (hp === hj && texto.startsWith(padrao, s)) posicoes.push(s); // confere: pode ser colisão
            if (s < n - m) {
              // hash rolante: tira a letra que sai (mantendo o valor positivo) e põe a que entra
              hj = (hj - ((texto.charCodeAt(s) * peso) % mod) + mod) % mod;
              hj = (hj * base + texto.charCodeAt(s + m)) % mod;
            }
          }
          return posicoes;
        }

        console.log(rabinKarp("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class RabinKarp {
            static List<Integer> rabinKarp(String texto, String padrao) {
                final long BASE = 256, MOD = 1_000_000_007L;
                int n = texto.length(), m = padrao.length();
                List<Integer> posicoes = new ArrayList<>();
                if (m > n) return posicoes;
                long peso = 1; // peso da letra que sai da janela
                for (int k = 0; k < m - 1; k++) peso = peso * BASE % MOD;
                long hp = 0, hj = 0;
                for (int k = 0; k < m; k++) {
                    hp = (hp * BASE + padrao.charAt(k)) % MOD;
                    hj = (hj * BASE + texto.charAt(k)) % MOD;
                }
                for (int s = 0; s <= n - m; s++) {
                    if (hp == hj && texto.startsWith(padrao, s)) posicoes.add(s); // confere: pode ser colisão
                    if (s < n - m) {
                        // hash rolante: tira a letra que sai (mantendo o valor positivo) e põe a que entra
                        hj = (hj - texto.charAt(s) * peso % MOD + MOD) % MOD;
                        hj = (hj * BASE + texto.charAt(s + m)) % MOD;
                    }
                }
                return posicoes;
            }

            public static void main(String[] args) {
                System.out.println(rabinKarp("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> rabinKarp(const string& texto, const string& padrao) {
            const long long BASE = 256, MOD = 1'000'000'007;
            int n = texto.size(), m = padrao.size();
            vector<int> posicoes;
            if (m > n) return posicoes;
            long long peso = 1; // peso da letra que sai da janela
            for (int k = 0; k < m - 1; k++) peso = peso * BASE % MOD;
            long long hp = 0, hj = 0;
            for (int k = 0; k < m; k++) {
                hp = (hp * BASE + (unsigned char)padrao[k]) % MOD;
                hj = (hj * BASE + (unsigned char)texto[k]) % MOD;
            }
            for (int s = 0; s <= n - m; s++) {
                if (hp == hj && texto.compare(s, m, padrao) == 0) posicoes.push_back(s); // confere: pode ser colisão
                if (s < n - m) {
                    // hash rolante: tira a letra que sai (mantendo o valor positivo) e põe a que entra
                    hj = (hj - (unsigned char)texto[s] * peso % MOD + MOD) % MOD;
                    hj = (hj * BASE + (unsigned char)texto[s + m]) % MOD;
                }
            }
            return posicoes;
        }

        int main() {
            for (int p : rabinKarp("AABAACAADAABAABA", "AABA")) cout << p << " "; // 0 9 12
        }
      `,
    },
  },
  {
    id: 'boyer-moore',
    name: 'Boyer-Moore',
    difficulty: 'Avançado',
    en: { name: 'Boyer-Moore', summary: 'Compares right to left and uses two tricks to skip several positions at once.' },
    facts: { 'Criado por': 'Robert S. Boyer e J Strother Moore', 'Ano': '1977', 'Regras': 'Mau caractere + bom sufixo' },
    summary: 'Compara da direita para a esquerda e usa dois truques para saltar várias posições de uma vez.',
    description:
      'O Boyer-Moore alinha o padrão e compara de trás para a frente. Ao encontrar uma diferença, calcula dois saltos: o do mau caractere (alinhar a letra errada do texto com sua última ocorrência no padrão — ou pular o padrão inteiro, se ela não existir nele) e o do bom sufixo (realinhar o trecho que já casou com outra ocorrência dele no padrão). Usa o maior dos dois. Em textos comuns, examina só uma fração das letras — e, quanto maior o padrão, mais rápido fica.',
    complexity: { best: 'O(n / m)', average: 'O(n)', worst: 'O(n·m)', space: 'O(m + σ)' },
    steps: [
      'Pré-processe a tabela do mau caractere (última posição de cada letra no padrão) e a do bom sufixo.',
      'Alinhe o padrão e compare da direita para a esquerda.',
      'Se tudo casar, registre a ocorrência e desloque pelo salto de bom sufixo do padrão inteiro.',
      'Se houver erro na posição j, calcule o salto do mau caractere (j − última posição da letra do texto) e o do bom sufixo.',
      'Desloque o padrão pelo maior dos dois saltos e repita.',
    ],
    usedIn: ['GNU grep', 'Ferramentas de "localizar" em editores', 'Bibliotecas de busca de substring', 'Busca de assinaturas em arquivos', 'Bancos de dados (LIKE)'],
    realWorld: [
      { title: 'grep', text: 'O GNU grep usa variações do Boyer-Moore para procurar strings fixas, o que lhe permite pular a maior parte do arquivo sem examinar cada byte.' },
      { title: 'Localizar em documentos', text: 'Editores de texto usam Boyer-Moore ou suas variantes no "localizar": padrões digitados por pessoas têm várias letras e o alfabeto é grande, o que gera saltos longos.' },
      { title: 'Assinaturas em arquivos', text: 'Para procurar sequências de bytes conhecidas em arquivos grandes, o alfabeto de 256 valores torna os saltos do mau caractere especialmente longos.' },
    ],
    curiosities: [
      'Foi publicado em 1977 por Robert S. Boyer e J Strother Moore — "J", sem ponto, porque é o nome completo, e não uma abreviação.',
      'Paradoxalmente, ele fica mais rápido quanto maior o padrão: um padrão de 20 letras permite saltos de até 20 posições.',
      'Em 1979, Zvi Galil mostrou como garantir tempo linear mesmo no pior caso, ao procurar todas as ocorrências.',
    ],
    code: {
      python: String.raw`
        def boyer_moore(texto, padrao):
            n, m = len(texto), len(padrao)
            ultima = {c: i for i, c in enumerate(padrao)}  # regra do mau caractere

            # regra do bom sufixo (versão forte): salto[j] para um erro na posição j - 1
            salto, borda = [0] * (m + 1), [0] * (m + 1)
            i, j = m, m + 1
            borda[i] = j
            while i > 0:
                while j <= m and padrao[i - 1] != padrao[j - 1]:
                    if salto[j] == 0:
                        salto[j] = j - i
                    j = borda[j]
                i, j = i - 1, j - 1
                borda[i] = j
            j = borda[0]
            for i in range(m + 1):
                if salto[i] == 0:
                    salto[i] = j
                if i == j:
                    j = borda[j]

            posicoes, s = [], 0
            while s <= n - m:
                j = m - 1
                while j >= 0 and padrao[j] == texto[s + j]:  # da direita para a esquerda
                    j -= 1
                if j < 0:
                    posicoes.append(s)
                    s += salto[0]
                else:
                    mau = j - ultima.get(texto[s + j], -1)
                    s += max(salto[j + 1], mau)  # usa o maior salto
            return posicoes

        print(boyer_moore("AABAACAADAABAABA", "AABA"))  # [0, 9, 12]
      `,
      javascript: String.raw`
        function boyerMoore(texto, padrao) {
          const n = texto.length, m = padrao.length;
          const ultima = new Map(); // regra do mau caractere
          for (let i = 0; i < m; i++) ultima.set(padrao[i], i);

          // regra do bom sufixo (versão forte): salto[j] para um erro na posição j - 1
          const salto = new Array(m + 1).fill(0), borda = new Array(m + 1).fill(0);
          let i = m, j = m + 1;
          borda[i] = j;
          while (i > 0) {
            while (j <= m && padrao[i - 1] !== padrao[j - 1]) {
              if (salto[j] === 0) salto[j] = j - i;
              j = borda[j];
            }
            i--; j--;
            borda[i] = j;
          }
          j = borda[0];
          for (i = 0; i <= m; i++) {
            if (salto[i] === 0) salto[i] = j;
            if (i === j) j = borda[j];
          }

          const posicoes = [];
          let s = 0;
          while (s <= n - m) {
            let k = m - 1;
            while (k >= 0 && padrao[k] === texto[s + k]) k--; // da direita para a esquerda
            if (k < 0) {
              posicoes.push(s);
              s += salto[0];
            } else {
              const mau = k - (ultima.get(texto[s + k]) ?? -1);
              s += Math.max(salto[k + 1], mau); // usa o maior salto
            }
          }
          return posicoes;
        }

        console.log(boyerMoore("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
      `,
      java: String.raw`
        import java.util.*;

        public class BoyerMoore {
            static List<Integer> boyerMoore(String texto, String padrao) {
                int n = texto.length(), m = padrao.length();
                Map<Character, Integer> ultima = new HashMap<>(); // regra do mau caractere
                for (int i = 0; i < m; i++) ultima.put(padrao.charAt(i), i);

                // regra do bom sufixo (versão forte): salto[j] para um erro na posição j - 1
                int[] salto = new int[m + 1], borda = new int[m + 1];
                int i = m, j = m + 1;
                borda[i] = j;
                while (i > 0) {
                    while (j <= m && padrao.charAt(i - 1) != padrao.charAt(j - 1)) {
                        if (salto[j] == 0) salto[j] = j - i;
                        j = borda[j];
                    }
                    i--; j--;
                    borda[i] = j;
                }
                j = borda[0];
                for (i = 0; i <= m; i++) {
                    if (salto[i] == 0) salto[i] = j;
                    if (i == j) j = borda[j];
                }

                List<Integer> posicoes = new ArrayList<>();
                int s = 0;
                while (s <= n - m) {
                    int k = m - 1;
                    while (k >= 0 && padrao.charAt(k) == texto.charAt(s + k)) k--; // da direita para a esquerda
                    if (k < 0) {
                        posicoes.add(s);
                        s += salto[0];
                    } else {
                        int mau = k - ultima.getOrDefault(texto.charAt(s + k), -1);
                        s += Math.max(salto[k + 1], mau); // usa o maior salto
                    }
                }
                return posicoes;
            }

            public static void main(String[] args) {
                System.out.println(boyerMoore("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <array>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> boyerMoore(const string& texto, const string& padrao) {
            int n = texto.size(), m = padrao.size();
            array<int, 256> ultima;
            ultima.fill(-1); // regra do mau caractere
            for (int i = 0; i < m; i++) ultima[(unsigned char)padrao[i]] = i;

            // regra do bom sufixo (versão forte): salto[j] para um erro na posição j - 1
            vector<int> salto(m + 1, 0), borda(m + 1, 0);
            int i = m, j = m + 1;
            borda[i] = j;
            while (i > 0) {
                while (j <= m && padrao[i - 1] != padrao[j - 1]) {
                    if (salto[j] == 0) salto[j] = j - i;
                    j = borda[j];
                }
                i--; j--;
                borda[i] = j;
            }
            j = borda[0];
            for (i = 0; i <= m; i++) {
                if (salto[i] == 0) salto[i] = j;
                if (i == j) j = borda[j];
            }

            vector<int> posicoes;
            int s = 0;
            while (s <= n - m) {
                int k = m - 1;
                while (k >= 0 && padrao[k] == texto[s + k]) k--; // da direita para a esquerda
                if (k < 0) {
                    posicoes.push_back(s);
                    s += salto[0];
                } else {
                    int mau = k - ultima[(unsigned char)texto[s + k]];
                    s += max(salto[k + 1], mau); // usa o maior salto
                }
            }
            return posicoes;
        }

        int main() {
            for (int p : boyerMoore("AABAACAADAABAABA", "AABA")) cout << p << " "; // 0 9 12
        }
      `,
    },
  },
  {
    id: 'horspool',
    name: 'Boyer-Moore-Horspool',
    difficulty: 'Intermediário',
    en: { name: 'Boyer-Moore-Horspool', summary: 'A simplified Boyer-Moore: decides the shift from the last character of the window.' },
    facts: { 'Criado por': 'R. Nigel Horspool', 'Ano': '1980', 'Regra': 'Salto pelo último caractere da janela' },
    summary: 'Boyer-Moore simplificado: decide o salto pelo último caractere da janela.',
    description:
      'O algoritmo de Horspool mantém o melhor do Boyer-Moore com uma fração da complexidade. Compara da direita para a esquerda, mas, para decidir o salto, olha apenas para o caractere do texto que está sob a última posição do padrão: se ele aparece no padrão, alinha a ocorrência mais à direita; se não aparece, salta o padrão inteiro. Uma única tabela de saltos, fácil de calcular, e desempenho médio quase igual ao do Boyer-Moore completo.',
    complexity: { best: 'O(n / m)', average: 'O(n)', worst: 'O(n·m)', space: 'O(σ)' },
    steps: [
      'Monte a tabela: para cada letra c nas posições 0 a m − 2 do padrão, salto[c] = m − 1 − (última posição de c); letras ausentes saltam m.',
      'Alinhe o padrão e compare da direita para a esquerda.',
      'Se tudo casar, registre a ocorrência.',
      'Em qualquer caso, desloque pelo salto do caractere do texto que está sob a última posição do padrão.',
      'Repita até o padrão passar do fim do texto.',
    ],
    usedIn: ['Bibliotecas de busca de substring', 'Busca de bytes em arquivos binários', 'Sistemas com pouca memória', 'Ferramentas de linha de comando'],
    realWorld: [
      { title: 'Busca em binários', text: 'Encontrar uma sequência de bytes, como a assinatura de um formato de arquivo, em um executável ou dump de memória: com 256 valores possíveis, os saltos são longos e a busca é muito rápida.' },
      { title: 'Dispositivos simples', text: 'Com uma única tabela de 256 posições, o algoritmo cabe em firmwares e microcontroladores que precisam procurar padrões nas mensagens recebidas.' },
      { title: 'Implementação confiável', text: 'Quando é preciso escrever uma busca eficiente "na mão", o Horspool costuma ser a escolha: poucos detalhes para errar e desempenho próximo ao do Boyer-Moore.' },
    ],
    curiosities: [
      'Foi publicado por R. Nigel Horspool em 1980, no artigo "Practical fast searching in strings".',
      'Usar o último caractere da janela, e não o que causou o erro, garante que o salto seja sempre de pelo menos 1 — o que dispensa a regra do bom sufixo.',
      'Variações como o algoritmo de Sunday olham o caractere logo depois da janela e conseguem saltos de até m + 1.',
    ],
    code: {
      python: String.raw`
        def horspool(texto, padrao):
            n, m = len(texto), len(padrao)
            # quanto saltar conforme o último caractere da janela
            salto = {padrao[j]: m - 1 - j for j in range(m - 1)}
            posicoes, s = [], 0
            while s <= n - m:
                j = m - 1
                while j >= 0 and texto[s + j] == padrao[j]:  # da direita para a esquerda
                    j -= 1
                if j < 0:
                    posicoes.append(s)
                s += salto.get(texto[s + m - 1], m)  # letra ausente: salta o padrão inteiro
            return posicoes

        print(horspool("AABAACAADAABAABA", "AABA"))  # [0, 9, 12]
      `,
      javascript: String.raw`
        function horspool(texto, padrao) {
          const n = texto.length, m = padrao.length;
          const salto = new Map(); // quanto saltar conforme o último caractere da janela
          for (let j = 0; j < m - 1; j++) salto.set(padrao[j], m - 1 - j);
          const posicoes = [];
          let s = 0;
          while (s <= n - m) {
            let j = m - 1;
            while (j >= 0 && texto[s + j] === padrao[j]) j--; // da direita para a esquerda
            if (j < 0) posicoes.push(s);
            s += salto.get(texto[s + m - 1]) ?? m; // letra ausente: salta o padrão inteiro
          }
          return posicoes;
        }

        console.log(horspool("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
      `,
      java: String.raw`
        import java.util.*;

        public class Horspool {
            static List<Integer> horspool(String texto, String padrao) {
                int n = texto.length(), m = padrao.length();
                Map<Character, Integer> salto = new HashMap<>(); // conforme o último caractere da janela
                for (int j = 0; j < m - 1; j++) salto.put(padrao.charAt(j), m - 1 - j);
                List<Integer> posicoes = new ArrayList<>();
                int s = 0;
                while (s <= n - m) {
                    int j = m - 1;
                    while (j >= 0 && texto.charAt(s + j) == padrao.charAt(j)) j--; // da direita para a esquerda
                    if (j < 0) posicoes.add(s);
                    s += salto.getOrDefault(texto.charAt(s + m - 1), m); // ausente: salta o padrão inteiro
                }
                return posicoes;
            }

            public static void main(String[] args) {
                System.out.println(horspool("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
            }
        }
      `,
      cpp: String.raw`
        #include <array>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> horspool(const string& texto, const string& padrao) {
            int n = texto.size(), m = padrao.size();
            array<int, 256> salto;
            salto.fill(m); // letra ausente: salta o padrão inteiro
            for (int j = 0; j < m - 1; j++) salto[(unsigned char)padrao[j]] = m - 1 - j;
            vector<int> posicoes;
            int s = 0;
            while (s <= n - m) {
                int j = m - 1;
                while (j >= 0 && texto[s + j] == padrao[j]) j--; // da direita para a esquerda
                if (j < 0) posicoes.push_back(s);
                s += salto[(unsigned char)texto[s + m - 1]];
            }
            return posicoes;
        }

        int main() {
            for (int p : horspool("AABAACAADAABAABA", "AABA")) cout << p << " "; // 0 9 12
        }
      `,
    },
  },
  {
    id: 'shift-or',
    name: 'Shift-Or (Baeza-Yates–Gonnet)',
    difficulty: 'Avançado',
    en: { name: 'Shift-Or (Baeza-Yates–Gonnet)', summary: 'Represents every partial match as a bit and advances with machine operations.' },
    facts: { 'Criado por': 'Ricardo Baeza-Yates e Gaston Gonnet', 'Ano': '1989', 'Também chamado': 'Shift-And, Bitap', 'Técnica': 'Paralelismo de bits' },
    summary: 'Representa todos os casamentos parciais em bits e avança com operações de máquina.',
    description:
      'O Shift-Or (algoritmo de Baeza-Yates–Gonnet, também conhecido como Bitap) acompanha, ao mesmo tempo, todos os prefixos do padrão que estão casando com o final do texto lido até agora — cada um em um bit de uma única variável. Para cada letra do texto basta um deslocamento de bits e um OR com a máscara da letra. Quando o bit da última posição zera, o padrão inteiro casou. Para padrões que cabem em uma palavra de máquina (até 64 letras), é extremamente rápido.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(σ)' },
    steps: [
      'Para cada letra c, monte uma máscara em que o bit j vale 0 se padrão[j] = c, e 1 caso contrário.',
      'Comece com o estado D com todos os bits em 1 — nenhum prefixo casando.',
      'Para cada letra do texto: D = (D << 1) | máscara[letra]. Um bit j zerado significa "os j + 1 primeiros caracteres do padrão terminam aqui".',
      'Se o bit m − 1 estiver zerado, há uma ocorrência terminando na posição atual.',
    ],
    usedIn: ['agrep (busca aproximada)', 'Busca com erros de digitação (fuzzy)', 'Expressões regulares simples', 'Implementações com instruções SIMD', 'Bioinformática'],
    realWorld: [
      { title: 'Busca com erros de digitação', text: 'Estendido para tolerar k erros, o Bitap é o coração do agrep e de bibliotecas de busca "fuzzy", que encontram "algoritimo" quando você procura "algoritmo".' },
      { title: 'Paralelismo de bits', text: 'Uma única instrução do processador atualiza até 64 casamentos parciais ao mesmo tempo — e, com instruções vetoriais (SIMD), dá para ir ainda além.' },
      { title: 'Classes de caracteres', text: 'Como cada posição do padrão é só um bit nas máscaras, é fácil aceitar "qualquer vogal" ou "qualquer dígito" em uma posição: basta zerar esse bit nas máscaras de todas essas letras.' },
    ],
    curiosities: [
      'Foi apresentado em 1989 por Ricardo Baeza-Yates, chileno, e Gaston Gonnet, uruguaio.',
      'Em 1992, Sun Wu e Udi Manber estenderam o método para buscas aproximadas, criando a ferramenta agrep.',
      'A versão "Shift-And" usa a lógica invertida (bit 1 = casando) com a operação AND; a versão "Shift-Or" economiza uma operação por letra.',
    ],
    code: {
      python: String.raw`
        def shift_or(texto, padrao):
            m = len(padrao)
            tudo = (1 << m) - 1
            mascara = {}
            for j, c in enumerate(padrao):
                mascara[c] = mascara.get(c, tudo) & ~(1 << j)  # bit j = 0 onde c aparece
            estado, posicoes = tudo, []
            for i, c in enumerate(texto):
                estado = ((estado << 1) | mascara.get(c, tudo)) & tudo
                if estado & (1 << (m - 1)) == 0:  # bit m-1 zerado: casou o padrão inteiro
                    posicoes.append(i - m + 1)
            return posicoes

        print(shift_or("AABAACAADAABAABA", "AABA"))  # [0, 9, 12]
      `,
      javascript: String.raw`
        function shiftOr(texto, padrao) {
          const m = padrao.length; // até 31 letras com números de 32 bits
          const tudo = (1 << m) - 1;
          const mascara = new Map();
          for (let j = 0; j < m; j++) {
            mascara.set(padrao[j], (mascara.get(padrao[j]) ?? tudo) & ~(1 << j)); // bit j = 0 onde a letra aparece
          }
          let estado = tudo;
          const posicoes = [];
          for (let i = 0; i < texto.length; i++) {
            estado = ((estado << 1) | (mascara.get(texto[i]) ?? tudo)) & tudo;
            if ((estado & (1 << (m - 1))) === 0) posicoes.push(i - m + 1); // casou o padrão inteiro
          }
          return posicoes;
        }

        console.log(shiftOr("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
      `,
      java: String.raw`
        import java.util.*;

        public class ShiftOr {
            static List<Integer> shiftOr(String texto, String padrao) {
                int m = padrao.length(); // até 63 letras com long
                long tudo = (1L << m) - 1;
                Map<Character, Long> mascara = new HashMap<>();
                for (int j = 0; j < m; j++) {
                    char c = padrao.charAt(j);
                    mascara.put(c, mascara.getOrDefault(c, tudo) & ~(1L << j)); // bit j = 0 onde c aparece
                }
                long estado = tudo;
                List<Integer> posicoes = new ArrayList<>();
                for (int i = 0; i < texto.length(); i++) {
                    estado = ((estado << 1) | mascara.getOrDefault(texto.charAt(i), tudo)) & tudo;
                    if ((estado & (1L << (m - 1))) == 0) posicoes.add(i - m + 1); // casou o padrão inteiro
                }
                return posicoes;
            }

            public static void main(String[] args) {
                System.out.println(shiftOr("AABAACAADAABAABA", "AABA")); // [0, 9, 12]
            }
        }
      `,
      cpp: String.raw`
        #include <array>
        #include <cstdint>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        vector<int> shiftOr(const string& texto, const string& padrao) {
            int m = padrao.size(); // até 63 letras com 64 bits
            uint64_t tudo = (uint64_t(1) << m) - 1;
            array<uint64_t, 256> mascara;
            mascara.fill(tudo);
            for (int j = 0; j < m; j++) mascara[(unsigned char)padrao[j]] &= ~(uint64_t(1) << j); // bit j = 0 onde a letra aparece
            uint64_t estado = tudo;
            vector<int> posicoes;
            for (int i = 0; i < (int)texto.size(); i++) {
                estado = ((estado << 1) | mascara[(unsigned char)texto[i]]) & tudo;
                if ((estado & (uint64_t(1) << (m - 1))) == 0) posicoes.push_back(i - m + 1); // casou o padrão inteiro
            }
            return posicoes;
        }

        int main() {
            for (int p : shiftOr("AABAACAADAABAABA", "AABA")) cout << p << " "; // 0 9 12
        }
      `,
    },
  },
]
