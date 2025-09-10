document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("history");
  const commandInput = document.getElementById("command-input");
  const terminal = document.getElementById("terminal");
  const modalContainer = document.getElementById("modal-container");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  const commandHistory = [];

  const banner = `<div class="mb-2"><pre class="text-pink-400"></pre><p>Bem-vindo ao meu portfólio interativo.</p><p>Digite <span class="text-yellow-400">'help'</span> para ver os comandos.</p></div>`;
  historyContainer.innerHTML = banner;

  function openModal(title, content) {
    modalTitle.textContent = `[${title}]`;
    modalContent.innerHTML = content;
    modalContainer.classList.remove("hidden");
    modalContainer.classList.add("flex");
    commandInput.disabled = true;
  }

  function closeModal() {
    modalContainer.classList.add("hidden");
    modalContainer.classList.remove("flex");
    commandInput.disabled = false;
    commandInput.focus();
  }

  modalClose.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalContainer.classList.contains("hidden"))
      closeModal();
  });

  terminal.addEventListener("click", () => commandInput.focus());
  commandInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && !commandInput.disabled) {
      const commandLine = commandInput.value.trim();
      if (commandLine) {
        commandHistory.push(commandLine);
        const promptHTML = `<div class="flex"><span class="prompt-user">guest@portfolio</span><span class="text-gray-500 mx-1">:</span><span class="prompt-dir">~</span><span class="text-gray-500 mx-1">$</span><span class="ml-2">${commandLine}</span></div>`;
        historyContainer.innerHTML += promptHTML;
        await executeCommand(commandLine.toLowerCase());
      }
      commandInput.value = "";
      terminal.scrollTop = terminal.scrollHeight;
    }
  });

  const themes = {
    dracula: {
      "--bg-color": "#282a36",
      "--text-color": "#f8f8f2",
      "--prompt-user-color": "#50fa7b",
      "--prompt-dir-color": "#8be9fd",
      "--prompt-arrow-color": "#ff79c6",
      "--link-color": "#bd93f9",
      "--link-hover-color": "#ff79c6",
      "--header-bg": "#21222c",
      "--border-color": "#44475a",
      "--focused-border-color": "#6272a4",
    },
    nord: {
      "--bg-color": "#2e3440",
      "--text-color": "#d8dee9",
      "--prompt-user-color": "#a3be8c",
      "--prompt-dir-color": "#88c0d0",
      "--prompt-arrow-color": "#b48ead",
      "--link-color": "#81a1c1",
      "--link-hover-color": "#8fbcbb",
      "--header-bg": "#3b4252",
      "--border-color": "#4c566a",
      "--focused-border-color": "#5e81ac",
    },
    solarized: {
      "--bg-color": "#002b36",
      "--text-color": "#839496",
      "--prompt-user-color": "#859900",
      "--prompt-dir-color": "#268bd2",
      "--prompt-arrow-color": "#d33682",
      "--link-color": "#6c71c4",
      "--link-hover-color": "#cb4b16",
      "--header-bg": "#073642",
      "--border-color": "#586e75",
      "--focused-border-color": "#93a1a1",
    },
    gruvbox: {
      "--bg-color": "#282828",
      "--text-color": "#ebdbb2",
      "--prompt-user-color": "#b8bb26",
      "--prompt-dir-color": "#83a598",
      "--prompt-arrow-color": "#d65d0e",
      "--link-color": "#d3869b",
      "--link-hover-color": "#fabd2f",
      "--header-bg": "#1d2021",
      "--border-color": "#504945",
      "--focused-border-color": "#665c54",
    },
    catppuccin: {
      "--bg-color": "#1e1e2e",
      "--text-color": "#cdd6f4",
      "--prompt-user-color": "#a6e3a1",
      "--prompt-dir-color": "#89b4fa",
      "--prompt-arrow-color": "#f38ba8",
      "--link-color": "#cba6f7",
      "--link-hover-color": "#f5c2e7",
      "--header-bg": "#181825",
      "--border-color": "#45475a",
      "--focused-border-color": "#7f849c",
    },
    monokai: {
      "--bg-color": "#272822",
      "--text-color": "#f8f8f2",
      "--prompt-user-color": "#a6e22e",
      "--prompt-dir-color": "#66d9ef",
      "--prompt-arrow-color": "#f92672",
      "--link-color": "#ae81ff",
      "--link-hover-color": "#fd971f",
      "--header-bg": "#1e1f1a",
      "--border-color": "#75715e",
      "--focused-border-color": "#f92672",
    },
    one_dark_pro: {
      "--bg-color": "#282c34",
      "--text-color": "#abb2bf",
      "--prompt-user-color": "#98c379",
      "--prompt-dir-color": "#61afef",
      "--prompt-arrow-color": "#c678dd",
      "--link-color": "#d19a66",
      "--link-hover-color": "#e5c07b",
      "--header-bg": "#21252b",
      "--border-color": "#3a3f4b",
      "--focused-border-color": "#528bff",
    },
    tokyo_night: {
      "--bg-color": "#1a1b26",
      "--text-color": "#a9b1d6",
      "--prompt-user-color": "#73daca",
      "--prompt-dir-color": "#7aa2f7",
      "--prompt-arrow-color": "#bb9af7",
      "--link-color": "#f7768e",
      "--link-hover-color": "#ff9e64",
      "--header-bg": "#16161e",
      "--border-color": "#414868",
      "--focused-border-color": "#7aa2f7",
    },
    material_darker: {
      "--bg-color": "#212121",
      "--text-color": "#eeffff",
      "--prompt-user-color": "#c3e88d",
      "--prompt-dir-color": "#82aaff",
      "--prompt-arrow-color": "#f07178",
      "--link-color": "#c792ea",
      "--link-hover-color": "#ffcb6b",
      "--header-bg": "#2a2a2a",
      "--border-color": "#545454",
      "--focused-border-color": "#80cbc4",
    },
  };

  function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return false;
    for (const [key, value] of Object.entries(theme)) {
      document.documentElement.style.setProperty(key, value);
    }
    localStorage.setItem("terminalTheme", themeName);
    return true;
  }

  const savedTheme = localStorage.getItem("terminalTheme") || "dracula";
  applyTheme(savedTheme);

  async function executeCommand(commandLine) {
    const [command, ...args] = commandLine.split(" ");
    let output = "";

    switch (command) {
      case "about":
        openModal(
          "sobre mim",
          `
                <p>Hey yoo o/, seja bem-vindo(a)! Me chamo <strong>Douglas</strong> e é uma satisfação ter você por aqui ;)</p>
                <p>Sou dev apaixonado por tecnologia, sempre na correria pra aprender mais e criar coisas úteis e criativas.</p>
                <p>Trampo com <strong>Java, Spring Boot, Node.js, Python, Go</strong> e bancos como <strong>Oracle, PostgreSQL e MySQL</strong>.  
                Também curto brincar com <strong>Docker, APIs REST, JWT</strong> e modelagem de sistemas.</p>
                <p>Já fiz de tudo um pouco: desde <em>módulos robustos</em> até API's completas, explorando bastante a conexão entre front e back.</p>
                <p>No momento, tô focado em evoluir cada vez mais e deixar meus projetos falarem por mim ;)</p>
                <p>Fora do código, curto aprender coisas novas, encarar desafios e sempre dar meu toque pessoal no que faço.</p>
                `
        );

        return;
      case "skills":
        const skillsContent = `<h3 class="text-lg text-yellow-400 mb-2"><i class="fas fa-code mr-2"></i>Competências Técnicas:</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div><h4 class="prompt-dir">Linguagens:</h4><ul><li>- Java</li><li><li>- JavaScript</li><li>- Python</li><li>- Go</li></ul></div><div><h4 class="prompt-dir">Frontend:</h4><ul><li>- React(Básico)</li><li>- Vue(Básico)</li><li>- Angular(Básico)</li></ul></div><div><h4 class="prompt-dir">Backend:</h4><ul><li>- Node.js</li><li>- FastAPI</li><li>- Spring Boot</li><li>- Gin/Echo</li></ul></div><div><h4 class="prompt-dir">DevOps:</h4><ul><li>- Docker</li><li>- Git</li></ul></div></div>`;
        openModal("competências", skillsContent);
        return;
      case "socials":
        const socialsContent = `<h3 class="text-lg text-yellow-400 mb-2"><i class="fas fa-share-alt mr-2"></i>Redes Sociais:</h3><ul><li><i class="fab fa-github fa-fw mr-2"></i>GitHub: <a href="https://github.com/douglascunha1" target="_blank">github.com/douglascunha1</a></li><li><i class="fab fa-linkedin fa-fw mr-2"></i>LinkedIn: <a href="https://linkedin.com/in/dougcunha" target="_blank">linkedin.com/in/dougcunha</a></li></ul>`;
        openModal("social", socialsContent);
        return;
    }

    switch (command) {
      case "help":
        output = `<ul class="list-none">
                        <li><span class="text-yellow-400 w-24 inline-block">help</span>      Lista todos os comandos.</li>
                        <li><span class="text-yellow-400 w-24 inline-block">about</span>     Sobre mim (em nova janela).</li>
                        <li><span class="text-yellow-400 w-24 inline-block">skills</span>    Minhas competências (em nova janela).</li>
                        <li><span class="text-yellow-400 w-24 inline-block">socials</span>   Minhas redes sociais (em nova janela).</li>
                        <li><span class="text-yellow-400 w-24 inline-block">github</span>    Busca meus 5 repositórios mais recentes.</li>
                        <li><span class="text-yellow-400 w-24 inline-block">email</span>     Copia meu email para a área de transferência.</li>
                        <li><span class="text-yellow-400 w-24 inline-block">history</span>   Mostra o histórico de comandos.</li>
                        <li><span class="text-yellow-400 w-24 inline-block">motd</span>      Exibe uma mensagem do dia.</li>
                        <li><span class="text-yellow-400 w-24 inline-block">theme</span>     Altera o tema. Uso: theme [nome]</li>
                        <li><span class="text-yellow-400 w-24 inline-block">clear</span>     Limpa o terminal.</li>
                    </ul>`;
        break;
      case "github":
        output = "Buscando repositórios no GitHub...";
        try {
          const response = await fetch(
            "https://api.github.com/users/douglascunha1/repos"
          );
          if (!response.ok) {
            throw new Error("Usuário não encontrado ou falha na API");
          }
          const repos = await response.json();
          let reposHTML =
            '<h3 class="text-lg text-yellow-400 mb-2"><i class="fab fa-github mr-2"></i>Repositórios Recentes:</h3><ul>';
          repos.forEach((repo) => {
            reposHTML += `<li class="mb-1"><a href="${
              repo.html_url
            }" target="_blank">${repo.name}</a> - <span class="text-gray-400">${
              repo.description || "Sem descrição."
            } (⭐ ${repo.stargazers_count})</span></li>`;
          });
          reposHTML += "</ul>";
          output = reposHTML;
        } catch (error) {
          output = `<p class="text-red-500">Erro ao buscar repositórios: ${error.message}</p>`;
        }
        break;
      case "history":
        output = commandHistory
          .map(
            (cmd, i) =>
              `<div><span class="w-6 inline-block text-gray-500">${
                i + 1
              }</span>${cmd}</div>`
          )
          .join("");
        break;
      case "email":
        try {
          await navigator.clipboard.writeText(
            "contact.dougcunha.dev@gmail.com"
          );
          output = `<p>Email <span class="text-yellow-400">contact.dougcunha.dev@gmail.com</span> copiado para a área de transferência!</p>`;
        } catch (err) {
          output = `<p class="text-red-500">Falha ao copiar o email. Use Ctrl+C.</p>`;
        }
        break;
      case "motd":
        output = "Buscando uma citação inspiradora...";
        try {
          const response = await fetch("https://dummyjson.com/quotes/random");
          if (!response.ok) throw new Error("Falha na resposta da API");
          const data = await response.json();
          output = `<div class="italic"><p>"${data.quote}"</p><p class="text-right text-yellow-400">- ${data.author}</p></div>`;
        } catch (error) {
          output = `<p class="text-red-500">Não foi possível carregar uma citação no momento.</p>`;
        }
        break;
      case "sudo":
        output = `<p class="text-red-500">User not in the sudoers file. This incident will be reported.</p>`;
        break;
      case "clear":
        historyContainer.innerHTML = "";
        return;
      case "banner":
        historyContainer.innerHTML += banner;
        return;
      case "theme":
        const themeName = args[0];
        if (!themeName) {
          output = `Uso: theme [nome]. Temas disponíveis: <span class="text-yellow-400">${Object.keys(
            themes
          ).join(", ")}</span>`;
        } else if (applyTheme(themeName)) {
          output = `Tema alterado para <span class="text-yellow-400">${themeName}</span>.`;
        } else {
          output = `<span class="text-red-500">Erro:</span> tema '${themeName}' não encontrado.`;
        }
        break;
      default:
        output = `<p>Comando não encontrado: <span class="text-red-500">${command}</span>. Digite 'help'.</p>`;
    }
    historyContainer.innerHTML += `<div>${output}</div>`;
  }
});
