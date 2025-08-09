// Arquivo: /public/js/components/CandidateList.js
// Responsabilidade: Renderizar a lista de candidatos na UI.

const CandidateList = {
    /**
     * Renderiza uma lista de candidatos em um container específico no HTML.
     * @param {Array} candidates - Um array de objetos de candidatos.
     */
    render: (candidates) => {
        const container = document.getElementById('candidatos-content');
        if (!container) {
            console.error("Elemento 'candidatos-content' não encontrado.");
            return;
        }

        container.innerHTML = ''; // Limpa o conteúdo anterior

        if (!candidates || candidates.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum candidato encontrado. Envie um currículo para análise.</p>';
            return;
        }

        candidates.forEach(candidate => {
            const cardHTML = CandidateList.createCandidateCard(candidate);
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    },

    /**
     * Cria a string HTML para um único card de candidato.
     * @param {Object} candidate - O objeto do candidato.
     * @returns {string} A string HTML do card.
     */
    createCandidateCard: (candidate) => {
        const statusColor = candidate.status === 'Analisado' ? 'success' : 'warning';
        const initials = (candidate.name || '??').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0 me-3">
                                <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; font-size: 1.5rem;">
                                    ${initials}
                                </div>
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="card-title mb-0">${candidate.name}</h5>
                                <small class="text-muted">${candidate.email || 'email@exemplo.com'}</small>
                            </div>
                            <span class="badge bg-${statusColor}">${candidate.status}</span>
                        </div>
                        <p class="card-text small">${candidate.summary || 'Resumo indisponível.'}</p>
                        <div class="mt-auto pt-2">
                            <p class="fw-bold mb-1 small">Habilidades Principais:</p>
                            <div>
                                ${candidate.skills ? candidate.skills.slice(0, 5).map(skill => `<span class="badge bg-secondary me-1 mb-1">${skill}</span>`).join('') : ''}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <a href="${candidate.cvUrl}" target="_blank" class="btn btn-sm btn-outline-primary">Ver CV Original</a>
                    </div>
                </div>
            </div>
        `;
    }
};
