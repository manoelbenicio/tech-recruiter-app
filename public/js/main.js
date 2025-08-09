// Arquivo: /public/js/main.js
// Responsabilidade: Orquestrar a inicialização e o estado geral da aplicação.

const App = {
    user: null,

    init: () => {
        console.log("Aplicação Tech Recruiter iniciando...");
        
        firebaseServices.auth.signInAnonymously()
            .then((userCredential) => {
                App.user = userCredential.user;
                console.log("Login anônimo bem-sucedido! UID:", App.user.uid);
                App.loadDashboard();
                App.setupEventListeners();
            })
            .catch((error) => {
                console.error("Erro no login anônimo:", error);
                alert("Falha ao autenticar com o serviço. Verifique o console.");
            });
    },

    loadDashboard: async () => {
        console.log("Carregando dados iniciais...");

        await FirestoreService.seedInitialJobs();
        
        // Busca os dados iniciais de vagas e candidatos
        const jobs = await FirestoreService.getJobs();
        const initialCandidates = await FirestoreService.getCandidates();

        // Renderiza todos os componentes com os dados iniciais
        JobList.render(jobs);
        CandidateList.render(initialCandidates);
        Dashboard.render(jobs, initialCandidates);

        // Agora, configura o listener para atualizações em tempo real dos candidatos
        FirestoreService.listenForCandidates((updatedCandidates) => {
            console.log("Lista de candidatos atualizada em tempo real.");
            // Re-renderiza apenas os componentes que dependem dos candidatos
            CandidateList.render(updatedCandidates);
            Dashboard.render(jobs, updatedCandidates);
        });
    },

    setupEventListeners: () => {
        const cvUploadInput = document.getElementById('cvUpload');
        if (cvUploadInput) {
            cvUploadInput.addEventListener('change', App.handleCVUpload);
        }
    },

    handleCVUpload: async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        alert(`Enviando o currículo "${file.name}" para análise. O resultado aparecerá na aba 'Candidatos' em breve.`);

        try {
            await StorageService.uploadCV(file);
        } catch (error) {
            alert("Ocorreu um erro ao enviar o currículo. Verifique o console.");
        } finally {
            event.target.value = '';
        }
    }
};

document.addEventListener('DOMContentLoaded', App.init);
