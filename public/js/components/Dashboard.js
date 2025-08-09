// Arquivo: /public/js/components/Dashboard.js
// Responsabilidade: Renderizar os elementos visuais do dashboard principal.

const Dashboard = {
    /**
     * Renderiza todo o conteúdo do dashboard.
     * @param {Array} jobs - A lista de vagas.
     * @param {Array} candidates - A lista de candidatos.
     */
    render: (jobs, candidates) => {
        const container = document.getElementById('dashboard-content');
        if (!container) {
            console.error("Elemento 'dashboard-content' não encontrado.");
            return;
        }

        container.innerHTML = ''; // Limpa o conteúdo

        // 1. Renderiza os cartões de estatísticas
        Dashboard.renderStatCards(container, jobs, candidates);

        // 2. Renderiza os gráficos
        Dashboard.renderCharts(container, jobs, candidates);
    },

    /**
     * Cria e insere os cartões de estatísticas no container.
     */
    renderStatCards: (container, jobs, candidates) => {
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.status === 'Ativa').length;
        const totalCandidates = candidates.length;

        const statsHTML = `
            <div class="col-md-4 mb-4">
                <div class="stat-card">
                    <div class="stat-icon"><i class="bi bi-briefcase-fill"></i></div>
                    <div class="stat-number">${totalJobs}</div>
                    <div class="stat-label">Total de Vagas</div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="stat-card">
                    <div class="stat-icon"><i class="bi bi-broadcast"></i></div>
                    <div class="stat-number">${activeJobs}</div>
                    <div class="stat-label">Vagas Ativas</div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="stat-card">
                    <div class="stat-icon"><i class="bi bi-people-fill"></i></div>
                    <div class="stat-number">${totalCandidates}</div>
                    <div class="stat-label">Candidatos Analisados</div>
                </div>
            </div>
        `;
        container.innerHTML += statsHTML;
    },

    /**
     * Cria e insere os gráficos no container.
     */
    renderCharts: (container, jobs, candidates) => {
        const chartContainerHTML = `
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Habilidades mais Requisitadas
                    </div>
                    <div class="card-body">
                        <canvas id="skillsChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += chartContainerHTML;

        // Lógica para agregar e contar as habilidades
        const skillCounts = {};
        jobs.forEach(job => {
            if (job.requiredSkills) {
                job.requiredSkills.forEach(skill => {
                    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                });
            }
        });

        const sortedSkills = Object.entries(skillCounts).sort(([,a],[,b]) => b-a);
        const labels = sortedSkills.map(item => item[0]);
        const data = sortedSkills.map(item => item[1]);

        // Renderiza o gráfico usando Chart.js
        const ctx = document.getElementById('skillsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nº de Vagas que Requerem a Habilidade',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1 // Garante que o eixo Y seja de números inteiros
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
};
