export default [
  {
    id: 'stack',
    name: 'Pilha (Stack)',
    difficulty: 'Iniciante',
    en: { name: 'Stack', summary: 'Last in, first out (LIFO), like a stack of plates.' },
    facts: { 'Princípio': 'LIFO — último a entrar, primeiro a sair', 'Formalizada por': 'F. L. Bauer e K. Samelson', 'Ano': '1957' },
    summary: 'O último a entrar é o primeiro a sair (LIFO), como uma pilha de pratos.',
    description:
      'A Pilha é uma coleção em que só o elemento do topo pode ser acessado: inserções (push) e remoções (pop) acontecem sempre na mesma ponta. Por isso o último elemento a entrar é o primeiro a sair — o princípio LIFO (last in, first out). Apesar de simples, é uma das estruturas mais importantes da computação: é ela que permite chamar funções, desfazer ações e avaliar expressões.',
    operations: [['push (empilhar)', 'O(1)'], ['pop (desempilhar)', 'O(1)'], ['peek (ver o topo)', 'O(1)'], ['buscar um valor', 'O(n)'], ['espaço', 'O(n)']],
    steps: [
      'Guarde os elementos em sequência — um array dinâmico basta.',
      'push: adicione o novo elemento no fim do array, que é o topo da pilha.',
      'pop: remova e devolva o elemento do fim.',
      'peek: consulte o elemento do fim sem removê-lo.',
      'Antes de remover, verifique se a pilha está vazia (para evitar o "stack underflow").',
    ],
    usedIn: ['Pilha de chamadas de funções', 'Desfazer (Ctrl+Z)', 'Botão "voltar" do navegador', 'Validação de parênteses e de HTML', 'Compiladores e avaliação de expressões'],
    realWorld: [
      { title: 'Pilha de chamadas', text: 'Cada função chamada empilha seu contexto (variáveis locais e ponto de retorno); ao terminar, ele é desempilhado. Uma recursão sem fim estoura essa pilha — o famoso "stack overflow".' },
      { title: 'Desfazer e refazer', text: 'Editores guardam cada ação em uma pilha, e o Ctrl+Z desempilha a última. O refazer usa uma segunda pilha com o que foi desfeito.' },
      { title: 'Editores de código', text: 'Para apontar parênteses sem par ou tags HTML mal fechadas, editores empilham cada abertura e desempilham a cada fechamento — exatamente como no código de exemplo.' },
    ],
    curiosities: [
      'Alan Turing já usava a ideia em 1946, com operações chamadas "BURY" e "UNBURY" para chamar e retornar de sub-rotinas.',
      'Friedrich L. Bauer e Klaus Samelson patentearam o "princípio da pilha" (Kellerprinzip) em 1957 para avaliar expressões; Bauer recebeu por isso o prêmio Computer Pioneer do IEEE em 1988.',
      'O site Stack Overflow tem esse nome por causa do erro de estouro da pilha de chamadas.',
    ],
    code: {
      python: String.raw`
        class Pilha:
            def __init__(self):
                self.itens = []

            def empilhar(self, x):   # push — O(1)
                self.itens.append(x)

            def desempilhar(self):    # pop — O(1)
                if not self.itens:
                    raise IndexError("pilha vazia")
                return self.itens.pop()

            def topo(self):           # peek — O(1)
                return self.itens[-1] if self.itens else None

            def vazia(self):
                return not self.itens

        def balanceado(expr):
            pares = {")": "(", "]": "[", "}": "{"}
            pilha = Pilha()
            for ch in expr:
                if ch in "([{":
                    pilha.empilhar(ch)
                elif ch in pares:
                    if pilha.vazia() or pilha.desempilhar() != pares[ch]:
                        return False
            return pilha.vazia()

        print(balanceado("{[a + b] * (c - d)}"))  # True
        print(balanceado("(a + b]"))               # False
      `,
      javascript: String.raw`
        class Pilha {
          constructor() { this.itens = []; }
          empilhar(x) { this.itens.push(x); }        // push — O(1)
          desempilhar() {                            // pop — O(1)
            if (this.vazia()) throw new Error("pilha vazia");
            return this.itens.pop();
          }
          topo() { return this.itens.at(-1) ?? null; } // peek — O(1)
          vazia() { return this.itens.length === 0; }
        }

        function balanceado(expr) {
          const pares = { ")": "(", "]": "[", "}": "{" };
          const pilha = new Pilha();
          for (const ch of expr) {
            if ("([{".includes(ch)) pilha.empilhar(ch);
            else if (ch in pares) {
              if (pilha.vazia() || pilha.desempilhar() !== pares[ch]) return false;
            }
          }
          return pilha.vazia();
        }

        console.log(balanceado("{[a + b] * (c - d)}")); // true
        console.log(balanceado("(a + b]"));              // false
      `,
      java: String.raw`
        import java.util.ArrayList;

        public class Pilha<T> {
            private final ArrayList<T> itens = new ArrayList<>();

            void empilhar(T x) { itens.add(x); } // push — O(1)

            T desempilhar() {                    // pop — O(1)
                if (itens.isEmpty()) throw new RuntimeException("pilha vazia");
                return itens.remove(itens.size() - 1);
            }

            T topo() { return itens.isEmpty() ? null : itens.get(itens.size() - 1); } // peek

            boolean vazia() { return itens.isEmpty(); }

            static boolean balanceado(String expr) {
                Pilha<Character> pilha = new Pilha<>();
                for (char ch : expr.toCharArray()) {
                    if (ch == '(' || ch == '[' || ch == '{') {
                        pilha.empilhar(ch);
                    } else if (ch == ')' || ch == ']' || ch == '}') {
                        char abre = ch == ')' ? '(' : ch == ']' ? '[' : '{';
                        if (pilha.vazia() || pilha.desempilhar() != abre) return false;
                    }
                }
                return pilha.vazia();
            }

            public static void main(String[] args) {
                System.out.println(balanceado("{[a + b] * (c - d)}")); // true
                System.out.println(balanceado("(a + b]"));              // false
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <stdexcept>
        #include <string>
        #include <vector>
        using namespace std;

        template <typename T>
        class Pilha {
            vector<T> itens;
        public:
            void empilhar(const T& x) { itens.push_back(x); } // push — O(1)
            T desempilhar() {                                 // pop — O(1)
                if (itens.empty()) throw runtime_error("pilha vazia");
                T x = itens.back();
                itens.pop_back();
                return x;
            }
            const T& topo() const { return itens.back(); }    // peek — O(1)
            bool vazia() const { return itens.empty(); }
        };

        bool balanceado(const string& expr) {
            Pilha<char> pilha;
            for (char ch : expr) {
                if (ch == '(' || ch == '[' || ch == '{') {
                    pilha.empilhar(ch);
                } else if (ch == ')' || ch == ']' || ch == '}') {
                    char abre = ch == ')' ? '(' : ch == ']' ? '[' : '{';
                    if (pilha.vazia() || pilha.desempilhar() != abre) return false;
                }
            }
            return pilha.vazia();
        }

        int main() {
            cout << boolalpha << balanceado("{[a + b] * (c - d)}") << "\n"; // true
            cout << boolalpha << balanceado("(a + b]") << "\n";              // false
        }
      `,
    },
  },
  {
    id: 'queue',
    name: 'Fila (Queue)',
    difficulty: 'Iniciante',
    en: { name: 'Queue', summary: 'First in, first out (FIFO), like a line at the bank.' },
    facts: { 'Princípio': 'FIFO — primeiro a entrar, primeiro a sair', 'Teoria das filas': 'Agner K. Erlang (1909)', 'Implementação mostrada': 'Array circular' },
    summary: 'O primeiro a entrar é o primeiro a sair (FIFO), como a fila de um banco.',
    description:
      'A Fila é uma coleção em que os elementos entram por uma ponta (o fim) e saem pela outra (a frente), na mesma ordem em que chegaram — o princípio FIFO (first in, first out). Uma implementação eficiente usa um array circular: os índices de início e fim "dão a volta" no array, de modo que inserir e remover custam O(1) sem deslocar nenhum elemento.',
    operations: [['enqueue (enfileirar)', 'O(1)*'], ['dequeue (desenfileirar)', 'O(1)'], ['front (ver a frente)', 'O(1)'], ['buscar um valor', 'O(n)'], ['espaço', 'O(n)']],
    steps: [
      'Reserve um array e guarde o índice da frente e a quantidade de elementos.',
      'enqueue: grave o elemento na posição (início + tamanho) mod capacidade e aumente o tamanho.',
      'dequeue: leia o elemento da posição início, avance o início (mod capacidade) e diminua o tamanho.',
      'Se o array encher, copie os elementos, em ordem, para um array com o dobro do tamanho.',
      '* Por causa dessas cópias ocasionais, o enqueue é O(1) amortizado.',
    ],
    usedIn: ['Filas de impressão', 'Agendamento de processos', 'Filas de mensagens (RabbitMQ, SQS, Kafka)', 'Buffers de teclado, áudio e rede', 'Busca em largura (BFS)'],
    realWorld: [
      { title: 'Filas de mensagens', text: 'Serviços como RabbitMQ e Amazon SQS enfileiram pedidos — pagamentos, e-mails, processamento de vídeos — para que sejam tratados em ordem, mesmo quando chegam mais rápido do que podem ser processados.' },
      { title: 'Impressora compartilhada', text: 'Os documentos enviados para a impressora de um escritório são impressos na ordem de chegada — o exemplo clássico de fila, implementado no código.' },
      { title: 'Streaming de vídeo', text: 'O player mantém um buffer: os trechos baixados entram no fim e os exibidos saem pela frente, absorvendo as variações da conexão.' },
    ],
    curiosities: [
      'A teoria das filas nasceu em 1909 com o engenheiro dinamarquês Agner Krarup Erlang, que estudava o congestionamento de centrais telefônicas. A unidade de tráfego telefônico "erlang" leva o seu nome.',
      'Há variações importantes: a fila de prioridade (implementada com heap), o deque (inserção e remoção nas duas pontas) e a fila circular.',
      'Em Python, usar list.pop(0) como fila custa O(n), porque desloca todos os elementos; collections.deque faz o mesmo em O(1).',
    ],
    code: {
      python: String.raw`
        class Fila:
            def __init__(self, capacidade=8):
                self.dados = [None] * capacidade
                self.inicio = 0
                self.tamanho = 0

            def enfileirar(self, x):  # O(1) amortizado
                if self.tamanho == len(self.dados):
                    self._crescer()
                fim = (self.inicio + self.tamanho) % len(self.dados)
                self.dados[fim] = x
                self.tamanho += 1

            def desenfileirar(self):  # O(1)
                if self.tamanho == 0:
                    raise IndexError("fila vazia")
                x = self.dados[self.inicio]
                self.dados[self.inicio] = None
                self.inicio = (self.inicio + 1) % len(self.dados)  # "dá a volta"
                self.tamanho -= 1
                return x

            def _crescer(self):
                em_ordem = [self.dados[(self.inicio + i) % len(self.dados)] for i in range(self.tamanho)]
                self.dados = em_ordem + [None] * len(self.dados)
                self.inicio = 0

        fila = Fila(capacidade=2)
        for doc in ["relatorio.pdf", "foto.png", "contrato.docx"]:
            fila.enfileirar(doc)
        while fila.tamanho:
            print("Imprimindo", fila.desenfileirar())
        # Imprimindo relatorio.pdf / foto.png / contrato.docx (na ordem de chegada)
      `,
      javascript: String.raw`
        class Fila {
          constructor(capacidade = 8) {
            this.dados = new Array(capacidade);
            this.inicio = 0;
            this.tamanho = 0;
          }

          enfileirar(x) { // O(1) amortizado
            if (this.tamanho === this.dados.length) this.crescer();
            this.dados[(this.inicio + this.tamanho) % this.dados.length] = x;
            this.tamanho++;
          }

          desenfileirar() { // O(1)
            if (this.tamanho === 0) throw new Error("fila vazia");
            const x = this.dados[this.inicio];
            this.dados[this.inicio] = undefined;
            this.inicio = (this.inicio + 1) % this.dados.length; // "dá a volta"
            this.tamanho--;
            return x;
          }

          crescer() {
            const emOrdem = Array.from({ length: this.tamanho }, (_, i) => this.dados[(this.inicio + i) % this.dados.length]);
            this.dados = emOrdem.concat(new Array(this.dados.length));
            this.inicio = 0;
          }
        }

        const fila = new Fila(2);
        for (const doc of ["relatorio.pdf", "foto.png", "contrato.docx"]) fila.enfileirar(doc);
        while (fila.tamanho) console.log("Imprimindo", fila.desenfileirar());
        // Imprimindo relatorio.pdf / foto.png / contrato.docx (na ordem de chegada)
      `,
      java: String.raw`
        public class Fila<T> {
            private Object[] dados;
            private int inicio = 0, tamanho = 0;

            Fila(int capacidade) { dados = new Object[capacidade]; }

            void enfileirar(T x) { // O(1) amortizado
                if (tamanho == dados.length) crescer();
                dados[(inicio + tamanho) % dados.length] = x;
                tamanho++;
            }

            @SuppressWarnings("unchecked")
            T desenfileirar() { // O(1)
                if (tamanho == 0) throw new RuntimeException("fila vazia");
                T x = (T) dados[inicio];
                dados[inicio] = null;
                inicio = (inicio + 1) % dados.length; // "dá a volta"
                tamanho--;
                return x;
            }

            boolean vazia() { return tamanho == 0; }

            private void crescer() {
                Object[] novo = new Object[dados.length * 2];
                for (int i = 0; i < tamanho; i++) novo[i] = dados[(inicio + i) % dados.length];
                dados = novo;
                inicio = 0;
            }

            public static void main(String[] args) {
                Fila<String> fila = new Fila<>(2);
                for (String doc : new String[]{"relatorio.pdf", "foto.png", "contrato.docx"}) fila.enfileirar(doc);
                while (!fila.vazia()) System.out.println("Imprimindo " + fila.desenfileirar());
                // Imprimindo relatorio.pdf / foto.png / contrato.docx (na ordem de chegada)
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <stdexcept>
        #include <string>
        #include <vector>
        using namespace std;

        template <typename T>
        class Fila {
            vector<T> dados;
            size_t inicio = 0, tamanho = 0;

            void crescer() {
                vector<T> novo(dados.size() * 2);
                for (size_t i = 0; i < tamanho; i++) novo[i] = dados[(inicio + i) % dados.size()];
                dados = move(novo);
                inicio = 0;
            }

        public:
            explicit Fila(size_t capacidade = 8) : dados(capacidade) {}

            void enfileirar(const T& x) { // O(1) amortizado
                if (tamanho == dados.size()) crescer();
                dados[(inicio + tamanho) % dados.size()] = x;
                tamanho++;
            }

            T desenfileirar() { // O(1)
                if (tamanho == 0) throw runtime_error("fila vazia");
                T x = dados[inicio];
                inicio = (inicio + 1) % dados.size(); // "dá a volta"
                tamanho--;
                return x;
            }

            bool vazia() const { return tamanho == 0; }
        };

        int main() {
            Fila<string> fila(2);
            for (string doc : {"relatorio.pdf", "foto.png", "contrato.docx"}) fila.enfileirar(doc);
            while (!fila.vazia()) cout << "Imprimindo " << fila.desenfileirar() << "\n";
            // Imprimindo relatorio.pdf / foto.png / contrato.docx (na ordem de chegada)
        }
      `,
    },
  },
  {
    id: 'linked-list',
    name: 'Lista Ligada',
    difficulty: 'Iniciante',
    en: { name: 'Linked List', summary: 'Nodes scattered in memory, each one pointing to the next.' },
    facts: { 'Criada por': 'Newell, Shaw e Simon', 'Ano': '1955–1956', 'Primeiro uso': 'Linguagem IPL' },
    summary: 'Nós espalhados na memória, cada um apontando para o próximo.',
    description:
      'Na Lista Ligada (ou encadeada), cada elemento fica em um nó que guarda o valor e um ponteiro para o próximo nó; a lista só conhece o primeiro deles, a cabeça. Inserir ou remover no início custa O(1) e nada precisa ser deslocado, ao contrário de um array — mas, em troca, não há acesso direto por índice: para chegar ao 100º elemento é preciso percorrer os 99 anteriores.',
    operations: [['inserir no início', 'O(1)'], ['inserir no fim', 'O(n)*'], ['remover (dado o anterior)', 'O(1)'], ['buscar / acessar por índice', 'O(n)'], ['espaço', 'O(n)']],
    steps: [
      'Cada nó guarda um valor e uma referência para o próximo nó; o último aponta para nulo.',
      'Inserir no início: crie o nó apontando para a cabeça atual e faça dele a nova cabeça.',
      'Inserir no fim: percorra até o último nó e faça-o apontar para o novo (* O(1) se a lista guardar um ponteiro para a cauda).',
      'Remover: encontre o nó e faça o anterior apontar para o seguinte, "pulando" o removido.',
      'Buscar: percorra a partir da cabeça, nó a nó, até achar o valor ou chegar ao fim.',
    ],
    usedIn: ['Cache LRU (com tabela hash)', 'Kernel Linux (list_head)', 'Alocadores de memória (listas livres)', 'Playlists e históricos', 'Listas de adjacência em grafos'],
    realWorld: [
      { title: 'Cache LRU', text: 'Caches que descartam o item usado há mais tempo combinam uma tabela hash com uma lista duplamente ligada: o item acessado vai para a frente em O(1), e o do fim é o descartado.' },
      { title: 'Kernel Linux', text: 'O kernel usa listas ligadas circulares (struct list_head) por toda parte — processos, módulos, dispositivos —, embutindo os ponteiros dentro das próprias estruturas.' },
      { title: 'Playlists', text: 'Players de música usam listas, muitas vezes duplamente ligadas, para "próxima" e "anterior" e para reordenar faixas sem copiar a playlist inteira.' },
    ],
    curiosities: [
      'Foi criada entre 1955 e 1956 por Allen Newell, Cliff Shaw e Herbert A. Simon para a linguagem IPL, usada em alguns dos primeiros programas de inteligência artificial.',
      'A linguagem Lisp, de 1958, foi construída inteiramente sobre listas ligadas — o nome vem de "LISt Processing".',
      'Em computadores modernos, percorrer uma lista ligada costuma ser bem mais lento que percorrer um array do mesmo tamanho, porque os nós espalhados pela memória aproveitam mal o cache.',
    ],
    code: {
      python: String.raw`
        class No:
            def __init__(self, valor, proximo=None):
                self.valor = valor
                self.proximo = proximo

        class ListaLigada:
            def __init__(self):
                self.cabeca = None

            def inserir_inicio(self, valor):  # O(1)
                self.cabeca = No(valor, self.cabeca)

            def inserir_fim(self, valor):     # O(n): anda até o último nó
                novo = No(valor)
                if self.cabeca is None:
                    self.cabeca = novo
                    return
                atual = self.cabeca
                while atual.proximo:
                    atual = atual.proximo
                atual.proximo = novo

            def remover(self, valor):         # O(n) para encontrar, O(1) para religar
                anterior, atual = None, self.cabeca
                while atual and atual.valor != valor:
                    anterior, atual = atual, atual.proximo
                if atual is None:
                    return False
                if anterior is None:
                    self.cabeca = atual.proximo
                else:
                    anterior.proximo = atual.proximo  # "pula" o nó removido
                return True

            def __str__(self):
                partes, atual = [], self.cabeca
                while atual:
                    partes.append(str(atual.valor))
                    atual = atual.proximo
                return " -> ".join(partes + ["None"])

        lista = ListaLigada()
        lista.inserir_fim(10)
        lista.inserir_fim(20)
        lista.inserir_inicio(5)
        print(lista)  # 5 -> 10 -> 20 -> None
        lista.remover(10)
        print(lista)  # 5 -> 20 -> None
      `,
      javascript: String.raw`
        class No {
          constructor(valor, proximo = null) {
            this.valor = valor;
            this.proximo = proximo;
          }
        }

        class ListaLigada {
          constructor() { this.cabeca = null; }

          inserirInicio(valor) { // O(1)
            this.cabeca = new No(valor, this.cabeca);
          }

          inserirFim(valor) { // O(n): anda até o último nó
            const novo = new No(valor);
            if (!this.cabeca) { this.cabeca = novo; return; }
            let atual = this.cabeca;
            while (atual.proximo) atual = atual.proximo;
            atual.proximo = novo;
          }

          remover(valor) { // O(n) para encontrar, O(1) para religar
            let anterior = null, atual = this.cabeca;
            while (atual && atual.valor !== valor) {
              anterior = atual;
              atual = atual.proximo;
            }
            if (!atual) return false;
            if (!anterior) this.cabeca = atual.proximo;
            else anterior.proximo = atual.proximo; // "pula" o nó removido
            return true;
          }

          toString() {
            const partes = [];
            for (let n = this.cabeca; n; n = n.proximo) partes.push(n.valor);
            return [...partes, "null"].join(" -> ");
          }
        }

        const lista = new ListaLigada();
        lista.inserirFim(10);
        lista.inserirFim(20);
        lista.inserirInicio(5);
        console.log(String(lista)); // 5 -> 10 -> 20 -> null
        lista.remover(10);
        console.log(String(lista)); // 5 -> 20 -> null
      `,
      java: String.raw`
        public class ListaLigada {
            static class No {
                int valor;
                No proximo;
                No(int valor, No proximo) { this.valor = valor; this.proximo = proximo; }
            }

            private No cabeca;

            void inserirInicio(int valor) { // O(1)
                cabeca = new No(valor, cabeca);
            }

            void inserirFim(int valor) { // O(n): anda até o último nó
                No novo = new No(valor, null);
                if (cabeca == null) { cabeca = novo; return; }
                No atual = cabeca;
                while (atual.proximo != null) atual = atual.proximo;
                atual.proximo = novo;
            }

            boolean remover(int valor) { // O(n) para encontrar, O(1) para religar
                No anterior = null, atual = cabeca;
                while (atual != null && atual.valor != valor) {
                    anterior = atual;
                    atual = atual.proximo;
                }
                if (atual == null) return false;
                if (anterior == null) cabeca = atual.proximo;
                else anterior.proximo = atual.proximo; // "pula" o nó removido
                return true;
            }

            @Override
            public String toString() {
                StringBuilder sb = new StringBuilder();
                for (No n = cabeca; n != null; n = n.proximo) sb.append(n.valor).append(" -> ");
                return sb.append("null").toString();
            }

            public static void main(String[] args) {
                ListaLigada lista = new ListaLigada();
                lista.inserirFim(10);
                lista.inserirFim(20);
                lista.inserirInicio(5);
                System.out.println(lista); // 5 -> 10 -> 20 -> null
                lista.remover(10);
                System.out.println(lista); // 5 -> 20 -> null
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        using namespace std;

        struct No {
            int valor;
            No* proximo;
        };

        class ListaLigada {
            No* cabeca = nullptr;
        public:
            ~ListaLigada() {
                while (cabeca) { No* n = cabeca; cabeca = cabeca->proximo; delete n; }
            }

            void inserirInicio(int valor) { // O(1)
                cabeca = new No{valor, cabeca};
            }

            void inserirFim(int valor) { // O(n): anda até o último nó
                No* novo = new No{valor, nullptr};
                if (!cabeca) { cabeca = novo; return; }
                No* atual = cabeca;
                while (atual->proximo) atual = atual->proximo;
                atual->proximo = novo;
            }

            bool remover(int valor) { // O(n) para encontrar, O(1) para religar
                No *anterior = nullptr, *atual = cabeca;
                while (atual && atual->valor != valor) {
                    anterior = atual;
                    atual = atual->proximo;
                }
                if (!atual) return false;
                if (!anterior) cabeca = atual->proximo;
                else anterior->proximo = atual->proximo; // "pula" o nó removido
                delete atual;
                return true;
            }

            void imprimir() const {
                for (No* n = cabeca; n; n = n->proximo) cout << n->valor << " -> ";
                cout << "null\n";
            }
        };

        int main() {
            ListaLigada lista;
            lista.inserirFim(10);
            lista.inserirFim(20);
            lista.inserirInicio(5);
            lista.imprimir(); // 5 -> 10 -> 20 -> null
            lista.remover(10);
            lista.imprimir(); // 5 -> 20 -> null
        }
      `,
    },
  },
  {
    id: 'binary-heap',
    name: 'Heap Binário',
    difficulty: 'Intermediário',
    en: { name: 'Binary Heap', summary: 'A complete tree stored in an array, with the smallest (or largest) always at the root.' },
    facts: { 'Criado por': 'J. W. J. Williams', 'Ano': '1964', 'Variação mostrada': 'Heap de mínimo' },
    summary: 'Árvore completa guardada em um array, com o menor (ou o maior) sempre na raiz.',
    description:
      'O Heap Binário é uma árvore binária completa em que cada pai é menor (heap de mínimo) ou maior (heap de máximo) que seus filhos. Assim, o extremo fica sempre na raiz, acessível em O(1), e inserir ou remover custa só O(log n). Por ser completa, a árvore cabe em um array sem nenhum ponteiro: os filhos do índice i ficam em 2i + 1 e 2i + 2. É a implementação padrão das filas de prioridade.',
    operations: [['ver o mínimo', 'O(1)'], ['inserir', 'O(log n)'], ['extrair o mínimo', 'O(log n)'], ['construir a partir de um array', 'O(n)'], ['espaço', 'O(n)']],
    steps: [
      'Guarde a árvore em um array: o pai de i está em (i − 1) / 2, e os filhos em 2i + 1 e 2i + 2.',
      'Inserir: coloque o valor no fim do array e faça-o "subir", trocando com o pai enquanto for menor que ele.',
      'Extrair o mínimo: guarde a raiz, mova o último elemento para a raiz e faça-o "descer", trocando com o menor filho enquanto for maior que ele.',
      'Em qualquer momento, a raiz contém o menor elemento.',
    ],
    usedIn: ['Filas de prioridade (heapq, PriorityQueue)', 'Algoritmos de Dijkstra e A*', 'Heap Sort', 'Agendadores de tarefas e timers', 'Top-k e mediana em fluxos de dados'],
    realWorld: [
      { title: 'Triagem e agendamento', text: 'Sistemas de triagem hospitalar e agendadores de tarefas atendem primeiro o item de maior prioridade, e não o que chegou antes — exatamente o que uma fila de prioridade com heap oferece.' },
      { title: 'Timers', text: 'Servidores e motores de jogos mantêm milhares de eventos programados ("daqui a 3 segundos, faça X") em um heap ordenado pelo horário: o próximo evento está sempre na raiz.' },
      { title: 'Rotas mais curtas', text: 'O algoritmo de Dijkstra, usado em roteamento, retira repetidamente o vértice mais próximo ainda não processado — com um heap, cada retirada custa O(log n).' },
    ],
    curiosities: [
      'Foi apresentado por J. W. J. Williams em 1964, no mesmo artigo do Heap Sort.',
      'Apesar do nome, não tem relação com o "heap" da memória (a área de alocação dinâmica) — é apenas uma coincidência de nomes.',
      'Construir um heap a partir de n elementos de uma só vez custa O(n), e não O(n log n), graças ao método proposto por Robert W. Floyd.',
    ],
    code: {
      python: String.raw`
        class HeapMinimo:
            def __init__(self):
                self.dados = []

            def inserir(self, x):  # O(log n)
                self.dados.append(x)
                i = len(self.dados) - 1
                while i > 0:  # sobe enquanto for menor que o pai
                    pai = (i - 1) // 2
                    if self.dados[pai] <= self.dados[i]:
                        break
                    self.dados[pai], self.dados[i] = self.dados[i], self.dados[pai]
                    i = pai

            def extrair_minimo(self):  # O(log n)
                if not self.dados:
                    raise IndexError("heap vazio")
                minimo = self.dados[0]
                ultimo = self.dados.pop()
                if self.dados:
                    self.dados[0] = ultimo
                    i = 0
                    while True:  # desce trocando com o menor filho
                        menor, esq, dir = i, 2 * i + 1, 2 * i + 2
                        if esq < len(self.dados) and self.dados[esq] < self.dados[menor]:
                            menor = esq
                        if dir < len(self.dados) and self.dados[dir] < self.dados[menor]:
                            menor = dir
                        if menor == i:
                            break
                        self.dados[i], self.dados[menor] = self.dados[menor], self.dados[i]
                        i = menor
                return minimo

        heap = HeapMinimo()
        for prioridade in [5, 3, 8, 1, 9, 2]:
            heap.inserir(prioridade)
        print([heap.extrair_minimo() for _ in range(6)])  # [1, 2, 3, 5, 8, 9]
      `,
      javascript: String.raw`
        class HeapMinimo {
          constructor() { this.dados = []; }

          inserir(x) { // O(log n)
            const d = this.dados;
            d.push(x);
            let i = d.length - 1;
            while (i > 0) { // sobe enquanto for menor que o pai
              const pai = Math.floor((i - 1) / 2);
              if (d[pai] <= d[i]) break;
              [d[pai], d[i]] = [d[i], d[pai]];
              i = pai;
            }
          }

          extrairMinimo() { // O(log n)
            const d = this.dados;
            if (d.length === 0) throw new Error("heap vazio");
            const minimo = d[0];
            const ultimo = d.pop();
            if (d.length) {
              d[0] = ultimo;
              let i = 0;
              while (true) { // desce trocando com o menor filho
                const esq = 2 * i + 1, dir = 2 * i + 2;
                let menor = i;
                if (esq < d.length && d[esq] < d[menor]) menor = esq;
                if (dir < d.length && d[dir] < d[menor]) menor = dir;
                if (menor === i) break;
                [d[i], d[menor]] = [d[menor], d[i]];
                i = menor;
              }
            }
            return minimo;
          }
        }

        const heap = new HeapMinimo();
        for (const prioridade of [5, 3, 8, 1, 9, 2]) heap.inserir(prioridade);
        console.log(Array.from({ length: 6 }, () => heap.extrairMinimo())); // [1, 2, 3, 5, 8, 9]
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;

        public class HeapMinimo {
            private final List<Integer> dados = new ArrayList<>();

            private void trocar(int i, int j) {
                int tmp = dados.get(i);
                dados.set(i, dados.get(j));
                dados.set(j, tmp);
            }

            void inserir(int x) { // O(log n)
                dados.add(x);
                int i = dados.size() - 1;
                while (i > 0) { // sobe enquanto for menor que o pai
                    int pai = (i - 1) / 2;
                    if (dados.get(pai) <= dados.get(i)) break;
                    trocar(pai, i);
                    i = pai;
                }
            }

            int extrairMinimo() { // O(log n)
                if (dados.isEmpty()) throw new RuntimeException("heap vazio");
                int minimo = dados.get(0);
                int ultimo = dados.remove(dados.size() - 1);
                if (!dados.isEmpty()) {
                    dados.set(0, ultimo);
                    int i = 0;
                    while (true) { // desce trocando com o menor filho
                        int esq = 2 * i + 1, dir = 2 * i + 2, menor = i;
                        if (esq < dados.size() && dados.get(esq) < dados.get(menor)) menor = esq;
                        if (dir < dados.size() && dados.get(dir) < dados.get(menor)) menor = dir;
                        if (menor == i) break;
                        trocar(i, menor);
                        i = menor;
                    }
                }
                return minimo;
            }

            public static void main(String[] args) {
                HeapMinimo heap = new HeapMinimo();
                for (int prioridade : new int[]{5, 3, 8, 1, 9, 2}) heap.inserir(prioridade);
                List<Integer> ordem = new ArrayList<>();
                for (int k = 0; k < 6; k++) ordem.add(heap.extrairMinimo());
                System.out.println(ordem); // [1, 2, 3, 5, 8, 9]
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <stdexcept>
        #include <vector>
        using namespace std;

        class HeapMinimo {
            vector<int> dados;
        public:
            void inserir(int x) { // O(log n)
                dados.push_back(x);
                int i = dados.size() - 1;
                while (i > 0) { // sobe enquanto for menor que o pai
                    int pai = (i - 1) / 2;
                    if (dados[pai] <= dados[i]) break;
                    swap(dados[pai], dados[i]);
                    i = pai;
                }
            }

            int extrairMinimo() { // O(log n)
                if (dados.empty()) throw runtime_error("heap vazio");
                int minimo = dados[0];
                dados[0] = dados.back();
                dados.pop_back();
                int n = dados.size(), i = 0;
                while (true) { // desce trocando com o menor filho
                    int esq = 2 * i + 1, dir = 2 * i + 2, menor = i;
                    if (esq < n && dados[esq] < dados[menor]) menor = esq;
                    if (dir < n && dados[dir] < dados[menor]) menor = dir;
                    if (menor == i) break;
                    swap(dados[i], dados[menor]);
                    i = menor;
                }
                return minimo;
            }
        };

        int main() {
            HeapMinimo heap;
            for (int prioridade : {5, 3, 8, 1, 9, 2}) heap.inserir(prioridade);
            for (int k = 0; k < 6; k++) cout << heap.extrairMinimo() << " "; // 1 2 3 5 8 9
        }
      `,
    },
  },
  {
    id: 'trie',
    name: 'Trie (Árvore de Prefixos)',
    difficulty: 'Intermediário',
    en: { name: 'Trie (Prefix Tree)', summary: 'A tree where each edge is a letter: words with the same prefix share the path.' },
    facts: { 'Proposta por': 'René de la Briandais', 'Ano': '1959', 'Nome dado por': 'Edward Fredkin (1960)' },
    summary: 'Árvore em que cada aresta é uma letra: palavras com o mesmo prefixo compartilham o caminho.',
    description:
      'A Trie (ou árvore de prefixos) guarda um conjunto de palavras distribuindo suas letras pelos níveis de uma árvore: a partir da raiz, cada aresta corresponde a um caractere, e alguns nós marcam onde uma palavra termina. Buscar uma palavra ou um prefixo custa O(m), em que m é o tamanho da palavra — não importa quantas palavras estejam guardadas. Por isso é a estrutura ideal para o autocompletar.',
    operations: [['inserir palavra', 'O(m)'], ['buscar palavra', 'O(m)'], ['buscar prefixo', 'O(m)'], ['listar palavras com o prefixo', 'O(m + k)'], ['espaço', 'O(total de letras)']],
    steps: [
      'Comece com um nó raiz vazio; cada nó tem um mapa "letra → filho" e uma marca de fim de palavra.',
      'Inserir: para cada letra, siga o filho correspondente, criando-o se não existir; no fim, marque o último nó.',
      'Buscar: siga as letras a partir da raiz; se faltar algum filho, a palavra não existe; se chegar ao fim, confira a marca.',
      'Autocompletar: desça até o nó do prefixo e colete todas as palavras abaixo dele.',
    ],
    usedIn: ['Autocompletar e sugestões de busca', 'Corretores ortográficos', 'Texto preditivo em teclados', 'Roteamento IP (maior prefixo)', 'Filtros de palavras'],
    realWorld: [
      { title: 'Autocompletar', text: 'Ao digitar "cas" em um campo de busca, o sistema desce três níveis da trie e lista na hora "casa", "casaco" e "caso" — sem comparar com o dicionário inteiro.' },
      { title: 'Roteadores de internet', text: 'Roteadores escolhem o destino de cada pacote pelo prefixo mais longo do endereço IP presente na tabela de rotas — consulta feita com tries binárias especializadas.' },
      { title: 'Corretores ortográficos', text: 'Percorrer a trie permite verificar palavras rapidamente e sugerir correções explorando caminhos com uma ou duas letras diferentes.' },
    ],
    curiosities: [
      'Foi descrita por René de la Briandais em 1959; o nome "trie" foi cunhado por Edward Fredkin em 1960, a partir de "retrieval" (recuperação).',
      'Fredkin pronunciava "trie" como "tree" (árvore), mas muitos autores passaram a dizer "trai", para diferenciar as duas palavras.',
      'Variações compactas, como a árvore radix (Patricia trie), juntam cadeias de nós com um único filho para economizar memória.',
    ],
    code: {
      python: String.raw`
        class NoTrie:
            def __init__(self):
                self.filhos = {}
                self.fim = False  # marca o fim de uma palavra

        class Trie:
            def __init__(self):
                self.raiz = NoTrie()

            def inserir(self, palavra):  # O(m)
                no = self.raiz
                for ch in palavra:
                    no = no.filhos.setdefault(ch, NoTrie())
                no.fim = True

            def contem(self, palavra):  # O(m)
                no = self._descer(palavra)
                return no is not None and no.fim

            def com_prefixo(self, prefixo):
                resultado = []

                def coletar(no, atual):
                    if no.fim:
                        resultado.append(atual)
                    for ch in sorted(no.filhos):
                        coletar(no.filhos[ch], atual + ch)

                no = self._descer(prefixo)
                if no:
                    coletar(no, prefixo)
                return resultado

            def _descer(self, texto):
                no = self.raiz
                for ch in texto:
                    no = no.filhos.get(ch)
                    if no is None:
                        return None
                return no

        trie = Trie()
        for palavra in ["casa", "casaco", "caso", "carro", "gato"]:
            trie.inserir(palavra)
        print(trie.com_prefixo("cas"))  # ['casa', 'casaco', 'caso']
        print(trie.contem("car"))       # False ("car" é só um prefixo)
      `,
      javascript: String.raw`
        class NoTrie {
          constructor() {
            this.filhos = new Map();
            this.fim = false; // marca o fim de uma palavra
          }
        }

        class Trie {
          constructor() { this.raiz = new NoTrie(); }

          inserir(palavra) { // O(m)
            let no = this.raiz;
            for (const ch of palavra) {
              if (!no.filhos.has(ch)) no.filhos.set(ch, new NoTrie());
              no = no.filhos.get(ch);
            }
            no.fim = true;
          }

          contem(palavra) { // O(m)
            const no = this.descer(palavra);
            return no !== null && no.fim;
          }

          comPrefixo(prefixo) {
            const resultado = [];
            const coletar = (no, atual) => {
              if (no.fim) resultado.push(atual);
              for (const ch of [...no.filhos.keys()].sort()) coletar(no.filhos.get(ch), atual + ch);
            };
            const no = this.descer(prefixo);
            if (no) coletar(no, prefixo);
            return resultado;
          }

          descer(texto) {
            let no = this.raiz;
            for (const ch of texto) {
              no = no.filhos.get(ch);
              if (!no) return null;
            }
            return no;
          }
        }

        const trie = new Trie();
        for (const palavra of ["casa", "casaco", "caso", "carro", "gato"]) trie.inserir(palavra);
        console.log(trie.comPrefixo("cas")); // [ 'casa', 'casaco', 'caso' ]
        console.log(trie.contem("car"));     // false ("car" é só um prefixo)
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Map;
        import java.util.TreeMap;

        public class Trie {
            static class No {
                Map<Character, No> filhos = new TreeMap<>(); // TreeMap mantém as letras em ordem
                boolean fim = false;                         // marca o fim de uma palavra
            }

            private final No raiz = new No();

            void inserir(String palavra) { // O(m)
                No no = raiz;
                for (char ch : palavra.toCharArray()) no = no.filhos.computeIfAbsent(ch, c -> new No());
                no.fim = true;
            }

            boolean contem(String palavra) { // O(m)
                No no = descer(palavra);
                return no != null && no.fim;
            }

            List<String> comPrefixo(String prefixo) {
                List<String> resultado = new ArrayList<>();
                No no = descer(prefixo);
                if (no != null) coletar(no, prefixo, resultado);
                return resultado;
            }

            private void coletar(No no, String atual, List<String> resultado) {
                if (no.fim) resultado.add(atual);
                for (Map.Entry<Character, No> e : no.filhos.entrySet()) coletar(e.getValue(), atual + e.getKey(), resultado);
            }

            private No descer(String texto) {
                No no = raiz;
                for (char ch : texto.toCharArray()) {
                    no = no.filhos.get(ch);
                    if (no == null) return null;
                }
                return no;
            }

            public static void main(String[] args) {
                Trie trie = new Trie();
                for (String p : new String[]{"casa", "casaco", "caso", "carro", "gato"}) trie.inserir(p);
                System.out.println(trie.comPrefixo("cas")); // [casa, casaco, caso]
                System.out.println(trie.contem("car"));     // false ("car" é só um prefixo)
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <map>
        #include <memory>
        #include <string>
        #include <vector>
        using namespace std;

        struct No {
            map<char, unique_ptr<No>> filhos; // map mantém as letras em ordem
            bool fim = false;                 // marca o fim de uma palavra
        };

        class Trie {
            No raiz;

            const No* descer(const string& texto) const {
                const No* no = &raiz;
                for (char ch : texto) {
                    auto it = no->filhos.find(ch);
                    if (it == no->filhos.end()) return nullptr;
                    no = it->second.get();
                }
                return no;
            }

            static void coletar(const No* no, const string& atual, vector<string>& resultado) {
                if (no->fim) resultado.push_back(atual);
                for (const auto& [ch, filho] : no->filhos) coletar(filho.get(), atual + ch, resultado);
            }

        public:
            void inserir(const string& palavra) { // O(m)
                No* no = &raiz;
                for (char ch : palavra) {
                    auto& filho = no->filhos[ch];
                    if (!filho) filho = make_unique<No>();
                    no = filho.get();
                }
                no->fim = true;
            }

            bool contem(const string& palavra) const { // O(m)
                const No* no = descer(palavra);
                return no && no->fim;
            }

            vector<string> comPrefixo(const string& prefixo) const {
                vector<string> resultado;
                if (const No* no = descer(prefixo)) coletar(no, prefixo, resultado);
                return resultado;
            }
        };

        int main() {
            Trie trie;
            for (string p : {"casa", "casaco", "caso", "carro", "gato"}) trie.inserir(p);
            for (const string& p : trie.comPrefixo("cas")) cout << p << " "; // casa casaco caso
            cout << "\n" << boolalpha << trie.contem("car") << "\n";        // false
        }
      `,
    },
  },
  {
    id: 'union-find',
    name: 'Union-Find (Conjuntos Disjuntos)',
    difficulty: 'Avançado',
    en: { name: 'Union-Find (Disjoint Sets)', summary: 'Keeps groups of elements and answers "same group?" in nearly constant time.' },
    facts: { 'Criado por': 'Bernard Galler e Michael Fischer', 'Ano': '1964', 'Análise de complexidade': 'Robert Tarjan (1975)' },
    summary: 'Mantém grupos de elementos e responde "estão no mesmo grupo?" quase em tempo constante.',
    description:
      'O Union-Find (ou estrutura de conjuntos disjuntos) organiza elementos em grupos que não se sobrepõem e oferece duas operações: find, que devolve o representante do grupo de um elemento, e union, que junta dois grupos. Cada grupo é uma árvore em que cada elemento aponta para o pai, e a raiz é o representante. Com duas otimizações — união por posto e compressão de caminho — as operações ficam praticamente O(1).',
    operations: [['find (achar o grupo)', 'O(α(n)) ≈ O(1)'], ['union (unir grupos)', 'O(α(n)) ≈ O(1)'], ['mesmo grupo?', 'O(α(n)) ≈ O(1)'], ['espaço', 'O(n)']],
    steps: [
      'Comece com cada elemento sendo pai de si mesmo: n grupos de um elemento.',
      'find(x): siga os pais até chegar a um elemento que aponta para si mesmo — a raiz do grupo.',
      'Compressão de caminho: na volta, faça todos os nós do caminho apontarem direto para a raiz.',
      'union(a, b): encontre as raízes dos dois; se forem diferentes, ligue a de menor posto (altura) sob a de maior.',
      'Dois elementos estão no mesmo grupo se, e somente se, find devolver a mesma raiz para ambos.',
    ],
    usedIn: ['Algoritmo de Kruskal (árvore geradora mínima)', 'Componentes conexos em redes', 'Segmentação de imagens', 'Geração de labirintos', 'Unificação de tipos em compiladores'],
    realWorld: [
      { title: 'Conectividade de redes', text: 'Para saber se dois computadores conseguem se comunicar à medida que cabos são ligados, basta um union a cada novo cabo e um find para responder à pergunta.' },
      { title: 'Árvore geradora mínima', text: 'O algoritmo de Kruskal, usado para projetar redes elétricas e de fibra óptica com o menor custo, usa Union-Find para evitar ciclos ao escolher cada nova conexão.' },
      { title: 'Contar objetos em imagens', text: 'Pixels vizinhos de cor parecida são unidos no mesmo grupo; ao final, cada grupo corresponde a um objeto da imagem.' },
    ],
    curiosities: [
      'Foi introduzido por Bernard Galler e Michael Fischer em 1964.',
      'Em 1975, Robert Tarjan provou que, com as duas otimizações, o custo é O(α(n)), em que α é a inversa da função de Ackermann. Ela cresce tão devagar que é menor que 5 para qualquer n que caiba no universo observável.',
      'É uma das poucas estruturas cuja análise de desempenho é muito mais difícil que o próprio código, que cabe em poucas linhas.',
    ],
    code: {
      python: String.raw`
        class UnionFind:
            def __init__(self, n):
                self.pai = list(range(n))  # cada um começa no próprio grupo
                self.posto = [0] * n

            def find(self, x):
                if self.pai[x] != x:
                    self.pai[x] = self.find(self.pai[x])  # compressão de caminho
                return self.pai[x]

            def union(self, a, b):
                ra, rb = self.find(a), self.find(b)
                if ra == rb:
                    return False  # já estavam no mesmo grupo
                if self.posto[ra] < self.posto[rb]:
                    ra, rb = rb, ra
                self.pai[rb] = ra  # a árvore mais baixa fica embaixo
                if self.posto[ra] == self.posto[rb]:
                    self.posto[ra] += 1
                return True

        rede = UnionFind(6)  # 6 computadores
        rede.union(0, 1)
        rede.union(1, 2)
        rede.union(3, 4)
        print(rede.find(0) == rede.find(2))  # True
        print(rede.find(0) == rede.find(4))  # False
        rede.union(2, 3)
        print(rede.find(0) == rede.find(4))  # True
      `,
      javascript: String.raw`
        class UnionFind {
          constructor(n) {
            this.pai = Array.from({ length: n }, (_, i) => i); // cada um no próprio grupo
            this.posto = new Array(n).fill(0);
          }

          find(x) {
            if (this.pai[x] !== x) this.pai[x] = this.find(this.pai[x]); // compressão de caminho
            return this.pai[x];
          }

          union(a, b) {
            let ra = this.find(a), rb = this.find(b);
            if (ra === rb) return false; // já estavam no mesmo grupo
            if (this.posto[ra] < this.posto[rb]) [ra, rb] = [rb, ra];
            this.pai[rb] = ra; // a árvore mais baixa fica embaixo
            if (this.posto[ra] === this.posto[rb]) this.posto[ra]++;
            return true;
          }
        }

        const rede = new UnionFind(6); // 6 computadores
        rede.union(0, 1);
        rede.union(1, 2);
        rede.union(3, 4);
        console.log(rede.find(0) === rede.find(2)); // true
        console.log(rede.find(0) === rede.find(4)); // false
        rede.union(2, 3);
        console.log(rede.find(0) === rede.find(4)); // true
      `,
      java: String.raw`
        public class UnionFind {
            private final int[] pai, posto;

            UnionFind(int n) {
                pai = new int[n];
                posto = new int[n];
                for (int i = 0; i < n; i++) pai[i] = i; // cada um no próprio grupo
            }

            int find(int x) {
                if (pai[x] != x) pai[x] = find(pai[x]); // compressão de caminho
                return pai[x];
            }

            boolean union(int a, int b) {
                int ra = find(a), rb = find(b);
                if (ra == rb) return false; // já estavam no mesmo grupo
                if (posto[ra] < posto[rb]) { int t = ra; ra = rb; rb = t; }
                pai[rb] = ra; // a árvore mais baixa fica embaixo
                if (posto[ra] == posto[rb]) posto[ra]++;
                return true;
            }

            public static void main(String[] args) {
                UnionFind rede = new UnionFind(6); // 6 computadores
                rede.union(0, 1);
                rede.union(1, 2);
                rede.union(3, 4);
                System.out.println(rede.find(0) == rede.find(2)); // true
                System.out.println(rede.find(0) == rede.find(4)); // false
                rede.union(2, 3);
                System.out.println(rede.find(0) == rede.find(4)); // true
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <numeric>
        #include <vector>
        using namespace std;

        class UnionFind {
            vector<int> pai, posto;
        public:
            explicit UnionFind(int n) : pai(n), posto(n, 0) {
                iota(pai.begin(), pai.end(), 0); // cada um no próprio grupo
            }

            int find(int x) {
                if (pai[x] != x) pai[x] = find(pai[x]); // compressão de caminho
                return pai[x];
            }

            bool unir(int a, int b) { // "union" é palavra reservada em C++
                int ra = find(a), rb = find(b);
                if (ra == rb) return false; // já estavam no mesmo grupo
                if (posto[ra] < posto[rb]) swap(ra, rb);
                pai[rb] = ra; // a árvore mais baixa fica embaixo
                if (posto[ra] == posto[rb]) posto[ra]++;
                return true;
            }
        };

        int main() {
            UnionFind rede(6); // 6 computadores
            rede.unir(0, 1);
            rede.unir(1, 2);
            rede.unir(3, 4);
            cout << boolalpha << (rede.find(0) == rede.find(2)) << "\n"; // true
            cout << boolalpha << (rede.find(0) == rede.find(4)) << "\n"; // false
            rede.unir(2, 3);
            cout << boolalpha << (rede.find(0) == rede.find(4)) << "\n"; // true
        }
      `,
    },
  },
  {
    id: 'avl-tree',
    name: 'Árvore AVL',
    difficulty: 'Avançado',
    en: { name: 'AVL Tree', summary: 'A search tree that rebalances itself with rotations, guaranteeing O(log n) height.' },
    facts: { 'Criada por': 'G. Adelson-Velsky e E. Landis', 'Ano': '1962', 'Regra': 'Alturas das subárvores diferem no máximo em 1' },
    summary: 'Árvore de busca que se reequilibra com rotações, garantindo altura O(log n).',
    description:
      'A Árvore AVL é uma árvore binária de busca autobalanceada: em cada nó, as alturas das subárvores esquerda e direita diferem no máximo em 1 — o fator de balanceamento fica entre −1 e +1. Quando uma inserção ou remoção quebra essa regra, a árvore se corrige com rotações, rearranjos locais que preservam a ordem. Assim, a altura nunca passa de cerca de 1,44·log₂ n, e busca, inserção e remoção ficam sempre em O(log n), mesmo quando os valores chegam já ordenados.',
    operations: [['buscar', 'O(log n)'], ['inserir', 'O(log n)'], ['remover', 'O(log n)'], ['percorrer em ordem', 'O(n)'], ['espaço', 'O(n)']],
    steps: [
      'Insira o valor como em uma árvore binária de busca comum.',
      'Na volta da recursão, atualize a altura de cada nó do caminho e calcule o fator de balanceamento (altura esquerda − altura direita).',
      'Fator +2 com o valor inserido à esquerda do filho esquerdo: rotação simples à direita (o caso espelhado usa rotação à esquerda).',
      'Fator +2 com o valor à direita do filho esquerdo: rotação dupla — à esquerda no filho e depois à direita no nó (e o espelho para −2).',
      'Depois da rotação, a subárvore volta à altura de antes da inserção, e o resto da árvore continua balanceado.',
    ],
    usedIn: ['Bancos de dados em memória', 'Índices com muitas consultas', 'Bibliotecas de coleções ordenadas', 'Sistemas com tempo de resposta garantido'],
    realWorld: [
      { title: 'Muitas leituras', text: 'Por ser balanceada de forma mais rígida que a árvore rubro-negra, a AVL tende a ter buscas um pouco mais rápidas — boa escolha quando há muito mais consultas do que alterações.' },
      { title: 'Dados que chegam ordenados', text: 'Registros inseridos em ordem cronológica, como logs e transações, transformariam uma BST simples em uma lista; a AVL mantém a altura logarítmica automaticamente.' },
      { title: 'Tempo garantido', text: 'Aplicações que precisam de um limite previsível para cada operação, como sistemas de tempo real, se beneficiam da garantia O(log n) mesmo no pior caso.' },
    ],
    curiosities: [
      'Foi a primeira árvore de busca autobalanceada, publicada em 1962 pelos soviéticos Georgy Adelson-Velsky e Evgenii Landis. O nome vem das iniciais dos dois.',
      'A árvore rubro-negra, mais usada em bibliotecas (std::map, TreeMap), é menos rígida: faz menos rotações nas inserções, mas pode ficar um pouco mais alta.',
      'Uma AVL de altura h com o menor número possível de nós segue uma recorrência parecida com a de Fibonacci — é daí que vem o fator de cerca de 1,44 na altura máxima.',
    ],
    code: {
      python: String.raw`
        class No:
            def __init__(self, valor):
                self.valor = valor
                self.esq = None
                self.dir = None
                self.altura = 1

        def altura(n):
            return n.altura if n else 0

        def atualizar(n):
            n.altura = 1 + max(altura(n.esq), altura(n.dir))

        def rot_direita(y):
            x = y.esq
            y.esq, x.dir = x.dir, y
            atualizar(y)
            atualizar(x)
            return x

        def rot_esquerda(x):
            y = x.dir
            x.dir, y.esq = y.esq, x
            atualizar(x)
            atualizar(y)
            return y

        def inserir(n, v):
            if n is None:
                return No(v)
            if v < n.valor:
                n.esq = inserir(n.esq, v)
            elif v > n.valor:
                n.dir = inserir(n.dir, v)
            else:
                return n
            atualizar(n)
            fator = altura(n.esq) - altura(n.dir)
            if fator > 1 and v < n.esq.valor:   # esquerda-esquerda
                return rot_direita(n)
            if fator < -1 and v > n.dir.valor:  # direita-direita
                return rot_esquerda(n)
            if fator > 1:                       # esquerda-direita
                n.esq = rot_esquerda(n.esq)
                return rot_direita(n)
            if fator < -1:                      # direita-esquerda
                n.dir = rot_direita(n.dir)
                return rot_esquerda(n)
            return n

        raiz = None
        for v in range(1, 8):  # 1, 2, ..., 7 em ordem: o pior caso de uma BST comum
            raiz = inserir(raiz, v)
        print("raiz:", raiz.valor, "| altura:", raiz.altura)  # raiz: 4 | altura: 3
      `,
      javascript: String.raw`
        class No {
          constructor(valor) {
            this.valor = valor;
            this.esq = null;
            this.dir = null;
            this.altura = 1;
          }
        }

        const altura = n => (n ? n.altura : 0);
        const atualizar = n => { n.altura = 1 + Math.max(altura(n.esq), altura(n.dir)); };

        function rotDireita(y) {
          const x = y.esq;
          y.esq = x.dir;
          x.dir = y;
          atualizar(y);
          atualizar(x);
          return x;
        }

        function rotEsquerda(x) {
          const y = x.dir;
          x.dir = y.esq;
          y.esq = x;
          atualizar(x);
          atualizar(y);
          return y;
        }

        function inserir(n, v) {
          if (!n) return new No(v);
          if (v < n.valor) n.esq = inserir(n.esq, v);
          else if (v > n.valor) n.dir = inserir(n.dir, v);
          else return n;
          atualizar(n);
          const fator = altura(n.esq) - altura(n.dir);
          if (fator > 1 && v < n.esq.valor) return rotDireita(n);   // esquerda-esquerda
          if (fator < -1 && v > n.dir.valor) return rotEsquerda(n); // direita-direita
          if (fator > 1) { n.esq = rotEsquerda(n.esq); return rotDireita(n); }  // esquerda-direita
          if (fator < -1) { n.dir = rotDireita(n.dir); return rotEsquerda(n); } // direita-esquerda
          return n;
        }

        let raiz = null;
        for (let v = 1; v <= 7; v++) raiz = inserir(raiz, v); // em ordem: o pior caso de uma BST comum
        console.log("raiz:", raiz.valor, "| altura:", raiz.altura); // raiz: 4 | altura: 3
      `,
      java: String.raw`
        public class ArvoreAVL {
            static class No {
                int valor, altura = 1;
                No esq, dir;
                No(int valor) { this.valor = valor; }
            }

            static int altura(No n) { return n == null ? 0 : n.altura; }

            static void atualizar(No n) { n.altura = 1 + Math.max(altura(n.esq), altura(n.dir)); }

            static No rotDireita(No y) {
                No x = y.esq;
                y.esq = x.dir;
                x.dir = y;
                atualizar(y);
                atualizar(x);
                return x;
            }

            static No rotEsquerda(No x) {
                No y = x.dir;
                x.dir = y.esq;
                y.esq = x;
                atualizar(x);
                atualizar(y);
                return y;
            }

            static No inserir(No n, int v) {
                if (n == null) return new No(v);
                if (v < n.valor) n.esq = inserir(n.esq, v);
                else if (v > n.valor) n.dir = inserir(n.dir, v);
                else return n;
                atualizar(n);
                int fator = altura(n.esq) - altura(n.dir);
                if (fator > 1 && v < n.esq.valor) return rotDireita(n);   // esquerda-esquerda
                if (fator < -1 && v > n.dir.valor) return rotEsquerda(n); // direita-direita
                if (fator > 1) { n.esq = rotEsquerda(n.esq); return rotDireita(n); }  // esquerda-direita
                if (fator < -1) { n.dir = rotDireita(n.dir); return rotEsquerda(n); } // direita-esquerda
                return n;
            }

            public static void main(String[] args) {
                No raiz = null;
                for (int v = 1; v <= 7; v++) raiz = inserir(raiz, v); // em ordem: o pior caso de uma BST comum
                System.out.println("raiz: " + raiz.valor + " | altura: " + raiz.altura); // raiz: 4 | altura: 3
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <iostream>
        using namespace std;

        struct No {
            int valor, altura = 1;
            No* esq = nullptr;
            No* dir = nullptr;
            explicit No(int v) : valor(v) {}
        };

        int altura(No* n) { return n ? n->altura : 0; }
        void atualizar(No* n) { n->altura = 1 + max(altura(n->esq), altura(n->dir)); }

        No* rotDireita(No* y) {
            No* x = y->esq;
            y->esq = x->dir;
            x->dir = y;
            atualizar(y);
            atualizar(x);
            return x;
        }

        No* rotEsquerda(No* x) {
            No* y = x->dir;
            x->dir = y->esq;
            y->esq = x;
            atualizar(x);
            atualizar(y);
            return y;
        }

        No* inserir(No* n, int v) {
            if (!n) return new No(v);
            if (v < n->valor) n->esq = inserir(n->esq, v);
            else if (v > n->valor) n->dir = inserir(n->dir, v);
            else return n;
            atualizar(n);
            int fator = altura(n->esq) - altura(n->dir);
            if (fator > 1 && v < n->esq->valor) return rotDireita(n);   // esquerda-esquerda
            if (fator < -1 && v > n->dir->valor) return rotEsquerda(n); // direita-direita
            if (fator > 1) { n->esq = rotEsquerda(n->esq); return rotDireita(n); }  // esquerda-direita
            if (fator < -1) { n->dir = rotDireita(n->dir); return rotEsquerda(n); } // direita-esquerda
            return n;
        }

        int main() {
            No* raiz = nullptr;
            for (int v = 1; v <= 7; v++) raiz = inserir(raiz, v); // em ordem: o pior caso de uma BST comum
            cout << "raiz: " << raiz->valor << " | altura: " << raiz->altura << "\n"; // raiz: 4 | altura: 3
        }
      `,
    },
  },
]
