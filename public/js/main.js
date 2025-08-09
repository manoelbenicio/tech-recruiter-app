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
        console.log("Carregando componentes do dashboard...");

        await FirestoreService.seedInitialJobs();
        
        const jobs = await FirestoreService.getJobs();
        JobList.render(jobs);

        // Inicia o listener para candidatos.
        // A função de callback agora renderiza tanto a lista de candidatos
        // quanto o dashboard, para que as estatísticas sejam sempre atuais.
        FirestoreService.listenForCandidates((candidates) => {
            CandidateList.render(candidates);
            Dashboard.render(jobs, candidates); // Renderiza o dashboard com os dados mais recentes
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
