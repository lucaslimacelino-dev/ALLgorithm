export default [
  {
    id: 'bogosort',
    name: 'Bogosort',
    difficulty: 'Iniciante',
    facts: { 'Criado por': 'Folclore da computação', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Embaralha a lista aleatoriamente até que, por pura sorte, ela fique ordenada.',
    description:
      'O Bogosort (também chamado de "ordenação do macaco") verifica se a lista está ordenada e, se não estiver, embaralha tudo e tenta de novo. Não tem nenhum uso prático: ele existe para mostrar, por contraste, por que a escolha do algoritmo importa. Com só 10 elementos, precisa em média de mais de 3 milhões de embaralhadas.',
    complexity: { best: 'O(n)', average: 'O(n · n!)', worst: 'Ilimitado', space: 'O(1)' },
    steps: [
      'Verifique se a lista está ordenada, comparando cada elemento com o próximo.',
      'Se estiver ordenada, termine.',
      'Se não estiver, embaralhe a lista inteira de forma aleatória.',
      'Volte ao primeiro passo.',
    ],
    usedIn: ['Ensino de complexidade', 'Cultura e humor de programação', 'Exercícios de embaralhamento', 'Exemplo de pior algoritmo possível'],
    realWorld: [
      { title: 'Mostrar por que a complexidade importa', text: 'Professores usam o bogosort para ilustrar o crescimento fatorial: 5 elementos têm 120 permutações possíveis, 10 já têm 3,6 milhões e 20 passam de 2 quintilhões.' },
      { title: 'Testar embaralhamentos', text: 'Ele depende de um embaralhamento uniforme (como o de Fisher-Yates). Implementá-lo é um bom exercício para gerar e testar permutações aleatórias corretamente.' },
      { title: 'Cultura hacker', text: 'Aparece em competições de "piores algoritmos", em memes e no Jargon File, o dicionário clássico da cultura hacker.' },
    ],
    curiosities: [
      'O nome vem de "bogus" (falso, fajuto, em inglês). O Jargon File o define como "o algoritmo arquetipicamente perverso".',
      'Existe o "Quantum Bogosort", uma piada: embaralhe a lista e, se ela não estiver ordenada, destrua o universo. Pela interpretação de muitos mundos, no universo que sobrar a lista estará ordenada.',
      'Uma variação, o Bozosort, troca apenas dois elementos aleatórios por vez — e continua igualmente inútil.',
    ],
    code: {
      python: String.raw`
        import random

        def esta_ordenado(arr):
            return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))

        def bogosort(arr):
            tentativas = 0
            while not esta_ordenado(arr):
                random.shuffle(arr)
                tentativas += 1
            return tentativas

        arr = [5, 2, 9, 1, 7]
        tentativas = bogosort(arr)
        print(arr, "após", tentativas, "embaralhadas")  # [1, 2, 5, 7, 9] após ~120 embaralhadas
      `,
      javascript: String.raw`
        function estaOrdenado(arr) {
          for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) return false;
          }
          return true;
        }

        function embaralhar(arr) { // Fisher-Yates
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }

        function bogosort(arr) {
          let tentativas = 0;
          while (!estaOrdenado(arr)) {
            embaralhar(arr);
            tentativas++;
          }
          return tentativas;
        }

        const arr = [5, 2, 9, 1, 7];
        const tentativas = bogosort(arr);
        console.log(arr, "após", tentativas, "embaralhadas"); // [1, 2, 5, 7, 9] após ~120 embaralhadas
      `,
      java: String.raw`
        import java.util.Arrays;
        import java.util.Random;

        public class Bogosort {
            static final Random rnd = new Random();

            static boolean estaOrdenado(int[] arr) {
                for (int i = 0; i < arr.length - 1; i++)
                    if (arr[i] > arr[i + 1]) return false;
                return true;
            }

            static void embaralhar(int[] arr) { // Fisher-Yates
                for (int i = arr.length - 1; i > 0; i--) {
                    int j = rnd.nextInt(i + 1);
                    int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                }
            }

            static int bogosort(int[] arr) {
                int tentativas = 0;
                while (!estaOrdenado(arr)) {
                    embaralhar(arr);
                    tentativas++;
                }
                return tentativas;
            }

            public static void main(String[] args) {
                int[] arr = {5, 2, 9, 1, 7};
                int tentativas = bogosort(arr);
                System.out.println(Arrays.toString(arr) + " após " + tentativas + " embaralhadas");
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <random>
        #include <vector>
        using namespace std;

        int bogosort(vector<int>& arr) {
            mt19937 rng(random_device{}());
            int tentativas = 0;
            while (!is_sorted(arr.begin(), arr.end())) {
                shuffle(arr.begin(), arr.end(), rng);
                tentativas++;
            }
            return tentativas;
        }

        int main() {
            vector<int> arr = {5, 2, 9, 1, 7};
            int tentativas = bogosort(arr);
            for (int x : arr) cout << x << " ";
            cout << "após " << tentativas << " embaralhadas\n"; // 1 2 5 7 9 após ~120 embaralhadas
        }
      `,
    },
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    difficulty: 'Iniciante',
    facts: { 'Primeira análise': 'Edward H. Friend', 'Ano': '1956', 'Estável': 'Sim', 'In-place': 'Sim' },
    summary: 'Compara vizinhos e troca os que estão fora de ordem até nada mais mudar.',
    description:
      'O Bubble Sort percorre a lista várias vezes comparando pares de elementos adjacentes e trocando-os quando estão na ordem errada. A cada passada, o maior elemento ainda não ordenado "borbulha" até o fim da lista — daí o nome. É lento para grandes volumes, mas é o ponto de partida clássico para entender ordenação.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Comece no início da lista e compare o elemento atual com o próximo.',
      'Se o atual for maior, troque os dois de lugar.',
      'Avance uma posição e repita até o fim: o maior valor terá chegado à última posição.',
      'Repita as passadas, ignorando a parte final que já está ordenada.',
      'Se uma passada inteira terminar sem nenhuma troca, a lista está ordenada e o algoritmo para.',
    ],
    usedIn: ['Ensino de algoritmos', 'Listas muito pequenas', 'Dados quase ordenados', 'Sistemas com memória mínima'],
    realWorld: [
      { title: 'Sala de aula', text: 'É o primeiro algoritmo de ordenação ensinado na maioria dos cursos de programação, por ser fácil de visualizar e implementar.' },
      { title: 'Preenchimento de polígonos', text: 'Em computação gráfica, algoritmos de preenchimento por linha de varredura mantêm as arestas ordenadas pela coordenada x. Como a ordem muda pouco de uma linha para a outra, o bubble sort corrige a lista em tempo praticamente linear.' },
      { title: 'Placar que muda pouco', text: 'Quando só um ou dois itens saem do lugar entre atualizações (como um ranking após uma rodada), a parada antecipada faz o bubble sort terminar em poucas passadas.' },
    ],
    curiosities: [
      'Em 2007, ao ser perguntado pelo CEO do Google, Eric Schmidt, qual seria a forma mais eficiente de ordenar um milhão de inteiros de 32 bits, Barack Obama respondeu: "acho que o bubble sort seria a forma errada".',
      'Donald Knuth escreveu que o bubble sort "parece não ter nada a recomendá-lo, exceto um nome cativante".',
      'Existe uma variação chamada Cocktail Shaker Sort, que percorre a lista nos dois sentidos alternadamente.',
    ],
    code: {
      python: String.raw`
        def bubble_sort(arr):
            n = len(arr)
            for i in range(n - 1):
                trocou = False
                for j in range(n - 1 - i):
                    if arr[j] > arr[j + 1]:
                        arr[j], arr[j + 1] = arr[j + 1], arr[j]
                        trocou = True
                if not trocou:  # nenhuma troca: já está ordenado
                    break
            return arr

        print(bubble_sort([5, 2, 9, 1, 7]))  # [1, 2, 5, 7, 9]
      `,
      javascript: String.raw`
        function bubbleSort(arr) {
          const n = arr.length;
          for (let i = 0; i < n - 1; i++) {
            let trocou = false;
            for (let j = 0; j < n - 1 - i; j++) {
              if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                trocou = true;
              }
            }
            if (!trocou) break; // nenhuma troca: já está ordenado
          }
          return arr;
        }

        console.log(bubbleSort([5, 2, 9, 1, 7])); // [1, 2, 5, 7, 9]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class BubbleSort {
            static void bubbleSort(int[] arr) {
                int n = arr.length;
                for (int i = 0; i < n - 1; i++) {
                    boolean trocou = false;
                    for (int j = 0; j < n - 1 - i; j++) {
                        if (arr[j] > arr[j + 1]) {
                            int tmp = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = tmp;
                            trocou = true;
                        }
                    }
                    if (!trocou) break; // nenhuma troca: já está ordenado
                }
            }

            public static void main(String[] args) {
                int[] arr = {5, 2, 9, 1, 7};
                bubbleSort(arr);
                System.out.println(Arrays.toString(arr)); // [1, 2, 5, 7, 9]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void bubbleSort(vector<int>& arr) {
            int n = arr.size();
            for (int i = 0; i < n - 1; i++) {
                bool trocou = false;
                for (int j = 0; j < n - 1 - i; j++) {
                    if (arr[j] > arr[j + 1]) {
                        swap(arr[j], arr[j + 1]);
                        trocou = true;
                    }
                }
                if (!trocou) break; // nenhuma troca: já está ordenado
            }
        }

        int main() {
            vector<int> arr = {5, 2, 9, 1, 7};
            bubbleSort(arr);
            for (int x : arr) cout << x << " "; // 1 2 5 7 9
        }
      `,
    },
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    difficulty: 'Iniciante',
    facts: { 'Criado por': 'Método clássico', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Procura o menor elemento restante e o coloca na próxima posição.',
    description:
      'O Selection Sort divide a lista em uma parte ordenada (à esquerda) e uma não ordenada. A cada rodada, procura o menor elemento da parte não ordenada e o troca com o primeiro elemento dela. Faz sempre o mesmo número de comparações, mas no máximo n − 1 trocas — o que o torna interessante quando escrever na memória é caro.',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Considere a posição 0 como o início da parte não ordenada.',
      'Percorra a parte não ordenada inteira e encontre o menor elemento.',
      'Troque o menor elemento com o primeiro da parte não ordenada.',
      'A parte ordenada cresce uma posição; repita até restar um único elemento.',
    ],
    usedIn: ['Memórias com escrita cara (flash, EEPROM)', 'Listas pequenas', 'Sistemas embarcados', 'Ensino de algoritmos'],
    realWorld: [
      { title: 'Memória flash', text: 'Cada escrita desgasta uma célula de memória flash. Como faz no máximo n − 1 trocas, o selection sort minimiza as escritas quando um microcontrolador precisa ordenar dados guardados na própria EEPROM.' },
      { title: 'Pódio sem ordenar tudo', text: 'Para descobrir só os 3 primeiros colocados de uma corrida, bastam 3 rodadas do selection sort — não é preciso ordenar a lista inteira.' },
      { title: 'Objetos pesados', text: 'Ao organizar caixas pesadas em uma prateleira, faz sentido procurar a menor e movê-la uma única vez para o lugar certo, em vez de ficar trocando caixas vizinhas.' },
    ],
    curiosities: [
      'Faz exatamente n(n − 1)/2 comparações, esteja a lista ordenada ou não: ele não se beneficia de dados já organizados.',
      'Não é estável: elementos iguais podem trocar de ordem. Por exemplo, [2a, 2b, 1] vira [1, 2b, 2a].',
      'O Heap Sort pode ser visto como um selection sort turbinado: em vez de procurar o menor elemento linearmente, usa um heap para encontrá-lo em O(log n).',
    ],
    code: {
      python: String.raw`
        def selection_sort(arr):
            n = len(arr)
            for i in range(n - 1):
                menor = i
                for j in range(i + 1, n):
                    if arr[j] < arr[menor]:
                        menor = j
                if menor != i:
                    arr[i], arr[menor] = arr[menor], arr[i]
            return arr

        print(selection_sort([64, 25, 12, 22, 11]))  # [11, 12, 22, 25, 64]
      `,
      javascript: String.raw`
        function selectionSort(arr) {
          const n = arr.length;
          for (let i = 0; i < n - 1; i++) {
            let menor = i;
            for (let j = i + 1; j < n; j++) {
              if (arr[j] < arr[menor]) menor = j;
            }
            if (menor !== i) [arr[i], arr[menor]] = [arr[menor], arr[i]];
          }
          return arr;
        }

        console.log(selectionSort([64, 25, 12, 22, 11])); // [11, 12, 22, 25, 64]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class SelectionSort {
            static void selectionSort(int[] arr) {
                int n = arr.length;
                for (int i = 0; i < n - 1; i++) {
                    int menor = i;
                    for (int j = i + 1; j < n; j++)
                        if (arr[j] < arr[menor]) menor = j;
                    int tmp = arr[i];
                    arr[i] = arr[menor];
                    arr[menor] = tmp;
                }
            }

            public static void main(String[] args) {
                int[] arr = {64, 25, 12, 22, 11};
                selectionSort(arr);
                System.out.println(Arrays.toString(arr)); // [11, 12, 22, 25, 64]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void selectionSort(vector<int>& arr) {
            int n = arr.size();
            for (int i = 0; i < n - 1; i++) {
                int menor = i;
                for (int j = i + 1; j < n; j++)
                    if (arr[j] < arr[menor]) menor = j;
                swap(arr[i], arr[menor]);
            }
        }

        int main() {
            vector<int> arr = {64, 25, 12, 22, 11};
            selectionSort(arr);
            for (int x : arr) cout << x << " "; // 11 12 22 25 64
        }
      `,
    },
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    difficulty: 'Iniciante',
    facts: { 'Criado por': 'Método clássico', 'Estável': 'Sim', 'In-place': 'Sim' },
    summary: 'Insere cada elemento na posição certa da parte já ordenada, como cartas na mão.',
    description:
      'O Insertion Sort constrói a lista ordenada um elemento por vez: pega o próximo elemento e o desloca para a esquerda até encontrar sua posição entre os já ordenados — exatamente como a maioria das pessoas organiza cartas de baralho na mão. É lento em listas grandes e bagunçadas, mas extremamente rápido em listas pequenas ou quase ordenadas, por isso aparece dentro dos algoritmos de ordenação das linguagens modernas.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Considere o primeiro elemento como uma lista ordenada de tamanho 1.',
      'Pegue o próximo elemento (o "atual").',
      'Desloque uma posição para a direita todos os elementos ordenados maiores que o atual.',
      'Coloque o atual no espaço que sobrou.',
      'Repita até inserir o último elemento.',
    ],
    usedIn: ['Timsort (Python, Java, V8)', 'Introsort (std::sort do C++)', 'Dados quase ordenados', 'Ordenação online (dados chegando aos poucos)'],
    realWorld: [
      { title: 'Cartas na mão', text: 'Ao receber cartas uma a uma, você encaixa cada nova carta na posição certa entre as que já estão na mão. Isso é insertion sort.' },
      { title: 'Dentro de algoritmos híbridos', text: 'O Timsort (usado pelo Python, pelo Java para objetos e pelo V8 do JavaScript) e o Introsort (std::sort do C++) passam a usar insertion sort em trechos pequenos, onde ele é mais rápido que algoritmos O(n log n).' },
      { title: 'Feeds em tempo real', text: 'Um feed que recebe eventos quase sempre em ordem de horário pode inserir cada novo evento na posição certa com custo praticamente constante.' },
    ],
    curiosities: [
      'É estável, in-place e online: consegue ordenar à medida que os dados chegam, sem conhecer a lista inteira.',
      'O número de deslocamentos que ele faz é exatamente o número de inversões (pares fora de ordem) da lista.',
      'O Shell Sort, de 1959, nasceu como uma otimização do insertion sort que compara primeiro elementos distantes.',
    ],
    code: {
      python: String.raw`
        def insertion_sort(arr):
            for i in range(1, len(arr)):
                atual = arr[i]
                j = i - 1
                # desloca para a direita os elementos maiores que "atual"
                while j >= 0 and arr[j] > atual:
                    arr[j + 1] = arr[j]
                    j -= 1
                arr[j + 1] = atual
            return arr

        print(insertion_sort([12, 11, 13, 5, 6]))  # [5, 6, 11, 12, 13]
      `,
      javascript: String.raw`
        function insertionSort(arr) {
          for (let i = 1; i < arr.length; i++) {
            const atual = arr[i];
            let j = i - 1;
            // desloca para a direita os elementos maiores que "atual"
            while (j >= 0 && arr[j] > atual) {
              arr[j + 1] = arr[j];
              j--;
            }
            arr[j + 1] = atual;
          }
          return arr;
        }

        console.log(insertionSort([12, 11, 13, 5, 6])); // [5, 6, 11, 12, 13]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class InsertionSort {
            static void insertionSort(int[] arr) {
                for (int i = 1; i < arr.length; i++) {
                    int atual = arr[i];
                    int j = i - 1;
                    // desloca para a direita os elementos maiores que "atual"
                    while (j >= 0 && arr[j] > atual) {
                        arr[j + 1] = arr[j];
                        j--;
                    }
                    arr[j + 1] = atual;
                }
            }

            public static void main(String[] args) {
                int[] arr = {12, 11, 13, 5, 6};
                insertionSort(arr);
                System.out.println(Arrays.toString(arr)); // [5, 6, 11, 12, 13]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void insertionSort(vector<int>& arr) {
            for (int i = 1; i < (int)arr.size(); i++) {
                int atual = arr[i];
                int j = i - 1;
                // desloca para a direita os elementos maiores que "atual"
                while (j >= 0 && arr[j] > atual) {
                    arr[j + 1] = arr[j];
                    j--;
                }
                arr[j + 1] = atual;
            }
        }

        int main() {
            vector<int> arr = {12, 11, 13, 5, 6};
            insertionSort(arr);
            for (int x : arr) cout << x << " "; // 5 6 11 12 13
        }
      `,
    },
  },
  {
    id: 'gnome-sort',
    name: 'Gnome Sort',
    difficulty: 'Iniciante',
    facts: { 'Criado por': 'Hamid Sarbazi-Azad', 'Ano': '2000', 'Estável': 'Sim', 'In-place': 'Sim' },
    summary: 'Avança enquanto está em ordem; quando não está, troca com o anterior e recua um passo.',
    description:
      'O Gnome Sort (originalmente chamado de "Stupid Sort") usa um único índice que anda pela lista: se o elemento atual está em ordem com o anterior, avança; se não, troca os dois e recua uma posição. É parecido com o insertion sort, mas feito apenas com trocas de vizinhos e com um único laço — é um dos algoritmos de ordenação mais curtos de escrever.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Comece na posição 0.',
      'Se estiver na posição 0, ou se o elemento atual for maior ou igual ao anterior, avance uma posição.',
      'Caso contrário, troque o elemento atual com o anterior e recue uma posição.',
      'Repita até passar do fim da lista.',
    ],
    usedIn: ['Ensino de algoritmos', 'Code golf', 'Listas pequenas', 'Programas com tamanho de código limitado'],
    realWorld: [
      { title: 'Arrumando uma estante', text: 'Uma pessoa que anda ao longo da estante e, ao achar um livro fora de lugar, vai trocando-o para trás até que ele se encaixe, está executando um gnome sort.' },
      { title: 'Código mínimo', text: 'Quando o tamanho do código importa mais que a velocidade — bootloaders, desafios de code golf, firmwares minúsculos — o gnome sort cabe em poucas linhas.' },
      { title: 'Ensino de invariantes', text: 'É ótimo para discutir invariantes de laço: tudo à esquerda do índice está sempre ordenado.' },
    ],
    curiosities: [
      'Foi proposto em 2000 pelo cientista iraniano Hamid Sarbazi-Azad com o nome "Stupid Sort", e depois popularizado por Dick Grune como "Gnome Sort".',
      'Grune explicou o nome com a imagem de um gnomo de jardim holandês organizando uma fila de vasos de flores: ele olha o vaso à frente e o anterior, troca se necessário e anda para a frente ou para trás.',
      'Apesar de parecer diferente, ele faz exatamente as mesmas trocas que o insertion sort — só que sem o laço interno.',
    ],
    code: {
      python: String.raw`
        def gnome_sort(arr):
            i = 0
            while i < len(arr):
                if i == 0 or arr[i - 1] <= arr[i]:
                    i += 1  # em ordem: avança
                else:
                    arr[i], arr[i - 1] = arr[i - 1], arr[i]
                    i -= 1  # trocou: volta um passo
            return arr

        print(gnome_sort([34, 2, 10, -9, 7]))  # [-9, 2, 7, 10, 34]
      `,
      javascript: String.raw`
        function gnomeSort(arr) {
          let i = 0;
          while (i < arr.length) {
            if (i === 0 || arr[i - 1] <= arr[i]) {
              i++; // em ordem: avança
            } else {
              [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
              i--; // trocou: volta um passo
            }
          }
          return arr;
        }

        console.log(gnomeSort([34, 2, 10, -9, 7])); // [-9, 2, 7, 10, 34]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class GnomeSort {
            static void gnomeSort(int[] arr) {
                int i = 0;
                while (i < arr.length) {
                    if (i == 0 || arr[i - 1] <= arr[i]) {
                        i++; // em ordem: avança
                    } else {
                        int tmp = arr[i]; arr[i] = arr[i - 1]; arr[i - 1] = tmp;
                        i--; // trocou: volta um passo
                    }
                }
            }

            public static void main(String[] args) {
                int[] arr = {34, 2, 10, -9, 7};
                gnomeSort(arr);
                System.out.println(Arrays.toString(arr)); // [-9, 2, 7, 10, 34]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void gnomeSort(vector<int>& arr) {
            size_t i = 0;
            while (i < arr.size()) {
                if (i == 0 || arr[i - 1] <= arr[i]) {
                    i++; // em ordem: avança
                } else {
                    swap(arr[i], arr[i - 1]);
                    i--; // trocou: volta um passo
                }
            }
        }

        int main() {
            vector<int> arr = {34, 2, 10, -9, 7};
            gnomeSort(arr);
            for (int x : arr) cout << x << " "; // -9 2 7 10 34
        }
      `,
    },
  },
  {
    id: 'cocktail-sort',
    name: 'Cocktail Shaker Sort',
    difficulty: 'Iniciante',
    facts: { 'Criado por': 'Variação do bubble sort', 'Estável': 'Sim', 'In-place': 'Sim' },
    summary: 'Um bubble sort de ida e volta: leva o maior para o fim e o menor para o início.',
    description:
      'O Cocktail Shaker Sort é uma variação do bubble sort que percorre a lista nos dois sentidos, alternadamente, como quem chacoalha uma coqueteleira. Na ida, o maior elemento vai para o fim; na volta, o menor vai para o início. Isso resolve o problema das "tartarugas" do bubble sort: valores pequenos perdidos no fim da lista, que no bubble sort andam só uma posição por passada.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Percorra a lista da esquerda para a direita trocando vizinhos fora de ordem: o maior vai para o fim.',
      'Diminua o limite final em uma posição.',
      'Percorra da direita para a esquerda trocando vizinhos fora de ordem: o menor vai para o início.',
      'Aumente o limite inicial em uma posição.',
      'Repita até que uma passada termine sem nenhuma troca.',
    ],
    usedIn: ['Ensino de algoritmos', 'Dados quase ordenados', 'Listas pequenas', 'Comparação com o bubble sort'],
    realWorld: [
      { title: 'Item que foi para o fim', text: 'Em uma playlist ordenada em que uma música do início foi parar no fim, o bubble sort precisaria de n − 1 passadas para trazê-la de volta; o cocktail sort resolve em uma ida e uma volta.' },
      { title: 'Ensino de otimização', text: 'É um bom exemplo de como analisar o ponto fraco de um algoritmo (as "tartarugas") e corrigi-lo com uma mudança pequena.' },
      { title: 'Dados quase ordenados', text: 'Listas em que poucos elementos estão deslocados — em qualquer direção — são ordenadas em poucas passadas.' },
    ],
    curiosities: [
      'Também é conhecido como bidirectional bubble sort, shaker sort, ripple sort e shuttle sort.',
      'Na lista [2, 3, 4, 5, 1], o bubble sort precisa de 4 passadas; o cocktail sort ordena tudo em uma ida e uma volta.',
      'Donald Knuth o analisa em The Art of Computer Programming e observa que o ganho em relação ao bubble sort é pequeno: os dois continuam O(n²).',
    ],
    code: {
      python: String.raw`
        def cocktail_sort(arr):
            inicio, fim = 0, len(arr) - 1
            trocou = True
            while trocou:
                trocou = False
                for i in range(inicio, fim):  # ida: leva o maior para o fim
                    if arr[i] > arr[i + 1]:
                        arr[i], arr[i + 1] = arr[i + 1], arr[i]
                        trocou = True
                fim -= 1
                if not trocou:
                    break
                trocou = False
                for i in range(fim - 1, inicio - 1, -1):  # volta: leva o menor para o início
                    if arr[i] > arr[i + 1]:
                        arr[i], arr[i + 1] = arr[i + 1], arr[i]
                        trocou = True
                inicio += 1
            return arr

        print(cocktail_sort([5, 1, 4, 2, 8, 0, 2]))  # [0, 1, 2, 2, 4, 5, 8]
      `,
      javascript: String.raw`
        function cocktailSort(arr) {
          let inicio = 0, fim = arr.length - 1;
          let trocou = true;
          while (trocou) {
            trocou = false;
            for (let i = inicio; i < fim; i++) { // ida: leva o maior para o fim
              if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                trocou = true;
              }
            }
            fim--;
            if (!trocou) break;
            trocou = false;
            for (let i = fim - 1; i >= inicio; i--) { // volta: leva o menor para o início
              if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                trocou = true;
              }
            }
            inicio++;
          }
          return arr;
        }

        console.log(cocktailSort([5, 1, 4, 2, 8, 0, 2])); // [0, 1, 2, 2, 4, 5, 8]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class CocktailSort {
            static void troca(int[] arr, int i, int j) {
                int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }

            static void cocktailSort(int[] arr) {
                int inicio = 0, fim = arr.length - 1;
                boolean trocou = true;
                while (trocou) {
                    trocou = false;
                    for (int i = inicio; i < fim; i++) // ida: leva o maior para o fim
                        if (arr[i] > arr[i + 1]) { troca(arr, i, i + 1); trocou = true; }
                    fim--;
                    if (!trocou) break;
                    trocou = false;
                    for (int i = fim - 1; i >= inicio; i--) // volta: leva o menor para o início
                        if (arr[i] > arr[i + 1]) { troca(arr, i, i + 1); trocou = true; }
                    inicio++;
                }
            }

            public static void main(String[] args) {
                int[] arr = {5, 1, 4, 2, 8, 0, 2};
                cocktailSort(arr);
                System.out.println(Arrays.toString(arr)); // [0, 1, 2, 2, 4, 5, 8]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void cocktailSort(vector<int>& arr) {
            int inicio = 0, fim = arr.size() - 1;
            bool trocou = true;
            while (trocou) {
                trocou = false;
                for (int i = inicio; i < fim; i++) // ida: leva o maior para o fim
                    if (arr[i] > arr[i + 1]) { swap(arr[i], arr[i + 1]); trocou = true; }
                fim--;
                if (!trocou) break;
                trocou = false;
                for (int i = fim - 1; i >= inicio; i--) // volta: leva o menor para o início
                    if (arr[i] > arr[i + 1]) { swap(arr[i], arr[i + 1]); trocou = true; }
                inicio++;
            }
        }

        int main() {
            vector<int> arr = {5, 1, 4, 2, 8, 0, 2};
            cocktailSort(arr);
            for (int x : arr) cout << x << " "; // 0 1 2 2 4 5 8
        }
      `,
    },
  },
  {
    id: 'comb-sort',
    name: 'Comb Sort',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'W. Dobosiewicz e A. Borowy', 'Ano': '1980', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Um bubble sort com "pente": compara elementos distantes e vai diminuindo a distância.',
    description:
      'O Comb Sort melhora o bubble sort comparando elementos separados por um intervalo (gap) que começa grande e é dividido por 1,3 a cada passada, como os dentes de um pente cada vez mais fino. Elementos pequenos perdidos no fim da lista são levados para a frente em poucos saltos. Quando o intervalo chega a 1, ele termina com passadas de bubble sort comum sobre uma lista já quase ordenada.',
    complexity: { best: 'O(n log n)', average: 'Ω(n²/2ᵖ)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Comece com o intervalo igual ao tamanho da lista.',
      'Divida o intervalo por 1,3 (arredondando para baixo; o mínimo é 1).',
      'Compare cada elemento com o que está "intervalo" posições à frente e troque se estiverem fora de ordem.',
      'Repita até que o intervalo seja 1 e uma passada inteira termine sem trocas.',
    ],
    usedIn: ['Substituto direto do bubble sort', 'Sistemas embarcados', 'Ambientes sem recursão', 'Ensino de otimização'],
    realWorld: [
      { title: 'Melhorar código legado', text: 'Trocar um bubble sort por um comb sort exige mudar poucas linhas e pode deixar a ordenação dezenas de vezes mais rápida em listas médias.' },
      { title: 'Sistemas embarcados', text: 'Não usa recursão nem memória extra e tem bom desempenho prático, o que o torna útil em microcontroladores com pilha muito pequena.' },
      { title: 'Ensino', text: 'Mostra como uma ideia simples — comparar elementos distantes primeiro — muda radicalmente o desempenho de um algoritmo.' },
    ],
    curiosities: [
      'Foi criado por Włodzimierz Dobosiewicz e Artur Borowy em 1980 e redescoberto por Stephen Lacey e Richard Box, que o popularizaram em 1991 na revista Byte.',
      'O fator de redução 1,3 foi escolhido de forma empírica, testando o algoritmo em mais de 200 mil listas aleatórias.',
      'A mesma ideia de "comparar longe primeiro" aplicada ao insertion sort dá origem ao Shell Sort.',
    ],
    code: {
      python: String.raw`
        def comb_sort(arr):
            gap = len(arr)
            ordenado = False
            while not ordenado:
                gap = int(gap / 1.3)
                if gap <= 1:
                    gap = 1
                    ordenado = True  # vira um bubble sort comum
                for i in range(len(arr) - gap):
                    if arr[i] > arr[i + gap]:
                        arr[i], arr[i + gap] = arr[i + gap], arr[i]
                        ordenado = False
            return arr

        print(comb_sort([8, 4, 1, 56, 3, -44, 23, -6, 28, 0]))
        # [-44, -6, 0, 1, 3, 4, 8, 23, 28, 56]
      `,
      javascript: String.raw`
        function combSort(arr) {
          let gap = arr.length;
          let ordenado = false;
          while (!ordenado) {
            gap = Math.floor(gap / 1.3);
            if (gap <= 1) {
              gap = 1;
              ordenado = true; // vira um bubble sort comum
            }
            for (let i = 0; i + gap < arr.length; i++) {
              if (arr[i] > arr[i + gap]) {
                [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                ordenado = false;
              }
            }
          }
          return arr;
        }

        console.log(combSort([8, 4, 1, 56, 3, -44, 23, -6, 28, 0]).join(", "));
        // -44, -6, 0, 1, 3, 4, 8, 23, 28, 56
      `,
      java: String.raw`
        import java.util.Arrays;

        public class CombSort {
            static void combSort(int[] arr) {
                int gap = arr.length;
                boolean ordenado = false;
                while (!ordenado) {
                    gap = (int) (gap / 1.3);
                    if (gap <= 1) {
                        gap = 1;
                        ordenado = true; // vira um bubble sort comum
                    }
                    for (int i = 0; i + gap < arr.length; i++) {
                        if (arr[i] > arr[i + gap]) {
                            int tmp = arr[i]; arr[i] = arr[i + gap]; arr[i + gap] = tmp;
                            ordenado = false;
                        }
                    }
                }
            }

            public static void main(String[] args) {
                int[] arr = {8, 4, 1, 56, 3, -44, 23, -6, 28, 0};
                combSort(arr);
                System.out.println(Arrays.toString(arr)); // [-44, -6, 0, 1, 3, 4, 8, 23, 28, 56]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void combSort(vector<int>& arr) {
            int gap = arr.size();
            bool ordenado = false;
            while (!ordenado) {
                gap = (int)(gap / 1.3);
                if (gap <= 1) {
                    gap = 1;
                    ordenado = true; // vira um bubble sort comum
                }
                for (int i = 0; i + gap < (int)arr.size(); i++) {
                    if (arr[i] > arr[i + gap]) {
                        swap(arr[i], arr[i + gap]);
                        ordenado = false;
                    }
                }
            }
        }

        int main() {
            vector<int> arr = {8, 4, 1, 56, 3, -44, 23, -6, 28, 0};
            combSort(arr);
            for (int x : arr) cout << x << " "; // -44 -6 0 1 3 4 8 23 28 56
        }
      `,
    },
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Donald Shell', 'Ano': '1959', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Insertion sort em etapas: ordena elementos distantes primeiro e vai aproximando.',
    description:
      'O Shell Sort aplica o insertion sort várias vezes, em elementos separados por um intervalo (gap) que vai diminuindo. Com intervalos grandes, os elementos dão "saltos" longos até perto da posição final; quando o intervalo chega a 1, sobra um insertion sort comum sobre uma lista quase ordenada — justamente o caso em que ele é rapidíssimo. Seu desempenho depende da sequência de intervalos escolhida.',
    complexity: { best: 'O(n log n)', average: '≈ O(n^1,3)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Escolha um intervalo inicial (aqui, metade do tamanho da lista).',
      'Para esse intervalo, faça um insertion sort considerando só elementos a "intervalo" posições de distância.',
      'Reduza o intervalo (aqui, pela metade).',
      'Repita até terminar a passada com intervalo 1.',
    ],
    usedIn: ['bzip2 (compressão)', 'uClibc (qsort)', 'Sistemas embarcados', 'Arrays de tamanho médio'],
    realWorld: [
      { title: 'Compressor bzip2', text: 'O bzip2 usa shell sort em parte de sua etapa de ordenação de blocos, por não precisar de recursão nem de memória extra.' },
      { title: 'Bibliotecas para embarcados', text: 'A uClibc, biblioteca C usada em roteadores e dispositivos IoT, implementa sua função qsort com shell sort.' },
      { title: 'Memória e pilha limitadas', text: 'Em sistemas onde recursão profunda pode estourar a pilha, o shell sort oferece desempenho bem melhor que O(n²) com código iterativo e curto.' },
    ],
    curiosities: [
      'Foi publicado por Donald Shell em 1959 e foi um dos primeiros algoritmos a superar, na prática, a barreira O(n²) dos métodos simples.',
      'Sua complexidade exata ainda é um problema em aberto: ela depende da sequência de intervalos, e não se sabe qual é a melhor sequência possível.',
      'A sequência de Marcin Ciura (1, 4, 10, 23, 57, 132, 301, 701…), encontrada experimentalmente em 2001, está entre as melhores conhecidas.',
    ],
    code: {
      python: String.raw`
        def shell_sort(arr):
            gap = len(arr) // 2
            while gap > 0:
                # insertion sort entre elementos a "gap" posições de distância
                for i in range(gap, len(arr)):
                    atual = arr[i]
                    j = i
                    while j >= gap and arr[j - gap] > atual:
                        arr[j] = arr[j - gap]
                        j -= gap
                    arr[j] = atual
                gap //= 2
            return arr

        print(shell_sort([23, 12, 1, 8, 34, 54, 2, 3]))  # [1, 2, 3, 8, 12, 23, 34, 54]
      `,
      javascript: String.raw`
        function shellSort(arr) {
          for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // insertion sort entre elementos a "gap" posições de distância
            for (let i = gap; i < arr.length; i++) {
              const atual = arr[i];
              let j = i;
              while (j >= gap && arr[j - gap] > atual) {
                arr[j] = arr[j - gap];
                j -= gap;
              }
              arr[j] = atual;
            }
          }
          return arr;
        }

        console.log(shellSort([23, 12, 1, 8, 34, 54, 2, 3]).join(", ")); // 1, 2, 3, 8, 12, 23, 34, 54
      `,
      java: String.raw`
        import java.util.Arrays;

        public class ShellSort {
            static void shellSort(int[] arr) {
                for (int gap = arr.length / 2; gap > 0; gap /= 2) {
                    // insertion sort entre elementos a "gap" posições de distância
                    for (int i = gap; i < arr.length; i++) {
                        int atual = arr[i];
                        int j = i;
                        while (j >= gap && arr[j - gap] > atual) {
                            arr[j] = arr[j - gap];
                            j -= gap;
                        }
                        arr[j] = atual;
                    }
                }
            }

            public static void main(String[] args) {
                int[] arr = {23, 12, 1, 8, 34, 54, 2, 3};
                shellSort(arr);
                System.out.println(Arrays.toString(arr)); // [1, 2, 3, 8, 12, 23, 34, 54]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void shellSort(vector<int>& arr) {
            int n = arr.size();
            for (int gap = n / 2; gap > 0; gap /= 2) {
                // insertion sort entre elementos a "gap" posições de distância
                for (int i = gap; i < n; i++) {
                    int atual = arr[i];
                    int j = i;
                    while (j >= gap && arr[j - gap] > atual) {
                        arr[j] = arr[j - gap];
                        j -= gap;
                    }
                    arr[j] = atual;
                }
            }
        }

        int main() {
            vector<int> arr = {23, 12, 1, 8, 34, 54, 2, 3};
            shellSort(arr);
            for (int x : arr) cout << x << " "; // 1 2 3 8 12 23 34 54
        }
      `,
    },
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'John von Neumann', 'Ano': '1945', 'Estável': 'Sim', 'In-place': 'Não' },
    summary: 'Divide a lista ao meio, ordena cada metade e intercala os resultados.',
    description:
      'O Merge Sort é o exemplo clássico de "dividir para conquistar": divide a lista em duas metades, ordena cada uma recursivamente e depois intercala (merge) as duas metades ordenadas em uma só. Garante O(n log n) em qualquer caso e é estável, mas precisa de memória extra proporcional ao tamanho da lista.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    steps: [
      'Se a lista tiver 0 ou 1 elemento, ela já está ordenada.',
      'Divida a lista em duas metades.',
      'Ordene cada metade recursivamente com o próprio merge sort.',
      'Intercale as duas metades: compare o primeiro elemento de cada uma e retire o menor, até acabarem.',
    ],
    usedIn: ['Timsort (Python, Java, V8)', 'Ordenação externa (arquivos maiores que a RAM)', 'Comando sort do Unix', 'Hadoop / MapReduce', 'Ordenação de listas ligadas'],
    realWorld: [
      { title: 'Arquivos maiores que a memória', text: 'Para ordenar 100 GB com 8 GB de RAM, o sistema ordena pedaços que cabem na memória, grava cada um em disco e depois intercala todos. É o que fazem bancos de dados e o comando sort do GNU.' },
      { title: 'Ordenação estável nas linguagens', text: 'O Timsort, híbrido de merge sort com insertion sort, é o sort padrão do Python, do Java (para objetos) e do V8. A estabilidade permite ordenar uma planilha por cidade e depois por estado mantendo as cidades em ordem dentro de cada estado.' },
      { title: 'Processamento distribuído', text: 'No MapReduce, cada máquina ordena sua parte dos dados e as partes ordenadas são intercaladas na fase de "shuffle and sort".' },
    ],
    curiosities: [
      'Foi inventado por John von Neumann em 1945.',
      'Nenhum algoritmo baseado só em comparações pode ser mais rápido que O(n log n) no pior caso — e o merge sort atinge esse limite.',
      'Paraleliza muito bem: as duas metades podem ser ordenadas ao mesmo tempo em processadores diferentes.',
    ],
    code: {
      python: String.raw`
        def merge_sort(arr):
            if len(arr) <= 1:
                return arr
            meio = len(arr) // 2
            esquerda = merge_sort(arr[:meio])
            direita = merge_sort(arr[meio:])
            return intercalar(esquerda, direita)

        def intercalar(a, b):
            resultado, i, j = [], 0, 0
            while i < len(a) and j < len(b):
                if a[i] <= b[j]:  # "<=" mantém o algoritmo estável
                    resultado.append(a[i])
                    i += 1
                else:
                    resultado.append(b[j])
                    j += 1
            resultado.extend(a[i:])
            resultado.extend(b[j:])
            return resultado

        print(merge_sort([38, 27, 43, 3, 9, 82, 10]))  # [3, 9, 10, 27, 38, 43, 82]
      `,
      javascript: String.raw`
        function mergeSort(arr) {
          if (arr.length <= 1) return arr;
          const meio = Math.floor(arr.length / 2);
          return intercalar(mergeSort(arr.slice(0, meio)), mergeSort(arr.slice(meio)));
        }

        function intercalar(a, b) {
          const resultado = [];
          let i = 0, j = 0;
          while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) resultado.push(a[i++]); // "<=" mantém o algoritmo estável
            else resultado.push(b[j++]);
          }
          return resultado.concat(a.slice(i), b.slice(j));
        }

        console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]).join(", ")); // 3, 9, 10, 27, 38, 43, 82
      `,
      java: String.raw`
        import java.util.Arrays;

        public class MergeSort {
            static void mergeSort(int[] arr, int ini, int fim) {
                if (ini >= fim) return;
                int meio = (ini + fim) / 2;
                mergeSort(arr, ini, meio);
                mergeSort(arr, meio + 1, fim);
                intercalar(arr, ini, meio, fim);
            }

            static void intercalar(int[] arr, int ini, int meio, int fim) {
                int[] tmp = new int[fim - ini + 1];
                int i = ini, j = meio + 1, k = 0;
                while (i <= meio && j <= fim)
                    tmp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++]; // "<=" mantém estável
                while (i <= meio) tmp[k++] = arr[i++];
                while (j <= fim) tmp[k++] = arr[j++];
                System.arraycopy(tmp, 0, arr, ini, tmp.length);
            }

            public static void main(String[] args) {
                int[] arr = {38, 27, 43, 3, 9, 82, 10};
                mergeSort(arr, 0, arr.length - 1);
                System.out.println(Arrays.toString(arr)); // [3, 9, 10, 27, 38, 43, 82]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void intercalar(vector<int>& arr, int ini, int meio, int fim) {
            vector<int> tmp;
            int i = ini, j = meio + 1;
            while (i <= meio && j <= fim)
                tmp.push_back(arr[i] <= arr[j] ? arr[i++] : arr[j++]); // "<=" mantém estável
            while (i <= meio) tmp.push_back(arr[i++]);
            while (j <= fim) tmp.push_back(arr[j++]);
            for (int k = 0; k < (int)tmp.size(); k++) arr[ini + k] = tmp[k];
        }

        void mergeSort(vector<int>& arr, int ini, int fim) {
            if (ini >= fim) return;
            int meio = (ini + fim) / 2;
            mergeSort(arr, ini, meio);
            mergeSort(arr, meio + 1, fim);
            intercalar(arr, ini, meio, fim);
        }

        int main() {
            vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
            mergeSort(arr, 0, arr.size() - 1);
            for (int x : arr) cout << x << " "; // 3 9 10 27 38 43 82
        }
      `,
    },
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Tony Hoare', 'Ano': '1959', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Escolhe um pivô, separa menores e maiores e ordena cada lado recursivamente.',
    description:
      'O Quick Sort escolhe um elemento como pivô e reorganiza a lista de forma que os menores fiquem à esquerda e os maiores à direita dele (partição). O pivô já fica na posição final, e o processo se repete em cada lado. Na média é O(n log n) e, na prática, costuma ser o algoritmo de comparação mais rápido, por acessar a memória de forma sequencial e trabalhar no próprio array.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    steps: [
      'Escolha um pivô (aqui, o último elemento; na prática, prefira um aleatório ou a mediana de três).',
      'Percorra o trecho movendo para a esquerda todos os elementos menores que o pivô.',
      'Coloque o pivô logo depois do último elemento menor: essa é sua posição final.',
      'Aplique o quick sort recursivamente à parte da esquerda e à da direita.',
    ],
    usedIn: ['std::sort do C++ (introsort)', 'Arrays.sort do Java para tipos primitivos', 'Go e Rust (pdqsort)', 'Quickselect (mediana, percentis)'],
    realWorld: [
      { title: 'Bibliotecas padrão', text: 'O std::sort do C++ usa introsort: um quicksort que troca para heapsort se a recursão ficar profunda demais e para insertion sort em trechos pequenos.' },
      { title: 'Percentis de monitoramento', text: 'A mesma partição, no algoritmo Quickselect, encontra a mediana ou o k-ésimo menor valor em O(n) na média — útil para calcular latências p95 e p99 em painéis de monitoramento.' },
      { title: 'Segurança', text: 'Com um pivô previsível, um atacante pode montar entradas que forçam o pior caso O(n²) (o ataque "McIlroy killer", de 1999). Por isso as implementações reais usam pivôs aleatórios ou estratégias defensivas.' },
    ],
    curiosities: [
      'Tony Hoare criou o algoritmo em 1959, quando era estudante em Moscou e precisava ordenar palavras para um projeto de tradução automática do russo para o inglês.',
      'Hoare também inventou a referência nula, que ele mesmo chamou, em 2009, de "o meu erro de um bilhão de dólares".',
      'Desde o Java 7, Arrays.sort para tipos primitivos usa o Dual-Pivot Quicksort de Vladimir Yaroslavskiy, que divide a lista em três partes usando dois pivôs.',
    ],
    code: {
      python: String.raw`
        def quick_sort(arr, ini=0, fim=None):
            if fim is None:
                fim = len(arr) - 1
            if ini < fim:
                p = particionar(arr, ini, fim)
                quick_sort(arr, ini, p - 1)
                quick_sort(arr, p + 1, fim)
            return arr

        def particionar(arr, ini, fim):
            pivo = arr[fim]
            i = ini  # próxima posição para um elemento menor que o pivô
            for j in range(ini, fim):
                if arr[j] < pivo:
                    arr[i], arr[j] = arr[j], arr[i]
                    i += 1
            arr[i], arr[fim] = arr[fim], arr[i]  # pivô vai para a posição final
            return i

        print(quick_sort([10, 7, 8, 9, 1, 5]))  # [1, 5, 7, 8, 9, 10]
      `,
      javascript: String.raw`
        function quickSort(arr, ini = 0, fim = arr.length - 1) {
          if (ini < fim) {
            const p = particionar(arr, ini, fim);
            quickSort(arr, ini, p - 1);
            quickSort(arr, p + 1, fim);
          }
          return arr;
        }

        function particionar(arr, ini, fim) {
          const pivo = arr[fim];
          let i = ini; // próxima posição para um elemento menor que o pivô
          for (let j = ini; j < fim; j++) {
            if (arr[j] < pivo) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
              i++;
            }
          }
          [arr[i], arr[fim]] = [arr[fim], arr[i]]; // pivô vai para a posição final
          return i;
        }

        console.log(quickSort([10, 7, 8, 9, 1, 5])); // [1, 5, 7, 8, 9, 10]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class QuickSort {
            static void quickSort(int[] arr, int ini, int fim) {
                if (ini < fim) {
                    int p = particionar(arr, ini, fim);
                    quickSort(arr, ini, p - 1);
                    quickSort(arr, p + 1, fim);
                }
            }

            static int particionar(int[] arr, int ini, int fim) {
                int pivo = arr[fim];
                int i = ini; // próxima posição para um elemento menor que o pivô
                for (int j = ini; j < fim; j++) {
                    if (arr[j] < pivo) {
                        int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                        i++;
                    }
                }
                int tmp = arr[i]; arr[i] = arr[fim]; arr[fim] = tmp; // pivô na posição final
                return i;
            }

            public static void main(String[] args) {
                int[] arr = {10, 7, 8, 9, 1, 5};
                quickSort(arr, 0, arr.length - 1);
                System.out.println(Arrays.toString(arr)); // [1, 5, 7, 8, 9, 10]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        int particionar(vector<int>& arr, int ini, int fim) {
            int pivo = arr[fim];
            int i = ini; // próxima posição para um elemento menor que o pivô
            for (int j = ini; j < fim; j++) {
                if (arr[j] < pivo) {
                    swap(arr[i], arr[j]);
                    i++;
                }
            }
            swap(arr[i], arr[fim]); // pivô vai para a posição final
            return i;
        }

        void quickSort(vector<int>& arr, int ini, int fim) {
            if (ini < fim) {
                int p = particionar(arr, ini, fim);
                quickSort(arr, ini, p - 1);
                quickSort(arr, p + 1, fim);
            }
        }

        int main() {
            vector<int> arr = {10, 7, 8, 9, 1, 5};
            quickSort(arr, 0, arr.size() - 1);
            for (int x : arr) cout << x << " "; // 1 5 7 8 9 10
        }
      `,
    },
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'J. W. J. Williams', 'Ano': '1964', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Monta um heap de máximo e retira o maior elemento repetidamente.',
    description:
      'O Heap Sort transforma a lista em um heap de máximo — uma árvore binária guardada no próprio array, em que cada pai é maior que seus filhos. O maior elemento fica sempre na raiz: basta trocá-lo com o último, encolher o heap e restaurar a propriedade. Garante O(n log n) no pior caso sem usar memória extra, embora costume ser mais lento que o quicksort na prática.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    steps: [
      'Transforme o array em um heap de máximo, "afundando" cada nó interno do último para o primeiro.',
      'Troque a raiz (o maior elemento) com o último elemento do heap.',
      'Diminua o tamanho do heap em 1: o último elemento já está na posição final.',
      'Afunde a nova raiz até restaurar a propriedade do heap.',
      'Repita até o heap ter um único elemento.',
    ],
    usedIn: ['Kernel Linux (lib/sort.c)', 'Introsort (plano B do std::sort)', 'Sistemas de tempo real', 'Filas de prioridade'],
    realWorld: [
      { title: 'Kernel Linux', text: 'A função sort() do kernel Linux usa heapsort: garante O(n log n) e não usa recursão nem memória extra — requisitos importantes dentro do kernel.' },
      { title: 'Tempo previsível', text: 'Sistemas de tempo real (aviação, controle industrial) preferem algoritmos cujo tempo máximo é garantido; o heapsort nunca degrada para O(n²).' },
      { title: 'Top-k em fluxos', text: 'A mesma estrutura de heap mantém os k maiores itens de um fluxo infinito — por exemplo, as 10 músicas mais tocadas na última hora.' },
    ],
    curiosities: [
      'Foi inventado por J. W. J. Williams em 1964, no mesmo artigo que apresentou o heap binário como estrutura de dados.',
      'No mesmo ano, Robert W. Floyd mostrou como construir o heap inicial em tempo O(n), em vez de O(n log n).',
      'Costuma perder para o quicksort na prática porque acessa posições distantes do array, o que aproveita mal o cache do processador.',
    ],
    code: {
      python: String.raw`
        def heap_sort(arr):
            n = len(arr)
            for i in range(n // 2 - 1, -1, -1):  # monta o heap de máximo
                afundar(arr, n, i)
            for fim in range(n - 1, 0, -1):
                arr[0], arr[fim] = arr[fim], arr[0]  # maior vai para o fim
                afundar(arr, fim, 0)
            return arr

        def afundar(arr, n, i):
            while True:
                maior = i
                esq, dir = 2 * i + 1, 2 * i + 2
                if esq < n and arr[esq] > arr[maior]:
                    maior = esq
                if dir < n and arr[dir] > arr[maior]:
                    maior = dir
                if maior == i:
                    return
                arr[i], arr[maior] = arr[maior], arr[i]
                i = maior

        print(heap_sort([12, 11, 13, 5, 6, 7]))  # [5, 6, 7, 11, 12, 13]
      `,
      javascript: String.raw`
        function heapSort(arr) {
          const n = arr.length;
          for (let i = Math.floor(n / 2) - 1; i >= 0; i--) afundar(arr, n, i); // monta o heap
          for (let fim = n - 1; fim > 0; fim--) {
            [arr[0], arr[fim]] = [arr[fim], arr[0]]; // maior vai para o fim
            afundar(arr, fim, 0);
          }
          return arr;
        }

        function afundar(arr, n, i) {
          while (true) {
            let maior = i;
            const esq = 2 * i + 1, dir = 2 * i + 2;
            if (esq < n && arr[esq] > arr[maior]) maior = esq;
            if (dir < n && arr[dir] > arr[maior]) maior = dir;
            if (maior === i) return;
            [arr[i], arr[maior]] = [arr[maior], arr[i]];
            i = maior;
          }
        }

        console.log(heapSort([12, 11, 13, 5, 6, 7])); // [5, 6, 7, 11, 12, 13]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class HeapSort {
            static void heapSort(int[] arr) {
                int n = arr.length;
                for (int i = n / 2 - 1; i >= 0; i--) afundar(arr, n, i); // monta o heap
                for (int fim = n - 1; fim > 0; fim--) {
                    int tmp = arr[0]; arr[0] = arr[fim]; arr[fim] = tmp; // maior vai para o fim
                    afundar(arr, fim, 0);
                }
            }

            static void afundar(int[] arr, int n, int i) {
                while (true) {
                    int maior = i, esq = 2 * i + 1, dir = 2 * i + 2;
                    if (esq < n && arr[esq] > arr[maior]) maior = esq;
                    if (dir < n && arr[dir] > arr[maior]) maior = dir;
                    if (maior == i) return;
                    int tmp = arr[i]; arr[i] = arr[maior]; arr[maior] = tmp;
                    i = maior;
                }
            }

            public static void main(String[] args) {
                int[] arr = {12, 11, 13, 5, 6, 7};
                heapSort(arr);
                System.out.println(Arrays.toString(arr)); // [5, 6, 7, 11, 12, 13]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        void afundar(vector<int>& arr, int n, int i) {
            while (true) {
                int maior = i, esq = 2 * i + 1, dir = 2 * i + 2;
                if (esq < n && arr[esq] > arr[maior]) maior = esq;
                if (dir < n && arr[dir] > arr[maior]) maior = dir;
                if (maior == i) return;
                swap(arr[i], arr[maior]);
                i = maior;
            }
        }

        void heapSort(vector<int>& arr) {
            int n = arr.size();
            for (int i = n / 2 - 1; i >= 0; i--) afundar(arr, n, i); // monta o heap
            for (int fim = n - 1; fim > 0; fim--) {
                swap(arr[0], arr[fim]); // maior vai para o fim
                afundar(arr, fim, 0);
            }
        }

        int main() {
            vector<int> arr = {12, 11, 13, 5, 6, 7};
            heapSort(arr);
            for (int x : arr) cout << x << " "; // 5 6 7 11 12 13
        }
      `,
    },
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Harold H. Seward', 'Ano': '1954', 'Estável': 'Sim', 'In-place': 'Não' },
    summary: 'Conta quantas vezes cada valor aparece e reconstrói a lista em ordem.',
    description:
      'O Counting Sort (também chamado de "count sort") não compara elementos entre si. Ele cria um contador para cada valor possível, conta quantas vezes cada um aparece e depois escreve os valores em ordem, repetindo cada um pelo número de ocorrências. É linear quando o intervalo de valores (k) não é muito maior que a quantidade de elementos (n).',
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(n + k)' },
    steps: [
      'Encontre o maior valor da lista (k).',
      'Crie um array de contadores de tamanho k + 1, todos zerados.',
      'Percorra a lista somando 1 no contador de cada valor.',
      'Percorra os contadores em ordem e escreva cada valor tantas vezes quanto foi contado.',
    ],
    usedIn: ['Radix sort', 'Valores de pixel (0–255)', 'Histogramas', 'Notas, idades e outras chaves pequenas', 'Bioinformática (bases A, C, G, T)'],
    realWorld: [
      { title: 'Histograma de imagens', text: 'Cada pixel tem um valor de 0 a 255. Contar as ocorrências de cada valor é a base da equalização de histograma usada em editores de foto para corrigir contraste.' },
      { title: 'Notas de provas', text: 'Ordenar as notas inteiras (de 0 a 100) de milhões de estudantes leva tempo linear, sem nenhuma comparação.' },
      { title: 'Base do radix sort', text: 'O radix sort aplica um counting sort estável a cada dígito, o que permite ordenar números grandes sem precisar de um contador para cada valor possível.' },
    ],
    curiosities: [
      'Foi descrito por Harold H. Seward em 1954, no MIT, no mesmo trabalho que também apresentou o radix sort.',
      'Como não faz comparações, ele não está sujeito ao limite mínimo de Ω(n log n) dos algoritmos comparativos.',
      'Fica impraticável quando o intervalo de valores é enorme: ordenar 10 números entre 0 e 1 bilhão exigiria 1 bilhão de contadores.',
    ],
    code: {
      python: String.raw`
        def counting_sort(arr):
            if not arr:
                return arr
            contagem = [0] * (max(arr) + 1)
            for x in arr:
                contagem[x] += 1
            resultado = []
            for valor, qtd in enumerate(contagem):
                resultado.extend([valor] * qtd)
            return resultado

        print(counting_sort([4, 2, 2, 8, 3, 3, 1]))  # [1, 2, 2, 3, 3, 4, 8]
      `,
      javascript: String.raw`
        function countingSort(arr) {
          if (arr.length === 0) return arr;
          const contagem = new Array(Math.max(...arr) + 1).fill(0);
          for (const x of arr) contagem[x]++;
          const resultado = [];
          contagem.forEach((qtd, valor) => {
            for (let i = 0; i < qtd; i++) resultado.push(valor);
          });
          return resultado;
        }

        console.log(countingSort([4, 2, 2, 8, 3, 3, 1])); // [1, 2, 2, 3, 3, 4, 8]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class CountingSort {
            static int[] countingSort(int[] arr) {
                int max = Arrays.stream(arr).max().orElse(0);
                int[] contagem = new int[max + 1];
                for (int x : arr) contagem[x]++;
                int[] resultado = new int[arr.length];
                int k = 0;
                for (int valor = 0; valor <= max; valor++)
                    for (int q = 0; q < contagem[valor]; q++) resultado[k++] = valor;
                return resultado;
            }

            public static void main(String[] args) {
                int[] arr = {4, 2, 2, 8, 3, 3, 1};
                System.out.println(Arrays.toString(countingSort(arr))); // [1, 2, 2, 3, 3, 4, 8]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <vector>
        using namespace std;

        vector<int> countingSort(const vector<int>& arr) {
            if (arr.empty()) return arr;
            int max = *max_element(arr.begin(), arr.end());
            vector<int> contagem(max + 1, 0);
            for (int x : arr) contagem[x]++;
            vector<int> resultado;
            for (int valor = 0; valor <= max; valor++)
                resultado.insert(resultado.end(), contagem[valor], valor);
            return resultado;
        }

        int main() {
            vector<int> arr = {4, 2, 2, 8, 3, 3, 1};
            for (int x : countingSort(arr)) cout << x << " "; // 1 2 2 3 3 4 8
        }
      `,
    },
  },
  {
    id: 'pigeonhole-sort',
    name: 'Pigeonhole Sort',
    difficulty: 'Intermediário',
    facts: { 'Baseado em': 'Princípio da casa dos pombos', 'Estável': 'Sim', 'In-place': 'Não' },
    summary: 'Coloca cada item na sua "casa de pombo" pela chave e recolhe todas as casas em ordem.',
    description:
      'O Pigeonhole Sort cria uma "casa" para cada valor de chave possível, coloca cada item na casa correspondente e depois recolhe os itens percorrendo as casas em ordem. Parece o counting sort, mas guarda os próprios itens, não só contagens — por isso consegue ordenar registros (como pessoas por idade) mantendo a ordem original dos empates.',
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(n + k)' },
    steps: [
      'Encontre a menor e a maior chave; o número de casas é maior − menor + 1.',
      'Crie uma lista vazia (casa) para cada chave possível.',
      'Coloque cada item na casa da sua chave.',
      'Percorra as casas em ordem e junte todos os itens.',
    ],
    usedIn: ['Triagem de correspondência', 'Agrupar registros por chave pequena', 'Ordenar por idade, andar, mês', 'Ensino de algoritmos não comparativos'],
    realWorld: [
      { title: 'Triagem nos Correios', text: 'O carteiro coloca cada carta no escaninho da sua rua e depois recolhe os escaninhos em ordem de rota. O nome "pigeonhole" vem justamente desses escaninhos.' },
      { title: 'Cadastro por idade', text: 'Agrupar clientes por idade (de 18 a 100 anos) para uma campanha: cada idade é uma casa, e quem tem a mesma idade continua na ordem original do cadastro.' },
      { title: 'Chamadas por andar', text: 'Um elevador que atende pedidos pode agrupá-los por andar e percorrer os andares em sequência.' },
    ],
    curiosities: [
      'O nome vem do princípio da casa dos pombos, formulado por Dirichlet em 1834: se há mais pombos que casas, alguma casa terá mais de um pombo.',
      'Só é eficiente quando a quantidade de itens e o número de chaves possíveis são parecidos.',
      'Quando o bucket sort usa um balde para cada valor possível, ele vira exatamente um pigeonhole sort.',
    ],
    code: {
      python: String.raw`
        def pigeonhole_sort(itens, chave):
            if not itens:
                return itens
            menor = min(chave(x) for x in itens)
            maior = max(chave(x) for x in itens)
            casas = [[] for _ in range(maior - menor + 1)]
            for x in itens:
                casas[chave(x) - menor].append(x)
            return [x for casa in casas for x in casa]

        pessoas = [("Ana", 31), ("Bruno", 25), ("Carla", 31), ("Davi", 22)]
        print(pigeonhole_sort(pessoas, chave=lambda p: p[1]))
        # [('Davi', 22), ('Bruno', 25), ('Ana', 31), ('Carla', 31)]
      `,
      javascript: String.raw`
        function pigeonholeSort(itens, chave) {
          if (itens.length === 0) return itens;
          const chaves = itens.map(chave);
          const menor = Math.min(...chaves);
          const casas = Array.from({ length: Math.max(...chaves) - menor + 1 }, () => []);
          for (const x of itens) casas[chave(x) - menor].push(x);
          return casas.flat();
        }

        const pessoas = [
          { nome: "Ana", idade: 31 }, { nome: "Bruno", idade: 25 },
          { nome: "Carla", idade: 31 }, { nome: "Davi", idade: 22 },
        ];
        const ordenado = pigeonholeSort(pessoas, p => p.idade);
        console.log(ordenado.map(p => p.nome + " (" + p.idade + ")").join(", "));
        // Davi (22), Bruno (25), Ana (31), Carla (31)
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class PigeonholeSort {
            record Pessoa(String nome, int idade) {}

            static List<Pessoa> pigeonholeSort(List<Pessoa> itens) {
                int menor = Integer.MAX_VALUE, maior = Integer.MIN_VALUE;
                for (Pessoa p : itens) {
                    menor = Math.min(menor, p.idade());
                    maior = Math.max(maior, p.idade());
                }
                List<List<Pessoa>> casas = new ArrayList<>();
                for (int i = 0; i <= maior - menor; i++) casas.add(new ArrayList<>());
                for (Pessoa p : itens) casas.get(p.idade() - menor).add(p);

                List<Pessoa> resultado = new ArrayList<>();
                for (List<Pessoa> casa : casas) resultado.addAll(casa);
                return resultado;
            }

            public static void main(String[] args) {
                List<Pessoa> pessoas = List.of(new Pessoa("Ana", 31), new Pessoa("Bruno", 25),
                                               new Pessoa("Carla", 31), new Pessoa("Davi", 22));
                for (Pessoa p : pigeonholeSort(pessoas))
                    System.out.print(p.nome() + " (" + p.idade() + ") ");
                // Davi (22) Bruno (25) Ana (31) Carla (31)
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <string>
        #include <vector>
        using namespace std;

        struct Pessoa { string nome; int idade; };

        vector<Pessoa> pigeonholeSort(const vector<Pessoa>& itens) {
            if (itens.empty()) return itens;
            auto [mn, mx] = minmax_element(itens.begin(), itens.end(),
                [](const Pessoa& a, const Pessoa& b) { return a.idade < b.idade; });
            int menor = mn->idade, maior = mx->idade;
            vector<vector<Pessoa>> casas(maior - menor + 1);
            for (const Pessoa& p : itens) casas[p.idade - menor].push_back(p);

            vector<Pessoa> resultado;
            for (auto& casa : casas) resultado.insert(resultado.end(), casa.begin(), casa.end());
            return resultado;
        }

        int main() {
            vector<Pessoa> pessoas = {{"Ana", 31}, {"Bruno", 25}, {"Carla", 31}, {"Davi", 22}};
            for (const Pessoa& p : pigeonholeSort(pessoas))
                cout << p.nome << " (" << p.idade << ") "; // Davi (22) Bruno (25) Ana (31) Carla (31)
        }
      `,
    },
  },
  {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    difficulty: 'Intermediário',
    facts: { 'Criado por': 'Método clássico', 'Estável': 'Depende do algoritmo interno', 'In-place': 'Não' },
    summary: 'Distribui os valores em baldes por faixa, ordena cada balde e junta tudo.',
    description:
      'O Bucket Sort divide o intervalo de valores em faixas (baldes), distribui cada elemento no balde da sua faixa, ordena cada balde separadamente e concatena os baldes em ordem. Quando os dados estão bem distribuídos, cada balde fica com poucos elementos e o tempo total é praticamente linear.',
    complexity: { best: 'O(n + k)', average: 'O(n + n²/k + k)', worst: 'O(n²)', space: 'O(n + k)' },
    steps: [
      'Crie k baldes vazios, cada um responsável por uma faixa de valores.',
      'Coloque cada elemento no balde da sua faixa (aqui, para valores entre 0 e 1: balde = ⌊valor × k⌋).',
      'Ordene cada balde individualmente (com insertion sort ou qualquer outro algoritmo).',
      'Concatene os baldes, do primeiro ao último.',
    ],
    usedIn: ['Dados uniformemente distribuídos', 'Ordenação distribuída (TeraSort / Hadoop)', 'Números de ponto flutuante em [0, 1)', 'Computação paralela'],
    realWorld: [
      { title: 'Ordenar 1 TB em um cluster', text: 'O TeraSort, benchmark clássico do Hadoop, é essencialmente um bucket sort distribuído: cada máquina recebe uma faixa de chaves, ordena sua parte e o resultado final é a concatenação.' },
      { title: 'Faixas de preço', text: 'Uma loja que exibe produtos por preço pode separá-los em faixas (até R$ 50, R$ 50–100…) e ordenar só dentro de cada faixa.' },
      { title: 'Valores aleatórios', text: 'Ordenar milhões de números gerados uniformemente entre 0 e 1 (comuns em simulações de Monte Carlo) fica praticamente linear.' },
    ],
    curiosities: [
      'O desempenho depende totalmente da distribuição dos dados: se todos caírem no mesmo balde, o algoritmo vira o que é usado dentro do balde (O(n²) com insertion sort).',
      'Com um balde por valor possível, o bucket sort vira o pigeonhole sort.',
      'Baldes independentes podem ser ordenados em paralelo, o que o torna natural para GPUs e clusters.',
    ],
    code: {
      python: String.raw`
        def bucket_sort(arr, num_baldes=5):
            baldes = [[] for _ in range(num_baldes)]
            for x in arr:  # valores em [0, 1)
                baldes[int(x * num_baldes)].append(x)
            resultado = []
            for balde in baldes:
                resultado.extend(sorted(balde))  # baldes são pequenos: qualquer algoritmo serve
            return resultado

        print(bucket_sort([0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]))
        # [0.23, 0.25, 0.32, 0.42, 0.47, 0.51, 0.52]
      `,
      javascript: String.raw`
        function bucketSort(arr, numBaldes = 5) {
          const baldes = Array.from({ length: numBaldes }, () => []);
          for (const x of arr) baldes[Math.floor(x * numBaldes)].push(x); // valores em [0, 1)
          // baldes são pequenos: qualquer algoritmo serve
          return baldes.flatMap(balde => balde.sort((a, b) => a - b));
        }

        console.log(bucketSort([0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]).join(", "));
        // 0.23, 0.25, 0.32, 0.42, 0.47, 0.51, 0.52
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.Collections;
        import java.util.List;

        public class BucketSort {
            static void bucketSort(double[] arr, int numBaldes) {
                List<List<Double>> baldes = new ArrayList<>();
                for (int i = 0; i < numBaldes; i++) baldes.add(new ArrayList<>());
                for (double x : arr) baldes.get((int) (x * numBaldes)).add(x); // valores em [0, 1)

                int k = 0;
                for (List<Double> balde : baldes) {
                    Collections.sort(balde); // baldes são pequenos: qualquer algoritmo serve
                    for (double x : balde) arr[k++] = x;
                }
            }

            public static void main(String[] args) {
                double[] arr = {0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51};
                bucketSort(arr, 5);
                System.out.println(Arrays.toString(arr)); // [0.23, 0.25, 0.32, 0.42, 0.47, 0.51, 0.52]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <vector>
        using namespace std;

        void bucketSort(vector<double>& arr, int numBaldes) {
            vector<vector<double>> baldes(numBaldes);
            for (double x : arr) baldes[(int)(x * numBaldes)].push_back(x); // valores em [0, 1)

            int k = 0;
            for (auto& balde : baldes) {
                sort(balde.begin(), balde.end()); // baldes são pequenos: qualquer algoritmo serve
                for (double x : balde) arr[k++] = x;
            }
        }

        int main() {
            vector<double> arr = {0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51};
            bucketSort(arr, 5);
            for (double x : arr) cout << x << " "; // 0.23 0.25 0.32 0.42 0.47 0.51 0.52
        }
      `,
    },
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    difficulty: 'Intermediário',
    facts: { 'Origem': 'Herman Hollerith', 'Ano': '1887', 'Estável': 'Sim (LSD)', 'In-place': 'Não' },
    summary: 'Ordena dígito a dígito, do menos significativo ao mais significativo.',
    description:
      'O Radix Sort ordena números (ou strings) olhando um dígito por vez. Na versão LSD, começa pelo dígito das unidades e aplica uma ordenação estável (como o counting sort) a cada posição: unidades, dezenas, centenas… Como cada passada preserva a ordem da anterior, ao final a lista está totalmente ordenada — sem nenhuma comparação entre elementos.',
    complexity: { best: 'O(d · (n + b))', average: 'O(d · (n + b))', worst: 'O(d · (n + b))', space: 'O(n + b)' },
    steps: [
      'Encontre o maior número para saber quantos dígitos (d) existem.',
      'Ordene a lista de forma estável usando apenas o dígito das unidades.',
      'Repita para o dígito das dezenas, depois centenas, e assim por diante.',
      'Depois de processar o dígito mais significativo, a lista está ordenada.',
    ],
    usedIn: ['Ordenação em GPUs (CUB, Thrust)', 'Chaves de tamanho fixo (CPF, CEP, datas)', 'Construção de suffix arrays', 'Ordenação de inteiros em bancos de dados'],
    realWorld: [
      { title: 'Placas de vídeo', text: 'Bibliotecas como CUB e Thrust, da NVIDIA, usam radix sort para ordenar bilhões de chaves numéricas por segundo, porque ele paraleliza muito bem.' },
      { title: 'Documentos com formato fixo', text: 'CPFs, CEPs e datas no formato AAAAMMDD têm sempre o mesmo número de dígitos e podem ser ordenados em tempo linear.' },
      { title: 'Cartões perfurados', text: 'As máquinas classificadoras de cartões perfurados ordenavam pilhas de cartões uma coluna por vez — exatamente um radix sort mecânico.' },
    ],
    curiosities: [
      'É um dos algoritmos mais antigos da computação: remonta às máquinas tabuladoras de Herman Hollerith, usadas no censo dos Estados Unidos de 1890.',
      'A empresa fundada por Hollerith, depois de algumas fusões, passou a se chamar IBM em 1924.',
      'A versão LSD começa pelo dígito menos significativo; a versão MSD começa pelo mais significativo e é a preferida para ordenar strings.',
    ],
    code: {
      python: String.raw`
        def radix_sort(arr):
            exp = 1
            while arr and max(arr) // exp > 0:
                # distribuição estável pelo dígito atual (unidades, dezenas, ...)
                baldes = [[] for _ in range(10)]
                for x in arr:
                    baldes[(x // exp) % 10].append(x)
                arr = [x for balde in baldes for x in balde]
                exp *= 10
            return arr

        print(radix_sort([170, 45, 75, 90, 802, 24, 2, 66]))  # [2, 24, 45, 66, 75, 90, 170, 802]
      `,
      javascript: String.raw`
        function radixSort(arr) {
          const max = Math.max(...arr);
          for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            // counting sort estável pelo dígito atual
            const contagem = new Array(10).fill(0);
            const saida = new Array(arr.length);
            for (const x of arr) contagem[Math.floor(x / exp) % 10]++;
            for (let d = 1; d < 10; d++) contagem[d] += contagem[d - 1]; // posições finais
            for (let i = arr.length - 1; i >= 0; i--) { // de trás para frente: estável
              const d = Math.floor(arr[i] / exp) % 10;
              saida[--contagem[d]] = arr[i];
            }
            arr = saida;
          }
          return arr;
        }

        console.log(radixSort([170, 45, 75, 90, 802, 24, 2, 66]).join(", "));
        // 2, 24, 45, 66, 75, 90, 170, 802
      `,
      java: String.raw`
        import java.util.Arrays;

        public class RadixSort {
            static void radixSort(int[] arr) {
                int max = Arrays.stream(arr).max().orElse(0);
                for (int exp = 1; max / exp > 0; exp *= 10) {
                    // counting sort estável pelo dígito atual
                    int[] contagem = new int[10];
                    int[] saida = new int[arr.length];
                    for (int x : arr) contagem[(x / exp) % 10]++;
                    for (int d = 1; d < 10; d++) contagem[d] += contagem[d - 1]; // posições finais
                    for (int i = arr.length - 1; i >= 0; i--) // de trás para frente: estável
                        saida[--contagem[(arr[i] / exp) % 10]] = arr[i];
                    System.arraycopy(saida, 0, arr, 0, arr.length);
                }
            }

            public static void main(String[] args) {
                int[] arr = {170, 45, 75, 90, 802, 24, 2, 66};
                radixSort(arr);
                System.out.println(Arrays.toString(arr)); // [2, 24, 45, 66, 75, 90, 170, 802]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <vector>
        using namespace std;

        void radixSort(vector<int>& arr) {
            if (arr.empty()) return;
            int max = *max_element(arr.begin(), arr.end());
            for (int exp = 1; max / exp > 0; exp *= 10) {
                // counting sort estável pelo dígito atual
                vector<int> contagem(10, 0), saida(arr.size());
                for (int x : arr) contagem[(x / exp) % 10]++;
                for (int d = 1; d < 10; d++) contagem[d] += contagem[d - 1]; // posições finais
                for (int i = arr.size() - 1; i >= 0; i--) // de trás para frente: estável
                    saida[--contagem[(arr[i] / exp) % 10]] = arr[i];
                arr = saida;
            }
        }

        int main() {
            vector<int> arr = {170, 45, 75, 90, 802, 24, 2, 66};
            radixSort(arr);
            for (int x : arr) cout << x << " "; // 2 24 45 66 75 90 170 802
        }
      `,
    },
  },
  {
    id: 'pancake-sort',
    name: 'Pancake Sort',
    difficulty: 'Intermediário',
    facts: { 'Problema proposto por': 'Jacob E. Goodman', 'Ano': '1975', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Ordena usando só "viradas de espátula": inverter o início da lista.',
    description:
      'Imagine uma pilha de panquecas de tamanhos diferentes e uma espátula: a única operação permitida é enfiar a espátula em algum ponto e virar todas as panquecas acima dela. O Pancake Sort ordena a pilha assim: leva a maior panqueca para o topo com uma virada e depois a leva para o fundo com outra, repetindo com a pilha restante. O interessante aqui não é o tempo, mas o número de viradas — no máximo 2n − 3.',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    steps: [
      'Considere a pilha inteira (os primeiros "tamanho" elementos).',
      'Encontre a posição do maior elemento dentro dela.',
      'Vire do topo até essa posição: o maior vai para o topo (início da lista).',
      'Vire a pilha inteira: o maior vai para o fundo, sua posição final.',
      'Diminua o tamanho em 1 e repita até sobrar uma panqueca.',
    ],
    usedIn: ['Bioinformática (rearranjo de genomas)', 'Topologia de redes (pancake graph)', 'Teoria da computação', 'Quebra-cabeças'],
    realWorld: [
      { title: 'Evolução de genomas', text: 'Mutações podem inverter trechos inteiros de DNA. Biólogos modelam esses rearranjos como viradas de panqueca para estimar a distância evolutiva entre espécies (a variante "burnt pancake" considera também a orientação de cada trecho).' },
      { title: 'Redes de processadores', text: 'O "pancake graph", cujos vértices são permutações ligadas por viradas, é estudado como topologia para conectar processadores em computadores paralelos, por ter diâmetro pequeno.' },
      { title: 'Robôs e operações restritas', text: 'É um modelo para problemas em que só um tipo de movimento é permitido — como um braço robótico que só consegue inverter o topo de uma pilha.' },
    ],
    curiosities: [
      'O problema foi proposto em 1975 por Jacob E. Goodman, sob o pseudônimo "Harry Dweighter" — trocadilho com "harried waiter" (garçom apressado).',
      'Bill Gates, ainda estudante de Harvard, publicou em 1979 com Christos Papadimitriou um artigo sobre esse problema, provando um limite de (5n + 5)/3 viradas. É o único artigo científico de Gates.',
      'Descobrir o número mínimo de viradas para ordenar uma pilha qualquer é NP-difícil — isso só foi provado em 2011.',
    ],
    code: {
      python: String.raw`
        def virar(arr, k):
            arr[:k + 1] = reversed(arr[:k + 1])  # inverte arr[0..k]

        def pancake_sort(arr):
            for tamanho in range(len(arr), 1, -1):
                maior = max(range(tamanho), key=lambda i: arr[i])
                if maior != tamanho - 1:
                    virar(arr, maior)        # leva o maior para o topo
                    virar(arr, tamanho - 1)  # e do topo para o fundo
            return arr

        print(pancake_sort([3, 6, 1, 10, 2]))  # [1, 2, 3, 6, 10]
      `,
      javascript: String.raw`
        function virar(arr, k) { // inverte arr[0..k]
          for (let i = 0, j = k; i < j; i++, j--) [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        function pancakeSort(arr) {
          for (let tamanho = arr.length; tamanho > 1; tamanho--) {
            let maior = 0;
            for (let i = 1; i < tamanho; i++) if (arr[i] > arr[maior]) maior = i;
            if (maior !== tamanho - 1) {
              virar(arr, maior);       // leva o maior para o topo
              virar(arr, tamanho - 1); // e do topo para o fundo
            }
          }
          return arr;
        }

        console.log(pancakeSort([3, 6, 1, 10, 2])); // [1, 2, 3, 6, 10]
      `,
      java: String.raw`
        import java.util.Arrays;

        public class PancakeSort {
            static void virar(int[] arr, int k) { // inverte arr[0..k]
                for (int i = 0, j = k; i < j; i++, j--) {
                    int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                }
            }

            static void pancakeSort(int[] arr) {
                for (int tamanho = arr.length; tamanho > 1; tamanho--) {
                    int maior = 0;
                    for (int i = 1; i < tamanho; i++) if (arr[i] > arr[maior]) maior = i;
                    if (maior != tamanho - 1) {
                        virar(arr, maior);       // leva o maior para o topo
                        virar(arr, tamanho - 1); // e do topo para o fundo
                    }
                }
            }

            public static void main(String[] args) {
                int[] arr = {3, 6, 1, 10, 2};
                pancakeSort(arr);
                System.out.println(Arrays.toString(arr)); // [1, 2, 3, 6, 10]
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        #include <vector>
        using namespace std;

        void virar(vector<int>& arr, int k) { // inverte arr[0..k]
            reverse(arr.begin(), arr.begin() + k + 1);
        }

        void pancakeSort(vector<int>& arr) {
            for (int tamanho = arr.size(); tamanho > 1; tamanho--) {
                int maior = max_element(arr.begin(), arr.begin() + tamanho) - arr.begin();
                if (maior != tamanho - 1) {
                    virar(arr, maior);       // leva o maior para o topo
                    virar(arr, tamanho - 1); // e do topo para o fundo
                }
            }
        }

        int main() {
            vector<int> arr = {3, 6, 1, 10, 2};
            pancakeSort(arr);
            for (int x : arr) cout << x << " "; // 1 2 3 6 10
        }
      `,
    },
  },
  {
    id: 'smoothsort',
    name: 'Smoothsort',
    difficulty: 'Avançado',
    facts: { 'Criado por': 'Edsger W. Dijkstra', 'Ano': '1981', 'Estável': 'Não', 'In-place': 'Sim' },
    summary: 'Variação do heapsort com heaps de Leonardo: chega a O(n) em dados quase ordenados.',
    description:
      'Criado por Edsger Dijkstra em 1981, o Smoothsort é uma variação do heapsort que, em vez de um único heap, mantém uma floresta de "heaps de Leonardo" — árvores cujos tamanhos são números de Leonardo (1, 1, 3, 5, 9, 15, 25…). Ele preserva a garantia O(n log n) do heapsort, mas se aproxima de O(n) quando a entrada já está quase ordenada: a transição entre os dois casos é "suave", daí o nome.',
    complexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)*' },
    steps: [
      'Percorra a lista da esquerda para a direita, adicionando cada elemento à floresta de heaps de Leonardo.',
      'Se as duas últimas árvores têm ordens consecutivas (k+1 e k), o novo elemento vira a raiz que as une em uma árvore de ordem k+2; senão, ele vira uma nova árvore de tamanho 1.',
      'Mantenha as raízes das árvores em ordem crescente da esquerda para a direita: a raiz mais à direita é sempre o maior elemento.',
      'Na fase de remoção, o maior elemento (última raiz) já está na posição final; ao removê-lo, seus dois filhos viram raízes e a ordem entre as raízes é restaurada.',
      'Repita até a floresta ficar vazia.',
    ],
    usedIn: ['Dados quase ordenados', 'Ambientes com memória O(1)', 'Pesquisa em algoritmos adaptativos', 'Ensino de estruturas avançadas'],
    realWorld: [
      { title: 'Logs quase em ordem', text: 'Registros que chegam quase sempre em ordem de horário (com poucos atrasados) são ordenados em tempo próximo do linear, sem memória extra.' },
      { title: 'Garantia + adaptação', text: 'Para sistemas que precisam do pior caso garantido do heapsort, mas recebem frequentemente dados já organizados, ele oferece o melhor dos dois mundos.' },
      { title: 'Estudo de algoritmos adaptativos', text: 'É referência no estudo de algoritmos que ficam mais rápidos quanto mais ordenada a entrada — a mesma ideia que levou ao Timsort.' },
    ],
    curiosities: [
      'Dijkstra o publicou no manuscrito EWD 796a, parte da sua famosa série de notas escritas à mão.',
      'Os números de Leonardo seguem L(k) = L(k−1) + L(k−2) + 1 e se relacionam com Fibonacci: L(k) = 2·F(k+1) − 1.',
      'Apesar de elegante, é raro em bibliotecas: é difícil de implementar e não é estável. *Esta versão didática guarda as ordens das árvores em uma lista (O(log n) de memória); a original usa um vetor de bits.',
    ],
    code: {
      python: String.raw`
        def smoothsort(arr):
            n = len(arr)
            L = [1, 1]  # números de Leonardo
            while L[-1] < n:
                L.append(L[-1] + L[-2] + 1)

            def afundar(raiz, k):
                # restaura o heap de Leonardo de ordem k com raiz em "raiz"
                while k >= 2:
                    dir_, esq = raiz - 1, raiz - 1 - L[k - 2]
                    if arr[esq] >= arr[dir_]:
                        filho, k_filho = esq, k - 1
                    else:
                        filho, k_filho = dir_, k - 2
                    if arr[raiz] >= arr[filho]:
                        break
                    arr[raiz], arr[filho] = arr[filho], arr[raiz]
                    raiz, k = filho, k_filho

            def retificar(raiz, ordens, t):
                # leva a raiz para a esquerda até as raízes ficarem em ordem crescente
                while t > 0:
                    k = ordens[t]
                    anterior = raiz - L[k]
                    if arr[anterior] <= arr[raiz]:
                        break
                    if k >= 2 and (arr[anterior] <= arr[raiz - 1] or arr[anterior] <= arr[raiz - 1 - L[k - 2]]):
                        break
                    arr[anterior], arr[raiz] = arr[raiz], arr[anterior]
                    raiz, t = anterior, t - 1
                afundar(raiz, ordens[t])

            ordens = []  # ordem de cada árvore da floresta, da esquerda para a direita
            for i in range(n):
                if len(ordens) >= 2 and ordens[-2] == ordens[-1] + 1:
                    ordens.pop()
                    ordens[-1] += 1  # une as duas últimas árvores sob o novo elemento
                elif ordens and ordens[-1] == 1:
                    ordens.append(0)
                else:
                    ordens.append(1)
                retificar(i, ordens, len(ordens) - 1)

            for i in range(n - 1, 0, -1):
                k = ordens.pop()  # arr[i] é o maior: já está no lugar
                if k >= 2:  # os dois filhos viram raízes
                    ordens.append(k - 1)
                    retificar(i - 1 - L[k - 2], ordens, len(ordens) - 1)
                    ordens.append(k - 2)
                    retificar(i - 1, ordens, len(ordens) - 1)
            return arr

        print(smoothsort([9, 3, 7, 1, 8, 2, 6, 4, 5]))  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
      `,
      javascript: String.raw`
        function smoothsort(arr) {
          const n = arr.length;
          const L = [1, 1]; // números de Leonardo
          while (L[L.length - 1] < n) L.push(L[L.length - 1] + L[L.length - 2] + 1);
          const troca = (i, j) => { [arr[i], arr[j]] = [arr[j], arr[i]]; };

          // restaura o heap de Leonardo de ordem k com raiz em "raiz"
          function afundar(raiz, k) {
            while (k >= 2) {
              const dir = raiz - 1, esq = raiz - 1 - L[k - 2];
              const [filho, kFilho] = arr[esq] >= arr[dir] ? [esq, k - 1] : [dir, k - 2];
              if (arr[raiz] >= arr[filho]) break;
              troca(raiz, filho);
              raiz = filho;
              k = kFilho;
            }
          }

          // leva a raiz para a esquerda até as raízes ficarem em ordem crescente
          function retificar(raiz, ordens, t) {
            while (t > 0) {
              const k = ordens[t];
              const anterior = raiz - L[k];
              if (arr[anterior] <= arr[raiz]) break;
              if (k >= 2 && (arr[anterior] <= arr[raiz - 1] || arr[anterior] <= arr[raiz - 1 - L[k - 2]])) break;
              troca(anterior, raiz);
              raiz = anterior;
              t--;
            }
            afundar(raiz, ordens[t]);
          }

          const ordens = []; // ordem de cada árvore da floresta, da esquerda para a direita
          for (let i = 0; i < n; i++) {
            const m = ordens.length;
            if (m >= 2 && ordens[m - 2] === ordens[m - 1] + 1) {
              ordens.pop();
              ordens[m - 2]++; // une as duas últimas árvores sob o novo elemento
            } else if (m > 0 && ordens[m - 1] === 1) {
              ordens.push(0);
            } else {
              ordens.push(1);
            }
            retificar(i, ordens, ordens.length - 1);
          }

          for (let i = n - 1; i > 0; i--) {
            const k = ordens.pop(); // arr[i] é o maior: já está no lugar
            if (k >= 2) { // os dois filhos viram raízes
              ordens.push(k - 1);
              retificar(i - 1 - L[k - 2], ordens, ordens.length - 1);
              ordens.push(k - 2);
              retificar(i - 1, ordens, ordens.length - 1);
            }
          }
          return arr;
        }

        console.log(smoothsort([9, 3, 7, 1, 8, 2, 6, 4, 5]).join(", ")); // 1, 2, 3, 4, 5, 6, 7, 8, 9
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;

        public class Smoothsort {
            static int[] arr;
            static List<Integer> L = new ArrayList<>(List.of(1, 1)); // números de Leonardo

            static void troca(int i, int j) { int t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

            // restaura o heap de Leonardo de ordem k com raiz em "raiz"
            static void afundar(int raiz, int k) {
                while (k >= 2) {
                    int dir = raiz - 1, esq = raiz - 1 - L.get(k - 2);
                    int filho = arr[esq] >= arr[dir] ? esq : dir;
                    int kFilho = filho == esq ? k - 1 : k - 2;
                    if (arr[raiz] >= arr[filho]) break;
                    troca(raiz, filho);
                    raiz = filho;
                    k = kFilho;
                }
            }

            // leva a raiz para a esquerda até as raízes ficarem em ordem crescente
            static void retificar(int raiz, List<Integer> ordens, int t) {
                while (t > 0) {
                    int k = ordens.get(t);
                    int anterior = raiz - L.get(k);
                    if (arr[anterior] <= arr[raiz]) break;
                    if (k >= 2 && (arr[anterior] <= arr[raiz - 1] || arr[anterior] <= arr[raiz - 1 - L.get(k - 2)])) break;
                    troca(anterior, raiz);
                    raiz = anterior;
                    t--;
                }
                afundar(raiz, ordens.get(t));
            }

            static void smoothsort(int[] a) {
                arr = a;
                int n = a.length;
                while (L.get(L.size() - 1) < n) L.add(L.get(L.size() - 1) + L.get(L.size() - 2) + 1);

                List<Integer> ordens = new ArrayList<>(); // ordem de cada árvore da floresta
                for (int i = 0; i < n; i++) {
                    int m = ordens.size();
                    if (m >= 2 && ordens.get(m - 2) == ordens.get(m - 1) + 1) {
                        ordens.remove(m - 1);
                        ordens.set(m - 2, ordens.get(m - 2) + 1); // une as duas últimas árvores
                    } else if (m > 0 && ordens.get(m - 1) == 1) {
                        ordens.add(0);
                    } else {
                        ordens.add(1);
                    }
                    retificar(i, ordens, ordens.size() - 1);
                }

                for (int i = n - 1; i > 0; i--) {
                    int k = ordens.remove(ordens.size() - 1); // arr[i] é o maior: já está no lugar
                    if (k >= 2) { // os dois filhos viram raízes
                        ordens.add(k - 1);
                        retificar(i - 1 - L.get(k - 2), ordens, ordens.size() - 1);
                        ordens.add(k - 2);
                        retificar(i - 1, ordens, ordens.size() - 1);
                    }
                }
            }

            public static void main(String[] args) {
                int[] a = {9, 3, 7, 1, 8, 2, 6, 4, 5};
                smoothsort(a);
                System.out.println(Arrays.toString(a)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <vector>
        using namespace std;

        class Smoothsort {
            vector<int>& arr;
            vector<int> L{1, 1}; // números de Leonardo
            vector<int> ordens;  // ordem de cada árvore da floresta, da esquerda para a direita

            // restaura o heap de Leonardo de ordem k com raiz em "raiz"
            void afundar(int raiz, int k) {
                while (k >= 2) {
                    int dir = raiz - 1, esq = raiz - 1 - L[k - 2];
                    int filho = arr[esq] >= arr[dir] ? esq : dir;
                    int kFilho = filho == esq ? k - 1 : k - 2;
                    if (arr[raiz] >= arr[filho]) break;
                    swap(arr[raiz], arr[filho]);
                    raiz = filho;
                    k = kFilho;
                }
            }

            // leva a raiz para a esquerda até as raízes ficarem em ordem crescente
            void retificar(int raiz, int t) {
                while (t > 0) {
                    int k = ordens[t];
                    int anterior = raiz - L[k];
                    if (arr[anterior] <= arr[raiz]) break;
                    if (k >= 2 && (arr[anterior] <= arr[raiz - 1] || arr[anterior] <= arr[raiz - 1 - L[k - 2]])) break;
                    swap(arr[anterior], arr[raiz]);
                    raiz = anterior;
                    t--;
                }
                afundar(raiz, ordens[t]);
            }

        public:
            explicit Smoothsort(vector<int>& a) : arr(a) {}

            void ordenar() {
                int n = arr.size();
                while (L.back() < n) L.push_back(L[L.size() - 1] + L[L.size() - 2] + 1);

                for (int i = 0; i < n; i++) {
                    int m = ordens.size();
                    if (m >= 2 && ordens[m - 2] == ordens[m - 1] + 1) {
                        ordens.pop_back();
                        ordens.back()++; // une as duas últimas árvores sob o novo elemento
                    } else if (m > 0 && ordens.back() == 1) {
                        ordens.push_back(0);
                    } else {
                        ordens.push_back(1);
                    }
                    retificar(i, ordens.size() - 1);
                }

                for (int i = n - 1; i > 0; i--) {
                    int k = ordens.back(); // arr[i] é o maior: já está no lugar
                    ordens.pop_back();
                    if (k >= 2) { // os dois filhos viram raízes
                        ordens.push_back(k - 1);
                        retificar(i - 1 - L[k - 2], ordens.size() - 1);
                        ordens.push_back(k - 2);
                        retificar(i - 1, ordens.size() - 1);
                    }
                }
            }
        };

        int main() {
            vector<int> arr = {9, 3, 7, 1, 8, 2, 6, 4, 5};
            Smoothsort(arr).ordenar();
            for (int x : arr) cout << x << " "; // 1 2 3 4 5 6 7 8 9
        }
      `,
    },
  },
]
