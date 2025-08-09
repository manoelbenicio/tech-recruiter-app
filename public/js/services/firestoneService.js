// Arquivo: /public/js/services/firestoreService.js
// Responsabilidade: Centralizar todas as interações com o Firestore.

const FirestoreService = {
    /**
     * Busca a lista de vagas do Firestore.
     * @returns {Promise<Array>} Uma promessa que resolve para um array de objetos de vagas.
     */
    getJobs: async () => {
        try {
            // Acessa a coleção 'jobs' no nosso banco de dados (db).
            const snapshot = await firebaseServices.db.collection('jobs').get();

            // Verifica se a coleção está vazia.
            if (snapshot.empty) {
                console.warn("Nenhuma vaga encontrada no Firestore. Adicione dados de teste no console do Firebase.");
                return [];
            }

            // Mapeia os documentos retornados para um array de objetos,
            // incluindo o ID único de cada documento.
            const jobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return jobs;

        } catch (error) {
            console.error("Erro ao buscar vagas:", error);
            // Retorna um array vazio em caso de erro para não quebrar a UI.
            return [];
        }
    },

    // No futuro, teremos mais funções aqui para interagir com o banco de dados:
    // getCandidates: async () => { ... },
    // addJob: async (jobData) => { ... },
    // updateCandidate: async (candidateId, data) => { ... },
};
