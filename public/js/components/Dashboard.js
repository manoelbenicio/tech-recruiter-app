// Arquivo: /public/js/components/Dashboard.js
// Responsabilidade: Renderizar os elementos visuais do dashboard principal.

const Dashboard = {
    // Armazena a instância do gráfico para que possamos destruí-la antes de redesenhar.
    chartInstance: null,

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

        // Limpa o conteúdo anterior de forma segura.
        container.innerHTML = '';

        // Tenta renderizar os componentes visuais.
        try {
            // 1. Renderiza os cartões de estatísticas
            const statsHTML = Dashboard.getStatCardsHTML(jobs, candidates);
            container.innerHTML = statsHTML; // Adiciona primeiro os cards

            // 2. Renderiza os gráficos
            const chartsHTML = Dashboard.getChartsHTML();
            container.insertAdjacentHTML('beforeend', chartsHTML); // Adiciona o container do gráfico

            // 3. Desenha o gráfico no canvas recém-criado
            Dashboard.drawSkillsChart(jobs);

        } catch (error) {
            console.error("Ocorreu um erro ao renderizar o dashboard:", error);
            container.innerHTML = '<div class="alert alert-danger">Não foi possível carregar o dashboard. Verifique o console para mais detalhes.</div>';
        }
    },

    /**
     * Retorna o HTML dos cartões de estatísticas.
     */
    getStatCardsHTML: (jobs, candidates) => {
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.status === 'Ativa').length;
        const totalCandidates = candidates.length;

        return `
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
    },

    /**
     * Retorna o HTML do container dos gráficos.
     */
    getChartsHTML: () => {
        return `
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
    },

    /**
     * Desenha o gráfico de habilidades no canvas.
     */
    drawSkillsChart: (jobs) => {
        const canvas = document.getElementById('skillsChart');
        if (!canvas) {
            console.error("Elemento canvas 'skillsChart' não foi encontrado para desenhar o gráfico.");
            return;
        }

        // Destrói o gráfico anterior se ele existir. Isso previne bugs de renderização.
        if (Dashboard.chartInstance) {
            Dashboard.chartInstance.destroy();
        }

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

        const ctx = canvas.getContext('2d');
        Dashboard.chartInstance = new Chart(ctx, {
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
                            stepSize: 1
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
};
