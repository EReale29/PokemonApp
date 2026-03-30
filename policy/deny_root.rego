package main

violation contains msg if {
    input.kind == "Deployment"
    input.spec.template.spec.securityContext.runAsUser == 0
    msg = "Le pod tourne en root, déploiement refusé"
}
