FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
RUN echo "$(date +%Y-%m-%d:%H:%M:%S) Dotnet Version: $(dotnet --version)"

# NodeJs Required to build the Aurelia ClientApp
RUN echo "Installing NodeJS.."
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

# Update NPM
RUN echo "Installing Latest NPM"
RUN npm install npm@latest -g
RUN echo "NPM Version: $(npm -v)"

# Aurelia CLI Required to build the Aurelia ClientApp
RUN echo "Installing Aurelia CLI"
RUN npm install aurelia-cli -g
RUN echo "Aurelia CLI Version: $(au -v)"

COPY Hahn.ApplicatonProcess.February2021.Web.csproj asset-spa/
RUN dotnet restore asset-spa/Hahn.ApplicatonProcess.February2021.Web.csproj
WORKDIR /src/asset-spa
COPY . .
RUN dotnet build Hahn.ApplicatonProcess.February2021.Web.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish Hahn.ApplicatonProcess.February2021.Web.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Hahn.ApplicatonProcess.February2021.Web.dll"]

