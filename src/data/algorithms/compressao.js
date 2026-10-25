export default [
  {
    id: 'run-length-encoding',
    name: 'Codificação Run-Length (RLE)',
    difficulty: 'Iniciante',
    en: { name: 'Run-Length Encoding (RLE)', summary: 'Replaces each run of repeated symbols with a count and the symbol: "AAAABBB" becomes "4A3B".' },
    facts: { 'Também chamada': 'Codificação por comprimento de sequência', 'Tipo': 'Sem perdas', 'Melhor para': 'Dados com longas repetições', 'Usada em': 'Fax, BMP, PCX, TIFF (PackBits)' },
    summary: 'Troca cada sequência de símbolos repetidos por "quantidade + símbolo": "AAAABBB" vira "4A3B".',
    description:
      'A Codificação Run-Length (RLE) é a forma mais simples de compressão sem perdas: em vez de repetir um símbolo várias vezes, guarda quantas vezes ele aparece seguido. "WWWWWWWWWWWWB" vira "12W1B". Funciona muito bem em dados com longas sequências iguais — imagens com grandes áreas de uma só cor, páginas de fax quase todas brancas, saídas de outros algoritmos como Burrows-Wheeler + move-to-front — e mal em texto comum, onde pode até aumentar o tamanho (cada letra isolada vira "1A"). Por isso, variantes reais só usam o contador quando há repetição de verdade.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    steps: [
      'Comece no primeiro símbolo e conte quantos símbolos iguais vêm em seguida.',
      'Escreva a contagem e o símbolo (ex.: 4A).',
      'Pule para o primeiro símbolo diferente e repita até o fim.',
      'Para descomprimir, leia cada par (contagem, símbolo) e repita o símbolo aquele número de vezes.',
      'Variantes práticas (como o PackBits) misturam blocos "repetidos" e blocos "literais" para não piorar dados sem repetição.',
    ],
    usedIn: ['Fax (ITU-T T.4, Grupo 3)', 'Formatos de imagem BMP, PCX, TGA e TIFF (PackBits)', 'Etapa final do bzip2 e do JPEG', 'Gráficos de jogos antigos e sprites', 'Mapas de bits e máscaras binárias'],
    realWorld: [
      { title: 'Fax', text: 'Uma página de fax é quase toda branca. O padrão Grupo 3 codifica cada linha como comprimentos alternados de pixels brancos e pretos, e ainda usa códigos de Huffman para os comprimentos mais comuns.' },
      { title: 'JPEG', text: 'Depois da quantização, os blocos do JPEG têm muitos coeficientes zero. O formato codifica os zeros como "quantos zeros seguidos até o próximo valor" — uma forma de RLE — antes da etapa de Huffman.' },
      { title: 'Jogos clássicos', text: 'Consoles e computadores dos anos 1980 e 1990 guardavam telas e sprites com RLE, porque a descompressão é trivial e rápida até em processadores de 8 bits.' },
    ],
    curiosities: [
      'Já em 1967, a televisão analógica experimentava RLE para transmitir sinais de vídeo com menos banda; a técnica é uma das mais antigas da compressão digital.',
      'RLE aplicado a texto comum costuma piorar o tamanho: "ABC" vira "1A1B1C", o dobro. Por isso ele quase sempre aparece combinado com outras técnicas.',
      'A sequência "olhe e diga" (1, 11, 21, 1211, 111221…) é exatamente a RLE do termo anterior lida em voz alta: "um 1", "dois 1s", "um 2, um 1"…',
    ],
    code: {
      python: String.raw`
        def rle_codificar(texto):
            saida, i = [], 0
            while i < len(texto):
                j = i
                while j < len(texto) and texto[j] == texto[i]:
                    j += 1                      # conta os iguais seguidos
                saida.append(f"{j - i}{texto[i]}")
                i = j
            return "".join(saida)

        def rle_decodificar(codigo):
            saida, numero = [], ""
            for c in codigo:
                if c.isdigit():
                    numero += c                 # contagens podem ter vários dígitos
                else:
                    saida.append(c * int(numero))
                    numero = ""
            return "".join(saida)

        codigo = rle_codificar("AAAABBBCCDAA")
        print(codigo)                   # 4A3B2C1D2A
        print(rle_decodificar(codigo))  # AAAABBBCCDAA
      `,
      javascript: String.raw`
        function rleCodificar(texto) {
          let saida = "", i = 0;
          while (i < texto.length) {
            let j = i;
            while (j < texto.length && texto[j] === texto[i]) j++; // conta os iguais seguidos
            saida += (j - i) + texto[i];
            i = j;
          }
          return saida;
        }

        function rleDecodificar(codigo) {
          let saida = "", numero = "";
          for (const c of codigo) {
            if (c >= "0" && c <= "9") numero += c; // contagens podem ter vários dígitos
            else { saida += c.repeat(Number(numero)); numero = ""; }
          }
          return saida;
        }

        const codigo = rleCodificar("AAAABBBCCDAA");
        console.log(codigo);                 // 4A3B2C1D2A
        console.log(rleDecodificar(codigo)); // AAAABBBCCDAA
      `,
      java: String.raw`
        public class RunLength {
            static String codificar(String texto) {
                StringBuilder saida = new StringBuilder();
                int i = 0;
                while (i < texto.length()) {
                    int j = i;
                    while (j < texto.length() && texto.charAt(j) == texto.charAt(i)) j++; // conta os iguais seguidos
                    saida.append(j - i).append(texto.charAt(i));
                    i = j;
                }
                return saida.toString();
            }

            static String decodificar(String codigo) {
                StringBuilder saida = new StringBuilder();
                int numero = 0;
                for (char c : codigo.toCharArray()) {
                    if (Character.isDigit(c)) numero = numero * 10 + (c - '0'); // contagens podem ter vários dígitos
                    else { saida.append(String.valueOf(c).repeat(numero)); numero = 0; }
                }
                return saida.toString();
            }

            public static void main(String[] args) {
                String codigo = codificar("AAAABBBCCDAA");
                System.out.println(codigo);              // 4A3B2C1D2A
                System.out.println(decodificar(codigo)); // AAAABBBCCDAA
            }
        }
      `,
      cpp: String.raw`
        #include <cctype>
        #include <iostream>
        #include <string>
        using namespace std;

        string codificar(const string& texto) {
            string saida;
            size_t i = 0;
            while (i < texto.size()) {
                size_t j = i;
                while (j < texto.size() && texto[j] == texto[i]) j++; // conta os iguais seguidos
                saida += to_string(j - i) + texto[i];
                i = j;
            }
            return saida;
        }

        string decodificar(const string& codigo) {
            string saida;
            int numero = 0;
            for (char c : codigo) {
                if (isdigit((unsigned char)c)) numero = numero * 10 + (c - '0'); // contagens podem ter vários dígitos
                else { saida.append(numero, c); numero = 0; }
            }
            return saida;
        }

        int main() {
            string codigo = codificar("AAAABBBCCDAA");
            cout << codigo << "\n";              // 4A3B2C1D2A
            cout << decodificar(codigo) << "\n"; // AAAABBBCCDAA
        }
      `,
    },
  },
  {
    id: 'delta-encoding',
    name: 'Codificação Delta',
    difficulty: 'Iniciante',
    en: { name: 'Delta Encoding', summary: 'Stores the difference between consecutive values instead of the values themselves — small numbers compress far better.' },
    facts: { 'Também chamada': 'Codificação diferencial', 'Tipo': 'Sem perdas (transformação)', 'Melhor para': 'Sequências que variam pouco', 'Usada em': 'Áudio, séries temporais, PNG, git' },
    summary: 'Guarda a diferença entre valores consecutivos em vez dos próprios valores — números pequenos comprimem muito melhor.',
    description:
      'A Codificação Delta troca cada valor pela diferença em relação ao anterior. Uma série como 1000, 1002, 1005, 1005, 1010 vira 1000, 2, 3, 0, 5: o primeiro valor é guardado inteiro, e os demais viram números pequenos, que cabem em menos bits e se repetem mais — perfeitos para uma etapa seguinte de Huffman, RLE ou codificação de tamanho variável. Ela não comprime nada sozinha; é uma transformação reversível que deixa os dados "mais compressíveis". Para desfazer, basta somar as diferenças em ordem. A mesma ideia vale para arquivos: em vez de enviar a nova versão inteira, envia-se só o que mudou.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    steps: [
      'Guarde o primeiro valor como está.',
      'Para cada valor seguinte, guarde a diferença: dᵢ = xᵢ − xᵢ₋₁.',
      'Comprima as diferenças com outra técnica (tamanho variável, Huffman, RLE…).',
      'Para decodificar, comece no primeiro valor e vá somando: xᵢ = xᵢ₋₁ + dᵢ.',
    ],
    usedIn: ['Bancos de séries temporais (Gorilla, Prometheus)', 'Filtros do PNG', 'Áudio (DPCM e ADPCM)', 'Índices invertidos de buscadores', 'Controle de versão e atualizações (git, rsync, patches)'],
    realWorld: [
      { title: 'Métricas e sensores', text: 'Bancos de séries temporais guardam carimbos de tempo e leituras de sensores como deltas (às vezes, deltas de deltas): leituras a cada 10 segundos viram uma sequência de zeros que ocupa quase nada.' },
      { title: 'Imagens PNG', text: 'Antes de comprimir com DEFLATE, o PNG aplica "filtros" em cada linha — o filtro Sub, por exemplo, guarda a diferença para o pixel da esquerda. Em fotos e gradientes, isso gera muitos valores próximos de zero.' },
      { title: 'Motores de busca', text: 'A lista de documentos onde cada palavra aparece (o índice invertido) é guardada em ordem e codificada por deltas: em vez de 1000, 1003, 1010, guarda 1000, 3, 7, que ocupam poucos bits.' },
    ],
    curiosities: [
      'O DPCM (modulação por código de pulso diferencial), usado em telefonia desde os anos 1950, é codificação delta com perdas: transmite só a diferença entre amostras de som.',
      'O git guarda versões antigas dos arquivos como deltas em relação a outras versões dentro dos "packfiles" — é por isso que um repositório com milhares de commits ocupa tão pouco.',
      'Aplicar a codificação delta duas vezes ("delta de delta") transforma uma sequência que cresce em ritmo constante, como 10, 20, 30, 40, em zeros.',
    ],
    code: {
      python: String.raw`
        def delta_codificar(valores):
            return [valores[0]] + [b - a for a, b in zip(valores, valores[1:])]

        def delta_decodificar(deltas):
            valores = [deltas[0]]
            for d in deltas[1:]:
                valores.append(valores[-1] + d)  # soma as diferenças em ordem
            return valores

        leituras = [1000, 1002, 1005, 1005, 1010, 1013, 1020]
        deltas = delta_codificar(leituras)
        print(" ".join(map(str, deltas)))                     # 1000 2 3 0 5 3 7
        print(" ".join(map(str, delta_decodificar(deltas))))  # 1000 1002 1005 1005 1010 1013 1020
      `,
      javascript: String.raw`
        const deltaCodificar = valores => valores.map((v, i) => (i === 0 ? v : v - valores[i - 1]));

        function deltaDecodificar(deltas) {
          const valores = [deltas[0]];
          for (let i = 1; i < deltas.length; i++) valores.push(valores[i - 1] + deltas[i]); // soma as diferenças em ordem
          return valores;
        }

        const leituras = [1000, 1002, 1005, 1005, 1010, 1013, 1020];
        const deltas = deltaCodificar(leituras);
        console.log(deltas.join(" "));                   // 1000 2 3 0 5 3 7
        console.log(deltaDecodificar(deltas).join(" ")); // 1000 1002 1005 1005 1010 1013 1020
      `,
      java: String.raw`
        import java.util.Arrays;
        import java.util.stream.Collectors;

        public class Delta {
            static long[] codificar(long[] valores) {
                long[] deltas = new long[valores.length];
                deltas[0] = valores[0];
                for (int i = 1; i < valores.length; i++) deltas[i] = valores[i] - valores[i - 1];
                return deltas;
            }

            static long[] decodificar(long[] deltas) {
                long[] valores = new long[deltas.length];
                valores[0] = deltas[0];
                for (int i = 1; i < deltas.length; i++) valores[i] = valores[i - 1] + deltas[i]; // soma as diferenças em ordem
                return valores;
            }

            static String juntar(long[] v) {
                return Arrays.stream(v).mapToObj(Long::toString).collect(Collectors.joining(" "));
            }

            public static void main(String[] args) {
                long[] leituras = {1000, 1002, 1005, 1005, 1010, 1013, 1020};
                long[] deltas = codificar(leituras);
                System.out.println(juntar(deltas));              // 1000 2 3 0 5 3 7
                System.out.println(juntar(decodificar(deltas))); // 1000 1002 1005 1005 1010 1013 1020
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        vector<long long> codificar(const vector<long long>& valores) {
            vector<long long> deltas = {valores[0]};
            for (size_t i = 1; i < valores.size(); i++) deltas.push_back(valores[i] - valores[i - 1]);
            return deltas;
        }

        vector<long long> decodificar(const vector<long long>& deltas) {
            vector<long long> valores = {deltas[0]};
            for (size_t i = 1; i < deltas.size(); i++) valores.push_back(valores[i - 1] + deltas[i]); // soma as diferenças em ordem
            return valores;
        }

        void imprimir(const vector<long long>& v) {
            for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i];
            cout << "\n";
        }

        int main() {
            vector<long long> leituras = {1000, 1002, 1005, 1005, 1010, 1013, 1020};
            vector<long long> deltas = codificar(leituras);
            imprimir(deltas);              // 1000 2 3 0 5 3 7
            imprimir(decodificar(deltas)); // 1000 1002 1005 1005 1010 1013 1020
        }
      `,
    },
  },
  {
    id: 'incremental-encoding',
    name: 'Codificação Incremental',
    difficulty: 'Iniciante',
    en: { name: 'Incremental Encoding', summary: 'Compresses a sorted list of words by storing, for each one, how many letters it shares with the previous word.' },
    facts: { 'Também chamada': 'Front coding; compressão de prefixos', 'Tipo': 'Sem perdas', 'Requer': 'Lista ordenada', 'Usada em': 'Dicionários, índices, locate (Unix)' },
    summary: 'Comprime uma lista ordenada de palavras guardando, para cada uma, quantas letras ela repete da anterior.',
    description:
      'A Codificação Incremental (front coding) é a codificação delta aplicada a uma lista de strings. Em uma lista em ordem alfabética, palavras vizinhas costumam começar igual: "nabbed" e "nabbing" compartilham "nabb". Em vez de repetir o prefixo, cada palavra é guardada como (tamanho do prefixo comum com a anterior, resto da palavra) — "nabbing" vira (4, "ing"). Para ler a palavra k, reconstrói-se a partir da anterior. Como a leitura é sequencial, índices reais dividem a lista em blocos (por exemplo, de 16 palavras), guardando a primeira de cada bloco inteira para permitir buscas rápidas.',
    complexity: { best: 'O(total de caracteres)', average: 'O(total de caracteres)', worst: 'O(total de caracteres)', space: 'O(total de caracteres)' },
    steps: [
      'Ordene a lista de palavras (é a ordem que faz vizinhos compartilharem prefixos).',
      'Guarde a primeira palavra inteira, com prefixo 0.',
      'Para cada palavra seguinte, conte quantos caracteres iniciais ela tem em comum com a anterior.',
      'Guarde esse número e só o sufixo que sobra.',
      'Para decodificar, pegue os k primeiros caracteres da palavra anterior e acrescente o sufixo.',
    ],
    usedIn: ['Dicionários de índices invertidos (Lucene, Elasticsearch)', 'Comando locate do Unix', 'Árvores B+ com compressão de prefixos', 'Bancos chave-valor (LevelDB, RocksDB)', 'Listas de palavras de corretores ortográficos'],
    realWorld: [
      { title: 'Buscadores', text: 'O dicionário de termos de um índice de busca é ordenado; ferramentas como o Lucene guardam os termos em blocos com prefixos compartilhados, o que reduz bastante a memória.' },
      { title: 'Bancos de dados', text: 'O LevelDB e o RocksDB guardam as chaves de cada bloco com compressão de prefixos e um "ponto de reinício" a cada 16 chaves, onde a chave aparece inteira — exatamente o esquema da codificação incremental.' },
      { title: 'Comando locate', text: 'O banco de dados do locate, que lista todos os caminhos de arquivos do sistema, usa front coding: caminhos vizinhos como /usr/share/doc/a e /usr/share/doc/b compartilham quase tudo.' },
    ],
    curiosities: [
      'O exemplo clássico da Wikipédia (myxa, myxophyta, myxopod, nab, nabbed…) também é o padrão do visualizador: veja como "nabbed", "nabbing" e "nabit" encolhem.',
      'Em uma lista de URLs ou caminhos de arquivos, a economia costuma passar de 50%, porque os prefixos compartilhados são longos.',
      'A ideia é a mesma de uma trie (árvore de prefixos), mas guardada como uma lista sequencial — muito mais compacta na memória e no disco.',
    ],
    code: {
      python: String.raw`
        def codificar(palavras):
            anterior, saida = "", []
            for p in sorted(palavras):
                k = 0
                while k < min(len(p), len(anterior)) and p[k] == anterior[k]:
                    k += 1                     # tamanho do prefixo comum
                saida.append((k, p[k:]))
                anterior = p
            return saida

        def decodificar(codigos):
            palavras, anterior = [], ""
            for k, sufixo in codigos:
                anterior = anterior[:k] + sufixo
                palavras.append(anterior)
            return palavras

        codigos = codificar(["myxa", "myxophyta", "myxopod", "nab", "nabbed", "nabbing"])
        for k, sufixo in codigos:
            print(k, sufixo)
        print(" ".join(decodificar(codigos)))
        # 0 myxa
        # 3 ophyta
        # 5 od
        # 0 nab
        # 3 bed
        # 4 ing
        # myxa myxophyta myxopod nab nabbed nabbing
      `,
      javascript: String.raw`
        function codificar(palavras) {
          let anterior = "";
          return [...palavras].sort().map(p => {
            let k = 0;
            while (k < Math.min(p.length, anterior.length) && p[k] === anterior[k]) k++; // prefixo comum
            anterior = p;
            return [k, p.slice(k)];
          });
        }

        function decodificar(codigos) {
          let anterior = "";
          return codigos.map(([k, sufixo]) => (anterior = anterior.slice(0, k) + sufixo));
        }

        const codigos = codificar(["myxa", "myxophyta", "myxopod", "nab", "nabbed", "nabbing"]);
        for (const [k, sufixo] of codigos) console.log(k + " " + sufixo);
        console.log(decodificar(codigos).join(" "));
        // 0 myxa
        // 3 ophyta
        // 5 od
        // 0 nab
        // 3 bed
        // 4 ing
        // myxa myxophyta myxopod nab nabbed nabbing
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;

        public class CodificacaoIncremental {
            record Codigo(int prefixo, String sufixo) {}

            static List<Codigo> codificar(String[] palavras) {
                String[] ordenadas = palavras.clone();
                Arrays.sort(ordenadas);
                List<Codigo> saida = new ArrayList<>();
                String anterior = "";
                for (String p : ordenadas) {
                    int k = 0;
                    while (k < Math.min(p.length(), anterior.length()) && p.charAt(k) == anterior.charAt(k)) k++; // prefixo comum
                    saida.add(new Codigo(k, p.substring(k)));
                    anterior = p;
                }
                return saida;
            }

            static List<String> decodificar(List<Codigo> codigos) {
                List<String> palavras = new ArrayList<>();
                String anterior = "";
                for (Codigo c : codigos) {
                    anterior = anterior.substring(0, c.prefixo()) + c.sufixo();
                    palavras.add(anterior);
                }
                return palavras;
            }

            public static void main(String[] args) {
                List<Codigo> codigos = codificar(new String[]{"myxa", "myxophyta", "myxopod", "nab", "nabbed", "nabbing"});
                for (Codigo c : codigos) System.out.println(c.prefixo() + " " + c.sufixo());
                System.out.println(String.join(" ", decodificar(codigos)));
                // 0 myxa
                // 3 ophyta
                // 5 od
                // 0 nab
                // 3 bed
                // 4 ing
                // myxa myxophyta myxopod nab nabbed nabbing
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <string>
        #include <utility>
        #include <vector>
        using namespace std;

        vector<pair<size_t, string>> codificar(vector<string> palavras) {
            sort(palavras.begin(), palavras.end());
            vector<pair<size_t, string>> saida;
            string anterior;
            for (const string& p : palavras) {
                size_t k = 0;
                while (k < min(p.size(), anterior.size()) && p[k] == anterior[k]) k++; // prefixo comum
                saida.push_back({k, p.substr(k)});
                anterior = p;
            }
            return saida;
        }

        vector<string> decodificar(const vector<pair<size_t, string>>& codigos) {
            vector<string> palavras;
            string anterior;
            for (const auto& [k, sufixo] : codigos) {
                anterior = anterior.substr(0, k) + sufixo;
                palavras.push_back(anterior);
            }
            return palavras;
        }

        int main() {
            auto codigos = codificar({"myxa", "myxophyta", "myxopod", "nab", "nabbed", "nabbing"});
            for (const auto& [k, sufixo] : codigos) cout << k << " " << sufixo << "\n";
            auto palavras = decodificar(codigos);
            for (size_t i = 0; i < palavras.size(); i++) cout << (i ? " " : "") << palavras[i];
            cout << "\n";
            // 0 myxa
            // 3 ophyta
            // 5 od
            // 0 nab
            // 3 bed
            // 4 ing
            // myxa myxophyta myxopod nab nabbed nabbing
        }
      `,
    },
  },
  {
    id: 'move-to-front',
    name: 'Move-to-Front',
    difficulty: 'Iniciante',
    en: { name: 'Move-to-Front Transform', summary: 'Replaces each symbol with its position in a list and moves it to the front — recently used symbols become small numbers.' },
    facts: { 'Criado por': 'Boris Ryabko; Bentley, Sleator, Tarjan e Wei', 'Ano': '1980; 1986', 'Tipo': 'Sem perdas (transformação)', 'Usado em': 'bzip2 (após Burrows-Wheeler)' },
    summary: 'Troca cada símbolo pela sua posição em uma lista e o leva para a frente — símbolos usados recentemente viram números pequenos.',
    description:
      'O Move-to-Front (MTF) mantém uma lista com todos os símbolos do alfabeto. Para cada símbolo do texto, emite a posição dele na lista e, em seguida, move-o para o início. Assim, um símbolo que acabou de aparecer é codificado como 0, e símbolos usados recentemente ganham números pequenos. Como o Burrows-Wheeler agrupa letras iguais, aplicar MTF à sua saída produz uma sequência cheia de zeros e números baixos — ideal para RLE e Huffman. É exatamente essa a sequência do bzip2. Sozinho, o MTF não comprime: ele só transforma os dados, de forma reversível.',
    complexity: { best: 'O(n)', average: 'O(n·σ)', worst: 'O(n·σ)', space: 'O(σ)' },
    steps: [
      'Comece com a lista de todos os símbolos possíveis, em ordem (por exemplo, a–z ou os 256 bytes).',
      'Leia o próximo símbolo e emita a sua posição atual na lista.',
      'Retire o símbolo da posição em que estava e coloque-o no início da lista.',
      'Repita até o fim: símbolos repetidos seguidos viram zeros.',
      'Para decodificar, faça o mesmo ao contrário: leia a posição, emita o símbolo que está lá e mova-o para a frente.',
    ],
    usedIn: ['bzip2 (Burrows-Wheeler + MTF + RLE + Huffman)', 'Compressores baseados em BWT', 'Listas autoajustáveis (cache)', 'Codificação de índices em compressores experimentais', 'Análise de algoritmos online'],
    realWorld: [
      { title: 'bzip2', text: 'O bzip2 aplica Burrows-Wheeler, depois MTF, depois RLE dos zeros e, por fim, Huffman. Em arquivos de texto, essa sequência costuma comprimir melhor que o gzip, à custa de mais tempo.' },
      { title: 'Listas autoajustáveis', text: 'A mesma regra — "trazer para a frente o que acabou de ser usado" — é uma estratégia clássica para listas encadeadas e caches: elementos populares ficam no início, e as buscas ficam mais rápidas.' },
      { title: 'Teoria dos algoritmos online', text: 'Sleator e Tarjan provaram em 1985 que a lista move-to-front nunca custa mais que o dobro da melhor estratégia possível — um dos primeiros resultados de "análise competitiva".' },
    ],
    curiosities: [
      'Com o alfabeto a–z, "bananaaa" vira 1 1 13 1 1 1 0 0: depois que "a" e "n" ficam no início da lista, eles alternam entre as posições 0 e 1.',
      'Boris Ryabko descreveu a técnica em 1980 com o nome de "pilha de livros"; Bentley, Sleator, Tarjan e Wei a redescobriram em 1986.',
      'Em um texto aleatório o MTF não ajuda nada; ele brilha quando o mesmo símbolo aparece em rajadas, como na saída do Burrows-Wheeler.',
    ],
    code: {
      python: String.raw`
        import string

        def mtf_codificar(texto, alfabeto=string.ascii_lowercase):
            lista, saida = list(alfabeto), []
            for c in texto:
                i = lista.index(c)
                saida.append(i)
                lista.insert(0, lista.pop(i))  # leva o símbolo para a frente
            return saida

        def mtf_decodificar(indices, alfabeto=string.ascii_lowercase):
            lista, saida = list(alfabeto), []
            for i in indices:
                c = lista.pop(i)
                saida.append(c)
                lista.insert(0, c)
            return "".join(saida)

        codigo = mtf_codificar("bananaaa")
        print(" ".join(map(str, codigo)))  # 1 1 13 1 1 1 0 0
        print(mtf_decodificar(codigo))     # bananaaa
      `,
      javascript: String.raw`
        const ALFABETO = "abcdefghijklmnopqrstuvwxyz";

        function mtfCodificar(texto, alfabeto = ALFABETO) {
          const lista = [...alfabeto], saida = [];
          for (const c of texto) {
            const i = lista.indexOf(c);
            saida.push(i);
            lista.splice(i, 1);
            lista.unshift(c); // leva o símbolo para a frente
          }
          return saida;
        }

        function mtfDecodificar(indices, alfabeto = ALFABETO) {
          const lista = [...alfabeto];
          let saida = "";
          for (const i of indices) {
            const [c] = lista.splice(i, 1);
            saida += c;
            lista.unshift(c);
          }
          return saida;
        }

        const codigo = mtfCodificar("bananaaa");
        console.log(codigo.join(" "));        // 1 1 13 1 1 1 0 0
        console.log(mtfDecodificar(codigo));  // bananaaa
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.LinkedList;
        import java.util.List;
        import java.util.stream.Collectors;

        public class MoveToFront {
            static final String ALFABETO = "abcdefghijklmnopqrstuvwxyz";

            static LinkedList<Character> lista() {
                LinkedList<Character> l = new LinkedList<>();
                for (char c : ALFABETO.toCharArray()) l.add(c);
                return l;
            }

            static List<Integer> codificar(String texto) {
                LinkedList<Character> lista = lista();
                List<Integer> saida = new ArrayList<>();
                for (char c : texto.toCharArray()) {
                    int i = lista.indexOf(c);
                    saida.add(i);
                    lista.remove(i);
                    lista.addFirst(c); // leva o símbolo para a frente
                }
                return saida;
            }

            static String decodificar(List<Integer> indices) {
                LinkedList<Character> lista = lista();
                StringBuilder saida = new StringBuilder();
                for (int i : indices) {
                    char c = lista.remove(i);
                    saida.append(c);
                    lista.addFirst(c);
                }
                return saida.toString();
            }

            public static void main(String[] args) {
                List<Integer> codigo = codificar("bananaaa");
                System.out.println(codigo.stream().map(String::valueOf).collect(Collectors.joining(" "))); // 1 1 13 1 1 1 0 0
                System.out.println(decodificar(codigo)); // bananaaa
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <list>
        #include <string>
        #include <vector>
        using namespace std;

        const string ALFABETO = "abcdefghijklmnopqrstuvwxyz";

        vector<int> codificar(const string& texto) {
            list<char> lista(ALFABETO.begin(), ALFABETO.end());
            vector<int> saida;
            for (char c : texto) {
                int i = 0;
                auto it = lista.begin();
                while (*it != c) { ++it; ++i; }
                saida.push_back(i);
                lista.erase(it);
                lista.push_front(c); // leva o símbolo para a frente
            }
            return saida;
        }

        string decodificar(const vector<int>& indices) {
            list<char> lista(ALFABETO.begin(), ALFABETO.end());
            string saida;
            for (int i : indices) {
                auto it = next(lista.begin(), i);
                char c = *it;
                saida += c;
                lista.erase(it);
                lista.push_front(c);
            }
            return saida;
        }

        int main() {
            vector<int> codigo = codificar("bananaaa");
            for (size_t i = 0; i < codigo.size(); i++) cout << (i ? " " : "") << codigo[i];
            cout << "\n";                        // 1 1 13 1 1 1 0 0
            cout << decodificar(codigo) << "\n"; // bananaaa
        }
      `,
    },
  },
  {
    id: 'huffman-coding',
    name: 'Codificação de Huffman',
    difficulty: 'Intermediário',
    en: { name: 'Huffman Coding', summary: 'Builds optimal prefix codes by repeatedly merging the two least frequent symbols — frequent symbols get short codes.' },
    facts: { 'Criado por': 'David A. Huffman', 'Ano': '1952', 'Tipo': 'Codificação de entropia (sem perdas)', 'Estrutura': 'Árvore binária + fila de prioridades', 'Usada em': 'ZIP, gzip, PNG, JPEG, MP3' },
    summary: 'Constrói códigos de prefixo ótimos unindo, repetidamente, os dois símbolos menos frequentes — símbolos comuns ganham códigos curtos.',
    description:
      'A Codificação de Huffman dá a cada símbolo uma sequência de bits cujo tamanho depende da frequência: letras comuns recebem códigos curtos, e as raras, longos. Os códigos formam uma árvore binária em que cada símbolo é uma folha — e, como nenhum código é prefixo de outro, a decodificação é inequívoca, sem separadores. A árvore é construída de baixo para cima com uma fila de prioridades: retiram-se as duas árvores de menor peso, juntam-se as duas em um novo nó cujo peso é a soma, e repete-se até sobrar uma. Entre todos os códigos de prefixo que dão um número inteiro de bits a cada símbolo, o de Huffman é ótimo.',
    complexity: { best: 'O(n + σ log σ)', average: 'O(n + σ log σ)', worst: 'O(n + σ log σ)', space: 'O(σ)' },
    steps: [
      'Conte a frequência de cada símbolo e crie uma folha (árvore de um nó) para cada um.',
      'Coloque todas as árvores em uma fila de prioridades, ordenada pelo peso (frequência).',
      'Retire as duas árvores de menor peso e junte-as como filhas de um novo nó, cujo peso é a soma delas.',
      'Devolva o novo nó à fila e repita até sobrar uma única árvore.',
      'O código de cada símbolo é o caminho da raiz até a sua folha: esquerda = 0, direita = 1.',
    ],
    usedIn: ['DEFLATE (ZIP, gzip, PNG)', 'JPEG e MP3 (etapa final de entropia)', 'Fax (Grupo 3 e 4)', 'HTTP/2 (compressão de cabeçalhos HPACK)', 'bzip2'],
    realWorld: [
      { title: 'Arquivos ZIP e PNG', text: 'O DEFLATE, usado em ZIP, gzip e PNG, termina com duas árvores de Huffman: uma para literais e comprimentos, outra para distâncias. Elas são calculadas para cada bloco de dados.' },
      { title: 'Fotos JPEG e músicas MP3', text: 'Depois das etapas com perdas (transformada e quantização), JPEG e MP3 usam Huffman para guardar os coeficientes com o menor número de bits possível.' },
      { title: 'Cabeçalhos HTTP/2', text: 'O HPACK, que comprime os cabeçalhos das requisições do HTTP/2, usa uma tabela de Huffman fixa, calculada a partir de amostras de tráfego real da web.' },
    ],
    curiosities: [
      'David Huffman inventou o algoritmo em 1951, como estudante do MIT, para não precisar fazer a prova final: o professor Robert Fano deu aos alunos a opção de um trabalho sobre o código binário mais eficiente — problema que nem o próprio Fano tinha resolvido.',
      'O método de Shannon-Fano, criado pelo professor, constrói a árvore de cima para baixo e nem sempre é ótimo; Huffman percebeu que construir de baixo para cima resolvia o problema.',
      'Huffman nunca patenteou o algoritmo. Mais tarde, dedicou-se à matemática do origami e criou dobraduras com superfícies curvas.',
    ],
    code: {
      python: String.raw`
        import heapq
        from collections import Counter

        def huffman(texto):
            folhas = sorted(Counter(texto).items())
            fila = [(f, i, s) for i, (s, f) in enumerate(folhas)]  # (peso, ordem de criação, nó)
            heapq.heapify(fila)
            ordem = len(fila)
            while len(fila) > 1:
                f1, _, a = heapq.heappop(fila)  # as duas árvores mais leves
                f2, _, b = heapq.heappop(fila)
                heapq.heappush(fila, (f1 + f2, ordem, (a, b)))
                ordem += 1
            codigos = {}
            def percorrer(no, codigo):
                if isinstance(no, tuple):
                    percorrer(no[0], codigo + "0")
                    percorrer(no[1], codigo + "1")
                else:
                    codigos[no] = codigo or "0"
            percorrer(fila[0][2], "")
            return codigos

        texto = "abracadabra"
        codigos = huffman(texto)
        for s in sorted(codigos):
            print(s, codigos[s])
        bits = "".join(codigos[c] for c in texto)
        print(len(bits), "bits:", bits)
        # a 0
        # b 110
        # c 100
        # d 101
        # r 111
        # 23 bits: 01101110100010101101110
      `,
      javascript: String.raw`
        function huffman(texto) {
          const freq = new Map();
          for (const c of [...texto].sort()) freq.set(c, (freq.get(c) ?? 0) + 1);
          let ordem = 0;
          const fila = [...freq].map(([s, f]) => ({ f, ordem: ordem++, s }));
          const porPeso = (a, b) => a.f - b.f || a.ordem - b.ordem;
          while (fila.length > 1) {
            fila.sort(porPeso); // fila de prioridades simples
            const [a, b] = fila.splice(0, 2); // as duas árvores mais leves
            fila.push({ f: a.f + b.f, ordem: ordem++, filhos: [a, b] });
          }
          const codigos = new Map();
          const percorrer = (no, codigo) => {
            if (no.filhos) { percorrer(no.filhos[0], codigo + "0"); percorrer(no.filhos[1], codigo + "1"); }
            else codigos.set(no.s, codigo || "0");
          };
          percorrer(fila[0], "");
          return codigos;
        }

        const texto = "abracadabra";
        const codigos = huffman(texto);
        for (const s of [...codigos.keys()].sort()) console.log(s + " " + codigos.get(s));
        const bits = [...texto].map(c => codigos.get(c)).join("");
        console.log(bits.length + " bits: " + bits);
        // a 0
        // b 110
        // c 100
        // d 101
        // r 111
        // 23 bits: 01101110100010101101110
      `,
      java: String.raw`
        import java.util.Map;
        import java.util.PriorityQueue;
        import java.util.TreeMap;

        public class Huffman {
            record No(int peso, int ordem, char simbolo, No esq, No dir) {}

            static void percorrer(No no, String codigo, Map<Character, String> codigos) {
                if (no.esq() == null) { codigos.put(no.simbolo(), codigo.isEmpty() ? "0" : codigo); return; }
                percorrer(no.esq(), codigo + "0", codigos);
                percorrer(no.dir(), codigo + "1", codigos);
            }

            static Map<Character, String> huffman(String texto) {
                Map<Character, Integer> freq = new TreeMap<>();
                for (char c : texto.toCharArray()) freq.merge(c, 1, Integer::sum);
                PriorityQueue<No> fila = new PriorityQueue<>((a, b) -> a.peso() != b.peso() ? a.peso() - b.peso() : a.ordem() - b.ordem());
                int ordem = 0;
                for (var e : freq.entrySet()) fila.add(new No(e.getValue(), ordem++, e.getKey(), null, null));
                while (fila.size() > 1) {
                    No a = fila.poll(), b = fila.poll(); // as duas árvores mais leves
                    fila.add(new No(a.peso() + b.peso(), ordem++, '\0', a, b));
                }
                Map<Character, String> codigos = new TreeMap<>();
                percorrer(fila.poll(), "", codigos);
                return codigos;
            }

            public static void main(String[] args) {
                String texto = "abracadabra";
                Map<Character, String> codigos = huffman(texto);
                codigos.forEach((s, c) -> System.out.println(s + " " + c));
                StringBuilder bits = new StringBuilder();
                for (char c : texto.toCharArray()) bits.append(codigos.get(c));
                System.out.println(bits.length() + " bits: " + bits);
                // a 0
                // b 110
                // c 100
                // d 101
                // r 111
                // 23 bits: 01101110100010101101110
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <map>
        #include <queue>
        #include <string>
        #include <tuple>
        #include <vector>
        using namespace std;

        struct No { char simbolo; int esq = -1, dir = -1; };

        vector<No> nos;
        map<char, string> codigos;

        void percorrer(int i, const string& codigo) {
            if (nos[i].esq < 0) { codigos[nos[i].simbolo] = codigo.empty() ? "0" : codigo; return; }
            percorrer(nos[i].esq, codigo + "0");
            percorrer(nos[i].dir, codigo + "1");
        }

        int main() {
            string texto = "abracadabra";
            map<char, int> freq;
            for (char c : texto) freq[c]++;
            // (peso, ordem de criação); a ordem de criação é também o índice do nó
            priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> fila;
            for (auto [s, f] : freq) { fila.push({f, (int)nos.size()}); nos.push_back({s}); }
            while (fila.size() > 1) {
                auto [fa, a] = fila.top(); fila.pop(); // as duas árvores mais leves
                auto [fb, b] = fila.top(); fila.pop();
                fila.push({fa + fb, (int)nos.size()});
                nos.push_back({'\0', a, b});
            }
            percorrer(fila.top().second, "");
            for (auto& [s, c] : codigos) cout << s << " " << c << "\n";
            string bits;
            for (char c : texto) bits += codigos[c];
            cout << bits.size() << " bits: " << bits << "\n";
            // a 0
            // b 110
            // c 100
            // d 101
            // r 111
            // 23 bits: 01101110100010101101110
        }
      `,
    },
  },
  {
    id: 'shannon-fano',
    name: 'Codificação de Shannon-Fano',
    difficulty: 'Intermediário',
    en: { name: 'Shannon-Fano Coding', summary: 'Builds prefix codes top-down by splitting the symbols into two groups of nearly equal total frequency.' },
    facts: { 'Criado por': 'Claude Shannon; Robert Fano', 'Ano': '1948; 1949', 'Tipo': 'Codificação de entropia (sem perdas)', 'Ótimo': 'Nem sempre (Huffman é)' },
    summary: 'Constrói códigos de prefixo de cima para baixo, dividindo os símbolos em dois grupos com frequências totais quase iguais.',
    description:
      'A Codificação de Shannon-Fano foi o primeiro método prático para criar códigos de tamanho variável a partir das frequências dos símbolos. Os símbolos são ordenados do mais frequente para o menos frequente e divididos em dois grupos cujas somas de frequência sejam o mais parecidas possível: o primeiro grupo recebe o bit 0, e o segundo, 1. Cada grupo é dividido de novo, recursivamente, até restar um símbolo por grupo. O resultado é um código de prefixo eficiente — mas nem sempre ótimo: a divisão "de cima para baixo" pode tomar decisões ruins que o método de Huffman, construído de baixo para cima, evita.',
    complexity: { best: 'O(n + σ log σ)', average: 'O(n + σ²)', worst: 'O(n + σ²)', space: 'O(σ)' },
    steps: [
      'Conte as frequências e ordene os símbolos da maior para a menor frequência.',
      'Divida a lista em duas partes contíguas, com somas de frequência o mais parecidas possível.',
      'Acrescente 0 ao código dos símbolos da primeira parte e 1 aos da segunda.',
      'Repita a divisão em cada parte até que cada uma tenha um único símbolo.',
      'O código de cada símbolo é a sequência de bits acumulada nas divisões.',
    ],
    usedIn: ['Método "implode" do formato ZIP (anos 1980)', 'Ensino de teoria da informação', 'Precursor da codificação de Huffman', 'Codificadores simples em sistemas embarcados', 'Comparações com o limite da entropia'],
    realWorld: [
      { title: 'ZIP antigo', text: 'O método "implode" das primeiras versões do PKZIP combinava uma janela deslizante (como o LZ77) com árvores de Shannon-Fano. Ele foi substituído pelo DEFLATE, que usa Huffman.' },
      { title: 'Teoria da informação', text: 'Shannon usou uma construção desse tipo em seu artigo de 1948 para mostrar que é possível chegar perto da entropia — o limite teórico de compressão — com códigos práticos.' },
      { title: 'Ensino', text: 'Comparar Shannon-Fano e Huffman sobre o mesmo texto é um exercício clássico: mostra por que "dividir ao meio" parece intuitivo, mas "juntar os menores" é o que garante o ótimo.' },
    ],
    curiosities: [
      'O nome mistura duas construções diferentes: a de Shannon (1948), baseada em probabilidades acumuladas, e a de Fano (1949), baseada em divisões. Hoje "Shannon-Fano" costuma designar a de Fano.',
      'Robert Fano propôs o problema do código ótimo como trabalho de fim de curso no MIT; seu aluno David Huffman o resolveu — e superou o método do próprio professor.',
      'Para cada símbolo, o código de Shannon-Fano fica a menos de 1 bit do ideal (−log₂ p); em média, ele nunca usa mais que 1 bit por símbolo além da entropia.',
    ],
    code: {
      python: String.raw`
        from collections import Counter

        def shannon_fano(texto):
            itens = sorted(Counter(texto).items(), key=lambda x: (-x[1], x[0]))
            codigos = {}
            def dividir(grupo, prefixo):
                if len(grupo) == 1:
                    codigos[grupo[0][0]] = prefixo or "0"
                    return
                total = sum(f for _, f in grupo)
                melhor, menor_dif, esquerda = 1, float("inf"), 0
                for k in range(1, len(grupo)):  # ponto de corte com somas mais parecidas
                    esquerda += grupo[k - 1][1]
                    dif = abs(total - 2 * esquerda)
                    if dif < menor_dif:
                        melhor, menor_dif = k, dif
                dividir(grupo[:melhor], prefixo + "0")
                dividir(grupo[melhor:], prefixo + "1")
            dividir(itens, "")
            return codigos

        texto = "abracadabra"
        codigos = shannon_fano(texto)
        for s in sorted(codigos):
            print(s, codigos[s])
        print(sum(len(codigos[c]) for c in texto), "bits")
        # a 0
        # b 10
        # c 1110
        # d 1111
        # r 110
        # 23 bits
      `,
      javascript: String.raw`
        function shannonFano(texto) {
          const freq = new Map();
          for (const c of texto) freq.set(c, (freq.get(c) ?? 0) + 1);
          const itens = [...freq].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
          const codigos = new Map();
          const dividir = (grupo, prefixo) => {
            if (grupo.length === 1) { codigos.set(grupo[0][0], prefixo || "0"); return; }
            const total = grupo.reduce((s, [, f]) => s + f, 0);
            let melhor = 1, menorDif = Infinity, esquerda = 0;
            for (let k = 1; k < grupo.length; k++) { // ponto de corte com somas mais parecidas
              esquerda += grupo[k - 1][1];
              const dif = Math.abs(total - 2 * esquerda);
              if (dif < menorDif) { melhor = k; menorDif = dif; }
            }
            dividir(grupo.slice(0, melhor), prefixo + "0");
            dividir(grupo.slice(melhor), prefixo + "1");
          };
          dividir(itens, "");
          return codigos;
        }

        const texto = "abracadabra";
        const codigos = shannonFano(texto);
        for (const s of [...codigos.keys()].sort()) console.log(s + " " + codigos.get(s));
        console.log([...texto].reduce((s, c) => s + codigos.get(c).length, 0) + " bits");
        // a 0
        // b 10
        // c 1110
        // d 1111
        // r 110
        // 23 bits
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Map;
        import java.util.TreeMap;

        public class ShannonFano {
            static void dividir(List<Map.Entry<Character, Integer>> grupo, String prefixo, Map<Character, String> codigos) {
                if (grupo.size() == 1) { codigos.put(grupo.get(0).getKey(), prefixo.isEmpty() ? "0" : prefixo); return; }
                int total = 0;
                for (var e : grupo) total += e.getValue();
                int melhor = 1, menorDif = Integer.MAX_VALUE, esquerda = 0;
                for (int k = 1; k < grupo.size(); k++) { // ponto de corte com somas mais parecidas
                    esquerda += grupo.get(k - 1).getValue();
                    int dif = Math.abs(total - 2 * esquerda);
                    if (dif < menorDif) { melhor = k; menorDif = dif; }
                }
                dividir(grupo.subList(0, melhor), prefixo + "0", codigos);
                dividir(grupo.subList(melhor, grupo.size()), prefixo + "1", codigos);
            }

            public static void main(String[] args) {
                String texto = "abracadabra";
                Map<Character, Integer> freq = new TreeMap<>();
                for (char c : texto.toCharArray()) freq.merge(c, 1, Integer::sum);
                List<Map.Entry<Character, Integer>> itens = new ArrayList<>(freq.entrySet());
                itens.sort((a, b) -> !a.getValue().equals(b.getValue()) ? b.getValue() - a.getValue() : a.getKey() - b.getKey());
                Map<Character, String> codigos = new TreeMap<>();
                dividir(itens, "", codigos);
                codigos.forEach((s, c) -> System.out.println(s + " " + c));
                int bits = 0;
                for (char c : texto.toCharArray()) bits += codigos.get(c).length();
                System.out.println(bits + " bits");
                // a 0
                // b 10
                // c 1110
                // d 1111
                // r 110
                // 23 bits
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <climits>
        #include <cstdlib>
        #include <iostream>
        #include <map>
        #include <string>
        #include <utility>
        #include <vector>
        using namespace std;

        using Item = pair<char, int>;
        map<char, string> codigos;

        void dividir(const vector<Item>& grupo, const string& prefixo) {
            if (grupo.size() == 1) { codigos[grupo[0].first] = prefixo.empty() ? "0" : prefixo; return; }
            int total = 0;
            for (auto& [s, f] : grupo) total += f;
            int melhor = 1, menorDif = INT_MAX, esquerda = 0;
            for (size_t k = 1; k < grupo.size(); k++) { // ponto de corte com somas mais parecidas
                esquerda += grupo[k - 1].second;
                int dif = abs(total - 2 * esquerda);
                if (dif < menorDif) { melhor = k; menorDif = dif; }
            }
            dividir(vector<Item>(grupo.begin(), grupo.begin() + melhor), prefixo + "0");
            dividir(vector<Item>(grupo.begin() + melhor, grupo.end()), prefixo + "1");
        }

        int main() {
            string texto = "abracadabra";
            map<char, int> freq;
            for (char c : texto) freq[c]++;
            vector<Item> itens(freq.begin(), freq.end());
            sort(itens.begin(), itens.end(), [](const Item& a, const Item& b) {
                return a.second != b.second ? a.second > b.second : a.first < b.first;
            });
            dividir(itens, "");
            for (auto& [s, c] : codigos) cout << s << " " << c << "\n";
            size_t bits = 0;
            for (char c : texto) bits += codigos[c].size();
            cout << bits << " bits\n";
            // a 0
            // b 10
            // c 1110
            // d 1111
            // r 110
            // 23 bits
        }
      `,
    },
  },
  {
    id: 'lz77',
    name: 'LZ77 (Janela Deslizante)',
    difficulty: 'Intermediário',
    en: { name: 'LZ77 (Sliding Window)', summary: 'Replaces repeated text with references to an earlier copy: "go back D characters and copy L of them".' },
    facts: { 'Criado por': 'Abraham Lempel e Jacob Ziv', 'Ano': '1977', 'Tipo': 'Dicionário (sem perdas)', 'Base de': 'DEFLATE (ZIP, gzip, PNG), LZMA, Brotli, Zstandard' },
    summary: 'Troca trechos repetidos por referências a uma cópia anterior: "volte D caracteres e copie L deles".',
    description:
      'O LZ77 comprime substituindo repetições por referências ao que já foi visto. O codificador mantém uma janela deslizante com os últimos caracteres processados (o "dicionário" implícito) e, a cada passo, procura nela o trecho mais longo igual ao início do texto que ainda falta comprimir. Ele emite um token (distância, comprimento, próximo caractere): "volte D posições, copie L caracteres e acrescente C". A cópia pode até se sobrepor ao trecho sendo gerado — (1, 5, x) após um "a" produz "aaaaax". O decodificador é simples e rápido: só repete as cópias. Quase todos os compressores modernos de uso geral descendem do LZ77.',
    complexity: { best: 'O(n)', average: 'O(n·w) (busca ingênua)', worst: 'O(n·w)', space: 'O(w)' },
    steps: [
      'Mantenha uma janela com os últimos w caracteres já codificados e uma área de leitura com os próximos.',
      'Procure na janela o trecho mais longo igual ao início da área de leitura (a cópia pode avançar sobre a própria área de leitura).',
      'Emita (distância até o início do trecho, comprimento, próximo caractere). Sem trecho, emita (0, 0, caractere).',
      'Avance comprimento + 1 posições e deslize a janela.',
      'Para descomprimir, para cada token copie L caracteres de D posições atrás, um por um, e acrescente o caractere.',
    ],
    usedIn: ['DEFLATE (ZIP, gzip, PNG, HTTP)', 'LZMA (7-Zip, xz)', 'Brotli e Zstandard', 'LZ4 e Snappy (compressão ultrarrápida)', 'Compressão de memória e sistemas de arquivos (ZFS, Btrfs)'],
    realWorld: [
      { title: 'A web', text: 'Quase toda página HTML, CSS e JavaScript viaja comprimida com gzip ou Brotli — ambos baseados em LZ77. Código-fonte é cheio de repetições (nomes de tags, palavras-chave), e a economia costuma passar de 70%.' },
      { title: 'Bancos de dados e sistemas de arquivos', text: 'LZ4 e Snappy usam LZ77 com busca por tabela de hash e sem etapa de entropia: comprimem menos, mas descomprimem a vários gigabytes por segundo, rápido o bastante para ficar no caminho de cada leitura do disco.' },
      { title: 'Atualizações de software', text: 'Zstandard e LZMA usam janelas enormes (de megabytes a gigabytes) para encontrar repetições distantes — essencial em pacotes de instalação e imagens de sistema.' },
    ],
    curiosities: [
      'Lempel e Ziv publicaram o LZ77 em 1977 e o LZ78 no ano seguinte, em artigos teóricos; eles provaram que esses métodos atingem, para textos longos, o limite de compressão de qualquer fonte estacionária.',
      'Em 2004, o IEEE escolheu o algoritmo de Lempel-Ziv como um "IEEE Milestone" — um marco histórico da engenharia elétrica e da computação.',
      'Um token como (1, 100, b) depois de um "a" gera 100 letras "a" seguidas de "b": a cópia sobreposta faz o LZ77 funcionar também como uma RLE.',
    ],
    code: {
      python: String.raw`
        def lz77_codificar(texto, janela=4096, max_comp=15):
            tokens, i = [], 0
            while i < len(texto):
                melhor_comp, melhor_dist = 0, 0
                limite = min(max_comp, len(texto) - i - 1)  # deixa espaço para o próximo caractere
                for j in range(i - 1, max(0, i - janela) - 1, -1):
                    k = 0
                    while k < limite and texto[j + k] == texto[i + k]:
                        k += 1                              # a cópia pode passar de i (sobreposição)
                    if k > melhor_comp:
                        melhor_comp, melhor_dist = k, i - j
                tokens.append((melhor_dist, melhor_comp, texto[i + melhor_comp]))
                i += melhor_comp + 1
            return tokens

        def lz77_decodificar(tokens):
            saida = []
            for dist, comp, c in tokens:
                for _ in range(comp):
                    saida.append(saida[-dist])              # copia caractere a caractere
                saida.append(c)
            return "".join(saida)

        tokens = lz77_codificar("aacaacabcabaaac")
        print(" ".join(f"({d},{c},{p})" for d, c, p in tokens))
        print(lz77_decodificar(tokens))
        # (0,0,a) (1,1,c) (3,4,b) (3,3,a) (1,2,c)
        # aacaacabcabaaac
      `,
      javascript: String.raw`
        function lz77Codificar(texto, janela = 4096, maxComp = 15) {
          const tokens = [];
          let i = 0;
          while (i < texto.length) {
            let melhorComp = 0, melhorDist = 0;
            const limite = Math.min(maxComp, texto.length - i - 1); // deixa espaço para o próximo caractere
            for (let j = i - 1; j >= Math.max(0, i - janela); j--) {
              let k = 0;
              while (k < limite && texto[j + k] === texto[i + k]) k++; // a cópia pode passar de i (sobreposição)
              if (k > melhorComp) { melhorComp = k; melhorDist = i - j; }
            }
            tokens.push([melhorDist, melhorComp, texto[i + melhorComp]]);
            i += melhorComp + 1;
          }
          return tokens;
        }

        function lz77Decodificar(tokens) {
          const saida = [];
          for (const [dist, comp, c] of tokens) {
            for (let k = 0; k < comp; k++) saida.push(saida[saida.length - dist]); // copia caractere a caractere
            saida.push(c);
          }
          return saida.join("");
        }

        const tokens = lz77Codificar("aacaacabcabaaac");
        console.log(tokens.map(([d, c, p]) => "(" + d + "," + c + "," + p + ")").join(" "));
        console.log(lz77Decodificar(tokens));
        // (0,0,a) (1,1,c) (3,4,b) (3,3,a) (1,2,c)
        // aacaacabcabaaac
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class LZ77 {
            record Token(int dist, int comp, char proximo) {
                public String toString() { return "(" + dist + "," + comp + "," + proximo + ")"; }
            }

            static List<Token> codificar(String texto, int janela, int maxComp) {
                List<Token> tokens = new ArrayList<>();
                int i = 0;
                while (i < texto.length()) {
                    int melhorComp = 0, melhorDist = 0;
                    int limite = Math.min(maxComp, texto.length() - i - 1); // deixa espaço para o próximo caractere
                    for (int j = i - 1; j >= Math.max(0, i - janela); j--) {
                        int k = 0;
                        while (k < limite && texto.charAt(j + k) == texto.charAt(i + k)) k++; // pode passar de i
                        if (k > melhorComp) { melhorComp = k; melhorDist = i - j; }
                    }
                    tokens.add(new Token(melhorDist, melhorComp, texto.charAt(i + melhorComp)));
                    i += melhorComp + 1;
                }
                return tokens;
            }

            static String decodificar(List<Token> tokens) {
                StringBuilder saida = new StringBuilder();
                for (Token t : tokens) {
                    for (int k = 0; k < t.comp(); k++) saida.append(saida.charAt(saida.length() - t.dist())); // caractere a caractere
                    saida.append(t.proximo());
                }
                return saida.toString();
            }

            public static void main(String[] args) {
                List<Token> tokens = codificar("aacaacabcabaaac", 4096, 15);
                System.out.println(String.join(" ", tokens.stream().map(Token::toString).toList()));
                System.out.println(decodificar(tokens));
                // (0,0,a) (1,1,c) (3,4,b) (3,3,a) (1,2,c)
                // aacaacabcabaaac
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <string>
        #include <tuple>
        #include <vector>
        using namespace std;

        using Token = tuple<int, int, char>; // (distância, comprimento, próximo)

        vector<Token> codificar(const string& texto, int janela = 4096, int maxComp = 15) {
            vector<Token> tokens;
            int n = texto.size(), i = 0;
            while (i < n) {
                int melhorComp = 0, melhorDist = 0;
                int limite = min(maxComp, n - i - 1); // deixa espaço para o próximo caractere
                for (int j = i - 1; j >= max(0, i - janela); j--) {
                    int k = 0;
                    while (k < limite && texto[j + k] == texto[i + k]) k++; // a cópia pode passar de i
                    if (k > melhorComp) { melhorComp = k; melhorDist = i - j; }
                }
                tokens.push_back({melhorDist, melhorComp, texto[i + melhorComp]});
                i += melhorComp + 1;
            }
            return tokens;
        }

        string decodificar(const vector<Token>& tokens) {
            string saida;
            for (auto [dist, comp, c] : tokens) {
                for (int k = 0; k < comp; k++) saida += saida[saida.size() - dist]; // caractere a caractere
                saida += c;
            }
            return saida;
        }

        int main() {
            auto tokens = codificar("aacaacabcabaaac");
            for (size_t i = 0; i < tokens.size(); i++) {
                auto [d, c, p] = tokens[i];
                cout << (i ? " " : "") << "(" << d << "," << c << "," << p << ")";
            }
            cout << "\n" << decodificar(tokens) << "\n";
            // (0,0,a) (1,1,c) (3,4,b) (3,3,a) (1,2,c)
            // aacaacabcabaaac
        }
      `,
    },
  },
  {
    id: 'lz78',
    name: 'LZ78',
    difficulty: 'Intermediário',
    en: { name: 'LZ78', summary: 'Builds an explicit dictionary of phrases while reading the text; each new phrase is "a known phrase + one character".' },
    facts: { 'Criado por': 'Abraham Lempel e Jacob Ziv', 'Ano': '1978', 'Tipo': 'Dicionário (sem perdas)', 'Evoluiu para': 'LZW (1984)' },
    summary: 'Monta um dicionário explícito de frases durante a leitura; cada nova frase é "uma frase conhecida + um caractere".',
    description:
      'O LZ78 troca a janela deslizante do LZ77 por um dicionário explícito e numerado. O codificador lê o texto até formar uma frase que ainda não está no dicionário — ela sempre será uma frase conhecida w mais um caractere c. Ele emite o par (índice de w, c) e acrescenta w + c ao dicionário com o próximo número. O índice 0 representa a frase vazia. O decodificador reconstrói exatamente o mesmo dicionário enquanto lê os pares, sem que ele precise ser transmitido. Com o tempo, as frases ficam cada vez mais longas, e cada par passa a representar muitos caracteres.',
    complexity: { best: 'O(n)', average: 'O(n) com trie', worst: 'O(n) com trie', space: 'O(tamanho do dicionário)' },
    steps: [
      'Comece com um dicionário vazio (a entrada 0 é a frase vazia) e a frase atual w = "".',
      'Leia o próximo caractere c. Se w + c já está no dicionário, faça w = w + c e continue lendo.',
      'Se não está, emita (índice de w, c), acrescente w + c ao dicionário e recomece com w = "".',
      'Se o texto acabar com w não vazio, emita só o índice de w.',
      'Para decodificar, cada par (i, c) gera a frase da entrada i seguida de c, que também vira uma nova entrada.',
    ],
    usedIn: ['Origem do LZW (GIF, TIFF, Unix compress)', 'Base teórica de compressão universal', 'Análise de complexidade de sequências (complexidade de Lempel-Ziv)', 'Predição e aprendizado de sequências', 'Ensino de compressão por dicionário'],
    realWorld: [
      { title: 'De LZ78 a LZW', text: 'Em 1984, Terry Welch simplificou o LZ78 começando com todos os caracteres no dicionário — assim, basta emitir índices. O resultado, LZW, foi usado no GIF, no TIFF e no comando compress do Unix.' },
      { title: 'Medir complexidade', text: 'O número de frases que o LZ78 produz é uma medida da "complexidade" de uma sequência. Ela é usada para analisar sinais de eletroencefalograma, sequências de DNA e textos.' },
      { title: 'Predição', text: 'A árvore de frases do LZ78 funciona como um modelo de probabilidades; algoritmos de pré-carregamento de páginas e de predição de sequências já usaram essa estrutura.' },
    ],
    curiosities: [
      'O dicionário do LZ78 forma naturalmente uma trie: cada nova frase é um nó filho da frase que ela estende. Por isso, a busca a cada passo é rápida.',
      'Diferente do LZ77, o dicionário do LZ78 nunca "esquece" — ele só cresce. Implementações reais precisam reiniciá-lo ou congelá-lo quando a memória acaba.',
      'Para dados aleatórios, nenhum dos dois métodos comprime: as frases ficam curtas e cada par custa mais bits que os caracteres que representa.',
    ],
    code: {
      python: String.raw`
        def lz78_codificar(texto):
            dicionario, tokens, w = {}, [], ""
            for c in texto:
                if w + c in dicionario:
                    w += c                                   # continua estendendo a frase
                else:
                    tokens.append((dicionario.get(w, 0), c))
                    dicionario[w + c] = len(dicionario) + 1  # nova entrada
                    w = ""
            if w:
                tokens.append((dicionario[w], ""))
            return tokens

        def lz78_decodificar(tokens):
            entradas, saida = [""], []
            for i, c in tokens:
                frase = entradas[i] + c
                saida.append(frase)
                entradas.append(frase)
            return "".join(saida)

        tokens = lz78_codificar("ABBCBCABABCAABCAAB")
        print(" ".join(f"({i},{c})" for i, c in tokens))  # (0,A) (0,B) (2,C) (3,A) (2,A) (4,A) (6,B)
        print(lz78_decodificar(tokens))                    # ABBCBCABABCAABCAAB
      `,
      javascript: String.raw`
        function lz78Codificar(texto) {
          const dicionario = new Map(), tokens = [];
          let w = "";
          for (const c of texto) {
            if (dicionario.has(w + c)) { w += c; continue; } // continua estendendo a frase
            tokens.push([dicionario.get(w) ?? 0, c]);
            dicionario.set(w + c, dicionario.size + 1); // nova entrada
            w = "";
          }
          if (w) tokens.push([dicionario.get(w), ""]);
          return tokens;
        }

        function lz78Decodificar(tokens) {
          const entradas = [""];
          let saida = "";
          for (const [i, c] of tokens) {
            const frase = entradas[i] + c;
            saida += frase;
            entradas.push(frase);
          }
          return saida;
        }

        const tokens = lz78Codificar("ABBCBCABABCAABCAAB");
        console.log(tokens.map(([i, c]) => "(" + i + "," + c + ")").join(" ")); // (0,A) (0,B) (2,C) (3,A) (2,A) (4,A) (6,B)
        console.log(lz78Decodificar(tokens));                                   // ABBCBCABABCAABCAAB
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.HashMap;
        import java.util.List;
        import java.util.Map;

        public class LZ78 {
            record Token(int indice, String c) {
                public String toString() { return "(" + indice + "," + c + ")"; }
            }

            static List<Token> codificar(String texto) {
                Map<String, Integer> dicionario = new HashMap<>();
                List<Token> tokens = new ArrayList<>();
                String w = "";
                for (char ch : texto.toCharArray()) {
                    String c = String.valueOf(ch);
                    if (dicionario.containsKey(w + c)) { w += c; continue; } // continua estendendo a frase
                    tokens.add(new Token(dicionario.getOrDefault(w, 0), c));
                    dicionario.put(w + c, dicionario.size() + 1); // nova entrada
                    w = "";
                }
                if (!w.isEmpty()) tokens.add(new Token(dicionario.get(w), ""));
                return tokens;
            }

            static String decodificar(List<Token> tokens) {
                List<String> entradas = new ArrayList<>(List.of(""));
                StringBuilder saida = new StringBuilder();
                for (Token t : tokens) {
                    String frase = entradas.get(t.indice()) + t.c();
                    saida.append(frase);
                    entradas.add(frase);
                }
                return saida.toString();
            }

            public static void main(String[] args) {
                List<Token> tokens = codificar("ABBCBCABABCAABCAAB");
                System.out.println(String.join(" ", tokens.stream().map(Token::toString).toList())); // (0,A) (0,B) (2,C) (3,A) (2,A) (4,A) (6,B)
                System.out.println(decodificar(tokens)); // ABBCBCABABCAABCAAB
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <map>
        #include <string>
        #include <utility>
        #include <vector>
        using namespace std;

        vector<pair<int, string>> codificar(const string& texto) {
            map<string, int> dicionario;
            vector<pair<int, string>> tokens;
            string w;
            for (char ch : texto) {
                string c(1, ch);
                if (dicionario.count(w + c)) { w += c; continue; } // continua estendendo a frase
                tokens.push_back({w.empty() ? 0 : dicionario[w], c});
                int proximo = dicionario.size() + 1;
                dicionario[w + c] = proximo; // nova entrada
                w.clear();
            }
            if (!w.empty()) tokens.push_back({dicionario[w], ""});
            return tokens;
        }

        string decodificar(const vector<pair<int, string>>& tokens) {
            vector<string> entradas = {""};
            string saida;
            for (auto& [i, c] : tokens) {
                string frase = entradas[i] + c;
                saida += frase;
                entradas.push_back(frase);
            }
            return saida;
        }

        int main() {
            auto tokens = codificar("ABBCBCABABCAABCAAB");
            for (size_t k = 0; k < tokens.size(); k++)
                cout << (k ? " " : "") << "(" << tokens[k].first << "," << tokens[k].second << ")";
            cout << "\n" << decodificar(tokens) << "\n";
            // (0,A) (0,B) (2,C) (3,A) (2,A) (4,A) (6,B)
            // ABBCBCABABCAABCAAB
        }
      `,
    },
  },
  {
    id: 'lzw',
    name: 'LZW (Lempel-Ziv-Welch)',
    difficulty: 'Intermediário',
    en: { name: 'LZW (Lempel-Ziv-Welch)', summary: 'A dictionary coder that starts with every single character and outputs only codes — the algorithm behind GIF.' },
    facts: { 'Criado por': 'Terry Welch (a partir de Lempel e Ziv)', 'Ano': '1984', 'Tipo': 'Dicionário (sem perdas)', 'Usado em': 'GIF, TIFF, PDF, Unix compress' },
    summary: 'Codificador de dicionário que já começa com todos os caracteres e emite só códigos — o algoritmo por trás do GIF.',
    description:
      'O LZW é a versão do LZ78 proposta por Terry Welch em 1984. A diferença é que o dicionário começa preenchido com todos os 256 caracteres de um byte, então a saída pode ser só uma sequência de códigos, sem o caractere extra de cada par. O codificador acumula a maior sequência w que já está no dicionário; quando w + c não está, emite o código de w, acrescenta w + c ao dicionário e recomeça a partir de c. O decodificador reconstrói o dicionário em paralelo, com um único caso especial: quando recebe um código que acabou de ser criado, a entrada só pode ser w + primeiro caractere de w.',
    complexity: { best: 'O(n)', average: 'O(n) com hash ou trie', worst: 'O(n) com hash ou trie', space: 'O(tamanho do dicionário)' },
    steps: [
      'Inicie o dicionário com os 256 caracteres de um byte (códigos 0–255) e w = "".',
      'Leia o próximo caractere c. Se w + c está no dicionário, faça w = w + c.',
      'Senão, emita o código de w, acrescente w + c com o próximo código livre (256, 257, …) e faça w = c.',
      'No fim do texto, emita o código de w.',
      'Para decodificar, cada código vira uma sequência; a nova entrada é a sequência anterior + o primeiro caractere da atual (caso especial: código ainda inexistente = anterior + primeiro caractere da anterior).',
    ],
    usedIn: ['Imagens GIF', 'TIFF (opção LZW)', 'PDF (filtro LZWDecode)', 'Comando compress do Unix (.Z)', 'Modems V.42bis'],
    realWorld: [
      { title: 'GIF', text: 'Cada imagem GIF é comprimida com LZW, com códigos de tamanho variável (de 3 a 12 bits). É por isso que GIFs com grandes áreas de cor sólida ficam tão pequenos.' },
      { title: 'Unix compress', text: 'O comando compress, que gerava os arquivos .Z, usava LZW e foi o padrão de compressão do Unix nos anos 1980 — até ser substituído pelo gzip, em parte por causa da patente.' },
      { title: 'Modems', text: 'O padrão V.42bis, usado em modems discados dos anos 1990, comprimia os dados em tempo real com uma variante de LZW, aumentando a velocidade efetiva da conexão.' },
    ],
    curiosities: [
      'A patente do LZW, da Unisys, causou a "controvérsia do GIF" nos anos 1990: a empresa passou a cobrar royalties de programas que gravavam GIFs. Em resposta, a comunidade criou o formato PNG, que usa DEFLATE. A patente expirou em 2003 nos EUA.',
      'O caso especial da decodificação acontece com sequências como "abababa": o codificador usa um código no mesmo passo em que o cria, antes de o decodificador conhecê-lo.',
      '"TOBEORNOTTOBEORTOBEORNOT", o exemplo clássico, tem 24 caracteres e vira 16 códigos — a repetição de "TOBEOR" é aproveitada já na segunda vez.',
    ],
    code: {
      python: String.raw`
        def lzw_codificar(texto):
            dicionario = {chr(i): i for i in range(256)}
            w, saida = "", []
            for c in texto:
                if w + c in dicionario:
                    w += c
                else:
                    saida.append(dicionario[w])
                    dicionario[w + c] = len(dicionario)  # próximo código livre
                    w = c
            if w:
                saida.append(dicionario[w])
            return saida

        def lzw_decodificar(codigos):
            dicionario = {i: chr(i) for i in range(256)}
            w = dicionario[codigos[0]]
            saida = [w]
            for codigo in codigos[1:]:
                # caso especial: código criado no passo anterior do codificador
                entrada = dicionario[codigo] if codigo in dicionario else w + w[0]
                saida.append(entrada)
                dicionario[len(dicionario)] = w + entrada[0]
                w = entrada
            return "".join(saida)

        codigos = lzw_codificar("TOBEORNOTTOBEORTOBEORNOT")
        print(" ".join(map(str, codigos)))
        print(lzw_decodificar(codigos))
        # 84 79 66 69 79 82 78 79 84 256 258 260 265 259 261 263
        # TOBEORNOTTOBEORTOBEORNOT
      `,
      javascript: String.raw`
        function lzwCodificar(texto) {
          const dicionario = new Map();
          for (let i = 0; i < 256; i++) dicionario.set(String.fromCharCode(i), i);
          let w = "";
          const saida = [];
          for (const c of texto) {
            if (dicionario.has(w + c)) { w += c; continue; }
            saida.push(dicionario.get(w));
            dicionario.set(w + c, dicionario.size); // próximo código livre
            w = c;
          }
          if (w) saida.push(dicionario.get(w));
          return saida;
        }

        function lzwDecodificar(codigos) {
          const dicionario = [];
          for (let i = 0; i < 256; i++) dicionario.push(String.fromCharCode(i));
          let w = dicionario[codigos[0]], saida = w;
          for (const codigo of codigos.slice(1)) {
            // caso especial: código criado no passo anterior do codificador
            const entrada = codigo < dicionario.length ? dicionario[codigo] : w + w[0];
            saida += entrada;
            dicionario.push(w + entrada[0]);
            w = entrada;
          }
          return saida;
        }

        const codigos = lzwCodificar("TOBEORNOTTOBEORTOBEORNOT");
        console.log(codigos.join(" "));
        console.log(lzwDecodificar(codigos));
        // 84 79 66 69 79 82 78 79 84 256 258 260 265 259 261 263
        // TOBEORNOTTOBEORTOBEORNOT
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.HashMap;
        import java.util.List;
        import java.util.Map;

        public class LZW {
            static List<Integer> codificar(String texto) {
                Map<String, Integer> dicionario = new HashMap<>();
                for (int i = 0; i < 256; i++) dicionario.put(String.valueOf((char) i), i);
                String w = "";
                List<Integer> saida = new ArrayList<>();
                for (char ch : texto.toCharArray()) {
                    String wc = w + ch;
                    if (dicionario.containsKey(wc)) { w = wc; continue; }
                    saida.add(dicionario.get(w));
                    dicionario.put(wc, dicionario.size()); // próximo código livre
                    w = String.valueOf(ch);
                }
                if (!w.isEmpty()) saida.add(dicionario.get(w));
                return saida;
            }

            static String decodificar(List<Integer> codigos) {
                List<String> dicionario = new ArrayList<>();
                for (int i = 0; i < 256; i++) dicionario.add(String.valueOf((char) i));
                String w = dicionario.get(codigos.get(0));
                StringBuilder saida = new StringBuilder(w);
                for (int codigo : codigos.subList(1, codigos.size())) {
                    // caso especial: código criado no passo anterior do codificador
                    String entrada = codigo < dicionario.size() ? dicionario.get(codigo) : w + w.charAt(0);
                    saida.append(entrada);
                    dicionario.add(w + entrada.charAt(0));
                    w = entrada;
                }
                return saida.toString();
            }

            public static void main(String[] args) {
                List<Integer> codigos = codificar("TOBEORNOTTOBEORTOBEORNOT");
                System.out.println(String.join(" ", codigos.stream().map(String::valueOf).toList()));
                System.out.println(decodificar(codigos));
                // 84 79 66 69 79 82 78 79 84 256 258 260 265 259 261 263
                // TOBEORNOTTOBEORTOBEORNOT
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        #include <unordered_map>
        #include <vector>
        using namespace std;

        vector<int> codificar(const string& texto) {
            unordered_map<string, int> dicionario;
            for (int i = 0; i < 256; i++) dicionario[string(1, (char)i)] = i;
            string w;
            vector<int> saida;
            for (char c : texto) {
                string wc = w + c;
                if (dicionario.count(wc)) { w = wc; continue; }
                saida.push_back(dicionario[w]);
                int proximo = dicionario.size();
                dicionario[wc] = proximo; // próximo código livre
                w = string(1, c);
            }
            if (!w.empty()) saida.push_back(dicionario[w]);
            return saida;
        }

        string decodificar(const vector<int>& codigos) {
            vector<string> dicionario;
            for (int i = 0; i < 256; i++) dicionario.push_back(string(1, (char)i));
            string w = dicionario[codigos[0]], saida = w;
            for (size_t k = 1; k < codigos.size(); k++) {
                // caso especial: código criado no passo anterior do codificador
                string entrada = codigos[k] < (int)dicionario.size() ? dicionario[codigos[k]] : w + w[0];
                saida += entrada;
                dicionario.push_back(w + entrada[0]);
                w = entrada;
            }
            return saida;
        }

        int main() {
            vector<int> codigos = codificar("TOBEORNOTTOBEORTOBEORNOT");
            for (size_t i = 0; i < codigos.size(); i++) cout << (i ? " " : "") << codigos[i];
            cout << "\n" << decodificar(codigos) << "\n";
            // 84 79 66 69 79 82 78 79 84 256 258 260 265 259 261 263
            // TOBEORNOTTOBEORTOBEORNOT
        }
      `,
    },
  },
  {
    id: 'arithmetic-coding',
    name: 'Codificação Aritmética',
    difficulty: 'Avançado',
    en: { name: 'Arithmetic Coding', summary: 'Encodes a whole message as a single number in [0, 1), shrinking an interval symbol by symbol — reaching the entropy limit.' },
    facts: { 'Criado por': 'Jorma Rissanen; Richard Pasco', 'Ano': '1976', 'Tipo': 'Codificação de entropia (sem perdas)', 'Vantagem sobre Huffman': 'Bits fracionários por símbolo', 'Usada em': 'JPEG 2000, H.264/H.265 (CABAC), AV1, LZMA' },
    summary: 'Codifica a mensagem inteira como um único número em [0, 1), encolhendo um intervalo símbolo a símbolo — chega ao limite da entropia.',
    description:
      'A Codificação Aritmética não dá um código a cada símbolo: ela representa a mensagem inteira como um intervalo dentro de [0, 1). Cada símbolo ocupa uma fatia proporcional à sua probabilidade; ao ler um símbolo, o intervalo atual encolhe para a fatia correspondente. Depois de toda a mensagem, qualquer número dentro do intervalo final a identifica — e basta escolher o que tem a representação binária mais curta. Como a largura final é o produto das probabilidades, o número de bits fica a cerca de 2 bits da entropia da mensagem inteira. Por isso ela supera Huffman, que precisa gastar pelo menos 1 bit por símbolo. Implementações reais usam inteiros de 32 ou 64 bits com "renormalização", emitindo os bits já definidos à medida que o intervalo encolhe.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(σ)' },
    steps: [
      'Defina o modelo: a probabilidade de cada símbolo, que divide [0, 1) em fatias consecutivas.',
      'Comece com o intervalo [baixo, alto) = [0, 1).',
      'Para cada símbolo, encolha o intervalo para a fatia dele: novo baixo = baixo + largura × início da fatia; nova largura = largura × probabilidade.',
      'No fim, escolha o número com a representação binária mais curta dentro do intervalo final: esses bits são a mensagem comprimida.',
      'Para decodificar, veja em que fatia o número cai, emita o símbolo, encolha o intervalo do mesmo jeito e repita.',
    ],
    usedIn: ['Vídeo H.264, H.265 e AV1 (CABAC e codificadores de faixa)', 'JPEG 2000 e JPEG XL', 'LZMA / 7-Zip e xz (codificador de faixa)', 'Compressores de alto desempenho (PAQ, cmix)', 'Modelos de linguagem usados como compressores'],
    realWorld: [
      { title: 'Vídeo', text: 'O CABAC, a etapa de entropia do H.264 e do H.265, é uma codificação aritmética binária com modelos que se adaptam ao conteúdo. Ele economiza de 10% a 15% de bits em relação à alternativa com códigos de tamanho variável.' },
      { title: '7-Zip', text: 'O LZMA, formato do 7-Zip e do xz, combina um LZ77 de janela grande com um codificador de faixa (uma variante da codificação aritmética) e modelos de contexto. É um dos formatos de uso geral que mais comprimem.' },
      { title: 'Compressão com IA', text: 'Qualquer modelo que prevê o próximo símbolo vira um compressor quando combinado com codificação aritmética: quanto melhor a previsão, menos bits. Compressores recordistas, como o cmix, e experimentos com modelos de linguagem usam exatamente essa ideia.' },
    ],
    curiosities: [
      'Para um símbolo com probabilidade 0,99, Huffman gasta 1 bit inteiro; a codificação aritmética gasta cerca de 0,015 bit. Em dados muito previsíveis, a diferença é enorme.',
      'Por décadas, patentes da IBM e de outras empresas limitaram o uso da codificação aritmética — por isso o JPEG original quase sempre usa Huffman, embora o padrão também preveja a versão aritmética.',
      'O código mostrado usa frações exatas para ficar fiel à ideia; em produção, o intervalo é guardado em inteiros de tamanho fixo, e os bits iniciais já definidos são enviados e descartados à medida que o intervalo encolhe.',
    ],
    code: {
      python: String.raw`
        import math
        from collections import Counter
        from fractions import Fraction

        def modelo(texto):
            freq = dict(sorted(Counter(texto).items()))
            inicio, acumulado = {}, 0
            for s, f in freq.items():
                inicio[s] = acumulado    # cada símbolo ocupa a fatia [inicio, inicio + f) / total
                acumulado += f
            return freq, inicio, acumulado

        def codificar(texto, freq, inicio, total):
            baixo, largura = Fraction(0), Fraction(1)
            for c in texto:              # encolhe o intervalo para a fatia de c
                baixo += largura * Fraction(inicio[c], total)
                largura *= Fraction(freq[c], total)
            k = 1
            while True:                  # menor fração binária dentro de [baixo, baixo + largura)
                x = math.ceil(baixo * 2**k)
                if Fraction(x, 2**k) < baixo + largura:
                    return format(x, f"0{k}b")
                k += 1

        def decodificar(bits, n, freq, inicio, total):
            v = Fraction(int(bits, 2), 2 ** len(bits))
            baixo, largura, saida = Fraction(0), Fraction(1), []
            for _ in range(n):
                alvo = (v - baixo) / largura * total  # em que fatia v está
                c = next(s for s in freq if inicio[s] <= alvo < inicio[s] + freq[s])
                saida.append(c)
                baixo += largura * Fraction(inicio[c], total)
                largura *= Fraction(freq[c], total)
            return "".join(saida)

        texto = "ABRACADABRA"
        freq, inicio, total = modelo(texto)
        bits = codificar(texto, freq, inicio, total)
        print(bits, len(bits), "bits")
        print(decodificar(bits, len(texto), freq, inicio, total))
        # 0100011101011110101101 22 bits
        # ABRACADABRA
      `,
      javascript: String.raw`
        // O intervalo é [L/D, (L + W)/D), com inteiros exatos (BigInt).
        function modelo(texto) {
          const freq = new Map();
          for (const c of [...texto].sort()) freq.set(c, (freq.get(c) ?? 0n) + 1n);
          const inicio = new Map();
          let total = 0n;
          for (const [s, f] of freq) { inicio.set(s, total); total += f; } // fatia [inicio, inicio + f) / total
          return { freq, inicio, total };
        }

        function codificar(texto, { freq, inicio, total }) {
          let L = 0n, W = 1n, D = 1n;
          for (const c of texto) { // encolhe o intervalo para a fatia de c
            L = L * total + W * inicio.get(c);
            W *= freq.get(c);
            D *= total;
          }
          for (let k = 1n; ; k++) { // menor fração binária dentro do intervalo
            const p = 1n << k;
            const x = (L * p + D - 1n) / D; // teto de L/D · 2^k
            if (x * D < (L + W) * p) return x.toString(2).padStart(Number(k), "0");
          }
        }

        function decodificar(bits, n, { freq, inicio, total }) {
          const x = BigInt("0b" + bits), p = 1n << BigInt(bits.length);
          let L = 0n, W = 1n, D = 1n, saida = "";
          for (let i = 0; i < n; i++) {
            const alvo = ((x * D - L * p) * total) / (W * p); // em que fatia o número está
            const [c] = [...inicio].find(([s, ini]) => ini <= alvo && alvo < ini + freq.get(s));
            saida += c;
            L = L * total + W * inicio.get(c);
            W *= freq.get(c);
            D *= total;
          }
          return saida;
        }

        const texto = "ABRACADABRA";
        const m = modelo(texto);
        const bits = codificar(texto, m);
        console.log(bits + " " + bits.length + " bits");
        console.log(decodificar(bits, texto.length, m));
        // 0100011101011110101101 22 bits
        // ABRACADABRA
      `,
      java: String.raw`
        import java.math.BigInteger;
        import java.util.Map;
        import java.util.TreeMap;

        public class CodificacaoAritmetica {
            // O intervalo é [L/D, (L + W)/D), com inteiros exatos (BigInteger).
            static Map<Character, Long> freq = new TreeMap<>(), inicio = new TreeMap<>();
            static BigInteger total;

            static void modelo(String texto) {
                for (char c : texto.toCharArray()) freq.merge(c, 1L, Long::sum);
                long acumulado = 0;
                for (var e : freq.entrySet()) { inicio.put(e.getKey(), acumulado); acumulado += e.getValue(); }
                total = BigInteger.valueOf(acumulado);
            }

            static BigInteger b(long v) { return BigInteger.valueOf(v); }

            static String codificar(String texto) {
                BigInteger L = BigInteger.ZERO, W = BigInteger.ONE, D = BigInteger.ONE;
                for (char c : texto.toCharArray()) { // encolhe o intervalo para a fatia de c
                    L = L.multiply(total).add(W.multiply(b(inicio.get(c))));
                    W = W.multiply(b(freq.get(c)));
                    D = D.multiply(total);
                }
                for (int k = 1; ; k++) { // menor fração binária dentro do intervalo
                    BigInteger p = BigInteger.ONE.shiftLeft(k);
                    BigInteger x = L.multiply(p).add(D).subtract(BigInteger.ONE).divide(D); // teto de L/D · 2^k
                    if (x.multiply(D).compareTo(L.add(W).multiply(p)) < 0) {
                        String s = x.toString(2);
                        return "0".repeat(k - s.length()) + s;
                    }
                }
            }

            static String decodificar(String bits, int n) {
                BigInteger x = new BigInteger(bits, 2), p = BigInteger.ONE.shiftLeft(bits.length());
                BigInteger L = BigInteger.ZERO, W = BigInteger.ONE, D = BigInteger.ONE;
                StringBuilder saida = new StringBuilder();
                for (int i = 0; i < n; i++) {
                    long alvo = x.multiply(D).subtract(L.multiply(p)).multiply(total).divide(W.multiply(p)).longValue();
                    char c = 0;
                    for (var e : inicio.entrySet()) // em que fatia o número está
                        if (e.getValue() <= alvo && alvo < e.getValue() + freq.get(e.getKey())) c = e.getKey();
                    saida.append(c);
                    L = L.multiply(total).add(W.multiply(b(inicio.get(c))));
                    W = W.multiply(b(freq.get(c)));
                    D = D.multiply(total);
                }
                return saida.toString();
            }

            public static void main(String[] args) {
                String texto = "ABRACADABRA";
                modelo(texto);
                String bits = codificar(texto);
                System.out.println(bits + " " + bits.length() + " bits");
                System.out.println(decodificar(bits, texto.length()));
                // 0100011101011110101101 22 bits
                // ABRACADABRA
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <map>
        #include <string>
        using namespace std;

        // O intervalo é [L/D, (L + W)/D), com inteiros exatos de 128 bits (GCC e Clang).
        // Basta para mensagens curtas; codificadores reais "renormalizam" para usar inteiros fixos.
        using i128 = __int128;

        map<char, i128> freq, inicio;
        i128 total = 0;

        string codificar(const string& texto) {
            i128 L = 0, W = 1, D = 1;
            for (char c : texto) { // encolhe o intervalo para a fatia de c
                L = L * total + W * inicio[c];
                W *= freq[c];
                D *= total;
            }
            for (int k = 1; ; k++) { // menor fração binária dentro do intervalo
                i128 p = (i128)1 << k;
                i128 x = (L * p + D - 1) / D; // teto de L/D · 2^k
                if (x * D < (L + W) * p) {
                    string bits;
                    for (int i = k - 1; i >= 0; i--) bits += ((x >> i) & 1) ? '1' : '0';
                    return bits;
                }
            }
        }

        string decodificar(const string& bits, int n) {
            i128 x = 0, p = (i128)1 << bits.size();
            for (char b : bits) x = x * 2 + (b - '0');
            i128 L = 0, W = 1, D = 1;
            string saida;
            for (int i = 0; i < n; i++) {
                i128 alvo = ((x * D - L * p) * total) / (W * p); // em que fatia o número está
                char c = 0;
                for (auto& [s, ini] : inicio) if (ini <= alvo && alvo < ini + freq[s]) c = s;
                saida += c;
                L = L * total + W * inicio[c];
                W *= freq[c];
                D *= total;
            }
            return saida;
        }

        int main() {
            string texto = "ABRACADABRA";
            for (char c : texto) freq[c]++;
            for (auto& [s, f] : freq) { inicio[s] = total; total += f; } // fatia [inicio, inicio + f) / total
            string bits = codificar(texto);
            cout << bits << " " << bits.size() << " bits\n";
            cout << decodificar(bits, texto.size()) << "\n";
            // 0100011101011110101101 22 bits
            // ABRACADABRA
        }
      `,
    },
  },
  {
    id: 'burrows-wheeler',
    name: 'Transformada de Burrows-Wheeler',
    difficulty: 'Avançado',
    en: { name: 'Burrows-Wheeler Transform', summary: 'Sorts all rotations of the text and keeps the last column — a reversible shuffle that groups equal letters together.' },
    facts: { 'Criado por': 'Michael Burrows e David Wheeler', 'Ano': '1994', 'Tipo': 'Transformação reversível (pré-processamento)', 'Usada em': 'bzip2, alinhamento de DNA (BWA, Bowtie)' },
    summary: 'Ordena todas as rotações do texto e guarda a última coluna — um embaralhamento reversível que agrupa letras iguais.',
    description:
      'A Transformada de Burrows-Wheeler (BWT) não comprime nada sozinha: ela reorganiza o texto de um jeito que fica muito mais fácil de comprimir — e que pode ser desfeito. Acrescenta-se um marcador de fim ("$") ao texto, listam-se todas as suas rotações, ordenam-se essas rotações e guarda-se a última coluna. Como rotações que começam com o mesmo contexto ficam vizinhas depois da ordenação, os caracteres que antecedem esse contexto tendem a ser iguais: em inglês, as rotações que começam com "he " quase sempre terminam com "t". O resultado tem longas sequências de letras repetidas, ideais para move-to-front, RLE e Huffman. A inversão usa só a última coluna e o fato de que a primeira coluna é ela mesma ordenada.',
    complexity: { best: 'O(n) (via array de sufixos)', average: 'O(n log n)', worst: 'O(n² log n) (ordenação ingênua)', space: 'O(n)' },
    steps: [
      'Acrescente ao texto um marcador de fim "$", menor que todos os outros caracteres.',
      'Liste as n rotações do texto (mova o primeiro caractere para o fim, n vezes).',
      'Ordene as rotações em ordem lexicográfica.',
      'A saída é a última coluna da matriz ordenada (na prática, calculada com um array de sufixos, sem montar a matriz).',
      'Para inverter, comece com uma tabela vazia; n vezes, escreva a última coluna à esquerda da tabela e reordene. A linha que termina com "$" é o texto original.',
    ],
    usedIn: ['bzip2', 'Alinhadores de DNA (BWA, Bowtie, SOAP2)', 'Índice FM (busca em textos comprimidos)', 'Compressores experimentais de alto desempenho', 'Bioinformática e indexação de genomas'],
    realWorld: [
      { title: 'bzip2', text: 'O bzip2 aplica BWT em blocos de até 900 KB, seguida de move-to-front, RLE e Huffman. Em código-fonte e texto, ele costuma gerar arquivos 10% a 20% menores que o gzip.' },
      { title: 'Genômica', text: 'Programas como BWA e Bowtie alinham bilhões de pequenas leituras de DNA contra o genoma humano usando o índice FM, construído sobre a BWT. O genoma inteiro (3 bilhões de bases) cabe em poucos gigabytes de memória e pode ser consultado sem descomprimir.' },
      { title: 'Busca em textos comprimidos', text: 'O índice FM, de Ferragina e Manzini (2000), conta e localiza ocorrências de um padrão diretamente na BWT, em tempo proporcional ao tamanho do padrão — é ao mesmo tempo compressão e índice de busca.' },
    ],
    curiosities: [
      'David Wheeler descobriu a transformada em 1983, mas só a publicou em 1994, em um relatório técnico da DEC com Michael Burrows.',
      'O exemplo clássico "banana" vira "annb$aa": os "a" e os "n" se agrupam porque as rotações que começam com "a" e com "na" ficam vizinhas depois da ordenação.',
      'A mesma ordenação de rotações dá o array de sufixos do texto, uma das estruturas mais importantes de bioinformática e de algoritmos de strings.',
    ],
    code: {
      python: String.raw`
        def bwt(texto):
            s = texto + "$"  # marcador de fim, menor que as letras
            rotacoes = sorted(s[i:] + s[:i] for i in range(len(s)))
            return "".join(r[-1] for r in rotacoes)

        def bwt_inversa(ultima):
            tabela = [""] * len(ultima)
            for _ in ultima:  # escreve a última coluna à esquerda e reordena, n vezes
                tabela = sorted(c + linha for c, linha in zip(ultima, tabela))
            return next(r for r in tabela if r.endswith("$"))[:-1]

        for palavra in ["banana", "abracadabra"]:
            saida = bwt(palavra)
            print(saida, bwt_inversa(saida))
        # annb$aa banana
        # ard$rcaaaabb abracadabra
      `,
      javascript: String.raw`
        function bwt(texto) {
          const s = texto + "$"; // marcador de fim, menor que as letras
          const rotacoes = [...s].map((_, i) => s.slice(i) + s.slice(0, i)).sort();
          return rotacoes.map(r => r[r.length - 1]).join("");
        }

        function bwtInversa(ultima) {
          let tabela = Array(ultima.length).fill("");
          for (let k = 0; k < ultima.length; k++) { // escreve a última coluna à esquerda e reordena
            tabela = tabela.map((linha, i) => ultima[i] + linha).sort();
          }
          return tabela.find(r => r.endsWith("$")).slice(0, -1);
        }

        for (const palavra of ["banana", "abracadabra"]) {
          const saida = bwt(palavra);
          console.log(saida + " " + bwtInversa(saida));
        }
        // annb$aa banana
        // ard$rcaaaabb abracadabra
      `,
      java: String.raw`
        import java.util.Arrays;

        public class BurrowsWheeler {
            static String bwt(String texto) {
                String s = texto + "$"; // marcador de fim, menor que as letras
                String[] rotacoes = new String[s.length()];
                for (int i = 0; i < s.length(); i++) rotacoes[i] = s.substring(i) + s.substring(0, i);
                Arrays.sort(rotacoes);
                StringBuilder saida = new StringBuilder();
                for (String r : rotacoes) saida.append(r.charAt(r.length() - 1));
                return saida.toString();
            }

            static String inversa(String ultima) {
                String[] tabela = new String[ultima.length()];
                Arrays.fill(tabela, "");
                for (int k = 0; k < ultima.length(); k++) { // escreve a última coluna à esquerda e reordena
                    for (int i = 0; i < tabela.length; i++) tabela[i] = ultima.charAt(i) + tabela[i];
                    Arrays.sort(tabela);
                }
                for (String r : tabela) if (r.endsWith("$")) return r.substring(0, r.length() - 1);
                return "";
            }

            public static void main(String[] args) {
                for (String palavra : new String[]{"banana", "abracadabra"}) {
                    String saida = bwt(palavra);
                    System.out.println(saida + " " + inversa(saida));
                }
                // annb$aa banana
                // ard$rcaaaabb abracadabra
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        string bwt(const string& texto) {
            string s = texto + "$"; // marcador de fim, menor que as letras
            vector<string> rotacoes;
            for (size_t i = 0; i < s.size(); i++) rotacoes.push_back(s.substr(i) + s.substr(0, i));
            sort(rotacoes.begin(), rotacoes.end());
            string saida;
            for (const string& r : rotacoes) saida += r.back();
            return saida;
        }

        string inversa(const string& ultima) {
            vector<string> tabela(ultima.size());
            for (size_t k = 0; k < ultima.size(); k++) { // escreve a última coluna à esquerda e reordena
                for (size_t i = 0; i < tabela.size(); i++) tabela[i] = ultima[i] + tabela[i];
                sort(tabela.begin(), tabela.end());
            }
            for (const string& r : tabela) if (r.back() == '$') return r.substr(0, r.size() - 1);
            return "";
        }

        int main() {
            for (string palavra : {"banana", "abracadabra"}) {
                string saida = bwt(palavra);
                cout << saida << " " << inversa(saida) << "\n";
            }
            // annb$aa banana
            // ard$rcaaaabb abracadabra
        }
      `,
    },
  },
  {
    id: 'deflate',
    name: 'DEFLATE',
    difficulty: 'Avançado',
    en: { name: 'DEFLATE', summary: 'LZ77 followed by Huffman coding: the format behind ZIP, gzip and PNG, and the most widely used compressor in the world.' },
    facts: { 'Criado por': 'Phil Katz', 'Ano': '1990 (PKZIP 2); RFC 1951 em 1996', 'Tipo': 'LZ77 + Huffman (sem perdas)', 'Usado em': 'ZIP, gzip, PNG, HTTP, PDF', 'Implementação mostrada': 'Biblioteca padrão (zlib)' },
    summary: 'LZ77 seguido de Huffman: o formato do ZIP, do gzip e do PNG, e o compressor mais usado do mundo.',
    description:
      'O DEFLATE combina as duas grandes ideias da compressão sem perdas. Primeiro, um LZ77 com janela de 32 KB troca repetições por pares <comprimento, distância> (comprimentos de 3 a 258). Depois, a sequência de literais, comprimentos e distâncias é codificada com Huffman: um código para o alfabeto de literais e comprimentos (286 símbolos) e outro para as distâncias (30 símbolos), com "bits extras" para os valores intermediários. Os dados são divididos em blocos, e cada um pode ser guardado sem compressão, com códigos de Huffman fixos ou com códigos dinâmicos, cuja descrição vai no cabeçalho do bloco (comprimida também com Huffman). O resultado é rápido, livre de patentes e bom o bastante para ter virado o padrão da internet.',
    complexity: { best: 'O(n)', average: 'O(n) (busca por tabela de hash)', worst: 'O(n·w) (níveis mais altos)', space: 'O(32 KB + tabelas)' },
    steps: [
      'Divida os dados em blocos e, em cada um, procure repetições com LZ77 (janela de 32 KB, usando uma tabela de hash de 3 bytes).',
      'Gere uma sequência de literais (bytes) e pares <comprimento, distância>; repetições com menos de 3 bytes ficam como literais.',
      'Conte a frequência dos símbolos e construa dois códigos de Huffman: literais/comprimentos e distâncias.',
      'Escreva o cabeçalho do bloco (com os tamanhos dos códigos de Huffman) e os símbolos codificados, com os bits extras.',
      'Para descomprimir, leia as tabelas, decodifique os símbolos e repita as cópias do LZ77.',
    ],
    usedIn: ['ZIP e gzip', 'Imagens PNG', 'HTTP (Content-Encoding: gzip e deflate)', 'PDF (FlateDecode)', 'Arquivos .jar, .docx, .xlsx, .apk e .epub (todos são ZIP)'],
    realWorld: [
      { title: 'Cada site que você abre', text: 'Servidores comprimem HTML, CSS e JavaScript com gzip (DEFLATE) antes de enviar. Brotli e Zstandard estão substituindo-o aos poucos, mas o gzip ainda é suportado por praticamente todo cliente HTTP.' },
      { title: 'Documentos do Office', text: 'Arquivos .docx, .xlsx e .pptx são pacotes ZIP com arquivos XML dentro — renomeie um para .zip e abra. O mesmo vale para .jar, .apk e .epub.' },
      { title: 'Imagens PNG', text: 'O PNG aplica um filtro (codificação delta) em cada linha de pixels e comprime o resultado com DEFLATE, via zlib. É por isso que ele é sem perdas, mas comprime fotos bem pior que o JPEG.' },
    ],
    curiosities: [
      'Phil Katz criou o formato ZIP e o DEFLATE depois de uma disputa judicial com a empresa do formato ARC. Ele publicou a especificação, e o ZIP se espalhou justamente por ser aberto.',
      'A biblioteca zlib, de Jean-loup Gailly e Mark Adler (1995), está em bilhões de dispositivos: sistemas operacionais, navegadores, consoles, celulares e até no Curiosity, em Marte.',
      'O Zopfli, do Google (2013), gera arquivos DEFLATE de 3% a 8% menores que o zlib, sem mudar o formato — ele gasta até 100 vezes mais tempo procurando as melhores escolhas de LZ77 e Huffman.',
    ],
    code: {
      python: String.raw`
        import zlib

        texto = ("o rato roeu a roupa do rei de roma. " * 20).encode("utf-8")
        comprimido = zlib.compress(texto, 9)  # nível 9: compressão máxima
        print(len(texto), "bytes ->", len(comprimido), "bytes")
        print("ok" if zlib.decompress(comprimido) == texto else "erro")
        # 720 bytes -> 48 bytes (o tamanho exato pode variar com a versão da zlib)
        # ok
      `,
      javascript: String.raw`
        import zlib from "node:zlib";

        const texto = Buffer.from("o rato roeu a roupa do rei de roma. ".repeat(20), "utf-8");
        const comprimido = zlib.deflateSync(texto, { level: 9 }); // nível 9: compressão máxima
        console.log(texto.length + " bytes -> " + comprimido.length + " bytes");
        console.log(zlib.inflateSync(comprimido).equals(texto) ? "ok" : "erro");
        // 720 bytes -> 48 bytes (o tamanho exato pode variar com a versão da zlib)
        // ok
      `,
      java: String.raw`
        import java.io.ByteArrayOutputStream;
        import java.nio.charset.StandardCharsets;
        import java.util.Arrays;
        import java.util.zip.DataFormatException;
        import java.util.zip.Deflater;
        import java.util.zip.Inflater;

        public class Deflate {
            public static void main(String[] args) throws DataFormatException {
                byte[] texto = "o rato roeu a roupa do rei de roma. ".repeat(20).getBytes(StandardCharsets.UTF_8);

                Deflater deflater = new Deflater(9); // nível 9: compressão máxima
                deflater.setInput(texto);
                deflater.finish();
                ByteArrayOutputStream saida = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                while (!deflater.finished()) saida.write(buffer, 0, deflater.deflate(buffer));
                byte[] comprimido = saida.toByteArray();
                System.out.println(texto.length + " bytes -> " + comprimido.length + " bytes");

                Inflater inflater = new Inflater();
                inflater.setInput(comprimido);
                byte[] restaurado = new byte[texto.length];
                inflater.inflate(restaurado);
                System.out.println(Arrays.equals(restaurado, texto) ? "ok" : "erro");
                // 720 bytes -> 48 bytes (o tamanho exato pode variar com a versão da zlib)
                // ok
            }
        }
      `,
      cpp: String.raw`
        // Compile com: g++ deflate.cpp -lz
        #include <iostream>
        #include <string>
        #include <vector>
        #include <zlib.h>
        using namespace std;

        int main() {
            string texto;
            for (int i = 0; i < 20; i++) texto += "o rato roeu a roupa do rei de roma. ";

            uLongf tamanho = compressBound(texto.size());
            vector<Bytef> comprimido(tamanho);
            compress2(comprimido.data(), &tamanho, (const Bytef*)texto.data(), texto.size(), 9); // nível 9
            cout << texto.size() << " bytes -> " << tamanho << " bytes\n";

            uLongf tamanhoOriginal = texto.size();
            string restaurado(tamanhoOriginal, '\0');
            uncompress((Bytef*)restaurado.data(), &tamanhoOriginal, comprimido.data(), tamanho);
            cout << (restaurado == texto ? "ok" : "erro") << "\n";
            // 720 bytes -> 48 bytes (o tamanho exato pode variar com a versão da zlib)
            // ok
        }
      `,
    },
  },
]
