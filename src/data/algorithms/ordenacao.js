export default [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    difficulty: 'Iniciante',
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
]
