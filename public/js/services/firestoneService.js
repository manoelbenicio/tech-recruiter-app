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
     */
    seedInitialJobs: async () => {
        try {
            const jobsCollection = firebaseServices.db.collection('jobs');
            const snapshot = await jobsCollection.get();

            if (snapshot.empty) {
                console.log("Nenhuma vaga encontrada. Adicionando dados de teste iniciais...");
                const batch = firebaseServices.db.batch();
                const jobsData = [
                    { title: "Desenvolvedor Java Pleno", status: "Ativa", minExperience: 3, requiredSkills: ["Java", "Spring Boot", "SQL"] },
                    { title: "Engenheiro de DevOps Sênior", status: "Ativa", minExperience: 5, requiredSkills: ["AWS", "Kubernetes", "Terraform", "CI/CD"] },
                    { title: "Desenvolvedor Frontend React", status: "Pausada", minExperience: 2, requiredSkills: ["React", "TypeScript", "CSS-in-JS"] }
                ];
                jobsData.forEach(job => {
                    const newJobRef = jobsCollection.doc();
                    batch.set(newJobRef, job);
                });
                await batch.commit();
                console.log("Dados de teste de vagas adicionados com sucesso!");
            }
        } catch (error)
            console.error("Erro ao adicionar dados de teste de vagas (seed):", error);
        }
    },

    /**
     * Busca a lista inicial de candidatos.
     * @returns {Promise<Array>} Uma promessa que resolve para um array de objetos de candidatos.
     */
    getCandidates: async () => {
        try {
            const snapshot = await firebaseServices.db.collection('candidates').get();
            if (snapshot.empty) {
                return [];
            }
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Erro ao buscar candidatos:", error);
            return [];
        }
    },

    /**
     * Escuta por atualizações na coleção de candidatos em tempo real.
     * @param {function} callback - A função a ser chamada sempre que os dados dos candidatos mudarem.
     * @returns {function} Uma função para cancelar a escuta (unsubscribe).
     */
    listenForCandidates: (callback) => {
        const candidatesCollection = firebaseServices.db.collection('candidates');
        
        const unsubscribe = candidatesCollection.onSnapshot(snapshot => {
            const candidates = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(candidates);
        }, error => {
            console.error("Erro ao escutar por candidatos:", error);
            callback([]);
        });

        return unsubscribe;
    }
};
