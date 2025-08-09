// Arquivo: /functions/index.js
// Responsabilidade: Backend serverless para processar CVs.

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pdfParse = require("pdf-parse");

admin.initializeApp();

exports.analisarCV = functions
    .region('southamerica-east1')
    .storage
    .object()
    .onFinalize(async (object) => {
        const filePath = object.name;
        const contentType = object.contentType;
        const bucket = admin.storage().bucket(object.bucket);

        if (!filePath.startsWith("cvs-para-analise/")) {
            console.log(`Arquivo ${filePath} ignorado.`);
            return null;
        }

        console.log(`Processando arquivo: ${filePath}`);
        const fileBuffer = await bucket.file(filePath).download();

        let text = "";
        if (contentType === "application/pdf") {
            try {
                const data = await pdfParse(fileBuffer);
                text = data.text;
            } catch (error) {
                console.error("Erro ao extrair texto do PDF:", error);
                return null;
            }
        } else {
            console.log(`Tipo de arquivo ${contentType} não suportado.`);
            return null;
        }

        // --- LÓGICA DE ANÁLISE E SCORING ---

        // 1. Simulação da extração de dados com IA
        const candidateName = filePath.split('/').pop().split('_').slice(1).join(' ').replace(/\.pdf/i, '');
        const extractedSkills = ["Java", "Spring Boot", "SQL", "Docker", "Git", "AWS", "Kubernetes"];
        const extractedExperience = 5;

        const candidateData = {
            name: candidateName || "Candidato Anônimo",
            summary: text.substring(0, 400) + "...",
            skills: extractedSkills,
            experience: extractedExperience,
            cvUrl: object.mediaLink,
            status: "Analisado",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // 2. Salva o candidato e obtém a sua referência
        const candidateRef = await admin.firestore().collection("candidates").add(candidateData);
        console.log(`Novo candidato criado com ID: ${candidateRef.id}`);

        // 3. Busca todas as vagas ativas
        const jobsSnapshot = await admin.firestore().collection("jobs").where("status", "==", "Ativa").get();
        if (jobsSnapshot.empty) {
            console.log("Nenhuma vaga ativa encontrada para realizar o matching.");
            return null;
        }

        // 4. Calcula o score para cada vaga
        const batch = admin.firestore().batch();
        jobsSnapshot.forEach(jobDoc => {
            const job = jobDoc.data();
            let score = 0;
            let matchDetails = [];

            // Calcula score baseado nas habilidades
            if (job.requiredSkills && extractedSkills) {
                const matchedSkills = job.requiredSkills.filter(skill => extractedSkills.includes(skill));
                score += matchedSkills.length * 15; // 15 pontos por skill
                if(matchedSkills.length > 0) matchDetails.push(`${matchedSkills.length} skills compatíveis.`);
            }

            // Calcula score baseado na experiência
            if (job.minExperience && extractedExperience >= job.minExperience) {
                score += 30; // 30 pontos por ter a experiência mínima
                matchDetails.push(`Experiência de ${extractedExperience} anos atende ao requisito.`);
            }

            // Salva o resultado do match na subcoleção do candidato
            const matchRef = candidateRef.collection("matches").doc(jobDoc.id);
            batch.set(matchRef, {
                jobTitle: job.title,
                score: score,
                details: matchDetails,
                matchedOn: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        // 5. Commita todos os scores de uma vez
        await batch.commit();
        console.log(`Matching realizado para ${jobsSnapshot.size} vagas.`);

        // 6. Limpeza
        const newFilePath = `cvs-analisados/${filePath.split('/').pop()}`;
        await bucket.file(filePath).move(newFilePath);

        return null;
    });
