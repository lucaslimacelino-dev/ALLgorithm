export default [
  {
    id: 'linear-search',
    name: 'Busca Linear',
    difficulty: 'Iniciante',
    facts: { 'Criado por': 'Método clássico', 'Requer ordenação': 'Não', 'Estrutura': 'Qualquer sequência' },
    summary: 'Verifica os elementos um a um até encontrar o alvo ou chegar ao fim.',
    description:
      'A Busca Linear (ou sequencial) é a forma mais direta de procurar algo: percorre a lista do início ao fim comparando cada elemento com o alvo. Não exige que os dados estejam ordenados nem nenhuma estrutura especial — por isso funciona em qualquer lista, mas o tempo cresce na mesma proporção que o tamanho dela.',
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Comece pelo primeiro elemento.',
      'Compare o elemento atual com o alvo.',
      'Se forem iguais, devolva a posição.',
      'Se não, avance para o próximo elemento.',
      'Se chegar ao fim sem encontrar, o alvo não está na lista.',
    ],
    usedIn: ['Listas pequenas ou não ordenadas', 'Ctrl+F em documentos', 'Busca em arquivos e logs (grep)', 'Dados em fluxo (streaming)', 'indexOf, includes, list.index, std::find'],
    realWorld: [
      { title: 'Lista de presença', text: 'Procurar um nome numa lista de presença fora de ordem é uma busca linear: você olha nome por nome até encontrar.' },
      { title: 'Busca em logs', text: 'Ferramentas como o grep percorrem arquivos linha a linha procurando um padrão — uma busca linear altamente otimizada, capaz de varrer gigabytes por segundo.' },
      { title: 'Listas pequenas', text: 'Com poucas dezenas de elementos, a busca linear costuma vencer alternativas sofisticadas, porque acessa a memória em sequência e aproveita o cache do processador.' },
    ],
    curiosities: [
      'Os métodos indexOf e includes do JavaScript, list.index do Python e std::find do C++ fazem busca linear.',
      'Uma otimização clássica é a "sentinela": colocar o próprio alvo no fim da lista elimina a verificação de "cheguei ao fim?" a cada passo.',
      'Se os itens mais procurados forem movidos para o início da lista (heurística "mover para a frente"), a busca linear média fica bem mais rápida.',
    ],
    code: {
      python: String.raw`
        def busca_linear(arr, alvo):
            for i, valor in enumerate(arr):
                if valor == alvo:
                    return i
            return -1

        nomes = ["Ana", "Bruno", "Carla", "Davi"]
        print(busca_linear(nomes, "Carla"))  # 2
        print(busca_linear(nomes, "Zeca"))   # -1
      `,
      javascript: String.raw`
        function buscaLinear(arr, alvo) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === alvo) return i;
          }
          return -1;
        }

        const nomes = ["Ana", "Bruno", "Carla", "Davi"];
        console.log(buscaLinear(nomes, "Carla")); // 2
        console.log(buscaLinear(nomes, "Zeca"));  // -1
      `,
      java: String.raw`
        public class BuscaLinear {
            static int buscaLinear(String[] arr, String alvo) {
                for (int i = 0; i < arr.length; i++)
                    if (arr[i].equals(alvo)) return i;
                return -1;
            }

            public static void main(String[] args) {
                String[] nomes = {"Ana", "Bruno", "Carla", "Davi"};
                System.out.println(buscaLinear(nomes, "Carla")); // 2
                System.out.println(buscaLinear(nomes, "Zeca"));  // -1
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        int buscaLinear(const vector<string>& arr, const string& alvo) {
            for (int i = 0; i < (int)arr.size(); i++)
                if (arr[i] == alvo) return i;
            return -1;
        }

        int main() {
            vector<string> nomes = {"Ana", "Bruno", "Carla", "Davi"};
            cout << buscaLinear(nomes, "Carla") << "\n"; // 2
            cout << buscaLinear(nomes, "Zeca") << "\n";  // -1
        }
      `,
    },
  },
  {
    id: 'binary-search',
    name: 'Busca Binária',
    difficulty: 'Iniciante',
    facts: { 'Primeira menção': 'John Mauchly', 'Ano': '1946', 'Requer ordenação': 'Sim' },
    summary: 'Em uma lista ordenada, compara com o meio e descarta metade a cada passo.',
    description:
      'A Busca Binária encontra um elemento em uma lista ordenada comparando o alvo com o elemento do meio: se o alvo for maior, descarta a metade esquerda; se for menor, descarta a direita. Como o espaço de busca cai pela metade a cada passo, encontrar um item entre 1 bilhão leva no máximo 30 comparações.',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    steps: [
      'Defina a faixa de busca como a lista inteira (início e fim).',
      'Pegue o elemento do meio da faixa.',
      'Se ele for o alvo, terminou.',
      'Se o alvo for maior, a nova faixa começa logo depois do meio; se for menor, termina logo antes.',
      'Repita até encontrar ou até a faixa ficar vazia.',
    ],
    usedIn: ['Índices de bancos de dados', 'git bisect', 'bisect (Python), Arrays.binarySearch (Java)', 'std::lower_bound (C++)', 'Busca pela resposta em otimização'],
    realWorld: [
      { title: 'Achar o commit que quebrou o código', text: 'O git bisect faz uma busca binária no histórico: você marca um commit bom e um ruim, e ele testa o do meio até achar o culpado. Em 1.000 commits, bastam cerca de 10 testes.' },
      { title: 'Dicionário de papel', text: 'Ninguém procura uma palavra página por página: abrimos no meio e descartamos a metade errada — uma busca binária intuitiva.' },
      { title: 'Ajustar parâmetros', text: 'Para descobrir o maior arquivo que um sistema aguenta ou o menor tempo limite que funciona, testa-se o valor do meio e ajusta-se a faixa: a mesma ideia, aplicada a respostas.' },
    ],
    curiosities: [
      'A primeira menção publicada é de John Mauchly, em 1946. Segundo Donald Knuth, porém, a primeira versão sem erros para listas de qualquer tamanho só apareceu em 1962.',
      'Jon Bentley relatou que, ao pedir a programadores profissionais que implementassem a busca binária, cerca de 90% das soluções tinham erros.',
      'Em 2006, Joshua Bloch revelou um bug escondido por anos no Arrays.binarySearch do Java: calcular (ini + fim) / 2 estoura o limite do int em listas enormes. A correção é usar ini + (fim − ini) / 2.',
    ],
    code: {
      python: String.raw`
        def busca_binaria(arr, alvo):
            ini, fim = 0, len(arr) - 1
            while ini <= fim:
                meio = (ini + fim) // 2
                if arr[meio] == alvo:
                    return meio
                if arr[meio] < alvo:
                    ini = meio + 1  # descarta a metade esquerda
                else:
                    fim = meio - 1  # descarta a metade direita
            return -1

        arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
        print(busca_binaria(arr, 23))  # 5
        print(busca_binaria(arr, 7))   # -1
      `,
      javascript: String.raw`
        function buscaBinaria(arr, alvo) {
          let ini = 0, fim = arr.length - 1;
          while (ini <= fim) {
            const meio = Math.floor((ini + fim) / 2);
            if (arr[meio] === alvo) return meio;
            if (arr[meio] < alvo) ini = meio + 1; // descarta a metade esquerda
            else fim = meio - 1;                  // descarta a metade direita
          }
          return -1;
        }

        const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        console.log(buscaBinaria(arr, 23)); // 5
        console.log(buscaBinaria(arr, 7));  // -1
      `,
      java: String.raw`
        public class BuscaBinaria {
            static int buscaBinaria(int[] arr, int alvo) {
                int ini = 0, fim = arr.length - 1;
                while (ini <= fim) {
                    int meio = ini + (fim - ini) / 2; // evita estouro de int
                    if (arr[meio] == alvo) return meio;
                    if (arr[meio] < alvo) ini = meio + 1; // descarta a metade esquerda
                    else fim = meio - 1;                  // descarta a metade direita
                }
                return -1;
            }

            public static void main(String[] args) {
                int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
                System.out.println(buscaBinaria(arr, 23)); // 5
                System.out.println(buscaBinaria(arr, 7));  // -1
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        int buscaBinaria(const vector<int>& arr, int alvo) {
            int ini = 0, fim = arr.size() - 1;
            while (ini <= fim) {
                int meio = ini + (fim - ini) / 2; // evita estouro de int
                if (arr[meio] == alvo) return meio;
                if (arr[meio] < alvo) ini = meio + 1; // descarta a metade esquerda
                else fim = meio - 1;                  // descarta a metade direita
            }
            return -1;
        }

        int main() {
            vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
            cout << buscaBinaria(arr, 23) << "\n"; // 5
            cout << buscaBinaria(arr, 7) << "\n";  // -1
        }
      `,
    },
  },
  {
    id: 'interpolation-search',
    name: 'Busca por Interpolação',
    difficulty: 'Intermediário',
    facts: { 'Descrita por': 'W. W. Peterson', 'Ano': '1957', 'Também chamada': 'Busca preditiva', 'Requer ordenação': 'Sim, com valores bem distribuídos' },
    summary: 'Estima a posição do alvo pelo seu valor, como abrir o dicionário perto da letra certa.',
    description:
      'A Busca por Interpolação, uma forma de busca preditiva, melhora a busca binária em listas ordenadas com valores bem distribuídos. Em vez de olhar sempre o meio, ela estima onde o alvo deveria estar, proporcionalmente ao seu valor: procurando 70 entre valores de 10 a 100, ela já começa perto do fim. Com dados uniformes faz, em média, O(log log n) tentativas — mas pode degradar para O(n) quando a distribuição é muito irregular.',
    complexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Defina a faixa de busca como a lista inteira.',
      'Estime a posição: pos = ini + (alvo − arr[ini]) × (fim − ini) / (arr[fim] − arr[ini]).',
      'Se arr[pos] for o alvo, terminou.',
      'Se arr[pos] for menor que o alvo, a faixa passa a começar depois de pos; se for maior, a terminar antes de pos.',
      'Repita enquanto o alvo estiver entre arr[ini] e arr[fim].',
    ],
    usedIn: ['Dados numéricos uniformes', 'Tabelas com chaves sequenciais', 'Séries temporais com intervalos regulares', 'Dicionários e listas telefônicas'],
    realWorld: [
      { title: 'Dicionário de papel', text: 'Para achar "zebra", você abre o dicionário perto do fim, não no meio. Isso é interpolação: usar o valor procurado para prever a posição.' },
      { title: 'IDs sequenciais', text: 'Em tabelas com identificadores numéricos quase contínuos, como números de pedidos ou de notas fiscais, a estimativa acerta a posição em uma ou duas tentativas.' },
      { title: 'Séries temporais', text: 'Encontrar a leitura de um sensor em um horário específico, quando as medições são feitas em intervalos regulares, é praticamente imediato.' },
    ],
    curiosities: [
      'Foi descrita por W. W. Peterson em 1957.',
      'Com 1 bilhão de elementos uniformemente distribuídos, log₂ log₂ n ≈ 5: a interpolação faz cerca de 5 tentativas, contra cerca de 30 da busca binária.',
      'Cada tentativa é mais cara (envolve multiplicação e divisão), por isso ela só compensa em listas grandes e bem distribuídas.',
    ],
    code: {
      python: String.raw`
        def busca_interpolacao(arr, alvo):
            ini, fim = 0, len(arr) - 1
            while ini <= fim and arr[ini] <= alvo <= arr[fim]:
                if arr[fim] == arr[ini]:
                    return ini if arr[ini] == alvo else -1
                # estima a posição proporcionalmente ao valor procurado
                pos = ini + (alvo - arr[ini]) * (fim - ini) // (arr[fim] - arr[ini])
                if arr[pos] == alvo:
                    return pos
                if arr[pos] < alvo:
                    ini = pos + 1
                else:
                    fim = pos - 1
            return -1

        arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        print(busca_interpolacao(arr, 70))  # 6 (acerta na primeira tentativa)
        print(busca_interpolacao(arr, 75))  # -1
      `,
      javascript: String.raw`
        function buscaInterpolacao(arr, alvo) {
          let ini = 0, fim = arr.length - 1;
          while (ini <= fim && alvo >= arr[ini] && alvo <= arr[fim]) {
            if (arr[fim] === arr[ini]) return arr[ini] === alvo ? ini : -1;
            // estima a posição proporcionalmente ao valor procurado
            const pos = ini + Math.floor(((alvo - arr[ini]) * (fim - ini)) / (arr[fim] - arr[ini]));
            if (arr[pos] === alvo) return pos;
            if (arr[pos] < alvo) ini = pos + 1;
            else fim = pos - 1;
          }
          return -1;
        }

        const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        console.log(buscaInterpolacao(arr, 70)); // 6 (acerta na primeira tentativa)
        console.log(buscaInterpolacao(arr, 75)); // -1
      `,
      java: String.raw`
        public class BuscaInterpolacao {
            static int buscaInterpolacao(int[] arr, int alvo) {
                int ini = 0, fim = arr.length - 1;
                while (ini <= fim && alvo >= arr[ini] && alvo <= arr[fim]) {
                    if (arr[fim] == arr[ini]) return arr[ini] == alvo ? ini : -1;
                    // estima a posição proporcionalmente ao valor procurado
                    int pos = ini + (int) ((long) (alvo - arr[ini]) * (fim - ini) / (arr[fim] - arr[ini]));
                    if (arr[pos] == alvo) return pos;
                    if (arr[pos] < alvo) ini = pos + 1;
                    else fim = pos - 1;
                }
                return -1;
            }

            public static void main(String[] args) {
                int[] arr = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
                System.out.println(buscaInterpolacao(arr, 70)); // 6 (acerta na primeira tentativa)
                System.out.println(buscaInterpolacao(arr, 75)); // -1
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        int buscaInterpolacao(const vector<int>& arr, int alvo) {
            int ini = 0, fim = arr.size() - 1;
            while (ini <= fim && alvo >= arr[ini] && alvo <= arr[fim]) {
                if (arr[fim] == arr[ini]) return arr[ini] == alvo ? ini : -1;
                // estima a posição proporcionalmente ao valor procurado
                int pos = ini + (int)((long long)(alvo - arr[ini]) * (fim - ini) / (arr[fim] - arr[ini]));
                if (arr[pos] == alvo) return pos;
                if (arr[pos] < alvo) ini = pos + 1;
                else fim = pos - 1;
            }
            return -1;
        }

        int main() {
            vector<int> arr = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
            cout << buscaInterpolacao(arr, 70) << "\n"; // 6 (acerta na primeira tentativa)
            cout << buscaInterpolacao(arr, 75) << "\n"; // -1
        }
      `,
    },
  },
  {
    id: 'exponential-search',
    name: 'Busca Exponencial',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Jon Bentley e Andrew Yao', 'Ano': '1976', 'Também chamada': 'Busca ilimitada, galloping', 'Requer ordenação': 'Sim' },
    summary: 'Dobra o limite (1, 2, 4, 8…) até passar do alvo e então faz uma busca binária.',
    description:
      'A Busca Exponencial resolve a busca binária em sequências de tamanho desconhecido ou ilimitado. Primeiro encontra um intervalo que contém o alvo, testando as posições 1, 2, 4, 8, 16… até achar um valor maior ou igual a ele; depois aplica a busca binária só nesse intervalo. É especialmente rápida quando o alvo está perto do início, porque o custo depende da posição do alvo (i), e não do tamanho total da lista.',
    complexity: { best: 'O(1)', average: 'O(log i)', worst: 'O(log i)', space: 'O(1)' },
    steps: [
      'Comece com limite = 1.',
      'Enquanto arr[limite] for menor que o alvo, dobre o limite.',
      'O alvo, se existir, está entre as posições limite/2 e limite.',
      'Faça uma busca binária nesse intervalo.',
    ],
    usedIn: ['Sequências de tamanho desconhecido', 'Timsort (modo "galope")', 'APIs paginadas sem total de páginas', 'Arquivos ordenados muito grandes'],
    realWorld: [
      { title: 'Timsort', text: 'Ao intercalar duas sequências, o Timsort (o sort do Python e do Java) entra no "modo galope": usa busca exponencial para pular blocos inteiros de uma sequência de uma vez.' },
      { title: 'Sem saber o tamanho', text: 'Em um arquivo ordenado lido sob demanda, ou em uma API paginada que não informa quantas páginas existem, dobrar o salto até passar do alvo evita percorrer tudo.' },
      { title: 'Alvos perto do início', text: 'Quando a resposta costuma estar no começo — como eventos recentes em um histórico ordenado —, o custo O(log i) é bem menor que O(log n).' },
    ],
    curiosities: [
      'Foi apresentada por Jon Bentley e Andrew Chi-Chih Yao em 1976, com o nome de busca ilimitada ("unbounded search").',
      'Também é conhecida como "galloping search" ou "doubling search".',
      'Faz no máximo cerca de 2·log₂(i) comparações, onde i é a posição do alvo — ótima quando i é pequeno, mesmo que a lista seja gigantesca.',
    ],
    code: {
      python: String.raw`
        def busca_exponencial(arr, alvo):
            if not arr:
                return -1
            limite = 1
            while limite < len(arr) and arr[limite] < alvo:
                limite *= 2  # 1, 2, 4, 8, 16...
            # o alvo, se existir, está entre limite // 2 e limite
            return busca_binaria(arr, alvo, limite // 2, min(limite, len(arr) - 1))

        def busca_binaria(arr, alvo, ini, fim):
            while ini <= fim:
                meio = (ini + fim) // 2
                if arr[meio] == alvo:
                    return meio
                if arr[meio] < alvo:
                    ini = meio + 1
                else:
                    fim = meio - 1
            return -1

        arr = list(range(0, 3000, 3))  # 1000 elementos: 0, 3, 6, ...
        print(busca_exponencial(arr, 42))  # 14
        print(busca_exponencial(arr, 43))  # -1
      `,
      javascript: String.raw`
        function buscaExponencial(arr, alvo) {
          if (arr.length === 0) return -1;
          let limite = 1;
          while (limite < arr.length && arr[limite] < alvo) limite *= 2; // 1, 2, 4, 8...
          // o alvo, se existir, está entre limite / 2 e limite
          return buscaBinaria(arr, alvo, Math.floor(limite / 2), Math.min(limite, arr.length - 1));
        }

        function buscaBinaria(arr, alvo, ini, fim) {
          while (ini <= fim) {
            const meio = Math.floor((ini + fim) / 2);
            if (arr[meio] === alvo) return meio;
            if (arr[meio] < alvo) ini = meio + 1;
            else fim = meio - 1;
          }
          return -1;
        }

        const arr = Array.from({ length: 1000 }, (_, i) => i * 3); // 0, 3, 6, ...
        console.log(buscaExponencial(arr, 42)); // 14
        console.log(buscaExponencial(arr, 43)); // -1
      `,
      java: String.raw`
        public class BuscaExponencial {
            static int buscaExponencial(int[] arr, int alvo) {
                if (arr.length == 0) return -1;
                int limite = 1;
                while (limite < arr.length && arr[limite] < alvo) limite *= 2; // 1, 2, 4, 8...
                // o alvo, se existir, está entre limite / 2 e limite
                return buscaBinaria(arr, alvo, limite / 2, Math.min(limite, arr.length - 1));
            }

            static int buscaBinaria(int[] arr, int alvo, int ini, int fim) {
                while (ini <= fim) {
                    int meio = ini + (fim - ini) / 2;
                    if (arr[meio] == alvo) return meio;
                    if (arr[meio] < alvo) ini = meio + 1;
                    else fim = meio - 1;
                }
                return -1;
            }

            public static void main(String[] args) {
                int[] arr = new int[1000];
                for (int i = 0; i < arr.length; i++) arr[i] = i * 3; // 0, 3, 6, ...
                System.out.println(buscaExponencial(arr, 42)); // 14
                System.out.println(buscaExponencial(arr, 43)); // -1
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <vector>
        using namespace std;

        int buscaBinaria(const vector<int>& arr, int alvo, int ini, int fim) {
            while (ini <= fim) {
                int meio = ini + (fim - ini) / 2;
                if (arr[meio] == alvo) return meio;
                if (arr[meio] < alvo) ini = meio + 1;
                else fim = meio - 1;
            }
            return -1;
        }

        int buscaExponencial(const vector<int>& arr, int alvo) {
            if (arr.empty()) return -1;
            int n = arr.size(), limite = 1;
            while (limite < n && arr[limite] < alvo) limite *= 2; // 1, 2, 4, 8...
            // o alvo, se existir, está entre limite / 2 e limite
            return buscaBinaria(arr, alvo, limite / 2, min(limite, n - 1));
        }

        int main() {
            vector<int> arr(1000);
            for (int i = 0; i < 1000; i++) arr[i] = i * 3; // 0, 3, 6, ...
            cout << buscaExponencial(arr, 42) << "\n"; // 14
            cout << buscaExponencial(arr, 43) << "\n"; // -1
        }
      `,
    },
  },
  {
    id: 'rotated-binary-search',
    name: 'Busca Binária em Sequência Cíclica',
    difficulty: 'Intermediário',
    facts: { 'Também chamada': 'Busca em array rotacionado', 'Requer': 'Lista ordenada e rotacionada, sem repetidos' },
    summary: 'Encontra o menor elemento de uma lista ordenada que foi "girada".',
    description:
      'Uma sequência cíclica é uma lista ordenada que foi rotacionada: [15, 18, 22, 3, 6, 9, 12] começou como [3, 6, 9, 12, 15, 18, 22]. Este algoritmo adapta a busca binária para encontrar o menor elemento — o ponto de "virada" — comparando o meio com o último elemento da faixa. Sabendo onde está a virada, também dá para procurar qualquer valor em O(log n).',
    complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    steps: [
      'Defina a faixa como a lista inteira.',
      'Compare o elemento do meio com o último elemento da faixa.',
      'Se o meio for maior, a virada está à direita: a faixa passa a começar logo depois do meio.',
      'Caso contrário, o menor está no meio ou à esquerda: a faixa passa a terminar no meio.',
      'Quando a faixa tiver um único elemento, ele é o menor.',
    ],
    usedIn: ['Buffers circulares', 'Logs rotativos', 'Entrevistas técnicas', 'Dados cíclicos (horários, calendários)'],
    realWorld: [
      { title: 'Buffers circulares', text: 'Muitos sistemas guardam os últimos N eventos em um buffer circular, que fica ordenado por horário, mas "girado". Achar o evento mais antigo é encontrar o mínimo da sequência cíclica.' },
      { title: 'Logs rotativos', text: 'Arquivos de log que sobrescrevem as entradas mais antigas formam uma sequência cíclica de horários; achar a virada mostra onde o registro realmente começa.' },
      { title: 'Entrevistas de programação', text: 'É uma pergunta clássica em entrevistas de grandes empresas de tecnologia, porque testa se a pessoa entende a busca binária além da versão decorada.' },
    ],
    curiosities: [
      'Os elementos precisam ser distintos para garantir O(log n): com repetições, como em [2, 2, 2, 0, 2], no pior caso é preciso olhar todos os elementos.',
      'A posição do menor elemento revela quantas vezes a lista foi rotacionada.',
      'O mesmo raciocínio — descobrir qual das metades "está em ordem" — permite buscar qualquer valor diretamente na lista rotacionada.',
    ],
    code: {
      python: String.raw`
        def menor_ciclico(arr):
            ini, fim = 0, len(arr) - 1
            while ini < fim:
                meio = (ini + fim) // 2
                if arr[meio] > arr[fim]:
                    ini = meio + 1  # a "virada" está à direita do meio
                else:
                    fim = meio      # o menor está no meio ou à esquerda
            return ini

        arr = [15, 18, 22, 3, 6, 9, 12]
        i = menor_ciclico(arr)
        print(i, arr[i])  # 3 3
      `,
      javascript: String.raw`
        function menorCiclico(arr) {
          let ini = 0, fim = arr.length - 1;
          while (ini < fim) {
            const meio = Math.floor((ini + fim) / 2);
            if (arr[meio] > arr[fim]) ini = meio + 1; // a "virada" está à direita do meio
            else fim = meio;                          // o menor está no meio ou à esquerda
          }
          return ini;
        }

        const arr = [15, 18, 22, 3, 6, 9, 12];
        const i = menorCiclico(arr);
        console.log(i, arr[i]); // 3 3
      `,
      java: String.raw`
        public class MenorCiclico {
            static int menorCiclico(int[] arr) {
                int ini = 0, fim = arr.length - 1;
                while (ini < fim) {
                    int meio = ini + (fim - ini) / 2;
                    if (arr[meio] > arr[fim]) ini = meio + 1; // a "virada" está à direita do meio
                    else fim = meio;                          // o menor está no meio ou à esquerda
                }
                return ini;
            }

            public static void main(String[] args) {
                int[] arr = {15, 18, 22, 3, 6, 9, 12};
                int i = menorCiclico(arr);
                System.out.println(i + " " + arr[i]); // 3 3
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        int menorCiclico(const vector<int>& arr) {
            int ini = 0, fim = arr.size() - 1;
            while (ini < fim) {
                int meio = ini + (fim - ini) / 2;
                if (arr[meio] > arr[fim]) ini = meio + 1; // a "virada" está à direita do meio
                else fim = meio;                          // o menor está no meio ou à esquerda
            }
            return ini;
        }

        int main() {
            vector<int> arr = {15, 18, 22, 3, 6, 9, 12};
            int i = menorCiclico(arr);
            cout << i << " " << arr[i] << "\n"; // 3 3
        }
      `,
    },
  },
  {
    id: 'hash-search',
    name: 'Busca em Tabela Hash',
    difficulty: 'Intermediário',
    facts: { 'Hashing proposto por': 'Hans Peter Luhn (IBM)', 'Ano': '1953', 'Requer ordenação': 'Não' },
    summary: 'Calcula, a partir da chave, em qual "balde" o item está e olha só ali.',
    description:
      'A busca por hash usa uma função de hash para transformar a chave (um nome, um CPF, uma URL) em um número que indica o balde onde o item foi guardado. Em vez de comparar com todos os elementos, basta calcular o hash e examinar um único balde, que normalmente tem pouquíssimos itens. Por isso a busca leva tempo constante na média, não importa o tamanho da tabela.',
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    steps: [
      'Calcule o hash da chave procurada.',
      'Use o hash (módulo o número de baldes) para escolher o balde.',
      'Percorra apenas os itens desse balde, comparando as chaves.',
      'Se achar a chave, devolva o valor associado; se o balde acabar, a chave não existe.',
    ],
    usedIn: ['dict (Python), Map e objetos (JavaScript)', 'HashMap (Java), unordered_map (C++)', 'Caches (Redis, Memcached)', 'Índices hash em bancos de dados', 'Detecção de duplicados'],
    realWorld: [
      { title: 'Dicionários das linguagens', text: 'Toda vez que você acessa usuario["nome"] em Python ou JavaScript, uma busca por hash acontece por baixo dos panos.' },
      { title: 'Caches', text: 'Redis e Memcached guardam milhões de pares chave-valor e respondem em microssegundos, justamente porque cada consulta examina só um balde.' },
      { title: 'Detecção de duplicados', text: 'Para saber se um arquivo ou registro já foi visto, sistemas guardam o hash de cada item em um conjunto e verificam a presença em O(1).' },
    ],
    curiosities: [
      'A ideia de hashing foi proposta por Hans Peter Luhn, da IBM, em 1953.',
      'Em 2011, pesquisadores demonstraram ataques de negação de serviço (HashDoS) que enviavam milhares de chaves com o mesmo hash, transformando buscas O(1) em O(n). Linguagens como Python passaram então a usar hashes aleatórios a cada execução.',
      'Desde o Python 3.7, os dicionários preservam a ordem de inserção — resultado de uma reorganização interna da tabela hash.',
    ],
    code: {
      python: String.raw`
        class TabelaHash:
            def __init__(self, num_baldes=7):
                self.baldes = [[] for _ in range(num_baldes)]

            def _hash(self, chave):
                h = 0
                for ch in chave:
                    h = (h * 31 + ord(ch)) % len(self.baldes)
                return h

            def inserir(self, chave, valor):
                balde = self.baldes[self._hash(chave)]
                for par in balde:
                    if par[0] == chave:
                        par[1] = valor  # chave já existe: atualiza
                        return
                balde.append([chave, valor])

            def buscar(self, chave):
                # só o balde indicado pelo hash é examinado
                for k, v in self.baldes[self._hash(chave)]:
                    if k == chave:
                        return v
                return None

        agenda = TabelaHash()
        agenda.inserir("Ana", "(11) 9999-0001")
        agenda.inserir("Bruno", "(21) 9999-0002")
        agenda.inserir("Carla", "(31) 9999-0003")
        print(agenda.buscar("Bruno"))  # (21) 9999-0002
        print(agenda.buscar("Zeca"))   # None
      `,
      javascript: String.raw`
        class TabelaHash {
          constructor(numBaldes = 7) {
            this.baldes = Array.from({ length: numBaldes }, () => []);
          }

          hash(chave) {
            let h = 0;
            for (const ch of chave) h = (h * 31 + ch.charCodeAt(0)) % this.baldes.length;
            return h;
          }

          inserir(chave, valor) {
            const balde = this.baldes[this.hash(chave)];
            const par = balde.find(p => p[0] === chave);
            if (par) par[1] = valor; // chave já existe: atualiza
            else balde.push([chave, valor]);
          }

          buscar(chave) {
            // só o balde indicado pelo hash é examinado
            const par = this.baldes[this.hash(chave)].find(p => p[0] === chave);
            return par ? par[1] : null;
          }
        }

        const agenda = new TabelaHash();
        agenda.inserir("Ana", "(11) 9999-0001");
        agenda.inserir("Bruno", "(21) 9999-0002");
        agenda.inserir("Carla", "(31) 9999-0003");
        console.log(agenda.buscar("Bruno")); // (21) 9999-0002
        console.log(agenda.buscar("Zeca"));  // null
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class TabelaHash {
            private final List<List<String[]>> baldes = new ArrayList<>();

            TabelaHash(int numBaldes) {
                for (int i = 0; i < numBaldes; i++) baldes.add(new ArrayList<>());
            }

            private int hash(String chave) {
                int h = 0;
                for (char ch : chave.toCharArray()) h = (h * 31 + ch) % baldes.size();
                return h;
            }

            void inserir(String chave, String valor) {
                List<String[]> balde = baldes.get(hash(chave));
                for (String[] par : balde) {
                    if (par[0].equals(chave)) { par[1] = valor; return; } // atualiza
                }
                balde.add(new String[]{chave, valor});
            }

            String buscar(String chave) {
                // só o balde indicado pelo hash é examinado
                for (String[] par : baldes.get(hash(chave)))
                    if (par[0].equals(chave)) return par[1];
                return null;
            }

            public static void main(String[] args) {
                TabelaHash agenda = new TabelaHash(7);
                agenda.inserir("Ana", "(11) 9999-0001");
                agenda.inserir("Bruno", "(21) 9999-0002");
                agenda.inserir("Carla", "(31) 9999-0003");
                System.out.println(agenda.buscar("Bruno")); // (21) 9999-0002
                System.out.println(agenda.buscar("Zeca"));  // null
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <optional>
        #include <string>
        #include <utility>
        #include <vector>
        using namespace std;

        class TabelaHash {
            vector<vector<pair<string, string>>> baldes;

            size_t hash(const string& chave) const {
                size_t h = 0;
                for (unsigned char ch : chave) h = (h * 31 + ch) % baldes.size();
                return h;
            }

        public:
            explicit TabelaHash(int numBaldes = 7) : baldes(numBaldes) {}

            void inserir(const string& chave, const string& valor) {
                auto& balde = baldes[hash(chave)];
                for (auto& par : balde)
                    if (par.first == chave) { par.second = valor; return; } // atualiza
                balde.push_back({chave, valor});
            }

            optional<string> buscar(const string& chave) const {
                // só o balde indicado pelo hash é examinado
                for (const auto& par : baldes[hash(chave)])
                    if (par.first == chave) return par.second;
                return nullopt;
            }
        };

        int main() {
            TabelaHash agenda;
            agenda.inserir("Ana", "(11) 9999-0001");
            agenda.inserir("Bruno", "(21) 9999-0002");
            agenda.inserir("Carla", "(31) 9999-0003");
            cout << agenda.buscar("Bruno").value_or("não encontrado") << "\n"; // (21) 9999-0002
            cout << agenda.buscar("Zeca").value_or("não encontrado") << "\n";  // não encontrado
        }
      `,
    },
  },
  {
    id: 'bst-search',
    name: 'Busca em Árvore Binária',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Windley, Booth, Colin e Hibbard', 'Ano': '≈ 1960', 'Requer': 'Árvore binária de busca' },
    summary: 'Desce pela árvore indo à esquerda se o alvo é menor e à direita se é maior.',
    description:
      'Em uma árvore binária de busca (BST), cada nó guarda um valor, com todos os menores na subárvore da esquerda e os maiores na da direita. Para buscar, começa-se pela raiz e, a cada comparação, desce-se para um dos lados — descartando toda a outra subárvore. Em uma árvore balanceada isso leva O(log n), como a busca binária; mas, se os valores forem inseridos já em ordem, a árvore vira uma espécie de lista e a busca degrada para O(n).',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Comece pela raiz.',
      'Se o valor do nó for o alvo, terminou.',
      'Se o alvo for menor, desça para o filho da esquerda; se for maior, para o da direita.',
      'Se chegar a um filho vazio, o alvo não está na árvore.',
    ],
    usedIn: ['std::map e std::set (C++)', 'TreeMap e TreeSet (Java)', 'Índices de bancos de dados (B-trees)', 'Agendador de processos do Linux', 'Sistemas de arquivos'],
    realWorld: [
      { title: 'Bancos de dados', text: 'Os índices do PostgreSQL e do MySQL usam B-trees, uma generalização da árvore de busca com muitos filhos por nó, otimizada para leituras em disco.' },
      { title: 'Agendador do Linux', text: 'O agendador CFS do kernel Linux mantém os processos em uma árvore rubro-negra (uma BST balanceada) ordenada pelo tempo de CPU já usado, e escolhe sempre o nó mais à esquerda.' },
      { title: 'Coleções ordenadas', text: 'std::map do C++ e TreeMap do Java permitem buscar, inserir e percorrer chaves em ordem, tudo em O(log n), graças a árvores balanceadas.' },
    ],
    curiosities: [
      'A árvore binária de busca foi descoberta de forma independente por vários pesquisadores por volta de 1960, entre eles P. F. Windley, A. D. Booth, A. J. T. Colin e T. N. Hibbard.',
      'A primeira árvore autobalanceada, a AVL, foi criada em 1962 pelos soviéticos Georgy Adelson-Velsky e Evgenii Landis — o nome vem das iniciais dos dois.',
      'Inserir valores já ordenados (1, 2, 3, 4…) em uma BST simples cria uma árvore "degenerada", com altura igual ao número de elementos. Use o botão "Aleatória" na visualização para ver árvores desequilibradas.',
    ],
    code: {
      python: String.raw`
        class No:
            def __init__(self, valor):
                self.valor = valor
                self.esq = None
                self.dir = None

        def inserir(raiz, valor):
            if raiz is None:
                return No(valor)
            if valor < raiz.valor:
                raiz.esq = inserir(raiz.esq, valor)
            else:
                raiz.dir = inserir(raiz.dir, valor)
            return raiz

        def buscar(raiz, alvo):
            atual = raiz
            while atual is not None:
                if alvo == atual.valor:
                    return True
                # descarta uma subárvore inteira a cada passo
                atual = atual.esq if alvo < atual.valor else atual.dir
            return False

        raiz = None
        for v in [50, 30, 72, 18, 41, 63, 88]:
            raiz = inserir(raiz, v)
        print(buscar(raiz, 63))  # True
        print(buscar(raiz, 65))  # False
      `,
      javascript: String.raw`
        class No {
          constructor(valor) {
            this.valor = valor;
            this.esq = null;
            this.dir = null;
          }
        }

        function inserir(raiz, valor) {
          if (raiz === null) return new No(valor);
          if (valor < raiz.valor) raiz.esq = inserir(raiz.esq, valor);
          else raiz.dir = inserir(raiz.dir, valor);
          return raiz;
        }

        function buscar(raiz, alvo) {
          let atual = raiz;
          while (atual !== null) {
            if (alvo === atual.valor) return true;
            // descarta uma subárvore inteira a cada passo
            atual = alvo < atual.valor ? atual.esq : atual.dir;
          }
          return false;
        }

        let raiz = null;
        for (const v of [50, 30, 72, 18, 41, 63, 88]) raiz = inserir(raiz, v);
        console.log(buscar(raiz, 63)); // true
        console.log(buscar(raiz, 65)); // false
      `,
      java: String.raw`
        public class ArvoreBusca {
            static class No {
                int valor;
                No esq, dir;
                No(int valor) { this.valor = valor; }
            }

            static No inserir(No raiz, int valor) {
                if (raiz == null) return new No(valor);
                if (valor < raiz.valor) raiz.esq = inserir(raiz.esq, valor);
                else raiz.dir = inserir(raiz.dir, valor);
                return raiz;
            }

            static boolean buscar(No raiz, int alvo) {
                No atual = raiz;
                while (atual != null) {
                    if (alvo == atual.valor) return true;
                    // descarta uma subárvore inteira a cada passo
                    atual = alvo < atual.valor ? atual.esq : atual.dir;
                }
                return false;
            }

            public static void main(String[] args) {
                No raiz = null;
                for (int v : new int[]{50, 30, 72, 18, 41, 63, 88}) raiz = inserir(raiz, v);
                System.out.println(buscar(raiz, 63)); // true
                System.out.println(buscar(raiz, 65)); // false
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        using namespace std;

        struct No {
            int valor;
            No* esq = nullptr;
            No* dir = nullptr;
            explicit No(int v) : valor(v) {}
        };

        No* inserir(No* raiz, int valor) {
            if (!raiz) return new No(valor);
            if (valor < raiz->valor) raiz->esq = inserir(raiz->esq, valor);
            else raiz->dir = inserir(raiz->dir, valor);
            return raiz;
        }

        bool buscar(No* raiz, int alvo) {
            No* atual = raiz;
            while (atual) {
                if (alvo == atual->valor) return true;
                // descarta uma subárvore inteira a cada passo
                atual = alvo < atual->valor ? atual->esq : atual->dir;
            }
            return false;
        }

        int main() {
            No* raiz = nullptr;
            for (int v : {50, 30, 72, 18, 41, 63, 88}) raiz = inserir(raiz, v);
            cout << boolalpha << buscar(raiz, 63) << "\n"; // true
            cout << boolalpha << buscar(raiz, 65) << "\n"; // false
        }
      `,
    },
  },
  {
    id: 'bfs',
    name: 'Busca em Largura (BFS)',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Konrad Zuse; Edward F. Moore', 'Ano': '1945; 1959', 'Estrutura auxiliar': 'Fila', 'Caminho mínimo': 'Sim (grafos sem peso)' },
    summary: 'Explora o grafo em camadas: primeiro os vizinhos, depois os vizinhos dos vizinhos.',
    description:
      'A Busca em Largura (Breadth-First Search) parte de um nó e visita todos os seus vizinhos antes de ir mais longe, usando uma fila: quem foi descoberto primeiro é explorado primeiro. Assim, os nós são alcançados em ordem de distância — por isso a BFS encontra o caminho com o menor número de arestas em grafos sem pesos, como o menor número de movimentos em um labirinto.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    steps: [
      'Coloque o nó inicial na fila e marque-o como descoberto, com distância 0.',
      'Retire o primeiro nó da fila.',
      'Para cada vizinho ainda não descoberto, marque-o com a distância do atual + 1 e coloque-o no fim da fila.',
      'Repita até a fila esvaziar (ou até alcançar o destino).',
    ],
    usedIn: ['Menor caminho em grafos sem peso', 'Redes sociais ("amigos de amigos")', 'Web crawlers', 'Roteamento em redes', 'Ferramenta "balde de tinta" (flood fill)'],
    realWorld: [
      { title: 'Graus de separação', text: 'Quando uma rede social mostra que alguém é uma conexão de 2º ou 3º grau, está mostrando exatamente a distância calculada por uma BFS a partir de você.' },
      { title: 'Balde de tinta', text: 'A ferramenta de preenchimento dos editores de imagem espalha a cor a partir do pixel clicado para os vizinhos de mesma cor, camada por camada.' },
      { title: 'Web crawlers', text: 'Robôs de busca começam em algumas páginas e visitam primeiro os links mais próximos, descobrindo a web em camadas.' },
    ],
    curiosities: [
      'Konrad Zuse descreveu a BFS em 1945, em sua tese de doutorado rejeitada (publicada só em 1972). Edward F. Moore a redescobriu em 1959 para encontrar o caminho mais curto em labirintos.',
      'O "número de Kevin Bacon" — a distância de um ator até Kevin Bacon por filmes em comum — é calculado com uma BFS.',
      'Na visualização, compare com a DFS: a BFS se espalha como uma onda, e o caminho encontrado é sempre o mais curto.',
    ],
    code: {
      python: String.raw`
        from collections import deque

        grafo = {
            "Ana":   ["Bruno", "Carla"],
            "Bruno": ["Ana", "Davi"],
            "Carla": ["Ana", "Davi", "Eva"],
            "Davi":  ["Bruno", "Carla", "Gil"],
            "Eva":   ["Carla"],
            "Gil":   ["Davi"],
        }

        def bfs(grafo, origem):
            distancia = {origem: 0}
            fila = deque([origem])
            while fila:
                atual = fila.popleft()
                for vizinho in grafo[atual]:
                    if vizinho not in distancia:
                        distancia[vizinho] = distancia[atual] + 1
                        fila.append(vizinho)
            return distancia

        print(bfs(grafo, "Ana"))
        # {'Ana': 0, 'Bruno': 1, 'Carla': 1, 'Davi': 2, 'Eva': 2, 'Gil': 3}
      `,
      javascript: String.raw`
        const grafo = {
          Ana:   ["Bruno", "Carla"],
          Bruno: ["Ana", "Davi"],
          Carla: ["Ana", "Davi", "Eva"],
          Davi:  ["Bruno", "Carla", "Gil"],
          Eva:   ["Carla"],
          Gil:   ["Davi"],
        };

        function bfs(grafo, origem) {
          const distancia = new Map([[origem, 0]]);
          const fila = [origem];
          for (let i = 0; i < fila.length; i++) { // "i" avança como o início da fila
            const atual = fila[i];
            for (const vizinho of grafo[atual]) {
              if (!distancia.has(vizinho)) {
                distancia.set(vizinho, distancia.get(atual) + 1);
                fila.push(vizinho);
              }
            }
          }
          return distancia;
        }

        console.log(Object.fromEntries(bfs(grafo, "Ana")));
        // { Ana: 0, Bruno: 1, Carla: 1, Davi: 2, Eva: 2, Gil: 3 }
      `,
      java: String.raw`
        import java.util.*;

        public class BuscaLargura {
            static Map<String, Integer> bfs(Map<String, List<String>> grafo, String origem) {
                Map<String, Integer> distancia = new LinkedHashMap<>();
                Deque<String> fila = new ArrayDeque<>();
                distancia.put(origem, 0);
                fila.add(origem);
                while (!fila.isEmpty()) {
                    String atual = fila.poll();
                    for (String vizinho : grafo.get(atual)) {
                        if (!distancia.containsKey(vizinho)) {
                            distancia.put(vizinho, distancia.get(atual) + 1);
                            fila.add(vizinho);
                        }
                    }
                }
                return distancia;
            }

            public static void main(String[] args) {
                Map<String, List<String>> grafo = Map.of(
                    "Ana",   List.of("Bruno", "Carla"),
                    "Bruno", List.of("Ana", "Davi"),
                    "Carla", List.of("Ana", "Davi", "Eva"),
                    "Davi",  List.of("Bruno", "Carla", "Gil"),
                    "Eva",   List.of("Carla"),
                    "Gil",   List.of("Davi"));
                System.out.println(bfs(grafo, "Ana"));
                // {Ana=0, Bruno=1, Carla=1, Davi=2, Eva=2, Gil=3}
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <map>
        #include <queue>
        #include <string>
        #include <vector>
        using namespace std;

        int main() {
            map<string, vector<string>> grafo = {
                {"Ana",   {"Bruno", "Carla"}},
                {"Bruno", {"Ana", "Davi"}},
                {"Carla", {"Ana", "Davi", "Eva"}},
                {"Davi",  {"Bruno", "Carla", "Gil"}},
                {"Eva",   {"Carla"}},
                {"Gil",   {"Davi"}},
            };

            map<string, int> distancia = {{"Ana", 0}};
            vector<string> ordem = {"Ana"}; // ordem de descoberta
            queue<string> fila;
            fila.push("Ana");
            while (!fila.empty()) {
                string atual = fila.front();
                fila.pop();
                for (const string& vizinho : grafo[atual]) {
                    if (!distancia.count(vizinho)) {
                        distancia[vizinho] = distancia[atual] + 1;
                        ordem.push_back(vizinho);
                        fila.push(vizinho);
                    }
                }
            }
            for (const string& nome : ordem) cout << nome << "=" << distancia[nome] << " ";
            // Ana=0 Bruno=1 Carla=1 Davi=2 Eva=2 Gil=3
        }
      `,
    },
  },
  {
    id: 'dfs',
    name: 'Busca em Profundidade (DFS)',
    difficulty: 'Intermediário',
    facts: { 'Origem': 'Charles Pierre Trémaux', 'Ano': 'Século XIX', 'Estrutura auxiliar': 'Pilha (ou recursão)', 'Caminho mínimo': 'Não' },
    summary: 'Segue um caminho até o fim antes de voltar e tentar o próximo.',
    description:
      'A Busca em Profundidade (Depth-First Search) avança o mais longe possível por um caminho e só volta (backtracking) quando chega a um beco sem saída. Usa uma pilha — explícita ou a própria pilha de chamadas da recursão. Não garante o caminho mais curto, mas é a base de muitos algoritmos: detecção de ciclos, ordenação topológica, componentes conexos e resolução de labirintos e quebra-cabeças.',
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    steps: [
      'Marque o nó atual como visitado.',
      'Escolha um vizinho ainda não visitado e repita a partir dele (vá fundo).',
      'Quando não houver mais vizinhos novos, volte para o nó anterior.',
      'Termine quando todos os caminhos a partir do início tiverem sido explorados.',
    ],
    usedIn: ['Detecção de ciclos', 'Ordenação topológica', 'Componentes conexos', 'Geração e resolução de labirintos', 'Coleta de lixo (fase de marcação)'],
    realWorld: [
      { title: 'Gerar labirintos', text: 'O botão "Labirinto" da visualização usa uma DFS com escolhas aleatórias (backtracking recursivo), um dos métodos clássicos para gerar labirintos em jogos.' },
      { title: 'Dependências circulares', text: 'Gerenciadores de pacotes e compiladores usam DFS para detectar ciclos — por exemplo, um módulo A que importa B, que por sua vez importa A.' },
      { title: 'Coleta de lixo', text: 'Na fase de marcação, coletores de lixo percorrem, a partir das variáveis em uso, todos os objetos alcançáveis; o que não for marcado pode ser liberado.' },
    ],
    curiosities: [
      'Uma versão da DFS foi estudada no século XIX pelo matemático francês Charles Pierre Trémaux como estratégia para sair de labirintos, marcando os corredores já percorridos.',
      'John Hopcroft e Robert Tarjan receberam o Prêmio Turing de 1986, em parte por algoritmos eficientes baseados em DFS, como o teste de planaridade de grafos em tempo linear.',
      'Na visualização, perceba como a DFS "serpenteia" e costuma encontrar caminhos bem mais longos que os da BFS.',
    ],
    code: {
      python: String.raw`
        grafo = {
            "Ana":   ["Bruno", "Carla"],
            "Bruno": ["Ana", "Davi"],
            "Carla": ["Ana", "Davi", "Eva"],
            "Davi":  ["Bruno", "Carla", "Gil"],
            "Eva":   ["Carla"],
            "Gil":   ["Davi"],
        }

        def dfs(grafo, atual, visitados=None, ordem=None):
            if visitados is None:
                visitados, ordem = set(), []
            visitados.add(atual)
            ordem.append(atual)
            for vizinho in grafo[atual]:
                if vizinho not in visitados:
                    dfs(grafo, vizinho, visitados, ordem)  # vai fundo antes de seguir
            return ordem

        print(dfs(grafo, "Ana"))
        # ['Ana', 'Bruno', 'Davi', 'Carla', 'Eva', 'Gil']
      `,
      javascript: String.raw`
        const grafo = {
          Ana:   ["Bruno", "Carla"],
          Bruno: ["Ana", "Davi"],
          Carla: ["Ana", "Davi", "Eva"],
          Davi:  ["Bruno", "Carla", "Gil"],
          Eva:   ["Carla"],
          Gil:   ["Davi"],
        };

        function dfs(grafo, atual, visitados = new Set(), ordem = []) {
          visitados.add(atual);
          ordem.push(atual);
          for (const vizinho of grafo[atual]) {
            if (!visitados.has(vizinho)) dfs(grafo, vizinho, visitados, ordem); // vai fundo
          }
          return ordem;
        }

        console.log(dfs(grafo, "Ana").join(" → "));
        // Ana → Bruno → Davi → Carla → Eva → Gil
      `,
      java: String.raw`
        import java.util.*;

        public class BuscaProfundidade {
            static void dfs(Map<String, List<String>> grafo, String atual, Set<String> visitados, List<String> ordem) {
                visitados.add(atual);
                ordem.add(atual);
                for (String vizinho : grafo.get(atual))
                    if (!visitados.contains(vizinho)) dfs(grafo, vizinho, visitados, ordem); // vai fundo
            }

            public static void main(String[] args) {
                Map<String, List<String>> grafo = Map.of(
                    "Ana",   List.of("Bruno", "Carla"),
                    "Bruno", List.of("Ana", "Davi"),
                    "Carla", List.of("Ana", "Davi", "Eva"),
                    "Davi",  List.of("Bruno", "Carla", "Gil"),
                    "Eva",   List.of("Carla"),
                    "Gil",   List.of("Davi"));
                List<String> ordem = new ArrayList<>();
                dfs(grafo, "Ana", new HashSet<>(), ordem);
                System.out.println(ordem); // [Ana, Bruno, Davi, Carla, Eva, Gil]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <map>
        #include <set>
        #include <string>
        #include <vector>
        using namespace std;

        map<string, vector<string>> grafo = {
            {"Ana",   {"Bruno", "Carla"}},
            {"Bruno", {"Ana", "Davi"}},
            {"Carla", {"Ana", "Davi", "Eva"}},
            {"Davi",  {"Bruno", "Carla", "Gil"}},
            {"Eva",   {"Carla"}},
            {"Gil",   {"Davi"}},
        };

        void dfs(const string& atual, set<string>& visitados, vector<string>& ordem) {
            visitados.insert(atual);
            ordem.push_back(atual);
            for (const string& vizinho : grafo[atual])
                if (!visitados.count(vizinho)) dfs(vizinho, visitados, ordem); // vai fundo
        }

        int main() {
            set<string> visitados;
            vector<string> ordem;
            dfs("Ana", visitados, ordem);
            for (const string& nome : ordem) cout << nome << " "; // Ana Bruno Davi Carla Eva Gil
        }
      `,
    },
  },
  {
    id: 'best-first-search',
    name: 'Busca pela Melhor Escolha',
    difficulty: 'Avançado',
    facts: { 'Primeiro uso': 'Graph Traverser (Doran e Michie)', 'Ano': '1966', 'Estrutura auxiliar': 'Fila de prioridades', 'Caminho mínimo': 'Não garantido' },
    summary: 'Expande sempre o nó que parece mais perto do destino, segundo uma heurística.',
    description:
      'A Busca pela Melhor Escolha (Best-First Search) usa uma fila de prioridades para explorar primeiro o nó mais promissor segundo uma heurística — aqui, a distância de Manhattan até o destino. Na versão gulosa, ela ignora o custo já percorrido e corre na direção do alvo: costuma ser muito rápida, mas pode ser enganada por obstáculos e encontrar um caminho mais longo que o ideal. O A* é um caso especial que corrige isso.',
    complexity: { best: 'O(d)', average: 'Depende da heurística', worst: 'O((V + E) log V)', space: 'O(V)' },
    steps: [
      'Coloque o início numa fila de prioridades, com prioridade h(início) — a distância estimada até o destino.',
      'Retire o nó de menor prioridade (o que parece mais perto do destino).',
      'Se for o destino, reconstrua o caminho seguindo os "pais" e termine.',
      'Para cada vizinho ainda não descoberto, registre de onde ele veio e coloque-o na fila com prioridade h(vizinho).',
      'Repita até encontrar o destino ou a fila esvaziar.',
    ],
    usedIn: ['Pathfinding em jogos', 'Planejamento em inteligência artificial', 'Navegação de robôs', 'Quebra-cabeças (8-puzzle)', 'Base do algoritmo A*'],
    realWorld: [
      { title: 'Inimigos em jogos', text: 'Personagens que só precisam "ir na direção" do jogador, sem caminho perfeito, podem usar a versão gulosa por ser barata — e um trajeto levemente imperfeito até parece mais natural.' },
      { title: 'Robôs exploradores', text: 'Um robô que precisa chegar rápido a uma região, aceitando um trajeto não ótimo, pode guiar a exploração pela distância que falta até o objetivo.' },
      { title: 'Quebra-cabeças', text: 'No 8-puzzle, a heurística "quantas peças estão fora do lugar" guia a busca para os estados que parecem mais próximos da solução.' },
    ],
    curiosities: [
      'Uma das primeiras implementações foi o Graph Traverser, de J. E. Doran e Donald Michie, em 1966.',
      'No mapa do código de exemplo, a busca gulosa encontra um caminho de 24 passos; o A*, no mesmo mapa, encontra o caminho ótimo, de 14.',
      'Na visualização, compare com o A*: em mapas abertos a busca gulosa visita bem menos células, mas em labirintos ela se perde com facilidade.',
    ],
    code: {
      python: String.raw`
        import heapq

        MAPA = [
            "S.......#.",
            ".######.#.",
            ".#......#.",
            ".#.######.",
            ".#........",
            ".#######.#",
            "........G.",
        ]

        def achar(ch):
            for r, linha in enumerate(MAPA):
                if ch in linha:
                    return (r, linha.index(ch))

        def vizinhos(p):
            r, c = p
            for dr, dc in ((-1, 0), (0, 1), (1, 0), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < len(MAPA) and 0 <= nc < len(MAPA[0]) and MAPA[nr][nc] != "#":
                    yield (nr, nc)

        def melhor_escolha():
            inicio, fim = achar("S"), achar("G")
            h = lambda p: abs(p[0] - fim[0]) + abs(p[1] - fim[1])  # distância de Manhattan
            fila = [(h(inicio), 0, inicio)]  # (prioridade, ordem de chegada, posição)
            veio_de = {inicio: None}
            ordem = 1
            while fila:
                _, _, atual = heapq.heappop(fila)
                if atual == fim:
                    passos = 0
                    while veio_de[atual] is not None:
                        atual = veio_de[atual]
                        passos += 1
                    return passos
                for viz in vizinhos(atual):
                    if viz not in veio_de:
                        veio_de[viz] = atual
                        heapq.heappush(fila, (h(viz), ordem, viz))
                        ordem += 1
            return -1

        print(melhor_escolha(), "passos")  # 24 passos (o A* acha um caminho de 14)
      `,
      javascript: String.raw`
        const MAPA = [
          "S.......#.",
          ".######.#.",
          ".#......#.",
          ".#.######.",
          ".#........",
          ".#######.#",
          "........G.",
        ];
        const L = MAPA.length, C = MAPA[0].length;

        const achar = ch => MAPA.findIndex(l => l.includes(ch)) * C + MAPA.find(l => l.includes(ch)).indexOf(ch);

        function vizinhos(p) {
          const r = Math.floor(p / C), c = p % C, res = [];
          for (const [dr, dc] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < L && nc >= 0 && nc < C && MAPA[nr][nc] !== "#") res.push(nr * C + nc);
          }
          return res;
        }

        function melhorEscolha() {
          const inicio = achar("S"), fim = achar("G");
          const h = p => Math.abs(Math.floor(p / C) - Math.floor(fim / C)) + Math.abs((p % C) - (fim % C));
          const fila = [[h(inicio), 0, inicio]]; // [prioridade, ordem de chegada, posição]
          const veioDe = new Map([[inicio, null]]);
          let ordem = 1;
          while (fila.length) {
            // retira o de menor prioridade (em mapas grandes, use um heap)
            let m = 0;
            for (let i = 1; i < fila.length; i++) {
              if (fila[i][0] < fila[m][0] || (fila[i][0] === fila[m][0] && fila[i][1] < fila[m][1])) m = i;
            }
            let atual = fila.splice(m, 1)[0][2];
            if (atual === fim) {
              let passos = 0;
              while (veioDe.get(atual) !== null) { atual = veioDe.get(atual); passos++; }
              return passos;
            }
            for (const viz of vizinhos(atual)) {
              if (!veioDe.has(viz)) {
                veioDe.set(viz, atual);
                fila.push([h(viz), ordem++, viz]);
              }
            }
          }
          return -1;
        }

        console.log(melhorEscolha(), "passos"); // 24 passos (o A* acha um caminho de 14)
      `,
      java: String.raw`
        import java.util.*;

        public class MelhorEscolha {
            static final String[] MAPA = {
                "S.......#.",
                ".######.#.",
                ".#......#.",
                ".#.######.",
                ".#........",
                ".#######.#",
                "........G.",
            };
            static final int L = MAPA.length, C = MAPA[0].length();

            static int achar(char ch) {
                for (int r = 0; r < L; r++)
                    for (int c = 0; c < C; c++)
                        if (MAPA[r].charAt(c) == ch) return r * C + c;
                return -1;
            }

            static List<Integer> vizinhos(int p) {
                List<Integer> res = new ArrayList<>();
                int r = p / C, c = p % C;
                for (int[] d : new int[][]{{-1, 0}, {0, 1}, {1, 0}, {0, -1}}) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < L && nc >= 0 && nc < C && MAPA[nr].charAt(nc) != '#') res.add(nr * C + nc);
                }
                return res;
            }

            static int melhorEscolha() {
                int inicio = achar('S'), fim = achar('G');
                int[] veioDe = new int[L * C];
                Arrays.fill(veioDe, -2); // -2 = ainda não descoberto
                veioDe[inicio] = -1;
                // {prioridade, ordem de chegada, posição}: a ordem desempata de forma previsível
                PriorityQueue<int[]> fila = new PriorityQueue<>((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
                int ordem = 0;
                fila.add(new int[]{h(inicio, fim), ordem++, inicio});
                while (!fila.isEmpty()) {
                    int atual = fila.poll()[2];
                    if (atual == fim) {
                        int passos = 0;
                        for (int p = fim; veioDe[p] != -1; p = veioDe[p]) passos++;
                        return passos;
                    }
                    for (int viz : vizinhos(atual)) {
                        if (veioDe[viz] == -2) {
                            veioDe[viz] = atual;
                            fila.add(new int[]{h(viz, fim), ordem++, viz});
                        }
                    }
                }
                return -1;
            }

            static int h(int p, int fim) { // distância de Manhattan
                return Math.abs(p / C - fim / C) + Math.abs(p % C - fim % C);
            }

            public static void main(String[] args) {
                System.out.println(melhorEscolha() + " passos"); // 24 passos (o A* acha um caminho de 14)
            }
        }
      `,
      cpp: String.raw`
        #include <cstdlib>
        #include <iostream>
        #include <queue>
        #include <string>
        #include <tuple>
        #include <vector>
        using namespace std;

        const vector<string> MAPA = {
            "S.......#.",
            ".######.#.",
            ".#......#.",
            ".#.######.",
            ".#........",
            ".#######.#",
            "........G.",
        };
        const int L = MAPA.size(), C = MAPA[0].size();

        int achar(char ch) {
            for (int r = 0; r < L; r++)
                for (int c = 0; c < C; c++)
                    if (MAPA[r][c] == ch) return r * C + c;
            return -1;
        }

        vector<int> vizinhos(int p) {
            vector<int> res;
            int r = p / C, c = p % C;
            int dirs[4][2] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < L && nc >= 0 && nc < C && MAPA[nr][nc] != '#') res.push_back(nr * C + nc);
            }
            return res;
        }

        int melhorEscolha() {
            int inicio = achar('S'), fim = achar('G');
            auto h = [&](int p) { return abs(p / C - fim / C) + abs(p % C - fim % C); }; // Manhattan
            vector<int> veioDe(L * C, -2); // -2 = ainda não descoberto
            veioDe[inicio] = -1;
            // (prioridade, ordem de chegada, posição): a ordem desempata de forma previsível
            priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> fila;
            int ordem = 0;
            fila.push({h(inicio), ordem++, inicio});
            while (!fila.empty()) {
                int atual = get<2>(fila.top());
                fila.pop();
                if (atual == fim) {
                    int passos = 0;
                    for (int p = fim; veioDe[p] != -1; p = veioDe[p]) passos++;
                    return passos;
                }
                for (int viz : vizinhos(atual)) {
                    if (veioDe[viz] == -2) {
                        veioDe[viz] = atual;
                        fila.push({h(viz), ordem++, viz});
                    }
                }
            }
            return -1;
        }

        int main() {
            cout << melhorEscolha() << " passos\n"; // 24 passos (o A* acha um caminho de 14)
        }
      `,
    },
  },
  {
    id: 'a-star',
    name: 'Busca A*',
    difficulty: 'Avançado',
    facts: { 'Criado por': 'Hart, Nilsson e Raphael', 'Ano': '1968', 'Estrutura auxiliar': 'Fila de prioridades', 'Caminho mínimo': 'Sim (com heurística admissível)' },
    summary: 'Combina o custo já percorrido com uma estimativa do que falta: rápido e ótimo.',
    description:
      'O A* (lê-se "A estrela") é a busca pela melhor escolha com uma prioridade mais inteligente: f(n) = g(n) + h(n), em que g é o custo real do início até n e h é a estimativa do que falta até o destino. Se a heurística nunca superestimar a distância real (heurística admissível), o A* garante o caminho mais curto — explorando bem menos nós que a BFS ou o algoritmo de Dijkstra. É o algoritmo padrão de pathfinding em jogos e mapas.',
    complexity: { best: 'O(d)', average: 'Depende da heurística', worst: 'O((V + E) log V)', space: 'O(V)' },
    steps: [
      'Coloque o início na fila de prioridades com g = 0 e f = h(início).',
      'Retire o nó com o menor f = g + h; se ele já foi fechado, ignore-o.',
      'Se for o destino, o custo g dele é o menor possível: termine.',
      'Feche o nó. Para cada vizinho, calcule novo_g = g(atual) + custo do passo; se for menor que o g conhecido, atualize e coloque o vizinho na fila com f = novo_g + h(vizinho).',
      'Repita até chegar ao destino ou a fila esvaziar.',
    ],
    usedIn: ['Pathfinding em jogos', 'GPS e serviços de mapas', 'Robótica e veículos autônomos', 'Planejamento em inteligência artificial', 'Roteamento de trilhas em placas de circuito'],
    realWorld: [
      { title: 'Jogos', text: 'Em jogos de estratégia e RPGs, cada unidade que você manda andar até um ponto do mapa normalmente calcula a rota com A* (ou variações) sobre uma grade ou malha de navegação.' },
      { title: 'Robótica', text: 'O A* foi criado para o robô Shakey planejar trajetos entre salas evitando obstáculos. A mesma ideia ainda é usada em robôs de armazém e aspiradores inteligentes.' },
      { title: 'Mapas e rotas', text: 'Serviços de rotas usam variações do A* e técnicas de pré-processamento para encontrar caminhos em grafos com milhões de cruzamentos, usando a distância geográfica como heurística.' },
    ],
    curiosities: [
      'Foi publicado em 1968 por Peter Hart, Nils Nilsson e Bertram Raphael, do Stanford Research Institute, como parte do projeto do robô Shakey.',
      'O nome vem de versões anteriores chamadas A1 e A2; o asterisco indicava a versão comprovadamente ótima.',
      'Com h(n) = 0, o A* vira o algoritmo de Dijkstra; ignorando g(n), vira a busca gulosa pela melhor escolha.',
    ],
    code: {
      python: String.raw`
        import heapq

        MAPA = [
            "S.......#.",
            ".######.#.",
            ".#......#.",
            ".#.######.",
            ".#........",
            ".#######.#",
            "........G.",
        ]

        def achar(ch):
            for r, linha in enumerate(MAPA):
                if ch in linha:
                    return (r, linha.index(ch))

        def vizinhos(p):
            r, c = p
            for dr, dc in ((-1, 0), (0, 1), (1, 0), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < len(MAPA) and 0 <= nc < len(MAPA[0]) and MAPA[nr][nc] != "#":
                    yield (nr, nc)

        def a_estrela():
            inicio, fim = achar("S"), achar("G")
            h = lambda p: abs(p[0] - fim[0]) + abs(p[1] - fim[1])  # nunca superestima
            g = {inicio: 0}                   # custo real do início até cada posição
            fila = [(h(inicio), 0, inicio)]   # (f = g + h, ordem de chegada, posição)
            fechados = set()
            ordem = 1
            while fila:
                _, _, atual = heapq.heappop(fila)
                if atual in fechados:
                    continue
                if atual == fim:
                    return g[atual]
                fechados.add(atual)
                for viz in vizinhos(atual):
                    novo_g = g[atual] + 1
                    if novo_g < g.get(viz, float("inf")):
                        g[viz] = novo_g
                        heapq.heappush(fila, (novo_g + h(viz), ordem, viz))
                        ordem += 1
            return -1

        print(a_estrela(), "passos")  # 14 passos (o caminho mais curto)
      `,
      javascript: String.raw`
        const MAPA = [
          "S.......#.",
          ".######.#.",
          ".#......#.",
          ".#.######.",
          ".#........",
          ".#######.#",
          "........G.",
        ];
        const L = MAPA.length, C = MAPA[0].length;

        const achar = ch => MAPA.findIndex(l => l.includes(ch)) * C + MAPA.find(l => l.includes(ch)).indexOf(ch);

        function vizinhos(p) {
          const r = Math.floor(p / C), c = p % C, res = [];
          for (const [dr, dc] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < L && nc >= 0 && nc < C && MAPA[nr][nc] !== "#") res.push(nr * C + nc);
          }
          return res;
        }

        function aEstrela() {
          const inicio = achar("S"), fim = achar("G");
          const h = p => Math.abs(Math.floor(p / C) - Math.floor(fim / C)) + Math.abs((p % C) - (fim % C));
          const g = new Map([[inicio, 0]]);       // custo real do início até cada posição
          const fila = [[h(inicio), 0, inicio]];  // [f = g + h, ordem de chegada, posição]
          const fechados = new Set();
          let ordem = 1;
          while (fila.length) {
            // retira o de menor f (em mapas grandes, use um heap)
            let m = 0;
            for (let i = 1; i < fila.length; i++) {
              if (fila[i][0] < fila[m][0] || (fila[i][0] === fila[m][0] && fila[i][1] < fila[m][1])) m = i;
            }
            const atual = fila.splice(m, 1)[0][2];
            if (fechados.has(atual)) continue;
            if (atual === fim) return g.get(atual);
            fechados.add(atual);
            for (const viz of vizinhos(atual)) {
              const novoG = g.get(atual) + 1;
              if (novoG < (g.get(viz) ?? Infinity)) {
                g.set(viz, novoG);
                fila.push([novoG + h(viz), ordem++, viz]);
              }
            }
          }
          return -1;
        }

        console.log(aEstrela(), "passos"); // 14 passos (o caminho mais curto)
      `,
      java: String.raw`
        import java.util.*;

        public class AEstrela {
            static final String[] MAPA = {
                "S.......#.",
                ".######.#.",
                ".#......#.",
                ".#.######.",
                ".#........",
                ".#######.#",
                "........G.",
            };
            static final int L = MAPA.length, C = MAPA[0].length();

            static int achar(char ch) {
                for (int r = 0; r < L; r++)
                    for (int c = 0; c < C; c++)
                        if (MAPA[r].charAt(c) == ch) return r * C + c;
                return -1;
            }

            static List<Integer> vizinhos(int p) {
                List<Integer> res = new ArrayList<>();
                int r = p / C, c = p % C;
                for (int[] d : new int[][]{{-1, 0}, {0, 1}, {1, 0}, {0, -1}}) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < L && nc >= 0 && nc < C && MAPA[nr].charAt(nc) != '#') res.add(nr * C + nc);
                }
                return res;
            }

            static int h(int p, int fim) { // distância de Manhattan: nunca superestima
                return Math.abs(p / C - fim / C) + Math.abs(p % C - fim % C);
            }

            static int aEstrela() {
                int inicio = achar('S'), fim = achar('G');
                int[] g = new int[L * C];
                Arrays.fill(g, Integer.MAX_VALUE); // custo real do início até cada posição
                g[inicio] = 0;
                boolean[] fechado = new boolean[L * C];
                // {f = g + h, ordem de chegada, posição}
                PriorityQueue<int[]> fila = new PriorityQueue<>((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
                int ordem = 0;
                fila.add(new int[]{h(inicio, fim), ordem++, inicio});
                while (!fila.isEmpty()) {
                    int atual = fila.poll()[2];
                    if (fechado[atual]) continue;
                    if (atual == fim) return g[atual];
                    fechado[atual] = true;
                    for (int viz : vizinhos(atual)) {
                        int novoG = g[atual] + 1;
                        if (novoG < g[viz]) {
                            g[viz] = novoG;
                            fila.add(new int[]{novoG + h(viz, fim), ordem++, viz});
                        }
                    }
                }
                return -1;
            }

            public static void main(String[] args) {
                System.out.println(aEstrela() + " passos"); // 14 passos (o caminho mais curto)
            }
        }
      `,
      cpp: String.raw`
        #include <climits>
        #include <cstdlib>
        #include <iostream>
        #include <queue>
        #include <string>
        #include <tuple>
        #include <vector>
        using namespace std;

        const vector<string> MAPA = {
            "S.......#.",
            ".######.#.",
            ".#......#.",
            ".#.######.",
            ".#........",
            ".#######.#",
            "........G.",
        };
        const int L = MAPA.size(), C = MAPA[0].size();

        int achar(char ch) {
            for (int r = 0; r < L; r++)
                for (int c = 0; c < C; c++)
                    if (MAPA[r][c] == ch) return r * C + c;
            return -1;
        }

        vector<int> vizinhos(int p) {
            vector<int> res;
            int r = p / C, c = p % C;
            int dirs[4][2] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < L && nc >= 0 && nc < C && MAPA[nr][nc] != '#') res.push_back(nr * C + nc);
            }
            return res;
        }

        int aEstrela() {
            int inicio = achar('S'), fim = achar('G');
            auto h = [&](int p) { return abs(p / C - fim / C) + abs(p % C - fim % C); }; // nunca superestima
            vector<int> g(L * C, INT_MAX); // custo real do início até cada posição
            vector<bool> fechado(L * C, false);
            g[inicio] = 0;
            // (f = g + h, ordem de chegada, posição)
            priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> fila;
            int ordem = 0;
            fila.push({h(inicio), ordem++, inicio});
            while (!fila.empty()) {
                int atual = get<2>(fila.top());
                fila.pop();
                if (fechado[atual]) continue;
                if (atual == fim) return g[atual];
                fechado[atual] = true;
                for (int viz : vizinhos(atual)) {
                    int novoG = g[atual] + 1;
                    if (novoG < g[viz]) {
                        g[viz] = novoG;
                        fila.push({novoG + h(viz), ordem++, viz});
                    }
                }
            }
            return -1;
        }

        int main() {
            cout << aEstrela() << " passos\n"; // 14 passos (o caminho mais curto)
        }
      `,
    },
  },
]
