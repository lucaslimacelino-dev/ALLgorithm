export default [
  {
    id: 'caesar-cipher',
    name: 'Cifra de César',
    difficulty: 'Iniciante',
    en: { name: 'Caesar Cipher', summary: 'Shifts every letter a fixed number of positions in the alphabet — the oldest and simplest cipher.' },
    facts: { 'Origem': 'Roma antiga (Júlio César)', 'Ano': '≈ 50 a.C.', 'Tipo': 'Cifra de substituição monoalfabética', 'Chaves possíveis': '25', 'Situação': 'Quebrada (trivialmente)' },
    summary: 'Desloca cada letra um número fixo de posições no alfabeto — a cifra mais antiga e mais simples.',
    description:
      'Na Cifra de César, cada letra do texto é substituída pela letra que está k posições adiante no alfabeto, dando a volta no fim: com k = 3, A vira D, B vira E e Z vira C. Para decifrar, basta deslocar k posições para trás. Segundo Suetônio, Júlio César usava k = 3 em sua correspondência militar. A cifra tem valor histórico e didático, mas nenhuma segurança: só existem 25 chaves, então testar todas é imediato, e além disso a frequência das letras se mantém — a letra mais comum do texto cifrado quase sempre corresponde ao E (ou ao A, em português).',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    steps: [
      'Escolha o deslocamento k (de 1 a 25).',
      'Para cada letra, calcule a posição p no alfabeto (A = 0, …, Z = 25).',
      'Troque pela letra na posição (p + k) mod 26. Espaços, números e pontuação ficam como estão.',
      'Para decifrar, use (p − k) mod 26 — ou cifre com 26 − k.',
    ],
    usedIn: ['Ensino de criptografia', 'ROT13 em fóruns e newsgroups (esconder spoilers)', 'Quebra-cabeças e caças ao tesouro', 'Componente de cifras históricas (Vigenère)', 'Exercícios de programação'],
    realWorld: [
      { title: 'ROT13', text: 'O ROT13 é uma Cifra de César com k = 13. Como 13 é metade de 26, aplicar duas vezes devolve o texto original. Ele era usado na Usenet para esconder piadas e spoilers — não para segurança.' },
      { title: 'Ataque por força bruta', text: 'Com apenas 25 chaves, basta listar todas as decifrações possíveis e ver qual faz sentido. É o primeiro exemplo de por que o número de chaves precisa ser astronomicamente grande.' },
      { title: 'Análise de frequência', text: 'No século IX, o árabe al-Kindi descreveu como quebrar cifras de substituição comparando a frequência das letras do texto cifrado com a do idioma — técnica que derruba a César e qualquer substituição monoalfabética.' },
    ],
    curiosities: [
      'Augusto, sucessor de César, usava um deslocamento de apenas 1 — e sem dar a volta no alfabeto: escrevia "AA" no lugar de X.',
      'Em 2006, o chefe da máfia siciliana Bernardo Provenzano foi preso em parte porque seus bilhetes usavam uma variante da Cifra de César, com as letras trocadas por números (A = 4, B = 5…).',
      'O nome "ROT13" vem de "rotate by 13 places" (gire 13 posições).',
    ],
    code: {
      python: String.raw`
        def cesar(texto, k):
            resultado = []
            for c in texto:
                if c.isupper():
                    resultado.append(chr((ord(c) - ord("A") + k) % 26 + ord("A")))
                elif c.islower():
                    resultado.append(chr((ord(c) - ord("a") + k) % 26 + ord("a")))
                else:
                    resultado.append(c)  # espaços e pontuação ficam como estão
            return "".join(resultado)

        cifrado = cesar("Veni, vidi, vici", 3)
        print(cifrado)              # Yhql, ylgl, ylfl
        print(cesar(cifrado, -3))   # Veni, vidi, vici
      `,
      javascript: String.raw`
        function cesar(texto, k) {
          return texto.replace(/[a-z]/gi, c => {
            const base = c <= "Z" ? 65 : 97; // maiúsculas começam em 65 ("A"), minúsculas em 97 ("a")
            return String.fromCharCode(((c.charCodeAt(0) - base + k) % 26 + 26) % 26 + base);
          });
        }

        const cifrado = cesar("Veni, vidi, vici", 3);
        console.log(cifrado);             // Yhql, ylgl, ylfl
        console.log(cesar(cifrado, -3));  // Veni, vidi, vici
      `,
      java: String.raw`
        public class Cesar {
            static String cesar(String texto, int k) {
                StringBuilder sb = new StringBuilder();
                for (char c : texto.toCharArray()) {
                    if (Character.isUpperCase(c)) sb.append((char) (Math.floorMod(c - 'A' + k, 26) + 'A'));
                    else if (Character.isLowerCase(c)) sb.append((char) (Math.floorMod(c - 'a' + k, 26) + 'a'));
                    else sb.append(c); // espaços e pontuação ficam como estão
                }
                return sb.toString();
            }

            public static void main(String[] args) {
                String cifrado = cesar("Veni, vidi, vici", 3);
                System.out.println(cifrado);             // Yhql, ylgl, ylfl
                System.out.println(cesar(cifrado, -3));  // Veni, vidi, vici
            }
        }
      `,
      cpp: String.raw`
        #include <cctype>
        #include <iostream>
        #include <string>
        using namespace std;

        string cesar(string texto, int k) {
            for (char& c : texto) {
                if (isupper((unsigned char)c)) c = char(((c - 'A' + k) % 26 + 26) % 26 + 'A');
                else if (islower((unsigned char)c)) c = char(((c - 'a' + k) % 26 + 26) % 26 + 'a');
            } // espaços e pontuação ficam como estão
            return texto;
        }

        int main() {
            string cifrado = cesar("Veni, vidi, vici", 3);
            cout << cifrado << "\n";             // Yhql, ylgl, ylfl
            cout << cesar(cifrado, -3) << "\n";  // Veni, vidi, vici
        }
      `,
    },
  },
  {
    id: 'vigenere-cipher',
    name: 'Cifra de Vigenère',
    difficulty: 'Iniciante',
    en: { name: 'Vigenère Cipher', summary: 'A Caesar cipher with a different shift for each letter, taken from a repeating keyword.' },
    facts: { 'Criado por': 'Giovan Battista Bellaso (atribuída a Blaise de Vigenère)', 'Ano': '1553', 'Tipo': 'Cifra de substituição polialfabética', 'Quebrada por': 'Charles Babbage; Friedrich Kasiski (1863)', 'Situação': 'Quebrada' },
    summary: 'Uma Cifra de César com um deslocamento diferente para cada letra, dado por uma palavra-chave que se repete.',
    description:
      'A Cifra de Vigenère usa uma palavra-chave para variar o deslocamento a cada letra. A chave é repetida ao longo do texto, e cada letra dela indica um deslocamento (A = 0, B = 1, …): com a chave LEMON, a 1ª letra do texto é deslocada 11 posições, a 2ª, 4, a 3ª, 12, e assim por diante. Como a mesma letra do texto pode virar letras diferentes, a análise de frequência simples não funciona — por isso ela ficou conhecida por três séculos como "a cifra indecifrável". O ponto fraco é a repetição da chave: descobrindo o tamanho dela (pelo método de Kasiski ou pelo índice de coincidência), o texto se divide em várias Cifras de César, cada uma fácil de quebrar.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    steps: [
      'Escolha uma palavra-chave (por exemplo, LEMON).',
      'Repita a chave ao longo das letras do texto: LEMONLEMONLE…',
      'Cifre cada letra com uma Cifra de César cujo deslocamento é a letra correspondente da chave (A = 0, B = 1, …).',
      'Caracteres que não são letras ficam como estão e não consomem letra da chave.',
      'Para decifrar, subtraia o deslocamento de cada letra da chave.',
    ],
    usedIn: ['Ensino de criptografia clássica', 'Exército Confederado na Guerra Civil Americana', 'Base do one-time pad (com chave aleatória do tamanho da mensagem)', 'Desafios de criptoanálise', 'Quebra-cabeças e jogos'],
    realWorld: [
      { title: 'A "cifra indecifrável"', text: 'Do século XVI ao XIX, a Vigenère teve fama de inquebrável (le chiffre indéchiffrable). Ela ainda era usada pelos Confederados nos anos 1860 — e era quebrada com frequência pela União.' },
      { title: 'Método de Kasiski', text: 'Trechos repetidos no texto cifrado costumam vir da mesma palavra cifrada com a mesma parte da chave; as distâncias entre as repetições são múltiplas do tamanho da chave. Kasiski publicou o método em 1863; Babbage já o conhecia, mas não o publicou.' },
      { title: 'Da Vigenère ao one-time pad', text: 'Se a chave for totalmente aleatória, do tamanho da mensagem e nunca reutilizada, a Vigenère vira o one-time pad, que é matematicamente inquebrável.' },
    ],
    curiosities: [
      'A cifra foi descrita por Giovan Battista Bellaso em 1553; Blaise de Vigenère criou, em 1586, uma variante mais forte (com autochave), mas o nome dele acabou ficando na versão mais simples.',
      'O exemplo "ATTACKATDAWN" com a chave "LEMON", que vira "LXFOPVEFRNHR", é o mais citado em livros e na Wikipédia.',
      'A revista Scientific American chegou a chamar a Vigenère de "impossível de traduzir" em 1917 — mais de 50 anos depois de Kasiski publicar como quebrá-la.',
    ],
    code: {
      python: String.raw`
        def vigenere(texto, chave, decifrar=False):
            resultado, i = [], 0
            for c in texto.upper():
                if "A" <= c <= "Z":
                    k = ord(chave[i % len(chave)].upper()) - ord("A")
                    if decifrar:
                        k = -k
                    resultado.append(chr((ord(c) - ord("A") + k) % 26 + ord("A")))
                    i += 1                     # só letras consomem a chave
                else:
                    resultado.append(c)
            return "".join(resultado)

        cifrado = vigenere("ATTACK AT DAWN", "LEMON")
        print(cifrado)                                  # LXFOPV EF RNHR
        print(vigenere(cifrado, "LEMON", decifrar=True))  # ATTACK AT DAWN
      `,
      javascript: String.raw`
        function vigenere(texto, chave, decifrar = false) {
          let i = 0;
          return texto.toUpperCase().replace(/[A-Z]/g, c => {
            let k = chave.toUpperCase().charCodeAt(i++ % chave.length) - 65; // só letras consomem a chave
            if (decifrar) k = -k;
            return String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26 + 26) % 26 + 65);
          });
        }

        const cifrado = vigenere("ATTACK AT DAWN", "LEMON");
        console.log(cifrado);                          // LXFOPV EF RNHR
        console.log(vigenere(cifrado, "LEMON", true)); // ATTACK AT DAWN
      `,
      java: String.raw`
        public class Vigenere {
            static String vigenere(String texto, String chave, boolean decifrar) {
                StringBuilder sb = new StringBuilder();
                int i = 0;
                for (char c : texto.toUpperCase().toCharArray()) {
                    if (c >= 'A' && c <= 'Z') {
                        int k = Character.toUpperCase(chave.charAt(i++ % chave.length())) - 'A'; // só letras consomem a chave
                        if (decifrar) k = -k;
                        sb.append((char) (Math.floorMod(c - 'A' + k, 26) + 'A'));
                    } else sb.append(c);
                }
                return sb.toString();
            }

            public static void main(String[] args) {
                String cifrado = vigenere("ATTACK AT DAWN", "LEMON", false);
                System.out.println(cifrado);                            // LXFOPV EF RNHR
                System.out.println(vigenere(cifrado, "LEMON", true));   // ATTACK AT DAWN
            }
        }
      `,
      cpp: String.raw`
        #include <cctype>
        #include <iostream>
        #include <string>
        using namespace std;

        string vigenere(string texto, const string& chave, bool decifrar = false) {
            size_t i = 0;
            for (char& c : texto) {
                c = toupper((unsigned char)c);
                if (c < 'A' || c > 'Z') continue;
                int k = toupper((unsigned char)chave[i++ % chave.size()]) - 'A'; // só letras consomem a chave
                if (decifrar) k = -k;
                c = char(((c - 'A' + k) % 26 + 26) % 26 + 'A');
            }
            return texto;
        }

        int main() {
            string cifrado = vigenere("ATTACK AT DAWN", "LEMON");
            cout << cifrado << "\n";                          // LXFOPV EF RNHR
            cout << vigenere(cifrado, "LEMON", true) << "\n"; // ATTACK AT DAWN
        }
      `,
    },
  },
  {
    id: 'one-time-pad',
    name: 'One-Time Pad (Cifra de Vernam)',
    difficulty: 'Iniciante',
    en: { name: 'One-Time Pad (Vernam Cipher)', summary: 'XORs the message with a truly random key as long as the message, used once — the only provably unbreakable cipher.' },
    facts: { 'Criado por': 'Gilbert Vernam; Joseph Mauborgne', 'Ano': '1917', 'Segurança provada por': 'Claude Shannon (1949)', 'Situação': 'Inquebrável (se usada corretamente)' },
    summary: 'Faz XOR da mensagem com uma chave realmente aleatória, do mesmo tamanho, usada uma única vez — a única cifra comprovadamente inquebrável.',
    description:
      'O one-time pad combina cada bit (ou byte) da mensagem com um bit da chave por OU exclusivo (XOR). Decifrar é aplicar o mesmo XOR de novo, porque (m ⊕ k) ⊕ k = m. Claude Shannon provou em 1949 que, se a chave for realmente aleatória, tiver pelo menos o tamanho da mensagem e nunca for reutilizada, o texto cifrado não revela absolutamente nada: qualquer mensagem do mesmo tamanho é igualmente provável. É "segredo perfeito". O problema é prático: gerar, distribuir e guardar chaves enormes com segurança é tão difícil quanto enviar a própria mensagem. E se a chave for usada duas vezes, o XOR dos dois cifrados elimina a chave e entrega o XOR das mensagens.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    steps: [
      'Gere uma chave realmente aleatória com pelo menos o tamanho da mensagem.',
      'Entregue a chave ao destinatário por um canal seguro (pessoalmente, por exemplo).',
      'Cifre: c = m ⊕ k, byte a byte.',
      'Decifre: m = c ⊕ k.',
      'Destrua a chave depois do uso — reutilizá-la quebra a segurança.',
    ],
    usedIn: ['"Linha vermelha" Moscou–Washington (anos 1960)', 'Comunicações diplomáticas e de espionagem', 'Estações de números (rádio de ondas curtas)', 'Base teórica das cifras de fluxo', 'Ensino de teoria da informação'],
    realWorld: [
      { title: 'Linha direta da Guerra Fria', text: 'A linha de comunicação entre a Casa Branca e o Kremlin, criada após a crise dos mísseis de Cuba, usava fitas de one-time pad trocadas fisicamente pelas embaixadas.' },
      { title: 'Projeto Venona', text: 'Durante a Segunda Guerra, a União Soviética reutilizou páginas de seus one-time pads por falta de material. Analistas americanos exploraram esse erro por décadas e decifraram milhares de mensagens de espionagem.' },
      { title: 'Cifras de fluxo', text: 'RC4, ChaCha20 e o modo CTR do AES imitam o one-time pad: geram um fluxo pseudoaleatório a partir de uma chave curta e fazem XOR com a mensagem. Não têm segredo perfeito, mas são práticos.' },
    ],
    curiosities: [
      'O nome vem dos blocos de papel (pads) com páginas de números aleatórios: cada página era usada uma vez e arrancada.',
      'Che Guevara carregava um one-time pad para se comunicar com Fidel Castro; a folha encontrada com ele em 1967 está documentada.',
      'Shannon provou também o lado "ruim": qualquer cifra com segredo perfeito precisa de uma chave pelo menos do tamanho da mensagem — não há como fugir desse custo.',
    ],
    code: {
      python: String.raw`
        import secrets

        def xor(dados, chave):
            if len(chave) < len(dados):
                raise ValueError("a chave precisa ser pelo menos do tamanho da mensagem")
            return bytes(d ^ k for d, k in zip(dados, chave))

        mensagem = "ATAQUE AO AMANHECER".encode()
        # Na prática: chave = secrets.token_bytes(len(mensagem)). Aqui ela é fixa para o exemplo ser reproduzível.
        chave = bytes.fromhex("3c917e0fd255a1b2c3d4e5f60718293a4b5c6d")
        cifrado = xor(mensagem, chave)
        print(cifrado.hex())                  # 7dc53f5e871081f38cf4a4bb4656617f08193f
        print(xor(cifrado, chave).decode())   # ATAQUE AO AMANHECER
      `,
      javascript: String.raw`
        // Na prática: const chave = crypto.getRandomValues(new Uint8Array(tamanho)). Aqui ela é fixa para o exemplo ser reproduzível.
        function xor(dados, chave) {
          if (chave.length < dados.length) throw new Error("a chave precisa ser pelo menos do tamanho da mensagem");
          return dados.map((d, i) => d ^ chave[i]);
        }

        const hexParaBytes = h => Uint8Array.from(h.match(/../g), b => parseInt(b, 16));
        const bytesParaHex = b => [...b].map(x => x.toString(16).padStart(2, "0")).join("");

        const mensagem = new TextEncoder().encode("ATAQUE AO AMANHECER");
        const chave = hexParaBytes("3c917e0fd255a1b2c3d4e5f60718293a4b5c6d");
        const cifrado = xor(mensagem, chave);
        console.log(bytesParaHex(cifrado)); // 7dc53f5e871081f38cf4a4bb4656617f08193f
        console.log(new TextDecoder().decode(xor(cifrado, chave))); // ATAQUE AO AMANHECER
      `,
      java: String.raw`
        import java.nio.charset.StandardCharsets;
        import java.util.HexFormat;

        public class OneTimePad {
            static byte[] xor(byte[] dados, byte[] chave) {
                if (chave.length < dados.length) throw new IllegalArgumentException("a chave precisa ser pelo menos do tamanho da mensagem");
                byte[] saida = new byte[dados.length];
                for (int i = 0; i < dados.length; i++) saida[i] = (byte) (dados[i] ^ chave[i]);
                return saida;
            }

            public static void main(String[] args) {
                byte[] mensagem = "ATAQUE AO AMANHECER".getBytes(StandardCharsets.UTF_8);
                // Na prática: new SecureRandom().nextBytes(chave). Aqui ela é fixa para o exemplo ser reproduzível.
                byte[] chave = HexFormat.of().parseHex("3c917e0fd255a1b2c3d4e5f60718293a4b5c6d");
                byte[] cifrado = xor(mensagem, chave);
                System.out.println(HexFormat.of().formatHex(cifrado)); // 7dc53f5e871081f38cf4a4bb4656617f08193f
                System.out.println(new String(xor(cifrado, chave), StandardCharsets.UTF_8)); // ATAQUE AO AMANHECER
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <stdexcept>
        #include <string>
        #include <vector>
        using namespace std;

        vector<unsigned char> xorBytes(const vector<unsigned char>& dados, const vector<unsigned char>& chave) {
            if (chave.size() < dados.size()) throw invalid_argument("a chave precisa ser pelo menos do tamanho da mensagem");
            vector<unsigned char> saida(dados.size());
            for (size_t i = 0; i < dados.size(); i++) saida[i] = dados[i] ^ chave[i];
            return saida;
        }

        int main() {
            string texto = "ATAQUE AO AMANHECER";
            vector<unsigned char> mensagem(texto.begin(), texto.end());
            // Na prática, use um gerador seguro (std::random_device ou /dev/urandom). Aqui a chave é fixa.
            string hex = "3c917e0fd255a1b2c3d4e5f60718293a4b5c6d";
            vector<unsigned char> chave;
            for (size_t i = 0; i < hex.size(); i += 2) chave.push_back((unsigned char)stoi(hex.substr(i, 2), nullptr, 16));
            auto cifrado = xorBytes(mensagem, chave);
            for (unsigned char b : cifrado) printf("%02x", b);
            printf("\n"); // 7dc53f5e871081f38cf4a4bb4656617f08193f
            auto volta = xorBytes(cifrado, chave);
            printf("%s\n", string(volta.begin(), volta.end()).c_str()); // ATAQUE AO AMANHECER
        }
      `,
    },
  },
  {
    id: 'rc4',
    name: 'RC4',
    difficulty: 'Intermediário',
    en: { name: 'RC4', summary: 'A tiny stream cipher that shuffles a 256-byte table with the key and XORs its output with the message — fast, famous and now broken.' },
    facts: { 'Criado por': 'Ron Rivest (RSA Security)', 'Ano': '1987 (vazou em 1994)', 'Tipo': 'Cifra de fluxo', 'Estado interno': 'Permutação de 256 bytes', 'Situação': 'Quebrada — proibida no TLS (RFC 7465)' },
    summary: 'Uma cifra de fluxo minúscula que embaralha uma tabela de 256 bytes com a chave e faz XOR da saída com a mensagem — rápida, famosa e hoje quebrada.',
    description:
      'O RC4 gera um fluxo de bytes pseudoaleatórios e faz XOR dele com a mensagem, como um one-time pad com chave "esticada". O estado é uma permutação S dos números 0 a 255. No agendamento da chave (KSA), S começa em ordem e é embaralhada 256 vezes com trocas guiadas pelos bytes da chave. Na geração (PRGA), a cada byte os índices i e j andam, S[i] e S[j] são trocados e o byte do fluxo é S[S[i] + S[j]]. A simplicidade e a velocidade o tornaram onipresente — WEP, WPA, SSL/TLS, PDF —, mas os primeiros bytes do fluxo têm vieses estatísticos que, com muitas mensagens, revelam o texto ou a chave. Desde 2015 seu uso é proibido no TLS.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(256)' },
    steps: [
      'KSA: S = [0, 1, …, 255]; j = 0.',
      'Para i de 0 a 255: j = (j + S[i] + chave[i mod tamanho]) mod 256; troque S[i] e S[j].',
      'PRGA: i = j = 0. Para cada byte da mensagem: i = i + 1; j = j + S[i]; troque S[i] e S[j] (tudo mod 256).',
      'O byte do fluxo é K = S[(S[i] + S[j]) mod 256]; o byte cifrado é mensagem ⊕ K.',
      'Decifrar é exatamente o mesmo processo, com a mesma chave.',
    ],
    usedIn: ['WEP e WPA-TKIP (Wi-Fi)', 'SSL/TLS (até 2015)', 'PDF, Microsoft Office e Kerberos (versões antigas)', 'BitTorrent (ofuscação de protocolo)', 'Ensino de cifras de fluxo'],
    realWorld: [
      { title: 'A queda do WEP', text: 'O WEP, primeiro padrão de segurança do Wi-Fi, usava RC4 com um vetor de inicialização de 24 bits colado à chave. Em 2001, Fluhrer, Mantin e Shamir mostraram como recuperar a chave a partir de pacotes capturados; hoje isso leva minutos.' },
      { title: 'Fim no TLS', text: 'Ataques estatísticos aos vieses do RC4 (como o RC4 NOMORE, de 2015) permitiram recuperar cookies de sessões HTTPS. A RFC 7465 proibiu o RC4 no TLS, e os navegadores o removeram.' },
      { title: 'Ainda por aí', text: 'O RC4 sobrevive em protocolos legados e em usos sem exigência de segurança, como a ofuscação do protocolo do BitTorrent, que só serve para dificultar a identificação do tráfego.' },
    ],
    curiosities: [
      'O RC4 era segredo comercial da RSA Security. Em 1994 o código vazou anonimamente em uma lista de discussão — e por isso ficou conhecido também como ARCFOUR ("alleged RC4").',
      'O algoritmo inteiro cabe em poucas linhas de código, o que ajudou a espalhá-lo por todo tipo de software e hardware.',
      'Uma variante proposta para corrigir os vieses — descartar os primeiros 3072 bytes do fluxo (RC4-drop) — melhora a situação, mas não o salva.',
    ],
    code: {
      python: String.raw`
        def rc4(chave, dados):
            S = list(range(256))
            j = 0
            for i in range(256):                       # KSA: embaralha S com a chave
                j = (j + S[i] + chave[i % len(chave)]) % 256
                S[i], S[j] = S[j], S[i]
            i = j = 0
            saida = bytearray()
            for byte in dados:                         # PRGA: gera o fluxo e faz XOR
                i = (i + 1) % 256
                j = (j + S[i]) % 256
                S[i], S[j] = S[j], S[i]
                saida.append(byte ^ S[(S[i] + S[j]) % 256])
            return bytes(saida)

        print(rc4(b"Key", b"Plaintext").hex().upper())   # BBF316E8D940AF0AD3
        print(rc4(b"Wiki", b"pedia").hex().upper())      # 1021BF0420
      `,
      javascript: String.raw`
        function rc4(chave, dados) {
          const S = Array.from({ length: 256 }, (_, i) => i);
          let j = 0;
          for (let i = 0; i < 256; i++) { // KSA: embaralha S com a chave
            j = (j + S[i] + chave[i % chave.length]) & 255;
            [S[i], S[j]] = [S[j], S[i]];
          }
          let i = 0;
          j = 0;
          return dados.map(byte => { // PRGA: gera o fluxo e faz XOR
            i = (i + 1) & 255;
            j = (j + S[i]) & 255;
            [S[i], S[j]] = [S[j], S[i]];
            return byte ^ S[(S[i] + S[j]) & 255];
          });
        }

        const bytes = s => new TextEncoder().encode(s);
        const hex = b => [...b].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
        console.log(hex(rc4(bytes("Key"), bytes("Plaintext")))); // BBF316E8D940AF0AD3
        console.log(hex(rc4(bytes("Wiki"), bytes("pedia"))));    // 1021BF0420
      `,
      java: String.raw`
        import java.nio.charset.StandardCharsets;
        import java.util.HexFormat;

        public class RC4 {
            static byte[] rc4(byte[] chave, byte[] dados) {
                int[] S = new int[256];
                for (int i = 0; i < 256; i++) S[i] = i;
                for (int i = 0, j = 0; i < 256; i++) { // KSA: embaralha S com a chave
                    j = (j + S[i] + (chave[i % chave.length] & 0xFF)) & 255;
                    int t = S[i]; S[i] = S[j]; S[j] = t;
                }
                byte[] saida = new byte[dados.length];
                for (int n = 0, i = 0, j = 0; n < dados.length; n++) { // PRGA: gera o fluxo e faz XOR
                    i = (i + 1) & 255;
                    j = (j + S[i]) & 255;
                    int t = S[i]; S[i] = S[j]; S[j] = t;
                    saida[n] = (byte) (dados[n] ^ S[(S[i] + S[j]) & 255]);
                }
                return saida;
            }

            public static void main(String[] args) {
                HexFormat h = HexFormat.of().withUpperCase();
                System.out.println(h.formatHex(rc4("Key".getBytes(StandardCharsets.UTF_8), "Plaintext".getBytes(StandardCharsets.UTF_8)))); // BBF316E8D940AF0AD3
                System.out.println(h.formatHex(rc4("Wiki".getBytes(StandardCharsets.UTF_8), "pedia".getBytes(StandardCharsets.UTF_8))));    // 1021BF0420
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <string>
        #include <utility>
        using namespace std;

        string rc4(const string& chave, string dados) {
            unsigned char S[256];
            for (int i = 0; i < 256; i++) S[i] = i;
            for (int i = 0, j = 0; i < 256; i++) { // KSA: embaralha S com a chave
                j = (j + S[i] + (unsigned char)chave[i % chave.size()]) & 255;
                swap(S[i], S[j]);
            }
            for (size_t n = 0, i = 0, j = 0; n < dados.size(); n++) { // PRGA: gera o fluxo e faz XOR
                i = (i + 1) & 255;
                j = (j + S[i]) & 255;
                swap(S[i], S[j]);
                dados[n] ^= S[(S[i] + S[j]) & 255];
            }
            return dados;
        }

        void imprimir(const string& b) {
            for (unsigned char c : b) printf("%02X", c);
            printf("\n");
        }

        int main() {
            imprimir(rc4("Key", "Plaintext")); // BBF316E8D940AF0AD3
            imprimir(rc4("Wiki", "pedia"));    // 1021BF0420
        }
      `,
    },
  },
  {
    id: 'md4',
    name: 'MD4',
    difficulty: 'Intermediário',
    en: { name: 'MD4', summary: 'The 128-bit hash function that pioneered the Merkle-Damgård design of MD5, SHA-1 and SHA-2 — fast, and completely broken.' },
    facts: { 'Criado por': 'Ronald Rivest', 'Ano': '1990', 'Tamanho do resumo': '128 bits', 'Rodadas': '3 (48 passos)', 'Situação': 'Quebrada — colisões em microssegundos' },
    summary: 'A função de hash de 128 bits que inaugurou o projeto de MD5, SHA-1 e SHA-2 — rápida e completamente quebrada.',
    description:
      'O MD4 transforma uma mensagem de qualquer tamanho em um resumo de 128 bits. A mensagem é completada (um bit 1, zeros e o tamanho original) até um múltiplo de 512 bits e processada em blocos de 64 bytes. Para cada bloco, quatro registradores de 32 bits (A, B, C, D) passam por 3 rodadas de 16 passos. Cada passo soma ao registrador uma função lógica dos outros três, uma palavra do bloco e uma constante, e então gira os bits. Esse esquema — estado fixo, blocos processados em sequência, operações de 32 bits rápidas — é a construção de Merkle-Damgård que o MD5, o SHA-1 e o SHA-2 herdaram. O MD4 em si foi quebrado rapidamente: hoje uma colisão (duas mensagens com o mesmo hash) é gerada em menos de um milissegundo.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Complete a mensagem: byte 0x80, zeros até sobrarem 8 bytes no bloco de 64, e o tamanho em bits (64 bits, little-endian).',
      'Inicialize A = 67452301, B = efcdab89, C = 98badcfe, D = 10325476.',
      'Para cada bloco de 16 palavras: rodada 1 com F(x, y, z) = (x ∧ y) ∨ (¬x ∧ z); rodada 2 com a maioria G, mais 5a827999; rodada 3 com H = x ⊕ y ⊕ z, mais 6ed9eba1.',
      'Em cada passo: a = (a + função(b, c, d) + palavra + constante) girado s bits; os papéis de a, b, c e d se revezam.',
      'Some os registradores aos valores do início do bloco. O resumo é A ‖ B ‖ C ‖ D em little-endian.',
    ],
    usedIn: ['Senhas do Windows (hash NTLM = MD4 da senha em UTF-16)', 'Ed2k/eMule (identificação de arquivos)', 'rsync (versões antigas, somas de verificação)', 'Base do MD5 e do RIPEMD', 'Pesquisa em criptoanálise'],
    realWorld: [
      { title: 'Senhas do Windows', text: 'O hash NT, usado para guardar senhas no Windows e no protocolo NTLM, é simplesmente o MD4 da senha em UTF-16, sem salt. Por isso tabelas pré-calculadas e GPUs quebram senhas fracas com facilidade.' },
      { title: 'Redes de compartilhamento', text: 'A rede eDonkey/eMule identificava arquivos por um hash baseado em MD4 (ed2k), calculado em pedaços de 9,28 MB.' },
      { title: 'Laboratório de criptoanálise', text: 'Por ser simples e quebrado, o MD4 é o "rato de laboratório" para estudar ataques diferenciais em funções de hash — técnicas que depois derrubaram o MD5 e o SHA-1.' },
    ],
    curiosities: [
      'Hans Dobbertin encontrou colisões completas do MD4 em 1995; em 2005, Xiaoyun Wang mostrou como gerá-las à mão, com poucos cálculos.',
      'A sigla MD vem de "Message Digest" (resumo de mensagem). Rivest criou MD2 (1989), MD4 (1990), MD5 (1991) e, em 2008, o MD6.',
      'Apesar de quebrado, o MD4 ainda está presente em sistemas Windows atuais por compatibilidade com o NTLM.',
    ],
    code: {
      python: String.raw`
        def md4(mensagem):
            rotl = lambda x, n: ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF
            m = bytearray(mensagem) + b"\x80"
            m += b"\x00" * ((56 - len(m)) % 64) + (len(mensagem) * 8).to_bytes(8, "little")
            h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]
            funcoes = [lambda x, y, z: (x & y) | (~x & z),
                       lambda x, y, z: (x & y) | (x & z) | (y & z),
                       lambda x, y, z: x ^ y ^ z]
            ordem = [list(range(16)),
                     [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
                     [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]]
            giros = [[3, 7, 11, 19], [3, 5, 9, 13], [3, 9, 11, 15]]
            constantes = [0, 0x5A827999, 0x6ED9EBA1]
            for bloco in range(0, len(m), 64):
                X = [int.from_bytes(m[bloco + 4 * i:bloco + 4 * i + 4], "little") for i in range(16)]
                a, b, c, d = h
                for r in range(3):
                    for i in range(16):
                        t = rotl((a + funcoes[r](b, c, d) + X[ordem[r][i]] + constantes[r]) & 0xFFFFFFFF, giros[r][i % 4])
                        a, b, c, d = d, t, b, c   # os papéis dos registradores se revezam
                h = [(x + y) & 0xFFFFFFFF for x, y in zip(h, (a, b, c, d))]
            return b"".join(x.to_bytes(4, "little") for x in h).hex()

        print(md4(b""))     # 31d6cfe0d16ae931b73c59d7e0c089c0
        print(md4(b"abc"))  # a448017aaf21d8525fc10ae87aa6729d
      `,
      javascript: String.raw`
        function md4(mensagem) {
          const rotl = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
          const tamanho = Math.ceil((mensagem.length + 9) / 64) * 64;
          const m = new Uint8Array(tamanho);
          m.set(mensagem);
          m[mensagem.length] = 0x80;
          new DataView(m.buffer).setBigUint64(tamanho - 8, BigInt(mensagem.length * 8), true); // tamanho em bits, little-endian
          const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
          const funcoes = [(x, y, z) => (x & y) | (~x & z), (x, y, z) => (x & y) | (x & z) | (y & z), (x, y, z) => x ^ y ^ z];
          const ordem = [[...Array(16).keys()], [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15], [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]];
          const giros = [[3, 7, 11, 19], [3, 5, 9, 13], [3, 9, 11, 15]];
          const constantes = [0, 0x5a827999, 0x6ed9eba1];
          const dv = new DataView(m.buffer);
          for (let bloco = 0; bloco < tamanho; bloco += 64) {
            const X = Array.from({ length: 16 }, (_, i) => dv.getUint32(bloco + 4 * i, true));
            let [a, b, c, d] = h;
            for (let r = 0; r < 3; r++) {
              for (let i = 0; i < 16; i++) {
                const t = rotl((a + funcoes[r](b, c, d) + X[ordem[r][i]] + constantes[r]) >>> 0, giros[r][i % 4]);
                [a, b, c, d] = [d, t, b, c]; // os papéis dos registradores se revezam
              }
            }
            [a, b, c, d].forEach((v, i) => { h[i] = (h[i] + v) >>> 0; });
          }
          const saida = new DataView(new ArrayBuffer(16));
          h.forEach((v, i) => saida.setUint32(4 * i, v, true));
          return [...new Uint8Array(saida.buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
        }

        console.log(md4(new TextEncoder().encode("")));    // 31d6cfe0d16ae931b73c59d7e0c089c0
        console.log(md4(new TextEncoder().encode("abc"))); // a448017aaf21d8525fc10ae87aa6729d
      `,
      java: String.raw`
        import java.nio.ByteBuffer;
        import java.nio.ByteOrder;
        import java.nio.charset.StandardCharsets;
        import java.util.HexFormat;

        public class MD4 {
            static final int[][] ORDEM = {
                {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15},
                {0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15},
                {0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15}};
            static final int[][] GIROS = {{3, 7, 11, 19}, {3, 5, 9, 13}, {3, 9, 11, 15}};
            static final int[] CONSTANTES = {0, 0x5A827999, 0x6ED9EBA1};

            static int funcao(int r, int x, int y, int z) {
                return r == 0 ? (x & y) | (~x & z) : r == 1 ? (x & y) | (x & z) | (y & z) : x ^ y ^ z;
            }

            static String md4(byte[] mensagem) {
                int tamanho = (mensagem.length + 9 + 63) / 64 * 64;
                ByteBuffer m = ByteBuffer.allocate(tamanho).order(ByteOrder.LITTLE_ENDIAN);
                m.put(mensagem).put((byte) 0x80);
                m.putLong(tamanho - 8, (long) mensagem.length * 8); // tamanho em bits, little-endian
                int[] h = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476};
                for (int bloco = 0; bloco < tamanho; bloco += 64) {
                    int[] X = new int[16];
                    for (int i = 0; i < 16; i++) X[i] = m.getInt(bloco + 4 * i);
                    int a = h[0], b = h[1], c = h[2], d = h[3];
                    for (int r = 0; r < 3; r++) {
                        for (int i = 0; i < 16; i++) {
                            int t = Integer.rotateLeft(a + funcao(r, b, c, d) + X[ORDEM[r][i]] + CONSTANTES[r], GIROS[r][i % 4]);
                            a = d; d = c; c = b; b = t; // os papéis dos registradores se revezam
                        }
                    }
                    h[0] += a; h[1] += b; h[2] += c; h[3] += d;
                }
                ByteBuffer saida = ByteBuffer.allocate(16).order(ByteOrder.LITTLE_ENDIAN);
                for (int v : h) saida.putInt(v);
                return HexFormat.of().formatHex(saida.array());
            }

            public static void main(String[] args) {
                System.out.println(md4("".getBytes(StandardCharsets.UTF_8)));    // 31d6cfe0d16ae931b73c59d7e0c089c0
                System.out.println(md4("abc".getBytes(StandardCharsets.UTF_8))); // a448017aaf21d8525fc10ae87aa6729d
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <string>
        #include <vector>
        using namespace std;

        uint32_t rotl(uint32_t x, int n) { return (x << n) | (x >> (32 - n)); }

        string md4(const string& mensagem) {
            vector<uint8_t> m(mensagem.begin(), mensagem.end());
            uint64_t bits = (uint64_t)mensagem.size() * 8;
            m.push_back(0x80);
            while (m.size() % 64 != 56) m.push_back(0);
            for (int i = 0; i < 8; i++) m.push_back((bits >> (8 * i)) & 0xFF); // tamanho em bits, little-endian
            const int ordem[3][16] = {{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15},
                                      {0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15},
                                      {0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15}};
            const int giros[3][4] = {{3, 7, 11, 19}, {3, 5, 9, 13}, {3, 9, 11, 15}};
            const uint32_t constantes[3] = {0, 0x5A827999, 0x6ED9EBA1};
            uint32_t h[4] = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476};
            for (size_t bloco = 0; bloco < m.size(); bloco += 64) {
                uint32_t X[16];
                for (int i = 0; i < 16; i++)
                    X[i] = m[bloco + 4 * i] | (m[bloco + 4 * i + 1] << 8) | (m[bloco + 4 * i + 2] << 16) | ((uint32_t)m[bloco + 4 * i + 3] << 24);
                uint32_t a = h[0], b = h[1], c = h[2], d = h[3];
                for (int r = 0; r < 3; r++) {
                    for (int i = 0; i < 16; i++) {
                        uint32_t f = r == 0 ? (b & c) | (~b & d) : r == 1 ? (b & c) | (b & d) | (c & d) : b ^ c ^ d;
                        uint32_t t = rotl(a + f + X[ordem[r][i]] + constantes[r], giros[r][i % 4]);
                        a = d; d = c; c = b; b = t; // os papéis dos registradores se revezam
                    }
                }
                h[0] += a; h[1] += b; h[2] += c; h[3] += d;
            }
            char saida[33];
            for (int i = 0; i < 16; i++) snprintf(saida + 2 * i, 3, "%02x", (h[i / 4] >> (8 * (i % 4))) & 0xFF);
            return saida;
        }

        int main() {
            printf("%s\n", md4("").c_str());    // 31d6cfe0d16ae931b73c59d7e0c089c0
            printf("%s\n", md4("abc").c_str()); // a448017aaf21d8525fc10ae87aa6729d
        }
      `,
    },
  },
  {
    id: 'md5',
    name: 'MD5',
    difficulty: 'Intermediário',
    en: { name: 'MD5', summary: 'The 128-bit hash that was everywhere in the 1990s and 2000s — still useful for checksums, broken for security.' },
    facts: { 'Criado por': 'Ronald Rivest', 'Ano': '1991 (RFC 1321, 1992)', 'Tamanho do resumo': '128 bits', 'Rodadas': '4 (64 passos)', 'Situação': 'Quebrada — colisões em segundos' },
    summary: 'O hash de 128 bits que esteve em toda parte nos anos 1990 e 2000 — ainda útil como soma de verificação, quebrado para segurança.',
    description:
      'O MD5 é o sucessor reforçado do MD4. Ele também processa a mensagem em blocos de 512 bits com quatro registradores de 32 bits, mas usa 4 rodadas de 16 passos, uma constante diferente em cada passo — derivada do seno: K[i] = ⌊|sen(i + 1)| · 2³²⌋ — e uma ordem de giros mais variada. Em cada passo, uma função lógica (F, G, H ou I) combina três registradores, soma o quarto, a constante e uma palavra da mensagem, gira o resultado e o soma a B. O resultado é um resumo de 128 bits com forte efeito avalanche: trocar um único bit da entrada muda cerca de metade dos bits de saída. Ainda assim, desde 2004 é possível fabricar colisões, e o MD5 não deve mais ser usado para assinaturas, certificados ou senhas.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Complete a mensagem como no MD4: 0x80, zeros e o tamanho em bits (64 bits, little-endian).',
      'Inicialize A, B, C, D com 67452301, efcdab89, 98badcfe, 10325476.',
      'Para cada passo i de 0 a 63, escolha a função (F, G, H, I) e a palavra g conforme a rodada.',
      'Calcule F = função(B, C, D) + A + K[i] + M[g]; depois A = D, D = C, C = B e B = B + (F girado s[i] bits).',
      'Ao fim do bloco, some os registradores aos valores iniciais. O resumo é A ‖ B ‖ C ‖ D em little-endian.',
    ],
    usedIn: ['Somas de verificação de arquivos (md5sum)', 'Deduplicação e identificação de arquivos', 'Chaves de cache e ETags', 'Sistemas legados de senhas (inseguro)', 'Particionamento de dados (hash consistente)'],
    realWorld: [
      { title: 'Conferir downloads', text: 'Muitos sites ainda publicam o MD5 dos arquivos para verificar se o download chegou íntegro. Contra erros de transmissão, funciona; contra um atacante que troca o arquivo e o hash, não.' },
      { title: 'O malware Flame', text: 'Em 2012, o malware de espionagem Flame usou uma colisão de MD5 para forjar um certificado da Microsoft e se passar por uma atualização legítima do Windows.' },
      { title: 'Certificados falsos', text: 'Em 2008, pesquisadores criaram um certificado de autoridade certificadora falso, aceito pelos navegadores, usando colisões de MD5 e 200 PlayStation 3 em paralelo.' },
    ],
    curiosities: [
      'As constantes vêm do seno para mostrar que não há "segredo" escondido nelas — os chamados números "nada na manga" (nothing-up-my-sleeve).',
      'Em 2004, Xiaoyun Wang e sua equipe apresentaram as primeiras colisões completas do MD5; hoje um notebook gera uma colisão em segundos.',
      'O MD5 de uma string vazia, d41d8cd98f00b204e9800998ecf8427e, é tão comum que muitos programadores o reconhecem de cabeça.',
    ],
    code: {
      python: String.raw`
        import math

        S = [7, 12, 17, 22] * 4 + [5, 9, 14, 20] * 4 + [4, 11, 16, 23] * 4 + [6, 10, 15, 21] * 4
        K = [int(abs(math.sin(i + 1)) * 2**32) & 0xFFFFFFFF for i in range(64)]

        def md5(mensagem):
            rotl = lambda x, n: ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF
            m = bytearray(mensagem) + b"\x80"
            m += b"\x00" * ((56 - len(m)) % 64) + (len(mensagem) * 8).to_bytes(8, "little")
            h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]
            for bloco in range(0, len(m), 64):
                M = [int.from_bytes(m[bloco + 4 * i:bloco + 4 * i + 4], "little") for i in range(16)]
                A, B, C, D = h
                for i in range(64):
                    if i < 16:   F, g = (B & C) | (~B & D), i
                    elif i < 32: F, g = (D & B) | (~D & C), (5 * i + 1) % 16
                    elif i < 48: F, g = B ^ C ^ D, (3 * i + 5) % 16
                    else:        F, g = C ^ (B | ~D), (7 * i) % 16
                    F = (F + A + K[i] + M[g]) & 0xFFFFFFFF
                    A, D, C = D, C, B
                    B = (B + rotl(F, S[i])) & 0xFFFFFFFF
                h = [(x + y) & 0xFFFFFFFF for x, y in zip(h, (A, B, C, D))]
            return b"".join(x.to_bytes(4, "little") for x in h).hex()

        print(md5(b""))  # d41d8cd98f00b204e9800998ecf8427e
        print(md5(b"The quick brown fox jumps over the lazy dog"))  # 9e107d9d372bb6826bd81d3542a419d6
      `,
      javascript: String.raw`
        const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
        const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);

        function md5(mensagem) {
          const rotl = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
          const tamanho = Math.ceil((mensagem.length + 9) / 64) * 64;
          const m = new Uint8Array(tamanho);
          m.set(mensagem);
          m[mensagem.length] = 0x80;
          const dv = new DataView(m.buffer);
          dv.setBigUint64(tamanho - 8, BigInt(mensagem.length * 8), true); // tamanho em bits, little-endian
          const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
          for (let bloco = 0; bloco < tamanho; bloco += 64) {
            const M = Array.from({ length: 16 }, (_, i) => dv.getUint32(bloco + 4 * i, true));
            let [A, B, C, D] = h;
            for (let i = 0; i < 64; i++) {
              let F, g;
              if (i < 16) { F = (B & C) | (~B & D); g = i; }
              else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
              else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
              else { F = C ^ (B | ~D); g = (7 * i) % 16; }
              F = (F + A + K[i] + M[g]) >>> 0;
              [A, D, C] = [D, C, B];
              B = (B + rotl(F, S[(i >> 4) * 4 + (i % 4)])) >>> 0;
            }
            [A, B, C, D].forEach((v, i) => { h[i] = (h[i] + v) >>> 0; });
          }
          const saida = new DataView(new ArrayBuffer(16));
          h.forEach((v, i) => saida.setUint32(4 * i, v, true));
          return [...new Uint8Array(saida.buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
        }

        console.log(md5(new TextEncoder().encode("")));  // d41d8cd98f00b204e9800998ecf8427e
        console.log(md5(new TextEncoder().encode("The quick brown fox jumps over the lazy dog"))); // 9e107d9d372bb6826bd81d3542a419d6
      `,
      java: String.raw`
        import java.nio.ByteBuffer;
        import java.nio.ByteOrder;
        import java.nio.charset.StandardCharsets;
        import java.util.HexFormat;

        public class MD5 {
            static final int[] S = {7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21};
            static final int[] K = new int[64];
            static { for (int i = 0; i < 64; i++) K[i] = (int) (long) Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296.0); }

            static String md5(byte[] mensagem) {
                int tamanho = (mensagem.length + 9 + 63) / 64 * 64;
                ByteBuffer m = ByteBuffer.allocate(tamanho).order(ByteOrder.LITTLE_ENDIAN);
                m.put(mensagem).put((byte) 0x80);
                m.putLong(tamanho - 8, (long) mensagem.length * 8); // tamanho em bits, little-endian
                int[] h = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476};
                for (int bloco = 0; bloco < tamanho; bloco += 64) {
                    int[] M = new int[16];
                    for (int i = 0; i < 16; i++) M[i] = m.getInt(bloco + 4 * i);
                    int A = h[0], B = h[1], C = h[2], D = h[3];
                    for (int i = 0; i < 64; i++) {
                        int F, g;
                        if (i < 16) { F = (B & C) | (~B & D); g = i; }
                        else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
                        else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
                        else { F = C ^ (B | ~D); g = (7 * i) % 16; }
                        F = F + A + K[i] + M[g];
                        A = D; D = C; C = B;
                        B = B + Integer.rotateLeft(F, S[(i / 16) * 4 + i % 4]);
                    }
                    h[0] += A; h[1] += B; h[2] += C; h[3] += D;
                }
                ByteBuffer saida = ByteBuffer.allocate(16).order(ByteOrder.LITTLE_ENDIAN);
                for (int v : h) saida.putInt(v);
                return HexFormat.of().formatHex(saida.array());
            }

            public static void main(String[] args) {
                System.out.println(md5("".getBytes(StandardCharsets.UTF_8))); // d41d8cd98f00b204e9800998ecf8427e
                System.out.println(md5("The quick brown fox jumps over the lazy dog".getBytes(StandardCharsets.UTF_8))); // 9e107d9d372bb6826bd81d3542a419d6
            }
        }
      `,
      cpp: String.raw`
        #include <cmath>
        #include <cstdint>
        #include <cstdio>
        #include <string>
        #include <vector>
        using namespace std;

        uint32_t rotl(uint32_t x, int n) { return (x << n) | (x >> (32 - n)); }

        string md5(const string& mensagem) {
            const int S[16] = {7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21};
            uint32_t K[64];
            for (int i = 0; i < 64; i++) K[i] = (uint32_t)(uint64_t)floor(fabs(sin(i + 1)) * 4294967296.0);
            vector<uint8_t> m(mensagem.begin(), mensagem.end());
            uint64_t bits = (uint64_t)mensagem.size() * 8;
            m.push_back(0x80);
            while (m.size() % 64 != 56) m.push_back(0);
            for (int i = 0; i < 8; i++) m.push_back((bits >> (8 * i)) & 0xFF); // tamanho em bits, little-endian
            uint32_t h[4] = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476};
            for (size_t bloco = 0; bloco < m.size(); bloco += 64) {
                uint32_t M[16];
                for (int i = 0; i < 16; i++)
                    M[i] = m[bloco + 4 * i] | (m[bloco + 4 * i + 1] << 8) | (m[bloco + 4 * i + 2] << 16) | ((uint32_t)m[bloco + 4 * i + 3] << 24);
                uint32_t A = h[0], B = h[1], C = h[2], D = h[3];
                for (int i = 0; i < 64; i++) {
                    uint32_t F;
                    int g;
                    if (i < 16) { F = (B & C) | (~B & D); g = i; }
                    else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
                    else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
                    else { F = C ^ (B | ~D); g = (7 * i) % 16; }
                    F = F + A + K[i] + M[g];
                    A = D; D = C; C = B;
                    B = B + rotl(F, S[(i / 16) * 4 + i % 4]);
                }
                h[0] += A; h[1] += B; h[2] += C; h[3] += D;
            }
            char saida[33];
            for (int i = 0; i < 16; i++) snprintf(saida + 2 * i, 3, "%02x", (h[i / 4] >> (8 * (i % 4))) & 0xFF);
            return saida;
        }

        int main() {
            printf("%s\n", md5("").c_str()); // d41d8cd98f00b204e9800998ecf8427e
            printf("%s\n", md5("The quick brown fox jumps over the lazy dog").c_str()); // 9e107d9d372bb6826bd81d3542a419d6
        }
      `,
    },
  },
  {
    id: 'sha-1',
    name: 'SHA-1',
    difficulty: 'Intermediário',
    en: { name: 'SHA-1', summary: 'The 160-bit NSA-designed hash behind TLS certificates, Git and PGP for two decades — until a public collision in 2017.' },
    facts: { 'Criado por': 'NSA (publicado pelo NIST)', 'Ano': '1995 (FIPS 180-1)', 'Tamanho do resumo': '160 bits', 'Rodadas': '80 passos', 'Situação': 'Quebrada — colisão pública em 2017 (SHAttered)' },
    summary: 'O hash de 160 bits projetado pela NSA que sustentou certificados TLS, Git e PGP por duas décadas — até uma colisão pública em 2017.',
    description:
      'O SHA-1 segue o desenho do MD4/MD5, com cinco registradores de 32 bits (A a E) e um resumo de 160 bits. A grande novidade é a expansão da mensagem: as 16 palavras de cada bloco viram 80, e cada palavra nova é o XOR de quatro anteriores girado 1 bit — assim cada bit da entrada influencia muitos passos. Em cada um dos 80 passos, temp = (A girado 5) + f(B, C, D) + E + K + W[i]; os registradores descem uma posição, e B é girado 30 bits. A função f e a constante K mudam a cada 20 passos. Por anos foi o hash padrão da internet, mas ataques teóricos surgiram em 2005, e em 2017 Google e CWI publicaram dois PDFs diferentes com o mesmo SHA-1. Hoje deve ser substituído por SHA-256 ou SHA-3.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Complete a mensagem: 0x80, zeros e o tamanho em bits (64 bits, big-endian), até um múltiplo de 64 bytes.',
      'Inicialize h0..h4 = 67452301, efcdab89, 98badcfe, 10325476, c3d2e1f0.',
      'Expanda o bloco: W[0..15] são as palavras do bloco; W[i] = (W[i−3] ⊕ W[i−8] ⊕ W[i−14] ⊕ W[i−16]) girado 1 bit, até W[79].',
      'Em cada passo: temp = rotl(A, 5) + f(B, C, D) + E + K + W[i]; E = D; D = C; C = rotl(B, 30); B = A; A = temp.',
      'f e K mudam a cada 20 passos (escolha, paridade, maioria, paridade). Some os registradores a h0..h4; o resumo é h0 ‖ … ‖ h4.',
    ],
    usedIn: ['Git (identificação de commits e objetos)', 'Certificados TLS e assinaturas (até ~2017)', 'PGP/GPG (impressões digitais de chaves)', 'HMAC-SHA1 e TOTP (códigos de autenticação de 6 dígitos)', 'Somas de verificação e deduplicação'],
    realWorld: [
      { title: 'Git', text: 'Todo commit, árvore e arquivo do Git é identificado pelo seu SHA-1 — os 40 caracteres hexadecimais que aparecem no log. Depois da colisão de 2017, o Git passou a detectar tentativas de colisão e ganhou suporte a SHA-256.' },
      { title: 'SHAttered', text: 'Em 2017, o Google e o instituto CWI apresentaram dois PDFs diferentes com o mesmo SHA-1. O ataque custou o equivalente a 6.500 anos de CPU e 110 anos de GPU — caro, mas viável. Em 2020, uma colisão com prefixo escolhido custou cerca de 45 mil dólares.' },
      { title: 'Códigos de dois fatores', text: 'Os códigos de 6 dígitos de aplicativos autenticadores (TOTP) normalmente usam HMAC-SHA1. Nesse uso, colisões não são um problema, e o SHA-1 continua seguro.' },
    ],
    curiosities: [
      'A primeira versão, de 1993 (hoje chamada SHA-0), não tinha o giro de 1 bit na expansão da mensagem. A NSA o acrescentou em 1995 sem explicar o motivo — anos depois, ficou claro que ele corrigia uma fraqueza.',
      'A constante 5a827999 é √2 · 2³⁰, e 6ed9eba1, 8f1bbcdc e ca62c1d6 vêm de √3, √5 e √10 — números "nada na manga".',
      'Os navegadores deixaram de aceitar certificados assinados com SHA-1 em 2017, mesmo ano da colisão pública.',
    ],
    code: {
      python: String.raw`
        def sha1(mensagem):
            rotl = lambda x, n: ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF
            m = bytearray(mensagem) + b"\x80"
            m += b"\x00" * ((56 - len(m)) % 64) + (len(mensagem) * 8).to_bytes(8, "big")
            h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]
            for bloco in range(0, len(m), 64):
                w = [int.from_bytes(m[bloco + 4 * i:bloco + 4 * i + 4], "big") for i in range(16)]
                for i in range(16, 80):  # expansão: 16 palavras viram 80
                    w.append(rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1))
                a, b, c, d, e = h
                for i in range(80):
                    if i < 20:   f, k = (b & c) | (~b & d), 0x5A827999
                    elif i < 40: f, k = b ^ c ^ d, 0x6ED9EBA1
                    elif i < 60: f, k = (b & c) | (b & d) | (c & d), 0x8F1BBCDC
                    else:        f, k = b ^ c ^ d, 0xCA62C1D6
                    temp = (rotl(a, 5) + (f & 0xFFFFFFFF) + e + k + w[i]) & 0xFFFFFFFF
                    a, b, c, d, e = temp, a, rotl(b, 30), c, d
                h = [(x + y) & 0xFFFFFFFF for x, y in zip(h, (a, b, c, d, e))]
            return "".join(f"{x:08x}" for x in h)

        print(sha1(b"abc"))  # a9993e364706816aba3e25717850c26c9cd0d89d
        print(sha1(b""))     # da39a3ee5e6b4b0d3255bfef95601890afd80709
      `,
      javascript: String.raw`
        function sha1(mensagem) {
          const rotl = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
          const tamanho = Math.ceil((mensagem.length + 9) / 64) * 64;
          const m = new Uint8Array(tamanho);
          m.set(mensagem);
          m[mensagem.length] = 0x80;
          const dv = new DataView(m.buffer);
          dv.setBigUint64(tamanho - 8, BigInt(mensagem.length * 8)); // tamanho em bits, big-endian
          const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
          for (let bloco = 0; bloco < tamanho; bloco += 64) {
            const w = Array.from({ length: 16 }, (_, i) => dv.getUint32(bloco + 4 * i));
            for (let i = 16; i < 80; i++) w.push(rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1)); // expansão
            let [a, b, c, d, e] = h;
            for (let i = 0; i < 80; i++) {
              let f, k;
              if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
              else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
              else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
              else { f = b ^ c ^ d; k = 0xca62c1d6; }
              const temp = (rotl(a, 5) + (f >>> 0) + e + k + w[i]) >>> 0;
              [a, b, c, d, e] = [temp, a, rotl(b, 30), c, d];
            }
            [a, b, c, d, e].forEach((v, i) => { h[i] = (h[i] + v) >>> 0; });
          }
          return h.map(x => x.toString(16).padStart(8, "0")).join("");
        }

        console.log(sha1(new TextEncoder().encode("abc"))); // a9993e364706816aba3e25717850c26c9cd0d89d
        console.log(sha1(new TextEncoder().encode("")));    // da39a3ee5e6b4b0d3255bfef95601890afd80709
      `,
      java: String.raw`
        import java.nio.ByteBuffer;
        import java.nio.charset.StandardCharsets;

        public class SHA1 {
            static String sha1(byte[] mensagem) {
                int tamanho = (mensagem.length + 9 + 63) / 64 * 64;
                ByteBuffer m = ByteBuffer.allocate(tamanho); // big-endian por padrão
                m.put(mensagem).put((byte) 0x80);
                m.putLong(tamanho - 8, (long) mensagem.length * 8);
                int[] h = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0};
                int[] w = new int[80];
                for (int bloco = 0; bloco < tamanho; bloco += 64) {
                    for (int i = 0; i < 16; i++) w[i] = m.getInt(bloco + 4 * i);
                    for (int i = 16; i < 80; i++) w[i] = Integer.rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1); // expansão
                    int a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
                    for (int i = 0; i < 80; i++) {
                        int f, k;
                        if (i < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
                        else if (i < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
                        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
                        else { f = b ^ c ^ d; k = 0xCA62C1D6; }
                        int temp = Integer.rotateLeft(a, 5) + f + e + k + w[i];
                        e = d; d = c; c = Integer.rotateLeft(b, 30); b = a; a = temp;
                    }
                    h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e;
                }
                StringBuilder sb = new StringBuilder();
                for (int v : h) sb.append(String.format("%08x", v));
                return sb.toString();
            }

            public static void main(String[] args) {
                System.out.println(sha1("abc".getBytes(StandardCharsets.UTF_8))); // a9993e364706816aba3e25717850c26c9cd0d89d
                System.out.println(sha1("".getBytes(StandardCharsets.UTF_8)));    // da39a3ee5e6b4b0d3255bfef95601890afd80709
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <string>
        #include <vector>
        using namespace std;

        uint32_t rotl(uint32_t x, int n) { return (x << n) | (x >> (32 - n)); }

        string sha1(const string& mensagem) {
            vector<uint8_t> m(mensagem.begin(), mensagem.end());
            uint64_t bits = (uint64_t)mensagem.size() * 8;
            m.push_back(0x80);
            while (m.size() % 64 != 56) m.push_back(0);
            for (int i = 7; i >= 0; i--) m.push_back((bits >> (8 * i)) & 0xFF); // tamanho em bits, big-endian
            uint32_t h[5] = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0};
            uint32_t w[80];
            for (size_t bloco = 0; bloco < m.size(); bloco += 64) {
                for (int i = 0; i < 16; i++)
                    w[i] = ((uint32_t)m[bloco + 4 * i] << 24) | (m[bloco + 4 * i + 1] << 16) | (m[bloco + 4 * i + 2] << 8) | m[bloco + 4 * i + 3];
                for (int i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1); // expansão
                uint32_t a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
                for (int i = 0; i < 80; i++) {
                    uint32_t f, k;
                    if (i < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
                    else if (i < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
                    else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
                    else { f = b ^ c ^ d; k = 0xCA62C1D6; }
                    uint32_t temp = rotl(a, 5) + f + e + k + w[i];
                    e = d; d = c; c = rotl(b, 30); b = a; a = temp;
                }
                h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e;
            }
            char saida[41];
            for (int i = 0; i < 5; i++) snprintf(saida + 8 * i, 9, "%08x", h[i]);
            return saida;
        }

        int main() {
            printf("%s\n", sha1("abc").c_str()); // a9993e364706816aba3e25717850c26c9cd0d89d
            printf("%s\n", sha1("").c_str());    // da39a3ee5e6b4b0d3255bfef95601890afd80709
        }
      `,
    },
  },
  {
    id: 'ripemd-160',
    name: 'RIPEMD-160',
    difficulty: 'Avançado',
    en: { name: 'RIPEMD-160', summary: 'A 160-bit hash with two independent parallel lines combined at the end — still unbroken, and used in every Bitcoin address.' },
    facts: { 'Criado por': 'Hans Dobbertin, Antoon Bosselaers e Bart Preneel', 'Ano': '1996', 'Tamanho do resumo': '160 bits', 'Estrutura': 'Duas linhas paralelas de 80 passos', 'Situação': 'Sem colisões conhecidas' },
    summary: 'Um hash de 160 bits com duas linhas paralelas independentes, combinadas no fim — ainda sem quebra prática e presente em todo endereço de Bitcoin.',
    description:
      'O RIPEMD-160 foi criado por pesquisadores acadêmicos europeus como alternativa aberta ao SHA-1, depois que o RIPEMD original mostrou fraquezas. Sua ideia central é processar cada bloco em duas linhas paralelas e diferentes: cada uma tem 5 registradores, 80 passos, sua própria ordem de palavras da mensagem, seus próprios giros e constantes, e usa as cinco funções lógicas em ordem inversa à da outra. No fim do bloco, os resultados das duas linhas são combinados com o estado anterior. Para encontrar uma colisão, um atacante precisa controlar as duas linhas ao mesmo tempo — o que até hoje não foi conseguido para a versão completa.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Complete a mensagem como no MD4/MD5 (tamanho em bits em little-endian) e inicialize h0..h4 como no SHA-1.',
      'Para cada bloco, copie o estado para duas linhas: (A, B, C, D, E) e (A′, B′, C′, D′, E′).',
      'Em cada passo j de 0 a 79, linha esquerda: T = rotl(A + f(j, B, C, D) + X[r[j]] + K[j/16], s[j]) + E; depois A = E, E = D, D = rotl(C, 10), C = B, B = T.',
      'Linha direita: o mesmo com r′, s′, K′ e a função f(79 − j, …).',
      'Combine: T = h1 + C + D′; h1 = h2 + D + E′; h2 = h3 + E + A′; h3 = h4 + A + B′; h4 = h0 + B + C′; h0 = T.',
    ],
    usedIn: ['Endereços de Bitcoin (RIPEMD-160 de SHA-256 da chave pública)', 'Outras criptomoedas derivadas do Bitcoin', 'OpenPGP (impressões digitais opcionais)', 'TrueCrypt e VeraCrypt (derivação de chaves)', 'Padrões ISO/IEC 10118-3'],
    realWorld: [
      { title: 'Endereços de Bitcoin', text: 'Um endereço de Bitcoin tradicional é RIPEMD-160(SHA-256(chave pública)), codificado em Base58. Usar duas funções diferentes protege contra uma eventual quebra de uma delas e encurta o endereço para 160 bits.' },
      { title: 'Criptografia de discos', text: 'O VeraCrypt (sucessor do TrueCrypt) oferece RIPEMD-160 como uma das funções de hash para derivar a chave do volume a partir da senha.' },
      { title: 'Alternativa aberta', text: 'Nos anos 1990, o RIPEMD-160 era a opção "acadêmica" ao SHA-1, projetado pela NSA. Ele foi padronizado pela ISO, mas acabou bem menos usado fora do Bitcoin.' },
    ],
    curiosities: [
      'RIPEMD significa RIPE Message Digest; RIPE foi um projeto europeu de avaliação de primitivas criptográficas (1988–1992).',
      'Hans Dobbertin, coautor do RIPEMD-160, foi também quem encontrou as primeiras colisões do MD4 e mostrou fraquezas no MD5 e no RIPEMD original.',
      'Existem versões com 128, 256 e 320 bits; as de 256 e 320 bits não aumentam a segurança contra colisões — só o tamanho do resumo.',
    ],
    code: {
      python: String.raw`
        R  = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8, 3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,
              1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2, 4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]
        RP = [5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12, 6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2, 15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,
              8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14, 12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]
        S  = [11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8, 7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12, 11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,
              11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12, 9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]
        SP = [8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6, 9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11, 9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,
              15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8, 8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]
        K  = [0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]
        KP = [0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]
        M32 = 0xFFFFFFFF

        def f(j, x, y, z):
            if j < 16: return x ^ y ^ z
            if j < 32: return (x & y) | (~x & z)
            if j < 48: return (x | ~y) ^ z
            if j < 64: return (x & z) | (y & ~z)
            return x ^ (y | ~z)

        def ripemd160(mensagem):
            rotl = lambda x, n: ((x << n) | (x >> (32 - n))) & M32
            m = bytearray(mensagem) + b"\x80"
            m += b"\x00" * ((56 - len(m)) % 64) + (len(mensagem) * 8).to_bytes(8, "little")
            h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]
            for bloco in range(0, len(m), 64):
                X = [int.from_bytes(m[bloco + 4 * i:bloco + 4 * i + 4], "little") for i in range(16)]
                A, B, C, D, E = h
                Ap, Bp, Cp, Dp, Ep = h
                for j in range(80):  # duas linhas paralelas
                    T = (rotl((A + f(j, B, C, D) + X[R[j]] + K[j // 16]) & M32, S[j]) + E) & M32
                    A, E, D, C, B = E, D, rotl(C, 10), B, T
                    T = (rotl((Ap + f(79 - j, Bp, Cp, Dp) + X[RP[j]] + KP[j // 16]) & M32, SP[j]) + Ep) & M32
                    Ap, Ep, Dp, Cp, Bp = Ep, Dp, rotl(Cp, 10), Bp, T
                T = (h[1] + C + Dp) & M32
                h = [T, (h[2] + D + Ep) & M32, (h[3] + E + Ap) & M32, (h[4] + A + Bp) & M32, (h[0] + B + Cp) & M32]
            return b"".join(x.to_bytes(4, "little") for x in h).hex()

        print(ripemd160(b""))     # 9c1185a5c5e9fc54612808977ee8f548b2258d31
        print(ripemd160(b"abc"))  # 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
      `,
      javascript: String.raw`
        const R = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8, 3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,
          1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2, 4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
        const RP = [5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12, 6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2, 15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,
          8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14, 12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
        const S = [11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8, 7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12, 11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,
          11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12, 9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
        const SP = [8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6, 9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11, 9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,
          15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8, 8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];
        const K = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
        const KP = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];

        const f = (j, x, y, z) => (j < 16 ? x ^ y ^ z : j < 32 ? (x & y) | (~x & z) : j < 48 ? (x | ~y) ^ z : j < 64 ? (x & z) | (y & ~z) : x ^ (y | ~z)) >>> 0;
        const rotl = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;

        function ripemd160(mensagem) {
          const tamanho = Math.ceil((mensagem.length + 9) / 64) * 64;
          const m = new Uint8Array(tamanho);
          m.set(mensagem);
          m[mensagem.length] = 0x80;
          const dv = new DataView(m.buffer);
          dv.setBigUint64(tamanho - 8, BigInt(mensagem.length * 8), true);
          let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
          for (let bloco = 0; bloco < tamanho; bloco += 64) {
            const X = Array.from({ length: 16 }, (_, i) => dv.getUint32(bloco + 4 * i, true));
            let [A, B, C, D, E] = h, [Ap, Bp, Cp, Dp, Ep] = h;
            for (let j = 0; j < 80; j++) { // duas linhas paralelas
              let T = (rotl((A + f(j, B, C, D) + X[R[j]] + K[j >> 4]) >>> 0, S[j]) + E) >>> 0;
              [A, E, D, C, B] = [E, D, rotl(C, 10), B, T];
              T = (rotl((Ap + f(79 - j, Bp, Cp, Dp) + X[RP[j]] + KP[j >> 4]) >>> 0, SP[j]) + Ep) >>> 0;
              [Ap, Ep, Dp, Cp, Bp] = [Ep, Dp, rotl(Cp, 10), Bp, T];
            }
            const T = (h[1] + C + Dp) >>> 0;
            h = [T, (h[2] + D + Ep) >>> 0, (h[3] + E + Ap) >>> 0, (h[4] + A + Bp) >>> 0, (h[0] + B + Cp) >>> 0];
          }
          const saida = new DataView(new ArrayBuffer(20));
          h.forEach((v, i) => saida.setUint32(4 * i, v, true));
          return [...new Uint8Array(saida.buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
        }

        console.log(ripemd160(new TextEncoder().encode("")));    // 9c1185a5c5e9fc54612808977ee8f548b2258d31
        console.log(ripemd160(new TextEncoder().encode("abc"))); // 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
      `,
      java: String.raw`
        import java.nio.ByteBuffer;
        import java.nio.ByteOrder;
        import java.nio.charset.StandardCharsets;
        import java.util.HexFormat;

        public class RIPEMD160 {
            static final int[] R = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8, 3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,
                1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2, 4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13};
            static final int[] RP = {5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12, 6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2, 15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,
                8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14, 12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11};
            static final int[] S = {11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8, 7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12, 11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,
                11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12, 9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6};
            static final int[] SP = {8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6, 9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11, 9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,
                15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8, 8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11};
            static final int[] K = {0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E};
            static final int[] KP = {0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000};

            static int f(int j, int x, int y, int z) {
                if (j < 16) return x ^ y ^ z;
                if (j < 32) return (x & y) | (~x & z);
                if (j < 48) return (x | ~y) ^ z;
                if (j < 64) return (x & z) | (y & ~z);
                return x ^ (y | ~z);
            }

            static String ripemd160(byte[] mensagem) {
                int tamanho = (mensagem.length + 9 + 63) / 64 * 64;
                ByteBuffer m = ByteBuffer.allocate(tamanho).order(ByteOrder.LITTLE_ENDIAN);
                m.put(mensagem).put((byte) 0x80);
                m.putLong(tamanho - 8, (long) mensagem.length * 8);
                int[] h = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0};
                for (int bloco = 0; bloco < tamanho; bloco += 64) {
                    int[] X = new int[16];
                    for (int i = 0; i < 16; i++) X[i] = m.getInt(bloco + 4 * i);
                    int A = h[0], B = h[1], C = h[2], D = h[3], E = h[4];
                    int Ap = A, Bp = B, Cp = C, Dp = D, Ep = E;
                    for (int j = 0; j < 80; j++) { // duas linhas paralelas
                        int T = Integer.rotateLeft(A + f(j, B, C, D) + X[R[j]] + K[j / 16], S[j]) + E;
                        A = E; E = D; D = Integer.rotateLeft(C, 10); C = B; B = T;
                        T = Integer.rotateLeft(Ap + f(79 - j, Bp, Cp, Dp) + X[RP[j]] + KP[j / 16], SP[j]) + Ep;
                        Ap = Ep; Ep = Dp; Dp = Integer.rotateLeft(Cp, 10); Cp = Bp; Bp = T;
                    }
                    int T = h[1] + C + Dp;
                    h[1] = h[2] + D + Ep; h[2] = h[3] + E + Ap; h[3] = h[4] + A + Bp; h[4] = h[0] + B + Cp; h[0] = T;
                }
                ByteBuffer saida = ByteBuffer.allocate(20).order(ByteOrder.LITTLE_ENDIAN);
                for (int v : h) saida.putInt(v);
                return HexFormat.of().formatHex(saida.array());
            }

            public static void main(String[] args) {
                System.out.println(ripemd160("".getBytes(StandardCharsets.UTF_8)));    // 9c1185a5c5e9fc54612808977ee8f548b2258d31
                System.out.println(ripemd160("abc".getBytes(StandardCharsets.UTF_8))); // 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <string>
        #include <vector>
        using namespace std;

        const int R[80] = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8, 3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,
            1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2, 4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13};
        const int RP[80] = {5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12, 6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2, 15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,
            8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14, 12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11};
        const int S[80] = {11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8, 7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12, 11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,
            11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12, 9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6};
        const int SP[80] = {8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6, 9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11, 9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,
            15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8, 8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11};
        const uint32_t K[5] = {0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E};
        const uint32_t KP[5] = {0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000};

        uint32_t rotl(uint32_t x, int n) { return (x << n) | (x >> (32 - n)); }
        uint32_t f(int j, uint32_t x, uint32_t y, uint32_t z) {
            if (j < 16) return x ^ y ^ z;
            if (j < 32) return (x & y) | (~x & z);
            if (j < 48) return (x | ~y) ^ z;
            if (j < 64) return (x & z) | (y & ~z);
            return x ^ (y | ~z);
        }

        string ripemd160(const string& mensagem) {
            vector<uint8_t> m(mensagem.begin(), mensagem.end());
            uint64_t bits = (uint64_t)mensagem.size() * 8;
            m.push_back(0x80);
            while (m.size() % 64 != 56) m.push_back(0);
            for (int i = 0; i < 8; i++) m.push_back((bits >> (8 * i)) & 0xFF);
            uint32_t h[5] = {0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0};
            for (size_t bloco = 0; bloco < m.size(); bloco += 64) {
                uint32_t X[16];
                for (int i = 0; i < 16; i++)
                    X[i] = m[bloco + 4 * i] | (m[bloco + 4 * i + 1] << 8) | (m[bloco + 4 * i + 2] << 16) | ((uint32_t)m[bloco + 4 * i + 3] << 24);
                uint32_t A = h[0], B = h[1], C = h[2], D = h[3], E = h[4];
                uint32_t Ap = A, Bp = B, Cp = C, Dp = D, Ep = E;
                for (int j = 0; j < 80; j++) { // duas linhas paralelas
                    uint32_t T = rotl(A + f(j, B, C, D) + X[R[j]] + K[j / 16], S[j]) + E;
                    A = E; E = D; D = rotl(C, 10); C = B; B = T;
                    T = rotl(Ap + f(79 - j, Bp, Cp, Dp) + X[RP[j]] + KP[j / 16], SP[j]) + Ep;
                    Ap = Ep; Ep = Dp; Dp = rotl(Cp, 10); Cp = Bp; Bp = T;
                }
                uint32_t T = h[1] + C + Dp;
                h[1] = h[2] + D + Ep; h[2] = h[3] + E + Ap; h[3] = h[4] + A + Bp; h[4] = h[0] + B + Cp; h[0] = T;
            }
            char saida[41];
            for (int i = 0; i < 20; i++) snprintf(saida + 2 * i, 3, "%02x", (h[i / 4] >> (8 * (i % 4))) & 0xFF);
            return saida;
        }

        int main() {
            printf("%s\n", ripemd160("").c_str());    // 9c1185a5c5e9fc54612808977ee8f548b2258d31
            printf("%s\n", ripemd160("abc").c_str()); // 8eb208f7e05d987a9b044a8e98c6b087f15a0bfc
        }
      `,
    },
  },
  {
    id: 'hmac',
    name: 'HMAC',
    difficulty: 'Intermediário',
    en: { name: 'HMAC', summary: 'Turns any hash function into a message authentication code by hashing twice with a secret key — proof that the message came from someone with the key.' },
    facts: { 'Criado por': 'Mihir Bellare, Ran Canetti e Hugo Krawczyk', 'Ano': '1996 (RFC 2104, 1997)', 'Tipo': 'Código de autenticação de mensagem (MAC)', 'Fórmula': 'H((K ⊕ opad) ‖ H((K ⊕ ipad) ‖ m))', 'Situação': 'Seguro com SHA-256 ou SHA-3' },
    summary: 'Transforma qualquer função de hash em um código de autenticação, fazendo dois hashes com uma chave secreta — prova de que a mensagem veio de quem tem a chave.',
    description:
      'Um hash sozinho garante integridade, mas não autenticidade: qualquer um pode recalcular o hash de uma mensagem alterada. Um MAC (código de autenticação de mensagem) mistura uma chave secreta, de modo que só quem a conhece consegue gerar o código. A ideia ingênua, H(chave ‖ mensagem), é vulnerável em hashes como MD5, SHA-1 e SHA-256: o ataque de extensão de comprimento permite acrescentar dados ao fim sem saber a chave. O HMAC resolve isso com dois hashes aninhados: primeiro H((K ⊕ ipad) ‖ m), depois H((K ⊕ opad) ‖ resultado), onde ipad e opad são constantes que geram duas chaves diferentes a partir de K. A construção tem prova de segurança e funciona com qualquer hash.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(tamanho do bloco)' },
    steps: [
      'Se a chave for maior que o bloco do hash (64 bytes no SHA-256), substitua-a pelo seu hash; depois complete com zeros até o tamanho do bloco: K₀.',
      'Calcule a chave interna K₀ ⊕ ipad (ipad = 0x36 repetido) e a externa K₀ ⊕ opad (opad = 0x5c repetido).',
      'Hash interno: H((K₀ ⊕ ipad) ‖ mensagem).',
      'Hash externo: H((K₀ ⊕ opad) ‖ hash interno). Esse é o HMAC.',
      'Para verificar, recalcule e compare em tempo constante (para não vazar informação pelo tempo da comparação).',
    ],
    usedIn: ['TLS e IPsec (integridade dos pacotes)', 'JSON Web Tokens (HS256)', 'Assinatura de requisições de APIs (AWS SigV4, webhooks)', 'Códigos TOTP/HOTP de autenticação em dois fatores', 'Derivação de chaves (HKDF, PBKDF2)'],
    realWorld: [
      { title: 'Webhooks e APIs', text: 'Serviços como GitHub e Stripe assinam cada webhook com HMAC-SHA256 usando um segredo compartilhado; o servidor que recebe recalcula o HMAC e descarta requisições forjadas. A AWS assina todas as chamadas de API com uma cadeia de HMACs (SigV4).' },
      { title: 'Tokens de login', text: 'Um JWT com algoritmo HS256 é um JSON acompanhado de um HMAC-SHA256: o servidor confia no conteúdo do token porque só ele conhece a chave que gerou o código.' },
      { title: 'Códigos de 6 dígitos', text: 'O TOTP dos aplicativos autenticadores calcula o HMAC da hora atual (em janelas de 30 segundos) com um segredo compartilhado e extrai 6 dígitos do resultado.' },
    ],
    curiosities: [
      'Os valores 0x36 e 0x5c foram escolhidos para que as chaves interna e externa difiram em metade dos bits.',
      'O HMAC-MD5 e o HMAC-SHA1 continuam seguros como MAC, apesar de MD5 e SHA-1 terem colisões: a segurança do HMAC depende de outras propriedades do hash.',
      'Comparar o HMAC com == comum pode vazar, pelo tempo de resposta, quantos bytes iniciais estão certos. Por isso as bibliotecas oferecem comparações em tempo constante, como hmac.compare_digest.',
    ],
    code: {
      python: String.raw`
        import hashlib
        import hmac

        def hmac_sha256(chave, mensagem):
            bloco = 64                                      # tamanho do bloco do SHA-256
            if len(chave) > bloco:
                chave = hashlib.sha256(chave).digest()
            chave = chave.ljust(bloco, b"\x00")             # K0: completa com zeros
            ipad = bytes(b ^ 0x36 for b in chave)
            opad = bytes(b ^ 0x5C for b in chave)
            interno = hashlib.sha256(ipad + mensagem).digest()
            return hashlib.sha256(opad + interno).hexdigest()

        chave, msg = b"key", b"The quick brown fox jumps over the lazy dog"
        codigo = hmac_sha256(chave, msg)
        print(codigo)  # f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8
        biblioteca = hmac.new(chave, msg, hashlib.sha256).hexdigest()
        print("ok" if hmac.compare_digest(codigo, biblioteca) else "erro")  # ok
      `,
      javascript: String.raw`
        import crypto from "node:crypto";

        function hmacSha256(chave, mensagem) {
          const bloco = 64; // tamanho do bloco do SHA-256
          if (chave.length > bloco) chave = crypto.createHash("sha256").update(chave).digest();
          const k0 = Buffer.alloc(bloco); // K0: completa com zeros
          chave.copy(k0);
          const ipad = k0.map(b => b ^ 0x36), opad = k0.map(b => b ^ 0x5c);
          const interno = crypto.createHash("sha256").update(ipad).update(mensagem).digest();
          return crypto.createHash("sha256").update(opad).update(interno).digest("hex");
        }

        const chave = Buffer.from("key"), msg = Buffer.from("The quick brown fox jumps over the lazy dog");
        const codigo = hmacSha256(chave, msg);
        console.log(codigo); // f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8
        const biblioteca = crypto.createHmac("sha256", chave).update(msg).digest("hex");
        console.log(crypto.timingSafeEqual(Buffer.from(codigo), Buffer.from(biblioteca)) ? "ok" : "erro"); // ok
      `,
      java: String.raw`
        import java.nio.charset.StandardCharsets;
        import java.security.MessageDigest;
        import java.util.HexFormat;
        import javax.crypto.Mac;
        import javax.crypto.spec.SecretKeySpec;

        public class HMAC {
            static byte[] hmacSha256(byte[] chave, byte[] mensagem) throws Exception {
                int bloco = 64; // tamanho do bloco do SHA-256
                if (chave.length > bloco) chave = MessageDigest.getInstance("SHA-256").digest(chave);
                byte[] ipad = new byte[bloco], opad = new byte[bloco];
                for (int i = 0; i < bloco; i++) {
                    byte k = i < chave.length ? chave[i] : 0; // K0: completa com zeros
                    ipad[i] = (byte) (k ^ 0x36);
                    opad[i] = (byte) (k ^ 0x5c);
                }
                MessageDigest sha = MessageDigest.getInstance("SHA-256");
                sha.update(ipad);
                byte[] interno = sha.digest(mensagem);
                sha.update(opad);
                return sha.digest(interno);
            }

            public static void main(String[] args) throws Exception {
                byte[] chave = "key".getBytes(StandardCharsets.UTF_8);
                byte[] msg = "The quick brown fox jumps over the lazy dog".getBytes(StandardCharsets.UTF_8);
                byte[] codigo = hmacSha256(chave, msg);
                System.out.println(HexFormat.of().formatHex(codigo)); // f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8
                Mac mac = Mac.getInstance("HmacSHA256");
                mac.init(new SecretKeySpec(chave, "HmacSHA256"));
                System.out.println(MessageDigest.isEqual(codigo, mac.doFinal(msg)) ? "ok" : "erro"); // ok
            }
        }
      `,
      cpp: String.raw`
        // Compile com: g++ hmac.cpp -lcrypto (usa o SHA-256 e o HMAC do OpenSSL)
        #include <cstdio>
        #include <cstring>
        #include <string>
        #include <openssl/crypto.h>
        #include <openssl/hmac.h>
        #include <openssl/sha.h>
        using namespace std;

        void hmacSha256(string chave, const string& mensagem, unsigned char saida[32]) {
            const size_t bloco = 64; // tamanho do bloco do SHA-256
            unsigned char k0[bloco] = {0}; // K0: completa com zeros
            if (chave.size() > bloco) SHA256((const unsigned char*)chave.data(), chave.size(), k0);
            else memcpy(k0, chave.data(), chave.size());
            string interno(bloco, '\0'), externo(bloco, '\0');
            for (size_t i = 0; i < bloco; i++) { interno[i] = k0[i] ^ 0x36; externo[i] = k0[i] ^ 0x5c; }
            unsigned char h[32];
            interno += mensagem;
            SHA256((const unsigned char*)interno.data(), interno.size(), h);
            externo += string((char*)h, 32);
            SHA256((const unsigned char*)externo.data(), externo.size(), saida);
        }

        int main() {
            string chave = "key", msg = "The quick brown fox jumps over the lazy dog";
            unsigned char codigo[32], biblioteca[32];
            unsigned int tam = 0;
            hmacSha256(chave, msg, codigo);
            for (unsigned char b : codigo) printf("%02x", b);
            printf("\n"); // f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8
            HMAC(EVP_sha256(), chave.data(), chave.size(), (const unsigned char*)msg.data(), msg.size(), biblioteca, &tam);
            printf("%s\n", CRYPTO_memcmp(codigo, biblioteca, 32) == 0 ? "ok" : "erro"); // ok
        }
      `,
    },
  },
  {
    id: 'des',
    name: 'DES (Data Encryption Standard)',
    difficulty: 'Avançado',
    en: { name: 'DES (Data Encryption Standard)', summary: 'The 1977 US standard block cipher: 16 rounds of a Feistel network with S-boxes — strong design, but a 56-bit key that is now trivial to brute-force.' },
    facts: { 'Criado por': 'IBM (Horst Feistel e equipe), com a NSA', 'Ano': '1975; padrão em 1977 (FIPS 46)', 'Tamanho do bloco': '64 bits', 'Tamanho da chave': '56 bits', 'Estrutura': 'Rede de Feistel com 16 rodadas', 'Situação': 'Quebrada por força bruta (1998)' },
    summary: 'O padrão de cifra de bloco dos EUA de 1977: 16 rodadas de uma rede de Feistel com S-boxes — projeto sólido, mas chave de 56 bits, hoje trivial de forçar.',
    description:
      'O DES cifra blocos de 64 bits com uma chave de 56 bits (mais 8 bits de paridade). Depois de uma permutação inicial, o bloco é dividido em duas metades, L e R, que passam por 16 rodadas de uma rede de Feistel: a nova L é a R anterior, e a nova R é L ⊕ f(R, Kᵢ). A função f expande R de 32 para 48 bits, faz XOR com a subchave da rodada, passa o resultado por 8 S-boxes (que trocam 6 bits por 4, de forma não linear) e permuta os bits. A beleza da rede de Feistel é que decifrar é o mesmo processo com as subchaves em ordem inversa — f nem precisa ser inversível. O desenho resistiu bem à criptoanálise, mas a chave curta não: em 1998 uma máquina de 250 mil dólares quebrou uma chave DES em 56 horas. O Triple DES (3DES) prolongou sua vida até ser substituído pelo AES.',
    complexity: { best: 'O(1) por bloco', average: 'O(n) — 16 rodadas por bloco', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Gere 16 subchaves de 48 bits: PC-1 escolhe 56 bits da chave; as metades C e D giram 1 ou 2 posições por rodada; PC-2 escolhe 48 bits de C ‖ D.',
      'Aplique a permutação inicial (IP) ao bloco e divida-o em L₀ e R₀ (32 bits cada).',
      'Em cada rodada: Lᵢ = Rᵢ₋₁ e Rᵢ = Lᵢ₋₁ ⊕ f(Rᵢ₋₁, Kᵢ).',
      'f(R, K): expanda R para 48 bits (E), faça XOR com K, divida em 8 grupos de 6 bits, troque cada grupo por 4 bits na sua S-box e permute (P).',
      'Junte R₁₆ ‖ L₁₆ (as metades trocadas) e aplique a permutação final (IP⁻¹). Para decifrar, use as subchaves de trás para frente.',
    ],
    usedIn: ['Triple DES em sistemas bancários e de pagamento (legado)', 'Senhas antigas do Unix (crypt)', 'Cartões de pagamento e caixas eletrônicos (3DES, até recentemente)', 'Ensino de redes de Feistel e criptoanálise', 'Padrão histórico de 1977 a 2005'],
    realWorld: [
      { title: 'Deep Crack', text: 'Em 1998, a Electronic Frontier Foundation construiu o Deep Crack, uma máquina com 1.856 chips dedicados que testava 90 bilhões de chaves por segundo e quebrou um desafio DES em 56 horas — prova de que 56 bits eram pouco.' },
      { title: 'Triple DES nos bancos', text: 'Para não jogar fora o hardware existente, os bancos adotaram o 3DES: cifrar, decifrar e cifrar de novo com duas ou três chaves. Ele protegeu PINs e transações por décadas e só foi aposentado pelo NIST em 2023.' },
      { title: 'Criptoanálise diferencial', text: 'Em 1990, Biham e Shamir publicaram a criptoanálise diferencial e descobriram que as S-boxes do DES eram estranhamente resistentes a ela. A IBM revelou depois que conhecia a técnica desde 1974 e que a NSA pedira segredo.' },
    ],
    curiosities: [
      'A NSA alterou as S-boxes propostas pela IBM e reduziu a chave para 56 bits. Por anos suspeitou-se de uma porta dos fundos; no fim, as mudanças nas S-boxes fortaleceram a cifra — mas a chave curta a enfraqueceu.',
      'O DES foi o primeiro algoritmo de criptografia publicado como padrão aberto, e sua publicação praticamente criou a pesquisa acadêmica em criptografia.',
      'Horst Feistel, que dá nome à estrutura, trabalhou no projeto Lucifer da IBM, o antecessor direto do DES.',
    ],
    code: {
      python: String.raw`
        IP = [58,50,42,34,26,18,10,2, 60,52,44,36,28,20,12,4, 62,54,46,38,30,22,14,6, 64,56,48,40,32,24,16,8,
              57,49,41,33,25,17,9,1, 59,51,43,35,27,19,11,3, 61,53,45,37,29,21,13,5, 63,55,47,39,31,23,15,7]
        FP = [IP.index(i) + 1 for i in range(1, 65)]                          # permutação final = inversa da IP
        E = [(4 * (n // 6) + n % 6 - 1) % 32 + 1 for n in range(48)]         # expansão 32 → 48 bits
        P = [16,7,20,21,29,12,28,17, 1,15,23,26,5,18,31,10, 2,8,24,14,32,27,3,9, 19,13,30,6,22,11,4,25]
        PC1 = [57,49,41,33,25,17,9, 1,58,50,42,34,26,18, 10,2,59,51,43,35,27, 19,11,3,60,52,44,36,
               63,55,47,39,31,23,15, 7,62,54,46,38,30,22, 14,6,61,53,45,37,29, 21,13,5,28,20,12,4]
        PC2 = [14,17,11,24,1,5, 3,28,15,6,21,10, 23,19,12,4,26,8, 16,7,27,20,13,2,
               41,52,31,37,47,55, 30,40,51,45,33,48, 44,49,39,56,34,53, 46,42,50,36,29,32]
        GIROS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]
        SBOX = [
            [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7, 0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8, 4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0, 15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
            [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10, 3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5, 0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15, 13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
            [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8, 13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1, 13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7, 1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
            [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15, 13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9, 10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4, 3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
            [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9, 14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6, 4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14, 11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
            [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11, 10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8, 9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6, 4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
            [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1, 13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6, 1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2, 6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
            [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7, 1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2, 7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8, 2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11],
        ]

        def permutar(x, tabela, n):  # a posição 1 é o bit mais significativo de um número de n bits
            saida = 0
            for p in tabela:
                saida = (saida << 1) | ((x >> (n - p)) & 1)
            return saida

        def subchaves(chave):
            k = permutar(chave, PC1, 64)
            C, D = k >> 28, k & 0xFFFFFFF
            gira = lambda v, s: ((v << s) | (v >> (28 - s))) & 0xFFFFFFF
            resultado = []
            for s in GIROS:
                C, D = gira(C, s), gira(D, s)
                resultado.append(permutar((C << 28) | D, PC2, 56))
            return resultado

        def f(R, K):
            x = permutar(R, E, 32) ^ K
            s = 0
            for i in range(8):                       # 8 S-boxes: 6 bits entram, 4 saem
                seis = (x >> (42 - 6 * i)) & 0x3F
                linha, coluna = ((seis >> 4) & 2) | (seis & 1), (seis >> 1) & 0xF
                s = (s << 4) | SBOX[i][linha * 16 + coluna]
            return permutar(s, P, 32)

        def des(bloco, chave, decifrar=False):
            ks = subchaves(chave)
            if decifrar:
                ks.reverse()                         # Feistel: decifrar = subchaves ao contrário
            b = permutar(bloco, IP, 64)
            L, R = b >> 32, b & 0xFFFFFFFF
            for k in ks:
                L, R = R, L ^ f(R, k)
            return permutar((R << 32) | L, FP, 64)

        c = des(0x0123456789ABCDEF, 0x133457799BBCDFF1)
        print(f"{c:016X}")                                                # 85E813540F0AB405
        print(f"{des(c, 0x133457799BBCDFF1, decifrar=True):016X}")        # 0123456789ABCDEF
      `,
      javascript: String.raw`
        const IP = [58,50,42,34,26,18,10,2, 60,52,44,36,28,20,12,4, 62,54,46,38,30,22,14,6, 64,56,48,40,32,24,16,8,
          57,49,41,33,25,17,9,1, 59,51,43,35,27,19,11,3, 61,53,45,37,29,21,13,5, 63,55,47,39,31,23,15,7];
        const FP = IP.map((_, i) => IP.indexOf(i + 1) + 1); // permutação final = inversa da IP
        const E = Array.from({ length: 48 }, (_, n) => ((4 * Math.floor(n / 6) + (n % 6) - 1 + 32) % 32) + 1); // 32 → 48 bits
        const P = [16,7,20,21,29,12,28,17, 1,15,23,26,5,18,31,10, 2,8,24,14,32,27,3,9, 19,13,30,6,22,11,4,25];
        const PC1 = [57,49,41,33,25,17,9, 1,58,50,42,34,26,18, 10,2,59,51,43,35,27, 19,11,3,60,52,44,36,
          63,55,47,39,31,23,15, 7,62,54,46,38,30,22, 14,6,61,53,45,37,29, 21,13,5,28,20,12,4];
        const PC2 = [14,17,11,24,1,5, 3,28,15,6,21,10, 23,19,12,4,26,8, 16,7,27,20,13,2,
          41,52,31,37,47,55, 30,40,51,45,33,48, 44,49,39,56,34,53, 46,42,50,36,29,32];
        const GIROS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
        const SBOX = [
          [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7, 0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8, 4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0, 15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
          [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10, 3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5, 0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15, 13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
          [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8, 13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1, 13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7, 1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
          [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15, 13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9, 10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4, 3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
          [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9, 14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6, 4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14, 11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
          [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11, 10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8, 9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6, 4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
          [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1, 13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6, 1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2, 6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
          [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7, 1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2, 7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8, 2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11],
        ];

        // BigInt: os blocos de 64 bits não cabem com precisão em um Number
        const permutar = (x, tabela, n) => tabela.reduce((saida, p) => (saida << 1n) | ((x >> BigInt(n - p)) & 1n), 0n);

        function subchaves(chave) {
          const k = permutar(chave, PC1, 64);
          let C = k >> 28n, D = k & 0xFFFFFFFn;
          const gira = (v, s) => ((v << BigInt(s)) | (v >> BigInt(28 - s))) & 0xFFFFFFFn;
          return GIROS.map(s => { C = gira(C, s); D = gira(D, s); return permutar((C << 28n) | D, PC2, 56); });
        }

        function f(R, K) {
          const x = permutar(R, E, 32) ^ K;
          let s = 0n;
          for (let i = 0; i < 8; i++) { // 8 S-boxes: 6 bits entram, 4 saem
            const seis = Number((x >> BigInt(42 - 6 * i)) & 0x3Fn);
            const linha = ((seis >> 4) & 2) | (seis & 1), coluna = (seis >> 1) & 0xF;
            s = (s << 4n) | BigInt(SBOX[i][linha * 16 + coluna]);
          }
          return permutar(s, P, 32);
        }

        function des(bloco, chave, decifrar = false) {
          const ks = subchaves(chave);
          if (decifrar) ks.reverse(); // Feistel: decifrar = subchaves ao contrário
          const b = permutar(bloco, IP, 64);
          let L = b >> 32n, R = b & 0xFFFFFFFFn;
          for (const k of ks) [L, R] = [R, L ^ f(R, k)];
          return permutar((R << 32n) | L, FP, 64);
        }

        const hex = v => v.toString(16).toUpperCase().padStart(16, "0");
        const c = des(0x0123456789ABCDEFn, 0x133457799BBCDFF1n);
        console.log(hex(c));                                  // 85E813540F0AB405
        console.log(hex(des(c, 0x133457799BBCDFF1n, true)));  // 0123456789ABCDEF
      `,
      java: String.raw`
        public class DES {
            static final int[] IP = {58,50,42,34,26,18,10,2, 60,52,44,36,28,20,12,4, 62,54,46,38,30,22,14,6, 64,56,48,40,32,24,16,8,
                57,49,41,33,25,17,9,1, 59,51,43,35,27,19,11,3, 61,53,45,37,29,21,13,5, 63,55,47,39,31,23,15,7};
            static final int[] P = {16,7,20,21,29,12,28,17, 1,15,23,26,5,18,31,10, 2,8,24,14,32,27,3,9, 19,13,30,6,22,11,4,25};
            static final int[] PC1 = {57,49,41,33,25,17,9, 1,58,50,42,34,26,18, 10,2,59,51,43,35,27, 19,11,3,60,52,44,36,
                63,55,47,39,31,23,15, 7,62,54,46,38,30,22, 14,6,61,53,45,37,29, 21,13,5,28,20,12,4};
            static final int[] PC2 = {14,17,11,24,1,5, 3,28,15,6,21,10, 23,19,12,4,26,8, 16,7,27,20,13,2,
                41,52,31,37,47,55, 30,40,51,45,33,48, 44,49,39,56,34,53, 46,42,50,36,29,32};
            static final int[] GIROS = {1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1};
            static final int[][] SBOX = {
                {14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7, 0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8, 4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0, 15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13},
                {15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10, 3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5, 0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15, 13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9},
                {10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8, 13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1, 13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7, 1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12},
                {7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15, 13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9, 10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4, 3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14},
                {2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9, 14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6, 4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14, 11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3},
                {12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11, 10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8, 9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6, 4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13},
                {4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1, 13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6, 1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2, 6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12},
                {13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7, 1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2, 7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8, 2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11}};
            static final int[] FP = new int[64], E = new int[48];
            static {
                for (int i = 0; i < 64; i++) FP[IP[i] - 1] = i + 1;                    // permutação final = inversa da IP
                for (int n = 0; n < 48; n++) E[n] = Math.floorMod(4 * (n / 6) + n % 6 - 1, 32) + 1; // 32 → 48 bits
            }

            static long permutar(long x, int[] tabela, int n) { // a posição 1 é o bit mais significativo
                long saida = 0;
                for (int p : tabela) saida = (saida << 1) | ((x >>> (n - p)) & 1);
                return saida;
            }

            static long[] subchaves(long chave) {
                long k = permutar(chave, PC1, 64), C = k >>> 28, D = k & 0xFFFFFFFL;
                long[] ks = new long[16];
                for (int r = 0; r < 16; r++) {
                    int s = GIROS[r];
                    C = ((C << s) | (C >>> (28 - s))) & 0xFFFFFFFL;
                    D = ((D << s) | (D >>> (28 - s))) & 0xFFFFFFFL;
                    ks[r] = permutar((C << 28) | D, PC2, 56);
                }
                return ks;
            }

            static long f(long R, long K) {
                long x = permutar(R, E, 32) ^ K, s = 0;
                for (int i = 0; i < 8; i++) { // 8 S-boxes: 6 bits entram, 4 saem
                    int seis = (int) ((x >>> (42 - 6 * i)) & 0x3F);
                    int linha = ((seis >> 4) & 2) | (seis & 1), coluna = (seis >> 1) & 0xF;
                    s = (s << 4) | SBOX[i][linha * 16 + coluna];
                }
                return permutar(s, P, 32);
            }

            static long des(long bloco, long chave, boolean decifrar) {
                long[] ks = subchaves(chave);
                long b = permutar(bloco, IP, 64), L = b >>> 32, R = b & 0xFFFFFFFFL;
                for (int r = 0; r < 16; r++) { // Feistel: decifrar = subchaves ao contrário
                    long t = R;
                    R = L ^ f(R, ks[decifrar ? 15 - r : r]);
                    L = t;
                }
                return permutar((R << 32) | L, FP, 64);
            }

            public static void main(String[] args) {
                long c = des(0x0123456789ABCDEFL, 0x133457799BBCDFF1L, false);
                System.out.println(String.format("%016X", c));                                   // 85E813540F0AB405
                System.out.println(String.format("%016X", des(c, 0x133457799BBCDFF1L, true)));   // 0123456789ABCDEF
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <vector>
        using namespace std;

        const int IP[64] = {58,50,42,34,26,18,10,2, 60,52,44,36,28,20,12,4, 62,54,46,38,30,22,14,6, 64,56,48,40,32,24,16,8,
            57,49,41,33,25,17,9,1, 59,51,43,35,27,19,11,3, 61,53,45,37,29,21,13,5, 63,55,47,39,31,23,15,7};
        const int P[32] = {16,7,20,21,29,12,28,17, 1,15,23,26,5,18,31,10, 2,8,24,14,32,27,3,9, 19,13,30,6,22,11,4,25};
        const int PC1[56] = {57,49,41,33,25,17,9, 1,58,50,42,34,26,18, 10,2,59,51,43,35,27, 19,11,3,60,52,44,36,
            63,55,47,39,31,23,15, 7,62,54,46,38,30,22, 14,6,61,53,45,37,29, 21,13,5,28,20,12,4};
        const int PC2[48] = {14,17,11,24,1,5, 3,28,15,6,21,10, 23,19,12,4,26,8, 16,7,27,20,13,2,
            41,52,31,37,47,55, 30,40,51,45,33,48, 44,49,39,56,34,53, 46,42,50,36,29,32};
        const int GIROS[16] = {1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1};
        const int SBOX[8][64] = {
            {14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7, 0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8, 4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0, 15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13},
            {15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10, 3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5, 0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15, 13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9},
            {10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8, 13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1, 13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7, 1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12},
            {7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15, 13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9, 10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4, 3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14},
            {2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9, 14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6, 4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14, 11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3},
            {12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11, 10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8, 9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6, 4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13},
            {4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1, 13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6, 1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2, 6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12},
            {13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7, 1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2, 7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8, 2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11}};

        uint64_t permutar(uint64_t x, const int* tabela, int tamanho, int n) { // a posição 1 é o bit mais significativo
            uint64_t saida = 0;
            for (int i = 0; i < tamanho; i++) saida = (saida << 1) | ((x >> (n - tabela[i])) & 1);
            return saida;
        }

        uint64_t f(uint64_t R, uint64_t K) {
            int E[48];
            for (int n = 0; n < 48; n++) E[n] = (4 * (n / 6) + n % 6 - 1 + 32) % 32 + 1; // 32 → 48 bits
            uint64_t x = permutar(R, E, 48, 32) ^ K, s = 0;
            for (int i = 0; i < 8; i++) { // 8 S-boxes: 6 bits entram, 4 saem
                int seis = (x >> (42 - 6 * i)) & 0x3F;
                int linha = ((seis >> 4) & 2) | (seis & 1), coluna = (seis >> 1) & 0xF;
                s = (s << 4) | SBOX[i][linha * 16 + coluna];
            }
            return permutar(s, P, 32, 32);
        }

        uint64_t des(uint64_t bloco, uint64_t chave, bool decifrar = false) {
            uint64_t k = permutar(chave, PC1, 56, 64), C = k >> 28, D = k & 0xFFFFFFF, ks[16];
            for (int r = 0; r < 16; r++) {
                int s = GIROS[r];
                C = ((C << s) | (C >> (28 - s))) & 0xFFFFFFF;
                D = ((D << s) | (D >> (28 - s))) & 0xFFFFFFF;
                ks[r] = permutar((C << 28) | D, PC2, 48, 56);
            }
            int FP[64];
            for (int i = 0; i < 64; i++) FP[IP[i] - 1] = i + 1; // permutação final = inversa da IP
            uint64_t b = permutar(bloco, IP, 64, 64), L = b >> 32, R = b & 0xFFFFFFFF;
            for (int r = 0; r < 16; r++) { // Feistel: decifrar = subchaves ao contrário
                uint64_t t = R;
                R = L ^ f(R, ks[decifrar ? 15 - r : r]);
                L = t;
            }
            return permutar((R << 32) | L, FP, 64, 64);
        }

        int main() {
            uint64_t c = des(0x0123456789ABCDEFULL, 0x133457799BBCDFF1ULL);
            printf("%016llX\n", (unsigned long long)c);                                  // 85E813540F0AB405
            printf("%016llX\n", (unsigned long long)des(c, 0x133457799BBCDFF1ULL, true)); // 0123456789ABCDEF
        }
      `,
    },
  },
  {
    id: 'aes',
    name: 'AES (Rijndael)',
    difficulty: 'Avançado',
    en: { name: 'AES (Rijndael)', summary: "The world's standard block cipher: a 4×4 byte state goes through SubBytes, ShiftRows, MixColumns and AddRoundKey for 10 to 14 rounds." },
    facts: { 'Criado por': 'Joan Daemen e Vincent Rijmen', 'Ano': '1998; padrão em 2001 (FIPS 197)', 'Tamanho do bloco': '128 bits', 'Tamanho da chave': '128, 192 ou 256 bits', 'Estrutura': 'Rede de substituição-permutação', 'Situação': 'Seguro — padrão mundial' },
    summary: 'A cifra de bloco padrão do mundo: uma matriz 4 × 4 de bytes passa por SubBytes, ShiftRows, MixColumns e AddRoundKey por 10 a 14 rodadas.',
    description:
      'O AES (Advanced Encryption Standard) venceu um concurso público do NIST entre 1997 e 2000, com o algoritmo Rijndael, dos belgas Joan Daemen e Vincent Rijmen. Ele cifra blocos de 16 bytes, organizados em uma matriz 4 × 4 chamada estado, com chaves de 128, 192 ou 256 bits (10, 12 ou 14 rodadas). Cada rodada combina quatro etapas: SubBytes troca cada byte por outro em uma tabela não linear (a S-box, baseada no inverso multiplicativo no corpo finito GF(2⁸)); ShiftRows gira as linhas; MixColumns mistura os 4 bytes de cada coluna com uma multiplicação de matrizes em GF(2⁸); e AddRoundKey faz XOR com uma chave de rodada derivada da chave principal. Depois de duas rodadas, cada byte do estado já depende de todos os bytes da entrada. Ao contrário do DES, o AES não é uma rede de Feistel: cada etapa tem inversa própria.',
    complexity: { best: 'O(1) por bloco', average: 'O(n) — 10 rodadas por bloco (AES-128)', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Expanda a chave de 16 bytes em 11 chaves de rodada (44 palavras de 4 bytes), usando a S-box, rotações e constantes de rodada.',
      'Organize o bloco em uma matriz 4 × 4 (coluna por coluna) e faça AddRoundKey com a chave 0.',
      'Rodadas 1 a 9: SubBytes, ShiftRows, MixColumns e AddRoundKey.',
      'Rodada 10: SubBytes, ShiftRows e AddRoundKey (sem MixColumns).',
      'Na prática, use um modo de operação seguro, como GCM, que também autentica os dados — nunca cifre blocos independentes (modo ECB).',
    ],
    usedIn: ['HTTPS/TLS (AES-GCM) e VPNs (IPsec, WireGuard usa ChaCha20)', 'Wi-Fi WPA2 e WPA3', 'Criptografia de disco (BitLocker, FileVault, LUKS)', 'WhatsApp, Signal e iMessage (arquivos e mensagens)', 'Instruções dedicadas nos processadores (AES-NI, ARMv8)'],
    realWorld: [
      { title: 'Cada conexão HTTPS', text: 'Depois que o navegador e o servidor combinam uma chave com criptografia de chave pública, praticamente todos os dados da conexão são cifrados com AES-GCM (ou ChaCha20). É o algoritmo que mais cifra bytes no mundo.' },
      { title: 'Direto no processador', text: 'Processadores Intel e AMD desde 2010 e ARM desde o ARMv8 têm instruções próprias para rodadas do AES (AES-NI), que cifram vários gigabytes por segundo e eliminam ataques por tempo de acesso à memória.' },
      { title: 'Discos e celulares', text: 'BitLocker, FileVault, o Android e o iPhone cifram o armazenamento inteiro com AES; sem a chave, derivada da senha e de um chip de segurança, os dados são ruído.' },
    ],
    curiosities: [
      'A NSA aprovou o AES-256 para proteger informações classificadas como TOP SECRET — a primeira vez que uma cifra pública recebeu esse aval.',
      'O melhor ataque conhecido contra o AES-128 completo (biclique, 2011) reduz o trabalho de 2¹²⁸ para cerca de 2¹²⁶ operações — uma melhora teórica sem nenhum efeito prático.',
      'O nome Rijndael junta os sobrenomes dos autores, Rijmen e Daemen. Entre os finalistas do concurso estavam Serpent, Twofish, RC6 e MARS.',
    ],
    code: {
      python: String.raw`
        def xtime(b):  # multiplicação por 2 em GF(2^8)
            return ((b << 1) ^ (0x1B if b & 0x80 else 0)) & 0xFF

        def gmul(a, b):
            p = 0
            while b:
                if b & 1:
                    p ^= a
                a, b = xtime(a), b >> 1
            return p

        rotl8 = lambda x, s: ((x << s) | (x >> (8 - s))) & 0xFF
        SBOX = []
        for a in range(256):  # S-box: inverso em GF(2^8) seguido de uma transformação afim
            inv = next((b for b in range(1, 256) if gmul(a, b) == 1), 0)
            SBOX.append(inv ^ rotl8(inv, 1) ^ rotl8(inv, 2) ^ rotl8(inv, 3) ^ rotl8(inv, 4) ^ 0x63)

        def expandir_chave(chave):  # 16 bytes → 11 chaves de rodada
            w = [list(chave[4 * i:4 * i + 4]) for i in range(4)]
            rcon = 1
            for i in range(4, 44):
                t = list(w[i - 1])
                if i % 4 == 0:
                    t = [SBOX[b] for b in t[1:] + t[:1]]
                    t[0] ^= rcon
                    rcon = xtime(rcon)
                w.append([x ^ y for x, y in zip(w[i - 4], t)])
            return [sum(w[4 * r:4 * r + 4], []) for r in range(11)]

        def aes128(bloco, chave):
            chaves = expandir_chave(chave)
            s = [b ^ k for b, k in zip(bloco, chaves[0])]  # estado: s[linha + 4 * coluna]
            for r in range(1, 11):
                s = [SBOX[b] for b in s]                                            # SubBytes
                s = [s[i % 4 + 4 * ((i // 4 + i % 4) % 4)] for i in range(16)]     # ShiftRows
                if r < 10:                                                          # MixColumns
                    t = s[:]
                    for c in range(4):
                        a0, a1, a2, a3 = t[4 * c:4 * c + 4]
                        s[4 * c] = gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3
                        s[4 * c + 1] = a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3
                        s[4 * c + 2] = a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3)
                        s[4 * c + 3] = gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2)
                s = [b ^ k for b, k in zip(s, chaves[r])]                           # AddRoundKey
            return bytes(s)

        bloco = bytes.fromhex("00112233445566778899aabbccddeeff")
        chave = bytes.fromhex("000102030405060708090a0b0c0d0e0f")
        print(aes128(bloco, chave).hex())  # 69c4e0d86a7b0430d8cdb78070b4c55a (vetor do FIPS 197)
      `,
      javascript: String.raw`
        const xtime = b => ((b << 1) ^ (b & 0x80 ? 0x1b : 0)) & 0xff; // multiplicação por 2 em GF(2^8)
        function gmul(a, b) {
          let p = 0;
          while (b) { if (b & 1) p ^= a; a = xtime(a); b >>= 1; }
          return p;
        }
        const rotl8 = (x, s) => ((x << s) | (x >> (8 - s))) & 0xff;
        const SBOX = Array.from({ length: 256 }, (_, a) => { // inverso em GF(2^8) + transformação afim
          let inv = 0;
          for (let b = 1; a && b < 256; b++) if (gmul(a, b) === 1) { inv = b; break; }
          return inv ^ rotl8(inv, 1) ^ rotl8(inv, 2) ^ rotl8(inv, 3) ^ rotl8(inv, 4) ^ 0x63;
        });

        function expandirChave(chave) { // 16 bytes → 11 chaves de rodada
          const w = [0, 1, 2, 3].map(i => [...chave.slice(4 * i, 4 * i + 4)]);
          let rcon = 1;
          for (let i = 4; i < 44; i++) {
            let t = [...w[i - 1]];
            if (i % 4 === 0) {
              t = [t[1], t[2], t[3], t[0]].map(b => SBOX[b]);
              t[0] ^= rcon;
              rcon = xtime(rcon);
            }
            w.push(w[i - 4].map((x, j) => x ^ t[j]));
          }
          return Array.from({ length: 11 }, (_, r) => w.slice(4 * r, 4 * r + 4).flat());
        }

        function aes128(bloco, chave) {
          const chaves = expandirChave(chave);
          let s = [...bloco].map((b, i) => b ^ chaves[0][i]); // estado: s[linha + 4 * coluna]
          for (let r = 1; r <= 10; r++) {
            s = s.map(b => SBOX[b]);                                                       // SubBytes
            s = s.map((_, i) => s[(i % 4) + 4 * ((Math.floor(i / 4) + (i % 4)) % 4)]);     // ShiftRows
            if (r < 10) {                                                                  // MixColumns
              const t = [...s];
              for (let c = 0; c < 4; c++) {
                const [a0, a1, a2, a3] = t.slice(4 * c, 4 * c + 4);
                s[4 * c] = gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3;
                s[4 * c + 1] = a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3;
                s[4 * c + 2] = a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3);
                s[4 * c + 3] = gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2);
              }
            }
            s = s.map((b, i) => b ^ chaves[r][i]);                                         // AddRoundKey
          }
          return s;
        }

        const deHex = h => h.match(/../g).map(b => parseInt(b, 16));
        const saida = aes128(deHex("00112233445566778899aabbccddeeff"), deHex("000102030405060708090a0b0c0d0e0f"));
        console.log(saida.map(b => b.toString(16).padStart(2, "0")).join("")); // 69c4e0d86a7b0430d8cdb78070b4c55a
      `,
      java: String.raw`
        import java.util.HexFormat;

        public class AES {
            static int xtime(int b) { return ((b << 1) ^ ((b & 0x80) != 0 ? 0x1B : 0)) & 0xFF; } // ×2 em GF(2^8)
            static int gmul(int a, int b) {
                int p = 0;
                while (b != 0) { if ((b & 1) != 0) p ^= a; a = xtime(a); b >>= 1; }
                return p;
            }
            static int rotl8(int x, int s) { return ((x << s) | (x >> (8 - s))) & 0xFF; }

            static final int[] SBOX = new int[256];
            static { // inverso em GF(2^8) seguido de uma transformação afim
                for (int a = 0; a < 256; a++) {
                    int inv = 0;
                    for (int b = 1; a != 0 && b < 256; b++) if (gmul(a, b) == 1) { inv = b; break; }
                    SBOX[a] = inv ^ rotl8(inv, 1) ^ rotl8(inv, 2) ^ rotl8(inv, 3) ^ rotl8(inv, 4) ^ 0x63;
                }
            }

            static int[][] expandirChave(byte[] chave) { // 16 bytes → 11 chaves de rodada
                int[][] w = new int[44][4];
                for (int i = 0; i < 16; i++) w[i / 4][i % 4] = chave[i] & 0xFF;
                int rcon = 1;
                for (int i = 4; i < 44; i++) {
                    int[] t = w[i - 1].clone();
                    if (i % 4 == 0) {
                        t = new int[]{SBOX[t[1]], SBOX[t[2]], SBOX[t[3]], SBOX[t[0]]};
                        t[0] ^= rcon;
                        rcon = xtime(rcon);
                    }
                    for (int j = 0; j < 4; j++) w[i][j] = w[i - 4][j] ^ t[j];
                }
                int[][] chaves = new int[11][16];
                for (int r = 0; r < 11; r++) for (int i = 0; i < 16; i++) chaves[r][i] = w[4 * r + i / 4][i % 4];
                return chaves;
            }

            static byte[] aes128(byte[] bloco, byte[] chave) {
                int[][] chaves = expandirChave(chave);
                int[] s = new int[16]; // estado: s[linha + 4 * coluna]
                for (int i = 0; i < 16; i++) s[i] = (bloco[i] & 0xFF) ^ chaves[0][i];
                for (int r = 1; r <= 10; r++) {
                    for (int i = 0; i < 16; i++) s[i] = SBOX[s[i]];                                   // SubBytes
                    int[] t = s.clone();
                    for (int i = 0; i < 16; i++) s[i] = t[i % 4 + 4 * ((i / 4 + i % 4) % 4)];         // ShiftRows
                    if (r < 10) {                                                                     // MixColumns
                        t = s.clone();
                        for (int c = 0; c < 4; c++) {
                            int a0 = t[4 * c], a1 = t[4 * c + 1], a2 = t[4 * c + 2], a3 = t[4 * c + 3];
                            s[4 * c] = gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3;
                            s[4 * c + 1] = a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3;
                            s[4 * c + 2] = a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3);
                            s[4 * c + 3] = gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2);
                        }
                    }
                    for (int i = 0; i < 16; i++) s[i] ^= chaves[r][i];                                // AddRoundKey
                }
                byte[] saida = new byte[16];
                for (int i = 0; i < 16; i++) saida[i] = (byte) s[i];
                return saida;
            }

            public static void main(String[] args) {
                HexFormat h = HexFormat.of();
                byte[] saida = aes128(h.parseHex("00112233445566778899aabbccddeeff"), h.parseHex("000102030405060708090a0b0c0d0e0f"));
                System.out.println(h.formatHex(saida)); // 69c4e0d86a7b0430d8cdb78070b4c55a
                // Em produção: javax.crypto.Cipher.getInstance("AES/GCM/NoPadding")
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <cstring>
        using namespace std;

        uint8_t xtime(uint8_t b) { return (b << 1) ^ (b & 0x80 ? 0x1B : 0); } // ×2 em GF(2^8)
        uint8_t gmul(uint8_t a, uint8_t b) {
            uint8_t p = 0;
            while (b) { if (b & 1) p ^= a; a = xtime(a); b >>= 1; }
            return p;
        }
        uint8_t rotl8(uint8_t x, int s) { return (x << s) | (x >> (8 - s)); }

        uint8_t SBOX[256];
        void montarSbox() { // inverso em GF(2^8) seguido de uma transformação afim
            for (int a = 0; a < 256; a++) {
                uint8_t inv = 0;
                for (int b = 1; a && b < 256; b++) if (gmul(a, b) == 1) { inv = b; break; }
                SBOX[a] = inv ^ rotl8(inv, 1) ^ rotl8(inv, 2) ^ rotl8(inv, 3) ^ rotl8(inv, 4) ^ 0x63;
            }
        }

        void expandirChave(const uint8_t chave[16], uint8_t chaves[11][16]) { // 16 bytes → 11 chaves de rodada
            uint8_t w[44][4];
            memcpy(w, chave, 16);
            uint8_t rcon = 1;
            for (int i = 4; i < 44; i++) {
                uint8_t t[4];
                memcpy(t, w[i - 1], 4);
                if (i % 4 == 0) {
                    uint8_t r[4] = {SBOX[t[1]], SBOX[t[2]], SBOX[t[3]], SBOX[t[0]]};
                    memcpy(t, r, 4);
                    t[0] ^= rcon;
                    rcon = xtime(rcon);
                }
                for (int j = 0; j < 4; j++) w[i][j] = w[i - 4][j] ^ t[j];
            }
            memcpy(chaves, w, 176);
        }

        void aes128(const uint8_t bloco[16], const uint8_t chave[16], uint8_t s[16]) {
            uint8_t chaves[11][16], t[16];
            expandirChave(chave, chaves);
            for (int i = 0; i < 16; i++) s[i] = bloco[i] ^ chaves[0][i]; // estado: s[linha + 4 * coluna]
            for (int r = 1; r <= 10; r++) {
                for (int i = 0; i < 16; i++) s[i] = SBOX[s[i]];                                // SubBytes
                memcpy(t, s, 16);
                for (int i = 0; i < 16; i++) s[i] = t[i % 4 + 4 * ((i / 4 + i % 4) % 4)];     // ShiftRows
                if (r < 10) {                                                                  // MixColumns
                    memcpy(t, s, 16);
                    for (int c = 0; c < 4; c++) {
                        uint8_t a0 = t[4 * c], a1 = t[4 * c + 1], a2 = t[4 * c + 2], a3 = t[4 * c + 3];
                        s[4 * c] = gmul(a0, 2) ^ gmul(a1, 3) ^ a2 ^ a3;
                        s[4 * c + 1] = a0 ^ gmul(a1, 2) ^ gmul(a2, 3) ^ a3;
                        s[4 * c + 2] = a0 ^ a1 ^ gmul(a2, 2) ^ gmul(a3, 3);
                        s[4 * c + 3] = gmul(a0, 3) ^ a1 ^ a2 ^ gmul(a3, 2);
                    }
                }
                for (int i = 0; i < 16; i++) s[i] ^= chaves[r][i];                             // AddRoundKey
            }
        }

        int main() {
            montarSbox();
            uint8_t bloco[16], chave[16], saida[16];
            for (int i = 0; i < 16; i++) { bloco[i] = 0x11 * i; chave[i] = i; } // 00112233…ff e 000102…0f
            aes128(bloco, chave, saida);
            for (uint8_t b : saida) printf("%02x", b);
            printf("\n"); // 69c4e0d86a7b0430d8cdb78070b4c55a
        }
      `,
    },
  },
  {
    id: 'blowfish',
    name: 'Blowfish',
    difficulty: 'Avançado',
    en: { name: 'Blowfish', summary: 'A free 64-bit block cipher whose S-boxes start as the digits of π and are rebuilt from the key — slow key setup, fast encryption.' },
    facts: { 'Criado por': 'Bruce Schneier', 'Ano': '1993', 'Tamanho do bloco': '64 bits', 'Tamanho da chave': '32 a 448 bits', 'Estrutura': 'Rede de Feistel com 16 rodadas', 'Situação': 'Sem quebra, mas bloco de 64 bits é pequeno' },
    summary: 'Uma cifra de bloco de 64 bits, livre de patentes, cujas S-boxes começam com os dígitos de π e são reconstruídas a partir da chave — preparação lenta, cifragem rápida.',
    description:
      'O Blowfish foi criado por Bruce Schneier em 1993 como alternativa gratuita ao DES e às cifras patenteadas da época. É uma rede de Feistel de 16 rodadas sobre blocos de 64 bits, com chaves de 32 a 448 bits. Sua marca registrada são as S-boxes dependentes da chave: o P-array (18 palavras de 32 bits) e as quatro S-boxes (256 palavras cada) começam preenchidos com a parte fracionária de π em hexadecimal; a chave é misturada no P-array, e então o próprio Blowfish cifra repetidamente um bloco de zeros, substituindo P e as S-boxes pelos resultados — 521 cifragens no total. A função de rodada F divide a metade de 32 bits em 4 bytes, consulta uma S-box com cada um e combina os resultados com somas e XOR. A preparação lenta é uma vantagem contra força bruta, e por isso a variante bcrypt virou padrão para guardar senhas.',
    complexity: { best: 'O(1) por bloco', average: 'O(n) — 16 rodadas por bloco', worst: 'O(n) + 521 cifragens para preparar a chave', space: 'O(4 KB) de tabelas' },
    steps: [
      'Preencha o P-array (18 palavras) e as 4 S-boxes (4 × 256 palavras) com os dígitos hexadecimais de π: 243F6A88, 85A308D3, …',
      'Faça XOR de cada palavra do P-array com 32 bits da chave, repetindo a chave quando necessário.',
      'Cifre um bloco de zeros e troque P₁, P₂ pelo resultado; cifre o resultado e troque P₃, P₄; e assim por diante, até cobrir todo o P-array e todas as S-boxes (521 cifragens).',
      'Para cifrar: em cada uma das 16 rodadas, L ⊕= Pᵢ; R ⊕= F(L); troque L e R. F(x) = ((S₁[a] + S₂[b]) ⊕ S₃[c]) + S₄[d], com a, b, c, d os bytes de x.',
      'Desfaça a última troca e aplique R ⊕= P₁₇ e L ⊕= P₁₈. Decifrar é o mesmo, com o P-array em ordem inversa.',
    ],
    usedIn: ['bcrypt (armazenamento de senhas, derivado do Blowfish)', 'OpenSSH e OpenVPN (versões antigas)', 'Gerenciadores de senhas e programas de arquivo (versões antigas)', 'GnuPG (cifra opcional)', 'Sistemas embarcados que precisavam de uma cifra livre'],
    realWorld: [
      { title: 'Senhas com bcrypt', text: 'O bcrypt (1999) usa a preparação de chave cara do Blowfish, repetida 2^custo vezes, para tornar cada tentativa de senha lenta. Ele ainda protege senhas no OpenBSD, em frameworks como Rails e Laravel e em muitos sites.' },
      { title: 'Sweet32', text: 'Em 2016, o ataque Sweet32 mostrou que cifras com bloco de 64 bits, como Blowfish e 3DES, vazam informação depois de cerca de 32 GB cifrados com a mesma chave (pelo paradoxo do aniversário). Por isso elas saíram do TLS e das VPNs.' },
      { title: 'Cifra livre', text: 'Em 1993, quase toda cifra forte era patenteada ou secreta. Schneier colocou o Blowfish em domínio público, e ele foi adotado rapidamente em softwares livres.' },
    ],
    curiosities: [
      'Usar os dígitos de π como valores iniciais mostra que não há "truque" escondido nas tabelas — são números "nada na manga". O código desta página calcula esses dígitos do zero com a fórmula de Machin.',
      'Schneier hoje recomenda o Twofish (ou o AES) no lugar do Blowfish: "Estou surpreso que ainda o usem", disse em 2007.',
      'O nome vem do baiacu (blowfish, em inglês), o peixe que incha — e que é venenoso.',
    ],
    code: {
      python: String.raw`
        def digitos_de_pi(palavras):  # parte fracionária de π em palavras de 32 bits (fórmula de Machin)
            bits = 32 * palavras + 64
            um = 1 << bits
            def arctan_inv(x):
                termo = soma = um // x
                n, sinal = 3, -1
                while termo:
                    termo //= x * x
                    soma += sinal * (termo // n)
                    n, sinal = n + 2, -sinal
                return soma
            pi = 4 * (4 * arctan_inv(5) - arctan_inv(239))
            frac = pi - (3 << bits)
            return [(frac >> (bits - 32 * (k + 1))) & 0xFFFFFFFF for k in range(palavras)]

        class Blowfish:
            def __init__(self, chave):
                pi = digitos_de_pi(18 + 4 * 256)
                self.P = pi[:18]
                self.S = [pi[18 + 256 * i:18 + 256 * (i + 1)] for i in range(4)]
                k = 0
                for i in range(18):                    # mistura a chave no P-array
                    d = 0
                    for _ in range(4):
                        d = (d << 8) | chave[k]
                        k = (k + 1) % len(chave)
                    self.P[i] ^= d
                L = R = 0
                for i in range(0, 18, 2):              # 521 cifragens reconstroem P e as S-boxes
                    L, R = self.cifrar(L, R)
                    self.P[i], self.P[i + 1] = L, R
                for caixa in self.S:
                    for i in range(0, 256, 2):
                        L, R = self.cifrar(L, R)
                        caixa[i], caixa[i + 1] = L, R

            def F(self, x):
                S = self.S
                h = (S[0][x >> 24] + S[1][(x >> 16) & 0xFF]) & 0xFFFFFFFF
                return ((h ^ S[2][(x >> 8) & 0xFF]) + S[3][x & 0xFF]) & 0xFFFFFFFF

            def cifrar(self, L, R):
                for i in range(16):
                    L ^= self.P[i]
                    R ^= self.F(L)
                    L, R = R, L
                L, R = R, L                            # desfaz a última troca
                return L ^ self.P[17], R ^ self.P[16]

        bf = Blowfish(bytes(8))                        # chave de 8 bytes zero
        L, R = bf.cifrar(0, 0)
        print(f"{L:08X}{R:08X}")                       # 4EF997456198DD78
      `,
      javascript: String.raw`
        function digitosDePi(palavras) { // parte fracionária de π em palavras de 32 bits (fórmula de Machin)
          const bits = BigInt(32 * palavras + 64), um = 1n << bits;
          const arctanInv = x => {
            let termo = um / x, soma = termo, n = 3n, sinal = -1n;
            while (termo) { termo /= x * x; soma += sinal * (termo / n); n += 2n; sinal = -sinal; }
            return soma;
          };
          const frac = 4n * (4n * arctanInv(5n) - arctanInv(239n)) - (3n << bits);
          return Array.from({ length: palavras }, (_, k) => Number((frac >> (bits - 32n * BigInt(k + 1))) & 0xFFFFFFFFn));
        }

        class Blowfish {
          constructor(chave) {
            const pi = digitosDePi(18 + 4 * 256);
            this.P = pi.slice(0, 18);
            this.S = [0, 1, 2, 3].map(i => pi.slice(18 + 256 * i, 18 + 256 * (i + 1)));
            let k = 0;
            for (let i = 0; i < 18; i++) { // mistura a chave no P-array
              let d = 0;
              for (let j = 0; j < 4; j++) { d = ((d << 8) | chave[k]) >>> 0; k = (k + 1) % chave.length; }
              this.P[i] = (this.P[i] ^ d) >>> 0;
            }
            let L = 0, R = 0; // 521 cifragens reconstroem P e as S-boxes
            for (let i = 0; i < 18; i += 2) { [L, R] = this.cifrar(L, R); this.P[i] = L; this.P[i + 1] = R; }
            for (const caixa of this.S)
              for (let i = 0; i < 256; i += 2) { [L, R] = this.cifrar(L, R); caixa[i] = L; caixa[i + 1] = R; }
          }

          F(x) {
            const S = this.S;
            return ((((S[0][x >>> 24] + S[1][(x >>> 16) & 255]) >>> 0) ^ S[2][(x >>> 8) & 255]) + S[3][x & 255]) >>> 0;
          }

          cifrar(L, R) {
            for (let i = 0; i < 16; i++) {
              L = (L ^ this.P[i]) >>> 0;
              R = (R ^ this.F(L)) >>> 0;
              [L, R] = [R, L];
            }
            [L, R] = [R, L]; // desfaz a última troca
            return [(L ^ this.P[17]) >>> 0, (R ^ this.P[16]) >>> 0];
          }
        }

        const bf = new Blowfish(new Uint8Array(8)); // chave de 8 bytes zero
        const [L, R] = bf.cifrar(0, 0);
        console.log((L.toString(16).padStart(8, "0") + R.toString(16).padStart(8, "0")).toUpperCase()); // 4EF997456198DD78
      `,
      java: String.raw`
        import java.math.BigInteger;

        public class Blowfish {
            final int[] P;
            final int[][] S = new int[4][256];

            static int[] digitosDePi(int palavras) { // parte fracionária de π em palavras de 32 bits (Machin)
                int bits = 32 * palavras + 64;
                BigInteger um = BigInteger.ONE.shiftLeft(bits);
                BigInteger pi = arctanInv(5, um).shiftLeft(2).subtract(arctanInv(239, um)).shiftLeft(2);
                BigInteger frac = pi.subtract(BigInteger.valueOf(3).shiftLeft(bits));
                int[] saida = new int[palavras];
                for (int k = 0; k < palavras; k++) saida[k] = frac.shiftRight(bits - 32 * (k + 1)).intValue();
                return saida;
            }

            static BigInteger arctanInv(long x, BigInteger um) {
                BigInteger bx = BigInteger.valueOf(x), x2 = bx.multiply(bx);
                BigInteger termo = um.divide(bx), soma = termo;
                long n = 3;
                boolean menos = true;
                while (termo.signum() != 0) {
                    termo = termo.divide(x2);
                    BigInteger t = termo.divide(BigInteger.valueOf(n));
                    soma = menos ? soma.subtract(t) : soma.add(t);
                    menos = !menos;
                    n += 2;
                }
                return soma;
            }

            Blowfish(byte[] chave) {
                int[] pi = digitosDePi(18 + 4 * 256);
                P = java.util.Arrays.copyOf(pi, 18);
                for (int i = 0; i < 4; i++) System.arraycopy(pi, 18 + 256 * i, S[i], 0, 256);
                for (int i = 0, k = 0; i < 18; i++) { // mistura a chave no P-array
                    int d = 0;
                    for (int j = 0; j < 4; j++) { d = (d << 8) | (chave[k] & 0xFF); k = (k + 1) % chave.length; }
                    P[i] ^= d;
                }
                int[] lr = {0, 0}; // 521 cifragens reconstroem P e as S-boxes
                for (int i = 0; i < 18; i += 2) { lr = cifrar(lr[0], lr[1]); P[i] = lr[0]; P[i + 1] = lr[1]; }
                for (int[] caixa : S)
                    for (int i = 0; i < 256; i += 2) { lr = cifrar(lr[0], lr[1]); caixa[i] = lr[0]; caixa[i + 1] = lr[1]; }
            }

            int F(int x) { // somas de int já são módulo 2^32
                return ((S[0][x >>> 24] + S[1][(x >>> 16) & 0xFF]) ^ S[2][(x >>> 8) & 0xFF]) + S[3][x & 0xFF];
            }

            int[] cifrar(int L, int R) {
                for (int i = 0; i < 16; i++) {
                    L ^= P[i];
                    R ^= F(L);
                    int t = L; L = R; R = t;
                }
                int t = L; L = R; R = t; // desfaz a última troca
                return new int[]{L ^ P[17], R ^ P[16]};
            }

            public static void main(String[] args) {
                Blowfish bf = new Blowfish(new byte[8]); // chave de 8 bytes zero
                int[] c = bf.cifrar(0, 0);
                System.out.println(String.format("%08X%08X", c[0], c[1])); // 4EF997456198DD78
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <utility>
        #include <vector>
        using namespace std;

        // Número em ponto fixo, base 2^32: limbo 0 = parte inteira, os demais = fração.
        using Num = vector<uint32_t>;
        void dividir(Num& a, uint32_t d) { uint64_t resto = 0; for (auto& x : a) { uint64_t cur = (resto << 32) | x; x = cur / d; resto = cur % d; } }
        void multiplicar(Num& a, uint32_t m) { uint64_t vai = 0; for (size_t i = a.size(); i-- > 0;) { uint64_t p = (uint64_t)a[i] * m + vai; a[i] = (uint32_t)p; vai = p >> 32; } }
        void somar(Num& a, const Num& b) { uint64_t vai = 0; for (size_t i = a.size(); i-- > 0;) { uint64_t s = (uint64_t)a[i] + b[i] + vai; a[i] = (uint32_t)s; vai = s >> 32; } }
        void subtrair(Num& a, const Num& b) { int64_t emp = 0; for (size_t i = a.size(); i-- > 0;) { int64_t s = (int64_t)a[i] - b[i] - emp; emp = s < 0; a[i] = (uint32_t)(s + (emp << 32)); } }
        bool zero(const Num& a) { for (uint32_t x : a) if (x) return false; return true; }

        Num arctanInv(uint32_t x, size_t limbos) {
            Num termo(limbos, 0);
            termo[0] = 1;
            dividir(termo, x);
            Num soma = termo;
            bool menos = true;
            for (uint32_t n = 3;; n += 2, menos = !menos) {
                dividir(termo, x * x);
                if (zero(termo)) break;
                Num t = termo;
                dividir(t, n);
                if (menos) subtrair(soma, t); else somar(soma, t);
            }
            return soma;
        }

        vector<uint32_t> digitosDePi(size_t palavras) { // π = 4·(4·arctan(1/5) − arctan(1/239)) — fórmula de Machin
            size_t limbos = palavras + 3; // 1 limbo inteiro + 2 de guarda
            Num pi = arctanInv(5, limbos);
            multiplicar(pi, 4);
            subtrair(pi, arctanInv(239, limbos));
            multiplicar(pi, 4);
            return vector<uint32_t>(pi.begin() + 1, pi.begin() + 1 + palavras);
        }

        struct Blowfish {
            uint32_t P[18], S[4][256];

            uint32_t F(uint32_t x) const { return ((S[0][x >> 24] + S[1][(x >> 16) & 0xFF]) ^ S[2][(x >> 8) & 0xFF]) + S[3][x & 0xFF]; }

            void cifrar(uint32_t& L, uint32_t& R) const {
                for (int i = 0; i < 16; i++) {
                    L ^= P[i];
                    R ^= F(L);
                    swap(L, R);
                }
                swap(L, R); // desfaz a última troca
                R ^= P[16];
                L ^= P[17];
            }

            explicit Blowfish(const vector<uint8_t>& chave) {
                vector<uint32_t> pi = digitosDePi(18 + 4 * 256);
                for (int i = 0; i < 18; i++) P[i] = pi[i];
                for (int i = 0; i < 4; i++) for (int j = 0; j < 256; j++) S[i][j] = pi[18 + 256 * i + j];
                for (size_t i = 0, k = 0; i < 18; i++) { // mistura a chave no P-array
                    uint32_t d = 0;
                    for (int j = 0; j < 4; j++) { d = (d << 8) | chave[k]; k = (k + 1) % chave.size(); }
                    P[i] ^= d;
                }
                uint32_t L = 0, R = 0; // 521 cifragens reconstroem P e as S-boxes
                for (int i = 0; i < 18; i += 2) { cifrar(L, R); P[i] = L; P[i + 1] = R; }
                for (auto& caixa : S)
                    for (int i = 0; i < 256; i += 2) { cifrar(L, R); caixa[i] = L; caixa[i + 1] = R; }
            }
        };

        int main() {
            Blowfish bf(vector<uint8_t>(8, 0)); // chave de 8 bytes zero
            uint32_t L = 0, R = 0;
            bf.cifrar(L, R);
            printf("%08X%08X\n", L, R); // 4EF997456198DD78
        }
      `,
    },
  },
  {
    id: 'idea',
    name: 'IDEA',
    difficulty: 'Avançado',
    en: { name: 'IDEA', summary: 'A 64-bit block cipher that mixes XOR, addition mod 2¹⁶ and multiplication mod 2¹⁶+1 — three incompatible operations — and secured the first versions of PGP.' },
    facts: { 'Criado por': 'Xuejia Lai e James Massey (ETH Zurique)', 'Ano': '1991', 'Tamanho do bloco': '64 bits', 'Tamanho da chave': '128 bits', 'Rodadas': '8,5', 'Situação': 'Sem quebra prática; patente expirou em 2012' },
    summary: 'Uma cifra de bloco de 64 bits que mistura XOR, soma mod 2¹⁶ e multiplicação mod 2¹⁶ + 1 — três operações "incompatíveis" — e protegeu as primeiras versões do PGP.',
    description:
      'O IDEA (International Data Encryption Algorithm) cifra blocos de 64 bits com chaves de 128 bits. Em vez de S-boxes, ele obtém a não linearidade misturando três operações de grupos algébricos diferentes sobre palavras de 16 bits: XOR, soma módulo 2¹⁶ e multiplicação módulo 2¹⁶ + 1 (em que 0 representa 2¹⁶). Nenhuma delas é distributiva ou associativa em relação às outras, o que dificulta as técnicas de criptoanálise da época. O bloco é dividido em quatro palavras, que passam por 8 rodadas idênticas e uma meia rodada final; cada rodada usa 6 subchaves de 16 bits, e a meia rodada, mais 4 — 52 no total, tiradas da chave original girada 25 bits a cada 8 subchaves. O núcleo de cada rodada é a estrutura MA (multiplica-soma), que espalha cada bit da entrada pelas quatro saídas.',
    complexity: { best: 'O(1) por bloco', average: 'O(n) — 8,5 rodadas por bloco', worst: 'O(n)', space: 'O(1)' },
    steps: [
      'Gere 52 subchaves de 16 bits: as 8 primeiras são a chave dividida em pedaços; depois gire a chave 25 bits para a esquerda e tire mais 8, até completar 52.',
      'Divida o bloco em X1, X2, X3, X4 (16 bits cada).',
      'Em cada rodada: multiplique X1 e X4 e some X2 e X3 com 4 subchaves; a estrutura MA combina (X1 ⊕ X3) e (X2 ⊕ X4) com as outras 2 subchaves.',
      'Faça XOR das saídas da MA com as quatro palavras e troque as duas do meio.',
      'Meia rodada final: multiplique X1 e X4 e some as palavras do meio (sem a troca) com as subchaves 49 a 52.',
    ],
    usedIn: ['PGP 2.x (cifra padrão nos anos 1990)', 'OpenPGP e GnuPG (opcional)', 'Sistemas de TV paga e smart cards', 'Ensino de projeto de cifras', 'Base do sucessor IDEA NXT (FOX)'],
    realWorld: [
      { title: 'PGP', text: 'Phil Zimmermann escolheu o IDEA para o PGP 2.0 (1992), porque o considerava mais seguro que o DES. Milhões de e-mails foram cifrados com ele — até que a patente levou o PGP a adotar CAST e AES.' },
      { title: 'Patentes', text: 'O IDEA foi patenteado na Europa e nos EUA pela Ascom e era gratuito apenas para uso não comercial. Isso limitou sua adoção, e a patente só expirou em 2012.' },
      { title: 'Lições de projeto', text: 'Misturar operações de grupos diferentes, como faz o IDEA, inspirou outras cifras e algoritmos; o próprio SHA-2 combina soma, XOR e rotações com essa intenção.' },
    ],
    curiosities: [
      'O nome original era PES (Proposed Encryption Standard). Depois do surgimento da criptoanálise diferencial, os autores o reforçaram e o chamaram de IPES, e só depois de IDEA.',
      'A multiplicação módulo 2¹⁶ + 1 = 65537 funciona porque 65537 é primo — o maior primo de Fermat conhecido. Por isso todo número de 1 a 65536 tem inverso.',
      'Bruce Schneier escreveu em 1996 que o IDEA era "o melhor e mais seguro algoritmo de bloco disponível ao público".',
    ],
    code: {
      python: String.raw`
        def mul(a, b):  # multiplicação módulo 2^16 + 1, em que 0 representa 2^16
            return ((a or 0x10000) * (b or 0x10000) % 0x10001) & 0xFFFF

        def subchaves(chave):  # chave de 128 bits → 52 subchaves de 16 bits
            Z, k = [], chave
            while len(Z) < 52:
                Z += [(k >> (112 - 16 * i)) & 0xFFFF for i in range(8)]
                k = ((k << 25) | (k >> 103)) & ((1 << 128) - 1)   # gira 25 bits
            return Z[:52]

        def idea(bloco, chave):
            Z = subchaves(chave)
            x1, x2, x3, x4 = [(bloco >> (48 - 16 * i)) & 0xFFFF for i in range(4)]
            for r in range(8):
                k = Z[6 * r:6 * r + 6]
                a, b = mul(x1, k[0]), (x2 + k[1]) & 0xFFFF
                c, d = (x3 + k[2]) & 0xFFFF, mul(x4, k[3])
                e = mul(a ^ c, k[4])                              # estrutura MA (multiplica-soma)
                f = mul(((b ^ d) + e) & 0xFFFF, k[5])
                e = (e + f) & 0xFFFF
                x1, x2, x3, x4 = a ^ f, c ^ f, b ^ e, d ^ e      # as palavras do meio trocam de lugar
            y = [mul(x1, Z[48]), (x3 + Z[49]) & 0xFFFF, (x2 + Z[50]) & 0xFFFF, mul(x4, Z[51])]  # meia rodada
            return (y[0] << 48) | (y[1] << 32) | (y[2] << 16) | y[3]

        print(f"{idea(0x0000000100020003, 0x00010002000300040005000600070008):016X}")  # 11FBED2B01986DE5
      `,
      javascript: String.raw`
        // multiplicação módulo 2^16 + 1, em que 0 representa 2^16 (o produto cabe em um Number com folga)
        const mul = (a, b) => (((a || 0x10000) * (b || 0x10000)) % 0x10001) & 0xffff;
        const soma = (a, b) => (a + b) & 0xffff;

        function subchaves(chave) { // chave de 128 bits (BigInt) → 52 subchaves de 16 bits
          const Z = [], mascara = (1n << 128n) - 1n;
          let k = chave;
          while (Z.length < 52) {
            for (let i = 0; i < 8; i++) Z.push(Number((k >> BigInt(112 - 16 * i)) & 0xffffn));
            k = ((k << 25n) | (k >> 103n)) & mascara; // gira 25 bits
          }
          return Z.slice(0, 52);
        }

        function idea(bloco, chave) {
          const Z = subchaves(chave);
          let [x1, x2, x3, x4] = [0, 1, 2, 3].map(i => Number((bloco >> BigInt(48 - 16 * i)) & 0xffffn));
          for (let r = 0; r < 8; r++) {
            const k = Z.slice(6 * r, 6 * r + 6);
            const a = mul(x1, k[0]), b = soma(x2, k[1]), c = soma(x3, k[2]), d = mul(x4, k[3]);
            let e = mul(a ^ c, k[4]); // estrutura MA (multiplica-soma)
            const f = mul(soma(b ^ d, e), k[5]);
            e = soma(e, f);
            [x1, x2, x3, x4] = [a ^ f, c ^ f, b ^ e, d ^ e]; // as palavras do meio trocam de lugar
          }
          const y = [mul(x1, Z[48]), soma(x3, Z[49]), soma(x2, Z[50]), mul(x4, Z[51])]; // meia rodada final
          return y.map(v => v.toString(16).padStart(4, "0")).join("").toUpperCase();
        }

        console.log(idea(0x0000000100020003n, 0x00010002000300040005000600070008n)); // 11FBED2B01986DE5
      `,
      java: String.raw`
        import java.math.BigInteger;

        public class IDEA {
            static int mul(int a, int b) { // multiplicação módulo 2^16 + 1, em que 0 representa 2^16
                long x = a == 0 ? 0x10000 : a, y = b == 0 ? 0x10000 : b;
                return (int) ((x * y) % 0x10001) & 0xFFFF;
            }
            static int soma(int a, int b) { return (a + b) & 0xFFFF; }

            static int[] subchaves(BigInteger chave) { // 128 bits → 52 subchaves de 16 bits
                BigInteger mascara = BigInteger.ONE.shiftLeft(128).subtract(BigInteger.ONE), k = chave;
                int[] Z = new int[52];
                for (int n = 0; n < 52; ) {
                    for (int i = 0; i < 8 && n < 52; i++) Z[n++] = k.shiftRight(112 - 16 * i).intValue() & 0xFFFF;
                    k = k.shiftLeft(25).or(k.shiftRight(103)).and(mascara); // gira 25 bits
                }
                return Z;
            }

            static String idea(long bloco, BigInteger chave) {
                int[] Z = subchaves(chave);
                int x1 = (int) (bloco >>> 48) & 0xFFFF, x2 = (int) (bloco >>> 32) & 0xFFFF;
                int x3 = (int) (bloco >>> 16) & 0xFFFF, x4 = (int) bloco & 0xFFFF;
                for (int r = 0; r < 8; r++) {
                    int a = mul(x1, Z[6 * r]), b = soma(x2, Z[6 * r + 1]), c = soma(x3, Z[6 * r + 2]), d = mul(x4, Z[6 * r + 3]);
                    int e = mul(a ^ c, Z[6 * r + 4]); // estrutura MA (multiplica-soma)
                    int f = mul(soma(b ^ d, e), Z[6 * r + 5]);
                    e = soma(e, f);
                    x1 = a ^ f; x2 = c ^ f; x3 = b ^ e; x4 = d ^ e; // as palavras do meio trocam de lugar
                }
                return String.format("%04X%04X%04X%04X", mul(x1, Z[48]), soma(x3, Z[49]), soma(x2, Z[50]), mul(x4, Z[51])); // meia rodada
            }

            public static void main(String[] args) {
                System.out.println(idea(0x0000000100020003L, new BigInteger("00010002000300040005000600070008", 16))); // 11FBED2B01986DE5
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        using namespace std;

        using u128 = unsigned __int128; // 128 bits (GCC e Clang)

        uint16_t mul(uint32_t a, uint32_t b) { // multiplicação módulo 2^16 + 1, em que 0 representa 2^16
            uint64_t x = a ? a : 0x10000, y = b ? b : 0x10000;
            return (x * y) % 0x10001 & 0xFFFF;
        }
        uint16_t soma(uint32_t a, uint32_t b) { return (a + b) & 0xFFFF; }

        uint64_t idea(uint64_t bloco, u128 chave) {
            uint16_t Z[52];
            for (int n = 0; n < 52;) { // 128 bits → 52 subchaves de 16 bits
                for (int i = 0; i < 8 && n < 52; i++) Z[n++] = (chave >> (112 - 16 * i)) & 0xFFFF;
                chave = (chave << 25) | (chave >> 103); // gira 25 bits
            }
            uint16_t x1 = bloco >> 48, x2 = bloco >> 32, x3 = bloco >> 16, x4 = bloco;
            for (int r = 0; r < 8; r++) {
                const uint16_t* k = Z + 6 * r;
                uint16_t a = mul(x1, k[0]), b = soma(x2, k[1]), c = soma(x3, k[2]), d = mul(x4, k[3]);
                uint16_t e = mul(a ^ c, k[4]); // estrutura MA (multiplica-soma)
                uint16_t f = mul(soma(b ^ d, e), k[5]);
                e = soma(e, f);
                x1 = a ^ f; x2 = c ^ f; x3 = b ^ e; x4 = d ^ e; // as palavras do meio trocam de lugar
            }
            return ((uint64_t)mul(x1, Z[48]) << 48) | ((uint64_t)soma(x3, Z[49]) << 32) | ((uint64_t)soma(x2, Z[50]) << 16) | mul(x4, Z[51]);
        }

        int main() {
            u128 chave = ((u128)0x0001000200030004ULL << 64) | 0x0005000600070008ULL;
            printf("%016llX\n", (unsigned long long)idea(0x0000000100020003ULL, chave)); // 11FBED2B01986DE5
        }
      `,
    },
  },
  {
    id: 'rsa',
    name: 'RSA',
    difficulty: 'Intermediário',
    en: { name: 'RSA', summary: 'The first practical public-key cryptosystem: anyone can encrypt with (n, e), only the holder of d can decrypt — because factoring n is hard.' },
    facts: { 'Criado por': 'Ron Rivest, Adi Shamir e Leonard Adleman', 'Ano': '1977', 'Tipo': 'Criptografia de chave pública e assinatura', 'Base de segurança': 'Dificuldade de fatorar n = p·q', 'Tamanho da chave': '2048 a 4096 bits (recomendado)', 'Situação': 'Seguro com chaves grandes; vulnerável a computadores quânticos' },
    summary: 'O primeiro sistema prático de chave pública: qualquer um cifra com (n, e), só quem tem d decifra — porque fatorar n é difícil.',
    description:
      'O RSA resolve um problema que parecia impossível: duas pessoas se comunicarem em segredo sem nunca terem combinado uma chave. Cada pessoa escolhe dois primos grandes p e q, calcula n = p·q e φ(n) = (p − 1)(q − 1), escolhe um expoente público e (normalmente 65537) e calcula o expoente privado d, o inverso de e módulo φ(n), com o algoritmo de Euclides estendido. A chave pública (n, e) pode ser divulgada; d fica em segredo. Para cifrar, calcula-se c = mᵉ mod n; para decifrar, m = cᵈ mod n — o teorema de Euler garante que as duas operações se anulam. Descobrir d a partir de (n, e) exige φ(n), que exige fatorar n: com números de 2048 bits, isso está fora do alcance de qualquer computador clássico. Invertendo os papéis — "cifrar" com d — obtém-se uma assinatura digital que qualquer um verifica com e.',
    complexity: { best: 'O(k³) por operação (k = bits da chave)', average: 'O(k³)', worst: 'O(k⁴) para gerar as chaves', space: 'O(k)' },
    steps: [
      'Escolha dois primos grandes e distintos p e q (com testes como Miller-Rabin) e calcule n = p·q.',
      'Calcule φ(n) = (p − 1)(q − 1) e escolha e com mdc(e, φ(n)) = 1 — em geral, e = 65537.',
      'Calcule d = e⁻¹ mod φ(n) com o algoritmo de Euclides estendido. Publique (n, e); guarde d.',
      'Cifrar: c = mᵉ mod n. Decifrar: m = cᵈ mod n (por exponenciação rápida).',
      'Assinar: s = mᵈ mod n (sobre o hash da mensagem). Verificar: sᵉ mod n = m. Na prática, use preenchimentos seguros (OAEP para cifrar, PSS para assinar).',
    ],
    usedIn: ['Certificados TLS/HTTPS (assinaturas)', 'Assinatura de código e de atualizações', 'E-mail seguro (PGP, S/MIME)', 'SSH (chaves RSA)', 'Cartões inteligentes e documentos eletrônicos'],
    realWorld: [
      { title: 'O cadeado do navegador', text: 'A maioria dos certificados que provam que um site é quem diz ser ainda é assinada com RSA. O navegador verifica a cadeia de assinaturas até uma autoridade certificadora em que confia.' },
      { title: 'Assinatura digital de documentos', text: 'No Brasil, os certificados ICP-Brasil (e-CPF, e-CNPJ) usam RSA para assinar documentos com validade jurídica. A assinatura é feita sobre o hash do documento.' },
      { title: 'A ameaça quântica', text: 'O algoritmo de Shor fatoraria n em tempo polinomial em um computador quântico grande. Por isso o NIST padronizou, em 2024, algoritmos pós-quânticos (como o ML-KEM, baseado em reticulados) para substituir RSA e curvas elípticas.' },
    ],
    curiosities: [
      'Clifford Cocks, do serviço de inteligência britânico GCHQ, descobriu o mesmo sistema em 1973 — quatro anos antes de Rivest, Shamir e Adleman —, mas o trabalho ficou secreto até 1997.',
      'Em 1977, a coluna de Martin Gardner na Scientific American desafiou os leitores a decifrar uma mensagem RSA com chave de 129 dígitos. Ela só foi quebrada em 1994, por 600 voluntários, e dizia "THE MAGIC WORDS ARE SQUEAMISH OSSIFRAGE".',
      'O maior número RSA do desafio público já fatorado (RSA-250, com 829 bits) levou cerca de 2.700 anos de CPU, em 2020.',
    ],
    code: {
      python: String.raw`
        # Didático: primos minúsculos e sem preenchimento. Em produção, use uma biblioteca
        # (ex.: o pacote cryptography) com chaves de 2048+ bits e OAEP/PSS.
        p, q, e = 61, 53, 17
        n, phi = p * q, (p - 1) * (q - 1)
        d = pow(e, -1, phi)                 # inverso modular (Euclides estendido)
        print(f"n = {n}, d = {d}")          # n = 3233, d = 2753

        m = 65
        c = pow(m, e, n)                    # cifrar com a chave pública
        print(f"cifrado: {c}")              # cifrado: 2790
        print(f"decifrado: {pow(c, d, n)}") # decifrado: 65

        assinatura = pow(m, d, n)           # assinar com a chave privada
        valida = pow(assinatura, e, n) == m # qualquer um verifica com (n, e)
        print(f"assinatura: {assinatura} — {'válida' if valida else 'inválida'}")  # assinatura: 588 — válida
      `,
      javascript: String.raw`
        // Didático: primos minúsculos e sem preenchimento. Em produção, use crypto.generateKeyPairSync("rsa")
        // com chaves de 2048+ bits e OAEP/PSS.
        function modPow(b, e, m) {
          let r = 1n;
          for (b %= m; e > 0n; e >>= 1n, b = (b * b) % m) if (e & 1n) r = (r * b) % m;
          return r;
        }
        function modInverso(a, m) { // Euclides estendido
          let [r0, r1, s0, s1] = [a, m, 1n, 0n];
          while (r1) { const q = r0 / r1; [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; }
          return ((s0 % m) + m) % m;
        }

        const p = 61n, q = 53n, e = 17n;
        const n = p * q, phi = (p - 1n) * (q - 1n), d = modInverso(e, phi);
        console.log("n = " + n + ", d = " + d);              // n = 3233, d = 2753
        const m = 65n;
        const c = modPow(m, e, n);                            // cifrar com a chave pública
        console.log("cifrado: " + c);                         // cifrado: 2790
        console.log("decifrado: " + modPow(c, d, n));         // decifrado: 65
        const assinatura = modPow(m, d, n);                   // assinar com a chave privada
        const valida = modPow(assinatura, e, n) === m;        // qualquer um verifica com (n, e)
        console.log("assinatura: " + assinatura + " — " + (valida ? "válida" : "inválida")); // assinatura: 588 — válida
      `,
      java: String.raw`
        import java.math.BigInteger;

        public class RSA {
            public static void main(String[] args) {
                // Didático: primos minúsculos e sem preenchimento. Em produção, use
                // KeyPairGenerator.getInstance("RSA") com 2048+ bits e Cipher "RSA/ECB/OAEPWithSHA-256AndMGF1Padding".
                BigInteger p = BigInteger.valueOf(61), q = BigInteger.valueOf(53), e = BigInteger.valueOf(17);
                BigInteger n = p.multiply(q);
                BigInteger phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));
                BigInteger d = e.modInverse(phi); // Euclides estendido
                System.out.println("n = " + n + ", d = " + d);                 // n = 3233, d = 2753
                BigInteger m = BigInteger.valueOf(65);
                BigInteger c = m.modPow(e, n);                                 // cifrar com a chave pública
                System.out.println("cifrado: " + c);                           // cifrado: 2790
                System.out.println("decifrado: " + c.modPow(d, n));            // decifrado: 65
                BigInteger assinatura = m.modPow(d, n);                        // assinar com a chave privada
                boolean valida = assinatura.modPow(e, n).equals(m);            // qualquer um verifica com (n, e)
                System.out.println("assinatura: " + assinatura + " — " + (valida ? "válida" : "inválida")); // assinatura: 588 — válida
            }
        }
      `,
      cpp: String.raw`
        // Didático: primos minúsculos e sem preenchimento. Em produção, use o OpenSSL (EVP_PKEY)
        // com chaves de 2048+ bits e OAEP/PSS.
        #include <cstdint>
        #include <cstdio>
        using namespace std;

        uint64_t modPow(uint64_t b, uint64_t e, uint64_t m) {
            uint64_t r = 1;
            for (b %= m; e; e >>= 1, b = (unsigned __int128)b * b % m)
                if (e & 1) r = (unsigned __int128)r * b % m;
            return r;
        }

        int64_t modInverso(int64_t a, int64_t m) { // Euclides estendido
            int64_t r0 = a, r1 = m, s0 = 1, s1 = 0;
            while (r1) {
                int64_t q = r0 / r1, t = r0 - q * r1;
                r0 = r1; r1 = t;
                t = s0 - q * s1; s0 = s1; s1 = t;
            }
            return (s0 % m + m) % m;
        }

        int main() {
            uint64_t p = 61, q = 53, e = 17;
            uint64_t n = p * q, phi = (p - 1) * (q - 1), d = modInverso(e, phi);
            printf("n = %llu, d = %llu\n", (unsigned long long)n, (unsigned long long)d);  // n = 3233, d = 2753
            uint64_t m = 65, c = modPow(m, e, n);                                          // cifrar com a chave pública
            printf("cifrado: %llu\n", (unsigned long long)c);                              // cifrado: 2790
            printf("decifrado: %llu\n", (unsigned long long)modPow(c, d, n));              // decifrado: 65
            uint64_t assinatura = modPow(m, d, n);                                         // assinar com a chave privada
            bool valida = modPow(assinatura, e, n) == m;                                   // verificar com (n, e)
            printf("assinatura: %llu — %s\n", (unsigned long long)assinatura, valida ? "válida" : "inválida"); // assinatura: 588 — válida
        }
      `,
    },
  },
  {
    id: 'diffie-hellman',
    name: 'Troca de Chaves Diffie-Hellman',
    difficulty: 'Intermediário',
    en: { name: 'Diffie-Hellman Key Exchange', summary: 'Two people agree on a shared secret over a public channel that an eavesdropper hears in full — the idea that started public-key cryptography.' },
    facts: { 'Criado por': 'Whitfield Diffie e Martin Hellman (com Ralph Merkle)', 'Ano': '1976', 'Tipo': 'Acordo de chaves', 'Base de segurança': 'Problema do logaritmo discreto', 'Prêmios': 'Prêmio Turing 2015', 'Situação': 'Seguro (2048+ bits ou curvas elípticas); vulnerável a computadores quânticos' },
    summary: 'Duas pessoas combinam um segredo por um canal público que um espião escuta por inteiro — a ideia que inaugurou a criptografia de chave pública.',
    description:
      'Antes de 1976, para conversar em segredo era preciso combinar a chave antes, pessoalmente ou por um mensageiro de confiança. A troca de chaves Diffie-Hellman mostrou que isso não é necessário. Alice e Bob combinam em público um primo p e um gerador g. Cada um escolhe um número secreto (a e b) e envia o outro gᵃ mod p e gᵇ mod p. Então Alice eleva o número de Bob ao seu segredo, e Bob faz o mesmo: (gᵇ)ᵃ = (gᵃ)ᵇ = gᵃᵇ mod p. Os dois chegam ao mesmo número, que nunca passou pelo canal. Uma espiã que viu p, g, gᵃ e gᵇ precisaria descobrir a ou b — o problema do logaritmo discreto, inviável para primos de 2048 bits. O protocolo não autentica ninguém: sem assinaturas, um atacante no meio do caminho pode fazer uma troca com cada lado.',
    complexity: { best: 'O(k³) (exponenciação modular, k bits)', average: 'O(k³)', worst: 'O(k³)', space: 'O(k)' },
    steps: [
      'Alice e Bob combinam publicamente um primo grande p e um gerador g.',
      'Alice escolhe um segredo a e envia A = gᵃ mod p. Bob escolhe um segredo b e envia B = gᵇ mod p.',
      'Alice calcula s = Bᵃ mod p; Bob calcula s = Aᵇ mod p. Os dois obtêm gᵃᵇ mod p.',
      'O segredo s passa por uma função de derivação de chaves (KDF) e vira a chave de uma cifra simétrica, como o AES.',
      'Para evitar o ataque do homem do meio, as mensagens A e B precisam ser autenticadas (por exemplo, com assinaturas digitais).',
    ],
    usedIn: ['TLS/HTTPS (troca de chaves efêmera, sigilo futuro)', 'SSH', 'VPNs (IPsec/IKE, WireGuard com curvas elípticas)', 'Signal e WhatsApp (protocolo X3DH e Double Ratchet)', 'Wi-Fi WPA3 (SAE)'],
    realWorld: [
      { title: 'Sigilo futuro no HTTPS', text: 'No TLS 1.3, toda conexão faz uma troca Diffie-Hellman efêmera (geralmente com curvas elípticas). Assim, mesmo que a chave do servidor vaze no futuro, as conversas gravadas no passado continuam protegidas.' },
      { title: 'Mensageiros', text: 'Signal e WhatsApp fazem trocas Diffie-Hellman continuamente: cada mensagem nova pode atualizar a chave, de modo que comprometer uma chave não expõe o resto da conversa.' },
      { title: 'Logjam', text: 'Em 2015, o ataque Logjam mostrou que muitos servidores aceitavam Diffie-Hellman com primos de 512 bits ou reutilizavam os mesmos primos de 1024 bits — que um órgão com recursos poderia pré-computar. Hoje recomenda-se 2048 bits ou curvas elípticas.' },
    ],
    curiosities: [
      'Diffie e Hellman receberam o Prêmio Turing de 2015. Hellman defende que o protocolo deveria se chamar Diffie-Hellman-Merkle, porque Ralph Merkle teve a ideia do acordo de chaves público antes.',
      'Malcolm Williamson, do GCHQ britânico, chegou ao mesmo método em 1974, mas o trabalho só foi revelado em 1997.',
      'A analogia clássica é com tintas: misturar é fácil, separar a mistura é quase impossível. A cor compartilhada é "tinta comum + segredo de Alice + segredo de Bob".',
    ],
    code: {
      python: String.raw`
        import secrets

        # Exemplo clássico com números pequenos
        p, g = 23, 5
        a, b = 6, 15                     # segredos de Alice e de Bob
        A, B = pow(g, a, p), pow(g, b, p)
        print(A, B, pow(B, a, p), pow(A, b, p))  # 8 19 2 2 — os dois chegam a 2

        # Com um primo de 64 bits (ainda pequeno demais para uso real: use 2048+ bits ou X25519)
        p = 2**64 - 59
        a, b = secrets.randbelow(p - 2) + 1, secrets.randbelow(p - 2) + 1
        A, B = pow(2, a, p), pow(2, b, p)
        print("iguais" if pow(B, a, p) == pow(A, b, p) else "diferentes")  # iguais
      `,
      javascript: String.raw`
        import crypto from "node:crypto";

        function modPow(b, e, m) {
          let r = 1n;
          for (b %= m; e > 0n; e >>= 1n, b = (b * b) % m) if (e & 1n) r = (r * b) % m;
          return r;
        }

        // Exemplo clássico com números pequenos
        let p = 23n, g = 5n, a = 6n, b = 15n; // segredos de Alice e de Bob
        let A = modPow(g, a, p), B = modPow(g, b, p);
        console.log(A + " " + B + " " + modPow(B, a, p) + " " + modPow(A, b, p)); // 8 19 2 2

        // Com um primo de 64 bits (ainda pequeno demais: use crypto.createECDH ou X25519 de verdade)
        p = 2n ** 64n - 59n;
        const aleatorio = () => (crypto.randomBytes(8).readBigUInt64BE() % (p - 2n)) + 1n;
        a = aleatorio(); b = aleatorio();
        A = modPow(2n, a, p); B = modPow(2n, b, p);
        console.log(modPow(B, a, p) === modPow(A, b, p) ? "iguais" : "diferentes"); // iguais
      `,
      java: String.raw`
        import java.math.BigInteger;
        import java.security.SecureRandom;

        public class DiffieHellman {
            public static void main(String[] args) {
                // Exemplo clássico com números pequenos
                BigInteger p = BigInteger.valueOf(23), g = BigInteger.valueOf(5);
                BigInteger a = BigInteger.valueOf(6), b = BigInteger.valueOf(15); // segredos de Alice e de Bob
                BigInteger A = g.modPow(a, p), B = g.modPow(b, p);
                System.out.println(A + " " + B + " " + B.modPow(a, p) + " " + A.modPow(b, p)); // 8 19 2 2

                // Com um primo de 64 bits (ainda pequeno: em produção, KeyAgreement.getInstance("X25519"))
                p = BigInteger.TWO.pow(64).subtract(BigInteger.valueOf(59));
                SecureRandom rnd = new SecureRandom();
                a = new BigInteger(63, rnd).add(BigInteger.ONE);
                b = new BigInteger(63, rnd).add(BigInteger.ONE);
                A = BigInteger.TWO.modPow(a, p);
                B = BigInteger.TWO.modPow(b, p);
                System.out.println(B.modPow(a, p).equals(A.modPow(b, p)) ? "iguais" : "diferentes"); // iguais
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        #include <random>
        using namespace std;

        uint64_t modPow(uint64_t b, uint64_t e, uint64_t m) {
            uint64_t r = 1;
            for (b %= m; e; e >>= 1, b = (unsigned __int128)b * b % m)
                if (e & 1) r = (unsigned __int128)r * b % m;
            return r;
        }

        int main() {
            // Exemplo clássico com números pequenos
            uint64_t p = 23, g = 5, a = 6, b = 15; // segredos de Alice e de Bob
            uint64_t A = modPow(g, a, p), B = modPow(g, b, p);
            printf("%llu %llu %llu %llu\n", (unsigned long long)A, (unsigned long long)B,
                   (unsigned long long)modPow(B, a, p), (unsigned long long)modPow(A, b, p)); // 8 19 2 2

            // Com um primo de 64 bits (ainda pequeno: em produção, use X25519 do OpenSSL ou libsodium)
            p = 18446744073709551557ULL; // 2^64 - 59
            random_device rd;
            uniform_int_distribution<uint64_t> dist(1, p - 2);
            a = dist(rd); b = dist(rd);
            A = modPow(2, a, p); B = modPow(2, b, p);
            printf("%s\n", modPow(B, a, p) == modPow(A, b, p) ? "iguais" : "diferentes"); // iguais
        }
      `,
    },
  },
  {
    id: 'elgamal',
    name: 'Criptossistema ElGamal',
    difficulty: 'Avançado',
    en: { name: 'ElGamal Cryptosystem', summary: 'Public-key encryption built on Diffie-Hellman: each message uses a fresh random number, so encrypting the same text twice gives different ciphertexts.' },
    facts: { 'Criado por': 'Taher Elgamal', 'Ano': '1985', 'Tipo': 'Criptografia de chave pública e assinatura', 'Base de segurança': 'Problema do logaritmo discreto', 'Característica': 'Cifragem aleatorizada (texto cifrado 2× maior)', 'Situação': 'Seguro com parâmetros grandes' },
    summary: 'Criptografia de chave pública construída sobre o Diffie-Hellman: cada mensagem usa um número aleatório novo, então cifrar o mesmo texto duas vezes dá resultados diferentes.',
    description:
      'O ElGamal transforma a troca Diffie-Hellman em um sistema de cifragem. O destinatário publica p, g e h = gˣ mod p, guardando x. Para cifrar uma mensagem m (um número menor que p), o remetente escolhe um número aleatório k, só para essa mensagem, e envia o par c₁ = gᵏ e c₂ = m · hᵏ mod p. Em outras palavras: ele faz uma troca Diffie-Hellman "de mão única" com o destinatário e usa o segredo compartilhado hᵏ = gˣᵏ como máscara multiplicativa. O destinatário recalcula a máscara como c₁ˣ e a desfaz com o inverso modular. Como k muda a cada vez, a cifragem é probabilística — uma propriedade importante, que o RSA "puro" não tem. O preço é que o texto cifrado tem o dobro do tamanho da mensagem.',
    complexity: { best: 'O(k³) por operação (k bits)', average: 'O(k³)', worst: 'O(k³)', space: 'O(k)' },
    steps: [
      'Chaves: escolha um primo p, um gerador g e um segredo x; publique (p, g, h = gˣ mod p).',
      'Cifrar m: escolha um k aleatório e novo; calcule c₁ = gᵏ mod p e c₂ = m · hᵏ mod p. Envie (c₁, c₂).',
      'Decifrar: calcule a máscara s = c₁ˣ mod p (que é igual a hᵏ).',
      'Calcule o inverso s⁻¹ mod p e recupere m = c₂ · s⁻¹ mod p.',
      'Nunca reutilize k: com dois textos cifrados com o mesmo k, conhecer uma mensagem revela a outra.',
    ],
    usedIn: ['GnuPG/OpenPGP (chaves ElGamal para cifragem)', 'Base do DSA (assinatura derivada do ElGamal)', 'Votação eletrônica (cifragem homomórfica)', 'Protocolos de computação multipartidária', 'Ensino de criptografia de chave pública'],
    realWorld: [
      { title: 'GnuPG', text: 'Por anos, a configuração padrão do GnuPG gerava um par de chaves DSA (para assinar) + ElGamal (para cifrar), como alternativa livre de patentes ao RSA.' },
      { title: 'Votação eletrônica', text: 'O ElGamal é homomórfico para a multiplicação: multiplicar dois textos cifrados dá a cifra do produto. Uma variante (com a mensagem no expoente) permite somar votos cifrados sem decifrar nenhum voto individual — base de sistemas como o Helios.' },
      { title: 'Reutilizar k é fatal', text: 'Se k se repete, c₂/c₂′ = m/m′: conhecendo uma mensagem, descobre-se a outra. Erros desse tipo — reaproveitar o número aleatório — já derrubaram vários sistemas reais baseados em ElGamal e DSA.' },
    ],
    curiosities: [
      'Taher Elgamal, criador do sistema, também é considerado o "pai do SSL": como cientista-chefe da Netscape, liderou o desenvolvimento do protocolo que deu origem ao HTTPS.',
      'O esquema de assinatura ElGamal, publicado no mesmo artigo, inspirou o DSA e, indiretamente, o ECDSA usado no Bitcoin.',
      'A mesma ideia funciona em qualquer grupo onde o logaritmo discreto seja difícil — inclusive em curvas elípticas, com chaves muito menores.',
    ],
    code: {
      python: String.raw`
        p, g = 467, 2                  # parâmetros públicos (didáticos; o real usa 2048+ bits)
        x = 127                        # chave privada do destinatário
        h = pow(g, x, p)               # chave pública

        m, k = 100, 213                # mensagem e número aleatório (novo a cada mensagem!)
        c1, c2 = pow(g, k, p), m * pow(h, k, p) % p
        print(f"cifrado: ({c1}, {c2})")         # cifrado: (29, 375)

        s = pow(c1, x, p)                       # a mesma máscara h^k, sem conhecer k
        print(f"decifrado: {c2 * pow(s, -1, p) % p}")  # decifrado: 100
      `,
      javascript: String.raw`
        function modPow(b, e, m) {
          let r = 1n;
          for (b %= m; e > 0n; e >>= 1n, b = (b * b) % m) if (e & 1n) r = (r * b) % m;
          return r;
        }
        const modInverso = (a, p) => modPow(a, p - 2n, p); // pequeno teorema de Fermat (p primo)

        const p = 467n, g = 2n;       // parâmetros públicos (didáticos; o real usa 2048+ bits)
        const x = 127n;               // chave privada do destinatário
        const h = modPow(g, x, p);    // chave pública

        const m = 100n, k = 213n;     // mensagem e número aleatório (novo a cada mensagem!)
        const c1 = modPow(g, k, p), c2 = (m * modPow(h, k, p)) % p;
        console.log("cifrado: (" + c1 + ", " + c2 + ")");              // cifrado: (29, 375)

        const s = modPow(c1, x, p);   // a mesma máscara h^k, sem conhecer k
        console.log("decifrado: " + (c2 * modInverso(s, p)) % p);      // decifrado: 100
      `,
      java: String.raw`
        import java.math.BigInteger;

        public class ElGamal {
            public static void main(String[] args) {
                BigInteger p = BigInteger.valueOf(467), g = BigInteger.TWO; // didático; o real usa 2048+ bits
                BigInteger x = BigInteger.valueOf(127);                    // chave privada do destinatário
                BigInteger h = g.modPow(x, p);                             // chave pública

                BigInteger m = BigInteger.valueOf(100), k = BigInteger.valueOf(213); // k: novo a cada mensagem!
                BigInteger c1 = g.modPow(k, p), c2 = m.multiply(h.modPow(k, p)).mod(p);
                System.out.println("cifrado: (" + c1 + ", " + c2 + ")");   // cifrado: (29, 375)

                BigInteger s = c1.modPow(x, p);                            // a mesma máscara h^k
                System.out.println("decifrado: " + c2.multiply(s.modInverse(p)).mod(p)); // decifrado: 100
            }
        }
      `,
      cpp: String.raw`
        #include <cstdint>
        #include <cstdio>
        using namespace std;

        uint64_t modPow(uint64_t b, uint64_t e, uint64_t m) {
            uint64_t r = 1;
            for (b %= m; e; e >>= 1, b = b * b % m)
                if (e & 1) r = r * b % m;
            return r;
        }

        int main() {
            uint64_t p = 467, g = 2;         // parâmetros públicos (didáticos; o real usa 2048+ bits)
            uint64_t x = 127;                // chave privada do destinatário
            uint64_t h = modPow(g, x, p);    // chave pública

            uint64_t m = 100, k = 213;       // mensagem e número aleatório (novo a cada mensagem!)
            uint64_t c1 = modPow(g, k, p), c2 = m * modPow(h, k, p) % p;
            printf("cifrado: (%llu, %llu)\n", (unsigned long long)c1, (unsigned long long)c2); // cifrado: (29, 375)

            uint64_t s = modPow(c1, x, p);               // a mesma máscara h^k, sem conhecer k
            uint64_t sInv = modPow(s, p - 2, p);         // inverso pelo pequeno teorema de Fermat
            printf("decifrado: %llu\n", (unsigned long long)(c2 * sInv % p)); // decifrado: 100
        }
      `,
    },
  },
  {
    id: 'dsa',
    name: 'DSA (Digital Signature Algorithm)',
    difficulty: 'Avançado',
    en: { name: 'DSA (Digital Signature Algorithm)', summary: 'The US government signature standard: proves who signed a message and that it was not altered, using the discrete logarithm problem.' },
    facts: { 'Criado por': 'NIST / NSA (David Kravitz)', 'Ano': '1991; padrão em 1994 (FIPS 186)', 'Tipo': 'Assinatura digital', 'Base de segurança': 'Problema do logaritmo discreto', 'Variante moderna': 'ECDSA e EdDSA (curvas elípticas)', 'Situação': 'Retirado do FIPS 186-5 (2023) em favor do ECDSA/EdDSA' },
    summary: 'O padrão de assinatura digital do governo dos EUA: prova quem assinou uma mensagem e que ela não foi alterada, usando o problema do logaritmo discreto.',
    description:
      'Uma assinatura digital garante três coisas: autoria (só o dono da chave privada consegue assinar), integridade (qualquer alteração invalida a assinatura) e não repúdio (o autor não pode negar). No DSA, os parâmetros públicos são dois primos p e q, com q dividindo p − 1, e um gerador g de ordem q. A chave privada é um número x, e a pública é y = gˣ mod p. Para assinar, calcula-se o hash H da mensagem e escolhe-se um número secreto k, único para cada assinatura: r = (gᵏ mod p) mod q e s = k⁻¹(H + x·r) mod q. A assinatura é o par (r, s). Quem verifica calcula w = s⁻¹, u₁ = H·w e u₂ = r·w e confere se (g^u₁ · y^u₂ mod p) mod q = r. A identidade funciona porque g^u₁ · y^u₂ = g^((H + x·r)·w) = gᵏ.',
    complexity: { best: 'O(k³) por assinatura (k bits)', average: 'O(k³)', worst: 'O(k³)', space: 'O(k)' },
    steps: [
      'Parâmetros: primos p e q (q divide p − 1) e g = h^((p−1)/q) mod p, de ordem q. Chaves: x secreto e y = gˣ mod p.',
      'Assinar: H = hash(mensagem) mod q; escolha k aleatório e secreto; r = (gᵏ mod p) mod q; s = k⁻¹ · (H + x·r) mod q.',
      'Se r ou s der zero, escolha outro k. A assinatura é (r, s).',
      'Verificar: w = s⁻¹ mod q; u₁ = H·w mod q; u₂ = r·w mod q; v = (g^u₁ · y^u₂ mod p) mod q.',
      'A assinatura é válida se v = r. Um k repetido ou previsível revela a chave privada x.',
    ],
    usedIn: ['Assinaturas de documentos e código (FIPS 186)', 'SSH (chaves ssh-dss, hoje desativadas)', 'GnuPG (chaves DSA)', 'Base do ECDSA (Bitcoin, Ethereum, TLS)', 'Certificados governamentais'],
    realWorld: [
      { title: 'PlayStation 3', text: 'Em 2010, o grupo fail0verflow descobriu que a Sony assinava o software do PS3 com ECDSA usando sempre o mesmo k. Com duas assinaturas, bastou resolver um sistema de equações para obter a chave privada da Sony.' },
      { title: 'Carteiras de Bitcoin', text: 'Em 2013, um defeito no gerador de números aleatórios do Android fez carteiras de Bitcoin repetirem o k do ECDSA. Atacantes recuperaram as chaves privadas e roubaram os fundos.' },
      { title: 'k determinístico', text: 'Para eliminar esse risco, a RFC 6979 define como gerar k de forma determinística a partir da chave privada e da mensagem — sem depender de um bom gerador aleatório. O EdDSA (Ed25519) já nasce com essa ideia.' },
    ],
    curiosities: [
      'O DSA foi proposto em 1991 em parte para evitar as patentes do RSA. Sua escolha gerou polêmica, porque a NSA participou do projeto e o padrão inicial limitava as chaves a 1024 bits.',
      'Com a mesma chave privada, duas assinaturas com o mesmo k dão duas equações com duas incógnitas (k e x): x = (s₂·H₁ − s₁·H₂) / (r·(s₁ − s₂)) mod q.',
      'Em 2023, o FIPS 186-5 deixou de aprovar o DSA para novas assinaturas, mantendo o ECDSA e acrescentando o EdDSA.',
    ],
    code: {
      python: String.raw`
        import hashlib

        # Parâmetros didáticos: q divide p − 1 = 7878 = 2 · 3 · 13 · 101. O real usa q de 256 bits.
        p, q = 7879, 101
        g = pow(3, (p - 1) // q, p)        # gerador de ordem q
        x = 75                             # chave privada
        y = pow(g, x, p)                   # chave pública

        def H(mensagem):
            return int.from_bytes(hashlib.sha256(mensagem.encode()).digest(), "big") % q

        def assinar(mensagem, k):          # k: secreto e único por assinatura!
            r = pow(g, k, p) % q
            s = pow(k, -1, q) * (H(mensagem) + x * r) % q
            return r, s

        def verificar(mensagem, r, s):
            w = pow(s, -1, q)
            u1, u2 = H(mensagem) * w % q, r * w % q
            return pow(g, u1, p) * pow(y, u2, p) % p % q == r

        r, s = assinar("transferir R$ 100", 50)
        print(r, s)                                                     # 94 5
        print("válida" if verificar("transferir R$ 100", r, s) else "inválida")   # válida
        print("válida" if verificar("transferir R$ 900", r, s) else "inválida")   # inválida
      `,
      javascript: String.raw`
        import crypto from "node:crypto";

        function modPow(b, e, m) {
          let r = 1n;
          for (b %= m; e > 0n; e >>= 1n, b = (b * b) % m) if (e & 1n) r = (r * b) % m;
          return r;
        }
        const inverso = (a, q) => modPow(a, q - 2n, q); // q é primo

        // Parâmetros didáticos: q divide p − 1. O real usa q de 256 bits (ou ECDSA/Ed25519 via crypto.sign).
        const p = 7879n, q = 101n;
        const g = modPow(3n, (p - 1n) / q, p); // gerador de ordem q
        const x = 75n, y = modPow(g, x, p);    // chaves privada e pública
        const H = m => BigInt("0x" + crypto.createHash("sha256").update(m).digest("hex")) % q;

        function assinar(m, k) { // k: secreto e único por assinatura!
          const r = modPow(g, k, p) % q;
          return [r, (inverso(k, q) * (H(m) + x * r)) % q];
        }

        function verificar(m, r, s) {
          const w = inverso(s, q), u1 = (H(m) * w) % q, u2 = (r * w) % q;
          return ((modPow(g, u1, p) * modPow(y, u2, p)) % p) % q === r;
        }

        const [r, s] = assinar("transferir R$ 100", 50n);
        console.log(r + " " + s);                                                      // 94 5
        console.log(verificar("transferir R$ 100", r, s) ? "válida" : "inválida");    // válida
        console.log(verificar("transferir R$ 900", r, s) ? "válida" : "inválida");    // inválida
      `,
      java: String.raw`
        import java.math.BigInteger;
        import java.nio.charset.StandardCharsets;
        import java.security.MessageDigest;

        public class DSA {
            // Parâmetros didáticos: q divide p − 1. Em produção: Signature.getInstance("SHA256withECDSA") ou "Ed25519".
            static final BigInteger p = BigInteger.valueOf(7879), q = BigInteger.valueOf(101);
            static final BigInteger g = BigInteger.valueOf(3).modPow(p.subtract(BigInteger.ONE).divide(q), p); // ordem q
            static final BigInteger x = BigInteger.valueOf(75), y = g.modPow(x, p); // chaves privada e pública

            static BigInteger H(String m) throws Exception {
                byte[] d = MessageDigest.getInstance("SHA-256").digest(m.getBytes(StandardCharsets.UTF_8));
                return new BigInteger(1, d).mod(q);
            }

            static BigInteger[] assinar(String m, BigInteger k) throws Exception { // k: secreto e único!
                BigInteger r = g.modPow(k, p).mod(q);
                BigInteger s = k.modInverse(q).multiply(H(m).add(x.multiply(r))).mod(q);
                return new BigInteger[]{r, s};
            }

            static boolean verificar(String m, BigInteger r, BigInteger s) throws Exception {
                BigInteger w = s.modInverse(q), u1 = H(m).multiply(w).mod(q), u2 = r.multiply(w).mod(q);
                return g.modPow(u1, p).multiply(y.modPow(u2, p)).mod(p).mod(q).equals(r);
            }

            public static void main(String[] args) throws Exception {
                BigInteger[] rs = assinar("transferir R$ 100", BigInteger.valueOf(50));
                System.out.println(rs[0] + " " + rs[1]);                                                     // 94 5
                System.out.println(verificar("transferir R$ 100", rs[0], rs[1]) ? "válida" : "inválida");   // válida
                System.out.println(verificar("transferir R$ 900", rs[0], rs[1]) ? "válida" : "inválida");   // inválida
            }
        }
      `,
      cpp: String.raw`
        // Compile com: g++ dsa.cpp -lcrypto (usa o SHA-256 do OpenSSL)
        #include <cstdint>
        #include <cstdio>
        #include <cstring>
        #include <openssl/sha.h>
        using namespace std;

        // Parâmetros didáticos: q divide p − 1 = 7878. O real usa q de 256 bits (ou ECDSA/Ed25519).
        const uint64_t p = 7879, q = 101;

        uint64_t modPow(uint64_t b, uint64_t e, uint64_t m) {
            uint64_t r = 1;
            for (b %= m; e; e >>= 1, b = b * b % m)
                if (e & 1) r = r * b % m;
            return r;
        }
        uint64_t inverso(uint64_t a) { return modPow(a, q - 2, q); } // q é primo

        uint64_t H(const char* m) { // SHA-256 da mensagem, reduzido mod q
            unsigned char d[32];
            SHA256((const unsigned char*)m, strlen(m), d);
            uint64_t h = 0;
            for (unsigned char b : d) h = (h * 256 + b) % q;
            return h;
        }

        const uint64_t g = modPow(3, (p - 1) / q, p), x = 75, y = modPow(g, x, p);

        void assinar(const char* m, uint64_t k, uint64_t& r, uint64_t& s) { // k: secreto e único!
            r = modPow(g, k, p) % q;
            s = inverso(k) * ((H(m) + x * r) % q) % q;
        }

        bool verificar(const char* m, uint64_t r, uint64_t s) {
            uint64_t w = inverso(s), u1 = H(m) * w % q, u2 = r * w % q;
            return modPow(g, u1, p) * modPow(y, u2, p) % p % q == r;
        }

        int main() {
            uint64_t r, s;
            assinar("transferir R$ 100", 50, r, s);
            printf("%llu %llu\n", (unsigned long long)r, (unsigned long long)s);         // 94 5
            printf("%s\n", verificar("transferir R$ 100", r, s) ? "válida" : "inválida"); // válida
            printf("%s\n", verificar("transferir R$ 900", r, s) ? "válida" : "inválida"); // inválida
        }
      `,
    },
  },
  {
    id: 'ntru',
    name: 'NTRUEncrypt',
    difficulty: 'Avançado',
    en: { name: 'NTRUEncrypt', summary: 'Lattice-based public-key encryption using small polynomials — fast, and believed to resist quantum computers.' },
    facts: { 'Criado por': 'Jeffrey Hoffstein, Jill Pipher e Joseph Silverman', 'Ano': '1996 (publicado em 1998)', 'Tipo': 'Criptografia de chave pública baseada em reticulados', 'Base de segurança': 'Vetor mais curto em reticulados (SVP)', 'Resistência quântica': 'Sim (pós-quântico)', 'Situação': 'Seguro; inspirou padrões pós-quânticos' },
    summary: 'Criptografia de chave pública baseada em reticulados, com polinômios pequenos — rápida e considerada resistente a computadores quânticos.',
    description:
      'O NTRU trabalha com polinômios de grau menor que N cujos coeficientes são inteiros, multiplicados "em círculo" (como se xᴺ = 1). A chave privada é um polinômio pequeno f, com coeficientes −1, 0 e 1, que tem inverso módulo um número pequeno p e módulo um número grande q. A chave pública é h = p · f_q · g mod q, onde g é outro polinômio pequeno — h parece aleatório. Para cifrar uma mensagem m (também com coeficientes pequenos), escolhe-se um polinômio aleatório pequeno r e calcula-se e = r·h + m mod q. Para decifrar, multiplica-se por f: f·e = p·r·g + f·m, e como todos esses termos são pequenos, nenhum coeficiente "dá a volta" em q. Reduzindo módulo p, o termo p·r·g desaparece; multiplicando pelo inverso de f módulo p, sobra m. Quebrar o NTRU equivale a achar vetores curtos em um reticulado de alta dimensão, um problema para o qual não se conhece algoritmo quântico eficiente.',
    complexity: { best: 'O(N log N) com multiplicação rápida', average: 'O(N²) com multiplicação direta', worst: 'O(N²)', space: 'O(N)' },
    steps: [
      'Escolha N (primo), p pequeno (3) e q grande (potência de 2), com mdc(p, q) = 1.',
      'Escolha f e g pequenos; calcule f_p = f⁻¹ mod p e f_q = f⁻¹ mod q (se não existirem, escolha outro f).',
      'Chave pública: h = p · f_q · g mod q. Chave privada: f e f_p.',
      'Cifrar: com r pequeno e aleatório, e = r·h + m mod q.',
      'Decifrar: a = f·e mod q (coeficientes entre −q/2 e q/2); b = a mod p; m = f_p·b mod p (coeficientes entre −1 e 1).',
    ],
    usedIn: ['Padrões pós-quânticos (NTRU foi finalista do concurso do NIST)', 'OpenSSH (sntrup761x25519, padrão desde a versão 9.0)', 'Chrome e Cloudflare (testes pós-quânticos)', 'Padrões IEEE 1363.1 e X9.98', 'Base de esquemas de assinatura como o Falcon'],
    realWorld: [
      { title: 'SSH pós-quântico', text: 'Desde 2022, o OpenSSH usa por padrão uma troca de chaves híbrida que combina o NTRU Prime (sntrup761) com o X25519: mesmo que alguém grave a sessão hoje e tenha um computador quântico no futuro, a chave continua protegida.' },
      { title: 'Concurso do NIST', text: 'O NTRU chegou à rodada final do concurso de criptografia pós-quântica do NIST. O vencedor para cifragem, o ML-KEM (Kyber), é de outra família de reticulados, mas a assinatura Falcon usa reticulados NTRU.' },
      { title: '"Colha agora, decifre depois"', text: 'Agências podem estar guardando tráfego cifrado hoje para decifrá-lo quando houver computadores quânticos grandes. Por isso a migração para algoritmos como NTRU e ML-KEM já começou, antes de a ameaça existir.' },
    ],
    curiosities: [
      'O nome NTRU é atribuído a "Number Theorists R Us" (ou "Number Theory Research Unit") — uma brincadeira dos três matemáticos da Universidade Brown que o criaram.',
      'Com parâmetros pequenos demais, como os do exemplo, a decifragem pode falhar de vez em quando: algum coeficiente de f·e passa de q/2. Os parâmetros reais são escolhidos para que essa chance seja desprezível.',
      'O NTRU foi patenteado até 2017, o que atrasou sua adoção; depois que a patente foi liberada, ele passou a ser usado em produtos e padrões.',
    ],
    code: {
      python: String.raw`
        # Exemplo clássico (N = 11, p = 3, q = 32). Os inversos f_p e f_q foram calculados com o
        # algoritmo de Euclides para polinômios; aqui eles são dados e conferidos.
        N, p, q = 11, 3, 32
        f  = [-1, 1, 1, 0, -1, 0, 1, 0, 0, 1, -1]     # coeficientes de x^0 a x^10
        g  = [-1, 0, 1, 1, 0, 1, 0, 0, -1, 0, -1]
        fp = [1, 2, 0, 2, 2, 1, 0, 2, 1, 2, 0]
        fq = [5, 9, 6, 16, 4, 15, 16, 22, 20, 18, 30]

        def mult(a, b):  # multiplicação "em círculo": x^N = 1
            c = [0] * N
            for i in range(N):
                for j in range(N):
                    c[(i + j) % N] += a[i] * b[j]
            return c

        def centrar(a, m):  # reduz mod m para o intervalo (−m/2, m/2]
            return [((v % m) - m if v % m > m // 2 else v % m) for v in a]

        h = [p * v % q for v in mult(fq, g)]            # chave pública
        m = [-1, 0, 0, 1, -1, 0, 0, 0, -1, 1, 1]        # mensagem
        r = [-1, 0, 1, 1, 1, -1, 0, -1, 0, 0, 0]        # aleatório, novo a cada mensagem
        e = [(v + mi) % q for v, mi in zip(mult(r, h), m)]
        print(" ".join(map(str, e)))                     # 14 11 26 24 14 16 30 7 25 6 19

        a = centrar(mult(f, e), q)                       # decifrar
        b = centrar(a, p)
        recuperada = centrar(mult(fp, b), p)
        print(" ".join(map(str, recuperada)))            # -1 0 0 1 -1 0 0 0 -1 1 1
        print("ok" if recuperada == m else "falha")      # ok
      `,
      javascript: String.raw`
        // Exemplo clássico (N = 11, p = 3, q = 32). Os inversos f_p e f_q foram calculados com o
        // algoritmo de Euclides para polinômios; aqui eles são dados.
        const N = 11, p = 3, q = 32;
        const f = [-1, 1, 1, 0, -1, 0, 1, 0, 0, 1, -1]; // coeficientes de x^0 a x^10
        const g = [-1, 0, 1, 1, 0, 1, 0, 0, -1, 0, -1];
        const fp = [1, 2, 0, 2, 2, 1, 0, 2, 1, 2, 0];
        const fq = [5, 9, 6, 16, 4, 15, 16, 22, 20, 18, 30];

        function mult(a, b) { // multiplicação "em círculo": x^N = 1
          const c = Array(N).fill(0);
          for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) c[(i + j) % N] += a[i] * b[j];
          return c;
        }
        const modulo = (v, m) => ((v % m) + m) % m;
        const centrar = (a, m) => a.map(v => (modulo(v, m) > m / 2 ? modulo(v, m) - m : modulo(v, m)));

        const h = mult(fq, g).map(v => modulo(p * v, q));            // chave pública
        const m = [-1, 0, 0, 1, -1, 0, 0, 0, -1, 1, 1];               // mensagem
        const r = [-1, 0, 1, 1, 1, -1, 0, -1, 0, 0, 0];               // aleatório, novo a cada mensagem
        const e = mult(r, h).map((v, i) => modulo(v + m[i], q));
        console.log(e.join(" "));                                      // 14 11 26 24 14 16 30 7 25 6 19

        const a = centrar(mult(f, e), q);                              // decifrar
        const b = centrar(a, p);
        const recuperada = centrar(mult(fp, b), p);
        console.log(recuperada.join(" "));                             // -1 0 0 1 -1 0 0 0 -1 1 1
        console.log(recuperada.every((v, i) => v === m[i]) ? "ok" : "falha"); // ok
      `,
      java: String.raw`
        import java.util.Arrays;
        import java.util.stream.Collectors;

        public class NTRU {
            static final int N = 11, P = 3, Q = 32;

            static int[] mult(int[] a, int[] b) { // multiplicação "em círculo": x^N = 1
                int[] c = new int[N];
                for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) c[(i + j) % N] += a[i] * b[j];
                return c;
            }

            static int[] centrar(int[] a, int m) { // reduz mod m para (−m/2, m/2]
                return Arrays.stream(a).map(v -> Math.floorMod(v, m) > m / 2 ? Math.floorMod(v, m) - m : Math.floorMod(v, m)).toArray();
            }

            static String texto(int[] a) { return Arrays.stream(a).mapToObj(String::valueOf).collect(Collectors.joining(" ")); }

            public static void main(String[] args) {
                // Exemplo clássico. Os inversos f_p e f_q vêm do algoritmo de Euclides para polinômios.
                int[] f = {-1, 1, 1, 0, -1, 0, 1, 0, 0, 1, -1}, g = {-1, 0, 1, 1, 0, 1, 0, 0, -1, 0, -1};
                int[] fp = {1, 2, 0, 2, 2, 1, 0, 2, 1, 2, 0}, fq = {5, 9, 6, 16, 4, 15, 16, 22, 20, 18, 30};
                int[] h = Arrays.stream(mult(fq, g)).map(v -> Math.floorMod(P * v, Q)).toArray(); // chave pública

                int[] m = {-1, 0, 0, 1, -1, 0, 0, 0, -1, 1, 1}, r = {-1, 0, 1, 1, 1, -1, 0, -1, 0, 0, 0};
                int[] rh = mult(r, h), e = new int[N];
                for (int i = 0; i < N; i++) e[i] = Math.floorMod(rh[i] + m[i], Q);
                System.out.println(texto(e));                          // 14 11 26 24 14 16 30 7 25 6 19

                int[] recuperada = centrar(mult(fp, centrar(centrar(mult(f, e), Q), P)), P); // decifrar
                System.out.println(texto(recuperada));                 // -1 0 0 1 -1 0 0 0 -1 1 1
                System.out.println(Arrays.equals(recuperada, m) ? "ok" : "falha"); // ok
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <vector>
        using namespace std;

        const int N = 11, P = 3, Q = 32;
        using Poli = vector<int>;

        Poli mult(const Poli& a, const Poli& b) { // multiplicação "em círculo": x^N = 1
            Poli c(N, 0);
            for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) c[(i + j) % N] += a[i] * b[j];
            return c;
        }
        int modulo(int v, int m) { return (v % m + m) % m; }
        Poli centrar(Poli a, int m) { // reduz mod m para (−m/2, m/2]
            for (int& v : a) { v = modulo(v, m); if (v > m / 2) v -= m; }
            return a;
        }
        void imprimir(const Poli& a) { for (int i = 0; i < N; i++) printf(i ? " %d" : "%d", a[i]); printf("\n"); }

        int main() {
            // Exemplo clássico. Os inversos f_p e f_q vêm do algoritmo de Euclides para polinômios.
            Poli f = {-1, 1, 1, 0, -1, 0, 1, 0, 0, 1, -1}, g = {-1, 0, 1, 1, 0, 1, 0, 0, -1, 0, -1};
            Poli fp = {1, 2, 0, 2, 2, 1, 0, 2, 1, 2, 0}, fq = {5, 9, 6, 16, 4, 15, 16, 22, 20, 18, 30};
            Poli h = mult(fq, g);
            for (int& v : h) v = modulo(P * v, Q);                    // chave pública

            Poli m = {-1, 0, 0, 1, -1, 0, 0, 0, -1, 1, 1}, r = {-1, 0, 1, 1, 1, -1, 0, -1, 0, 0, 0};
            Poli e = mult(r, h);
            for (int i = 0; i < N; i++) e[i] = modulo(e[i] + m[i], Q);
            imprimir(e);                                               // 14 11 26 24 14 16 30 7 25 6 19

            Poli recuperada = centrar(mult(fp, centrar(centrar(mult(f, e), Q), P)), P); // decifrar
            imprimir(recuperada);                                      // -1 0 0 1 -1 0 0 0 -1 1 1
            printf("%s\n", recuperada == m ? "ok" : "falha");          // ok
        }
      `,
    },
  },
  {
    id: 'elliptic-curve',
    name: 'Criptografia de Curvas Elípticas (ECDH)',
    difficulty: 'Avançado',
    en: { name: 'Elliptic Curve Cryptography (ECDH)', summary: 'Diffie-Hellman on the points of an elliptic curve: the same security as RSA with keys about ten times smaller.' },
    facts: { 'Criado por': 'Neal Koblitz e Victor Miller (independentemente)', 'Ano': '1985', 'Tipo': 'Acordo de chaves e assinatura (ECDH, ECDSA, EdDSA)', 'Base de segurança': 'Logaritmo discreto em curvas elípticas', 'Tamanho da chave': '256 bits ≈ RSA de 3072 bits', 'Situação': 'Seguro; vulnerável a computadores quânticos' },
    summary: 'Diffie-Hellman sobre os pontos de uma curva elíptica: a mesma segurança do RSA com chaves cerca de dez vezes menores.',
    description:
      'Uma curva elíptica é o conjunto dos pontos (x, y) que satisfazem y² = x³ + ax + b — em criptografia, com x e y inteiros módulo um primo p, o que transforma a curva em uma nuvem de pontos. Existe uma forma de "somar" dois pontos: traça-se a reta que passa por eles, encontra-se o terceiro ponto em que ela corta a curva e reflete-se esse ponto no eixo x. Somar um ponto G a ele mesmo k vezes dá k·G, que pode ser calculado rapidamente pelo método "dobra e soma" (como a exponenciação rápida). O caminho inverso — descobrir k sabendo G e k·G — é o logaritmo discreto em curvas elípticas, e não se conhece atalho para ele. No ECDH, Alice publica a·G, Bob publica b·G, e os dois calculam o segredo comum a·(b·G) = b·(a·G). Como os melhores ataques são mais lentos que contra o RSA, chaves de 256 bits bastam.',
    complexity: { best: 'O(k) operações de ponto (k bits)', average: 'O(k) — cada uma O(k²)', worst: 'O(k³)', space: 'O(k)' },
    steps: [
      'Fixe uma curva y² = x³ + ax + b sobre os inteiros módulo p e um ponto base G de ordem n grande (curvas padronizadas, como a P-256 e a Curve25519).',
      'Soma de pontos: λ = (y₂ − y₁)/(x₂ − x₁) (ou (3x₁² + a)/(2y₁) para dobrar); x₃ = λ² − x₁ − x₂; y₃ = λ(x₁ − x₃) − y₁, tudo módulo p.',
      'Multiplicação k·G por dobra e soma: percorra os bits de k, dobrando o ponto a cada bit e somando G quando o bit é 1.',
      'ECDH: Alice escolhe a e publica A = a·G; Bob escolhe b e publica B = b·G.',
      'Alice calcula a·B e Bob calcula b·A: o mesmo ponto (ab)·G, cujo x vira a chave compartilhada.',
    ],
    usedIn: ['TLS 1.3 (X25519 e P-256 na maioria das conexões)', 'Bitcoin e Ethereum (ECDSA na curva secp256k1)', 'Signal, WhatsApp e iMessage', 'SSH (chaves Ed25519)', 'Passaportes eletrônicos, cartões e chaves de segurança (FIDO2)'],
    realWorld: [
      { title: 'Bitcoin', text: 'A chave privada de uma carteira de Bitcoin é um número k de 256 bits; a chave pública é k·G na curva secp256k1. Gastar moedas exige uma assinatura ECDSA feita com k.' },
      { title: 'X25519 em todo lugar', text: 'A curva Curve25519, criada por Daniel J. Bernstein em 2005, foi projetada para ser rápida e difícil de implementar errado. Hoje ela faz a troca de chaves da maioria das conexões HTTPS, do Signal, do WireGuard e do SSH.' },
      { title: 'Chaves de segurança', text: 'Chaves FIDO2 (YubiKey, passkeys do celular) geram um par de chaves de curva elíptica por site e assinam um desafio a cada login. A chave privada nunca sai do dispositivo.' },
    ],
    curiosities: [
      'Neal Koblitz e Victor Miller propuseram curvas elípticas para criptografia em 1985, independentemente — e a ideia levou cerca de 20 anos para ser amplamente adotada.',
      'Em 2013, documentos vazados por Edward Snowden indicaram que a NSA havia inserido uma porta dos fundos no gerador de números Dual_EC_DRBG, baseado em curvas elípticas. O padrão foi retirado em 2014.',
      'A curva do visualizador tem só 99 pontos; a secp256k1 do Bitcoin tem cerca de 2²⁵⁶ — mais do que o número estimado de átomos do universo observável.',
    ],
    code: {
      python: String.raw`
        # Curva didática y² = x³ + 2x + 3 (mod 97); G = (0, 10) gera 50 pontos.
        # Em produção: X25519 ou P-256 de uma biblioteca (ex.: o pacote cryptography).
        P, A = 97, 2
        G = (0, 10)

        def soma(p1, p2):  # None representa o ponto no infinito (o "zero" da curva)
            if p1 is None: return p2
            if p2 is None: return p1
            (x1, y1), (x2, y2) = p1, p2
            if x1 == x2 and (y1 + y2) % P == 0:
                return None
            if p1 == p2:
                l = (3 * x1 * x1 + A) * pow(2 * y1, -1, P) % P   # tangente (dobrar)
            else:
                l = (y2 - y1) * pow(x2 - x1, -1, P) % P          # reta pelos dois pontos
            x3 = (l * l - x1 - x2) % P
            return (x3, (l * (x1 - x3) - y1) % P)

        def multiplicar(k, ponto):  # dobra e soma
            R = None
            for bit in bin(k)[2:]:
                R = soma(R, R)
                if bit == "1":
                    R = soma(R, ponto)
            return R

        a, b = 7, 23                           # segredos de Alice e de Bob
        Apub, Bpub = multiplicar(a, G), multiplicar(b, G)
        print(Apub, Bpub)                         # (10, 76) (49, 34)
        print(multiplicar(a, Bpub), multiplicar(b, Apub))   # o mesmo ponto: (17, 87) (17, 87)
      `,
      javascript: String.raw`
        // Curva didática y² = x³ + 2x + 3 (mod 97); G = (0, 10) gera 50 pontos.
        // Em produção: crypto.diffieHellman com chaves X25519 (crypto.generateKeyPairSync("x25519")).
        const P = 97, A = 2, G = [0, 10];
        const mod = v => ((v % P) + P) % P;
        const inverso = v => { let r = 1, b = mod(v); for (let e = P - 2; e; e >>= 1, b = (b * b) % P) if (e & 1) r = (r * b) % P; return r; };

        function soma(p1, p2) { // null representa o ponto no infinito (o "zero" da curva)
          if (!p1) return p2;
          if (!p2) return p1;
          const [x1, y1] = p1, [x2, y2] = p2;
          if (x1 === x2 && mod(y1 + y2) === 0) return null;
          const l = x1 === x2 && y1 === y2
            ? mod((3 * x1 * x1 + A) * inverso(2 * y1))    // tangente (dobrar)
            : mod((y2 - y1) * inverso(x2 - x1));          // reta pelos dois pontos
          const x3 = mod(l * l - x1 - x2);
          return [x3, mod(l * (x1 - x3) - y1)];
        }

        function multiplicar(k, ponto) { // dobra e soma
          let R = null;
          for (const bit of k.toString(2)) {
            R = soma(R, R);
            if (bit === "1") R = soma(R, ponto);
          }
          return R;
        }

        const a = 7, b = 23; // segredos de Alice e de Bob
        const Apub = multiplicar(a, G), Bpub = multiplicar(b, G);
        const txt = p => "(" + p.join(", ") + ")";
        console.log(txt(Apub) + " " + txt(Bpub)); // (10, 76) (49, 34)
        console.log(txt(multiplicar(a, Bpub)) + " " + txt(multiplicar(b, Apub))); // o mesmo ponto: (17, 87) (17, 87)
      `,
      java: String.raw`
        public class CurvaEliptica {
            // Curva didática y² = x³ + 2x + 3 (mod 97); G = (0, 10). Em produção: KeyAgreement "X25519" ou "ECDH".
            static final int P = 97, A = 2;

            static int mod(long v) { return (int) (((v % P) + P) % P); }
            static int inverso(int v) { // pequeno teorema de Fermat
                long r = 1, b = mod(v);
                for (int e = P - 2; e > 0; e >>= 1, b = b * b % P) if ((e & 1) == 1) r = r * b % P;
                return (int) r;
            }

            static int[] soma(int[] p1, int[] p2) { // null representa o ponto no infinito
                if (p1 == null) return p2;
                if (p2 == null) return p1;
                if (p1[0] == p2[0] && mod(p1[1] + p2[1]) == 0) return null;
                int l = p1[0] == p2[0] && p1[1] == p2[1]
                    ? mod((long) (3 * p1[0] * p1[0] + A) * inverso(2 * p1[1]))   // tangente (dobrar)
                    : mod((long) (p2[1] - p1[1]) * inverso(p2[0] - p1[0]));      // reta pelos dois pontos
                int x3 = mod((long) l * l - p1[0] - p2[0]);
                return new int[]{x3, mod((long) l * (p1[0] - x3) - p1[1])};
            }

            static int[] multiplicar(int k, int[] ponto) { // dobra e soma
                int[] R = null;
                for (char bit : Integer.toBinaryString(k).toCharArray()) {
                    R = soma(R, R);
                    if (bit == '1') R = soma(R, ponto);
                }
                return R;
            }

            static String txt(int[] p) { return "(" + p[0] + ", " + p[1] + ")"; }

            public static void main(String[] args) {
                int[] G = {0, 10};
                int a = 7, b = 23; // segredos de Alice e de Bob
                int[] Apub = multiplicar(a, G), Bpub = multiplicar(b, G);
                System.out.println(txt(Apub) + " " + txt(Bpub)); // (10, 76) (49, 34)
                System.out.println(txt(multiplicar(a, Bpub)) + " " + txt(multiplicar(b, Apub))); // o mesmo ponto: (17, 87) (17, 87)
            }
        }
      `,
      cpp: String.raw`
        #include <cstdio>
        #include <optional>
        #include <utility>
        using namespace std;

        // Curva didática y² = x³ + 2x + 3 (mod 97); G = (0, 10). Em produção: X25519 do OpenSSL ou libsodium.
        const long long P = 97, A = 2;
        using Ponto = optional<pair<long long, long long>>; // vazio = ponto no infinito

        long long mod(long long v) { return (v % P + P) % P; }
        long long inverso(long long v) { // pequeno teorema de Fermat
            long long r = 1, b = mod(v);
            for (long long e = P - 2; e; e >>= 1, b = b * b % P) if (e & 1) r = r * b % P;
            return r;
        }

        Ponto soma(Ponto p1, Ponto p2) {
            if (!p1) return p2;
            if (!p2) return p1;
            auto [x1, y1] = *p1;
            auto [x2, y2] = *p2;
            if (x1 == x2 && mod(y1 + y2) == 0) return nullopt;
            long long l = (x1 == x2 && y1 == y2)
                ? mod((3 * x1 * x1 + A) * inverso(2 * y1))  // tangente (dobrar)
                : mod((y2 - y1) * inverso(x2 - x1));        // reta pelos dois pontos
            long long x3 = mod(l * l - x1 - x2);
            return make_pair(x3, mod(l * (x1 - x3) - y1));
        }

        Ponto multiplicar(int k, Ponto ponto) { // dobra e soma
            Ponto R;
            for (int i = 31 - __builtin_clz(k); i >= 0; i--) {
                R = soma(R, R);
                if ((k >> i) & 1) R = soma(R, ponto);
            }
            return R;
        }

        int main() {
            Ponto G = make_pair(0LL, 10LL);
            int a = 7, b = 23; // segredos de Alice e de Bob
            Ponto Apub = multiplicar(a, G), Bpub = multiplicar(b, G);
            printf("(%lld, %lld) (%lld, %lld)\n", Apub->first, Apub->second, Bpub->first, Bpub->second); // (10, 76) (49, 34)
            Ponto s1 = multiplicar(a, Bpub), s2 = multiplicar(b, Apub);
            printf("(%lld, %lld) (%lld, %lld)\n", s1->first, s1->second, s2->first, s2->second); // o mesmo ponto: (17, 87) (17, 87)
        }
      `,
    },
  },
]
