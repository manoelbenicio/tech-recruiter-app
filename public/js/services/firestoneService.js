// Arquivo: /public/js/services/firestoreService.js
// Responsabilidade: Centralizar todas as interações com o Firestore.

const FirestoreService = {
    /**
     * Busca a lista de vagas do Firestore.
     * @returns {Promise<Array>} Uma promessa que resolve para um array de objetos de vagas.
     */
    getJobs: async () => {
        try {
            const snapshot = await firebaseServices.db.collection('jobs').get();

            if (snapshot.empty) {
                console.warn("Coleção 'jobs' está vazia.");
                return [];
            }

            const jobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return jobs;

        } catch (error) {
            console.error("Erro ao buscar vagas:", error);
            return [];
        }
    },

    /**
     * Adiciona dados de teste iniciais ao Firestore se a coleção estiver vazia.
     * Esta função previne a necessidade de adicionar dados manualmente no futuro.
     */
    seedInitialJobs: async () => {
        try {
            const jobsCollection = firebaseServices.db.collection('jobs');
            const snapshot = await jobsCollection.get();

            if (snapshot.empty) {
                console.log("Nenhuma vaga encontrada. Adicionando dados de teste iniciais...");

                // Usamos um batch para garantir que todas as operações sejam atômicas.
                const batch = firebaseServices.db.batch();

                const jobsData = [
                    { title: "Desenvolvedor Java Pleno", status: "Ativa", minExperience: 3, requiredSkills: ["Java", "Spring Boot", "SQL"] },
                    { title: "Engenheiro de DevOps Sênior", status: "Ativa", minExperience: 5, requiredSkills: ["AWS", "Kubernetes", "Terraform", "CI/CD"] },
                    { title: "Desenvolvedor Frontend React", status: "Pausada", minExperience: 2, requiredSkills: ["React", "TypeScript", "CSS-in-JS"] }
                ];

                jobsData.forEach(job => {
                    const newJobRef = jobsCollection.doc(); // Cria uma referência com ID automático
                    batch.set(newJobRef, job);
                });

                await batch.commit();
                console.log("Dados de teste adicionados com sucesso!");
            } else {
                console.log("A coleção 'jobs' já contém dados. Seeding não é necessário.");
            }
        } catch (error) {
            console.error("Erro ao adicionar dados de teste (seed):", error);
        }
    }
};
