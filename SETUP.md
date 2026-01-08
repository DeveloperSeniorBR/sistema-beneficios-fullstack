# 🛠️ Guia de Configuração do Ambiente Windows

## 📋 Pré-requisitos

### 1. Instalar Java 17

**Opção A - Via Chocolatey:**
```powershell
# Instalar Chocolatey (se não tiver)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar Java 17
choco install openjdk17 -y
```

**Opção B - Download Manual:**
1. Baixe: https://adoptium.net/temurin/releases/?version=17
2. Instale o executável
3. Adicione ao PATH: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\bin`

**Verificar instalação:**
```powershell
java -version
# Deve mostrar: openjdk version "17.x.x"
```

### 2. Instalar Maven

**Opção A - Via Chocolatey:**
```powershell
choco install maven -y
```

**Opção B - Download Manual:**
1. Baixe: https://maven.apache.org/download.cgi
2. Extraia para `C:\Program Files\Apache\maven`
3. Adicione ao PATH: `C:\Program Files\Apache\maven\bin`

**Verificar instalação:**
```powershell
mvn -version
# Deve mostrar: Apache Maven 3.x.x
```

### 3. Instalar Node.js

**Opção A - Via Chocolatey:**
```powershell
choco install nodejs-lts -y
```

**Opção B - Download Manual:**
1. Baixe: https://nodejs.org/en/download/
2. Instale o MSI (versão LTS 18.x ou 20.x)

**Verificar instalação:**
```powershell
node -v
npm -v
```

---

## 🚀 Executar o Projeto (Após instalar pré-requisitos)

### PowerShell (Windows)

Use os scripts `.ps1` fornecidos:

```powershell
# 1. Dar permissão de execução
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 2. Executar Backend
.\run-backend.ps1

# 3. Executar Frontend (em outro terminal)
.\run-frontend.ps1
```

### Ou manualmente:

**Backend:**
```powershell
cd backend-module
mvn clean package -DskipTests
mvn spring-boot:run
```

**Frontend:**
```powershell
cd frontend
npm install
npm start
```

---

## 🧪 Executar Testes

**Backend:**
```powershell
cd backend-module
mvn test                    # Testes unitários
mvn verify                  # Testes de integração
```

**Frontend:**
```powershell
cd frontend
npm test
```

---

## ⚠️ Solução de Problemas

### Erro: "mvn não é reconhecido"
- Maven não está instalado ou não está no PATH
- Solução: Siga os passos de instalação do Maven acima
- Verifique o PATH: `$env:PATH -split ';' | Select-String maven`

### Erro: "java não é reconhecido"
- Java não está instalado ou não está no PATH
- Solução: Siga os passos de instalação do Java acima
- Verifique: `java -version`

### Erro: "npm não é reconhecido"
- Node.js não está instalado
- Solução: Instale Node.js via download ou Chocolatey

### Erro: "O token '&&' não é válido"
- PowerShell não suporta `&&`
- Solução: Use `;` ou execute comandos separadamente:
  ```powershell
  npm install
  npm start
  ```

### Porta 8080 já está em uso
```powershell
# Encontrar processo usando porta 8080
netstat -ano | findstr :8080

# Matar processo (substitua PID)
taskkill /PID <número_do_pid> /F
```

---

## 🌐 URLs Importantes

Após executar os serviços:

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **H2 Console:** http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:beneficiodb`
  - Username: `sa`
  - Password: (deixe em branco)

---

## 📦 Build para Produção

**Backend:**
```powershell
cd backend-module
mvn clean package
# JAR gerado em: target/backend-module-0.0.1-SNAPSHOT.jar
java -jar target/backend-module-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```powershell
cd frontend
npm run build
# Arquivos gerados em: dist/beneficios-frontend/
```

---

## 🔄 Reiniciar do Zero

```powershell
# Limpar builds
cd backend-module
mvn clean

cd ../frontend
rm -r node_modules
rm package-lock.json
npm install
```
