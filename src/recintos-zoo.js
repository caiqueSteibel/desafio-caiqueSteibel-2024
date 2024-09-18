class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: ['MACACO', 'MACACO', 'MACACO'] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'savana', tamanhoTotal: 7, animaisExistentes: ['GAZELA'] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: ['LEAO'] }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {

        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const especieDados = this.animais[animal];

        const espacoNecessario = especieDados.tamanho * quantidade;

        const recintosViaveis = this.recintos.filter((recinto) => {
            const { bioma, tamanhoTotal, animaisExistentes } = recinto;

            if (!especieDados.bioma.includes(bioma)) {
                return false;
            }

            if (animal === 'MACACO') {
                const numeroMacacos = animaisExistentes.filter(a => a === 'MACACO').length;
                if ((numeroMacacos + quantidade) < 2) {
                    return false;
                }
            }

            if (animal === 'HIPOPOTAMO' && animaisExistentes.length > 0 ) {
                if (!(bioma.includes('savana') && bioma.includes('rio'))) {
                    return false;
                } 
            }

            if (especieDados.carnivoro) {
                if (animaisExistentes.includes(animal)) {
                    return true;
                }

                if (animaisExistentes.length > 0 && !animaisExistentes.includes(animal)) {
                    return false;
                }
            } else {

                const existeCarnivoroNoRecinto = animaisExistentes.some(a => this.animais[a].carnivoro);
                if (existeCarnivoroNoRecinto) {
                    return false;
                }
            }

            let espacoOcupado = animaisExistentes.reduce((total, a) => total + this.animais[a].tamanho, 0);

            const especiesDiferentes = new Set(animaisExistentes).size > 0;

            if (especiesDiferentes) {
                espacoOcupado += 1;
            }

            const espacoDisponivel = tamanhoTotal - espacoOcupado;

            return espacoDisponivel >= espacoNecessario;
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: recintosViaveis.map((recinto) => {
                let espacoOcupado = recinto.animaisExistentes.reduce((total, a) => total + this.animais[a].tamanho, 0);

                const especiesDiferentes = new Set([...recinto.animaisExistentes, animal]).size > 1;
                if (especiesDiferentes) {
                    espacoOcupado += 1;
                }

                const espacoLivre = recinto.tamanhoTotal - espacoOcupado - especieDados.tamanho * quantidade;
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
            })
        };
    }
}

export { RecintosZoo as RecintosZoo };