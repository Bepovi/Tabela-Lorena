// JavaScript para adicionar interatividade
let apoiadores = [];
let historicoAcoes = [];
let ultimosBits = [];
let ultimosPix = [];
let ultimosSubs = [];


function atualizarUltimasDoacoes() {
    // Atualiza a exibição dos últimos doadores de bits
    document.getElementById("ultimos-bits").textContent = ultimosBits.map(e => {
        let descricao = e.valorAdicionado >= 0 ? `Doação de ${e.valorAdicionado} 💎` : `Remoção de ${-e.valorAdicionado} 💎`;
        return `${e.nome} (${descricao} às ${e.horario}hrs)`;
    }).join(', ');

    // Atualiza a exibição dos últimos doadores de pix
    document.getElementById("ultimos-pix").textContent = ultimosPix.map(e => {
        let descricao = e.valorAdicionado >= 0 ? `Doação de ${e.valorAdicionado} reais de 💲` : `Remoção de ${-e.valorAdicionado} reais de 💲`;
        return `${e.nome} (${descricao} às ${e.horario}hrs)`;
    }).join(', ');

    // Atualiza a exibição dos últimos doadores de subs
    document.getElementById("ultimos-subs").textContent = ultimosSubs.map(e => {
        let descricao = e.valorAdicionado >= 0 ? `Doação de ${e.valorAdicionado} ⭐` : `Remoção de ${-e.valorAdicionado} ⭐`;
        return `${e.nome} (${descricao} às ${e.horario}hrs)`;
    }).join(', ');
}


function atualizarTotais() {
    let totalBits = 0;
    let totalPix = 0;
    let totalSubs = 0;

    apoiadores.forEach(apoiador => {
        totalBits += apoiador.bits;
        totalPix += apoiador.pix;
        totalSubs += apoiador.subs;
    });

    document.getElementById("total-bits").textContent = totalBits;
    document.getElementById("total-pix").textContent = totalPix.toFixed(2); // Formatando para duas casas decimais, se necessário
    document.getElementById("total-subs").textContent = totalSubs;
}





function adicionarApoiador() {
    let nome = prompt("Digite o nome do apoiador:");
    let apoiadorExistente = apoiadores.find(apoiador => apoiador.nome === nome);
    if (nome && !apoiadorExistente) {
        let novoApoiador = { nome, pontos: 0, bits: 0, pix: 0, subs: 0 };
        apoiadores.push(novoApoiador);
		atualizarUltimasDoacoes();
        atualizarListaApoiadores();
        adicionarAcao('adicionar', { nome: nome });
		
		atualizarTotais(); // Atualiza os totais após uma doação ser adicionada
    } else if (apoiadorExistente) {
        alert("Este apoiador já existe na lista!");
    }
}
function atualizarRankingInterface() {
    let rankingBody = document.getElementById("ranking-body");
    rankingBody.innerHTML = "";
    if (apoiadores.length > 0) {
        document.getElementById("vazio").style.display = "none";
        apoiadores.forEach((apoiador, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${index + 1}</td>
                            <td contenteditable="true" onBlur="editarApoiador(this, 'nome', '${apoiador.nome}')">${apoiador.nome}</td>
                            <td contenteditable="true" onBlur="editarApoiador(this, 'pontos', '${apoiador.nome}')">${apoiador.pontos.toFixed(2)}</td>
                            <td contenteditable="true" onBlur="editarApoiador(this, 'bits', '${apoiador.nome}')">${apoiador.bits}</td>
                            <td contenteditable="true" onBlur="editarApoiador(this, 'pix', '${apoiador.nome}')">${apoiador.pix}</td>
                            <td contenteditable="true" onBlur="editarApoiador(this, 'subs', '${apoiador.nome}')">${apoiador.subs}</td>
                            <td>
                                <button onclick="mostrarInfo('${apoiador.nome}')">Info</button>
                                <button onclick="zerarApoiador('${apoiador.nome}')">Zerar</button>
                                <button onclick="deletarApoiador('${apoiador.nome}')">Deletar</button>
                            </td>`;
            rankingBody.appendChild(tr);
        });
    } else {
        document.getElementById("vazio").style.display = "block";
    }
}

function mostrarInfo(nome) {
    let apoiador = apoiadores.find(ap => ap.nome === nome);
    if (!apoiador) {
        alert("Apoiador não encontrado!");
        return;
    }

    let mensagem = `Informações de doações para ${nome}:\n`;
    let temDados = false; // Flag para verificar se existem dados

    // Adiciona informações de Bits, caso existam
    if (apoiador.historicoBits && apoiador.historicoBits.length > 0) {
        mensagem += "Bits:\n" + apoiador.historicoBits.slice(0, 20).map(d => {
            let descricao = d.valorAdicionado >= 0 ? `Doação de ${d.valorAdicionado} bits` : `Remoção de ${-d.valorAdicionado} bits`;
            return `${descricao} às ${d.horario} do dia ${new Date(d.dataHora).toLocaleDateString()}`;
        }).join("\n") + "\n";
        temDados = true;
    }

    // Adiciona informações de PIX, caso existam
    if (apoiador.historicoPix && apoiador.historicoPix.length > 0) {
        mensagem += "PIX:\n" + apoiador.historicoPix.slice(0, 20).map(d => {
            let descricao = d.valorAdicionado >= 0 ? `Doação de ${d.valorAdicionado} reais no PIX` : `Remoção de ${-d.valorAdicionado} reais de PIX`;
            return `${descricao} às ${d.horario} do dia ${new Date(d.dataHora).toLocaleDateString()}`;
        }).join("\n") + "\n";
        temDados = true;
    }

    // Adiciona informações de Subs, caso existam
    if (apoiador.historicoSubs && apoiador.historicoSubs.length > 0) {
        mensagem += "Subs:\n" + apoiador.historicoSubs.slice(0, 20).map(d => {
            let descricao = d.valorAdicionado >= 0 ? `Doação de ${d.valorAdicionado} subs` : `Remoção de ${-d.valorAdicionado} subs`;
            return `${descricao} às ${d.horario} do dia ${new Date(d.dataHora).toLocaleDateString()}`;
        }).join("\n") + "\n";
        temDados = true;
    }

    // Se não houver dados, ajusta a mensagem para indicar que não há dados recentes
    if (!temDados) {
        mensagem += "Nenhum dado recente.";
    }

    alert(mensagem);
}




function adicionarDoacao() {
    let nome = document.getElementById("apoiador").value;
    let bits = parseInt(document.getElementById("bits").value) || 0;
    let pix = parseFloat(document.getElementById("pix").value) || 0;
    let subs = parseInt(document.getElementById("subs").value) || 0;
    let pontos = calcularPontos(bits, pix, subs);
    let horario = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let dataHora = new Date(); // Objeto de data completa

    let apoiador = apoiadores.find(apoiador => apoiador.nome === nome);
    if (apoiador) {
        apoiador.pontos += pontos;
        apoiador.bits += bits;
        apoiador.pix += pix;
        apoiador.subs += subs;
        
        // Atualizar registros das últimas doações com valor adicionado, horário e data
        if (bits > 0) {
            ultimosBits.unshift({ nome, valorAdicionado: bits, horario, dataHora });
            apoiador.historicoBits = apoiador.historicoBits || [];
            apoiador.historicoBits.unshift({ valorAdicionado: bits, horario, dataHora });
            if (ultimosBits.length > 3) ultimosBits.pop();
            if (apoiador.historicoBits.length > 20) apoiador.historicoBits.pop();
        }
        if (pix > 0) {
            ultimosPix.unshift({ nome, valorAdicionado: pix, horario, dataHora });
            apoiador.historicoPix = apoiador.historicoPix || [];
            apoiador.historicoPix.unshift({ valorAdicionado: pix, horario, dataHora });
            if (ultimosPix.length > 3) ultimosPix.pop();
            if (apoiador.historicoPix.length > 20) apoiador.historicoPix.pop();
        }
        if (subs > 0) {
            ultimosSubs.unshift({ nome, valorAdicionado: subs, horario, dataHora });
            apoiador.historicoSubs = apoiador.historicoSubs || [];
            apoiador.historicoSubs.unshift({ valorAdicionado: subs, horario, dataHora });
            if (ultimosSubs.length > 3) ultimosSubs.pop();
            if (apoiador.historicoSubs.length > 20) apoiador.historicoSubs.pop();
        }
        
        atualizarUltimasDoacoes();
        atualizarListaApoiadores();
        adicionarAcao('doação', { nome: nome, pontos: pontos, bits: bits, pix: pix, subs: subs });
        atualizarPodio();
        limparCampos();
        exibirRanking();
        atualizarTotais();
    } else {
        alert("Selecione um apoiador válido!");
    }
}









function limparCampos() {
    document.getElementById("bits").value = '';
    document.getElementById("pix").value = '';
    document.getElementById("subs").value = '';
}

function exportarRanking() {
    let textoRanking = "Ranking Geral:\n\n";
    textoRanking += "Nome                         Pontos          Bits            PIX          Subs\n"; // Cabeçalho da tabela com espaçamento adequado

    // Encontrar o tamanho máximo de bits, pixs e subs para ajustar o espaçamento
    let maxBits = Math.max(...apoiadores.map(apoiador => apoiador.bits.toString().length));
    let maxPix = Math.max(...apoiadores.map(apoiador => apoiador.pix.toString().length));
    let maxSubs = Math.max(...apoiadores.map(apoiador => apoiador.subs.toString().length));
    let maxPontos = Math.max(...apoiadores.map(apoiador => apoiador.pontos.toFixed(2).toString().length));

    apoiadores.forEach((apoiador, index) => {
        let nomeFormatado = apoiador.nome.padEnd(23, " "); // Ajustando o espaçamento para 23 caracteres
        let numeroFormatado = (index + 1 < 10 ? " " : "") + (index + 1); // Adicionando um espaço extra antes dos números de 1 a 9
        let pontosFormatado = apoiador.pontos.toFixed(2).toString().padStart(maxPontos, " ").padEnd(maxPontos + 6, " "); // Ajustando o espaçamento entre pontos e bits
        let bitsFormatado = apoiador.bits.toString().padStart(maxBits, " ").padEnd(maxBits + 6, " "); // Ajustando o espaçamento entre bits e pixs
        let pixFormatado = apoiador.pix.toString().padStart(maxPix, " ").padEnd(maxPix + 6, " "); // Ajustando o espaçamento entre pixs e subs
        let subsFormatado = apoiador.subs.toString().padStart(maxSubs, " ");
        textoRanking += `${numeroFormatado}. ${nomeFormatado}   ${pontosFormatado}     ${bitsFormatado}      ${pixFormatado}      ${subsFormatado}\n`;
    });

    // Criar um elemento <a> para baixar o arquivo
    let link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(textoRanking);
    link.download = "ranking_geral.txt";
    link.style.display = "none";

    // Adicionar o elemento <a> ao corpo do documento e clicar nele para baixar o arquivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




function calcularPontos(bits, pix, subs) {
    let pontosBits = bits / 100;
    let pontosPix = pix / 5;
    return pontosBits + pontosPix + subs;
}

function exibirRanking() {
    apoiadores.sort((a, b) => b.pontos - a.pontos);
    let rankingBody = document.getElementById("ranking-body");
    rankingBody.innerHTML = "";
    if (apoiadores.length > 0) {
        document.getElementById("vazio").style.display = "none";
        apoiadores.forEach((apoiador, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${index + 1}</td><td contenteditable="true" onBlur="editarApoiador(this, 'nome', '${apoiador.nome}')">${apoiador.nome}</td><td contenteditable="true" onBlur="editarApoiador(this, 'pontos', '${apoiador.nome}')">${apoiador.pontos.toFixed(2)}</td><td contenteditable="true" onBlur="editarApoiador(this, 'bits', '${apoiador.nome}')">${apoiador.bits}</td><td contenteditable="true" onBlur="editarApoiador(this, 'pix', '${apoiador.nome}')">${apoiador.pix}</td><td contenteditable="true" onBlur="editarApoiador(this, 'subs', '${apoiador.nome}')">${apoiador.subs}</td><td><button onclick="deletarApoiador('${apoiador.nome}')">Deletar</button><button onclick="zerarApoiador('${apoiador.nome}')">Zerar</button><button onclick="atualizarApoiador('${apoiador.nome}')">Atualizar</button></td>`;
            rankingBody.appendChild(tr);
        });
    } else {
        document.getElementById("vazio").style.display = "block";
    }
    // Atualizar o seletor de apoiadores
    atualizarSelectApoiadores();
	atualizarRankingInterface();
}



function atualizarListaApoiadores() {
    exibirRanking();
}


function atualizarApoiador(nome) {
    if (historicoAcoes.length > 0) {
        let ultimaAcao = historicoAcoes.pop();
        if (ultimaAcao.tipo === "adicionar") {
            apoiadores = apoiadores.filter(apoiador => apoiador.nome !== ultimaAcao.dados.nome);
        } else if (ultimaAcao.tipo === "deletar") {
            apoiadores.push(ultimaAcao.dados);
        } else if (ultimaAcao.tipo === "editar") {
            let apoiador = apoiadores.find(apoiador => apoiador.nome === ultimaAcao.dados.nome);
            if (apoiador) {
                apoiador.pontos = ultimaAcao.dados.pontosAntigos;
            }
        }
		atualizarUltimasDoacoes();
        atualizarListaApoiadores();
        atualizarPodio();
		atualizarTotais(); // Atualiza os totais após uma doação ser adicionada
    } else {
        alert("Não há ações para atualizar!");
    }
}

function atualizarSelectApoiadores() {
    let selectApoiador = document.getElementById("apoiador");
    selectApoiador.innerHTML = "";
    // Adicionar a opção "Selecione um apoiador"
    let option = document.createElement("option");
    option.text = "Selecione um apoiador";
    selectApoiador.add(option);
    // Adicionar os apoiadores à lista
    apoiadores.forEach(apoiador => {
        let option = document.createElement("option");
        option.text = apoiador.nome;
        selectApoiador.add(option);
    });
}

function deletarApoiador(nome) {
    if (confirm(`Tem certeza que deseja deletar o apoiador ${nome}?`)) {
        let apoiadorRemovido = apoiadores.find(apoiador => apoiador.nome === nome);
        apoiadores = apoiadores.filter(apoiador => apoiador.nome !== nome);
        atualizarUltimasDoacoes();
        atualizarListaApoiadores();
        adicionarAcao('remover', { ...apoiadorRemovido });
        atualizarPodio();
        atualizarTotais();
        // Limpar os registros dos últimos doadores se o apoiador deletado estiver presente
        ultimosBits = ultimosBits.filter(e => e.nome !== nome);
        ultimosPix = ultimosPix.filter(e => e.nome !== nome);
        ultimosSubs = ultimosSubs.filter(e => e.nome !== nome);
        // Atualizar a exibição dos últimos doadores após a exclusão
        atualizarUltimasDoacoes();
    }
}

// Função para editar o apoiador e verificar se houve aumento para atualização dos últimos doadores
function editarApoiador(elemento, campo, nome) {
    let novoValor = parseFloat(elemento.innerText.trim());
    let apoiador = apoiadores.find(ap => ap.nome === nome);
    let valorAntigo = apoiador ? apoiador[campo] : 0; // Garante que valorAntigo tenha um valor válido caso apoiador seja encontrado

    if (!isNaN(novoValor) && apoiador) {
        if (novoValor !== valorAntigo) {
            apoiador[campo] = novoValor;
            let valorAdicionado = novoValor - valorAntigo; // Calcula a diferença adicionada
            let horario = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let dataHora = new Date(); // Objeto de data completa

            // Adiciona a ação no histórico para possível reversão
            adicionarAcao('editar', { nome, campo, valorAntigo, novoValor });

            let historicoCampo = `historico${campo.charAt(0).toUpperCase() + campo.slice(1)}`;
            apoiador[historicoCampo] = apoiador[historicoCampo] || [];
            apoiador[historicoCampo].unshift({
                valorAdicionado: valorAdicionado,
                horario,
                dataHora
            });

            // Limitar o histórico a 20 entradas
            if (apoiador[historicoCampo].length > 20) {
                apoiador[historicoCampo].pop();
            }

            // Atualiza os pontos do apoiador
            if (campo === 'bits' || campo === 'pix' || campo === 'subs') {
                let novosPontos = calcularPontos(apoiador.bits, apoiador.pix, apoiador.subs);
                apoiador.pontos = novosPontos;

                // Atualiza o valor dos pontos na interface
                elemento.parentNode.childNodes[2].innerText = novosPontos.toFixed(2);

                // Possivelmente, outras funções de atualização podem ser chamadas aqui, como atualizarUltimosDoadores
                if (valorAdicionado !== 0) {
                    atualizarUltimosDoadores(campo, nome, valorAdicionado, horario, dataHora);
                }
            }

            // Atualiza as visualizações
            atualizarUltimasDoacoes();
            atualizarPodio();
            atualizarListaApoiadores();
            atualizarTotais();
        }
    } else {
        // Restaura o valor antigo se o novo valor for inválido ou o apoiador não existir
        elemento.innerText = valorAntigo.toString();
        alert("Por favor, insira um valor numérico válido ou verifique o nome do apoiador.");
    }
}



function atualizarUltimosDoadores(campo, nome, valorAdicionado, horario, dataHora) {
    let lista;
    if (campo === 'bits') lista = ultimosBits;
    else if (campo === 'pix') lista = ultimosPix;
    else if (campo === 'subs') lista = ultimosSubs;

    // Se houver um incremento, adicione à lista
    if (valorAdicionado > 0) {
        lista.unshift({ nome, valorAdicionado, horario, dataHora });
        // Garantir que apenas os três mais recentes são mantidos
        if (lista.length > 3) {
            lista.splice(3);
        }
    } else if (valorAdicionado < 0) {
        // Encontrar o registro existente e ajustar o valor
        let registroExistente = lista.find(e => e.nome === nome);
        if (registroExistente) {
            registroExistente.valorAdicionado += valorAdicionado;
            // Se o valor total for zero ou negativo, remova da lista
            if (registroExistente.valorAdicionado <= 0) {
                lista = lista.filter(e => e.nome !== nome);
            }
        }
    }

    // Atualizar a lista global conforme o tipo de doação
    if (campo === 'bits') ultimosBits = lista;
    else if (campo === 'pix') ultimosPix = lista;
    else if (campo === 'subs') ultimosSubs = lista;

    // Atualiza a exibição dos últimos doadores
    atualizarUltimasDoacoes();
}


// Função para atualizar a exibição das últimas doações
function atualizarUltimasDoacoes() {
    // Atualiza a exibição dos últimos doadores de bits
    document.getElementById("ultimos-bits").textContent = ultimosBits.map(e => {
        return `${e.nome} (+${e.valorAdicionado} 💎 às ${e.horario}hrs)`;
    }).join(', ');

    // Atualiza a exibição dos últimos doadores de pix
    document.getElementById("ultimos-pix").textContent = ultimosPix.map(e => {
        return `${e.nome} (+${e.valorAdicionado} 💲 às ${e.horario}hrs)`;
    }).join(', ');

    // Atualiza a exibição dos últimos doadores de subs
    document.getElementById("ultimos-subs").textContent = ultimosSubs.map(e => {
        return `${e.nome} (+${e.valorAdicionado} ⭐ às ${e.horario}hrs)`;
    }).join(', ');
}



function zerarApoiador(nome) {
    let apoiador = apoiadores.find(apoiador => apoiador.nome === nome);
    if (apoiador) {
        let dadosAntigos = { ...apoiador };
        let horario = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let dataHora = new Date();

        // Registrar o zeramento no histórico
        ['Bits', 'Pix', 'Subs'].forEach(campo => {
            let historicoCampo = `historico${campo}`;
            if (apoiador[campo] > 0) {
                apoiador[historicoCampo].unshift({
                    valorAdicionado: -apoiador[campo], // Negativo para indicar remoção
                    horario,
                    dataHora
                });
                if (apoiador[historicoCampo].length > 20) apoiador[historicoCampo].pop();
            }
        });

        apoiador.bits = 0;
        apoiador.pix = 0;
        apoiador.subs = 0;
        apoiador.pontos = 0;

        atualizarUltimasDoacoes();
        atualizarListaApoiadores();
        adicionarAcao('zerar', { nome: nome, dadosAntigos });
        atualizarPodio();
        atualizarTotais();

        // Limpar os registros dos últimos doadores
        ultimosBits = ultimosBits.filter(e => e.nome !== nome);
        ultimosPix = ultimosPix.filter(e => e.nome !== nome);
        ultimosSubs = ultimosSubs.filter(e => e.nome !== nome);

        // Atualizar a exibição dos últimos doadores
        atualizarUltimasDoacoes();
    } else {
        alert("Apoiador não encontrado!");
    }
}




function exportarTabela() {
    let tabelaHTML = gerarTabelaHTML(); // Função para gerar a tabela formatada como HTML

    // Criar um elemento <a> para baixar o arquivo
    let link = document.createElement("a");
    link.href = "data:text/html;charset=utf-8," + encodeURIComponent(tabelaHTML);
    link.download = "tabela_ranking.html";
    link.style.display = "none";

    // Adicionar o elemento <a> ao corpo do documento e clicar nele para baixar o arquivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function gerarTabelaHTML() {
    let tabelaHTML = "<table border='1'>";
    tabelaHTML += "<tr><th>Posição</th><th>Nome</th><th>Pontos</th><th>Bits</th><th>PIX</th><th>Subs</th></tr>";
    
    // Iterar sobre os apoiadores para adicionar as linhas da tabela
    apoiadores.forEach((apoiador, index) => {
        tabelaHTML += `<tr><td>${index + 1}</td><td>${apoiador.nome}</td><td>${apoiador.pontos.toFixed(2)}</td><td>${apoiador.bits}</td><td>${apoiador.pix}</td><td>${apoiador.subs}</td></tr>`;
    });

    tabelaHTML += "</table>";
    return tabelaHTML;
}

function zerarTudo() {
    let dadosAntigos = apoiadores.map(apoiador => ({ ...apoiador }));
    apoiadores.forEach(apoiador => {
        apoiador.bits = 0;
        apoiador.pix = 0;
        apoiador.subs = 0;
        apoiador.pontos = 0;
    });
    atualizarUltimasDoacoes();
    atualizarListaApoiadores();
    adicionarAcao('zerarTudo', { dadosAntigos });
    atualizarPodio();
    atualizarTotais();
    // Limpar os registros dos últimos doadores após zerar tudo
    ultimosBits = [];
    ultimosPix = [];
    ultimosSubs = [];
    // Atualizar a exibição dos últimos doadores após zerar tudo
    atualizarUltimasDoacoes();
}

function salvarTabela() {
    let nomeArquivo = prompt("Digite o nome do arquivo para salvar:");
    if (nomeArquivo) {
        // Incluir as listas dos últimos doadores no objeto a ser salvo
        let dados = JSON.stringify({
            apoiadores,
            historicoAcoes,
            ultimosBits,
            ultimosPix,
            ultimosSubs
        });
        downloadArquivo(nomeArquivo + ".json", dados);
        alert("Tabela salva com sucesso!");
    }
}

function carregarTabela() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = function(event) {
        let arquivo = event.target.files[0];
        let leitor = new FileReader();
        leitor.onload = function() {
            try {
                let dados = JSON.parse(leitor.result);
                if (dados && dados.apoiadores && dados.historicoAcoes) {
                    apoiadores = dados.apoiadores;
                    historicoAcoes = dados.historicoAcoes;
                    // Restaurar os arrays dos últimos doadores
                    ultimosBits = dados.ultimosBits || [];
                    ultimosPix = dados.ultimosPix || [];
                    ultimosSubs = dados.ultimosSubs || [];

                    atualizarUltimasDoacoes();
                    atualizarListaApoiadores();
                    atualizarPodio();
                    atualizarTotais();
                    alert("Tabela carregada com sucesso!");
                } else {
                    alert("Arquivo inválido!");
                }
            } catch(e) {
                alert("Erro ao carregar o arquivo: " + e.message);
            }
        };
        leitor.readAsText(arquivo);
    };
    input.click();
}


function atualizarTabela() {
    if (historicoAcoes.length > 0) {
        let ultimaAcao = historicoAcoes.pop();
        if (ultimaAcao.tipo === "adicionar") {
            apoiadores = apoiadores.filter(apoiador => apoiador.nome !== ultimaAcao.dados.nome);
        } else if (ultimaAcao.tipo === "deletar") {
            apoiadores.push(ultimaAcao.dados);
        } else if (ultimaAcao.tipo === "editar") {
            let apoiador = apoiadores.find(apoiador => apoiador.nome === ultimaAcao.dados.nome);
            if (apoiador) {
                apoiador.pontos = ultimaAcao.dados.pontosAntigos;
            }
        }
		atualizarUltimasDoacoes();
        atualizarListaApoiadores();
        atualizarPodio();
		atualizarTotais(); // Atualiza os totais após uma doação ser adicionada
    } else {
        alert("Não há ações para atualizar!");
    }
}

function adicionarAcao(tipo, dados) {
    let acao = { tipo, dados };
    if (tipo === 'doação' || tipo === 'editar') {
        acao.ultimosBits = ultimosBits.slice();  // Copia o estado atual das listas
        acao.ultimosPix = ultimosPix.slice();
        acao.ultimosSubs = ultimosSubs.slice();
    }
    historicoAcoes.push(acao);
    if (historicoAcoes.length > 5) {
        historicoAcoes.shift(); // Limita o histórico às últimas 5 ações
    }
}

function desfazerUltimaAcao() {
    if (historicoAcoes.length === 0) {
        alert("Não há ações para desfazer!");
        return;
    }

    let ultimaAcao = historicoAcoes.pop();
    if (confirm(`Tem certeza que deseja desfazer a ação de ${ultimaAcao.tipo} para ${ultimaAcao.dados.nome || ''}?`)) {
        let apoiador = apoiadores.find(ap => ap.nome === ultimaAcao.dados.nome);
        if (!apoiador) return; // Se não encontrar o apoiador, saia da função

        switch (ultimaAcao.tipo) {
            case 'adicionar':
                apoiadores = apoiadores.filter(ap => ap.nome !== ultimaAcao.dados.nome);
				        atualizarUltimasDoacoes();
                break;
            case 'remover':
                apoiadores.push(ultimaAcao.dados);
				        atualizarUltimasDoacoes();
                break;
            case 'doação':
                apoiador.bits -= ultimaAcao.dados.bits;
                apoiador.pix -= ultimaAcao.dados.pix;
                apoiador.subs -= ultimaAcao.dados.subs;
                apoiador.pontos = calcularPontos(apoiador.bits, apoiador.pix, apoiador.subs);
                atualizarDoadoresList(ultimosBits, ultimaAcao.dados.nome, -ultimaAcao.dados.bits);
                atualizarDoadoresList(ultimosPix, ultimaAcao.dados.nome, -ultimaAcao.dados.pix);
                atualizarDoadoresList(ultimosSubs, ultimaAcao.dados.nome, -ultimaAcao.dados.subs);
				        atualizarUltimasDoacoes();
                break;
            case 'editar':
                apoiador[ultimaAcao.dados.campo] = ultimaAcao.dados.valorAntigo;
				        atualizarUltimasDoacoes();
                break;
        }
        atualizarUltimasDoacoes();
        atualizarListaApoiadores();
        atualizarTotais();
        atualizarPodio();
    }
	        atualizarUltimasDoacoes();
}

function atualizarDoadoresList(lista, nome, valor) {
    let found = lista.find(item => item.nome === nome);
    if (found) {
        found.valorAdicionado += valor;
        if (found.valorAdicionado <= 0) {
            lista.splice(lista.indexOf(found), 1);
        }
    }
    if (lista.length > 3) lista.length = 3; // Garante que a lista não exceda três entradas
}






function downloadArquivo(nome, conteudo) {
    let link = document.createElement("a");
    link.href = "data:text/json;charset=utf-8," + encodeURIComponent(conteudo);
    link.download = nome;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function atualizarPodio() {
    let primeiroNome = document.getElementById("primeiro-nome");
    let segundoNome = document.getElementById("segundo-nome");
    let terceiroNome = document.getElementById("terceiro-nome");
    let primeiro = apoiadores[0] ? apoiadores[0].nome : "Ninguém";
    let segundo = apoiadores[1] ? apoiadores[1].nome : "Ninguém";
    let terceiro = apoiadores[2] ? apoiadores[2].nome : "Ninguém";
    primeiroNome.textContent = primeiro;
    segundoNome.textContent = segundo;
    terceiroNome.textContent = terceiro;
}

// Inicializa a lista de apoiadores ao carregar a página
window.onload = function() {
    carregarTabela();
	atualizarUltimasDoacoes();
	atualizarTotais(); // Atualiza os totais após uma doação ser adicionada
};