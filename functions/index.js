    // Arquivo: /functions/index.js
    // Responsabilidade: Backend serverless para processar CVs.

    const functions = require("firebase-functions");
    const admin = require("firebase-admin");
    const pdfParse = require("pdf-parse");

    // Inicializa o SDK do Admin para que a função tenha acesso aos serviços do Firebase.
    admin.initializeApp();

    /**
     * Função que é acionada (triggered) sempre que um novo arquivo é finalizado
     * no bucket do Firebase Storage.
     */
    exports.analisarCV = functions
        .region('southamerica-east1') // Especifica a região para rodar a função
        .storage
        .object()
        .onFinalize(async (object) => {
            const filePath = object.name; // ex: 'cvs-para-analise/166265478_joao_silva.pdf'
            const contentType = object.contentType; // ex: 'application/pdf'
            const bucket = admin.storage().bucket(object.bucket);

            // 1. Validar se o arquivo está na pasta correta para evitar loops infinitos.
            if (!filePath.startsWith("cvs-para-analise/")) {
                console.log(`Arquivo ${filePath} ignorado.`);
                return null;
            }

            // 2. Baixar o arquivo do Storage para a memória da função.
            console.log(`Processando arquivo: ${filePath}`);
            const fileBuffer = await bucket.file(filePath).download();

            // 3. Extrair o texto do arquivo.
            let text = "";
            if (contentType === "application/pdf") {
                try {
                    const data = await pdfParse(fileBuffer);
                    text = data.text;
                } catch (error) {
                    console.error("Erro ao extrair texto do PDF:", error);
                    return null; // Aborta a execução se não conseguir ler o PDF.
                }
            } else {
                console.log(`Tipo de arquivo ${contentType} não suportado para extração de texto.`);
                return null;
            }

            console.log("Texto extraído com sucesso. (Primeiros 500 caracteres):", text.substring(0, 500));

            // 4. SIMULAÇÃO DA ANÁLISE COM IA
            // Em um cenário real, aqui chamaríamos a API do Gemini.
            // Por agora, vamos extrair dados simples do texto.
            const candidateName = filePath.split('/').pop().split('_').slice(1).join(' ').replace(/\.pdf/i, '');
            const skills = ["Java", "Spring", "SQL", "Docker", "Git"]; // Simulação
            const experience = 5; // Simulação

            const candidateData = {
                name: candidateName || "Candidato Anônimo",
                email: "email.extraido@exemplo.com", // Simulação
                summary: text.substring(0, 400) + "...",
                skills: skills,
                experience: experience,
                cvUrl: object.mediaLink, // Link para download do CV
                status: "Analisado",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            // 5. Salvar o novo candidato no Firestore.
            try {
                const candidateRef = await admin.firestore().collection("candidates").add(candidateData);
                console.log(`Novo candidato criado com ID: ${candidateRef.id}`);
            } catch (error) {
                console.error("Erro ao salvar candidato no Firestore:", error);
                return null;
            }

            // 6. Mover o arquivo processado para outra pasta para evitar reprocessamento.
            const newFilePath = `cvs-analisados/${filePath.split('/').pop()}`;
            try {
                await bucket.file(filePath).move(newFilePath);
                console.log(`Arquivo movido para ${newFilePath}`);
            } catch (error) {
                console.error("Erro ao mover arquivo processado:", error);
            }

            return null;
        });
    