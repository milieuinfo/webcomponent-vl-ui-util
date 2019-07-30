FROM acd-docker.repository.milieuinfo.be/node:12

ARG VERSION
ARG REPO

COPY .npmrc /root/.npmrc
COPY .gitconfig /root/.gitconfig
COPY .git-credentials /root/.git-credentials

WORKDIR /home/node/

RUN git clone ${REPO} app

WORKDIR /home/node/app

# /etc/hosts aanpassing:
# de nieuwe npmrc heeft repository.milieuinfo.be in zijn non proxy hosts staan
# vermits dat een host is die op internet is ontsloten en we willen vermijden 
# dat alle builds via de forward proxy naar buiten moeten om dan terug naar 
# binnen te gaan hebben we artifactory via de loadbalancer aangeboden in het 
# VLAN van de bamboos maar vermits repository.milieuinfo.be verwijst naar een 
# extern ip en niet naar het interne LB adres moeten we het in /etc/hosts zetten
# natuurlijk als je met docker werkt zal dat niet werken want die heeft 
# zijn eigen etc hosts dus als je het wil laten werken moet je die zelf aanmaken

RUN echo '10.48.0.203 repository.milieuinfo.be' >> /etc/hosts \
    && npm install \
    && npm run release:prepare \
    && npm run release:testless -- ${VERSION}
