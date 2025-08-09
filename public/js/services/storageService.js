// Arquivo: /public/js/services/storageService.js
// Responsabilidade: Gerenciar uploads e downloads de arquivos para o Firebase Storage.

const StorageService = {
    /**
     * Faz o upload de um arquivo de CV para uma pasta específica no Firebase Storage.
     * @param {File} file - O arquivo de CV selecionado pelo usuário.
     * @returns {Promise<void>} Uma promessa que resolve quando o upload é concluído.
     */
    uploadCV: async (file) => {
        if (!file) {
            throw new Error("Nenhum arquivo fornecido para upload.");
        }

        // Define o caminho no Storage. Usamos um timestamp para garantir nomes de arquivo únicos.
        const filePath = `cvs-para-analise/${Date.now()}_${file.name}`;
        const fileRef = firebaseServices.storage.ref().child(filePath);

        try {
            console.log(`Iniciando upload para: ${filePath}`);
            // O método put faz o upload do arquivo.
            const snapshot = await fileRef.put(file);
            console.log("Upload concluído com sucesso!", snapshot);
        } catch (error) {
            console.error("Erro durante o upload do CV:", error);
            // Re-lança o erro para que a UI possa tratá-lo (ex: mostrar uma mensagem de falha).
            throw error;
        }
    },
};
