// Arquivo: /public/js/services/firebase.js
// Responsabilidade: Inicializar e configurar a conexão com o Firebase.

const firebaseServices = {
    app: null,
    auth: null,
    db: null,
    storage: null,
};

try {
    // --- SUA CONFIGURAÇÃO DO FIREBASE DEVE ESTAR AQUI ---
    const firebaseConfig = {
      apiKey: "AIzaSyCZ_Ppxy4cB95Tkcu4g7Sg50CvSH_sPppA",
      authDomain: "tech-recruiter-prod.firebaseapp.com",
      projectId: "tech-recruiter-prod",
      storageBucket: "tech-recruiter-prod.appspot.com",
      messagingSenderId: "367691886884",
      appId: "1:367691886884:web:f640720af233e950c743b1"
    };
    // -------------------------------------------------

    firebaseServices.app = firebase.initializeApp(firebaseConfig);
    firebaseServices.auth = firebase.auth();
    firebaseServices.db = firebase.firestore();
    firebaseServices.storage = firebase.storage();

    console.log("Firebase SDKs inicializados com sucesso!");

} catch (error) {
    console.error("Erro ao inicializar o Firebase:", error);
    alert("Não foi possível conectar ao backend. Verifique o console para mais detalhes.");
}
