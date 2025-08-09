// Arquivo: /public/js/main.js
// Responsabilidade: Orquestrar a inicialização e o estado geral da aplicação.

// O objeto 'App' conterá o estado e as funções principais da nossa aplicação.
const App = {
    user: null, // Armazenará informações do usuário logado

    // A função init é o ponto de partida.
    init: () => {
        console.log("Aplicação Tech Recruiter iniciando...");
        
        // Tenta fazer login anônimo para testar a conexão com o Auth do Firebase.
        // Isso nos dá uma sessão de usuário válida sem pedir login/senha ainda.
        firebaseServices.auth.signInAnonymously()
            .then((userCredential) => {
                // Sucesso! Temos um usuário anônimo.
                App.user = userCredential.user;
                console.log("Login anônimo bem-sucedido! UID:", App.user.uid);
                
                // Agora que estamos autenticados, podemos carregar os dados.
                App.loadDashboard();
            })
            .catch((error) => {
                // Se isso falhar, provavelmente há um problema com as regras de segurança
                // ou a configuração do Firebase Authentication.
                console.error("Erro no login anônimo:", error);
                alert("Falha ao autenticar com o serviço. Verifique o console.");
            });
    },

    // Função para carregar os componentes do dashboard.
    loadDashboard: () => {
        console.log("Carregando componentes do dashboard...");
        // Aqui, no futuro, chamaremos as funções para renderizar os gráficos e listas.
        // Ex: Dashboard.render();
        // Ex: CandidateList.render();
    }
};

// Adiciona um 'escutador de eventos' que espera o HTML da página ser completamente
// carregado antes de executar nosso código, para evitar erros.
document.addEventListener('DOMContentLoaded', App.init);
