export default [
  {
    id: 'lamport-clocks',
    name: 'Relógios de Lamport',
    difficulty: 'Intermediário',
    en: { name: 'Lamport Clocks', summary: 'Logical counters that order events in a distributed system consistently with causality, without synchronized physical clocks.' },
    facts: { 'Criado por': 'Leslie Lamport', 'Ano': '1978', 'Artigo': '"Time, Clocks, and the Ordering of Events in a Distributed System"', 'Garantia': 'a → b implica L(a) < L(b)', 'Prêmios': 'Prêmio Turing 2013' },
    summary: 'Contadores lógicos que ordenam os eventos de um sistema distribuído de forma coerente com a causalidade, sem relógios físicos sincronizados.',
    description:
      'Em um sistema distribuído, cada máquina tem seu próprio relógio, e eles nunca estão perfeitamente sincronizados — então "quem veio antes?" não pode ser respondido olhando os horários. Leslie Lamport propôs olhar para a causalidade: um evento a aconteceu antes de b (a → b) se eles ocorreram nessa ordem no mesmo processo, ou se a é o envio de uma mensagem e b o seu recebimento, ou por transitividade. Os relógios lógicos de Lamport são contadores simples: cada processo incrementa o seu antes de cada evento; toda mensagem leva o valor do contador de quem envia; ao receber, o processo ajusta o contador para max(próprio, recebido) + 1. Assim, se a → b, então L(a) < L(b). A recíproca não vale: dois eventos sem relação causal podem ter carimbos em qualquer ordem. Desempatando pelo número do processo, os carimbos definem uma ordem total coerente com a causalidade — suficiente, por exemplo, para implementar exclusão mútua distribuída.',
    complexity: { best: 'O(1) por evento', average: 'O(1) por evento', worst: 'O(1) por evento', space: 'O(1) por processo e por mensagem' },
    steps: [
      'Cada processo começa com C = 0.',
      'Antes de um evento local ou de um envio, faça C = C + 1.',
      'Toda mensagem enviada leva o valor atual de C.',
      'Ao receber uma mensagem com carimbo t, faça C = max(C, t) + 1.',
      'Para uma ordem total, compare (C, número do processo) — empates são resolvidos pelo processo.',
    ],
    usedIn: ['Exclusão mútua distribuída (algoritmo de Lamport)', 'Bancos de dados distribuídos e replicação', 'Ordenação de logs e depuração de sistemas distribuídos', 'Máquinas de estado replicadas', 'Base dos relógios vetoriais e dos relógios lógicos híbridos'],
    realWorld: [
      { title: 'Bancos de dados globais', text: 'Bancos como o CockroachDB usam relógios lógicos híbridos (HLC), que combinam o horário físico com um contador de Lamport, para ordenar transações entre servidores espalhados pelo mundo.' },
      { title: 'Depuração', text: 'Ferramentas de rastreamento distribuído ordenam os eventos de vários serviços por causalidade, em vez de confiar nos relógios das máquinas — que podem estar milissegundos (ou segundos) defasados.' },
      { title: 'Consenso', text: 'Protocolos como Paxos (também de Lamport) e Raft numeram propostas e mandatos com contadores lógicos, a mesma ideia de ordenar sem depender do tempo físico.' },
    ],
    curiosities: [
      'O artigo de 1978 é um dos mais citados da história da computação. Lamport conta que a ideia veio da teoria da relatividade: assim como no espaço-tempo, só faz sentido falar de "antes" quando um evento pode influenciar o outro.',
      'Leslie Lamport também criou o LaTeX, o sistema de edição usado em quase todos os artigos científicos de matemática e computação.',
      'Lamport recebeu o Prêmio Turing de 2013 por seus trabalhos fundamentais em sistemas distribuídos.',
    ],
    code: {
      python: String.raw`
        # (processo, tipo, mensagem): o recebimento indica qual mensagem chegou
        eventos = [("P1", "local", None), ("P1", "envia", "m1"), ("P2", "local", None),
                   ("P2", "recebe", "m1"), ("P2", "envia", "m2"), ("P3", "envia", "m3"),
                   ("P3", "recebe", "m2"), ("P1", "recebe", "m3"), ("P1", "local", None)]

        relogio = {"P1": 0, "P2": 0, "P3": 0}
        carimbo = {}                                   # mensagem → relógio de quem enviou
        for p, tipo, msg in eventos:
            if tipo == "recebe":
                relogio[p] = max(relogio[p], carimbo[msg]) + 1
            else:
                relogio[p] += 1
                if tipo == "envia":
                    carimbo[msg] = relogio[p]
            print(p, tipo, msg or "", relogio[p])
        # P1 local 1
        # P1 envia m1 2
        # P2 local 1
        # P2 recebe m1 3
        # P2 envia m2 4
        # P3 envia m3 1
        # P3 recebe m2 5
        # P1 recebe m3 3
        # P1 local 4
      `,
      javascript: String.raw`
        // [processo, tipo, mensagem]: o recebimento indica qual mensagem chegou
        const eventos = [["P1", "local"], ["P1", "envia", "m1"], ["P2", "local"],
                         ["P2", "recebe", "m1"], ["P2", "envia", "m2"], ["P3", "envia", "m3"],
                         ["P3", "recebe", "m2"], ["P1", "recebe", "m3"], ["P1", "local"]];

        const relogio = { P1: 0, P2: 0, P3: 0 }, carimbo = {}; // mensagem → relógio de quem enviou
        for (const [p, tipo, msg] of eventos) {
          if (tipo === "recebe") relogio[p] = Math.max(relogio[p], carimbo[msg]) + 1;
          else {
            relogio[p]++;
            if (tipo === "envia") carimbo[msg] = relogio[p];
          }
          console.log(p + " " + tipo + " " + (msg ?? "") + " " + relogio[p]);
        }
        // P1 local 1
        // P1 envia m1 2
        // P2 local 1
        // P2 recebe m1 3
        // P2 envia m2 4
        // P3 envia m3 1
        // P3 recebe m2 5
        // P1 recebe m3 3
        // P1 local 4
      `,
      java: String.raw`
        import java.util.HashMap;
        import java.util.Map;

        public class RelogiosDeLamport {
            public static void main(String[] args) {
                // {processo, tipo, mensagem}: o recebimento indica qual mensagem chegou
                String[][] eventos = {{"P1", "local", ""}, {"P1", "envia", "m1"}, {"P2", "local", ""},
                    {"P2", "recebe", "m1"}, {"P2", "envia", "m2"}, {"P3", "envia", "m3"},
                    {"P3", "recebe", "m2"}, {"P1", "recebe", "m3"}, {"P1", "local", ""}};
                Map<String, Integer> relogio = new HashMap<>(Map.of("P1", 0, "P2", 0, "P3", 0));
                Map<String, Integer> carimbo = new HashMap<>(); // mensagem → relógio de quem enviou
                for (String[] e : eventos) {
                    String p = e[0], tipo = e[1], msg = e[2];
                    if (tipo.equals("recebe")) relogio.put(p, Math.max(relogio.get(p), carimbo.get(msg)) + 1);
                    else {
                        relogio.merge(p, 1, Integer::sum);
                        if (tipo.equals("envia")) carimbo.put(msg, relogio.get(p));
                    }
                    System.out.println(p + " " + tipo + " " + msg + " " + relogio.get(p));
                }
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <cstdio>
        #include <map>
        #include <string>
        #include <vector>
        using namespace std;

        struct Evento { string p, tipo, msg; };

        int main() {
            // o recebimento indica qual mensagem chegou
            vector<Evento> eventos = {{"P1", "local", ""}, {"P1", "envia", "m1"}, {"P2", "local", ""},
                {"P2", "recebe", "m1"}, {"P2", "envia", "m2"}, {"P3", "envia", "m3"},
                {"P3", "recebe", "m2"}, {"P1", "recebe", "m3"}, {"P1", "local", ""}};
            map<string, int> relogio = {{"P1", 0}, {"P2", 0}, {"P3", 0}}, carimbo; // carimbo: mensagem → relógio
            for (auto& e : eventos) {
                if (e.tipo == "recebe") relogio[e.p] = max(relogio[e.p], carimbo[e.msg]) + 1;
                else {
                    relogio[e.p]++;
                    if (e.tipo == "envia") carimbo[e.msg] = relogio[e.p];
                }
                printf("%s %s %s %d\n", e.p.c_str(), e.tipo.c_str(), e.msg.c_str(), relogio[e.p]);
            }
        }
      `,
    },
  },
  {
    id: 'vector-clocks',
    name: 'Relógios Vetoriais',
    difficulty: 'Intermediário',
    en: { name: 'Vector Clocks', summary: 'One counter per process in every timestamp: comparing two vectors tells exactly whether one event caused the other or they were concurrent.' },
    facts: { 'Criado por': 'Colin Fidge e Friedemann Mattern (independentemente)', 'Ano': '1988', 'Garantia': 'a → b se e somente se V(a) < V(b)', 'Custo': 'O(n) por mensagem (n processos)', 'Variantes': 'Version vectors, dotted version vectors' },
    summary: 'Um contador por processo em cada carimbo: comparar dois vetores diz exatamente se um evento causou o outro ou se foram concorrentes.',
    description:
      'Os relógios de Lamport garantem que a → b implica L(a) < L(b), mas não o contrário: olhando dois carimbos, não dá para saber se um evento influenciou o outro. Os relógios vetoriais resolvem isso guardando um contador para cada processo. Cada processo incrementa a própria posição a cada evento; as mensagens levam o vetor inteiro; ao receber, o processo faz o máximo posição a posição entre o seu vetor e o recebido e, então, incrementa a própria posição. A posição j do vetor de um evento diz quantos eventos do processo j ele "conhece". Com isso, a → b exatamente quando V(a) ≤ V(b) em todas as posições e são diferentes; se nenhum dos dois é menor ou igual ao outro, os eventos são concorrentes — nenhum pode ter causado o outro. O preço é o tamanho: cada carimbo tem uma entrada por processo.',
    complexity: { best: 'O(n) por evento', average: 'O(n) por evento', worst: 'O(n) por evento', space: 'O(n) por processo e por mensagem' },
    steps: [
      'Cada processo i começa com o vetor V = [0, 0, …, 0].',
      'Antes de um evento local ou de um envio, faça V[i] = V[i] + 1.',
      'Toda mensagem leva o vetor atual.',
      'Ao receber o vetor W: V[k] = max(V[k], W[k]) para todo k, e depois V[i] = V[i] + 1.',
      'Compare: a → b se V(a) ≤ V(b) em todas as posições e V(a) ≠ V(b); se nenhum é menor que o outro, a e b são concorrentes.',
    ],
    usedIn: ['Bancos chave-valor com replicação (Dynamo, Riak, Voldemort)', 'Detecção de conflitos em sincronização de arquivos', 'Depuração e verificação de sistemas distribuídos', 'Snapshots e checkpoints consistentes', 'CRDTs (tipos de dados replicados sem conflito)'],
    realWorld: [
      { title: 'Amazon Dynamo', text: 'O artigo do Dynamo (2007) descreve o uso de relógios vetoriais para versionar o carrinho de compras: se duas réplicas recebem atualizações concorrentes, os vetores revelam o conflito, e as versões são reconciliadas em vez de uma sobrescrever a outra.' },
      { title: 'Sincronização de arquivos', text: 'Ferramentas que sincronizam arquivos entre vários aparelhos usam vetores de versão para saber se uma cópia é simplesmente mais nova ou se houve edições concorrentes — o caso que gera "cópias em conflito".' },
      { title: 'Edição colaborativa', text: 'CRDTs, usados em editores colaborativos e aplicativos offline, usam carimbos vetoriais (ou variantes compactas) para mesclar alterações feitas ao mesmo tempo sem perder nenhuma.' },
    ],
    curiosities: [
      'Colin Fidge e Friedemann Mattern publicaram a ideia de forma independente em 1988, dez anos depois dos relógios de Lamport.',
      'Charron-Bost provou em 1991 que nenhum carimbo com menos de n entradas consegue capturar exatamente a causalidade em todos os casos — o tamanho dos relógios vetoriais é inevitável.',
      'No visualizador, o par destacado em vermelho é concorrente: seus vetores não são comparáveis, embora os relógios de Lamport atribuam a eles números diferentes.',
    ],
    code: {
      python: String.raw`
        eventos = [("P1", "local", None), ("P1", "envia", "m1"), ("P2", "local", None),
                   ("P2", "recebe", "m1"), ("P2", "envia", "m2"), ("P3", "envia", "m3"),
                   ("P3", "recebe", "m2"), ("P1", "recebe", "m3"), ("P1", "local", None)]
        indice = {"P1": 0, "P2": 1, "P3": 2}
        V = {p: [0, 0, 0] for p in indice}
        carimbo, historico = {}, []
        for p, tipo, msg in eventos:
            i = indice[p]
            if tipo == "recebe":
                V[p] = [max(a, b) for a, b in zip(V[p], carimbo[msg])]   # máximo posição a posição
            V[p][i] += 1
            if tipo == "envia":
                carimbo[msg] = list(V[p])
            historico.append(list(V[p]))
            print(p, tipo, msg or "", V[p])
        # P1 local [1, 0, 0]
        # P1 envia m1 [2, 0, 0]
        # P2 local [0, 1, 0]
        # P2 recebe m1 [2, 2, 0]
        # P2 envia m2 [2, 3, 0]
        # P3 envia m3 [0, 0, 1]
        # P3 recebe m2 [2, 3, 2]
        # P1 recebe m3 [3, 0, 1]
        # P1 local [4, 0, 1]

        def antes(a, b):
            return all(x <= y for x, y in zip(a, b)) and a != b

        a, b = historico[2], historico[5]     # P2 local e P3 envia m3
        print("concorrentes" if not antes(a, b) and not antes(b, a) else "relacionados")   # concorrentes
        print("aconteceu antes" if antes(historico[1], historico[6]) else "não")          # aconteceu antes
      `,
      javascript: String.raw`
        const eventos = [["P1", "local"], ["P1", "envia", "m1"], ["P2", "local"],
                         ["P2", "recebe", "m1"], ["P2", "envia", "m2"], ["P3", "envia", "m3"],
                         ["P3", "recebe", "m2"], ["P1", "recebe", "m3"], ["P1", "local"]];
        const indice = { P1: 0, P2: 1, P3: 2 };
        const V = { P1: [0, 0, 0], P2: [0, 0, 0], P3: [0, 0, 0] }, carimbo = {}, historico = [];
        for (const [p, tipo, msg] of eventos) {
          if (tipo === "recebe") V[p] = V[p].map((x, k) => Math.max(x, carimbo[msg][k])); // máximo posição a posição
          V[p][indice[p]]++;
          if (tipo === "envia") carimbo[msg] = [...V[p]];
          historico.push([...V[p]]);
          console.log(p + " " + tipo + " " + (msg ?? "") + " [" + V[p].join(", ") + "]");
        }
        // P1 local [1, 0, 0]
        // P1 envia m1 [2, 0, 0]
        // P2 local [0, 1, 0]
        // P2 recebe m1 [2, 2, 0]
        // P2 envia m2 [2, 3, 0]
        // P3 envia m3 [0, 0, 1]
        // P3 recebe m2 [2, 3, 2]
        // P1 recebe m3 [3, 0, 1]
        // P1 local [4, 0, 1]

        const antes = (a, b) => a.every((x, k) => x <= b[k]) && a.some((x, k) => x < b[k]);
        const [a, b] = [historico[2], historico[5]]; // P2 local e P3 envia m3
        console.log(!antes(a, b) && !antes(b, a) ? "concorrentes" : "relacionados");       // concorrentes
        console.log(antes(historico[1], historico[6]) ? "aconteceu antes" : "não");         // aconteceu antes
      `,
      java: String.raw`
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.HashMap;
        import java.util.List;
        import java.util.Map;

        public class RelogiosVetoriais {
            static boolean antes(int[] a, int[] b) {
                boolean menor = false;
                for (int k = 0; k < a.length; k++) { if (a[k] > b[k]) return false; if (a[k] < b[k]) menor = true; }
                return menor;
            }

            public static void main(String[] args) {
                String[][] eventos = {{"P1", "local", ""}, {"P1", "envia", "m1"}, {"P2", "local", ""},
                    {"P2", "recebe", "m1"}, {"P2", "envia", "m2"}, {"P3", "envia", "m3"},
                    {"P3", "recebe", "m2"}, {"P1", "recebe", "m3"}, {"P1", "local", ""}};
                int[][] V = new int[3][3];
                Map<String, int[]> carimbo = new HashMap<>();
                List<int[]> historico = new ArrayList<>();
                for (String[] e : eventos) {
                    int i = e[0].charAt(1) - '1';
                    if (e[1].equals("recebe")) for (int k = 0; k < 3; k++) V[i][k] = Math.max(V[i][k], carimbo.get(e[2])[k]); // máximo
                    V[i][i]++;
                    if (e[1].equals("envia")) carimbo.put(e[2], V[i].clone());
                    historico.add(V[i].clone());
                    System.out.println(e[0] + " " + e[1] + " " + e[2] + " " + Arrays.toString(V[i]));
                }
                int[] a = historico.get(2), b = historico.get(5); // P2 local e P3 envia m3
                System.out.println(!antes(a, b) && !antes(b, a) ? "concorrentes" : "relacionados");          // concorrentes
                System.out.println(antes(historico.get(1), historico.get(6)) ? "aconteceu antes" : "não");    // aconteceu antes
            }
        }
      `,
      cpp: String.raw`
        #include <algorithm>
        #include <array>
        #include <cstdio>
        #include <map>
        #include <string>
        #include <vector>
        using namespace std;

        using Vetor = array<int, 3>;

        bool antes(const Vetor& a, const Vetor& b) {
            bool menor = false;
            for (int k = 0; k < 3; k++) { if (a[k] > b[k]) return false; if (a[k] < b[k]) menor = true; }
            return menor;
        }

        int main() {
            vector<array<string, 3>> eventos = {{"P1", "local", ""}, {"P1", "envia", "m1"}, {"P2", "local", ""},
                {"P2", "recebe", "m1"}, {"P2", "envia", "m2"}, {"P3", "envia", "m3"},
                {"P3", "recebe", "m2"}, {"P1", "recebe", "m3"}, {"P1", "local", ""}};
            Vetor V[3] = {};
            map<string, Vetor> carimbo;
            vector<Vetor> historico;
            for (auto& e : eventos) {
                int i = e[0][1] - '1';
                if (e[1] == "recebe") for (int k = 0; k < 3; k++) V[i][k] = max(V[i][k], carimbo[e[2]][k]); // máximo
                V[i][i]++;
                if (e[1] == "envia") carimbo[e[2]] = V[i];
                historico.push_back(V[i]);
                printf("%s %s %s [%d, %d, %d]\n", e[0].c_str(), e[1].c_str(), e[2].c_str(), V[i][0], V[i][1], V[i][2]);
            }
            Vetor a = historico[2], b = historico[5]; // P2 local e P3 envia m3
            printf("%s\n", !antes(a, b) && !antes(b, a) ? "concorrentes" : "relacionados");        // concorrentes
            printf("%s\n", antes(historico[1], historico[6]) ? "aconteceu antes" : "não");          // aconteceu antes
        }
      `,
    },
  },
  {
    id: 'chandy-lamport',
    name: 'Snapshot de Chandy-Lamport',
    difficulty: 'Avançado',
    en: { name: 'Chandy-Lamport Snapshot', summary: "Records a consistent global state of a running distributed system — every process's state plus the messages in transit — using marker messages." },
    facts: { 'Criado por': 'K. Mani Chandy e Leslie Lamport', 'Ano': '1985', 'Requisito': 'Canais FIFO e confiáveis', 'Garantia': 'Corte consistente (estado global possível)', 'Usado em': 'Checkpoints, Apache Flink, detecção de deadlock' },
    summary: 'Grava um estado global consistente de um sistema distribuído em funcionamento — o estado de cada processo e as mensagens em trânsito — usando mensagens marcadoras.',
    description:
      'Fotografar um sistema distribuído é difícil: não há um instante global, e se cada processo gravar seu estado em um momento qualquer, a "foto" pode ser absurda — por exemplo, mostrar dinheiro recebido que nunca foi enviado. O algoritmo de Chandy-Lamport grava um estado global consistente sem parar o sistema, supondo canais FIFO. Um processo inicia gravando o próprio estado e enviando um marcador por cada canal de saída. Quando um processo recebe um marcador pela primeira vez, ele grava o seu estado, registra como vazio o canal por onde o marcador chegou, envia marcadores por todos os seus canais de saída e começa a gravar as mensagens que chegarem pelos outros canais de entrada. Ao receber o marcador por um desses outros canais, para de gravá-lo: o que foi gravado é o conteúdo "em trânsito" daquele canal. Quando todos os marcadores chegam, o conjunto forma um estado que o sistema poderia ter atravessado.',
    complexity: { best: 'O(canais) mensagens marcadoras', average: 'O(canais)', worst: 'O(canais)', space: 'O(estados + mensagens em trânsito)' },
    steps: [
      'O iniciador grava o próprio estado, envia um marcador por cada canal de saída e começa a gravar todos os canais de entrada.',
      'Ao receber o primeiro marcador (pelo canal c): grave o próprio estado, registre c como vazio, envie marcadores por todos os canais de saída e comece a gravar os demais canais de entrada.',
      'Mensagens comuns que chegam por um canal sendo gravado entram no estado desse canal ("em trânsito").',
      'Ao receber um marcador por um canal que estava sendo gravado, pare de gravá-lo.',
      'Quando todo processo gravou seu estado e todo canal recebeu seu marcador, o snapshot está completo.',
    ],
    usedIn: ['Checkpoints de processamento de fluxo (Apache Flink)', 'Recuperação de falhas em sistemas distribuídos', 'Detecção de deadlock e de término', 'Depuração e coleta de lixo distribuída', 'Auditoria de sistemas financeiros distribuídos'],
    realWorld: [
      { title: 'Apache Flink', text: 'O Flink, usado para processar fluxos de dados em tempo real, tira checkpoints com uma variante do Chandy-Lamport: "barreiras" (marcadores) fluem junto com os dados, e cada operador salva seu estado ao recebê-las. Se uma máquina cai, tudo volta ao último snapshot consistente.' },
      { title: 'Detectar quando acabou', text: 'Em computações distribuídas, saber se o trabalho terminou exige saber se todos estão parados e não há mensagens em trânsito — exatamente a informação que um snapshot consistente fornece.' },
      { title: 'Deadlocks', text: 'Para detectar um impasse entre processos que esperam uns pelos outros, basta um snapshot consistente do grafo de espera; um ciclo nele indica deadlock.' },
    ],
    curiosities: [
      'Lamport conta que a ideia surgiu quando Chandy chegou à sua casa e explicou o problema; ele estava com a solução quase pronta no dia seguinte — o difícil foi convencer-se de que estava correta.',
      'No exemplo bancário do visualizador, os saldos gravados mais o dinheiro em trânsito sempre somam os R$ 300 iniciais, embora cada agência tenha gravado em um momento diferente.',
      'O estado gravado pode nunca ter existido de fato em nenhum instante, mas é garantidamente "possível": existe uma ordem válida dos eventos que passa por ele.',
    ],
    code: {
      python: String.raw`
        from collections import deque

        saldo = [100, 100, 100]
        canais = {(i, j): deque() for i in range(3) for j in range(3) if i != j}   # canais FIFO
        gravado = [None] * 3
        gravando, em_transito = {}, {}

        def gravar(p):
            gravado[p] = saldo[p]
            for q in range(3):
                if q != p:
                    canais[(p, q)].append("MARCADOR")   # marcador em cada canal de saída
                    gravando[(q, p)] = []               # começa a gravar os canais de entrada

        def enviar(de, para, valor):
            saldo[de] -= valor
            canais[(de, para)].append(valor)

        def entregar(de, para):
            item = canais[(de, para)].popleft()
            if item == "MARCADOR":
                if gravado[para] is None:
                    gravar(para)                        # primeiro marcador: grava o estado
                em_transito[(de, para)] = gravando.pop((de, para))
            else:
                saldo[para] += item
                if (de, para) in gravando:
                    gravando[(de, para)].append(item)   # estava em trânsito durante a foto

        enviar(0, 1, 10); enviar(1, 2, 20)
        gravar(0)                                       # P1 inicia o snapshot
        enviar(2, 0, 30)
        for de, para in [(0, 1), (0, 1), (2, 0), (1, 2), (0, 2), (1, 0), (1, 2), (2, 0), (2, 1)]:
            entregar(de, para)

        print("estados:", gravado)                                          # estados: [90, 90, 90]
        print("em trânsito:", {f"P{a + 1}->P{b + 1}": v for (a, b), v in sorted(em_transito.items()) if v})  # {'P3->P1': [30]}
        print("total:", sum(gravado) + sum(sum(v) for v in em_transito.values()))   # total: 300
      `,
      javascript: String.raw`
        const saldo = [100, 100, 100], gravado = [null, null, null];
        const canais = {}, gravando = {}, emTransito = {};
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) canais[i + ">" + j] = []; // canais FIFO

        function gravar(p) {
          gravado[p] = saldo[p];
          for (let q = 0; q < 3; q++) if (q !== p) {
            canais[p + ">" + q].push("MARCADOR"); // marcador em cada canal de saída
            gravando[q + ">" + p] = [];           // começa a gravar os canais de entrada
          }
        }
        function enviar(de, para, valor) { saldo[de] -= valor; canais[de + ">" + para].push(valor); }
        function entregar(de, para) {
          const chave = de + ">" + para, item = canais[chave].shift();
          if (item === "MARCADOR") {
            if (gravado[para] === null) gravar(para); // primeiro marcador: grava o estado
            emTransito[chave] = gravando[chave];
            delete gravando[chave];
          } else {
            saldo[para] += item;
            if (gravando[chave]) gravando[chave].push(item); // estava em trânsito durante a foto
          }
        }

        enviar(0, 1, 10); enviar(1, 2, 20);
        gravar(0); // P1 inicia o snapshot
        enviar(2, 0, 30);
        for (const [de, para] of [[0, 1], [0, 1], [2, 0], [1, 2], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1]]) entregar(de, para);

        console.log("estados: " + gravado.join(", "));                                                  // estados: 90, 90, 90
        for (const [chave, v] of Object.entries(emTransito)) if (v.length) console.log("em trânsito " + chave + ": " + v.join(", ")); // em trânsito 2>0: 30
        console.log("total: " + (gravado.reduce((a, b) => a + b) + Object.values(emTransito).flat().reduce((a, b) => a + b, 0))); // total: 300
      `,
      java: String.raw`
        import java.util.ArrayDeque;
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;
        import java.util.Map;
        import java.util.TreeMap;

        public class ChandyLamport {
            static final int MARCADOR = -1;
            static int[] saldo = {100, 100, 100};
            static Integer[] gravado = new Integer[3];
            static Map<String, ArrayDeque<Integer>> canais = new TreeMap<>(); // canais FIFO
            static Map<String, List<Integer>> gravando = new TreeMap<>(), emTransito = new TreeMap<>();

            static void gravar(int p) {
                gravado[p] = saldo[p];
                for (int q = 0; q < 3; q++) if (q != p) {
                    canais.get(p + ">" + q).add(MARCADOR);  // marcador em cada canal de saída
                    gravando.put(q + ">" + p, new ArrayList<>()); // começa a gravar os canais de entrada
                }
            }

            static void enviar(int de, int para, int valor) { saldo[de] -= valor; canais.get(de + ">" + para).add(valor); }

            static void entregar(int de, int para) {
                String chave = de + ">" + para;
                int item = canais.get(chave).poll();
                if (item == MARCADOR) {
                    if (gravado[para] == null) gravar(para);  // primeiro marcador: grava o estado
                    emTransito.put(chave, gravando.remove(chave));
                } else {
                    saldo[para] += item;
                    if (gravando.containsKey(chave)) gravando.get(chave).add(item); // estava em trânsito
                }
            }

            public static void main(String[] args) {
                for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) if (i != j) canais.put(i + ">" + j, new ArrayDeque<>());
                enviar(0, 1, 10); enviar(1, 2, 20);
                gravar(0); // P1 inicia o snapshot
                enviar(2, 0, 30);
                int[][] entregas = {{0, 1}, {0, 1}, {2, 0}, {1, 2}, {0, 2}, {1, 0}, {1, 2}, {2, 0}, {2, 1}};
                for (int[] e : entregas) entregar(e[0], e[1]);

                System.out.println("estados: " + Arrays.toString(gravado)); // estados: [90, 90, 90]
                int total = gravado[0] + gravado[1] + gravado[2];
                for (var e : emTransito.entrySet()) {
                    if (!e.getValue().isEmpty()) System.out.println("em trânsito " + e.getKey() + ": " + e.getValue()); // em trânsito 2>0: [30]
                    for (int v : e.getValue()) total += v;
                }
                System.out.println("total: " + total); // total: 300
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <deque>
        #include <map>
        #include <utility>
        #include <vector>
        using namespace std;

        const int MARCADOR = -1;
        int saldo[3] = {100, 100, 100}, gravado[3] = {-1, -1, -1};
        map<pair<int, int>, deque<int>> canais; // canais FIFO
        map<pair<int, int>, vector<int>> gravando, emTransito;

        void gravar(int p) {
            gravado[p] = saldo[p];
            for (int q = 0; q < 3; q++) if (q != p) {
                canais[{p, q}].push_back(MARCADOR); // marcador em cada canal de saída
                gravando[{q, p}] = {};              // começa a gravar os canais de entrada
            }
        }

        void enviar(int de, int para, int valor) { saldo[de] -= valor; canais[{de, para}].push_back(valor); }

        void entregar(int de, int para) {
            int item = canais[{de, para}].front();
            canais[{de, para}].pop_front();
            if (item == MARCADOR) {
                if (gravado[para] < 0) gravar(para); // primeiro marcador: grava o estado
                emTransito[{de, para}] = gravando[{de, para}];
                gravando.erase({de, para});
            } else {
                saldo[para] += item;
                auto it = gravando.find({de, para});
                if (it != gravando.end()) it->second.push_back(item); // estava em trânsito durante a foto
            }
        }

        int main() {
            enviar(0, 1, 10); enviar(1, 2, 20);
            gravar(0); // P1 inicia o snapshot
            enviar(2, 0, 30);
            for (auto [de, para] : vector<pair<int, int>>{{0, 1}, {0, 1}, {2, 0}, {1, 2}, {0, 2}, {1, 0}, {1, 2}, {2, 0}, {2, 1}}) entregar(de, para);

            printf("estados: %d %d %d\n", gravado[0], gravado[1], gravado[2]); // estados: 90 90 90
            int total = gravado[0] + gravado[1] + gravado[2];
            for (auto& [canal, v] : emTransito)
                for (int x : v) { printf("em trânsito P%d->P%d: %d\n", canal.first + 1, canal.second + 1, x); total += x; } // P3->P1: 30
            printf("total: %d\n", total); // total: 300
        }
      `,
    },
  },
]
