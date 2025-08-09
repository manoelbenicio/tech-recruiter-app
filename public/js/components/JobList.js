// Arquivo: /public/js/components/JobList.js
// Responsabilidade: Renderizar a lista de vagas na interface do usuário.

const JobList = {
    /**
     * Renderiza uma lista de vagas em um container específico no HTML.
     * @param {Array} jobs - Um array de objetos de vagas vindos do Firestore.
     */
    render: (jobs) => {
        // Encontra o container no HTML onde os cards das vagas serão inseridos.
        const jobsContainer = document.getElementById('vagas-content');
        if (!jobsContainer) {
            console.error("Elemento com ID 'vagas-content' não foi encontrado no HTML.");
            return;
        }

        // Limpa o container antes de adicionar os novos cards.
        jobsContainer.innerHTML = '';

        // Se não houver vagas, exibe uma mensagem.
        if (!jobs || jobs.length === 0) {
            jobsContainer.innerHTML = '<p class="text-muted">Nenhuma vaga encontrada no momento.</p>';
            return;
        }

        // Itera sobre cada vaga e cria um card HTML para ela.
        jobs.forEach(job => {
            const card = JobList.createJobCard(job);
            // Adiciona o card ao container. O 'beforeend' garante que cada card
            // seja adicionado ao final da lista.
            jobsContainer.insertAdjacentHTML('beforeend', card);
        });
    },

    /**
     * Cria a string HTML para um único card de vaga.
     * @param {Object} job - O objeto da vaga com seus dados.
     * @returns {string} A string HTML do card.
     */
    createJobCard: (job) => {
        // Define a cor do badge com base no status da vaga.
        const statusColor = job.status === 'Ativa' ? 'success' : 'secondary';

        // Usa template literals para criar o HTML de forma limpa.
        // NOTA: Estamos usando innerHTML aqui. Como os dados vêm de nosso próprio
        // Firestore confiável, o risco é baixo. Em uma aplicação com dados de
        // usuários, usaríamos métodos mais seguros para prevenir XSS.
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card job-card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title">${job.title || 'Vaga sem título'}</h5>
                            <span class="badge bg-${statusColor}">${job.status || 'Sem status'}</span>
                        </div>
                        <p class="card-subtitle mb-2 text-muted">Experiência Mínima: ${job.minExperience || 'N/A'} anos</p>
                        
                        <div class="mt-auto pt-3">
                            <p class="fw-bold mb-1">Requisitos:</p>
                            <div>
                                ${job.requiredSkills ? job.requiredSkills.map(skill => `<span class="badge bg-primary me-1 mb-1">${skill}</span>`).join('') : '<span class="text-muted small">Nenhum requisito listado.</span>'}
                            </div>
                            <a href="#" class="btn btn-outline-primary mt-3">Ver detalhes</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
