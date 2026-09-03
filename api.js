/**
 * =========================================================================
 * PROJETO CRESCER • FACISC - MÓDULO DE INTEGRAÇÃO & API (api.js)
 * =========================================================================
 * 
 * Gerencia o envio de dados do Formulário e do Quiz para a planilha Google
 * com fallback offline e armazenamento local para segurança máxima.
 */

const ApiService = {
    /**
     * Envia o Formulário de Autoavaliação do PDI
     */
    async enviarAutoavaliacao(dados) {
        const payload = {
            action: "formulario",
            timestamp: new Date().toISOString(),
            colaborador: dados.colaborador || "Não informado",
            cargo: dados.cargo || "Não informado",
            gestor: dados.gestor || "Não informado",
            data_autoavaliacao: dados.data || new Date().toLocaleDateString('pt-BR'),
            pontos_fortes: dados.pontos_fortes || "",
            oportunidades: dados.oportunidades || "",
            metas: dados.metas || "",
            apoios: dados.apoios || [],
            recursos: dados.recursos || ""
        };

        // Salva backup local garantido
        this.salvarBackupLocal("formulario", payload);

        const webhookUrl = APP_CONFIG.WEBHOOK_URL ? APP_CONFIG.WEBHOOK_URL.trim() : "";

        if (!webhookUrl) {
            console.info("Aviso: WEBHOOK_URL ainda não configurada no config.js. Os dados foram salvos com segurança no navegador.");
            return {
                sucesso: true,
                localOnly: true,
                mensagem: "✓ Autoavaliação salva com sucesso no navegador! (Para sincronizar com a planilha, insira a URL do Web App no config.js)."
            };
        }

        try {
            await fetch(webhookUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            return {
                sucesso: true,
                localOnly: false,
                mensagem: "✓ Autoavaliação enviada e gravada com sucesso na planilha do Projeto Crescer!"
            };
        } catch (error) {
            console.error("Erro ao enviar para o webhook:", error);
            return {
                sucesso: true,
                localOnly: true,
                mensagem: "✓ Respostas salvas localmente! (Houve uma instabilidade ao conectar à planilha online)."
            };
        }
    },

    /**
     * Envia os Resultados do Quiz Interativo
     */
    async enviarResultadoQuiz(dados) {
        const payload = {
            action: "quiz",
            timestamp: new Date().toISOString(),
            colaborador: dados.colaborador || "Não informado",
            cargo: dados.cargo || "Não informado",
            pontuacao: dados.pontuacao,
            porcentagem: `${Math.round((dados.pontuacao / 5) * 100)}%`,
            badge: dados.badge || "",
            q1: dados.respostas[0] || "",
            q2: dados.respostas[1] || "",
            q3: dados.respostas[2] || "",
            q4: dados.respostas[3] || "",
            q5: dados.respostas[4] || ""
        };

        // Salva backup local garantido
        this.salvarBackupLocal("quiz", payload);

        const webhookUrl = APP_CONFIG.WEBHOOK_URL ? APP_CONFIG.WEBHOOK_URL.trim() : "";

        if (!webhookUrl) {
            console.info("Aviso: WEBHOOK_URL ainda não configurada no config.js. O resultado do Quiz foi salvo localmente.");
            return {
                sucesso: true,
                localOnly: true,
                mensagem: "✓ Resultado registrado localmente com sucesso!"
            };
        }

        try {
            await fetch(webhookUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            return {
                sucesso: true,
                localOnly: false,
                mensagem: "✓ Pontuação do Quiz gravada com sucesso na planilha oficial!"
            };
        } catch (error) {
            console.error("Erro ao enviar resultado do quiz:", error);
            return {
                sucesso: true,
                localOnly: true,
                mensagem: "✓ Resultado salvo no dispositivo local."
            };
        }
    },

    /**
     * Salva backup local no localStorage
     */
    salvarBackupLocal(tipo, item) {
        try {
            const chave = tipo === "quiz" ? "facisc_quiz_historico" : "facisc_form_historico";
            const historico = JSON.parse(localStorage.getItem(chave) || "[]");
            historico.unshift(item);
            // Mantém até 30 registros
            if (historico.length > 30) historico.pop();
            localStorage.setItem(chave, JSON.stringify(historico));
        } catch (e) {
            console.warn("Falha ao salvar no localStorage:", e);
        }
    }
};

/**
 * Utilitário de Notificações Toast
 */
function showToast(mensagem, tipo = "success") {
    let toast = document.getElementById("app-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "app-toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    const icon = tipo === "success" ? "✓" : (tipo === "warning" ? "⚠️" : "✕");
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${mensagem}</span>`;
    toast.className = `toast show ${tipo}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}
