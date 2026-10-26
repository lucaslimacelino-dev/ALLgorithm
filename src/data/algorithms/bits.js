export default [
  {
    id: 'parity-bit',
    name: 'Bit de Paridade',
    difficulty: 'Iniciante',
    en: { name: 'Parity Bit', summary: 'Adds one bit so the number of 1s is even — the simplest way to detect a single transmission error.' },
    facts: { 'Tipo': 'Detecção de erros', 'Redundância': '1 bit', 'Detecta': 'Qualquer número ímpar de bits trocados', 'Não detecta': 'Dois (ou um número par de) bits trocados', 'Usado em': 'Memória, porta serial, RAID 5' },
    summary: 'Acrescenta um bit para que o número de 1s seja par — a forma mais simples de detectar um erro de transmissão.',
    description:
      'Quando dados viajam por um cabo ou ficam guardados na memória, um ruído pode inverter um bit. O bit de paridade é a proteção mais simples: antes de enviar, conta-se quantos bits 1 há nos dados e acrescenta-se um bit extra para que o total seja par (paridade par) ou ímpar (paridade ímpar). Quem recebe conta de novo: se a paridade não bater, houve erro. O custo é de apenas um bit, e o cálculo é um XOR de todos os bits. A limitação é que, se dois bits forem trocados, a paridade volta a bater e o erro passa despercebido; além disso, a paridade não diz qual bit errou, então só permite detectar, não corrigir. Combinando várias paridades sobre grupos diferentes de bits, chega-se ao código de Hamming, que localiza e corrige o erro.',
    complexity: { best: 'O(n)', average: 'O(n) — um XOR por bit', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Conte os bits 1 dos dados (ou faça o XOR de todos eles).',
      'Paridade par: o bit extra é 1 se a contagem for ímpar, e 0 se for par.',
      'Transmita os dados junto com o bit de paridade.',
      'O receptor faz o XOR de todos os bits recebidos (inclusive o de paridade).',
      'Resultado 0: nenhum erro detectado. Resultado 1: houve um número ímpar de bits trocados.',
    ],
    usedIn: ['Comunicação serial (UART, RS-232)', 'Memória RAM com paridade', 'RAID 5 e RAID 6 (paridade entre discos)', 'Barramentos de computadores (PCI, SCSI)', 'Códigos de barras e números de identificação (dígitos verificadores)'],
    realWorld: [
      { title: 'RAID 5', text: 'Em um arranjo RAID 5, um disco guarda a paridade (XOR) dos blocos dos outros. Se um disco quebra, cada bloco perdido é reconstruído fazendo o XOR dos demais — a paridade não só detecta, como recupera, porque se sabe qual disco falhou.' },
      { title: 'Porta serial', text: 'Na comunicação serial clássica (configurações como "8E1" ou "7O1"), cada caractere pode ser seguido de um bit de paridade par (E) ou ímpar (O).' },
      { title: 'Dígitos verificadores', text: 'CPF, cartões de crédito (algoritmo de Luhn) e códigos de barras usam dígitos verificadores, uma ideia parecida em base 10: um dígito calculado a partir dos outros que denuncia erros de digitação.' },
    ],
    curiosities: [
      'Os primeiros computadores a usar memória com paridade apareceram nos anos 1950; o IBM PC original (1981) tinha um bit de paridade para cada byte de RAM.',
      'Raios cósmicos podem inverter bits da memória — por isso servidores usam memória ECC, que vai além da paridade e corrige erros de um bit.',
      'A paridade de um número é calculada em um único ciclo por muitos processadores (instruções como POPCNT ou a flag de paridade do x86).',
    ],
    code: {
      python: String.raw`
        def paridade(bits):                        # paridade par: XOR de todos os bits
            p = 0
            for b in bits:
                p ^= int(b)
            return p

        dados = "1011001"
        enviado = dados + str(paridade(dados))
        print("enviado:", enviado)                 # enviado: 10110010
        recebido = enviado[:2] + ("0" if enviado[2] == "1" else "1") + enviado[3:]   # inverte o 3º bit
        print("ok" if paridade(enviado) == 0 else "erro")    # ok
        print("ok" if paridade(recebido) == 0 else "erro")   # erro
      `,
      javascript: String.raw`
        const paridade = bits => [...bits].reduce((p, b) => p ^ Number(b), 0); // paridade par: XOR de todos os bits

        const dados = "1011001";
        const enviado = dados + paridade(dados);
        console.log("enviado: " + enviado); // enviado: 10110010
        const recebido = enviado.slice(0, 2) + (enviado[2] === "1" ? "0" : "1") + enviado.slice(3); // inverte o 3º bit
        console.log(paridade(enviado) === 0 ? "ok" : "erro");  // ok
        console.log(paridade(recebido) === 0 ? "ok" : "erro"); // erro
      `,
      java: String.raw`
        public class Paridade {
            static int paridade(String bits) { // paridade par: XOR de todos os bits
                int p = 0;
                for (char b : bits.toCharArray()) p ^= b - '0';
                return p;
            }

            public static void main(String[] args) {
                String dados = "1011001";
                String enviado = dados + paridade(dados);
                System.out.println("enviado: " + enviado); // enviado: 10110010
                char[] r = enviado.toCharArray();
                r[2] = r[2] == '1' ? '0' : '1';            // inverte o 3º bit
                String recebido = new String(r);
                System.out.println(paridade(enviado) == 0 ? "ok" : "erro");  // ok
                System.out.println(paridade(recebido) == 0 ? "ok" : "erro"); // erro
            }
        }
      `,
      cpp: String.raw`
        #include <iostream>
        #include <string>
        using namespace std;

        int paridade(const string& bits) { // paridade par: XOR de todos os bits
            int p = 0;
            for (char b : bits) p ^= b - '0';
            return p;
        }

        int main() {
            string dados = "1011001";
            string enviado = dados + to_string(paridade(dados));
            cout << "enviado: " << enviado << "\n"; // enviado: 10110010
            string recebido = enviado;
            recebido[2] = recebido[2] == '1' ? '0' : '1'; // inverte o 3º bit
            cout << (paridade(enviado) == 0 ? "ok" : "erro") << "\n";  // ok
            cout << (paridade(recebido) == 0 ? "ok" : "erro") << "\n"; // erro
        }
      `,
    },
  },
  {
    id: 'xor-swap',
    name: 'Troca com XOR (XOR Swap)',
    difficulty: 'Iniciante',
    en: { name: 'XOR Swap', summary: 'Swaps two variables without a temporary one using three XORs — a classic trick, and a lesson in why clever is not always better.' },
    facts: { 'Operações': '3 XORs', 'Memória extra': 'Nenhuma', 'Armadilha': 'Falha se as duas variáveis forem a mesma', 'Na prática': 'Mais lento que usar uma variável temporária' },
    summary: 'Troca duas variáveis sem usar uma terceira, com três XORs — um truque clássico, e uma lição de que esperteza nem sempre é melhor.',
    description:
      'O XOR (ou exclusivo) tem propriedades especiais: x ⊕ x = 0, x ⊕ 0 = x, e a ordem não importa. Com elas, dá para trocar o conteúdo de duas variáveis sem uma variável temporária: a ← a ⊕ b; b ← a ⊕ b; a ← a ⊕ b. Depois do primeiro passo, a guarda a "diferença" bit a bit entre os dois valores; no segundo, b recebe (a ⊕ b) ⊕ b = a; no terceiro, a recebe (a ⊕ b) ⊕ a = b. O truque fazia sentido em máquinas com pouquíssimos registradores. Hoje, porém, ele é uma curiosidade: compiladores fazem trocas com registradores ou instruções próprias (como XCHG), e os três XORs dependem um do outro, o que impede o processador de executá-los em paralelo. Além disso, se as duas referências apontarem para a mesma posição de memória, o primeiro XOR zera o valor.',
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1) — nenhuma variável extra' },
    steps: [
      'a ← a ⊕ b: a passa a guardar os bits em que a e b diferem.',
      'b ← a ⊕ b: como (a ⊕ b) ⊕ b = a, b recebe o valor original de a.',
      'a ← a ⊕ b: como (a ⊕ b) ⊕ a = b, a recebe o valor original de b.',
      'Verifique antes se a e b não são a mesma variável — senão, o resultado é zero.',
    ],
    usedIn: ['Programação de microcontroladores com poucos registradores (histórico)', 'Desafios e entrevistas de programação', 'Ensino de operações bit a bit', 'Listas ligadas XOR (economia de memória)', 'Algoritmos que usam XOR como "diferença" (paridade, RAID)'],
    realWorld: [
      { title: 'Lista ligada XOR', text: 'A mesma ideia permite uma lista duplamente ligada com um único ponteiro por nó: guarda-se anterior ⊕ próximo, e quem percorre a lista, sabendo de onde veio, recupera o outro endereço.' },
      { title: 'Por que compiladores não usam', text: 'Compiladores modernos simplesmente renomeiam registradores ou usam uma instrução de troca. Escrever o XOR swap em C pode até atrapalhar as otimizações.' },
      { title: 'A mesma álgebra no RAID', text: 'O XOR que "esconde" um valor dentro de outro é o mesmo que permite reconstruir um disco perdido no RAID 5: sabendo a paridade e todos os outros blocos, o que falta sai de um XOR.' },
    ],
    curiosities: [
      'Também dá para trocar sem variável temporária com somas (a ← a + b; b ← a − b; a ← a − b), mas isso pode estourar o limite de inteiros; o XOR nunca estoura.',
      'Em Python, JavaScript moderno e muitas outras linguagens, a troca idiomática é a, b = b, a — clara e eficiente.',
      'O truque aparece em uma nota do relatório HAKMEM, do MIT (1972), uma coleção famosa de truques de programação.',
    ],
    code: {
      python: String.raw`
        a, b = 5, 9
        a ^= b      # a = a ⊕ b
        b ^= a      # b = (a ⊕ b) ⊕ b = a original
        a ^= b      # a = (a ⊕ b) ⊕ a = b original
        print(a, b)                  # 9 5
        # Em Python, a forma idiomática é simplesmente: a, b = b, a
      `,
      javascript: String.raw`
        let a = 5, b = 9;
        a ^= b; // a = a ⊕ b
        b ^= a; // b = (a ⊕ b) ⊕ b = a original
        a ^= b; // a = (a ⊕ b) ⊕ a = b original
        console.log(a + " " + b); // 9 5
        // Em JavaScript moderno: [a, b] = [b, a]
      `,
      java: String.raw`
        public class TrocaXor {
            public static void main(String[] args) {
                int a = 5, b = 9;
                a ^= b; // a = a ⊕ b
                b ^= a; // b = (a ⊕ b) ⊕ b = a original
                a ^= b; // a = (a ⊕ b) ⊕ a = b original
                System.out.println(a + " " + b); // 9 5
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <utility>

        void trocaXor(int& a, int& b) {
            if (&a == &b) return; // mesma variável: o XOR zeraria o valor
            a ^= b;               // a = a ⊕ b
            b ^= a;               // b = (a ⊕ b) ⊕ b = a original
            a ^= b;               // a = (a ⊕ b) ⊕ a = b original
        }

        int main() {
            int a = 5, b = 9;
            trocaXor(a, b);
            printf("%d %d\n", a, b); // 9 5
            // Na prática, std::swap(a, b) é tão rápido quanto (ou mais)
        }
      `,
    },
  },
  {
    id: 'chs-conversion',
    name: 'Conversão CHS ↔ LBA',
    difficulty: 'Iniciante',
    en: { name: 'CHS ↔ LBA Conversion', summary: 'Converts between a linear sector number (LBA) and the cylinder-head-sector address of classic hard disks.' },
    facts: { 'CHS': 'Cilindro, cabeça, setor', 'LBA': 'Endereçamento linear de blocos', 'Fórmula': 'LBA = (C · cabeças + H) · setores + (S − 1)', 'Limite do CHS no BIOS': '≈ 8,4 GB (1024 × 255 × 63 setores)' },
    summary: 'Converte entre o número linear de um setor (LBA) e o endereço cilindro–cabeça–setor dos discos rígidos clássicos.',
    description:
      'Um disco rígido clássico tem vários pratos empilhados, cada face com uma cabeça de leitura. As trilhas concêntricas na mesma posição em todas as faces formam um cilindro, e cada trilha é dividida em setores. Por isso os primeiros sistemas endereçavam dados com três números: cilindro (C), cabeça (H) e setor (S, que começa em 1). O endereçamento linear (LBA) simplesmente numera todos os setores do disco a partir de 0. A conversão depende da geometria — quantas cabeças por cilindro e quantos setores por trilha: C = ⌊LBA / (cabeças × setores)⌋, H = ⌊LBA / setores⌋ mod cabeças e S = (LBA mod setores) + 1; e, no sentido inverso, LBA = (C × cabeças + H) × setores + (S − 1). É a mesma conta de converter um número para uma base mista, como segundos em horas, minutos e segundos.',
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    steps: [
      'Conheça a geometria: cabeças por cilindro (HPC) e setores por trilha (SPT).',
      'Cilindro: C = ⌊LBA / (HPC × SPT)⌋.',
      'Cabeça: H = ⌊LBA / SPT⌋ mod HPC.',
      'Setor: S = (LBA mod SPT) + 1 — setores começam em 1.',
      'Para voltar: LBA = (C × HPC + H) × SPT + (S − 1).',
    ],
    usedIn: ['Tabela de partições MBR (campos CHS)', 'BIOS e interrupção INT 13h (acesso legado ao disco)', 'Disquetes e emuladores de hardware antigo', 'Ferramentas de recuperação e análise forense de discos', 'Ensino de arquitetura de computadores'],
    realWorld: [
      { title: 'A barreira dos 8 GB', text: 'A interface CHS do BIOS permitia até 1024 cilindros, 255 cabeças e 63 setores de 512 bytes — cerca de 8,4 GB. Discos maiores exigiram as extensões LBA nos anos 1990; antes disso houve barreiras de 504 MB e 2 GB.' },
      { title: 'Geometria fictícia', text: 'Discos modernos têm números variáveis de setores por trilha (mais nas trilhas externas) e nem sempre têm "cabeças" no sentido antigo. A geometria CHS que eles informam é fictícia, mantida só por compatibilidade.' },
      { title: 'Emuladores', text: 'Emuladores de computadores antigos e de consoles convertem pedidos de leitura em CHS (feitos pelo software da época) para posições lineares no arquivo de imagem do disco — exatamente esta conta.' },
    ],
    curiosities: [
      'Um disquete de 1,44 MB tem 80 cilindros, 2 cabeças e 18 setores por trilha: 80 × 2 × 18 × 512 bytes = 1.474.560 bytes.',
      'O fato de os setores começarem em 1, enquanto cilindros e cabeças começam em 0, é uma fonte clássica de erros de "um a mais".',
      'SSDs nem têm cilindros nem cabeças: internamente, um controlador traduz cada LBA para posições físicas nos chips de memória flash, que mudam o tempo todo.',
    ],
    code: {
      python: String.raw`
        def lba_para_chs(lba, cabecas, setores):
            c = lba // (cabecas * setores)
            h = (lba // setores) % cabecas
            s = lba % setores + 1                   # setores começam em 1
            return c, h, s

        def chs_para_lba(c, h, s, cabecas, setores):
            return (c * cabecas + h) * setores + (s - 1)

        chs = lba_para_chs(1234, 16, 63)
        print(chs)                                  # (1, 3, 38)
        print(chs_para_lba(*chs, 16, 63))           # 1234
      `,
      javascript: String.raw`
        function lbaParaChs(lba, cabecas, setores) {
          const c = Math.floor(lba / (cabecas * setores));
          const h = Math.floor(lba / setores) % cabecas;
          const s = (lba % setores) + 1; // setores começam em 1
          return [c, h, s];
        }

        const chsParaLba = (c, h, s, cabecas, setores) => (c * cabecas + h) * setores + (s - 1);

        const chs = lbaParaChs(1234, 16, 63);
        console.log(chs.join(", "));              // 1, 3, 38
        console.log(chsParaLba(...chs, 16, 63));  // 1234
      `,
      java: String.raw`
        public class ConversaoCHS {
            static long[] lbaParaChs(long lba, long cabecas, long setores) {
                long c = lba / (cabecas * setores);
                long h = (lba / setores) % cabecas;
                long s = lba % setores + 1; // setores começam em 1
                return new long[]{c, h, s};
            }

            static long chsParaLba(long c, long h, long s, long cabecas, long setores) {
                return (c * cabecas + h) * setores + (s - 1);
            }

            public static void main(String[] args) {
                long[] chs = lbaParaChs(1234, 16, 63);
                System.out.println(chs[0] + ", " + chs[1] + ", " + chs[2]);          // 1, 3, 38
                System.out.println(chsParaLba(chs[0], chs[1], chs[2], 16, 63));      // 1234
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>

        struct CHS { long c, h, s; };

        CHS lbaParaChs(long lba, long cabecas, long setores) {
            return {lba / (cabecas * setores), (lba / setores) % cabecas, lba % setores + 1}; // setores começam em 1
        }

        long chsParaLba(CHS x, long cabecas, long setores) { return (x.c * cabecas + x.h) * setores + (x.s - 1); }

        int main() {
            CHS x = lbaParaChs(1234, 16, 63);
            printf("%ld, %ld, %ld\n", x.c, x.h, x.s);   // 1, 3, 38
            printf("%ld\n", chsParaLba(x, 16, 63));     // 1234
        }
      `,
    },
  },
  {
    id: 'crc',
    name: 'Verificação Cíclica de Redundância (CRC)',
    difficulty: 'Intermediário',
    en: { name: 'Cyclic Redundancy Check (CRC)', summary: 'Detects accidental data corruption with the remainder of a binary polynomial division — in every Ethernet frame, ZIP file and PNG image.' },
    facts: { 'Criado por': 'W. Wesley Peterson', 'Ano': '1961', 'Base matemática': 'Divisão de polinômios sobre GF(2)', 'Detecta': 'Todos os erros em rajada menores que o grau do gerador', 'Usado em': 'Ethernet, ZIP, PNG, SATA, USB' },
    summary: 'Detecta corrupção acidental de dados com o resto de uma divisão de polinômios binários — presente em todo quadro Ethernet, arquivo ZIP e imagem PNG.',
    description:
      'O CRC trata os bits da mensagem como os coeficientes de um polinômio e calcula o resto da divisão por um polinômio gerador fixo, na aritmética módulo 2 — em que somar e subtrair são o mesmo XOR, sem "vai um". Na prática, acrescentam-se k zeros à mensagem (k = grau do gerador) e faz-se uma divisão longa: sempre que o bit mais à esquerda ainda não zerado vale 1, alinha-se o gerador ali e faz-se XOR. O que sobra nos últimos k bits é o CRC, que é enviado junto com a mensagem. Quem recebe divide tudo pelo mesmo gerador: se o resto não for zero, houve erro. Com um gerador bem escolhido, o CRC detecta todos os erros de um bit, todos os erros em rajada com menos de k bits e quase todos os outros. Ele não protege contra adulterações intencionais — para isso existem os hashes criptográficos e o HMAC.',
    complexity: { best: 'O(n) bit a bit', average: 'O(n/8) com tabela de 256 entradas', worst: 'O(n)', space: 'O(1) ou O(256) com tabela' },
    steps: [
      'Escolha um polinômio gerador de grau k (por exemplo, 1011 = x³ + x + 1, ou o CRC-32 padrão).',
      'Acrescente k zeros ao final da mensagem.',
      'Percorra os bits: sempre que o bit atual for 1, faça XOR do gerador alinhado a partir dele.',
      'Os k bits finais que sobram são o CRC; transmita mensagem + CRC.',
      'O receptor divide a palavra recebida pelo gerador: resto zero indica que nenhum erro detectável ocorreu.',
    ],
    usedIn: ['Ethernet e Wi-Fi (CRC-32 em cada quadro)', 'Arquivos ZIP, gzip e PNG', 'Armazenamento (SATA, sistemas de arquivos como Btrfs)', 'USB, CAN (automóveis) e protocolos industriais', 'Bancos de dados e transmissão de mensagens'],
    realWorld: [
      { title: 'Cada pacote da internet', text: 'Todo quadro Ethernet termina com um CRC-32 de 4 bytes (o FCS). A placa de rede o calcula em hardware e descarta silenciosamente os quadros corrompidos.' },
      { title: 'Arquivos', text: 'ZIP e PNG guardam o CRC-32 de cada arquivo ou bloco; ao abrir um arquivo corrompido, é esse número que denuncia o problema.' },
      { title: 'Carros', text: 'O barramento CAN, que conecta os módulos eletrônicos de um carro, usa um CRC de 15 bits em cada mensagem para garantir que comandos de freio ou de motor não sejam lidos errados.' },
    ],
    curiosities: [
      'O valor de verificação padrão do CRC-32 é calculado sobre os 9 caracteres "123456789" e vale cbf43926 — o código desta página o confere.',
      'Implementações rápidas processam 8 bits por vez com uma tabela de 256 entradas; processadores modernos têm instruções próprias (como CRC32C no SSE 4.2).',
      'Como o CRC é linear, é fácil modificar uma mensagem e ajustar alguns bits para manter o mesmo CRC — por isso ele não serve como proteção criptográfica.',
    ],
    code: {
      python: String.raw`
        import zlib

        def crc_bits(mensagem, gerador):          # divisão longa em GF(2), bit a bit
            k = len(gerador) - 1
            bits = [int(b) for b in mensagem + "0" * k]
            for i in range(len(mensagem)):
                if bits[i]:
                    for j, g in enumerate(gerador):
                        bits[i + j] ^= int(g)          # "subtrair" é XOR
            return "".join(map(str, bits[-k:]))

        print(crc_bits("11010011101100", "1011"))   # 100

        def crc32(dados):                           # CRC-32 padrão (refletido, polinômio 0xEDB88320)
            crc = 0xFFFFFFFF
            for byte in dados:
                crc ^= byte
                for _ in range(8):
                    crc = (crc >> 1) ^ 0xEDB88320 if crc & 1 else crc >> 1
            return crc ^ 0xFFFFFFFF

        print(f"{crc32(b'123456789'):08x}", f"{zlib.crc32(b'123456789'):08x}")   # cbf43926 cbf43926
      `,
      javascript: String.raw`
        function crcBits(mensagem, gerador) { // divisão longa em GF(2), bit a bit
          const k = gerador.length - 1;
          const bits = [...mensagem + "0".repeat(k)].map(Number);
          for (let i = 0; i < mensagem.length; i++)
            if (bits[i]) for (let j = 0; j <= k; j++) bits[i + j] ^= Number(gerador[j]); // "subtrair" é XOR
          return bits.slice(-k).join("");
        }

        console.log(crcBits("11010011101100", "1011")); // 100

        function crc32(dados) { // CRC-32 padrão (refletido, polinômio 0xEDB88320)
          let crc = 0xffffffff;
          for (const byte of dados) {
            crc ^= byte;
            for (let i = 0; i < 8; i++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
          }
          return (crc ^ 0xffffffff) >>> 0;
        }

        console.log(crc32(new TextEncoder().encode("123456789")).toString(16)); // cbf43926
      `,
      java: String.raw`
        import java.nio.charset.StandardCharsets;
        import java.util.zip.CRC32;

        public class CRC {
            static String crcBits(String mensagem, String gerador) { // divisão longa em GF(2), bit a bit
                int k = gerador.length() - 1;
                int[] bits = new int[mensagem.length() + k];
                for (int i = 0; i < mensagem.length(); i++) bits[i] = mensagem.charAt(i) - '0';
                for (int i = 0; i < mensagem.length(); i++)
                    if (bits[i] == 1) for (int j = 0; j <= k; j++) bits[i + j] ^= gerador.charAt(j) - '0'; // "subtrair" é XOR
                StringBuilder sb = new StringBuilder();
                for (int i = bits.length - k; i < bits.length; i++) sb.append(bits[i]);
                return sb.toString();
            }

            static long crc32(byte[] dados) { // CRC-32 padrão (refletido, polinômio 0xEDB88320)
                int crc = 0xFFFFFFFF;
                for (byte b : dados) {
                    crc ^= b & 0xFF;
                    for (int i = 0; i < 8; i++) crc = (crc & 1) != 0 ? (crc >>> 1) ^ 0xEDB88320 : crc >>> 1;
                }
                return Integer.toUnsignedLong(~crc);
            }

            public static void main(String[] args) {
                System.out.println(crcBits("11010011101100", "1011")); // 100
                byte[] dados = "123456789".getBytes(StandardCharsets.UTF_8);
                CRC32 biblioteca = new CRC32();
                biblioteca.update(dados);
                System.out.println(Long.toHexString(crc32(dados)) + " " + Long.toHexString(biblioteca.getValue())); // cbf43926 cbf43926
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <string>
        using namespace std;

        string crcBits(const string& mensagem, const string& gerador) { // divisão longa em GF(2), bit a bit
            size_t k = gerador.size() - 1;
            string bits = mensagem + string(k, '0');
            for (size_t i = 0; i < mensagem.size(); i++)
                if (bits[i] == '1')
                    for (size_t j = 0; j <= k; j++) bits[i + j] = ((bits[i + j] - '0') ^ (gerador[j] - '0')) + '0'; // XOR
            return bits.substr(bits.size() - k);
        }

        uint32_t crc32(const string& dados) { // CRC-32 padrão (refletido, polinômio 0xEDB88320)
            uint32_t crc = 0xFFFFFFFF;
            for (unsigned char byte : dados) {
                crc ^= byte;
                for (int i = 0; i < 8; i++) crc = (crc & 1) ? (crc >> 1) ^ 0xEDB88320 : crc >> 1;
            }
            return ~crc;
        }

        int main() {
            printf("%s\n", crcBits("11010011101100", "1011").c_str()); // 100
            printf("%08x\n", crc32("123456789"));                      // cbf43926
        }
      `,
    },
  },
  {
    id: 'hamming-code',
    name: 'Código de Hamming (7,4)',
    difficulty: 'Intermediário',
    en: { name: 'Hamming Code (7,4)', summary: 'Encodes 4 data bits into 7 so that any single flipped bit can be located and corrected — the first error-correcting code.' },
    facts: { 'Criado por': 'Richard Hamming (Bell Labs)', 'Ano': '1950', 'Taxa': '4 bits de dados em 7', 'Capacidade': 'Corrige 1 erro (detecta 2 com um bit extra)', 'Usado em': 'Memória ECC, comunicação espacial (histórico)' },
    summary: 'Codifica 4 bits de dados em 7, de modo que qualquer bit trocado pode ser localizado e corrigido — o primeiro código corretor de erros.',
    description:
      'O bit de paridade detecta um erro, mas não diz onde ele está. Richard Hamming percebeu que, com várias paridades cobrindo grupos diferentes de bits, o padrão de paridades erradas aponta exatamente para o bit trocado. No Hamming(7,4), as posições 1, 2 e 4 (as potências de 2) guardam bits de paridade, e as posições 3, 5, 6 e 7 guardam os dados. A paridade da posição 1 cobre todas as posições cujo número, em binário, tem o bit 1 ligado (1, 3, 5, 7); a da posição 2 cobre as que têm o bit 2 ligado (2, 3, 6, 7); a da posição 4, as que têm o bit 4 (4, 5, 6, 7). Ao receber, recalculam-se as três paridades: o número binário formado pelas que falharam — a síndrome — é exatamente a posição do erro. Basta inverter aquele bit. Acrescentando um oitavo bit de paridade geral, o código também detecta (sem corrigir) erros duplos: é o SECDED usado em memórias ECC.',
    complexity: { best: 'O(1) por bloco de 4 bits', average: 'O(n)', worst: 'O(n)', space: '75% de redundância (3 bits para cada 4)' },
    steps: [
      'Coloque os 4 bits de dados nas posições 3, 5, 6 e 7.',
      'Calcule p1 = XOR das posições 3, 5, 7; p2 = XOR de 3, 6, 7; p4 = XOR de 5, 6, 7.',
      'Transmita as 7 posições.',
      'Ao receber, recalcule s1, s2 e s4 (cada um incluindo o próprio bit de paridade).',
      'A síndrome s4 s2 s1, lida em binário, é a posição do bit errado (0 = nenhum erro); inverta esse bit e extraia os dados.',
    ],
    usedIn: ['Memória ECC de servidores (variantes SECDED)', 'Comunicação espacial e via satélite (histórico)', 'Memória flash e caches de processadores', 'Ensino de teoria da codificação', 'Base de códigos mais fortes (BCH, Reed-Solomon, LDPC)'],
    realWorld: [
      { title: 'Servidores', text: 'A memória ECC usada em servidores e estações de trabalho usa códigos do tipo Hamming estendido (SECDED) sobre palavras de 64 bits: corrige automaticamente qualquer bit trocado — por exemplo, por raios cósmicos — e detecta erros duplos.' },
      { title: 'A origem do código', text: 'Hamming trabalhava nos Bell Labs com computadores de relés que paravam a cada erro detectado nos fins de semana, quando não havia operadores. Irritado, ele se perguntou: "se a máquina sabe que há um erro, por que não descobre onde está e o corrige?"' },
      { title: 'Códigos modernos', text: 'O Wi-Fi, o 5G, os SSDs e a TV digital usam códigos muito mais poderosos (LDPC, Reed-Solomon, polares), mas todos descendem da ideia de Hamming: redundância estruturada para localizar e corrigir erros.' },
    ],
    curiosities: [
      'A "distância de Hamming" — o número de posições em que duas sequências diferem — também leva seu nome e é usada muito além da codificação.',
      'O Hamming(7,4) é um código "perfeito": cada uma das 128 palavras de 7 bits está a distância no máximo 1 de exatamente uma palavra de código.',
      'Richard Hamming recebeu o Prêmio Turing em 1968 e ficou conhecido também pela palestra "You and Your Research", sobre como fazer trabalho científico importante.',
    ],
    code: {
      python: String.raw`
        def codificar(d):                         # d: 4 bits de dados → 7 bits (posições 1..7)
            c = [0, 0, 0, d[0], 0, d[1], d[2], d[3]]
            c[1] = c[3] ^ c[5] ^ c[7]
            c[2] = c[3] ^ c[6] ^ c[7]
            c[4] = c[5] ^ c[6] ^ c[7]
            return c[1:]

        def decodificar(palavra):
            c = [0] + list(palavra)
            s1 = c[1] ^ c[3] ^ c[5] ^ c[7]
            s2 = c[2] ^ c[3] ^ c[6] ^ c[7]
            s4 = c[4] ^ c[5] ^ c[6] ^ c[7]
            sindrome = s1 + 2 * s2 + 4 * s4       # posição do erro (0 = sem erro)
            if sindrome:
                c[sindrome] ^= 1
            return [c[3], c[5], c[6], c[7]], sindrome

        palavra = codificar([1, 0, 1, 1])
        print("".join(map(str, palavra)))        # 0110011
        palavra[4] ^= 1                          # erro na posição 5
        dados, pos = decodificar(palavra)
        print(dados, "erro corrigido na posição", pos)   # [1, 0, 1, 1] erro corrigido na posição 5
      `,
      javascript: String.raw`
        function codificar(d) { // d: 4 bits de dados → 7 bits (posições 1..7)
          const c = [0, 0, 0, d[0], 0, d[1], d[2], d[3]];
          c[1] = c[3] ^ c[5] ^ c[7];
          c[2] = c[3] ^ c[6] ^ c[7];
          c[4] = c[5] ^ c[6] ^ c[7];
          return c.slice(1);
        }

        function decodificar(palavra) {
          const c = [0, ...palavra];
          const s1 = c[1] ^ c[3] ^ c[5] ^ c[7], s2 = c[2] ^ c[3] ^ c[6] ^ c[7], s4 = c[4] ^ c[5] ^ c[6] ^ c[7];
          const sindrome = s1 + 2 * s2 + 4 * s4; // posição do erro (0 = sem erro)
          if (sindrome) c[sindrome] ^= 1;
          return [[c[3], c[5], c[6], c[7]], sindrome];
        }

        const palavra = codificar([1, 0, 1, 1]);
        console.log(palavra.join("")); // 0110011
        palavra[4] ^= 1;               // erro na posição 5
        const [dados, pos] = decodificar(palavra);
        console.log(dados.join("") + " erro corrigido na posição " + pos); // 1011 erro corrigido na posição 5
      `,
      java: String.raw`
        public class Hamming {
            static int[] codificar(int[] d) { // 4 bits de dados → 7 bits (posições 1..7)
                int[] c = {0, 0, 0, d[0], 0, d[1], d[2], d[3]};
                c[1] = c[3] ^ c[5] ^ c[7];
                c[2] = c[3] ^ c[6] ^ c[7];
                c[4] = c[5] ^ c[6] ^ c[7];
                return java.util.Arrays.copyOfRange(c, 1, 8);
            }

            public static void main(String[] args) {
                int[] palavra = codificar(new int[]{1, 0, 1, 1});
                StringBuilder sb = new StringBuilder();
                for (int b : palavra) sb.append(b);
                System.out.println(sb); // 0110011
                palavra[4] ^= 1;        // erro na posição 5
                int[] c = new int[8];
                System.arraycopy(palavra, 0, c, 1, 7);
                int s1 = c[1] ^ c[3] ^ c[5] ^ c[7], s2 = c[2] ^ c[3] ^ c[6] ^ c[7], s4 = c[4] ^ c[5] ^ c[6] ^ c[7];
                int sindrome = s1 + 2 * s2 + 4 * s4; // posição do erro (0 = sem erro)
                if (sindrome != 0) c[sindrome] ^= 1;
                System.out.println("" + c[3] + c[5] + c[6] + c[7] + " erro corrigido na posição " + sindrome); // 1011 erro corrigido na posição 5
            }
        }
      `,
      cpp: String.raw`
        #include <array>
        #include <cstdio>
        using namespace std;

        array<int, 8> codificar(array<int, 4> d) { // 4 bits de dados → posições 1..7 (índice 0 sem uso)
            array<int, 8> c = {0, 0, 0, d[0], 0, d[1], d[2], d[3]};
            c[1] = c[3] ^ c[5] ^ c[7];
            c[2] = c[3] ^ c[6] ^ c[7];
            c[4] = c[5] ^ c[6] ^ c[7];
            return c;
        }

        int main() {
            array<int, 8> c = codificar({1, 0, 1, 1});
            for (int i = 1; i <= 7; i++) printf("%d", c[i]);
            printf("\n"); // 0110011
            c[5] ^= 1;    // erro na posição 5
            int s1 = c[1] ^ c[3] ^ c[5] ^ c[7], s2 = c[2] ^ c[3] ^ c[6] ^ c[7], s4 = c[4] ^ c[5] ^ c[6] ^ c[7];
            int sindrome = s1 + 2 * s2 + 4 * s4; // posição do erro (0 = sem erro)
            if (sindrome) c[sindrome] ^= 1;
            printf("%d%d%d%d erro corrigido na posição %d\n", c[3], c[5], c[6], c[7], sindrome); // 1011 ... 5
        }
      `,
    },
  },
]
